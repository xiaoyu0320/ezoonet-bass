<template>
  <div class="home">
    <header>
     <van-search
        model="keywords"
        placeholder="请输入搜索关键词"
        use-action-slot
        @change="Search"
      >
        <view slot="action" @click="onSearch">搜索</view>
      </van-search>
    </header>

    <van-tabs :active="active" @change="onChange">
      <van-tab :title="menus.name" :name="menus.id" v-for="(menus,j) in menu" :key="j"></van-tab>
    </van-tabs>
    <fliter @changetype="changetype" :diareset="diareset" ref=""></fliter>
    <div class="shop-box" v-for="(item,index) in goodsList" :key="index">
      <div class="shop-item" @click="godetail(item.id)">
        <!-- <div class="title">{{item.shop_name}}</div> -->
         <div class="title">{{item.title}}</div>
        <div class="price">
          
           <div class="s-t">￥{{item.sale_price}}<span style="font-size:20rpx">起</span></div>
            <div class="s-p">￥{{item.market_price}}</div>
        </div>
        <div class="img-list">
           <div class="img-box" v-for="(item,i) in goodsList[index].all_img" :key="i">
              <img :src="item.original_pic" @click.stop="previewImg(goodsList[index].all_img,i)" mode="widthFix" >
           </div>
        </div>
      </div>
      <div class="opeate">
         <div class="share">
            <van-icon name="share" />&nbsp;分享 赚{{item.commission}}
         </div>
         <div class="car" @click="buy(item.id)"><van-icon name="cart" color="#fff"/>&nbsp;购买</div>
      </div> 
    </div>
    <div v-show="logStatus === 2" style="text-align:center;color:#999;padding:20rpx;font-size:28rpx">
        已经到底了
    </div>
    <div class="empty" v-show="logStatus === 1">
        <img src="/static/images/empty/shop.png" >
        <p>没有更多商品了~</p>
    </div>
    <van-popup :show="show" @close="onClose"  position="bottom"  custom-style="height: 80%">
       <home-detail me-detail @callback="reject" :shopId="shopId" :id="id"  @images="images" :page="page" :goods="goodsDetail" v-if="goodsDetail"  @touchmove.stop.prevent="moveHandle"></home-detail>
    </van-popup>
     <van-popup
        :show="shareshow"
        position="bottom"
        custom-style="height: 100%;"
       @close="shareClose"
        />   
     <van-toast id="van-toast" />
      <van-dialog id="van-dialog" />
  </div>
  
</template>
<script>
// import { getGoods, getTabList } from '@/api/api'
import Toast from '@/../static/vant/toast/toast'
import HomeDetail from '@/components/home-detail'
import fliter from '@/components/fliter/fliter'
import ShopBill from '@/components/fliter/fliter'
export default {
  name: 'home',
  data () {
    return {
      page: 1,
      keywords: '',
      goodsList: [],
      goodsDetail: {},
      shopId: '',
      show: false,
      id: '',
      nodata: false,
      logStatus: 0,
      menu: [],
      active: '0', // 分组类型
      type: 0, // 排序,
      diareset: 0,
      shareshow:false,
    }
  },
  methods: {
    shareClose(){
    this.shareshow = false
    },
    changetype (val) {
      this.type = val
      this.reset()
    },
    onChange (val) {
      this.active = val.mp.detail.name
      this.reset()
    },
    reject (val) {
      this.show = val
    },
    previewImg (arr, index) {
      // wx.previewImage的urls必须是数组的形式，所以用下面的方法先转换为数组
      var jsonText = new Array(arr[index].original_pic)
      // 最主要就是调用这个
      wx.previewImage({
        current: arr[index].original_pic,
        urls: jsonText
      })
    },
    onClose () {
      this.show = false
    },
    godetail (id) {
      const url = '../detail/main?id=' + id
      mpvue.navigateTo({ url })
    },
    // 侧边栏
    buy (id) {
      // this.show = true
      this.id = id
      this.$http.post({
        url: 'shop/goods/goodsSpecs',
        data: {
          'id': id,
          'shop_id': this.shopId
        }
      }).then(res => {
        if (res.code === 200) {
          this.goodsDetail = res.data
          this.show = true
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    onSearch () {
      this.page = 1
      this.goodsList = []
      this._getGoods()
    },
    Search (val) {
      this.keywords = val.mp.detail
      if (!this.keywords || this.keywords === '') {
        this.nodata = false
        this.onSearch()
      }
    },
    _getGoods () {
      // 设置停止滚动加载开关
      if (this.nodata === true) {
        return false
      }
      let obj = {}
      obj.page = this.page
      if (this.keywords) {
        obj.keyword = this.keywords
      }
      obj.group_id = this.active
      obj.order = this.type
      this.$http.post({
        url: 'shop/goods/goodsList',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          if (this.page === 1 && res.data.count <= 0) {
            this.logStatus = 1
          }
          if (res.data.count > this.goodsList.length) {
            this.goodsList = this.goodsList.concat(res.data.list)
            this.page = this.page + 1
          }
          if (res.data.page_count < this.page) {
            this.nodata = true
            this.logStatus = 2
          }
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    reset () {
      this.show = false
      this.nodata = false
      this.page = 1
      this.keywords = ''
      this.goodsList = []
      this._getGoods()
    },
    getmenu () {
      this.$http.post({
        url: 'shop/goods/goodsGroupList',
        data: {}
      }).then(res => {
        this.menu = res.data.list
        this.menu.unshift({
          name: '全部',
          id: '0'
        })
      })
    }
  },
  onReachBottom () {
    this._getGoods()
  },
  onPullDownRefresh () {
    this.reset()
    setTimeout(function () {
      wx.hideNavigationBarLoading() // 完成停止加载
      wx.stopPullDownRefresh() // 停止下拉刷新
    }, 1000) // 毫秒设置延迟
  },
  onShow () {
    this.active = '0'
    this.type = 0
    this.diareset = 1
    this.reset()
    this.getmenu()
  },
  components: {
    HomeDetail,
    fliter,
    ShopBill
  }

}
</script>
<style lang="scss" scoped>
  .van-button.active{
    color: #f1484e !important;
    border: 1px solid #f1484e !important;
  }
  .home{
    display: flex;
    flex-direction: column;
    min-height: 100%;
    box-sizing: border-box;
    background: #f7f8fa;
    .sidebar{
      .active{
        background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000) !important;
        background-blend-mode: normal, normal;
      }
      .bar{
        padding: 11px 0;
        margin: 29px 0;
        background: #999999;
        border-radius: 14px;
        color: #ffffff;
        font-size: 15px;
        .van-cell__right-icon{
          color: #ffffff !important;
        }
        span{
          margin-left: 10px;
        }
      }
      .bar::after{
        content: ' ';
        border: 0 !important;
      }
    }
    .shop-box {
      padding:30rpx;
      background: #fff;
      margin-bottom: 20rpx;
      .title {
        font-size: 30rpx;
        padding-bottom: 20rpx;
        color: #333;
      }
      .price {
        font-family: 'DIN-Bold';
        display:flex;
        align-items: flex-end;
        margin-bottom: 20rpx;
        .s-p {
          color: #999;
          font-size: 24rpx;
          text-decoration:line-through;
        }
        .s-t {
          color: #e51c23;
          font-size: 40rpx;
          margin-right: 10rpx;
        }
      }
      .img-list {
        display: flex;
        flex-wrap: wrap;
        .img-box {
          width: 33.3333333%;
          img {
            max-width: 200rpx;
            max-height: 200rpx;
          }
        }
      }
      .opeate {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20rpx;
        border-top:1px solid #eee;
        padding-top: 20rpx;
        div{
          display: flex;
          align-items: center;
          font-size: 28rpx;
          color: #292c34;
        }
        .car {
          width: 243rpx;
          height: 63rpx;
          background-color: #ec1f23;
          border-radius: 32rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
      }
    }
   
  }
</style>

<template>
  <div class='paylist'>
    <!-- 地址 -->
    <div class="address" @click="enterAddress">
      <van-cell-group v-if="!showAddress">
        <van-cell  size="19px" icon="location-o" is-link>
          <view slot="title">
            <span class="van-cell-text">请选择收货地址</span>
          </view>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell style="align-items: center;" size="19px" is-link v-if="address">
         <view slot="title">
            <div style="color: #333333;font-size:19px;">
              <label style="margin-right:10px">{{address.name}}</label>
              <span>{{address.mobile}}</span>
            </div>
            <div style="color: #666666;font-size:12px;">{{address.province + address.city + address.county + address.address}}</div>
          </view>
        </van-cell>
      </van-cell-group>
      <img src="/static/images/bar@2x.png" mode="aspectFill" style="width:100%;height:9rpx">
    </div>
    <div class="goods-cart" >
      <van-cell-group   v-for="(item,index) in goods" :key="index" style="margin-bottom:10px;">
        <!--商品标题-->
        <van-cell  style="display:inline-flex;flex-direction:row;">
          <view slot="title">
            <span class="van-cell-text" style="display: flex;align-items: center;">
              <van-icon name="shop-o" style="margin-right: 5px;"  width="20" />
              <label>{{item.shop_name}}</label>
            </span>
          </view>
        </van-cell>
        <!--内容模块-->
        <div class="content" v-for="(item2,index2) in item.list" :key="index2">
          <van-card
            style="background: #fff;"
            :num="item2.qty"
            :price="item2.sale_price"
            :title="item2.goods_title"
            :thumb="item2.img_list[0]"
          >
            <div class="tags" slot="tags">
              <label class="specs" v-for="(spec,i) in item2.spec_name" :key="i">{{spec}}</label>
            </div>
          </van-card>
        </div>
        <!--运费模块-->
        <van-cell icon="logistics" class="express" >
          <view slot="title">
            <div style="justify-content: space-between;display: flex;">
              <span class="van-cell-text">运费</span>
              <span style="text-align:right;">{{item.freight ==0 ?'包邮' :'￥' + item.freight}}</span>
            </div>
          </view>
        </van-cell>
      
        <!--备注模块-->
         <van-field
         v-model="item.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注"
          autosize
          :border="false"
           input-align="right"
           @change="rechange"
           @click="getindex(index)"
        />
      </van-cell-group>
        <van-cell title="应付款" :value="total_Money" size="large" />
    </div>
     <van-button class="but" type="danger" @click="payment" size="large" >提交订单</van-button>
     <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    // 这里存放数据
    return {
      address_id: '',
      showAddress: false,
      goods: [],
      cart_id: '',
      allPrice: '',
      address: {},
      jsonstr: '',
      ind: '',
      total_Money: '',
      id: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {
    // ...mapGetters([
    //   'userinfo'
    // ])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    onPullDownRefresh () {
      console.log('正在下拉刷新')
    },
    // 运费
    getindex (index) {
      this.ind = index
    },
    rechange (e) {
      this.goods[this.ind].remark = e.mp.detail
    },
    freight () {
      let price = 0.00
      this.goods.forEach((shop, shopindex) => {
        price += (Number(shop.price))
      })
      return price
    },
    // 金额
    price () {
      let price = 0.00
      this.goods.forEach((shop, shopindex) => {
        shop.tmp.forEach((item, index) => {
          price += ((item.level_price ? Number(item.level_price) : Number(item.sale_price)) * item.qty)
        })
      })
      return price
    },
    payment () { // 跳转至支付页
      if (!this.showAddress) {
        Toast.fail('请先选择收货地址')
        return
      }
      let obj1 = {}
      for (let i = 0; i < this.goods.length; i++) {
        let key = this.goods[i].shop_id
        let value = this.goods[i].remark
        obj1[key] = value
      }
      let obj = {}
      obj.data = this.jsonstr
      obj.addr_id = this.address.id
      obj.remark = JSON.stringify(obj1)
      this.$http.post({
        url: 'shop/Order/create',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          mpvue.navigateTo({ url: '../pay/main?porder_no=' + res.data.porder_no + '&money=' + res.data.total_amount + '&addresssId=' + this.id + '&balance=' + res.data.balance })
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    getAddressDetail () {
      var that = this
      this.$http.post({
        url: 'shop/address/edit',
        data: {
          'id': this.id
        }
      }).then(res => {
        that.showAddress = true
        that.address = res.data
      })
    },
    getAddress () {
      // this.address_id = Number(localStorage['chosenAddressId'])
      // localStorage.removeItem('chosenAddressId')
      this.getAddressDetail()
    },

    enterAddress () {
      mpvue.navigateTo({ url: '../address/main?json=' + this.jsonstr + '&type=0' })
    },
    back () {
      this.$router.back()
    },
    getlist () {
      let that = this
      let obj = {}
      obj.data = this.jsonstr
      if (this.id) {
        obj.addr_id = this.id
      }
      this.$http.post({
        url: 'shop/Order/confirm',
        data: {
          'data': this.jsonstr,
          'addr_id': this.id
        }
      }).then(res => {
        that.goods = res.data.list
        that.total_Money = '￥' + res.data.total_amount
        if (res.data.addr.mobile) {
          this.showAddress = true
          this.address = res.data.addr
        }
        that.goods.map((data, index) => {
          data.remark = ''
        })
      })
    },
    changeParentData: function () {
      // eslint-disable-next-line no-undef
      var pages = getCurrentPages()// 当前页面栈
      if (pages.length > 1) {
        var beforePage = pages[pages.length - 2]// 获取上一个页面实例对象
        beforePage.changeData()// 触发父页面中的方法
      }
    }
  },
  onLoad (options) {
    this.jsonstr = options.json
    this.getlist()
    var that = this
    if (Number(options.linktype) === 1) {
      wx.getStorage({
        key: 'chosenAddressId',
        success (res) {
          that.id = res.data
          that.getAddress()
        }
      })
    }
    // var that = this
    // wx.getStorage({
    //   key: 'chosenAddressId',
    //   success (res) {
    //     that.id = res.data
    //     that.getAddress(res.data)
    //     that.getlist(res.data)
    //   }
    // })
  },

  onUnload () {
    wx.removeStorageSync('chosenAddressId')
    // this.changeParentData()
  }

}
</script>
<style lang="scss" scoped>
  .paylist{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    .paymentBack.van-icon{
      transform: rotate(180deg);
      color: #323232 !important;
    }
    .address{
      // background: url('/images/home/jianbian@2x.png')center center;
      background-size: cover ;
      background-color: #fff;
      text-align: left;
      display: flex;
      flex-direction: column;
      .van-cell-group{
        background-color: transparent;
        .van-cell{
          padding: 20px 15px !important;
          color: #333333;
          font-size: 19px;
          background-color: transparent;
        }
      }
      [class*=van-hairline]::after{
        border: none;
      }
    }
    .goods-cart{
      flex: 1;
      overflow-y: auto;
      text-align: left;
      padding-bottom: 100rpx;
      .content{
        .tags{
          margin-top: 5px;
          .specs{
            background: #f2f2f2;
            border-radius: 4px;
            padding: 3px 5px;
            display: inline-block;
            margin-right: 5px;
            font-size: 12px;
          }
        }
      }
    }
    .but{
      position: fixed;
      bottom: 0;
      width: 100%;
      background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
      background-blend-mode: normal,normal;
    }
  }
</style>

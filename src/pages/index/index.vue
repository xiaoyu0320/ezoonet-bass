<template>
  <div class="index">
     <div class="index-swiper">
        <swiper class="swiper" indicator-active-color="#fff" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
          <block v-for="(item, index) in movies" :key="index" >
              <swiper-item>
                  <image :src="item" class="slide-image" mode="aspectFill" />
              </swiper-item>
          </block>
      </swiper>

     </div>
     <div class="index-menu">
        <van-grid column-num="5" :border="false">
          <van-grid-item use-slot  v-for="(item, index) in menu"  :key="index">
              <img :src="item.icoin" >
               <p>{{item.name}}</p>
          </van-grid-item>
        </van-grid>
     </div>
     <div class="index-magic">
       
        <div class="index-left">
            <div class="title" style="background-image: url('/static/images/index/bg.png')">今日好货</div>
            <div class="info">年中大促狂嗨</div>
            <img src="/static/images/index/left1.png">
        </div>
        <div class="index-right">
           <div class="index-item">
                <div class="content">
                   <div class="title">商城精选</div>
                   <div class="info">大牌折上折</div>
                   <img src="/static/images/index/right1.png" >
                </div>
           </div>
           <div class="index-item" style="margin-top:10rpx">
                <div class="content">
                   <div class="title">商城精选</div>
                   <div class="info">大牌折上折</div>
                   <img src="/static/images/index/right2.png" style="width: 118rpx; height: 138rpx;">
                </div>
           </div>
        </div>
     </div>
     <div class="index-container">
        <div class="title">
           <div class="line left"></div>
              热卖好货
            <div class="line right"></div> 
        </div>
         <van-grid column-num="2" :border="false">
          <van-grid-item use-slot  v-for="(item,i) in list" :key="i">
              <div class="box" @click="godetail(item.id)">
                 <div class="img-box" :style="{ 'background-image': 'url(' + item.primary_img.original_pic + ')' }"></div>
                 <div class="img-info">
                    <div class="title-s">
                       {{item.title}}
                    </div>
                    <div class="title-ss">
                       {{item.simple_desc ? item.simple_desc:'暂无描述'}}
                    </div>
                    <div class="s-price">
                      <span class="line">￥{{item.market_price}}</span>
                      <span>已售{{item.sales}}</span>
                    </div>
                    <div class="price">
                       <span class="s1">￥{{item.sale_price}}</span>
                       <span class="s2">马上抢</span>
                    </div>
                 </div>
              </div>  
          </van-grid-item>
          
        </van-grid>
        <div v-show="logStatus === 2" style="text-align:center;color:#999;padding:20rpx;font-size:28rpx">
           已经到底了
        </div>
        <div class="empty" v-show="logStatus === 1">
            <img src="/static/images/empty/shop.png" >
            <p>没有更多商品了~</p>
        </div>
          <van-toast id="van-toast" />
     </div>
  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    return {
      movies: [],
      menu: [{
        name: '优惠券',
        url: require('@/../static/images/index/m1.png')

      }, {
        name: '休闲食品',
        url: require('@/../static/images/index/m2.png')
      },
      {
        name: '居家生活',
        url: require('@/../static/images/index/m3.png')
      },
      {
        name: '粮油调味',
        url: require('@/../static/images/index/m4.png')
      }
      ],
      list: [],
      page: 1,
      nodata: false,
      logStatus: 0,
      shopId: ''

    }
  },

  components: {

  },

  methods: {
    getbanner () {
      this.$http.post({
        url: 'shop/index/banner',
        data: {}
      }).then(res => {
        this.movies = res.data
      })
    },
    godetail (id) {
      mpvue.navigateTo({ url: '../detail/main?id=' + id })
    },
    getmenu () {
      this.$http.post({
        url: 'shop/index/goodsGroupList',
        data: {}
      }).then(res => {
        if (res.code === 200) {
          this.menu = res.data.list
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    // 获取店铺信息

    getlist () {
      // 设置停止滚动加载开关
      if (this.nodata === true) {
        return false
      }
      this.$http.post({
        url: 'shop/index/getHomeGoodsList',
        data: {
          'page': this.page,
          'shop_id': this.shopId
        }
      }).then(res => {
        if (res.code === 200) {
          if (this.page === 1 && res.data.count <= 0) {
            this.logStatus = 1
          }
          if (res.data.count > this.list.length) {
            this.list = this.list.concat(res.data.list)
            this.page = this.page + 1
          }
          if (res.data.page_count < this.page) {
            this.nodata = true
            this.logStatus = 2
          }
        }
      })
    },
    onScroll () {
      this.getlist()
    }
  },
  onReachBottom () {
    this.onScroll()
  },
  onPullDownRefresh () {
    this.getlist()
    setTimeout(function () {
      wx.hideNavigationBarLoading() // 完成停止加载
      wx.stopPullDownRefresh() // 停止下拉刷新
    }, 1000) // 毫秒设置延迟
  },
  onReady () {
    this.getmenu()
    this.getlist()
    this.getbanner()
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
   .index {
     min-height: 100%;
     background: #f6f7f8;
     .index-menu {
       margin:20rpx;
       border-radius: 8rpx;
       img {
         width: 92rpx;
         height: 95rpx;
         border-radius: 50%;
       }
       p{
         font-size: 24rpx;
         margin-top:20rpx
       }
     }
     .index-magic {
       display: flex;
       justify-content: space-between;
         margin: 0 20rpx;
        .index-left {
          width: 350rpx;
          padding: 30rpx;
          box-sizing: border-box;
          background-image: linear-gradient(90deg, 
              #fffdf9 0%, 
              #fffaf0 100%), 
            linear-gradient(
              #ffffff, 
              #ffffff);
            background-blend-mode: normal, 
              normal;
            box-shadow: 0px 6px 29px 0px 
              rgba(236, 240, 243, 0.94);
            border-radius: 4px;
          .title {
            background-repeat: no-repeat;
            background-size: contain;
            width: 163rpx;
            height: 44rpx;
            text-align: center;
            color: #fff;
            font-size: 28rpx;
            line-height: 44rpx;
          }
          img {
            display: block;
            margin: 0 auto;
            width:237rpx;
            height:172rpx
          }
          .info {
            color: #f7a14d;
            font-size: 24rpx;
            margin:20rpx 0
          }
        }
        .index-right{
          width: 350rpx;
          .content {
            background-image: linear-gradient(90deg, 
              #fffbfb 0%, 
              #fff9f9 50%, 
              #fff6f7 100%), 
            linear-gradient(
              #ffffff, 
              #ffffff);
              background-blend-mode: normal, 
                normal;
              box-shadow: 0px 6px 29px 0px 
                rgba(236, 240, 243, 0.94);
              border-radius: 4px;
              height: 171rpx;
              position: relative;
              padding: 30rpx;
              box-sizing: border-box;
          }
          .title {
            font-size: 32rpx;
            color: #2c2c2c;
            margin-bottom: 20rpx;
          }
          .info {
            font-size: 24rpx;
            color: #f76a6c;
          }
          img {
             width:155rpx;
             height:98rpx;
             position: absolute;
             bottom: 0;
             right: 0;
          }
        }
     }
     .index-container{
       margin:20rpx;
       .title {
         color: #292c34;
         font-size: 32rpx;
         text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top:40rpx;
          font-family: PingFang-SC-Bold;
          margin-bottom: 40rpx;
         .left{
          display: block;
          width: 78rpx;
          height: 9rpx;
         	background-image: linear-gradient(-90deg, 
        #f76a6c 0%, 
        rgba(247, 106, 108, 0.51) 49%, 
        #ffffff 100%);
         margin-right: 20rpx;
         }
         .right{
          display: block;
          width: 78rpx;
          height: 9rpx;
          background-image: linear-gradient(90deg, 
        #f76a6c 0%, 
        rgba(247, 106, 108, 0.51) 49%, 
        #ffffff 100%);
           margin-left: 20rpx;
         }
       }
       .box {
         width: 100%;
          .img-box {
            height: 316rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #aebdc4;
            width:95%;
            background-size:cover;
            background-position: center;
          }
          .img-info {
            width: 95%;
            background: #fff;
            padding: 20rpx;
            box-sizing: border-box;
             .title-s {
              color: #292c34;
              font-size: 28rpx;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              }
              .title-ss {
                color: #a2a5af;
                font-size: 24rpx;
                margin:10rpx 0;
                height: 32rpx;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }  
             .s-price {
                color: #a2a5af;
                font-size: 24rpx;
                display: flex;
                justify-content: space-between;
                .line {
                   text-decoration:line-through
                }       
             } 
             .price {
                display: flex;
                justify-content: space-between;
                margin-top:10rpx;
               .s1 {
                  color: #ec1f23;
                  font-size: 32rpx;
               }
               .s2 {
                 width: 118rpx;
	               height: 41rpx; 
                 display: block;
                 background-color: #c2191c;
                 border-radius: 40rpx;
                 font-size: 24rpx;
                 color: #fff;
                 align-items: center;
                 justify-content: center;
                 text-align: center;
               }
             }
          }
       }
      
     }
   }
</style>
<style>
 .index swiper {
   height: 400rpx;
 }
 .index swiper-item {
   width: 100%;
   height: 400rpx;
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
 }
  .index swiper image {
    width: 100%;
  }
  .index .index-container .van-grid-item__content {
    background: none;
    padding:10rpx 0;
    justify-content: space-between;
  }
</style>


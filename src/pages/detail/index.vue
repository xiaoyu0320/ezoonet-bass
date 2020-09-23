<template>
  <div class="detail">
     <div class="swiper">
         <swiper class="swiper" indicator-active-color="#fff" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
            <block v-for="(item, index) in detail.img_list" :key="index" >
                <swiper-item>
                    <img :src="item" class="slide-image" mode="aspectFill" />
                </swiper-item>
            </block>
        </swiper>
     </div>
     <div class="box">
        <div class="info">
           <div class="price-box">
             <div class="price">
                ￥{{detail.sale_price}} <span>￥{{detail.market_price}} </span>
             </div>
             <div class="share">分享赚{{detail.commission}}</div>
           </div>
           <div class="title">
             {{detail.title}}
           </div>
           <div class="title-s">
              {{detail.simple_desc}}
           </div>
        </div>
        <div class="line"></div>
        <div class="choice">
           <van-cell-group>
            <!-- <van-cell title="运费  ￥15.00" value="已售3044" /> -->
            <van-cell @click="show=true"  is-link>
              <view slot="title" >
                <view class="van-cell-text">规格&nbsp;&nbsp;&nbsp;请选择</view>
              </view>
            </van-cell>
             <van-cell  is-link>
              <view slot="title">
                <view class="van-cell-text">服务&nbsp;&nbsp;&nbsp;{{servertype}}</view>
              </view>
            </van-cell>
          </van-cell-group>
        </div>
        <div class="detail-container">
           <h3>详情</h3>
               <!-- <div class="contert"  v-if="detail.content && detail.content!==null" v-html="detail.content"></div> -->
        </div>
     </div>
     <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" dot @click="gokefu" />
      <van-goods-action-icon icon="cart-o" text="购物车" @click="gocar" />
      <van-goods-action-icon icon="shop-o" text="店铺"  @click="gohome"/>
      <van-goods-action-button text="加入购物车" type="warning" @click="gobuy" />
      <!-- <van-goods-action-button text="立即购买" @click="gobuy"/> -->
    </van-goods-action>
        <van-popup :show="show" @close="onClose"  position="bottom"  custom-style="height: 70%"  >
        <home-detail  :shopId="shopId" :id="detail.id"  @images="images"  :goods="detail" v-if="detail" @paretmen="paretmen"></home-detail>
      </van-popup>
      <van-toast id="van-toast" />
  </div>
    
</template>
<script>

import Toast from '@/../static/vant/toast/toast'
import HomeDetail from '@/components/home-detail'
export default {
  name: 'home',
  data () {
    return {

      detail: {
        img_list: [],
        content: null
      },
      shopId: '',
      show: false,
      id: ''
    }
  },
  methods: {
    paretmen () {
      console.log('val')
    },
    gokefu () {
      Toast.fail('暂未开放')
    },
    getdetail () {
      this.$http.post({
        url: 'shop/goods/goodsDetail',
        data: {
          'id': this.id,
          'shop_id': this.shopId
        }
      }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    gocar () {
      wx.switchTab({url: `../car/main`})
    },
    gohome () {
      wx.switchTab({url: `../index/main`})
    },
    gobuy () {
      this.show = true
    },
    onClose () {
      this.show = false
    }
  },

  computed: {
    servertype () {
      if (this.detail.after_sale) {
        console.log(this.detail.after_sale)
        switch (Number(this.detail.after_sale)) {
          case 0 :
            return '不支持'
          case 1 :
            return '支持买家申请换货'
          case 2 :
            return '7天无理由退货'
          case 3 :
            return '支持买家申请退货'
        }
      }
    }
  },
  onLoad (options) {
    this.show = false
    this.id = options.id
    this.getdetail()
  },
  components: {
    HomeDetail
  }

}
</script>
<style lang="scss" scoped>
.detail {
  background: #f7f8fa;
  .swiper {
    img {
      width: 100%;
    }
  }
  .box {
    background: #fff;
    .info {
      padding:30rpx;
      position: relative;
      .price-box {
        display: flex;
        justify-content: space-between;
        .price {
          font-size: 36rpx;
          color: #ec1f23;
          font-weight: 600;
          span {
            font-size: 28rpx;
            color: #a2a5af;
            font-weight: normal;
            text-decoration: line-through;
          }
        }
        .share {
          width: 203rpx;
          height: 62rpx;
          background-color: #fbc466;
          font-size: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border-radius:31rpx 0  0  31rpx;
          position: absolute;
          right: 0;
        }
      }
      .title {
        font-size: 34rpx;
        color: #292c34;
        margin-top:30rpx
      }
      .title-s {
        font-size: 30rpx;
        color: #292c34;
        margin-top:20rpx
      }
    }
    .line {
      width: 100%;
      height: 20rpx;
      background-color: #f7f8fa;
    }
  }
  .detail-container {
    h3{
        padding: 30rpx;
        font-size: 28rpx;
        color: #000;
        position: relative;
        padding-left: 50rpx;
        &::before {
          display: block;
          content: '';
          position: absolute;
          width: 6rpx;
          height: 26rpx;
          background: #ec1f23;
          left:30rpx;
          top: 50%;
          margin-top: -13rpx;
        }
    }
   
  }
  
}
</style>
<style>
 .detail swiper {
   height: 400rpx;
 }
.detail swiper-item {
   width: 100%;
   height: 400rpx;
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
 }
  .detail swiper image {
    width: 100%;
  }
  .detail .index-container .van-grid-item__content {
    background: none;
    padding:10rpx 0;
    justify-content: space-between;
  }
</style>


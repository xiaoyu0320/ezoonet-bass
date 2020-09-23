<!-- 我的订单 -->
<template>
<div class='order'>
   <van-tabs  @change="handleTabClick" :swipeThreshold="8" :active="active" sticky :border="false">
       
        <van-tab title="全部" name="-1"></van-tab>
        <van-tab title="待付款" name="0"></van-tab>
        <van-tab title="待发货" name="1"></van-tab>
        <van-tab title="待收货" name="2"></van-tab>
        <van-tab title="已完成" name="3"></van-tab>
    </van-tabs>
  <div class="order-form-item" v-if="orderList.length>0">
        <div v-for="(item,index) in orderList" :key="index" class="item" >
          <!-- 订单标题 -->
            <van-cell-group class="order-title" :border="false">
              <van-cell :title=" '订单号:' +  item.porder_no" :value="item.status_name" size="large" />
              <!-- 商品详情 -->
              <van-card
                v-for ="(card,j) in item.order_detail" :key="j"
                class="goods-card"
                :title="card.goods_title"
                :thumb="card.goods_primary_img.middle_pic"
                :price="card.price"
                :border="false"
                @click="detail(item.id)"
              >
                <div slot="desc" :class="setup === 1 ? 'goods-desc cut' : 'goods-desc'">
                
                    <p :key="index">{{card.spec_name}}</p>
                  
                  <p>款号：{{card.option_name}}</p>
                  <span  class="goods-num" slot="num">x{{card.qty}}</span>
                </div>
              </van-card>
              <!-- 商品数量与合计 -->
              <van-cell class="goods_num" :border="false">
                <span>共{{item.total_num}}件 合计:￥<span class="price">{{item.pay_price}}</span></span>
                <span v-if="item.status == 0" @click="gopay(item)" class="shop">去支付</span>
              </van-cell>
            </van-cell-group>
        </div>
  </div>
  <div class="empty" v-else>
      <img src="/static/images/empty/order.png" >
      <p>暂无订单~</p>
  </div>
</div>
</template>
<script>
import GoodsCart from '@/components/sale/goods-cart.vue'
export default {
  data () {
    return {
      page: 1,
      orderList: [],
      clickNum: -1, // tap状态
      setup: 1, // 订单页
      active: '-1',
      nodata: false,
      logStatus: 0
    }
  },
  methods: {
    handleTabClick (val) {
      this.active = val.mp.detail.name
      this.nodata = false
      this.orderList = []
      this._getOrder()
    },
    gopay (item) {
      wx.navigateTo({
        url: '/pages/pay/main?order_no=' + item.order_no + '&money=' + item.total_price
      })
      // let address = {
      //   address_province: '',
      //   address_city: '',
      //   address_qu: '',
      //   address_info: item.address_info,
      //   sname: item.name,
      //   user_phone: item.mobile
      // }
      // localStorage['Address'] = null
      // localStorage['Address'] = JSON.stringify(address)
      // let query = {
      //   order: item.order_no,
      //   price: item.pay_price,
      //   merge: 0
      // }
      // sessionStorage.setItem('query', JSON.stringify(query))
      // this.$router.push({
      //   path: 'pay-type'
      // })
    },

    detail (id) {
      wx.navigateTo({
        url: '/pages/orderdetail/main?id=' + id
      })
    },
    cutcunt (val) {
      return String(val).substr(0, 4) + '****' + String(val).substr(-4)
    },
    // 获取订单列表
    _getOrder () {
      // 设置停止滚动加载开关

      if (this.nodata === true) {
        return false
      }
      let active = ''
      if (this.active === '-1') {
        active = ''
      } else {
        active = this.active
      }
      this.$http.post({
        url: 'shop/my_order/list',
        data: {
          'status': active,
          page: this.page
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.count > this.orderList.length) {
            this.orderList = this.orderList.concat(res.data.list)
            this.orderList.map(item => {
              item.staus_name = ''
              const result = item.spec_cname.map((key, index) => {
                return {
                  class: key,
                  name: item.option_name[index]
                }
              })
              item.option = result
            })
            this.page = this.page + 1
          } else {
            this.nodata = true
            this.logStatus = 2
          }
        }
      })
    }

  },
  onReachBottom () {
    this._getOrder()
  },
  onLoad (options) {
    console.log(options.type)
    if (options.type) {
      this.active = options.type
    }
    // this.uid = store.getters.uid
    // this.clickNum = -1
    this.nodata = false
    this.orderList = []
    this._getOrder()
  },
  onUnload () {
    const url = '../my/main'
    if (mpvuePlatform === 'wx') {
      mpvue.switchTab({ url })
    } else {
      mpvue.navigateTo({ url })
    }
  },
  components: {
    GoodsCart
  }
}
</script>
<style lang='scss' scoped>
  .goods-card{
    text-align: left;
    background-color: #ffffff;
    .van-card__title{
      font-size: 15px;
      color: #333333;
    }
    .goods-desc{
      p{
        padding-top: 7px;
        font-size: 12px;
        color: #999999;
      }
    }
    .goods-num{
      position: absolute;
      bottom: 7px;
      right: 0;
    }
    .cut::after{
      content: '';
      position: absolute;
      bottom: -1px;
      width: 100%;
      height: 1 !important;
      border-bottom: 1px solid #f0f1f2;
    }
  }
// @import url(); 引入公共css类
  .order{
    background: #f5f5f5;
    padding-bottom: 50px;
    -webkit-overflow-scrolling: touch;
    min-height:100vh ;
    .order-form-item{
      height: 100vh;
      overflow: auto;
      .van-list{
        padding-bottom: 50px;
      }
      .item{
        margin-top: 10px;
        .order-title{
          .van-cell__value{
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .order_no{
            span{
              width: 44px;
              height: 22px;
              display: inline-block;
              text-align: center;
              line-height: 22px;
              font-size: 12px;
              color: #333333;
              border-radius: 4px;
              border: solid 1px #333333;
            }
          }
          .status_box{
            color: #ff7800;
            font-size: 13px;
            text-align: right;
          }
          .goods_num{
            .van-cell__value{
              justify-content: flex-end;
              span{
                font-size: 12px;
                color: #333333;
                .price{
                  font-size: 17px;
                }
              }
              .shop{
                margin-left: 30px;
                width: 67px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                color: #ffffff;
                border-radius: 30px;
                background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
                background-blend-mode: normal,normal;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
  .empty {
    display: flex;
    justify-content: center;
    padding: 200rpx 0;
    flex-direction: column;
    align-items: center;
    img {
      width:190rpx;
      height:190rpx
    }
    p {
      color: #999;
      padding-top: 20rpx;
      font-size: 28rpx;
    }
   
  }
</style>
<style>
.van-card {
  background: #fff!important;
}
.order-title .van-cell__title {
  flex: 2;
  font-size: 28rpx!important;
}
.order-title .van-cell__value {
  font-size: 28rpx!important;
}
</style>
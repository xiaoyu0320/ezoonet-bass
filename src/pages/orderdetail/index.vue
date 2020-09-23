<template>
  <div class="order_details">
    <div class="OrderHead" style="background-image: url('http://cdnpic.ezoonet.com/baas/file/20200624/44ee8f64e573bf8d8573b4ed6efaa35d.png')">
      <div class="content">
        <div class="item">
        <img v-if="url" :src="url"><div>{{status}}</div>
      </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="order_main">
      <van-cell-group class="address">
        <van-cell size="19px">
          <view slot="title">
            <div style="color: #333333;font-size:19px;">
              <label style="margin-right:10px">{{detailInfo.name}}</label>
              <span>{{detailInfo.mobile}}</span>
            </div>
            <div style="color: #666666;font-size:12px;">{{detailInfo.address_info}}</div>
          </view>
        </van-cell>
      </van-cell-group>
      <div>

      </div>
        <van-card
          v-for="(card,i) in detailInfo.order_detail"
          :key="i"
           class="goods-card"
          :title="card.goods_title"
          :thumb="card.goods_primary_img"
          :price="card.price"
        >
          <div slot="desc" class="goods-desc">
            <p >{{card.option_name}}</p>
            <p>款号：{{card.spec_name}}</p>
            <span class="goods-num" >x{{card.qty}}</span>
          </div>
        </van-card>
         <van-cell-group>
        <van-cell class="express">
          <view slot="title">
            <div class="box">
              <span class="van-cell-text">订单编号</span>
              <span>{{detailInfo.order_no ? detailInfo.order_no : '--' }}</span>
            </div>
            <div  class="box" v-if="detailInfo.pay_type_name">
              <span class="van-cell-text">支付方式</span>
              <span>{{detailInfo.pay_type_name}}</span>
            </div>
            <div  class="box" v-if="detailInfo.trade_no">
              <span class="van-cell-text">交易单号</span>
              <span>{{detailInfo.trade_no}}</span>
            </div>
            <div  class="box">
              <span class="van-cell-text">创建时间</span>
              <span>{{detailInfo.create_time}}</span>
            </div>
            <div  class="box">
              <span class="van-cell-text">付款时间</span>
              <span>{{detailInfo.pay_time ? detailInfo.pay_time : '--' }}</span>
            </div>
             <div  class="box" v-if="detailInfo.delivery_time">
              <span class="van-cell-text">发货时间</span>
              <span>{{detailInfo.delivery_time}}</span>
            </div>
            <div class="box">
              <span class="van-cell-text">{{type == 0 ? '结算金额' : '退款金额'}}</span>
              <span style="color: #e51c23;">￥{{detailInfo.pay_price}}</span>
            </div>
          </view>
        </van-cell>
        <van-field :class="detailInfo.remark ? '' : 'disabled'" v-model="detailInfo.remark" disabled placeholder="请在这里填写备注" />
      </van-cell-group>
      <!-- <order-price :item="detailInfo"></order-price> -->
      <div class="order_foot">
          <span v-if="showBtn" :class="detailInfo.status !== 2 ? 'order_btn' : ''" @click="btn">{{orderBtn}}</span>
          <span v-if="detailInfo.express_no && detailInfo.express_no != null" @click="expressTrace" class="order_btn">查看物流</span>
      </div>  
    </div>
    
    <!-- <order-foot v-if="showBtn || detailInfo.express_no" :orderBtn="orderBtn">
      <template slot="btn">
        <span v-if="showBtn" :class="detailInfo.status !== 2 ? 'order_btn' : ''" @click="btn">{{orderBtn}}</span>
        <span v-if="detailInfo.express_no && detailInfo.express_no != null" @click="expressTrace" class="order_btn">查看物流</span>
      </template>
    </order-foot> -->
    <van-popup class="after" position="bottom" round :show="showAfter"   @close="showAfter = false"  custom-style="height: 30%">
      <p class="after-title">请选择售后类型</p>
      <section class="after-radio" >
        <van-radio-group :value="type" @change="onradio" style="display:flex; justify-content: center;">
          <van-radio name="1" style="margin-right:20rpx" >退货退款</van-radio>
          <van-radio name="2">仅退款</van-radio>
        </van-radio-group>
      </section>
      <div class="after-btn">
        <van-button @click="showAfter = false"   style="margin-right:20rpx">取消</van-button>
        <van-button  @click="confirm">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
// import { getOrderDetail, applyAfterSale } from '@/api/api'
// import { Toast } from 'vant'
// import DetailCart from '@c/order/detail-cart.vue'
export default {
  data () {
    return {
      id: '', // 售后id
      order_on: '',
      img: '',
      order_no: '',
      detailInfo: {},
      note: '',
      orderBtn: '',
      showBtn: false,
      setup: 2, // 订单详情页
      showAfter: false,
      type: '1'
    }
  },
  methods: {
    onradio (val) {
      this.type = val.mp.detail
    },
    confirm () {
      this.showAfter = false
      wx.navigateTo({
        url: '/pages/applysale/main?id=' + this.detailInfo.id + '&type=' + this.type
      })
    },
    back () {
      this.$router.back()
    },
    // 物流追踪
    expressTrace () {
      wx.navigateTo({
        url: '/pages/express/main?express_no=' + this.detailInfo.express_no
      })
    },

    btn () {
      if (this.orderBtn === '去支付') {
        wx.navigateTo({
          url: '/pages/pay/main?order_no=' + this.detailInfo.order_no + '&money=' + this.detailInfo.total_price
        })
      } else if (this.orderBtn === '申请退款') {
        this.showAfter = true
      }
    },
    // 复制状态
    copy (shareLink) {
      // let input = document.createElement('input') // 直接构建input
      // input.value = shareLink // 设置内容
      // document.body.appendChild(input) // 添加临时实例
      // input.select() // 选择实例内容
      // document.execCommand('Copy') // 执行复制
      // document.body.removeChild(input) // 删除临时实例
      // Toast.success('复制成功')
    },
    // 获取订单详情
    _getOrderDetail () {
      this.$http.post({
        url: 'shop/my_order/detail',
        data: {
          id: this.id,
          page: this.page
        }
      }).then(res => {
        this.detailInfo = res.data
      })
    }
  },
  computed: {
    status () {
      switch (Number(this.detailInfo.status)) {
        case 0:
          this.img = '/images/order/time@2x.png'
          this.orderBtn = '去支付'
          this.showBtn = true
          return '等待付款'
        case 1:
          this.img = '/images/order/parcel@2x.png'
          this.orderBtn = '申请退款'
          this.showBtn = true
          return '等待发货'
        case 2:
          this.img = '/images/order/express.png'
          this.orderBtn = '申请售后'
          this.showBtn = true
          return '待收货'
        case 3:
          this.img = '/images/order/closed@2x.png'
          this.orderBtn = '申请售后'
          return '确认收货'
        case 4:
          this.img = '/images/order/closed@2x.png'
          this.orderBtn = '已完成'
          return '交易完成'
        case 5:
          return '售后中'
        case 9:
          this.img = '/images/order/closed@2x.png'
          this.showBtn = false
          return '交易结束'
      }
    }
  },
  onLoad (options) {
    this.id = options.id
    this.showAfter = false
    // this.order_no = this.$route.query.order_no
    this._getOrderDetail()
  }
}
</script>
<style lang="scss" scoped>
    .van-icon{
      transform: rotate(180deg);
      color: #323232 !important;
    }
   .order_details{
      height: 100vh;
      overflow: scroll;
      position: relative;
    .order_main{
      position: absolute;
      top: 200rpx;
      left: 0;
      width: 100%;
      border-radius: 18px 18px 0 0;
      overflow: hidden;
      padding-bottom: 70px;
     
    }
    .goods-title{
      .sku::after{
        border: none !important;
      }
    }
    .express{
      .box{
        justify-content: space-between;display: flex;padding: 10px 0;
        span{
          text-align:right;
        }
      }
    }
    .after{
      .after-title{
        padding: 20px;
        font-size: 19px;
        color: black;
        text-align: center;
      }
      .after-radio{
        padding:15px 0;
        margin-bottom: 10px;
        .van-radio-group{
          display: flex;
          justify-content: center;
          padding: 15px;
          div{
            padding: 0 12px;
          }
        }
      }
      .after-btn{
        text-align: center;
        .van-button{
          color: #ffffff;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          border-radius: 30px;
          background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
          background-blend-mode: normal,normal;
          margin: 0 15px;
          padding: 0 50px;
        }
      }
    }
   }

    .OrderHead{
    width: 100%;
    height: 146.5px;
    background-size: cover ;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
      position: relative;
      padding-bottom: 20px;
      font-size: 18px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .item{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex-direction: column;
        img{
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
      .member{
        img{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #ededed;
          border: solid 1px #ffffff;
          margin: 5px 0;
        }
        p{
          padding: 5px 0;
          color: #ffffff;
        }
      }
      .express{
        text-align: left;
        p{
          color: #ffffff;
          font-size: 14px;
          padding: 5px 0;
          text-align: left;
          span{
            display: inline-block;
            width: 44px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            border-radius: 4px;
            border: solid 1px #ffffff;
            font-size: 12px;
            color: #ffffff;
          }
        }
      }
      .address{
        position: fixed;
        width: 100%;
        top: 133px;
        border-radius: 16px 16px 0px 0px;
        overflow: hidden;
        .van-cell{
          padding: 15px;
        }
      }
      .note{
        padding: 10px 0;
        color: #ffffff;
        opacity: 0.6;
      }
    }
  }
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
   .order_foot{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 49px;
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    background-color: #ffffff;
    box-sizing: border-box;
    span{
      display: inline-block;
      padding: 6px 15px;
      font-size: 12px;
      color: #333333;
      border-radius: 15px;
      border: 1px solid #333333;
    }
    .order_btn{
      display: inline-block;
      border: none;
      padding: 6px 15px;
      color: #ffffff;
      font-size: 12px;
      margin-left: 10px;
      background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
      background-blend-mode: normal, normal;
      border-radius: 15px;
    }
  }
</style>
<style >
  .after-btn{
      text-align: center;
    }

  .after-btn  .van-button{
    color: #ffffff;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 30px;
    background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
    background-blend-mode: normal,normal;
    margin: 0 15px;
    padding: 0 50px;
  }
</style>
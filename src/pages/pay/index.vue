<template>
  <div class='paylist'>
    <!-- 地址 -->
    <!-- <div class="address" >
      <van-cell-group >
        <van-cell style="align-items: center;" size="19px" v-if="address">
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
    </div> -->
    <div>
        <van-cell title="应付款" :value="'￥'+money" size="large" />
    </div>
    <div class="goods-radio">
       <van-radio-group :value="radio" @change="onChange">
          <van-cell :title="item.title" v-for="(item,i) in paylist" :key="i" clickable :data-name="item.name" @click="onClick">
            <van-radio slot="right-icon" :name="item.name" />
          </van-cell>
        </van-radio-group>
        
    </div>
     <van-button class="but" type="danger" @click="pay" size="large">立即支付</van-button>
     <van-popup :show="show" @close="onClose"  position="bottom"  custom-style="height: 30%;">
       <div class="title"> 支付</div>
          <van-field
          :value="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          @change="changepas"
          required
        />
         <van-button class="but" type="danger" @click="wxpay" size="large" style="margin-top:60rpx">立即支付</van-button>
     </van-popup>
     <van-toast id="van-toast" />
     <van-dialog id="van-dialog" />
  </div>
</template>
<script>
import Toast from '@/../static/vant/toast/toast'
// import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    // 这里存放数据
    return {
      show: false,
      porder_no: '',
      order_no: '',
      id: '88',
      password: '',
      address: {},
      money: '',
      radio: 9,
      blance: 0,
      paylist: [{
        title: '余额支付(可用余额100)',
        desc: '使用账户余额支付',
        img: '',
        name: 9
      },
      {
        title: '微信支付',
        desc: '微信安全支付',
        img: '',
        name: 1
      }],
      timer: '',
      linkopen: true
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    changepas (val) {
      this.password = val.mp.detail
    },
    onClose () {
      this.show = false
    },
    pay () {
      if (this.radio === 9) {
        this.show = true
      } else {
        this.wxpay()
      }
    },
    wxpay () {
      wx.login({
        success: (res) => {
          // 获取微信code,传给后台，后台获取微信openid
          if (res.code) {
            let obj = {}
            obj.auth_code = res.code
            if (this.porder_no) {
              obj.porder_no = this.porder_no
            }
            if (this.order_no) {
              obj.order_no = this.order_no
            }
            obj.type = this.radio
            if (this.password) {
              obj.pay_password = this.password
            }
            console.log('订单信息' + obj)
            this.$http.post({ // 封装微信请求方法
              url: 'shop/payment/doPay',
              data: obj
            }).then(res => {
              if (this.radio === 1) {
                this.setwx(res)
              } else if (this.radio === 9 && res.code === 200) {
                this.show = false
                Toast.success('支付成功')
                mpvue.navigateTo({ url: '../order/main?type=1' })
                this.linkopen = false
              }
            })
          }
        }
      })
    },
    setwx (res) {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: (res) => {
          wx.showToast({
            title: '支付成功！',
            icon: 'success',
            duration: 2000
          })
          mpvue.navigateTo({ url: '../order/main?type=1' })
          this.linkopen = false
        },
        fail: function (res) {
          wx.showToast({
            title: '支付失败！',
            icon: 'warn',
            duration: 1500
          })
        },
        complete: function (res) {

        }
      })
    },
    onChange (val) {
      this.radio = val.mp.detail
    },
    countdown () {
      var step = 1000
      var that = this
      let restTime = 30 * 60 * 1000
      var timer = setInterval(function () {
        if (restTime >= 0) {
          this.timer = that.formatTime(restTime)
          restTime = restTime - 1000
        } else {
          clearInterval(timer)// 清空计时
        }
      }, step)
    },
    formatTime (s) {
      var min = Math.floor(s / 60 / 1000) % 60
      var sec = parseInt((s / 1000 % 60).toFixed(2))
      min = min < 10 ? '0' + min : min
      sec = sec < 10 ? '0' + sec : sec
      return '00:' + min + ':' + sec
    }
    // getAddressDetail (id) {
    //   this.$http.post({
    //     url: 'shop/address/edit',
    //     data: {
    //       'id': this.id
    //     }
    //   }).then(res => {
    //     this.address = res.data
    //   })
    // }
  },
  onLoad (options) {
    this.show = false
    this.password = ''
    this.porder_no = ''
    this.order_no = ''
    // this.id = options.addresssId
    if (options.porder_no) {
      this.porder_no = options.porder_no
    }
    if (options.order_no) {
      this.order_no = options.order_no
    }
    this.money = options.money

    this.$http.post({ // 封装微信请求方法
      url: 'shop/Order/balance',
      data: {}
    }).then(res => {
      this.blance = res.data.balance
      this.paylist[0].title = '余额支付(可用余额' + this.blance + ')'
    })

    // this.getAddressDetail()
  },
  onUnload () {
    mpvue.navigateTo({ url: '../order/main?type=0' })
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
  .title {
    line-height: 80rpx;
    text-align: center;
  }
</style>

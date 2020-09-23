<template>
  <div class='cash'>
    <!-- 地址 -->
    <div class="cash-card" v-if="type =='2'">
        <van-cell title="您还未绑定银行卡" is-link  @click="gobank"  v-if="!bank.card_no"/>
        <van-cell center :title="bank.card_name" :value="bank.card_no" @click="gobank" is-link  v-else />
    </div>
    <div class="cash-content">
       <div class="cash-title">提现金额</div>
       <div class="cash-input">
          <van-field
            :value="money"
            placeholder="请输入金额"
            @change="onChange"
            disabled
          />
       </div>

       <div class="cash-txt">
          当前提现只支持全部提现，或转入账户余额
       </div>
          
    </div>
     <van-field :value="code"
        center
        clearable
        @change="oncode"
        label="短信验证码"
        placeholder="请输入短信验证码"
        use-button-slot
      >
        <van-button slot="button" size="small" type="primary"
          >发送验证码</van-button
        >
      </van-field>
    <div class="opeate">
       <van-button class="but" type="danger" @click="sumbit" size="large">提交</van-button>
       <!-- <van-button class="count"  type="default" @click="wxpay" size="large" >转入账户余额</van-button> -->
    </div>
    <van-toast id="van-toast" />
</div>
</template>
<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    // 这里存放数据
    return {
      money: '',
      bank: {},
      type: '', // 1 提现转入到余额 2 提现
      code: ''
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    gobank () {
      mpvue.navigateTo({ url: '../bank/main' })
    },
    oncode (val) {
      this.code = val.mp.detail
    },
    getinfo () {
      this.$http.post({
        url: 'shop/withdraw/apply',
        data: {}
      }).then(res => {
        if (res.data.bank.list.length > 0) {
          this.bank = res.data.bank.list[0]
        }
        this.money = res.data.money
      })
    },
    getcash () {
      this.$http.post({
        url: 'shop/withdraw/transferBalance',
        data: {
          money: this.money,
          code: this.code
        }
      }).then(res => {
        if (res.code === 200) {
          this.code = ''
          this.money = ''
          this.getinfo()
          Toast.success(res.msg)
        }
      })
    },
    sumbit () {
      if (this.type === '1') {
        this.getcash()
      } else {
        let obj = {}
        obj.money = this.money
        obj.bank_id = this.bank.id
        obj.code = this.code
        this.$http.post({
          url: 'shop/withdraw/post',
          data: obj
        }).then(res => {
          if (res.code === 200) {
            this.code = ''
            this.money = ''
            this.getinfo()
            Toast.success(res.msg)
          }
        })
      }
    }
  },
  onLoad (options) {
    this.type = options.type
    this.code = ''
    let title = ''
    if (this.type === '1') {
      title = '可提现金额转入余额'
    } else {
      title = '提现'
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.getinfo()
    if (options.card) {
      this.bank = options
      // this._getBankCard(options.id)
    }
  }
}
</script>
<style lang="scss" scoped>

  .cash {
    background: #f5f6f7;
    height: 100vh;
    .cash-card {
      margin-top:20rpx
    }
    .cash-content {
      background: #fff;
      padding: 30rpx;
      margin:20rpx 0;
      font-size: 28rpx;
      
      .cash-txt {
        color:#999;
        margin-top: 20rpx;
        font-size: 24rpx;
      }
    }
    .opeate {
      width: 100%;
      margin:60rpx auto;
    }
  }
</style>
<style>
 .cash .cash-content .van-cell {
   padding: 10px 0;
 }
 .opeate .van-button--default {
    border-color: #ee0a24;
    color: #ee0a24;
    margin-top: 30rpx;
 }
</style>
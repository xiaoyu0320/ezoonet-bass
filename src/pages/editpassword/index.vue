<template>
  <div class="user">
    <div class="user-box">
          <van-cell-group :border="false">
            <van-field
              label="当前支付密码"
              :value="password"
              placeholder="输入当前支付密码"
            @change="onChange"
            />
            <van-field
              label="新支付密码"
              :value="repassword"
              placeholder="输入新支付密码"
            @change="rechange"
            />
        </van-cell-group>
    </div>
     <div class="btn">
        <van-button type="default" class="btn-po" size="large" @click="save" >提交</van-button>  
      </div> 
     
   <van-toast id="van-toast" />

  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'
// import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    return {
      password: '',
      repassword: ''
    }
  },
  methods: {
    onChange (val) {
      this.password = val.mp.detail
    },
    rechange (val) {
      this.repassword = val.mp.detail
    },
    save () {
      this.$http.post({
        url: 'shop/setting/editPayPwd',
        data: {
          'id': this.userinfo.id,
          'code': 123,
          'ori_pay_password': this.password,
          'new_pay_password': this.repassword
        }
      }).then(res => {
        Toast.success(res.msg)
        mpvue.navigateTo({ url: '../user/main' })
      })
    }
  },

  onLoad () {
    this.password = ''
    this.repassword = ''
    this.userinfo = wx.getStorageSync('userinfo')
    this.shopinfo = wx.getStorageSync('shopInfo')
  },
  components: {

  }
}
</script>

<style lang="scss" scope>
.user {
  .user-box {
    padding:30rpx 30rpx 30rpx 0;
  }
   .btn {
    padding: 0 30rpx;
    margin-top:60rpx;
    background: #fff;
  }
}
 
</style>

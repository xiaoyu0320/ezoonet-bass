<template>
  <div class="wrap" >
      <div class="logo">
        <img src="/static/images/login/logo.png">
      </div>
    <div v-if="!logon" class="login-wrap" >
    
      <button  class="login-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" @click="getUserInfoClick"><img src="/static/images/login/wx.png" >手机号一键登陆</button>
        <div class="login">
          <span @click="bindGetUserInfo">微信登陆</span>
          <span @click="logon= true">已有账户登陆</span>
       </div> 
    </div>
    <div v-if="logon" class="login-wrap login-padding">
      <div class="user">
        <img src="/static/images/login/phone.png">
        <!-- <van-field  type="tel" :value="mobile" placeholder="请输入手机号码"  @input="changemobile"  ></van-field> -->
         <input class="form-input"  type="tel"  name="mobile" placeholder="请输入手机号码"   @input="changemobile" />
      </div>
      <div class="sms">
        <img src="/static/images/login/password.png">
        <!-- <van-field type="password" :value="repassword" placeholder="请输入密码" @change="changess($event)" ></van-field> -->
        <input class="form-input"  type="password"  name="repassword" placeholder="请输入密码"   @input="changess" />
      </div>
      <van-button class="login-button2" @click="_login" >登录</van-button>
      <a class="regiser" @click="regiser">注册Baas账号</a>
    </div>
     <van-toast id="van-toast" />
  </div>
</template>
<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  name: 'LOGIN',
  data () {
    return {
      logon: false,
      mobile: '',
      repassword: '',
      code: ''
    }
  },

  onLoad () {
    this.getinfo()
    wx.login({
      success: (res) => {
        this.code = res.code
      }
    })
  },
  methods: {
    regiser () {
      let url = '../register/main'
      mpvue.navigateTo({ url })
    },
    changess (event) {
      this.repassword = event.mp.detail.value
      console.log(this.repassword)
    },
    changemobile (e) {
      this.mobile = e.mp.detail.value
    },
    changepassword (e) {
      // this.password = e.mp.detail
      // console.log(this.password)
    },
    getUserInfoClick (e) {

    // console.log('click事件首先触发')
    },
    getPhoneNumber (e) {
      this.$http.post({
        url: 'shop/login/wxLogin',
        data: {
          'code': this.code,
          'encryptedData': encodeURIComponent(e.mp.detail.encryptedData),
          'iv': e.mp.detail.iv
        }
      }).then(res => {
        // 第一次绑定未设置密码 跳转注册
        if (res.code === 201) {
          mpvue.navigateTo({ url: '../register/main?phone=' + res.data.purePhoneNumber + '&id=' + res.data.id })
        }
        if (res.code === 200) {
          wx.setStorageSync('userinfo', res.data)
          wx.setStorageSync('nickname', res.data.nickname)
          wx.setStorageSync('sex', res.data.gender_name)
          wx.setStorageSync('birthday', res.data.birthday)
          const url = '../index/main'
          if (mpvuePlatform === 'wx') {
            mpvue.switchTab({ url })
          } else {
            mpvue.navigateTo({ url })
          }
        }
        if (res.code === 401) {
          this.getphonenumber(e)
        }
      }).catch((error) => {
        Toast.fail(error.msg)
      })

      // let { encryptedData, userInfo, iv } = e.mp.detail
    },
    getinfo () {
      this.$http.post({
        url: 'shop/index/getShopInfo',
        data: {
          'shop_id': 4
        }
      }).then(res => {
        if (res.code === 200) {
          // this.globalData.shopinfo = res.data
          wx.setStorageSync('shopInfo', res.data)
        }
      })
    },
    submit (e) {
      // key.Code === 13表示回车键
      if (e.keyCode === 13) {
        this._login()
      }
    },
    // 登录
    _login () {
      this.$http.post({
        url: 'shop/Login/doLogin',
        data: {
          'mobile': this.mobile,
          'password': this.repassword,
          'shop_id': 4
        }
      }).then(res => {
        if (res.code === 200) {
          wx.setStorageSync('userinfo', res.data)
          wx.setStorageSync('nickname', res.data.nickname)
          wx.setStorageSync('sex', res.data.gender_name)
          wx.setStorageSync('birthday', res.data.birthday)
          const url = '../index/main'
          if (mpvuePlatform === 'wx') {
            mpvue.switchTab({ url })
          } else {
            mpvue.navigateTo({ url })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrap {
     background-repeat: no-repeat;
     background-size: cover;
     height: 100%;
     position: relative;
    .login-wrap {
      width: 100%;
      border-radius: 10px;
      padding: 140rpx 0;
      box-sizing: border-box;
      .title{
        font-size: 56rpx;
        letter-spacing: 10rpx;
        margin-bottom: 100rpx;
        color: #000;
        text-align: center;
      }
      .invitecode{
        border: 1px solid #a2a5af;
        width: 100%;
      }
      .user,.password,.sms{
        display: flex;
        align-items: center; 
        margin-bottom: 40rpx;
        border-bottom: 1px solid #a2a5af;
        img{
          width: 21rpx;
          height: 29rpx;
        }
        .van-cell{
          padding:16rpx;
          background:none;
        }
        .left-label{
          display: inline-block;
          border-right: 1px solid #e5e5e5;
          height: 68rpx;
          text-align: center;
          line-height:68rpx;
          width: 140rpx;
          color:#333;
          font-size:32rpx;
        }
        .rights{
          width: 52%;
          text-align: right;
          button{
            font-size: 24rpx;
            border-radius: 160rpx;
            color: #000;
            border: 0;
            background-color:transparent;
          }
        }
      }
      .password{
         margin-bottom: 0;
      }
      .unuserBtn{
        color:#000;
      }
    }
    .login-padding{
       padding: 0rpx 56rpx;
    }
    .login-button{
      text-align: center;
      width: 90%;
      height:100rpx;
      border-radius:50rpx;
      margin:0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size:36rpx;
      border: 1px solid #e5e5e5;
      background: #1aac19;
      border-radius: 8rpx;
      color: #fff;
      img{
        width:39rpx;
        height: 33rpx;
        margin-right:22rpx;
      }
    }
    .login-button2{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 36rpx;
        margin-top: 160rpx;
        width:100%;
        border-radius: 50rpx;
        color: #ffffff;
        background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
        background-blend-mode: normal,normal;
      
    } 
    .login {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top:40rpx;
      position: absolute;
      bottom: 60rpx;
      width: 92%;
      margin: 0 4%;
      span {
        width: 331rpx;
        height: 88rpx;
        border-radius: 4rpx;
        border: solid 1rpx #a2a5af;
        line-height: 88rpx;
        text-align: center;
      }
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 213rpx;
        height: 212rpx;
        margin-bottom: 120rpx;
      }
     
    }
    .regiser {
      color: #ec1f23;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: underline;
      font-family: PingFang-SC-Medium;
      margin-top:80rpx
    }
  }
</style>
<style>
.wrap .van-button--normal{
  background: none !important;
  color: #fff;
  border: 0;
}
</style>

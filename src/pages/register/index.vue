<template>
  <div class="wrap">
   
    <div class="login-wrap">
        <div class="title">欢迎登录</div>
        <div class="title-s">需要绑定手机号才能完成注册</div>
      <div class="user">
         <img src="/static/images/login/phone.png">
        <van-field center type="number"  v-model="mobile" placeholder="请输入手机号码"  @change="changemobile"  ></van-field>
      </div>
     <div class="sms">
        <img src="/static/images/login/password.png">
        <van-field center type="password" v-model="password" placeholder="请输入密码"  @change="changepassword"></van-field>
      </div>
      <div class="user">
         <img src="/static/images/login/repassword.png">
        <van-field center type="password" :value="repassword" placeholder="再次确认密码"  @change="changerepassword"  ></van-field>
      </div>
      <div class="sms">
         <img src="/static/images/login/code.png">
        <van-field center v-model="code" placeholder="请输入验证码"  @change="changecode"></van-field>
        <van-button class="code">获取验证码</van-button>
      </div>
      <van-button class="login-button2" @click="_login" >立刻绑定</van-button>
      <a class="register">绑定微信手机号</a>
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
      mobile: '',
      password: '',
      repassword: '',
      code: '',
      id: ''
    }
  },
  onLoad (options) {
    if (options.phone) {
      this.mobile = options.phone
    }
    if (options.id) {
      this.id = options.id
    }
  },
  methods: {
    changemobile (e) {
      this.mobile = e.mp.detail
    },
    changepassword (e) {
      this.password = e.mp.detail
    },
    changerepassword (e) {
      this.repassword = e.mp.detail
    },
    changecode (e) {
      this.code = e.mp.detail
    },
    submit (e) {
      if (e.keyCode === 13) {
        this._login()
      }
    },
    // 登录
    _login () {
      let obj = {}
      obj = {
        'mobile': this.mobile,
        'password': this.password,
        'repassword': this.repassword,
        'code': this.code
      }
      if (this.id) {
        obj.id = this.id
      }
      this.$http.post({
        url: 'home/signup/bindPhone',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          const url = '../login/main'
          mpvue.navigateTo({ url })
        }
      }).catch((error) => {
        Toast.fail(error.msg)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .wrap {
     background-repeat: no-repeat;
     background-size: cover;
     .title {
       color: #292c34;
       font-size: 42rpx;
       margin-bottom: 20rpx;
     }
     .title-s {
       color: #a2a5af;
       font-size: 28rpx;
       margin-bottom: 100rpx;
     }
    .login-wrap {
      width: 100%;
      border-radius: 10px;
      padding: 60rpx 60rpx 0;
      box-sizing: border-box;
      .invitecode{
        border: 1px solid;
        width: 100%;
      }
      .user,.password,.sms{
        display: flex;
        align-items: center; 
        margin-bottom: 40rpx;
        border-bottom: 1px solid #a2a5af;
        position: relative;
        .code {
          position: absolute;
          right: 0;
          z-index: 99;
        }
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
    .login-button{
      text-align: center;
      width:550rpx;
      height:100rpx;
      border-radius:50rpx;
      margin:0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size:36rpx;
      border: 1px solid #e5e5e5;
      img{
        width:60rpx;
        height: 60rpx;
        margin-right:22rpx;
      }
    }
    .login-button2{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 36rpx;
        margin-top: 100rpx;
        width:100%;
        border-radius: 50rpx;
        color: #ffffff;
        background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
        background-blend-mode: normal,normal;
      
    } 
    .register {
      color: #3d424e;
      font-size: 28rpx;
      display: flex;
      justify-content: center;
      margin-top: 80rpx;
    }
  }
</style>
<style>
.wrap .van-button--normal{
  background: none !important;
  color: #fff;
  border: 0;
}
.wrap  .code .van-button--normal{
  color: #ff9f16;
}
</style>

<template>
  <div class="user">
   
    <div class="user-box">
       <div class="title">为了确保是你本人操作，请完成以下验证</div>
          <van-cell-group :border="false">
            <van-field
              label="已绑手机"
              :value="mobile"
              placeholder="输入支付密码"
            @change="onChange"
            
            />
              <van-field
                  :value="code"
                  center
                  clearable
                  @change="onChange"
                  label="短信验证码"
                  placeholder="请输入短信验证码"
                  use-button-slot
                >
                  <van-button slot="button" size="small" type="primary"
                    >发送验证码</van-button
                  >
                </van-field>
        </van-cell-group>
    </div>
     <div class="btn">
        <van-button type="default" class="btn-po " size="large" @click="save" >下一步</van-button>  
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
      mobile: '',
      code: ''
    }
  },
  methods: {
    onChange (val) {
      this.code = val.mp.detail
    },
    save () {
      this.$http.post({
        url: 'shop/setting/checkCode',
        data: {
          'mobile': this.mobile,
          'code': this.code
        }
      }).then(res => {
        Toast.success(res.msg)
        if (res.data.is_set_paypwd === 1) {
          mpvue.navigateTo({ url: '../editpassword/main' })
        } else {
          mpvue.navigateTo({ url: '../password/main' })
        }
      })
    }
  },

  onLoad () {
    let userinfo = wx.getStorageSync('userinfo')
    this.code = ''
    this.password = ''
    this.repassword = ''
    this.mobile = userinfo.mobile
  },
  onUnload () {

  },
  components: {

  }
}
</script>

<style lang="scss" scope>
.user {
  .title {
    font-size: 24rpx;
    color: #999;
    padding-left: 30rpx;
  }
  .user-box {
    padding:30rpx 30rpx 30rpx 0;
  }
   .btn {
    padding: 0 30rpx;
    margin-top:60rpx;
    background: none;
  }
}
 
</style>

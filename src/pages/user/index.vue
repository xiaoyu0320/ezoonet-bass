<template>
  <div class="user">
      <van-cell-group>
      <van-cell title="头像" >
          <view slot="right-icon">
             <img src="/static/images/user.png" mode="widthFix" style="width:120rpx" @click="afterRead" v-if="!userinfo.avatar">
             <img v-else :src="userinfo.avatar" style="width:120rpx;height:120rpx" @click="afterRead"  mode="widthFix" >
          </view>
      </van-cell>
      <van-cell title="昵称" :value="userinfo.nickname" is-link  @click="open(1)"/>
      <van-cell title="性别" :value="userinfo.gender_name"   is-link @click="open(2)"/>
      <van-cell title="出生日期"  :value="userinfo.birthday" is-link @click="dateshow = true"/> 
       <van-cell title="设置支付密码"  is-link @click="open(3)"/> 
      <!-- <van-cell title="地区" is-link/>     -->
    </van-cell-group>
   <van-toast id="van-toast" />
   <van-popup :show="nameshow" position="bottom"  custom-style="height:100%;"  @close="onClose(1)" :closeable="true" >
        <nick-name :userinfo="userinfo" @callback="reject"  :type="type" />
   </van-popup>
    <van-popup :show="dateshow" position="bottom"  custom-style="height:40%;" @close="dateshow= false">
        <van-datetime-picker
          type="date"
          :value="currentDate"
          @input="onInput"
          :min-date="minDate"
          @cancel="dateshow= false"
          @confirm="confirm"
        />
   </van-popup> 
   
  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'
import NickName from '@/components/user/nickname'
export default {
  data () {
    return {
      showImage_url: {},
      userinfo: {},
      shopinfo: {},
      imgurl: '',
      nameshow: false,
      dateshow: false,
      type: 3,
      currentDate: new Date().getTime(),
      minDate: new Date(1900, 1, 1).getTime()
    }
  },
  computed: {

  },
  methods: {
    reject (val) {
      this.nameshow = val
      this.getmy()
    },
    confirm () {
      this.$http.post({
        url: 'shop/setting/editBirthday',
        data: {
          'id': this.userinfo.id,
          'birthday': this.currentDate / 1000
        }
      }).then(res => {
        if (res.code === 200) {
          this.dateshow = false
          Toast.success('操作成功')
          wx.setStorageSync('birthday', res.data.birthday)
        }
      })
    },
    onInput (event) {
      console.log(event)
      this.currentDate = event.mp.detail
    },
    open (type) {
      if (type !== 3) {
        this.type = type
        this.nameshow = true
      } else {
        mpvue.navigateTo({ url: '../repassword/main' })
      }
    },
    onClose (type) {
      this.nameshow = false
    },
    afterRead () {
      var that = this
      wx.chooseImage({
        count: 1, // 选择图片的数量 默认为9
        success: (res) => {
          let path = res.tempFilePaths[0] // 拿路径
          that.showImage_url = path
          that.setup()
        }
      })
    },
    setup () {
      var that = this
      wx.uploadFile({
        url: 'http://bapi.ezoonet.com/shop/setting/upload', // 自己的接口地址
        filePath: that.showImage_url,
        name: 'content',
        header: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json',
          'token': that.userinfo.token
        },
        formData: ({// 上传图片所要携带的参数
          FileObject: that.showImage_url,
          uid: that.userinfo.uid,
          shop_id: that.shopinfo.id
        }),
        success: function (res) {
          let jsons = JSON.parse(res.data)
          that.userinfo.avatar = jsons.data.url
          if (jsons.data.url) {
            that.$http.post({
              url: 'shop/setting/editAvatar',
              data: {
                'id': that.userinfo.id,
                'avatar': jsons.data.url
              }
            }).then(res => {
              if (res.code === 200) {
                Toast.success('上传成功')
              }
            })
          }
        }
      })
    },
    getmy () {
      this.$http.post({
        url: 'shop/my/userInfo',
        data: {}
      }).then(res => {
        if (res.code === 200) {
          this.userinfo = res.data
        }
      })
    }
  },

  onLoad () {
    this.userinfo = wx.getStorageSync('userinfo')
    this.userinfo.nickname = wx.getStorageSync('nickname')
    this.userinfo.gender_name = wx.getStorageSync('sex')
    this.userinfo.birthday = wx.getStorageSync('birthday')
    this.shopinfo = wx.getStorageSync('shopInfo')
  },
  onUnLoad () {
    mpvue.navigateTo({ url: '../my/main' })
  },
  components: {
    NickName
  }
}
</script>

<style lang="scss" scope>

</style>

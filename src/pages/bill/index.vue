<template>
  <!--index.wxml-->
  <view class="posterWrap">
    <canvas canvas-id="posterCanvas" class="myCanvas"></canvas>
    <div class="fixed_container">
      <div class="fixed_inner">
        <div @click="handleShowImg">
          <!-- <img src="../../../static/images/haibao.png" alt /> -->
          <span>分享好友或群聊</span>
        </div>
        <div @click="handleSave">
          <!-- <img src="../../../static/images/weixin.png" alt /> -->
          <span>分享到朋友圈</span>
        </div>
      </div>
    </div>
  </view>
</template>
<script>
export default {
  // index.js
  // 获取应用实例
  data () {
    return {
      InfoSync: {},
      info: {}
    }
  },
  onLoad () {
    this.getcode()
    const scene = decodeURIComponent('4')
    this.$http.post({
      url: 'shop/my/getMpCode',
      data: {
        'scene': scene,
        'page': '/pages/index/main',
        'width': 320
      }
    }).then(res => {

    })
  },
  methods: {
    getcode () {
      this.$http.post({
        url: 'shop/my/generatePoster',
        data: {}
      }).then(res => {
        this.info = res.data
        decodeURIComponent()
        this.bill()
      })
    },
    bill () {
      const InfoSync = wx.getSystemInfoSync()
      this.InfoSync = InfoSync
      let bili = InfoSync.windowWidth / 375 * 1
      const ctx = wx.createCanvasContext('posterCanvas')

      // ctx.drawImage(path, 0, 0, 310 * bili, 435 * bili) // ctx.drawImage（图片路径，距离画布左边，距离画布右边，图片宽，图片高）
      ctx.save() // 保存当前绘画
      ctx.setTextAlign('center') // 文字居中 ctx.fillText（显示文字，距离画布左边/基准点/文字以这个点居中或左对齐，距离画布顶部）
      ctx.setFillStyle('#111') // 文字颜色：fff
      ctx.setFontSize(16) // 文字字号
      ctx.fillText(this.info.name, 155 * bili, 164 * bili) // 名字 ctx.fillText（显示文字，距离画布左边/基准点/文字以这个点居中或左对齐，距离画布顶部）
      ctx.setFontSize(21) // 文字字号
      ctx.fillText('位置差一点出阴影重叠加粗', 155 * bili, 222.5 * bili)
      ctx.setFillStyle('#895908') // 文字颜色：895908
      ctx.setTextAlign('center') // 文字居中
      ctx.fillText('位置差一点出阴影重叠加粗', 155 * bili, 221.5 * bili)
      ctx.fillText('位置差一点出阴影重叠加粗', 155 * bili, 221.5 * bili)
      ctx.setFontSize(14) // 文字字号
      ctx.setTextAlign('left') // 文字居中
      ctx.setFillStyle('#111') // 文字颜色：fff
      ctx.fillText('生日：1990-01-01', 90 * bili, 256 * bili)
      ctx.fillText('电话：9090980', 90 * bili, 284 * bili)
      ctx.setFillStyle('#111') // 文字颜色：111
      ctx.setTextAlign('left') // 文字居中
      ctx.setFontSize(17) // 文字字号
      ctx.fillText('写两次让字体加粗', 140 * bili, 346 * bili)
      ctx.fillText('写两次让字体加粗', 140 * bili, 346 * bili)
      ctx.setFillStyle('#828282') // 文字颜色：828282
      ctx.setFontSize(14) // 文字字号
      ctx.fillText('写一次不加粗', 140 * bili, 376.5 * bili)
      ctx.setFillStyle('#B0B0B0') // 文字颜色：B0B0B0
      ctx.setFontSize(11) // 文字字号
      ctx.fillText('小字体', 140 * bili, 398 * bili)
      ctx.save()
      // 圆形头像框
      ctx.setStrokeStyle('rgba(0,0,0,0)')
      ctx.arc(155 * bili, 94 * bili, 45 * bili, 0, 2 * Math.PI)
      ctx.fill()
      // 二维码
      this.saveThe(
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575528227860&di=f644289e83c18cf73d44e76dec4c1246&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw640h395%2F20180109%2F0ae9-fyqnici9075376.jpg',
        path => {
          ctx.drawImage(path, 30.5 * bili, 320 * bili, 93 * bili, 93 * bili)
          ctx.save()
          // 头像
          this.saveThe(
            this.info.logo,
            path => {
              ctx.clip()
              ctx.drawImage(
                path,
                110 * bili,
                47.5 * bili,
                90 * bili,
                90 * bili
              )
              ctx.save()
              ctx.stroke()
              ctx.draw()
            }
          )
        }
      )
    },
    // 小程序需要将图片下载下来，然后才能绘制到画布上
    saveThe (url, callback) {
      wx.getImageInfo({
        src: url, // 服务器返回的图片地址
        success: res => {
          callback(res.path)
        },
        fail: function (res) {}
      })
    },
    // 点击保存时，将画布生成海报
    handleSave () {
      var that = this
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            that.saveImg()
          } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                that.saveImg()
              },
              fail () {
                wx.hideLoading()
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            })
          } else {
            wx.openSetting({
              success (res) {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  that.saveImg()
                } else {
                  wx.showToast({
                    title: '您没有授权，无法保存到相册',
                    icon: 'none'
                  })
                }
              }
            })
          }
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '出现了错误，请稍后再试',
            icon: 'none'
          })
        }
      })
    },
    saveImg () {
      // 按照设备比例去计算图片和画布尺寸
      let bili = this.InfoSync.windowWidth / 375 * 1
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 310 * bili,
        height: 435 * bili,
        destWidth: 310 * bili * this.InfoSync.pixelRatio,
        destHeight: 435 * bili * this.InfoSync.pixelRatio,
        fileType: 'png',
        quality: 1,
        canvasId: 'posterCanvas',
        success: function (res) {
          wx.hideLoading()
          var tempFilePath = res.tempFilePath
          // 需要权限
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success (res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333'
              })
            },
            fail: function (res) {
              wx.hideLoading()
              wx.showToast({
                title: '没有相册权限',
                icon: 'none',
                duration: 2000
              })
            }
          })
        },
        fail: function (err) {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '出现了错误，请稍后再试',
            icon: 'none'
          })
        }
      })
    },
    // 发送给朋友，以图片的方式，先生成临时图片地址，然后调用微信api显示转发
    handleShowImg () {
      let bili = this.InfoSync.windowWidth / 375 * 1
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 310 * bili,
        height: 435 * bili,
        destWidth: 310 * bili * this.InfoSync.pixelRatio,
        destHeight: 435 * bili * this.InfoSync.pixelRatio,
        fileType: 'png',
        quality: 1,
        canvasId: 'posterCanvas',
        success: function (res) {
          wx.hideLoading()
          wx.previewImage({
            urls: [res.tempFilePath],
            current: res.tempFilePath
          })
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '出现了错误，请稍后再试',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.posterWrap {
  min-height: 100%;
  padding-top: 15px;
  background-color: #f7f8fa;
}

.myCanvas {
  width:92%;
  height: 85vh;
  margin: 0 auto;
  background: #fff;
  border-radius: 8rpx;
}

.fixed_container {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}

.fixed_inner {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  align-items: center;
}
.fixed_inner div {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 5rpx;
  width: 333rpx;
	height: 98rpx;
  line-height: 98rpx;
  text-align: center;
  background-color: #26b525;
  border-radius: 8rpx;
}
.fixed_inner div:last-child {
 background-color: #15b96e;
}
.fixed_inner div img {
  width: 42rpx;
  height: 32rpx;
  margin-right: 11rpx;
}
</style>
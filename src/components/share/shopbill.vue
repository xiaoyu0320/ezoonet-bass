<template>
  <!--index.wxml-->
  <view class='poste_box'
        id='canvas-container'>
    <canvas canvas-id="myCanvas"
            style="width:100%;height:1100rpx;" />
  </view>
</template>
<script>
export default {
  // index.js
  // 获取应用实例
  data () {
    return {
      cardInfo: {
        avater: "https://wallet.ascchain.com/img/404@2x.19e2d972.png", //需要https图片路径
        qrCode: "https://wallet.ascchain.com/img/404@2x.19e2d972.png", //需要https图片路径
        TagText: "小姐姐", //标签
        Name: '小姐姐', //姓名
        Position: "程序员鼓励师", //职位
        Mobile: "13888888888", //手机
        Company: "才华无限有限公司", //公司
      }
    }
  },
  onLoad () {
    this.getAvaterInfo()
  },
  methods: {
    /**
  * 先下载头像图片
  */
    getAvaterInfo () {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this
      wx.downloadFile({
        url: that.cardInfo.avater, //头像图片路径
        success: function (res) {
          wx.hideLoading()
          if (res.statusCode === 200) {
            var avaterSrc = res.tempFilePath//下载成功返回结果
            that.getQrCode(avaterSrc) //继续下载二维码图片
          } else {
            wx.showToast({
              title: '头像下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                var avaterSrc = ""
                that.getQrCode(avaterSrc)
              }
            })
          }
        }
      })
    },
    /**
     * 下载二维码图片
     */
    getQrCode (avaterSrc) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this
      wx.downloadFile({
        url: that.cardInfo.qrCode, //二维码路径
        success: function (res) {
          wx.hideLoading()
          if (res.statusCode === 200) {
            var codeSrc = res.tempFilePath
            that.sharePosteCanvas(avaterSrc, codeSrc)
          } else {
            wx.showToast({
              title: '二维码下载失败！',
              icon: 'none',
              duration: 2000,
              success: function () {
                var codeSrc = ''
                that.sharePosteCanvas(avaterSrc, codeSrc)
              }
            })
          }
        }
      })
    },
    /**
    * 开始用canvas绘制分享海报
    * @param avaterSrc 下载的头像图片路径
    * @param codeSrc   下载的二维码图片路径
    */
    sharePosteCanvas: function (avaterSrc, codeSrc) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      var cardInfo = that.cardInfo; //需要绘制的数据集合
      const ctx = wx.createCanvasContext('myCanvas') //创建画布
      var width = ""
      wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
        var height = rect.height;
        var right = rect.right;
        width = rect.width * 0.8
        var left = rect.left + 5
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, rect.width, height);

        // 头像为正方形
        if (avaterSrc) {
          ctx.drawImage(avaterSrc, left, 20, width / 4, width / 4)
          ctx.setFontSize(14)
          ctx.setFillStyle('#fff')
          ctx.setTextAlign('left')
        }
        // 主图

        ctx.drawImage(avaterSrc, left + 60, 120, width / 2, width / 2)
        ctx.setFontSize(14)
        ctx.setFillStyle('#fff')
        ctx.setTextAlign('left')
        // 昵称
        ctx.setFontSize(14);
        ctx.setFillStyle('#000')
        ctx.setTextAlign('left')
        ctx.fillText('昵***称', left + 80, 50);

        // 标题
        ctx.setFontSize(14);
        ctx.setFillStyle('#666')
        ctx.setTextAlign('left')
        ctx.fillText('美好事物，都与你分享！', left + 80, 75);

        // 价格
        ctx.setFontSize(28);
        ctx.setFillStyle('#ff0000')
        ctx.setTextAlign('left')
        ctx.fillText('￥69.00', left, width + 95);

        // 职位
        if (cardInfo.Position) {
          ctx.setFontSize(12)
          ctx.setFillStyle('#666')
          ctx.setTextAlign('left')
          ctx.fillText('这里显示的商品名称...', left, width + 115);
        }

        // 公司名称

        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, left + 160, width + 40, width / 3, width / 3)
          ctx.setFontSize(10);
          ctx.setFillStyle('#000');
          ctx.fillText("微信扫码或长按识别", left + 160, width + 150)
        }
        // 店铺logo
        ctx.drawImage(avaterSrc, left+50, 450, width / 4, width / 4)
        ctx.setFontSize(14)
        ctx.setFillStyle('#fff')
        ctx.setTextAlign('left')
        // 店铺名称
        ctx.setFontSize(12);
        ctx.setFillStyle('#000')
        ctx.setTextAlign('left')
        ctx.fillText(' 店铺名称', left + 125, 485);

      }).exec()

      setTimeout(function () {
        ctx.draw()
        wx.hideLoading()
      }, 1000)

    },
    /**
     * 多行文字处理，每行显示数量
     * @param text 为传入的文本
     * @param num  为单行显示的字节长度
     */
    textByteLength (text, num) {
      let strLength = 0 // text byte length
      let rows = 1
      let str = 0
      let arr = []
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2
          if (strLength > rows * num) {
            strLength++
            arr.push(text.slice(str, j));
            str = j
            rows++
          }
        } else {
          strLength++
          if (strLength > rows * num) {
            arr.push(text.slice(str, j))
            str = j
            rows++
          }
        }
      }
      arr.push(text.slice(str, text.length))
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    // 点击保存到相册
    saveShareImg () {
      var that = this
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {
            wx.hideLoading()
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success (res) {
                utils.aiCardActionRecord(19);
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function (res) {
                    if (res.confirm) { }
                  },
                  fail: function (res) { }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          }
        })
      }, 1000)
    }
  }
}
</script>
<style scoped>
.poste_box {
  width: 85%;
  margin: auto;
  margin-top: 50rpx;
  background-color: #fff;
  border: 1rpx solid #ddd;
  box-shadow: 0px 0px 10px 5px #d8d7dd;
}
.savePoste {
  background-color: #ff8427;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30rpx;
  color: #fff;
}
.saveTitle {
  font-size: 25rpx;
  color: #666;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20rpx;
  text-align: center;
}
</style>
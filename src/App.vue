<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
@charset "utf-8";

* {
  -webkit-box-sizing: border-box;

  box-sizing: border-box;
}

html {
  margin: 0px;
  padding: 0px;
  font-family: "PingFang", "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
  background: transparent;
}
 .empty {
    display: flex;
    justify-content: center;
    padding: 200rpx 0;
    flex-direction: column;
    align-items: center;
  }
  .empty img {
      width:190rpx;
      height:190rpx
    }
    .empty p {
      color: #999;
      padding-top: 20rpx;
      font-size: 28rpx;
    }
body {
  width: 100%;

  height: 100%;

  -webkit-overflow-scrolling: touch;
}
button:after {
  border: 0;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.btn {
  background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
  background-blend-mode: normal,normal;
}
.form-input {
  outline-style: none;
  border-radius: 3px;
  padding: 13px 14px;
  width: 100%;
  font-size: 14px;
}
.form-input::-webkit-input-placeholder { 
/* WebKit browsers */ 
color: #ccc; 
} 
.form-input:-moz-placeholder { 
/* Mozilla Firefox 4 to 18 */ 
color: #ccc; 
} 
.form-input::-moz-placeholder { 
/* Mozilla Firefox 19+ */ 
color: #ccc; 
} 
.form-input:-ms-input-placeholder { 
/* Internet Explorer 10+ */ 
color: #ccc; 
}
.bass-box {
  position: relative;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  padding: var(--cell-vertical-padding,10px) var(--cell-horizontal-padding,16px);
  font-size: 14px;
  font-size: var(--cell-font-size,14px);
  line-height: 24px;
  line-height: var(--cell-line-height,24px);
  color: #323233;
  color: var(--cell-text-color,#323233);
  background-color: #fff;
  background-color: var(--cell-background-color,#fff);
  border-bottom: 1px solid #eee;
}
.bass-box .label {
  width: 90px;
}
.bass-box input {
  padding:0
}
</style>

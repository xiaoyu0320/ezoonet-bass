let _loading = false
// var isShowToast = false
const host = 'http://bapi.ezoonet.com/'
function request (url, method, data, header = {}) {
  if (!_loading) {
    wx.showLoading({
      title: '加载中' // 数据请求前loading
    })
    _loading = true
  }

  return new Promise((resolve, reject) => {
    let obj = wx.getStorageSync('userinfo')
    let shopinfo = wx.getStorageSync('shopInfo')
    if (obj.uid && url !== 'shop/Login/doLogin') {
      data.uid = obj.uid
      data.token = obj.token
    }
    if (shopinfo && shopinfo.id) {
      data.shop_id = shopinfo.id
    }
    wx.request({
      url: host + url, // 仅为示例，并非真实的接口地址
      method: method,
      data: data,
      headers: {
        'content-type': 'application/json'// 默认值
      },
      success: function (res) {
        wx.hideLoading()
        _loading = false
        if (res.data.code === 300) {
          wx.showToast({
            title: res.data.msg,
            image: '/static/images/sigh.png',
            duration: 2000,
            success: function () {
              setTimeout(() => {
                wx.reLaunch({
                  url: '../../pages/login/main'
                })
              }, 2000)
            }
          })
        }
        if (res.data.code === 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return false
        }
        resolve(res.data)
      },
      // eslint-disable-next-line handle-callback-err
      fail: function (error) {
        wx.hideLoading()
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(false)
      },
      complete: function () {
        if (_loading) {
          wx.hideLoading()
          _loading = false
        }
      }
    })
  })
}
function get (obj) {
  return request(obj.url, 'GET', obj.data)
}
function post (obj) {
  return request(obj.url, 'POST', obj.data)
}

export default {
  request,
  get,
  post,
  host
}

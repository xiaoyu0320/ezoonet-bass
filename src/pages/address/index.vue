<template>
    <div class="address">
      <div class="address-list">
      
          <van-swipe-cell  v-for="(item,index) in addressList" :key="index" :right-width="65">
            <van-cell-group @click="choiceAddress(item)">
              <van-cell center :title="item.name"  :label="item.full_address" >
                  <div class="default-name" v-if="item.default == 1">默认</div>
                  <van-icon slot="right-icon" name="edit" class="custom-icon" size="20px" @click.stop="edit(item)"/>
              </van-cell>
            </van-cell-group>
            <view slot="right" style="height:100%"><van-button type="danger" @click="del(item.id)">删除</van-button></view>
          </van-swipe-cell>
      </div>
      <div class="address-item">
        <van-button type="danger" @click="confirm" size="large">+新建收货地址</van-button>
      </div>
      <van-toast id="van-toast" />
      <van-dialog id="van-dialog" />
      
    </div>
</template>
<script>

import Toast from '@/../static/vant/toast/toast'
import Dialog from '@/../static/vant/dialog/dialog'
export default {
  data () {
    return {
      showType: false,
      keyword: '', // 关键字
      page: 1,
      type: '0',
      addressList: [{
        id: '58',
        uid: 'dbffcb64acd09363058552e51ec4cc3b',
        address_province: '天津市',
        address_city: '天津市',
        address_qu: '和平区',
        address_info: '231231',
        sname: '陈默然',
        user_phone: '15200000000',
        address_town: '劝业场街道',
        province_nid: '7362',
        city_nid: '7363',
        qu_nid: '7364',
        town_nid: '7365',
        addtime: '1583749960'
      }],
      count: '',
      userinfo: {},
      jsonstr: '',
      linktype: 0
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    choiceAddress (item) {
      wx.setStorage({
        key: 'chosenAddressId',
        data: item.id
      })
      if (Number(this.linktype) === 0) {
        mpvue.navigateTo({url: '../paylist/main?json=' + this.jsonstr + '&linktype=' + 1})
      } else {
        mpvue.navigateTo({ url: '../addaddress/main?id=' + item.id })
      }
    },
    confirm () {
      mpvue.navigateTo({ url: '../addaddress/main?type=1' })
    },
    edit (item) {
      mpvue.navigateTo({ url: '../addaddress/main?id=' + item.id })
    },
    del (id) {
      let that = this
      Dialog.confirm({
        title: '删除地址',
        message: '您是否确定删除该地址'
      }).then(() => {
        let obj = {}
        obj.id = id
        that.$http.post({
          url: 'shop/address/delete',
          data: obj
        }).then(res => {
          if (res.code === 200) {
            Toast.success(res.msg)
            that._getAddress()
          }
        })
      }).catch(() => {})
    },
    // 获取所有地址
    _getAddress () {
      let obj = {}
      if (this.keyword) {
        obj.keyword = this.keyword
      }
      obj.page = this.page
      this.addressList = []
      this.$http.post({
        url: 'shop/address/list',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          this.count = res.data.count // 总数
          this.addressList = res.data.list
        }
      })
    }
  },
  onLoad (options) {
    if (options.json) {
      this.jsonstr = options.json
    }
    if (options.type) {
      this.linktype = options.type
    }
    this._getAddress()
  }
}
</script>
<style lang="scss" scoped>
  .default-name {
    width: 120rpx;
    height: 40rpx;
    text-align: center;
    line-height: 40rpx;
    border:1px  solid #eee;
    margin-left: 20rpx;
  }
  .settingBack.van-icon{
    transform: rotate(180deg);
    color: #323232 !important;
  }
  .address{
    width: 100%;
    height: 100vh;
    overflow: scroll;
    padding: 0 0 50px 0;
    .search{
      // background: url('/images/home/jianbian@2x.png')center center;
      background-size: cover ;
      background-color: #fff;
      .van-search{
        background: none !important;
      }
      .radio{
        margin-bottom: 10px;
        .van-radio-group{
          display: flex;
          justify-content: center;
          padding: 15px;
          div{
            padding: 0 12px;
          }
        }
      }
    }
    .address-list{
      padding-top: 10px;
      .van-button{
        display: inline-block;
        width: 73px;
        height: 100%;
      }
      .list-title{
        font-size: 19px;
        padding-bottom: 10px;
        span{
          padding-left: 25px;
        }
      }
      .list-area{
        font-size: 12px;
        color: #666666;
        text-overflow: ellipsis;
      }
      .list-edit{
        position: absolute;
        bottom: -5px;
        right: 0;
        width: 25px;
        z-index: 3000;
        display: inline-block;
        img{
          width: 100%;
        }
      }
    }
    .address-item{
      width: 80%;
      margin: 50px auto;
      position: fixed;
      bottom: -80rpx;
      left: 10%;
      .van-button--large{
        border-radius: 23.5px;
        font-size: 18px;
      }
    }
    .van-address-list__add{
      display: none !important;
    }
  }
</style>
<style >
.address-list .van-button {
  height: 100%;
}
</style>

<template>
  <div class="wrap">
    <div class="addAddress">
      <van-cell-group class="addAddress-form" :border="false">
        <div class="bass-box">
          <div class="label">收货人</div>
          <input class="form-input" v-model="addressInfo.name"  type="text"  name="name" placeholder="请填写收货人姓名"   @input="nameChange" />
        </div>
        <div class="bass-box">
          <div class="label">手机号</div>
          <input class="form-input" v-model="addressInfo.mobile"  type="text"  name="mobile" placeholder="请填写收货人手机号"   @input="phoneChange" />
        </div>
        <!-- <van-field v-model="addressInfo.name" label="收货人" placeholder="请填写收货人姓名" @blur="nameChange" /> -->
        <van-cell class="area" :border="false">
          <label>所在地区</label>
          <div>
            <span @click="picker(0,0)">{{province + ' '}}</span>
            <span @click="picker(province_nid,1)">{{city + ' '}}</span>
            <span @click="picker(city_nid,2)">{{qu + ' '}}</span>
            <span @click="picker(county_nid,3)">{{town + ' '}}</span>
          </div>
        </van-cell>
        <div class="bass-box" style="border-top:1px solid #eee">
          <div class="label">详细地址</div>
          <input class="form-input" v-model="addressInfo.address"  type="text"  name="address" placeholder="如街道、楼层、门牌号等"   @input="changeaddress" />
        </div>
        <!-- <van-field v-model="addressInfo.address" label="详细地址" placeholder="如街道、楼层、门牌号等" @input="changeaddress" /> -->
      </van-cell-group>
      <div class="cell-box">
          <label>设为默认地址</label>
          <van-switch :checked="checked" :active-value="1" :inactive-value="0" @change="onChange" size="40rpx" />
      </div>
      <div class="addAddress-item">
        <van-button type="danger" @click="save" size="large">保存</van-button>
      </div>
    </div>
    <van-popup :show="showPicker" position="bottom" @close="onClose"   custom-style="height: 40%">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
        <van-toast id="van-toast" />
  </div>
</template>
<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    return {
      areaList: '',
      id: '',
      searchResult: [],
      addressInfo: {
        address: '',
        name: '',
        mobile: '',
        uid: '',
        shop_id: '',
        token: '',
        default: 0
      },
      showPicker: false,
      nid: 0,
      other: '',
      columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
      province: '选择省',
      province_nid: '',
      city: '',
      city_nid: '',
      qu: '',
      county_nid: '',
      town: '',
      town_nid: '',
      areaclick: true, // 节流 防止重复点击,
      userinfo: {},
      shopinfo: {},
      checked: 0

    }
  },
  methods: {
    nameChange (val) {
      this.addressInfo.name = val.mp.detail.value
    },
    phoneChange (val) {
      this.addressInfo.mobile = val.mp.detail.value
    },
    onChange (val) {
      this.checked = val.mp.detail
    },
    changeaddress (val) {
      this.addressInfo.address = val.mp.detail
    },
    back () {
      this.$router.back()
    },
    onClose () {
      this.showPicker = false
    },
    _getAddressDetail (id) {
      var that = this
      this.$http.post({
        url: 'shop/address/edit',
        data: {
          'uid': this.userinfo.uid,
          'token': this.userinfo.token,
          'id': id,
          'shop_id': this.shopinfo.id
        }
      }).then(res => {
        let data = res.data
        that.addressInfo = {
          address: data.address,
          name: data.name,
          mobile: data.mobile,
          uid: data.uid
        }
        that.province = data.province
        that.province_nid = data.province_nid
        that.city = data.city
        that.city_nid = data.city_nid
        that.qu = data.county
        that.county_nid = data.county_nid
        that.town = data.town
        that.town_nid = data.town_nid
        that.checked = Number(data.default)
      })
    },
    getbanner () {
      this.$http.post({
        url: 'shop/index/banner',
        data: {}
      }).then(res => {

      })
    },
    save () {
      if (!this.addressInfo.name) {
        Toast('请填写收货人')
        return
      }
      if (!this.addressInfo.mobile) {
        Toast('请填写收货人手机号')
        return
      }
      // if (!this.addressInfo.name) {
      //   Toast('请填写详细地址')
      //   return
      // }
      if (this.id) {
        this.addressInfo.id = this.id
      }
      this.addressInfo.address_province = this.province
      this.addressInfo.province_nid = this.province_nid
      this.addressInfo.address_city = this.city
      this.addressInfo.city_nid = this.city_nid
      this.addressInfo.address_qu = this.qu
      this.addressInfo.county_nid = this.county_nid
      this.addressInfo.address_town = this.town
      this.addressInfo.town_nid = this.town_nid
      this.addressInfo.default = this.checked
      this.$http.post({
        url: 'shop/address/addPost',
        data: this.addressInfo
      }).then(res => {
        if (res.code === 200) {
          Toast.success(res.msg)
          setTimeout(() => {
            mpvue.navigateTo({ url: '../address/main' })
          }, 1500)
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
      // addAddress(this.addressInfo).then(res => {
      //   Toast.success(res.msg)
      //   this.$router.back()
      // })
    },
    onConfirm (val) {
      if (!this.areaclick) return
      switch (this.other) {
        case 0:
          this.province = val.mp.detail.value.text
          this.province_nid = val.mp.detail.value.nid
          this.qu = ''
          this.town = ''
          this.areaclick = false
          this.city = '选择市'
          this.showPicker = false
          this.picker(val.mp.detail.value.nid, 1)
          break
        case 1:

          this.city = val.mp.detail.value.text
          this.city_nid = val.mp.detail.value.nid
          this.areaclick = false
          this.qu = '选择区'
          this.showPicker = false
          this.picker(val.mp.detail.value.nid, 2)
          break
        case 2:
          this.qu = val.mp.detail.value.text
          this.county_nid = val.mp.detail.value.nid
          this.areaclick = false
          this.town = '选择街道'
          this.showPicker = false
          this.picker(val.mp.detail.value.nid, 3)
          break
        case 3:
          this.town = val.mp.detail.value.text
          this.town_nid = val.mp.detail.value.nid
          this.showPicker = false
          break
      }
    },
    picker (nid, other) {
      this.nid = nid
      this.other = other
      this._getArea()
      this.showPicker = true
    },
    _getArea () {
      let obj = {}
      obj.nid = this.nid
      this.$http.post({
        url: 'shop/address/getChildren',
        data: obj
      }).then(res => {
        if (res.data.length === 0) {
          switch (this.other) {
            case 2:
              this.qu = ''
              this.showPicker = false
              break
            case 3:
              this.town = ''
              this.showPicker = false
              break
          }
        }
        this.areaclick = true
        this.columns = res.data
        this.showNid = true
        this.columns.map(item => {
          item.text = item.name
        })
      })
    }
  },
  onLoad: function (options) {
    if (options != null && options.id && options.type !== 1) {
      this.id = options.id
      this._getAddressDetail(options.id)
    }
    if (options.type === '1') {
      this.checked = 0
      this.province = '选择省'
      this.city = ''
      this.qu = ''
      this.town = ''
      this.id = ''
      this.addressInfo = {
        address: '',
        name: '',
        mobile: '',
        uid: '',
        shop_id: '',
        token: '',
        default: 0,
        id: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .addAddressBack.van-icon{
    transform: rotate(180deg);
    color: #323232 !important;
  }
  .addAddress{
    height: 100vh;
    .addAddress-text{
      padding: 15px 15px 0 15px;
      height: 155px;
      // background: url('/images/home/jianbian@2x.png')center center;
      background-size: cover ;
      background-color: #fff;
      .van-field{
        overflow: hidden;
        border-radius: 16px;
        line-height: 22px;
      }
      .btn{
        padding: 5px;
        display: flex;
        justify-content: center;
        span{
          width: 78.5px;
          height: 30px;
          font-size: 12px;
          line-height: 30px;
          color: #e51c23;
          display: inline-block;
          border-style: solid;
          border-width: 1px;
          border-image-source: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%);
          border-image-slice: 1;
          text-align: center;
        }
      }
    }
    .addAddress-form{
      margin-top: 10px;
      .van-cell{
        font-size: 15px !important;
        color: #333333 !important;
        text-align: left !important;
      }
  
    }
    .addAddress-item{
      width: 80%;
      margin: 50px auto;
      .van-button--large{
        border-radius: 23.5px;
        font-size: 18px;
      }
    }
  }
  .cell-box {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 32rpx;
    border-bottom: 1px solid #ebedf0;
    height: 44rpx;
    label {
      font-size: 28rpx;
    }
  }
</style>
<style lang="scss" >
  .addAddress .addAddress-text .van-field__input--textarea {
    min-height: 78px !important;
}
    .area{
        .van-cell__value{
          display: flex;
          label{
            display: inline-block;
            min-width: 90px;
            text-align: left;
            color: #333;
          }
          div{
            flex: 1;
            text-align: left;
          }
        }
      }
</style>

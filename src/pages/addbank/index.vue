<template>
  <div class="bindbank">
    <div class="bank-content">
       <p>请绑定持卡人本人的银行卡</p>
       <div class="bank-list">
         <van-cell-group>
           <!-- <van-field
            v-model="card_name"
            label="持卡人"
            placeholder="请输入持卡人姓名"
            @change="changename"
            required
            clearable
          >
          </van-field> -->
          <div class="bass-box">
            <div class="label">持卡人</div>
            <input class="form-input" v-model="card_name"  type="text"  name="card_name" placeholder="请输入持卡人姓名"   @input="changename" />
          </div>
          <div class="bass-box">
            <div class="label">开户行</div>
            <input class="form-input" v-model="open_type"  type="text"  name="open_type" placeholder="请选择开户行"  :disabled = "bankFlag"   @click="showBankList"  @input="changetype" />
          </div>
          <div class="bass-box">
            <div class="label">支行</div>
            <input class="form-input" v-model="sub_branch"  type="text"  name="sub_branch" placeholder="请输入支行名称"     @input="changebranch" />
          </div>
          <div class="bass-box">
            <div class="label">银行卡号</div>
            <input class="form-input" v-model="card_no"  type="text"  name="card_no" placeholder="请输入银行卡号"    @input="changeno" />
          </div>
          <div class="bass-box">
            <div class="label">开户省市</div>
            <input class="form-input" v-model="area" @click="showaddress"  type="text"   name="area" placeholder="请选择开户省市"    @input="changecity" />
          </div>
          <div class="bass-box">
            <div class="label">手机号</div>
            <input class="form-input"   @keyup="mobile.replace(/[^\d]/g,'')" v-model="area" @click="showaddress"  type="number"   name="changemobile" placeholder="请输入手机号"    @input="changemobile" />
          </div>
          <!-- <van-field
            v-model="mobile"
            label="手机号"
            @keyup="mobile.replace(/[^\d]/g,'')"
            placeholder="请输入手机号"
              @change="changemobile"
            required
            clearable
            type="number"
          >
          </van-field> -->
        </van-cell-group>
        <div class="item">
          <van-button type="danger" @click="confirm" size="large">绑定</van-button>
        </div>
       </div>
    </div>
    <van-popup :show="bankFlag" position="bottom" close-on-click-overlay>
      <van-picker :columns="bankList" :default-index="index" @cancel="onCancel" @confirm="onConfirm"  show-toolbar></van-picker>
    </van-popup>
    <van-action-sheet :show="actions" :actions="areaList" @select="Select"></van-action-sheet>
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
      userInfo: '',
      card_no: '', // 卡号
      card_name: '', // 持卡人
      open_type: '', // 开户行id
      sub_branch: '', // 支行名称
      area: '', // 省市
      mobile: '', // 手机号
      bankList: [],
      bankFlag: false,
      actions: false,
      areaList: [],
      addressnum: 0,
      addressid: 0,
      index: 0,
      type: 0,
      areaclick: true
    }
  },
  methods: {
    changename (val) {
      this.card_name = val.mp.detail.value
    },
    changetype (val) {
      this.open_type = val.mp.detail.value
    },
    changeno (val) {
      this.card_no = val.mp.detail.value
    },
    changecity (val) {
      this.area = val.mp.detail.value
    },
    changemobile (val) {
      this.mobile = val.mp.detail.value
    },
    changebranch (val) {
      this.sub_branch = val.mp.detail.value
    },
    back () {
      this.$router.back()
    },
    _bindBankCard () {
      let obj = {}
      obj.card_no = this.card_no
      obj.type = this.type
      obj.sub_branch = this.sub_branch
      obj.area = this.area
      obj.card_name = this.card_name
      obj.mobile = this.mobile
      this.$http.post({
        url: 'shop/bank/addPost',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          Toast.success('添加成功')
        }
      })
    },
    confirm () {
      if (!this.card_no) {
        Toast('银行卡不能为空')
        return
      }
      if (this.card_no.length > 19) {
        Toast('银行卡格式错误')
        return
      }
      if (!this.open_type) {
        Toast('请选择开户行')
        return
      }
      if (!this.area) {
        Toast('省市选择不能为空')
      }
      if (!this.sub_branch) {
        Toast('支行名称不能为空')
        return
      }
      if (!this.card_name) {
        Toast('持卡人不能为空')
        return
      }
      if (!this.mobile) {
        Toast('持卡人联系方式不能为空')
        return
      }
      Dialog.confirm({
        title: '绑定',
        message: '您是否确认绑定该银行卡'
      }).then(() => {
        this._bindBankCard()
      })
    },
    // 选择地址
    Select (item) {
      console.log(item)
      if (!this.areaclick) {
        return
      }
      if (this.addressnum === 0) {
        this.area = item.mp.detail.name
        this.addressid = item.mp.detail.nid
        this.addressnum++
        this._getArea()
      } else if (this.addressnum === 1) {
        this.area = this.area + item.mp.detail.name
        this.actions = false
      }
      if (this.addressnum === 1 && this.actions === false) {
        this.addressid = 0
        this.addressnum = 0
      }
    },
    _getArea () {
      let obj = {
        nid: this.addressid
      }
      this.$http.post({
        url: 'shop/address/getChildren',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          this.areaList = res.data
        }
      }).catch((res) => {
        this.bankFlag = true
      })
    },
    // 银行卡选择弹窗
    showBankList () {
      this.bankFlag = true
    },
    showaddress () {
      this.actions = true
      this.area = ''
      this._getArea()
    },
    onCancel (picker, value, index) {
      this.bankFlag = false
    },
    onConfirm (val) {
      this.open_type = val.mp.detail.value.text
      this.type = val.mp.detail.index + 1
      this.index = val.mp.detail.index
      this.bankFlag = false
    },
    // 获取开户行列表
    _getOpenBank () {
      this.$http.post({
        url: 'shop/bank/getBankList',
        data: {
          'page': 1
        }
      }).then(res => {
        if (res.code === 200) {
          let arr = []
          res.data.forEach(item => {
            arr.push({
              text: item.name
            })
          })
          this.bankList = arr
        } else {
          Toast.fail(res.msg)
        }
      })
    }
  },
  onLoad () {
    this._getOpenBank()
    this._getArea()
  },
  onUnload () {
    // eslint-disable-next-line no-undef
    let pages = getCurrentPages()
    // 获取上一级页面，即pageA的page对象
    let prevPage = pages[pages.length - 2]
    prevPage.onLoad()
  }
}
</script>
<style lang="scss" scoped>
  .bindbank{
    background: #f5f6f7;
    height: 100vh;
    position: relative;
    .bank-content{
      text-align: left;
      padding: 15px 0;
      p{
        font-size: 12px;
        color: #333;
        padding: 10px;
      }
    }
    .adress-item{
      display:flex;
      justify-content: center;
      align-items: center;
      font-size:15px;
      font-weight: 400;
      padding: 15px 0;
      border-bottom:1px solid #e5e5e5;
    }
    .item{
      width: 80%;
      margin: 50px auto;
      .van-button--large{
        border-radius: 16px;
      }
    }
  }
</style>

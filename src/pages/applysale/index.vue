<template>
  <div class="sale">
    <van-checkbox-group :value="values" @change="groupclick">
      <van-cell-group >
    <div class="item" v-for="(item,i) in detail.detail" :key="i" >
      <van-checkbox  :name="i" @change="tagrclick" :disabled="item.can_refund ==0"></van-checkbox>
      <!-- <van-cell :border="false"></van-cell>  -->
      <van-card
        :num="item.qty"
        :title="item.goods_title"
        :thumb ="item.goods_primary_img"
        :price="item.price"
        style="flex:2;background:#fff"
      >
        <view slot="desc">
            <span v-for="(sepc,index) in detail.detail[i].option_name" :key="index">{{sepc}}</span>
        </view>
        <view slot="price">
          <van-stepper :value=" 1 " @change="onChange" />
        </view>
      </van-card>
     </div> 
     </van-cell-group>
    </van-checkbox-group> 
   <div class="totle-price">
      实付款：<span>{{detail.pay_price}}</span> (含运费{{detail.express_price}})
   </div>
   <div class="reson">
     <van-cell title="退款理由" is-link  @click="show = true" :value="renson" />
      <van-field
        :value="message"
        label="留言"
        type="textarea"
        placeholder="请输入留言"
        input-align="right"
        @change="messagechange"
        autosize
      />
       <van-field
         label="退款金额"
        :value="price"
        placeholder="退款金额"
         input-align="right"
         @change="pricechange"
      />
      <div style="padding:20rpx">
        <van-uploader :file-list="fileList" @afterread="afterRead" @delete="deleteimg"  />
      </div>
      <div class="sumbit">
           <van-button type="default" size="large" @click="sumbit">提交</van-button>

      </div>
   </div>
    <van-toast id="van-toast" />
    <van-action-sheet
      :show="show"
      :actions="actions"
      @close="onClose"
     @select="onSelect"
    />
  </div>
</template>
<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    return {
      index: '',
      id: '', // 订单id
      type: '', // 售后类型
      fileList: [],
      values: [],
      message: '',
      detail: {
        detail: []
      },
      show: false,
      renson: '请选择',
      price: '',
      actions: [
        {
          name: '缺货'
        },
        {
          name: '协商一致退款'
        },
        {
          name: '未按约定时间发货'
        },
        {
          name: '拍错/多拍/不想要'
        },
        {
          name: '其它'
        }
      ]
    }
  },
  methods: {
    deleteimg (val) {
      this.fileList.splice(val.mp.detail.index, 1)
    },
    messagechange (val) {
      this.message = val.mp.detail
    },
    pricechange (val) {
      this.price = val.mp.detail
    },
    sumbit () {
      let imglist = []
      let str = {}
      let obj = {}
      // 上传图片数组
      this.fileList.map(data => {
        imglist.push(data.url)
      })
      // 退款信息
      this.detail.detail.forEach(item => {
        this.values.forEach(ac => {
          if (item.active === Number(ac)) {
            str[item.id] = item.qty
          }
        })
      })
      if (!str) {
        Toast.fail('请选择退款商品')
        return false
      }
      if (!this.price) {
        Toast.fail('请填写退款金额')
        return false
      }
      if (this.renson === '请选择' || !this.renson) {
        Toast.fail('请选择退款理由')
        return false
      }
      str = JSON.stringify(str)

      imglist = JSON.stringify(imglist)
      obj.img_list = imglist
      obj.type = this.type
      obj.note = this.renson + this.message
      obj.refund_list = str
      obj.refund_amount = this.price
      obj.order_id = this.id
      this.$http.post({
        url: 'shop/After_sale/applyPost',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          Toast.success('提交成功')
          setTimeout(() => {
            mpvue.navigateTo({ url: '../sale/main' })
          }, 1500)
        }
      })
    },
    tagrclick (val) {
      // this.values.push(val)
    },
    groupclick (val) {
      console.log(val)
      this.values = val.mp.detail
    },
    afterRead (event) {
      const { file } = event.mp.detail
      let that = this
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      wx.uploadFile({
        url: 'http://bapi.ezoonet.com/shop/After_sale/upload', // 仅为示例，非真实的接口地址
        filePath: file.path,
        name: 'file',
        formData: { user: 'test' },
        success (res) {
          let data = JSON.parse(res.data)
          that.fileList.push({
            url: data.data.url
          })
        }
      })
    },
    getindex (index) {
      this.index = index
    },
    onSelect (val) {
      this.renson = val.mp.detail.name
      this.show = false
    },
    onClose () {

    },
    onChange (val) {

    },
    getsale () {
      this.$http.post({
        url: 'shop/After_sale/apply',
        data: {
          'order_id': this.id
        }
      }).then(res => {
        this.detail = res.data
        this.detail.detail.map((data, index) => {
          data.active = index
        })
      })
    }
  },
  onLoad (options) {
    this.price = ''
    this.message = ''
    this.renson = '请选择'
    this.values = []
    this.id = options.id
    this.type = options.type
    this.getsale()
  }
}
</script>
<style lang="scss" scoped>
  .item {
    display: flex;
    align-items: center;
    padding: 20rpx;
  }
  .totle-price {
    display: flex;
    align-items: center;
    border-top: 1px  solid #eee;
    font-size: 28rpx;
    padding: 20rpx;
  }
  .sumbit {
    width: 80%;
    margin: 0 auto;
  }
</style>
<style>
 .sale .item .van-card  {
   background: #fff;
 }
 .sumbit .van-button {
  background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
  color: #fff;
 }
</style>
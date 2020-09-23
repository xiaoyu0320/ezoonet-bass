<template>
  <div class="bankCard">
    <div class="list" v-if="bankList.length>0">
        <van-swipe-cell  v-for="(item,index) in bankList" :key="index" :right-width="65" >
            <van-cell-group >
              <van-cell center  @click="gocash(item)" :value="item.card_no">
                 <view slot="title">
                   <div class="info">
                      <img :src="item.img" style="width:120rpx" mode="widthFix" >  {{item.card_name}}
                   </div>
                 </view>
              </van-cell>
            </van-cell-group>
            <view slot="right" style="height:100%"> <van-button @click="onClose(item.id)" square type="danger" >删除</van-button></view>
          </van-swipe-cell>
     </div>     
     <div class="empty" @click="gobind"  style="padding:20rpx 0">
      <span>+添加银行卡</span>
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
      page: 1,
      bankList: []
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    onClose (id) {
      let that = this
      Dialog.confirm({
        title: '删除银行卡',
        message: '您是否确定删除银行卡'
      }).then(() => {
        let obj = {
          id: id
        }
        this.$http.post({
          url: 'shop/bank/delete',
          data: obj
        }).then(res => {
          Toast.success(res.msg)
          that.bankList = []
          that._getBankCard()
        })
      })
    },
    _getBankCard () {
      let obj = {}
      obj.page = this.page
      this.$http.post({
        url: 'shop/bank/list',
        data: obj
      }).then(res => {
        this.bankList = res.data.list
      })
    },
    gobind () {
      mpvue.navigateTo({ url: '../addbank/main' })
    },
    gocash (item) {
      mpvue.navigateTo({ url: '../cashout/main?id=' + item.id + '&card_name=' + item.card_name + '&card_no=' + item.card_no })
    }
  },
  onLoad () {
    this._getBankCard()
  }

}
</script>
<style lang="scss" scoped>
  .bankCard{
    height: 100vh;
    background: #f5f6f7;
    main{
      padding-top: 10px;
    }
     .empty{
      overflow: hidden;
      text-align: center;
      font-size: 17px;
      color: #333;
      height: 44px;
      line-height: 44px;
      background: #fff;
      margin-top: 15px;
   }
   .info {
     display: flex;
     align-items: center;
     img {
       margin-right:20rpx
     }
   }
  }
</style>
<style>
 .bankCard .list .van-button {
  height: 100%;
}
</style>
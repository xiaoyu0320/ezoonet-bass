<template>
  <div class="bankdetail">
    <van-cell-group>
      <van-cell title="流水号" :value="detail.serial_num" />
      <van-cell title="类型" :value="detail.from" />
      <van-cell title="支出" :value="detail.money" />
      <van-cell title="支付方式" :value="detail.pay_type_name" />
      <van-cell title="时间" :value="detail.create_time" />
      <van-cell title="余额" :value="detail.balance_money" />
    </van-cell-group>
    <van-toast id="van-toast" />
  
  </div>
</template>
<script>
// import Toast from '@/../static/vant/toast/toast'
// import Dialog from '@/../static/vant/dialog/dialog'
export default {
  data () {
    return {
      id: 14,
      detail: {}
    }
  },
  methods: {
    getlist () {
      this.$http.post({
        url: 'shop/withdraw/detail',
        data: {
          status: this.type,
          id: this.id,
          page: this.page
        }
      }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        }
      })
    }
  },
  onLoad (options) {
    this.id = options.id
    this.type = options.type
    this.getlist()
  }

}
</script>
<style lang="scss" scoped>
  .list {
    padding: 30rpx;
    .item {
      border-bottom: 1px solid #eee;
      padding-bottom: 20rpx;
      .cell {
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
      }
      .flex-end {
        text-align: right;
        margin-top:10rpx
      }
    }
  }
</style>

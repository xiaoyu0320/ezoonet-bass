<template>
  <div class="bankCard">
    <div class="list" v-for="(item,i) in widthdraw" :key="i">
       <div class="item" @click="godetail(item.id)">
          <div class="cell">
              <span>{{item.remarks}}</span>
              <span> {{item.money}}元</span>
          </div>
           <div class="cell flex-end">
              <span>{{item.create_time}}</span>
              <span>余额：{{item.after_money}}</span>
          </div>
       </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>
<script>
// import Toast from '@/../static/vant/toast/toast'
// import Dialog from '@/../static/vant/dialog/dialog'
export default {
  data () {
    return {
      page: 1,
      widthdraw: [],
      nodata: false,
      logStatus: 0
    }
  },
  methods: {
    getlist () {
      if (this.nodata === true) {
        return false
      }
      this.$http.post({
        url: 'shop/Balance/list',
        data: {
          page: this.page
        }
      }).then(res => {
        if (res.code === 200) {
          if (this.page === 1 && res.data.count <= 0) {
            this.logStatus = 1
          }
          if (res.data.count > this.widthdraw.length) {
            this.widthdraw = this.widthdraw.concat(res.data.list)
            this.page = this.page + 1
          }
          if (res.data.page_count < this.page) {
            this.nodata = true
            this.logStatus = 2
          }
        }
      })
    },
    godetail (id) {
      mpvue.navigateTo({ url: '../balancedetail/main?id=' + id })
    }
  },
  onLoad () {
    this.nodata = false
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

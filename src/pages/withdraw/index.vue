<template>
  <div class="bankCard">
    <div class="item-name" @click="goself" v-if="type==1">查看失败记录</div>
    <div class="list" v-for="(item,i) in widthdraw" :key="i">
       <div class="item" @click="godetail(item.id)">
          <div class="cell">
              <span>{{item.status_name}}</span>
              <span> {{item.money}}元</span>
          </div>
           <div class="cell flex-end">
              <span>{{item.create_time}}</span>
              <span>转入银行卡</span>
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
      type: 1
    }
  },
  methods: {
    goself () {
      this.type = 3
    },
    getlist () {
      this.$http.post({
        url: 'shop/withdraw/list',
        data: {
          status: this.type,
          page: this.page
        }
      }).then(res => {
        if (res.code === 200) {
          this.widthdraw = res.data.list
        }
      })
    },
    godetail (id) {
      mpvue.navigateTo({ url: '../withdetail/main?id=' + id + '&type=' + this.type })
    }
  },
  onLoad () {
    this.type = 1
    this.getlist()
  },
  watch: {
    type (val) {
      let title = ''
      if (this.type === 1) {
        title = '提现记录'
      } else {
        title = '提现失败'
      }
      wx.setNavigationBarTitle({
        title: title
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.item-name {
 padding: 30rpx 30rpx 0 0;
 display: flex;
 justify-content: flex-end;
 align-items: center;
 font-size: 28rpx;
}
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

<template>
  <div class="spread" style="background:url('http://cdnpic.ezoonet.com/baas/file/20200624/588da9cc5bd183ec62d57bda13ee75bf.png');background-size:cover">
      <div class="card">
         <div class="item">
             可提现(元)
             <div class="price">
               {{detail.stayRevenue}}
             </div>
         </div>
         <div class="item">
             待入账(元)
             <div class="price">
                {{detail.totalRevenue}}
             </div>
         </div>
      </div>
      <div class="card-box">
         <van-cell-group>
        <van-cell title="我推广的用户" @click="godetail('../spreadlist/main')" is-link />
        <van-cell title="我推广的订单"  is-link />
        <van-cell title="我的推广海报"  is-link />
        <van-cell title="我的上级" :value="detail.userInfo.nickname" use-label-slot> 
            <view slot="label">
              {{detail.userInfo.mobile}}
            </view>
        </van-cell>
      </van-cell-group>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      detail: {
        userInfo: {
          nickname: ''
        }
      }
    }
  },
  computed: {

  },
  methods: {
    getdetail () {
      this.$http.post({
        url: 'shop/promotion/my',
        data: {}
      }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        }
      })
    },
    godetail (url) {
      mpvue.navigateTo({ url })
    }
  },
  onLoad () {
    this.getdetail()
  }
}
</script>

<style lang="scss" scope>
  .card {
    height: 294rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      color: #fff;
      font-size: 28rpx;
      .price {
       color: #feefbb;
       font-size: 40rpx;
       margin-top: 20rpx;
      }
    }
  }
</style>

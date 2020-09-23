<template>
  <div class="spread" >
      <div class="card" style="background:url('http://cdnpic.ezoonet.com/baas/file/20200624/588da9cc5bd183ec62d57bda13ee75bf.png');background-size:cover">
         <div class="item">
            余额(元)
             <div class="price">
               {{detail.freeze_money}}
             </div>
         </div>
         <div class="item">
             冻结(元)
             <div class="price">
                {{detail.frozen_money}}
             </div>
         </div>
         <div class="item">
             可提现(元)
             <div class="price">
               {{detail.money}}
             </div>
         </div>
         <div class="item">
             待入账(元)
             <div class="price">
                {{detail.to_be_recorded}}
             </div>
         </div>
      </div>
      <div class="card-box">
        <van-cell-group>
          <van-cell title="可提现金额转入余额" @click="godetail('../cashout/main?type=1')" is-link />
          <van-cell title="去提现" @click="godetail('../cashout/main?type=2')" is-link />
          <van-cell title="余额明细" @click="godetail('../balance/main')" is-link />
          <van-cell title="我的银行卡" @click="godetail('../bank/main')" is-link  />
       </van-cell-group>
      </div>
      <div class="card-ex">
         <div class="title">说明</div>
         <p>1、余额，只能用于消费，不能提现</p>
          <p>2、可提现，只能用于提现或转入余额，不能直接消费</p>
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
        url: 'shop/my/myBalance',
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
    this.detail = {
      userInfo: {
        nickname: ''
      }
    }
    this.getdetail()
  }
}
</script>

<style lang="scss" scope>
  .card {
    height: 294rpx;
    display: flex;
    align-items: center;
    flex-direction: row;
		flex-wrap: wrap;
    justify-content: space-between;
    .item {
     width: 50%;
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
  .card-ex {
    padding: 30rpx;
     p{
       font-size: 24rpx;
       margin-top:20rpx
     }
  }
</style>

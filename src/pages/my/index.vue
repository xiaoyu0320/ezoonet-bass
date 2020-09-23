<template>
  <div class="my">
      <div class="box" style="background:url('http://cdnpic.ezoonet.com/baas/file/20200624/7d9ff47160378c63b00538c2414192bf.png') no-repeat center;background-size: cover;">
        <div class="flex">
            <div class="avater">
              <img :src="info.avatar">
            </div>
            <div class="txt">
                <h3>{{info.nickname}} </h3>
                  <p>邀请码:{{info.invite_code}}</p>
            </div>
            <div class="share" style="margin-left:auto">
              <img src="/static/images/my/share.png"> 分享
            </div>
        </div>
        <div class="relative" style="background:url('http://cdnpic.ezoonet.com/baas/file/20200624/588da9cc5bd183ec62d57bda13ee75bf.png') no-repeat;background-size:cover">
          <div class="item" @click="go('../balance/main')" >
             <p>账户余额(元)</p>
              <h3>{{info.freeze_money}}</h3>
          </div>
           <div class="item" v-if="info.all_money">
            <p>待入账(元)</p>
             <h3>{{info.all_money.frozen_money}}</h3>
          </div>
           <div class="item" v-if="info.all_money"  @click="go('../withdraw/main?type=1')">
            <p>冻结账户余额(元)</p>
             <h3>{{info.all_money.to_be_recorded}}</h3>

          </div>
        </div>
      </div>
      <div class="contain">
         <div class="menu">
            <div class="item" v-for="(item,i) in menu" :key="i" @click="golink(item)">
               <img :src="item.icon" mode="widthFix" style="width:47rpx">
               {{item.name}}
            </div>
         </div>
         <div class="card">
             <div class="item" v-for="(card,index) in cardArr" :key="index" @click="golink(card)">
               <div class="item-av">
                  <img :src="card.icon" mode="widthFix">
                {{card.name}}
               </div>
                 <van-icon name="arrow" />
             </div>
         </div>
          <div class="card">
             <div class="item" v-for="(card,index) in cardArr1" :key="index" @click="golink(card)">
               <div class="item-av">
                  <img :src="card.icon" mode="widthFix">
                {{card.name}}
               </div>
                 <van-icon name="arrow" />
             </div>
         </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: [{
        name: '待付款',
        icon: require('@/../static/images/my/unpay.png'),
        url: '../order/main?type=0'
      },
      {
        name: '待收货',
        icon: require('@/../static/images/my/uns.png'),
        url: '../order/main?type=2'
      },
      {
        name: '已完成',
        icon: require('@/../static/images/my/done.png'),
        url: '../order/main?type=3'
      },
      {
        name: '售后',
        icon: require('@/../static/images/my/sale.png'),
        url: '../sale/main'
      },
      {
        name: '全部订单',
        icon: require('@/../static/images/my/order.png'),
        url: '../order/main?type=-1'
      }],
      cardArr: [{
        name: '我的推广',
        icon: require('@/../static/images/my/tg.png'),
        url: '../spread/main'
      }, {
        name: '我的钱包',
        icon: require('@/../static/images/my/wallet.png'),
        url: '../wallet/main'
      }, {
        name: '地址管理',
        icon: require('@/../static/images/my/address.png'),
        url: '../address/main?type=1'
      }],
      cardArr1: [ {
        name: '联系客服',
        icon: require('@/../static/images/my/kefu.png')
      }, {
        name: '设置',
        icon: require('@/../static/images/my/setting.png'),
        url: '../user/main'
      }],
      info: {}
    }
  },
  computed: {

  },
  methods: {
    go (url) {
      mpvue.navigateTo({ url })
    },
    golink (item) {
      let url = item.url
      mpvue.navigateTo({ url })
    },
    getmy () {
      this.$http.post({
        url: 'shop/my/userInfo',
        data: {}
      }).then(res => {
        if (res.code === 200) {
          this.info = res.data
        }
      })
    }
  },
  onShow () {
    this.getmy()
    // wx.setNavigationBarTitle({
    //   title: '我的'
    // })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff', // 必写项
    //   backgroundColor: '#f8493e' // 传递的颜色值
    // })
  }
}
</script>

<style lang="scss" scope>
.my {
    min-height: 100%;
    background:#fafafa;
  .box {
    background: #f8493e;
    height: 323rpx;
    padding: 30rpx;
    box-sizing: border-box;
    position: relative;
    .flex {
      display: flex;
      color: #fff;
      justify-content: flex-start;
      align-items: center;
    
    .avater {
      img{
        width:100rpx;
        height: 100rpx;
        border-radius: 100%;
      }
    }
    .txt {
      margin-left: 30rpx;
      h3 {
        font-size: 32rpx;
        color: #333;
        img {
          width: 22rpx;
          height: 20rpx;
          margin-left: 10rpx;
        }
      }
      p{
        font-size: 24rpx;
        color: #878074;
        margin-top:10rpx
      }
    }
     .share {
        width: 122rpx;
        height: 46rpx;
        background-color: #9b8148;
        border-radius: 23rpx;
        font-size: 24rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 21rpx;
          height: 21rpx;
          margin-right: 10rpx;
        }
      }
     
    }  
     .relative {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 60rpx);
        margin: 0 auto;
        height: 133rpx;
        
        background-image: linear-gradient(180deg, 
        #15537f 0%, 
        #11426f 100%), 
      linear-gradient(
        #11426f, 
        #11426f);
      background-blend-mode: normal, 
        normal;
        border-radius: 20rpx 20rpx 0 0;
        padding: 0 40rpx;
        box-sizing: border-box;

        position: absolute;
        bottom: 0;
         .item {
            h3 {
              font-size: 36rpx;
              color: #feefbb;
              text-align: center;
            }
            p {
              color: #fff;
              font-size: 20rpx;
              margin-bottom:10rpx ;
            }
         }
      }
  }
  .contain {

    padding: 30rpx;
    .menu {
      display: flex;
      justify-content: space-between;
      color: #333;
      font-size: 24rpx;
      .item {
        display: flex;
        flex: 1;
        justify-content: center;
        flex-direction: column;
         align-items: center;
         img {
          max-width: 47rpx;
          height: 40rpx;
          margin-bottom: 10rpx;
          }
      }
     
    }
    .card {
      margin:30rpx 0;
      background: #fff;
      border-radius: 20rpx;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        color: #292c34;
        padding: 40rpx;
        border-bottom: 1px solid #efefef;
        .item-av {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        img {
          height: 46rpx;
          width: 46rpx;
          margin-right: 20rpx;
        }
      }
    }
  }
}
</style>

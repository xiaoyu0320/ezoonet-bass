<template>
  <div class="afterSale">
    <van-tabs  @change="handleTabClick" :swipeThreshold="8" :active="active" sticky :border="false">
        <van-tab title="全部" :name="1"></van-tab>
        <van-tab title="处理中" :name="2"></van-tab>
        <van-tab title="已完成" :name="3"></van-tab>
    </van-tabs>
        <div class="goods-item" v-if="afterList.length>0">
          <div v-for="(item,index) in afterList" :key="index" class="item">
            <!-- 订单标题 -->
            <van-cell-group class="order-title">
              <van-cell :border="false">
                <div class="order_no">
                   {{item.shop_name}}
                     <p  class="status_box">{{item.status_name}}</p>
                </div>
                
              </van-cell>
              <!-- 商品详情 -->
                 <van-card
                    v-for="(card,i) in item.detail_list"
                    :key="i"
                    class="goods-card"
                    :title="card.goods_title"
                    :thumb="card.goods_primary_img.middle_pic"
                    :num="card.qty"
                    :price="card.price"
                    @click="detail(item)"
                  >
                    <div  slot="desc" class="goods-desc">
                      <p >{{card.option_name}}</p>
                    </div>
                  </van-card>
              <!-- 商品数量与合计 -->
              <van-cell class="goods_num">
                 
                <span style="padding-right:20rpx">共{{item.total_qty}}件 合计:￥<span class="price">{{item.price}}</span></span>
                 <van-button size="small" @click="cancel(item)" v-if="item.status==0 ||item.status==1 ">取消售后</van-button>
                  <van-button size="small" @click="confirms(item)" v-if="item.status==1 ">确认退货</van-button>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
        <div class="empty" v-else>
          <img src="/static/images/empty/order.png" >
          <p>暂无售后~</p>
      </div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
  </div>
</template>
<script>
import Dialog from '@/../static/vant/dialog/dialog'
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    return {
      uid: '',
      after_status: -1,
      page: 1,
      afterList: [],
      isLoading: false,
      loading: false,
      finished: false,
      active: 1
    }
  },
  methods: {
    confirms (item) {
      this.$http.post({
        url: 'shop/After_sale/confirm',
        data: {
          'id': this.id,
          'express_name': item.express_name,
          'express_no': item.express_no
        }
      }).then(res => {
        if (res.code === 200) {
          this.afterList = []
          this._getAfterSale()
          Toast.success(res.msg)
        }
      })
    },
    cancel (item) {
      Dialog.confirm({
        title: '提示',
        message: '确定取消退款吗'
      })
        .then(() => {
          this.$http.post({
            url: 'shop/After_sale/cancel',
            data: {
              'id': item.id
            }
          }).then(res => {
            if (res.code === 200) {
              this.afterList = []
              this._getAfterSale()
              Toast.success(res.msg)
            }
          })
        })
    },
    handleTabClick (val) {
      this.active = val.mp.detail.name
      this.afterList = []
      this._getAfterSale()
    },
    back () {
      this.$router.back()
    },
    detail (item) {
      wx.navigateTo({
        url: '/pages/saledetail/main?id=' + item.id
      })
    },
    // 获取售后列表
    _getAfterSale () {
      let obj = {}
      obj.page = this.page
      obj.after_status = this.after_status
      this.$http.post({
        url: 'shop/After_sale/list',
        data: {
          'status': this.active,
          'page': this.page
        }
      }).then(res => {
        if (res.code === 200) {
          this.afterList = this.afterList.concat(res.data.list)
          this.afterList.map(item => {
            const result = item.spec_cname.map((key, index) => {
              return {
                class: key,
                name: item.option_name[index]
              }
            })
            item.option = result
          })
        } else {
          Toast.fail(res.msg)
        }
      })
    }

  },
  onLoad () {
    this.afterList = []
    this._getAfterSale()
  },
  onUnload () {
    mpvue.switchTab({ url: '../my/main' })
  }
}
</script>
<style lang="scss" scoped>
  .afterSale{
    overflow: auto;
    width: 100%;
    height: 100vh;
    background: #f5f6f7;
    .afterSaleBack.van-icon{
      transform: rotate(180deg);
      color: #323232 !important;
    }
    .goods-item{
      .item{
        margin-top: 10px;
        .order-title{
          .van-cell__value{
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .order_no{
            text-align: left;
            border-bottom: 1px solid #eee;
            padding-bottom: 20rpx;
            display: flex;
            justify-content: space-between;
            span{
              width: 44px;
              height: 22px;
              display: inline-block;
              text-align: center;
              line-height: 22px;
              font-size: 12px;
              color: #333333;
              border-radius: 4px;
              border: solid 1px #333333;
            }
          }
          .status_box{
            color: #ff7800;
            font-size: 13px;
          }
          .goods_num{
            .van-cell__value{
              justify-content: flex-end;
              span{
                font-size: 12px;
                color: #333333;
                .price{
                  font-size: 17px;
                }
              }
              .shop{
                margin-left: 30px;
                width: 67px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-style: solid;
                border-width: 1px;
                border-image-source: linear-gradient(-30deg,#e51c23 0%,#ff362b 100%);
                border-image-slice: 1;
                border-image: 20px;
              }
            }
          }
        }
      }
    }
  }
</style>
<style >
.afterSale .van-card {
  background: #fff!important;
}
.afterSale .van-card__content {
  border-bottom: 1px solid #eee;
}
</style>
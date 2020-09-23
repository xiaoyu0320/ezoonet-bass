<template>
  <div class="afterSale afterdetail">
        <div class="goods-item">
           <div class="icon"></div>
           <div class="goods-info">
              <p>{{detail.status_name}}</p>
              <p>拒绝原因：{{detail.note}}</p>
           </div>
        </div>
        <div class="goods-item">
           <h3>售后单信息</h3>
           <div class="item">
              <label>退款类型：</label>
              <div class="text">{{detail.type_name}}</div>
           </div>
            <div class="item">
              <label>退款金额：</label>
              <div class="text">{{detail.price}}</div>
           </div>
           <div class="item">
              <label>订单编号：</label>
              <div class="text">{{detail.order_no}}</div>
           </div>
            <div class="item">
              <label>售后编号：</label>
              <div class="text">{{detail.returns_order_no}}</div>
           </div>
            <div class="item">
              <label>退款原因：</label>
              <div class="text">{{detail.note}}</div>
           </div>
           <div class="item">
              <label>凭证：</label>
              <div class="text">
                 <img :src="item.middle_pic" v-for="(item,i) in detail.img_list" :key="i" style="width:160rpx" mode="widthFix">
              </div>
           </div>
            <div class="item">
              <label>申请时间</label>
              <div class="text">{{detail.create_time}}</div>
           </div>
        </div>
        <div class="goods-item">
            <!-- 订单标题 -->
            <van-cell-group class="order-title" :border="false">
              <!-- 商品详情 -->
                 <van-card
                    v-for="(card,i) in detail.detail_list"
                    :key="i"
                    class="goods-card"
                    :title="card.goods_title"
                    :thumb="card.goods_primary_img.middle_pic"
                    :num="card.qty"
                    :price="card.price"
                  >
                    <div  slot="desc" class="goods-desc">
                      <p >{{card.option_name}}</p>
                    </div>
                  </van-card>
              <!-- 商品数量与合计 -->
            </van-cell-group>
        </div>
        <div class="goods-item" v-if="detail.status!=0 ">
            <h3>退货物流</h3>
            <div class="item">
               <label>退货地址：</label>
               <div class="text">
                {{detail.address_info}}
               </div>
            </div>
            <div class="item">
               <label>收件人：</label>
               <div class="text">
                 {{detail.name}}  -  {{detail.mobile}}
               </div>
            </div>
        </div>
          <div class="goods-item" v-if="detail.status!=0 ">
            <h3>物流信息 </h3>
            <div class="item">
               <label>物流公司：</label>
               <div class="text">

                 <van-field
                  :value="detail.express_name"
                  placeholder="请输入物流公司"
                  @change="namechange"
                />
               </div>
            </div>
            <div class="item">
               <label>物流单号：</label>
               <div class="text">
                  <van-field
                  :value="detail.express_no"
                  placeholder="请输入物流单号"
                  @change="changeno"
                />
               </div>
            </div>
        </div>
        <div class="opeate" v-if="detail.type == 1">
           <van-button size="small" @click="cancel" v-if="detail.status==0 ||detail.status==1 ">取消售后</van-button>
           <van-button size="small" @click="confirms" v-if="detail.status==1 ">确认退货</van-button>
           <van-button size="small" @click="reconfirms" v-if="detail.status==2 ">确认修改</van-button>
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
      detail: {
        express_name: '',
        express_no: ''
      },
      id: ''
    }
  },
  methods: {
    changeno (val) {
      this.detail.express_no = val.mp.detail
    },
    namechange (val) {
      this.detail.express_name = val.mp.detail
    },
    cancel () {
      Dialog.confirm({
        title: '提示',
        message: '确定取消退款吗'
      })
        .then(() => {
          this.$http.post({
            url: 'shop/After_sale/cancel',
            data: {
              'id': this.id
            }
          }).then(res => {
            if (res.code === 200) {
              this.detail = {}
              this._getAfterSale()
              Toast.success('取消成功')
            }
          })
        })
        .catch(() => {
        })
    },
    confirms () {
      this.$http.post({
        url: 'shop/After_sale/confirm',
        data: {
          'id': this.id,
          'express_name': this.detail.express_name,
          'express_no': this.detail.express_no
        }
      }).then(res => {
        if (res.code === 200) {
          Toast.success(res.data.msg)
          this.detail = {}
          this._getAfterSale()
        }
      })
    },
    reconfirms () {
      this.$http.post({
        url: 'shop/After_sale/edit',
        data: {
          'id': this.id,
          'express_name': this.detail.express_name,
          'express_no': this.detail.express_no
        }
      }).then(res => {
        if (res.code === 200) {
          Toast.success(res.data.msg)
          this.detail = {}
          this._getAfterSale()
        }
      })
    },
    // 获取售后详情
    _getAfterSale () {
      this.$http.post({
        url: 'shop/After_sale/detail',
        data: {
          'id': this.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        } else {
          Toast.fail(res.msg)
        }
      })
    }

  },
  onLoad (options) {
    this.detail = {
      express_name: '',
      express_no: ''
    }
    this.id = options.id
    this._getAfterSale()
  }
}
</script>
<style lang="scss" scoped>
  .afterSale{
    overflow: auto;
    width: 100%;
    height: 100vh;
    background: #f5f6f7;
    position: relative;
    padding-bottom: 60rpx;
    .goods-item{
       background: #fff;
       margin-bottom: 20rpx;
       padding: 30rpx;
       font-size: 28rpx;
       .item {
         display: flex;
         align-items: center;
         padding: 20rpx 0;
         font-size: 24rpx;
         label{
           padding-right: 20rpx;
         }
       }
    }
    .opeate {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 20rpx;
      background: #fff;
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
      border-top: 1px solid #eee;
      z-index: 99;
    }
  }
</style>
<style >
.afterdetail .van-card {
  background: #fff!important;
  padding:0
}
.opeate .van-button {
  margin-left:20rpx ;
}
</style>
<template>
  <!-- 商品卡片 -->
  <van-card
    class="goods-card"
    :title="item.goods_title"
    :thumb="setup === 1 ? item.goods_primary_img.middle_pic : img"
  >
    <div slot="desc" :class="setup === 1 ? 'goods-desc cut' : 'goods-desc'">
      <template v-for="(opt,index) in item.option">
        <p :key="index">{{opt.class + '：' + opt.name}}</p>
      </template>
      <p>款号：{{item.goods_code}}</p>
      <span v-if="setup === 2" class="goods-num" slot="num">x{{item.total_num}}</span>
    </div>
  </van-card>
</template>
<script>
export default {
  props: [ 'item', 'setup' ],
  data () {
    return {
      img: ''
    }
  },
  watch: {
    item (val) {
      this.img = val.goods_primary_img.middle_pic
    }
  },
  mounted () {
    // console.log(this.item)
  }
}
</script>
<style lang="scss" scoped>
  .goods-card{
    text-align: left;
    background-color: #ffffff;
    .van-card__title{
      font-size: 15px;
      color: #333333;
    }
    .goods-desc{
      p{
        padding-top: 7px;
        font-size: 12px;
        color: #999999;
      }
    }
    .goods-num{
      position: absolute;
      bottom: 7px;
      right: 0;
    }
    .cut::after{
      content: '';
      position: absolute;
      bottom: -1px;
      width: 100%;
      height: 1 !important;
      border-bottom: 1px solid #f0f1f2;
    }
  }
</style>

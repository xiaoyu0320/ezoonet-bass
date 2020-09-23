<template>
  <div class="home-item">
    <div class="home-header">
        <div class="home-images" >
          <ul>
            <li >
              <img :src="goods.specs_img">
            </li>
          </ul>
        </div>
         <div class="home-title">
           <p class="s-price">价格: <span style="font-size:40rpx">￥{{goods.sale_price}}</span></p>
           <p class="s-info">已选择：{{goods.title}}</p>
        </div>
    </div>
  
    <!-- <div class="home-box">
      <span>款 号：</span>
      <label>{{goods.goods_code}}</label>
    </div>
    <div class="home-box">
      <span>库 存：</span>
      <label>{{goods.stock}} 件</label>
    </div> -->
  
    <div class="home-spec">
      <div v-for="(spec,index) in goods.specs" :key="index" class="spec">
        <label>{{spec.name}}</label>
        <p>
          <template v-for="(item, chindex) in spec.children" wx:key="key" >
            <van-button :class="[selectArr[index] == item.id ? 'active' : '', item.stock == 0 ? 'none' : '']" style="margin: 5px 0;" :key="item.id" @click="select(item,index,chindex)" type="default">{{item.name}}</van-button>
          </template>
        </p>
      </div>
    </div>
   <div class="home-count ">
      <div class="home-s-title">购买数量</div>
      <van-stepper :value="1" @change="onChange" />
   </div>
   <div class="home-opeate">
       <van-button @click="addcart" :disabled="disabled" type="danger">加入购物车</van-button>
       <!-- <van-button @click="buys" type="danger">立即抢购</van-button> -->
   </div>
   <van-toast id="van-toast" />
  </div>
</template>
<script>
// import * as api from 'api'
// import { Toast } from 'vant'
import { deepClone } from '@/utils/index'
import Toast from '@/../static/vant/toast/toast'
export default {
  props: [ 'goods', 'page', 'shopId', 'id' ],
  data () {
    return {
      goods_detail: {
        title: '', // 商品名称,
        name: [], // 商品属性name，
        class: [],
        sku: '', // 属性id
        goods_id: '',
        price: '',
        img: ''
      },
      sku: '',
      select_class: [],
      select_id: [], // 已选择的商品属性id
      select_name: [], // 已选择的商品属性name
      fuindex: -1, // 最外层的index
      chindex: -1, // 里层的index
      disabled: true,
      imgList: [],
      selectArr: [],
      optionId: '',
      priceList: [],
      val: 1
    }
  },
  methods: {
    // 步进器 加法
    onChange (event) {
      this.val = event.mp.detail
    },
    buys () {
      let arr = []
      arr.push({
        sku: this.sku,
        goods_id: this.id,
        qty: this.val
      })
      let data = JSON.stringify(arr)
      mpvue.navigateTo({ url: '../paylist/main?json=' + data })
    },
    getLevelPrice (arr) {
      let obj = {}
      if (arr[0]) {
        obj.s1 = arr[0]
      } if (arr[1]) {
        obj.s2 = arr[1]
      } if (arr[2]) {
        obj.s3 = arr[2]
      }
      obj.goods_id = this.id
      obj.shop_id = this.shopId
      this.$http.post({
        url: 'shop/goods/selectSpecs',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          this.goods.sale_price = res.data.sale_price
          this.sku = res.data.sku
        }
      })
      // api.getLevelPrice(obj).then(res => {
      //   if (res.code == 200) {
      //     if (res.data.length == 0) return
      //     let obj = res.data[0]
      //     this.priceList = res.data[0].price_list
      //     this.$set(this.goods, 'sale_price', obj.sale_price)
      //   } else {
      //     Toast.fail(res.msg)
      //   }
      // })
    },
    getStock (keys, spec, option) {
      if (!keys) return
      for (let a in spec) {
        for (let b in spec[a].children) {
          // 对每项Spu中children进行循环，若此children中包含skuName，则返回当前组合的库存到当前Spu中
          // 例如点击红色时，遍历匹配到红色_5.5寸，红色库存则为红色_5.5寸的库存 300,5.5寸此时库存也为300。以此类推可以得出6.0寸的库存。
          if (spec[a].children[b].specVals.indexOf(keys) !== -1) {
            for (let i in option) {
              if (option[i].keys === keys) {
                return option[i].stock
              }
            }
          }
        }
      }
    },
    getCid (c, spec, option) {
      // 首先进行判断，避免单纯的红色，蓝色也进行循环。
      if (c.length !== spec.length) return
      let cStr = c.join('_')
      // 对后台传来的sku组合进行循环遍历,若匹配上，则返回这个组合的skuName，例如：红色_5.5寸
      for (let i in option) {
        if (option[i].keys === cStr) {
          return option[i].keys
        }
      }
    },
    getData (selectArr, spec, option) {
      let checkLen = spec.length - 1
      // // 3行规格 选2行时校验，2行规格，选1行时校验
      if (selectArr.length < checkLen) return
      spec.forEach((item, index) => {
        item.children.forEach((yb, idx) => {
          let skuId = deepClone(selectArr)
          // 这里进行循环组合， 例如：红色_5.5寸，红色_6.0寸
          skuId[index] = yb.id
          // 拿到我们想要的sku组合，例如：红色_5.5寸
          let keys = this.getCid(skuId, spec, option)
          // 根据我们拿到的sku组合 红色_5.5寸进行查库存
          let stock = this.getStock(keys, spec, option)
          yb.stock = stock
        })
      })
    },
    addcart () {
      if (this.disabled) {
        return false
      }
      if (!this.sku) {
        Toast.fail('请选择规格')
        return false
      }
      const obj = {}
      obj.sku = this.sku
      obj.goods_id = this.id
      obj.qty = this.val
      this.$http.post({
        url: 'shop/Shop_cart/addToCart',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          Toast.success(res.msg)
          setTimeout(() => {
            this.$emit('callback', false)
          }, 1500)

          // this.goods.sale_price = res.data.sale_price
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    /**
     * @param {Object} item 当前对象
     * @param [String/Number] index 最外层的下标
     * @param [String/Number] index2 子级的下标
     */
    select (item, fuindex, chindex) {
      // TODO: 判断库存为0时返回
      // if (item.stock == 0) {
      //   Toast.fail('该sku暂无库存！')
      //   return
      // }

      if (this.selectArr[fuindex] === item.id) {
        // TODO: 再次点击时取消选中
        this.$set(this.selectArr, fuindex, '')
        // console.log('判断条件1：' + this.selectArr[fuindex])
        this.sku = '' // 清空将要传给后台的sku
        this.disabled = true
      } else {
        // 点击选中时存入id
        this.$set(this.selectArr, fuindex, item.id)
        // console.log('判断条件2：' + this.selectArr[fuindex])
      }

      console.log('判断条件2：' + this.selectArr)

      if (this.selectArr.length === this.goods.specs.length) {
        // this.disabled = false
        // this.getLevelPrice(this.selectArr)
        // 选取了所有的规格时 拿去skuId
        let str = ''
        this.selectArr.forEach(item => {
          str += '_' + item
        })
        str = str.slice(1)
        // 所有规格都选了时，进行匹配keys后保存sku值，此处数据用于传给后台
        // 保存option_id用来获取下一级团长等级
        this.goods.option.forEach(item => { // 匹配keys
          // eslint-disable-next-line eqeqeq
          if (item.keys == str) {
            this.sku = item.sku
            this.optionId = item.id
            this.getLevelPrice(this.selectArr)
            if (item.stock > 0) {
              this.disabled = false
            } else {
              this.disabled = true
            }
          }
        })
      } else {
        this.disabled = true
      }
      // TODO: 校验库存
      this.getData(this.selectArr, this.goods.specs, this.goods.option)
    }
  },

  mounted () {
    this.sku = ''
  },
  watch: {
    goods: function (newValue) {
      this.sku = ''
      this.selectArr = []
      this.disabled = true
      if (this.goods.specs) {
        this.goods.specs.forEach(yb => {
          yb.children.forEach(yb2 => {
            this.$set(yb2, 'specVals', [])
            this.goods.option.forEach(item => {
              if (item.keys.includes(yb2.id)) {
                yb2.specVals.push(item.keys)
              }
            })
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

  .van-button.none{
    color: #fff !important;
    background-color: #454141 !important;
    border: 1px solid #454141 !important;
  }
  .home-item{
    background: #fff;
    margin-bottom: 10px;
    padding: 15px 15px 0 15px;
    div{
      text-align: left;
    }
    .home-box{
      padding-bottom: 9px;
      font-size: 12px;
      color: rgb(153,153,153);
    }
    .home-price{
      color: #e51c23;
      font-size: 14px;
      label{
        font-size: 19px;
      }
      del{
        font-size: 12px;
        color: #999999;
        padding-left: 7px;
      }
    }
    .home-images{
      img{
        width: 222rpx;
        height: 222rpx;
        font-size: 0;
      }
      ul{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        li{
          font-size: 0;
          width: 33.3333%;
          padding-right: 1%;
          padding-bottom: 1%;
        }
        li:nth-of-type(3n){
          padding-right: 0;
        }
        li:nth-of-type(n+7){
          padding-bottom: 0;
        }
      }
    }
    .home-spec{
      .spec{
        padding: 3px 0;
        label{
          font-size: 14px;
          color: #333333;
          display: block;
          margin:20rpx 0
        }
        .van-button{
          display: inline-block;
          margin: 5px 7px !important;
          height: 30px;
          line-height: 30px;
          color:#666666;
          font-size: 12px;
          border: 1px solid #666666;
          border-radius: 4px;
         
        }
      }
    }
    .home-btn{
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      .clean-price{
        display: flex;
        flex-direction: column;
        p{
          font-size: 12px;
        }
        .clean-item{
          margin-bottom: 3px;
          span{
            font-size: 12px;
          }
        }
      }
      .van-button.transpond{
        display: inline-block;
        margin: 0 10px;
        background-image: linear-gradient(-30deg, #ff5722 0%, #ff9800 100%), linear-gradient( #fc8f37, #fc8f37) !important;
      }
      .van-button{
        color: #ffffff;
        height: 35px;
        line-height: 35px;
        font-size: 12px;
        border-radius: 30px;
        background-image: linear-gradient(-30deg, #e51c23 0%, #ff362b 100%), linear-gradient( #000000, #000000);
        background-blend-mode: normal,normal;
      }
    }
  }
  .home-header {
    display: flex;
    .home-title {
       display: flex;
       justify-content: flex-end;
       flex-direction: column;
       margin-left: 20rpx;
       .s-price {
         font-size: 28rpx;
         color: #ec1f23;
       }
       .s-info {
         margin-top:30rpx;
         font-size: 28rpx;
         color: #292c34;
       }
    }
  }
  .home-s-title {
    font-size: 28rpx;
    color: #333;
    margin:20rpx  0
  }
  .home-opeate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 50rpx;
  }
</style>
<style>
   .active .van-button{
    color: #ec1f23 !important;
    background-color: #fff !important;
  
    border: 1px solid #ec1f23 !important;
  }
  .home-item .home-spec .van-button {
    min-width: 188rpx;
    height: 64rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
  }
  .home-opeate  .van-button{
    height: 69rpx;
    border-radius: 35rpx;
  }
</style>

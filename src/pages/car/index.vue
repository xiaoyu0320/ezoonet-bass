<template>
  <div class="cart">
    <!-- 头部 -->
    <!-- <div class="header">
      <span>购物车</span>
      <span @click='editor'>
        <span v-if="editorFlag">编辑</span>
        <span v-else>完成</span>
      </span>
    </div> -->
    <!-- 头部结束 -->
    <!-- 购物车内容 -->
     <div class="cart_list" v-if="valueData.length>0">
            <div class="shop-box"  v-for="(shop,s1) of valueData" :key="s1">
            <div class="shop-name" @click="shopSelect(s1)"> <checkbox class="che-size" :value="index" :disabled="shop.status ==0" :checked="shop.checked"/> {{shop.shop_name}}</div>
            <div class="slide" @touchstart="touchS" @touchmove="touchM($event,index,valueData[s1].list)"   v-for="(item,index) of valueData[s1].list" :key="index">
            <div class="contents_wrapper"  :data-type="item.type">
                <label class="cart_list_item" @click.stop="seletItem(s1,index,item.id,valueData[s1].list)">
                    <checkbox  :disabled="item.status ==0" :value="index" :checked="item.checked" class="che-size"/>
                    <img :src="item.img_list[0]" class="cart_list_item_pic" mode="widthFix">
                    <div class="cart_list_item_right">
                        <div class="cart_list_item_name">{{item.goods_title}}</div>
                        <div class="cart_list_item_desc" ><span v-for="(spec,i) in item.option_name" :key="i"> {{spec}}</span></div>
                        <div class='count'>
                                <div>￥{{item.sale_price}}</div>
                            <div class="count_btn">
                                <div  :class="{decrease:true,decrease_least:item.qty===flag}" @click.stop="decrease(item,item.qty)">-</div>
                                <input type="number" :value='item.qty'>
                                <div class="increase" @click.stop="increase(item,item.qty)">+</div>
                                <!-- <van-stepper :value="item.qty" @minus="increase(item,item.qty)" @plus="decrease(item,item.qty)" bind:change="onChange" /> -->
                            </div>
                        </div>
                    </div>
                </label>
            </div>
            <div class="delete" @click="delt(item.id,index)">删除</div>
            </div>
          </div>  
    </div> 
     <div class="empty" v-else>
        <img src="/static/images/empty/car.png" >
        <p>没有更多商品了~</p>
     </div>
    <!-- 购物车内容结束 -->
    <!-- 结算栏 -->
    <footer>
      <div class="footer_left">
        <checkbox @click="selectAll" class="che-size" :checked="checkedAll"  icon-size="10px"/>
        <label>全选</label>
      </div>
      <div class="footer_right">
        <div class="footer_right_price" >合计：￥{{money}}</div>
        <div  class="hasItem" @click="toOrder"  :class="{footer_right_pay:true}">
          <span >{{submitBarText}}</span>
          </div>
      </div>
    </footer>
    <!-- 结算栏结束 -->
       <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  data () {
    return {
      editorFlag: true, // 编辑为true，完成为false
      valueData: [],
      selectIdArr: [], // 选中状态的id数组
      checkedAll: false,
      money: 0.00, // 总金额
      clientX1: '', // 滑动开始位置
      clientX2: '',
      // del:0,//内容初始的right距离
      btnWidth: 80, // 删除按钮宽度
      flag: 1,
      shopId: '',
      uid: '',
      token: '',
      submitBarText: ''
    }
  },
  methods: {
    allAmount () {
      let amount = 0
      this.valueData.forEach((shop) => {
        shop.list.forEach((item) => {
          if (item.checked) {
            amount += Number(item.qty)
          }
        })
      })

      amount = '结算' + (amount ? `(${amount})` : '')
      this.submitBarText = amount
      let _goods = this.valueData
      // 执行price
      this.price()

      // 判断所有的商品选项如果有选中的就开启结算的开关 -->this.checked
      for (let i = 0; i < _goods.length; i++) {
        for (let k = 0; k < _goods[i].list.length; k++) {
          if (_goods[i].list[k].checked) {
            this.checked = 1
            return
          } else {
            this.checked = 0
            this.submitBarText = '结算'
          }
        }
      }
    },
    // 统计价格
    price () {
      let price = 0.00
      this.valueData.forEach((shop, shopindex) => {
        shop.list.forEach((item, index) => {
          if (item.checked === 1) {
            price += Number(item.sale_price) * item.qty
          }
        })
      })
      this.money = price.toFixed(2)
    },
    decrease (item, num) { // 计数器的减
      if (num > 1) {
        item.qty--
        this.changeCount(item, 2)
      }
    },
    increase (item) { // 计数器的加
      item.qty++
      this.changeCount(item, 1)
    },
    changeCount (item, type) {
      // 1增加 2减少
      this.$http.post({
        url: 'shop/Shop_cart/incOrDec',
        data: {
          'type': type,
          'cart_id': item.id
        }
      }).then(res => {
        if (res.code === 200) {
          // this.getCartList()
          this.allAmount()
        } else {
          Toast.fail(res.msg)
        }
      })
    },
    touchS (e) {
      // console.log(e)
      this.clientX1 = e.clientX
    },
    touchM (e, index, arr) {
      // arr 店铺数组 index 店铺内商品索引
      this.clientX2 = e.clientX
      let disX = this.clientX1 - this.clientX2
      if (disX === 0 || disX < 0) { // 如果移动距离小于等于0，说明向右滑动，文本层位置不变
        // this.del = 0;
        this.$set(arr[index], 'type', 0)
      }
      if (disX >= this.btnWidth) {
        // 控制手指移动距离最大值为删除按钮的宽度
        // this.del =this.btnWidth;
        this.$set(arr[index], 'type', 1)
      }
    },
    delt (id, index) { // 删除选中的购物车商品
      this.$http.post({
        url: 'shop/Shop_cart/del',
        data: {
          'cart_id': id
        }
      }).then(res => {
        if (res.code === 200) {
          Toast.success('删除成功')
          this.valueData.forEach((shop, index) => {
            shop.list.forEach((item, index) => {
              if (item.id === id) {
                shop.list.splice(index, 1)
              }
            })
          })
          let _goods = this.valueData
          // 执行isShopAllCheck
          // this.shopSelectAll()
          this.allAmount()
          // 判断所有的商家下如果没商品就去掉该商家
          for (let i = 0; i < _goods.length; i++) {
            if (_goods[i].list.length === 0) {
              _goods.splice(i, 1)
            }
          }

          // if (this.valueData.length === 0) {
          //   this.money = ''
          //   this.checkedAll = false
          // }
        } else {
          Toast.fail(res.msg)
        }
      })
    },
    checkboxChange (e) { // 获取checkobx选中的value数组
      // console.log('checkbox发生change事件，携带value值为：', e.mp.detail)
      this.slideIndex = e.mp.detail.value
    },
    shopSelect (index, flag) {
      // 店铺选择
      let arr = this.valueData[index].list
      if (this.valueData[index].checked === 0) {
        this.$set(this.valueData[index], 'checked', 1)
        arr.map((data, i) => {
          this.$set(arr[i], 'checked', 1)
        })
      } else {
        this.$set(this.valueData[index], 'checked', 0)
        arr.map((data, i) => {
          this.$set(arr[i], 'checked', 0)
        })
      }
      this.shopSelectAll()
    },
    seletItem (s1, index, id, arr) { // 选中商品
      if (arr[index].checked === 0) {
        this.$set(arr[index], 'checked', 1)
        if (!arr.includes(id)) {
          this.selectIdArr.push(id)
        }
      } else {
        this.$set(arr[index], 'checked', 0)
        let arr1 = this.selectIdArr
        let arr2 = []
        arr1.forEach((val) => {
          if (val !== id) {
            arr2.push(val)
          }
        })
        this.selectIdArr = arr2
      }
      // 商品选中 判断是否店铺选中 判断是否全选
      let isCheck = true
      arr.forEach(item => {
        isCheck *= item.checked
      })
      if (isCheck) {
        this.$set(this.valueData[s1], 'checked', 1)
      } else {
        this.$set(this.valueData[s1], 'checked', 0)
      }
      this.shopSelectAll()
      // console.log(this.money)
    },
    editor () { // 显示编辑，完成
      let flag = this.editorFlag
      this.editorFlag = !flag
    },
    getCartList () {
      this.$http.post({
        url: 'shop/Shop_cart/getList',
        data: {}
      }).then(res => {
        if (res.code === 200) {
          if (this.selectIdArr.length === 0) {
            res.data.map((arr, i) => {
              arr.type = 0
              arr.checked = 0
              res.data[i].list.map((item) => {
                item.type = 0// 1为右划状态
                item.checked = 0// 1为选项选中状态
              })
            })
          } else if (this.selectIdArr.length !== 0) {
            res.data.map((arr, i) => {
              arr.checked = 0
              res.data[i].list.map((item) => {
                item.type = 0// 1为右划状态
                if (this.selectIdArr.includes(item.id)) {
                  item.checked = 1// 1为选项选中状态
                } else {
                  item.checked = 0// 1为选项选中状态
                }
              })
            })
          }
          this.valueData = res.data
        } else if (res.code === 400) {
          Toast.fail(res.msg)
        }
      })
    },
    shopSelectAll () {
      let checked = 1
      this.valueData.map((item) => {
        checked *= item.checked
      })
      if (checked === 1) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
      this.allAmount()
    },
    selectAll () { // 全选
      let flag = !this.checkedAll

      if (flag === false) {
        this.valueData.map((item, index) => {
          item.type = 0// 1为右划状态
          item.checked = 1// 1为选项选中状态
          this.selectIdArr.push(item.id)
          this.shopSelect(index)
        })
      } else {
        this.valueData.map((item, index) => {
          item.type = 0// 1为右划状态
          item.checked = 0// 1为选项选中状态
          this.shopSelect(index)
          this.selectIdArr = []
        })
      }
      this.allAmount()
      this.checkedAll = flag
    },
    toOrder () {
      // 存入选中的商品信息

      let arr = []
      this.valueData.map((data, index) => {
        data.list.map((item, i) => {
          if (item.checked === 1) {
            arr.push({
              goods_id: item.goods_id,
              sku: item.sku,
              qty: item.qty,
              cart_id: item.id
            })
          }
        })
      })
      let obj = {}
      if (arr.length <= 0) {
        Toast.fail('请勾选商品')
        return false
      }
      obj.data = JSON.stringify(arr)

      this.$http.post({
        url: 'shop/Order/confirm',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          mpvue.navigateTo({ url: '../paylist/main?json=' + obj.data })
        }
      })
    }
  },
  onShow () {
    this.money = ''
    this.submitBarText = ''
    this.valueData = []
    this.selectIdArr = []
    this.checkedAll = false
    this.submitBarText = '结算'
    this.money = 0
    this.getCartList()
  },
  onPullDownRefresh () {
    this.getCartList()
    setTimeout(function () {
      wx.hideNavigationBarLoading() // 完成停止加载
      wx.stopPullDownRefresh() // 停止下拉刷新
    }, 1000) // 毫秒设置延迟
  },
  // onLoad () {
  //   this.getCartList()
  // },
  onUnload () {
    // eslint-disable-next-line no-undef
    var pages = getCurrentPages()
    var beforePage = pages[pages.length - 2]
    beforePage.loadData()
    wx.navigateBack({
      delta: 1
    })
  }

}
</script>

<style scoped>
.shop-box {
  background: #fff;
}
.shop-name {
  padding: 20rpx;
}
.cart{
  width:100%;
    min-height: 100%;
  overflow-x:hidden;
  background:#eee;
}
  .header{
    width:100%;
    height: 40px;
    background:#eee;
    display:flex;
    justify-content: space-between;
    align-items:center;
  }
  .header>span:nth-child(1){
    margin-left:10px;
  }
  .header>span:nth-child(2){
    margin-right:10px;
  }

  /* 商品列 */
  .cart_list{
    width:100%;
    padding-bottom:50px;
  }
  
  /* 结算栏 */
  footer{
    background:#fff;
    position:fixed;
    z-index:101;
    bottom:0;
    height:40px;
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }
  .footer_left{
    margin-left:10px;
  }
  .footer_right{
    display:flex;
    align-items:center
  }
  .footer_right_price{
    color:#e51c23;
    margin-right:10px;
  }
  .footer_right_pay{
    background:gray;
    text-align:center;
    color:#fff;
    height: 100%;
    line-height:40px;
    width:80px;
  }
  .hasItem{
    background:#e51c23;
  }

  .slide{
        width: 100%;
        position: relative;
        height: 120px;
    }
    .contents_wrapper[data-type="0"]{
        right:0
    }
    .contents_wrapper[data-type="1"]{
        right:80px;
    }
    .contents_wrapper{
        width: 100%;
        height: 100%;
        position: absolute;
        transition: right 0.3s ease-in-out;
        z-index: 99;
        background: #fff;
        border-bottom: 1px  solid #eee;
    }
    .contents{
        width: 100%;
    }
    .delete{
        color:#fff;
        height: 100%;
        text-align: center;
        width:80px;
        background: red;
        line-height: 120px;
        position: absolute;
        right:0;
    }
    .cart_list_item{
    width:100%;
    height: 100%;
    display:flex;
    flex-wrap:wrap;
    margin:0 0 0 10px;
    align-items:center;
  }
  .cart_list_item_pic{
    width:80px;
    margin-left:10px;
  }
  .cart_list_item_right{
    margin-left:10px;
    width:60%;
    height: 100%;
  }
  .cart_list_item_name{
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin:10px 0;
  }
  .cart_list_item_desc{
    margin-bottom:10px;
    width:100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .count{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .count_btn{
        margin-right:40px;
        display: flex;
        width:100px;
        height: 25px;
        line-height: 25px;
        text-align: center;
    }
    .decrease,.increase{
        border: 1px solid #eee;
        width:30px;
        height: 100%;
    }
    .decrease{
        border-radius: 5px 0 0 5px;
    }
    .increase{
        border-radius: 0 5px 5px 0;
    }
    .count_btn input{
        flex:1;
        border-top:1px solid #eee;
        border-bottom:1px solid #eee;
        height:100%;
        min-height: 0 !important;
    }
    .decrease_least{
        background:#eee;
    }
    .che-size {
      transform: scale(0.8,0.8);
    }
</style>



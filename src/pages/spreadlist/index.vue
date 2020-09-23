<template>
  <div class="spread" >
      <!-- <div class="card-container">
         <div class="title">ssss </div>
          <div class="name">ssss</div>
          <div class="tab">
             dafsdfsdfsdfsdf
          </div>
      </div> -->
      <div class="card-box">
         <van-cell-group>
           <van-cell v-for="(item,i) in list" :key="i"   :label="item.mobile" is-link >
              <view slot="title">
                 {{item.nickname}}
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
      keyword: '',
      list: [],
      page: 1
    }
  },
  computed: {

  },
  methods: {
    onClick () {

    },
    onSearch () {

    },
    onChange () {

    },
    getlist () {
      let obj = {}
      obj.page = this.page
      this.$http.post({
        url: 'shop/promotion/list',
        data: obj
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
        }
      })
    }
  },
  onLoad () {
    this.getlist()
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

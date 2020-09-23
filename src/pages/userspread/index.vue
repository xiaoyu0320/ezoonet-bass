<template>
  <div class="spread" >
    <van-search
      :value="keyword"
      placeholder="请输入搜索手机号/昵称"
      use-action-slot
      @change="onChange"
     @search="onSearch"
    >
      <view slot="action" bind:tap="onClick">搜索</view>
    </van-search>
      <div class="card-box">
         <van-cell-group>
           <van-cell v-for="(item,i) in list" :key="i" :title="item.nickname"  :label="item.mobile" is-link />
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

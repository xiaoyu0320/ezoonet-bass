<template>
    <div class="searchtab">
        <div class="item" :class="{'active':index===state}" v-for="(item, index) in list" :key="index" @click="changeState(item,index)">
           {{item.value}}
            <span v-if="!item.default">
                <span v-if="blank === index">
                    <img class="search__img" src="/static/images/fliter/arrow_down@2x.png" v-if="item.flag" />
                    <img class="search__img" src="/static/images/fliter/arrow_top@2x.png" v-else>
                </span >
                <span v-else>
                <img class="search__img" src="/static/images/fliter/arrow_default@2x.png" >
                </span>
            </span>
        </div>
    </div>
</template>
<script>
export default {
  props: ['diareset'],
  data () {
    return {
      state: 0,
      type: 0,
      list: [
        {
          value: '默认',
          label: 0,
          type: 0,
          default: true
        },
        {
          value: '销量',
          label: 1,
          type: 1, // 筛选类型
          flag: false // 箭头选中状态默认下箭头
        },
        {
          value: '价格',
          label: 2,
          type: 3, // 筛选类型
          flag: false // 箭头选中状态默认下箭头

        },
        {
          value: '上新',
          label: 3,
          type: 5, // 筛选类型
          flag: false // 箭头选中状态默认下箭头

        }
      ],
      blank: 0 // 分类选中状态
    }
  },
  methods: {
    changeState (item, index) {
      this.blank = index
      if (item.label === 1) {
        if (item.type === 1) {
          item.flag = true
          item.type = 2
        } else {
          item.flag = false
          item.type = 1
        }
      } else if (item.label === 2) {
        if (item.type === 3) {
          item.flag = true
          item.type = 4
        } else {
          item.flag = false
          item.type = 3
        }
      } else if (item.label === 3) {
        if (item.type === 5) {
          item.flag = true
          item.type = 6
        } else {
          item.flag = false
          item.type = 5
        }
      }
      if (this.state === item.label) {
        this.$emit('changetype', item.type)
      } else {
        this.state = item.label
        this.$emit('changetype', item.type)
      }
    }
  },
  created: function () {
    console.log('land created')
  },
  attached: function () {
    console.log('land attached')
  },
  ready: function () {
    console.log('land ready')
  },
  moved: function () {
    console.log('load moved')
  },
  detached: function () {
    console.log('land detached')
  },
  watch: {
    diareset () {
      console.log(this.diareset)
      if (this.diareset) {
        this.state = 0
        this.type = 0
        this.blank = 0
      }
    }
  }

}
</script>
<style lang="scss">
    .searchtab{
        width:100%;
        display: flex;
        background: #fff;
        .item{
            flex: 1;
            line-height: 32px;
            font-size: 14px;
            color: #353535;
            text-align: center;
            &.active{
                color:#ec1f23;
            }
            img{
                width:24rpx;
                height: 24rpx;
            }
        }

        .search__img {
             width:24rpx;
             height: 24rpx;
        }
    }
</style>
<template>
  <div class="goods-price goods-box">
    <slot ref="time" name="time">
      <div class="price">
        <span>￥</span>
        <label>{{goods.sale_price}}</label>
        <del>￥{{goods.market_price}}</del>
      </div>
      <div class="time">
        <p style="width:100%"><i><img src="images/home/timer@2x.png"></i>距结束还剩{{time.substr(0, 2)}}天</p>
        <span class="timer">{{time.substr(3)}}</span>&nbsp;&nbsp;
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  props: ['goods'],
  data () {
    return {
      timer: null,
      residuethisTime: '00000000000' // 倒计时默认值
    }
  },
  computed: {
    time () {
      this.watchResiduethisTime(this.goods.end_time)
      return this.residuethisTime
    }
  },
  methods: {
    watchResiduethisTime (time) {
      this.residuethisTime = this.nowtime(time)
      this.timer = setInterval(() => {
        this.residuethisTime = this.nowtime(time)
        if (this.residuethisTime === '00:00:00') {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    nowtime (time) {
      let nowTime = Date.now()
      let leftime = Math.round((time * 1000 - nowTime) / 1000)
      let d = parseInt(leftime / 3600 / 24) < 10 ? '0' + parseInt(leftime / 3600 / 24) : parseInt(leftime / 3600 / 24)
      let h = parseInt(leftime / 3600 / 24 % 24) < 10 ? '0' + parseInt(leftime / 3600 / 24 % 24) : parseInt(leftime / 3600 / 24 % 24)
      let m = parseInt(leftime / 60 % 60) < 10 ? '0' + parseInt(leftime / 60 % 60) : parseInt(leftime / 60 % 60)
      let s = leftime % 60 < 10 ? '0' + leftime % 60 : leftime % 60
      return `${d}:${h}:${m}:${s}`
    }
  }
}
</script>
<style lang="scss" scoped>
  .goods-box{
    padding-bottom: 10px;
    font-size: 12px;
    color: #999999;
  }
  .goods-price{
    position: relative;
    display: flex;
    .price{
      font-family: 'DIN-Bold';
      color: #e51c23;
      font-size: 14px;
      label{
        font-size: 19px;
      }
      del{
        font-size: 12px;
        color: #999999;
        padding-left: 5px;
      }
    }
    .time{
      font-size: 12px;
      color: #333333;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      position: absolute;
      right: 0;
      bottom: 11px;
      p{
        display: inline-block;
        text-align: right;
        padding-bottom: 2px;
        i{
          width: 8px;
          height: 10px;
          display: inline-block;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .timer{
        font-family: 'DIN-Bold';
        background-image: linear-gradient(-30deg, #ff7300 0%, #ffbf00 100%);
        padding: 2px 12px;
        border-radius: 5px;
        color: #ffffff;
      }
    }
  }
</style>

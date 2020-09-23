<template>
  <div class="OrderHead">
    <div class="content">
      <div class="item"><img v-if="url" :src="url"><slot name="header"></slot></div>
      <div class="note"><slot name="note"></slot></div>
      <div class="input"><slot name="input"></slot></div>
      <div class="member"><slot name="member"></slot></div>
      <!-- 快递 -->
      <div class="express"><slot name="express"></slot></div>
    </div>
  </div>
</template>
<script>
export default {
  props: [ 'url' ],
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
  .OrderHead{
    width: 100%;
    height: 146.5px;
    // background: url('/images/user/img_bg2@2x.png')center center;
    background-size: cover ;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
      position: relative;
      padding-bottom: 20px;
      font-size: 18px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .item{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        img{
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
      .member{
        img{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #ededed;
          border: solid 1px #ffffff;
          margin: 5px 0;
        }
        p{
          padding: 5px 0;
          color: #ffffff;
        }
      }
      .express{
        text-align: left;
        p{
          color: #ffffff;
          font-size: 14px;
          padding: 5px 0;
          text-align: left;
          span{
            display: inline-block;
            width: 44px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            border-radius: 4px;
            border: solid 1px #ffffff;
            font-size: 12px;
            color: #ffffff;
          }
        }
      }
      .address{
        position: fixed;
        width: 100%;
        top: 133px;
        border-radius: 16px 16px 0px 0px;
        overflow: hidden;
        .van-cell{
          padding: 15px;
        }
      }
      .note{
        padding: 10px 0;
        color: #ffffff;
        opacity: 0.6;
      }
    }
  }
</style>

<!-- 导航栏标签 -->
<template>
<div class='nav'>
 
</div>
</template>
<script>
export default {
  props: [ 'tabList' ],
  data () {
    return {
      active: ''
    }
  },
  methods: {
    handleTabClick (index) {
      this.$emit('Nav', index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .nav{
    position: relative;
    top: 0;
    left: 0;
    // position: fixed;
    // top: 0;
    // left: 0;
    // z-index: 2000;
    // width: 100%;
    height: 64px;
    // background: url('/images/home/jianbian@2x.png')center center;
    // background-size: cover ;
    background-color: #fff;
  }
</style>

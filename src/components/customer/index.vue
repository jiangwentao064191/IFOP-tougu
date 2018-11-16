<template>
  <div class="serivce">
    <div class="de-img">
      <img src="../../assets/img/delov.png">
      <p class="hq-more">更多功能，敬请期待！</p>
    </div>

  </div>
</template>

<script>
  export default {
    name: "customer",
    beforeCreate:function(){
      this.$store.state.nowContent = 'customer'
      this.$store.state.loadingContent = false;
    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .serivce {
    height: 100%;
    position: relative;
    .de-img {
      position: absolute;
      top: 28%;
      left: 34%;
    }
    .hq-more{
      color: @com-h4s4-font;
      font-size: @font + 2;
      margin-left: 154px;
      margin-top: 24px;
    }
  }
</style>

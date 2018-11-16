<template>
  <div class="serivce">
    <div class="de-img">
      <img src="../../assets/img/customer.png">
    </div>

  </div>
</template>

<script>
  export default {
    name: "service",
    beforeCreate: function() {
      this.$store.state.nowContent = "service";
      this.$store.state.loadingContent = false;
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .serivce {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /*background: rgba(33, 40, 47, 1);*/
    .de-img {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      // justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      width: 54%;
      height: 342px;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .hq-more {
      color: @com-h4s4-font;
      font-size: @font + 2;
      margin-top: 24px;
    }
  }
</style>

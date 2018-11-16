<template>
  <div class="loginPage-bg">
    <div class="loginPage">
      <login></login>
     <!-- <div class="loginPage-content">
      </div>-->
    </div>
  </div>
</template>

<script>
  import login from '@/components/system/login'
    export default {
        name: "loginPage",
      components: {
        login
        }
    }
</script>

<style scoped lang="less">
  @import "../../assets/style/public.less";
  .loginPage-bg{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    background:url("../../../static/tgdlogin_bg.jpg") no-repeat;
    background-size: 100% 100%;
  }
  .loginPage{
    font-family: SourceHanSansCN-Regular;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -211px auto auto -301px;
    border-radius: 3px;
    height: 422px;
    width: 602px;
  }
  .loginPage-content{
    padding: 45px 125px;
    background: #fff;
    border-radius: 8px;
  }
</style>

<template>
  <div class="v-header">
    <div class="move-block"></div>
    <img class="logo" src="../../assets/img/logoHeader.png">
    <span class="color-gold">芯财富</span>
    <div class="header-btn">
      <button class="btn-s" @click="winMin()"></button>
      <button class="btn-b" @click="sizeSwitch()"></button>
      <button class="btn-c" @click="closeWindow()"></button>
    </div>
  </div>
</template>

<script>
    export default {
      props:[
        "titleName"
      ],
        name: "myHeader",
      methods:{
        winMin:function () {
          winMinAndRestore()
        },
        sizeSwitch:function () {
          windowSizeSwitch();
        },
        closeWindow:function () {
          closeWin()
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .v-header{
    .logo{
      width: 28px;
      margin-top: -5px;
      margin-right: 5px;
      height: 28px;
      vertical-align: middle;
    }
    border-bottom: 1px solid @black-2;
    font-size:@font - 2px;
    height: 39px;
    line-height: 40px;
    background: @com-module-bg;
    padding: 0 10px;
    position: relative;
    .move-block{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 200px;
      z-index: 2;
      -webkit-app-region:drag;
    }
    .header-btn{
      position: absolute;
      right: 0;
      z-index: 3;
      top: 0;
      button{
        width: 45px;
        height: 40px;
        background: initial;
        border: none;
        background-repeat: no-repeat;
        outline: none;
        background-size: 16px 14px ;
        background-position: center;
        transition: all .3s;
        &:hover{
          background-color: transparent;
        }
      }
      .btn-c{
        background-image: url("../../assets/img/top_gb@2x.png");
      }
      .btn-s{
        background-image: url("../../assets/img/top_zxh@2x.png");
      }
      .btn-b{
        background-image: url("../../assets/img/top_sx@2x.png");
      }
    }
  }

</style>

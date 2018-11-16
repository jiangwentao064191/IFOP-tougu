<template>
  <div class="login">
    <div class="header-btn">
      <button class="btn-s" @click="winMin()"></button>
      <button class="btn-b" @click="sizeSwitch()"></button>
      <button class="btn-c" @click="closeWindow()"></button>
    </div>
    <div class="login-content">
      <div class="bg">
        <div class="logo-top">
          <img class="yougu-img" src="../../assets/img/youGu_login.png">
        </div>
        <div class="phone-div">
          <div>
            <div class="login_pic_wechat">
              <i class="iconfont icon-login_pic_phone"></i>
              <p>021-6510-1557</p>
            </div>
            <div class="login_pic_phone">
              <i class="iconfont icon-login_pic_wechat"></i>
              <p>t56t49</p>
            </div>
          </div>
        </div>
        <!--<img src="../../assets/img/tgdlogin_pic.png">
        <p class="login-pro"><span class="pro-txt">芯财富</span><span class="pro-lot">.</span><span
          class="pro-txt">投顾终端</span></p>
        <p class="left-footer">投顾的专业平台</p>-->
      </div>
      <div class="login-block">
        <login v-if="!loginFinish" @loginNext="loginNext"/>
        <bind-mobile v-if="loginFinish"/>
      </div>
    </div>
  </div>
</template>

<script>
  import login from './login'
  import bindMobile from './bindMobile'

  export default {
    name: "loginIndex",
    data() {
      return {
        loginFinish: false
      }
    },
    components: {
      login,
      bindMobile
    },
    create: function () {
      //窗口最大化，如果方法报错则非壳运行
      try {
        maxWindowSize();
        console.log('登录页面')
      } catch (e) {
        // this.$store.state.isUni = false;
      }
    },
    methods: {
      loginNext: function (data) {
        this.loginFinish = data
      },
      // closeWindow:function () {
      //  try {
      //    closeWin();
      //  } catch (e) {
      //    this.$message.error('非壳环境，无法关闭窗口');
      //  }
      // },
      winMin: function () {
        winMinAndRestore()
      },
      sizeSwitch: function () {
        windowSizeSwitch();
      },
      closeWindow: function () {
        closeWin();
      }
    }
  }
</script>

<style lang="less">
  @import '../../assets/style/public.less';

  .login {
    .header-btn {
      position: absolute;
      right: 0;
      z-index: 3;
      top: 0;
      button {
        width: 45px;
        height: 40px;
        background: initial;
        border: none;
        background-repeat: no-repeat;
        outline: none;
        background-size: 16px 14px;
        background-position: center;
        transition: all .3s;
        cursor: pointer;
        &:hover {
          background-color: @com-tab-A-color;
        }
      }
      .btn-c {
        background-image: url("../../assets/img/top_gb@2x.png");
      }
      .btn-s {
        background-image: url("../../assets/img/top_zxh@2x.png");
      }
      .btn-b {
        background-image: url("../../assets/img/top_sx@2x.png");
      }
    }
    p {
      margin: 0;
      padding: 0;
    }
    height: 100%;
    width: 100%;
    background: #eee;
  }

  .login-content {
    font-family: SourceHanSansCN-Regular;
    // position: absolute;
    // left: 50%;
    // top: 50%;
    // margin: -211px auto auto -301px;
    border-radius: 3px;
    height: 100%;
    width: 100%;

    .bg {
      background: url("../../assets/img/bglogin_pic.png") no-repeat;
      color: @com-h1S2-font;
      background-size: 100% 100%;
      float: left;
      width: 34%;
      height: 100%;
      text-align: center;
      -webkit-app-region: drag;
      font-size: 22px;
      /*display: flex;*/
      justify-content: center;
      align-items: center;
      .logo-top {
        display: flex;
        align-items: center;
        height: calc(60% - 60px);
        justify-content: center;
        margin-top:60px;
      }
      .phone-div {
        display: flex;
        /*align-items: center;*/
        justify-content: center;
        margin-top:20px;
        height: calc(40% - 20px);
        .login_pic_wechat, .login_pic_phone {
          .iconfont {
            font-size: 24px;
            color: @com-h1S2-font;
          }
          p {
            font-size: 12px;
            padding:20px 0;
          }
        }
      }
      img {
        display: block;
        // margin: 20px auto;
        // margin-top: 150px;
        width: 108px;
      }
      .yougu-img {
        width: auto !important;
      }
      .login-pro {
        font-size: @font + 6;
        line-height: 21px;
        /*padding-left: 39px;*/
        color: @com-h1S2-font;
        margin-top: 20px;
        .pro-txt {
          display: inline-block;
          padding-top: 4px;
          vertical-align: top;
        }
        .pro-lot {
          display: inline-block;
          vertical-align: top;
          padding: 0 8px;
        }
      }
      .left-footer {
        color: @com-h1S2-font;
        /*padding-left: 66px;*/
        padding-top: 110px;
        font-size: @font - 2;
      }
    }
    .login-block {
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url("../../assets/img/login_bg2@2x.jpg");
      background-size:100%;
      float: left;
      /*box-shadow: 0 0 5px #ddd;*/
      height: 100%;
      width: 66%;
      // background-color: @com-h1S2-font;
    }
  }
</style>

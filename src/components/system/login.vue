<!--<template>
  <el-form ref="form" :model="form">
    <div class="login-form-title">
      <img src="../../../static/tgdlogin_pic.png" alt="logo"/>
      <br>
      iFA
    </div>
    <el-form-item>
      <el-input placeholder="请输入账号" v-model="form.account" autofocus />
    </el-form-item>
    <el-form-item>
      <el-input placeholder="请输入密码" type="password" v-model="form.password"/>
    </el-form-item>
    <div class="login-remember">
      <el-checkbox v-model="form.isRemember">记住我</el-checkbox>
      <a class="float-r">忘记密码</a>
    </div>
    <el-form-item v-loading="!form.loginBtnCheck" element-loading-background="rgba(255,255,255, 0.3)">
      <el-button class="loginBtn" :disabled="!form.loginBtnCheck" type="primary" @click="onSubmit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  //引用错误代码字典
  import {ERROR_CODE_DEF} from '../../assets/wordbook';
  import send from '../../assets/js/ajaxSend'
  export default {
    name: "login",
    data () {
      return {
        form:{
          "account":"",
          "password":"",
          "isRemember":false,
          "loginBtnCheck":true
        },
        accountFocus:false
      }
    },
    methods:{
      //提交方法
      onSubmit:function () {
        let _this = this;
        let message = {};
        message['account'] = _this.form.account;
        message['password'] = _this.form.password;
        message['account_type'] = "pwd";
        message['user_type'] = "broker";
        _this.form.loginBtnCheck = false;
        send.axiosSend({
          url:_this.$store.state.api.login,
          data:message,
          vue:_this,
          success:data => {
            //登录成功
            _this.form.loginBtnCheck = true;
            if (data.op.code === 'Y') {
              let logininfo = {};
              logininfo.userid = data.user_id;
              logininfo.session_id=data.session_id;
              logininfo.user = data.user;
              localStorage.setItem("logininfo", JSON.stringify(logininfo));
              if (_this.form.isRemember) {
                localStorage.setItem("tgN", JSON.stringify(_this.form.account));
                localStorage.setItem("tgP", JSON.stringify(_this.form.password));
              }
              _this.$router.push("/index/information")
            }else{
              let errorMsg;
              if(ERROR_CODE_DEF[data.op.info]){
                errorMsg = ERROR_CODE_DEF[data.op.info];
              }else{
                errorMsg = data.op.info;
              }
              _this.$message.error(errorMsg);
            }
          },
          error:error=>{
            _this.form.loginBtnCheck = true;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-remember{
    margin-bottom: 10px;
    padding: 0 5px;
  }
  .loginBtn{
    width: 100%;
    background: #f04a34;
    border: none;
  }
  .loginBtn.is-disabled:hover{
    color: #fff;
    background-color: #f09a8c;
    border-color: #f09a8c;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #f04a34 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #f04a34;
    border-color: #f04a34
  }

  .float-r{
    float: right;
    font-size: 14px;
    line-height: 19px;
    display: inline-block;
    color: #999;
  }
  .login-form-title{
    font-size: 26px;
    color: #333;
    text-align: center;
    margin: 0 0 15px;
  }
</style>-->
<template>
  <div class="login-content clearfix">
    <div class="login-left">
      <img src="../../../static/tgdlogin_pic.png" alt="logo"/>
      <p class="login-pro"><span class="pro-txt">芯财富</span><span class="pro-lot">.</span><span
        class="pro-txt">投顾终端</span></p>
      <p class="left-footer">投顾的专业平台</p>
    </div>
    <div class="login-right">
      <div class="right-header clearfix">
        <span class="header-title">微信登录</span>
        <img style="float: right" src="../../../static/icon/login_icon_off.png">
      </div>
      <div id="qrcode" ref="qrcode"></div>
      <!--<p class="watch-txt">请使用微信扫描二维码登录</p>-->
      <div>
        <p class="watch-out">扫描失败</p>
        <p class="watch-out out-ti">已过期</p>
        <p class="watch-out watch-refresh">刷新</p>
      </div>
    </div>
  </div>
</template>
<script>
  import QRCode from 'qrcodejs2'
  import send from '../../assets/js/ajaxSend'

  export default {
    name: "login",
    data() {
      return {
        qr2:"",// 二维码字符串
        token:"",
        getLang:{}// 轮询事件对象
      }
    },
    created: function () {

    },
    methods: {
      //获取二维码字符，并更新
      getQr2Url:function (type) {
        let _this = this;
        send.ajaxSend({
          url:'wechat/GetQRCodeLogin',
          success:function (data) {
            _this.qr2 = data.url
          }
        })
      }
    },
    mounted:function () {
      // 进入页面后获取二维码
      let _this = this
      this.getQr2Url();
      // 建立轮询事件
      let langReq = ()=>{send.langReq({
        url:"langLogin",
        success:function (data) {
          console.log(data);
          if(data.op === 1){
            _this.$router.push({name:'index'})
          }else{
            langReq()
          }
        }
      });};
      langReq();
    },
    watch:{
      // q2数据监听
      qr2(newvalue,oldValue){
        // 如果旧值为空则新建二维码
        if(oldValue === ''|| oldValue === null){
          qrContent = new QRCode('qrcode', {
            width: 190,  // 设置宽度
            height: 190, // 设置高度
            text: newvalue
          })
        }else{
          // 否则修改二维码
          qrContent.makeCode(newvalue)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../assets/style/public.less";
  .login-content {
    p {
      margin: 0;
      padding: 0;
    }
    width: 602px;
    height: 422px;
    background-color: @com-h1S2-font;
    cursor: pointer;
    .login-left {
      float: left;
      padding-top: 106px;
      width: 253px;
      height: 422px;
      background: url("../../../static/bglogin_pic.png") no-repeat;
      img {
        padding-left: 85px;
      }
      .login-pro {
        font-size: @font + 4;
        line-height: 21px;
        padding-left: 39px;
        color:@com-h1S2-font;
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
        padding-left: 66px;
        padding-top: 110px;
      }
    }
    .login-right {
      width: 308px;
      padding: 18px 20px;
      float: left;
      .header-title {
        width: 72px;
        height: 18px;
        font-size: @font + 2;
        color: @com-h2S1-font;
        img {
          float: right;
          width: 20px;
          height: 20px;
        }
      }
      .watch-img {
        width: 190px;
        height: 190px;
        padding-left: 50px;
        padding-top: 50px;
      }
      .watch-txt {
        padding-left: 50px;
        padding-top: 50px;
        font-size: @font;
        color: @com-h2S1-font;
      }
      .watch-out {
        font-size: @font;
        color: @com-h2S1-font;
        padding-top: 26px;
        padding-left: 112px;
      }
      .out-ti {
        padding-left: 120px;
        padding-top: 10px;
      }
      .watch-refresh {
        color: @com-h1S2-font;
        padding-left: 130px;
      }
    }
  }
</style>

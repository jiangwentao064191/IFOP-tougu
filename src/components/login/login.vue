<template>
  <div class="login-c">
      <div class="title">微信登录</div>
      <div class="img">
        <div id="qrcode" ref="qrcode"></div>
      </div>
      <div class="bottom">
        请使用微信扫描二维码登录
        <button class="refresh-btn" @click="getQr2Url()">刷新二维码</button>
      </div>
  </div>
</template>
<script>
  import QRCode from 'qrcodejs2'
  import {getQr2API,watchLoginAPI,loginOldAPI} from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'
  let qrContent;
  export default {
    name: "login",
    components: {QRCode},
    data (){
      return {
        qr2:"",// 二维码字符串
        token:"",
        getLang:{}// 轮询事件对象
      }
    },
    methods:{
      //获取二维码字符，并更新
      getQr2Url:function () {
        let _this = this;
        clearTimeout(_this.getLang);
        send.ajaxService({
          url:getQr2API,
          data:{"user_type":"broker"},
          thisVue:_this,
          time:3000,
          success:function (data) {
            _this.outTime = false;
            _this.qr2 = data.url;
            _this.token = data.token;
            if(!localStorage.getItem('logininfo') || !localStorage.getItem('customerUser') ){
              _this.getLoginMsg();
            }
          }
        })
      },
      //跳转绑定手机
      toMobile:function () {
        this.$emit('loginNext',true);
      },
      // 轮询获取登录返回
      getLoginMsg:function () {
        let _this = this;
        send.ajaxService({
          url:watchLoginAPI,
          data:{token:_this.token},
          thisVue:_this,
          success:function (data) {
            if(data.op.code === "Y"){
              if(data.loginbean.status === "0"){
                _this.getLang = setTimeout(function () {
                  _this.getLoginMsg()
                  }
                ,3000)
              }else if(data.loginbean.status === "1"){
                clearTimeout(_this.getLang);

                let logininfo = {};
                logininfo.userid = data.loginbean.userId;
                logininfo.session_id=data.loginbean.sessionId;
                logininfo.user = JSON.parse(data.loginbean.user);
                console.log("user",logininfo.user)
                localStorage.setItem("logininfo", JSON.stringify(logininfo));

                _this.$store.state.user = JSON.parse(data.loginbean.user);
                localStorage.setItem('customerUser',data.loginbean.user);
                _this.$store.state.sessionID = data.loginbean.sessionId;
                _this.$store.state.userId = data.loginbean.userId;
             if(!_this.$store.state.user.mobile){
                  _this.toMobile()
                }else{
                   _this.$router.push({name:"mine"})
                }
              }
            }else if(data.op.code === 'N' && data.op.errorcode === 'WXSERVER_1'){
              _this.getQr2Url();
            }
          }
        })
      },
      //自动登录
      autoLogin:function (user) {
        let _this = this;
        user = JSON.parse(user).wechat;
        send.ajaxSend({
          url:loginOldAPI,
          data:{
            token:user,
            token_type:"wechat",
            user_type:"broker"
          },
          success:function (data) {
            clearTimeout(_this.getLang);
            _this.$store.state.user = data.user;
            _this.$store.state.sessionID = data.session_id;
            localStorage.setItem("logininfo", JSON.stringify(data));
            if(!_this.$store.state.user.mobile){
              _this.toMobile()
            }else{
              _this.$router.push({name:"mine"})
            }
          }
        })
      }
    },
    mounted:function () {
      this.getQr2Url();
      let _this = this;
      console.log('localStorage.getItem()',localStorage.getItem('customerUser'));
      if(localStorage.getItem('customerUser') !== '' && localStorage.getItem('customerUser') !== null ){
          _this.autoLogin(localStorage.getItem('customerUser'));
      }else{
        // _this.getQr2Url();
      }
    },
    watch:{
      // q2数据监听,动态刷新二维码
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
  @import '../../assets/style/public.less';
  .login-c{
    font-family:SourceHanSansCN-Regular;
    text-align: center;
    width: calc(50%);
    background: hsla(0,0%,100%,0.08);
    border-radius: 5px;
    /*border: 1px solid #2e353b;*/
    .title{
      margin:38px auto 42px auto ;
      font-size: @font + 2px;
      color: @com-h2S1-font;
    }
    .img{
      width: 206px;
      height: 206px;
      margin:0 auto 30px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
    }
    .bottom{
      font-size: @font;
      color:@com-h2S1-font;
      .refresh-btn{
        border: none;
        outline: none;
        font-size: @font - 4px;
        background: transparent;
        display: block;
        color: @com-h1S2-font;
        margin:10px auto 20px;
        cursor: pointer;
      }
    }
  }

</style>

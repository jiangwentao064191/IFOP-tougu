<template>
  <div class="login-c">
    <div class="head">
      <img :src="$store.state.user.head">
      <div class="head-text">
        {{$store.state.user.name}}
        <br/>
        <span>
          {{$store.state.user.province}} {{$store.state.user.city}}
        </span>
      </div>
    </div>
    <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-form-inline">
      <div class="text">首次登录，请绑定手机号</div>
      <el-form-item label="" prop="mobile">
        <el-input v-model="ruleForm.mobile" maxlength="11" clearable placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="" prop="code">
        <el-input class="sort" v-model="ruleForm.codeNum" maxlength="6" clearable placeholder="请输入验证码"></el-input>
      </el-form-item>
      <button type="button" :disabled="code.disable" :class="{code:true,act:!code.disable}" @click="sendCode()">{{code.text}}</button>
      <button type="button" :disabled="sub.disable" @click="sendMobile()" :class="{'sub-btn':true,act:!sub.disable}">确定</button>
    </el-form>
  </div>
</template>

<script>
  import {checkMobile,sendCodeAPI,bindMobileAPI} from "../../assets/apiRegular";
  import send from "../../assets/js/ajaxSend"
  export default {
    data() {
      let checkPhone =(rule, value, callback) => {
        if (!value.match(checkMobile))
        {
          return callback(new Error('手机号码不正确'));
        }
      };
      return {
        daojishiObj:{},
        code:{
          disable:true,
          text:'获取验证码',
          codeS:60
        },
        sub:{
          disable:true,
          text:"确定"
        },
        ruleForm: {
          mobile: '',
          codeNum:""
        },
        rules: {
          mobile: [
            { validator : checkPhone , trigger : 'blur'}
          ],
          codeNum:[
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { min: 6, max: 6, message: '验证码不正确', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      toIndex:function () {
        this.$router.push({name:'mine'})
      },
      //倒计时方法
      daojishi:function(){
        let _this = this;
        _this.code.codeS --;
        _this.code.disable = true;
        _this.code.text = "重新发送 "+ _this.code.codeS;
        if(_this.code.codeS === 0 ){
          _this.code.codeS = 60;
          _this.code.disable = false;
          _this.code.text = "获取验证码"
        }else{
          _this.daojishiObj = setTimeout(function () {
            _this.daojishi()
          },1000)
        }
      },
      // 发送验证码方法
      sendCode:function () {
        let _this = this;
        send.ajaxSend({
          url:sendCodeAPI,
          thisVue:_this,
          data:{
            mobile:_this.ruleForm.mobile
          },
          success:function (data) {
            _this.daojishi();//按钮倒计时
          }
        })
      },
      //提交手机绑定(确定按钮事件)
      sendMobile:function () {
        let _this = this;
        send.ajaxSend({
          url:bindMobileAPI,
          data:{
            "mobile":_this.ruleForm.mobile,
            "user_id":_this.$store.state.user.user_id,
            "code":_this.ruleForm.codeNum
          },
          thisVue:_this,
          success:function (data) {
            _this.$router.push({name:'mine'})//提交成功
          }
        })
      }
    },
    watch:{
      // 监听手机号码输入正则验证
      'ruleForm.mobile':function (value) {
        if(value.match(checkMobile)){
          this.code.disable = false
        }else{
          this.code.disable = true
        }
      },
      //监听验证码验证
      'ruleForm.codeNum':function (value) {
        if(value.length === 6 && this.ruleForm.mobile.match(checkMobile)){
          this.sub.disable = false
        }else{
          this.sub.disable = true
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
    height: 450px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 5px;
  }
  .el-form{
    width: 290px;
    margin: auto;
    .text{
      text-align: center;
      color: @com-h1S2-font;
      margin-bottom: 20px;
    }
    .el-input{
      width: 290px;
      &.sort{
        width: 168px;
      }
    }
    .code{
      .clear-btn;
      width: 100px;
      height: 38px;
      background: @com-button-C-bg;
      color:  @com-button-C-font;
      float: right;
      cursor:not-allowed ;
      &.act{
        background: @com-button-Sx-bg;
        color: @com-button-Sx-font;
        cursor: pointer;
      }
    }
    .sub-btn{
      .clear-btn;
      width: 100%;
      height: 44px;
      margin-top: 20px;
      background: @com-button-C-bg;
      color:  @com-button-C-font;
      cursor:not-allowed ;
      &.act{
        background: @com-button-Sx-bg;
        color: @com-button-Sx-font;
        cursor: pointer;
      }
    }
  }
  .head{
    .clear-both;
    width: 200px;
    margin:40px auto;
    img{
      float: left;
      width: 60px;
      height: 60px;
      border-radius: 100px;
      display: inline-block;
      margin-right: 10px;
      vertical-align: top;
    }
    .head-text{
      color: @com-h1S2-font;
      padding-top: 8px;
      span{
        color: @com-h2S1-font;
        font-size: @font - 2px;
      }
    }
  }
</style>

<template>
  <div class="v-header v-header2" v-if="mac">
     <img class="logo" src="../../assets/img/yougu-logo.png">
    <!-- <img src="../../../static/tgdlogin_pic.png">
     <span>iFA</span>-->
     <div class="move-block"></div>
     <!--<span class="color-gold">{{titleName}}</span>-->
    <div class="header-btn">
      <div class="switcherUser-div" v-if="name != 'broadcast'" v-on:mouseenter="dataDetails" v-on:mouseleave="hiddenDetail">
        <span class="iconfont switcherUser">&#xe60a;</span>
        <div class="switcherUser-son" v-show="ishow">
          <p @click="quitUser">切换账号</p>
          <p @click="quitUserClose">退出</p>
        </div>
      </div>
      <button class="btn-s" @click="winMin()"></button>
      <button class="btn-b" @click="sizeSwitch()"></button>
      <button class="btn-c" @click="closeWindow()"></button>
    </div>
  </div>

  <div class="v-header" v-else>
    <!--  <img src="../../../static/tgdlogin_pic.png">
     <span>iFA</span>-->
     <div class="move-block"></div>
     <img class="logo" src="../../assets/img/yougu-logo.png">
    <!--<span class="color-gold">{{titleName}}</span>-->
    <div class="header-btn">
      <div class="switcherUser-div" v-if="name != 'broadcast'" v-on:mouseenter="dataDetails" v-on:mouseleave="hiddenDetail">
        <span class="iconfont switcherUser">&#xe60a;</span>
        <div class="switcherUser-son" v-show="ishow">
          <p @click="quitUser">切换账号</p>
          <p @click="quitUserClose">退出</p>
        </div>
      </div>
      <button class="btn-s" @click="winMin()"></button>
      <button class="btn-b" @click="sizeSwitch()"></button>
      <button class="btn-c" @click="closeWindow()"></button>
    </div>
  </div>
</template>

<script>
  import {updateStatusAPI,loginTurnOverAPI} from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'

  export default {
    name: "myHeader",
    data() {
        return {
            mac: false,
          ishow: false,
        }
    },
    props: [
      "titleName",
      "courseid",
      "status",
      "cid",
      "name",
    ],

    //已成功挂载，相当ready()
    mounted(){

        this.macOs()
    },
    methods: {
      quitUserClose(){
        let _this = this;
        _this.$confirm('确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          send.ajaxSend({
            url: loginTurnOverAPI,
            data: {
              session_id: JSON.parse(localStorage.getItem("logininfo")).session_id,
            },
            success(res) {
            }
          });
          // localStorage.clear();
          localStorage.setItem("logininfo", '');
          localStorage.setItem('customerUser', '');
          closeWin();
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消退出'
          });
        })
      },
      quitUser(){
        let _this = this;
        send.ajaxSend({
          url: loginTurnOverAPI,
          data: {
            session_id: JSON.parse(localStorage.getItem("logininfo")).session_id,
          },
          success(res) {
          }
        });
        // localStorage.clear();
        localStorage.setItem("logininfo", '');
        localStorage.setItem('customerUser', '');
        _this.$router.push({
          path:'/',
        })
      },
      dataDetails(){
        let _this = this;
        _this.ishow = true
      },
      hiddenDetail(){
        let _this = this;
        _this.ishow = false
      },
      macOs(){
        let _this = this
        setTimeout(function(){
            let darwuinFun = getPlatform()
            if ( darwuinFun == 'darwin') {
              _this.mac = true
              console.log(_this.mac,'我是mac')
            }else{
              _this.mac = false
              console.log(_this.mac,'我是win')
            }
        },1000)
      },
      winMin: function () {
        winMinAndRestore()
      },
      sizeSwitch: function () {
        windowSizeSwitch();
      },
      closeWindow: function () {
        closeWin();
      //  if (this.courseid && this.status != 'closed') {
      //    let _this=this;
      //     send.ajaxSend({
      //       url: updateStatusAPI,
      //       data: {
      //         "courseId":this.courseid,
      //         "cid":this.cid,
      //         "status":'closed'
      //       },
      //       success:function (data) {
      //           closeWin();
      //           _this.$store.state.liveStatus=true;
      //          console.log('关闭直播');
      //       }
      //     })
      //   }else{
      //      console.log('zhibojienru')
      //       closeWin();
      //   }

      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .v-header2{
  padding-left: 80px!important;
  }
  .v-header {
    border-bottom: 1px solid @com-solidS1-bg;
    font-size: @font - 2px;
    height: 40px;
    line-height: 40px;
    background: @com-title-bg;
    padding: 0 5px;
    position: relative;
    color: @com-h2S1-font;
    img {
      height: 34px;
      vertical-align: middle;
    }
    .move-block {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 200px;
      z-index: 2;
      -webkit-app-region: drag;
    }
    .header-btn {
      position: absolute;
      right: 0;
      z-index: 3;
      top: 0;
      display: flex;
      .switcherUser-div{
        position: relative;
        cursor: pointer;
        .switcherUser{
          display: inline-block;
          width: 45px;
          height: 40px;
          color: #fff;
          font-size: 20px;
          transition: all 0.3s;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          &:hover {
           background-color: @com-hover-bg;
          }
        }
        .switcherUser-son{
          position: absolute;
          width: 100px;
          top: 35px;
          right:0px;
          background: @com-module-bg;
          text-align: center;
          box-shadow: 2px 4px 5px rgba(154,151,151,0.2);
          p{
            height: 35px;
            line-height: 35px;
            margin: 0px;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s;
            &:hover{
              background-color: @com-hover-bg;
            }
          }
        }
      }
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
        &:hover {
          background-color: @com-button-C-bg;
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
  }

</style>

<!--
<template>
    <div class="my-header">
      <img src="../../../static/tgdlogin_pic.png">
      <span>iFA</span>
      <div class="move-block"></div>
      <div class="top-right-block">
        <button class="tr-s" @click="winMin()"></button>
        <button class="tr-b" @click="sizeSwitch()"></button>
        <button class="tr-c" @click="closeWindow()"></button>
      </div>
    </div>
</template>

<script>
    export default {
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
  .my-header{
    height: 40px;
    text-align: left;
    padding: 5px;
    color: white;
    margin: 0;
    .move-block{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 200px;
      z-index: 2;
      -webkit-app-region:drag;
    }
  }
  .top-right-block{
    float: right;
    padding: 5px;
  }
  .top-right-block button{
    width: 16px;
    height: 16px;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    border: none;
    background-size: 100% 100%;
    margin: 0 12px;
  }
  .top-right-block .tr-c{
    background-image: url("../../assets/img/top_gb@2x.png");
  }
  .top-right-block .tr-b{
    background-image: url("../../assets/img/top_sx@2x.png");
  }
  .top-right-block .tr-s{
    background-image: url("../../assets/img/top_zxh@2x.png");
  }
  .my-header img{
    height: 30px;
    vertical-align: middle;
  }
</style>
-->

<template>
  <div class="v-consult" v-loading="loading" element-loading-background="transparent">
    <div class="title" @click="toConsult()">
      <i class="iconfont icon-tietel_bg_picx"></i>
      <span class="text">咨询</span>
    </div>
    <div class="content">
      <div v-for="data in list" class="content-block">
        <div class="img-block">
          <img :src="data.user.head"/>
        </div>
        <div class="text-block">
          <div class="name">
            {{data.user.name}}
            <button>咨询</button>
          </div>
          <div>
            国海证券从业人员
            <br/>
            咨询人次 943 好评率 98.8%
            <br/>
            {{data.starttime}}~{{data.endtime}} 在线
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import send from '../../assets/js/ajaxSend'
  import {getOnlineBrokersAPI} from "../../assets/apiRegular";

  export default {
    name: "consult",
    methods:{
      toConsult:function(){
        this.$router.push({name:'consult'})
      }
    },
    data(){
      return {
        list:[],
        loading:true
      }
    },
    mounted:function () {
      let _this = this;
      send.ajaxSend({
        url:getOnlineBrokersAPI,
        thisVue:_this,
        success:function (data) {
          _this.loading = false;
          _this.list = data.brokerschedules;
        }
      })
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
 /* @title-bg:#3DD5E4 ;*/
  .v-consult{
    /*background:linear-gradient(to bottom right, #008CCB , #13E4E4);*/
    background-color: @com-body-bg;
    .title{
     .xiebian(@com-h1S1-font, @com-module-title-bg,32px);
      .iconfont{
        color:@com-tab-A-color;
        font-size: 32px;
      }
      cursor: pointer;
    }
  }
  .content-block{
    border-bottom: 1px solid @com-solidS2-bg;
    color: @com-h2S1-font;
    margin: 10px;
    padding: 10px 0;
    font-size: @font - 2px;
    .clear-both;
    .img-block{
      height: 150px;
      width: 100px;
      margin-right: 15px;
      text-align: center;
      line-height: 150px;
      float: left;
      img{
        width: 100px;
        height: 100px;
        border-radius: 5px;
        margin-top: 20px;
      }
    }
    .text-block{
      padding-top: 15px;
      line-height: 26px;
      .name{
        font-size: @font;
        height: 28px;
        line-height: 28px;
        button{
          .clear-btn;
          float: right;
          background: @com-button-A-bg;
        }
      }
    }
  }
</style>

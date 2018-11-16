<template>
  <div class="v-consult"  v-loading="loading" element-loading-background="transparent">
    <div class="title" @click="toConsult()">
      <i class="iconfont icon-tietel_bg_picx"></i>
      <span class="text">热点</span>
    </div>
    <ul>
      <li v-for="data in msg" @click="toKeyword(data.keyword)" class="keyword-block">{{data.keyword}}</li>
    </ul>
  </div>
</template>

<script>
  import send from '../../assets/js/ajaxSend'
  import {getHotWordsAPI} from "../../assets/apiRegular";

  export default {
    name: "hot",
    data(){
      return {
        msg:[],
        loading:true
      }
    },
    mounted:function () {
      let _this = this;
      send.ajaxSend({
        url:getHotWordsAPI,
        thisVue:_this,
        success:function (data) {
          _this.loading = false;
          if (data.result.length > 10) {
            _this.msg = data.result.splice(0,10)
          } else {
            _this.msg = data.result
          }
        }
      })
    },
    methods:{
      toConsult:function () {
        this.$router.push({name:'consult'})
      },
      toKeyword:function (data) {
        this.$router.push({
          name: 'consult',
          query: {
            keywords: data
          }
        })
      }

    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .v-consult{
    /*background:linear-gradient(to bottom right, #D25A11 , #F1AB24);*/
    background-color: @com-body-bg;
    .title{
      .xiebian(@com-h1S1-font, @com-module-title-bg,32px);
      .iconfont{
        color:@com-tab-A-color;
        font-size: 32px;
      }
    }
    ul{
      margin-top: 15px;
      .keyword-block{
        text-align: center;
        width: 100%;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        color: @com-h2S1-font;
        transition: all 0.1s;
        &:hover{
          transform:scale(1.1,1.1) ;
        }
      }
    }
  }
</style>

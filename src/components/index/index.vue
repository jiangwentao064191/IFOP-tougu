<template>
  <div style="height: 100%;">
    <!-- <div class="index-img">
      <img src="../../assets/img/banner_pic.png">
    </div> -->
    <div class="top">
      <div class="left" style="height: 100%;">
        <broadcast class="block broadcast"></broadcast>
        <!--  <selfSelect class="block selfSelect"></selfSelect>
         <consult class="block consult"></consult>
         <hot class="block hot"></hot> -->
        <!-- <lesson class="block lesson"></lesson> -->
        <div class="indexBanner">
          <img src="../../assets/img/indexBanner.png" class="indexBanner1">
          <img src="../../assets/img/indexBanner2.png" class="indexBanner2">
        </div>
      </div>
      <information class="block information"></information>
    </div>
  </div>
</template>

<script>
  import broadcast from './broadcast'
  import selfSelect from './selfSelect'
  import information from './information'
  import consult from './consult'
  import hot from './hot'
  import lesson from './lesson'
  import send from "../../assets/js/ajaxSend";
  import { VipUserListAPI } from "../../assets/apiRegular";

  export default {
    name: "index",
    components: {
      broadcast,
      selfSelect,
      information,
      consult,
      hot,
      lesson,
    },
    mounted: function () {
      this.$store.state.loadingContent = false;
      this.$store.state.nowContent = 'index';
      send.ajaxSend({
        url: VipUserListAPI,
        data: {
          user_id: JSON.parse(localStorage.getItem("logininfo")).user.user_id
        },
        success: function(data) {
          if(data.datalist.length>=1){
            localStorage.setItem("userLevel", data.datalist[0].vip_level);
          }else{
            localStorage.setItem("userLevel", "A");

          }
        }
      });
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  .index-img {
    padding: 0 10px;
    margin-top: 10px;
    img {
      width: 100%;
    }
  }

  .top {
    // overflow: hidden;
    height: calc(100% - 16px);
    .block {
      border-radius: 8px;
      width: calc(33.33% - 10px);
      overflow: hidden;
      margin: 5px;
      float: left;
      /*min-height: 439px;*/
    }
    .left {
      .indexBanner{
        float: left;
        position: relative;
        width:calc(100% - 15px);
        height: calc(30%);
        margin-left:10px;
        margin-right:5px;
        .indexBanner1{
          width:100%;
          height: 100%;

        }
        .indexBanner2{
          position: absolute;
          left: 50%;
          margin-left: -530px/2;
          top: 50%;
          margin-top:-128px/2;
          width:530px;
          height: 128px;
        }
      }
      float: left;
      width: 75%;
      margin-bottom: 5px;
      &:after {
        content: "";
        display: inline-block;
        clear: both;
      }
    }
    .broadcast {
      height: calc(70%);
      width: calc(100% - 15px);
      margin-left: 10px;
    }
    .information {
      height: calc(100% + 4px);
      width: calc(25% - 15px);
      margin-right: 10px;
      margin-bottom:0px;
    }
    .consult {
      margin-left: 10px;
      width: calc(33.33% - 15px);
    }
  }

</style>

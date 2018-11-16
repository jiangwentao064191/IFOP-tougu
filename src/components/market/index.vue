<template>
  <div class="market" v-loading="loading" element-loading-background="rgba(255,255,255,0.5)">
    <div class="titletab">
      <!-- <span :class="{active:type === 'Industry_'}" @click="changeType('Industry_')">行情</span>
      <span :class="{active:type === 'Concept_'}" @click="changeType('Concept_')">概念</span> -->
      <span :class="{active:type === 'Integrate'}" @click="changeType('Integrate')">综合板块</span>
      <span :class="{active:type === 'Optional'}" @click="changeType('Optional')">我的自选股</span>
      <span :class="{active:type === 'Industry'}" @click="changeType('Industry')">行情列表</span>
      <span :class="{active:type === 'PlateList'}" @click="changeType('PlateList')">板块列表</span>
    </div>
    <div class="block">
      <!-- <iframe :src="this.iframeUrl" frameborder="0"></iframe> -->
      <iframe id="frameMain1" v-show="type === 'Integrate'" :src="playteAPI" frameborder="0"></iframe>
      <iframe v-show="type === 'Optional'" :src="optionalStockAPI" frameborder="0"></iframe>
      <iframe v-show="type === 'Industry'" :src="quotationListAPI" frameborder="0"></iframe>
      <iframe v-show="type === 'PlateList'" :src="boardQuotesAPI" frameborder="0"></iframe>
    </div>
    <!-- <div class="left-block">
      <left-tab @changeId="changeId" :marketid="marketid" :type="type" />
    </div>
    <div class="main-block hasdetail">
      <main-tab :marketid="marketid" :detailid="detailid" @changeDetail="changeDetail" :type="type" />
    </div>
    <div :class="{'right-block':true}">
      <right-tab :detailid="detailid" />
    </div> -->
  </div>
</template>

<script>
  // import leftTab from "./leftTab";
  // import mainTab from "./mainTab";
  // import rightTab from "./rightTab";
  import {webSocketURL} from '../../assets/apiRegular'
  export default {
    name: "index",
    // components: {
    //   leftTab,
    //   mainTab,
    //   rightTab
    // },
    data() {
      return {
        loading: false,
        type: "Integrate",
        marketid: 0,
        detailid: 0,
        playteAPI:webSocketURL + 'comprehensivePlate',
        optionalStockAPI:webSocketURL + 'optionalStock',
        quotationListAPI:webSocketURL + 'quotationList',
        boardQuotesAPI:webSocketURL + 'boardQuotes',
      };
    },
    mounted() {
      let _this = this
      _this.$store.state.loadingContent = false
      _this.$store.state.nowContent = "market"
      _this.loading = true
      let iframe = document.getElementById("frameMain1");
      iframe.onload = function(){
        _this.loading = false
      };
      document.onkeydown = function (e) {
        let _key = window.event.keyCode;
        if(_key === 117){
          _this.changeType('Optional');
        }
      }
    },
    methods: {
      changeId(data) {
        let _this = this;
        _this.detailid = 0;
        _this.marketid = data;
      },
      changeType(data) {
        let _this = this;
        _this.marketid = 0;
        _this.type = data;
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .titletab {
    position: absolute;
    left: 1px;
    right: 0;
    // background: @black-3;
    background: rgba(42, 46, 58, 1);
    top: 0;
    // padding: 5px;
    height: 40px;
    z-index: 100;
    .clear-both;
    span {
      float: left;
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      // width: 140px;
      text-align: center;
      color: rgba(143, 148, 156, 1);
      border: 1px solid rgba(25, 27, 33, 1);
      &:hover {
        color: #fff;
      }
      &.active {
        color: rgba(231, 194, 127, 1);
      }
    }
  }
  .block {
    padding: 43px 2px 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 99.8%;
    height: 100%;
    box-sizing: border-box;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
  // .left-block {
  //   background: @black-3;
  //   position: absolute;
  //   left: 5px;
  //   top: 45px;
  //   bottom: 5px;
  //   color: @gray-2;
  //   overflow: auto;
  //   width: 300px;
  // }
  // .main-block {
  //   background: @black-3;
  //   position: absolute;
  //   left: 310px;
  //   top: 45px;
  //   bottom: 5px;
  //   right: 0;
  //   overflow: auto;
  //   transition: all 0.5s;
  //   &.hasdetail {
  //     right: 405px;
  //   }
  // }
  // .right-block {
  //   background: @gray-6;
  //   position: absolute;
  //   right: 0;
  //   width: 400px;
  //   top: 45px;
  //   bottom: 5px;
  //   transition: all 0.5s;
  // }
  // .market {
  //   height: 100%;
  // }
  /deep/ .el-loading-mask{
    background-color: rgba(255, 255, 255, 0)!important;
  }
</style>

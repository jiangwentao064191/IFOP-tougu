<template>
  <div class="v-information" v-loading="loading" element-loading-background="transparent">
    <div class="title">
      <i class="iconfont icon-tietel_bg_picx"></i>
      <span class="text">资讯</span>
      <div class="right-ico">
        <!--<i class="iconfont icon-huanyihuan"></i>-->
        <i class="iconfont icon-refresh iconfont2" @click="refresh"></i>
        <a class="more-info" @click="toImformation">更多 &gt;</a>
      </div>

    </div>
    <div class="content" @scroll="toNextPage($event)">
      <ul>
        <li class="content-list" v-for="(data,i) in list" @click="toImformationDetail(data.info_id)" :key="i">
          <div v-if="!data.img_list" class="noimg">
            <div class="line-bottom">
              <div class="content-title">
                {{data.title}}
              </div>
              <!-- <div class="content-text">
                 {{data.digest}}
               </div>-->
              <div class="content-text small">
                {{data.author_name}} {{data.publish_time | hourTime}}
              </div>
            </div>
          </div>
          <div v-if="data.img_list && data.img_list.length === 1" class="oneimg">
            <div class="line-bottom">
              <div>
                <img :src="data.video_cover?data.video_cover:data.img_list[0]" >
              </div>
              <div class="content-title">
                {{data.title}}
              </div>
              <div class="content-text" >
                <span class="span-title1">{{data.author_name}}</span> <span class="span-title2">{{data.publish_time | hourTime}} </span>
              </div>
            </div>
          </div>
          <div v-if="data.img_list && data.img_list.length > 1" class="threeimg">
            <div class="line-bottom">
              <div class="content-title">
                {{data.title}}
              </div>
              <div class="img-block">
                <img v-for="(imgUrl,key) in data.img_list" :src="imgUrl" :key="key">
              </div>
              <div class="content-text">
                {{data.author_name}} {{data.publish_time | hourTime}}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getImformationListAPI} from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'

  export default {
    name: "information",
    data() {
      return {
        loading: true,
        list: [],
        canNext: true,
        pageNo: 1,
        totalpage: 1,
      }
    },
    mounted: function () {
      this.getInforList();
    },
    methods: {
      toNextPage: function (e) {

        // let domHeight = e.srcElement.scrollHeight;
        // let viewHeight = e.srcElement.clientHeight;
        // let scrollHeight = e.srcElement.scrollTop;

        // if (domHeight <= viewHeight + scrollHeight + 10) {
        //   console.log('do',domHeight,viewHeight + scrollHeight)
        //   this.nextPage(this.canNext);
        //   this.canNext = false;
        // }
      },
      refresh(){
        this.getInforList();
      },
      nextPage:function(data){
        if (data) {
          this.pageNo++;
          if (this.pageNo <= this.totalpage) {
            this.getInforList();
          }
        }
      },
      getInforList:function(){
        let _this = this;
        send.ajaxSend({
          url: getImformationListAPI,
          thisVue: _this,
          loadingObj:true,
          data: {"page.size": 30, "page.no": 1, 'put_status': 'Y',"info_type":"info"},
          success: function (data) {
            _this.loading = false;
            for (let i = 0; i < data.info_list.length; i++) {
              if (data.info_list[i].img_list) data.info_list[i].img_list = data.info_list[i].img_list.split(',')
              if (data.info_list[i].data_from && data.info_list[i].data_from == 'crawl') {
                data.info_list[i].img_list = data.info_list[i].img_list.slice(0, 1)
                // console.log('@@@img_list', data.info_list[i].img_list);
              }
            }
            // _this.list = _this.list.concat(data.info_list);
            _this.list = data.info_list;
            _this.totalpage = data.page.totalpage;

          },
          // error(data){
          //   console.log(data)
          // }
        })
      },
      toImformation: function () {
        this.$router.push({'name': "informationAll"});
        // this.$store.state.detailController.show = false;
        // this.$store.state.detailController.type = 'informationAll';
      },
      toImformationDetail: function (data) {
        this.$store.state.detailController.show = false;
        this.$store.state.detailController.type = 'informationAll';
        this.$router.push({
          // name: 'informationAll',
          query: {
            nowid: data
          }
        })
      }
    },
    watch:{
      list:function (value) {
        this.canNext = true;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  .v-information {
    /*background:linear-gradient(to bottom right, #21B6FC , #3854CF);*/
    background-color: @com-body-bg;
    .title {
      .xiebian(@com-h1S1-font, @com-module-title-bg,32px);
      .iconfont {
        color:@com-tab-A-color;
        font-size: 32px;
      }
      .right-ico{
        float: right;
        padding-right: 10px;
        line-height: 32px;
        .iconfont2 {
          color: #8e939a;
          font-size: 14px;
          line-height: 14px;
        }
        .iconfont {
          color: @com-buttonIcoMy-M-color;
          // font-size: 20px;
          margin-right: 10px;
          cursor: pointer;
          &:hover{
            color:@com-buttonIcoMy-X-color;
          }

        }
        .more-info{
          color: @com-h4s4-font;
          line-height: 32px;
          font-size: 12px;
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
          &:hover{
            color:@com-button-X-font;
          }
        }
      }
    }
    .content {
      height: calc(100% - 32px);
      overflow: auto;
      .content-list {
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          background-color:  @com-hover-bg;
          /* .content-title{
             color: @color-gold !important;
           }*/
        }
        .line-bottom{
          border-bottom:1px solid @com-solidS2-bg;
        }
        .noimg {
          padding: 20px 10px 0;
          /*margin: 5px;*/
          /*.content-text {
            font-size: @font - 2px;
            color: @color-less;
            margin-top: 5px;
            height: 50px;
          }*/
          .content-title {
            color: @com-h1S1-font;
            /*overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;*/
          }
          .content-text {
            font-size: @font - 2px;
            color: @com-h3-font;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 10px;
            line-height: 20px;
            height: 40px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            &.small {
              font-size: @font - 4px;
              color: @com-h4s4-font;
            }
          }

        }
        .oneimg {
          padding: 0px 10px;
          img {
            width: 90px;
            height: 60px;
            /*background: white;*/
            float: left;
            /*margin: 15px 10px 10px 0;*/
            margin-right: 10px;
            vertical-align: top;
            margin-top: 10px;
          }
          .content-text {
            font-size: @font - 4px;
            color: @com-h3-font;
            margin: 6px 0 20px 0;
            /* overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;*/
            .span-title1{
              display: inline-block;
              width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: middle
            }
            .span-title2{
              vertical-align: middle

            }
          }

          .content-title {
            color: @com-h1S1-font;
            overflow: hidden;
            padding-top: 10px;
            height: 33px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: @font - 2px;
          }
        }
        .threeimg {
          padding: 20px 10px 0px;
          .img-block {
            display: flex;
            justify-content: space-between;
            img {
              margin: 5px 0;
              /*background: white;*/
              width: 30%;
              height: 60px;
            }
          }
          .content-title {
            color: @com-h1S1-font;
            /*overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;*/
            margin-bottom: 10px;
          }
          .content-text {
            font-size: @font - 4px;
            color: @com-h3-font;
            margin-top: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
</style>

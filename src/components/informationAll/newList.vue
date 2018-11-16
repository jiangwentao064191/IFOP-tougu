<template>
  <div class="information-left">
    <div class="touzi-main touzi-main1">
      <a class="main-back back-main" @click="toIndex">
        < 返回
      </a>
      <div class="tap-block" style='width:100%'>
        <span class="main-back" :class="{'tap-link':true,'active':type === data.code}" v-for="(data,i) in typeList"
              @click="changeType(data)" :key="i">
                {{data.name}}
              </span>
        <i class="iconfont icon-refresh iconfont2" @click="getInforList"></i>

      </div>
    </div>
    <div class="information-lists" v-loading="loading" element-loading-background="rgba(255,255,255,0.3)"
         @scroll="toNextPage($event)" :class="{topHeight:type==='info'}">
      <div v-if="!msgList.length|| (type ==='Report'&& (userLevel ==='A'))" class="no-data">
        <img src="../../assets/img/no_data.png"/>
      </div>
      <div :class="{'content-list':true,'now-content':data.info_id === nowid}" v-for="(data,key) in msgList"
           @click="toDetail(data)" :key="key" v-if="type==='info'|| userLevel ==='B'" ref="listItem">
        <!--无图-->
        <div class="content-group no-img clearfix" v-if="!data.img_list">
          <!--<img class="header-main-img" src="#">-->
          <div class="header-main-right2">
            <p class="header-main-title header-main-title1">{{data.title}}</p>
            <!-- <div class="header-main-content more-text"> -->
            <!-- {{data.digest | filterNbsp}} -->
            <!-- </div> -->
            <div class="header-main-footer2 clearfix">
               <span v-if="data.data_from == 'crawl'">
                <img class="footer-icon" :src="data.author_head ? data.author_head : defaultMobileHead"
                     :onerror="$store.state.peoplegerror">
                <span class="footer-span">{{data.author_name}}</span>
               </span>
              <span v-else>
                  <img class="footer-icon"
                       :src="data.publisher_user.head ? data.publisher_user.head : defaultMobileHead"
                       :onerror="$store.state.peoplegerror">
                <span class="footer-span">{{data.publisher_user.nickname || data.publisher_user.name}}</span>
              </span>
              <span class="footer-comment" @click="goComment">
              <img src="../../assets/img/zixunpinglun.png" class="icon-pinglun"/>
              {{data.comment_stat.all_comment_count}}
            </span>
              <span class="footer-comment">
                 <i class="iconfont icon-zxxq_icon_zang"></i>
                {{data.objectstat.favour}}
              </span>
              <span class="footer-hour">{{data.publish_time | hourTime}}</span>

            </div>
          </div>
        </div>
        <!-- 一张图 -->
        <div class="content-group1 oneImg clearfix" v-if="data.img_list && data.img_list.length === 1">
          <div class="header-main-img" v-if="data.media_type == 'video'"
               :style="{ background : 'url(' + data.img_list[0] + ')'}">
            <div class="play">
              <img class="cover-pic" :src="data.video_cover">
              <span></span>
              <img src="../../assets/img/play.png"/>
              <span class="duration">
                  <i class="iconfont icon-bofang"></i>
                  <span>{{data.video_length}}</span>
                </span>
            </div>
          </div>
          <img class="header-main-img" v-if="data.media_type == 'picture'" :src="data.img_list[0]"
               @error="hideImage(key)" :ref="'hideImg'+key">
          <div class="header-main-right2">
            <p class="header-main-title header-main-title2">{{data.title}}</p>
            <!-- <div class="header-main-content more-text"> -->
            <!-- {{data.digest  | filterNbsp}} -->
            <!-- </div> -->
            <div class="header-main-footer2 clearfix">
              <span v-if="data.data_from == 'crawl'">
                <img class="footer-icon" :src="data.author_head ? data.author_head : defaultMobileHead"
                     :onerror="$store.state.peoplegerror">
              <span class="footer-span one-img" :class="{'foot-title':true}">{{data.author_name}}</span>
              </span>
              <span v-else>
                <img class="footer-icon" :src="data.publisher_user.head ? data.publisher_user.head : defaultMobileHead"
                     :onerror="$store.state.peoplegerror">
              <span class="footer-span one-img" :class="{'foot-title':true}">{{data.publisher_user.nickname || data.publisher_user.name}}</span>
              </span>

              <span class="footer-comment" @click="goComment">
              <img src="../../assets/img/zixunpinglun.png" class="icon-pinglun"/>
              {{data.comment_stat.all_comment_count}}
            </span>
              <span class="footer-comment">
                 <i class="iconfont icon-zxxq_icon_zang"></i>
                {{data.objectstat.favour}}
              </span>
              <span class="footer-hour">{{data.publish_time | hourTime}}</span>
            </div>
          </div>
        </div>
        <!--三张图-->
        <div class="content-group2" v-if="data.img_list && data.img_list.length > 1">
          <p class="header-main-title header-main-title3">{{data.title}}</p>
          <div class="clearfix img-list">
            <img class="header-main-img" v-for="(img,i) in data.img_list" :src="img" :key="i">
          </div>
          <div class="header-main-footer2 clearfix">
            <span v-if="data.data_from == 'crawl'">
              <img class="footer-icon" :src="data.author_head ? data.author_head : defaultMobileHead"
                   :onerror="$store.state.peoplegerror">
            <span class="footer-span">{{data.author_name}}</span>
            </span>
            <span v-else>
              <img class="footer-icon" :src="data.publisher_user.head ? data.publisher_user.head : defaultMobileHead"
                   :onerror="$store.state.peoplegerror">
            <span class="footer-span">{{data.publisher_user.nickname || data.publisher_user.name}}</span>
            </span>

            <span class="footer-comment" @click="goComment">
              <img src="../../assets/img/zixunpinglun.png" class="icon-pinglun"/>
              {{data.comment_stat.all_comment_count}}
            </span>
            <span class="footer-comment">
                 <i class="iconfont icon-zxxq_icon_zang"></i>
                {{data.objectstat.favour}}
              </span>
            <span class="footer-hour">{{data.publish_time | hourTime}}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {getImformationTypeListAPI, getImformationListAPI} from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend';

  export default {
    name: "newList",
    props: [
      "msgList",
      "nowid",
      "loading",
      "tabIndex"
    ],
    data() {
      return {
        list: this.msgList,
        userLevel: localStorage.getItem("userLevel"),
        typeList: [],
        type: localStorage.getItem("tabFlag") ? JSON.parse(localStorage.getItem("tabFlag")).code : this.tabIndex,
        canNext: true,
        tabFlag: JSON.parse(localStorage.getItem("tabFlag")) ? JSON.parse(localStorage.getItem("tabFlag")).code : "",
        isClick: false,
        maskStatus: false,
        defaultMobileHead: "../../assets/img/defaultHead.png"
      }
    },
    updated: function () {
      /*if(document.querySelector('.now-content')){
        this.$store.state.detailController.nowPosition = document.querySelector('.now-content').offsetTop;
        // console.log('this.nowposi', this.$store.state.detailController.nowPosition);
      }*/
      if (!this.isClick) {
        if (this.$store.state.detailController.nowPosition) {
          document.querySelector('.information-lists').scrollTo(0, this.$store.state.detailController.nowPosition);
        }
      }
    },
    //过滤器
    filters: {
      filterNbsp: function (value) {
        return value.replace(/\s/g, "")
      }
    },

    mounted: function () {
      this.getInformation();
      if (localStorage.getItem("tabFlag")) {
        this.$emit("changeType", JSON.parse(localStorage.getItem("tabFlag")).code);
      }
      setTimeout(() => {
        this.$refs.listItem[0].click()
      }, 500);
    },
    methods: {

      getInformation() {
        let _this = this;
        send.ajaxSend({
          url: getImformationTypeListAPI,
          thisVue: _this,
          data: {"enabled": true},
          success: function (data) {
            _this.typeList = data.infotypes
          }
        })
      },
      hideImage(i) {
        console.log(this.$refs['hideImg' + i][0])
        if (this.$refs['hideImg' + i][0]) {
          this.$refs['hideImg' + i][0].parentNode.style.paddingLeft = 0;
          this.$refs['hideImg' + i][0].style.display = "none";
          this.$refs['hideImg' + i][0].parentNode.children[1].style.width = "606px";
        }

      },
      //获取资讯列表
      getInforList: function () {
        this.$emit("updateLoading", true)
        let _this = this;
        send.ajaxSend({
          url: getImformationListAPI,
          thisVue: _this,
          data: {"page.size": 10, "page.no": 1, 'put_status': 'Y', "info_type": "info"},
          success: function (data) {
            _this.$emit("updateLoading", false)
            for (let i = 0; i < data.info_list.length; i++) {
              if (data.info_list[i].img_list) data.info_list[i].img_list = data.info_list[i].img_list.split(',')
              if (data.info_list[i].data_from && data.info_list[i].data_from == 'crawl') {
                data.info_list[i].img_list = data.info_list[i].img_list.slice(0, 1)
                // console.log('@@@img_list', data.info_list[i].img_list);
              }
            }
            _this.list = _this.list.concat(data.info_list);
            _this.totalpage = data.page.totalpage;

          }
        })
      },
      toIndex: function () {
        this.$router.push({path: "/index"});
        this.$store.state.detailController.show = true;
        this.$store.state.detailController.type = 'index';
      },
      goComment: function () {
        /* this.$emit('goComment',true);*/
        this.$store.state.scrollComment = true;
      },
      toDetail: function (data) {
        this.isClick = true;
        this.$emit("changeID", data);
      },
      changeType: function (data) {
        console.log(data);
        this.type = data.code;
        this.$emit("changeType", data.code);
      },
      toNextPage: function (e) {
        let domHeight = e.srcElement.scrollHeight;
        let viewHeight = e.srcElement.clientHeight;
        let scrollHeight = e.srcElement.scrollTop;
        if (domHeight <= viewHeight + scrollHeight + 10) {
          this.$emit('nextPage', this.canNext);
          this.canNext = false;
        }
      }
    },
    watch: {
      tabIndex: function (value) {
        this.type = value
      },
      msgList: function (value) {
        // console.log('value', value)
        this.canNext = true;
      },
    }
  }
</script>

<style>
  @import "../../assets/css/midea";
</style>

<style scoped lang="less">
  @import "../../assets/style/public";

  .information-left {
    width: 42%;
    height: 100%;
    float: left;
    background-color: @com-module-bg;
  }

  .touzi-main {

    .clear-both;
    .main-back {
    }
    .tap-block {
      .iconfont2 {
        position: fixed;
        top: 55px;
        right: 20px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: @com-buttonIco-X-color;
        }
      }
      span {
        padding: 0px 5px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        color: @com-tab-M-color;
        cursor: pointer;
        &.active {
          font-weight: bold;
          border-bottom: 2px solid @com-tab-X-border;
          color: @com-tab-A-color;
        }
      }
    }
  }

  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }

  .icon-pinglun {
    width: 16px;
    margin-right: 2px;
    margin-top: -5px;
    vertical-align: middle;
  }

  .no-data {
    position: absolute;
    // z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* background: @com-module-bg;*/
    color: @com-h4s4-font;
    font-size: @font + 6px;
    display: flex;
    justify-content: center;
    align-items: Center;
  }

  .information-left {
    height: 100%;
    float: left;
    .topHeight {
      margin-top: 40px !important;
    }
    .information-lists {
      position: relative;
      height: calc(100% - 39px);
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      float: left;
      .no-img {
        padding-left: 0 !important;

        .header-main-right2 {
          width: 100%;
        }
      }
      .oneImg {
        .header-main-right2 {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .content-group1 {
        .header-main-footer2 {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .content-group, .content-group1, .content-group2 {
        padding: 20px;
        .header-main-img {
          /*  background: @gray-4;*/
          width: 154px;
          height: 100px;
          float: left;
          position: relative;
          margin-right: 20px;
          .play {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            text-align: center;
            line-height: 152px;
            cursor: pointer;
            img {
              width: 30%;
              position: absolute;
              top: 26px;
              left: 48px;
            }
            .cover-pic, span {
              background: rgba(0, 0, 0, 0.3);
              position: absolute;
              width: 154px;
              height: 100px;
              top: 0;
              left: 0;
            }
            .duration {
              position: absolute;
              left: 82px;
              top: 79px;
              background: rgba(34, 34, 34, 0.7);
              border-radius: 100px;
              font-size: 12px;
              color: #fff;
              padding: 2px 7px;
              width: 46px;
              height: 16px;
              span {
                background-color: transparent;
                line-height: 16px;
                position: absolute;
                left: 6px;
                top: 2px;
                width:60px;
                height: 20px;
              }
              .icon-bofang {
                font-size: 8px;
                line-height: 16px;
                position: absolute;
                left: 6px;
              }
            }
          }
        }
        .header-main-right2 {
          margin-left: 20px;
        }
        .header-main-title {
          font-size: @font - 2;
          color: @com-h1S2-font;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .header-main-title1 {
          margin-bottom: 30px;
        }
        .header-main-title2 {
          margin-bottom: 50px;
        }
        .header-main-title3 {
          // margin-bottom: 30px;
        }
        .header-main-content {
          font-size: @font - 4;
          margin: 16px 0;
          line-height: 24px;
          height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .header-main-footer2 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .footer-icon {
            /*  background: @gray-4;*/
            width: 24px;
            height: 24px;
            border-radius: 12px;
            vertical-align: middle;
          }
          .footer-span {
            font-size: @font - 4;
            color: @com-h3-font;
            display: inline-block;
            padding: 0 5px;
            vertical-align: middle;
          }
          .one-img {
            width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .foot-title {
            padding: 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .footer-hour {
            font-size: @font - 4;
            color: @com-h4s4-font;
            padding-left: 10px;
          }
          .footer-comment {
            font-size: @font - 4;
            padding-left: 10px;
            padding-right: 10px;
            i {
              margin-right: 5px;
            }
          }

        }
        .img-list {
          display: flex;
          margin: 20px 0;
          justify-content: space-between;
          img {
            width: 32%;
            height: content-box;
          }
        }
        .more-img {
          margin-top: 14px;
        }
      }
      .group-footer {
        padding: 0 20px;
        height: 46px !important;
        text-align: left;
        .text-title {
          display: inline-block;
          vertical-align: top;
          width: 100px;
          .text-num {
            padding: 0 5px;
            color: @com-h4s4-font;
          }
        }
      }
      .content-list {
        border-bottom: 1px solid @com-solidS2-bg;
        background-color: @com-module-bg;
        transition: all 0.3s;
        &.now-content {
          background: @com-hover-bg;
        }
        &:hover {
          background-color: @com-hover-bg;
          cursor: pointer;
        }
      }
    }
  }
</style>
<style lang="less">
  .information-left {
    .touzi-main1 {
      position: fixed;
      z-index: 1;
    }
  }
</style>


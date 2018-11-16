<!--主页直播模块-->
<template>
  <div class="v-broadcast" v-loading="loading" element-loading-background="transparent">
    <div class="title">
      <i class="iconfont icon-tietel_bg_picx"></i>
      <span class="text">直播</span>
      <div class="right-more">
        <span class="refresh" alt="" @click="refurbish"></span>
        <span class="more" @click="goLiveList">更多</span>
        <img class="go" @click="goLiveList" src="@/assets/img/course/go.png">
      </div>
    </div>
    <div class="box">
      <div>
        <div v-if="dataList.length>0">
          <div v-if="courseData.vipcode === 'B'" class="member flex-wrap-center"><img class="peo"
                                                                                      src="@/assets/img/course/hy_pic_g.png">
          </div>
          <div>
            <div class="img" @click="directlyLook()">
              <div class="memberLogo" v-if="courseData.vipcode === 'B'"><img class="peo"
                                                                             src="@/assets/img/course/hy_pic_g.png"
                                                                             v-if="courseData.vipcode === 'B'"></div>
              <div class="play">
                <img :src="courseData.coverurl" alt="" class="coverurl">
                <!-- <img src="../../assets/img/play.png" class="playIcon" /> -->
                <!--<div class="playIcon" @click="directlyLook">
                  <span>{{courseData.status==="opened"?"进入直播":"回看"}}</span>
                </div>-->
              </div>
            </div>
            <div class="bottom-text">
              {{courseData.name}}
              <span class="right" v-if="courseData">{{courseData.status==="opened"?"直播中":"回看"}}
                <span class="icon-living" v-if='courseData.status==="opened"'></span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="!dataList.length>0" class="backBox img flex-column-center">
          <div>
            <div class="flex-wrap-center"><img src="@/assets/img/noLivefocus.png" alt=""></div>
            <div>
              <span class="no-live">暂无直播</span>
            </div>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="li flex-wrap-between" :class="index=== listIndex?'backGroundColor':''"
             v-for="(data,index) in dataList" :key="index" @click="toggle(index)">
          <div class="li-top">
            <div class="title-list" v-if="data.lastcourse">{{data.lastcourse.topic}}</div>
            <div class="time-list">{{data.createtime|sliceTime}}</div>
          </div>
          <div v-if="data.lastcourse" v-show="data.lastcourse.status === 'opened'" class='button'
               @click="directlyLook(index)">{{data.lastcourse.status |state}}
          </div>
          <div v-if="data.lastcourse" v-show='data.lastcourse.status ==="closed"'
               :class="index=== listIndex?'backActive':'backLook'" @click="directlyLook(index)">{{data.lastcourse.status
            |state}}
          </div>
        </div>
        <div v-if="!dataList.length>0" class="nothing flex-column-center">
          <img src="@/assets/img/live/noPlay.png" alt="">
          <span>当前无直播</span>
        </div>
      </div>
    </div>
    <wicket :status="maskStatus" @hide="hideMask($event)"></wicket>
  </div>
</template>

<script>
  import send from "../../assets/js/ajaxSend";
  import wicket from "../frame/wicket";
  import {mediaCastPushAPI, getRoomListAPI, addParticipantAPI} from "../../assets/apiRegular";

  export default {
    name: "broadcast",
    data() {
      return {
        live: {},
        // roomId: 2,
        loading: false,
        maskStatus: false,
        courseData: {},
        dataList: [],
        userLevel: localStorage.getItem("userLevel"),
        listIndex: 0,
        user: '',
        count: 0,
      };
    },
    components: {
      wicket
    },
    filters: {
      sliceTime(value) {
        if (!value) return "";
        return value.slice(0, 16);
      },
      state(value) {
        if (value === "opened") return "正在直播";
        if (value === "closed") return "回看";
      }
    },
    mounted() {
      const _this = this;
      _this.user = JSON.parse(localStorage.getItem("logininfo")).user;
      _this.getLatestLive();
    },
    methods: {
      refurbish() {
        let _this = this;
        _this.loading = true;
        _this.listIndex = 0;
        _this.getLatestLive();
      },
      toggle(i) {
        let _this = this;
        _this.courseData = _this.dataList[i];
        _this.listIndex = i;
      },
      getLatestLive() {
        var _this = this;
        const sorts = JSON.stringify([
          {field: "(case when f_status = 'opened' then 1 else 0 end)", sortType: "desc"},
          {field: "f_create_time", sortType: "desc"}
        ]);
        send.ajaxSend({
          url: getRoomListAPI,
          data: {
            pageNo: 1,
            pageSize: 10,
            sorts: sorts,
            statuses: JSON.stringify(["opened", "closed"])
          },
          success: function (data) {
            _this.courseData = data.courseserieslist[0] ? data.courseserieslist[0] : {};
            _this.dataList = data.courseserieslist;
            _this.loading = false;
            console.log('dataList', _this.dataList)
          }
        });
      },
      sendAjax: function () {
        let _this = this;
        if (_this.courseData.status === "opened") {
          send.ajaxSend({
            url: mediaCastPushAPI,
            data: {
              courseId: _this.courseData.lastcourse.id
            },
            success: dataResult => {
              _this.openWin(dataResult.vcloudchannel.hlspullurl);
            }
          });
        } else {
          _this.openWin(_this.courseData.lastcourse.coursewareurl);
        }
        _this.setUser(_this.courseData.lastcourse.id);
      },
      setUser(courseid) {
        let _this = this;
        send.ajaxSend({
          url: addParticipantAPI,
          data: {
            userId: _this.user.user_id,
            courseId: courseid
          },
          success: function (data) {
            console.log('addParticipantAPI', data)
          }
        })
      },
      openWin(url) {
        let _this = this;
        // var str = Math.random();
        /* var ret = sendMessageTo(id, 'broadcast');
           var resultCode = ret.resultCode;
           console.log("ret.resultCode",resultCode);*/
        // 获取直播间路由

        let routeData = this.$router.resolve({
          name: "broadcast",
          query: {
            courseid: _this.courseData.lastcourse.id,
            url: url,
            status: _this.courseData.lastcourse.status
          }
        });
        // window.open(routeData.href, '_blank');
        createSpecialWindow({
          url: "login.html" + routeData.href,
          id: _this.courseData.id,
          width: 1000,
          height: 670
        });
      },
      goLiveList() {
        let _this = this;
        _this.$router.push({name: "courseLiveList"});
      },
      hideMask(value) {
        let _this = this;
        _this.maskStatus = value;
      },
      // 打开直播间
      directlyLook(i) {
        console.log('i',i)
        const _this = this;
        _this.count = _this.count + 1;
        setTimeout(function () {
          console.log('_this.count', _this.count)
          if (_this.count === 1) {
            if (_this.courseData.vipcode === "B") {
              if (_this.userLevel === "B") {
                _this.sendAjax();
              } else {
                _this.maskStatus = true;
              }
            } else {
              _this.sendAjax();
            }
            if(i != null){
              console.log('99999')
              _this.toggle(i);
            }

          }
          _this.count = 0
        }, 300)

      }
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  @title-bg: #4c4c4c;
  .v-broadcast {
    background: @com-body-bg;
    position: relative;
    .backBox {
      background-image: url(../../assets/img/live/noLiveBg.png);
      color: @com-h2S1-font;
      .no-live{
        color:@com-h4s4-font;
      }
      img {
        margin-bottom: 20px;
      }
    }
    .memberLogo {
      position: absolute;
      width: 40px;
      height: 25px;
      background: #000;
      opacity: 0.5;
      top: 10px;
      border-radius: 0 20px 20px 0;
      .peo {
        position: absolute;
        width: 20px;
        height: 16px;
        top: 5px;
        left: 10px;
        z-index: 1;
      }
    }
    .member {
      position: absolute;
      top: 40px;
      left: 0;
      width: 36px;
      height: 20px;
      background: RGBA(0, 0, 0, 0.5);
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      z-index: 100;
      .peo {
        display: inline-block;
        width: 16px;
        height: 14px;
      }
    }
    .title {
      /*height: 24px !important;*/
      line-height: 32px;
      border-bottom: 1px solid @com-solidS2-bg;
      color:@com-h1S1-font;
      background: @com-module-title-bg;
      .text {
        line-height: 32px !important;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        left: -4px !important;
        color:@com-sizeS5-color;
      }
      .xiebian(@com-h1S1-font, @com-module-title-bg,32px);
      .iconfont {
        color:@com-tab-A-color;
        font-size: 32px;
      }
      .title-content {
        float: right;
        line-height: @font * 2;
        padding: 0 10px;
      }
      .right-more {
        font-size: 12px;
        font-family: SourceHanSansCN-Normal;
        font-weight: 400;
        float: right;
        color: @com-h1S1-font;
        margin-top: 1px;
        .go {
          margin-right: 9px;
          width: 8px;
          height: 14px;
          position: relative;
          top: 2px;
          cursor: pointer;
        }
        .more {
          display: inline-block;
          margin-left: 19px;
          margin-right: 6px;
          cursor: pointer;
          color: @com-h4s4-font;
          &:hover {
            color: @com-button-X-font;
          }
        }
        .refresh {
          display: inline-block;
          width: 13px;
          height: 13px;
          position: relative;
          top: 2px;
          cursor: pointer;
          background-image: url(../../assets/img/live/refresh_1.svg);
          &:hover {
            background-image: url(../../assets/img/live/refresh_2.svg);
          }
        }
      }
    }
    .bottom-text {
      color: @com-h2S1-font;
      padding: 12px 10px;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      width: calc(70.5% - 20px);
      background: rgba(0, 0, 0, 0.3);
      .right {
        float: right;
        color: RGBA(255, 255, 255, 1);
        font-size: 12px;
        .icon-living {
          // position: relative;
          // top: 2px;
          display: inline-block;
          width: 20px;
          height: 16px;
          z-index: 3;
          margin-left: 10px;
          background-image: url(../../assets/img/course/live.svg);
          background-size: 1033% 100%;
          animation: isliving 1.2s steps(6) infinite;
        }
      }
    }
    .img {
      position: absolute;
      top: 32px;
      left: 0;
      right: 0;
      bottom: 0;
      width: 70.5%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .play {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: transparent;
        /*background: rgba(0,0,0,0.3);*/
        text-align: center;
        // line-height: 300px;
        cursor: pointer;
        .coverurl {
          width: 100%;
          height: 100%;
        }
        .playIcon {
          width: 160px;
          line-height: 47px;
          background: rgba(0, 0, 0, 1);
          border: 1px solid rgb(41, 39, 26);
          opacity: 0.5;
          border-radius: 6px;
          color: rgba(255, 217, 4, 1);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          &:hover {
            width: 160px;
            height: 47px;
            background: rgba(234, 200, 9, 1);
            border: 1px solid rgba(255, 217, 4, 1);
            border-radius: 6px;
            color: rgba(25, 27, 35, 1);
            opacity: 1;
          }
        }
        // img {
        //   vertical-align: middle;
        // }
      }
      // .play:hover .playIcon {
      //   display: block;
      // }
      // .playIcon:hover span {
      //   background: #e7c27f;
      //   color: #191b23;
      // }
    }
  }

  @keyframes isliving {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -194px 0;
    }
  }

  img[src=""] {
    opacity: 0;
  }

  .box {
    display: flex;
    height: calc(100% - 25px);
    .list {
      color: @com-h3-font;
      width: 30%;
      margin-left: 70.5%;
      font-size: 12px;
      overflow-y: scroll;
      /*height: 100%;*/
      background-color: @com-module-bg;
      // position: relative;
      .li {
        height: 50px;
        padding: 12px 10px;
        border-bottom: 1px solid rgba(44, 51, 58, 1);
        cursor: pointer;
        background-color: @com-module-bg;
        &:hover {
          background-color: @com-hover-bg;
        }
        // &:hover {
        //   background: rgba(@color-less-zb);
        //   .backLook {
        //     width: 72px;
        //     height: 28px;
        //     border: 1px solid rgba(234, 200, 9, 1);
        //     border-radius: 3px;
        //     color: rgba(234, 200, 9, 1);
        //   }
        // }
        .li-top {
          width: calc(100% - 82px);
        }
        .title-list {
          color: @com-h1S1-font;
          margin-bottom: 6px;
        }
        .time-list {
          color: @com-h4s4-font;
        }
        .button,
        .backLook {
          text-align: center;
          line-height: 28px;
          width: 72px;
          font-size: 12px;
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          border-radius: 3px;
        }
        .button {
          color: @com-buttonS2-font;
          background: @com-button-A-bg;
        }
        .backLook {
          color: @com-button-C-font;
          border: 1px solid @com-button-C-border;
        }
      }
      .nothing {
        position: absolute;
        z-index: 10;
        top: 32px;
        bottom: 0;
        left: 70.5%;
        right: 0;
        background: @com-module-bg;
        color: @com-h4s4-font;
        // margin-top: 200px;
        img {
          display: inline-block;
          margin-bottom: 20px;
        }
      }
    }
  }

  .backGroundColor {
    background-color: @com-hover-bg !important;
  }

  .backActive {
    text-align: center;
    line-height: 28px;
    width: 72px;
    border: 1px solid @com-button-A-border;
    border-radius: 3px;
    color: @com-button-A-font;
  }
</style>

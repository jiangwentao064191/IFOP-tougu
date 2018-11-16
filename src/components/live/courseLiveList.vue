<template>
  <div class="wrap">
    <back-index data="直播列表" />
    <span class="refresh" alt="" @click="allCourser('refresh')"></span>
    <div class="wrapContent" v-loading="loading" element-loading-background="transparent">
      <div class="todayLive">
        <div class="head">当前直播</div>
        <div v-if="list">
          <div class="row">
            <div class="col"></div>
            <div class="col fontColor">主题</div>
            <div class="col fontColor">老师</div>
            <div class="col fontColor">知识点</div>
            <div class="col fontColor">创建时间</div>
            <div class="col"></div>
          </div>
        </div>
        <div class="content" @scroll="toNextPage($event,'open')" id="bottCont" :style="'height:'+ (num * 40) +'px;'" style="max-height: 200px;">
          <div class="module" v-for="(item,i) in list" :key="i" v-if="liveLength>0">
            <div>
              <div class="row">
                <div class="col"><img class="peo" src="@/assets/img/course/hy_pic_g.png" v-if="item.vipcode?item.vipcode === 'B':item.vipcode === 'A'"></div>
                <div class="col">{{item.name}}</div>
                <div class="col"><img class="icon" :src="item.lecturer.head" />{{item.lecturer.name}}</div>
                <div class="col">
                  <span class="point" v-for="(tab,index) in item.lastcourse.knowledgepoint.split(':')" :key="index"><img class="i" src="@/assets/img/live/labelIcon.svg" />{{tab}}</span>
                </div>
                <div class="col">{{item.createtime |sliceTime}}</div>
                <div class="col">
                  <div class="statu" @click="directlyLook(item.lastcourse.id,item.lastcourse.topic,item.lastcourse.status,item.lecturerid,item.vipcode)">
                    <span class="iconBox flex-wrap-center"><img class="stateImg" src="@/assets/img/live/play.png" /></span>
                    <span class="stateText">立即观看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box flex-column-center" v-if="liveLength===0" style="height: 200px;">
          <img src="@/assets/img/live/noPlay.png" alt="">
          <span>当前无直播</span>
        </div>
      </div>
      <div class="tomorrowLive">
        <div class="head">历史回顾</div>
        <div v-if="dataResult">
          <div class="row">
            <div class="col"></div>
            <div class="col fontColor">主题</div>
            <div class="col fontColor">老师</div>
            <div class="col fontColor">知识点</div>
            <div class="col fontColor">创建时间</div>
            <div class="col"></div>
          </div>
        </div>
        <div class="content" @scroll="toNextPage($event,'back')" ref="abc">
          <div class="module" v-for="(item,index) in dataResult" :key="index" v-if="lBlength>0">
            <div>
              <div class="row">
                <div class="col"><img class="peo" src="@/assets/img/course/hy_pic_g.png" v-if="item.vipcode?item.vipcode === 'B':item.vipcode === 'A'"></div>
                <div class="col">{{item.name}}
                </div>
                <div class="col"><img class="icon" :src="item.lecturer.head" />{{item.lecturer.name}}</div>
                <div class="col">
                  <span class="point" v-for="(tab,index) in item.lastcourse.knowledgepoint?item.lastcourse.knowledgepoint.split(':'):[]" :key="index"><img class="i" src="@/assets/img/live/labelIcon.svg" />{{tab}}</span>
                </div>
                <div class="col">{{item.createtime |sliceTime}}</div>
                <div class="col">
                  <div class="statuBack" @click="backLook(item.lastcourse.id,item.lastcourse.topic,item.lastcourse.status,item.lecturerid,item.vipcode,item.lastcourse.coursewareurl)">
                    <span class="iconBox flex-wrap-center"><img class="stateImg" src="@/assets/img/course/kc_pic_hk.svg" /></span>
                    <span class="stateText">直播回看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box flex-column-center" v-if="lBlength===0">
          <img src="@/assets/img/live/noPlay.png" alt="">
          <span>当前无直播</span>
        </div>
      </div>
      <div class="pastLive">
        <!-- <div class="head">往期直播</div> -->
        <!-- <div class="wrap">
          <div class="lesson-block">
            <div class="link">
              <div class="img-block">
                <img src="@/assets/img/cover.jpg" />
                <span class="img-float flex-wrap-between">
                  <span class="icon-left flex-wrap-center">
                    <img class="icon" src="@/assets/img/course/head.png" /> 课程简介
                  </span>
                  <span class="text-right flex-wrap-center">
                    <img class="peo" src="@/assets/img/course/pic_ren.svg">233人
                  </span>
                </span>
              </div>
              <div class="lesson-name">李元今日精准解盘</div>
              <div class="lesson-near">多家从事上市公司业务的会计师事务所被证监会暂停材料申报。</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <wicket :status="maskStatus" @hide="hideMask($event)"></wicket>
  </div>
</template>

<script>
import backIndex from "../frame/backIndex";
import wicket from "../frame/wicket";
import { getRoomListAPI, mediaCastPushAPI,addParticipantAPI } from "../../assets/apiRegular";
import send from "../../assets/js/ajaxSend";
export default {
  name: "liveList",
  data() {
    return {
      maskStatus: false,
      canNext: true,
      getNext: true,
      list: [],
      loading:false,
      dataResult: [],
      openPageNo: 1,
      closedPageNo: 1,
      closedtotalpage: 1,
      opendtotalpage: 1,
      liveLength:0,
      lBlength:0,
      user:'',
      userLevel: localStorage.getItem("userLevel"),
      num:0,
      orderHight:document.body.clientHeight,
    };
  },
  components: {
    backIndex,
    wicket
  },
  filters: {
    sliceTime(value) {
      if (!value) return "";
      return value.slice(0, 16);
    }
  },
  computed: {
    num: function (value) {
      return value;
    },
  },
  mounted() {
    const _this = this;
    _this.user = JSON.parse(localStorage.getItem("logininfo")).user;
    _this.orderHight = document.body.clientHeight,
      window.onresize = function temp() {
        _this.orderHight = document.documentElement.clientHeight;
        let numH = 0;
        if(_this.num == 0 || _this.num >= 5 || !_this.num || _this.num == null){
          numH = 200;
        }
        else {
          numH = _this.num * 40;
        }
        _this.$refs.abc.style.height = _this.orderHight - numH - 310 + 'px';
      };
    _this.allCourser("load");
  },
  watch: {
    dataResult: function(value) {
      this.canNext = true;
    },
    list: function(value) {
      this.getNext = true;
    },
    num:function(value){
      this.num = value;
    },
  },
  methods: {
    allCourser(status) {
      const _this = this;
          // _this.$store.state.loadingContent = false;

      _this.loading = true;
      if (status == "refresh") {
        _this.openPageNo = 1;
        _this.closedPageNo = 1;
        _this.list = [];
        _this.dataResult = [];
      }
      _this.getOpendCourse();
      _this.getClosedCourse();
    },
    showMask() {
      let _this = this;
      _this.maskStatus = true;
    },
    hideMask(value) {
      let _this = this;
      _this.maskStatus = value;
    },
    getOpendCourse(status, num) {
      var _this = this;
      const sorts = JSON.stringify([
        {
          field:
            "(case when f_type = 'livebroadcast' and f_status = 'opened' then 1 else 0 end)",
          sortType: "desc"
        },
        {
          field:
            "(select max(f_create_time) from t_course where f_valid_Flag = 1 and f_course_series_id = t_course_series.f_id)",
          sortType: "desc"
        },
        { field: "f_id", sortType: "desc" }
      ]);
      send.ajaxSend({
        url: getRoomListAPI,
        data: {
          pageNo: _this.openPageNo,
          pageSize: 10,
          sorts: sorts,
          status: "opened"
        },
        success: function(data) {
          if(data.courseserieslist){
          _this.list = _this.list.concat(data.courseserieslist);
          console.log(_this.list,"直播列表");
          _this.opendtotalpage = Math.ceil(data.totalcount / 10);
          }
          _this.liveLength=_this.list.length;
          _this.num =  _this.liveLength;
          let numH = 0;
          if(_this.num == 0 || _this.num >= 5 || !_this.num || _this.num == null){
            numH = 200;
          }
          else {
            numH = _this.num * 40;
          }
          _this.$refs.abc.style.height = _this.orderHight - numH - 310 + 'px';
          /*  if(!_this.num){
              _this.num = 0;
            }
            _this.$refs.abc.style.height = _this.orderHight - ((_this.num * 40) > 200 ? 200 : (_this.num * 40)) - 310 + 'px';*/
        }
      });
    },
    getClosedCourse() {
      var _this = this;
      const sorts = JSON.stringify([
        {
          field:
            "(case when f_type = 'livebroadcast' and f_status = 'opened' then 1 else 0 end)",
          sortType: "desc"
        },
        {
          field:
            "(select max(f_create_time) from t_course where f_valid_Flag = 1 and f_course_series_id = t_course_series.f_id)",
          sortType: "desc"
        },
        { field: "f_id", sortType: "desc" }
      ]);
      send.ajaxSend({
        url: getRoomListAPI,
        data: {
          pageNo: _this.closedPageNo,
          pageSize: 30,
          sorts: sorts,
          status: "closed"
        },
        success: function(data) {
          _this.$store.state.loadingContent = false;
          _this.loading=false;
          if(data.courseserieslist){
              _this.dataResult = _this.dataResult.concat(data.courseserieslist);
          _this.closedtotalpage = Math.ceil(data.totalcount / 10);
          }
        _this.lBlength=_this.dataResult.length;
        }
      });
    },
    toNextPage: function(e, status) {
      let domHeight = e.srcElement.scrollHeight;
      let viewHeight = e.srcElement.clientHeight;
      let scrollHeight = e.srcElement.scrollTop;
      if (domHeight <= viewHeight + scrollHeight + 10) {
        if (status == "back") {
          this.nextPage(this.canNext, "backLook");
          this.canNext = false;
        }
        if (status == "open") {
          this.nextPage(this.getNext, "openLook");
          this.getNext = false;
        }
      }
    },
    nextPage: function(data, state) {
      if (state == "backLook") {
        if (data) {
          this.closedPageNo++;
          if (this.closedPageNo <= this.closedtotalpage) {
            this.getClosedCourse();
          }
        }
      }
      if (state == "openLook") {
        if (data) {
          this.openPageNo++;
          if (this.openPageNo <= this.opendtotalpage) {
            this.getOpendCourse();
          }
        }
      }
    },
    backliveRoom(courseid, title, state, id, mp4Url) {
      let routeData = this.$router.resolve({
        name: "broadcast",
        query: {
          url: mp4Url,
          courseid: courseid,
          status: state
        }
      });
      createSpecialWindow({
        url: "login.html" + routeData.href,
        id: courseid,
        width: 1000,
        height: 670
      });
    },
    toliveRoom(courseid, title, state, id) {
      // 打开直播间
      let _this = this;
      send.ajaxSend({
        url: mediaCastPushAPI,
        data: {
          courseId: courseid
        },
        success: dataResult => {
          // 获取直播间路由
          let routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              courseid: courseid,
              url: dataResult.vcloudchannel.hlspullurl,
              status: state
            }
          });
          // window.open(routeData.href, '_blank');
          createSpecialWindow({
            url: "login.html" + routeData.href,
            id: courseid,
            width: 1000,
            height: 670
          });
        }
      });
    },
    directlyLook(courseid, title, state, id, vipLevel) {
      const _this = this;
      if (vipLevel === "B") {
        if (_this.userLevel === "B") {
          _this.toliveRoom(courseid, title, state, id);
        } else {
          _this.maskStatus = true;
        }
      } else {
        _this.toliveRoom(courseid, title, state, id);
      }
    },
    setUser(courseid){
      let _this = this;
      send.ajaxSend({
        url:addParticipantAPI,
        data:{
          userId:_this.user.user_id,
          courseId:courseid
        },
        success:function (data) {
          console.log('addParticipantAPI',data)
        }
      })
    },
    backLook(courseid, title, state, id, vipLevel, mp4Url) {
      const _this = this;
      if (vipLevel === "B") {
        if (_this.userLevel === "B") {
          _this.backliveRoom(courseid, title, state, id, mp4Url);
          _this.setUser(courseid);
        } else {
          _this.maskStatus = true;
        }
      } else {
        _this.backliveRoom(courseid, title, state, id, mp4Url);
        _this.setUser(courseid);
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/style/public";
.wrap {
  position: relative;
  font-size: @font - 2px;
  color: @com-h2S1-font;
  width: 100%;
  height: 100%;
  .refresh {
    position: absolute;
    top: 9px;
    right: 20px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url(../../assets/img/live/refresh_1.svg);
    &:hover {
      position: absolute;
      top: 9px;
      right: 20px;
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url(../../assets/img/live/refresh_2.svg);
    }
  }
  .wrapContent {
    padding: 5px 10px 0px;
    font-size: @font - 2px;
    color: @com-h2S1-font;
    .todayLive,
    .tomorrowLive {
      margin-bottom: 12px;
      background: @com-module-bg;
      .content {
        /*max-height: 320px;*/
        overflow: auto;
      }
      .box {
        width: 100%;
        // height: 239px;
        text-align: center;
        img {
          display: inline-block;
          width: 100px;
          height: 120px;
          margin-bottom: 20px;
        }
        span {
          color: @com-h4s4-font;
          font-size: 12px;
        }
      }
      .head {
        height: 55px;
        line-height: 55px;
        text-indent: 1%;
        color: @com-h3-font;
        border-bottom: 1px solid @com-solidS2-bg;
      }
      .row {
        display: flex;
        padding-right: 10px;
        height: 40px;
        line-height: 40px;
        color: @com-h3-font;
        font-size: 14px;
        border-bottom: 1px solid @com-solidS2-bg;
        text-align: left;
        &:hover {
          background: @com-hover-bg;
        }
        .col {
          display: flex;
          align-items: center;
          .icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .point {
            margin-right: 21px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            .i {
              display: inline-block;
              width: 12px;
              height: 12px;
              margin-right: 5px;
            }
          }
        }
        .col:first-child {
          width: 3.2%;
          img {
            display: inline-block;
            width: 16px;
            height: 13px;
            margin: 0 auto;
          }
        }
        .col:nth-child(2) {
          width: 24%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .col:nth-child(3) {
          width: 9.7%;
        }
        .col:nth-child(4) {
          width: 47%;
        }
        .col:nth-child(5) {
          width: 10.4%;
          font-size: 12px;
          /*color: RGBA(125, 133, 142, 1);*/
        }
        .col:last-child {
          width: 9.2%;
          display: flex;
          justify-content: flex-end;
          &:hover {
            cursor: pointer;
          }
          .statu,
          .statuBack {
            display: flex;
            width: 119px;
            height: 28px;
            border-radius: 3px;
            .iconBox {
              width: 32%;
              text-align: center;
              .stateImg {
                display: inline-block;
                width: 16px;
                height: 16px;
              }
            }
            .stateText {
              display: inline-block;
              text-align: center;
              line-height: 28px;
              width: 69%;
            }
          }
          .statu {
            border: 1px solid @com-button-M-border;
            & .stateText {
              background: @com-button-M-bg;
              color: @com-button-M-font;
            }
          }
          .statuBack {
            border: 1px solid @com-button-M-border;
            & .stateText {
              background: @com-button-M-bg;
              color: @com-button-M-font;
            }
          }
        }
      }
    }
  }
}
.fontColor {
  color: @com-h4s4-font;
}
</style>

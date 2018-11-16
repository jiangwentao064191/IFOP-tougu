<template>
  <div class="wrap" v-loading.fullscreen.lock="fullscreenLoading">
    <el-progress v-loading.fullscreen.lock="showPercentage"  element-loading-background="rgba(200,200,200, 0.5)" element-loading-spinner="show-spinner" class="circle-percen" type="circle" v-if="showPercentage" :percentage="videoPercentage"></el-progress>
    <back-index data="直播列表"/>
    <!--<span class="refresh" alt="" @click="allCourser('refresh')"></span>-->
    <i class="iconfont icon-huanyihuan refresh" @click="allCourser('refresh')"></i>
    <div class="fb-btn" @click="toNewLive">新增直播</div>
    <div class="wrapContent" v-loading="loading" element-loading-background="transparent">
      <div class="todayLive">
        <div class="head">当前直播</div>
        <div v-if="list">
          <div class="row">
            <div class="col"></div>
            <div class="col fontColor">主题</div>
            <div class="col fontColor">知识点</div>
            <div class="col fontColor">创建时间</div>
            <div class="col fontColor">直播时间</div>
            <div class="col fontColor">操作</div>
          </div>
        </div>
        <div class="content" @scroll="toNextPage($event,'open')" id="bottCont" :style="'height:'+ (num * 40) +'px;'"
             style="max-height: 200px;">
          <div class="module" v-for="(item,i) in list" :key="i" v-if="liveLength>0">
            <div>
              <div class="row">
                <div class="col"><img class="peo" src="@/assets/img/course/hy_pic_g.png"
                                      v-if="item.vipcode?item.vipcode === 'B':item.vipcode === 'A'"></div>
                <div class="col">{{item.name}}</div>
                <!--<div class="col"><img class="icon" :src="item.lecturer.head"/>{{item.lecturer.name}}</div>-->
                <div class="col">
                  <span class="point" v-for="(tab,index) in knowPointList(item)" :key="index"><img
                    class="i" src="@/assets/img/live/labelIcon.svg"/>{{tab}}</span>
                </div>
                <div class="col fontColor">{{item.createtime |sliceTime}}</div>
                <div class="col fontColor">{{item.timeStrEnd}}</div>
                <div class="col fontColor">

                  <div class="btn-lab start-btn"
                       @click="directlyLook(item.lastcourse.id,item.lastcourse.topic,item.lastcourse.status,item.lecturerid,item.vipcode)"
                       v-if="item.lastcourse.status == 'unopened'">
                    <i class="iconfont icon-bofang"></i>
                    <span class="stateText">开始直播</span>
                  </div>
                  <div class="btn-lab liveing"
                       @click="directlyLook(item.lastcourse.id,item.lastcourse.topic,item.lastcourse.status,item.lecturerid,item.vipcode)"
                       v-if="item.lastcourse.status == 'opened'">
                    <span class="icon-living"></span>
                    <span class="stateText">直播中</span>
                  </div>
                  <div class="btn-lab lz"
                       v-if="item.type == 'livebroadcast' && item.lastcourse.status == 'videoRecord'">
                    <span class="stateText">录制中</span>
                  </div>
                  <div class="btn-lab" v-if="item.lastcourse.status == 'unopened'" @click.stop="editorInfo(item.id)">
                    <i class="iconfont icon-kc_icon_bj"></i>
                    <span class="stateText">编辑</span>
                  </div>
                  <div class="btn-lab" v-if="item.lastcourse.status != 'opened'" @click.stop="deleteLive(item)">
                    <i class="iconfont icon-kclist_icon_delete"></i>
                    <span class="stateText">删除</span>
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
            <div class="col fontColor">知识点</div>
            <div class="col fontColor">创建时间</div>
            <div class="col fontColor">直播时间</div>
            <div class="col fontColor">操作</div>
          </div>
        </div>
        <div class="content" @scroll="toNextPage($event,'back')" ref="abc">
          <div class="module" v-for="(item,index) in dataResult" :key="index" v-if="lBlength>0">
            <div>
              <div class="row">
                <div class="col"><img class="peo" src="@/assets/img/course/hy_pic_g.png"
                                      v-if="item.vipcode?item.vipcode === 'B':item.vipcode === 'A'"></div>
                <div class="col">{{item.name}}
                </div>

                <div class="col">
                  <span class="point" v-for="(tab,index) in  knowPointList(item)" :key="index"><img class="i"
                                                                                                    src="@/assets/img/live/labelIcon.svg"/>{{tab}}</span>
                </div>
                <div class="col fontColor">{{item.createtime |sliceTime}}</div>
                <div class="col fontColor">{{item.timeStrEnd}}</div>
                <div class="col">
                  <div class="btn-lab block-btn"
                       @click="backLook(item.lastcourse.id,item.lastcourse.topic,item.lastcourse.status,item.lecturerid,item.vipcode,item.lastcourse.coursewareurl)"
                       v-if="item.status == 'closed'">
                    <i class="iconfont icon-kc_pic_hk"></i>
                    <span class="stateText">直播回看</span>
                  </div>
                  <div class="btn-lab start-btn" @click="setUploadData(item.lastcourse.id,item.lastcourse.courseseriesid)"
                       v-if="item.type == 'courseware' && item.lastcourse.status== 'videoRecord'">
                    <!-- <i class="iconfont icon-bofang"></i>
                     <span class="stateText">上传课件</span>-->

                    <el-upload class='upload-demo'
                               accept="video/mp4"
                               :action="upLoadUrl"
                               :data="upLoadData"
                               multiple
                               :limit="1"
                               :on-change="handleChangeV"
                               :before-upload="beforeAvatarUploadV"
                               :show-file-list="false"
                               :on-progress="getProgress"
                               :on-success="successUpload"
                               :on-error="errorUpload">
                      <i class="iconfont icon-bofang"></i>
                      <span class="stateText">上传课件</span>
                    </el-upload>

                  </div>
                  <div class="btn-lab lz"
                       v-show="item.type == 'livebroadcast' && item.lastcourse.status == 'videoRecord'">
                    <span class="stateText">录制中</span>
                  </div>
                  <div class="btn-lab delete-btn" v-if="item.lastcourse.status != 'opened'"
                       @click.stop="deleteLive(item)">
                    <i class="iconfont icon-kclist_icon_delete"></i>
                    <span class="stateText">删除</span>
                  </div>
                  <!--<div class="statuBack"
                       @click="backLook(item.lastcourse.id,item.lastcourse.topic,item.lastcourse.status,item.lecturerid,item.vipcode,item.lastcourse.coursewareurl)">
                    <span class="iconBox flex-wrap-center"><img class="stateImg"
                                                                src="@/assets/img/course/kc_pic_hk.svg"/></span>
                    <span class="stateText">直播回看</span>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box flex-column-center no-hs-live" v-if="lBlength===0">
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
  import {
    getRoomListAPI,
    mediaCastPushAPI,
    addParticipantAPI,
    courseSeries,
    deleteliveRoomAPI,
    apiUrl,
    imgUrlAPI
  } from "../../assets/apiRegular";
  import send from "../../assets/js/ajaxSend";

  export default {
    name: "liveList",
    data() {
      return {
        showPercentage:false,
        videoPercentage:0,
        upLoadUrl:imgUrlAPI,
        upLoadData: {},
        fullscreenLoading: false,
        maskStatus: false,
        canNext: true,
        getNext: true,
        list: [],
        loading: false,
        dataResult: [],
        openPageNo: 1,
        closedPageNo: 1,
        closedtotalpage: 1,
        opendtotalpage: 1,
        liveLength: 0,
        lBlength: 0,
        user: '',
        userLevel: localStorage.getItem("userLevel"),
        num: 0,
        orderHight: document.body.clientHeight,

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
      _this.$store.state.loadingContent = false;
      _this.user = JSON.parse(localStorage.getItem("logininfo")).user;
      _this.orderHight = document.body.clientHeight,
        window.onresize = function temp() {
          _this.orderHight = document.documentElement.clientHeight;
          let numH = 0;
          if (_this.num == 0 || _this.num >= 5 || !_this.num || _this.num == null) {
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
      dataResult: function (value) {
        this.canNext = true;
      },
      list: function (value) {
        this.getNext = true;
      },
      num: function (value) {
        this.num = value;
      }
    },
    methods: {
      setUploadData(courseId,courseSeriesId){
        let obj = {"courseId":courseId, "courseSeriesId": courseSeriesId};
        this.upLoadData = {'token':JSON.parse(localStorage.getItem('logininfo')).session_id,'param':JSON.stringify(obj)}
      },
      handleChangeV(file, fileList) {
        const isLt10M = file.size / 1024 / 1024 < 1024;
        if (["video/mp4"].indexOf(file.raw.type) == -1) {
          this.$message.error("请上传正确的视频格式");
          return false;
        }
        if (!isLt10M) {
          this.$message.error("上传视频大小不能超过1G哦!");
          return false;
        }
      },
      beforeAvatarUploadV(file) {
        const isLt10M = file.size / 1024 / 1024 < 1024;
        if (["video/mp4"].indexOf(file.type) == -1) {
          this.$message.error("请上传正确的视频格式");
          return false;
        }
        if (!isLt10M) {
          this.$message.error("上传视频大小不能超过1G哦!");
          return false;
        }
      },
      getProgress(event,file) {
        this.fullscreenLoading = false;
        this.videoPercentage = parseInt(file.percentage);
        if(!this.showPercentage){
          this.showPercentage = true;
        }
      },
      //上传成功时候的钩子
      successUpload(data) {
        this.$message({
          message: '上传成功',
          type: 'success',
        });
        this.showPercentage = false;
        this.allCourser("refresh");
      },
      errorUpload(err) {
        this.showPercentage = false;
        this.$message({
          message: '视频上传失败',
          type: 'error',
        });
      },
      uploadRequest(file) {
        let _this = this;
        let formData = new FormData();
        /*  formData.append('file', file.file);
          axios.post( _this.videoUrlAPI,formData).then((res) => {
            _this.judgeUpload = false;
            _this.upSuccess();
          }).catch(function (res) {
            _this.errorUpload(res)
          })*/
      },
      knowPointList(item) {
        let str = ''
        if (item.introduction) {
          str = item.introduction
        }
        let arr = [];
        if (str) {
          if (str.indexOf(':') > 1) {
            arr = str.split(':')
          } else if (str.indexOf('：') > 1) {
            arr = str.split('：')
          } else {
            arr.push(str);
          }

          let thArr = [];
          if (arr.length > 3) {
            for (var i = 0; i < 3; i++) {
              thArr.push(arr[i]);
            }
            return thArr;
          } else {
            return arr;
          }
        }
      },
      toNewLive: function () {
        this.$router.push({name: 'newLive'});
      },
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
        _this.getOpendCourse("['unopened','opened']");
        _this.getOpendCourse("['closed','videoRecord']");

      },
      showMask() {
        let _this = this;
        _this.maskStatus = true;
      },
      hideMask(value) {
        let _this = this;
        _this.maskStatus = value;
      },
      getOpendCourse(status) {
        var _this = this;
        let query = {
          lecturerId: _this.user.user_id,
          pageSize: '10',
        };
        query.statuses = status;
        if (status == "['closed','videoRecord']") {
          // query.status = status;
          query.pageNo = _this.closedPageNo;
          query.sorts = '[{"field":"f_start_time","sortType":"desc"}]';
        } else {
          query.pageNo = _this.openPageNo;
          query.sorts = '[{"field":"f_start_time","sortType":"asc"}]';
        }
        send.ajaxSend({
          url: getRoomListAPI,
          data: query,
          success: function (data) {
            _this.loading = false;
            if (status == "['closed','videoRecord']") {
              if (data.courseserieslist) {
                _this.closedtotalpage = Math.ceil(data.totalcount / 10);
                _this.dataResult = _this.dataResult.concat(data.courseserieslist);
                for(let i = 0;i<_this.dataResult.length;i++){
                if(_this.dataResult[i].type === "livebroadcast"){
                    _this.dataResult[i].timeStrEnd = _this.dataResult[i].lastcourse.realstarttime.substr(0,16) + '-' + _this.dataResult[i].lastcourse.realendtime.substr(11,5);
                  }else{
                    _this.dataResult[i].timeStrEnd = _this.dataResult[i].createtime.substr(0,16);
                  }

                }
                _this.lBlength = _this.dataResult.length;
              } else {
                _this.lBlength = 0;
              }
              let guidList = JSON.parse(localStorage.getItem('userGuidList'));
              if(!guidList){
                guidList = [];
              }
              let guidListNum = 0;
             for(let i = 0;i<guidList.length;i++){
               let itemObj = JSON.parse(guidList[i]);
               if(itemObj.userId ==  _this.user.user_id){
                 guidListNum = 1;
                 if(!itemObj.isShowLive && _this.list.length < 1 && _this.dataResult.length < 1){
                   _this.$store.state.isShowLive = true;
                 }
               }
             }
             if(guidListNum == 0 && _this.list.length < 1 && _this.dataResult.length < 1){
               _this.$store.state.isShowLive = true;
             }
            /*  if(!localStorage.getItem('isShowLive') && _this.list.length < 1 && _this.dataResult.length < 1){
                _this.$store.state.isShowLive = true;
              }*/
            } else {
              if (data.courseserieslist) {
                _this.opendtotalpage = Math.ceil(data.totalcount / 10);
                _this.list = _this.list.concat(data.courseserieslist);
                for(let i = 0;i<_this.list.length;i++){
                  _this.list[i].timeStrEnd = _this.list[i].starttime.substr(0,16) + '-' + _this.list[i].endtime.substr(11,5);
                }
                _this.liveLength = _this.list.length;
              } else {
                _this.liveLength = 0;
              }
              _this.num = _this.liveLength;
              let numH = 0;
              if (_this.num == 0 || _this.num >= 5 || !_this.num || _this.num == null) {
                numH = 200;
              }
              else {
                numH = _this.num * 40;
              }
              _this.$refs.abc.style.height = _this.orderHight - numH - 310 + 'px';
            }

          }
        });
      },
      toNextPage: function (e, status) {
        let domHeight = e.srcElement.scrollHeight;
        let viewHeight = e.srcElement.clientHeight;
        let scrollHeight = e.srcElement.scrollTop;
        if (domHeight <= viewHeight + scrollHeight + 10) {
          console.log('status', status)
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
      nextPage: function (data, state) {
        if (state == "backLook") {
          if (data) {
            this.closedPageNo++;
            if (this.closedPageNo <= this.closedtotalpage) {
              this.getOpendCourse("['closed','videoRecord']");
            }
          }
        }
        if (state == "openLook") {
          if (data) {
            this.openPageNo++;
            if (this.openPageNo <= this.opendtotalpage) {
              this.getOpendCourse("['unopened','opened']");
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
        // window.open(routeData.href, '_blank');
    //    debugger
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
        let routeData = this.$router.resolve({
          name: "broadcast",
          query: {
            courseid: courseid,
            status: state
          }
        });
        //window.open(routeData.href, '_blank');
        createSpecialWindow({
          url: "login.html" + routeData.href,
          id: courseid,
          width: 1000,
          height: 670
        });
      },
      directlyLook(courseid, title, state, id, vipLevel) {
        const _this = this;
       /* if (vipLevel === "B") {
          if (_this.userLevel === "B") {
            _this.toliveRoom(courseid, title, state, id);
          } else {
            _this.maskStatus = true;
          }
        } else {
          _this.toliveRoom(courseid, title, state, id);
        }*/
        _this.toliveRoom(courseid, title, state, id);
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
      backLook(courseid, title, state, id, vipLevel, mp4Url) {
        const _this = this;
      /*  if (vipLevel === "B") {
          if (_this.userLevel === "B") {
            _this.backliveRoom(courseid, title, state, id, mp4Url);
            _this.setUser(courseid);
          } else {
            _this.maskStatus = true;
          }
        } else {
          _this.backliveRoom(courseid, title, state, id, mp4Url);
          _this.setUser(courseid);
        }*/
        _this.backliveRoom(courseid, title, state, id, mp4Url);
        _this.setUser(courseid);
      },
      editorInfo: function (id) {
        let _this = this;
        send.ajaxSend({
          url: courseSeries,
          data: {'courseSeriesId': id},
          success: function (data) {
            console.log('da', data.courseseries)
            _this.$router.push({
              name: 'newLive',
              query: {
                liveFromDate: data.courseseries
              }
            });
          }
        });
      },
      deleteLive: function (obj) {
        let _this = this;
        _this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          send.ajaxSend({
            url: deleteliveRoomAPI,
            data: {
              'courseSeriesId': obj.id,
              'lecturerId': _this.user.user_id,
            },
            success: function (data) {
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.allCourser("refresh");
              /*  console.log('col',obj.status)
                if(obj.status == 'closed'){
                  _this.closedPageNo = 1;
                  _this.getOpendCourse("['closed','videoRecord']");
                }else{
                  _this.openPageNo = 1;
                  _this.getOpendCourse("['unopened','opened']");
                }*/


            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
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
    .circle-percen{
      position: fixed;
      top:40%;
      left:50%;
      z-index: 3009;
      /deep/ .el-progress__text{
        color:#fff;
      }
    }
    .fb-btn {
      position: absolute;
      right: 20px;
      top: 0px;
    }
    .refresh {
      position: absolute;
      top: 2px;
      right: 140px;
      font-size: 24px;
      line-height: 40px;
      cursor: pointer;
      /*background-image: url(../../assets/img/live/refresh_1.svg);*/
      &:hover {
        color: @com-buttonIcoLive-X-color;
        /*background-image: url(../../assets/img/live/refresh_2.svg);*/
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
        position: relative;
        .content {
          /* max-height: 320px;*/
          overflow: auto;
        }
        .no-hs-live {
          position: absolute;
          top: 100px;
          height: 200px;
          background-color: @com-module-bg;
          span {
            margin-bottom: 10px;
            display: inline-block;
          }
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
            font-size: @font - 4;
            .liveing {
              padding-left: 26px;
              width: 100px !important;
            }
            .start-btn {
              color: @com-button-Co-font;
            }
            .lz {
              width: 100px !important;
              &:hover {
                color: @com-h3-font !important;
              }
            }
            .block-btn {
              color: #09B3FA;
              width: 100px !important;
            }
            .btn-lab {
              font-size: @font - 4;
              /*margin-right: 20px;*/
              position: relative;
              &:hover {
                color: @com-buttonIcoLive-X-color;
              }
              &:last-child {
                margin-right: 0px;
                padding-right: 0px;
                border-right: none;
              }
              .icon-living {
                position: absolute;
                left: -6px;
                top: 10px;
                display: inline-block;
                width: 20px;
                height: 16px;
                z-index: 3;
                margin-left: 10px;
                background-image: url(../../assets/img/course/live.svg);
                background-size: 1033% 100%;
                animation: isliving 1.2s steps(6) infinite;
              }
              @keyframes isliving {
                0% {
                  background-position: 0 0;
                }
                100% {
                  background-position: -194px 0;
                }
              }
            }
            .iconfont {
              font-size: @font - 4;
            }
            .delete-btn {
              color: @com-button-M-font
            }
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
            width: 26%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .col:nth-child(3) {
            width: 33%;
          }
          .col:nth-child(4) {
            width: 15%;
          }
          .col:nth-child(5) {
            width: 18%;
            font-size: 12px;
          }
          .col:last-child {
            width: 17%;
            max-width: 200px;
            .btn-lab {
              width: 68px;
              text-align: left;

            }
            .start-btn {
              width: 100px !important;
            }
            .liveing {
              width: 40px !important;
            }
            /* display: flex;
             justify-content: flex-end;*/
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
                /* width: 32%;*/
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
              /*  border: 1px solid @com-button-M-border;*/
              & .stateText {
                background: @com-button-M-bg;
                color: @com-button-M-font;
              }
            }
            .statuBack {
              /*  border: 1px solid @com-button-M-border;*/
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

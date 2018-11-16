<template>
  <div class="lessonList" v-loading.fullscreen.lock="fullscreenLoading" style="height: 100%;">
    <el-progress v-loading.fullscreen.lock="showPercentage" element-loading-background="rgba(200,200,200, 0.5)" element-loading-spinner="show-spinner" class="circle-percen" type="circle" v-if="showPercentage" :percentage="videoPercentage"></el-progress>
    <div class="touzi-main clearfix" style="display:block">
      <router-link class="main-back back-main" to="/index/mine">
        < 返回
      </router-link>
      <span class="main-back tap-link">我的课程</span>
      <div class="fb-btn" @click="toNewLesson">新建课程</div>
    </div>
    <div class="lesson" element-loading-background="rgba(255,255,255,0.3)">
      <div class="v-lesson-list clearfix" @scroll="toNextPage($event)" :class="[courseStatus]">
        <div class="lesson-left left">
          <div class="top">
            <p>系列课信息</p>
          </div>
          <div class="bottom">
            <div class="lesson-block" :class="{'now-content':data.id === nowid}" v-for="(data,key) in list" :key="key"
                 ref="listItem" @click="getSingleLessList(data.id,data.type,data.num)">
              <div class="link clearfix">
                <div class="img-block">
                  <img class="cov" :src="data.coverurl"/>
                  <div class="peo-bg" v-if="data.vipcode?data.vipcode === 'B':data.vipcode === 'A'"><img class="peo"
                                                                                                         src="@/assets/img/course/hy_pic_g.png">
                  </div>
                </div>
                <div class="img-right">
                  <p class="lesson-name">{{data.name}}</p>
                  <p>
                  <span class="type-btn" v-if="data.type == 'courseware'">
                    <i class="kj"></i>
                    <span>课件</span>
                  </span>
                    <span class="type-btn" v-if="data.type == 'livebroadcast'">
                    <i class="zb"></i>
                    <span>直播</span>
                  </span>
                    <span class="text-right">共{{data.num}}讲</span>
                  </p>
                  <p class="text-price">课程售价：<span>￥{{data.price}}</span></p>
                  <!--<p class="text-time">
                    开课时间：{{data.startTime}}
                  </p>-->
                  <!--<p class="lesson-near">
                    最近更新时间：{{data.updatetime | hours}}
                  </p>-->
                </div>
                <div class="bj-btn" @click="editLesson(data.id,data.type)" v-if="data.status == 'unopened'">
                  <i class="iconfont icon-kc_icon_bj"></i>
                </div>
                <!--<div class="pro-2 inl-bl lesson-cen">
                  <div class="hot">
                    {{recentList[key]?numberConvertToUppercase(recentList[key].rownum):""}}{{recentList[key]&&recentList[key].rownum>0?recentList[key].topic:""}}
                  </div>
                  <div class="people" ref="courseTime">
                    {{recentList[key]&&recentList[key].starttime?yearMonthDay(recentList[key].starttime)+"~":""}}
                    {{recentList[key]&&recentList[key].endtime?HourMinSec(recentList[key].endtime):""}}
                    {{recentList[key]&&recentList[key].starttime?getWeek(recentList[key].starttime):""}}
                  </div>
                  <div class="lesson-zb" ref="liveTime">
                    {{recentList[key]&&recentList[key].starttime?hours2(recentList[key].starttime) :''}}
                  </div>
                </div>-->
                <!-- <div class="fb-btn" @click.stop="deleteCourse(data.id,key)">删除</div> -->
              </div>
              <div class="list-bottom">
                <p class="content-tit">
                  简介：{{data.introduction}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="lesson-right right">
          <div class="top clearfix">
            <span>课程目录</span>
            <i class="iconfont icon-huanyihuan refresh" @click="refreshSingle"></i>
          </div>
          <div class="bottom" element-loading-background="rgba(255,255,255,0.3)" v-loading="rightLoading">
            <div>
              <li class="lesson-list clearfix" v-for="(item,key) in singLessList" :key="key">
                <div class="share" v-if="item.showIf?true:false">
                  <div class="shareLeft">
                    <!-- <img src="" alt=""> -->

                    <div class="img"></div>
                    <p>扫一扫手机进行分享</p>
                  </div>
                  <div class="shareCenter"></div>
                  <div class="shareRight">
                    <div class="link">链接地址</div>
                    <div class="linkAddress">
                      <textarea name="" id="" cols="30" rows="10"></textarea>
                    </div>
                    <button class="copyShare">复制分享链接</button>
                  </div>
                </div>
                <p class="less-li p-title"><span class="tab1">序号</span><span class="tab2">主题</span><span
                  class="tab3">知识点</span><span class="tab4" v-if="lessonType === 'livebroadcast'">上课时间</span></p>
                <p class="less-li"><span class="tab tab1">{{key+1}}</span><i v-if="item.id"
                                                                             style="font-style:normal;"><span
                  class="tab tab2">{{item.topic}}</span><span class="tab tab3">{{item.knowledgepoint}}</span>
                  <span class="tab tab4">{{item.starttime?yearMonthDay(item.starttime)+"~":""}}{{item.endtime?HourMinSec(item.endtime):""}} {{item.starttime?getWeek(item.starttime):""}}</span></i>
                </p>
                <!-- <p class="less-footer">
                  <i class="iconfont icon-kcxq_icon_share"></i><span>{{item.sharecount}}</span>
                  <i class="iconfont icon-zxxq_icon_zang"></i><span>{{item.favourcount}}</span>
                  <i class="iconfont icon-message"></i><span>{{item.commentcount}}</span>
                  <i class="iconfont icon-team" style="font-size: 14px;"></i><span>{{item.participantcount}}</span>
                </p> -->
                <div class="less-btn editStatus" v-if="item.id">
                <span class="sing-btn hk" v-if="item.status == 'closed'" @click="toLive(item)"><i
                  class="iconfont icon-kc_pic_hk"></i>直播回看</span>
                  <span class="sing-btn bf" v-if="item.status == 'unopened'" @click="toLive(item)"><i
                    class="iconfont icon-bofang"></i>开始授课</span>
                  <span class="sing-btn liveing" v-if="item.status == 'opened'" @click="toLive(item)">
                  <span class="icon-living"></span>
                  <span class="stateText">直播中</span>
                </span>
                  <span class="sing-btn lz"
                        v-if="lessonType == 'livebroadcast' && item.status == 'videoRecord'">录制中</span>
                  <span class="sing-btn sckj"
                        v-if="lessonType == 'courseware' && item.status == 'videoRecord'"
                        @click="modifySingle(item,key)">上传课件</span>
                  <span class="sing-btn bj" v-if="item.status == 'unopened'"><i class=" iconfont icon-kc_icon_bj"
                                                                                @click="modifySingle(item,key)"></i></span>
                  <span class="sing-btn dele" v-if="item.status != 'opened'"><i class="iconfont icon-kc_icon_deletex"
                                                                                @click="deleteSingle(item.id,key)"></i></span>
                </div>
                <el-button v-if="!item.id" @click="editContent(key)" class="compileBtn">
                  编辑内容
                </el-button>
              </li>
            </div>
            <div class="addCourseTc" v-if="isAdd">
              <el-button class="addCourse" @click="addCourse()">增加一节课</el-button>
            </div>
          </div>
          <el-dialog
            :title="number"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width="601px"
            class="single"
            slot="">
            <div class="singleNext">
              <el-form>
                <div class="course" v-if="!isLive">
                  <el-form-item label="课件地址">
                    <el-upload class='upload-demo'
                               ref="uploadFile"
                               accept="video/mp4"
                               action=""
                               :http-request="uploadRequest"
                               :data="upLoadData"
                               multiple
                               :on-exceed="exceedV"
                               :file-list="hasImgList"
                               :limit="1"
                               :on-change="handleChangeV"
                               :before-upload="beforeAvatarUploadV"
                               :on-remove="handleRemoveV"
                               :on-progress="getProgress"
                               :auto-upload="false"
                    >
                      <!--  :action="videoUrlAPI"-->
                      <div ref="box" v-show="isUpload" class="box"><p ref="boxCon" class="boxCon"></p></div>
                      <div class="shangchuan" ref="shangchuan">
                        <el-button size="small" type="primary" class="cleckUp">上传</el-button>
                        <span class="jinMp4">仅可上传MP4格式文件</span>
                      </div>
                    </el-upload>
                  </el-form-item>
                  <!-- <input type="text" placeholder="请输入课件地址" v-model="uploadUrl">-->
                </div>
                <el-form-item label="上课时间" prop="value1" class='shangkeTime' v-if="isLive" :rules="rules">
                  <div class="live">
                    <el-date-picker
                      v-model="value1" :picker-options="pickerOptions0"
                      type="date"
                      required
                      placeholder="选择日期"
                      default-value
                      class="selectDate">
                    </el-date-picker>

                    <el-time-select class="selectDate"
                                    placeholder=""
                                    v-model="value2"
                                    @change="setEndTime"
                                    :picker-options="{
      start: '00:00',
      step: '00:10',
      end: '23:50',
      minTime: minStartTime
    }">
                    </el-time-select>
                    <span class="linkSize">至</span>
                    <el-time-select
                      placeholder=""
                      v-model="value3"
                      class="selectDate"
                      :picker-options="{
      start: '00:00',
      step: '00:10',
      end: '23:50',
      minTime: minEndTime
    }">
                    </el-time-select>
                    <span class="time-weekday">{{weekDay|getWorkDay }}</span>
                  </div>
                </el-form-item>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                  <el-form-item label="主题" prop="textarea">
                    <el-input type="textarea" v-model="ruleForm.textarea" class="curTextarea"></el-input>
                  </el-form-item>
                  <el-form-item label="知识点" prop="keyWords">
                    <el-input type="textarea" v-model="ruleForm.keyWords"></el-input>
                  </el-form-item>
                </el-form>
                <span class="zhuming">最多五个知识点，请以 ；隔开。</span>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">

                    <el-button @click="cancel" class="cancel">取 消</el-button>
                    <el-button type="primary" @click="createSingle" class="sure">确 定</el-button>
                </span>
          </el-dialog>
        </div>
        <div class="no-data" v-if="!list.length">
          <img src="../../assets/img/暂无数据@2x.png">
          <p>无课程内容</p>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import {
    apiUrl,
    lessonListAPI,
    singleLessonListAPI,
    deleteCourseAPI,
    modifySingleCourse,
    getDayTime,
    addSingleLessonAPI,
    deleteSingleLessonAPI,
    addParticipantAPI,
    imgUrlAPI
  } from "../../assets/apiRegular";
  import send from "../../assets/js/ajaxSend";
  import axios from 'axios'

  export default {
    name: "homePageLessonList",
    data() {
      return {
        id: '',
        courseSeriesId: '',
        nowid: '',
        weekDay: "",
        isAdd: false,
        isLive: false,
        recentList: [],
        minEndTime: '',
        minStartTime: '',
        // loading:false,
        list: [],
        singLessList: [],
        sessionId: "",
        user: '',
        pageNo: 1,
        totalPage: 1,
        singId: 0,
        title: '不显示',
        courseStatus: '',
        listNum: '',
        lessonType: '',
        lessonNum: 0,
        number: '',
        dialogVisible: false,
        uploadUrl: '',
        videoUrlAPI: imgUrlAPI,
        upLoadData: {},
        hasImgList: [],
        ImgList: [],
        isUpload: false,
        value1: "",
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        value2: "",
        value3: "",
        pickerBeginDateAfter: '21:26:48 - 23:59:59',
        ruleForm: {
          textarea: '',
          keyWords: ''
        },
        rules: {
          keyWords: [
            {required: true, message: '请填写知识点', trigger: 'blur'}
          ],
          textarea: [
            {required: true, message: '请填写主题', trigger: 'blur'},
            {max: 30, message: '主题在30个字符内', trigger: 'blur'}
          ]
        },
        judgeUpload: false,
        fullscreenLoading: false,
        rightLoading: false,
        paramObj:{},
        showPercentage:false,
        videoPercentage:0,
      };
    },
    filters: {
      hours: function (value) {
        var newstr = value.replace(/-/g, '/');
        const time = new Date(newstr);
        const data = (Date.parse(new Date()) - time) / 3600 / 1000;
        if (data >= 24) {
          if (parseInt(data / 24) >= 365) {
            return parseInt(data / 24 / 365) + "年前";
          } else {
            return parseInt(data / 24) + "天前";
          }
        } else if (data < 1) {
          if (data * 60 < 1) {
            return "刚刚"
          } else {

            return parseInt(data * 60) + "分钟前";
          }
        } else {
          return parseInt(data) + "小时前";
        }
      },
      parseToObj: function (value) {
        return JSON.parse(JSON.stringify(value))
      },
    },
    mounted: function () {
      this.$store.state.loadingContent = false;
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      this.sessionId = JSON.parse(localStorage.getItem("logininfo")).session_id;
      this.value1 = new Date();
      this.getLessonList();
      if (this.$route.query.preName == 'newLesson') {
        this.lessonType = this.$route.query.type;
        this.courseSeriesId = this.$route.query.courseSeriesId
        this.editContent(0);
      }
    },
    methods: {
      uploadRequest(file) {
        let _this = this;
        let formData = new FormData();
        formData.append('file', file.file);
        formData.append('token', _this.sessionId);
        formData.append('param', JSON.stringify(_this.paramObj));
        axios({
          url: _this.videoUrlAPI,
          method: 'post',
          data:formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          onUploadProgress: function (event) {
            file.file.percent = event.loaded / event.total * 100
            file.onProgress(file.file);
          }
        }).then((res) => {
          _this.judgeUpload = false;
          _this.upSuccess();
        }).catch(function (res) {
          _this.errorUpload(res)
        })
      },
      toLive(obj) {
        let _this = this;
        let routeData = ''
        if (_this.lessonType == 'courseware') {
          routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              url: obj.coursewareurl,
              courseid: obj.id,
              status: obj.status
            }
          });
          // window.open(routeData.href, '_blank');
          createSpecialWindow({
            url: `login.html${routeData.href}`,
            id: obj.id,
            width: 1000,
            height: 670
          });
        } else {
            if (obj.status === "closed") {
              routeData = this.$router.resolve({
                name: "broadcast",
                query: {
                  url: obj.coursewareurl,
                  courseid: obj.id,
                  status: obj.status
                }
              });
            } else {
              routeData = this.$router.resolve({
                name: "broadcast",
                query: {
                  courseid: obj.id,
                  status: obj.status
                }
              });
            }
            // window.open(routeData.href, '_blank');
            createSpecialWindow({
              url: "login.html" + routeData.href,
              id: obj.id,
              width: 1000,
              height: 670
            });

        }
        send.ajaxSend({
          url: addParticipantAPI,
          data: {
            userId: _this.user.user_id,
            courseId: obj.id
          },
          success: function (data) {
            console.log('addParticipantAPI', data)
          }
        })

      },
      setEndTime() {
        //this.pickerBeginDateAfter=`${this.value2.getHours()+1}:${this.value2.getMinutes()}:${this.value2.getSeconds()} - 23:59:59`;
        this.getEndSpeicalTime()
      },
      getSpeicalTime() {
        let _this = this;
        let now = new Date();
        let str = now.getMinutes() + 10;
        // str = 67
        if (str >= 10 && str <= 59) {
          str = str.toString().substr(0, 1) + '0'
          let hoursStr = now.getHours();
          if (now.getHours() >= 1 && now.getHours() <= 9) {
            hoursStr = '0' + now.getHours();
          }
          _this.value2 = hoursStr + ':' + str;
          console.log('start', _this.value2)
        } else if (str > 59) {
          if (now.getHours() != 23) {
            _this.value2 = now.getHours() + 1 + ':00';
          } else {
            _this.value2 = '00:00';
          }
        }
        _this.minStartTime = now.getHours() + ':' + now.getMinutes();
        _this.getEndSpeicalTime();
      },
      getEndSpeicalTime() {

        let str = this.value2.substr(this.value2.length - 2, 2);
        let endStr = parseInt(str) + 20;
        this.minEndTime = this.value2.substr(0, 2) + ':' + endStr;
        let parStr = parseInt(str) + 30;
        // console.log('parStr', this.minEndTime)
        if (parStr >= 30 && parStr <= 50) {
          this.value3 = this.value2.substr(0, 2) + ':' + (parseInt(str) + 30);
        } else if (parStr == 60) {
          this.value3 = parseInt(this.value2.substr(0, 2)) + 1 + ':00';
        } else if (parStr == 70) {
          this.value3 = parseInt(this.value2.substr(0, 2)) + 1 + ':10';
        } else if (parStr == 80) {
          this.value3 = parseInt(this.value2.substr(0, 2)) + 1 + ':20';
        }
        if (parseInt(this.value2.substr(0, 2)) == 23 && parStr >= 60) {
          this.value3 = '00:00';
        }
      },
      //上传文件之前的钩子
      beforeAvatarUploadV(file) {
        console.log(file.size);
        const isLt10M = file.size / 1024 / 1024 < 1024;
        if (['video/mp4'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过1G哦!');
          return false;
        }
      },
      cancel() {
        if (this.$refs.uploadFile) {
          this.$refs.uploadFile.abort();
        }
        this.dialogVisible = false;

      },
      //限制上传视频个数
      exceedV(file, fileList) {
        if (fileList.length >= 1) {
          this.$message({
            message: '只能上传一个视频',
            type: 'warning'
          });
        }
      },
      //上传文件处理
      //文件改变时的钩子函数
      handleChangeV(file, fileList) {
        const isLt10M = file.size / 1024 / 1024 < 1024;
        if (["video/mp4"].indexOf(file.raw.type) == -1) {
          this.$message.error("请上传正确的视频格式");
          this.$refs.uploadFile.handleRemove();
          this.imgLength = 0;
          return false;
        }
        if (!isLt10M) {
          this.$message.error("上传视频大小不能超过1G哦!");
          this.imgLength = 0;
          this.$refs.uploadFile.handleRemove();
          return false;
        }
        this.$refs.shangchuan.style.display = "none";
        this.imgLength = fileList.length;
        this.imgList = fileList;
      },
      errorUpload(err) {
        this.fullscreenLoading = false;
        this.showPercentage = false;
        this.dialogVisible = false;
        this.$message({
          message: '视频上传失败',
          type: 'error',
        });
        console.log(err, "上传失败");
      },
      getProgress(event,file) {
        this.judgeUpload = true,
          this.isUpload = true;
        this.fullscreenLoading = false;
        this.videoPercentage = parseInt(file.percentage);
        if(!this.showPercentage){
          this.showPercentage = true;
        }
        // this.$refs.boxCon.style.width = event.percent / 100 * this.$refs.boxCon.parentNode.offsetWidth + "px";
      },
      //文件列表移除文件时的钩子
      handleRemoveV(file, fileList) {
        this.judgeUpload = false;
        this.imgLength = 0;
        if (this.$refs.shangchuan) {
          setTimeout(() => {
            this.$refs.shangchuan.style.display = "block";
          }, 0);
        }
        this.isUpload = false;
        this.videoPic = ''
      },
      successUpload(data) {
        this.judgeUpload = false;
        this.upSuccess();
        if (data) {
          let videoUrl = ''
          videoUrl = data.split('src="')[1];
          videoUrl = videoUrl.split('" />')[0];
          this.uploadUrl = videoUrl;
          this.$emit('getVideo', videoUrl);
          var vt = '';
          vt = data.split(',')[0];
          vt = vt.split(':')[1];
          vt = (parseInt(vt) / 100).toString();
          var rs = vt.indexOf('.');
          if (rs < 0) {
            rs = vt.length;
            vt += '.';
          }
          while (vt.length <= rs + 2) {
            vt += '0';
          }
          this.videoTime = vt.replace('.', ':');
          this.videoPic = data.split('"cover":"')[1];
          this.videoPic = this.videoPic.split('"}')[0];
        }

      },
      createSingle() {
        if (this.ruleForm.keyWords === "" || this.ruleForm.textarea === "") {
          this.$message.error("主题或知识点不能为空")
        } else {
          let _this = this;
          let message = {};
          /* let time = new Date();
           message.startTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + this.addZero(time);
           message.endTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + this.addZero(time);*/
          message.sessionId = _this.sessionId;
          message.courseSeriesId = _this.courseSeriesId;
          message.topic = encodeURIComponent(encodeURIComponent(_this.ruleForm.textarea));
          message.knowledgePoint = encodeURIComponent(encodeURIComponent(_this.ruleForm.keyWords));
          //新增单课
          if (_this.lessonType == 'courseware' && !_this.imgLength) {
            _this.$message({
              type: "warning",
              message: "请上传课件视频"
            })
            return false;
          }
          if (_this.lessonType === "livebroadcast") {
            let day = getDayTime(_this.value1).substr(0, 11);
            message.startTime = day + _this.value2 + ':00';
            message.endTime = day + _this.value3 + ':00';
          } else {
            // message.coursewareUrl = _this.uploadUrl;
            // message.videoCover = _this.videoPic;
            // message.videoLength = _this.videoTime;
          }
          let urlAPI = '';
          if (_this.edit === "open") {
            urlAPI = addSingleLessonAPI;
          }
          else {
            urlAPI = modifySingleCourse;
            message.courseId = _this.id
          }
          _this.fullscreenLoading = true;
          send.ajaxSend({
            url: urlAPI,
            thisVue: _this,
            data: message,
            success: function (data) {
              if (_this.lessonType === "livebroadcast") {
                _this.upSuccess();
              } else {
                /* _this.upLoadData.courseId = data.courseid;
                 _this.upLoadData.courseSeriesId = _this.courseSeriesId;*/
               /* _this.videoUrlAPI = apiUrl + '/ifop/Upload?courseId=' + data.courseid + '&courseSeriesId=' + _this.courseSeriesId;*/
                _this.paramObj = {"courseId": data.courseid, "courseSeriesId": _this.courseSeriesId};
                _this.$refs.uploadFile.submit();
              }
            }
          });

        }
      },
      upSuccess() {
        let _this = this;
        let messStr = '';
        if (_this.edit === "open") {
          messStr = '新建成功'
        } else {
          messStr = '修改成功'
        }
        _this.$message({
          message: messStr,
          type: 'success',
        });
        _this.fullscreenLoading = false;
        _this.showPercentage = false;
        _this.dialogVisible = false;
        _this.getSingleLessList(_this.courseSeriesId, _this.lessonType, _this.lessonNum);
      },
      //删除单课
      deleteSingle: function (courseId, index) {
        if (courseId) {
          let _this = this;
          _this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            send.ajaxSend({
              url: deleteSingleLessonAPI,
              thisVue: _this,
              data: {
                courseId: courseId,
                courseSeriesId: _this.courseSeriesId,
                lecturerId: _this.user.user_id
              },
              success: function (data) {
                // _this.singleList.splice(index,1)
                _this.getSingleLessList(_this.courseSeriesId, _this.lessonType, _this.lessonNum);
              }
            })
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
        } else {
          this.$message({
            type: "warning",
            message: "不能删除空的单课"
          })
        }

      },
      //修改单课
      modifySingle(item, index) {
        // this.modifyIndex=index;

        if (this.$refs.uploadFile) {
          this.imgLength = 0;
          this.$refs.uploadFile.handleRemove()
        }
        console.log('this.$refs.uploadFile', this.$refs.uploadFile)
        this.hasImgList = [];
        if (this.lessonType === "livebroadcast") {
          this.isLive = true;
          console.log('item', item)
          this.value1 = new Date(item.starttime.substr(0, 10));
          this.value2 = item.starttime.substr(11, 5);
          this.value3 = item.endtime.substr(11, 5);
        } else {
          this.isLive = false;
        }
        if (this.$refs.shangchuan) {
          setTimeout(() => {
            this.$refs.shangchuan.style.display = "block";
          }, 0);
        }
        if (this.$refs.boxCon) {
          setTimeout(() => {
            this.$refs.boxCon.style.width = "0";
          }, 0)
        }
        this.numberConvertToUppercase(index + 1);
        if (item.id) {
          this.edit = "close";
          this.uploadUrl = item.coursewareurl
          this.ruleForm.textarea = item.topic;
          this.ruleForm.keyWords = item.knowledgepoint;
          this.videoPic = item.videocover;
          this.id = item.id;
          this.dialogVisible = true;
        } else {
          this.$message({
            type: "warning",
            message: "单课为空，不能修改，请先创建"
          })
        }
      },
      //删除课程
      deleteCourse(id, key) {
        let _this = this;
        send.ajaxSend({
          url: deleteCourseAPI,
          thisVue: _this,
          data: {
            courseSeriesId: id,
            sessionId: _this.sessionId
          },
          success(data) {
            console.log(data, "删除课程")
            _this.list.splice(key, 1);
            if (_this.list.length == 0) {
              _this.courseStatus = 'courseStatus';
            }
          }
        })
      }
      ,
      //编辑课程
      editLesson: function (id, type) {
        this.$router.push({
          name: "newLesson",
          query: {
            courseSeriesId: id,
            type: type,
            info: "fromDetail"
          }
        });
      }
      ,
      hours2(value) {
        var date2 = new Date();    //结束时间

        var date3 = new Date(value).getTime() - date2.getTime();   //时间差的毫秒数
        if (date3 < 0) {
          return `暂无课程要直播`
        } else {
          //计算出相差天数
          var days = Math.floor(date3 / (24 * 3600 * 1000))
          //计算出小时数
          var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
          var hours = Math.floor(leave1 / (3600 * 1000))
          //计算相差分钟数
          var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave2 / (60 * 1000))
          //计算相差秒数
          var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
          var seconds = Math.round(leave3 / 1000)
          if (days <= 0) {
            return `距直播开始还有：${hours}小时${minutes}分钟${seconds}秒`
          } else {
            return `距直播开始还有：${days}天${hours}小时${minutes}分钟${seconds}秒`
          }
        }
      }
      ,
      toNextPage: function (e) {
        let item = this.$refs.listItem[0];
        let len = this.list.length;
        let heiTotal = item.offsetHeight * len;
        if (e.srcElement.scrollTop + e.srcElement.clientHeight + 10 >= heiTotal) {
          // this.loading=true;
          let _this = this;
          this.pageNo += 1;
          send.ajaxSend({
            url: lessonListAPI,
            thisVue: _this,
            data: {
              sessionid: _this.sessionId,
              pageSize: 10,
              pageNo: _this.pageNo,
            },
            success: function (res) {
              if (res.list) {
                setTimeout(() => {
                  // _this.loading=false;
                  _this.list = _this.list.concat(res.list);
                }, 100);
              } else {
                // _this.loading=false;
              }
            },
            loadingObj: true
          })
        }
      }
      ,
      //增加单课内容
      editContent(index) {
        this.ruleForm.textarea = "";
        this.ruleForm.keyWords = "";
        this.videoPic = '';
        this.hasImgList = [];
        if (this.$refs.shangchuan) {
          setTimeout(() => {
            this.$refs.shangchuan.style.display = "block";
          }, 0)
        }
        if (this.$refs.boxCon) {
          setTimeout(() => {
            this.$refs.boxCon.style.width = "0";
          }, 0)
        }
        this.numberConvertToUppercase(index + 1);
        this.uploadUrl = '';
        this.edit = 'open';
        if (this.lessonType === "livebroadcast") {
          this.isLive = true;
          this.getSpeicalTime();
        } else {
          this.isLive = false;
        }
        this.dialogVisible = true;
        this.editIndex = index;
      }
      ,
      //添加一节课
      addCourse() {
        this.singLessList.push({});
        if (this.singLessList.length >= this.lessonNum) {
          this.isAdd = false;
        }
      }
      ,
      //删除一节课
      handleClose(done) {
        if (this.$refs.uploadFile) {
          this.$refs.uploadFile.abort();
        }
        done();
      }
      ,
      yearMonthDay(value) {
        let a = value.slice(0, 16);
        return a;
      }
      ,
      HourMinSec(value) {
        let b = value.slice(10, 16)
        return b;
      }
      ,
      //- 小写数字转换成大写, 只处理到[0 ~ 99]
      numberConvertToUppercase(num) {
        num = Number(num);
        var upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
        var length = String(num).length;
        if (length == 1) {
          this.number = `第${upperCaseNumber[num]}课`;
        } else if (length == 2) {
          if (num == 10) {
            this.number = `第${upperCaseNumber[num]}课`;
          } else if (num > 10 && num < 20) {
            this.number = `第${'十' + upperCaseNumber[String(num).charAt(1)]}课`;
          } else {
            this.number = `第${upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '')}课`;
          }
        }
      }
      ,
      //日期变周几
      getWeek(value) {

        if (value) {
          value = JSON.parse(JSON.stringify(value));
          value = value.starttime;
          var dateObject = new Date(value);
          var str = dateObject.getDay();
          switch (str) {
            case 0:
              return "星期日";
              break;
            case 1:
              return "星期一";
              break;
            case 2:
              return "星期二";
              break;
            case 3:
              return "星期三";
              break;
            case 4:
              return "星期四";
              break;
            case 5:
              return "星期五";
              break;
            case 6:
              return "周六";
              break;
          }
        }
      }
      ,
      refreshSingle() {
        let _this = this;
        _this.rightLoading = true;
        _this.getSingleLessList(_this.nowid, _this.lessonType, _this.lessonNum)
      },
      getSingleLessList(id, type, num) {
        let _this = this;
        _this.lessonType = type;
        _this.lessonNum = num;

        _this.nowid = id;
        _this.courseSeriesId = id;
        send.ajaxSend({
          url: singleLessonListAPI,
          thisVue: _this,
          data: {
            courseSeriesId: id,
            sorts: '[{"field":"f_id","sortType":"asc"}]'
          },
          success(data) {
            _this.rightLoading = false;
            _this.singLessList = [];
            if (data.courses) {
              _this.singLessList = data.courses;
            }
            if (_this.singLessList.length < _this.lessonNum) {
              _this.singLessList.push({});
              _this.isAdd = true;
            }

            if (_this.singLessList.length >= _this.lessonNum) {
              _this.isAdd = false;
            }
          }
        })
      }
      ,
      toNewLesson: function () {
        this.$router.push({name: "newLesson"});
      }
      ,
      getLessonList: function () {
        let _this = this;
        send.ajaxSend({
          url: lessonListAPI,
          thisVue: _this,
          data: {
            sessionid: _this.sessionId,
            pageSize: 10,
            pageNo: _this.pageNo,
          },
          success: function (data) {
            if (data.list) {
              _this.courseStatus = '';
              _this.list = data.list;

              let guidList = JSON.parse(localStorage.getItem('userGuidList'));
              if(!guidList){
                guidList = [];
              }
              let guidListNum = 0;
              for(let i = 0;i<guidList.length;i++){
                let itemObj = JSON.parse(guidList[i]);
                if(itemObj.userId ==  _this.user.user_id){
                  guidListNum = 1;
                  if(!itemObj.isShowLess && _this.list.length < 1){
                    _this.$store.state.isShowLess = true;
                  }
                }
              }
              if(guidListNum == 0 && _this.list.length < 1){
                _this.$store.state.isShowLess = true;
              }
              /*if (!localStorage.getItem('isShowLess') && _this.list.length < 1) {
                this.$store.state.isShowLess = true;
              }*/
              _this.nowid = _this.list[0].id;
              _this.getSingleLessList(_this.list[0].id, _this.list[0].type, _this.list[0].num)
              for (let i = 0; i < _this.list.length; i++) {
                if (_this.list[i].type === "courseware") {
                  setTimeout(() => {
                    if (_this.$refs.courseTime) {
                      _this.$refs.courseTime[i].style.opacity = 0;
                    }
                    if (_this.$refs.liveTime) {
                      _this.$refs.liveTime[i].style.opacity = 0
                    }
                  }, 0);
                }
              }
              _this.totalPage = parseInt(data.totalcount);
              for (let i = 0; i < data.list.length; i++) {
                _this.recentList.push(data.list[i].recentcourse);
              }
            } else {
              _this.courseStatus = 'courseStatus';
            }
          }
        })
      }

    },
    watch: {
      value1: function (value) {
        let y = value.getFullYear();
        let m = value.getMonth() + 1;
        let d = value.getDate();
        this.weekDay = y + "-" + m + "-" + d;
      },
      value2: function (value) {
        this.value2 = value;
      }
      // initContentHeight:"initContentHeight"
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .circle-percen{
    position: fixed;
    top:40%;
    left:50%;
    z-index: 3001;
    /deep/ .el-progress__text{
      color:#fff;
    }
  }
  .lesson {
    // background-color: @com-module-bg !important;
    color: @com-h4s4-font;
    height: calc(100% - 42px);
    font-size: @font - 4;
    .left {
      float: left;
      height: 100%;
      width: 50%;
      display: inline-block;
      vertical-align: top;
    }
    .right {
      float: left;
      width: 50%;
      height: 100%;
      display: inline-block;
      vertical-align: top;
    }
    .lesson-left {
      .top {
        height: 40px;
        line-height: 40px;
        border-right: 1px solid @com-solidS1-bg;
        border-bottom: 1px solid @com-solidS1-bg;
        background-color: @com-module-title-bg;
        padding-left: 10px;
        color: @com-h1S1-font;
      }
      .bottom {
        height: calc(100% - 41px);
        overflow-y: scroll;
      }
    }
    .lesson-right {
      .top {
        height: 40px;
        line-height: 40px;
        background-color: @com-module-title-bg;
        padding-left: 10px;
        color: @com-h1S1-font;
        .refresh {
          float: right;
          margin-right: 80px;
          font-size: @font + 2;
          cursor: pointer;
          /*background-image: url(../../assets/img/live/refresh_1.svg);*/
          &:hover {
            color: @com-buttonIcoLive-X-color;
            /*background-image: url(../../assets/img/live/refresh_2.svg);*/
          }
        }
      }
      .bottom {
        height: calc(100% - 41px);
        overflow-y: scroll;
      }
      .addCourseTc {
        text-align: center;
        margin-bottom: 20px;
        .addCourse {
          width: 90px;
          height: 30px;
          margin-top: 15px;
          border: 1px dashed @com-button-Co-border;
          background-color: transparent;
          color: @com-button-Co-font;
          border-radius: 3px;
          padding: 0px;
          display: inline-block;
        }
      }
      .course {
        .upload-demo {
          display: inline-block;
          vertical-align: top;
          text-align: left;
          /deep/ .el-upload-list {
            margin-top: -30px !important;
          }
          .el-button--primary {
            margin-left: 5px !important;
          }
        }
        .dizhi {
          margin-left: 20px;
        }
        span {
          color: @com-h3-font;
          padding-right: 12px !important;
        }
        input {
          width: 425px;
          height: 30px;
          background: rgba(40, 44, 53, 1);
          border: none;
          outline: none;
          padding-left: 4px;
          color: @com-input-color-sr;
          box-sizing: border-box;
        }
        .el-upload {
          .el-button {
            width: 70px;
            font-size: 12px;
            border: none;
            outline: none;
            border-radius: 3px;
            margin: 9px 10px 3px 84px;
          }
          .cleckUp {
            background: transparent !important;
            border: 1px solid @com-button-Co-border;
            color: @com-button-Co-font !important;

            span {
              display: inline-block;
              width: 24px;
              height: 13px;
              color: @com-button-Co-font;
            }
          }
        }

      }
      .curTextarea {
        /deep/ .el-textarea__inner {
          height: 60px;
          color: @com-input-color-sr;
        }
      }
      /deep/ .el-textarea__inner, .el-input__inner {
        color: @com-input-color-sr;
      }
      .el-dialog {
        background-color: @com-sizeS3-color !important;
        .el-form {
          color: @com-h2S1-font;
          text-align: left;

          .el-form-item__content {
            margin-bottom: 17px;
          }

          .reward-cl {
            display: inline-block;
            vertical-align: top;
          }
          .time-input {
            display: inline-block;
            vertical-align: top;
            width: 138px !important;
            input {
              padding: 0 5px;
              text-align: center;
            }
            .el-input__icon,
            .el-icon-date {
              display: none;
            }
          }
          .time-weekday {
            color: @com-h3-font;
            margin-left: 10px;
          }
          .min-shot-input {
            width: 10%;
            min-width: 100px;
            input {
              text-align: center;
              padding: 0 5px;
            }
          }
          .limit-input {
            min-width: 60px;
            width: 60px;
            margin-left: 20px;
          }
          .reward-pro {
            position: absolute;
            left: 106px;
            color: @com-h4s4-font;
          }
          .img-pro {
            margin-top: 110px;
            font-size: 12px;
            color: @com-h4s4-font;
          }
          .el-form-item__content {
            line-height: 30px;
            color: #000;
          }
          .el-form-item__label {
            color: @com-h3-font;
            padding-right: 20px;
            line-height: 30px;
          }
          .icon-kc_icon_tjx {
            color: @com-h4s4-font;
          }
          .el-input {
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 100%;
          }
          .shot-input {
            width: 15%;
            min-width: 100px;
            input {
              text-align: center;
            }
          }
          .el-input__inner,
          .el-textarea__inner {
            background-color: @com-input-bg !important;
            border-radius: 2px;
            border: 1px solid @com-input-border;
            color: @com-input-color-sr;
            height: 30px;
            line-height: 30px;
            width: 92%;
          }
          .el-textarea__inner {
            height: auto !important;
          }
          .el-textarea__inner {
            /*width: 50%;*/
            padding: 0 15px;
            min-height: 30px !important;
          }
          .el-checkbox__inner {
            border: 1px solid @com-radio-select;
            background-color: transparent;
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: @com-radio-select;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner,
          .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: @com-radio-select;
            border-color: @com-radio-select;
          }
          .el-button--primary {
            background-color: @com-button-Sx-bg;
            border-radius: 3px;
            width: 70px;
            height: 30px;
            padding: 0;
            border-color: @com-button-Sx-border;
            color: @com-button-Sx-font;
            font-size: 12px;
            margin-right: 10px;
          }
          .el-upload--picture-card {
            background-color: @com-input-bg;
            border: none;
            width: 200px;
            height: 136px;
            .icon-text {
              padding-bottom: 5px;
              border-bottom: 1px sdisplayolid @com-h4s4-font;
            }
            i {
              display: none;
              color: @com-h4s4-font;
              font-size: 50px;
            }
          }
          ::-webkit-input-placeholder {
            color: @com-input-color !important;
          }
          .el-input__icon,
          .el-icon-date {
            display: none !important;
          }
        }
        .zhuming {
          margin-left: 95px;
          color: @com-h4s4-font;
          font-size: 12px
        }
        .dialog-footer {
          .cancel {
            background: @com-button-C-bg;
            color: @com-buttonS2-font;
            border: none;
            width: 90px;
            height: 30px;
            line-height: 30px;
            padding: 0px;
          }
          .sure {
            background: @com-button-Sx-bg;
            color: @com-button-Sx-font;
            border: none;
            width: 90px;
            margin-left: 19px;
            line-height: 30px;
            padding: 0px;
          }
        }
        .el-form-item.is-required .el-form-item__label:before {
          content: none;
        }

        .limit-input {
          min-width: 60px !important;
          width: 60px !important;
          margin-left: 20px;
        }
        .el-input--prefix .el-input__inner {
          padding: 0 !important;
        }

        background: rgba(48, 52, 65, 1) !important;
      }
      .single {
        /deep/ div {
          background-color: @com-module-bg;
          font-size: @font - 4;
          .el-dialog__header {
            padding: 21px 27px 0px 27px;
            line-height: 0px;
            span {
              color: @com-h2S1-font !important;
            }
          }
          .el-upload-list__item:first-child {
            margin-top: 0px !important;
          }
          .el-upload-list__item .el-progress__text{
            display: none;
          }
          .el-dialog__body {
            color: @com-h3-font !important;
            line-height: 15px;
            padding: 29px 38px 21px 47px;
            .jinMp4 {
              color: @com-h4s4-font;
            }
            div {
              .el-form {
                .linkSize {
                  margin: 0 10px;
                }
                .el-form-item {
                  margin-bottom: 21px;
                  margin-top: 6px;
                  .el-form-item__label {
                    color: @com-h2S1-font !important;
                    position: relative;
                    z-index: 99999;
                    width: 78px;
                    font-size: @font - 4;
                  }
                  .el-form-item__content {
                    .el-textarea {
                      .el-textarea__inner {
                        background-color: @com-input-bg !important;
                        border: none !important;
                      }

                    }
                  }

                }

                .zhuti {
                  margin-top: 15px;
                }
              }
            }
          }
          .el-dialog__footer {
            line-height: 20px;
            padding: 0px 41px 30px 0px;
          }
          .live {
            // vertical-align:none !important;
            .selectDate {
              width: 110px !important;
              input {
                padding-left: 0 !important;
                padding-right: 0 !important;
                text-align: center;
                background-color: @com-input-bg;
                color: @com-input-color-sr;
                border: @com-input-border;
              }
              span {
                i {
                  display: none !important;
                }
              }
            }
          }
          .shangkeTime {
            display: block !important;
            color: @com-h3-font !important;
            input {
              margin-left: 4px;
            }
          }
        }
      }
      .lesson-list {
        margin: 10px;
        padding: 16px;
        background-color: @com-module-bg;
        font-size: @font - 4;
        p {
          line-height: 30px;
        }
        .p-title {
          color: @com-h1S2-font;
        }
        .less-li {
          color: @com-h3-font;
          span {
            display: inline-block;
            vertical-align: top;

          }
          .tab {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .tab1 {
            width: 50px;
          }
          .tab2 {
            width: 25%;
          }
          .tab3 {
            width: 35%;
          }
          .tab4 {
            width: 30%;
          }
        }
        .less-btn {
          float: right;
          margin-top: 10px;
          position: relative;
          margin-bottom:16px;
          .sing-btn {
            cursor: pointer;
          }
          .hk {
            color: #09B3FA;
            position: absolute;
            right: 56px;
            width: 70px;
            .icon-kc_pic_hk {
              font-size: @font - 2;
              margin-right: 5px;
            }
          }
          .lz {
            margin: 0 5px;
            position: absolute;
            right: 56px;
            width: 70px;
          }
          .sckj {
            margin: 0 5px;
            position: absolute;
            right: 56px;
            width: 70px;
            color: @com-button-Co-font;
          }
          .bf {
            margin: 0 5px;
            color: @com-button-Co-font;
            position: absolute;
            right: 56px;
            width: 70px;
            .icon-bofang {
              font-size: @font - 2;
              margin-right: 5px;
            }
          }
          .bj {
            margin: 0 5px;
            position: absolute;
            right: 30px;
            width: 15px;
          }
          .dele {
            margin: 0 5px;
            position: absolute;
            right: 0px;
            width: 15px;
          }
          .liveing {
            position: relative;
            right: 126px;
            .icon-living {
              position: absolute;
              left: 0px;
              top: 0px;
              display: inline-block;
              width: 20px;
              height: 16px;
              z-index: 3;
              background-image: url(../../assets/img/course/live.svg);
              background-size: 1033% 100%;
              animation: isliving 1.2s steps(6) infinite;
            }
            .stateText {
              position: absolute;
              left: 20px;
              width: 40px;
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
        }
        .compileBtn {
          /*  position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;*/
          margin-left: 42%;
          margin-bottom: 10px;
          width: 90px;
          height: 30px;
          text-align: center;
          padding: 0px;
          background-color: @com-button-M-bg;
          border-radius: 3px;
          border: 1px solid @com-button-M-border;
          color: @com-button-M-font;
        }
      }
    }
      .no-data {
        position: relative;
        z-index: 10;
        color: @com-h4s4-font;
        font-size: @font + 6px;
        top: 28%;
        margin-left: 48%;
        /*display: flex;*/
        justify-content: center;
        align-items: Center;
        img {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100px;
        }
        p {
          position: absolute;
          top: 130px;
          left: 10px;
          font-size: @font - 2;
          color: @com-h4s4-font,
        }
      }
    .lesson-pro {
      background-color: @com-module-bg;
      font-size: @font - 4;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      border-bottom: 1px solid @com-solidS1-bg;
      span {
        display: inline-block;
        vertical-align: top;
      }
    }

    .lesson-btn {
      padding-top: 50px;
      text-align: center;
      .fb-btn {
        margin: 0;
        height: 32px;
        line-height: 32px;
      }
    }
    .lesson-cen {
      padding-top: 40px;
      font-size: @font - 4;
      .people {
        color: @com-h1S2-font !important;
        padding: 5px 0;
      }
      .lesson-zb {
        margin-top: 20px;
        color: @com-sizeS1-color;
      }
    }
    .text-center {
      text-align: center;
    }
  }

  .v-lesson-list {
    height: calc(100%);
    overflow-y: scroll;
    .now-content {
      background-color: @com-hover-bg !important;
    }
    .lesson-block {
      font-size: 14px;
      color: @com-h3-font;
      background: @com-module-bg;
      padding: 20px 20px;
      border-bottom: 1px solid @com-solidS1-bg;
      .list-bottom {
        font-size: @font - 4;
        margin-top: 10px;
        line-height: 26px;
      }
      .img-block {
        float: left;
        width: 200px;
        height: 134px;
        position: relative;
        .cov {
          width: 200px;
          height: 134px;
          background: white;
        }
        .peo-bg {
          position: absolute;
          width: 40px;
          height: 25px;
          background: hsla(0, 0%, 0%, 0.4);
          /*  background: #000;
            opacity: 0.5;*/
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

        .lesson-vip {
          position: absolute;
          width: 40px;
          height: 24px;
          background-color: #000;
          opacity: 0.7;
          top: 20px;
          border-bottom-right-radius: 12px;
          border-top-right-radius: 12px;
        }
      }
      .img-right {
        float: left;
        padding: 20px;
        padding-top: 0px;
        color: @com-h4s4-font;
        font-size: @font - 4;
        .type-btn {
          font-size: @font - 4;
          .zb {
            background: url("../../assets/img/zb1.png") no-repeat 0%;
            width: 17px;
            height: 14px;
            display: inline-block;
            vertical-align: top;
            margin-top: 2px;
          }
          .kj {
            background: url("../../assets/img/kj1.png") no-repeat 0%;
            width: 17px;
            height: 14px;
            display: inline-block;
            vertical-align: top;
            margin-top: 2px;
          }
        }
      }
      .bj-btn {
        float: right;
        color: @com-buttonIcoMy-M-color;
        cursor: pointer;
      }
      .lesson-name {
        font-size: @font - 2;
        color: @com-h1S2-font;
        padding-bottom: 5px;
      }
      .text-right {
        font-size: @font - 4;
        padding-bottom: 5px;
        margin-left: 20px;
      }
      .text-price {
        font-size: @font - 4;
        margin-top: 20px;
        margin-bottom: 5px;
      }
      .lesson-near {
        font-size: @font - 4;
        padding-bottom: 5px;
      }
      .less-footer {
        padding-top: 5px;
        font-size: @font - 4;
        i {
          font-size: @font - 4;
          padding-left: 10px;
          &:first-child {
            padding-left: 0;
          }
        }
        span {
          padding: 0 10px;
        }
      }
      .hot,
      .people {
        padding: 0 5px;
        color: @com-h4s4-font;
        margin-bottom: 10px;
      }
      .price {
        color: @com-sizeS2-color;
        font-size: @font + 2px;
        margin: 10px 5px 0 0;
      }
      .inl-bl {
        display: inline-block;
        vertical-align: top;
      }
      &:hover {
        background-color: @com-hover-bg;
      }
    }
  }
</style>
<style lang="less">
  @import "../../assets/style/public";

  .lessonList {
    .touzi-main {
      display: block !important;
      .tap-link {
        margin: 0 10px;
        vertical-align: top;
      }
      .fb-btn {
        float: right;
        margin-right: 40px;
      }
      span {
        color: @com-h1S2-font !important;
      }
    }
  }
</style>

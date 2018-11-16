<template>
  <div class="lessonDetail" style="height:100%">
    <div class="touzi-main clearfix">
      <router-link class="main-back back-main" to="/index/lessonList">
        < 返回
      </router-link>
      <span class="main-back tap-link" style="color: #DDDDDD;">课程详情</span>
      <div class="top-right">
        <i class="iconfont icon-shouhuodizhiyebianji" @click="editLesson"></i>
        <img class="icon-img-zj" src="../../assets/img/kc_icon_zj@2x.png" @click="addSinCou"/>
        <!-- <i class="iconfont icon-kcxq_icon_share"></i> -->
      </div>
    </div>
    <div class="lesson-content clearfix" ref="lessonCon" :class="[courseStatus]">
      <div class="tap clearfix" :class="{setwidth:!detail}">

        <div class="tap-block">
          <span :class="{now:detail}" @click="singleCourseList">课程目录</span>
        </div>
        <div class="tap-block">
          <span :class="{now:!detail}" @click="detail = false">课程介绍</span>
        </div>
      </div>
      <!-- <div class="tap right" v-if="detail">
        <div class="tap-block">
          <span>用户评价</span>
        </div>
      </div> -->
      <el-dialog
            ref="dialog"
            @click.native.stop="preventMaoPao"
                :title="courseNum"
                :visible.sync="dialogVisible"
                width="601px"
                :before-close="handleClose"
                class="single"
                slot="">
                <div class="singleNext">
            <el-form >
          <div class="course" v-if="!isLive">
          <span>课件地址</span>
          <input type="text" placeholder="请输入课件地址" v-model="uploadUrl" class="address">
          <el-upload class='upload-demo'
                       accept="video/mp4"
                       :action="videoUrlAPI"
                       :data="upLoadData"
                       multiple
                       :on-exceed="exceedV"
                       :file-list="hasImgList"
                       :limit="1"
                       :on-change="handleChangeV"
                       :on-success="successUpload"
                       :on-error="errorUpload"
                       :before-upload="beforeAvatarUploadV"
                       :on-remove="handleRemoveV"
                       :on-progress="getProgress"
                       ref="uploadFile"
                        >
                        <div ref="box" v-show="isUpload" class="box"><p ref="boxCon" class="boxCon" ></p></div>
                        <div class="shangchuan" ref="shangchuan">
                          <el-button size="small" type="primary" class="cleckUp">上传</el-button>
                            <span>仅可上传MP4格式文件</span>
                        </div>
          </el-upload>
          </div>
        <el-form-item label="上课时间" prop="value1" class='shangkeTime' v-if="isLive">
          <div class="live" >
            <el-date-picker
              v-model="value1"
              required
              type="date"
              placeholder="选择日期"
              default-value
              class="selectDate">
            </el-date-picker>
            <el-time-picker
              v-model="value2"
              required
              format='HH:mm:ss'
              placeholder="起始时间"
              :change="setEndTime()"
              class="selectDate">
            </el-time-picker>
            <span class="linkSize">至</span>
            <el-time-picker
              v-model="value3"
              format='HH:mm:ss'
              placeholder="结束时间"
              :picker-options="{
                selectableRange:pickerBeginDateAfter
              }"
              class="selectDate">
            </el-time-picker>
              <span class="time-weekday">{{weekDay| getWorkDay}}</span>
          </div>
          </el-form-item>


        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="主题" prop="textarea" class="zhuti">
            <el-input type="textarea" v-model="ruleForm.textarea"></el-input>
          </el-form-item>
          <el-form-item label="知识点" prop="keyWords" class="zhishidian">
            <el-input type="textarea" v-model="ruleForm.keyWords"></el-input>
          </el-form-item>
        </el-form>

        <span class="zhuming">最多五个知识点，请以 ；隔开。</span>
                </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click.stop="cancel" class="cancel">取 消</el-button>
                    <el-button type="primary" @click.stop="createSingle" class="sure">确 定</el-button>
                </span>
            </el-dialog>
      <div class="content-left left" v-if="!detail">
        <div class="content">
          <p class="content-pro">简介</p>
          <p class="content-tit">
            {{courseDetail.introduction}}</p>
          <span class="span-tit">课程数量：</span><span class="span-num">{{courseDetail.num}}讲</span>
          <!-- <p class="content-pro">课程概述</p>
          <p>{{courseDetail.introduction}}</p>
          <img class="content-img" :src="courseDetail.coverurl"> -->
        </div>
      </div>

      <div class="content-ml" v-if="detail" ref="contentML">
        <p class="lesson-pro"><span class="pro-1">序号</span><span class="pro-2">课程信息</span><span class="pro-3 text-center"  >上课时间</span><span class="pro-4" style="text-align: center">操作</span></p>
        <!-- ref="courseTime" -->
        <li class="lesson-list" v-for="(item,key) in list" :key="key" @click="judgeLive(item)" >

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
          <div class="pro-1" >
            {{key+1}}
          </div>
          <div class="pro-2 less-info">
            <p class="lesson-name">{{item.topic}}</p>
            <!-- <p class="less-footer">
              <i class="iconfont icon-kcxq_icon_share"></i><span>{{item.sharecount}}</span>
              <i class="iconfont icon-zxxq_icon_zang"></i><span>{{item.favourcount}}</span>
              <i class="iconfont icon-message"></i><span>{{item.commentcount}}</span>
              <i class="iconfont icon-team" style="font-size: 14px;"></i><span>{{item.participantcount}}</span>
            </p> -->
          </div>
          <div class="pro-3 less-time"   >
            <!-- ref="courseTime1" -->
            {{item.starttime?yearMonthDay(item.starttime)+"~":""}}{{item.endtime?HourMinSec(item.endtime):""}} {{item.starttime?getWeek(item.starttime):""}}
          </div>
          <div class="pro-4 less-btn editStatus">
            <span class='editSinCon'  v-if="isLive">{{item.status==="unopened" ? "开始授课":(item.status==="closed"?"回看":"直播中")}}<i class="iconfont" :class="[item.liveStatus]"></i></span>
            <span  v-if="!isLive">回看<i class="iconfont icon-kc_pic_hk"></i></span>
            <span @click.stop="ToSingleCourse(item,key)" class='editSinCon'>编辑单课</span>
          </div>
        </li>
      </div>

    </div>
  </div>

</template>

<script>
import send from "../../assets/js/ajaxSend";
import {
  addSingleLessonAPI,
  singleLessonListAPI,
  courseSeries,
  singleCourseSeries,
  updateStatusAPI,
  modifySingleCourse,
  addParticipantAPI,
  apiUrl
} from "../../assets/apiRegular";

export default {
  name: "lessonDetail",
  data() {
    return {
      videoUrlAPI:apiUrl + '/ifop/Upload',
      user:'',
      pickerBeginDateAfter:'21:26:48 - 23:59:59',
      courseNum: "",
      num: 0,
      detail: true,
      shareCourse: false,
      courseSeriesId: "",
      courseStatus:'',
      list: [],
      liveStatus:'',
      type: "",
      courseDetail: {},
      state: "",
      time: "",
      weekDay: "",
      editIndex:'',
      hasImgList: [],
      showDialog: false,
      value1: new Date(),
      value2: new Date(),
      value3: new Date(),
      obj: {},
      judgeUpload:false,
      isLive: false,
      uploadUrl: "",
      upLoadData: { media_type: "video"},
      edit: "",
      index: 0,
      isUpload: false,
      ruleForm: {
        textarea: "",
        keyWords: ""
      },
      rules: {
        keyWords: [
          { required: true, message: "请填写知识点", trigger: "blur" }
        ],
        textarea: [{ required: true, message: "请填写主题", trigger: "blur" }]
      },
      dialogVisible: false
    };
  },
  beforeCreate: function() {},
  mounted() {
    this.user = JSON.parse(localStorage.getItem("logininfo")).user;
    this.init();
    this.singleCourseList();
    this.courseDetails();

  },
  created() {
  },
  methods: {
     cancel(){
        if(this.$refs.uploadFile){
        this.$refs.uploadFile.abort();
      }
          this.dialogVisible = false;
    },
    //初始化加载
    init(){

      this.sessionId = JSON.parse(localStorage.getItem("logininfo")).session_id;
          if (this.$route.query.courseSeriesId)
            this.courseSeriesId = this.$route.query.courseSeriesId;
            this.$store.state.loadingContent = false;
          if (this.$route.query.detail == "false") {
            this.detail = false;
          }
          if (this.$route.query.type) {
            this.type = this.$route.query.type;
          }
          if (this.$route.query.url) {
            this.liveUrl = this.$route.query.url;
          }
    },
    //设置结束时间必须大于开始时间
    setEndTime(){
      this.pickerBeginDateAfter=`${this.value2.getHours()+1}:${this.value2.getMinutes()}:${this.value2.getSeconds()} - 23:59:59`;
    },
    initContentHeight() {
      //动态设置高度
      _this.$refs.lessonCon.style.height =
        parseInt(getComputedStyle(_this.$refs.contentML, false)["height"]) +
        100 +
        "px";
    },
    preventMaoPao() {},
    //判断直播还是课件
    judgeLive(item) {
      if (this.type==="livebroadcast") {
        this.setUser(item.id);
        this.toLive(item.id, item.status, item.coursewareurl);
      } else {
        this.setUser(item.id);
        this.lookBack(item.coursewareurl, item.id);
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
    //回看
    lookBack(url, courseid) {
      let routeData = this.$router.resolve({
        name: "broadcast",
        query: {
          url: url,
          courseid: courseid,
        }
      });
   // window.open(routeData.href, '_blank');
      createSpecialWindow({
        url: `login.html${routeData.href}`,
        id: courseid,
        width: 1000,
        height: 670
      });
    },

    createSingle() {
      if (this.ruleForm.keyWords === "" || this.ruleForm.textarea === "") {
        this.$message.error("主题或知识点不能为空");
      }else if(this.judgeUpload){
        this.$message.warning("视频上传中，请等待")
        } else {
        let _this = this;
        let message = {};
        let time=new Date();
        message.startTime=time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+this.addZero(time);
        message.endTime=time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+this.addZero(time);
        message.sessionId = _this.sessionId;
        message.courseSeriesId = _this.courseSeriesId;
        let textarea = encodeURIComponent(
          encodeURIComponent(_this.ruleForm.textarea)
        );
        let keyWords = encodeURIComponent(
          encodeURIComponent(_this.ruleForm.keyWords)
        );
        message.knowledgePoint = keyWords;
        message.topic = textarea;
        //新增单课
        if (this.edit === "open") {
          if (this.type === "livebroadcast") {
            message.startTime =
              this.value1.getFullYear() +
              "-" +
              (this.value1.getMonth() + 1) +
              "-" +
              this.value1.getDate() +
              " " +
              this.value2.getHours() +
              ":" +
              this.value2.getMinutes() +
              ":" +
              this.addZero(this.value2);
            message.endTime =
              this.value1.getFullYear() +
              "-" +
              (this.value1.getMonth() + 1) +
              "-" +
              this.value1.getDate() +
              " " +
              this.value3.getHours() +
              ":" +
              this.value3.getMinutes() +
              ":" +
              this.addZero(this.value3);
               send.ajaxSend({
            url: addSingleLessonAPI,
            thisVue: _this,
            data: message,
            success: function(data) {
              _this.singleCourseList();
              // _this.list.push(message);
              _this.num += 1;
            }
          });
          } else{
            if(this.uploadUrl!=="") {
            message.coursewareUrl = this.uploadUrl;
            message.videoCover = this.videoPic;
            message.videoLength = this.videoTime;
            send.ajaxSend({
            url: addSingleLessonAPI,
            thisVue: _this,
            data: message,
            success: function(data) {
              _this.singleCourseList();
              // _this.list.push(message);
              _this.num += 1;
            }
          });
          }else {
             this.$message({
                type: "warning",
                message: "请上传课件视频"
                  })
          }
          }
        }
        //修改单课
         else if (this.edit === "close") {
          if (this.type === "livebroadcast") {
            message.startTime =
              this.value1.getFullYear() +
              "-" +
              (this.value1.getMonth() + 1) +
              "-" +
              this.value1.getDate() +
              " " +
              this.value2.getHours() +
              ":" +
              this.value2.getMinutes() +
              ":" +
              this.addZero(this.value2);
            message.endTime =
              this.value1.getFullYear() +
              "-" +
              (this.value1.getMonth() + 1) +
              "-" +
              this.value1.getDate() +
              " " +
              this.value3.getHours() +
              ":" +
              this.value3.getMinutes() +
              ":" +
              this.addZero(this.value3);
          } else {
            message.time = this.time;
            message.coursewareUrl = this.uploadUrl;
            message.videoCover = this.videoPic;
            message.videoLength = this.videoTime;
          }
          message.courseId = this.id;
          send.ajaxSend({
            url: modifySingleCourse,
            thisVue: _this,
            data: message,
            success(data) {
              _this.singleCourseList();
              // _this.$set(_this.list,_this.editIndex,message);
            }
          });
        }
        this.dialogVisible = false;
      }
    },
    uploadVideoProcess(event, file, fileList) {},
    //上传文件处理
    //文件改变时的钩子函数
    handleChangeV(file, fileList) {
      this.$refs.shangchuan.style.display = "none";
      this.imgLength = fileList.length;
      this.imgList = fileList;
    },
    //上传成功时候的钩子
    successUpload(data) {
          this.judgeUpload=false;
      if (data) {
        let videoUrl = "";
        videoUrl = data.split('src="')[1];
        videoUrl = videoUrl.split('" />')[0];
        this.uploadUrl = videoUrl;
        this.$emit("getVideo", videoUrl);
        var vt = "";
        vt = data.split(",")[0];
        vt = vt.split(":")[1];
        vt = (parseInt(vt) / 100).toString();
        var rs = vt.indexOf(".");
        if (rs < 0) {
          rs = vt.length;
          vt += ".";
        }
        while (vt.length <= rs + 2) {
          vt += "0";
        }
        this.videoTime = vt.replace(".", ":");
        this.videoPic = data.split('"cover":"')[1];
        this.videoPic = this.videoPic.split('"}')[0];
      }
    },
    errorUpload(err){
      console.log(err,"上传失败");
    },
    //上传文件之前的钩子
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
    //进度条显示
    getProgress(event) {
      this.judgeUpload=true,
      this.isUpload = true;
      this.$refs.boxCon.style.width =event.percent / 100 * this.$refs.boxCon.parentNode.offsetWidth + "px";
    },
    //文件列表移除文件时的钩子
    handleRemoveV(file, fileList) {
      this.judgeUpload=false;
      if (this.$refs.shangchuan) {
        setTimeout(() => {
          this.$refs.shangchuan.style.display = "block";
        }, 0);
      }
      this.isUpload = false;
      this.videoPic = "";
      this.$emit("getVideo", "");
    },
    addZero(value) {
      let a = value.getSeconds();
      if (a < 10) {
        a = "0" + a;
        return a;
      } else {
        return a;
      }
    },

    //限制上传视频个数
    exceedV(file, fileList) {
      if (fileList.length >= 1) {
        this.$message({
          message: "只能上传一个视频",
          type: "warning"
        });
      }
    },
    //- 小写数字转换成大写, 只处理到[0 ~ 99]
    numberConvertToUppercase(num) {
      num = Number(num);
      var upperCaseNumber = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "百",
        "千",
        "万",
        "亿"
      ];
      var length = String(num).length;
      if (length == 1) {
        this.courseNum = `第${upperCaseNumber[num]}课`;
      } else if (length == 2) {
        if (num == 10) {
          this.courseNum = `第${upperCaseNumber[num]}课`;
        } else if (num > 10 && num < 20) {
          this.courseNum = `第${"十" +
            upperCaseNumber[String(num).charAt(1)]}课`;
        } else {
          this.courseNum = `第${upperCaseNumber[String(num).charAt(0)] +
            "十" +
            upperCaseNumber[String(num).charAt(1)].replace("零", "")}课`;
        }
      }
    },
    closeWindow() {
      this.showDialog = false;
    },
    //
    startLive(status, id) {
      if (status === "unopened") {
        // let _this = this;
        // send.ajaxSend({
        //   url: updateStatusAPI,
        //   thisVue: _this,
        //   data: {
        //     courseId: id,
        //     status: "opened"
        //   },
        //   success(res) {}
        // });
      }
    },
    handleClose(done) {
      if(this.$refs.uploadFile){
        this.$refs.uploadFile.abort();
      }
      done();
    },
    //新增按钮
    addSinCou() {
      if (this.$refs.shangchuan) {
        setTimeout(() => {
          this.$refs.shangchuan.style.display = "block";
        }, 0);
      }
      this.numberConvertToUppercase(this.num + 1);
      this.hasImgList = [];
      if(this.$refs.boxCon){
        setTimeout(() => {
        this.$refs.boxCon.style.width = "0";
      }, 0);
      }
      this.uploadUrl = "";
      this.edit = "open";
      if (this.type === "livebroadcast") {
        this.isLive = true;
      } else {
        this.isLive = false;
      }
      this.ruleForm.textarea = "";
      this.ruleForm.keyWords = "";
      this.dialogVisible = true;
    },
    ToSingleCourse(item, index) {
      this.editIndex=index;
      this.hasImgList = [];
      if (this.$refs.shangchuan) {
        setTimeout(() => {
          this.$refs.shangchuan.style.display = "block";
        }, 0);
      }
      if(this.$refs.boxCon){
       setTimeout(() => {
        this.$refs.boxCon.style.width = "0";
      }, 0);
      }
      this.numberConvertToUppercase(index + 1);
      this.edit = "close";
      if (this.type === "livebroadcast") {
        this.isLive = true;
      } else {
        this.isLive = false;
      }
      this.dialogVisible = true;
      this.uploadUrl = item.coursewareurl;
      this.ruleForm.textarea = item.topic;
      this.ruleForm.keyWords = item.knowledgepoint;
      this.id = item.id;
      this.coursewareurl = item.coursewareurl;
      this.videocover = item.videocover;
      this.videolength = item.videolength;
    },
    yearMonthDay(value) {
      return value.toString().slice(0, 16);
    },
    HourMinSec(value) {
      return value.toString().slice(10, 16);
    },
    toLive(courseid, status, url) {
      let routeData = "";
      if (status != "opened") {
        if (status === "closed") {
          routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              url: url,
              courseid: courseid,
              status:status
            }
          });
        } else {
          routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              courseid: courseid,
              status:status
            }
          });
          this.startLive(status, courseid);
        }
      //  window.open(routeData.href, '_blank');
        console.log('createSpecialWindow',courseid, status, url)
        createSpecialWindow({
          url: "login.html" + routeData.href,
          id: courseid,
          width: 1000,
          height: 670
        });

      } else {
        this.$message({
          type: "warning",
          message: "直播窗口已开启!"
        });
      }
    },
    //日期变周几
    getWeek(value) {
      if (value) {
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
    },
    singleCourseList() {
      this.detail = true;
      let _this = this;
      send.ajaxSend({
        url: singleLessonListAPI,
        thisVue: _this,
        data: {
          courseSeriesId: _this.courseSeriesId,
          sorts: '[{"field":"f_id","sortType":"asc"}]'
        },
        success(data) {
          if(data.courses){
            _this.courseStatus=''
             _this.list = data.courses;
            _this.num = data.courses.length;
            for(let i=0;i<_this.num;i++){
              if(_this.list[i].status==="closed"){
                _this.$set(_this.list[i],'liveStatus','icon-kc_pic_hk')
                }
               else if(_this.list[i].status==="opened"){
                _this.$set(_this.list[i],'liveStatus','liveStatus')
                }
            }
            if(_this.type==="courseware"){
              _this.isLive=false;
              // _this.$refs.courseTime.style.opacity=0;
              // for(let i=0;i<_this.list.length;i++){
              //   setTimeout(()=>{
              //   if(_this.$refs.courseTime1){
              //       _this.$refs.courseTime1[i].style.opacity=0;
              //       }
              //     },0)
              // }
            }else{
              _this.isLive=true;
            }
            setTimeout(() => {
              _this.$refs.lessonCon.style.height = parseInt(getComputedStyle(_this.$refs.contentML, false)["height"]) +50 +"px";
            }, 0);
          }else{
            _this.courseStatus='courseStatus'
          }

          }
      });
    },
    courseDetails() {
      let _this = this;
      send.ajaxSend({
        url: courseSeries,
        thisVue: _this,
        data: {
          courseSeriesId: _this.courseSeriesId
        },
        success(data) {
            _this.courseDetail = JSON.parse(JSON.stringify(data.courseseries));
        }
      });
    },
    editLesson: function() {
      this.$router.push({
        name: "newLesson",
        query: {
          courseSeriesId: this.courseSeriesId,
          type: this.type,
          info:"fromDetail"
        }
      });
    },
    share: function(index){
      if (this.list[index].showIf) {
        this.$set(this.list[index], "showIf", false);
      } else {
        this.$set(this.list[index], "showIf", true);
      }
    }
  },
  computed: {
    },
  watch: {
    value1: function(value ) {
      let y = value.getFullYear();
      let m = value.getMonth() + 1;
      let d = value.getDate();
      this.weekDay = y + "-" + m + "-" + d;
    }
  }
};
</script>
<style lang="less">
@import "../../assets/style/public";
.lessonDetail {
     .touzi-main {
         display:block !important;
         .tap-link{
          margin: 0 10px;
          vertical-align: top;
        }
              }
  .courseStatus{
        background: url("../../assets/img/暂无数据@2x.png") no-repeat center;
                }
  .linkSize {
            margin: 0 10px;
          }
  .cancel {
    background: rgba(143, 148, 156, 1);
    color: rgba(25, 27, 33, 1);
    border: none;
    width: 90px;
  }
  .sure {
    background: rgba(231, 194, 127, 1);
    color: rgba(25, 27, 33, 1);
    border: none;
    width: 90px;
    margin-left: 19px;
  }
  .sure:hover {
    background: rgba(231, 194, 127, 1);
  }

  .lessonDetail {
    height: 100%;
  }

  .top-right {
    float: right;
    margin-right: 20px;
    line-height: 36px;
    i {
      color: @com-buttonIcoInfo-A-color;
      padding: 0 20px;
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      font-size: @font + 2;
      padding-top: 2px;
      &:first-child {
        font-size: 20px;
      }
    }
    .icon-img-zj {
      width: 18px;
      height: 18px;
      position: relative;
      top: 5px;
      cursor: pointer;
    }
  }

  .lesson-content {
    min-height: 100% !important;
    background-color: @com-module-bg;
    font-size: @font - 4px;
    color: @com-h2S1-font;
    .setwidth {
      width: 100% !important;
      float: none !important;
    }
    .left {
      width: 59%;
    }
    .right {
      width: 40%;
    }
    .content-left {
      height: calc(100% - 83px);
      display: inline-block;
      vertical-align: top;
      .ques-answer-li {
        margin: 0px 10px 0px 20px;
        padding: 20px 0 10px;
        // border-bottom: 1px dashed @com-input-bg;
        color: @com-h2S1-font;
        .head-img {
          width: 42px;
          height: 42px;
          border-radius: 21px;
          float: left;
          margin-right: 20px;
        }
        .ques-right {
          /*float: left;
          width: 276px;*/
          line-height: 24px;
          .list-time {
            color: @com-h4s4-font;
            font-size: 12px;
            margin-left: 20px;
          }
          .answer-img {
            width: 16px;
            //height: 16px;
            float: right;
          }
        }
      }
      .content-pro {
        font-size: @font;
        padding-top: 16px;
        padding-bottom: 16px;
      }
      .content-img {
        margin-top: 20px;
        width: 535px;
        height: 253px;
      }
      .content {
        color: @com-h3-font;
        padding: 0px 50px;
        padding-right: 130px;
        p {
          color: @com-h3-font;
          line-height: 26px;
        }
        .span-tit {
          display: inline-block;
          margin-top: 30px;
        }
        .span-num {
          color: @com-sizeS1-color;
          padding-right: 20px;
        }
      }
    }
    .tap {
      line-height: 40px;
      border-bottom: 1px solid @com-solidS2-bg;
      display: inline-block;
      vertical-align: top;
      /*float: left;*/
      width: 100%;
      &:after {
        content: "";
        display: block;
        clear: both;
      }
      .tap-block {
        float: left;
        color: @com-button-C-font;
        padding: 0 50px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }
      span {
        display: inline-block;
        height: 100%;
        border-bottom: 2px solid transparent;
      }
      .now {
        color: @com-button-Co-font;
        border-bottom: 2px solid @com-button-Co-border;
      }
    }
    .content-ml {
      .lesson-pro {
        width: 100%;
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          vertical-align: top;
          color: @com-h4s4-font;
        }
      }
      .lesson-list {
        cursor: pointer;
        border-top: 1px solid @com-solidS1-bg;
        position: relative;
        height: 90px;
        line-height: 90px;
        cursor: pointer;
        .editStatus {
          span {
            margin: 0 10px;
          }
          span:hover {
            color: @com-buttonIco-X-color !important;
          }
        }
        .share {
          z-index: 1;
          background: rgba(48, 52, 65, 1);
          box-shadow: 1px 0px 12px rgba(0, 0, 0, 0.7);
          width: 551px;
          height: 261px;
          position: absolute;
          display: flex;
          top: 60px;
          right: 275px;
          .shareLeft {
            width: 200px;
            text-align: center;
            .img {
              width: 130px;
              height: 130px;
              background: red;
              margin: 40px 30px 0 30px;
            }
          }
          .shareCenter {
            margin-top: 40px;
            width: 1px;
            height: 178px;
            background: rgba(25, 27, 33, 1);
          }
          .shareRight {
            line-height: 0;
            margin-left: 30px;
            margin-top: 40px;
            .link {
              display: block;
              line-height: 40px;
            }
            .linkAddress {
              width: 300px;
              height: 80px;
              background: rgba(40, 44, 53, 1);
              text-align: center;
              textarea {
                margin-top: 20px;
                width: 253px;
                height: 33px;
                font-size: 12px;
                font-family: Helvetica;
                color: rgba(143, 148, 156, 1);
                line-height: 24px;
                outline: none;
                background: rgba(40, 44, 53, 1);
                border: none;
              }
            }
            .copyShare {
              width: 299px;
              height: 40px;
              background: @com-buttonIco-A-color;
              margin-top: 20px;
              border: none;
            }
          }
        }
        div {
          display: inline-block;
          vertical-align: top;
        }
        .less-info {
          padding-top: 26px;
        }
        .less-time {
          color: @com-h4s4-font;
        }
        .lesson-name {
          font-size: @font - 2;
          line-height: 36px;
          color: @com-h1S1-font;
        }
        .less-footer {
          line-height: 10px;
          padding-top: 10px;
          font-size: @font - 4;
          i {
            color: @com-h4s4-font;
            font-size: @font - 4;
          }
          span {
            color: @com-h4s4-font;
            padding: 0 10px;
          }
        }
        &:hover {
          background-color: @com-hover-bg;
        }
      }
      .pro-1 {
        padding-left: 20px;
        width: 94px;
      }
      .pro-2 {
        width: 40%;
      }
      .pro-3 {
        width: 28%;
      }
      .pro-4 {
        width: 20%;
      }
      .less-btn {
        span {
          border-right: 1px solid @com-solidS1-bg;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            border-right: none;
          }
          i {
            padding-left: 10px;
          }
        }
      }
    }
  }

  .max-width-5 {
    max-width: 5 * (@font - 2px);
  }
  .upload-demo {
    .el-upload {
      .box {
        width: 230px;
        height: 6px;
        position: absolute;
        left: 270px;
        top:21px;
        z-index: 999999999;
        border-radius: 6px;
        background: none;
        .boxCon {
          height: 100%;
          width: 0;
          background: @com-button-X-font;
          border-radius: 6px;
        }
      }
    }
  }
  .editSinCon {
    cursor: pointer;
      @keyframes mlfly {
                0%{
                    background-position:0 0;
                }
                100%{
                    background-position:-108px 0;
                }
            }
            .liveStatus{
              display: inline-block;
                width:20px;
                background-image: url("../../assets/img/live_zbz@2x.svg");
                height:20px;
                -webkit-animation:mlfly .6s steps(6) infinite;
                animation: mlfly .6s steps(6) infinite;
            }


  }
  .el-dialog {
    z-index: 999999;
    //   // background-color: #fff !important;
  }
  .el-textarea__inner {
    border: none;
    color: @com-input-color-sr;
    background-color: @com-input-bg !important;
  }
  .single {
    div {
      background-color: rgba(48, 52, 65, 1);
      .el-dialog__header {
        padding: 21px 27px 0px 27px;
        line-height: 0px;
        span {
          color: rgba(221, 221, 221, 1) !important;
        }
      }
      .el-dialog__body {
        color: #fff !important;
        line-height: 20px;

        div {
          background-color: rgba(48, 52, 65, 1);
          // .single div .el-dialog__body div .el-form .el-form-item
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
      }
      .live {
        // vertical-align:none !important;
      }
      .shangkeTime {
        display: block !important;
        color: #fff !important;
        input {
          margin-left: 4px;
        }
      }
    }
  }
  .course .upload-demo ul li a {
    margin-top: 3px !important;
  }
  .course {
    input {
    }
    span {
      color: rgba(143, 148, 156, 1);
    }
  }

  .selectDate {
    width: 110px !important;
    input {
      padding-left: 0 !important;
      padding-right: 0 !important;
      text-align: center;
    }
    span {
      i {
        display: none !important;
      }
    }
  }
  .time-weekday {
    color: rgba(221, 221, 221, 1);
  }
  .course {
    span {
      color: rgba(143, 148, 156, 1);
      padding-right: 12px !important;
    }
    input {
      width: 450px;
      height: 30px;
      background: rgba(40, 44, 53, 1);
      border: none;
      outline: none;
      padding-left: 4px;
      color: @com-input-color;
      box-sizing: border-box;
      margin-left: 4px;
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
        background: #303441;
        border: 1px solid #e7c27f;

        span {
          display: inline-block;
          width: 24px;
          height: 13px;
          color: #e7c27f;
        }
      }
    }
  }
  .theme {
    margin-bottom: 20px;
    span {
      vertical-align: top;
      display: inline-block;
      margin: 10px;
      color: rgba(143, 148, 156, 1);
    }
    textarea {
      vertical-align: bottom;
      background: @com-input-bg !important;
      color: @com-input-color-sr;
      padding: 10px 0 0 10px;
      margin-left: 20px;
      width: 449px;
      height: 60px;
      border: none;
      outline: none;
      resize: none;
    }
    .knowledge {
      margin-left: 5px;
    }
  }
  .upload-demo {
    position: relative;

    ul {
      z-index: 999999;
      position: absolute;
      top: -11px;
      left: 78px;
      width: 470px;
      li {
        width: 98%;
        a {
          margin-top: -5px;
          i {
            display: none;
          }
        }
        label::before {
          i {
            display: none;
          }
        }
      }
    }
  }

  .live {
    input {
      background: @com-input-bg !important;
      border: none;
      color: @com-input-color-sr;
    }
  }
  .zhuming {
    margin-left: 80px;
    color: @com-h4s4-font;
  }

  .el-form-item__label:before {
    content: "" !important;
    width: 0;
    height: 0;
  }
  #app .el-form-item__content .el-textarea {
    height: 64px;
    overflow-y: visible !important;
  }
  .el-textarea {
    height: auto !important;
    width: 449px;
    textarea {
      resize: none !important;
      width: 449px;
    }
  }
  .knowledge {
    textarea {
      margin: 0;
    }
  }
}
</style>

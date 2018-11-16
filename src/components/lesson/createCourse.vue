<template>
<div class="createCourse">


<div class="touzi-main clearfix">
     <router-link class="main-back back-main" to="/index/lessonList">
        < 返回
      </router-link>
      <span class="main-back tap-link" style="color: #DDDDDD;">新建课程</span>
</div>
<el-row >
  <el-col  :span="15">
      <div class="grid-content bg-purple " ref="leftContainer">
          <div class="container">
          <div>
              <img :src="userList.coverurl">
              <div class="courseContent">
                  <h3>{{userList.name}}</h3>
                  <i class="kj" v-show="!isLive">课件</i>
                  <i class="zb" v-show="isLive">直播</i>
                  <span>共{{listNum>userList.num?listNum:userList.num}}讲</span>
              </div>
          </div>
          <p>{{userList.introduction}}</p>
          <el-button class="modifyCourse" @click="modifyCourse">修改</el-button>
          </div>
      </div>
  </el-col>
  <el-col :span="9">
        <div class="grid-content bg-purple-light right">
            <div class="lessons" ref="lessonsH">
                <div class="top">
                <span>已添加课程{{listNum}}</span>
                <el-button class="btn" type="primary" @click="confirmLesson">确定</el-button>
                </div>
                <ul>
                    <li v-for="(item,key) in singleList" :key="key">
                      <div class="singleCourse">
                        <i class="aid iconfont icon-kc_pic_list1"><span>{{key+1}}</span></i>
                        <div v-if="item.id">
                          <div v-if="isLive">
                          <p class="pTime" >{{item.starttime|yearMonthDay}}~{{item.endtime|HourMinSec}} {{getWeek(item.starttime)}}</p>
                          <p >  {{item.topic}} </p>
                          <p > {{item.knowledgepoint}} </p>
                          </div>
                          <div v-if="!isLive">
                          <p class="pTitle" >  {{item.topic}} </p>
                          <p class="pKey" > {{item.knowledgepoint}} </p>
                          <img :src="item.videocover" alt="" class='kejianImg'>
                          </div>
                      </div>
                          <el-button v-if="!item.id" @click="editContent(key)" class="compileBtn">
                                编辑内容
                          </el-button>
                      </div>
                       <div class="gongneng">
                            <i class=" iconfont icon-kc_icon_bj" @click="modifySingle(item,key)"></i>
                            <i class="iconfont icon-kc_icon_deletex" @click="deleteSingle(item.id,key)"></i>
                        </div>
                    </li>
                </ul>
            <div class="addCourseTc">
              <el-button class="addCourse" @click="addCourse()">增加一节课</el-button>
            </div>

            <el-dialog
                :title="number"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
                width="601px"
                class="single"
                slot="">
                <div class="singleNext">
            <el-form >
          <div class="course" v-if="!isLive">
            <span class="dizhi">课件地址</span>
            <input type="text" placeholder="请输入课件地址" v-model="uploadUrl">
            <el-upload class='upload-demo'
                        ref="uploadFile"
                         accept="video/mp4"
                         :action="videoUrlAPI"
                         :data="upLoadData"
                         multiple
                         :on-exceed="exceedV"
                         :file-list="hasImgList"
                         :limit="1"
                         :on-change="handleChangeV"
                         :on-preview="uploadVideoProcess"
                         :on-error="errorUpload"
                         :on-success="successUpload"
                         :before-upload="beforeAvatarUploadV"
                         :on-remove="handleRemoveV"
                         :on-progress="getProgress"
                          >
                          <div ref="box" v-show="isUpload" class="box"><p ref="boxCon" class="boxCon" ></p></div>
                          <div class="shangchuan" ref="shangchuan">
                          <el-button size="small" type="primary" class="cleckUp">上传</el-button>
                          <span class="jinMp4">仅可上传MP4格式文件</span>
                          </div>
            </el-upload>
          </div>
        <el-form-item label="上课时间" prop="value1" class='shangkeTime' v-if="isLive" :rules="rules">
          <div class="live" >
            <el-date-picker
              v-model="value1"
              type="date"
              required
              placeholder="选择日期"
              default-value
              class="selectDate">
            </el-date-picker>

            <el-time-picker
              placeholder="起始时间"
              v-model="value2"
              :change="setEndTime()"
              class="selectDate"
              >
            </el-time-picker>
            <span class="linkSize">至</span>
            <el-time-picker
              placeholder="结束时间"
              v-model="value3"
              class="selectDate"
              :picker-options="{
                selectableRange:pickerBeginDateAfter
              }">
            </el-time-picker>

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
        </div>
      </el-col>
</el-row>
</div>
</template>
<script>
import {
  getWeekDay,
  addSingleLessonAPI,
  singleLessonListAPI,
  deleteSingleLessonAPI,
  getDayTime,
  courseSeries,
  modifySingleCourse,
  apiUrl
} from "../../assets/apiRegular";
import send from "../../assets/js/ajaxSend";
export default {
  name: "createCourse",
  data() {
    return {
      videoUrlAPI:apiUrl + '/ifop/Upload',
      pickerBeginDateAfter:'21:26:48 - 23:59:59',
      hasImgList: [],
      defaultImg: "../../static/img/add-icon.png",
      courseSeriesId: "",
      listNum: 0,
      editIndex: "",
      judgeUpload:false,
      singleList: [],
      isUpload:false,
      courseCount: 0,
      dialogVisible: false,
      singleCourseContent: [],
      // keyWords: "",
      weekDay: "",
      // textarea: "",
      showIf: false,
      userList: {},
      ruleForm: {
          textarea: '',
          keyWords:''
        },
        rules: {
        keyWords: [
            { required: true, message: '请填写知识点', trigger: 'blur' }
          ],
          textarea: [
            { required: true, message: '请填写主题', trigger: 'blur' },
            {  max: 30, message: '主题在30个字符内', trigger: 'blur' }
          ]
        },
      upLoadData: {media_type: 'video'},
      number:'',
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: new Date(),
      value2: new Date(),
      value3: new Date(),
      coursetype: "",
      modifyIndex:'',
      isLive:false,
      uploadUrl:'',
     videoPic:'',
     ImgList:[],
     num:0,
     edit:'',
    }
  },
  filters: {
      yearMonthDay: function(value) {
        let a=value.toString().slice(0,16) ;
      return   a;
    },
    HourMinSec:function(value){
     let b=value.toString().slice(10,16)
      return  b;
    }

  },

  computed:{
    ContentHeight:function(){
      return this.$refs.lessonsH.offsetHeight+"px";
    }
  },
  mounted() {
    this.init();
    this.getCourseDetail();
    this.getSingleList();
  },
  created () {
  },
  watch:{

  },
  methods: {
    errorUpload(err){
      console.log(err,"上传失败");
    },
    cancel(){
      if(this.$refs.uploadFile){
        this.$refs.uploadFile.abort();
      }
          this.dialogVisible = false;

    },
    init(){
      this.$store.state.loadingContent = false;
          this.sessionId = JSON.parse(localStorage.getItem("logininfo")).session_id;
          if (this.$route.query.courseSeriesId)
            this.courseSeriesId = this.$route.query.courseSeriesId;
          if(this.$route.query.num){
            this.num=this.$route.query.num;
    }
    },
    setEndTime(){
      this.pickerBeginDateAfter=`${this.value2.getHours()+1}:${this.value2.getMinutes()}:${this.value2.getSeconds()} - 23:59:59`;
    },
    getProgress(event){
      this.judgeUpload=true,
      this.isUpload=true;
      this.$refs.boxCon.style.width=event.percent/100 * this.$refs.boxCon.parentNode.offsetWidth+"px";
    },
    initContentHeight (){//动态设置高度
      this.$refs.leftContainer.style.height=parseInt(getComputedStyle(this.$refs.lessonsH,false)["height"])+200+'px';
    },
    uploadVideoProcess(event,file,fileList){
    },
    modifyCourse(){
      this.$router.push({
        name:'newLesson',
        query: {
            courseSeriesId: this.courseSeriesId,
            type: this.userList.type
          }
      })
    },
    //获取课程详情
    getCourseDetail(){
      let _this=this;
      send.ajaxSend({
        url:courseSeries,
        thisVue:_this,
        data:{
           courseSeriesId: _this.courseSeriesId
        },
        success(data){
          if(data.op.code==='Y'){
            _this.userList=JSON.parse(JSON.stringify(data.courseseries))
             if (_this.userList.type === "livebroadcast") {
                _this.coursetype = "直播";
                _this.isLive=true;
              } else {
                _this.coursetype = "课件";
                _this.isLive=false;

              }
              _this.num=parseInt(_this.userList.num)
          }
        }
      })
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
    //获取单课列表
    getSingleList: function() {
      let _this = this;
      send.ajaxSend({
        url: singleLessonListAPI,
        thisVue: _this,
        data: {
          courseSeriesId: _this.courseSeriesId,
          sorts:'[{"field":"f_id","sortType":"asc"}]'
        },
        success: function(data) {
          if (data.courses) {
            if(_this.coursetype){
              if(_this.coursetype==="直播"){
                _this.isLive=true;
              }else{
                _this.isLive=false;
              }
            }
            _this.singleList = data.courses;
            _this.listNum = _this.singleList.length;
             for(var i=0;i<_this.num-_this.listNum;i++){
            _this.singleList.push({})
            }
          }else{
            _this.singleList=[];
            for(var i=0;i<_this.num;i++){
            _this.singleList.push({})
          }
          }
        setTimeout(()=>{
        _this.$refs.leftContainer.style.height= parseInt(getComputedStyle(_this.$refs.lessonsH,false)["height"])+50+"px";
      },10)
        }
      });
    },
   //- 小写数字转换成大写, 只处理到[0 ~ 99]
    numberConvertToUppercase(num) {
      num = Number(num);
      var upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
      var length = String(num).length;
      if (length == 1) {
        this.number = `第${upperCaseNumber[num]}课`;
      } else if (length == 2) {
        if (num == 10) {
          this.number= `第${upperCaseNumber[num]}课`;
        } else if (num > 10 && num < 20) {
          this.number= `第${'十' + upperCaseNumber[String(num).charAt(1)]}课`;
        } else {
          this.number=`第${upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '')}课`;
        }
      }
  },
    //编辑内容
    editContent(index) {
      this.ruleForm.textarea = "";
      this.ruleForm.keyWords = "";
      this.videoPic='';
      this.hasImgList=[];
      if(this.$refs.shangchuan){
        setTimeout(()=>{
          this.$refs.shangchuan.style.display="block";
        },0)
      }
      if(this.$refs.boxCon){
        setTimeout(()=>{
      this.$refs.boxCon.style.width="0";
      },0)
      }
      this.numberConvertToUppercase(index+1);
      this.uploadUrl='';
      this.edit='open';
      if(this.coursetype==="直播"){
        this.isLive=true;
      }else{
        this.isLive=false;
      }
      this.dialogVisible = true;
      this.editIndex = index;
    },
    //修改单课
    modifySingle(item,index) {
      // this.modifyIndex=index;
      this.hasImgList=[];
     if(this.$refs.shangchuan){
       setTimeout(() => {
         this.$refs.shangchuan.style.display="block";
       }, 0);
      }
      if(this.$refs.boxCon){
        setTimeout(()=>{
      this.$refs.boxCon.style.width="0";
      },0)
      }
      this.numberConvertToUppercase(index+1);
      if(item.id){
      this.edit="close";
      this.uploadUrl = item.coursewareurl
      this.ruleForm.textarea = item.topic;
      this.ruleForm.keyWords = item.knowledgepoint;
      this.videoPic=item.videocover;
      this.id=item.id;
      this.dialogVisible = true;
      }else{
        this.$message({
                type: "warning",
                message: "单课为空，不能修改，请先创建"
        })
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
    //上传文件处理
    //文件改变时的钩子函数
   handleChangeV(file, fileList) {
        this.$refs.shangchuan.style.display="none";
        this.imgLength = fileList.length;
        this.imgList = fileList;
      },
  //上传成功时候的钩子
  successUpload(data) {
    this.judgeUpload=false;
        if (data) {
          let videoUrl = ''
          videoUrl = data.split('src="')[1];
          videoUrl = videoUrl.split('" />')[0];
          this.uploadUrl=videoUrl;
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
          this.videoTime = vt.replace('.',':');
          this.videoPic = data.split('"cover":"')[1];
          this.videoPic = this.videoPic.split('"}')[0];
        }

      },
      //上传文件之前的钩子
      beforeAvatarUploadV(file) {
        console.log(file.size);
        const isLt10M = file.size / 1024 /1024  < 1024;
        if (['video/mp4'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过1G哦!');
          return false;
        }
      },
      //文件列表移除文件时的钩子
      handleRemoveV(file, fileList) {
        this.judgeUpload=false;
        if(this.$refs.shangchuan){
          this.$refs.shangchuan.style.display="block";
        }
        this.isUpload=false;
        this.videoPic = ''
        this.$emit('getVideo', '');
      },
      addZero(value){
        let a=value.getSeconds();
        if(a<10){
          a="0"+a;
          return a;
        }else{
          return a
        }
      },
  //新增单课
    createSingle() {
      if(this.ruleForm.keyWords===""||this.ruleForm.textarea===""){
        this.$message.error("主题或知识点不能为空")
      }else if(this.judgeUpload){
        this.$message.warning("视频上传中，请等待")
        }else{
      let _this = this;
      let message = {};
      let time=new Date();
      message.startTime=time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+this.addZero(time);
      message.endTime=time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+this.addZero(time);
      message.sessionId = _this.sessionId;
      message.courseSeriesId = _this.courseSeriesId;
      _this.ruleForm.textarea=encodeURIComponent(encodeURIComponent(_this.ruleForm.textarea));
      _this.ruleForm.keyWords=encodeURIComponent(encodeURIComponent(_this.ruleForm.keyWords));
      message.topic = _this.ruleForm.textarea;
      message.knowledgePoint = _this.ruleForm.keyWords;
      //新增单课
        if(this.edit==="open"){
            if(this.coursetype==="直播"){
            message.startTime =this.value1.getFullYear() +
              "-" +
              (this.value1.getMonth()+1) +
              "-" +
              this.value1.getDate() +
              " " +
              this.value2.getHours() +
              ":" +
              this.value2.getMinutes()+
              ":"+
              this.addZero(this.value2);
            message.endTime =this.value1.getFullYear() +
              "-" +
              (this.value1.getMonth()+1) +
              "-" +
              this.value1.getDate() +
              " " +
              this.value3.getHours() +
              ":" +
              this.value3.getMinutes()+
              ":"+
              this.addZero(this.value3);
              send.ajaxSend({
                  url: addSingleLessonAPI,
                  thisVue: _this,
                  data: message,
                  success: function(data) {
                    _this.getSingleList();
                  }
                });
            }
            else{
              if(this.uploadUrl!==""){
                message.coursewareUrl=this.uploadUrl;
                message.videoCover=this.videoPic;
                message.videoLength=this.videoTime;
                send.ajaxSend({
                  url: addSingleLessonAPI,
                  thisVue: _this,
                  data: message,
                  success: function(data) {
                    // _this.singleList.push(message);
                    _this.getSingleList();
                  }
                });
                }else{
                  this.$message({
                type: "warning",
                message: "请上传课件视频"
                  })
                }
            }
              }
            //修改单课
        else{
        if(this.coursetype==="直播"){
          message.startTime =this.value1.getFullYear() +
            "-" +
            (this.value1.getMonth()+1) +
            "-" +
            this.value1.getDate() +
            " " +
            this.value2.getHours() +
            ":" +
            this.value2.getMinutes()+
            ":"+
            this.addZero(this.value2);
          message.endTime =this.value1.getFullYear() +
            "-" +
            (this.value1.getMonth()+1) +
            "-" +
            this.value1.getDate() +
            " " +
            this.value3.getHours() +
            ":" +
            this.value3.getMinutes()+
            ":"+
            this.addZero(this.value3);
        }else{
          message.coursewareUrl=this.uploadUrl;
          message.videoCover=this.videoPic;
          message.videoLength=this.videoTime
        }
          message.courseId=this.id;
          send.ajaxSend({
            url:modifySingleCourse,
            thisVue:_this,
            data:message,
            success(data){
      _this.dialogVisible = false;

              _this.getSingleList();
          // _this.$set(_this.singleList,_this.modifyIndex,message);
        }
      })
      }
      this.dialogVisible = false;
      }
    },
    //删除单课
    deleteSingle: function(courseId,index) {
      if(courseId){

              let _this = this;
              send.ajaxSend({
                url: deleteSingleLessonAPI,
                thisVue: _this,
                data: {
                  courseId: courseId,
                  courseSeriesId: _this.courseSeriesId,
                  sessionId: _this.sessionId
                },
                success: function(data) {
                // _this.singleList.splice(index,1)
              _this.getSingleList();
                }
            })
      }else{
        this.$message({
                type: "warning",
                message: "不能删除空的单课"
        })
      }

    },
    //点击确定保存
    confirmLesson: function() {
      this.$router.push({
          name: 'lessonList',
        })
    },
    //添加一节课
    addCourse() {
      this.initContentHeight();
      this.singleList.push({});
    },
    //删除一节课
    handleClose(done) {
       if(this.$refs.uploadFile){
        this.$refs.uploadFile.abort();
      }
          done();
    }
  },
  watch: {
    value1: function(value) {
      let y = value.getFullYear();
      let m = value.getMonth() + 1;
      let d = value.getDate();
      this.weekDay = y + "-" + m + "-" + d;
    },
    // initContentHeight:"initContentHeight"
  }
};
</script>

<style scoped lang='less' >
@import "../../assets/style/public.less";

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.bg-purple {
  background: @com-module-bg;
  // height: 100%!important;
  padding: 40px 20px 30px 54px;
  .container {
    div {
      img {
        width: 200px;
        height: 135px;
        vertical-align: top;
      }
      .courseContent {
        margin-left: 20px;
        display: inline-block;

        h3 {
          width: 191px;
          height: 16px;
          font-size: 16px;
          font-family: SourceHanSansCN-Regular;
          color: @com-h2S1-font;
          margin-bottom: 21px;
          font-weight:normal;
        }
        i {
          color: @com-button-Co-font;
          font-size: 12px;
          margin-right: 10px;
          font-style: normal;
          display: inline-block;
          text-align: right;
          width: 50px;
        }
        .zb{
            background:url("../../assets/img/zb1.png") no-repeat 0%;
          }
          .kj{
            background:url("../../assets/img/kj1.png") no-repeat 0%;
          }
        span {
          font-size: 12px;
          color: @com-h4s4-font;
        }
      }
    }
    p {
      font-size: 12px;
      font-family: SourceHanSansCN-Regular;
      color: @com-h2S1-font;
      line-height: 30px;
      margin-top: 19px;
      margin-left: 2px;
      margin-bottom: 41px;
    }
    .el-button {
      width: 90px;
      height: 30px;
      line-height: 30px;
      background: @com-button-Sx-bg;
      border-radius: 3px;
      font-size: 12px;
      font-family: SourceHanSansCN-Normal;
      color: @com-button-Sx-font;
      border:none;
      padding:0px;
    }
  }
}
.bg-purple-light {
  float: left;
  width: 100%;
  background-color: @com-input-bg;
  height: calc(100%);
  .lessons {
    font-size: @font - 4;
    color: @com-button-C-font;
    .top{
      margin:19px 12px 0px 9px;
      display: flex;
      justify-content:space-between;
      align-items: center;
    }
    ul {
    padding: 20px;
      li {
        margin-bottom: 40px;
        .singleCourse {
          padding: 17px 42px;
          img{
            width:156px;
            height:84px;
            position: absolute;
            right:43px;
            top:27px;
          }
          min-height:137px;
          padding-top: 16px;
          background: @com-module-bg;
          box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.2);
          position: relative;
          div {
            p{
              margin: 0;
              padding: 0;
              color:@com-h2S1-font;
              margin-bottom: 16px;
              word-break: break-all;

            }
            .pTime{
              font-size: 12px;
            }
            .pTitle{
              width: 204px;
              font-size: 14px;
            }
            .pKey {
              width: 204px;
              font-size: 12px;
              line-height: 23px;
            }
          }

          .aid {
            position: absolute;
            width: 31px;
            height: 31px;
            left: 0;
            top: 0;
            font-size: 30px;
            color: @com-buttonIco-A-color;
            span {
              position: absolute;
              color: rgba(25, 27, 33, 1);
              font-size: 14px;
              left: 8px;
              top:4px;
            }
          }
          .el-button {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 130px;
            height: 40px;
            background-color: transparent;
            border-radius: 3px;
            border: 1px dashed @com-button-C-border;
          }
        }
        .gongneng {
          float: right;
          margin-top: 10px;
          i {
            cursor: pointer;
            margin-left: 20px;
          }
        }
      }
    }
    .top {
      .btn {
        float: right;
        width: 80px;
        height: 30px;
        background-color: @com-button-Sx-bg;
        border-color: @com-button-Sx-border;
        color: @com-button-Sx-font;
        padding:0px;
      }
    }
    .addCourseTc{
      text-align: center;
      .addCourse {
        width: 300px;
        height: 40px;
        border: 1px dashed @com-button-Co-border;
        background-color: transparent;
        color: @com-button-Co-font;
        border-radius: 3px;
        padding:0px;
        display:inline-block;
      }
    }
  }
  background: transparent;
  height: 100%;
}
.el-textarea__inner {
  background-color:  @com-input-bg !important;
  border: none;
  color: @com-input-color-sr;
}

.el-dialog {
  background-color: @com-sizeS3-color !important;
  .el-form {
    color: @com-h2S1-font;
    text-align: left;

    .el-form-item__content{
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
      background-color:  @com-input-bg !important;
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
      border-radius:3px;
      width: 70px;
      height: 30px;
      padding: 0;
      border-color: @com-button-Sx-border;
      color: @com-button-Sx-font;
      font-size:12px;
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
.cancel {
  background: rgba(143, 148, 156, 1);
  color: rgba(25, 27, 33, 1);
  border: none;
  width: 90px;
  height:30px;
  line-height: 30px;
  padding:0px;
}
.sure {
  background: rgba(231, 194, 127, 1);
  color: rgba(25, 27, 33, 1);
  border: none;
  width: 90px;
  margin-left: 19px;
  line-height: 30px;
  padding:0px;
}
.el-form-item{
  margin-bottom: 17px;
}
.selectDate {
  padding-left: 0 !important;
  span {
    display: none !important;
  }
  i {
    display: none !important;
  }
  input {
    padding-left: 0 !important;
  }
}
.el-input__inner {
  padding-left: 0 !important;
}
</style>

<style lang="less">
  @import '../../assets/style/public.less';

#app .el-form-item__content .el-textarea {
  height: 64px;
  overflow-y: visible !important;
}
.createCourse{
  .touzi-main {
      display:block !important;
      .tap-link{
        margin: 0 10px;
        vertical-align: top;
      }
  }
  .single {
  div {
    background-color: @com-module-bg;
    .el-dialog__header {
      padding: 21px 27px 0px 27px;
      line-height: 0px;
      span {
        color: @com-h2S1-font !important;
      }
    }
    .el-dialog__body {
      color: @com-h3-font !important;
      line-height: 20px;

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
            }
            .el-form-item__content{
              .el-textarea{
                  .el-textarea__inner{
                            background-color: @com-input-bg !important;
                            border:none !important;
                  }

              }
            }

          }

          .zhuti{
            margin-top:15px;
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
      color: @com-h3-font !important;
      input {
        margin-left: 4px;
      }
    }
  }
}
.upload-demo {
  position: relative;

  ul {
    z-index: 999999;
    position: absolute;
    top: 5px;
    left: 78px;
    width: 470px;
    li {
      width:98%;
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
  .upload-demo{
    .el-upload{
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

.el-form-item__label:before{
  content:'' !important;
}


.el-upload-list__item{
  margin-top: 0px!important;
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
.single {
  div {
    background-color: @com-module-bg;
    .el-dialog__header {
      padding: 21px 27px 0px 27px;
      span {
        color: @com-h2S1-font !important;
      }
    }
    .el-dialog__body {
      color: @com-h3-font !important;
      padding: 29px 38px 21px 47px;
      div {
        .el-form {
          .linkSize{
            margin-right:10px;
          }
          .el-form-item {
            .el-form-item__label {
              color: @com-h2S1-font !important;
              position: relative;
              z-index: 99999;
              width: 80px;
              font-size: 12px;
            }
          }
        }
      }
    }
    .el-dialog__footer{
          padding: 0px 41px 30px 0px;
    }

    .shangkeTime {
      color: @com-h3-font !important;
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
.course {
  span {
    color: @com-h3-font;
    padding-right: 12px !important;
  }
  input {
    width: 435px;
    height: 30px;
    background: rgba(40, 44, 53, 1);
    border: none;
    outline: none;
    padding-left: 4px;
    color: @com-input-color-sr;
    box-sizing: border-box;
    margin-left: 4px;
  }
  .el-upload {
    .el-button {
      width: 70px;
      font-size:12px;
      border: none;
      outline: none;
      border-radius: 3px;
      margin: 9px 10px 3px 84px;
    }
    .cleckUp{
      background: transparent;
      border:1px solid @com-button-Co-border;

      span{
        display:inline-block;
        width:24px;
        height:13px;
        color:@com-button-Co-font;
      }
    }
  }

}
.curTextarea{
  .el-textarea__inner{
    height:60px;
  }
}
.el-textarea__inner,.el-input__inner {
}
.theme {
  margin-bottom: 20px;
  span {
    vertical-align: top;
    display: inline-block;
    margin: 10px;
    color: @com-h4s4-font;
  }
  textarea {
    background: @com-input-bg;
    color: @com-input-color-sr;
    padding: 10px 0 0 10px;
    margin-left: 20px;
    width: 449px;
    height: 60px;
    border: none;
    outline: none;
    resize:none;
  }
  .knowledge {
    margin-left: 8px;
  }
}
.kejianImg{
  width:156px;
  height:84px;
}

.zhuming {
  margin-left: 95px;
  color: @com-h4s4-font;
  font-size: 12px
}
textarea{
  resize:none !important;
}
}

</style>


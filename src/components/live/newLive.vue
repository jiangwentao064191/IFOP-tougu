<template>
  <div class="newlive" v-loading.fullscreen.lock="fullscreenLoading">
    <el-progress v-loading.fullscreen.lock="showPercentage" element-loading-background="rgba(200,200,200, 0.5)" element-loading-spinner="show-spinner" class="circle-percen" type="circle" v-if="showPercentage" :percentage="videoPercentage"></el-progress>
    <div class="touzi-main clearfix">
      <router-link class="main-back back-main" to="/index/liveList">
        < 返回
      </router-link>
      <span class="main-back tap-link tap-linkStyle" style="color: #DDDDDD;">新建直播室</span>
    </div>
    <div class="new-live">
      <el-form class="demo-ruleForm clearfix" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px">
        <el-form-item label="直播形式" prop="type">
          <el-button class="zb" @click="isActive = false" :class="{active:!isActive}"> 直播</el-button>
          <el-button class="kj" @click="isActive = true" :class="{active:isActive}">录播</el-button>
        </el-form-item>
        <el-form-item label="直播室主题" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入直播室主题"></el-input>
        </el-form-item>
        <el-form-item label="直播室封面" class="clearfix">
          <el-upload accept="image/jpeg,image/jpg,image/png,image/bmp"
                     :action="importFileUrl"
                     :data="imgData"
                     list-type="picture-card"
                     :on-exceed="exceed"
                     :file-list="hasImgList"
                     :limit="1"
                     :on-change="handleChange"
                     :on-success="removeUpload"
                     :on-preview="handlePictureCardPreview"
                     :before-upload="beforeAvatarUpload"
                     :on-remove="handleRemove" style="float:left;"
                     ref="upload">
            <i class="el-icon-plus"></i>
            <span class="icon-text">点击上传图片</span>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <p class="img-pro" style="float:left;">（上传仅支持jpg、png格式，大小不超过5M）</p>
        </el-form-item>
        <!--:auto-upload="false"-->
        <el-form-item label="课件地址" v-if="isActive">
          <el-upload class='upload-demo'
                     accept="video/mp4"
                     action=""
                     :http-request="uploadRequest"
                     :data="upLoadData"
                     multiple
                     :on-exceed="exceedV"
                     :limit="1"
                     :on-change="handleChangeV"
                     :before-upload="beforeAvatarUploadV"
                     :on-remove="handleRemoveV"
                     :on-progress="getProgress"
                     :auto-upload="false"
                     :show-file-list="isShowList"
                     ref="uploadFile">
            <!--  :on-success="successUpload"
              :on-error="errorUpload"-->
            <!-- <div ref="box" v-show="isUpload" class="box"><p ref="boxCon" class="boxCon"></p></div>-->
            <div class="shangchuan" ref="shangchuan">
              <el-button size="small" class="active">上传</el-button>
              <span class="upload-tip">仅可上传MP4格式文件</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="知识点" prop="topics">
          <el-input v-model="ruleForm.topics" placeholder="请输入知识点" maxlength="30"></el-input>
          <p class="topic-color">最多3个知识点，请以：隔开，单个知识点最多输入8个字符</p>
        </el-form-item>
        <el-form-item label="直播时间" v-if="!isActive">
          <el-date-picker type="date" class="day-time-input"
                          v-model="liveTime" :picker-options="pickerOptions0"
                          placeholder="">
          </el-date-picker>
          <el-time-select class="min-time-input"
                          placeholder=""
                          v-model="startTime"
                          @change="startChange"
                          :picker-options="{
      start: '00:00',
      step: '00:10',
      end: '23:50',
      minTime: minStartTime
    }">
          </el-time-select>
          至
          <el-time-select class="min-time-input" style="margin-left: 5px;"
                          placeholder=""
                          v-model="endTime"
                          :picker-options="{
      start: '00:00',
      step: '00:10',
      end: '23:50',
      minTime: minEndTime
    }">
          </el-time-select>

        </el-form-item>
        <el-form-item label="直播收费类型" prop="chargeType">
          <el-radio-group v-model="ruleForm.chargeType">
            <el-radio label="免费"></el-radio>
            <el-radio label="黄金会员"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="直播室说明" prop="introduction">
           <el-input
             type="textarea"
             :rows="3" maxlength="500"
             placeholder="请输入直播室说明"
             v-model="ruleForm.introduction">
           </el-input>
         </el-form-item>-->
        <!--<el-form-item label="直播室开放模式" prop="vpType">
          <el-radio-group v-model="ruleForm.vpType">
            <el-radio label="常驻直播室"></el-radio>
            <el-radio label="每天固定时间开放"></el-radio>
            <el-radio label="单次开放"></el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="选择时间" v-if="ruleForm.vpType == '每天固定时间开放'">
          <el-time-picker class="time-input"
                          v-model="value2"
                          placeholder="">
          </el-time-picker>
          至
          <!--arrow-control-->
          <el-time-picker class="time-input" style="margin-left:5px;"

                          v-model="value3"
                          placeholder="">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="选择时间" v-if="ruleForm.vpType == '单次开放'">
          <el-date-picker type="datetime" class="day-time-input"
                          v-model="startDayTime"
                          placeholder="">
          </el-date-picker>
          至
          <el-date-picker type="datetime" class="day-time-input" style="margin-left:14px;"
                          arrow-control
                          v-model="endDayTime"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item class="power-radio" label="进入直播室权限设置" prop="power">
           <el-radio-group v-model="ruleForm.power">
             <el-radio class="radio1" label="公开"></el-radio>
             <br>
             <el-radio class="radio2" label="收费"></el-radio>
           </el-radio-group>
           <span class="radio-tit">免费进入直播室</span>
           <div class="radio-price">
             <div class="price-day">
               <span class="price-name">日票</span>
               <el-input class="reward-cl shot-input" v-model="ruleForm.dayPrice"></el-input>
               <span class="price-dw">元</span>
             </div>
             <div class="price-day">
               <span class="price-name">月票</span>
               <el-input class="reward-cl shot-input" v-model="ruleForm.monthPrice"></el-input>
               <span class="price-dw">元</span>
             </div>
             <div class="price-day">
               <span class="price-name">年票</span>
               <el-input class="reward-cl shot-input" v-model="ruleForm.yearPrice"></el-input>
               <span class="price-dw">元</span>
             </div>
           </div>
         </el-form-item>
         <el-form-item label="打赏功能">
           &lt;!&ndash; <div class="choose">
              <label class="radio">开启<input type="radio" name="radio" v-model="ruleForm.openReward" value="true"
                                            @click="change(this);"><i></i></label>
            </div>&ndash;&gt;
           <el-checkbox label="开启" v-model="ruleForm.openReward"></el-checkbox>
           <el-input class="reward-cl min-shot-input limit-input" v-model="ruleForm.reward1"></el-input>
           元
           <el-input class="reward-cl min-shot-input limit-input" v-model="ruleForm.reward2"></el-input>
           元
           <el-input class="reward-cl min-shot-input limit-input" v-model="ruleForm.reward3"></el-input>
           元
           <div class="reward-defa">可自定义设置打赏金额</div>
           &lt;!&ndash;<input class="radio-st" type="radio" v-model="openReward" />打赏&ndash;&gt;
         </el-form-item>
         <el-form-item label="评论模式" prop="commentType">
           <el-radio-group v-model="ruleForm.commentType">
             <el-radio label="公开"></el-radio>
             <el-radio label="小纸条模式"></el-radio>
             <el-radio label="关闭"></el-radio>
           </el-radio-group>
         </el-form-item>
         <el-form-item label="在我的主页展示直播室">
           <el-checkbox label="开启" v-model="ruleForm.homePage"></el-checkbox>
         </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="margin-top:0px;">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    addLiveRoomAPI,
    queryViip,
    updateLiveRoomAPI,
    getDayTime,
    imgUrlAPI,
    apiUrl,
  } from '../../assets/apiRegular'
  import send from '../../assets/js/ajaxSend'
  import axios from 'axios'

  export default {
    name: "newLive",
    data() {
      return {
        showPercentage:false,
        videoPercentage:0,
        paramObj: {},
        upLoadData: {},
        videoUrlAPI: imgUrlAPI,
        startTime: "",
        minEndTime: '',
        minStartTime: '',
        endTime: "",
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        liveTime: new Date(),
        isActive: false,
        importFileUrl: imgUrlAPI,
        imgData:{'token':JSON.parse(localStorage.getItem('logininfo')).session_id},
        fromDate: '',
        vipList: [],
        fullscreenLoading: false,
        ruleForm: {
          name: '',
          introduction: '',
          topics: '',
          chargeType: '免费',
          vpType: '常驻直播室',
          power: '公开',
          reward1: 10,
          reward2: 20,
          reward3: 50,
          openReward: true,
          dayPrice: 0,
          monthPrice: 0,
          yearPrice: 0,
          commentType: '公开',
          homePage: true,
        },
        value2: new Date(),
        value3: new Date(),
        startDayTime: new Date(),
        endDayTime: new Date(),
        sessionId: '',
        user: '',
        hasImgList: [],
        imgList: [],
        imgLengthV: 0,
        imgLength: 0,
        imgListV: [],
        imgUrlStr: '',
        dialogImageUrl: '',
        dialogVisible: false,
        rules: {
          name: [
            {required: true, message: '请输入直播室主题', trigger: 'blur'},
            {max: 20, message: '最多输入20个汉字', trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '请输入直播室说明', trigger: 'blur'},
            {max: 500, message: '最多输入500个汉字', trigger: 'blur'}
          ],
          topics: [
            {required: true, message: '请输入知识点', trigger: 'blur'},
            {max: 30, message: '最多输入30个汉字', trigger: 'blur'}
          ],
        },
        judgeUpload: false,
        isUpload: false,
        isShowList: true,
      }
    },
    mounted() {
      this.$store.state.loadingContent = false;
      // this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      this.getSpeicalTime();
      if (this.$route.query.liveFromDate) {
        let _this = this;
        _this.formDate = _this.$route.query.liveFromDate;
        console.log('this.formDate', _this.formDate)
        if (_this.formDate.type == "livebroadcast") {
          _this.isActive = false;
        } else {
          _this.isActive = true;
        }
        _this.ruleForm.name = _this.formDate.name;
        _this.ruleForm.topics = _this.formDate.introduction;
        _this.liveTime = new Date(_this.formDate.starttime.substr(0, 10));
        _this.startTime = _this.formDate.starttime.substr(11, 5);
        _this.endTime = _this.formDate.endtime.substr(11, 5);
        if (_this.formDate.vipcode == 'A') {
          _this.ruleForm.chargeType = '免费';
        } else {
          _this.ruleForm.chargeType = '黄金会员';
        }

        /*if (_this.formDate.f_open_type == 'A') {
          _this.ruleForm.vpType = '常驻直播室'
        } else if (_this.formDate.f_open_type == 'B') {
          _this.ruleForm.vpType = '每天固定时间开放'
          _this.value2 = new Date(_this.formDate.f_starttime)
          _this.value3 = new Date(_this.formDate.f_endtime)
        }else if (_this.formDate.f_open_type == 'C') {
          _this.ruleForm.vpType = '单次开放'
          _this.startDayTime = new Date(_this.formDate.f_starttime)
          _this.endDayTime = new Date(_this.formDate.f_endtime)
        }*/
        /*if (_this.formDate.f_free_type == '0') {
          _this.ruleForm.power = '公开';
        } else if (_this.formDate.f_free_type == '1') {
          _this.ruleForm.power = '收费';
          _this.ruleForm.dayPrice = _this.formDate.f_day_price;
          _this.ruleForm.monthPrice = _this.formDate.f_month_price;
          _this.ruleForm.yearPrice = _this.formDate.f_year_price;
        }
        if (_this.formDate.f_praise_flag == '1') {
          _this.ruleForm.openReward = true;
          _this.ruleForm.reward1 = _this.formDate.f_reward_amt1;
          _this.ruleForm.reward2 = _this.formDate.f_reward_amt2;
          _this.ruleForm.reward3 = _this.formDate.f_reward_amt3;
        }else{
          _this.ruleForm.openReward = false;
        }
        if(_this.formDate.f_discuss_flag == '0'){
          _this.ruleForm.commentType = '公开';
        }else if(_this.formDate.f_discuss_flag == '1'){
          _this.ruleForm.commentType = '小纸条模式';
        }else if(_this.formDate.f_discuss_flag == '2'){
          _this.ruleForm.commentType = '关闭';
        }
        if(_this.formDate.f_homepage_flag == '1'){
          _this.ruleForm.homePage = true;
        }else{
          _this.ruleForm.homePage = false;
        }*/

        var obj = {};
        obj.name = '1';
        obj.url = _this.formDate.coverurl;
        _this.hasImgList.push(obj);
        _this.imgList = _this.hasImgList;
        if (_this.hasImgList.length > 0) {
          _this.$refs.upload.$el.childNodes[1].style.display = "none"
        }
      }

      this.getVips();
    },
    methods: {
      //上传成功时候的钩子
      successUpload(data) {
        this.judgeUpload = false;
        this.upSuccess();
        if (data) {
          let videoUrl = "";
          videoUrl = data.split('src="')[1];
          videoUrl = videoUrl.split('" />')[0];
          // this.uploadUrl = videoUrl;
          // this.$emit("getVideo", videoUrl);
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
          /* this.videoTime = vt.replace(".", ":");
           this.videoPic = data.split('"cover":"')[1];
           this.videoPic = this.videoPic.split('"}')[0];*/
        }
      },
      //进度条显示
      getProgress(event, file) {
        this.judgeUpload = true;
          this.isUpload = true;
        this.videoPercentage = parseInt(file.percentage);
        if(!this.showPercentage){
          this.showPercentage = true;
        }

        /* this.$refs.boxCon.style.width = event.percent / 100 * this.$refs.boxCon.parentNode.offsetWidth + "px";*/
      },
      //文件列表移除文件时的钩子
      handleRemoveV(file, fileList) {
        this.judgeUpload = false;
        if (this.$refs.shangchuan) {
          setTimeout(() => {
            this.$refs.shangchuan.style.display = "block";
          }, 0);
        }
        this.isUpload = false;
        /*  this.videoPic = "";*/
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
      errorUpload(err) {
        this.fullscreenLoading = false;
        this.$message({
          message: '视频上传失败',
          type: 'error',
        });
        this.$router.push({name: 'liveList',});
        //  console.log(err, "上传失败");
      },
      uploadVideoProcess(event, file, fileList) {
      },
      //上传文件处理
      //文件改变时的钩子函数
      handleChangeV(file, fileList) {
        const isLt10M = file.size / 1024 / 1024 < 1024;
        if (["video/mp4"].indexOf(file.raw.type) == -1) {
          this.$message.error("请上传正确的视频格式");
          this.$refs.uploadFile.handleRemove();
          return false;
        }
        if (!isLt10M) {
          this.$message.error("上传视频大小不能超过1G哦!");
          this.$refs.uploadFile.handleRemove();
          return false;
        }
        // this.isShowList = true;
        this.$refs.shangchuan.style.display = "none";
        this.imgLengthV = fileList.length;
        this.imgListV = fileList;
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
      getSpeicalTime() {
        let now = new Date();
        let str = now.getMinutes() + 10;
        // str = 67
        if (str >= 10 && str <= 59) {
          str = str.toString().substr(0, 1) + '0'
          let hoursStr = now.getHours();
          if (now.getHours() >= 1 && now.getHours() <= 9) {
            hoursStr = '0' + now.getHours();
          }
          this.startTime = hoursStr + ':' + str;
        } else if (str > 59) {
          if (now.getHours() != 23) {
            this.startTime = now.getHours() + 1 + ':00';
          } else {
            this.startTime = '00:00';
          }
        }
        this.minStartTime = now.getHours() + ':' + now.getMinutes();
        this.getEndSpeicalTime();
      },
      getEndSpeicalTime() {
        console.log('start', this.startTime)
        let str = this.startTime.substr(this.startTime.length - 2, 2);
        let endStr = parseInt(str) + 20;
        this.minEndTime = this.startTime.substr(0, 2) + ':' + endStr;
        // console.log('startTime', this.startTime.substr(0, 2))
        /*   if (this.startTime.substr(0, 2) == 23 && endStr >= 60) {
             this.minEndTime = '00:00';
           } else {
             this.minEndTime = this.startTime.substr(0, 2) + ':' + endStr;
           }*/
        let parStr = parseInt(str) + 30;
        console.log('parStr', this.minEndTime)
        if (parStr >= 30 && parStr <= 50) {
          this.endTime = this.startTime.substr(0, 2) + ':' + (parseInt(str) + 30);
        } else if (parStr == 60) {
          this.endTime = parseInt(this.startTime.substr(0, 2)) + 1 + ':00';
        } else if (parStr == 70) {
          this.endTime = parseInt(this.startTime.substr(0, 2)) + 1 + ':10';
        } else if (parStr == 80) {
          this.endTime = parseInt(this.startTime.substr(0, 2)) + 1 + ':20';
        }
        if (parseInt(this.startTime.substr(0, 2)) == 23 && parStr >= 60) {
          this.endTime = '00:00';
        }
      },
      startChange(value) {
        console.log('value', value)
        this.getEndSpeicalTime()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      getVips() {
        let _this = this;

        send.ajaxSend({
          url: queryViip,
          thisVue: _this,
          success: function (data) {
            if (data.vips) {
              _this.vipList = data.vips;
              console.log('vipList', data)
            }
          }
        });

      },
      beforeAvatarUpload(file) {
        console.log('000ds', file)
        const isJPG = (file.type === 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('上传图片只能是.jpg .jpeg .png格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      exceed(file, fileList) {
        // console.log('excc', file, fileList);
        if (fileList.length >= 1) {
          this.$message({
            message: '可上传1张缩略图',
            type: 'warning'
          });
        }
      },
      handleRemove(file, fileList) {
        this.$refs.upload.$el.childNodes[1].style.display = "block"
        // console.log(file, fileList);
      }
      ,
      handlePictureCardPreview(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      }
      ,
      handleChange(file, fileList) {
        this.imgLength = fileList.length;
        this.imgList = fileList;
      },
      //上传完之后移除上传方式
      removeUpload() {
        this.$refs.upload.$el.childNodes[1].style.display = "none"
      },
      change: function () {
        // console.log('fd',this.openReward)
        this.ruleForm.openReward = !this.ruleForm.openReward;
      },
      toSingle(data) {
        this.$router.push({
          name: 'createCourse',
          query: {
            courseSeriesId: data
          }
        });
      },
      submitForm(formName) {
        let _this = this;
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            let message = {};
            for (let i = 0; i < this.imgList.length; i++) {
              let str = '';
              if(_this.imgList[i].response){
                str =_this.imgList[i].response.data[0].url;
              }
              if (str) {
                /*str = str.split('src="')[1];
                str = str.split('" />')[0];*/
                if (_this.imgUrlStr) {
                  _this.imgUrlStr += ',' + str;
                } else {
                  _this.imgUrlStr += str;
                }
              } else {
                if (_this.imgList[i].url) {
                  if (_this.imgUrlStr) {
                    _this.imgUrlStr += ',' + _this.imgList[i].url;
                  } else {
                    _this.imgUrlStr += _this.imgList[i].url;
                  }
                }
              }
            }
            message.sessionId = _this.sessionId;
            message.lecturerId = _this.user.user_id;
            message.name = encodeURIComponent(encodeURIComponent(_this.ruleForm.name));
            message.coverUrl = _this.imgUrlStr;
            message.introduction = encodeURIComponent(encodeURIComponent(_this.ruleForm.topics));
            if (_this.isActive) {
              message.type = 'courseware';
              if (!_this.imgLengthV) {
                _this.$message.error('请上传课件');
                return false;
              }
            } else {
              message.type = 'livebroadcast';
              let day = getDayTime(_this.liveTime).substr(0, 11);
              message.startTime = day + _this.startTime + ':00';
              message.endTime = day + _this.endTime + ':00';
              ;
            }
            if (_this.ruleForm.chargeType == '免费') {
              message.vipCode = 'A'
            } else {
              message.vipCode = 'B'
            }
            // message.desc = _this.ruleForm.introduction;
            // message.course_kind = 'B';
            /* if(_this.ruleForm.homePage){
               message.homepage_flag = '1'
             }else{
               message.homepage_flag = '0'
             }*/
            /* if (!_this.ruleForm.openReward) {
               message.reward_flag = 0;
             }*/
            /* if (_this.ruleForm.vpType == '常驻直播室') {
               message.open_type = 'A';
               message.startopen_time = '00:00'
               message.endopen_time = '23:59'
             } else if (_this.ruleForm.vpType == '每天固定时间开放') {
               message.open_type = 'B';
               message.startopen_time = getDayTime(_this.value2, true).substr(0, 5);
               message.endopen_time = getDayTime(_this.value3, true).substr(0, 5);
             } else if (_this.ruleForm.vpType == '单次开放') {
               message.open_type = 'C';
               message.startopen_time = getDayTime(_this.startDayTime).substr(0,16);
               message.endopen_time = getDayTime(_this.endDayTime).substr(0,16);
             }*/
            /* if (_this.ruleForm.power == '公开') {
               message.free_type = 0
             } else {
               message.free_type = 1;
               message.day_price = _this.ruleForm.dayPrice;
               message.month_price = _this.ruleForm.monthPrice;
               message.year_price = _this.ruleForm.year_price;
             }
             if (_this.ruleForm.openReward) {
               message.praise_flag = 1;
               message.rewardAmt1 = _this.ruleForm.reward1;
               message.rewardAmt2 = _this.ruleForm.reward2;
               message.rewardAmt3 = _this.ruleForm.reward3;
             } else {
               message.praise_flag = 0;
             }

             if (_this.ruleForm.commentType == '公开') {
               message.discuss_flag = 0;
             } else if (_this.ruleForm.commentType == '小纸条模式') {
               message.discuss_flag = 1;
             } else if (_this.ruleForm.commentType == '关闭') {
               message.discuss_flag = 2;
             }*/
            if (!_this.imgUrlStr) {
              _this.$message.error('请上传直播室封面缩略图');
              return false;
            } else {
              _this.fullscreenLoading = true;
              let urlAPI = '';
              if (_this.formDate) {
                urlAPI = updateLiveRoomAPI;
                message.courseSeriesId = _this.formDate.id;
              } else {
                urlAPI = addLiveRoomAPI;
              }
              send.ajaxSend({
                url: urlAPI,
                thisVue: _this,
                data: message,
                success: function (data) {
                  _this.fullscreenLoading = false;
                  if (_this.isActive) {
                    // _this.videoUrlAPI = apiUrl + '/ifop/Upload?courseId=' + data.courseid + '&courseSeriesId=' + data.liveid
                    _this.paramObj = {"courseId": data.courseid, "courseSeriesId": data.liveid};
                    // _this.formData.append('param',paramObj);
                    /* _this.upLoadData.token = _this.sessionId;
                     _this.upLoadData.param = {"courseId":data.courseid,"courseSeriesId":data.liveid}*/
                    /*_this.upLoadData.courseId = data.courseid;
                    _this.upLoadData.courseSeriesId = data.liveid;*/
                    _this.$refs.uploadFile.submit();
                  } else {
                    _this.upSuccess();
                  }
                }
              });
            }
          }
        });
      },
      uploadRequest(file) {
        let _this = this;
        let formData = new FormData()
        formData.append('file', file.file);
        // formData.append('media_type', 'video');
        formData.append('token', _this.sessionId);
        formData.append('param', JSON.stringify(_this.paramObj));
        /* let xhr = new XMLHttpRequest();
         xhr.open("post",_this.videoUrlAPI,true);
          // xhr.upload.addEventListener("progress", vm.progressFunction, false);
          xhr.onload = function(){
           console.log('xhr', xhr.response);
          }
          xhr.send(formData);*/
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
        /* axios.post(_this.videoUrlAPI,formData,{
           progress:function (event) {
             console.log('jljkljlkjklj')
             file.file.percent = event.loaded/event.total * 100
              file.onProgress(file.file)
           }
         }).then((res) => {
           _this.judgeUpload = false;
           _this.upSuccess();
         }).catch(function (res) {
           _this.errorUpload(res)
         })*/
      },
      upSuccess() {
        let _this = this;
        var messStr = '';
        if (_this.formDate) {
          messStr = '修改成功'
        } else {
          messStr = '新建成功'
        }
        _this.$message({
          message: messStr,
          type: 'success',
        });
        _this.fullscreenLoading = false;
        _this.$router.push({
          name: 'liveList',
          /* query: {
             page: 'openBroadcast',
             liveId: data.liveid,
             courseid: data.courseid,
           },*/
        });
      }
    },
    watch: {
      videoUrlAPI: function (value) {
        this.videoUrlAPI = value;
      },
     /* videoPercentage:function (value) {
        this.videoPercentage = value;
      }*/
    },
  }
</script>
<style scoped lang="less">
  @import '../../assets/style/public.less';

  /deep/ .upload-demo {
    .el-upload-list {
      position: absolute;
      top: -10px;
      .el-upload-list__item {
        width: auto;
        display: inline-block;
        vertical-align: top;
        .el-progress{
          display: none;
        }
        .el-upload-list__item-name {
          display: inline-block;
          vertical-align: top;
        }
        .el-upload-list__item-status-label {
          display: inline-block;
          vertical-align: top;
          position: static;
          margin-right: 32px;
        }
        .el-icon-close {
          position: static;
          margin-right: 32px;
        }
        &:hover {
          .el-upload-list__item-status-label {
            display: none;
          }
        }
      }
    }
    .upload-tip {
      color: @com-h4s4-font;
      font-size: @font - 4;
      margin-left: 5px;
    }
    .el-upload {

      /* .box {
         width: 230px;
         height: 6px;
         position: absolute;
         !*left: 270px;*!
         top:21px;
         z-index: 999999999;
         border-radius: 6px;
         background: none;
         .boxCon {
           height: 100%;
           width: 0;
           background: #e7c27f;
           border-radius: 6px;
         }
       }*/
    }
  }

  .newlive {
    font-size: @font - 4;
    .circle-percen{
      position: fixed;
      top:40%;
      left:50%;
      z-index: 3001;
      /deep/ .el-progress__text{
        color:#fff;
      }
    }
    /deep/ .el-form-item__error {
      left: 10px;
    }
    .tap-linkStyle {
      margin-left: 20px;
    }
    .el-button {
      width: 110px;
      line-height: 30px;
      border-radius: 3px;
      background-color: transparent;
      height: 30px;
      padding: 0px;
      font-size: 12px;
      color: @com-button-M-font;
    }
    .active {
      color: @com-button-A-font;
      // background:rgba(231,194,127,1);
      border: 1px solid @com-button-A-border;
      outline: none;
      font-size: 12px;
    }
    .el-textarea {
      width: 50%;
    }
    .main-back {
      width: 74px !important;
    }
    .radio-st {
      width: 16px;
      height: 16px;
      border: 1px solid @com-radio-select;
      background-color: @com-radio-select;
    }
    .power-radio {
      position: relative;
      margin-bottom: 54px;
      .radio1 {
        line-height: 30px;
      }
      .radio2 {
        margin-top: 20px;
      }
      .radio-tit {
        position: absolute;
        left: 80px;
        color: @com-radio-default;
      }
      .radio-price {
        position: absolute;
        left: 80px;
        top: 38px;
        .price-day {
          width: 194px;
          height: 46px;
          line-height: 36px;
          background-color: #3C3C41;
          border-radius: 3px;
          display: inline-block;
          vertical-align: top;
          margin-right: 20px;
          .price-name {
            height: 43px;
            display: inline-block;
            border-right: 1px dashed @com-input-border;
            width: 18px;
            line-height: 20px;
            padding: 2px 10px;
            font-size: @font - 4;
            color: @com-input-color-sr;
          }
          .price-dw {
            display: inline-block;
            vertical-align: top;
            line-height: 46px;
          }
        }
      }
    }
    .topic-color {
      color: @com-h4s4-font;
    }
    .min-time-input {
      display: inline-block;
      vertical-align: top;
      width: 70px !important;
    }
    .time-input {
      display: inline-block;
      vertical-align: top;
      width: 130px !important;
      input {
        padding: 0 5px;
        text-align: center;
      }
    }
    .day-time-input {
      display: inline-block;
      vertical-align: top;
      width: 115px !important;
      input {
        padding: 0 5px;
        text-align: center;
      }
    }
  }

</style>
<style lang="less">
  @import '../../assets/style/public.less';

  .el-picker-panel__content {
    table {
      border: none !important;
      tr {
        border: none !important;
        .disabled {
          div {
            background-color: #fff;
          }
        }
        td {
          border: none !important;
          padding: 0;
        }
        th {
          background-color: #fff;
        }
      }
    }
  }

  .new-live {
    padding: 30px 40px;
    .el-form {
      color: @com-h3-font;
      text-align: left;
      .img-pro {
        margin-top: 110px;
        font-size: 12px;
        color: @com-h4s4-font;
      }
      .el-form-item__content {
        line-height: 30px;
      }
      .el-form-item__label {
        color: @com-h2S1-font;
        padding-right: 20px;
        line-height: 30px;
        font-size: @font - 4;
      }
      .icon-kc_icon_tjx {
        color: @com-h2S1-font;
      }
      .el-radio__inner {
        border: 1px solid @com-radio-select;
        border-radius: 100%;
        width: 16px;
        height: 16px;
        background-color: transparent;
        cursor: pointer;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        &::after {
          background-color: @com-radio-select;
          width: 8px;
          height: 8px;
        }
      }
      .el-radio__input.is-checked .el-radio__inner {
        border-color: @com-radio-select;
        background: transparent;
      }

      .el-radio__input.is-checked + .el-radio__label {
        color: @com-h2S1-font;
        font-size: @font - 4;
      }
      .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 50%;
      }
      .reward-cl {
        display: inline-block;
        vertical-align: top;
      }
      .shot-input {
        padding: 5px;
        width: 15%;
        min-width: 100px;
        input {
          text-align: center;
        }
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
        width: 60px !important;
        margin-left: 20px;
      }
      .el-input__inner, .el-textarea__inner {
        border: 1px solid @com-input-border;
        background-color: @com-input-bg;
        border-radius: 2px;
        border: none;
        color: @com-input-color-sr;
        height: 30px;
        line-height: 30px;
        width: 92%;
        padding: 0 15px;
      }

      .el-textarea__inner {
        height: auto !important;
        padding: 0 15px;
        min-height: 30px !important;
      }
      .el-checkbox__inner {
        border: 1px solid @com-radio-select;
        background-color: transparent;
        &::after {
          /*border: 1px solid #000;*/
        }
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: @com-radio-select;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: transparent;
        border-color: @com-sizeS1-color;
      }
      .el-button--primary {
        color: @com-button-Sx-font;
        background-color: @com-button-Sx-bg;
        border-color: @com-button-Sx-border;
        width: 90px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        margin-top: 30px;
      }
      .el-upload-list--picture-card .el-upload-list__item {
        width: 200px;
        height: 136px;
      }
      .el-upload--picture-card {
        background-color: @com-input-bg;
        border: none;
        width: 200px;
        height: 136px;
        .icon-text {
          padding-bottom: 5px;
          border-bottom: 1px solid @com-solidS2-bg;
          font-size: @font - 4;
        }
        i {
          display: none;
          color: white;
          font-size: 50px;
        }
      }
      ::-webkit-input-placeholder {
        color: @com-input-color !important;
      }
    }

    .el-form-item.is-required .el-form-item__label:before {
      content: none;
    }
    .el-input__icon, .el-icon-date {
      display: none;
    }
    .reward-defa {
      margin-left: 82px;
      font-size: 12px;
      margin-top: 8px;
      color: @com-h4s4-font;
    }
    .choose {
      display: inline-block;
      vertical-align: top;
      position: relative;
      margin-right: 6px;
      .radio {
        position: relative;
        display: inline-block;
        font-weight: 400;
        color: @com-h3-font;
        padding-left: 25px;
        cursor: pointer;
        font-size: @font - 4;
        input {
          position: absolute;
          left: -9999px;
        }
        i {
          display: block;
          position: absolute;
          top: 6px;
          left: 0;
          width: 15px;
          height: 15px;
          outline: 0;
          border: 1px solid @com-buttonIcoLive-A-color;
          /*background: #ffffff;*/
          border-radius: 50%;
          transition: border-color .3s;
          -webkit-transition: border-color .3s;
        }
        input + i:after {
          position: absolute;
          content: '';
          top: 3px;
          left: 3px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background-color: transparent;
          opacity: 0;
          transition: opacity .1s;
          -webkit-transition: opacity .1s;
        }
        input:checked + i:after {
          opacity: 1;
        }
      }

    }

  }
</style>

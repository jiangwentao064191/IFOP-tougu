<template>
  <div class="newLesson" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="touzi-main clearfix">
      <router-link class="main-back back-main" to="/index/lessonList">
        < 返回
      </router-link>
      <span class="main-back tap-link" style="color: #DDDDDD;">新建课程</span>
    </div>
    <div class="new-lesson">
      <el-form class="demo-ruleForm clearfix" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="课程形式" prop="type">
           <el-button class="zb"  @click="toLive" :class="{active:!isActive}"> 直播</el-button>
          <el-button class="kj" @click="toCourse" :class="{active:isActive}">课件</el-button>
        </el-form-item>
        <el-form-item label="直播流地址" prop="address" v-if="!isActive">
          <el-input v-model="ruleForm.address" placeholder="请输入直播流地址" class="liveAddress" style="width:60%"></el-input><el-button class="active activeStyle" @click="getLiveAddress">获取</el-button>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入课程名称" maxlength="20" style="width:60%"  class="courseIpnut"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" class="clearfix">
          <div class="alignBtn">
            <el-upload accept="image/jpeg,image/jpg,image/png"
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
                       ref="upload"
                       >
              <i class="el-icon-plus"></i>
              <span class="icon-text">点击上传图片</span>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <p class="img-pro" style="float:left;">（上传仅支持jpg、png格式，大小不超过5M）</p>
          </div>
        </el-form-item>
        <el-form-item label="课程简介" prop="introduction">
          <el-input
            type="textarea"
             maxlength="1024"
            placeholder="请输入课程简介"
            v-model="ruleForm.introduction"
            class="jianjie">
          </el-input>
        </el-form-item>

        <!-- <div class="chargeDiv">
          <p>直播收费类型</p>
          <template class="charge-template">
            <el-radio v-model="radio" label="1">免费</el-radio>
            <el-radio v-model="radio" label="2">黄金会员</el-radio>
          </template>
        </div> -->

        <!--<el-form-item label="课程收费类型"  prop="chargeType">
          <el-radio-group  v-model="ruleForm.chargeType" @change="chargeTypeFun">
            <el-radio label="免费"></el-radio>
            <el-radio label="黄金会员"></el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item
          class="inputNumber"
          label="系列课售价"
          prop="price"
        >
          <el-input type="age" class="shot-input" v-model="ruleForm.price" placeholder="请输入系列课售价" maxlength="10" auto-complete="off"></el-input>
          <div class="message" ref="priceMessage">
            {{priceMessage}}
          </div>
        </el-form-item>

        <el-form-item
            class="inputNumber"
            label="课程数量"
            prop="lessNum"
          >
        <el-input @blur="judgeNum(ruleForm.lessNum)" placeholder="请输入课程数量" type="age" class="shot-input" v-model="ruleForm.lessNum" auto-complete="off"></el-input>
          <div class="message" ref="message">
           {{message}}
        </div>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {
    addLessonAPI,
    getDayTime,
    queryViip,
    vcloudcreateChannelAction,
    modifyCourse,
      courseSeries,
    imgUrlAPI
  } from '../../assets/apiRegular'
  import send from '../../assets/js/ajaxSend'
  export default {
    name: "newLesson",
    data() {
      return {
        importFileUrl: imgUrlAPI,
        imgData:{'token':JSON.parse(localStorage.getItem('logininfo')).session_id},
        radio: '1',
        message:'',
        priceMessage:'',
        judgeNumFlag:false,
        isActive:false,
        vipList:[],
        select:'',
        fullscreenLoading: false,
        chargeTypeMsg:'',
        ruleForm: {
          chargeType:'免费',
          name: '',
          type: '',
          introduction: '',
          lessNum: '',
          price:'',
          validity: '',
          address: '',
          lessonSummary: '',
          service: '',
          lessonType: '',
          openReward: 'true',
        },
        sessionId: '',
        user:'',
        url:'',
        hasImgList: [],
        imgList: [],
        str:'',
        imgUrlStr: '',
        dialogImageUrl: '',
        dialogVisible: false,
        rules: {
          address: [
            {required: true, message: '请输入直播流地址', trigger: 'blur'},
            {max: 500, message: '最多输入500个汉字', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择课程形式', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {max: 20, message: '最多输入20个汉字', trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '请输入课程简介', trigger: 'blur'},
            {max: "1024", message: '最多输入1024个汉字', trigger: 'blur'}
          ],
          lessNum:[
            // {required: true, message: '请输入课程数量', trigger: 'blur'},
            {
              message:""
            }
          ],
          price:[
            {required: true, message: '请输入系列课售价', trigger: 'blur'},
            {max: "10", message: '最多输入10个数字', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false || parseInt(value) < 1) {
                  callback(new Error("请填写大于0的数字"));
                } else {
                  callback();
                }

              }, trigger: 'blur'
            }
          ]
        },
      }
    },
    mounted() {
      this.$store.state.loadingContent = false;
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      this.ruleForm.validity = new Date();
      this.modifyCourse();
      this.ruleForm.type='livebroadcast';
      if(this.$route.query.type){
        if(this.$route.query.type==='courseware'){
          this.select='course'
        }else{
          this.select='live'
        }
      }
    },
    methods: {
      //判断课程数量
      judgeNum(val){
        if(val!==""){
        let val_=Number(val);
        if((val_.toString()).length===(val+"").length&&val_.toString()!="NaN"){
           if((val+"").indexOf(".")!==-1){
        this.message="课程数量必须是整数"
          this.judgeNumFlag=false
        } else if(val<=0){
            this.message="课程数量不能小于1节"
          this.judgeNumFlag=false
        }else if(val>=1000){
            this.message="课程数量不能大于1000节";
          this.judgeNumFlag=false
        } else{
          this.judgeNumFlag=true
            this.message="";
        }
        }else{
           this.message="必须为纯数字";
          this.judgeNumFlag=false
        }
        }else{
          this.message="课程数量不能为空"
          this.judgeNumFlag=false;
        }
      },
      toLive(){
        if(this.select==='course'){
          this.ruleForm.type='courseware';
          this.isActive = true
        }else{
          this.ruleForm.type='livebroadcast';
          this.isActive = false
        }
      },
      toCourse(){
        if(this.select==='live'){
      this.ruleForm.type='livebroadcast';
      this.isActive = false
        }else{
      this.ruleForm.type='courseware';
      this.isActive = true
        }
      },
      //上传完之后移除上传方式
      removeUpload(){
       this.$refs.upload.$el.childNodes[1].style.display="none"
      },

      //判断收费类型
      chargeTypeFun(){
        if(this.ruleForm.chargeType == '免费'){
            this.chargeTypeMsg = 'A'
        }else{
            this.chargeTypeMsg = 'B'
        }

      },

      modifyCourse(){
        if(this.$route.query.type){
             let _this=this;
             send.ajaxSend({
                url:courseSeries,
                thisVue:_this,

                data:{
                   courseSeriesId: _this.$route.query.courseSeriesId
                },
                success(data){
                  console.log(data)
                  if(data.courseseries.type==="livebroadcast"){
                    _this.ruleForm.type='livebroadcast';
                    _this.isActive = false;
                    _this.ruleForm.address=data.courseseries.url;
                  }else{
                    _this.ruleForm.type='courseware'
                    _this.isActive = true;
                  }

                  if (data.courseseries.vipcode == 'A') {
                      _this.ruleForm.chargeType = '免费'
                  }else{
                      _this.ruleForm.chargeType = '黄金会员'
                  }
                  _this.ruleForm.name=data.courseseries.name;
                  _this.ruleForm.introduction=data.courseseries.introduction;
                  _this.ruleForm.price = data.courseseries.price;
                  _this.ruleForm.lessNum=data.courseseries.num;
                  _this.judgeNum(_this.ruleForm.lessNum);
                  _this.imgUrlStr=data.courseseries.coverurl;
                    var obj = {};
                    obj.name = '1';
                    obj.url = data.courseseries.coverurl;
                    _this.hasImgList.push(obj);
                    _this.imgList = _this.hasImgList;
                  if (_this.hasImgList.length > 0) {
                    _this.$refs.upload.$el.childNodes[1].style.display = "none"
                  }
                }
            })
        }
      },
      getLiveAddress(){
        let _this=this;
        send.ajaxService({
          url:vcloudcreateChannelAction,
          thisVue:_this,
          data:{
            command:"vcloud.createChannelAction",
            name: Math.random()+'',
            type:0
          },
          success(data){
            _this.ruleForm.address=data.data.rtmppullurl;
          }
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传图片只能是.jpg .png格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      exceed(file, fileList) {
        if (fileList.length >= 1) {
          this.$message({
            message: '可上传1张缩略图',
            type: 'warning'
          });
        }
      },
      handleRemove(file, fileList) {
        this.$refs.upload.$el.childNodes[1].style.display="block"
      },
      handlePictureCardPreview(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      },
      handleChange(file, fileList) {
        this.imgLength = fileList.length;
        this.imgList = fileList;
      },
      change: function () {
        this.ruleForm.openReward = !this.ruleForm.openReward;
      },
      toSingle(data,num) {
        if(this.$route.query.info){
           this.$router.push({
          name: 'lessonList',
          query: {
            courseSeriesId: data,
            num:num,
            type:this.ruleForm.type,
          }
        });
        }else{
           this.$router.push({
          name: 'lessonList',
          query: {
            courseSeriesId: data,
            num:num,
          preName:'newLesson',
            type:this.ruleForm.type,
          }
        });
        }

      },

      submitForm(formName) {
         this.chargeTypeFun()
        if(this.judgeNumFlag){
          let _this = this;
          let message = {};
          for (let i = 0; i < _this.imgList.length; i++) {
            let str = '';
            if(_this.imgList[i].response){
              str = _this.imgList[i].response.data[0].url;
            }
            if (str) {
            /*  str = str.split('src="')[1];
              str = str.split('" />')[0];*/
              if (_this.imgUrlStr) {
                _this.imgUrlStr += ',' + str;
              } else {
                _this.imgUrlStr += str;
              }
            }
          }
         let ruleFormName = encodeURIComponent(encodeURIComponent(_this.ruleForm.name));
         let ruleFormIntroduction = encodeURIComponent(encodeURIComponent(_this.ruleForm.introduction));
          message.sessionId = _this.sessionId;
          message.lecturerId = _this.user.user_id;
          message.url = _this.ruleForm.address;
          message.type = _this.ruleForm.type;
          message.price = _this.ruleForm.price;
          /*var regex=/(jpg|png)/g;
          var result=_this.imgUrlStr.match(regex);*/
          var result = _this.imgUrlStr;
          if(result==null){
            }else{
              if(result.length==1){
                 message.coverUrl = _this.imgUrlStr;
              }
              else{
                let arr=_this.imgUrlStr.split(",");
                message.coverUrl=arr[arr.length-1];
              }
            }

          message.name = ruleFormName;
          message.introduction = ruleFormIntroduction;
          message.num = _this.ruleForm.lessNum;
          message.vipCode = _this.chargeTypeMsg;
          _this.$refs[formName].validate((valid) => {
            if (valid) {
              if (!_this.imgUrlStr) {
                _this.$message.error('请上传课程封面缩略图');
                return false;
              } else {
                _this.fullscreenLoading = true;
                    if (_this.$route.query.courseSeriesId){
                      message.courseSeriesId=parseInt(_this.$route.query.courseSeriesId);
                      send.ajaxSend({
                        url: modifyCourse,
                        thisVue:_this,
                        data:message,
                        success(data){
                          onClose: _this.toSingle(data.courseseriesid,_this.ruleForm.lessNum),
                          _this.fullscreenLoading = false;
                        }
                      })
                    }else{
                  send.ajaxSend({
                  url: addLessonAPI,
                  thisVue: _this,
                  data: message,
                  success: function (data) {
                     _this.toSingle(data.courseseriesid,_this.ruleForm.lessNum),
                     _this.fullscreenLoading = false;
                  }
                });
                    }
              }
            }
          });
        }
      },
    },
  }
</script>
<style scoped lang="less">
  @import '../../assets/style/public.less';
  .el-textarea {
    width: 50%;
    overflow-y: visible !important;
    height: auto !important;
  }
 /* .radio-st {
    width: 16px;
    height: 16px;
    border: 1px solid @color-less-zb;
    background-color: @color-less-zb;
  }*/

  /*.select-time {
    width: 110px;
    height: 30px;
    line-height: 30px;
    background-color: @com-input-bg;
    border: 1px solid @com-solidS1-bg;
    color: @color-font;
    padding-left: 6px;
    margin-left: 10px;

    .el-select-dropdown {
      position: absolute;
      z-index: 1001;
      background-color: @color-tab-activ !important;
      border: 1px solid #e4e7ed;
      border-radius: 2px;
      background-color: #fff;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 5px 0;
    }
  }*/
</style>
<style lang="less">
  @import '../../assets/style/public.less';
  .newLesson{
    .touzi-main{
      display:block;
      .tap-link{
        margin: 0 10px;
        vertical-align: top;
      }
    }
    .message{
      position: absolute;
      width:260px;
      height:12px;
      color:@com-sizeS2-color;
      margin-left:10px;
    }
      .el-textarea__inner{
  resize:none !important;
}
  .new-lesson {
    padding: 30px 40px;
    .el-form {
      color: @com-h2S1-font;
      text-align: left;
      .el-form-item{
        .kj{
          background:url("../../assets/img/kj.png") no-repeat 23%;
        }
        .zb{
          background:url("../../assets/img/zb.png") no-repeat 23%;
        }
      }
      .img-pro {
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
      }
      .icon-kc_icon_tjx {
        color: @com-h4s4-font;
      }

      .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
      }
      .reward-cl {
        display: inline-block;
        vertical-align: top;
      }
      .shot-input {
        width: 15%;
        min-width: 100px;
        input {
          text-align: center;
        }
      }
      .tipsStyle{
        font-size:12px;
        color:@com-sizeS2-color;
        margin-left: 122px;
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
        background-color:  @com-input-bg !important;
        border-radius: 2px;
        color: @com-input-color-sr;
        height: 30px;
        line-height: 30px;
      }

      .liveAddress{
        width: 418px !important;
      }

      .inputNumber{
        position: relative;
         .el-input__inner{
          width:130px;
          border-radius:0px;
        }
      }

      .el-textarea__inner {
        padding: 0 15px;
        width: 500px;
        height: 80px
      }
      .el-checkbox__inner {
        border: 1px solid @com-radio-select;
        background-color: transparent;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: @com-h2S1-font;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: @com-radio-select;
        border-color: @com-radio-select;
      }
      .alignBtn{
        display: flex;
        align-items: flex-end;
      }
      .el-button{

       width:110px;
      line-height:30px;
      border-radius:3px;
      background:rgba(40,44,53,1);
      height: 30px;
      padding: 0px;
      font-size:12px;
      }
      .el-button:hover{
        color:#606266;
      }
      .el-button:focus{
      border:1px solid @com-buttonIcoInfo-A-color;

      }
      .el-button.active{
      color:@com-buttonIcoInfo-A-color;
      // background:rgba(231,194,127,1);
      border:1px solid @com-buttonIcoInfo-A-color;
      outline:none;
      font-size:12px;
      }
      .zb.active{
        background:url("../../assets/img/zb1.png") no-repeat 23%;
      }
      .kj.active{
        background:url("../../assets/img/kj1.png") no-repeat 23%;
      }
      .activeStyle{
        width: 70px;
        margin-left: 11px;
      }
      .courseIpnut{
        width:500px;
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
        border: 1px solid @com-input-border;
        width: 200px;
        height: 136px;
        border-radius: 0px;
        .icon-text {
          padding-bottom: 5px;
          border-bottom: 1px solid @com-h4s4-font;
          font-size:12px;
          color:@com-h4s4-font;
        }
        i {
          display: none;
          color: @com-h4s4-font;
          font-size: 50px;
        }
      }
      ::-webkit-input-placeholder {
        color:  @com-input-color !important;
      }
    }

    .el-form-item.is-required .el-form-item__label:before {
      content: none;
    }
    .el-input__icon, .el-icon-date {
      display: none;
    }

    .choose {
      display: inline-block;
      vertical-align: top;
      position: relative;
      margin-right: 30px;
      .radio {
        position: relative;
        display: inline-block;
        font-weight: 400;
        color: @com-radio-default;
        padding-left: 25px;
        cursor: pointer;
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
          border: 1px solid @com-radio-select;
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
          background-color: @com-radio-select;
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
  }

</style>

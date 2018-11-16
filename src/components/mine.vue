<template>
  <div class="mine">
    <div class="mine-header">
      <div class="mine-header-mine" style="width: 70%;">
        <img :src="user.head" @click="dialogVisible = true;">
        <div class="mine-header-title">
          {{user.nickname || user.name}}
          <span class="mine-header-title-span" v-if="user.cert">
            执证编号：{{user.cert}}
          </span>
        </div>
        <div class="mine-header-content" style="-webkit-box-orient: vertical;">
          {{user.introduce || '还未填写个人简介，点击头像完善资料~'}}
        </div>
      </div>
      <!-- <div class="mine-header-follower">
         <p>关注</p>
         <p>{{attentionSize}}</p>
       </div>
       <div class="mine-header-Grade">
         评级
         <br>
         <div class="star-block">
           <img :src="img[0]" v-for="n in 4"/>
           <img :src="img[1]" v-for="n in 5-4"/>
           &lt;!&ndash;<i class="el-icon-star-off"></i>&ndash;&gt;
         </div>
       </div>-->
    </div>
    <div class="mine-menu">
      <!--<el-badge class="mine-menu-block">
        <div @click="newWindow('/index/touziMain')">
          <div class="">
            <img :src="img[2]"/>
            <div class="mine-menu-name">量化模型</div>
            <span class="mine-menu-span">共2个投资组合</span>
          </div>
        </div>
      </el-badge>-->

      <el-badge class="mine-menu-block">


        <div @click="newWindow('imformation')">
          <div class="">
            <img :src="img[3]"/>
            <div class="mine-menu-name">市场观点</div>
            <span class="mine-menu-span">共{{informationNum}}条市场观点</span>
          </div>
        </div>
      </el-badge>

      <el-badge class="mine-menu-block">


        <div @click="newWindow('liveList')">
          <div class="">
            <img :src="img[4]"/>
            <div class="mine-menu-name">直播</div>
            <span class="mine-menu-span">共{{live}}场直播</span>
          </div>
        </div>
      </el-badge>

      <!--<el-badge class="mine-menu-block">

        <div @click="newWindow('consultation')">
          <div class="">
            <img :src="img[5]"/>
            <div class="mine-menu-name">咨询</div>
            <span class="mine-menu-span">排班时间：17:00～18:00</span>
          </div>
        </div>
      </el-badge>-->
      <el-badge class="mine-menu-block">


        <div @click="newWindow('lessonList')">
          <div class="">
            <img :src="img[6]"/>
            <div class="mine-menu-name">课程</div>
            <span class="mine-menu-span">共{{count}}门系列课</span>
          </div>
        </div>
      </el-badge>

      <!-- <el-badge class="mine-menu-block">


         <div @click="newWindow('message')">
           <div class="">
             <img :src="img[7]"/>
             <div class="mine-menu-name">自选股</div>
             <span class="mine-menu-span">12支自选股</span>
           </div>
         </div>
       </el-badge>-->
      <!-- </div> -->
    </div>

    <el-dialog
      title="修改个人信息"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="382px"
      class="single"
      slot="">
      <div class="singleNext">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="头像" prop="imgIcon" class="icon-img">
            <div class="icon-bg">
              <img :src="user.head">
              <span class="bg-mb"></span>
              <i class="iconfont icon-xiangji"></i>

              <el-upload accept="image/jpeg,image/jpg,image/png,image/bmp" class="up-load"
                         :action="importFileUrl"
                         list-type="picture-card"
                         :on-exceed="exceed"
                         :limit="1"
                         :on-change="handleChange"
                         :on-success="removeUpload"
                         :on-preview="handlePictureCardPreview"
                         :before-upload="beforeAvatarUpload"
                         :on-remove="handleRemove"
                         :auto-upload="false"
                         ref="upload">
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input placeholder="请输入昵称" v-model="ruleForm.nickName" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="执证编号" prop="cardNum">
            <el-input placeholder="请输入执证编号" v-model="ruleForm.cardNum" maxlength="14"></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="introduction">
            <el-input type="textarea" v-model="ruleForm.introduction" placeholder="请输入个人简介" maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">

                    <el-button @click="cancel" class="cancel">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')" class="sure">保存</el-button>
                </span>

      <div class="content-cro" v-if="isCropper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
        ></vueCropper>
        <el-button @click="finish2('base64')">确定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import send from "../assets/js/ajaxSend";
  import {courseCount, getMyImformationListAPI, imgUrlAPI, setUserInfoAPI, getUserInforAPI} from "../assets/apiRegular";
  import axios from 'axios';
  import VueCropper from 'vue-cropper';

  export default {
    name: "myContent",
    data() {
      return {
        option: {
          img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 150,
          autoCropHeight: 150,
          // 开启宽度和高度比例
          fixed: true,//是否开启截图框宽高固定比例
          fixedNumber: [4, 4]//截图框的宽高比例
        },
        isCropper: false,
        importFileUrl: imgUrlAPI,
        imgLength: 0,
        imgList: [],
        ruleForm: {
          cardNum: '',
          nickName: '',
          introduction: '',
        },
        rules: {
          cardNum: [
            // {required: true, message: '请输入执证编号', trigger: 'blur'},
          ],
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
          ],
          introduction: [
            // {required: true, message: '请输入个人简介', trigger: 'blur'},
          ],
        },
        dialogVisible: false,
        sessionId: '',
        user: {},
        menu: [],
        count: '',
        live: '',
        attentionSize: '',
        informationNum: '',
        img: ["./static/icon/pic_star2@2x.png", "./static/icon/pic_star1@2x.png", "./static/icon/img_cl@2x.png", "./static/icon/img_gd@2x.png", "./static/icon/img_zb@2x.png", "./static/icon/img_zx@2x.png", "./static/icon/img_zx1@2x.png", "./static/icon/img_zxg@2x.png"]
      }
    },
    beforeCreate: function () {
      this.$store.state.nowContent = 'mine'
    },
    mounted: function () {
      // this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      this.sessionId = JSON.parse(localStorage.getItem("logininfo")).session_id;

      if (this.user.nickname || this.user.name) {
        this.ruleForm.nickName = this.user.nickname ? this.user.nickname : this.user.name;
      }
      if (this.user.cert) {
        this.ruleForm.cardNum = this.user.cert;
      }
      if (this.user.introduce) {
        this.ruleForm.introduction = this.user.introduce;
      }
      this.getInformation();
      this.getCourseNum('course');
      this.getCourseNum('live');
      this.$store.state.loadingContent = false;
      this.menu = this.$store.state.mineMenu
    },
    components: {
      VueCropper,
    },
    methods: {
      cancel() {
        if (!this.isCropper) {
          this.dialogVisible = false;
          this.$refs.upload.handleRemove();
          this.imgLength = 0;
          this.imgList = [];
          if (this.user.nickname || this.user.name) {
            this.ruleForm.nickName = this.user.nickname ? this.user.nickname : this.user.name;
          } else {
            this.ruleForm.nickName = '';
          }
          if (this.user.cert) {
            this.ruleForm.cardNum = this.user.cert;
          }else{
            this.ruleForm.cardNum = '';
          }
          if (this.user.introduce) {
            this.ruleForm.introduction = this.user.introduce;
          }else{
            this.ruleForm.introduction = '';
          }
        }
      },
      submitForm(formName) {
        if (!this.isCropper) {
          let _this = this;
          let message = {};

          for (var i = 0; i < _this.imgList.length; i++) {
            let str = '';
            if(_this.imgList[i].data){
              str = _this.imgList[i].data.data[0].url;
            }
            if (str) {
            /*  str = str.split('src="')[1];
              str = str.split('" />')[0];*/
              _this.imgUrlStr = str;
            }
          }
          message.user_id = _this.user.user_id;
          message.user = {
            'head': _this.imgUrlStr,
            'nickname': encodeURIComponent(encodeURIComponent(_this.ruleForm.nickName)),
            'cert': encodeURIComponent(encodeURIComponent(_this.ruleForm.cardNum)),
            'introduce': encodeURIComponent(encodeURIComponent(_this.ruleForm.introduction)),
          }
          message.user = JSON.stringify(message.user);
          _this.$refs[formName].validate((valid) => {
            if (valid) {
              send.ajaxSend({
                url: setUserInfoAPI,
                data: message,
                thisVue: _this,
                success: function (data) {
                  _this.$refs.upload.handleRemove();
                  _this.imgLength = 0;
                  _this.imgList = [];
                  _this.getUserInfor();
                }
              })
            }
          })
        }
      },
      getUserInfor() {
        let _this = this;
        send.ajaxSend({
          url: getUserInforAPI,
          data: {'user_id': _this.user.user_id},
          success: function (data) {
            let logininfo = {};
            logininfo.session_id = _this.sessionId;
            logininfo.user = data.user;
            localStorage.setItem("logininfo", JSON.stringify(logininfo));
            localStorage.setItem('customerUser', JSON.stringify(logininfo.user));
            _this.user = data.user;
            _this.dialogVisible = false;
            // localStorage.setItem(logininfo.user, JSON.parse(message.user));
          }
        })
      },
      convertBase64UrlToBlob(urlData) {
        let bytes = window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        let ab = new ArrayBuffer(bytes.length);
        let ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {type: 'image/jpeg'});
      },
      finish2(type) {
        let _this = this;
        _this.$refs.cropper.getCropData((data) => {
          _this.isCropper = false;
          _this.imgList[_this.imgLength - 1].url = data;
          // let file = _this.convertBase64UrlToBlob(data)
          let file = data
         // file.name = _this.imgList[_this.imgLength - 1].name;
          let formData = new FormData();
          formData.append('file', file);
          formData.append('token',_this.sessionId)
          // formData.append('media_type','picture')
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
          axios.post(_this.importFileUrl, formData, config).then(res => {
            _this.imgList[_this.imgLength - 1].data = res.data;
          })

          /* this.$refs.upload.submit();*/
        })
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
      handleChange(file, fileList) {
        this.imgLength = fileList.length;
        this.imgList = fileList;
        this.option.img = file.url
        var img = this.option.img
        var base = img.indexOf('base64');
        if (base == -1) {
          this.isCropper = true;
        }
      },
      //上传完之后移除上传方式
      removeUpload() {
        this.$refs.upload.$el.childNodes[1].style.display = "none"
      },
      handlePictureCardPreview(file) {
      },
      handleRemove(file, fileList) {
        this.$refs.upload.$el.childNodes[1].style.display = "inline-block"
      },
      beforeAvatarUpload(file) {
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
      getInformation() {
        let _this = this;
        send.ajaxSend({
          url: getMyImformationListAPI,
          thisVue: _this,
          data: {
            "publisher_id": _this.user.user_id,
          },
          success: function (data) {
            _this.informationNum = data.page.totalcount;
          }
        })
      },
      getCourseNum(type) {
        let _this = this;
        send.ajaxSend({
          url: courseCount,
          thisVue: _this,
          data: {
            lecturerId: _this.user.user_id,
            objectType: type
          },
          success(data) {
            if (type == 'course') {
              _this.count = data.count
            } else {
              _this.live = data.count
            }

          }
        })
      },
      newWindow: function (url) {
        this.$router.push({
          name: url
        })


        if (url == "consultation") {
          let _this = this;
          let routeData = this.$router.resolve({
            name: 'consultation',
          });
          if (this.$store.state.isUni) {//是否在壳环境
            let ret = sendMessageTo(_this.$store.state.consultationId, 'consultation', '"login.html"+routeData.href')
            let resultCode = ret.resultCode;
            if (resultCode === -1) {
              console.log('创建窗口失败，', ret.resultStr);
              createSpecialWindow({
                url: "login.html" + routeData.href,
                id: 'Index',
              }, function (id) {
                _this.$store.state.consultationId = id;
              });
            } else {
              console.log('更新成功');
            }
          } else {
            window.open(routeData.href, '_blank');
            /* this.$router.push({
               name:url
             })*/
          }
        } else if (url == "broadcast") {
          let _this = this;
          let routeData = this.$router.resolve({
            name: 'broadcast',
          });
          if (this.$store.state.isUni) {//是否在壳环境
            let ret = sendMessageTo(_this.$store.state.broadcastId, 'broadcast', '"login.html"+routeData.href')
            let resultCode = ret.resultCode;
            if (resultCode === -1) {
              console.log('创建窗口失败，', ret.resultStr);
              createSpecialWindow({
                url: "login.html" + routeData.href,
                id: 'Index',
              }, function (id) {
                _this.$store.state.broadcastId = id;
              });
            } else {
              console.log('更新成功');
            }
          } else {
            window.open(routeData.href, '_blank');
            /* this.$router.push({
               name:url
             })*/
          }
        } else {
          this.$router.push({
            name: url
          })
        }
        /*  this.$router.push({
            name:url
          })*/
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/style/public";

  .content-cro {
    position: fixed;
    top: 20%;
    width: 50%;
    height: 50%;
    z-index: 2;
    left: 30%;
    /deep/ .cropper-crop-box {
      .cropper-view-box {
        border-radius: 150px;
      }

    }
    .el-button {
      float: right;
      margin-top: 20px;
    }
  }

  /deep/ .el-dialog {

    background-color: @com-module-bg !important;
    .el-dialog__title {
      color: @com-h1S1-font;
      font-size: @font - 2;
    }
    .el-dialog__body {
      padding: 20px 20px 0;
    }
    .el-form {
      color: @com-h2S1-font;
      text-align: left;

      .icon-bg {
        width: 50px;
        height: 50px;
        text-align: center;
        top: -10px;
        position: absolute;
        cursor: pointer;
        img {
          height: 50px;
          width: 50px;
          border-radius: 25px;
          cursor: pointer;
          /*  -webkit-filter: grayscale(1); !* Webkit *!
           filter: gray; !* IE6-9 *!
           filter: grayscale(1); !* W3C *!
          */
        }
        .bg-mb {
          background: rgba(0, 0, 0, 0.5);
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 25px;
          top: 0;
          left: 0;
        }
        .icon-xiangji {
          position: absolute;
          top: 10px;
          left: 14px;
          color: #fff;
          font-size: @font + 8;
        }
        .up-load {
          position: absolute;
          top: 0px;
          width: 50px;
          height: 50px;
          border-radius: 25px;
          .el-upload-list__item {
            background-color: transparent;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            .el-upload-list__item-actions {
              .el-upload-list__item-preview {
                display: none !important;
              }
              .el-upload-list__item-delete {
                margin-left: 0px;
              }
              i {
                font-size: @font + 2;
              }
            }
          }
          .el-upload--picture-card {
            background-color: transparent;
            width: 50px;
            height: 50px;
            border-radius: 25px;
          }
        }
      }

      .icon-img {
        position: relative;
        .el-form-item__content {
          margin-bottom: 30px;
        }
      }

      .el-form-item {
        margin-bottom: 0px;
      }
      label {
        font-size: @font - 4;
      }
      .el-form-item__label {
        padding-right: 10px !important;
      }
      .el-input__inner, .el-textarea__inner {
        font-family: Arial;
        font-size: @font - 4;
        background-color: @com-input-bg;
        color: @com-input-color-sr;
        border-color: @com-input-border;
      }
      .el-textarea__inner {
        line-height: 20px !important;
        height: 80px !important;
      }
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
        margin-bottom: 22px;
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
      .el-textarea {
        height: 84px !important;
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
        /*height: auto !important;*/
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
    .el-dialog__footer {
      text-align: center;
    }
    .dialog-footer {
      text-align: center;
      .cancel {
        background: @com-button-C-bg;
        color: @com-button-C-font;
        border-color: @com-button-C-border;
        width: 90px;
        height: 30px;
        line-height: 30px;
        padding: 0px;
        margin-left: 22px;
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

  .mine {
    padding: 20px;
    text-align: center;
    color: @com-h1S1-font;
    .mine-header {
      display: flex;
      text-align: left;
      height: 100px;
      overflow: hidden;
      margin: 16px 0px 26px 0px;
      .mine-header-mine {
        margin: 5px;
      }
      img {
        float: left;
        height: 80px;
        width: 80px;
        border-radius: 100px;
        margin-right: 15px;
        cursor: pointer;
        /*  -webkit-filter: grayscale(1); !* Webkit *!
         filter: gray; !* IE6-9 *!
         filter: grayscale(1); !* W3C *!
        */
      }
      .mine-header-title {
        font-size: @font;
        /* margin-top:20px;*/
        /*margin-bottom: 10px;*/
        .mine-header-title-span {
          font-size: @font - 4;
          color: @com-h4s4-font;
          display: inline-block;
          margin-left: 10px;
        }
      }
      .mine-header-content {
        color: @com-h3-font;
        font-size: @font - 4;
        line-height: 20px;
        margin-top: 5px;
        padding-right: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .mine-header-follower {
        padding: 30px;
        border-left: 1px solid @com-solidS2-bg;
        border-right: 1px solid @com-solidS2-bg;
        width: 250px;
        min-width: 200px;
        font-size: 14px;
      }
      .mine-header-Grade {
        padding: 30px;
        font-size: 14px;
        width: 250px;
        img {
          width: 20px;
          display: inline-block;
          margin-top: 15px;
          float: left;
          height: 20px;
        }
        .star-block {
          min-width: 175px;
        }
        .star-block:after {
          content: '';
          display: block;
          clear: both;
        }
      }
    }
    .mine-menu {
      .el-badge {
        float: left;
        margin: 8px;
        width: 195px;
        height: 207px;
        padding: 20px;
        position: relative;
        border-radius: 10px;
        background: @com-module-bg;
        transition: all 0.5s;
        .mine-menu-name {
          padding: 20px;
        }
        .mine-menu-span {
          color: @com-h4s4-font;
          font-size: 14px;
        }
      }
      .mine-menu-block {
        // display: flex;
        // justify-content: space-around;

        img {
          width: 80px;
          display: block;
          margin: auto;
          margin-top: 20px;
          height: 80px;
          transition: all 0.6s
        }
        &:hover {
          box-shadow: 0 0 10px @com-h1S2-font;
          cursor: pointer;
          transform: scale(1.01)
        }
      }
      &:after {
        content: "";
        display: block;
        clear: both;
      }
    }
    /* .mine-menu:after{
       content: "";
       display: block;
       clear: both;
     }*/
  }
</style>

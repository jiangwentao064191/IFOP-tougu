<template>
  <div class="view-point clearfix" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form v-show="tabIndex == 1" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px"
             class="demo-ruleForm clearfix">
      <div class="left">
        <div class="left-padding">
          <el-form-item label="标题" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="有效期设置" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="一直有效"></el-radio>
              <!-- <el-radio label="设置有效期"></el-radio> -->
              <!-- <el-date-picker :class="{'color-w':ruleForm.resource=='设置有效期','set-vali':ruleForm.resource=='一直有效'}"
                              v-model="ruleForm.validity"
                              type="date"
                              :picker-options="pickerOptions0"
                              placeholder="选择日期">
              </el-date-picker> -->
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item label="用户类型" prop="userType">
             <el-radio-group v-model="ruleForm.userType">
               <el-radio label="普通用户" value="user"></el-radio>
               <el-radio label="投顾用户" value="borker"></el-radio>
             </el-radio-group>
           </el-form-item>-->
          <el-form-item label="是否开启投顾评论" prop="blockComment">
            <el-radio-group v-model="ruleForm.blockComment">
              <el-radio label="开启"></el-radio>
              <el-radio label="不开启"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否开启用户评论" prop="comment">
            <el-radio-group v-model="ruleForm.comment">
              <el-radio label="开启"></el-radio>
              <el-radio label="不开启"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!--<el-form-item label="资讯类型">
            <select class="select-time" v-model="ruleForm.releasetype">
              <option v-for="(date,i) in inforList"
                      :label="date.name"
                      :value="date.code"
                      :key="i">
                {{date.name}}
              </option>
            </select>
          </el-form-item>-->
          <!-- <el-form-item label="投顾评论专栏" prop="commentCol">
             <el-radio-group v-model="ruleForm.commentCol">
               <el-radio label="开通"></el-radio>
               <el-radio label="不开通"></el-radio>
             </el-radio-group>
           </el-form-item>-->
          <!-- <el-form-item label="紧密相关标签" prop="closeLabel">
             <el-input v-model="ruleForm.closeLabel" placeholder="多个关键词请用“，”隔开，例：格力电器，大事件，持仓变动"></el-input>
           </el-form-item>
           <el-form-item label="较相关标签" prop="moreLabel">
             <el-input v-model="ruleForm.moreLabel" placeholder="多个关键词请用“，”隔开，例：格力电器，大事件，持仓变动"></el-input>
           </el-form-item>-->
          <!--<el-form-item label="是否置顶" prop="setTop">
            <el-radio-group v-model="ruleForm.setTop">
              <el-radio label="不置顶"></el-radio>
              <el-radio label="置顶"></el-radio>
              <el-date-picker :class="{'color-w':ruleForm.setTop=='置顶','set-vali':ruleForm.setTop=='不置顶'}"
                              v-model="ruleForm.region"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="发布时间" prop="releaseTime">
            <el-radio-group v-model="ruleForm.releaseTime">
              <el-radio label="立即发布"></el-radio>
              <!-- <el-radio label="指定发布时间"></el-radio> -->
              <!-- <el-date-picker
                :class="{'color-w':ruleForm.releaseTime=='指定发布时间','set-vali':ruleForm.releaseTime=='立即发布'}"
                v-model="ruleForm.selectTime"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="pickerOptions0"
                style="width: 160px;height: 30px;line-height: 30px;">
              </el-date-picker> -->
            </el-radio-group>
          </el-form-item>

          <el-form-item label="资讯收费类型" prop="chargeType">
            <el-radio-group v-model="ruleForm.chargeType">
              <el-radio label="免费"></el-radio>
              <el-radio label="黄金会员"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="选择媒体类型" prop="vpType">
            <el-radio-group v-model="ruleForm.vpType">
              <el-radio label="图片"></el-radio>
              <el-radio label="视频"></el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="图片" v-if="upType == 1" style="margin-bottom:10px;">
            <el-upload ref="upload"
                       accept="image/jpeg,image/jpg,image/png,image/bmp"
                       :action="importFileUrl"
                       list-type="picture-card"
                       :on-exceed="exceed"
                       :file-list="hasImgList"
                       :auto-upload="false"
                       :limit="3"
                       :on-change="handleChange"
                       :on-preview="handlePictureCardPreview"
                       :before-upload="beforeAvatarUpload"
                       :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="ruleForm.dialogVisible">
              <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
            </el-dialog>
            <p class="img-pro">可上传1或3张图片</p>
          </el-form-item>

          <el-form-item label="视频" v-if="upType == 2" style="margin-bottom:10px;">
            <el-upload ref="uploadVideo"
                       accept="video/flv,video/rmvb,video/mp4,video/mp3,video/avi,video/wmv"
                       :action="importFileUrl"
                       :data="upLoadData"
                       list-type="picture-card"
                       :on-exceed="exceedV"
                       :file-list="hasImgList"
                       :limit="1"
                       :on-change="handleChangeV"
                       :on-success="successUpload"
                       :on-preview="handlePictureCardPreviewV"
                       :before-upload="beforeAvatarUploadV"
                       :on-remove="handleRemoveV">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="video-cover" v-if="videoPic">
              <img :src="videoPic">
              <span></span>
              <img class="bg-pic" src="../../assets/img/play.png"/>
            </div>
            <el-dialog :visible.sync="ruleForm.dialogVisible">
              <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
            </el-dialog>
            <p class="img-pro">可上传1个视频</p>
          </el-form-item>

          <!-- <el-form-item label="全部推送" prop="allPush">
             <el-input v-model="ruleForm.allPush"></el-input>
           </el-form-item>-->
          <!--<el-form-item label="发送到" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="追涨敢死队" name="type"></el-checkbox>
              <el-checkbox label="价值投资" name="type"></el-checkbox>
              <el-checkbox label="旭日东升" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>-->
          <!-- <el-form-item>
             <el-button type="primary" @click="submitForm('ruleForm')">提交发布</el-button>
           </el-form-item>-->
          <div class="cropper-bg" v-if="isCropper">
          <div class="content-cro">
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
        </div>
        </div>
      </div>
      <div class="right">
        <el-button class="comit-btn" type="primary" @click="submitForm('ruleForm')">提交发布</el-button>
        <editor class="editor" :value="ruleForm.content" :setting="editorSetting"
                @editorInput="editorContent" style="margin-top: 80px;"></editor>
      </div>
    </el-form>
    <!--pc预览-->
    <div class="pc-view clearfix" v-show="tabIndex == 2">
      <div class="pc-left left">
        <!--<p class="left-title">{{ruleForm.name}}</p>
        <div class="img-list clearfix">
          <img :src="url.url" v-for="url in imgList">
        </div>-->
        <div class="content-list">
          <div class="content-group no-img clearfix" v-if="imgList.length == 0">
            <!--<img class="header-main-img" src="/assets/img/logo.png">-->
            <div class="header-main-right">
              <p class="header-main-title">{{ruleForm.name}}</p>
              <div class="header-main-content more-text">{{pcconStr}}</div>
              <!--<div class="header-main-content more-text">
                {{ruleForm.content}}
              </div>-->
              <div class="header-main-footer clearfix">
                <img class="footer-icon" :src="user.head">
                <span class="footer-span">{{user.nickname || user.name}}</span>
                <span class="footer-hour">0小时</span>
              </div>
            </div>
          </div>

          <div class="content-group clearfix" v-if="imgList.length == 1">

            <div class="header-main-img" v-if="ruleForm.vpType == '视频'"
                 :style="{ background : 'url(' + imgList[0] + ')'}">
              <div class="play">
                <img class="cover-pic" :src="videoPic">
                <span></span>
                <img src="../../assets/img/play.png"/>
                <span class="duration">
                  <i class="iconfont icon-bofang"></i>
                  <span>{{videoTime}}</span>
                </span>
              </div>
              <!-- <div class="video-cover" v-if="videoPic">
                 <img :src="videoPic">
                 <span></span>
                 <img class="bg-pic" src="../../assets/img/play.png"/>
               </div>-->
            </div>

            <img class="header-main-img" :src="url.url" v-if="ruleForm.vpType == '图片'" v-for="url in imgList">
            <div class="header-main-right">
              <p class="header-main-title">{{ruleForm.name}}</p>
              <div class="header-main-content more-text">
                {{pcconStr}}
              </div>
              <div class="header-main-footer clearfix">
                <img class="footer-icon" :src="user.head">
                <span class="footer-span">{{user.nickname || user.name}}</span>
                <span class="footer-hour">0小时</span>
              </div>
            </div>
          </div>

          <div class="content-group" v-if="imgList.length > 1">
            <p class="header-main-title">{{ruleForm.name}}</p>
            <div class="clearfix img-list">
              <img class="header-main-img" :src="url.url" v-for="url in imgList">
            </div>
            <div class="header-main-footer more-img clearfix">
              <img class="footer-icon" :src="user.head">
              <span class="footer-span">{{user.nickname || user.name}}</span>
              <span class="footer-hour">0小时</span>
            </div>
          </div>
          <div class="group-footer">
            <!--<div class="text-title">已投放<span class="text-num">0</span></div>-->

            <div class="text-title">浏览量<span class="text-num">0</span></div>

            <div class="text-title">点赞<span class="text-num">0</span></div>

            <div class="text-title">评论量 <span class="text-num">0</span></div>

          </div>
        </div>

      </div>
      <div class="pc-right right">
        <div class="right-padding">
          <player :video-url="videos" :is-play="playing" v-if="videos" class="video-sty"></player>
          <!--<div class="video-cover" v-if="videoPic">
            <img :src="videoPic">
            <span></span>
            <img class="bg-pic" src="../../assets/img/play.png"/>
          </div>-->
          <div class="details-title clearfix">
            <h2 class="text-name">{{ruleForm.name}}</h2>
            <div class="text-pro" v-if="ruleForm.name">
              <img class="footer-icon" :src="user.head">
              <span class="footer-span">{{user.nickname || user.name}}</span>
              <span class="footer-span footer-hour">{{dateTime}}</span>
              <!-- <div class="details-share">
                 <i class="iconfont icon-kcxq_icon_share"></i>
                 <span>分享</span>
               </div>-->
            </div>
            <!--<span class="text-data">{{dateTime}}</span>-->
          </div>
          <div style="padding-top: 20px;" v-html="ruleForm.content"></div>
          <span class="content-footer" v-for="data in tag">{{data.tag_name}}</span>
        </div>
      </div>
    </div>
    <!--手机预览-->
    <!-- <div class="phone-view clearfix" v-show="tabIndex == 3">

       <div class="phone-bg">
         <div class="pho">
           <h2 class="left-title">{{ruleForm.name}}</h2>
           <div class="img-list clearfix">
             <img :src="url.url" v-for="url in imgList">
           </div>
           <p class="text-pro" v-if="ruleForm.name">
             <span class="text-data">{{dateTime}}</span>
           </p>
           <div class="phone-cont">
             <div class="cont" v-html="ruleForm.content"></div>
           </div>
         </div>
       </div>
     </div>-->
  </div>

</template>

<script>
  import {
    releaseAPI,
    resetEditorInforAPI,
    getImformationTypeListAPI,
    _ymdsfFilter,
    _UymdsfFilter,
    ymdfilter,
    Uymdfilter,
    geiImformationTagAPI,
    getImformationDetailAPI,
    apiUrl,
    imgUrlAPI
  } from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'
  import editor from '../system/editor'
  import VueCropper from 'vue-cropper'
  import axios from 'axios'
  import player from '../system/player'

  export default {
    name: "viewpoint",
    props: ['tabIndex', 'dateTime', 'fromDate', 'videos'],

    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        fullscreenLoading: false,
        playing: true,
        upLoadData: {'token':JSON.parse(localStorage.getItem('logininfo')).session_id},
        videoTime: '',
        videoPic: '',
        videoUrlAPI: apiUrl + '/ifop/Upload',
        importFileUrl: imgUrlAPI,
        upType: 1,
        isCropper: false,
        option: {
          img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 300,
          autoCropHeight: 250,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [4, 3]
        },

        //tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
        editorSetting: {
          height: 400,
          language_url: './static/zh_CN.js',
          language: 'zh_CN',
          skin_url: './static/skins/lightgray',
          plugins: 'paste,image',
          paste_auto_cleanup_on_paste: true,
          paste_remove_styles: true,
          paste_remove_styles_if_webkit: true,
          paste_strip_class_attributes: true,
        },
        hasImgList: [],
        tag: [],
        imgLength: 0,
        imgList: [],
        imgUrlStr: '',
        chargeTypeMsg: '',
        ruleForm: {
          vpType: '图片',
          chargeType: '免费',
          content: '',
          name: '',
          region: '',
          type: ['追涨敢死队'],
          resource: '一直有效',
          userType: '普通用户',
          blockComment: '开启',
          comment: '开启',
          commentCol: '开通',
          setTop: '不置顶',
          releaseTime: '立即发布',
          closeLabel: '',
          moreLabel: '',
          allPush: '',
          desc: '',
          validity: '',
          selectTime: '',
          dialogImageUrl: '',
          dialogVisible: false,
          releasetype: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择置顶时间', trigger: 'change'}
          ],
          /*closeLabel: [
            {required: true, message: '请输入标签', trigger: 'blur'},
          ],
          moreLabel: [
            {required: true, message: '请输入标签', trigger: 'blur'},
          ],*/
          allPush: [
            {required: true, message: '请输入全部推送', trigger: 'blur'},
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择是否设置有效期', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        },
        allTime: 1,
        time: '',
        user: '',
        session: '',
        brokerteamList: [],
        inforList: [],
        pcContent: '',
        pcconStr: '',
      };
    },

    components: {
      'editor': editor,
      VueCropper,
      player
    }
    ,
    beforeCreate: function () {
      this.$store.state.loadingContent = false;
      this.$store.state.nowContent = 'mine';
    },
    created: function () {
      let _this = this;
      _this.ruleForm.validity = _this.getTime();
      _this.ruleForm.selectTime = _this.getTime();
      _this.ruleForm.region = _this.getTime();

    },
    mounted: function () {
      let _this = this;
      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.session = JSON.parse(localStorage.getItem('logininfo')).session_id;
      //资讯类型
      send.ajaxSend({
        url: getImformationTypeListAPI,
        data: {'enabled': true},
        success: function (data) {
          _this.inforList = data.infotypes;
          // _this.ruleForm.releasetype = 'viewpoint';
          if (!_this.ruleForm.releasetype) {
            _this.ruleForm.releasetype = 'info';
          }

        }
      });
      //发送到
      send.ajaxSend({
        url: 'broker.queryBrokerTeam',
        data: {'member_user_id': this.user.user_id},
        success: function (data) {
          this.brokerteamList = data.datalist;
        }
      });
    },
    watch: {
      'fromDate': function (value) {
        let _this = this;
        /*  message.customer_group_ids = '1864' */
        _this.getTag(value);
        _this.getContent(value.info_id);
        if (value.title) {
          _this.ruleForm.name = value.title;
        }

        if (value.info_type) {
          _this.ruleForm.releasetype = value.info_type;
        }
        if (value.immediately_flag != 'Y') {
          _this.ruleForm.releaseTime = '指定发布时间';
          _this.ruleForm.selectTime = new Date(value.publish_time);

        } else {
          _this.ruleForm.releaseTime = '立即发布';
        }

        if (value.comment_user_flag == 'Y') {
          _this.ruleForm.comment = "开启"
        } else {
          _this.ruleForm.comment = "不开启"
        }
        if (value.comment_flag == 'Y') {
          _this.ruleForm.blockComment = "开启"
        } else {
          _this.ruleForm.blockComment = "不开启"
        }

        if (value.charge_type == 'A') {
          _this.ruleForm.chargeType = '免费'
        } else {
          _this.ruleForm.chargeType = '黄金会员'
        }

        /* if (value.top_flag != "N") {
           _this.ruleForm.setTop = '置顶';
           _this.ruleForm.region = new Date(_UymdsfFilter(value.top_end_time));
         } else {
           _this.ruleForm.setTop = '不置顶'

         }*/
        if (value.expire_day) {
          _this.ruleForm.resource = '设置有效期';
          _this.ruleForm.validity = new Date(Uymdfilter(value.expire_day));
        }
        if (value.video_cover) {
          _this.ruleForm.vpType = '视频';
          _this.upType = 2;
          _this.videoPic = value.video_cover;
          var imgStr = value.img_list.split(",");
          imgStr.forEach((item, index) => {
            var obj = {};
            obj.name = '1';
            obj.url = item;
            _this.hasImgList.push(obj);
            _this.imgList = _this.hasImgList;
          });
        } else if (value.img_list) {
          var imgStr = value.img_list.split(",");
          imgStr.forEach((item, index) => {
            var obj = {};
            obj.name = '1';
            obj.url = item;
            _this.hasImgList.push(obj);
            _this.imgList = _this.hasImgList;
          });
        }

      },
      'ruleForm.content': function () {
        if (this.ruleForm.content) {
          let str = this.ruleForm.content.replace(/<[^>]+>/g, "");
          this.pcContent = str.replace(/\s/g, '');
          this.pcconStr = this.pcContent.substr(0, 70) + '...';
        }
      },
      'tabIndex': function (value) {
        if (value == 2) {
          let _this = this;
          _this.tag = [];
          if (_this.ruleForm.closeLabel.length > 0) {
            //紧密相关
            _this.ruleForm.closeLabel = _this.ruleForm.closeLabel.replace(new RegExp("，", "gm"), ',');
            let jmpointerarr = _this.ruleForm.closeLabel.split(",");
            for (var i = 0; i < jmpointerarr.length; i++) {
              if (jmpointerarr[i].length > 0) {
                var obj = {};
                obj.type_id = '1';
                obj.tag_name = jmpointerarr[i];
                obj.relation_ratio = "1";
                _this.tag.push(obj);
              }
            }
          }
          ;
          if (_this.ruleForm.moreLabel.length > 0) {
            //较相关
            _this.ruleForm.moreLabel = _this.ruleForm.moreLabel.replace(new RegExp("，", "gm"), ',');
            var jpointerarr = _this.ruleForm.moreLabel.split(",");
            for (var i = 0; i < jpointerarr.length; i++) {
              if (jpointerarr[i].length > 0) {
                var obj = {};
                obj.type_id = '1';
                obj.tag_name = jpointerarr[i];
                obj.relation_ratio = "0";
                _this.tag.push(obj);
              }
            }
          }
        }
      },
      'ruleForm.closeLabel': function () {
      },
      'option.img': function (value) {
        // this.option.img = value;
      },
      'ruleForm.vpType': function (value) {
        if (value == '图片') {
          this.$refs.uploadVideo.uploadFiles = [];
          this.upType = 1;
        } else if (value == '视频') {
          this.$refs.upload.uploadFiles = [];
          this.upType = 2;

        }
      },
      videos: function (value) {
        this.videos = value;
      },
    },
    methods: {
      GMTToStr(time, hour = true) {
        let date = new Date(time);
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate;
        if (hour) {
          currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + ':' + date.getMinutes();
        } else {
          currentdate = year + month + strDate
        }

        return currentdate;
      },
      getTime() {
        var date = new Date();
        return date;
      },
      editorContent(cont) {
        this.ruleForm.content = cont;
      },
      exceed(file, fileList) {
        if (fileList.length >= 3) {
          this.$message({
            message: '可上传1或3张图片',
            type: 'warning'
          });
        }
      },
      exceedV(file, fileList) {
        if (fileList.length >= 1) {
          this.$message({
            message: '只能上传一个视频',
            type: 'warning'
          });
        }
      },
      handleRemove(file, fileList) {
        this.imgList = fileList
      }
      ,
      handleRemoveV(file, fileList) {
        this.videoPic = ''
        this.$emit('getVideo', '');
      }
      ,
      handlePictureCardPreview(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      }
      ,
      handlePictureCardPreviewV(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      }
      ,
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
      handleChangeV(file, fileList) {
        this.imgLength = fileList.length;
        this.imgList = fileList;
      },
      successUpload(data) {
        if (data) {
          let videoUrl = ''
          videoUrl = data.data[0].url
       /*   videoUrl = data.split('src="')[1];
          videoUrl = videoUrl.split('" />')[0];*/
          this.$emit('getVideo', videoUrl);
          let vt = data.data[0].videoLength;
         /* vt = data.split(',')[0];
          vt = vt.split(':')[1];*/
          vt = (parseInt(vt) / 100).toString();
          var rs = vt.indexOf('.');
          if (rs < 0) {
            rs = vt.length;
            vt += '.';
          }
          while (vt.length <= rs + 2) {
            vt += '0';
          }
       /*   this.videoTime = vt.replace('.', ':');
          this.videoPic = data.split('"cover":"')[1];
          this.videoPic = this.videoPic.split('"}')[0];*/
          this.videoTime = vt.replace('.', ':');
          this.videoPic = data.data[0].videoCover
        }

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
          //let file = _this.convertBase64UrlToBlob(data)
          let file = data
          // file.name = _this.imgList[_this.imgLength - 1].name;
          let formData = new FormData();
          formData.append('file', file);
          formData.append('token',_this.session)
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
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/bmp');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是.jpg .jpeg .png .bmp 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      beforeAvatarUploadV(file) {
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (['video/mp4', 'video/mp3', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过10MB哦!');
          return false;
        }
      },

      toRelease(data) {
        this.$router.push({
          name: 'imformation',
          query: {
            nowid: data
          }
        });
      },
      //编辑获取紧密相关标签和相关标签
      getTag: function (data) {
        let _this = this;
        send.ajaxSend({
          url: geiImformationTagAPI,
          thisVue: _this,
          data: {
            "object_id": data.info_id,
            "object_type": data.info_type
          },
          success: function (data) {
            var arr = data.datalist;
            var closeArr = [];
            var moreArr = [];
            if (arr) {
              arr.forEach((item, index) => {
                if (item.relation_ratio == '1.0') {
                  closeArr.push(item.tag_value);
                } else if (item.relation_ratio == '0.0') {
                  moreArr.push(item.tag_value);
                }
              });
              _this.ruleForm.closeLabel = closeArr.join(',');
              _this.ruleForm.moreLabel = moreArr.join(',')
            }
          }
        })
      },
      //编辑时获取已有的内容
      getContent: function (data) {
        let _this = this;
        send.ajaxSend({
          url: getImformationDetailAPI,
          thisVue: _this,
          data: {
            "info_id": data
          },
          success: function (res) {
            _this.ruleForm.content = res.content;
          }
        })
      },

      //判断收费类型
      // chargeTypeFun(){
      //   if(this.ruleForm.chargeType == '免费'){
      //       this.chargeTypeMsg = 'A'
      //       console.log('免费')
      //   }else{
      //       this.chargeTypeMsg = 'B'
      //       console.log('黄金会员')
      //   }
      // },

      submitForm(formName) {
        var message = {};
        var tag_list = [];
        let _this = this;
        for (var i = 0; i < this.brokerteamList.length; i++) {
          for (var j = 0; j < this.ruleForm.type; j++) {
            // if(this.ruleForm.type[j] = this.brokerteamList[i])
          }
        }
        _this.imgUrlStr = '';
        for (let i = 0; i < _this.imgList.length; i++) {
          let str = ''
          if (_this.ruleForm.vpType == '图片') {
            if(_this.imgList[i].data){
              str = _this.imgList[i].data.data[0].url;
            }
          } else {
            str = _this.imgList[i].response.data[0].url;
          }
          if (str) {
           /* str = str.split('src="')[1];
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
        if (_this.ruleForm.closeLabel.length > 0) {
          //紧密相关
          _this.ruleForm.closeLabel = _this.ruleForm.closeLabel.replace(new RegExp("，", "gm"), ',');
          let jmpointerarr = _this.ruleForm.closeLabel.split(",");
          for (var i = 0; i < jmpointerarr.length; i++) {
            if (jmpointerarr[i].length > 0) {
              var obj = {};
              obj.type_id = '1';
              obj.tag_name = jmpointerarr[i];
              obj.relation_ratio = "1";
              tag_list.push(obj);
            }
          }
        }
        if (_this.ruleForm.moreLabel.length > 0) {
          //较相关
          _this.ruleForm.moreLabel = _this.ruleForm.moreLabel.replace(new RegExp("，", "gm"), ',');
          var jpointerarr = _this.ruleForm.moreLabel.split(",");
          for (var i = 0; i < jpointerarr.length; i++) {
            if (jpointerarr[i].length > 0) {
              var obj = {};
              obj.type_id = '1';
              obj.tag_name = jpointerarr[i];
              obj.relation_ratio = "0";
              tag_list.push(obj);
            }
          }
        }

        message.customer_group_ids = '1864'
        message.tag_list = JSON.stringify(tag_list);//	紧密相关
        message.title = encodeURIComponent(encodeURIComponent(_this.ruleForm.name));
        message.content = encodeURIComponent(encodeURIComponent(_this.ruleForm.content));
        message.session_id = _this.session;
        if (_this.imgUrlStr) {
          message.img_list = _this.imgUrlStr;
        }
        message.info_type = _this.ruleForm.releasetype;
        message.charge_type = _this.chargeTypeMsg;

        // message.publish_time = _this.ruleForm.selectTime;
        if (_this.ruleForm.userType == '普通用户') {
          message.user_type = 'user';
        } else if (_this.ruleForm.userType == '投顾用户') {
          message.user_type = 'borker';
        }
        if (_this.ruleForm.vpType == '图片') {
          message.media_type = 'picture';
        } else if (_this.ruleForm.vpType == '视频') {
          message.media_type = 'video';
          message.video_length = _this.videoTime;
          message.video_cover = _this.videoPic;
        }
        if (_this.ruleForm.resource == '设置有效期') {
          let str = ymdfilter(_this.GMTToStr(_this.ruleForm.validity, false));
          message.expire_day = str;//	否	过期日
        }
        if (_this.ruleForm.releaseTime == '立即发布') {
          message.immediately_flag = 'Y'
        } else {
          message.immediately_flag = 'N';//	string	否	是否立即投放
          message.put_time = _ymdsfFilter(_this.GMTToStr(_this.ruleForm.selectTime));
          message.publish_time = _this.GMTToStr(_this.ruleForm.selectTime) + ':00';
        }
        if (_this.ruleForm.comment == '开启') {
          message.comment_user_flag = 'Y';//	string	是	是否开启用户评论
        } else {
          message.comment_user_flag = 'N';//	string	否	是否开启用户评论
        }
        if (_this.ruleForm.blockComment == '开启') {
          message.comment_flag = 'Y';//	string	是	是否投顾开启评论
        } else {
          message.comment_flag = 'N';//	string	否	是否投顾开启评论
        }

        if (_this.ruleForm.chargeType == '免费') {
          message.charge_type = 'A'
        } else {
          message.charge_type = 'B'
        }
        /* if (_this.ruleForm.setTop == '不置顶') {
           message.top_flag = 'N';//	string	是	是否置顶
         } else {
           message.top_flag = 'Y';//	string	否	是否置顶
           // console.log(_this.GMTToStr(_this.ruleForm.region,false))
           message.top_end_time = _ymdsfFilter(_this.GMTToStr(_this.ruleForm.region, false) + ' 00:00');//	int	否	置顶周期 yyyyMMddHHmm
         }*/
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.imgList.length == 2) {
              _this.$message.error('请上传1或3张图片');
              return false;
            } else {
              if (_this.ruleForm.content) {
                _this.fullscreenLoading = true;
                let urlAPI = '';
                if (_this.fromDate) {
                  urlAPI = resetEditorInforAPI;
                  message.info_id = _this.fromDate.info_id;
                } else {
                  urlAPI = releaseAPI;
                }
                send.ajaxSend({
                  url: urlAPI,
                  data: message,
                  thisVue: _this,
                  success: function (data) {
                    var infoId = '';
                    var messStr = '';
                    if (data.info_id) {
                      infoId = data.info_id;
                      messStr = '发布成功'
                      _this.fullscreenLoading = false;

                    } else {
                      infoId = message.info_id;
                      messStr = '修改成功'
                      _this.fullscreenLoading = false;

                    }
                    _this.$message({
                      message: messStr,
                      type: 'success',
                      onClose: _this.toRelease(infoId),
                    });
                    _this.fullscreenLoading = false;
                  }, error: function (data) {
                    _this.fullscreenLoading = false;
                  }
                });
              } else {
                _this.$message.error('请填写内容');
                return false;
              }
            }
          } else {
            return false;
          }
        });
      },
      openFullScreen() {

      },
    }
  }
</script>
<style scoped lang="less">
  @import '../../assets/style/public.less';

  .right {
    float: left;
    width: 49%;
    .comit-btn {
      position: fixed;
      right: 28px;
      top: 46px;
    }
  }

  .left {
    float: left;
    text-align: left;
    width: 50%;
    border-right: 1px solid @com-solidS1-bg;
    .left-padding {
      padding: 36px;
    }
    .video-cover {
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      width: 90px;
      height: 80px;
      line-height: 80px;
      position: absolute;
      top: 0;
      z-index: 1;
      span, img {
        width: 90px;
        height: 80px;
        display: inline-block;
        vertical-align: top;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
      }
      .bg-pic {
        width: 40px;
        height: 40px;
        top: 20px;
        left: 20px;
      }
    }
    .cropper-bg{
      width:100%;
      height: 100%;
      background: hsla(0, 0%, 0%, 0.5);
      position: fixed;
      top: 0;
      z-index: 2;
    }
    .content-cro {
      position: fixed;
      top: 0;
      width: 50%;
      height: 50%;
      z-index: 3;
      .el-button {
        float: right;
        margin-top: 20px;
      }
    }
  }
</style>
<style lang="less">
  @import '../../assets/style/public.less';

  .vjs-custom-skin > .video-js .vjs-big-play-button {
    top: 50% !important;
  }

  .view-point {
    height: 100%;
    font-size: @font;
    color: @com-h2S1-font;
    overflow-y: scroll;
    height: calc(100% - 39px);
    .pc-view {
      height: 100%;
      .pc-left {
        border-right: 1px solid @com-solidS1-bg;
        width: 48%;
        height: 100%;
        padding: 0px;
        .left-title {
          font-size: @font + 1;
          margin-bottom: 16px;
          line-height: 26px;
        }
        /* .img-list {
           img {
             float: left;
             width: 32.3%;
             height: 80px;
           }
         }*/
        .content-list {
          border-bottom: 1px solid @com-solidS2-bg;
          background-color: @com-module-bg;
          .content-group {
            padding: 20px;
            text-align: left;
            .header-main-img {
              width: 174px;
              height: 120px;
              float: left;
              position: relative;

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
                  top: 40px;
                  left: 60px;
                }
                .cover-pic, span {
                  background: rgba(0, 0, 0, 0.3);
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                }
                .duration {
                  position: absolute;
                  left: 110px;
                  top: 94px;
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
            .header-main-right {
              float: left;
              max-width: 368px;
              margin-left: 20px;
            }
            .header-main-title {
              margin: 0;
              font-size: @font;
              color: @com-h1S2-font;
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
            .header-main-footer {
              height: 24px;
              line-height: 24px;
              .footer-icon {
                width: 24px;
                height: 24px;
                border-radius: 12px;
                float: left;
              }
              .footer-span {
                font-size: @font - 4;
                color: @com-h3-font;
                display: inline-block;
                padding: 0 5px;
                vertical-align: top;
              }
              .footer-hour {
                font-size: @font - 4;
                color: @com-h4s4-font;
              }
            }
            .img-list {
              margin: 16px 0;
              img {
                margin-right: 20px;
              }
              img:last-child {
                margin-right: 0px;
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
              color: @com-h4s4-font;
              font-size: @font - 2;
              .text-num {
                padding: 0 5px;
                color: @com-h4s4-font;
              }
            }
          }
          .no-img {
            padding-left: 0 !important;
            .header-main-right {
              max-width: 606px !important;
            }
          }
        }
      }
      .pc-right {
        text-align: left;
        width: 47%;
        height: 100%;
        overflow-y: scroll;
        .right-padding {
          padding: 36px;
        }
        .video-sty {
          margin-bottom: 30px;
        }
        .details-title {
          color: @com-h1S2-font;
          border-bottom: 1px solid @com-solidS2-bg;
          padding-bottom: 20px;
        }
        .text-pro {
          font-size: 14px;
          margin: 20px 0 10px;
          .details-share {
            display: inline-block;
            vertical-align: top;
            float: right;
          }
        }
        .text-name {
          font-size: 18px;
        }
        .footer-icon {
          width: 24px;
          height: 24px;
          border-radius: 12px;
        }
        .footer-span {
          height: 24px;
          line-height: 24px;
          display: inline-block;
          vertical-align: top;
          padding: 0 10px;
        }
        .footer-hour {
          color: @com-h4s4-font;
        }
        .content-footer {
          color: @com-h4s4-font;
          display: inline-block;
          vertical-align: top;
          padding: 0 20px 20px 0;
        }
      }
    }
    .phone-view {
      overflow-y: auto;
      width: 640px;
      margin: 0 auto;
      padding-top: 30px;
      text-align: center;
      margin-bottom: 20px;
      .phone-bg {
        /*background: url("../../assets/img/yl1.png") no-repeat;*/
        background-color: #2A2E3A;
        width: 330px;
        height: 588px;
        margin: 0 auto;
        padding: 10px;
        .phone-cont {
          margin-top: 10px;
          position: absolute;
          overflow-y: auto;
          top: 85px;
          bottom: 0;
          left: 5px;
          right: 5px;
          .cont div {
            width: 100% !important;
            a {
              display: block;
              width: 100%;
              cursor: text;
              img {
                display: block;
                width: 100%;
              }
            }
          }
        }
        .pho {
          position: absolute;
          overflow-y: auto;
          top: 78px;
          left: 24px;
          right: 22px;
          bottom: 74px;
        }
        .text-pro {
          margin-top: 5px;
          font-size: @font - 4;
        }
        img {
          display: block;
          width: 31.3%;
          height: 60px;
          float: left;
          max-width: 186px;
          max-height: 90px;
          margin-right: 1%;
        }
      }
    }

    .select-time {
      width: 110px;
      height: 30px;
      line-height: 30px;
      background-color: @com-buttonS3-bg;
      border: none;
      color: @com-h2S1-font;
      padding-left: 6px;
      margin-left: 10px;
    }
    .el-upload--picture-card {
      width: 90px;
      height: 80px;
      line-height: 102px;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 90px;
      height: 80px;
      line-height: 80px;
    }
    .el-upload-list--picture-card .el-upload-list__item-status-label {
      right: -22px;
      top: -30px;
      width: 28px;
      height: 46px;
    }
    .el-upload-list--picture-card .el-upload-list__item-actions {
      z-index: 2;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 110px;
      .el-input__inner {
        padding: 0px 10px;
        margin-left: 10px;
        width: 100%;
      }
    }
    .el-select {
      .el-input__inner {
        margin-left: 10px;
        padding: 0 10px;
        width: 110px !important;
      }
    }
    .el-input__prefix {
      display: none;
    }
    .el-input__suffix {
      display: none;
    }
    .el-radio__inner {
      border: 1px solid @com-radio-default;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      background-color: transparent;
      cursor: pointer;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      &:hover {
        border-color: @com-radio-hover;
      }
      &::after {
        background-color: @com-radio-select;
      }
    }
    .set-vali {
      .el-input__inner {
        color: @com-input-color-sr !important;
      }
    }
    .color-w {
      .el-input__inner {
        color: @com-input-color-sr !important;
      }
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: @com-radio-select;
      background: transparent;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: @com-h2S1-font;
    }
    .el-form {
      color: @com-h2S1-font;
      text-align: left;
      .img-pro {
        margin-top: 10px;
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
      .el-input__inner {
        background-color: @com-input-bg;
        border-radius: 2px;
        border: none;
        color: @com-input-color-sr;
        height: 30px;
        line-height: 30px;
        width: 86%;

      }
      .el-checkbox__inner {
        border: 1px solid @com-radio-select;
        background-color: transparent;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: @com-radio-select;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: transparent;
        border-color: @com-sizeS1-color;
      }
      .el-button--primary {
        float: right;
        color: @com-button-Sx-font;
        background-color: @com-button-Sx-bg;
        border-color: @com-button-Sx-border;
        width: 90px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        /*margin-top: 30px;*/
      }
      .el-upload--picture-card {
        background-color: @com-input-bg;
        border: none;
        i {
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

  }

</style>

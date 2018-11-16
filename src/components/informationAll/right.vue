<template>
<div class="information-right" id="information-right">
  <div v-if='newType == "info" || userLevel === "B"'>
    <div v-if="nothingDetail" class="nothing">
      <img src="../../assets/img/no_data.png">
    </div>
    <div class="touzi-main">
      <div class="btn-block">
        <!-- <button>
           <i class="iconfont icon-kcxq_icon_sc"></i>
           收藏
         </button>
         <button>
           <i class="iconfont icon-kcxq_icon_share"></i>
           分享
         </button>-->
      </div>
    </div>
    <div class="right-cont" id="rightId" @scroll="setComment($event)">
      <div class="right-details" @scroll="setComment($event)">
        <player :video-url="videos" v-if="videos" class="video-sty" id="video-sty"></player>
        <div class="details-title clearfix">
          <p>{{news.title}}</p>
          <span v-if="news.data_from == 'crawl'" style="padding:0px;">
            <img :src="news.author_head ? news.author_head : defaultMobileHead" :onerror="$store.state.peoplegerror">
          <span class="footer-span">{{news.author_name}}</span>
          </span>
          <span v-else style="padding:0px;">
            <img :src="news.publisher_user.head ? news.publisher_user.head : defaultMobileHead" :onerror="$store.state.peoplegerror">
          <span class="footer-span">{{news.publisher_user.nickname || news.publisher_user.name}}</span>
          </span>
          <span class="com" v-if="news.user_type == 'broker'"><i class="iconfont icon-kcxq_icon_zx"></i>交流</span>
          <span class="com" v-if="news.user_type == 'broker'"><i class="iconfont icon-guanzhu"
                                                                 style="font-size: 20px;"></i>关注</span>
          <span class="footer-hour">{{news.publish_time | DelM}}</span>
          <!--<div class="details-share">
            <span>交流</span>
          </div>-->
        </div>
        <div class="details-content clearfix">
          <div class="content-cont" ref="boxContent" v-html="news.content"></div>
          <!--<span class="content-footer" v-for="data in tag">{{data.tag_value}}</span>-->
          <div :class="{'content-dz':true,'isfavour':favoured }" @click="favour()">
            <i class="iconfont icon-zxxq_icon_zang"></i>
            <span class="content-footer-z" v-if="!favoured">点赞</span>
            <span class="content-footer-z" v-if="favoured">已赞</span>
          </div>
        </div>
        <div class="user-comment clearfix">
          <div id="userScroll"   style="background-color: #22262f">
            <div :class="{'comment-tab':true,'active':commentType === 'user'}" @click="changeType('user')">用户评论<span class="tab-num">({{commentUser}})</span>
            </div>
            <div :class="{'comment-tab':true,'active':commentType === 'broker'}" @click="changeType('broker')">理财师观点<span class="tab-num">({{commentBroker}})</span>
            </div>
          </div>
          <!--客户评论-->
          <div class="comment-list" :class="{'add-bottom': showBtn,'list-top':searchBarFixed}"
               v-if="commentType === 'user'">
            <div class="comment-cont no_comment clearfix" v-if="commentUserList.length === 0">
              <img src="../../assets/img/no_data.png">
            </div>
            <div class="comment-cont clearfix" v-for="data in commentUserList">
              <img :src="data.user.head?data.user.head:defaultMobileHead" :onerror="$store.state.peoplegerror">
              <div class="cont-detail">
                <span class="user-name">{{data.user.nickname}}</span>
                <span class="cont-time">{{data.comment_time | DelS}}</span>
                <p class="user-cont">{{data.content}}</p>
              </div>
            </div>
          </div>
          <!--投顾评论-->
          <div class="comment-list" :class="{'add-bottom': showBtn,'list-top':searchBarFixed}"
               v-if="commentType === 'broker'">
            <div class="comment-cont no_comment clearfix" v-if="commentBrokerList.length === 0">
              <img src="../../assets/img/no_data.png">
            </div>
            <div class="comment-cont clearfix" v-for="data in commentBrokerList">
              <img :src="data.user.head?data.user.head:defaultMobileHead" :onerror="$store.state.peoplegerror">
              <div class="cont-detail">
                <span class="user-name">{{data.user.nickname}}</span>
                <span class="cont-time">{{data.comment_time | DelS}}</span>
                <p class="user-cont">{{data.content}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-cont clearfix" id="commentCon">
        <textarea v-if="(commentType === 'user' && news.comment_user_flag === 'Y') || (commentType === 'broker' && news.comment_flag === 'Y')" maxlength="120" :class="{'textarea-focus':showBtn}" @focus="showBtn = true" placeholder="我有话要说…"
                  v-model="commentContent"></textarea>
        <div class="text-right">
         <!-- <i class="iconfont icon-kcxq_icon_sc" v-if="!showBtn"></i>
          <i class="iconfont icon-kcxq_icon_share" v-if="!showBtn"></i>-->
        </div>
        <el-button class="release-btn" size="small" v-if="showBtn" @click="showBtn = false" style="margin-right: 50px">
          取消
        </el-button>
        <el-button class="release-btn" size="small" v-if="showBtn" @click="subComment">发布</el-button>

      </div>
    </div>
    </div>
    <div  v-if='newType == "Report" && userLevel != "B"' class="vip_show flex-wrap-center">
      <div>
        <p>尊敬的用户您好！</p>
        <p>该资讯仅黄金会员可观看。</p>
        <p>购买黄金会员，可以享受更多的精品课程、专家咨询、直播接盘、量化策略。</p>
        <p>如需购买，请在“我的”界面进行购买。</p>
      </div>
    </div>
  </div>
</template>

<script>
  import send from '../../assets/js/ajaxSend'
  import player from '../system/player'
  import {
    getImformationDetailAPI,
    getMyfavourAPI,
    geiImformationTagAPI,
    toFavourAPI,
    getCommentAPI,
    subCommentAPI
  } from "../../assets/apiRegular";

  export default {
    name: "right",
    props: [
      'newsid',
      "videos",
      'newType'
    ],
    data() {
      return {
        showBtn: false,
        userLevel: localStorage.getItem("userLevel"),
        searchBarFixed: false,
        news: {},
       // newType: "",
        chargeType:"",
        nothingDetail: true,
        tag: [],
        favoured: "",
        commentUserList: [],
        commentBrokerList: [],
        commentType: 'user',
        commentUser: 0,
        commentBroker: 0,
        commentContent: "",
        sessionID: '',
        user: '',
        us: 0,
        defaultMobileHead:"../../assets/img/defaultHead.png"
      }
    },
    mounted: function () {
      let _this = this;
      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionID = JSON.parse(localStorage.getItem('logininfo')).session_id;

    },
    created() {
      // 点击其他不在的区域触发事件
      document.addEventListener('click', (e) => {
        let div = document.getElementById('commentCon');
        if (div) {
          if (!div.contains(e.target)) {
            this.showBtn = false;
          }
        }
      })
    },
    updated: function () {
      let array = Array.prototype.slice.call(this.$refs.boxContent.getElementsByTagName("a"));
      let arrayLength = array.length;
      for (let i = 0; i < arrayLength; i++) {
        array[i].onclick = function(event) {
          event.preventDefault();
          openBrowser(array[i].href);
        };
      }
      if (!this.searchBarFixed) {
        if(document.getElementById('userScroll')){

          this.us = document.getElementById('userScroll').offsetTop;
        }

//console.log('this.jflsd',document.documentElement.clientHeight)
        // console.log('this.us',document.getElementById('rightId').clientHeight)
      }
    },
    methods: {
      setComment: function (e) {
        let domHeight = e.srcElement.scrollHeight;
        let viewHeight = e.srcElement.clientHeight;
        let scrollHeight = e.srcElement.scrollTop;
        this.$store.state.scrollComment = false;
        if(document.getElementById('userScroll')){

          let userScroll = document.getElementById('userScroll').offsetTop;
        }

        let cp = this.us - 40;
        // console.log('userScroll', scrollHeight, userScroll,this.us,cp)
        if (scrollHeight >= cp) {
          this.searchBarFixed = true;
          //  console.log('userScroll', userScroll)
        }
        if (scrollHeight < cp) {
          this.searchBarFixed = false;
        }
      },
      getDetail: function (data) {
        if(document.getElementById("information-right")){
          document.getElementById("information-right").scrollTop = 0;
        }
        if(document.getElementById("rightId")){
          document.getElementById("rightId").scrollTop = 0;

        }
        let _this = this;
        send.ajaxSend({
          url: getImformationDetailAPI,
          thisVue: _this,
          data: {"info_id": data},
          success: function (res) {
            res.content = res.content.replace(/(color).*(;)/ig, '');
            if (!res.objectstat.view_start) res.objectstat.view_start = 0;
            if (!res.objectstat.favour) res.objectstat.favour = 0;
            if (!res.objectstat.oppose) res.objectstat.oppose = 0;
            _this.newType = res.info_type;//类型
             _this.chargeType = res.charge_type;
            _this.news = res;//资讯对象
            // _this.news.content = _this.news.content.replace(/\n/g,'</p><p>')
            _this.getTag(data);//获取标签
            _this.getFavour(data);//获取当前客户点赞情况
            _this.getCommentUser(data, 'user');//获取用户评论
            _this.getCommentUser(data, 'broker');//获取投顾评论
            _this.commentContent = ''//评论重置
            // console.log('news',_this.news.content)
          }
        })
      },
      getTag: function (data) {
        let _this = this;
        send.ajaxSend({
          url: geiImformationTagAPI,
          thisVue: _this,
          data: {"object_id": data, "object_type": _this.newType},
          success: function (data) {
            _this.tag = data.datalist;
          }
        })
      },
      getFavour: function (data) {
        let _this = this;
        send.ajaxSend({
          url: getMyfavourAPI,
          data: {
            session_id: _this.sessionID,
            object_type: _this.newType,
            object_id: data,
            user_id: _this.user.user_id
          },
          success: function (data) {
            if (data.current_user_stat === 'favour') {
              _this.favoured = true
            } else {
              _this.favoured = false
            }
          }
        })
      },
      favour: function () {
        let _this = this;
        _this.favoured = !_this.favoured;
        send.ajaxSend({
          url: toFavourAPI,
          data: {
            session_id: _this.sessionID,
            object_type: _this.newType,
            object_id: _this.newsid,
            channel: 'pcapp'
          },
          thisVue: _this,
          success: function (data) {
            let query = {};
            query.type = 'favoue';
            if (_this.favoured) {
              query.date = '+1';
            } else {
              query.date = '-1';
            }
            _this.$emit("changeCommment", query);
            _this.getFavour(_this.newsid)
          }
        })
      },
      getCommentUser: function (data, type) {
        let _this = this;
        send.ajaxSend({
          url: getCommentAPI,
          data: {
            "session_id": _this.sessionID,
            "object_type": "article",
            "object_id": data,
            "type": type
          },
          success: function (data) {

            if (type === 'user') {
              _this.commentUserList = data.comment_list;
              _this.commentUser = data.page.totalcount;
            } else if (type === 'broker') {
              _this.commentBrokerList = data.comment_list;
              _this.commentBroker = data.page.totalcount;
            }
          }
        })
      },
      changeType: function (type) {
        this.commentType = type
      },
      subComment: function () {
        let _this = this;
        let contentInput = _this.commentContent.replace(/(^\s*)|(\s*$)/g, "")

        if( contentInput == ''){
           _this.$message({
              message: '评论不能为空',
              type: 'error'
            });
        }else{
          send.ajaxSend({
            url: subCommentAPI,
            data: {
              "session_id": _this.sessionID,
              "object_type": "article",
              "object_id": _this.news.info_id,
              "content": encodeURIComponent(encodeURIComponent(_this.commentContent))
            },
            thisVue: _this,
            success: function (data) {
              if (data.op.code === 'Y') {
                _this.$message({
                  message: data.op.info,
                  type: 'success'
                });
                _this.commentUser = data.user_comment_count;
                _this.commentBroker = data.broker_comment_count;
                _this.commentContent = '';
                let query = {};
                query.type = 'comment';
                query.date = data.all_comment_count;
                _this.$emit("changeCommment", query);
                _this.getCommentUser(_this.news.info_id, 'user');
                _this.getCommentUser(_this.news.info_id, 'broker')
              }
            }
          })
        }
      }
    },
    components: {
      player
    },
    computed: {
      getUserIcons() {
        return this.$store.state.scrollComment;
      }
    },


    watch: {
      newsid: function (value) {
        if (value !== '' && value !== null) {
          this.getDetail(value);
          // if(document.getElementById('rightId')){
          //   document.getElementById('rightId').scrollTo(0, (document.getElementById('rightId').offsetTop - 40));
          // }
          this.nothingDetail = false;
        } else {
          this.nothingDetail = true;
                  this.chargeType = "A";
        }
      },
      videos:function (value) {
        this.videos = value;
      },
      getUserIcons(val) {
        if (val) {
          //document.querySelector("#rightId").scrollTop = document.querySelector('#userScroll').offsetTop;
          if(document.querySelector('#userScroll')){
            let distance = document.querySelector('#userScroll').offsetTop; //获得当前高度

          }
          let step = distance / 50; //每步的距离
          (function jump() {
            if (document.querySelector("#rightId").scrollTop < (document.querySelector('#userScroll').offsetTop)) {
              if (document.documentElement.clientHeight < document.querySelector('.comment-list').clientHeight) {
                console.log('每步的距离')
                distance += step;
                document.querySelector("#rightId").scrollTo(document.querySelector("#rightId").scrollTop, distance)
                //   window.scrollTo(0,distance);
                setTimeout(jump, 10)
              } else {
                document.querySelector("#rightId").scrollTo(document.querySelector("#rightId").scrollTop,document.querySelector('#userScroll').offsetTop);
              }
            }
          })();
        }
      }
    },
  }
</script>
<style type="text/css">
/*.details-content  img{
  width: 80% ;
  margin: 10px 0 10px 10%;

}*/

</style>
<style scoped lang="less">
  @import "../../assets/style/public";
  .details-content{
    /deep/ h2{
      margin-bottom:20px;
    }
    /deep/ img{
      width: 80% ;
      margin: 10px 0 10px 10%;

    }
  }
  .searchBar {
    position: fixed;
    top: 79px;
    .comment-tab{
      margin-right: 20px;
    }
  }

  .information-right {
    background-color: @com-module-bg;
    height: 100%;
    width: 57%;
    float: left;
    border-left: 1px solid @com-solidS1-bg;
    position: relative;
    .vip_show {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: #283037;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      p {
        color: #fff;
      }
    }
  }
    .nothing {
      position: absolute;
      z-index: 10;
      top: 42px;
      bottom: 0;
      left: 0;
      right: 0;
     /* background: @com-module-bg;*/
      color:@com-h4s4-font;
      font-size: @font + 6px;
      display: flex;
      justify-content: center;
      align-items: Center;
    }
    .touzi-main {
      height: 40px;
      border-bottom: 1px solid @com-solidS1-bg;
      border-left:none;
      background: @com-module-title-bg;
      .btn-block {
        float: right;
        line-height: 40px;
        margin-right: 20px;
        button {
          .clear-btn;
          margin-right: 10px;
          cursor: pointer;
          font-size: @font;
          color: @com-buttonIco-M-color;
        }
      }
    }
    .right-cont {
      height: calc(100% - 39px);
      overflow: auto;
      position: absolute;
      width:100%;
    }
    .right-details {
      background-color: @com-module-bg;
    /*  border-left: 1px solid @black-2;*/
      padding: 20px 20px 0;
      text-align: left;
      .video-sty{
        margin-bottom: 30px;
      }
      .details-title {
        color: @com-h1S2-font;
        border-bottom: 1px solid @com-solidS2-bg;
        padding-bottom: 20px;
        .com {
          padding-left: 24px;
          color: @com-h4s4-font;
          .iconfont {
            color: @com-buttonIco-A-color;
            position: relative;
            top: 2px;
            right: 8px;
          }
        }

        .details-share {
          display: inline-block;
          float: right;
          cursor: pointer;
          color: @com-buttonIco-A-color;
          padding: 2px 8px;
          border: 1px solid @com-buttonIco-A-color;
          i {
            width: 19px;
            height: 19px;
            padding-top: 3px;
            display: inline-block;
            vertical-align: middle;
          }
          span {
            padding: 0;
          }
        }
        img {
          width: 24px;
          height: 24px;
          border-radius: 12px;
        }
        p {
          margin: 0 0 20px 0;
          font-size: @font;
        }
        span {
          font-size: @font - 4;
          height: 24px;
          line-height: 24px;
          display: inline-block;
          vertical-align: top;
          padding: 0 10px;
        }
        .footer-hour {
          color: @com-h4s4-font;
        }
      }
      .details-content {
        margin-bottom: 30px;
        p {
          white-space: pre-wrap; /*css-3*/
          white-space: -moz-pre-wrap; /*Mozilla,since1999*/
          white-space: -pre-wrap; /*Opera4-6*/
          white-space: -o-pre-wrap; /*Opera7*/
          word-wrap: break-word; /*InternetExplorer5.5+*/

         .font-family;
          font-size: @font !important;
          margin: 0;
          /*text-indent: 26px;*/
          /*line-height: 26px;*/
          /*padding-bottom: 20px;*/
        }
        color: @com-h3-font;
        font-size: @font - 2;
        padding-top: 20px;
        .content-footer {
          color: @com-h4s4-font;
          display: inline-block;
          vertical-align: top;
          padding: 0 20px 20px 0;
        }
        .content-dz {
          display: inline-block;
          float: right;
          cursor: pointer;
          margin-top:20px;
          &.isfavour {
            color: @com-buttonIco-X-color;
          }
          i {
            width: 18px;
            height: 20px;
            margin-right: 6px;
          }
          .content-footer-z {
            padding-right: 10px;
          }
        }
      }
      .user-comment {
        padding-bottom: 40px;
        .comment-tab {
          display: inline-block;
          text-align: center;
          padding: 10px 0;
          color: @com-tab-M-color;
          cursor: pointer;
          width: 92px;
          margin: 0 18%;
          &:last-child{
            margin-right:0px !important;
          }
        }
        .active {
          font-weight: bold;
          border-bottom: 2px solid @com-tab-X-border;
          color: @com-tab-X-color;
        }
        .comment-list {
          min-height: 160px;
          /*overflow-y: scroll;*/
          /*max-height: 248px;*/
          margin-bottom: 30px;
        }
        .list-top {
          // margin-top: 110px;
        }
        .add-bottom {
          margin-bottom: 60px;
        }
        .comment-list::-webkit-scrollbar {
          display: none;
        }
        .no_comment {
          position: relative;
          img {
            position: absolute;
            left: 40%;
            width: 100px !important;
            height: auto !important;
            background-color: transparent !important;
          }
        }
        .comment-cont {
          padding: 20px;
          border-top: 1px solid @com-solidS2-bg;
          img {
            float: left;
            width: 42px;
            height: 42px;
            border-radius: 20px;
          }
          .cont-detail {
            display: inline-block;
            vertical-align: top;
            margin-left: 20px;
            width: calc(100% - 64px);
            .user-name {
              color: @com-h3-font;
              padding-right: 10px;
            }
            .user-cont {
              margin:14px 0;
              color: com-h2S1-font;
            }
          }
        }
      }
    }
    .my-cont {
      position: fixed;
      bottom: 0;
      border-top:1px solid @com-solidS2-bg;
      background-color: @com-module-bg;
      padding: 10px 20px;
      line-height: 36px;
      /*margin-bottom: 30px;*/
      textarea {
        height: 16px;
        float: left;
        background-color: @com-input-bg;
        border: 1px solid @com-solidS2-bg;
        width: calc(100% - 200px);
        /*width:472px;*/
        color: @com-input-color-sr;
        resize: none;
        overflow-y: auto;
        font-size: @font - 2;
        padding: 10px;
      }
      .textarea-focus {
        /*outline: none;*/
        width: calc(100% - 70px);
        height: 40px;
        color:@com-input-color-sr;
      }
      .text-right {
        float: left;
        margin-left: 30px;
        .iconfont {
          font-size: 20px;
          margin-right: 20px;
          cursor: pointer;
          &:hover {
            color: @com-buttonIco-X-color;
          }
        }
      }
      .release-btn {
        margin: 3px 20px;
        display: inline-block;
        vertical-align: top;
        width: 80px;
        height: 28px;
        text-align: center;
        line-height: 12px;
        color: @com-button-M-font;
        background-color: @com-button-M-bg;
        border: 1px solid @com-button-M-border;
        cursor: pointer;
        border-radius: 3px;
        font-size: 12px;
        margin-top: 5px;
        &:hover {
          color: @com-button-X-font;
          border: 1px solid @com-button-X-border;
        }

      }
    }

    .my-cont {
      position: fixed;
      bottom: 0;
      width: 58%;
      border-top:1px solid @com-solidS2-bg;
      background-color: @com-module-bg;
      padding: 10px 20px;
      line-height: 36px;
      /*margin-bottom: 30px;*/
      textarea {
        height: 16px;
        float: left;
        background-color: @com-input-bg;
        border: 1px solid @com-solidS2-bg;
        width: 100%;
        /*width:472px;*/
        color: @com-input-color-sr;
        resize: none;
        overflow-y: auto;
        font-size: @font - 2;
        padding: 10px;
      }
      .textarea-focus {
        width: calc(100% - 70px);
        height: 40px;
        color:@com-input-color-sr;
      }
      .text-right {
        float: left;
        margin-left: 30px;
        .iconfont {
          font-size: 20px;
          margin-right: 20px;
          cursor: pointer;
          &:hover {
            color: @com-buttonIco-X-color;
          }
        }
      }
      .release-btn {
        float: right;
        margin: 3px 20px;
        display: inline-block;
        vertical-align: top;
        width: 80px;
        height: 28px;
        text-align: center;
        line-height: 12px;
        color: @com-button-M-font;
        background-color: @com-button-M-bg;
        border: 1px solid @com-button-M-border;
        cursor: pointer;
        border-radius: 3px;
        font-size: 12px;
        margin-top: 5px;
        &:hover {
          color: @com-button-X-font;
          border: 1px solid @com-button-X-border;
        }

      }
    }
  }
</style>

<template>
  <div class="information-right">
    <div class="touzi-main clearfix" style=" display: block;">
      <div class="fb-btn" @click="toPoint();">发布观点</div>
    </div>
    <div v-if="nothingDetail" class="nothing">
      <img src="../../assets/img/no_data.png">
      <p>无发布内容</p>
    </div>
    <!-- <div v-if="nothingDetail" class="nothing">
       您暂未发布{{tabname}}快去<span class="add-info" @click="toPoint();">添加</span>吧！
     </div>-->

    <!--@scroll="setComment($event)"-->
    <div class="right-cont" id="rightId" v-loading="loading" element-loading-background="rgba(255,255,255,0.3)"
         @scroll="setComment($event)" v-if="!nothingDetail">
      <div class="right-details">
        <player :video-url="videos" v-if="videos" class="video-sty"></player>
        <div class="details-title clearfix">
          <p>{{news.title}}</p>
          <img :src="news.publisher_user.head ? news.publisher_user.head : '123'" :onerror="$store.state.peoplegerror">
          <span class="footer-span">{{news.publisher_user.nickname || news.publisher_user.name}}</span>
          <span class="footer-hour">{{news.publish_time | DelM}}</span>
          <!-- <div class="details-share" style="border: none;" @click="deleteInfo">
             <i class="el-icon-delete" style="font-size: 20px;"></i>
             <span>删除</span>
           </div>-->
          <!--<div class="details-share" style="border: none;padding: 2px 20px;">
            <i class="iconfont icon-kcxq_icon_share"></i>
            <span>分享</span>
          </div>-->
          <!-- <div class="details-share" style="border: none;" @click="editorInfo">
             <i class="el-icon-edit-outline" style="font-size: 20px;"></i>
             <span>编辑</span>
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
          <div id="userScroll" style="background-color: #22262f">
            <div :class="{'comment-tab':true,'active':commentType === 'user'}" @click="changeType('user')">
              用户评论(<span class="tab-num">{{commentUser}}</span>)
            </div>
            <div :class="{'comment-tab':true,'active':commentType === 'broker'}" @click="changeType('broker')">
              理财师观点(<span class="tab-num">{{commentBroker}}</span>)
            </div>
          </div>
          <!--客户评论-->
          <div class="comment-list" :class="{'add-bottom': showBtn,'list-top':searchBarFixed}"
               v-if="commentType === 'user'">
            <div class="comment-cont no_comment clearfix" v-if="commentUserList.length === 0">
              <img src="../../assets/img/no_data.png">
            </div>
            <div class="comment-cont clearfix" v-for="(data,key) in commentUserList" :key="key">
              <img :src="data.user.head" :onerror="$store.state.peoplegerror">
              <div class="cont-detail">
                <span class="user-name">{{data.user.nickname}}</span>
                <span class="cont-time">{{data.comment_time  | DelS}}</span>
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
            <div class="comment-cont clearfix" v-for="(data,key) in commentBrokerList" :key="key">
              <img :src="data.user.head" :onerror="$store.state.peoplegerror">
              <div class="cont-detail">
                <span class="user-name">{{data.user.nickname}}</span>
                <span class="cont-time">{{data.comment_time  | DelS}}</span>
                <p class="user-cont">{{data.content}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!nothingDetail" class="my-cont clearfix" id="commentCon">
        <textarea
          v-if="(commentType === 'user' && news.comment_user_flag === 'Y') || (commentType === 'broker' && news.comment_flag === 'Y')"
          maxlength="120" :class="{'textarea-focus':showBtn}" @focus="showBtn = true" placeholder="我有话要说…"
          v-model="commentContent"></textarea>
        <div class="text-right">
          <!--<i class="iconfont icon-kcxq_icon_sc" v-if="!showBtn"></i>-->
          <i class="el-icon-edit-outline icon-posi" v-if="!showBtn" @click="editorInfo"></i>
          <!--<i class="iconfont icon-kcxq_icon_share" v-if="!showBtn"></i>-->
          <!--<i class="el-icon-delete icon-posi" v-if="!showBtn" @click="deleteInfo"></i>-->
        </div>
        <el-button class="release-btn" size="small" v-if="showBtn" @click="showBtn = false" style="margin-right: 20px">
          取消
        </el-button>
        <el-button class="release-btn" size="small" v-if="showBtn" @click="subComment">发布</el-button>

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
    subCommentAPI,
    getMyImformationListAPI,
    deleteInfoAPI
  } from "../../assets/apiRegular";

  export default {
    name: "right",
    props: [
      'newsid',
      "loading",
      "tabname",
      "videos"
    ],
    data() {
      return {
        showBtn: false,
        searchBarFixed: false,
        nothingDetail: true,
        news: {},
        newType: "",
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
      }
    },

    created() {
      // 点击其他不在的区域触发事件

      // document.getElementById("rightId").scrollIntoView(true);
      document.addEventListener('click', (e) => {
        let div = document.getElementById('commentCon');
        if (div) {
          if (!div.contains(e.target)) {
            this.showBtn = false;
          }
        }
      })
    },
    components: {
      player
    },
    mounted: function () {
      let _this = this;
      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionID = JSON.parse(localStorage.getItem('logininfo')).session_id;
    },
    updated: function () {
      /*  let array = Array.prototype.slice.call(this.$refs.boxContent.getElementsByTagName("a"));
        let arrayLength = array.length;
        for (let i = 0; i < arrayLength; i++) {
          array[i].onclick = function(event) {
            event.preventDefault();
            openBrowser(array[i].href);
          };
        }
        if(!this.searchBarFixed){
          this.us = document.getElementById('userScroll').offsetTop;
          // console.log('this.us',this.us)
        }*/
    },
    methods: {
      /* loadMore(){
         clearTimeout(this.timer);
         this.timer=setTimeout(()=>{
           var clientHeight=document.documentElement.clientHeight; //document.documentElement获取数据
           var scrollTop=document.documentElement.scrollTop; //document.documentElement获取数据
           var scrollHeight=document.documentElement.scrollHeight;//document.documentElement获取数据
           console.log('clientHeight',clientHeight,scrollTop,scrollHeight)
           if(clientHeight+scrollTop+20>=scrollHeight){
             this.pageIndex++;
             this.getBooks();
           }
         },13)
       },*/
      setComment: function (e) {
        let domHeight = e.srcElement.scrollHeight;
        let viewHeight = e.srcElement.clientHeight;
        let scrollHeight = e.srcElement.scrollTop;

        let userScroll = document.getElementById('userScroll').offsetTop;

        let cp = this.us - 40;
        // console.log('userScroll', scrollHeight, userScroll,this.us,cp)
        if (scrollHeight >= cp) {
          this.searchBarFixed = true;
          // console.log('userScroll', userScroll)
        }
        if (scrollHeight < cp) {
          this.searchBarFixed = false;
        }
      },
      getDetail: function (data) {
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
            _this.news = res;//资讯对象
            _this.getTag(data);//获取标签
            _this.getFavour(data);//获取当前客户点赞情况
            _this.getCommentUser(data, 'user');//获取用户评论
            _this.getCommentUser(data, 'broker');//获取投顾评论
            _this.commentContent = ''//评论重置
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
            if (data.comment_list.length > 0) {
              if (type === 'user') {
                _this.commentUserList = data.comment_list;
                _this.commentUser = data.page.totalcount;
              } else if (type === 'broker') {
                _this.commentBrokerList = data.comment_list;
                _this.commentBroker = data.page.totalcount;
              }
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

        if (contentInput == '') {
          _this.$message({
            message: '评论不能为空',
            type: 'error'
          });
        } else {
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
                _this.getCommentUser(_this.news.info_id, 'broker');

              }
            }
          })
        }

      },
      toPoint: function () {
        this.$router.push({name: 'release'})
      },
      /*  deleteInfo: function () {
          let _this = this;
          send.ajaxSend({
            url: deleteInfoAPI,
            data: {'session_id': _this.sessionID, 'info_id': _this.newsid},
            success: function (data) {
              _this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                _this.$emit("refreshList");
                _this.$router.push({name: 'imformation'});
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
            }
          });
        },*/
      editorInfo: function () {
        let _this = this;
        send.ajaxSend({
          url: getMyImformationListAPI,
          data: {'info_ids': _this.newsid},
          success: function (data) {
            _this.$router.push({
              name: 'release',
              query: {
                fromDate: data.info_list[0]
              }
            });
          }
        });
      }
    },
    watch: {
      newsid: function (value) {
        if (value !== '' && value !== null) {
          this.getDetail(value);
          this.nothingDetail = false;
          // document.getElementById('rightId').scrollTo(0,(document.getElementById('rightId').offsetTop - 200));

        } else {
          this.nothingDetail = true;
        }
      },
      videos: function (value) {
        this.videos = value;
      },
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  .details-content {
    /deep/ h2 {
      margin-bottom: 20px;
    }
  }

  .searchBar {
    position: fixed;
    top: 79px;
  }

  .information-right {
    background-color: @com-module-bg;
    height: 100%;
    width: 57%;
    float: left;
    border-left: 1px solid @com-solidS1-bg;
    position: relative;
    /deep/ .el-loading-mask {
      top: 0px;
      left: 0px;
    }
    .nothing {
      /*  height: 100%;*/
      position: relative;
      z-index: 10;
      top: 30%;
      bottom: 0;
      left: 42%;
      /*  background: @com-module-bg;*/
      color: @com-h4s4-font;
      font-size: @font - 2;
      /*    display: flex;*/
      justify-content: center;
      align-items: Center;
      img {
        width: 100px;
      }
      p {
        position: absolute;
        top: 130px;
        left: 26px;
        font-size: @font - 2;
        color: @com-h4s4-font,
      }
    }
    .touzi-main {
      height: 40px;
      border-bottom: 1px solid @com-solidS1-bg;
      background: @com-module-title-bg;
      .btn-block {
        float: right;
        line-height: 40px;
        margin-right: 20px;
      }
      .fb-btn {
        float: right;
      }
    }
    .right-cont {
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
    }
    .right-details {
      background-color: @com-module-bg;
      //border-left: 1px solid @black-2;
      padding: 20px 20px 0;
      text-align: left;
      .video-sty {
        margin-bottom: 30px;
      }
      .details-title {
        color: @com-h1S2-font;
        border-bottom: 1px solid @com-solidS2-bg;
        padding-bottom: 20px;
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
          &:hover {
            color: @com-buttonIco-X-color;
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
          margin: 0;
          /* text-indent: 26px;
           line-height: 26px;*/
          word-wrap: break-word;
        }
        color: @com-h3-font;
        font-size: @font - 2;
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
          margin-bottom: 20px;
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
        margin-bottom: 50px;
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
          // margin-top:118px;
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
            .cont-time {
              color: @com-h4s4-font;
            }
            .user-cont {
              margin: 14px 0;
              color: @com-h2S1-font;
            }
          }
        }
      }
    }
    .my-cont {
      position: fixed;
      bottom: 0;
      width: 54%;
      border-top: 1px solid @com-solidS2-bg;
      background-color: @com-module-bg;
      padding: 10px 20px;
      line-height: 36px;
      z-index: 999;
      /*margin-bottom: 30px;*/
      textarea {
        height: 16px;
        float: left;
        background-color: @com-input-bg;
        border: 1px solid @com-solidS2-bg;
        width: calc(100% - 110px);
        /*width:472px;*/
        color: @com-input-color-sr;
        resize: none;
        overflow-y: auto;
        font-size: @font - 2;
        padding: 10px;
      }
      .textarea-focus {
        /*outline: none;*/
        color: @com-input-color-sr;
        width: calc(100% - 40px);
        height: 40px;
      }
      .text-right {
        float: left;
        margin-left: 16px;
        i {
          cursor: pointer;
          color: @com-buttonIco-M-color;
          &:hover {
            color: @com-buttonIco-X-color;
          }
        }
        .iconfont {
          font-size: 20px;
        }
        .icon-posi {
          font-size: 27px;
          position: relative;
          top: 3px;
          padding: 0 16px;
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
  }
</style>

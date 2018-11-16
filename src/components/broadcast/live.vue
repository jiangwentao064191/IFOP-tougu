<template>
  <div class="live-content">
    <div class="header">
      <!--下次直播预告：10:00 - 11:00-->
      <el-button class="comit-btn" type="primary" v-if="isLive" @click="liveRoom"><i class="iconfont icon-zhibo"></i>开始直播
      </el-button>
    </div>

    <div class="live-cont" v-if="!isLive  && status != 'unopened'">
      <!--<div class="live-list clearfix" v-if="!videos">
        &lt;!&ndash; <el-badge class="mine-menu-block">
         <div class="">
             <img class="menu-img" :src="$store.state.isDev + '/static/icon/img_zx1@2x.png'"/>
             <div class="mine-menu-name">课件</div>
           </div>
         </el-badge>
         <el-badge class="mine-menu-block">
           <div class="">
             <img class="menu-img" :src="$store.state.isDev + '/static/icon/img_zx1@2x.png'"/>
             <div class="mine-menu-name">视频</div>
           </div>
         </el-badge>&ndash;&gt;
      &lt;!&ndash;  <el-badge class="mine-menu-block">
          <div class="" @click="liveRoom">
            <img class="menu-img" :src="$store.state.isDev + '/static/icon/img_zb@2x.png'"/>
            <div class="mine-menu-name">直播</div>
          </div>
        </el-badge>&ndash;&gt;
        &lt;!&ndash; <el-badge class="mine-menu-block">
           <div class="">
             <img class="menu-img" :src="$store.state.isDev + '/static/icon/img_zb@2x.png'"/>
             <div class="mine-menu-name">音频</div>
           </div>
         </el-badge>
         <el-badge class="mine-menu-block">
           <div class="">
             <img class="menu-img" :src="$store.state.isDev + '/static/icon/img_zx@2x.png'"/>
             <div class="mine-menu-name">电话连线</div>
           </div>
         </el-badge>
         <el-badge class="mine-menu-block">
           <div class="">
             <img class="menu-img" :src="$store.state.isDev + '/static/icon/img_zb@2x.png'"/>
             <div class="mine-menu-name">白班直播</div>
           </div>
         </el-badge>&ndash;&gt;
      </div>-->
      <player :video-url="videos" :isPlay="isPlay" :aspectR="''" :videoType="videoType" class="video-sty"></player>
    </div>
    <div class="wait" v-if="!isLive && status === 'unopened'">
      <div class="box">
        <img class="wait-img" src="../../assets/img/wait.svg" alt=""/>
        <div class="wait-pro">直播等待中...</div>
        <div>
          <!-- <span>{{this.$route.query.starttime|sliceTime}}</span>~
           <span>{{this.$route.query.endtime |sliceTime}}</span>
           <span>{{this.$route.query.titleName}}</span>-->
        </div>
      </div>
    </div>

    <!-- <div class="sj-line" v-if="!videos" :class="{'sj-fixed':!isChat}">
       <div class="sj-bg" @click="isChat = !isChat">
         <div :class="{'sj-up':isChat,'sj-down':!isChat}">
         </div>
       </div>
     </div>-->
    <div class="consul-tation" v-if="isLive">
      <div class="chat-main" id="msg">
        <div class="consulta-list clearfix"
             :class="{'chat-content-left':user.user_id != item.sender,'chat-content-right':user.user_id == item.sender}"
             v-for="(item,index) in queryMsgList">
          <p class="chat-time" v-if="item.timeshow">{{item.msg_time | toTime}}</p>
          <img class="chat-head-img" v-if="user.user_id != item.sender" :src="item.head"
               :onerror="$store.state.peoplegerror">
          <img class="chat-head-img" v-if="user.user_id == item.sender" :src="user.head"
               :onerror="$store.state.peoplegerror">
          <div class="chat-cont clearfix">
            <div class="chat-name">
              {{item.nickname}}
            </div>
            <div>
              <div class="sj"></div>
              <div class="chat-cont-text" v-html="item.msg_content">
              </div>
            </div>

          </div>
        </div>
        <!-- <div class="consulta-list chat-content-left clearfix">
           <img class="chat-head-img" src="../../assets/img/people.png">
           <div class="chat-cont clearfix">
             <div class="chat-name">
               莉莉
             </div>
             <div>
               <div class="sj"></div>
               <div class="chat-cont-text">
                 海立股份600619，请问股改情况及未来走势如何？
               </div>
             </div>

           </div>
         </div>-->
      </div>
      <div class="my-chat">
        <div class="chat-comment clearfix">
          <div class="content-emoji">
            <div id="emoji" v-show="showemoji">
              <vue-sina-emotion
                :source="emotions"
                :map="map"
                @change="changeMoji">
              </vue-sina-emotion>
            </div>
          </div>
          <div class="button-block">
        <span class="icon-btn">
          <img src="../../assets/img/zx_icon_face@2x.png" id="openEmojiId" @click="showemoji = !showemoji"/>
        </span>
          </div>
          <!--oninput="this.innerHTML = this.innerText"-->
          <div contenteditable="true" class="in-content" id="liveContentid"
               @keydown="towrite($event)">
          </div>

          <el-button class="release-btn" size="small" @click="senComment">发送</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import VueSinaEmotion from 'vue-sina-emotion';
  import {emoji} from '../../assets/js/emoji'
  import {
    sendMessageAPI,
    mediaCastPushAPI,
    getNewMessageAPI,
    getChatRoomIdAPI,
    setAlwaysAPI,
    FindChannelStatusAPI
  } from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'
  import player from '../system/player'

  export default {
    name: "live",
    props: [
      "notice",
      "status",
      "isLive",
      "roomId",
      "courseid",
      "videos",
    ],
    data() {
      return {
        isPlay: true,
        isChat: true,
        showemoji: false,
        emotions: emoji,
        sessionId: '',
        user: '',
        videoType: '',
        // videos:'http://pullhls68ee9b8a.live.126.net/live/3d86d812ac074c1abac0e925b1361f3f/playlist.m3u8',
        // videos: 'rtmp://v68ee9b8a.live.126.net/live/113b5df2e44c44c38291a7fbbccfae3e',
        // liveId: '651',
        start: '0',
        queryMsgList: [],
        status: '',
      }
    },
    components: {
      VueSinaEmotion,
      player
    },
    created() {
      // 点击其他不在的区域触发事件
      console.log('fasdf', this.isLive)
      document.addEventListener('click', (e) => {
        let div = document.getElementById('emoji');
        // console.log('div', div)
        if (div) {
          if (!div.contains(e.target) && e.target.id != 'openEmojiId') {
            this.showemoji = false;
          }
        }
      })
    },
    mounted: function () {
      let _this = this;
      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      _this.getChannelStatus();
    },

    methods: {
      getChannelStatus() {
        let _this = this;
        const url = this.$route.query.url;
        const value = url.substring(url.length - 4);
        // if ((_this.status = "opened")) return false;
        if (value == "m3u8") {
          send.ajaxSend({
            url: FindChannelStatusAPI,
            data: {
              courseId: this.$route.query.courseid
            },
            success: data => {
              if (data.status.status === "0") {
                _this.status = "unopened";
                send.ajaxSend({
                  url: mediaCastPushAPI,
                  data: {
                    courseId: this.$route.query.courseid
                  },
                  success: dataResult => {
                    _this.videos = dataResult.vcloudchannel.hlspullurl;
                  }
                });
                setTimeout(function () {
                  _this.getChannelStatus();
                }, 5000);
              } else if (data.status.status === "1" || data.status.status === "3") {
                _this.status = "opened";
              }
            }
          });
        } else {
          _this.status = "opened";
        }
      },
      getRoomId: function () {
        let _this = this;
        send.ajaxSend({
          url: getChatRoomIdAPI,
          data: {
            session_id: _this.sessionId,
            course_id: _this.courseid,
          },
          success: function (data) {
            console.log('getChatRoomIdAPI', data);
            _this.roomId = data.room_id;
            _this.newmessage();
          }
        })
      },
      liveRoom: function () {
        let _this = this;
        if (_this.status == "opened") {
          _this.$message({
            type: 'warning',
            message: '直播窗口已开启!'
          });
          return false;
        } else if (_this.status == 'livebroadcast') {
          _this.$message({
            type: 'warning',
            message: '直播已结束，视频正在录制中!'
          });
          return false;
        } else if (_this.status == 'closed') {
          _this.$message({
            type: 'warning',
            message: '直播已结束!'
          });
          return false;
        }
        send.ajaxSend({
          url: mediaCastPushAPI,
          thisVue: _this,
          // sourceType: 'live',
          data: {
            courseid: _this.courseid,
          },
          success: function (data) {
            /*  console.log('liveRoomdata', data);
              console.log('f_pushurl=', data.data.f_pushurl);
              console.log('f_rtmppullurl=', data.data.f_rtmppullurl);
              console.log('f_httppullurl=', data.data.f_httppullurl);
              console.log('f_hlspullurl=', data.data.f_hlspullurl);*/
            console.log('liveRoomdata', data.vcloudchannel.pushurl);
            _this.$emit("getLiveCid", data.vcloudchannel.cid);
            _this.setAlways(data.vcloudchannel.cid);
            var param = {rtmp_url: data.vcloudchannel.pushurl, cid: data.vcloudchannel.cid, courseid: _this.courseid};
            startPush(param, function (info) {
              var resultCode = info.resultCode;
              var resultStr = info.resultStr;
              console.log(resultStr);
            });
            // start_push('rtmp://p68ee9b8a.live.126.net/live/31a88600ae2748a3b22c7d27cb974f2b?wsSecret=1403d1c64e7e5b379bb9425f4dbbee29&wsTime=1533634433');
          }
        })
      },
      setAlways: function (cid) {
        send.ajaxSend({
          url: setAlwaysAPI,
          // sourceType: 'live',
          data: {
            "cid": cid,
            "needRecord": 1
          },
          success: function (data) {

          }
        });
      },
      //新消息
      newmessage: function () {
        let _this = this;
        send.ajaxSend({
          url: getNewMessageAPI,
          data: {
            topic: 'live_chat_' + _this.roomId,
            user_id: _this.user.user_id,
            start: _this.start,
            max: 50
          },
          success: function (data) {
            if (data.eventflows.length > 0) _this.start = data.event_no;
            for (let i = 0; i < data.eventflows.length; i++) {
              let that = data.eventflows[i];
              if (that.event.chat_room_id === _this.roomId) {
                if (_this.queryMsgList.length > 0 && that.event.msg_time < Number(_this.queryMsgList[_this.queryMsgList.length - 1].msg_time) + 5 * 60 * 1000) {
                  that.event.timeshow = false
                } else {
                  that.event.timeshow = true
                }
                that.event['isShow'] = false;
                _this.queryMsgList.push(that.event);
                console.log('that.event', _this.queryMsgList)
              }
            }
            _this.newmessage();
            //  console.log('轮询data', data);
          }
        })
      },
      //滚动条到底部
      scrollToBottom: function () {
        this.$nextTick(() => {
          let div = document.getElementById('msg');
          div.scrollTop = div.scrollHeight
        })
      },
      // 回车发送信息
      towrite: function (e) {
        if (e.key === 'Enter') {
          this.senComment(e);
        }
      },
      map: function (data) {
        this.emotionsMap = data;
      },
      // 表情
      changeMoji: function (data) {
        let div = document.getElementById('liveContentid');
        div.innerHTML += '<img src="' + data.url + '" alt="">';
        div.focus();
        var range = window.getSelection();//创建range
        range.selectAllChildren(div);//range 选择obj下所有子内容
        range.collapseToEnd();//光标移至最后
        this.showemoji = false
      },
      senComment(e) {
        e.preventDefault();//阻止默认的行为发生
        let div = document.getElementById('liveContentid');
        let _this = this;
        if (div.innerHTML.replace(/&nbsp;/g, '') === '' || div.innerHTML.replace(/&nbsp;/g, '') === null) {
          _this.$message({
            message: '无法发送空信息',
            type: 'warning'
          });
          div.innerHTML = '';
          this.chatInfo = '';
          div.focus()
        } else {
          _this.divloding = true;
          send.ajaxSend({
            url: sendMessageAPI,
            data: {
              session_id: _this.sessionId,
              room_id: _this.roomId,
              msg_content: encodeURIComponent(encodeURIComponent(div.innerHTML)),
              chat_topic: 'live_chat_' + _this.roomId,
              user_name: 'mcy'
            },
            success: function (data) {
              div.innerHTML = '';
              this.chatInfo = '';
              div.focus();
            }
          })
        }
      },
    },

    watch: {
      roomId: function (value) {
        if (value !== '' && value !== null) {
          this.roomId = value;
          console.log('roomid', this.roomId)
          this.newmessage()
        }
      },
      queryMsgList: function () {
        this.scrollToBottom();
      },

      videos: function (value) {
        if (value) {
          let str = value.substr(0, 4);
          if (str == 'rtmp') {
            this.videoType = 'rtmp/mp4';
          } else if (str == 'http') {
            let lastStr = value.substr(value.length - 4, 4);
            if (lastStr == 'm3u8') {
              this.videoType = 'application/x-mpegURL';
            } else {
              // this.isPlay = false;
              this.videoType = 'video/mp4';
            }

          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  .live-content {
    height: 100%;
    border-right: 1px solid @com-solidS1-bg;
    .header {
      color: @com-h1S1-font;
      background-color: @com-module-title-bg;
      height: 40px;
      line-height: 40px;
      padding-left: 30px;
      .comit-btn {
        margin-top: 5px;
        margin-right: 20px;
      }
      /deep/ .el-button--primary {
        float: right;
        color: @com-button-Sx-font;
        background-color: @com-button-Sx-bg;
        border-color: @com-button-Sx-border;
        width: 90px;
        height: 30px;
        line-height: 28px;
        padding: 0;
        font-size: 12px;
        /*margin-top: 30px;*/
      }
      .icon-zhibo {
        font-size: 18px;
        float: left;
        margin-left: 6px;
        line-height: 28px;
      }
    }
    .wait {
      height: calc(100% - 40px);
      background-color: @com-module-bg;
      text-align: center;
      .box {
        position: absolute;
        top: 36%;
        left: 30%;
      }
      .wait-img {
        width: 51px;
        height: 56px;
      }
      .wait-pro {
        margin-top: 10px;
      }
    }
    .live-cont {
      height: calc(100% - 40px);
      background-color: transparent;
      .video-sty {
        height: 100%;
        /*overflow: scroll;*/
        /*width: 100%;*/
        /*height: 20%;*/
        /deep/ .player {
          height: 100%;
        }
        /deep/ .video-player {
          height: 100%;
          /* width: 400px;
            height: 120px;*/
        }
        /deep/ .vjs_video_3-dimensions {
          height: 100%;
        }
      }
      .mine-menu-block {
        img {
          width: 80px;
        }
      }
      .el-badge {
        float: left;
        margin: 8px 42px;
        width: 210px;
        height: 125px;
        padding: 20px 10px;
        text-align: center;
        position: relative;
        border-radius: 10px;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          background: #323745;
        }
        .menu-img {
          margin-top: 10px;
        }
        .tip-mine-menu {
          width: 100%;
          text-align: center;
          color: @com-sizeS1-color;
          position: absolute;
          top: 0;
          padding: 10px 0;
          left: 0;
          font-size: 14px;
        }
        .mine-menu-name {
          padding: 10px 20px;
        }
        .mine-menu-span {
          color: #BDBDBD;
          font-size: 14px;
        }
      }
    }
    .sj-fixed {
      position: fixed;
      bottom: 0;
      width: 70% !important;
    }
    .sj-line {
      height: 10px;
      line-height: 10px;
      width: 100%;
      text-align: center;
      background-color: #000;
      .sj-bg {
        width: 52px;
        text-align: center;
        display: inline-block;
        vertical-align: top;
        background-color: white;
        border-radius: 2px;
        cursor: pointer;
        .sj-up {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid @com-solidS1-bg;
          display: inline-block;
          vertical-align: top;
          margin-top: 1px;
        }
        .sj-down {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 8px solid @com-solidS1-bg;
          display: inline-block;
          vertical-align: top;
        }
      }
    }
    .consul-tation {
      height: calc(100% - 40px);
      background-color: @com-chat-bg;
      .chat-main {
        overflow-y: scroll;
        height: calc(100% - 200px);
        .chat-time {
          color: @com-h4s4-font;
          line-height: 38px;
          height: 38px;
          text-align: center;
        }
        .chat-content-left {
          text-align: left;
          padding-left: 10px;
          margin: 15px 0px;
          .chat-head-img {
            width: 30px;
            height: 30px;
            border-radius: 3px;
            float: left;
            margin-top: 10px;
          }
          .chat-cont {
            margin-left: 12px;
            position: relative;
            font-size: @font - 4;
            color: @com-h3-font;
            float: left;
            .chat-name {
              margin-bottom: 5px;
              font-size: @font - 4;
            }
            .sj {
              position: absolute;
              width: 0;
              height: 0;
              border-top: 0px solid transparent;
              border-bottom: 10px solid transparent;
              border-right: 8px solid @com-chat-user-bg;
              left: -6px;
              top: 23px;
            }
            .chat-cont-text {
              max-width: 550px;
              padding: 10px 15px;
              background: @com-chat-user-bg;
              border-radius: 5px;
              display: inline-block;
              vertical-align: top;

              word-break: break-all;
              overflow: auto;
            }
          }

        }
        .chat-content-right {
          text-align: left;
          padding-left: 10px;
          padding-right: 20px;
          margin: 15px 0px;
          .chat-head-img {
            width: 30px;
            height: 30px;
            border-radius: 3px;
            float: right;
            margin-top: 10px;
          }
          .chat-cont {
            //max-width: 550px;
            margin-left: 12px;
            margin-right: 16px;
            position: relative;
            font-size: @font - 4;
            color: @com-h3-font;
            float: right;
            .chat-name {
              margin-bottom: 5px;
              font-size: @font - 4;
              text-align: right;
            }

            .sj {
              position: absolute;
              width: 0;
              height: 0;
              border-top: 0px solid transparent;
              border-bottom: 10px solid transparent;
              border-left: 8px solid @com-chat-teacher-bg;
              right: -6px;
              top: 23px;
            }
            .chat-cont-text {
              max-width: 550px;
              padding: 10px 15px;
              background: @com-chat-teacher-bg;
              border-radius: 5px;
              display: inline-block;
              vertical-align: top;
              float: right;
              word-break: break-all;
              overflow: auto;
            }
            .chat-no-see {
              display: inline-block;
              position: absolute;
              right: 0px;
              bottom: 3px;
            }
          }

        }
      }
      .my-chat {
        height: 200px;
        border-top: 1px solid @com-solidS1-bg;
        .icon-expression {
          padding: 10px 20px;
          .iconfont {
            font-size: 20px;
            &:first-child {
              margin-right: 10px;
            }
          }
        }
        .chat-comment {
          padding: 0 20px 0px;
          position: relative;
          height: 100%;
          #emoji {
            background: @com-module-bg;
            position: absolute;
            width: 300px;
            /*height: 200px;*/
            padding: 10px 5px;
            bottom: 166px;
            color: @com-h3-font;

          }
          .button-block {
            cursor: default;
            .icon-btn {
              display: inline-block;
              padding: 10px;
              padding-bottom: 5px;
              cursor: pointer;
              img {
                width: 20px;
              }
              .icon-yanjing {
                font-size: 24px;
                margin-left: 10px;
              }
            }
          }
          .in-content {
            height: 100px;
            border: none;
            outline: none;
            overflow: auto;
            font-size: @font - 2px;
            padding: 0 10px;
            color: @com-input-color-sr;
            span {
              white-space: normal;
            }
          }
          .release-btn {
            float: right;
            margin-top: 10px;
            margin-right: 20px;
            color: @com-button-Co-font;
            background-color: transparent;
            border: 1px solid @com-button-Co-border;
            font-size: 14px;
          }
        }

      }
    }
  }

</style>

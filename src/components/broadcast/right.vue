<template>
  <div class="right-content">
    <div class="right-heder clearfix">
      <li class="tab-li tab-active" v-if="isLive">
        用户({{userList.length}})
      </li>
      <li class="tab-li tab-active" v-if="!isLive">
        用户交流
      </li>
      <!-- <li class="tab-li">
         小纸条
       </li>
       <li class="tab-li">
         课程作业
       </li>
       <li class="tab-li">
         投票
       </li>
       <li class="tab-li">
         选股榜
       </li>-->
      <i class="iconfont icon-huanyihuan" v-if="isLive" @click="refreshUserList"></i>
    </div>
    <div class="user-list clearfix" v-if="isLive">
      <div class="list-li" v-for="(item,i) in userList" :key="i">
        <img :src="item.user.head?item.user.head:'./static/img/defaultHead.png'" :onerror="$store.state.headDefault">
        <p>{{item.user.nickname?item.user.nickname:item.user.user_id}}</p>
      </div>
      <!--<div class="list-li">
        <img src="">
        <p>qq</p>
      </div>-->
    </div>
    <div class="consul-tation" v-if="!isLive">
      <div class="chat-main" id="msg">
        <div class="consulta-list clearfix"
             :class="{'chat-content-left':user.user_id != item.sender,'chat-content-right':user.user_id == item.sender}"
             v-for="(item,index) in queryMsgList">
          <p class="chat-time" v-if="item.timeshow">{{item.msg_time | toTime}}</p>
          <img class="chat-head-img" v-if="user.user_id != item.sender" :src="item.head" :onerror="$store.state.peoplegerror">
          <img class="chat-head-img" v-if="user.user_id == item.sender" :src="user.head" :onerror="$store.state.peoplegerror">
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
    getNewMessageAPI,
    getChatRoomIdAPI,
    chatRoomMemberAPI
  } from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'
  import player from '../system/player'

  export default {
    name: "right",
    props: [
      "courseid",
      "isLive",
      "roomId"
    ],
    data() {
      return {
        user: '',
        sessionId: '',
        userList: [],
        showemoji: false,
        emotions: emoji,
        start: '0',
        queryMsgList: [],
      }
    },
    components: {
      VueSinaEmotion,
      player
    },
    created() {
      // 点击其他不在的区域触发事件
      document.addEventListener('click', (e) => {
        let div = document.getElementById('emoji');
        // console.log('div', div)
        if (div) {
          if (!div.contains(e.target) && e.target.id != 'openEmojiId') {
            this.showemoji = false;
          }
        }
      });

    },
    mounted: function () {
      let _this = this;
      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      // _this.getRoomId();
      console.log('user0000',_this.user);
    },
    methods: {
      refreshUserList:function(){
        this.getUserList();
      },
      getUserList: function () {
        let _this = this;
        send.ajaxSend({
          url: chatRoomMemberAPI,
          thisVue: _this,
          data: {
            room_id: _this.roomId
          },
          success: function (data) {
            console.log('getUserList', data);
            _this.userList = data.datalist
          }
        })
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
            _this.getUserList();
            /*  setInterval(function () {
                _this.getUserList();
              }, 5000)*/
          }
        })
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
    computed: {
      rcid() {
        const { roomId , isLive } = this
        return {
          roomId,
          isLive
        }
      }
    },
    watch: {
      queryMsgList: function () {
        this.scrollToBottom();
      },
      rcid: {
        handler: function(val) {
          // console.log('address change: ', val)
          this.roomId = val.roomId;
          this.isLive = val.isLive;
          // console.log('rooooo',this.roomId,this.isLive)
          if(this.roomId){
            if(this.isLive){
              this.getUserList();
            }else{
              this.newmessage();
            }
          }

        },
        deep: true
      },
    /*  roomId: function (value) {
        if (value !== '' && value !== null) {
          this.roomId = value;
          console.log('roomid', this.roomId);
          this.newmessage();
          this.getUserList();
        }
      },*/
    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  .right-content {
    position: relative;
    left: 0;
    height: 100%;
    width: 100%;
    .right-heder {
      height: 40px;
      line-height: 40px;
      background-color: @com-module-title-bg;
      .icon-huanyihuan{
        font-size: 24px;
        line-height: 40px;
        position: absolute;
        right: 20px;
        cursor: pointer;
        &:hover{
          color: @com-buttonIcoLive-X-color;
        }
      }
      .tab-li {
        float: left;
        padding: 0 18px;
        cursor: pointer;
        color: @com-tab-M-color;
        &:hover {
          border-bottom: 1px solid @com-tab-X-border;
          color: @com-tab-X-color;
        }
      }
      .tab-active {
        border-bottom: 1px solid @com-tab-A-border;
        color: @com-tab-A-color;
      }
    }
    .user-list {
      background-color:transparent;
      display: inline-block;
      vertical-align: top;
      position: absolute;
      left: 0;
      top: 42px;
      .list-li {
        float: left;
        padding: 10px;
        text-align: center;
        img {
          width: 42px;
          height: 42px;
          border-radius: 24px;
        }
        p {
          font-size: @font - 4;
          color: @com-h3-font;
        }
      }
    }
    .consul-tation {
      height: calc(100% - 56px);
      width: 100%;
      .chat-main {
        text-align: left;
        overflow-y: scroll;
        height: 70%;
        width: 100%;
        display: inline-block;
        vertical-align: top;
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
              max-width: 366px;
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
            //max-width: 366px;
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
              max-width: 366px;
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
        /*height: calc(100% - 100px);*/
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
          padding: 0 10px 0px;
          position: relative;
          #emoji {
            background: @com-module-bg;
            position: absolute;
            width: 300px;
            /*height: 200px;*/
            padding: 10px 5px;
            bottom: 166px;
            color:  @com-h3-font;

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
            height: 80px;
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
            margin-bottom: 15px;
            margin-right: 10px;
            color:@com-button-Co-font;
            background-color: transparent;
            border: 1px solid @com-button-Co-border;
            font-size: 14px;
          }
        }

      }
    }
  }

</style>

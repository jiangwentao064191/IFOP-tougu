<template>
  <div style="height: 100%;">
    <div class="main-left">
      <li class="friends-list" v-if="!chatRoomList.length">
        <div class="no-info">
          <img class="no-data-img" src="@/assets/img/live/noPlay.png" alt="">
          <span class="no-data">暂无数据</span>
        </div>

      </li>
      <li class="friends-list clearfix" :class="{'friends-active':roomId == item.room_id}" v-for="item in chatRoomList"
          @click="openChat(item.room_id,item.user.user_id)">
        <div class="news-num" v-if="item.msg_count > 0">{{item.msg_count}}</div>
        <img class="header-img" :src="item.user.head">
        <p class="list-name">
          <span class="nick-name">{{item.user.name}}</span>
          <!--<span class="list-time">{{item.msg_time | formaDateTime}}</span>-->
        </p>
        <!-- <div class="list-cont" v-html="item.msg_content" style="-webkit-box-orient: vertical;"></div>-->
      </li>
      <!--<li class="friends-list clearfix" @click="openChat(123)">
           <div class="news-num">2</div>
           <img src="item.room_head">
           <p class="list-name"><span class="nick-name">ss</span><span class="list-time">123</span>
           </p>
           <p class="list-cont">ff</p>
         </li>-->
    </div>
    <div class="main-content">
      <div class="chat">
        <div class="chat-header">
          <span class="chat-name">{{msgName}}</span>
          <!--<i class="iconfont icon-huiyuan icon-color"></i>-->
          <span class="chat-regist-time" v-if="msgRegisTime">注册时间：{{msgRegisTime | getYMD}}</span>
          <!--<img class="chat-watch" src="/assets/img/logo.png">
          <img class="chat-img1" src="/assets/img/logo.png">-->
        </div>
        <div class="chat-main" id="msg">

          <div class="clearfix"
               :class="{'chat-content-left':user.user_id != item.sender,'chat-content-right':user.user_id == item.sender}"
               v-for="(item,index) in queryMsgList">
            <p class="chat-time" v-if="item.timeshow">{{item.msg_time | toTime}}</p>
            <i class="el-icon-circle-check iconcheck" :class="{'ischecked': item.isShow}" v-if="!isChat"
               @click="addMsgList(item,index)"></i>
            <img class="chat-head-img" v-if="user.user_id != item.sender" :src="msgHeadUrl">
            <img class="chat-head-img" v-if="user.user_id == item.sender" :src="user.head">
            <div class="chat-cont clearfix">
              <div class="sj"></div>
              <div class="chat-cont-text" v-html="item.msg_content">
              </div>
            </div>
          </div>

          <!-- <div class="chat-content-right clearfix">
             <p class="chat-time">11:55</p>
             <i class="el-icon-circle-check iconcheck" v-if="!isChat"></i>
             <img class="chat-head-img" src="/assets/img/logo.png">
             <div class="chat-cont clearfix">
               <div class="sj"></div>
               <div class="chat-cont-text">海立股份600619，请问股改情况及未来走势如何？海立股份600619，</div>
               &lt;!&ndash;<div class="chat-no-see">未读</div>&ndash;&gt;
             </div>
           </div>-->

          <!--<div class="chat-content-left clearfix">
            <img class="chat-head-img" src="/assets/img/logo.png">
            <div class="chat-cont clearfix">
              <div class="sj"></div>
              <div class="chat-cont-text">海立股份600619，请问股改情况及未来走势如何？海立股份600619，</div>
             &lt;!&ndash; <div class="chat-no-see">未读</div>&ndash;&gt;
            </div>
          </div>-->
        </div>
        <div class="my-chat">
          <!--<div class="icon-expression">
            <i class="iconfont icon-emoji"></i>
            <i class="iconfont icon-yanjing"></i>
          </div>-->
          <div class="chat-comment clearfix" v-if="isChat">
            <!--<emoji-input @changeComment="changeComment" @getComment="getComment"></emoji-input>-->
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
          <!--<i class="iconfont icon-yanjing" @click="isChat = false"></i>-->
        </span>
            </div>
            <!-- <div contenteditable="true" class="in-content" id="contentid" oninput="this.innerHTML = this.innerText"
                  @keydown="towrite($event)">
             </div>-->
            <div contenteditable="true" class="in-content" id="contentid"
                 @keydown="towrite($event)">
            </div>

            <!--<el-button class="release-btn" size="small" @click="">结束问答</el-button>-->
            <el-button class="release-btn" size="small" @click="senComment">发送</el-button>
          </div>
          <div class="open-message" v-if="!isChat">
            <i class="el-icon-circle-check open-icon" @click="openAnswer"></i>
            <i class="el-icon-circle-close open-icon" @click="isChat = true"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    customerChatRoomAPI,
    sendMessageAPI,
    getQueryMsgAPI,
    getNewMessageAPI,
    addQueryAPI,
    addNewMsgAPI,
    setMsgCountAPI
  } from '../../assets/apiRegular'
  import send from '../../assets/js/ajaxSend'
  import '../../assets/style/consultation.less'
  import emojiInput from "./emojiInput"

  import VueSinaEmotion from 'vue-sina-emotion';
  import {emoji} from '../../assets/js/emoji'

  export default {
    data() {
      return {
        showemoji: false,
        emotions: emoji,
        start: '0',
        canSend: true,
        tabIndex: 1,
        myComment: '',
        isChat: true,
        chatInfo: '',
        sessionId: '',
        user: '',
        roomId: '',
        chatRoomList: [],
        pageNo: 1,
        totalpage: 1,
        queryMsgList: [],
        msgName: '',
        msgHeadUrl: '',
        msgRegisTime: '',
        msgList: [],
        msgUsrid: '',
        getMess: true,
        chatRoomIdArr: [],
        fistMess:true,
        fistNewMess:true,
      };
    },
    components: {
      // emojiInput,
      VueSinaEmotion
    },
    name: "consulta",

    beforeCreate: function () {

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
      })
    },
    mounted: function () {
      let _this = this;
      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      _this.newmessage();
      _this.getChatRoomList();

    },
    methods: {
      removeMsgCount: function (formId) {
        let _this = this;
        send.ajaxSend({
          url: setMsgCountAPI,
          thisVue: _this,
          data: {
            msg_from: formId,
            user_id: _this.user.user_id
          },
          success: function (data) {

          }
        })
      },
      addMsgList: function (obj, index) {
        obj.isShow = !obj.isShow;
        this.$set(obj, index);
        // console.log('obj',obj,obj.isShow)
      },
      openAnswer: function () {
        let _this = this;
        _this.msgList = [];
        _this.queryMsgList.forEach((item, index) => {
          if (item.isShow) {
            _this.msgList.push(item);
          }
        });
        console.log('msgLIst', _this.msgList);
        send.ajaxSend({
          url: addQueryAPI,
          thisVue: _this,
          data: {
            msg_list: _this.msgList,
            session_id: _this.sessionId
          },
          success: function (data) {
            console.log('data', data);
            _this.isChat = true;
          }
        })
      },
      getChatRoomList: function () {
        let _this = this;
        send.ajaxSend({
          url: customerChatRoomAPI,
          thisVue: _this,
          data: {
            //  'session_id': _this.sessionId,
            'user_id': _this.user.user_id
          },
          success: function (data) {
            if (data.datalist) {
              _this.chatRoomList = data.datalist;
              _this.chatRoomIdArr = [];
              for (var i = 0; i < _this.chatRoomList.length; i++) {
                _this.chatRoomIdArr.push(_this.chatRoomList[i].room_id)
              }
              /* for(let i = 0;i<_this.chatRoomList.length;i++){
                 _this.chatRoomList.num = '0';
               }*/
              if (_this.roomId) {

              } else {
                _this.openChat(_this.chatRoomList[0].room_id, null);
              }
            }
            setTimeout(function () {
              _this.getChatRoomList();
            }, 5000);
            /*setInterval(function () {
              _this.getChatRoomList();
            }, 5000);*/
          }
        });

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
        let div = document.getElementById('contentid');
        div.innerHTML += '<img src="' + data.url + '" alt="">';
        div.focus();
        var range = window.getSelection();//创建range
        range.selectAllChildren(div);//range 选择obj下所有子内容
        range.collapseToEnd();//光标移至最后
        this.showemoji = false
      },
      //滚动条到底部
      scrollToBottom: function () {
        this.$nextTick(() => {
          let div = document.getElementById('msg');
          div.scrollTop = div.scrollHeight
        })
      },
      openChat(roomId, otherId) {
        let _this = this;
        if (_this.roomId != roomId) {
          let div = document.getElementById('contentid');
          div.innerHTML = '';
          _this.roomId = roomId;
          if (_this.fistMess) {
            _this.fistMess = false;
          //  _this.newmessage();
          }
          let thisObj = _this.chatRoomList.find(function (x) {
            return x.room_id === roomId
          });
          let thisIndex = _this.chatRoomList.indexOf(thisObj);
          _this.start = 0;
          _this.queryMsgList = [];
          _this.msgName = _this.chatRoomList[thisIndex].user.name;
          _this.msgHeadUrl = _this.chatRoomList[thisIndex].user.head;
          _this.msgRegisTime = _this.chatRoomList[thisIndex].user.register_time;
          _this.msgUsrid = _this.chatRoomList[thisIndex].user.user_id;
          _this.chatRoomList[thisIndex].msg_count = 0;
          _this.getQueryMsg(roomId);
        }
        if (otherId) {
          _this.removeMsgCount(otherId);
        }
        let div = document.getElementById('contentid');
        div.focus();
      },
      //新消息
      newmessage: function () {
        let _this = this;
        send.ajaxSend({
          url: getNewMessageAPI,
          data: {
            topic: 'chat',
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
                _this.removeMsgCount(that.event.sender);
                that.event['isShow'] = false;
                that.event.msg_count = 0;
                // _this.queryMsgList.push(that.event);
                setTimeout(function () {
                  _this.queryMsgList.push(that.event);
                },50);
                console.log('99999999999999new')
              }
            /*  for (let j = 0; j < _this.chatRoomList.length; j++) {
                let obj = _this.chatRoomList[j]
                if (that.event.chat_room_id == _this.chatRoomList[j].room_id) {
                  _this.chatRoomList[j].msg_content = that.event.msg_content;
                  _this.chatRoomList[j].msg_time = that.event.msg_time;
                }
              }*/
            }
            /*if(_this.fistNewMess){
              for (let j = 1; j < _this.queryMsgList.length; j++) {
                if (_this.queryMsgList[j].msg_time < Number(_this.queryMsgList[j - 1].msg_time) + 5 * 60 * 1000) {
                  _this.queryMsgList[j].timeshow = false
                } else {
                  _this.queryMsgList[j].timeshow = true
                }
              }
              _this.queryMsgList[0].timeshow = true;
              _this.fistNewMess = false;
            }*/
            _this.newmessage();
          }
        })
      },
      getQueryMsg(roomId) {
        let _this = this;
        send.ajaxSend({
          url: getQueryMsgAPI,
          thisVue: _this,
          data: {'room_id': roomId},
          success: function (data) {
            if (data.datalist.length > 0) {
             /* if (_this.getMess) {
                _this.getMess = false;
              } else {
                _this.queryMsgList = data.datalist.reverse();
              }*/
              _this.queryMsgList = data.datalist.reverse();
              console.log('888888')
              for (let j = 1; j < _this.queryMsgList.length; j++) {
                let obj = _this.queryMsgList[j]
                obj["sender"] = obj["user_id"];
                // obj['isShow'] = false;
              //  _this.queryMsgList[j].timeshow = true;

                if (_this.queryMsgList[j].msg_time < Number(_this.queryMsgList[j - 1].msg_time) + 5 * 60 * 1000) {
                  _this.queryMsgList[j].timeshow = false
                } else {
                  _this.queryMsgList[j].timeshow = true
                }
              }
              _this.queryMsgList[0].sender = _this.queryMsgList[0].user_id
              _this.queryMsgList[0].timeshow = true;
            } else {
              _this.queryMsgList = [];
            }
          }
        });
      },
      senComment(e) {
        let _this = this;
        if (_this.canSend) {
          _this.canSend = false;
          setTimeout(function () {
            _this.canSend = true;
          }, 500);
          e.preventDefault();//阻止默认的行为发生
          let div = document.getElementById('contentid');
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
                chat_topic: 'chat',
                msg_to: _this.msgUsrid,
              },
              success: function (data) {
                div.innerHTML = '';
                this.chatInfo = '';
                div.focus();
                _this.addMessage(data.msg_id, data.msg_time);
              }
            })
          }
        }
      },
      addMessage: function (id, time) {
        let _this = this;
        send.ajaxSend({
          url: addNewMsgAPI,
          thisVue: _this,
          data: {
            msg_id: id,
            msg_time: time,
          },
          success: function (data) {
            console.log(data)
          }
        })
      },
      getComment(data) {
        this.chatInfo = data;
        // console.log('getComment',data);
      },
      changeComment(data) {
        this.isChat = !data;
      },
    },
    watch: {
      roomId: function (value) {
        if (value !== '' && value !== null) {
          // this.newmessage()
        }
      },
      queryMsgList: function () {
        this.scrollToBottom();
      },
      chatRoomList: function (value) {
        this.chatRoomList = value;
      }
    }
  }
</script>
<style lang="less">
  .sina-emotion-panel__header {
    .tabs {
      .tabs__item {
        width: 96px;
        height: 33px;
        line-height: 33px;
        /* color: #D9BA82;
         border: 1px solid #D9BA82;*/
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        padding: 0 9px;
      }
    }
  }
</style>
<style scoped lang="less">
  @import "../../assets/style/public";

  .main-left {
    height: calc(100%);
    overflow-y: scroll;
  }

  .friends-active {
    background-color: #3C3C41;
  }

  .friends-list {
    .no-info {
      position: fixed;
      top: 30%;
      .no-data {
        margin-top: 130px;
        margin-left: -75px;
        display: inline-block;
        vertical-align: top;
        color: @com-h4s4-font;
      }
      .no-data-img {
        margin-left: 60px;
      }
    }

    .list-name {
      color: @com-h1S2-font;
      margin-top: 12px;
    }
  }

  .main-content {
    border-top: 1px solid @com-solidS1-bg;
    height: calc(100% - 1px);
    .chat {
      height: 100%;
      background: @com-module-bg;
    }
    .icon-color {
      color: @com-sizeS1-color;
    }
    .chat-main {
      overflow-y: scroll;
      height: 60%;
      /*height: 300px;*/
      /*max-height: 324px;
      min-height: 324px;*/
      .iconcheck {
        float: left;
        margin-top: 12px;
        margin-right: 6px;
        font-size: 20px;
        color: @com-h3-font;
        cursor: pointer;
        &:hover {
          color: @com-buttonIcoLive-X-color;
        }
      }
      .ischecked {
        color: @com-buttonIcoLive-X-color;
      }
    }
    .my-chat {
      height: calc(40% - 42px);
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
      .open-message {
        padding: 20px;
        text-align: center;
        .open-icon {
          padding: 0 20px;
          font-size: 40px;
          color: @com-button-M-font;
          cursor: pointer;
          &:hover {
            color: @com-button-X-font;
          }
        }
      }
      .chat-comment {
        padding: 0 20px;
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
              color: @com-h1S2-font;
            }
            .icon-yanjing {
              font-size: 24px;
              margin-left: 10px;
              color: @com-h1S2-font;
            }
          }
        }
        .in-content {
          height: calc(100% - 100px);
          border: none;
          outline: none;
          overflow: auto;
          font-size: @font - 2px;
          padding: 0 10px;
          color: @com-input-color-sr;
        }
        .release-btn {
          float: right;
          margin-top: 5px;
          margin-right: 20px;
          background-color: transparent;
          color: @com-button-Co-font;
          border: 1px solid @com-button-Co-border;
          font-size: 14px;
        }
      }

    }
  }
</style>

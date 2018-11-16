<template>
  <el-container style="height: 100%">
    <el-header height="40px" v-if="this.$store.state.isUni">
      <myHeader :cid="cid" :courseid="courseid" :status="status" :name="broadcast"></myHeader>
    </el-header>
    <el-container>
      <el-main v-loading="this.$store.state.loadingContent" element-loading-background="rgba(200,200,200, 0.5)">
        <div class="router-content">
          <transition name="fade">
            <div class="consultation clearfix">
              <!--<header-div :data-info="roomDataInfo"/>-->
              <div class="live-cl">
                <live :notice="notice" :status="status" :roomId="roomId" :isLive="isLive" :courseid="courseid" :videos="videos"></live>
              </div>
              <div style="width: 35% ;height:100%;float:left;">
                <right :isLive="isLive" :roomId="roomId" :courseid="courseid"></right>
              </div>
            </div>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {getLiveRoomAPI,getChatRoomIdAPI} from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'
  import myHeader from '../system/myHeader'
  import headerDiv from './header'
  import live from './live'
  import right from './right'

  export default {
    name: "indexPage",
    data() {
      return {
        sessionId:'',
        user:'',
        roomDataInfo: {},
        tguser: {},
        notice: [],
        courseid: '',
        status:'',
        liveId:'',
        cid: '',
        isLive:true,
        roomId:'',
        videos:'',
        broadcast:'broadcast',
      }
    },
    components: {
      myHeader,
      headerDiv,
      live,
      right
    },
    beforeCreate: function () {
      this.$store.state.loadingContent = false;
      this.$store.state.loadLeftMenu = false;
      this.$store.state.nowContent = 'mine'
      //窗口最大化，如果方法报错则非壳运行
      try {
        maxWindowSize();
      } catch (e) {
        // this.$store.state.isUni = false;
      }
    },
    mounted: function () {
      let _this = this;
      // this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      // this.getLiveRoomData();
      if (_this.$route.query.courseid) {
        // _this.liveId = _this.$route.query.liveroomid;
        _this.courseid = _this.$route.query.courseid;
        _this.status = _this.$route.query.status;
        if(_this.$route.query.url){
          _this.videos = _this.$route.query.url;
          let str = _this.videos.substr(_this.videos.length - 4)
        }

        console.log('jkj',_this.videos)
        if(_this.videos ){
          _this.isLive = false;
        }
        _this.getRoomId();
      }
    },
    methods: {
      getLiveCid: function (data) {
        this.cid = data;
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
            _this.roomId = data.room_id;
            // _this.newmessage();
          }
        })
      },
      getLiveRoomData: function () {
        let _this = this;
        send.ajaxSend({
          url: getLiveRoomAPI,
          thisVue: _this,
          // sourceType: 'live',
          data: {
           id: _this.liveId,
            userid: _this.user.user_id,
          },
          success: function (data) {
            console.log('getLiveRoomAPI', data);
            _this.roomDataInfo = data.info;
            _this.tguser = data.tguser;
            _this.notice = data.notice;
          }
        })

      },
    },
    watch:{
      courseid:function (value) {
        this.courseid = value;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public.less";

  .consultation {
    height: calc(100%);
    background-color: @com-module-bg;
    .live-cl {
      height: calc(100%);
      width: 65%;
      float: left;
    }
  }

  .el-header, .el-footer {
    background: @com-title-bg;
    color: #333;
    margin: 0;
    padding: 0;
  }

  .el-main {
    background-color: @com-module-bg;
    color: @com-h3-font;
    text-align: left;
    padding: 0;
  }

  .el-main::-webkit-scrollbar, .el-aside::-webkit-scrollbar { /*滚动条整体样式*/
    width: 0; /*高宽分别对应横竖滚动条的尺寸*/
    height: 0;
  }

  .router-content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .el-aside {
    border-right: 1px solid @com-solidS1-bg;
    background-color: @com-nav-bg;
    color: #333;
    text-align: center;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

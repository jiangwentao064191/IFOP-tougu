<template>
  <div class="live-list-content" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="touzi-main">
      <router-link class="main-back back-main" to="/index/mine">
        < 返回
      </router-link>
      <span class="main-back tap-link tap-linkStyle">我的直播间</span>
      <i class="iconfont icon-huanyihuan" @click="refreshLiveList"></i>
      <div class="fb-btn" @click="toNewLive">新增直播</div>
    </div>
    <div class="list-content">
      <div class="my-list-title clearfix">
        <div class="my-title">
          我的直播间
        </div>

      </div>
      <div class="my-list clearfix">
        <div class="list-li" :class="{'delete-mg-ri': (index + 1)%4 == 0 }" v-for="(item,index) in currentList"
             @click="toLive(item.lastcourse.id,item.status)">
          <div class="li-img">
            <div class="img-bg" v-if="item.vipcode == 'B'"></div>
            <img class="vip-img" v-if="item.vipcode == 'B'" src="../../assets/img/vip-b.png">
            <span class="icon-living" v-if="item.status == 'opened'"></span>
            <!--<i class="iconfont icon-kclist_icon_bjx" @click.stop="editorInfo(item.f_id)"></i>
            <i class="iconfont icon-kclist_icon_delete" @click.stop="deleteLive(item.f_id)"></i>-->
            <img class="cover-url" :src="item.coverurl">
          </div>
          <p>{{item.name}}</p>
          <!--<p v-for="data in currentList" v-if="data.id == item.id">参与人次：{{data.count || 0}}</p>-->
        </div>

        <!-- <div class="list-li">
           <div class="li-img">
             <i class="iconfont icon-kclist_icon_bjx"></i>
             <i class="iconfont icon-kclist_icon_delete"></i>
             <img src="../../assets/img/pic_default.png">
           </div>
           <p>李元今日精准解盘</p>
         </div>>-->
      </div>
    </div>
    <div class="list-content">
      <div class="my-list-title clearfix">
        <div class="my-title">
          历史直播间
        </div>
      </div>
      <div class="my-list clearfix">
        <div class="list-li" :class="{'delete-mg-ri': (index + 1)%4 == 0 }" v-for="(item,index) in historyList"
             @click="toLive(item.lastcourse.id,item.status,item.lastcourse.coursewareurl)">
          <div class="li-img">
            <div class="img-bg" v-if="item.vipcode == 'B'"></div>
            <img class="vip-img" v-if="item.vipcode == 'B'" src="../../assets/img/vip-b.png">
            <!--<span class="icon-living" v-if="item.status == 'opened'"></span>-->
            <!-- <i class="iconfont icon-kclist_icon_bjx" @click.stop="editorInfo(item.f_id)"></i>
             <i class="iconfont icon-kclist_icon_delete" @click.stop="deleteLive(item.f_id)"></i>-->
            <div class="play">
              <img class="cover-url" :src="item.coverurl">
              <span></span>
              <img class="img-bg-gr" src="../../assets/img/play.png"/>

            </div>
          </div>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRoomListAPI, deleteliveRoomAPI, updateStatusAPI, getActivityCountAPI,addParticipantAPI} from '../../assets/apiRegular'
  import send from '../../assets/js/ajaxSend'

  export default {
    name: "liveListFirst",
    data() {
      return {
        fullscreenLoading:false,
        user: '',
        currentList: [],
        historyList: [],
        idList: [],
        countList: [],
        oldList: [],
        currentList: [],
      }
    },
    mounted: function () {
      this.$store.state.loadingContent = false;
      //this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;
    /*  if (this.$route.query.page == 'openBroadcast') {
        console.log('this.$route.query', this.$route.query)
        let _this = this;
        _this.runAsync1().then(function (data) {
          return _this.runAsync2();
        }).then(function (data) {
          return _this.runAsync3();
        })
        this.toLive(this.$route.query.courseid,'opened','',true);
      } else {
        let _this = this;
        _this.runAsync2().then(function (data) {
          return _this.runAsync3();
        })
      }*/
      let _this = this;
      _this.runAsync2().then(function (data) {
        return _this.runAsync3();
      })

    },
    methods: {
      refreshLiveList(){
        console.log('refreshLiveList');
        let _this = this;
        _this.fullscreenLoading = true;
        _this.runAsync2().then(function (data) {
          return _this.runAsync3();
        })
      },
      runAsync1() {
        let _this = this;
        var p = new Promise(function (resolve, reject) {
          _this.startLive(_this.$route.query.courseid, resolve);
        });
        return p;
      },
      runAsync2() {
        let _this = this;
        var p = new Promise(function (resolve, reject) {
          _this.getVoteList("['unopened','opened']", resolve);
        });
        return p;
      },
      runAsync3() {
        let _this = this;
        var p = new Promise(function (resolve, reject) {
          _this.getVoteList('closed', resolve);
          _this.fullscreenLoading = false;
        });
        return p;
      },
      // startLive(id, resolve) {
      //   send.ajaxSend({
      //     url: updateStatusAPI,
      //     thisVue: this,
      //     data: {
      //       courseId: id,
      //       status: "opened"
      //     },
      //     success(res) {
      //       resolve(res)
      //     }
      //   });
      // },
      openLive:function(broId,status,url=''){
        // var str = Math.random();
        let routeData = this.$router.resolve({
          name: 'broadcast',
          query: {
            courseid: broId,
            url:url,
            status:status
          }
        });
        //window.open(routeData.href, '_blank');
        createSpecialWindow({
          url: "login.html" + routeData.href,
          id: broId,
          width: 1000,
          height: 670
        });
      },
      setUser(courseid){
        let _this = this;
        send.ajaxSend({
          url:addParticipantAPI,
          data:{
            userId:_this.user.user_id,
            courseId:courseid
          },
          success:function (data) {
            console.log('addParticipantAPI',data)
          }
        })
      },
      toLive: function (broId,status,url='',newlive=false) {
        if(newlive){
          this.openLive(broId,status,url);
          this.setUser(broId);
        }else{
          if(status != "opened"){
            if(status == 'unopened'){
              // this.startLive(broId);
            }
            this.openLive(broId,status,url);
            this.setUser(broId);
          }else{
            this.$message({
              type: "warning",
              message: "直播窗口已开启!"
            });
          }
        }

      },
      getCount: function (id) {
        let _this = this;
        send.ajaxSend({
          url: getActivityCountAPI,
          data: {
            room_id: id,
            type: 'new_member'
          },
          thisVue: _this,
          success: function (data) {
            var obj = {};
            obj.id = id;
            obj.count = data.count;
            _this.countList.push(obj);
            console.log('getCount', _this.countList)
          }
        })
      },
      getVoteList: function (status, resolve) {
        console.log('fasd')
        let _this = this;
        let query = {
          //tgUserid:39387
          lecturerId: _this.user.user_id,
          pageSize: '999',
          pageNo: '1',
          type: 'livebroadcast'
        };
        if (status == 'closed') {
          query.status = status;
        } else {
          query.statuses = status;
        }
        send.ajaxSend({
          url: getRoomListAPI,
          data: query,
          success: function (data) {
            resolve();
            if (status == 'closed') {
              _this.historyList = data.courseserieslist;
              _this.historyList.forEach(function (currentValue) {
                _this.idList.push(currentValue.id)
              })
            } else {
              _this.currentList = data.courseserieslist;
              _this.currentList.forEach(function (currentValue) {
                _this.idList.push(currentValue.id)
              })
            }
            // console.log('idList', _this.idList);
          }
        })
      },
      toNewLive: function () {
        console.log('event', event.target)
        this.$router.push({name: 'newLive'});
      },
      deleteLive: function (id) {
        console.log('id', id)
        let _this = this;

        _this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          send.ajaxSend({
            url: deleteliveRoomAPI,
            data: {'id': id},
            success: function (data) {
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //  _this.getVoteList();
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      editorInfo: function (id) {
        let _this = this;
        send.ajaxSend({
          url: getRoomListAPI,
          data: {'id': id},
          success: function (data) {
            console.log('da', data.list[0])
            _this.$router.push({
              name: 'newLive',
              query: {
                liveFromDate: data.list[0]
              }
            });
          }
        });
      }
    },
  }
</script>
<style lang="less">
   .el-loading-mask{
    top: 82px;
    left: 54px;
  }
</style>
<style scoped lang="less">
  @import "../../assets/style/public";

  .live-list-content {
    height: calc(100% - 140);
    font-size: @font - 2;
    margin-bottom: 20px;
    .icon-huanyihuan{
      font-size: 24px;
      line-height: 40px;
      position: absolute;
      right: 136px;
      cursor: pointer;
      &:hover{
        color: @com-buttonIcoLive-X-color;
      }
    }
    .fb-btn {
      position: absolute;
      right: 20px;
    }
    .tap-linkStyle {
      margin-left: 20px;
    }
    .main-back {
      width: 74px !important;
    }
    .list-content {
      padding: 0 20px;
      .my-list-title {
        height: 30px;
        line-height: 30px;
        margin-top: 20px;
        .my-title {
          display: inline-block;
          vertical-align: top;
          float: left;
        }
        .fb-btn {
          float: right;
          margin-top: 4px;
          margin-right: 0;
        }
      }
      .my-list {
        .delete-mg-ri {
          margin-right: 0 !important;
        }
        .list-li {
          width: 285px;
          height: 205px;
          background-color: @com-module-bg;
          padding: 10px;
          float: left;
          margin-right: 16px;
          margin-top: 20px;
          cursor: pointer;
          .li-img {
            position: relative;
            .play {
              width: 282px;
              height: 158px;
              text-align: center;
              cursor: pointer;
              span {
                background: rgba(0, 0, 0, 0.3);
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
              }

              .img-bg-gr {
                top: 40px;
                position: absolute;
                left: 112px;
                width: 24%;
              }
            }
            .img-bg {
              width: 32px;
              height: 24px;
             /* background-color: @color-bg-radius;*/
              opacity: 0.8;
              position: absolute;
              border-top-right-radius: 10px;
              border-bottom-right-radius: 10px;
              top: 6px;
              line-height: 28px;
            }
            .vip-img {
              position: absolute;
              width: 20px;
              left: 2px;
              top: 9px;
            }
            .icon-living {
              position: absolute;
              right: 5px;
              top: 2px;
              display: inline-block;
              width: 20px;
              height: 16px;
              z-index: 3;
              margin-left: 10px;
              background-image: url(../../assets/img/course/live.svg);
              background-size: 1033% 100%;
              animation: isliving 1.2s steps(6) infinite;
            }
            @keyframes isliving {
              0% {
                background-position: 0 0;
              }
              100% {
                background-position: -194px 0;
              }
            }
            .iconfont {
              width: 32px;
              height: 32px;
              border-radius: 16px;
              background-color: #000;
              opacity: 0.8;
              text-align: center;
              line-height: 32px;
              cursor: pointer;
            }
            .icon-kclist_icon_bjx {
              position: absolute;
              right: 50px;
              top: 8px;
            }
            .icon-kclist_icon_delete {
              position: absolute;
              right: 10px;
              top: 8px;
            }
            .cover-url {
              width: 282px;
              height: 158px;
            }
          }
          p {
            line-height: 50px;
            font-size: @font - 4;
            color: @com-h4s4-font;
          }
        }
      }
    }
  }

</style>

<template>
  <el-container style="height: 100%">
    <el-header height="40px" v-if="this.$store.state.isUni">
      <myHeader></myHeader>
    </el-header>
    <el-container>
      <div class="full-mask" v-if="isShowInfo || isShowLess || isShowLive">
      </div>
      <div class="mask-tip" v-if="isShowInfo || isShowLess || isShowLive">
        <div class="top-btn">
          <div class="new-fb" v-if="isShowInfo">发布观点</div>
          <div class="new-fb" v-if="isShowLive">新建直播</div>
          <div class="new-fb" v-if="isShowLess">新建课程</div>

        </div>
        <div>
          <img class="i-see" v-if="isShowInfo" src="../../assets/img/fb-kc.png">
          <img class="i-see" v-if="isShowLess" src="../../assets/img/fb-gd.png">
          <img class="i-see" v-if="isShowLive" src="../../assets/img/fb-zb.png">
          <button class="btn1" @click="hideMask"></button>
          <button class="btn2" @click="goFb"></button>
        </div>
      </div>
      <el-aside v-if="this.$store.state.loadLeftMenu" v-loading="this.$store.state.loadingMenu" width="54px">
        <my-aside></my-aside>
      </el-aside>
      <el-main v-loading="this.$store.state.loadingContent" element-loading-background="rgba(200,200,200, 0.5)">
        <div class="router-content" v-if="true">
          <transition name="fade">
            <router-view v-if="this.$store.state.detailController.show"></router-view>
            <infor-all
              v-if="!this.$store.state.detailController.show && (this.$store.state.detailController.type == 'informationAll')"></infor-all>
            <lesson
              v-if="!this.$store.state.detailController.show && (this.$store.state.detailController.type == 'lessonList')"></lesson>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import myHeader from '../system/myHeader'
  import myAside from '../system/myMenu'
  import inforAll from '../informationAll/index'
  import lesson from '../lesson/lessonList'

  export default {
    name: "indexPage",
    data() {
      return {
        isShowInfo: this.$store.state.isShowInfo,
        isShowLess: this.$store.state.isShowLess,
        isShowLive: this.$store.state.isShowLive,
        user: {},
      }
    },
    components: {
      myHeader,
      myAside,
      inforAll,
      lesson
    },
    beforeCreate: function () {
      //窗口最大化，如果方法报错则非壳运行
      try {
        maxWindowSize();
      } catch (e) {
        // this.$store.state.isUni = false;
      }
    },
    mounted: function () {
      console.log(this.isShowInfo, this.isShowLess, this.isShowLive)
      console.log(JSON.parse(localStorage.getItem('logininfo')).user.user_id)
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;

      // this.isShowInfo = localStorage.getItem('isShowfb');
    },
    methods: {
      hideMask() {
        let _this = this;
        let guidList = JSON.parse(localStorage.getItem('userGuidList'));
        let num = 0;
        if(!guidList){
          guidList = [];
        }

          for (let i = 0;i<guidList.length;i++) {
            let item = JSON.parse(guidList[i]);

            if (item.userId == _this.user.user_id) {
              num = 1;
              let obj = {}
              obj.userId = item.userId;
              if (_this.isShowInfo) {
                _this.$store.state.isShowInfo = false;
                obj.isShowLess = item.isShowLess;
                obj.isShowLive = item.isShowLive;
                obj.isShowfb = true;
              }
              if (_this.isShowLess) {
                _this.$store.state.isShowLess = false;
                obj.isShowLess = true;
                obj.isShowLive = item.isShowLive;
                obj.isShowfb = item.isShowfb;
              }
              if (_this.isShowLive) {
                _this.$store.state.isShowLive = false;
                obj.isShowLess = item.isShowLess;
                obj.isShowLive = true;
                obj.isShowfb =item.isShowfb;
              }
              guidList.splice(i,1,JSON.stringify(obj));
              // guidList.push(JSON.stringify(obj));
              localStorage.setItem("userGuidList", JSON.stringify(guidList));
            }
          }
          if (num == 0) {
            let obj = {}
            obj.userId = _this.user.user_id;
            if (_this.isShowInfo) {
              _this.$store.state.isShowInfo = false;
              obj.isShowfb = true;
            }
            if (_this.isShowLess) {
              _this.$store.state.isShowLess = false;
              obj.isShowLess = true;
            }
            if (_this.isShowLive) {
              _this.$store.state.isShowLive = false;
              obj.isShowLive = true;
            }
            guidList.push(JSON.stringify(obj));
            localStorage.setItem("userGuidList", JSON.stringify(guidList));
          }
      },
      goFb() {
        if (this.isShowInfo) {
          this.$router.push({name: 'release'});
        }
        if (this.isShowLess) {
          this.$router.push({name: "newLesson"});
        }
        if (this.isShowLive) {
          this.$router.push({name: 'newLive'});
        }
        this.hideMask();
      },
    },
    computed: {
      getInforShow() {
        return this.$store.state.isShowInfo;
      },
      getLessShow() {
        return this.$store.state.isShowLess;
      },
      getLiveShow() {
        return this.$store.state.isShowLive;
      },
    },
    watch: {
      getInforShow(value) {
        this.isShowInfo = value;
        console.log(value)
      },
      getLessShow(value) {
        this.isShowLess = value;
        console.log(value)
      },
      getLiveShow(value) {
        this.isShowLive = value;
        console.log(value)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public.less";

  .full-mask {
    position: absolute;
    z-index: 2001;
    background-color: @com-body-bg;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.5;
  }

  .mask-tip {
    z-index: 2002;
    .top-btn {
      position: absolute;
      right: 26px;
      top: 37px;
      width: 108px;
      height: 42px;
      line-height: 42px;
      border: 2px dashed white;
      background-color: @com-module-title-bg;
      text-align: center;
      .new-fb {
        margin-left: 12px;
        margin-top: 6px;
        width: 80px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        color: @com-button-A-font;
        border: 1px solid @com-button-A-border;
        border-radius: 3px;
        font-size: 12px;
      }
    }
    .i-see {
      position: absolute;
      right: 120px;
      top: 86px;
    }
    button {
      background-color: red;
      width: 115px;
      height: 32px;
      position: absolute;
      top: 241px;
      right: 363px;
      cursor: pointer;
      opacity: 0;
    }
    .btn2 {
      right: 228px;
      width: 112px;
    }
  }

  .el-header, .el-footer {
    background: @com-title-bg;
    color: #333;
    margin: 0;
    padding: 0;
  }

  .el-main {
    background-color: @com-body-bg;
    /*color: #fff;*/
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

<template>
  <el-container style="height: 100%">
    <el-header height="40px" v-if="this.$store.state.isUni">
      <myHeader></myHeader>
    </el-header>
    <el-container>
      <el-main v-loading="this.$store.state.loadingContent" element-loading-background="rgba(200,200,200, 0.5)">
        <div class="router-content">
          <transition name="fade">
            <div class="consultation">
              <header-div/>
              <div class="consultation-cont" style="border:none;height: 100%;">
                <div>
                  <consulta></consulta>
                </div>
                <!--<div style="width: 30%;position: absolute;right: 0;">
                  <right></right>
                </div>-->
              </div>
            </div>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import myHeader from '../system/myHeader'
  import '../../assets/css/iconfont.css'
  import headerDiv from './header'
  import consulta from './consulta'
  import right from "./right";

  import {emoji} from "../../assets/js/emoji";

  export default {
    data() {
      return {
        info: '',
        emotions: emoji,
        emotion: '[表情]',
        emotionsMap: {},
        data: [],
        value: '',
      }
    },
    components: {
      myHeader,
      right,
      headerDiv,
      consulta,

    },
    name: "consultation",
    beforeCreate: function () {
      this.$store.state.loadingContent = false;
      this.$store.state.loadLeftMenu = false;
      this.$store.state.nowContent = 'mine'
      // this.$store.state.nowContent = 'consultation'
    },
    mounted: function () {

    },
    methods: {
      map: function (dat) {
        var _this = this;
        _this.emotionsMap = dat;


      },
      changeMoji: function (dat) {
        this.emotion = dat.phrase;
        this.emotionsMap = dat

        this.data.push(dat.phrase)
        this.value = ''
      }
    },
    watch: {
      'emotion': function (data) {
        console.log('eotion', data)
      }
    }
  }

</script>

<style scoped lang="less">
  @import "../../assets/style/public.less";

  .el-header, .el-footer {
    background: @com-title-bg;
    color: #333;
    margin: 0;
    padding: 0;
  }

  .el-main {
    background-color:@com-body-bg;
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
    overflow-y: hidden;
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

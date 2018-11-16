import Vue from 'vue'
import vuex from 'vuex'
import menuList from "../assets/js/menuList"
import mineMenu from '../assets/mineMenu'
import api from '../assets/api'

Vue.use(vuex);

export default new vuex.Store({
  state: {
    show: "1",
    liveStatus:false,
    api: api,
    isElectron: false,
    loadingMenu: true,
    loadingContent: true,
    nowContent: "mine",
    clNowContent: "nowCL",
    loadingCL: true,
    menuList: menuList,
    mineMenu: mineMenu,
    loadLeftMenu: true,//true显示左侧菜单，false隐藏左侧菜单
    isDev: ".",// 解决发布时的路劲问题，打包前需要加个‘.’
    user: {},
    isUni: true,
    liveId: "",
    consultationId: '',
    broadcastId: '',
    imgerror: "this.src='" + require('../assets/img/pic_default.png') + "'",
    peoplegerror: "this.src='" + require('../assets/img/people.png') + "'",
    headDefault: "this.src='" + require('../assets/img/defaultHead.png') + "'",
    scrollComment: false,
    menuUrl: '/index/index',
    detailController: {
      type: 'index',
      show: true,
      id: '',
      position:0,
    },
    windowId:'',
    isShowInfo:false,
    isShowLess:false,
    isShowLive:false,
  }
})

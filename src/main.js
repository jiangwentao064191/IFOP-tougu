// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'; //elementCss
import ElementUI from 'element-ui';   // elementUI
import axios from 'axios' //ajax请求插件axios
import store from './store/index'
import {CUSTOMER_LEVEL} from './assets/wordbook'
import "./assets/style/public.less"
import "./assets/style/font.less"
import '../static/font/iconfont.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueCropper from 'vue-cropper'
import "./assets/style/common.less";//爬虫资讯样式


Vue.component('vue-cropper', VueCropper)
//新浪表情
import VueSinaEmotion from 'vue-sina-emotion'

Vue.component('vue-sina-emotion', VueSinaEmotion)
// require styles
import 'swiper/dist/css/swiper.css'
//emoji
import {emoji} from './utils/emoji.js'

Vue.prototype.emoji = emoji

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import VideoPlayer from 'vue-video-player'


Vue.use(VideoPlayer)

require('./assets/mock');
Vue.prototype.$ajax = axios;
Vue.config.productionTip = false;
Vue.use(VueAwesomeSwiper, /* { default global options } */);
Vue.use(ElementUI);
Vue.filter('toFixed2_100', function (value) {
  let num = Number(value) * 100;
  return num.toFixed(2)
});
Vue.filter('LEVEL', function (value) {

  return CUSTOMER_LEVEL[value]
});
/* eslint-disable no-new */
Vue.filter('hourTime', function (value) {
  if (!value) return "";
  const time = new Date(value);
  const data = (Date.parse(new Date()) - time) / 3600 / 1000;
  if (data >= 24) {
    return value.slice(0, 10);
  } else if (data < 1) {
    if (data * 60 < 1) {
      return "刚刚";
    } else {
      return parseInt(data * 60) + "分钟前";
    }
  } else {
    return parseInt(data) + "小时前";
  }
});
Vue.filter('nearTime', function (value) {
  let pushTime = Date.parse(value);
  let nowTime = Date.parse(new Date());
  let cha = nowTime - pushTime;
  if (cha > 86400000 && cha < 86400000 * 2) {
    return '一天前'
  } else if (cha > 86400000 * 2 && cha < 86400000 * 3) {
    return '两天前'
  } else if (cha > 86400000 * 3 && cha < 86400000 * 4) {
    return '三天前'
  } else if (cha > 86400000 * 4 && cha < 86400000 * 10) {
    return '一周前'
  } else if (cha < 86400000 && cha > 0) {
    cha = parseInt(cha / 3600000) + 1;
    return cha + '小时前'
  } else {
    cha = /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g.exec(value)[0];
    // cha = cha.replace(/2018-/g, '');
    return cha
  }
});
Vue.filter("tofix", function (value) {
  let msg = Number(value);
  msg = msg.toFixed(2);
  return msg;
});
Vue.filter("zdf", function (value) {
  let msg = Number(value);
  msg = msg.toFixed(2);
  return msg + "%";
});
Vue.filter('DelS', function (value) {
  if (value) return value.slice(0, value.length - 3)
});

Vue.filter('DelM', function (value) {
  if (value) return value.slice(0, 16)
});

Vue.filter('setTextLength', function (value, len) {
  if (value) {
    if (value.length > len) {
      return value.substr(0, len) + '...';
    } else {
      return value;
    }
  }
});

Vue.filter('getWorkDay', function (value) {
  if (value) {
    var dateObject = new Date(value);
    var str = dateObject.getDay();
    switch (str) {
      case 0:
        return '星期日';
        break;
      case 1:
        return '星期一';
        break;
      case 2:
        return '星期二';
        break;
      case 3:
        return '星期三';
        break;
      case 4:
        return '星期四';
        break;
      case 5:
        return '星期五';
        break;
      case 6:
        return '周六';
        break;
    }
  }
});
// Vue.filter('date',function(value){

// })
Vue.filter('toTime', function (value) {

  let pushTime;
  if (value) {
    pushTime = parseInt(value);
  } else {
    pushTime = new Date();
  }

  let nowTime = Date.parse(new Date());
  let cha = nowTime - pushTime;

  let date = new Date(Number(value));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let y = date.getFullYear();
  let mon = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  // console.log('h',h,m)
  if (h >= 0 && h <= 9) {
    h = "0" + h;
  }
  if (m >= 0 && m <= 9) {
    m = "0" + m;
  }
  if (new Date(Number(value)).toDateString() != new Date().toDateString()) {
    return y + '-' + mon + '-' + d + ' ' + h + ':' + m + '';
  }else{
    return h + ':' + m + '';
  }


});
//时间戳转时间格式
Vue.filter('formaDateTime', function (value) {
  let pushTime;
  if (value) {
    pushTime = parseInt(value);
  } else {
    pushTime = new Date();
  }

  let nowTime = Date.parse(new Date());
  let cha = nowTime - pushTime;

  const date = new Date(parseInt(value));
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let i = date.getMinutes();

  if (cha > 86400000 && cha < 86400000 * 2) {
    return '一天前'
  } else if (cha > 86400000 * 2 && cha < 86400000 * 3) {
    return '两天前'
  } else if (cha > 86400000 * 3 && cha < 86400000 * 4) {
    return '三天前'
  } else if (cha > 86400000 * 4 && cha < 86400000 * 10) {
    return '一周前'
  } else if (cha < 86400000 && cha > 0) {
    // cha = parseInt(cha / 3600000) + 1;
    let hh = h;
    let ii = i;
    if (h >= 0 && h <= 9) {
      hh = '0' + h;
    }
    if (i >= 0 && i <= 9) {
      ii = '0' + i;
    }
    cha = hh + ':' + ii;
    return cha;
  } else {
    cha = y + '-' + m + '-' + d;
    return cha;
  }
});
Vue.filter('getYMD', function (value) {
  return value.substr(0, 10);
})

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});

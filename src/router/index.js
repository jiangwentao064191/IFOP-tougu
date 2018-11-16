import Vue from 'vue'
import Router from 'vue-router'
// 主页面
import login from '../components/login'
import frame from '@/components/page/indexPage'
// 主内容页
import mine from "@/components/mine"
import customer from '@/components/customer/index'
import service from '@/components/service/index'
import message from '@/components/message'
import index from '@/components/index/index'
// 策略
import touzicelueMain from '../components/touzicelue/main'
import nowCL from '../components/touzicelue/nowCL'
import historyCL from '../components/touzicelue/historyCL'
import transaction from '../components/touzicelue/transaction'
import rankings from '../components/touzicelue/rankings'
//行情
import market from "../components/market";

//发布
import release from '../components/release/index'
//我的资讯
import imformation from '../components/imformation/index'
//首页资讯
import informationAll from '../components/informationAll/index'

import teacherSet from '../components/login/teacherSet'
//咨询
import consultation from '../components/consultation/index'
//课程
import lessonList from '../components/lesson/lessonList'
import createCourse from '../components/lesson/createCourse'
import lessonDetail from '../components/lesson/lessonDetail'
import homePageLessonDetail from '../components/lesson/homePageLessonDetail'
import homePageLessonList from '../components/lesson/homePageLessonList'
import newLesson from '../components/lesson/newLesson'
//直播
import broadcast from '../components/broadcast/index'
//直播列表，新建直播
import liveList from '../components/live/liveList'
import newLive from '../components/live/newLive'
import courseLiveList from "../components/live/courseLiveList"


Vue.use(Router);

export default new Router({
  routes: [
    // 默认
    {
      path: '/',
      name: 'login',
      component: login
    },

    //直播
    {
      path:'/broadcast',
      name:'broadcast',
      component:broadcast
    },

    {
      path: '/index',
      name: 'frame',
      component: frame,
      children: [
        // 首页菜单
        {
          path: '/',
          redirect: "mine",
          component: mine
        },
         {
          path: 'index',
          name: 'index',
          component: index
        },
        //咨询
        {
          path: 'consultation',
          name: 'consultation',
          component: consultation
        },
        //直播列表
        {
          path:'courseLiveList',
          name:'courseLiveList',
          component:courseLiveList
        },
        {
          path: 'mine',
          name: 'mine',
          component: mine,
        },
        {
          path: 'release',
          name: 'release',
          component: release,
        },
        //我的资讯
        {
          path: 'imformation',
          name: 'imformation',
          component: imformation
        },
//直播列表
        {
          path:'liveList',
          name:'liveList',
          component:liveList
        },
        //新建直播
        {
          path:'newLive',
          name:'newLive',
          component:newLive
        },
        // 课程列表
        {
          path: 'lessonList',
          name: 'lessonList',
          component: lessonList
        },
        // 课程详情
        {
          path: 'lessonDetail',
          name: 'lessonDetail',
          component: lessonDetail
        },
        // 首页的课程列表
        {
          path: "homePageLessonList",
          name: "homePageLessonList",
          component: homePageLessonList
        },
        // 首页的课程详情
        {
          path: "homePageLessonDetail/:id/:i",
          name: "homePageLessonDetail",
          component: homePageLessonDetail
        },
        // 新建课程
        {
          path: 'newLesson',
          name: 'newLesson',
          component: newLesson
        },
        //创建课程
        {
          path: 'createCourse',
          name: 'createCourse',
          component: createCourse
        },
        // // 新建单课
        // {
        //   path: 'newSingleLesson',
        //   name: 'newSingleLesson',
        //   component: newSingleLesson
        // },
        //首页资讯
        {
          path: 'informationAll',
          name: 'informationAll',
          component: informationAll
        },
        {
          path: 'touziMain',
          component: touzicelueMain,
          children: [
            {
              path: '/',
              redirect: "nowCL",
              component: nowCL
            }, {
              path: 'nowCL',
              component: nowCL
            },
            {
              path: 'historyCL',
              component: historyCL
            }, {
              path: 'transaction',
              component: transaction
            }, {
              path: 'rankings',
              component: rankings
            }
          ]
        },
        {
          path: 'customer',
          name:'customer',
          component: customer
        },
        {
          path: 'service',
          name:'service',
          component: service
        },
        // 行情
        {
          path: "market",
          name: "market",
          component: market
        },
        {
          path: 'message',
          name:'message',
          component: message
        },
        {
          path: "index",
          name:"index",
          component: index
        },
        {
          path: "teacherSet",
          name: "teacherSet",
          component: teacherSet
        },
      ]
    },
  ]
})

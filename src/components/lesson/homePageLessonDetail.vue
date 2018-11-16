<template>
  <div class="main">
    <div class="lessonDetail">
      <back data="课程详情" />
      <div class="top-banner">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in courseList" :key="index" class="stop-swiping">
            <div class="lesson-block">
              <img :src="item.coverurl" class="lesson-img" />
              <div class="content">
                <div class="lesson-title">{{item.name}}</div>
                <div class="people"><img class="peo" src="@/assets/img/course/pic_ren.svg">{{item.participantcount}}人</div>
                <div class="teacherInfo">
                  <div class="headImg"><img :src="item.lecturer.head" /></div>
                  <div>{{item.lecturer.name}}</div>
                </div>
                <div v-if="item.vipcode === 'B'" class="member"><img class="peo" src="@/assets/img/course/hy_pic_g.png">{{item.vipcode|vipCode}}</div>
                <div v-if="item.vipcode === 'A'" class="member"><img class="peo" src="@/assets/img/course/member-white.png">{{item.vipcode|vipCode}}</div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </div>
      <!-- <div class="consult">
      <button class="consultTeacher">咨询老师</button>
    </div> -->
      <div class="lesson-content">
        <div class="tap">
          <div class="tap-block">
            <span :class="{now:detail}" @click="detail = true">课程目录</span>
          </div>
          <div class="tap-block">
            <span :class="{now:!detail}" @click="detail = false">课程介绍</span>
          </div>
        </div>
        <div class="content" v-if="detail">
          <div>
            <div class="tableHead" v-if="thisLessonList">
              <div class="num">课程序号</div>
              <div class="info">课程信息</div>
              <div class="time" v-if="hideLessonTime(thisLessonList[0])">上课时间</div>
              <!-- <div class="halve">分享试看</div> -->
            </div>
            <div class="box flex-wrap-center" v-if="!thisLessonList">
              <img src="@/assets/img/course/noData.png" alt="">
            </div>
            <!-- <div @click="goLive(data.id,courseDetail.lecturerid,data.coursewareurl,data.topic,data.starttime,data.endtime,data.status)" v-for="(data,index) in thisLessonList" class="tableBody" :key="index"> -->
            <div @click="goLive(data.id,courseDetail.lecturerid,data.coursewareurl,data.topic,data.starttime,data.endtime,data.status,courseDetail.vipcode,data)" v-for="(data,index) in thisLessonList" class="tableBody" :key="index">
              <div class="num">{{index + 1 }}</div>
              <div class="info">
                <div>{{data.topic}}</div>
                <!-- <div class="dataNum">
                  <span>点赞 {{data.favourcount}}</span>
                  <span>评论 {{data.commentcount}}</span>
                  <span>可试看11</span>
                  <span>已试看15</span>
                </div> -->
              </div>
              <div class="time">
                <div v-if="data.status === 'unopened'">
                  <div v-if="!data.videocover">
                    <span>{{data.starttime|sliceTime}} ~ {{data.endtime|sliceTime}}</span>
                    <span class="week">{{data.starttime|getWeek}}</span>
                  <div>{{data.starttime | sliceDate}}</div>
                  </div>
                  <div v-if="data.videocover">回看</div>
                </div>
                <div v-if="data.status === 'opened'">直播中
                  <span class="icon-living"></span>
                </div>
                <div v-if="data.status === 'closed'">
                  <div>回看<img class="backLook" src="@/assets/img/course/playBack.svg" /></div>
                </div>
                <!-- <div class="halve">
              <button :class="data.status === 'unopened'?'canHalve':'endHalve'">分享试看</button>
            </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="courseIntroduction" v-if="!detail">
          <div>简介</div>
          <div class="fontSize">{{courseDetail.introduction}}</div>
          <div class="fontSize">课程数量 :
            <span class="yellowFont">{{courseDetail.num}}讲</span>
            <!-- <span class="yellowFont">{{courseDetail.specialservice}}</span> -->
          </div>
          <!-- <div>适用人群</div> -->
          <!-- <div class="fontSize">{{courseDetail.crowd}}</div> -->
          <!-- <div>课程概述</div> -->
          <!-- <div class="fontSize">{{courseDetail.summary}}</div> -->
          <!-- <img :src="courseDetail.coverurl" class="photo" /> -->
        </div>
        <!-- <div class="right-pl" v-if="detail">
          <div class="title">用户评价</div>
          <div class="wrapContent">
            <div class="evaluateContent">
              <div class="userInfo">
                <div class="headImg"><img src="@/assets/img/course/head.png" /></div>
                <div class="info">
                  <div class="userName">SKY</div>
                  <div class="userTime">2018/4/28 22:50</div>
                </div>
                <div class="starBox">
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                </div>
              </div>
              <div class="evaluateText">终于找到一个好老师，让我学习了很多，原来我们都可以是领导者，并不是高高在上的才是领导者，要不断的提高自己的觉悟和认知，这样才能</div>
            </div>
            <div class="evaluateContent">
              <div class="userInfo">
                <div class="headImg"><img src="@/assets/img/course/head.png" /></div>
                <div class="info">
                  <div class="userName">SKY</div>
                  <div class="userTime">2018/4/28 22:50</div>
                </div>
                <div class="starBox">
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                  <img class="star" src="@/assets/img/course/pic_star2@2x.svg" />
                </div>
              </div>
              <div class="evaluateText">终于找到一个好老师，让我学习了很多，原来我们都可以是领导者，并不是高高在上的才是领导者，要不断的提高自己的觉悟和认知，这样才能</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <wicket :status="maskStatus" @hide="hideMask($event)"></wicket>
  </div>

</template>

<script>
import back from "../frame/back";
import send from "../../assets/js/ajaxSend";
import wicket from "../frame/wicket";
import { courseSeries, singleLessonListAPI, getUserCourseSeriesAPI, addParticipantAPI, mediaCastPushAPI } from "../../assets/apiRegular";

var myVue = {};
export default {
  name: "homePageLessonDetail",
  components: { back, wicket },
  data() {
    return {
      swiperOption: {
        //轮播参数
        slidesPerView: "auto", //按照大小自适应显示几个
        observer: true, //修改swiper自己或子元素时，自动初始化
        observeParents: true, ////修改swiper的父元素时，自动初始化
        effect: "coverflow", // 切换方式:3D
        loop: false, //循环
        centeredSlides: true,
        navigation: {
          //左右控制按钮
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        height: 500,
        noSwiping: true,
        noSwipingClass: "stop-swiping",
        notNextTick: true,
        coverflowEffect: {
          //3D参数
          rotate: 0, //旋转角度
          stretch: -23, //活动距离
          depth: 100, //深度
          modifier: 3, //效果
          slideShadows: true //阴影，
        },
        on: {
          slideChangeTransitionEnd() {
            myVue.toggle(this.activeIndex);
          }
        }
      },
      user: "",
      detail: true,
      courseList: [],
      thisLessonList: [],
      courseDetail: {},
      // loading: true,
      // moduleLoading: false,
      livingStatus: false,
      // backLook: false,
      schoolHourl: true,
      list: [],
      num: this.$route.params.i,
      number: "",
      lastData: "",
      userLevel: localStorage.getItem("userLevel"),
      maskStatus: false
      // url: ""
    };
  },
  beforeCreate() {
    myVue = this;
  },
  filters: {
    vipCode: function(value) {
      if (value === "A") return "普通会员";
      if (value === "B") return "黄金会员";
    },
    sliceTime(value) {
      if (!value) return "";
      return value.slice(10, 16);
      //  return new Date(parseInt(value)).toLocaleString().replace(/:\d{1,2}$/,' ')
    },
    sliceDate(value) {
      if (!value) return "";
      return value.slice(0, 10);
    },
    getWeek(value) {
      if (!value) return "";
      const arys1 = value.slice(0, 10).split("-"); //日期为输入日期，格式为 2013-3-10
      const ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
      return (
        "星期" +
        String(ssdate.getDay())
          .replace("0", "日")
          .replace("1", "一")
          .replace("2", "二")
          .replace("3", "三")
          .replace("4", "四")
          .replace("5", "五")
          .replace("6", "六")
      );
    }
  },
  mounted() {
    this.$store.state.loadingContent = false;
    this.user = JSON.parse(localStorage.getItem("logininfo")).user;
    this.getCourse();
    this.getCourseDetail();
  },
  destroyed() {
    window.sessionStorage.removeItem("temp");
  },
  methods: {
    hideMask(value) {
      let _this = this;
      _this.maskStatus = value;
    },
    hideLessonTime(obj) {
      if (!obj) return false;
      return obj.hasOwnProperty("starttime");
    },
    goToLiveRoom(courseid,status) {

      // 打开直播间
        let _this = this;
        send.ajaxSend({
          url: mediaCastPushAPI,
          data: {
            courseId: courseid
          },
          success: dataResult => {
            // 获取直播间路由
            let routeData = this.$router.resolve({
              name: 'broadcast',
              query: {
                courseid: courseid,
                url:dataResult.vcloudchannel.hlspullurl,
                status:status
              }
            });
            // window.open(routeData.href, '_blank');
            createSpecialWindow({
              url: "login.html" + routeData.href,
              id: courseid,
              width: 1000,
              height: 670
            });
          }
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
    goLive(courseid, id, videoUrl, title, startTime, endTime, status, vipLevel,data){
      if (vipLevel === "B") {
        if (this.userLevel === "B") {

      if(data.videocover){
        let routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              url: videoUrl,
              courseid: courseid,
              status:status
            }
          });
          createSpecialWindow({
              url: "login.html" + routeData.href,
              id: courseid,
              width: 1000,
              height: 670
            });
      }
        }else{
          this.maskStatus = true;

        }
        }else{
          if(data.videocover){
        let routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              url: videoUrl,
              courseid: courseid,
              status:status
            }
          });
          createSpecialWindow({
              url: "login.html" + routeData.href,
              id: courseid,
              width: 1000,
              height: 670
            });
      }
        }
      if (vipLevel === "B") {
        if (this.userLevel === "B") {
        console.log(videoUrl);
      if(status==="opened"){
        this.goToLiveRoom(courseid,status)
        this.setUser(courseid);
      }
      else if(status==="closed"){
       let routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              url: videoUrl,
              courseid: courseid,
              status:status
            }
          });
          createSpecialWindow({
              url: "login.html" + routeData.href,
              id: courseid,
              width: 1000,
              height: 670
            });
      }

        } else {
          this.maskStatus = true;
        }
      }else{
           console.log(videoUrl);
      if(status==="opened"){
        this.goToLiveRoom(courseid,status)
      }
      else if(status==="closed"){
       let routeData = this.$router.resolve({
            name: "broadcast",
            query: {
              url: videoUrl,
              courseid: courseid,
              status:status
            }
          });
          createSpecialWindow({
              url: "login.html" + routeData.href,
              id: courseid,
              width: 1000,
              height: 670
            });
      }
      }
    },
    getCourse() {
      let _this = this;
      console.log(Math.ceil((parseInt(_this.$route.params.i) + 1) / 8));
      const sorts1 = JSON.stringify([{ field: "f_create_time", sortType: "desc" }]);
      const sorts2 = JSON.stringify([
        {
          field: "(case when f_type = 'livebroadcast' and f_status = 'opened' then 1 else 0 end)",
          sortType: "desc"
        },
        { field: "(select max(f_create_time) from t_course where f_valid_Flag = 1 and f_course_series_id = t_course_series.f_id)", sortType: "desc" },
        { field: "f_id", sortType: "desc" }
      ]);
      send.ajaxSend({
        url: getUserCourseSeriesAPI,
        data: {
          pageNo: Math.ceil((parseInt(_this.$route.params.i) + 1) / 8),
          pageSize: 8,
          sorts: window.sessionStorage.getItem("temp") ? sorts1 : sorts2
        },
        success: function(data) {
          _this.courseList = data.courseserieslist;
          let index1 = (parseInt(_this.$route.params.i) + 1) % 8 === 0 ? 7 : parseInt(_this.$route.params.i) % 8;
          console.log(index1);
          _this.$refs.mySwiper.swiper.slideTo(index1, 1000, true);
        }
      });
    },
    toggle(num) {
      let _this = this;
      // _this.moduleLoading = true;
      const courseId = _this.courseList[num].id;
      const sorts = JSON.stringify([{ field: "f_id", sortType: "asc" }]);
      send.ajaxSend({
        url: courseSeries,
        data: {
          courseSeriesId: courseId
        },
        success: function(data) {
          _this.courseDetail = data.courseseries;
        }
      });
      send.ajaxSend({
        url: singleLessonListAPI,
        data: {
          courseSeriesId: courseId,
          sorts: sorts
        },
        success: function(data) {
          _this.thisLessonList = data.courses;
          // _this.moduleLoading = false;
        }
      });
    },
    getCourseDetail() {
      var _this = this;
      const courseId = this.$route.params.id;
      const sorts = JSON.stringify([{ field: "f_id", sortType: "asc" }]);
      send.ajaxSend({
        url: courseSeries,
        data: {
          courseSeriesId: courseId
        },
        success: function(data) {
          _this.courseDetail = data.courseseries;
          send.ajaxSend({
            url: singleLessonListAPI,
            data: {
              courseSeriesId: courseId,
              sorts: sorts
            },
            success: function(data) {
              _this.thisLessonList = data.courses;
              // _this.loading = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/style/public";
.main {
  width: 100%;
  height: 100%;
  background: @com-module-bg;
}
.lessonDetail {
  background: @com-module-bg;
  // background: rgba(25, 27, 35, 1);
}
.top-banner {
  width: 798px;
  margin: 20px auto;
  text-align: center;
  position: relative;
  .swiper-slide {
    width: 287px;
  }
  .swiper-button-prev {
    left: -100px;
    padding: 10px;
    background-color: @com-module-bg;
  }
  .swiper-button-next {
    right: -100px;
    padding: 10px;
    background-color: @com-module-bg;
  }
  .lesson-block {
    color: @com-h2S1-font;
    background: @com-module-bg;
    margin: auto;
    text-align: left;
    width: 287px;
    font-size: @font - 2px;
    .lesson-img {
      display: inline-block;
      width: 100%;
      height: 150px;
    }
    .content {
      padding: 8px 20px 50px;
      line-height: 34px;
      .lesson-title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .people,
      .member {
        font-size: @font - 4px;
        .peo {
          position: relative;
          top: 3px;
          display: inline-block;
          width: 20px;
          height: 18px;
          margin-right: 12px;
        }
      }
      .people {
        color: @com-h4s4-font;
      }
      .member {
        color: @com-h2S1-font;
      }
      .teacherInfo {
        float: right;
        font-size: @font - 4px;
        margin-right: 12px;
        margin-top: -28px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .headImg {
          width: 32px;
          height: 32px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
            margin-bottom: 5px;
            border-radius: 50%;
          }
        }
        .name {
          color: @com-h2S1-font;
        }
      }
    }
  }
}
.consult {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .consultTeacher {
    width: 206px;
    height: 36px;
    margin-bottom: 26px;
    border: 1px solid @com-button-A-border;
    color: @com-button-A-font;
    background: transparent;
    cursor: pointer;
  }
}
.lesson-content {
  position: relative;
  background-color: @com-module-bg;
  font-size: @font - 2px;
  color: @com-h2S1-font;
  .tap {
    line-height: 50px;
    background: #283037;
    border-bottom: 1px solid @com-solidS2-bg;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    .tap-block {
      float: left;
      color: @com-h2S1-font;
      padding: 0 50px;
      height: 50px;
      line-height: 52px;
    }
    span {
      cursor: pointer;
      display: inline-block;
      height: 100%;
      border-bottom: 2px solid transparent;
    }
    .now {
      border-bottom: 2px solid @com-button-A-border;
      color: @com-button-A-font;
    }
  }
  .content {
    .box {
      padding: 20px 0;
      img {
        width: 200px;
        height: 240px;
      }
    }
    .tableHead {
      height: 40px;
      color: @com-h4s4-font;
    }
    .tableBody {
      height: 78px;
    }
    .tableBody:hover {
      background: @com-module-bg;
    }
    .tableHead,
    .tableBody {
      display: flex;
      align-items: center;
      border-bottom: 1px solid @com-solidS2-bg;
      cursor: pointer;
      .num {
        width: 12%;
        text-align: center;
      }
      .info {
        width: 22%;
        padding-left: 44px;
        .dataNum {
          color: @com-h4s4-font;
          display: flex;
          margin-top: 5px;
          span {
            padding-right: 10px;
          }
        }
      }
      .time {
        width: 30%;
        text-align: center;
        .icon-living {
          position: relative;
          top: 2px;
          display: inline-block;
          width: 20px;
          height: 16px;
          z-index: 3;
          background-image: url(../../assets/img/course/live.svg);
          background-size: 1033% 100%;
          animation: isliving 1.2s steps(6) infinite;
        }
        .week {
          display: inline-block;
          margin-left: 6px;
        }
        .backLook {
          position: relative;
          top: 3px;
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-left: 8px;
        }
      }
      .halve {
        width: 30%;
        text-align: center;
        .canHalve {
          border: 1px solid @com-button-A-border;
          background: transparent;
          outline: none;
          padding: 4px 6px;
          color: @com-button-A-font;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.5s;
          &:hover {
            background: @com-button-X-bg;
            color: @com-button-X-font;
          }
        }
        .endHalve {
          border: 1px solid @com-button-M-border;
          background: transparent;
          outline: none;
          padding: 4px 6px;
          color: @com-button-M-font;
          cursor: pointer;
          border-radius: 3px;
        }
      }
    }
    // table{
    //   width: 100%;
    //   color: @gray-1;
    //   text-align: center;
    //   td{
    //     padding: 10px 0;
    // .buy-btn{
    //   border:1px solid @color-gold;
    //   background: transparent;
    //   outline: none;
    //   padding: 4px 6px;
    //   color: @color-gold;
    //   cursor: pointer;
    //   transition: all 0.5s;
    //   &:hover{
    //     background: @color-gold;
    //     color: @black-3;
    //   }
    // }

    //   }
    // }
  }
  .courseIntroduction {
    padding: 20px 100px 10px 50px;
    font-size: 16px;
    line-height: 34px;
    background: @com-module-bg;
    .fontSize {
      font-size: 14px;
      color: @com-h4s4-font;
    }
    & div:nth-child(4) {
      margin-top: 8px;
    }
    & div:nth-child(6) {
      margin-top: 8px;
    }
    .yellowFont {
      display: inline-block;
      margin-left: 5px;
      margin-right: 10px;
      color: @com-sizeS1-color;
    }
    .photo {
      display: inline-block;
      width: 30%;
    }
  }
  .right-pl {
    position: absolute;
    top: 0;
    right: 0;
    width: 360px;
    height: 100%;
    border-left: 2px solid @com-solidS1-bg;
    .title {
      text-indent: 20px;
      line-height: 50px;
    }
    .wrapContent {
      overflow: auto;
      height: 80%;
      .evaluateContent {
        padding: 10px 22px;
        .userInfo {
          width: 100%;
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .headImg {
            width: 42px;
            height: 42px;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .starBox {
            width: 40%;
            .star {
              width: 17px;
              height: 16px;
            }
          }
        }
      }
      .evaluateText {
        line-height: 30px;
      }
    }
  }
}
.doubleColor {
  background: @com-module-bg;
}
@keyframes isliving {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -194px 0;
  }
}
</style>

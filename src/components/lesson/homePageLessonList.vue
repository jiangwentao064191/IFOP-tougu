<template>
  <div class="v-lesson-list" @mousewheel='downRefresh' v-loading="loading" element-loading-background="transparent">
    <!--<back-index data="课程列表" />-->
    <div class="touzi-main clearfix" style="display:block">
      <!-- <router-link class="main-back back-main" to="/index/index">
        < 返回
       </router-link>-->
      <span class="main-back tap-link">课程列表</span>
    </div>
    <div class="wrap">
     <div class="lesson-block" v-for="(data,key) in list" :key="key" @click="toDetail(data.id)">
        <div class="link">
          <div class="img-block">
            <img :src="data.coverurl" />
            <span class="img-float">
              <span @mouseover="maskShow(data)" @mouseout="maskHide(data)">课程简介</span>
              <span class="text-right" v-if="data.num">
                共{{data.num}}课时
              </span>
            </span>
          </div>
          <div class="lesson-name">
            <span>{{data.name}}</span>
          </div>
          <div class="lesson-near" v-if='data.lastcourse'>
            <span>最近更新: {{data.lastcourse?data.lastcourse.createtime:"" | hours}}</span>
            <!-- <img :src="data.lecturer.head" class="i" /> -->
          </div>
          <div class="lesson-near" v-if='!data.lastcourse'>
            暂无课程
          </div>
          <div class="hot" v-if="data.lastcourse">
            <span>第{{data.lastcourse?data.lastcourse.rownum:0}}讲: </span>
            <span>{{data.lastcourse?data.lastcourse.topic:""}}</span>
          </div>
          <div class="hide" v-if="!data.lastcourse"></div>
          <div class="people"><img class="peo" src="@/assets/img/course/pic_ren.svg">{{data.participantcount}}人</div>
          <div class="teacherInfo">
            <div class="headImg"><img :src="data.lecturer.head" /></div>
            <div class="text">{{data.lecturer.name}}</div>
          </div>
          <div v-if="data.vipcode === 'B'" class="member"><img class="peo" src="@/assets/img/course/hy_pic_g.png">{{data.vipcode|vipCode}}</div>
          <div v-if="data.vipcode === 'A'" class="member"><img class="peo" src="@/assets/img/course/member-white.png">{{data.vipcode|vipCode}}</div>
        </div>
        <div v-show="data.flag" class="mask">{{data.introduction}}</div>
        <span v-if="data.status === 'opened'" class="iconBox flex-wrap-center">
          <span class="icon"></span>
        </span>
        <span v-if="data.type === 'livebroadcast'" class="icon-living"><img src="@/assets/img/course/zhiBo_1.png" />
          <span>直播</span>
        </span>
        <span v-if="data.type === 'courseware'" class="icon-living"><img src='@/assets/img/course/keJian_1.png' />
          <span>课件</span>
        </span>
      </div>

      <div v-if="!list.length > 0" class="courseStatus">
        <img class="no-data" src="../../assets/img/暂无数据@2x.png">
        <p class='no-text'>暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script>
import backIndex from "../frame/backIndex";
import send from "../../assets/js/ajaxSend";
import { getUserCourseSeriesAPI } from "../../assets/apiRegular";
// import {lessonList} from "../../assets/testData";

export default {
  name: "lessonlist",
  data() {
    return {
      list: [],
      pageNum: 1,
      totalPage: "",
      totalNum: "",
      loading: true
    };
  },
   beforeCreate:function(){
        this.$store.state.nowContent = 'homePageLessonList'
        this.$store.state.loadingContent = false;
      },
  components: {
    backIndex
  },
  filters: {
    hours: function(value) {
      if (!value) return "";
      const time = new Date(value);
      const data = (Date.parse(new Date()) - time) / 3600 / 1000;
      if (data >= 24) {
        if (parseInt(data / 24) >= 365) {
          return parseInt(data / 24 / 365) + "年前";
        } else {
          return parseInt(data / 24) + "天前";
        }
      } else if (data < 1) {
        if (data * 60 < 1) {
          return "刚刚";
        } else {
          return parseInt(data * 60) + "分钟前";
        }
      } else {
        return parseInt(data) + "小时前";
      }
    },
    vipCode: function(value) {
      if (value === "A") return "普通会员";
      if (value === "B") return "黄金会员";
    },
    empty(value) {
      if (value) {
        return value;
      } else {
        return "";
      }
    }
  },
  watch: {
    list: {
      deep: true,
      handler(v) {
        v.forEach(el => {
          if (el.flag) {
            // debugger;
          }
        });
      }
    }
  },
  methods: {
    maskShow(data) {
      let _this = this;
      _this.$set(data, "flag", true);
    },
    maskHide(data) {
      let _this = this;
      _this.$set(data, "flag", false);
    },
    // toggleClass(data) {
    //   data.flag = !data.flag;
    // },
    toDetail(id) {
      let _this = this;
      _this.list.forEach((item, index) => {
        if (item.id == id) {
          this.$router.push({ path: "homePageLessonDetail/" + id + "/" + index });
        }
      });
    },
    getCourse() {
      var _this = this;
      const sorts = JSON.stringify([
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
          pageNo: _this.pageNum,
          pageSize: 8,
          sorts: sorts
        },
        success: function(data) {
           _this.loading = false;
           if(data.courseserieslist){
             _this.list = data.courseserieslist;
           }
           console.log('dasd',_this.list)
          console.log('list.lenght=',_this.list.length)
            _this.list.forEach(item => {
              _this.$set(item, "flag", false);
            });
          _this.totalNum = data.totalcount;
          _this.totalPage = Math.ceil(data.totalcount / 8);
        }
      });
    },
    downRefresh() {
      var _this = this;
      const sorts = JSON.stringify([
        {
          field: "(case when f_type = 'livebroadcast' and f_status = 'opened' then 1 else 0 end)",
          sortType: "desc"
        },
        { field: "(select max(f_create_time) from t_course where f_valid_Flag = 1 and f_course_series_id = t_course_series.f_id)", sortType: "desc" },
        { field: "f_id", sortType: "desc" }
      ]);
      let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 10;
      if (bottomOfWindow && _this.pageNum < _this.totalPage) {
        _this.pageNum += 1;
        send.ajaxSend({
          url: getUserCourseSeriesAPI,
          data: {
            pageNo: _this.pageNum,
            pageSize: 8,
            sorts: sorts
          },
          success: function(data) {
            _this.list = _this.list.concat(data.courseserieslist);
            _this.list.forEach(item => {
              _this.$set(item, "flag", false);
            });
          }
        });
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.$store.state.loadingContent = false;
    this.getCourse();
  }
};
</script>

<style scoped lang="less">
@import "../../assets/style/public";
.v-lesson-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  .wrap {
    height: calc(100% - 140px);
    .courseStatus{
     // background: url("../../assets/img/暂无数据@2x.png") no-repeat center;
      text-align: center;
      top: 20%;
      left: 36%;
      position: relative;
      width: 200px;
      height: 300px;
      .no-data{
        position: absolute;
      }
      .no-text{
        position: absolute;
        top:270px;
        left:158px;
        width: 100px;
        color:@com-h4s4-font;
      }
    }
    padding: 0px 14px 12px;
    /*background: #191b23;*/
    display: flex;
    flex-wrap: wrap;
    .lesson-block {
      position: relative;
      margin: 5px;
      width: 23.9%;
     height: 360px;
      font-size: @font - 4px;
      color: @com-h2S1-font;
      background: @com-module-bg;
      padding: 10px;
      box-sizing: border-box;
      z-index: 2000;
      cursor: pointer;
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        opacity: 0.7;
        // text-indent: 20px;
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        line-height: 34px;
        height: 51.5%;
        overflow: hidden;
      }
      .maskHide {
        display: none;
      }
      .iconBox {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: @com-sizeS2-color;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          margin-top: 0 !important;
          border-radius: 50%;
          // background-color: #ff4800;
          display: inline-block;
          width: 18px;
          height: 18px;
          z-index: 3;
          background-image: url(../../assets/img/course/icon_living.png);
          animation: isliving 1.2s steps(6) infinite;
        }
      }
      .icon-living {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 53px;
        height: 24px;
        border-radius: 0 0 8px 0;
        background: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        img {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 2px;
        }
      }
      &:hover {
        background: @com-hover-bg;
      }
      .img-block {
        position: relative;
        width: 100%;
        height: 187px;
        img {
          width: 100%;
          height: 187px;
          /*background: white;*/
        }
        .img-float {
          position: absolute;
          bottom: 0;
          width: calc(100% - 20px);
          height: 30px;
          line-height: 30px;
          background: @com-module-bg;
          opacity: 0.7;
          padding: 0 10px;
          .text-right {
            float: right;
          }
        }
      }
      .lesson-name {
        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 12px 0 5px;
        font-size: @font - 2px;
        color: @com-h1S1-font;
      }
      .lesson-near {
        color: @com-h3-font;
        padding: 5px 0;
        .i {
          display: inline-block;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          margin-right: 20px;
        }
      }
      .hot {
        padding: 5px 0;
        color: @com-h3-font;
      }
      .hide {
        padding: 5px 0;
        height: 16px;
      }
      .people,
      .member {
        padding: 5px 0;
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
        color: @com-h4s4-font;
      }
      .teacherInfo {
        float: right;
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
          color: @com-h4s4-font;
        }
        .text {
          margin-top: 6px;
        }
      }
    }
  }
}
@keyframes isliving {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -108px 0;
  }
}
</style>

<!--首页课程列表-->
<template>
  <div class="v-lesson" v-loading="loading" element-loading-background="transparent">
    <div class="title">
      <i class="iconfont icon-tietel_bg_picx"></i>
      <span class="text">课程</span>
      <div class="right-ico">
        <!--<i class="iconfont icon-huanyihuan"></i>-->
        <a class="more-info" @click="openLessonList">更多 &gt;</a>
      </div>
      <!--<img class="go" src="@/assets/img/course/go.png">-->
    </div>
    <div class="lesson-block" v-for="(data,index) in list" :key="index">
      <div class="link" @click="toDetail(data.id,data)">
        <div class="img-block">
          <img :src="data.coverurl" />
          <span class="img-float">
            课程简介
            <span class="text-right">
              共{{data.num}}课时
            </span>
          </span>
        </div>
        <div class="lesson-name">
          {{data.name}}
        </div>
        <div class="lesson-near" v-if='data.lastcourse'>
          最新更新: {{data.lastcourse?data.lastcourse.createtime:"" | hours}}
        </div>
        <div class="lesson-near" v-if='!data.lastcourse'>
          暂无课程
        </div>
        <div class="hot" v-if="data.lastcourse">
          <span>第{{data.lastcourse.rownum}}讲:</span>
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
    </div>
  </div>
</template>
<script>
// import {lessonList} from "../../assets/testData";
import send from "../../assets/js/ajaxSend";
import { getUserCourseSeriesAPI } from "../../assets/apiRegular";
export default {
  name: "lesson",
  data() {
    return {
      list: [],
      totalNum: "",
      loading: true
    };
  },
  filters: {
    vipCode: function(value) {
      if (value === "A") return "普通会员";
      if (value === "B") return "黄金会员";
    },
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
    }
  },
  mounted() {
    this.getCourse();
  },
  methods: {
    openLessonList: function() {
      this.$router.push({ name: "homePageLessonList" });
    },
    toDetail: function(id,data) {
      console.log(data)
      window.sessionStorage.setItem("temp", 1);
      this.$router.push({ path: "homePageLessonDetail/" + id + "/0" });
    },
    getCourse() {
      let _this = this;
      // const sorts = JSON.stringify([{ field: "f_create_time", sortType: "desc" }]);
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
          pageNo: 1,
          pageSize: 1,
          sorts: sorts
        },
        success: function(data) {
          const dataResult = data.courseserieslist.splice(0, 1);
          _this.loading = false;
          _this.list = dataResult;
          _this.totalNum = data.totalcount;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/style/public";
.v-lesson {
  /*background:linear-gradient(to bottom right, #426BC7 , #BC81FF);*/
  background-color:  @com-body-bg;
  .title {
    .xiebian(@com-h1S1-font, @com-module-title-bg,32px);
    .right-ico{
      float: right;
      padding-right: 10px;
      line-height: 32px;
      .iconfont {
        color: @com-buttonIcoMy-M-color;
        font-size: 20px;
        margin-right: 10px;
        cursor: pointer;
        &:hover{
          color:@com-buttonIcoMy-X-color;
        }
      }
      .more-info{
        color: @com-h4s4-font;
        line-height: 32px;
        display: inline-block;
        vertical-align: top;
        cursor: pointer;
        &:hover{
          color:@com-button-X-font;
        }
      }
    }
    .iconfont {
      color:@com-tab-A-color;
      font-size: 32px;
    }
    cursor: pointer;
    .go {
      float: right;
      margin: 10px 9px 0 0;
      width: 8px;
      height: 14px;
    }
  }
}
.lesson-block {
  float: left;
  width: 100%;
  font-size: @font - 2px;
  color: @com-h3-font;
  background: transparent;
  cursor: pointer;
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
    padding: 10px 15px;
    font-size: @font;
    color: @com-h4s4-font;
  }
  .lesson-near {
    color: @com-h4s4-font;
    padding: 2px 15px;
  }
  .hot {
    padding: 2px 15px;
    color: @com-h4s4-font;
  }
  .hide {
    padding: 5px 0;
    height: 16px;
  }
  .people,
  .member {
    padding: 2px 15px;
    color: @com-h4s4-font;
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
</style>

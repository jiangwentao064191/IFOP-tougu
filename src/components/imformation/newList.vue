<template>
  <div class="information-left">
    <div class="touzi-main">
      <router-link class="main-back back-main" to="/index/mine">
        < 返回
      </router-link>
      <span class="main-back" :class="{'tap-link':true,'active':type == data.code}" v-for="(data,i) in typeList"
            @click="changeType(data)" :key="i">
                {{data.name}}
              </span>
    </div>
    <div class="loading ball-pulse" v-if="isLoading">
      <div></div>
      <div></div>
      <div></div>
      <span>推荐中⋅⋅⋅</span>
    </div>

    <div class="information-lists" v-loading="loading" element-loading-background="rgba(255,255,255,0.3)"
         @scroll="toNextPage($event)" style=" position: relative;">
      <div v-if="!msgList.length" class="no-data">
        <img src="../../assets/img/no_data.png"/>
        <p>无发布内容</p>
      </div>

      <div :class="{'content-list':true,'now-content':data.info_id === nowid}" v-for="(data,key) in msgList"
           :key="key"
           @click="toDetail(data)">
        <!--无图-->
        <div class="content-group no-img clearfix" v-if="!data.img_list">
          <!--<img class="header-main-img" src="#">-->
          <div class="header-main-right">
            <p class="header-main-title header-main-title1">{{data.title}}</p>
            <!-- <div class="header-main-content more-text">
              {{data.digest}}
            </div> -->
            <div class="header-main-footer clearfix">
              <img class="footer-icon" :src="data.publisher_user.head ? data.publisher_user.head : '123'"
                   :onerror="$store.state.peoplegerror">
              <span class="footer-span">{{data.publisher_user.nickname || data.publisher_user.name}}</span>
              <!-- <span class="footer-comment">
               <img src="../../assets/img/zixunpinglun.png" class="icon-pinglun"/>
               {{data.comment_stat.all_comment_count}}
             </span>-->
              <span class="footer-hour">{{data.publish_time | hourTime}}</span>
            </div>
          </div>
        </div>
        <!-- 一张图 -->
        <div class="content-group clearfix" v-if="data.img_list && data.img_list.length === 1">
          <div class="header-main-img" @click="palyVodio(data.img_list[0])" v-if="data.media_type == 'video'&& data.img_list[0]"
               :style="{ background : 'url(' + data.img_list[0] + ')'}" >
            <!--<video :id="data.info_id" :src="data.img_list[0]" x-webkit-airplay="allow" autoplay preload="auto" style="display: none"></video>
            {{captureImage(data.info_id, index, 'msgList')}}
            <img :src="data.cover">-->
            <div class="play">
              <img class="cover-pic" :src="data.video_cover" >
              <span></span>
              <img src="../../assets/img/play.png"/>
              <span class="duration">
                  <i class="iconfont icon-bofang"></i>
                  <span>{{data.video_length}}</span>
                </span>
            </div>
          </div>
          <img class="header-main-img" v-if="data.media_type == 'picture'" :src="data.img_list[0]"
               @error="hideImage(key)"  :ref="'hideImg'+key">
          <div class="header-main-right">
            <p class="header-main-title header-main-title2">{{data.title}}</p>
            <!-- <div class="header-main-content more-text">
              {{data.digest}}
            </div> -->
            <div class="header-main-footer clearfix">
              <img class="footer-icon" :src="data.publisher_user.head ? data.publisher_user.head : '123'"
                   :onerror="$store.state.peoplegerror">
              <span class="footer-span">{{data.publisher_user.nickname || data.publisher_user.name}}</span>
              <!--<span class="footer-comment">
              <img src="../../assets/img/zixunpinglun.png" class="icon-pinglun"/>
              {{data.comment_stat.all_comment_count}}
            </span>-->
              <span class="footer-hour">{{data.publish_time | hourTime}}</span>
            </div>
          </div>
        </div>
        <!--三张图-->
        <div class="content-group" v-if="data.img_list && data.img_list.length > 1">
          <p class="header-main-title">{{data.title}}</p>
          <div class="clearfix img-list">
            <img class="header-main-img"  v-for="(img,i) in data.img_list" :src="img" :key="i"  >
          </div>
          <div class="header-main-footer clearfix">
            <img class="footer-icon" :src="data.publisher_user.head ? data.publisher_user.head : '123'"
                 :onerror="$store.state.peoplegerror">
            <span class="footer-span">{{data.publisher_user.nickname || data.publisher_user.name}}</span>
            <!-- <span class="footer-comment">
               <img src="../../assets/img/zixunpinglun.png" class="icon-pinglun"/>
               {{data.comment_stat.all_comment_count}}
             </span>-->
            <span class="footer-hour">{{data.publish_time | hourTime}}</span>
          </div>
        </div>
        <div class="group-footer">
          <div class="text-title color-green" v-if="data.immediately_flag == 'Y'">已发布</div>

          <!--<div class="text-title" v-if="data.immediately_flag == 'Y'">投放量<span class="text-num">{{data.put_count}}</span></div>-->

          <div class="text-title" v-if="data.immediately_flag == 'Y'">浏览量<span class="text-num">{{data.objectstat.view_start}}</span>
          </div>

          <div class="text-title" v-if="data.immediately_flag == 'Y'">点赞<span class="text-num">{{data.objectstat.favour}}</span>
          </div>

          <div class="text-title" v-if="data.immediately_flag == 'Y'">评论量 <span class="text-num">{{data.comment_stat.all_comment_count}}</span>
          </div>
          <div class="text-title color-blue" v-if="data.immediately_flag == 'N'">待发布</div>
          <div class="text-title" v-if="data.immediately_flag == 'N'" style="width: auto;">指定发布时间：{{data.publish_time | DelS}}
          </div>
          <div class="text-title color-red" v-if="data.immediately_flag == 'N' && data.verify_status">审核未通过</div>
          <i class="el-icon-delete icon-posi" @click="deleteInfo(data.info_id)"></i>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getImformationTypeListAPI, deleteInfoAPI} from "../../assets/apiRegular";
  import send from '../../assets/js/ajaxSend'

  export default {
    name: "newList",
    props: [
      "msgList",
      "nowid",
      "loading",
      "tabIndex",
      "isLoading"
    ],
    data() {
      return {
        list: this.msgList,
        typeList: [],
        type: this.tabIndex,
        canNext: true,
        sessionID: '',
      }
    },
    mounted: function () {
      let _this = this;
      _this.sessionID = JSON.parse(localStorage.getItem('logininfo')).session_id;
      send.ajaxSend({
        url: getImformationTypeListAPI,
        thisVue: _this,
        data: {"enabled": true},
        success: function (data) {
          console.log('typeList',data)
          _this.typeList = data.infotypes;
          _this.type = _this.tabIndex;
          // console.log('9999999',_this.type)
        }
      })
    },
    watch: {
      loading: function (value) {
        console.log('loding',value)
        this.loading = value;
      },
      tabIndex: function (value) {
        this.type = value;
      },
      msgList: function (value) {
        this.canNext = true;
      },
    },
    methods: {
      palyVodio: function (url) {
        console.log('url', url)
        // this.$emit("video", url);
      },
      hideImage(i){
        console.log(111111,"#############")
        console.log(this.$refs['hideImg'+i][0])
        this.$refs['hideImg'+i][0].parentNode.style.paddingLeft=0;
        this.$refs['hideImg'+i][0].style.display="none";
        this.$refs['hideImg'+i][0].parentNode.children[1].style.width="606px";
      },

      // videoId： 视频标签的id； index: 列表数据的索引；key: this.$data读取列表数据的key
      /* captureImage(videoId, index, key) {
         const self = this
         setTimeout(function () {
           const videoEle = document.getElementById(videoId)
           const canvas = document.createElement('canvas')
           canvas.width = 174
           canvas.height = 120
           console.log('videoId')
             videoEle.addEventListener('timeupdate', function () {
               canvas.getContext('2d').drawImage(videoEle, 0, 0, canvas.width, canvas.height)
               console.log('canvas', canvas)
               const dataUrl = canvas.toDataURL('image/png')
               self.$set(self.$data[key][index], 'cover', dataUrl)
               videoEle.pause()
             }, false)
         }, 100)
       },*/
      deleteInfo: function (infoId) {
        let _this = this;

        _this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$emit("setLoding",true);
          send.ajaxSend({
            url: deleteInfoAPI,
            data: {'session_id': _this.sessionID, 'info_id': infoId},
            success: function (data) {
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.$emit("refreshList");
              // _this.$router.push({name: 'imformation'});
            }
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      toDetail: function (data) {
        // let obj = {data: data, type: type, url: videoUrl, vtype: videotype};
        this.$emit("changeID", data);
      },
      changeType: function (data) {
        // if(data.)
        let _this = this;
        _this.type = data.code;
        _this.$emit("changeType", data)
      },
      toNextPage: function (e) {
        let domHeight = e.srcElement.scrollHeight;
        let viewHeight = e.srcElement.clientHeight;
        let scrollHeight = e.srcElement.scrollTop;
        if (domHeight <= viewHeight + scrollHeight + 10) {
          this.$emit('nextPage', this.canNext);
          this.canNext = false;
        }
      },
    },
  }
</script>
<style lang="less">
  @import "../../assets/style/public";

  .ball-pulse > div {
   /* background-color: @color-tab-activ;*/
    width: 8px;
    height: 8px;
    border-radius: 100%;
    margin: 1px;
    animation-fill-mode: both;
    display: inline-block;
  }

  .ball-pulse > div:first-child {
    animation: scale .75s -.24s infinite cubic-bezier(.2, .68, .18, 1.08);
  }

  .ball-pulse > div:nth-child(2) {
    animation: scale .75s -.12s infinite cubic-bezier(.2, .68, .18, 1.08);
  }

  .ball-pulse > div:nth-child(3) {
    animation: scale .75s 0s infinite cubic-bezier(.2, .68, .18, 1.08);
  }

  .ball-pulse {
    text-align: center;
    span {
     /* color: @color-tab-activ;*/
    }
  }

</style>
<style scoped lang="less">

  @import "../../assets/style/public";

  .information-left {
    width: 42%;
    height: 100%;
    float: left;
    background-color: @com-module-bg;
    /deep/ .el-loading-mask{
      top:0px;
      left:0px;
    }
  }

  .touzi-main {
    .back-main{
      height: 40px;
      line-height: 40px;
    }
    width: 100%;
    padding: 0;
    background: @com-module-title-bg;
    border-top: 1px solid @com-solidS1-bg;
    border-bottom: 1px solid @com-solidS1-bg;
    border-left: 1px solid @com-solidS1-bg;
    .clear-both;
    a {
      margin: 0 5px;
      display: inline-block;
      color: @com-tab-M-color;
      cursor: pointer;
    }
   /* .tap-block {
      float: left;
      margin-right: 20px;
      span {
        padding: 9px 5px;
        margin: 0 10px;
        display: inline-block;
        vertical-align: top;
        color: @color-gold-s;
        cursor: pointer;
        &.active {
          font-weight: bold;
          border-bottom: 2px solid @color-less-zb;
          color: @color-less-zb;
        }
      }
    }*/
  }

  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }

  .icon-pinglun {
    width: 16px;
    margin-right: 2px;
    margin-top: -5px;
    vertical-align: middle;
  }

  .no-data {
    position: relative;
    z-index: 10;
    top: 30%;
    bottom: 0;
    left: 42%;
    color:@com-h4s4-font;
    font-size: @font + 6px;
    /*display: flex;*/
    justify-content: center;
    align-items: Center;
    img{
      width: 100px;
    }
    p{
      position: absolute;
      top:130px;
      left:26px;
      font-size: @font - 2;
      color:@com-h4s4-font,
    }
  }

  .information-left {
    height: 100%;
    float: left;
    .information-lists {
      background: @com-module-bg;
      height: calc(100% - 40px);
      overflow-x: hidden;
      overflow-y: scroll;
      .no-img {
        padding-left: 0 !important;
        .header-main-right {
          /*width: 606px !important;*/
        }
      }
      .content-group {
        padding: 20px;
        text-align: left;
        // display: flex;
        .header-main-img {
         /* background: @gray-4;*/
          width: 174px;
          height: 120px;
          float: left;
          position: relative;
          .play {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            text-align: center;
            line-height: 152px;
            cursor: pointer;
            img {
              width: 30%;
              position: absolute;
              top: 40px;
              left: 60px;
            }
            .cover-pic, span {
              background: rgba(0, 0, 0, 0.3);
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
            }
            .duration {
              position: absolute;
              left: 102px;
              top: 94px;
              background: rgba(34, 34, 34, 0.7);
              border-radius: 100px;
              font-size: 12px;
              color: #fff;
              padding: 2px 7px;
              width: 46px;
              height: 16px;
              span {
                background-color: transparent;
                line-height: 16px;
                position: absolute;
                left: 6px;
                top: 2px;
              }
              .icon-bofang {
                font-size: 8px;
                line-height: 16px;
                position: absolute;
                left: 6px;
              }
            }
          }
        }
        .header-main-right {
          float: left;
          width: 44%;
          margin-left: 20px;
        }
        .header-main-title {
          margin: 0;
          font-size: @font - 2;
          color: @com-h1S2-font;
        }
        .header-main-title1{
          margin-bottom: 30px;
        }
        .header-main-title2{
          margin-bottom: 55px;
        }
        .header-main-content {
          font-size: @font - 4;
          margin: 16px 0;
          line-height: 24px;
          height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .header-main-footer {
          height: 24px;
          line-height: 24px;
          .footer-icon {
          /*  background: @com-h4s4-font;*/
            width: 24px;
            height: 24px;
            border-radius: 12px;
            float: left;
          }
          .footer-span {
            font-size: @font - 4;
            color: @com-h3-font;
            display: inline-block;
            padding: 0 5px;
            vertical-align: top;
          }
          .footer-hour {
            font-size: @font - 4;
            color: @com-h4s4-font;
            padding-left: 10px;
          }
          .footer-comment {
            padding-left: 10px;
            i {
              margin-right: 5px;
            }
          }
        }
        .img-list {
          display: flex;
          margin: 20px 0;
          justify-content: space-between;
          img {
            width: 32%;
            height: content-box;
          }
        }
        .more-img {
          margin-top: 14px;
        }
      }
      .group-footer {
        padding: 0 20px;
        height: 46px !important;
        text-align: left;
        .icon-posi {
          float: right;
          margin-right: 20px;
          font-size: 20px;
          &:hover {
            color: @com-buttonIco-X-color;
          }
        }
        .color-green {
          color: @com-sizeS3-color;
        }
        .color-blue {
          color: #09B3FA;
        }
        .color-red {
          color: @com-sizeS2-color;
        }
        .text-title {
          font-size: @font - 4;
          display: inline-block;
          vertical-align: top;
          /*width: 100px;*/
          padding-right: 20px;
          .text-num {
            padding: 0 5px;
            color: @com-h4s4-font;
          }
        }
      }
      .content-list {
        border-bottom: 1px solid @com-solidS2-bg;
        background-color: @com-module-bg;
        transition: all 0.3s;
        &.now-content {
          background: @com-hover-bg;
        }
        &:hover {
          background-color: @com-hover-bg;
          cursor: pointer;
        }
      }
    }
  }
</style>

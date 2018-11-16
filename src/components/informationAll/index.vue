<template>
  <div class="information clearfix">
    <news-list :msgList="list" :tabIndex="newType"
               @nextPage="nextPage"
               :loading="newsListLoading"
               :nowid="nowid"
               @changeID="changeID"
               @changeType="changeType"
               @updateLoading="updLoad">
    </news-list>
    <!-- <wicket :status="maskStatus" @hide="hideMask($event)"></wicket> -->

    <right-content :newsid="nowid" :videos="vieoPlay" :scroll-comment="scrollComment" @changeCommment="changeCommment"
                   :new-type="newType"/>
  </div>
</template>

<script>
  import send from '../../assets/js/ajaxSend'
  import {getImformationListAPI} from "../../assets/apiRegular";
  import rightContent from './right';
  import newsList from './newList';
    // import wicket from "../frame/wicket";


  export default {
    data() {
      return {
        vieoPlay: '',
        nowid: '',
        newType: "info",
        pageNo: 1,
        newsListLoading: true,
        totalpage: 1,
        list: [],
        scrollComment: false,
        maskStatus: false,
      };
    },
     beforeCreate:function(){
        this.$store.state.nowContent = 'informationAll'
        this.$store.state.loadingContent = false;
      },
    components: {
      rightContent,
      newsList,
    },
    name: "information",
    mounted: function () {
        /*if (localStorage.getItem("tabFlag")) {
      this.$store.state.nowContent = "informationAll";
        } else {
          this.$store.state.nowContent = "index";
        }*/
      if (this.$route.query.nowid) this.nowid = this.$route.query.nowid;
      if (this.nowid !== '' && this.nowid !== null) {
        this.getNowInfor()
      } else {
        this.pageNo = 1;
        this.getInforList();
      }
    },
    beforeDestroy() {
    localStorage.removeItem("tabFlag");
  },
    methods: {
      updLoad(data){
        this.newsListLoading=data;
      },
        hideMask(value) {
      let _this = this;
      _this.maskStatus = value;
    },
      getInforList: function (suc) {
        let _this = this;
        send.ajaxSend({
          url: getImformationListAPI,
          thisVue: _this,
          data: {
            "page.size": 10,
            "page.no": _this.pageNo,
            "info_type": _this.newType,
            "put_status": 'Y'
          },
          success: function (data) {
            _this.newsListLoading = false;
            for (let i = 0; i < data.info_list.length; i++) {
              if (data.info_list[i].info_id === _this.nowid) data.info_list.splice(i, 1);
              if (data.info_list[i].img_list) data.info_list[i].img_list = data.info_list[i].img_list.split(',');//img_list转数组
              if (data.info_list[i].data_from && data.info_list[i].data_from == 'crawl') {
                data.info_list[i].img_list = data.info_list[i].img_list.slice(0, 1)
                // console.log('@@@img_list', data.info_list[i].img_list);
              }
              if (!data.info_list[i].objectstat.view_start) data.info_list[i].objectstat.view_start = 0;//数量统计设置默认值为0
              if (!data.info_list[i].put_count) data.info_list[i].put_count = 0;
              if (!data.info_list[i].objectstat.favour) data.info_list[i].objectstat.favour = 0;
              if (!data.info_list[i].objectstat.oppose) data.info_list[i].objectstat.oppose = 0;
              if (!data.info_list[i].comment_stat.all_comment_count) data.info_list[i].comment_stat.all_comment_count = 0;
              if (!data.info_list[i].comment_stat.user_comment_count) data.info_list[i].comment_stat.user_comment_count = 0;
              if (!data.info_list[i].comment_stat.broker_comment_count) data.info_list[i].comment_stat.broker_comment_count = 0;
            }

            if (typeof suc === 'function') suc(data);
            if ((_this.nowid === '' || _this.nowid === null) && data.info_list.length > 0) {
              console.log('this.$store.state.detailController.id', _this.$store.state.detailController.id)
             /* if (_this.$store.state.detailController.id) {
                _this.nowid = _this.$store.state.detailController.id
              } else {
                _this.nowid = data.info_list[0].info_id;
              }*/
              _this.nowid = data.info_list[0].info_id;
              if (data.info_list[0].media_type == "video") {
                _this.vieoPlay = data.info_list[0].img_list[0];
                // console.log('_this.videoplay',data.info_list[0].img_list[0]);
              } else {
                _this.vieoPlay = '';
              }
            }
            _this.list = _this.list.concat(data.info_list);
            _this.totalpage = data.page.totalpage;
          }
        })
      },
      getNowInfor: function () {
        let _this = this;
        _this.newsListLoading = true;
        send.ajaxSend({
          url: getImformationListAPI,
          thisVue: _this,
          data: {
            "info_ids": _this.nowid,
            "put_status": 'Y'
          },
          success: function (data) {
            for (let i = 0; i < data.info_list.length; i++) {
              if (data.info_list[i].img_list) data.info_list[i].img_list = data.info_list[i].img_list.split(',');//img_list转数组
              if (data.info_list[i].data_from && data.info_list[i].data_from == 'crawl') {
                data.info_list[i].img_list = data.info_list[i].img_list.slice(0, 1)
                // console.log('@@@img_list', data.info_list[i].img_list);
              }
              if (!data.info_list[i].objectstat.view_start) data.info_list[i].objectstat.view_start = 0;//数量统计设置默认值为0
              if (!data.info_list[i].put_count) data.info_list[i].put_count = 0;
              if (!data.info_list[i].objectstat.favour) data.info_list[i].objectstat.favour = 0;
              if (!data.info_list[i].objectstat.oppose) data.info_list[i].objectstat.oppose = 0;
              if (!data.info_list[i].comment_stat.all_comment_count) data.info_list[i].comment_stat.all_comment_count = 0;
              if (!data.info_list[i].comment_stat.user_comment_count) data.info_list[i].comment_stat.user_comment_count = 0;
              if (!data.info_list[i].comment_stat.broker_comment_count) data.info_list[i].comment_stat.broker_comment_count = 0;
            }
            _this.newType = data.info_list[0].info_type;
            console.log(_this.newType);
            _this.pageNo = 1;
            _this.getInforList(function (res) {
              _this.list = data.info_list;
            });
          }
        })
      },
      toPoint: function () {
        this.$router.push({name: 'release'})
      },
      changeID: function (data) {
        this.newType = data.info_type;
        this.nowid = data.info_id;
        this.$store.state.detailController.id = data.info_id;
        // console.log('videourl',data.url)
        if (data.media_type == "video") {
          this.vieoPlay = data.img_list[0];
        } else {
          this.vieoPlay = '';
        }
      },
      changeCommment: function (data) {
        let _this = this;
        let thisobj = _this.list.find(function (x) {
          return x.info_id === _this.nowid
        });
        let thisIndex = _this.list.indexOf(thisobj);
        if (data.type == 'comment') {
          _this.list[thisIndex].comment_stat.all_comment_count = data.date;
        } else if (data.type == 'favoue') {
          var favourStr = parseInt(_this.list[thisIndex].objectstat.favour) + parseInt(data.date);
          if (favourStr < 0) {
            _this.list[thisIndex].objectstat.favour = 0;
          } else {
            _this.list[thisIndex].objectstat.favour = favourStr;
          }
        }

      },
      changeType: function (data) {
     this.newType = data;
      this.list = [];
      this.newsListLoading = true;
      this.nowid = "";
      this.pageNo = 1;
      this.getInforList();

      },
      nextPage: function (data) {
        this.pageNo++;
        if (this.pageNo <= this.totalpage) {
          this.getInforList();
        }
      }
    },

  }
</script>
<style scoped lang="less">
  @import "../../assets/style/public";

  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }

  .information {
    color: @com-h3-font;
    font-size: @font - 2;
    height: calc(100%);
    background: @com-module-bg;
  }
</style>

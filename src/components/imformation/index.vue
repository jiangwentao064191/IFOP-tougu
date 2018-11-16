<template>
  <div class="information clearfix">
    <news-list :msgList="list" :tabIndex="newType"
               @nextPage="nextPage"
               :loading="newsListLoading"
               :nowid="nowid"
               :isLoading="isLoading"
               @changeID="changeID"
               @changeType="changeType"
               @refreshList="refresh" @setLoding="setLoding">
    </news-list>
    <right-content :newsid="nowid" :videos="vieoPlay" :loading="newsListLoading" :tabname="tabName"
                   @changeCommment="changeCommment" :new-type="newType"/>
    <!--<el-button id="big" @click="bigBtn">加大</el-button>-->
  </div>

</template>

<script>
  import send from '../../assets/js/ajaxSend'
  import {getMyImformationListAPI} from "../../assets/apiRegular";
  import rightContent from './right'
  import newsList from './newList'

  export default {
    data() {
      return {
        vieoPlay: '',
        isLoading: false,
        nowid: '',
        newType: "info",
        pageNo: 1,
        newsListLoading: false,
        totalpage: 1,
        list: [],
        user: '',
        allComment: '',
        tabName: '',
      };
    },
    components: {
      rightContent,
      newsList
    },
    name: "imformation",
    beforeCreate: function () {
      this.$store.state.loadingContent = false;
      this.$store.state.nowContent = 'mine'
    },
    mounted: function () {
      // this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      if (this.$route.query.nowid) this.nowid = this.$route.query.nowid;
      if (this.nowid !== '' && this.nowid !== null) {
        this.getNowInfor()
      } else {
        this.pageNo = 1;

        /*  let infoList = JSON.parse(localStorage.getItem('infoList'));
          if(infoList){
            this.list = [];
            this.list = infoList;
            this.isLoading = false;
            console.log('success',infoList)
          }*/
        this.getInforList(1);
      }
    },
    methods: {
      bigBtn: function () {
        document.getElementById('app').className = 'font' + 4
        console.log(' document.body.className', document.body)
      },
      getInforList: function (suc) {
        let _this = this;

        send.ajaxSend({
          url: getMyImformationListAPI,
          thisVue: _this,
          data: {
            "page.size": 10,
            "page.no": _this.pageNo,
            "info_type": _this.newType,
            "publisher_id": _this.user.user_id,
          },
          success: function (data) {
            _this.newsListLoading = false;
            for (let i = 0; i < data.info_list.length; i++) {
              if (data.info_list[i].info_id === _this.nowid) data.info_list.splice(i, 1);
              if (data.info_list[i].img_list) data.info_list[i].img_list = data.info_list[i].img_list.split(',');//img_list转数组
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
              _this.nowid = data.info_list[0].info_id;
              if (data.info_list[0].media_type == "video") {
                _this.vieoPlay = data.info_list[0].img_list[0];
                console.log('_this.videoplay',data.info_list[0].img_list[0]);
              } else {
                _this.vieoPlay = '';
              }
            }
            /* if(_this.pageNo != 1){
               _this.list = _this.list.concat(data.info_list);
             }else{
               _this.list = data.info_list
             }*/
            _this.list = _this.list.concat(data.info_list);
            _this.totalpage = data.page.totalpage;

            let guidList = JSON.parse(localStorage.getItem('userGuidList'));
            if(!guidList){
              guidList = [];
            }
            let guidListNum = 0;
            for(let i = 0;i<guidList.length;i++){
              let itemObj = JSON.parse(guidList[i]);
              if(itemObj.userId ==  _this.user.user_id){
                guidListNum = 1;
                if(!itemObj.isShowfb && _this.list.length < 1){
                  _this.$store.state.isShowInfo = true;
                }
              }
            }
            if(guidListNum == 0 && _this.list.length < 1){
              _this.$store.state.isShowInfo = true;
            }

           /* if(!localStorage.getItem('isShowfb') && _this.list.length < 1){
              _this.$store.state.isShowInfo = true;
            }*/
            //  localStorage.removeItem("infoList");
            //  localStorage.setItem("infoList", JSON.stringify(_this.list));
            // console.log('json',JSON.parse(localStorage.getItem('infoList')));
          }
        })
      },
      getNowInfor: function () {
        let _this = this;
        _this.newsListLoading = true;
        send.ajaxSend({
          url: getMyImformationListAPI,
          thisVue: _this,
          data: {
            "info_ids": _this.nowid,
            "publisher_id": _this.user.user_id,
          },
          success: function (data) {
            _this.newsListLoading = false;

            for (let i = 0; i < data.info_list.length; i++) {
              if (data.info_list[i].img_list) data.info_list[i].img_list = data.info_list[i].img_list.split(',');//img_list转数组
              if (!data.info_list[i].objectstat.view_start) data.info_list[i].objectstat.view_start = 0;//数量统计设置默认值为0
              if (!data.info_list[i].put_count) data.info_list[i].put_count = 0;
              if (!data.info_list[i].objectstat.favour) data.info_list[i].objectstat.favour = 0;
              if (!data.info_list[i].objectstat.oppose) data.info_list[i].objectstat.oppose = 0;
              if (!data.info_list[i].comment_stat.all_comment_count) data.info_list[i].comment_stat.all_comment_count = 0;
              if (!data.info_list[i].comment_stat.user_comment_count) data.info_list[i].comment_stat.user_comment_count = 0;
              if (!data.info_list[i].comment_stat.broker_comment_count) data.info_list[i].comment_stat.broker_comment_count = 0;
            }
            _this.newType = data.info_list[0].info_type;
            console.log(',;lkl;kl;',_this.newType);
            _this.pageNo = 1;
            _this.list = data.info_list;
            _this.getInforList();
            /* _this.getInforList(function (res) {
                _this.list = data.info_list;
                if (data.info_list[0].media_type == "video") {
                  _this.vieoPlay = data.info_list[0].img_list[0];
                  // console.log('_this.videoplay',data.info_list[0].img_list[0]);
                } else {
                  _this.vieoPlay = '';
                }
                console.log('00000000000000', data)
                // localStorage.removeItem("infoList");
                // localStorage.setItem("infoList", JSON.stringify(_this.list));
              });*/
          }
        })
      },
      toPoint: function () {
        this.$router.push({name: 'release'})
      },
      changeID: function (data) {
        this.newType = data.info_type;
        this.nowid = data.info_id;
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
      setLoding:function(){
        this.newsListLoading = true;
      },
      refresh: function () {
        this.list = [];
        this.newsListLoading = true;
        this.nowid = "";
        this.pageNo = 1;
        this.getInforList()
      },
      changeType: function (data) {
        this.newType = data.code;
        this.tabName = data.name;
        this.list = [];
        this.newsListLoading = true;
        this.nowid = "";
        this.pageNo = 1;
        this.getInforList()
      },
      nextPage: function (data) {
        if (data) {
          this.pageNo++;
          if (this.pageNo <= this.totalpage) {
            this.getInforList();
          }
        }
      },
    },

  }
</script>
<style scoped lang="less">
  @import "../../assets/style/public";
  @import "../../assets/style/font";

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

  /*.font( @font:16px) {
    font-size: @font;
  }*/

</style>

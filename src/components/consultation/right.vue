<template>
  <div class="clearfix" style="height: 100%;">
    <div class="hotspot-list" v-if="tabIndex == 1">
      <li class="list-li li-pro">
        <span class="list-code">序号</span>
        <span class="list-code">关键词</span>
        <span class="list-code">搜索热度</span>
      </li>
      <div class="hot-list">
      <li class="list-li" v-for="(item,index) in hotList">
        <span class="list-num num-color">{{index + 1}}</span>
        <span class="list-cont">{{item.keyword | setTextLength(8)}}</span>
        <span class="list-code">{{item.heat}}</span>
      </li>
      </div>
      <p class="no-data" v-if="noList">暂无数据</p>
    </div>
    <div class="hotspot-list watch-list" v-if="tabIndex == 2">
      <div>
        <li class="list-li" v-for="item in queryBrokerList">
          <span class="list-num">{{item.workDay}}</span>
          <span class="list-cont">{{item.workDay | getWorkDay}}</span>
          <span class="list-code">{{item.startTime}}-{{item.endTime}}</span>
        </li>
        <!--
        <li class="list-li">
          <span class="list-num">2018-03-25</span>
          <span class="list-cont">周日</span>
          <span class="list-code">9：00-8:00</span>
        </li>-->
      </div>
      <!--<p class="no-data" v-if="noList">暂无数据</p>-->
      <div class="apply-btn">
        <div class="btn">申请调班</div>
        <p class="apply-pro">请提前两天申请</p>
      </div>
    </div>
    <div class="hotspot-list ques-answer" v-if="tabIndex == 3" @scroll="toNextPage($event)">
      <li class="ques-answer-li clearfix" v-for="item in queryInterList">
        <img class="head-img" src="/assets/img/logo.png">
        <div class="ques-right">
          <p class="list-name clearfix">
            <span class="nick-name">Skeye</span>
            <span class="list-time">{{item.msg_createtime}}</span>
            <img class="answer-img" src="/assets/img/logo.png"></p>
          <p class="list-cont">{{item.msg_content}}</p>
        </div>
      </li>
      <p class="no-data" v-if="noList">暂无数据</p>
      <!--<li class="ques-answer-li clearfix">
        <img class="head-img" src="/assets/img/logo.png">
        <div class="ques-right">
          <p class="list-name clearfix">
            <span class="nick-name">Skeye</span>
            <span class="list-time">2018-04-22 11:20</span>
            <img class="answer-img" src="/assets/img/logo.png"></p>
          <p class="list-cont">海里股份600619，请问该情况以及未来走势如何请问该情况以及未来走势如何</p>
        </div>
      </li>-->

    </div>
    <div class="hotspot-list reward" v-if="tabIndex == 4">
      <div class="reward-content">
        <p>
          <span>打赏功能：</span>
          <el-switch class="open-text"
                     v-model="openReward"
                     active-color="#D9BA82"
                     inactive-color="#999"
                     active-text="开启">
          </el-switch>
          <!--<input type="radio" v-model="openReward" @click="change(this);"/>-->
        </p>
        <div class="reward-footer">
          <div class="input-grop">
            <el-input v-model="reward1"></el-input>
            元
          </div>
          <div class="input-grop">
            <el-input v-model="reward2"></el-input>
            元
          </div>
          <div class="input-grop">
            <el-input v-model="reward3"></el-input>
            元
          </div>
        </div>
        <p class="amount-pro">可自定义设置打赏金额</p>
        <div class="btn-ok">
          <span class="btn" @click="setRewardSetting">确定</span>
        </div>
      </div>
    </div>
    <div class="tab-list">
      <!--<li class="tab-li" :class="{'tab-li-active':tabIndex == 1}" @click="tabClick(1)">热点</li>-->
      <li class="tab-li" :class="{'tab-li-active':tabIndex == 2}" @click="tabClick(2)">值班表</li>
      <!--<li class="tab-li" :class="{'tab-li-active':tabIndex == 3}" @click="tabClick(3)">精彩问答</li>-->
      <li class="tab-li" :class="{'tab-li-active':tabIndex == 4}" @click="tabClick(4)">打赏功能</li>
    </div>
  </div>
</template>

<script>
  import '../../assets/style/consultation.less'
  import {
    getHotWordsAPI,
    queryinterAPI,
    queryBrokerscheduleAPI,
    getRewardSettingAPI,
    setRewardSettingAPI,
    getWeekDay
  } from '../../assets/apiRegular'
  import send from '../../assets/js/ajaxSend'

  export default {
    name: "right",
    data() {
      return {
        tabIndex: 1,
        openReward: 'false',
        reward1: 10,
        reward2: 20,
        reward3: 50,
        user: '',
        sessionId: '',
        hotList: [],
        queryInterList: [],
        queryInterPageNo: 1,
        queryInterTotal: 1,
        queryBrokerList: [],
        canNext: true,
        arrTime: {},
        noList:false,
      }
    },
    mounted: function () {
      let _this = this;
      var data = new Date();
      _this.arrTime = getWeekDay(data.getFullYear(), data.getMonth() + 1, data.getDate());

      // _this.user = JSON.parse(JSON.parse(localStorage.getItem('logininfo')).user);
      _this.user = JSON.parse(localStorage.getItem('logininfo')).user;
      _this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      console.log('_this.sessino', _this.sessionId)
      console.log('_this.user',_this.user.user_id)
      _this.tabClick(1);
    },
    methods: {
      change: function () {
        // console.log('fd',this.openReward)
        this.openReward = !this.openReward;
      },
      tabClick: function (index) {
        let _this = this;
        _this.tabIndex = index;
        if (index == 1) {
          //热点
          send.ajaxSend({
            url: getHotWordsAPI,
            thisVue: _this,
            data: {},
            success: function (data) {
              // console.log('ffffff',data,data.result.length);
              if(data.result.length){
                _this.noList = false;
                if (data.result.length > 10) {
                  _this.hotList = data.result.splice(0, 10);
                } else {
                  _this.hotList = data.result;
                }
              }else{
                _this.noList = true;
              }

            }
          });
        } else if (index == 2) {
          //值班表
          send.ajaxSend({
            url: queryBrokerscheduleAPI,
            thisVue: _this,
            data: {
              'session_id': _this.sessionId,
              'start_date': _this.arrTime.startTime,
              'end_date': _this.arrTime.endTime
            },
            success: function (data) {
              console.log('queryBrokerList', data)
              if (data.dataList) {
                _this.queryBrokerList = data.dataList;
                _this.noList = false;
              }else{
                _this.noList = true;
              }
            }
          });

        } else if (index == 3) {
          //精彩问答
          _this.queryInter();
        } else if (index == 4) {
          //打赏设置
          _this.getRewardsetting();
        }
      },
      //精彩问答
      queryInter: function () {
        let _this = this;
        send.ajaxSend({
          url: queryinterAPI,
          thisVue: _this,
          data: {
            'page.size': 10,
            'page.no': _this.queryInterPageNo,
            'session_id': _this.session_id,
            'user_id': _this.user.user_id,
          },
          success: function (data) {
            console.log('querier', data);
            if (data.datalist) {
              _this.noList = false;
              _this.queryInterList = data.datalist;
            }else{
              _this.noList = true;
            }
            _this.queryInterTotal = data.page.totalpage;
          }
        });
      },
      toNextPage: function (e) {
        let domHeight = e.srcElement.scrollHeight;
        let viewHeight = e.srcElement.clientHeight;
        let scrollHeight = e.srcElement.scrollTop;
        if (domHeight <= viewHeight + scrollHeight + 84) {
          this.queryInterPageNo++;
          if (this.queryInterPageNo <= this.queryInterTotal) {
            this.queryInter();
          }
          this.canNext = false;
        }
      },
      //获取打赏设置
      getRewardsetting: function () {
        let _this = this;
        send.ajaxSend({
          url: getRewardSettingAPI,
          thisVue: _this,
          data: {'session_id': _this.sessionId},
          success: function (data) {
            // console.log('getRe', data.askrewardsetting);
            if (data) {
              if (data.askrewardsetting.opened == 1) {
                _this.openReward = true;
              } else {
                _this.openReward = false;
              }
              if (data.askrewardsetting.amounts) {
                let amountsArr = data.askrewardsetting.amounts.split(',');
                _this.reward1 = amountsArr[0];
                _this.reward2 = amountsArr[1];
                _this.reward3 = amountsArr[2];
              }
            }
          }
        });
      },
      setRewardSetting: function () {
        let _this = this;
        let opened = 1;
        if (!_this.openReward) {
          opened = 0;
        }
        let amountsStr = _this.reward1 + ',' + _this.reward2 + ',' + _this.reward3;
        send.ajaxSend({
          url: setRewardSettingAPI,
          thisVue: _this,
          data: {
            'session_id': _this.sessionId,
            'opened': opened,
            'amounts': amountsStr,
          },
          success: function (data) {
            _this.$message({
              message: '设置成功',
              type: 'success',
            });
          }
        });
      }
    },
  }
</script>

<style lang="less">
  @import "../../assets/style/public";

  .hotspot-list {
    .li-pro{
      background-color: @com-module-bg;
    }
    .no-data {
      text-align: center;
      padding-top: 40px;
      color: @com-h4s4-font;
    }
  }

  .reward {
    .reward-content {
      padding: 20px;
      .reward-footer {
        width: 328px;
        margin-top: 20px;
        .input-grop {
          display: inline-block;
          margin-right: 10px;
          width: 26%;
          &:last-child {
            margin-right: 0px;
          }
        }
      }
      .amount-pro {
        color: @com-h4s4-font;
        margin-top: 10px;
      }
      .btn-ok {
        text-align: center;
        margin-top: 20px;
        .btn {
          display: inline-block;
          vertical-align: top;
        }
      }
    }
    .open-text {
      .el-switch__label.is-active {
        color: @com-h3-font !important;
      }
    }
    .el-input {
      /*position: relative;*/
      font-size: 14px;
      display: inline-block;
      width: 70%;
      margin-right: 5px;
    }
    .el-input__inner {
      background-color: @com-input-bg;
      border-radius: 2px;
      border: none;
      color: @com-input-color-sr;
      height: 40px;
      line-height: 40px;
      text-align: center;
      padding: 0 5px;
      /*width: 30%;*/
    }
  }
</style>

<template>
  <div class="consultation-cont">
    <div class="cont-header clearfix">
      <ul>
        <li class="header-li"><span class="header-pro">已值班时长：</span><span
          class="header-cont">{{brokerInfo.duration}}分钟</span></li>
        <li class="header-li"><span class="header-pro">今日被打赏金额：</span><span
          class="header-cont color-amount">{{brokerInfo.dayReward || 0}}元</span></li>
        <li class="header-li"><span class="header-pro">本周被打赏金额：</span><span
          class="header-cont color-amount">{{brokerInfo.weekReward || 0}}元</span></li>
        <li class="header-li"><span class="header-pro">本月被打赏金额：</span><span
          class="header-cont color-amount">{{brokerInfo.monthReward || 0}}元</span></li>
        <li class="header-li last-li"><span class="header-pro">累计被打赏金额：</span><span class="header-cont color-amount">{{brokerInfo.totalReward || 0}}元</span>
        </li>
        <li class="header-li"><span class="header-pro">服务人次：</span><span class="header-cont">{{brokerInfo.servicecount || 0}}人</span>
        </li>
        <li class="header-li"><span class="header-pro">好评率：</span>
          <img src="/static/icon/pic_star2@2x.png" v-if="brokerInfo.avgrating > 0" v-for="item in brokerInfo.avgrating">
          <!-- <img src="/static/icon/pic_star2@2x.png"/>
           <img src="/static/icon/pic_star2@2x.png"/>-->
          <i class="iconfont icon-kcxq_icon_sc" v-if="isSvgrating > 0"
             v-for="item in isSvgrating"></i>
          <!--<i class="iconfont icon-kcxq_icon_sc"></i>-->
          <span class="header-cont">{{brokerInfo.avgrating}}</span>
        </li>
        <li class="header-li"><span class="header-pro">满意度：</span><span
          class="header-cont">{{brokerInfo.satisfaction}}</span></li>
        <li class="header-li"><span class="header-pro">不满意度：</span><span class="header-cont">{{brokerInfo.dissatisfaction}}</span>
        </li>
        <li class="header-li last-li"><span class="header-pro">被投诉次数：</span><span class="header-cont">{{brokerInfo.complaintCount || 0}}次</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getBrokerInfoAPI} from '../../assets/apiRegular'
  import send from '../../assets/js/ajaxSend'
  import "../../assets/style/consultation.less";

  export default {
    name: "headerDiv",
    data() {
      return {
        sessionId: '',
        brokerInfo: '',
        isSvgrating: 0,
      }
    },
    mounted: function () {
      let _this = this;
      _this.sessionId = JSON.parse(localStorage.getItem('logininfo')).session_id;
      send.ajaxSend({
        url: getBrokerInfoAPI,
        thisVue: _this,
        data: {'session_id': _this.sessionId},
        success: function (data) {
          _this.brokerInfo = data;
          _this.isSvgrating = 5 - _this.brokerInfo.avgrating
          console.log('servicecount', data)
        }
      });
    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

</style>

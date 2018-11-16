  <template>
    <div class="v-selfSelect" v-loading="loading" element-loading-background="transparent"
         element-loading-text="敬请期待" element-loading-spinner=" ">
      <div class="title">
        <i class="iconfont icon-tietel_bg_picx1"></i>
        <span class="text">自选股</span>
      </div>
    </div>
  </template>

  <script>
    import send from '../../assets/js/ajaxSend'
    import {getStockAPI} from "../../assets/apiRegular";
    export default {
      name: "selfSelect",
      data(){
        return {
          list:[],
          loading:true
        }
      },
      mounted:function () {
        let _this = this;
        send.ajaxSend({
          url:getStockAPI,
          thisVue:_this,
          data:{"session_id":_this.$store.state.sessionID},
          success:function (data) {

          }
        })
      }

    }
  </script>

  <style scoped lang="less">
    @import "../../assets/style/public";
    .v-selfSelect{
      /*background:linear-gradient(to bottom right, #FF3531 , #FF7A79);*/
      background-color: @com-body-bg;
      .title{
        .xiebian(@com-h1S1-font, @com-module-title-bg,32px);
        .iconfont{
          color:@com-tab-A-color;
          font-size: 32px;
        }
        .text{
          width: 72px;
        }
      }
    }
  </style>

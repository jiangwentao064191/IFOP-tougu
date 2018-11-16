<template>
  <div class="nowCL">
    <div class="nowCL-title">
      共{{maxContent}}个结果
    </div>
    <div class="CL-block">
      <div v-for="data in CLlist" class="CL-content">
        <div class="CL-content-title">
          {{data.portfolio_name}}
        </div>
        <div class="CL-num">
          <div class="CL-num-block">
            <div class="CL-num-title">累计收益</div>
            <div :class="{'CL-num-num':true,'red':data.total_profit_ratio > 0,'green':data.total_profit_ratio < 0}">
              {{data.total_profit_ratio | toFixed2_100 }}%
            </div>
          </div>
          <div class="CL-num-block">
            <div class="CL-num-title">当日收益</div>
            <div :class="{'CL-num-num':true,'red':data.today_profit_ratio > 0,'green':data.today_profit_ratio < 0}">
              {{data.today_profit_ratio | toFixed2_100 }}%
            </div>
          </div>
        </div>
        <div class="CL-main">
          <div>
            价格：<span class="red"></span>
            <div class="float-r">
              实盘天数：<span class="c-gold">{{data.period}}天</span>
            </div>
          </div>
          <div>
            已订阅人数：<span class="c-gold">{{data.track_count}}人</span>
            <div class="float-r">
              服务级别：<span class="c-gold">{{data.service_level| LEVEL}}</span>
            </div>
          </div>
          <div>
            最大可订阅人数：<span class="c-gold">{{data.max_track_count}}人</span>
            <div class="float-r">
              <span class="c-gold"></span>
            </div>
          </div>
        </div>
        <div class="CL-bottom">
          {{data.portfolio_desc}}
        </div>
      </div>
    </div>

    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSizes"
        layout="total, prev, pager, next, jumper"
        :total="maxContent">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import send from '../../assets/js/ajaxSend'
    export default {
        name: "nowCL",
      data(){
          return {
            CLlist:[],
            maxContent:0,
            currentPage:1,
            pageSizes:6,
          }
      },
      beforeCreate:function(){
        this.$store.state.loadingContent = false;
        this.$store.state.clNowContent = 'nowCL';
      },
      methods:{
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.getCLlist(val)
        },
          getCLlist:function (pageNo) {
            let _this = this;
            _this.$store.state.loadingCL = true;
            let message = {};
            message['publish_status']='Y';
            message['page.size']=_this.pageSizes;
            message['page.no']=pageNo;

            send.ajaxSend({
              url:_this.$store.state.api.searchCLlist,
              data:message,
              vue:_this,
              success:function (data) {
                console.log('da',data)
                _this.$store.state.loadingCL = false;
                _this.CLlist = data.datalist;
                // _this.CLlist = _this.CLlist.concat(data.datalist);
                _this.maxContent = parseInt(data.page.totalcount);
              }
            })
          }
      },
      mounted:function () {
        this.getCLlist(1)
      }
    }
</script>

<style scoped lang="less">
  @import "../../assets/style/public.less";
  .nowCL{
    text-align: left;
    .nowCL-title{
      padding: 5px;
      font-size: 14px;
    }
    .CL-block{
      display: flex;
      flex-wrap: wrap;
      justify-content:left;
      .CL-content{
        width: 350px;
        position: relative;
        height: 400px;
        overflow: hidden;
        color: #aaa;
        transition: all .5s;
        float: left;
        border-radius: 10px;
        margin: 10px;
        background: @com-body-bg;
        .CL-content-title{
          padding: 20px;
          text-align: center;
          color:#d9ba82 ;
          font-size: 20px;
        }
        .CL-num{
          display: flex;
          font-size: 14px;
          margin:0 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid @com-solidS1-bg;
          .CL-num-block{
            width: 50%;
            padding: 10px;
            .CL-num-title{
              padding: 10px 0;
            }
            .CL-num-num{
              font-size: 30px;
              font-family: Arial,serif;
            }
          }
        }
        .CL-main{
          padding: 15px;
          line-height: 2em;
          font-size: 14px;
        }
        .CL-bottom{
          padding: 20px;
          background: #3c4152;
          height: 60px;
          position: absolute;
          bottom: 0;
        }
        &:hover{
          box-shadow: 0 0 10px #fff;
          cursor: pointer;
        }
      }
    }
    .red{
      color: red;
    }
    .green{
      color: green;
    }
    .c-gold{
      color: #d9ba82;
    }
    .float-r{
      float: right;
    }
  }
</style>

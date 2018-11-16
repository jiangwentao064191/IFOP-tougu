<template>
  <el-container >
    <el-header class="touzi-main" height="auto">
      <router-link class="main-back" to="/index/mine">
        < 返回
      </router-link>
      <router-link :class="{'tap-link':true,'active':$store.state.clNowContent === 'nowCL'}" to="/index/touziMain/nowCL">
        当前策略池
      </router-link>
      <router-link :class="{'tap-link':true,'active':$store.state.clNowContent === 'historyCL'}" to="/index/touziMain/historyCL">
        历史策略池
      </router-link>
      <router-link :class="{'tap-link':true,'active':$store.state.clNowContent === 'rankings'}" to="/index/touziMain/rankings">
        交易统计
      </router-link>
      <router-link :class="{'tap-link':true,'active':$store.state.clNowContent === 'transaction'}" to="/index/touziMain/transaction">
        排行榜
      </router-link>
      <div class="float-r-input">
        <span class="el-icon-search"></span>
        <input type="search" placeholder="名称/关键字"/>
      </div>
    </el-header>
    <el-main v-loading="$store.state.loadingCL" element-loading-background="rgba(200,200,200, 0.5)">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    beforeCreate:function(){
      this.$store.state.nowContent = 'mine'
    },
    mounted:function(){
      this.$store.state.loadingContent = false;
      console.log(this.$store.state.nowContent)
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .el-container{
    height: 100%;
  }
  .el-main::-webkit-scrollbar,.el-aside::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 0;
  }
  .touzi-main{
    text-align: left;
    width: 100%;
    height: auto;
    padding: 0;
    background: @com-body-bg;
    border-top: 1px solid @com-solidS1-bg;
    border-bottom: 1px solid @com-solidS1-bg;
  }
  .main-back{
    text-align: center;
    display: inline-block;
    font-size: 14px;
    padding: 8px 15px;
    border-right: 1px solid @com-solidS1-bg;
  }
  .tap-link{
    display: inline-block;
    font-size: 14px;
    color: #888;
    width: 150px;
    text-align: center;
  }
  .tap-link.active{
    color: #d9ba82;
  }
  .float-r-input{
    float: right;
    position: relative;
    padding: 5px 0;
    width: 180px;
    margin-right: 20px;
  }
  .float-r-input input{
    width: 100%;
    border:none;
    outline: none;
    height: 25px;
    line-height: 25px;
    padding-left: 40px;
    background: @com-input-bg;
    font-size: 12px;
    color: white;
  }
  .float-r-input span{
    position: absolute;
    color: #888;
    top: 10px;
    left: 5px;
  }
</style>

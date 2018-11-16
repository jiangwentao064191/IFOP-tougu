<template>
  <el-container>
    <el-header height="40px"
               v-if="$store.state.isUni">
      <my-header :title-name="'客户端'"></my-header>
    </el-header>
    <el-container>
      <el-aside width="50px">
        <my-aside></my-aside>
      </el-aside>
      <el-main v-loading="this.$store.state.loadingContent" element-loading-background="rgba(200,200,200, 0.5)">
        <div class="router-content">
          <transition name="fade">
            <router-view/>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import myHeader from './myHeader'
  import myAside from './myAsider'
	export default {
		name: "frame",
		components:{
			myHeader,
			myAside
		},
		create:function () {
			// 窗口最大化，如果方法报错则非壳运行
			console.log(this.$store.state.isUni);
			try{
				maxWindowSize();
				console.log('首页')
			}catch(e){
				this.$store.state.isUni = false;
			}
		}
	}
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .el-container{
    height: 100%;
  }
  .el-header{
    padding: 0;
  }
  .el-aside{
    background-color: @com-nav-bg;
    border-right: 1px solid @com-solidS1-bg;
    color: white;
  }
  .el-main{
    background: @com-body-bg;
    padding: 0;
    margin: 0;
    &::-webkit-scrollbar,.el-aside::-webkit-scrollbar {/*滚动条整体样式*/
      width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 0;
    }
  }
  .router-content{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

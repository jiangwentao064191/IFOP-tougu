<template>
  <div>
    <div class="menu-block" @click="setState(data.url)" v-for="(data,index) in menuList">

      <router-link v-if="index!= 1" :to="'/index/'+data.url" :class="{nowMenu:$store.state.nowContent === data.url}">
        <div :class="{'menu-content':true,'line-top':data.line}">
        <img v-if="$store.state.nowContent === data.url" :src="$store.state.isDev + data.iconN"/>
        <img v-if="$store.state.nowContent !== data.url" :src="$store.state.isDev + data.icon"/>
        <div class="menu-name">{{data.name}}</div>
        </div>
      </router-link>
      <div :class="{'menu-content':true,'line-top':data.line}" class="hq" v-if="index == 1" @click='toMarket'>
        <img v-if="$store.state.nowContent === data.url" :src="$store.state.isDev + data.iconN"/>
        <img v-if="$store.state.nowContent !== data.url" :src="$store.state.isDev + data.icon"/>
        <div class="menu-name">行情</div>
      </div>
     <!-- <a @click="toLink(data.url)" :class="{nowMenu:$store.state.nowContent === data.url}">
        <div :class="{'menu-content':true,'line-top':data.line}">
          <img v-if="$store.state.nowContent === data.url" :src="$store.state.isDev + data.iconN"/>
          <img v-if="$store.state.nowContent !== data.url" :src="$store.state.isDev + data.icon"/>
          <div class="menu-name">{{data.name}}</div>
        </div>
      </a>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "myMenu",

    data(){
      return {
        menuList:this.$store.state.menuList,
      }
    },
    mounted:function(){
      this.$store.state.loadingMenu = false;
    },
    watch: {
    },
    methods:{
      toMarket(url) {
       // console.log('9999', url)
          showHQ();
      },
      setState:function (url) {
        if(url == 'index'){
          console.log('url',this.$store.state.detailController.type)
          if(this.$store.state.detailController.type != 'index'){
            this.$store.state.detailController.show = false;
          }else{
            this.$store.state.detailController.show = true;
          }

        }else if(url == 'mine' || url == 'market' || url == 'homePageLessonList' || url == 'customer' || url == 'message' || url == 'service' || url == 'informationAll'){
          this.$store.state.detailController.show = true;
        }
       // console.log('this.$store.state.detailController.type',this.$store.state.detailController.type)


      },
     /* toLink:function (url) {

        if(url == 'index'){
          this.$router.push(this.$store.state.menuUrl);
        }else{
          this.$store.state.menuUrl = this.$route.path;
          this.$router.push('/index/' + url);
        }

      }*/
    },
    watch:{
      $route(to, from) {
        this.$store.state.loadingContent = true;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public.less";
  .menu-block{
    transition: all .5s;
  }
  .hq {
    cursor: pointer;
  }
  .menu-name {
    color: @com-h4s4-font;
    font-size:
        @font - 2;
  }
  .menu-block a{
    color: @com-h4s4-font;
    font-size: 14px;
    text-align: center;
    display: block;
    padding: 0 5px;
    cursor: pointer;
    text-decoration: none;
    &:hover{
      background: @com-buttonIcoMy-X-bg;
      color: @com-buttonIcoMy-X-color;
    }
  }
  .menu-block a.nowMenu{
    background: @com-buttonIcoMy-X-bg;
    color: @com-buttonIcoMy-A-color;
    .menu-name{
      color:@com-buttonIcoMy-A-color;
    }
  }
  .menu-block img{
    width: 20px;
  }
  .menu-content{
    padding: 10px 0 10px 0;
  }
  .menu-content.line-top{
    border-bottom: 1px solid @com-solidS1-bg;
    margin-bottom: 10px;
    padding-bottom: 15px;
  }
</style>

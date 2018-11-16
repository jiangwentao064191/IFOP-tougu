<template>
  <div class="v-asider">
<!-- key的作用主要是为了高效的更新虚拟DOM。另外vue中在使用相同标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，
否则vue只会替换其内部属性而不会触发过渡效果 -->
    <div v-for="(data,key) in menuList" :key="key" :class="{nowMenu:$store.state.nowContent === data.url,'menu-block':true}">
      <router-link :to="'/index/'+data.url" @click.native="link(data.url)">
        <div :class="{'menu-content':true,'line-top':data.line}">
          <img v-if="$store.state.nowContent === data.url" :src="$store.state.devPath + data.iconN"/>
          <img v-if="$store.state.nowContent !== data.url" :src="$store.state.devPath + data.icon"/>
          <div class="menu-name">{{data.name}}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "myAside",
    data () {
      return {
        menuList:[]
      }
    },
    mounted:function () {
      this.menuList = this.$store.state.menuList
    },
     methods: {
    link(data) {
      if (data == "imformation") {
        localStorage.setItem("tabFlag", JSON.stringify({ code: "Report" }));
      }
    }
  }
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";
  .v-asider{
    .color-gray;
    font-size: @font - 2px;
    text-align: center;
    .menu-block{
      padding: 15px 0;
      img{
        margin-bottom: 5px;
        width: 20px;
      }
    }
    .menu-block.nowMenu{
      color:@com-h1S1-font ;
      background: @com-nav-bg;
    }
  }

</style>

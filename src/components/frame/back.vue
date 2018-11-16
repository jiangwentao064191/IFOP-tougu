<template>
  <div class="back-index">
    <div @click="goHome" class="back">
      &lt;返回
    </div>
    <div class="list">{{data}}</div>
  </div>
</template>

<script>
export default {
  name: "backIndex",
  props: ["data"],
  methods: {
    goHome() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/style/public";
.back-index {
  display: flex;
  color: @com-h1S1-font;
  font-size: @font - 2px;
  line-height: 40px;
  border-bottom: 1px solid @com-tab-M-border;
  margin-bottom: 5px;
  background: @com-module-title-bg;
  .back {
    padding: 0 10px;
    &:hover {
      cursor: default;
      color: @com-tab-X-color
    }
  }
  .list {
    border-left: 1px solid @com-solidS2-bg;
    padding-left: 10px;
    &:hover {
      cursor: default;
    }
  }
}
</style>

<template>
  <div class="mask flex-wrap-center" v-if="status">
    <div class="tip">
      <div>
      <p>尊敬的投顾老师您好！</p> 
      <p>该资讯仅黄金会员可观看。</p> 
      <p>购买黄金会员，可以享受更多的精品课程、专家咨询、直播接盘、量化策略。</p>  
      <p>如需购买，请下载”优股用户端“，在“我的”界面进行购买。</p>  
      </div>
      <div class="buttonBox flex-wrap-center">
        <div class="button flex-wrap-center" @click="hideMask">我知道了</div>
        <div class="button flex-wrap-center" @click="downloadUser">下载</div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "wicket",
  props: ["status"],
  methods: {
    hideMask() {
      let _this = this;
      _this.$emit("hide", false);
    },
    downloadUser(){
      openBrowser("http://resource.xinyusoft.com/download/ifop/");
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/style/public";
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5000;
  .tip {
    width: 36%;
    font-size: 14px;
    color: RGBA(221, 221, 221, 1);
    padding: 18px 31px 31px;
    line-height: 30px;
    background: RGBA(44, 51, 58, 1);
    box-shadow: 1px 1px 12px 0px rgba(0, 0, 0, 0.7);
    position: fixed;
    top:30%;
    left:30%;
    .buttonBox {
      padding: 15px 0 0;
      display: flex;
      justify-content: center;
      .button {
        width: 140px;
        height: 36px;
        border: 1px solid RGBA(255, 217, 4, 1);
        color: RGBA(255, 217, 4, 1);
        cursor: pointer;
        text-align: center;
        display: inline-block;
        margin-right: 58px;
      }
    }
    p {
      margin: 0;
    }
  }
}
</style>
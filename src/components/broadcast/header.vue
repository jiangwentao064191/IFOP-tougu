<template>
  <div class="header-div">
    <div class="content clearfix">
      <div class="left">
        <div class="left-content">
          <ul class="clearfix">
            <li class="cou-li">
              <p class="li-tit">报名人数</p>
              <p>112</p>
            </li>
            <li class="cou-li">
              <p class="li-tit">在线人数</p>
              <p>{{dataInfo.f_join_count}}</p>
            </li>
            <li class="cou-li">
              <p class="li-tit">评论数</p>
              <p>{{dataInfo.f_comment_count}}</p>
            </li>
            <li class="cou-li">
              <p class="li-tit">点赞数</p>
              <p>{{dataInfo.f_praise_count}}</p>
            </li>
            <li class="cou-li">
              <p class="li-tit">打赏金额</p>
              <p class="color-gold">{{dataInfo.f_money}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="right clearfix">
        <div class="right-btn">
          <i class="iconfont icon-kcxq_icon_share"></i>
        </div>
        <div class="right-btn">
          <i class="iconfont icon-shezhi"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "headerDiv",
    props: [
      'dataInfo'
    ],
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/public";

  .header-div {
    background-color: @com-module-bg;
    font-size: @font - 4;
    color: @com-h3-font;
    .content {
      border-bottom: 1px solid @com-solidS1-bg;
    }
    .left {
      float: left;
      width: 90%;
      .left-content {
        padding: 10px 140px;
        /*width: 100%;*/
        .cou-li {
          text-align: center;
          float: left;
          width: 20%;
          .li-tit {
            color: @com-sizeS1-color;
            line-height: 25px;
          }
          .color-gold{
            color:@com-sizeS1-color;
          }
        }
      }
    }
    .right {
      width: 10%;
      float: left;
      .right-btn {
        width: 50%;
        text-align: center;
        float: left;
        i {
          font-size: 26px;
          line-height: 52px;
        }
        &:hover {
          color: @com-button-X-font;
          background-color: @com-button-X-bg;
          border-bottom: 2px solid @com-button-X-border;
        }
        &:last-child {
          i {
            font-size: 30px;
          }
        }
      }
    }
  }

</style>

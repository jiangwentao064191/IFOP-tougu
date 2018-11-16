<template>
  <div>
    <div class="icon clearfix">
      <i class="icon iconfont icon-face" @click="showEmoji = !showEmoji"></i>
      <i class="iconfont icon-yanjing" @click="openMassage"></i>
      <!--<el-button type="success" size="small" @click="submit" class="submit">提交</el-button>-->
      <transition name="fade" mode="">
        <div class="emoji-box" v-if="showEmoji" >
         <el-button
            class="pop-close"
            :plain="true"
            type="danger"
            size="mini"
            icon="el-icon-close"
            @click="showEmoji = false"></el-button>
          <vue-emoji
            @select="selectEmoji">
          </vue-emoji>
          <span class="pop-arrow arrow"></span>
        </div>
      </transition>
    </div>
    <el-input
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 20}"
      resize="none"
      v-model="value">
    </el-input>

    <!--<transition-group tag="div" name="list" class="comment">
      <p v-for="(item,index) in data" :key="index" class="item">
        <span v-html="emoji(item)"></span>
      </p>
    </transition-group>-->
  </div>
</template>

<script>
  import vueEmoji from '../emoji'
    export default {
        name: "emojiInput",
      data () {
        return {
          value: '',
          showEmoji: false,
          data: []
        }
      },
      methods: {
        selectEmoji (code) {
          this.showEmoji = false
          this.value += code
        },
        submit () {
          this.data.push(this.value)
          this.value = ''
        },
        openMassage(obj){
          this.$emit("changeComment", true);
        },
      },
      components: {
        vueEmoji
      },
      watch:{
          "value":function () {
            this.$emit("getComment",this.value);
            // console.log('fasjdflsd',this.value)
          }
      },
    }
</script>

<style lang="less">
@import "../../assets/style/public";
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*color: #2c3e50;
    margin: 60px auto ;
    width: 500px;*/
    .el-textarea{
      height: 100px;
      overflow-y: auto;
    }
    .el-textarea__inner{
      background-color:@com-input-bg;
      border: none;
      color: @com-h3-font;
      resize: none;
      font-size: 14px;
      padding: 10px;
      margin-bottom:10px;
    }
    .icon {
      position: relative;
      // margin-top: 20px;
      .iconfont {
        cursor: pointer;
        font-size: 20px;
        /*color: #F7BA2A;*/
        &:first-child{
          margin-right: 10px;
        }

      }
      .emoji-box {
        position: absolute;
        z-index: 10;
        left: 0px;
        top: -220px;
        box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
        background: white;
        color: @com-input-color-sr;
        .el-button {
          position: absolute;
          border: none;
          color: @com-h3-font;
          right: -3px;
          top: 2px;
          z-index: 10;
          .el-icon-close{
            font-size: 20px;
          }
        }
        .is-plain{
          background: transparent;
        }
        .arrow {
          left: 10px;
        }
      }
      .submit {
        float: right;
      }
    }
    .comment {
      margin-top: 20px;
      .item {
        margin-top: 20px;
        padding: 10px;
        margin: 0;
        border-top: 1px solid @com-solidS1-bg;
      }
    }
  }

  .clearfix {
    &:after {
      content: '';
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }

  .fade-enter-active, .fade-leave-active { transition: opacity .5s; }
  .fade-enter, .fade-leave-active { opacity: 0; }
  .fade-move { transition: transform .4s; }

  .list-enter-active, .list-leave-active { transition: all .5s; }
  .list-enter, .list-leave-active { opacity: 0; transform: translateX(30px); }
  .list-leave-active { position: absolute !important; }
  .list-move { transition: all .5s;}
</style>

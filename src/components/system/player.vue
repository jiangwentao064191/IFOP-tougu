<template>
  <div class="container" v-show="showVideo">
    <div class="player">
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @statechanged="playerStateChanged($event)"
                    @timeupdate="onPlayerTimeupdate($event)">
      </video-player>
    </div>
  </div>
</template>

<script>
  import {videoPlayer} from 'vue-video-player'
  import 'videojs-contrib-hls'

  require('videojs-flash/dist/videojs-flash')

  export default {
    name: "player",
    props: {
      videoUrl: String,
      state: Boolean,
      aspectR:'',
      videoType:'',
      isPlay: {
        default: true
      }
    },
    data() {
      return {
        showVideo: true,
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: this.isPlay, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
           aspectRatio: this.aspectR ? this.aspectR : '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
         // techOrder: ['flash', 'html5'], // 兼容顺序
          sourceOrder: true, //
           flash: {hls: {withCredentials: false}},
           html5: {hls: {withCredentials: false}},
          sources: [
            {
              type: this.videoType,
              src: this.videoUrl,
              withCredentials: false,
            },{
              type: "video/mp4",
              src: this.videoUrl,
              withCredentials: false
            },
            /*{
              type: "application/x-mpegURL",
              src: this.videoUrl, //你的m3u8地址（必填）
              withCredentials: false,
            },*/
          ],
          // src:"http://uatfile.xinyusoft.com:91/cctvgtb/upload/0b2de0208462fa19194d805f814b6430.mp4",
          poster: "../../static/images/test.jpg", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: false,
            durationDisplay: true,
            remainingTimeDisplay: false,
            currentTimeDisplay: false,
            playbackRateMenuButton: false,
            fullscreenToggle: true  //全屏按钮
          }

          /* ["playToggle","volumePanel","currentTimeDisplay",
           "timeDivider","durationDisplay","progressControl",
           "liveDisplay","remainingTimeDisplay","customControlSpacer",
           "playbackRateMenuButton","chaptersButton",
           "descriptionsButton","subsCapsButton",
           "audioTrackButton","fullscreenToggle"]*/
        },
      }
    },
    beforeMount:function(){
      let str = this.videoUrl.substr(0,4);
      if(str == 'rtmp'){
        this.playerOptions.techOrder = ['flash', 'html5'];
      }
      console.log('this.videoUrl',this.playerOptions);

    },
    watch: {
//更改视频源 videoUrl从弹出框组件传值
      videoUrl: function (val) {
        if (val !== '') {
          this.showVideo = true;

          this.$refs.videoPlayer.player.src(val)
          console.log('this.$refs.videoPlayer', this.$refs.videoPlayer)
        }
      },
      /*state: function (val) {
        if (val) {
          this.$refs.videoPlayer.player.pause()
        }
      }*/
    },
    components: {
      videoPlayer
    },
    methods: {
      onPlayerPlay(player) {
      },
      onPlayerPause(player) {

      },
      playerStateChanged(player) {
        // console.log('paly',player)
      },
      onPlayerTimeupdate(player) {
        console.log('paly', player.duration())
        // this.playerCtrl.currentTime=timeUtil.secondToDate(player.currentTime());
        // this.playerCtrl.currentTimeInt=Math.floor(player.currentTime());
      },
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },

  }
</script>

<style lang="less">

  @import "../../assets/style/public";
   .video-player {
     /*width: 174px;*/
     /*height: calc(100%);*/
   }

  .vjs-custom-skin > .video-js .vjs-big-play-button {
    top: 38%;
    left: 50%;
    border-radius: 50%;
    width: 2em !important

  }

  /*   .vjs-control {
      width: 10px !important;
    }

    .vjs-control-bar {
      font-size: 8px !important;
      height: 20px;
      line-height: 20px;
    }*/


</style>

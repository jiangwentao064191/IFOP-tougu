<template>
  <div class="release">
    <div class="touzi-main" height="auto">
      <router-link class="main-back back-main" to="/index/imformation">
        < 返回
      </router-link>
      <span class="main-back main-backStyle" :class="{'tap-link':true,'active':tabIndex == 1}"
            @click="tabIndex = 1">
            发布观点
          </span>
      <span class="main-back main-backStyle" :class="{'tap-link':true,'active':tabIndex == 2}"
            @click="tabIndex = 2">
            PC预览
          </span>
      <!--<span class="main-back" :class="{'tap-link':true,'active':tabIndex == 3}"
            @click="tabIndex = 3">
            手机预览
          </span>-->
    </div>
    <viewpoint :tab-index="tabIndex" :date-time="dataTime" :from-date="formDate" :videos="vieoPlay" @getVideo="getVideo"></viewpoint>
  </div>
</template>

<script>
  import viewpoint from './viewpoint'

  export default {
    name: 'index',
    components: {
      viewpoint,
    },
    data() {
      return {
        videoUrl:'',
        vieoPlay: '',
        tabIndex: 1,
        dataTime: '',
        formDate: '',
      };
    },
    beforeCreate: function () {
      this.$store.state.loadingContent = false;
      this.$store.state.nowContent = 'mine'
    },
    created: function () {
      this.dataTime = this.getDateTime().substr(0,18);
    },
    mounted: function () {
      this.$store.state.loadingContent = false;


      if (this.$route.query.fromDate) this.formDate = this.$route.query.fromDate;
      if (this.formDate !== '' && this.formDate !== null) {
        console.log("this.form", this.formDate);

      } else {

      }

    },
    methods: {
      getVideo(data){
        console.log('getVideo',data)
        this.videoUrl = data;
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      getDateTime() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate + '   ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        return currentdate;
      },
    },
    watch:{
      tabIndex:function (value) {
        if(value == 2){
           this.vieoPlay = this.videoUrl;
        }else{
          this.vieoPlay = ''
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .release {
    height: 100%;
    .main-backStyle{
      margin: 0 20px;
    }
  }

</style>

<template>
  <div class="editor-cont">
    <div class='tinymce'>
      <textarea :id="id" :value="value"></textarea>
    </div>
  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/paste'


  import axios from 'axios'
  import {imgUrlAPI} from '../../assets/apiRegular'

  const INIT = 0;
  const CHANGED = 2;
  var EDITOR = null;

  export default {
    // name: 'tinymce',
    data(){
      return {

      }
    },
    props: {
      value: {
        type: String,
        required: true
      },
      setting: {}
    },
    watch: {
      value: function (val) {
        console.log('init ' + val)
        if (this.status == INIT || tinymce.activeEditor.getContent() != val) {
          tinymce.activeEditor.setContent(val);
        }
        this.status = CHANGED
      }
    },
    data() {
      return {
        status: INIT,
        id: 'editor-' + new Date().getMilliseconds(),
      }
    },
    mounted: function () {
      const _this = this;
      const setting =
        {
          selector: '#' + _this.id,

          init_instance_callback: function (editor) {
            EDITOR = editor;
            console.log("Editor: " + editor.id + " is now initialized.");
            editor.on('input change undo redo', () => {
              var content = editor.getContent();
              _this.$emit('editorInput', content);
            });
          },

          images_upload_handler: function (blobInfo, success, failure) {
            console.log('blobInfo, success, failure',blobInfo)
            if (blobInfo.blob().size > _this.maxSize) {
              failure('文件体积过大')
            }
            // uploadPic()
            let accept = "image/jpeg,image/jpg,image/png,image/bmp";

            if (accept.indexOf(blobInfo.blob().type) >= 0) {
              uploadPic()
            } else {
              failure('图片格式错误')
            }
            function uploadPic () {
              let formData = new FormData()
              // 服务端接收文件的参数名，文件数据，文件名
              formData.append('upfile', blobInfo.blob(), blobInfo.filename())
              axios({
                method: 'POST',
                // 这里是你的上传地址
                url: imgUrlAPI,
                data: formData,
              })
                .then((res) => {
                  // 这里返回的是你图片的地址
                  let url = '';
                  url = res.data.split('src="')[1];
                  url = url.split('" />')[0];
                  success(url)
                  //  console.log(res)
                  //   _this.$emit('editorInput', res.data);
                })
                .catch(() => {
                  failure('上传失败')
                })
            }
          },

          plugins: []
        };
      Object.assign(setting, _this.setting)

      tinymce.init(setting);
    },
    beforeDestroy: function () {
      tinymce.get(this.id).destroy();
    }
  }

</script>
<style lang="less">
  @import '../../assets/style/public.less';
  .mce-container{
    .mce-reset{
      .mce-title{
        color:@com-h3-font;
      }
      .mce-formitem{
        /*display: none;*/
        &:nth-child(2){
          margin-top:40px;
        }
        &:last-child{
          margin-top:60px;
        }
        &:nth-child(3){
          display: none;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  @import '../../assets/style/public.less';

  html {
    background-color: @com-module-bg;
    body {
      background-color: @com-module-bg;

      .editor-cont {
        /deep/ .tinymce {
          border: 0px solid @com-solidS1-bg !important;
          .mce-panel {
            background-color: @com-module-bg !important;
          }
          .mce-branding {
            display: none;
          }
          .mce-tinymce, .mce-edit-area, .mce-statusbar {
            border-width: 0px !important;
          }
          .mce-btn-group:not(:first-child) {
            border-width: 0px !important;
          }

          /*.mce-menu-item:hover, .mce-menu-item:focus{
            .mce-text{
              background-color: transparent;
              color: #000;
            }
          }*/
        }
        .mce-ico {
          background-color: transparent !important;
        }
        .mce-menu-item {
          .mce-text {
            color: @com-h3-font !important;
            background-color: transparent !important;
          }
        }
      }

    }
  }


</style>

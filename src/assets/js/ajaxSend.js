//axios请求公用方法
//引用 import name form '路径'
// name.方法名

import axios from 'axios'
import {apiUrl} from "../apiRegular";
let timeOutT = 1000 * 60 * 5; //5分钟
export default {
  //发送方法（ajax请求 action作为参数）
  //({
  //  url:接口
  // data:穿参
  // success:function(){}成功回调
  // error:function(){}失败回调
  // thisVue当前vue的this对象
  // })
  "ajaxSend":function (ajaxObj) {
    // if(ajaxObj.url !== 'user.p_login'&&ajaxObj.url !== 'cms.SelectVerifyObjectiveInfo'&&ajaxObj.url !== 'chat.queryChatRoomMember'&&ajaxObj.url !== 'chat.queryChatRoomByUser'){
    //   let localStorage = window.localStorage;
    //   let logininfo = localStorage.getItem("logininfo");
    //   if (logininfo !== null && typeof(logininfo) !== 'undefined' && logininfo.length !== 0) {
    //     ajaxObj.data["session_id"] = JSON.parse(logininfo).session_id;//sessionId;    //入参
    //   }
    // }
    if(!ajaxObj.data){
      ajaxObj.data={};//给data设置默认值
    }
    let timeOut;
    if(ajaxObj.time){
      timeOut = ajaxObj.time;
    }else{
      timeOut = timeOutT
    }
    //console.log('ajaxObj.time',timeOut)
    ajaxObj.data["command"] = ajaxObj.url;//接口放入到参数中
    axios({
      url:apiUrl + '/ifop/ESBServlet',
      method:'post',
      data:ajaxObj.data,
      timeout:timeOut,
      transformRequest: function(obj) {
        //入参格式统一修改
        let str = [];
        for (let p in obj) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).then(function(res){
      // 请求成功
      let data=res.data;
      //登录拦截
      // console.log('data.op',data)
      if(data.op){
        if(data.op.errorcode != null && data.op.errorcode === 'ERROR_CODE_1'){
        }else{
          // console.log('da',data)
          if(data.op.code === "Y"){

            // console.log('dengl',data)
          // 回调方法
          if(typeof ajaxObj.success === 'function')ajaxObj.success(data);
            if(typeof ajaxObj.error === 'function')ajaxObj.error(data);
          }else if(ajaxObj.thisVue){
            ajaxObj.thisVue.$message.error(data.op.info)
          }
        }
      }
    }).catch(function(error){
      let str = error + '';
      if(str.search('timeout') !== -1){
        ajaxObj.thisVue.$message({
          message: '当前网络异常，请稍后再试！',
          type: 'warning'
        });
      }
         if(ajaxObj.thisVue && ajaxObj.thisVue.fullscreenLoading){
           ajaxObj.thisVue.fullscreenLoading = false;
           ajaxObj.thisVue.$message.warning('发布失败！');
         }
      if(ajaxObj.loadingObj){
        //如果有控制加载层，则关闭加载层
        ajaxObj.loadingObj = false
      }
    });
  },
  "ajaxService":function (ajaxObj) {
    // if(ajaxObj.url !== 'user.p_login'&&ajaxObj.url !== 'cms.SelectVerifyObjectiveInfo'&&ajaxObj.url !== 'chat.queryChatRoomMember'&&ajaxObj.url !== 'chat.queryChatRoomByUser'){
    //   let localStorage = window.localStorage;
    //   let logininfo = localStorage.getItem("logininfo");
    //   if (logininfo !== null && typeof(logininfo) !== 'undefined' && logininfo.length !== 0) {
    //     ajaxObj.data["session_id"] = JSON.parse(logininfo).session_id;//sessionId;    //入参
    //   }
    // }
    if(!ajaxObj.data){
      ajaxObj.data={};//给data设置默认值
    }
    let timeOut;
    if(ajaxObj.time){
      timeOut = ajaxObj.time;
    }else{
      timeOut = timeOutT;
    }
    // console.log('ajaxObj.time',timeOut)
    axios({
      url:ajaxObj.url,
      method:'post',
      data:ajaxObj.data,
      timeout:timeOut,
      transformRequest: function(obj) {
        //入参格式统一修改
        let str = [];
        for (let p in obj) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).then(function(res){
      // 请求成功
      let data=res.data;
      //登录拦截
        // 回调方法
        if(typeof ajaxObj.success === 'function')ajaxObj.success(data);
      if(typeof ajaxObj.error === 'function')ajaxObj.error(data);
    }).catch(function(error){
      let str = error + '';
      if(str.search('timeout') !== -1){
        ajaxObj.thisVue.$message({
          message: '当前网络异常，请稍后再试！',
          type: 'warning'
        });
      }
      if(ajaxObj.loadingObj){
        //如果有控制加载层，则关闭加载层
        ajaxObj.loadingObj = false
      }
    });
  },
  //模拟请求
  "langReq":function(ajaxObj){
    if(!ajaxObj.data){
      ajaxObj.data={};//给data设置默认值
    }
    ajaxObj.data["command"] = ajaxObj.url;
    axios({
      url:apiUrl + '/ifop/ESBServlet',
      method:'post',
      data:ajaxObj.data,
      transformRequest: function(obj) {
        //入参格式统一修改
        let str = [];
        for (let p in obj) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).then(function(res){
      // 请求成功
      let data=res.data;
      //登录拦截
      if(data.op.errorcode != null && data.op.errorcode === 'ERROR_CODE_1'){

      }else{
        // 回调方法
        if(typeof ajaxObj.success === 'function')ajaxObj.success(data);
      }
    }).catch(function(error){
      if(ajaxObj.loadingObj){
        //如果有控制加载层，则关闭加载层
        ajaxObj.loadingObj = false
      }
    });
  },

}



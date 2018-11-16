// import * as api from './apiRegular'
// //引入mockjs
// const Mock = require('mockjs');
// // 使用mockjs模拟数据
// Mock.mock('http://baidu.com', (req, res) => {
//   console.log(req)
//   req.body = JSON.parse(req.body);
//   let command = req.body.command;
//   //获取二维码接口
//   if(command === api.getQr2){
//     return {
//       url:Mock.Random.url('http'),
//       op:""
//     }
//     //登录接口
//   }else if(command === api.langLogin){
//     return {
//       op:Mock.mock({"number|1-5": 5}).number,
//       user:{
//         userId:Mock.mock({"number|1-100": 100}).number,
//         name: Mock.mock('@cname'),
//         hasmobile:true
//       }
//     }
//   }
// });

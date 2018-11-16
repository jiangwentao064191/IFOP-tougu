// export const apiUrl = 'http://58.247.47.154:9527'; //测试环境
export const apiUrl = 'http://58.247.47.154:9527';
//export const apiUrl = 'http://api.yogu101.com';//优股生产
//export const apiUrl = 'http://www.yidao007.com';//优股预发布
//export const apiUrl = 'http://120.55.187.58:8092';


//export const imgUrlAPI = 'http://uatfile.xinyusoft.com:91/cctvgtb/Upload';//上传图片路径
//export const imgUrlAPI = 'http://ygtp.xinyusoft.com/cctvgtb/Upload';//优股图片上传路径
export const imgUrlAPI = apiUrl + '/upload/uploadFile';
export const getOnlineBrokersAPI = "broker.FindOnlineBrokers";  // 首页——获取在线投顾列表
export const getHotWordsAPI = "ask.Ask_Keyword"; //首页——获取热点关键字列表
// export const searchKeyAPI = "ask.Ask_Search"; // 咨询搜索
export const liveObjAPI = "live.Livebroadcast"; // 首页——直播
export const vcloudcreateChannelAction = apiUrl + "/ifop/ESBServlet";//新建课程——获取直播地址
//从用户端迁移的接口
export const getUserCourseSeriesAPI = "course.QueryUserCourseSeries"; // 首页&&课程详情&&课程列表- 获取用户课程列表
export const addParticipantAPI = "course.AddParticipant"; // 课程详情-用户参与
// export const getLessonListAPI = "ifop.p_getUserCourseList"; // 课程列表
export const getImformationListAPI = "cms.SelectPutObjectiveInfo"; // 首页进入资讯——获取资讯列表
export const getMyImformationListAPI = "cms.SelectObjectiveInfo"; // 我的进入资讯——获取我的资讯列表
export const getQr2API = apiUrl + '/ifop/ghGetQRCodeLogin';//登录——获取二维码字符串接口
export const watchLoginAPI = apiUrl + "/ifop/QueryLoginResult";//登录——轮询登录接口
export const getStockAPI = "ifop.p_getStockList";//首页——获取自选股列表
export const sendCodeAPI = "user.SendSmsVerificationCode";// 登录——获取手机验证码
export const bindMobileAPI = "user.CheckSmsVerificationCode";// 登录——绑定手机号
export const getImformationDetailAPI = "cms.GetContentInfo";//发布资讯——获取资讯详情
export const loginOldAPI = "user.p_QRCodeLogin";//登录——自动登录
export const VipUserListAPI = "vip.QueryVipUserList" // 首页- 获取用户vip信息
export const getMyfavourAPI = "objectstat.queryObjectFavourRecord";//资讯——查询对象点赞记录
export const geiImformationTagAPI = "tags.queryInfoRelationTag";// 发布资讯——获取标签
export const toFavourAPI = 'ifop.p_favour';// 资讯——点赞 取消点赞接口
export const getCommentAPI = 'ifop.p_querycomments';//资讯——获取当前资讯评论
export const releaseAPI = 'ifop.p_publish_info';//发布资讯——发布观点
export const subCommentAPI = 'ifop.p_comment';//资讯——评论提交
export const getImformationTypeListAPI = 'cms.FindInfoType';//资讯——获取资讯类型
export const resetEditorInforAPI = 'ifop.p_update_info_field';//发布资讯——修改资讯信息
export const deleteInfoAPI = 'ifop.p_del_info';//资讯——删除资讯信息
export const queryinterAPI = 'ifop.p_queryinterlocutionlist';//咨询——查询精彩问答列表
export const addQueryAPI = 'ifop.p_addinterlocution';//咨询——增加精彩问答
export const customerChatRoomAPI = 'chat.GetNewMsgList';//咨询——查询客户聊天室列表
//export const customerChatRoomAPI = 'chat.queryChatRoomByUser';//查询客户聊天室列表
export const sendMessageAPI = 'ifop.p_sendmsg';//咨询——发送消息
export const getQueryMsgAPI = 'chat.queryMsg';//咨询——查询消息
export const getNewMessageAPI = 'xpushplus.SyncEventFlow';//咨询——获取新消息
export const queryBrokerscheduleAPI = 'ifop.p_querybrokerschedule';//咨询——查询投顾排班表
export const getRewardSettingAPI = 'ifop.p_get_ask_reward_setting';//咨询——获取投顾咨询打赏设置
export const setRewardSettingAPI = 'ifop.p_set_ask_reward_setting';//咨询——投顾咨询打赏设置
export const getBrokerInfoAPI = 'ifop.p_get_broker_statistic_info';//咨询——获取投顾统计信息
export const addNewMsgAPI = 'chat.AddNewMsgCount';//咨询——发送消息在redis中计数
export const setMsgCountAPI = 'chat.SetMsgCountNull';//咨询——清楚Redis中计数
export const addLessonAPI = 'course.AddCourseSeries';//课程——新增课程
export const modifyCourse= 'ifop.p_UpdateCourseSeries';//课程——修改课程
export const deleteCourseAPI= 'ifop.p_DelCourseSeries';//课程——删除课程
export const lessonListAPI = 'ifop.p_QueryCourseSeries';//课程——课程列表
export const courseSeries = 'course.FindCourseSeries';//课程——课程详情
export const courseCount ="course.QueryCourseSeriesCount";//我的——查询课程数量接口
export const addSingleLessonAPI = 'course.AddCourse';//课程——新增单课
export const modifySingleCourse = 'course.UpdateCourse';//课程——修改单课
export const updateStatusAPI = 'course.UpdateCourseStatus';//课程——修改单课状态
export const singleLessonListAPI = 'course.QueryCourse';//课程——单课列表
export const singleCourseSeries = 'course.FindCourse';//课程——单课详情
export const deleteSingleLessonAPI = 'course.DelCourse';//课程——删除单课
export const queryViip = 'course.queryVip';//新建课程——查询用户等级
export const mediaCastPushAPI = 'course.FindChannel';//直播——获取直播流
export const getLiveRoomAPI = 'ifop.p_comLiveRoomData';//直播——进入直播间
export const getRoomListAPI = 'course.QueryLive';//直播——直播室列表，根据id获取直播室信息
export const getChatRoomIdAPI = 'ifop.p_get_course_chat_room';//直播——获取单课聊天室
export const addLiveRoomAPI = 'course.AddLive';//新建直播室——创建直播室;
export const updateLiveRoomAPI = 'course.UpdateLive';//新建直播室——修改直播室;
export const deleteliveRoomAPI = 'course.DelLive';//直播列表——删除直播室
export const setAlwaysAPI = 'vcloud.SetAlwaysRecordAction';//直播——设置直播录制
export const getActivityCountAPI = 'chat.GetGroupMemberActivityCount';//获取直播参与人次
export const chatRoomMemberAPI = 'chat.QueryChatRoomMember';//直播页面用户头像列表
export const FindChannelStatusAPI = "course.FindChannelStatus" // 直播详情 - 查询频道状态
export const webSocketURL = "http://121.199.50.195/#/quotes/"; // 行情-websocketUrl地址
export const getsnapshotAPI = "hq.getsnapshot"; // 行情-获取单个股票详情
export const gettimelineAPI = "hq.gettimeline"; // 行情-获取分时数据
export const getKLineActionAPI = "hq.getKLineAction"; // 行情-获取K线数据
export const getIndexRankListAPI = "hq.getIndexRankList"; //行情-获取行业股票列表
export const getIndustryAStocksAPI = "hq.getIndustryAStocksAction"; //行情-获取行业内个股排行
export const gettimelinefourAPI = "hq.gettimelinefour"; //行情-五日数据
export const setUserInfoAPI = "user.updateUserInfo";//设置投顾老师信息
export const getUserInforAPI = 'user.p_getUserInfo';//获取用户信息
export const loginTurnOverAPI = "user.LoginTurnOver"; //登录登出统计

export const objToStrUrl = function (obj) {
  let str = [];
  for (let i in obj) {
    str.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
  }
  return str.join("&");
};



export const checkMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

//yyymmmddHHMMt
export function _ymdsfFilter(input) {
  console.log('fsdfasd', input);
  if (input != "" && input != null && input != undefined && input != "--") {
    if (input.indexOf("-", 0) == -1) {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(4, 2);
      var day = input.toString().substr(6, 2);
      var shi = input.toString().substr(9, 2);
      var fen = input.toString().substr(12, 2);
      return year + month + day + shi + fen;
    }
    else {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(5, 2);
      var day = input.toString().substr(8, 2);
      var shi = input.toString().substr(11, 2);
      var fen = input.toString().substr(14, 2);
      return year + month + day + shi + fen;
    }
  }
  else {
    return "--";
  }
}

//yyyymmdd
export function ymdfilter(input) {

  if (input != "" && input != null && input != undefined && input != "--") {
    if (input.indexOf("-", 0) == -1) {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(4, 2);
      var day = input.toString().substr(6, 2);
      return year + month + day;
    }
    else {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(5, 2);
      var day = input.toString().substr(8, 2);
      return year + month + day;
    }
  }
  else {
    return "--";
  }
}

//yyymmmddHHMM 转 yyyy-mm-dd HH:MM
export function _UymdsfFilter(input) {
  if (input != "" && input != null && input != undefined && input != "--") {
    var year = input.toString().substr(0, 4);
    var month = input.toString().substr(4, 2);
    var day = input.toString().substr(6, 2);
    var hour = input.toString().substr(8, 2);
    var muni = input.toString().substr(10, 2);
    var sel = '-';
    var str = year + sel + month + sel + day + ' ' + hour + ':' + muni;
    return str
  }
  else {
    return "--";
  }
}

//yyyymmdd转yyyy-mm-dd
export function Uymdfilter(input) {

  if (input != "" && input != null && input != undefined && input != "--") {
    var year = input.toString().substr(0, 4);
    var month = input.toString().substr(4, 2);
    var day = input.toString().substr(6, 2);
    var sel = '-';
    return year + sel + month + sel + day;

  }
  else {
    return "--";
  }
}

//根据当前时间推算本周起始时间
export function getWeekDay(y, m, d) {
  var now = new Date(y, m - 1, d);
  var day = now.getDay();
  if (day == 0) {
    day = 7;
  }
  var time = now.getTime();
  var startTime = time - (day - 1) * 24 * 60 * 60 * 1000;
  var endTime = time + (7 - day) * 24 * 60 * 60 * 1000;
  var start = new Date(startTime).toLocaleDateString().split("/");
  var end = new Date(endTime).toLocaleDateString().split("/");
  if (start[1] < 10) {
    start[1] = "0" + start[1];
  }
  if (start[2] < 10) {
    start[2] = "0" + start[2];
  }
  if (end[1] < 10) {
    end[1] = "0" + end[1];
  }
  if (end[2] < 10) {
    end[2] = "0" + end[2];
  }
  let arr = {}
  arr.startTime = start[0] + "-" + start[1] + "-" + start[2];
  arr.endTime = end[0] + "-" + end[1] + "-" + end[2];
  return arr;
  console.log("本周开始的日期" + start[0] + "-" + start[1] + "-" + start[2] + ",结束日期" + end[0] + "-" + end[1] + "-" + end[2]);
}

export function getDayTime(time,hour) {
  // console.log('time', time)
  let date = new Date(time);
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if(h >= 0 && h <= 9){
    h = "0" + h;
  }
  if(m >= 0 && m <= 9){
    m = "0" + m;
  }
  if(s >= 0 && s <= 9){
    s = "0" + s;
  }
  var currentdate;
  if(hour){
    currentdate = h + ':' + m + ':' + s;
  }else{
    currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + h + ':' + m + ':' + s;
    ;
  }

  return currentdate;
}



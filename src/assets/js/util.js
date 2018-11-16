
//获取cookie里的值
//function getCookie(cookie_name)
//{
//	var strCookie=document.cookie;
//	var arrCookie=strCookie.split(";");
//	for(var i=0;i<arrCookie.length;i++)
//	{
//		var index = arrCookie[i].indexOf( cookie_name );
//		if( index >= 0 ) {
//				var v = unescape(arrCookie[i].substring( index + cookie_name.length + 1 ));
//
//			return v;
//		}
//	}
//	return "";
//}


//设置cookie
//function setCookie(name,value)
//{
//   var days=365;
//   var exp=new Date();
//   exp.setTime(exp.getTime()+days*24*60*60*1000);
//   document.cookie=name+"="+escape(value)+";expires="+exp.toGMTString()+";path=/";
//}

var timeistradeing = true;//是否是交易时间

//验证参数是否为空，或者未定义，或者为空字符串
function isNull(param)
{
  if(param==null || param == undefined || param == ""){
    return true;
  }
  return false;
}


//强制取小数点后两位
//function changeTwoDecimal_f(x) {
//    var f_x = parseFloat(x);
//    if (isNaN(f_x)) {
//        alert('function:changeTwoDecimal->parameter error');
//        return false;
//    }
//    var f_x = Math.round(x * 100) / 100;
//    var s_x = f_x.toString();
//    var pos_decimal = s_x.indexOf('.');
//    if (pos_decimal < 0) {
//        pos_decimal = s_x.length;
//        s_x += '.';
//    }
//    while (s_x.length <= pos_decimal + 2) {
//        s_x += '0';
//    }
//    return s_x;
//}

function log(str){
  console.log(str);
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
//function formatCurrency(num) {
//    num = num.toString().replace(/\$|\,/g,'');
//    if(isNaN(num))
//    num = "0";
//    sign = (num == (num = Math.abs(num)));
//    num = Math.floor(num*100+0.50000000001);
//    cents = num%100;
//    num = Math.floor(num/100).toString();
//    if(cents<10)
//    cents = "0" + cents;
//    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
//    num = num.substring(0,num.length-(4*i+3))+','+
//    num.substring(num.length-(4*i+3));
//    return (((sign)?'':'-') + num + '.' + cents);
//}

//格式化数字单位,返回数据含两位小数点
//function formatNumberUtil(num){
//	var number = Number(num);
//	if(number >= 1000000000000 || number <= -1000000000000){
//		return changeTwoDecimal_f(number/1000000000000)+" 万亿";
//	}else if(number >= 100000000 || number <= -100000000){
//		return changeTwoDecimal_f(number/100000000)+" 亿";
//	}else if(number >= 10000 || number <= -10000){
//		return changeTwoDecimal_f(number/10000)+" 万";
//	}else{
//		return number;
//	}
//}

//将时间以“-”格式化
//function formateDate(date){
//	var year = date.substring(0,4);
//	var month = date.substring(4,6);
//	var day = date.substring(6,8);
//	return year+"-"+month+"-"+day;
//}

function webSocketReq(method,start,destination,url,_channelID, _topic){
  var ws = new WebSocket(url);
  ws.status = 0;				//0：正在连接 1：连接成功 2：已关闭连接
  ws.url = url;				//连接地址
  ws.code = 1;
  ws.message = method;
  ws.start = start;
  ws.destination = destination;
  ws.register = function(){
    var msg ="cmd=uniapp.register&tunnelname="+_channelID ;//JSON.stringify({"cmd":"uniapp.register","tunnelname":_channelID});
    ws.send(msg);
  };
  ws.sub = function(){
    var msg ="cmd=uniapp.sub&topic="+_topic+"&destination="+ws.destination;// JSON.stringify({"cmd":"uniapp.sub","topic":_topic, "destination":ws.destination});
    ws.send(msg);
  };
  //ws.unsub = function(){
  //	var msg = JSON.stringify({"cmd":"uniapp.unsub","topic":"ywbd"});
  //	ws.send(msg);
  //};
  ws.onopen = function(){
    ws.status = 1;
    ws.register();
  }
  ws.onmessage = function(evt){
    var resultmsg = JSON.parse(evt.data);
    //log(evt.data);
    if(ws.code == 0){
      ws.message(evt);
      return;
    }

    var cmd = resultmsg.cmd;
    if(cmd == "uniapp.register"){
      ws.sub();
    }else if(cmd == "uniapp.sub"){
      ws.code = 0;
      if(!isNull(ws.start)){
        ws.start(evt);
      }
    }
  }
  ws.onclose = function(){
    log("已关闭: " + ws.url);
    ws.status = 2;
    ws =  new WebSocket(ws.url);
  }
  ws.onerror = function(){
    //alert("请求发生异常，请稍候再试!");
  }
  return ws;
}

//时间处理
function showTimeFun(premsgtime,curmsgtime)
{
  if(premsgtime == "")
  {
    return "";
  }
  var nowtime = new Date();
  var curm = nowtime.getMonth()+1;
  var curd = nowtime.getDate();
  var cury = nowtime.getFullYear();

  var curmsgY = curmsgtime.substring(0,4);
  var curmsgM = curmsgtime.substring(4,6);
  var curmsgD = curmsgtime.substring(6,8);
  var curmsgH = curmsgtime.substring(8,10);
  var curmsgMinute = curmsgtime.substring(10,12);
  var curmsgSec = curmsgtime.substring(12,14);

  var curmsgDate = new Date(curmsgY,curmsgM-1,curmsgD,curmsgH,curmsgMinute,curmsgSec);


  //var curmsgD = curmsgtime.substring(6,8);

  var prmsgY = premsgtime.substring(0,4);
  var prmsgM = premsgtime.substring(4,6);
  var prmsgD = premsgtime.substring(6,8);
  var prmsgH = premsgtime.substring(8,10);
  var prmsgMinute = premsgtime.substring(10,12);
  var prmsgSec = premsgtime.substring(12,14);

  var prmsgDate = new Date(prmsgY,prmsgM-1,prmsgD,prmsgH,prmsgMinute,prmsgSec);

  if((curmsgDate.getTime()-prmsgDate.getTime()) - 5 * 60 * 1000 > 0)
  {
    if(curm == curmsgM && curd == curmsgD && cury == curmsgY)
    {

      return curmsgH+":"+curmsgMinute;
    }
    else
    {
      if((curmsgDate.getTime() - prmsgDate.getTime()) - (7 * 24 * 3600 * 1000) >= 0)
      {
        //超过7天
        return curmsgY+"年"+curmsgM+"月"+curmsgD+"日 "+curmsgH + ":" + curmsgMinute+":"+curmsgSec;
      }
      else
      {
        var day = curmsgDate.getDay();

        if(day == 0)
        {
          return "星期天 "+curmsgH+":"+curmsgSec;
        }
        else if(day == 1)
        {
          return "星期一 "+curmsgH+":"+curmsgSec;
        }
        else if(day == 2)
        {
          return "星期二 "+curmsgH+":"+curmsgSec;
        }
        else if(day == 3)
        {
          return "星期三 "+curmsgH+":"+curmsgSec;
        }
        else if(day == 4)
        {
          return "星期四 "+curmsgH+":"+curmsgSec;
        }
        else if(day == 5)
        {
          return "星期五 "+curmsgH+":"+curmsgSec;
        }
        else(day == 6)
        {
          return "星期六 "+curmsgH+":"+curmsgSec;
        }
      }
    }
  }

  return "";
}

//当前时间
function getPresentTime()
{
  var pt = "";
  var nowtime = new Date();
  var curm = nowtime.getMonth()+1;
  var curmstr = "";
  if(curm<10)
  {
    curmstr = "0" + curm;
  }
  else
  {
    curmstr = curm.toString();
  }

  var curd = nowtime.getDate();

  var curdstr = "";
  if(curd<10)
  {
    curdstr = "0" + curd;
  }
  else
  {
    curdstr = curd.toString();
  }

  var cury = nowtime.getFullYear();
  var curystr  = cury.toString();

  var curHours = nowtime.getHours();
  var curHoursstr = "";
  if(curHours<10)
  {
    curHoursstr = "0" + curHours;
  }
  else
  {
    curHoursstr = curHours.toString();
  }
  var curMinute = nowtime.getMinutes();

  var curMinutestr = "";
  if(curMinute<10)
  {
    curMinutestr = "0" + curMinute;
  }
  else
  {
    curMinutestr = curMinute.toString();
  }

  var curSec = nowtime.getSeconds();

  var curSecstr = "";
  if(curSec<10)
  {
    curSecstr = "0" + curSec;
  }
  else
  {
    curSecstr = curSec.toString();
  }

  pt = curystr + curmstr + curdstr + curHoursstr + curMinutestr + curSecstr;
  return pt;
}

//将{applyid=227, type=apply, topic=glsqts, destination=17, applyaccount=122000000368}这样的数据转成json
function convertGltsToJson(str)
{
  str = str.replace(eval("/{/gi"), "");
  str = str.replace(eval("/}/gi"), "");
  str = str.replace(eval("/ /gi"), "");
  var strarray = str.split(",");

  var jsonObj = {};
  for ( var i in strarray){
    var a = strarray[i];
    var array = a.split("=");
    jsonObj[array[0]] = array[1];
  }

  return jsonObj;
}

//获取入参
function getParameter(param)
{
  var query = window.location.search;
  //console.log("getParameter", query);
  var iLen = param.length;
  var iStart = query.indexOf(param);
  if (iStart == -1) {
    return "";
  }
  iStart += iLen + 1;
  var iEnd = query.indexOf("&", iStart);
  if (iEnd == -1) {
    return query.substring(iStart);
  }
  else {
    return query.substring(iStart, iEnd);
  }
}


//返回用户信息
function isLogin()
{
  var userinfo = null;
  try
  {
    var localStorage = window.localStorage;
    userinfo = JSON.parse(localStorage.getItem('logininfo'));
  }
  catch (e){}
  return userinfo;
}

//实际显示值
function getActualValueShow(_str, _value)
{
  if(!!_str)
  {
    return _str;
  }
  else
  {
    return _value;
  }
}


//置顶
function gotoUp()
{
  document.documentElement.scrollTop = document.body.scrollTop = 0;//页面置顶
}

function gettoday()
{
  var today = new Date();
  var yearstr = today.getFullYear();
  var monthN = today.getMonth()+1;
  var monthStr = "";

  if(monthN<10)
  {
    var monthStr = "0" + monthN;
  }
  else
  {
    var monthStr = monthN+"";
  }
  var dayN = today.getDate();
  if(dayN<10)
  {
    var dayStr = "0" + dayN;
  }
  else
  {
    var dayStr = dayN+"";
  }
  var todayStr = yearstr + "-" + monthStr + "-" + dayStr;
  return todayStr;
}

function gettodayno()
{
  var today = new Date();
  var yearstr = today.getFullYear();
  var monthN = today.getMonth()+1;
  var monthStr = "";

  if(monthN<10)
  {
    var monthStr = "0" + monthN;
  }
  else
  {
    var monthStr = monthN+"";
  }
  var dayN = today.getDate();
  if(dayN<10)
  {
    var dayStr = "0" + dayN;
  }
  else
  {
    var dayStr = dayN+"";
  }
  var todayStr = yearstr + monthStr + dayStr;
  return todayStr;
}

function getyesterdayno()
{
  var today = new Date();
  var yesterday_milliseconds=today.getTime()-1000*60*60*24;
  var yesterday = new Date();
  yesterday.setTime(yesterday_milliseconds);
  //console.log("yes", yesterday);
  //console.log(today, yesterday);
  var yearstr = yesterday.getFullYear();
  var monthN = yesterday.getMonth()+1;
  var monthStr = "";

  if(monthN<10)
  {
    var monthStr = "0" + monthN;
  }
  else
  {
    var monthStr = monthN+"";
  }
  var dayN = yesterday.getDate();
  if(dayN<10)
  {
    var dayStr = "0" + dayN;
  }
  else
  {
    var dayStr = dayN+"";
  }
  var yesterdayStr = yearstr + monthStr + dayStr;
  return yesterdayStr;
}


//格式化日期：yyyyMMdd
function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth()+1;
  var myweekday = date.getDate();

  if(mymonth < 10){
    mymonth = "0" + mymonth;
  }
  if(myweekday < 10){
    myweekday = "0" + myweekday;
  }
  return (myyear+mymonth+ myweekday);
}
//获得某月的天数
function getMonthDays(myMonth){
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate)/(1000*60*60*24);
  return days;
}

//获得本周的开始日期
var now = new Date();                    //当前日期
var nowDayOfWeek = now.getDay();         //今天本周的第几天
var nowDay = now.getDate();              //当前日
var nowMonth = now.getMonth();           //当前月
var nowYear = now.getYear();             //当前年
nowYear += (nowYear < 2000) ? 1900 : 0;  //

////获得当日的开始日期
var getTodayStartDate =  formatDate(now);
//获得本周的开始日期
var getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
var getWeekStartDate =  formatDate(getWeekStartDate);
//获得本周的结束日期
var getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
var getWeekEndDate =  formatDate(getWeekEndDate);
//获得本月的开始日期
var getMonthStartDate = new Date(nowYear, nowMonth, 1);
var getMonthStartDate =  formatDate(getMonthStartDate);

//获得本月的结束日期
var getMonthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
var getMonthEndDate =  formatDate(getMonthEndDate);


function getD(dt1){
  var d1=dt1.split(" ")[0];
  var t1=dt1.split(" ")[1];
  var y1=d1.split("-")[0];
  var m1=parseInt(d1.split("-")[1])-1;
  var da1=d1.split("-")[2];
  var h1=t1.split(":")[0];
  var mi1=t1.split(":")[1];
  var se1=t1.split(":")[2];
  var dat1=new Date(y1,m1,da1,h1,mi1,se1).getTime();
  return dat1;
}

function fromNow (dateStr) {
  var between = Date.now() / 1000 - Number(dateStr) / 1000;
  if (between < 3600) {
    if(~~(between / 60)==0){
      return '刚刚';
    }else{
      return (~~(between / 60)+'分钟前');
    }
  } else if (between < 86400) {
    return (~~(between / 3600)+'小时前');
  } else {
    return (~~(between / 86400)+'天前');
  }
}
//var  zxflag = true;
//
//function scrollBottomTest(id,fn,cb){
//	$(id).scroll(function(){
//		viewH =$(this).height(),//可见高度
//			contentH =$(this).get(0).scrollHeight,//内容高度
//			scrollTop =$(this).scrollTop();//滚动高度
//		//if(contentH - viewH - scrollTop <= 100) { }//到达底部100px时,加载新内容
//		if(zxflag&&scrollTop/(contentH -viewH)>=0.999){ //到达底部100px时,加载新内容
//			// 这里加载数据..
//			fn();
//		}else{
//			cb();
//		}
//	});
//}
var  zxflag = true;

var SCROLL_CACHE = {};

function scrollBottomTest(id,fn,cb){
  SCROLL_CACHE[id] = {};
  SCROLL_CACHE[id].scroll = 0;
  SCROLL_CACHE[id].content = 0;
  console.log(SCROLL_CACHE);

  $(id).scroll(function(){
    viewH =$(this).height(),//可见高度
      contentH =$(this).get(0).scrollHeight,//内容高度
      scrollTop =$(this).scrollTop();//滚动高度
    //if(contentH - viewH - scrollTop <= 100) { }//到达底部100px时,加载新内容
    if(zxflag&&scrollTop/(contentH -viewH)>=0.9){ //到达底部100px时,加载新内容

      if (SCROLL_CACHE['#'+this.id].scroll > scrollTop) {
        return ;
      }

      if (SCROLL_CACHE['#'+this.id].content == contentH) {
        return ;
      }

      if (SCROLL_CACHE['#'+this.id].content != contentH) {
        SCROLL_CACHE['#'+this.id].content = contentH;
      }

      SCROLL_CACHE['#'+this.id].scroll = scrollTop;
      // 这里加载数据..
      fn();
    }else if(cb != undefined){
      cb();
    }
  });
}







//清空返回列表
function deleteback()
{
  var localStorage = window.localStorage;
  try
  {
    //console.log("backlistsucess");
    localStorage.removeItem("backList");
  }
  catch(e){
    //console.log("backlisterror");
  }
}

//当前页面信息放入返回列表
function setbackList(_str)
{
  var localStorage = window.localStorage;
  var arr = JSON.parse(localStorage.getItem('backList'));
  //console.log("backlist", arr)
  if(arr == null || arr == undefined)
  {
    arr = [];
  }
  arr.push(_str);
  //console.log("push",_str);
  localStorage.setItem('backList', JSON.stringify(arr));
}

//获取返回页面信息
function getbackList()
{
  var localStorage = window.localStorage;
  var arr = JSON.parse(localStorage.getItem('backList'));
  if(arr != null && arr!= undefined)
  {
    if(arr.length>0)
    {
      var str = arr[arr.length-1];
      arr.splice(arr.length-1,1);
      localStorage.setItem('backList', JSON.stringify(arr));
      return str;
    }
  }
}


//判断是否全为数值
function numericCheck(_str)
{
  var len = _str.length;
  for(var i=0;i<len;i++)
  {
    //console.log(_str.charAt(i));
    if(_str.charAt(i)>"9" || _str.charAt(i)<"0")
    {
      //alert("含有非数字字符");
      return false;
    }
  }
  return true;
}

//判断是否全为数值和小数点
function valueCheck(_str)
{
  var len = _str.length;
  for(var i=0;i<len;i++)
  {
    //console.log(_str.charAt(i));
    if(_str.charAt(i)>"9" || _str.charAt(i)<"0")
    {
      //alert("含有非数字字符");
      if(_str.charAt(i) != "."  )
      {
        return false;
      }

      if (_str.charAt(i) == "-" && i != 0) {
        return false;
      }
    }
  }
  return true;
}

//小数位数判断
function decimaldigitsCheck(_str)
{
  var pointindex = _str.indexOf(".",1);
  var len = _str.length;
  if(len-1-pointindex>2)
  {
    return false;
  }
  else
  {
    return true;
  }
}

//小数位数判断
function decimaldigitsCheckall(_str, _len)
{
  var pointindex = _str.indexOf(".",1);
  if(pointindex == -1)
  {
    return true;
  }
  else
  {
    var len = _str.length;
    if(len-1-pointindex>_len)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
}


//小数位数确定
function getdecimaldigits(_str)//jj 表示基金;a ：表示A股;b:B股;zs：指数;zq：债券
{
  var nunb = 2;
  if(_str == "jj")
  {
    nunb = 3;
  }
  else
  {
    nunb = 2;
  }
  return nunb;
}
//小数位数确定
function getdecimaldigits2(_str)//类型 0:股票 1：期货 2：期权 3：外汇，4指数，5：基金、6:债券、7、认购权证、8、认卖权证、9 牛证、10 熊证 11 其他12 上海b股 13 深圳b股
{
  //console.log("s", _str);
  var nunb = 2;
  if(_str == "5" || _str == "2" || _str == "13")//2,13,5
  {
    nunb = 3;
  }
  else
  {
    nunb = 2;
  }
  return nunb;
}


//判断substr字符串在str中出现的次数  isIgnore是否忽略大小写!
function countSubstr(str,substr,isIgnore){
  //console.log(str, substr);
  var count = 0;
  var reg="";
  if(isIgnore==true)
  {
    reg="/"+substr+"/gi";
  }
  else
  {
    reg="/"+substr+"/g";
  }
  reg=eval(reg);
  if(str.match(reg)==null)
  {
    count=0;
  }
  else
  {
    count=str.match(reg).length;
  }
  return count;
}


//截取小数点后两位
jqnumxsdlw = function(_value)
{
  var backvalue;
  var str = _value.toString();
  var str2 = "";
  var _index = str.indexOf(".", 0);//小数点的位置
  if(_index == -1)//无小数点
  {
    backvalue = _value;
  }
  else//有小数点
  {
    //console.log(str.length, _index, str.length);
    str2 = str.substring(_index, str.length);
    //console.log("backvalue",str2);
    if(str2.length <= 3)//小数点后两位
    {
      backvalue = _value;
    }
    else
    {
      backvalue = parseFloat(str.substring(0, _index+3));
      //console.log("backvalue",backvalue);
    }
  }
  return backvalue;
}

function getccStatus(_str)
{
  var str = "";
  switch (_str)
  {
    case "0":
      str = "正常";
      break;
    case "1":
      str = "涨停";
      break;
    case "2":
      str = "跌停";
      break;
    case "3":
      str = "停牌";
      break;
    case "4":
      str = "退市";
      break;
    default:
      break;
  }
  return str;
}

//证券类型
function getzqStatus(_str)
{
  var str = "";
  switch (_str)
  {
    case "zs":
      str = "4";
      break;
    case "a":
      str = "0";
      break;
    case "b":
      str = "0";
      break;
    case "jj":
      str = "5";
      break;
    default:
      str = "11";
      break;
  }
  return str;
}

//调整by步长
function changeByStep(_type, _step, _value)
{
  var value =  0;
  if(!_value)
  {
    _value = 0;
  }
  if(_type == "add")
  {
    value = Number(_value) + _step;
  }
  else if(_type == "sub")
  {
    value = Number(_value) - _step;
  }
  if(value<0)
  {
    value = 0;
  }
  return value;
}

function gettypewtsl(_typevalue,_sumnum,_slstep)
{
  var num = 0;
  num = _sumnum/parseInt(_typevalue);
  if(parseInt(_typevalue) != 1)
  {
    if(num%_slstep != 0)
    {
      num = Math.floor(num/_slstep)*_slstep;
    }
  }
  return num;
}

//获取某个日期
function getonedayno(_value)
{
  var yearstr = _value.getFullYear();
  var monthN = _value.getMonth()+1;
  var monthStr = "";

  if(monthN<10)
  {
    var monthStr = "0" + monthN;
  }
  else
  {
    var monthStr = monthN+"";
  }
  var dayN = _value.getDate();
  if(dayN<10)
  {
    var dayStr = "0" + dayN;
  }
  else
  {
    var dayStr = dayN+"";
  }
  var dateStr = yearstr + monthStr + dayStr;
  return dateStr;
}

//获取某个日期有-
function getoneday(_value)
{
  var yearstr = _value.getFullYear();
  var monthN = _value.getMonth()+1;
  var monthStr = "";

  if(monthN<10)
  {
    var monthStr = "0" + monthN;
  }
  else
  {
    var monthStr = monthN+"";
  }
  var dayN = _value.getDate();
  if(dayN<10)
  {
    var dayStr = "0" + dayN;
  }
  else
  {
    var dayStr = dayN+"";
  }
  var dateStr = yearstr + "-" + monthStr + "-" + dayStr;
  return dateStr;
}

//判断开始日期和结束日期是否大于当前日期
function beginendcheckDate(_value1, _value2)
{
  var mark = true;
  var today = new Date();
  var yesterday_milliseconds=today.getTime()-1000*60*60*24;
  var yesterday = new Date();
  yesterday.setTime(yesterday_milliseconds);
  if (_value1 < yesterday) {
    //console.log("开始日期 小于 当前日期");
    mark = false;
  }
  if (_value2 < yesterday) {
    //console.log("结束日期 小于 当前日期");
    mark = false;
  }
  return  mark;
}

//开始日期大于结束日期
function beginlargerthanendcheck(_value1, _value2)
{
  var mark = true;
  if (_value1 >= _value2) {
    //console.log("开始日期 大于 结束日期 ");
    mark = false;
  }
  return  mark;
}

//获取增加月份后日期
function getaddmonthTime(_day, count)
{
  var nowtime = _day;
  var curm = nowtime.getMonth();
  var curd = nowtime.getDate();
  var cury = nowtime.getFullYear();

  var curmsgDate = new Date(cury,curm + count,curd,0,0,0,0);
  return curmsgDate;
}

//获取日期
function getyearmonthday(_datestr)
{
  var yearstr = _datestr.substr(0,4);
  var monthstr = _datestr.substr(5,2);
  if(monthstr.substr(0,1) == "0")
  {
    monthstr = monthstr.substr(1);
  }
  var daystr = _datestr.substr(8,2);
  if(daystr.substr(0,1) == "0")
  {
    daystr = daystr.substr(1);
  }
  var date = new Date(yearstr, parseInt(monthstr)-1, daystr);
  return date;
}

//獲取組合狀態
function getPortfolioStatus(_str)
{
  var str = "";
  switch (_str)
  {
    case "A":
      str = "审核中";
      break;
    case "Y":
      str = "操盘中";
      break;
    case "N":
      str = "已結束";
      break;
    case "U":
      str = "审核未通过";
      break;
    default:
      str = "";
      break;
  }
  return str;
}

//獲取組合类型
function getPortfoliotype(_str)
{
  var str = "";
  switch (_str)
  {
    case "longterm":
      str = "长期";
      break;
    case "shortterm":
      str = "短期";
      break;
      str = "";
      break;
  }
  return str;
}

//平均持股数
function getAvgholdnum(_str)
{
  var str = "";
  switch (_str) {
    case "1":
      str = "3";
      break;
    case "2":
      str = "3-10";
      break;
    case "3":
      str = "10";
      break;
    default:
      str = "";
      break;
  }
  return str;
}

//平均调仓周期
function getAvgchangeposition(_str)
{
  var str = "";
  switch (_str) {
    case "1":
      str = "1-2d";
      break;
    case "2":
      str = "1-2w";
      break;
    case "3":
      str = "1-2m";
      break;
    case "4":
      str = "0.5y";
      break;
    case "5":
      str = "1y";
      break;
    default:
      str = "";
      break;
  }
  return str;
}

//平均持股数
function getAvgholdnumInfo(_str)
{
  var str = "";
  switch (_str) {
    case "3":
      str = "3只以下";
      break;
    case "3-10":
      str = "3～10只";
      break;
    case "10":
      str = "10只以上";
      break;
    default:
      str = "";
      break;
  }
  return str;
}

//平均调仓周期
function getAvgchangepositionInfo(_str)
{
  var str = "";
  switch (_str) {
    case "1-2d":
      str = "1～2天";
      break;
    case "1-2w":
      str = "1～2周";
      break;
    case "1-2m":
      str = "1～2月";
      break;
    case "0.5y":
      str = "半年";
      break;
    case "1y":
      str = "一年";
      break;
    default:
      str = "";
      break;
  }
  return str;
}

//獲取买卖類別
function getflagInfo(_str)
{
  var str = "";
  if(_str == "B")
  {
    str = "买入";
  }
  else if(_str == "S")
  {
    str = "卖出";
  }
  return str;
}

//獲取买卖類別
function getflagInfo2(_str)
{
  var str = "";
  if(_str == "B")
  {
    str = "买入";
  }
  else if(_str == "S")
  {
    str = "卖出";
  }
  return str;
}

function getcwShowValue(_value)
{
  var value = "";
  if(parseFloat(_value) == 0)
  {
    value = "0.00%";//当前仓位
  }
  else if(parseFloat(_value) == 1)
  {
    value = "100%";//当前仓位
  }
  else
  {
    value = (parseFloat(_value)*100).toFixed(2) + "%";//当前仓位
  }
  return value;
}

/**
 * 获得相对当前周AddWeekCount个周的起止日期
 * AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
 * **/
function getWeekStartAndEnd(AddWeekCount) {
  //起止日期数组
  var startStop = new Array();
  //一天的毫秒数
  var millisecond = 1000 * 60 * 60 * 24;
  //获取当前时间
  var currentDate = new Date();
  //相对于当前日期AddWeekCount个周的日期
  currentDate = new Date(currentDate.getTime() + (millisecond * 7*AddWeekCount));
  //返回date是一周中的某一天
  var week = currentDate.getDay();
  //返回date是一个月中的某一天
  var month = currentDate.getDate();
  //减去的天数
  var minusDay = week != 0 ? week - 1 : 6;
  //获得当前周的第一天
  var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
  //获得当前周的最后一天
  var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
  //添加至数组
  startStop.push(currentWeekFirstDay);
  startStop.push(currentWeekLastDay);

  return startStop;
}

/**
 * 获得相对当月AddMonthCount个月的起止日期
 * AddMonthCount为0 代表当月 为-1代表上一个月  为1代表下一个月 以此类推
 * ***/
function getMonthStartAndEnd(AddMonthCount) {
  //起止日期数组
  var startStop = new Array();
  //获取当前时间
  var currentDate = new Date();
  var month=currentDate.getMonth()+AddMonthCount;
  if(month<0){
    var n = parseInt((-month)/12);
    month += n*12;
    currentDate.setFullYear(currentDate.getFullYear()-n);
  }
  currentDate = new Date(currentDate.setMonth(month));
  //获得当前月份0-11
  var currentMonth = currentDate.getMonth();
  //获得当前年份4位年
  var currentYear = currentDate.getFullYear();
  //获得上一个月的第一天
  var currentMonthFirstDay = new Date(currentYear, currentMonth,1);
  //获得上一月的最后一天
  var currentMonthLastDay = new Date(currentYear, currentMonth+1, 0);
  //添加至数组
  startStop.push(currentMonthFirstDay);
  startStop.push(currentMonthLastDay);
  //返回
  return startStop;
}

//圖形開始時間
function getchartStartday(_starttime, _timetype)
{
  var  date = "";
  var start = _starttime;
  //start = "2017-02-01";
  var year = start.substr(0,4);
  var month = start.substr(5,2);
  var day = start.substr(8,2);
  var today = new Date();
  var begday_milliseconds = "";
  var begday;
  var zhbegday = year + month + day;
  //console.log(555555555,zhbegday);
  var zhbgtdayvalue = getyearmonthday(start);
  if(_timetype == 'all')
  {
    date = zhbegday;
  }
  else if(_timetype == 'y')
  {
    begday_milliseconds = today.getTime()-1000*60*60*24*365;
    begday = new Date();
    begday.setTime(begday_milliseconds);
    if(beginlargerthanendcheck(zhbgtdayvalue, begday) == false)
    {
      date = zhbegday;
    }
    else
    {
      date = getonedayno(begday);
    }

  }
  else if(_timetype == 'm')
  {
    // begday_milliseconds = today.getTime()-1000*60*60*24*30;
    // begday = new Date();
    // begday.setTime(begday_milliseconds);
    begday = getMonthStartAndEnd(0)[0];
    if(beginlargerthanendcheck(zhbgtdayvalue, begday) == false)
    {
      date = zhbegday;
    }
    else
    {
      date = getonedayno(begday);
    }

  }
  else if(_timetype == 'w')
  {
    // begday_milliseconds = today.getTime()-1000*60*60*24*7;
    // begday = new Date();
    // begday.setTime(begday_milliseconds);
    begday = getWeekStartAndEnd(0)[0];
    if(beginlargerthanendcheck(zhbgtdayvalue, begday) == false)
    {
      date = zhbegday;
    }
    else
    {
      date = getonedayno(begday);
    }
  }
  return date;
}

//圖的對比對象值
function getindexTypeVaue(_str)
{
  var ind = 1;
  switch (_str)
  {
    case "hs":
      ind = 1;
      break;
    case "ce":
      ind = 2;
      break;
    case "hs300":
      ind = 3;
      break;
    default :
      break;
  }
  return ind;
}

//判断输入字符串长度（汉字算两个字符，字母数字算一个）

function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    }
    else {
      len += 1;
    }
  }
  return len;
}

//獲取錯誤信息
function getErrorInfo(_str)
{
  if (_str == undefined) {
    return _str;
  }

  if (ERROR_CODE_DEF[_str]) {
    return ERROR_CODE_DEF[_str];
  }
  return _str;
}

//两个时间相隔多少天 2017-09-14  2017-09-15
function GetDateDiff(startDate,endDate)
{
  var startTime = new Date(Date.parse(startDate.replace(/-/g,   "-"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g,   "-"))).getTime();
  var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
  return  dates;
}

var open = true;
var localflag = getParameter('local');//是否用本地
if(localflag){
  open = false;
}
//打開方式
function openNewInterface(_id, _title, _url, _callback, _opentype)//_url：打开地址；_callback：回调函数；_opentype：打开方式 '1'或者空，新窗口打开，'2'当前页面打开；
{
  //console.log(_url, _callback, _opentype);
  if(!_id)
  {
    _id = "";
  }
  if(!_title)
  {
    _title = "";
  }
  if(!_url)
  {
    _url = "";
  }
  if(!_callback)
  {
    _callback = "";
  }
  if(!_opentype)
  {
    _opentype = "";
  }
  if(!!_url && !!_id && !!_title && open)//新窗口打开方式
  {
    createWindow(_url,_id,_title)
  }
  else
  {
    window.location.href=_url;
    //window.open(_url);
  }
}

//打開指定宽高的窗口
function openWHNewInterface(_id, _title, _url, _width,_heigth,_callback, _opentype)//_url：打开地址；_callback：回调函数；_opentype：打开方式 '1'或者空，新窗口打开，'2'当前页面打开；
{
  if(!_id)
  {
    _id = "";
  }
  if(!_title)
  {
    _title = "";
  }
  if(!_url)
  {
    _url = "";
  }
  if(!_callback)
  {
    _callback = "";
  }
  if(!_opentype)
  {
    _opentype = "";
  }
  if(!!_url && !!_id && !!_title&&!!_width&&_heigth)//新窗口打开方式
  {
    createNotFullWindow (_url, _id, _title,_width,_heigth);
  }
  else
  {
    window.open(_url);
  }
}


function mergeObj(tO,sO) {
  for(x in sO)
  {
    tO[x] = sO[x];
  }
  return tO;
}

function Table (head) {
  this.head = head;
  this.orderObj = '';
}

Table.prototype.getHead = function () {
  return this.head;
}

Table.prototype.changeOrderObj = function (id) {
  if (id == undefined) return;
  for (var i = 0; i < this.head.length; i++) {

    if (this.head[i].id == id) {
      if (this.head[i].asc == '') {
        this.head[i].asc = '+';
      } else if (this.head[i].asc == '+') {
        this.head[i].asc = '-'
      } else {
        this.head[i].asc = '';
      }

      if (this.head[i].asc == '') {
        this.orderObj = '';
      } else {
        this.orderObj = this.head[i].asc + this.head[i].id;
      }
    } else if (this.head[i].id == undefined) {

    } else {
      this.head[i].asc = '';
    }

  }
}

/**
 * 将object array中 是数字的值全部用Number强转
 */
function convertNumberArray (array) {
  for (var i = 0 ; i < array.length ; i ++) {
    for (var key in array[i]) {
      if (valueCheck(array[i][key])) {
        array[i][key] = Number(array[i][key]);
      }

    }
  }

  return array;
}

//初始化时间  获取几天前的时间
function getBeforeDate(day) {
  var timestamp = new Date().getTime() - 1000 * 60 * 60 * 24 * day;
  var beforeDay = new Date(timestamp);
  var year = beforeDay.getFullYear();
  var month = beforeDay.getMonth() + 1;
  var day = beforeDay.getDate();
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return year + '-' + month + '-' + day;
}
var today = getBeforeDate(0);
var yesterday = getBeforeDate(1);
var startday = getBeforeDate(8);
//日历插件的初始化定义
var opt={};
var currYear = (new Date()).getFullYear();
opt.date = {preset : 'date'};
opt.datetime = {preset : 'datetime'};
opt.time = {preset : 'time'};
opt.default = {
  theme: 'android-ics light', //皮肤样式
  display: 'modal', //显示方式
  mode: 'scroller', //日期选择模式
  dateFormat: 'yyyy-mm-dd',
  lang: 'zh',
  showNow: true,
  nowText: "今天",
  startYear: currYear - 50, //开始年份
  endYear: currYear + 10 //结束年份
};

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
//调用：
//
//var time1 = new Date().Format("yyyy-MM-dd");
var sftime = new Date().Format("yyyy-MM-dd HH:mm");

//yyymmmddHHMM
function _ymdsfFilter(input)
{

  if(input != "" && input != null && input != undefined && input != "--")
  {
    if(input.indexOf("-",0) == -1)
    {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(4, 2);
      var day = input.toString().substr(6, 2);
      var shi = input.toString().substr(9, 2);
      var fen = input.toString().substr(12, 2);
      return  year + month + day+ shi+ fen;
    }
    else
    {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(5, 2);
      var day = input.toString().substr(8, 2);
      var shi = input.toString().substr(11, 2);
      var fen = input.toString().substr(14, 2);
      return   year + month + day+ shi+ fen;
    }
  }
  else
  {
    return "--";
  }
}
//yyyymmdd
function ymdfilter(input)
{

  if(input != "" && input != null && input != undefined && input != "--")
  {
    if(input.indexOf("-",0) == -1)
    {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(4, 2);
      var day = input.toString().substr(6, 2);
      return  year + month + day;
    }
    else
    {
      var year = input.toString().substr(0, 4);
      var month = input.toString().substr(5, 2);
      var day = input.toString().substr(8, 2);
      return   year + month + day;
    }
  }
  else
  {
    return "--";
  }
}
//将时间戳转成时间
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
  var time;
//shijianchuo是整数，否则要parseInt转换
  if(shijianchuo){
    time = new Date(Number(shijianchuo));
  }else{
    time = new Date();
  }
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

var regdollar = /\$/;//匹配$字符
var reg_1 = /\#/;//匹配$字符
var reg_a =  /<a.*?>/ig;

//两个时间相隔多少天 2017-09-14  2017-09-15
function GetDateDiff(startDate,endDate)
{
  var startTime = new Date(Date.parse(startDate.replace(/-/g,   "-"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g,   "-"))).getTime();
  var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
  return  dates;
}
//两个时间差
function getdiffdate(startTime, endTime, diffType) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  startTime = startTime.replace(/\-/g, "/");
  endTime = endTime.replace(/\-/g, "/");
  //将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase();
  var sTime =new Date(startTime); //开始时间
  var eTime =new Date(endTime); //结束时间
  //作为除数的数字
  var timeType =1;
  switch (diffType) {
    case"second":
      timeType =1000;
      break;
    case"minute":
      timeType =1000*60;
      break;
    case"hour":
      timeType =1000*3600;
      break;
    case"day":
      timeType =1000*3600*24;
      break;
    default:
      break;
  }
  return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}

//获取签约\订阅定价方案说明
function getqyzqinfo(_str)
{
  var str = "";
  var str2 = _str.substr(0,_str.length-1);
  var str3 = _str.substr(_str.length-1);
  if(str3 == "w")
  {
    str = str2+"周";
  }
  else if(str3 == "m")
  {
    str = str2+"个月";
  }
  else if(str3 == "y")
  {
    str = str2+"年";
  }
  return str;
}

//服务客户级别
function customerLevelFilter(v) {
  if (v) {
    return CUSTOMER_LEVEL[v];
  }
  return "--";
}//客户可见规则
function customershowFilter(v) {
  if (v) {
    return CUSTOMER_SHOW_FLAG[v];
  }
  return "--";
}//客户规则
function customerassingFilter(v) {
  if (v) {
    return CUSTOMER_ASSIGN_TYPE[v];
  }
  return "--";
}
//EMOJI表情class
function EMOJI_CLASS(v) {
  if (v) {
    if(EMOJI_JSON[v]){
      return EMOJI_JSON[v];
    }
  }else{
    return " ";
  }
}

function qqclassFilter(){
  return function (c) {
    if (c) {
      return c.replace(/\[(.+?)\]/g, function (w) {
        var _c = '';
        var _w = '';
        _w = w.substr(1, w.length - 2);
        var className = EMOJI_CLASS(_w);
        if (className) {
          _c = '<span class="' + className + '"></span>';
        } else {
          _c = w;
        }
        return _c;
      })
    } else {
      return ''
    }
  }
}

function switchMsg(str,str1){
  switch(str){
    case '1':
      return '[图片]'
      break;
    case '2':
      return '[语音]'
      break;
    case '3':
      return '[视频]'
      break;
    default:
      return str1;
  }
}

//5位随机数
function FiveMathRand() {
  var Num = "";
  for (var i = 0; i < 5; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num
}




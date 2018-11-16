// window.nodeRequire = require;
// delete window.require;

var ipc = top.require('electron').ipcRenderer;
var BrowserWindow = top.require('electron').remote.BrowserWindow;
var clipboard = top.require('electron').clipboard;
var nativeImage = top.require('electron').nativeImage
var manHT = new HashTable();
// var recordRTC = require('recordrtc');
var fs = top.require('fs');
var request = top.require('request');
var app = top.require('electron').remote.app;
var os = top.require('os');
var path = top.require('path');
var { shell } = top.require('electron');

var headerTime;

//指定窗口获取焦点
function getFocused (id) {
	if (typeof id == 'number' && id != 0) {
		var focusedWin = BrowserWindow.fromId(id);
		focusedWin.focus();
	} else {
		return "入参异常";
	}
}

//获取当前开启的所有窗口
function getAllWindowsInfo () {
	var win_arr = [];
	var winArr = BrowserWindow.getAllWindows();
	for (var i = 0; i < winArr.length; i ++) {
		var mainWindow = winArr[i];
		var obj = {};
		obj.id = mainWindow.id;
		obj.window = mainWindow;
		win_arr.push(obj);
	}
	return win_arr;
}

//向某个窗口发送信息
function sendMessageTo (windowId, channel, param) {
	var result = false;
	var winArr = getAllWindowsInfo();
	for (var i = 0; i < winArr.length; i ++) {
		var obj = winArr[i];
		if (obj.id == windowId) {
			result = true
			ipc.sendTo(windowId, channel, param);
			break;
		}
	}
	var obj = {};
	if (!result) {
		obj.resultCode = -1;
		obj.resultStr = '暂时未找到该窗口';
	} else {
		obj.resultCode = 9000;
		obj.resultStr = '发送成功';
	}
	return obj;
}

//接收某个窗口发送的信息
function getWindowMessage (channel, callback) {
	if (channel == null || channel == undefined) {
		return '第一个参数不能为空';
	}
	ipc.on(channel, callback);
}

//设置窗口是否可以最小化
function isMinimizable(minimizable) {
	var mainWin = require('electron').remote.getCurrentWindow();
	mainWin.setMinimizable(minimizable);
}

//标题栏放大按钮是否可用
function isMaximizable(maximizable) {
	var mainWin = require('electron').remote.getCurrentWindow();
	mainWin.setMaximizable(maximizable);
}

//打开本地文档
function openFile(filePath) {
	//获取根目录路径
	if (filePath) {
		return shell.openItem(filePath);
	}
	return "文件路径为空";
}

//用默认浏览器打开网页指定网页
function openBrowser(url) {
	if (url) {
		return shell.openExternal(url);
	}
	return 'URL为空';
}

//返回当前所处的系统
function getPlatform() {
	return process.platform;
}

//关闭窗口
function closeWin() {
	//获取当前获得焦点的窗口
	var mainWin = BrowserWindow.getFocusedWindow();
	if (mainWin == null) {
		console.log("当前没有获取焦点的窗口")
	} else {
		mainWin.close();
	}
}

//当前获取焦点窗口的最大化
function maxWindowSize() {
	var mWindow = BrowserWindow.getFocusedWindow();
	// mWindow.maximize();
	// if (mWindow.id == 1) {
	var electronScreen = top.require('electron').screen;
	var size = electronScreen.getPrimaryDisplay().workAreaSize;
	// mWindow.setMaximumSize(size.width, size.height);
	// }
	// mWindow.maximize();
	var option = {
		x: 0,
		y: 0,
		width: size.width,
		height: size.height,
	};
	mWindow.setBounds(option, false);
	mWindow.maximize();
}

function restoreWinSize() {
	var width = top.require('electron').remote.getGlobal('sharedObject').oriWin_width;
	var height = top.require('electron').remote.getGlobal('sharedObject').oriWin_height;

	var mainWin = BrowserWindow.getFocusedWindow();
	mainWin.setMaximumSize(width, height);
	var electronScreen = top.require('electron').screen;
	var size = electronScreen.getPrimaryDisplay().workAreaSize;
	var option = {
		x: parseInt((size.width - width) / 2),
		y: parseInt((size.height - height) / 2),
		width: width,
		height: height,
	};
	mainWin.setBounds(option);
}

//窗口是否是最大化(铺满屏幕)
function getWinIsMax () {
	var mainWin = BrowserWindow.getFocusedWindow();
	return mainWin.ismaximized();
}

//窗口大小切换，模拟“口”
function windowSizeSwitch() {
	var mainWin = BrowserWindow.getFocusedWindow();
	var electronScreen = top.require('electron').screen;
	var size = electronScreen.getPrimaryDisplay().workAreaSize;
	//判断窗口是否最大化
	if (mainWin.isMaximized()) {
		//窗口最大化，设置取消窗口最大化
		var option = {
			x: parseInt((size.width - 1000) / 2),
			y: parseInt((size.height - 670) / 2),
			width: 1000,
			height: 670,
		};
		mainWin.setBounds(option, false);
		return false;
	} else {
		var option = {
			x: 0,
			y: 0,
			width: size.width,
			height: size.height,
		};
		mainWin.setBounds(option, false);
		mainWin.maximize();
		return true;
	}
}

//窗口最小化和恢复功能
function winMinAndRestore() {
	var mainWin = BrowserWindow.getFocusedWindow();
	//判断窗口是否最小化
	if (mainWin.isMinimized()) {
		//窗口最小化，设置恢复原状
		mainWin.restore();
	} else {
		mainWin.minimize();
	}
}

//状态栏图标闪烁
function iconFlash(flag) {
	var mainWin = BrowserWindow.getFocusedWindow();
	if (flag) {
		mainWin.flashFrame(true);
		headerTime = setInterval(function () {
			mainWin.flashFrame(true);
		}, 2500);
	} else {
		clearInterval(headerTime);
		mainWin.flashFrame(false);
	}
}

//获取设备信息
function getDeviceInfo(callback) {
	//获取操作系统的主机名
	var hostname = os.hostname();
	// console.log(hostname);
	//获取操作系统名
	var type = os.type();
	var platform = os.platform();
	// console.log(type, platform);
	//获取操作系统CPU架构
	var arch = os.arch();
	// console.log(arch);
	//获取CPU相关信息
	var cpus = os.cpus();
	// console.log(cpus);
	//获取网络接口列表
	var networkInterface = os.networkInterfaces();//['无线网络连接'][0]['mac'];
	// console.log(networkInterface);
	//获取MAC地址
	var mac = "";
	if (networkInterface['无线网络连接']) {
		mac = networkInterface['无线网络连接'][0]['mac'];
	} else if (networkInterface['本地连接']) {
		mac = networkInterface['本地连接'][0]['mac'];
	}
	// console.log(mac);
	//获取系统内存总量
	var totalmem = os.totalmem() / 1024 / 1024;
	// console.log(totalmem);
	//获取系统空闲内存量
	var freemem = os.freemem() / 1024 / 1024;
	// console.log(freemem);
	//获取操作系统的发行版本
	var release = os.release();
	// console.log(release);
	var obj = {};
	obj.hostname = hostname;
	obj.type = type;
	obj.platform = platform;
	obj.arch = arch;
	obj.cpus = cpus;
	obj.networkInterface = networkInterface;
	obj.mac = mac;
	obj.totalmem = totalmem;
	obj.freemem = freemem;
	obj.release = release;
	callback(obj);
}

//判断浏览器内核版本号
function getBrowVersion() {
	return process.versions['chrome'];
}

//判断Electron框架的版本号
function getEleVersion() {
	return process.versions['electron'];
}

//写入数据
function writeFile(data, fileName, callback) {
	//获取桌面路径
	// var desktop = app.getPath('desktop');
	// var filePath = desktop + "/" + fileName;
	// var filePath = app.getAppPath() + '\\Audio\\' + fileName;
	var result = '\uFEFF';
	for (var i = 0; i < data.length; i++) {
		var arr = data[i];
		for (var j = 0; j < arr.length; j++) {
			var str;
			console.log(typeof arr[j]);
			if (typeof arr[j] == 'string') {
				if (arr[j].indexOf(',') > -1) {
					str = arr[j].split(',').join('，');
				} else {
					str = arr[j];
				}
			} else {
				str = arr[j];
			}

			if (j != arr.length - 1) {
				result += str + ',';
			} else {
				result += str + '\n';
			}
		}
	}

	var aLink = document.createElement('a');
	var blob = new Blob([result], { type: 'text/csv,charset=UTF-8' });
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
	aLink.click();
	var obj = { 'statusCode': 9000, 'resultStr': 'success' };
	callback(obj);

	// fs.writeFile(filePath, result, {flag : 'w', encoding : 'utf-8'}, function (err) {
	// 	if (err) {
	// 		console.log(err);
	// 		var obj = {'statusCode' : -1, 'resultStr' : err};
	// 		callback(err);
	// 	} else {
	// 		var aLink = document.createElement('a');


	// var obj = {'statusCode' : 9000, 'resultStr' : 'success'};
	// callback(obj);
	// 	}
	// });
}

//获取桌面路径
function getDesktopPath() {
	return app.getPath('desktop');
}

//获取根目录的路径
function getRootPath() {
	return app.getAppPath();
}

//复制文本到粘贴板
function copyTextToBoard(text) {
	clipboard.writeText(text);
}

//复制图片到粘贴板
function copyImageToBoard(imagePath) {
	var image = nativeImage.createFromPath(__dirname + "/" + imagePath);
	clipboard.writeImage(image);
}

function closeWindow() {
	//返回一个所有已经打开了窗口的对象数组
	var lastWindowArr = BrowserWindow.getAllWindows();
	if (lastWindowArr.length > 1) {
		for (var i = 0; i < lastWindowArr.length; i++) {
			var lastWindow = lastWindowArr[i];
			var windowID = lastWindow.id;
			var currentWindow = BrowserWindow.getFocusedWindow();
			if (windowID != 1) {
				if (currentWindow.id != windowID) {
					lastWindow.close();
				}
			}
		}
	}
	var currentWindow = BrowserWindow.getFocusedWindow();
	currentWindow.close();
}

function createSpecialWindow(param, callback) {
	var url = param.url;
	var id = param.id;
	if (url == null || url == undefined) {
		callback(-1);
		return;
	}
	if (id == null || id == undefined) {
		callback(-1);
		return
	}

	if (manHT.containsKey(id)) {
		try {
			var mWindow = manHT.getValue(id);
			mWindow.focus();
			if (url.substr(0, 4) == "http") {
				mWindow.loadURL(url);
			} else {
				mWindow.loadURL(`file:${app.getAppPath()}` + '/' + url);
			}

			mWindow.webContents.on('did-finish-load', function () {
				callback(mWindow.id);
			});

			return;
		} catch (e) {
			manHT.remove(id);
			specialWindow(param, callback);
			return;
		}
	} else {
		specialWindow(param, callback);
	}
}

//创建无边框的窗口
function specialWindow(param, callback) {
	var electronScreen = top.require('electron').screen;
	var size = electronScreen.getPrimaryDisplay().workAreaSize;
	
	var id = param.id;
	var url = param.url;
	if (id == null || id == undefined) {
		callback(-1);
		return;
	}

	if (url == null || url == undefined) {
		callback(-1);
		return;
	}
	var width = param.width;
	var height = param.height;
	if (width == null || width == undefined) {
		width = size.width;
	}
	if (height == null || height == undefined) {
		height = size.height;
	}

	var options;
	if (process.platform == 'win32') {
		//Windows
		options = {
			width: width,
			height: height,
			minWidth: 1000,
			minHeight: 670,
			autoHideMenuBar: true,
			backgroundColor: '#FFFFFF',
			useContentSize: true,
			show: false,
			frame: false
		}
	} else {
		options = {
			width: width,
			height: height,
			minWidth: 1000,
			minHeight: 670,
			autoHideMenuBar: true,
			backgroundColor: '#FFFFFF',
			useContentSize: true,
			show: false,
			titleBarStyle: 'hiddenInset'
		}
	}
	var mWindow = new BrowserWindow(options);
	if (url.substr(0, 4) == "http") {
		mWindow.loadURL(url);
	} else {
		mWindow.loadURL(`file:${app.getAppPath()}` + '/' + url);
	}

	mWindow.webContents.on('did-finish-load', function () {
		if (title) {
			mWindow.setTitle(title);
		}
		callback(mWindow.id);
	});

	mWindow.on('close', function (event) {
		manHT.remove(id);
		// mWindow = null;
		sendMessage({ windowid: id, msg: "close" });
	});

	mWindow.on('ready-to-show', function () {
		mWindow.show();
		if (width == size.width) {
			setTimeout(function () { mWindow.maximize(); }, 200);
		}
		
		var myHelper = top.require('./js/helper.js');
		var jsArr = myHelper.injectJS();
		for (var i = 0; i < jsArr.length; i++) {
			var jsString = jsArr[i];
			mWindow.webContents.executeJavaScript(jsString);
		}
	});

	// mWindow.openDevTools();

	manHT.add(id, mWindow);
}

//创建窗口
function createWindow(url, id, title, callback) {
	if (manHT.containsKey(id)) {
		//当这个catch的时候，代表用户关闭了这个页面之后，又重新打开这个页面，此时，上一个window窗口已经被
		//销毁，需要重新new一个。为何要这样做？因为在监听close事件的时候，假如父窗口先关闭，会造成子窗口监听不到
		//close事件，出现异常。但是，你还需要维持map数列，以此来解决同样的id，在窗口没有关闭的时候，此窗口只需重新加载url。
		try {
			var mWindow = manHT.getValue(id);
			mWindow.focus();
			if (url.substr(0, 4) == "http") {
				mWindow.loadURL(url);
			} else {
				mWindow.loadURL(`file:${app.getAppPath()}` + '/' + url);
			}
			if (title) {
				mWindow.setTitle(title);
			}
			mWindow.webContents.on('did-finish-load', function () {
				if (title) {
					mWindow.setTitle(title);
				}
				callback(mWindow.id);
			});

			return;
		} catch (e) {
			manHT.remove(id);
			newWindow(url, id, title, callback);
			return;

		}
	}
	newWindow(url, id, title, callback);
}

function newWindow(url, id, title, callback) {
	var electronScreen = top.require('electron').screen;
	var size = electronScreen.getPrimaryDisplay().workAreaSize;
	const options = {
		width: size.width,
		height: size.height,
		minWidth: 800,
		minHeight: 600,
		autoHideMenuBar: true,
		backgroundColor: '#FFFFFF',
		useContentSize: true,
		fullscreenable: true,
		show: false
	}
	const mWindow = new BrowserWindow(options);
	mWindow.setTitle("    ");
	if (title) {
		mWindow.setTitle(title);
	}
	if (url.substr(0, 4) == "http") {
		mWindow.loadURL(url);
	} else {
		mWindow.loadURL(`file:${app.getAppPath()}` + '/' + url);
	}

	mWindow.webContents.on('did-finish-load', function () {
		if (title) {
			mWindow.setTitle(title);
		}
		callback(mWindow.id);
	});

	mWindow.on('close', function (event) {
		manHT.remove(id);
		// mWindow = null;
		sendMessage({ windowid: id, msg: "close" });
	});

	mWindow.on('ready-to-show', function () {
		mWindow.show();
		setTimeout(function () { mWindow.maximize(); }, 200);

		var myHelper = top.require('./js/helper.js');
		var jsArr = myHelper.injectJS();
		for (var i = 0; i < jsArr.length; i++) {
			var jsString = jsArr[i];
			mWindow.webContents.executeJavaScript(jsString);
		}
	});

	//mWindow.openDevTools();

	manHT.add(id, mWindow);
}


function createNotFullWindow(url, id, title, width, height, callback) {
	if (manHT.containsKey(id)) {
		//当这个catch住的时候，代表用户关闭了这个页面之后，又重新打开这个页面，此时，上一个window窗口已经被
		//销毁，需要重新new一个。为何要这样做？因为在监听close事件的时候，假如父窗口先关闭，会造成子窗口监听不到
		//close事件，出现异常。但是，你还需要维持map数列，以此来解决同样的id，在窗口没有关闭的时候，此窗口只需重新加载url。
		try {
			var window = manHT.getValue(id);
			window.focus();
			if (url.substr(0, 4) == "http") {
				window.loadURL(url);
			} else {
				window.loadURL(`file:${app.getAppPath()}` + '/' + url);
			}
			if (title) {
				window.setTitle(title);
			}
			window.webContents.on('did-finish-load', function () {
				if (title) {
					window.setTitle(title);
				}
				callback(window.id);
			});

			return;
		} catch (e) {
			manHT.remove(id);
			newNotFullWindow(url, id, title, width, height, callback);
			return;
		}
	}
	newNotFullWindow(url, id, title, width, height, callback);
}

function newNotFullWindow(url, id, title, width, height, callback) {
	const options = {
		width: width,
		height: height,
		minWidth: 800,
		minHeight: 600,
		autoHideMenuBar: true,
		backgroundColor: '#FFFFFF',
		useContentSize: true,
		fullscreenable: true,
		show: false
	}
	const mWindow = new BrowserWindow(options);
	if (title) {
		mWindow.setTitle(title);
	}
	if (url.substr(0, 4) == "http") {
		mWindow.loadURL(url);
	} else {
		mWindow.loadURL(`file:${app.getAppPath()}` + '/' + url);
	}

	mWindow.webContents.on('did-finish-load', function () {
		if (title) {
			mWindow.setTitle(title);
		}
		callback(mWindow.id);
	});

	mWindow.on('close', function () {
		manHT.remove(id);
		// mWindow = null;
		sendMessage({ windowid: id, msg: "close" });
	});

	mWindow.on('ready-to-show', function () {
		mWindow.show();

		var myHelper = top.require('./js/helper.js');
		var jsArr = myHelper.injectJS();
		for (var i = 0; i < jsArr.length; i++) {
			var jsString = jsArr[i];
			mWindow.webContents.executeJavaScript(jsString);
		}
	})

	//mWindow.openDevTools();
	manHT.add(id, mWindow);
}

//子窗口向父窗口发送消息 message--消息
function sendMessage(message) {
	top.require('electron').ipcRenderer.send('message', message);
}

//父窗口获得子窗口的消息 callback--回调函数
function getMessage(callback) {
	top.require('electron').ipcRenderer.on("message", callback);
}

//设置当前获取焦点的窗口的大小 size--大小，列如"800,600"，这大小不能小于最小高度/宽度
function setWindowSize(mWindowSize) {
	var mWindow = BrowserWindow.getFocusedWindow();
	if (mWindow == null) return;
	var electronScreen = top.require('electron').screen;
	var size = electronScreen.getPrimaryDisplay().workAreaSize;
	var strs = new Array(); //定义一数组 
	strs = mWindowSize.split(","); //字符分割 
	var mWidth = parseInt(strs[0]);
	var mHeight = parseInt(strs[1]);
	if (mWidth > size.width) {
		mWidth = size.width;
	}
	if (mHeight > size.height) {
		mHeight = size.height;
	}
	if (mWidth < 1000) {
		mWidth = 1000;
	}

	if (mHeight < 670) {
		mHeight = 670;
	}

	var mX = (size.width - mWidth) / 2;
	var mY = (size.height - mHeight) / 2;
	var options = {
		x: parseInt(mX),
		y: parseInt(mY),
		width: parseInt(mWidth),
		height: parseInt(mHeight)
	};
	mWindow.setBounds(options, false);
}

function HashTable() {
	var size = 0;
	var entry = new Object();
	this.add = function (key, value) {
		if (!this.containsKey(key)) {
			size++;
		}
		entry[key] = value;
	}
	this.getValue = function (key) {
		return this.containsKey(key) ? entry[key] : null;
	}
	this.remove = function (key) {
		if (this.containsKey(key) && (delete entry[key])) {
			size--;
		}
	}
	this.containsKey = function (key) {
		return (key in entry);
	}
	this.containsValue = function (value) {
		for (var prop in entry) {
			if (entry[prop] == value) {
				return true;
			}
		}
		return false;
	}
	this.getValues = function () {
		var values = new Array();
		for (var prop in entry) {
			values.push(entry[prop]);
		}
		return values;
	}
	this.getKeys = function () {
		var keys = new Array();
		for (var prop in entry) {
			keys.push(prop);
		}
		return keys;
	}
	this.getSize = function () {
		return size;
	}
	this.clear = function () {
		size = 0;
		entry = new Object();
	}
}




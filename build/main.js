/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(0);
var mpd = __webpack_require__(2);
exports.default = function () {
    electron_1.ipcMain.on('bye', function (event, arg) {
        console.log('Bye!'); // prints "ping"
        electron_1.app.quit();
    });
    var client = mpd.connect({
        port: 6600,
        host: 'localhost'
    });
    client.on('ready', function () {
        console.log('MPC ready');
    });
    // client.sendCommand('status', [], (err, result) => {
    //     console.log(result);
    // });
    electron_1.ipcMain.on('mpc-toggle', function () {
        console.log('mpc-toggle');
        client.sendCommand(mpd.cmd('toggle', []), function (err, result) {
            console.log(result);
        });
    });
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(5).EventEmitter
  , util = __webpack_require__(7)
  , assert = __webpack_require__(4)
  , net = __webpack_require__(6)
  , MPD_SENTINEL = /^(OK|ACK|list_OK)(.*)$/m
  , OK_MPD = /^OK MPD /

module.exports = MpdClient;
MpdClient.Command = Command
MpdClient.cmd = cmd;
MpdClient.parseKeyValueMessage = parseKeyValueMessage;
MpdClient.parseArrayMessage = parseArrayMessage;

function MpdClient() {
  EventEmitter.call(this);

  this.buffer = "";
  this.msgHandlerQueue = [];
  this.idling = false;
}
util.inherits(MpdClient, EventEmitter);

var defaultConnectOpts = {
  host: 'localhost',
  port: 6600
}

MpdClient.connect = function(options) {
  options = options || defaultConnectOpts;
  
  var client = new MpdClient();
  client.socket = net.connect(options, function() {
    client.emit('connect');
  });
  client.socket.setEncoding('utf8');
  client.socket.on('data', function(data) {
    client.receive(data);
  });
  client.socket.on('close', function() {
    client.emit('end');
  });
  client.socket.on('error', function(err) {
    client.emit('error', err);
  });
  return client;
}

MpdClient.prototype.receive = function(data) {
  var m;
  this.buffer += data;
  while (m = this.buffer.match(MPD_SENTINEL)) {
    var msg = this.buffer.substring(0, m.index)
      , line = m[0]
      , code = m[1]
      , str = m[2]
    if (code === "ACK") {
      var err = new Error(str);
      this.handleMessage(err);
    } else if (OK_MPD.test(line)) {
      this.setupIdling();
    } else {
      this.handleMessage(null, msg);
    }

    this.buffer = this.buffer.substring(msg.length + line.length + 1);
  }
};

MpdClient.prototype.handleMessage = function(err, msg) {
  var handler = this.msgHandlerQueue.shift();
  handler(err, msg);
};

MpdClient.prototype.setupIdling = function() {
  var self = this;
  self.sendWithCallback("idle", function(err, msg) {
    self.handleIdleResultsLoop(err, msg);
  });
  self.idling = true;
  self.emit('ready');
};

MpdClient.prototype.sendCommand = function(command, callback) {
  var self = this;
  callback = callback || noop.bind(this);
  assert.ok(self.idling);
  self.send("noidle\n");
  self.sendWithCallback(command, callback);
  self.sendWithCallback("idle", function(err, msg) {
    self.handleIdleResultsLoop(err, msg);
  });
};

MpdClient.prototype.sendCommands = function(commandList, callback) {
  var fullCmd = "command_list_begin\n" + commandList.join("\n") + "\ncommand_list_end";
  this.sendCommand(fullCmd, callback || noop.bind(this));
};

MpdClient.prototype.handleIdleResultsLoop = function(err, msg) {
  var self = this;
  if (err) {
    self.emit('error', err);
    return;
  }
  self.handleIdleResults(msg);
  if (self.msgHandlerQueue.length === 0) {
    self.sendWithCallback("idle", function(err, msg) {
      self.handleIdleResultsLoop(err, msg);
    });
  }
};

MpdClient.prototype.handleIdleResults = function(msg) {
  var self = this;
  msg.split("\n").forEach(function(system) {
    if (system.length > 0) {
      var name = system.substring(9);
      self.emit('system-' + name);
      self.emit('system', name);
    }
  });
};

MpdClient.prototype.sendWithCallback = function(cmd, cb) {
  cb = cb || noop.bind(this);
  this.msgHandlerQueue.push(cb);
  this.send(cmd + "\n");
};

MpdClient.prototype.send = function(data) {
  this.socket.write(data);
};

function Command(name, args) {
  this.name = name;
  this.args = args;
}

Command.prototype.toString = function() {
  return this.name + " " + this.args.map(argEscape).join(" ");
};

function argEscape(arg){
  // replace all " with \"
  return '"' + arg.toString().replace(/"/g, '\\"') + '"';
}

function noop(err) {
  if (err) this.emit('error', err);
}

// convenience
function cmd(name, args) {
  return new Command(name, args);
}

function parseKeyValueMessage(msg) {
  var result = {};

  msg.split('\n').forEach(function(p){
    if(p.length === 0) {
      return;
    }
    var keyValue = p.match(/([^ ]+): (.*)/);
    if (keyValue == null) {
      throw new Error('Could not parse entry "' + p + '"')
    }
    result[keyValue[1]] = keyValue[2];
  });
  return result;
}

function parseArrayMessage(msg) {
  var results = [];
  var obj = {};

  msg.split('\n').forEach(function(p) {
    if(p.length === 0) {
      return;
    }
    var keyValue = p.match(/([^ ]+): (.*)/);
    if (keyValue == null) {
      throw new Error('Could not parse entry "' + p + '"')
    }

    if (obj[keyValue[1]] !== undefined) {
      results.push(obj);
      obj = {};
      obj[keyValue[1]] = keyValue[2];
    }
    else {
      obj[keyValue[1]] = keyValue[2];
    }
  });
  results.push(obj);
  return results;
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(0);
var mpc_1 = __webpack_require__(1);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', function () {
    // Create the browser window.
    win = new electron_1.BrowserWindow();
    win.setMenu(null);
    // and load the index.html of the app.
    win.loadURL('file://' + __dirname + '/index.html');
    // Open the DevTools.
    win.webContents.openDevTools();
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
mpc_1.default();


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjI0Nzk2MWMyM2E0YmI2MDkxODIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2VuZC9tcGMudHMiLCJ3ZWJwYWNrOi8vLy4vfi9tcGQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tlbmQvbWFpbi50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudHNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBLHFDOzs7Ozs7O0FDQUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNwTUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7Ozs7OztBQ2hDQSxtQzs7Ozs7O0FDQUEsbUM7Ozs7OztBQ0FBLGdDOzs7Ozs7QUNBQSxpQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMjQ3OTYxYzIzYTRiYjYwOTE4MiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZWxlY3Ryb25fMSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcclxudmFyIG1wZCA9IHJlcXVpcmUoXCJtcGRcIik7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGVsZWN0cm9uXzEuaXBjTWFpbi5vbignYnllJywgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQnllIScpOyAvLyBwcmludHMgXCJwaW5nXCJcclxuICAgICAgICBlbGVjdHJvbl8xLmFwcC5xdWl0KCk7XHJcbiAgICB9KTtcclxuICAgIHZhciBjbGllbnQgPSBtcGQuY29ubmVjdCh7XHJcbiAgICAgICAgcG9ydDogNjYwMCxcclxuICAgICAgICBob3N0OiAnbG9jYWxob3N0J1xyXG4gICAgfSk7XHJcbiAgICBjbGllbnQub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdNUEMgcmVhZHknKTtcclxuICAgIH0pO1xyXG4gICAgLy8gY2xpZW50LnNlbmRDb21tYW5kKCdzdGF0dXMnLCBbXSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgIC8vIH0pO1xyXG4gICAgZWxlY3Ryb25fMS5pcGNNYWluLm9uKCdtcGMtdG9nZ2xlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdtcGMtdG9nZ2xlJyk7XHJcbiAgICAgICAgY2xpZW50LnNlbmRDb21tYW5kKG1wZC5jbWQoJ3RvZ2dsZScsIFtdKSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYmFja2VuZC9tcGMudHNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuICAsIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbiAgLCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxuICAsIG5ldCA9IHJlcXVpcmUoJ25ldCcpXG4gICwgTVBEX1NFTlRJTkVMID0gL14oT0t8QUNLfGxpc3RfT0spKC4qKSQvbVxuICAsIE9LX01QRCA9IC9eT0sgTVBEIC9cblxubW9kdWxlLmV4cG9ydHMgPSBNcGRDbGllbnQ7XG5NcGRDbGllbnQuQ29tbWFuZCA9IENvbW1hbmRcbk1wZENsaWVudC5jbWQgPSBjbWQ7XG5NcGRDbGllbnQucGFyc2VLZXlWYWx1ZU1lc3NhZ2UgPSBwYXJzZUtleVZhbHVlTWVzc2FnZTtcbk1wZENsaWVudC5wYXJzZUFycmF5TWVzc2FnZSA9IHBhcnNlQXJyYXlNZXNzYWdlO1xuXG5mdW5jdGlvbiBNcGRDbGllbnQoKSB7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuYnVmZmVyID0gXCJcIjtcbiAgdGhpcy5tc2dIYW5kbGVyUXVldWUgPSBbXTtcbiAgdGhpcy5pZGxpbmcgPSBmYWxzZTtcbn1cbnV0aWwuaW5oZXJpdHMoTXBkQ2xpZW50LCBFdmVudEVtaXR0ZXIpO1xuXG52YXIgZGVmYXVsdENvbm5lY3RPcHRzID0ge1xuICBob3N0OiAnbG9jYWxob3N0JyxcbiAgcG9ydDogNjYwMFxufVxuXG5NcGRDbGllbnQuY29ubmVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgZGVmYXVsdENvbm5lY3RPcHRzO1xuICBcbiAgdmFyIGNsaWVudCA9IG5ldyBNcGRDbGllbnQoKTtcbiAgY2xpZW50LnNvY2tldCA9IG5ldC5jb25uZWN0KG9wdGlvbnMsIGZ1bmN0aW9uKCkge1xuICAgIGNsaWVudC5lbWl0KCdjb25uZWN0Jyk7XG4gIH0pO1xuICBjbGllbnQuc29ja2V0LnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIGNsaWVudC5zb2NrZXQub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgY2xpZW50LnJlY2VpdmUoZGF0YSk7XG4gIH0pO1xuICBjbGllbnQuc29ja2V0Lm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgIGNsaWVudC5lbWl0KCdlbmQnKTtcbiAgfSk7XG4gIGNsaWVudC5zb2NrZXQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG4gICAgY2xpZW50LmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfSk7XG4gIHJldHVybiBjbGllbnQ7XG59XG5cbk1wZENsaWVudC5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIG07XG4gIHRoaXMuYnVmZmVyICs9IGRhdGE7XG4gIHdoaWxlIChtID0gdGhpcy5idWZmZXIubWF0Y2goTVBEX1NFTlRJTkVMKSkge1xuICAgIHZhciBtc2cgPSB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcoMCwgbS5pbmRleClcbiAgICAgICwgbGluZSA9IG1bMF1cbiAgICAgICwgY29kZSA9IG1bMV1cbiAgICAgICwgc3RyID0gbVsyXVxuICAgIGlmIChjb2RlID09PSBcIkFDS1wiKSB7XG4gICAgICB2YXIgZXJyID0gbmV3IEVycm9yKHN0cik7XG4gICAgICB0aGlzLmhhbmRsZU1lc3NhZ2UoZXJyKTtcbiAgICB9IGVsc2UgaWYgKE9LX01QRC50ZXN0KGxpbmUpKSB7XG4gICAgICB0aGlzLnNldHVwSWRsaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlTWVzc2FnZShudWxsLCBtc2cpO1xuICAgIH1cblxuICAgIHRoaXMuYnVmZmVyID0gdGhpcy5idWZmZXIuc3Vic3RyaW5nKG1zZy5sZW5ndGggKyBsaW5lLmxlbmd0aCArIDEpO1xuICB9XG59O1xuXG5NcGRDbGllbnQucHJvdG90eXBlLmhhbmRsZU1lc3NhZ2UgPSBmdW5jdGlvbihlcnIsIG1zZykge1xuICB2YXIgaGFuZGxlciA9IHRoaXMubXNnSGFuZGxlclF1ZXVlLnNoaWZ0KCk7XG4gIGhhbmRsZXIoZXJyLCBtc2cpO1xufTtcblxuTXBkQ2xpZW50LnByb3RvdHlwZS5zZXR1cElkbGluZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuc2VuZFdpdGhDYWxsYmFjayhcImlkbGVcIiwgZnVuY3Rpb24oZXJyLCBtc2cpIHtcbiAgICBzZWxmLmhhbmRsZUlkbGVSZXN1bHRzTG9vcChlcnIsIG1zZyk7XG4gIH0pO1xuICBzZWxmLmlkbGluZyA9IHRydWU7XG4gIHNlbGYuZW1pdCgncmVhZHknKTtcbn07XG5cbk1wZENsaWVudC5wcm90b3R5cGUuc2VuZENvbW1hbmQgPSBmdW5jdGlvbihjb21tYW5kLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgbm9vcC5iaW5kKHRoaXMpO1xuICBhc3NlcnQub2soc2VsZi5pZGxpbmcpO1xuICBzZWxmLnNlbmQoXCJub2lkbGVcXG5cIik7XG4gIHNlbGYuc2VuZFdpdGhDYWxsYmFjayhjb21tYW5kLCBjYWxsYmFjayk7XG4gIHNlbGYuc2VuZFdpdGhDYWxsYmFjayhcImlkbGVcIiwgZnVuY3Rpb24oZXJyLCBtc2cpIHtcbiAgICBzZWxmLmhhbmRsZUlkbGVSZXN1bHRzTG9vcChlcnIsIG1zZyk7XG4gIH0pO1xufTtcblxuTXBkQ2xpZW50LnByb3RvdHlwZS5zZW5kQ29tbWFuZHMgPSBmdW5jdGlvbihjb21tYW5kTGlzdCwgY2FsbGJhY2spIHtcbiAgdmFyIGZ1bGxDbWQgPSBcImNvbW1hbmRfbGlzdF9iZWdpblxcblwiICsgY29tbWFuZExpc3Quam9pbihcIlxcblwiKSArIFwiXFxuY29tbWFuZF9saXN0X2VuZFwiO1xuICB0aGlzLnNlbmRDb21tYW5kKGZ1bGxDbWQsIGNhbGxiYWNrIHx8IG5vb3AuYmluZCh0aGlzKSk7XG59O1xuXG5NcGRDbGllbnQucHJvdG90eXBlLmhhbmRsZUlkbGVSZXN1bHRzTG9vcCA9IGZ1bmN0aW9uKGVyciwgbXNnKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKGVycikge1xuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLmhhbmRsZUlkbGVSZXN1bHRzKG1zZyk7XG4gIGlmIChzZWxmLm1zZ0hhbmRsZXJRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICBzZWxmLnNlbmRXaXRoQ2FsbGJhY2soXCJpZGxlXCIsIGZ1bmN0aW9uKGVyciwgbXNnKSB7XG4gICAgICBzZWxmLmhhbmRsZUlkbGVSZXN1bHRzTG9vcChlcnIsIG1zZyk7XG4gICAgfSk7XG4gIH1cbn07XG5cbk1wZENsaWVudC5wcm90b3R5cGUuaGFuZGxlSWRsZVJlc3VsdHMgPSBmdW5jdGlvbihtc2cpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBtc2cuc3BsaXQoXCJcXG5cIikuZm9yRWFjaChmdW5jdGlvbihzeXN0ZW0pIHtcbiAgICBpZiAoc3lzdGVtLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBuYW1lID0gc3lzdGVtLnN1YnN0cmluZyg5KTtcbiAgICAgIHNlbGYuZW1pdCgnc3lzdGVtLScgKyBuYW1lKTtcbiAgICAgIHNlbGYuZW1pdCgnc3lzdGVtJywgbmFtZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbk1wZENsaWVudC5wcm90b3R5cGUuc2VuZFdpdGhDYWxsYmFjayA9IGZ1bmN0aW9uKGNtZCwgY2IpIHtcbiAgY2IgPSBjYiB8fCBub29wLmJpbmQodGhpcyk7XG4gIHRoaXMubXNnSGFuZGxlclF1ZXVlLnB1c2goY2IpO1xuICB0aGlzLnNlbmQoY21kICsgXCJcXG5cIik7XG59O1xuXG5NcGRDbGllbnQucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHRoaXMuc29ja2V0LndyaXRlKGRhdGEpO1xufTtcblxuZnVuY3Rpb24gQ29tbWFuZChuYW1lLCBhcmdzKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYXJncyA9IGFyZ3M7XG59XG5cbkNvbW1hbmQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm5hbWUgKyBcIiBcIiArIHRoaXMuYXJncy5tYXAoYXJnRXNjYXBlKS5qb2luKFwiIFwiKTtcbn07XG5cbmZ1bmN0aW9uIGFyZ0VzY2FwZShhcmcpe1xuICAvLyByZXBsYWNlIGFsbCBcIiB3aXRoIFxcXCJcbiAgcmV0dXJuICdcIicgKyBhcmcudG9TdHJpbmcoKS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgKyAnXCInO1xufVxuXG5mdW5jdGlvbiBub29wKGVycikge1xuICBpZiAoZXJyKSB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbn1cblxuLy8gY29udmVuaWVuY2VcbmZ1bmN0aW9uIGNtZChuYW1lLCBhcmdzKSB7XG4gIHJldHVybiBuZXcgQ29tbWFuZChuYW1lLCBhcmdzKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VLZXlWYWx1ZU1lc3NhZ2UobXNnKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBtc2cuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24ocCl7XG4gICAgaWYocC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGtleVZhbHVlID0gcC5tYXRjaCgvKFteIF0rKTogKC4qKS8pO1xuICAgIGlmIChrZXlWYWx1ZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBlbnRyeSBcIicgKyBwICsgJ1wiJylcbiAgICB9XG4gICAgcmVzdWx0W2tleVZhbHVlWzFdXSA9IGtleVZhbHVlWzJdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGFyc2VBcnJheU1lc3NhZ2UobXNnKSB7XG4gIHZhciByZXN1bHRzID0gW107XG4gIHZhciBvYmogPSB7fTtcblxuICBtc2cuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgIGlmKHAubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBrZXlWYWx1ZSA9IHAubWF0Y2goLyhbXiBdKyk6ICguKikvKTtcbiAgICBpZiAoa2V5VmFsdWUgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcGFyc2UgZW50cnkgXCInICsgcCArICdcIicpXG4gICAgfVxuXG4gICAgaWYgKG9ialtrZXlWYWx1ZVsxXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0cy5wdXNoKG9iaik7XG4gICAgICBvYmogPSB7fTtcbiAgICAgIG9ialtrZXlWYWx1ZVsxXV0gPSBrZXlWYWx1ZVsyXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvYmpba2V5VmFsdWVbMV1dID0ga2V5VmFsdWVbMl07XG4gICAgfVxuICB9KTtcbiAgcmVzdWx0cy5wdXNoKG9iaik7XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L21wZC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZWxlY3Ryb25fMSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcclxudmFyIG1wY18xID0gcmVxdWlyZShcIi4vbXBjXCIpO1xyXG4vLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcclxuLy8gYmUgY2xvc2VkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgSmF2YVNjcmlwdCBvYmplY3QgaXMgZ2FyYmFnZSBjb2xsZWN0ZWQuXHJcbnZhciB3aW47XHJcbi8vIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdoZW4gRWxlY3Ryb24gaGFzIGZpbmlzaGVkXHJcbi8vIGluaXRpYWxpemF0aW9uIGFuZCBpcyByZWFkeSB0byBjcmVhdGUgYnJvd3NlciB3aW5kb3dzLlxyXG4vLyBTb21lIEFQSXMgY2FuIG9ubHkgYmUgdXNlZCBhZnRlciB0aGlzIGV2ZW50IG9jY3Vycy5cclxuZWxlY3Ryb25fMS5hcHAub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gQ3JlYXRlIHRoZSBicm93c2VyIHdpbmRvdy5cclxuICAgIHdpbiA9IG5ldyBlbGVjdHJvbl8xLkJyb3dzZXJXaW5kb3coKTtcclxuICAgIHdpbi5zZXRNZW51KG51bGwpO1xyXG4gICAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cclxuICAgIHdpbi5sb2FkVVJMKCdmaWxlOi8vJyArIF9fZGlybmFtZSArICcvaW5kZXguaHRtbCcpO1xyXG4gICAgLy8gT3BlbiB0aGUgRGV2VG9vbHMuXHJcbiAgICB3aW4ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XHJcbiAgICAvLyBFbWl0dGVkIHdoZW4gdGhlIHdpbmRvdyBpcyBjbG9zZWQuXHJcbiAgICB3aW4ub24oJ2Nsb3NlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xyXG4gICAgICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcclxuICAgICAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXHJcbiAgICAgICAgd2luID0gbnVsbDtcclxuICAgIH0pO1xyXG59KTtcclxuLy8gUXVpdCB3aGVuIGFsbCB3aW5kb3dzIGFyZSBjbG9zZWQuXHJcbmVsZWN0cm9uXzEuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGVsZWN0cm9uXzEuYXBwLnF1aXQoKTtcclxufSk7XHJcbi8vIEluIHRoaXMgZmlsZSB5b3UgY2FuIGluY2x1ZGUgdGhlIHJlc3Qgb2YgeW91ciBhcHAncyBzcGVjaWZpYyBtYWluIHByb2Nlc3NcclxuLy8gY29kZS4gWW91IGNhbiBhbHNvIHB1dCB0aGVtIGluIHNlcGFyYXRlIGZpbGVzIGFuZCByZXF1aXJlIHRoZW0gaGVyZS5cclxubXBjXzEuZGVmYXVsdCgpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9iYWNrZW5kL21haW4udHNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYXNzZXJ0XCJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXZlbnRzXCJcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibmV0XCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInV0aWxcIlxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9
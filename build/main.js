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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
var mpc_1 = __webpack_require__(2);
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __webpack_require__(0);
var mpd = __webpack_require__(3);
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
/* 3 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2I3YTZkZDlkODdhYWFmMTkzNWMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2VuZC9tcGMudHMiLCJ3ZWJwYWNrOi8vLy4vfi9tcGQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXNzZXJ0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXZlbnRzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibmV0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXRpbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQSxxQzs7Ozs7OztBQ0FBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7Ozs7Ozs7O0FDaENBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7Ozs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7QUNwTUEsbUM7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSxnQzs7Ozs7O0FDQUEsaUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgN2I3YTZkZDlkODdhYWFmMTkzNWMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImVsZWN0cm9uXCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGVsZWN0cm9uXzEgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XHJcbnZhciBtcGNfMSA9IHJlcXVpcmUoXCIuL2JhY2tlbmQvbXBjXCIpO1xyXG4vLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcclxuLy8gYmUgY2xvc2VkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgSmF2YVNjcmlwdCBvYmplY3QgaXMgZ2FyYmFnZSBjb2xsZWN0ZWQuXHJcbnZhciB3aW47XHJcbi8vIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdoZW4gRWxlY3Ryb24gaGFzIGZpbmlzaGVkXHJcbi8vIGluaXRpYWxpemF0aW9uIGFuZCBpcyByZWFkeSB0byBjcmVhdGUgYnJvd3NlciB3aW5kb3dzLlxyXG4vLyBTb21lIEFQSXMgY2FuIG9ubHkgYmUgdXNlZCBhZnRlciB0aGlzIGV2ZW50IG9jY3Vycy5cclxuZWxlY3Ryb25fMS5hcHAub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gQ3JlYXRlIHRoZSBicm93c2VyIHdpbmRvdy5cclxuICAgIHdpbiA9IG5ldyBlbGVjdHJvbl8xLkJyb3dzZXJXaW5kb3coKTtcclxuICAgIHdpbi5zZXRNZW51KG51bGwpO1xyXG4gICAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cclxuICAgIHdpbi5sb2FkVVJMKCdmaWxlOi8vJyArIF9fZGlybmFtZSArICcvaW5kZXguaHRtbCcpO1xyXG4gICAgLy8gT3BlbiB0aGUgRGV2VG9vbHMuXHJcbiAgICB3aW4ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XHJcbiAgICAvLyBFbWl0dGVkIHdoZW4gdGhlIHdpbmRvdyBpcyBjbG9zZWQuXHJcbiAgICB3aW4ub24oJ2Nsb3NlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xyXG4gICAgICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcclxuICAgICAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXHJcbiAgICAgICAgd2luID0gbnVsbDtcclxuICAgIH0pO1xyXG59KTtcclxuLy8gUXVpdCB3aGVuIGFsbCB3aW5kb3dzIGFyZSBjbG9zZWQuXHJcbmVsZWN0cm9uXzEuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGVsZWN0cm9uXzEuYXBwLnF1aXQoKTtcclxufSk7XHJcbi8vIEluIHRoaXMgZmlsZSB5b3UgY2FuIGluY2x1ZGUgdGhlIHJlc3Qgb2YgeW91ciBhcHAncyBzcGVjaWZpYyBtYWluIHByb2Nlc3NcclxuLy8gY29kZS4gWW91IGNhbiBhbHNvIHB1dCB0aGVtIGluIHNlcGFyYXRlIGZpbGVzIGFuZCByZXF1aXJlIHRoZW0gaGVyZS5cclxubXBjXzEuZGVmYXVsdCgpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tYWluLnRzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBlbGVjdHJvbl8xID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xyXG52YXIgbXBkID0gcmVxdWlyZShcIm1wZFwiKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZWxlY3Ryb25fMS5pcGNNYWluLm9uKCdieWUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdCeWUhJyk7IC8vIHByaW50cyBcInBpbmdcIlxyXG4gICAgICAgIGVsZWN0cm9uXzEuYXBwLnF1aXQoKTtcclxuICAgIH0pO1xyXG4gICAgdmFyIGNsaWVudCA9IG1wZC5jb25uZWN0KHtcclxuICAgICAgICBwb3J0OiA2NjAwLFxyXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnXHJcbiAgICB9KTtcclxuICAgIGNsaWVudC5vbigncmVhZHknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ01QQyByZWFkeScpO1xyXG4gICAgfSk7XHJcbiAgICAvLyBjbGllbnQuc2VuZENvbW1hbmQoJ3N0YXR1cycsIFtdLCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgLy8gfSk7XHJcbiAgICBlbGVjdHJvbl8xLmlwY01haW4ub24oJ21wYy10b2dnbGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ21wYy10b2dnbGUnKTtcclxuICAgICAgICBjbGllbnQuc2VuZENvbW1hbmQobXBkLmNtZCgndG9nZ2xlJywgW10pLCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9iYWNrZW5kL21wYy50c1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG4gICwgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuICAsIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG4gICwgbmV0ID0gcmVxdWlyZSgnbmV0JylcbiAgLCBNUERfU0VOVElORUwgPSAvXihPS3xBQ0t8bGlzdF9PSykoLiopJC9tXG4gICwgT0tfTVBEID0gL15PSyBNUEQgL1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1wZENsaWVudDtcbk1wZENsaWVudC5Db21tYW5kID0gQ29tbWFuZFxuTXBkQ2xpZW50LmNtZCA9IGNtZDtcbk1wZENsaWVudC5wYXJzZUtleVZhbHVlTWVzc2FnZSA9IHBhcnNlS2V5VmFsdWVNZXNzYWdlO1xuTXBkQ2xpZW50LnBhcnNlQXJyYXlNZXNzYWdlID0gcGFyc2VBcnJheU1lc3NhZ2U7XG5cbmZ1bmN0aW9uIE1wZENsaWVudCgpIHtcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgdGhpcy5idWZmZXIgPSBcIlwiO1xuICB0aGlzLm1zZ0hhbmRsZXJRdWV1ZSA9IFtdO1xuICB0aGlzLmlkbGluZyA9IGZhbHNlO1xufVxudXRpbC5pbmhlcml0cyhNcGRDbGllbnQsIEV2ZW50RW1pdHRlcik7XG5cbnZhciBkZWZhdWx0Q29ubmVjdE9wdHMgPSB7XG4gIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICBwb3J0OiA2NjAwXG59XG5cbk1wZENsaWVudC5jb25uZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCBkZWZhdWx0Q29ubmVjdE9wdHM7XG4gIFxuICB2YXIgY2xpZW50ID0gbmV3IE1wZENsaWVudCgpO1xuICBjbGllbnQuc29ja2V0ID0gbmV0LmNvbm5lY3Qob3B0aW9ucywgZnVuY3Rpb24oKSB7XG4gICAgY2xpZW50LmVtaXQoJ2Nvbm5lY3QnKTtcbiAgfSk7XG4gIGNsaWVudC5zb2NrZXQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgY2xpZW50LnNvY2tldC5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBjbGllbnQucmVjZWl2ZShkYXRhKTtcbiAgfSk7XG4gIGNsaWVudC5zb2NrZXQub24oJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgY2xpZW50LmVtaXQoJ2VuZCcpO1xuICB9KTtcbiAgY2xpZW50LnNvY2tldC5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICBjbGllbnQuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9KTtcbiAgcmV0dXJuIGNsaWVudDtcbn1cblxuTXBkQ2xpZW50LnByb3RvdHlwZS5yZWNlaXZlID0gZnVuY3Rpb24oZGF0YSkge1xuICB2YXIgbTtcbiAgdGhpcy5idWZmZXIgKz0gZGF0YTtcbiAgd2hpbGUgKG0gPSB0aGlzLmJ1ZmZlci5tYXRjaChNUERfU0VOVElORUwpKSB7XG4gICAgdmFyIG1zZyA9IHRoaXMuYnVmZmVyLnN1YnN0cmluZygwLCBtLmluZGV4KVxuICAgICAgLCBsaW5lID0gbVswXVxuICAgICAgLCBjb2RlID0gbVsxXVxuICAgICAgLCBzdHIgPSBtWzJdXG4gICAgaWYgKGNvZGUgPT09IFwiQUNLXCIpIHtcbiAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3Ioc3RyKTtcbiAgICAgIHRoaXMuaGFuZGxlTWVzc2FnZShlcnIpO1xuICAgIH0gZWxzZSBpZiAoT0tfTVBELnRlc3QobGluZSkpIHtcbiAgICAgIHRoaXMuc2V0dXBJZGxpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlKG51bGwsIG1zZyk7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcobXNnLmxlbmd0aCArIGxpbmUubGVuZ3RoICsgMSk7XG4gIH1cbn07XG5cbk1wZENsaWVudC5wcm90b3R5cGUuaGFuZGxlTWVzc2FnZSA9IGZ1bmN0aW9uKGVyciwgbXNnKSB7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5tc2dIYW5kbGVyUXVldWUuc2hpZnQoKTtcbiAgaGFuZGxlcihlcnIsIG1zZyk7XG59O1xuXG5NcGRDbGllbnQucHJvdG90eXBlLnNldHVwSWRsaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5zZW5kV2l0aENhbGxiYWNrKFwiaWRsZVwiLCBmdW5jdGlvbihlcnIsIG1zZykge1xuICAgIHNlbGYuaGFuZGxlSWRsZVJlc3VsdHNMb29wKGVyciwgbXNnKTtcbiAgfSk7XG4gIHNlbGYuaWRsaW5nID0gdHJ1ZTtcbiAgc2VsZi5lbWl0KCdyZWFkeScpO1xufTtcblxuTXBkQ2xpZW50LnByb3RvdHlwZS5zZW5kQ29tbWFuZCA9IGZ1bmN0aW9uKGNvbW1hbmQsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBub29wLmJpbmQodGhpcyk7XG4gIGFzc2VydC5vayhzZWxmLmlkbGluZyk7XG4gIHNlbGYuc2VuZChcIm5vaWRsZVxcblwiKTtcbiAgc2VsZi5zZW5kV2l0aENhbGxiYWNrKGNvbW1hbmQsIGNhbGxiYWNrKTtcbiAgc2VsZi5zZW5kV2l0aENhbGxiYWNrKFwiaWRsZVwiLCBmdW5jdGlvbihlcnIsIG1zZykge1xuICAgIHNlbGYuaGFuZGxlSWRsZVJlc3VsdHNMb29wKGVyciwgbXNnKTtcbiAgfSk7XG59O1xuXG5NcGRDbGllbnQucHJvdG90eXBlLnNlbmRDb21tYW5kcyA9IGZ1bmN0aW9uKGNvbW1hbmRMaXN0LCBjYWxsYmFjaykge1xuICB2YXIgZnVsbENtZCA9IFwiY29tbWFuZF9saXN0X2JlZ2luXFxuXCIgKyBjb21tYW5kTGlzdC5qb2luKFwiXFxuXCIpICsgXCJcXG5jb21tYW5kX2xpc3RfZW5kXCI7XG4gIHRoaXMuc2VuZENvbW1hbmQoZnVsbENtZCwgY2FsbGJhY2sgfHwgbm9vcC5iaW5kKHRoaXMpKTtcbn07XG5cbk1wZENsaWVudC5wcm90b3R5cGUuaGFuZGxlSWRsZVJlc3VsdHNMb29wID0gZnVuY3Rpb24oZXJyLCBtc2cpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoZXJyKSB7XG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNlbGYuaGFuZGxlSWRsZVJlc3VsdHMobXNnKTtcbiAgaWYgKHNlbGYubXNnSGFuZGxlclF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHNlbGYuc2VuZFdpdGhDYWxsYmFjayhcImlkbGVcIiwgZnVuY3Rpb24oZXJyLCBtc2cpIHtcbiAgICAgIHNlbGYuaGFuZGxlSWRsZVJlc3VsdHNMb29wKGVyciwgbXNnKTtcbiAgICB9KTtcbiAgfVxufTtcblxuTXBkQ2xpZW50LnByb3RvdHlwZS5oYW5kbGVJZGxlUmVzdWx0cyA9IGZ1bmN0aW9uKG1zZykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG1zZy5zcGxpdChcIlxcblwiKS5mb3JFYWNoKGZ1bmN0aW9uKHN5c3RlbSkge1xuICAgIGlmIChzeXN0ZW0ubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIG5hbWUgPSBzeXN0ZW0uc3Vic3RyaW5nKDkpO1xuICAgICAgc2VsZi5lbWl0KCdzeXN0ZW0tJyArIG5hbWUpO1xuICAgICAgc2VsZi5lbWl0KCdzeXN0ZW0nLCBuYW1lKTtcbiAgICB9XG4gIH0pO1xufTtcblxuTXBkQ2xpZW50LnByb3RvdHlwZS5zZW5kV2l0aENhbGxiYWNrID0gZnVuY3Rpb24oY21kLCBjYikge1xuICBjYiA9IGNiIHx8IG5vb3AuYmluZCh0aGlzKTtcbiAgdGhpcy5tc2dIYW5kbGVyUXVldWUucHVzaChjYik7XG4gIHRoaXMuc2VuZChjbWQgKyBcIlxcblwiKTtcbn07XG5cbk1wZENsaWVudC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdGhpcy5zb2NrZXQud3JpdGUoZGF0YSk7XG59O1xuXG5mdW5jdGlvbiBDb21tYW5kKG5hbWUsIGFyZ3MpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5hcmdzID0gYXJncztcbn1cblxuQ29tbWFuZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubmFtZSArIFwiIFwiICsgdGhpcy5hcmdzLm1hcChhcmdFc2NhcGUpLmpvaW4oXCIgXCIpO1xufTtcblxuZnVuY3Rpb24gYXJnRXNjYXBlKGFyZyl7XG4gIC8vIHJlcGxhY2UgYWxsIFwiIHdpdGggXFxcIlxuICByZXR1cm4gJ1wiJyArIGFyZy50b1N0cmluZygpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIic7XG59XG5cbmZ1bmN0aW9uIG5vb3AoZXJyKSB7XG4gIGlmIChlcnIpIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xufVxuXG4vLyBjb252ZW5pZW5jZVxuZnVuY3Rpb24gY21kKG5hbWUsIGFyZ3MpIHtcbiAgcmV0dXJuIG5ldyBDb21tYW5kKG5hbWUsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUtleVZhbHVlTWVzc2FnZShtc2cpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIG1zZy5zcGxpdCgnXFxuJykuZm9yRWFjaChmdW5jdGlvbihwKXtcbiAgICBpZihwLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIga2V5VmFsdWUgPSBwLm1hdGNoKC8oW14gXSspOiAoLiopLyk7XG4gICAgaWYgKGtleVZhbHVlID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IHBhcnNlIGVudHJ5IFwiJyArIHAgKyAnXCInKVxuICAgIH1cbiAgICByZXN1bHRba2V5VmFsdWVbMV1dID0ga2V5VmFsdWVbMl07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwYXJzZUFycmF5TWVzc2FnZShtc2cpIHtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIG1zZy5zcGxpdCgnXFxuJykuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgaWYocC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGtleVZhbHVlID0gcC5tYXRjaCgvKFteIF0rKTogKC4qKS8pO1xuICAgIGlmIChrZXlWYWx1ZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSBlbnRyeSBcIicgKyBwICsgJ1wiJylcbiAgICB9XG5cbiAgICBpZiAob2JqW2tleVZhbHVlWzFdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHRzLnB1c2gob2JqKTtcbiAgICAgIG9iaiA9IHt9O1xuICAgICAgb2JqW2tleVZhbHVlWzFdXSA9IGtleVZhbHVlWzJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG9ialtrZXlWYWx1ZVsxXV0gPSBrZXlWYWx1ZVsyXTtcbiAgICB9XG4gIH0pO1xuICByZXN1bHRzLnB1c2gob2JqKTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbXBkL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImFzc2VydFwiXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV2ZW50c1wiXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5ldFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm5ldFwiXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ1dGlsXCJcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
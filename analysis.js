(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["openpifpafwebdemo"] = factory();
	else
		root["openpifpafwebdemo"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/frontend.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/frontend.ts":
/*!****************************!*\
  !*** ./js/src/frontend.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* global document */
Object.defineProperty(exports, "__esModule", { value: true });
var backend_location = (document.location.search && document.location.search[0] == '?') ? document.location.search.substr(1) : '';
if (!backend_location && document.location.hostname == 'vita-epfl.github.io') {
    backend_location = 'https://vitapc11.epfl.ch';
}
var video = document.getElementById('video');
var canvasCapture = document.getElementById('canvas-capture');
var contextCapture = canvasCapture.getContext('2d');
var canvasOut = document.getElementById('canvas-out');
var contextOut = canvasOut.getContext('2d');
var fpsSpan = document.getElementById('fps');
var captureCounter = 0;
var fps = 0.0;
var lastProcessing = null;
var capabilities = { audio: false, video: { width: 640, height: 480 } };
navigator.mediaDevices.getUserMedia(capabilities).then(function (stream) { return video.srcObject = stream; });
var COCO_PERSON_SKELETON = [
    [16, 14], [14, 12], [17, 15], [15, 13], [12, 13], [6, 12], [7, 13],
    [6, 7], [6, 8], [7, 9], [8, 10], [9, 11], [2, 3], [1, 2], [1, 3],
    [2, 4], [3, 5], [4, 6], [5, 7]
];
var COLORS = [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5",
];
function drawSkeleton(keypoints, detection_id) {
    // contextOut.font = "12px Arial";
    // contextOut.fillText(`detection ${detection_id}`,
    //                     keypoints[0][0] * canvasOut.width,
    //                     keypoints[0][1] * canvasOut.height);
    console.log({ keypoints: keypoints, detection_id: detection_id });
    COCO_PERSON_SKELETON.forEach(function (joint_pair, connection_index) {
        var joint1i = joint_pair[0], joint2i = joint_pair[1];
        var joint1xyv = keypoints[joint1i - 1];
        var joint2xyv = keypoints[joint2i - 1];
        var color = COLORS[connection_index % COLORS.length];
        contextOut.strokeStyle = color;
        contextOut.lineWidth = 5;
        if (joint1xyv[2] == 0.0 || joint2xyv[2] == 0.0)
            return;
        contextOut.beginPath();
        contextOut.moveTo(joint1xyv[0] * canvasOut.width, joint1xyv[1] * canvasOut.height);
        contextOut.lineTo(joint2xyv[0] * canvasOut.width, joint2xyv[1] * canvasOut.height);
        contextOut.stroke();
    });
    keypoints.forEach(function (xyv, joint_id) {
        if (xyv[2] == 0.0)
            return;
        contextOut.beginPath();
        contextOut.fillStyle = '#ffffff';
        contextOut.arc(xyv[0] * canvasOut.width, xyv[1] * canvasOut.height, 2, 0, 2 * Math.PI);
        contextOut.fill();
    });
}
function newImage() {
    contextCapture.drawImage(video, 0, 0, canvasCapture.width, canvasCapture.height);
    captureCounter += 1;
    var data = { image_id: captureCounter, image: canvasCapture.toDataURL() };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', backend_location + '/process', true);
    xhr.onload = function () {
        if (lastProcessing != null) {
            var duration = Date.now() - lastProcessing;
            fps = 0.5 * fps + 0.5 * (1000.0 / duration);
            fpsSpan.textContent = "" + fps.toFixed(1);
        }
        lastProcessing = Date.now();
        newImage();
        var body = JSON.parse(this['responseText']);
        var scores = body.map(function (entry) { return entry.score; });
        // console.log({'canvaswidth': [canvasOut.clientWidth, canvasOut.scrollWidth], 'videoheight': video.videoHeight, 'videowidth': video.videoWidth});
        var targetHeight = Math.round(canvasOut.clientWidth * video.videoHeight / video.videoWidth);
        if (canvasOut.clientHeight != targetHeight) {
            canvasOut.height = targetHeight;
        }
        // console.log({r: Math.round(canvasOut.clientWidth * video.videoHeight / video.videoWidth), canvasheight: canvasOut.height});
        var i = new Image();
        i.onload = function () {
            contextOut.drawImage(i, 0, 0, canvasOut.width, canvasOut.height);
            body.forEach(function (entry) { return drawSkeleton(entry.coordinates, entry.detection_id); });
        };
        i.src = data.image;
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}
exports.newImage = newImage;
newImage(); // kick it off


/***/ })

/******/ });
});
//# sourceMappingURL=analysis.js.map
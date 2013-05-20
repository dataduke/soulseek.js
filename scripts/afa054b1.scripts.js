"use strict";angular.module("p2pmusicApp",[]).config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("p2pmusicApp").factory("RTCService",["$rootScope","fileService","playerService",function(e,n,o){window.mainChannel={};var t=function(t){window.mainChannel=new DataChannel("default-channel",{direction:"many-to-many",autoCloseEntireSession:!1,transmitRoomOnce:!1,openSignalingChannel:function(e){var n="http://localhost:9002/",o=e.channel||this.channel||"default-channel",t=Math.round(60535*Math.random())+5e3;io.connect(n).emit("new-channel",{channel:o,sender:t});var r=io.connect(n+o);r.channel=o,r.on("connect",function(){e.callback&&e.callback(r)}),r.send=function(e){r.emit("message",{sender:t,data:e})},r.on("message",e.onmessage)},userid:t,onopen:function(n){e.$broadcast("rtc-onopen",n)},onleave:function(n){e.$broadcast("rtc-onleave",n)},onmessage:function(o,t){if("object"==typeof o){if(console.log(o),void 0!==o.filelistRequest&&mainChannel.channels[t].send({filelist:n.ownFiles.map(function(e){return e.fullPath})}),void 0!==o.filelist&&(mainChannel.channels[t].filelist=o.filelist,e.$broadcast("rtc-gotFileList",{files:o.filelist,userid:t})),void 0!==o.requestFile){var r=ownFiles.filter(function(e){return e.fullPath==o.requestFile});r[0].file(function(e){mainChannel.channels[t].send(e)})}if(void 0!==o.requestStream){var r=ownFiles.filter(function(e){return e.fullPath==o.requestFile});r[0].file(function(){new window.FileReader,reader.readAsArrayBuffer(result),reader.onload=function(){mainChannel.channels[t].send(reader.result)}})}}else"string"==typeof o&&e.$broadcast("rtc-onmessage",{msg:o,user:t})},onFileProgress:function(n){e.$broadcast("rtc-onFileProgress",n)},onStreamProgress:function(e){console.log(e),o.bufferSound(e)},onFileSent:function(n){e.$broadcast("rtc-onFileSent",n)},onFileReceived:function(n){console.log(n),e.$broadcast("rtc-onFileReceived",n)}})};return{mainChannel:mainChannel,setupDataChannel:t}}]),angular.module("p2pmusicApp").factory("fileService",["$rootScope",function(e){function n(e,n){var o=document.querySelector(e);this.dragenter=function(e){e.stopPropagation(),e.preventDefault(),o.classList.add("dropping")},this.dragover=function(e){e.stopPropagation(),e.preventDefault()},this.dragleave=function(e){e.stopPropagation(),e.preventDefault()},this.drop=function(e){e.stopPropagation(),e.preventDefault(),o.classList.remove("dropping"),n(e.dataTransfer.files,e)},o.addEventListener("dragenter",this.dragenter,!1),o.addEventListener("dragover",this.dragover,!1),o.addEventListener("dragleave",this.dragleave,!1),o.addEventListener("drop",this.drop,!1)}var o=new n("body",function(n,o){var r=o.dataTransfer.items;t(r,function(n){e.$broadcast("file-Drop",n)})});window.ownFiles=[];var t=function(e,n){for(var e=e,o=function(e){console.log(e)},t=function(e){if(e.isDirectory){var n=e.createReader();n.readEntries(function(e){for(var n=0;e.length>n;++n)t(e[n])},o)}else ownFiles.push(e)},r=0;e.length>r;++r)t(e[r].webkitGetAsEntry());n(ownFiles)};return{dnd:o,dirRead:t,ownFiles:ownFiles}}]),angular.module("p2pmusicApp").controller("MainCtrl",["$scope","fileService","RTCService",function(){}]),angular.module("p2pmusicApp").controller("PeersCtrl",["$scope","$rootScope",function(e,n){e.peers=["You"],e.showFileList=function(){mainChannel.channels[this.peer].send({filelistRequest:!0})},n.$on("rtc-onopen",function(n,o){e.peers.push(o),e.$digest()}),n.$on("rtc-onleave",function(n,o){for(var t=0;e.peers.length>t;t++){var r=e.peers[t];if(r===o){e.peers.splice(t,1);break}}e.$digest()})}]),angular.module("p2pmusicApp").controller("ChatCtrl",["$scope","$rootScope",function(e,n){e.msgs=[{user:"chat",msg:"Welcome!"}],e.sendMessage=function(){mainChannel.send(e.message),e.msgs.push({user:"You",msg:e.message}),e.message=""},n.$on("rtc-onmessage",function(n,o){console.log(o),e.msgs.push(o),e.$digest()}),n.$on("rtc-onopen",function(n,o){e.msgs.push({user:"chat",msg:"user "+o+" joined."}),e.$digest()}),n.$on("rtc-onleave",function(n,o){e.msgs.push({user:"chat",msg:"user "+o+" left."}),e.$digest()})}]),angular.module("p2pmusicApp").controller("FiletransferCtrl",["$scope","$rootScope",function(e,n){e.transfers={},n.$on("rtc-onFileProgress",function(n,o){e.transfers[o.fileName]=o,e.$digest()}),n.$on("rtc-onFileSent",function(n,o){e.transfers[o.name].finished=!0,e.$digest()})}]),angular.module("p2pmusicApp").controller("FileBrowserCtrl",["$scope","$rootScope",function(e,n){e.show=!1,e.userid="",e.download=function(){mainChannel.channels[e.userid].send({requestFile:this.file})},e.stream=function(){console.log(this.file)},e.showLevel=function(e,n){if("number"==typeof n)return e.split("/")[n];if("string"==typeof n){var o=e.split("/");for(var t in o)if(o[t]===n)return o[t+1]}},e.$on("closeWindows",function(){console.log("closeMe"),e.show=!1}),n.$on("rtc-gotFileList",function(n,o){e.show=!0,e.userid=o.userid,e.files=o.files,e.$digest()})}]),angular.module("p2pmusicApp").controller("LoginCtrl",["$scope","$rootScope","RTCService","fileService",function(e,n,o,t){e.initialized=!1,e.usernameSet=!1,e.filesDropped=!1;var r=["De Jong","Jansen","De Vries","Van den Berg","Van Dijk","Bakker","Visser","Smit","Meijer","De Boer","Mulder","De Groot","Bos","Vos","Peters","Hendriks","Van Leeuwen","Dekker","Brouwer","De Wit","Dijkstra","Smits","De Graaf","Van der Meer"];e.username=r[Math.floor(Math.random()*r.length)],e.setUsername=function(){o.setupDataChannel(e.username),e.usernameSet=!0,e.username="",e.checkInit()},n.$on("file-Drop",function(n){console.log("drop"),t.dirRead(n,e.filesComplete),e.filesDropped=!0,e.checkInit(),e.$digest()}),e.filesComplete=function(){},e.checkInit=function(){e.filesDropped&&e.usernameSet&&(e.initialized=!0)}}]),angular.module("p2pmusicApp").controller("PlayerCtrl",["$scope","playerService",function(e){e.isPlaying=!1,e.togglePlaying=function(){e.isPlaying=!e.isPlaying}}]),angular.module("p2pmusicApp").factory("playerService",function(){if("webkitAudioContext"in window)var e=new webkitAudioContext;var n=function(n){console.log(n);var o=e.createBufferSource();e.decodeAudioData(n.data,function(n){o.buffer=e.createBuffer(n,!1),o.connect(e.destination),o.noteOn(0)})};return{context:e,bufferSound:n}}),angular.module("p2pmusicApp").directive("scrollBottom",function(){return{template:"",restrict:"A",link:function(e,n){e.$watch("msgs",function(){n.scrollTop(n.get(0).scrollHeight)},!0)}}}),angular.module("p2pmusicApp").controller("InterfaceCtrl",["$scope",function(e){e.broadcastClick=function(){e.$parent.$broadcast("interfaceClick")}}]),angular.module("p2pmusicApp").controller("WindowsCtrl",["$scope","$rootScope",function(e){e.keyDownHandler=function(){},e.broadcastClose=function(){console.log("closeWindows"),e.$broadcast("closeWindows")},e.$on("interfaceClick",e.broadcastClose),e.$on("click",e.broadcastClose),e.$on("keyDown",e.keyDownHandler)}]);
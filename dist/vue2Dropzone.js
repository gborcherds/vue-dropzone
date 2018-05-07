!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):e.vue2Dropzone=o()}(this,function(){"use strict";var t={getSignedURL:function(r,s){var d={filePath:r.name,contentType:r.type};return new Promise(function(e,o){var t=new FormData,i=new XMLHttpRequest,n="function"==typeof s.signingURL?s.signingURL(r):s.signingURL;i.open("POST",n),i.onload=function(){200==i.status?e(JSON.parse(i.response)):o(i.statusText)},i.onerror=function(e){console.error("Network Error : Could not send request to AWS (Maybe CORS errors)"),o(e)},Object.entries(s.headers||{}).forEach(function(e){var o=e[0],n=e[1];i.setRequestHeader(o,n)}),d=Object.assign(d,s.params||{}),Object.entries(d).forEach(function(e){var o=e[0],n=e[1];t.append(o,n)}),i.send(t)})},sendFile:function(o,e,n){var t=n?this.setResponseHandler:this.sendS3Handler;return this.getSignedURL(o,e).then(function(e){return t(e,o)}).catch(function(e){return e})},setResponseHandler:function(e,o){o.s3Signature=e.signature,o.s3Url=e.postEndpoint},sendS3Handler:function(t,e){var i=new FormData,o=t.signature;return Object.keys(o).forEach(function(e){i.append(e,o[e])}),i.append("file",e),new Promise(function(e,o){var n=new XMLHttpRequest;n.open("POST",t.postEndpoint),n.onload=function(){201==n.status?e({success:!0,message:n.response}):o({success:!1,message:n.response})},n.onerror=function(e){o({success:!1,message:n.response})},n.send(i)})}};return{render:function(){var e=this,o=e.$createElement;return(e._self._c||o)("div",{ref:"dropzoneElement",class:{"vue-dropzone dropzone":e.includeStyling},attrs:{id:e.id}})},staticRenderFns:[],props:{id:{type:String,required:!0},options:{type:Object,required:!0},includeStyling:{type:Boolean,default:!0,required:!1},awss3:{type:Object,required:!1,default:null},destroyDropzone:{type:Boolean,default:!0,required:!1}},data:function(){return{isS3:!1,isS3OverridesServerPropagation:!1,wasQueueAutoProcess:!0}},computed:{dropzoneSettings:function(){var o={thumbnailWidth:200,thumbnailHeight:200};return Object.keys(this.options).forEach(function(e){o[e]=this.options[e]},this),null!==this.awss3&&(o.autoProcessQueue=!1,this.isS3=!0,this.isS3OverridesServerPropagation=!1===this.awss3.sendFileToServer,void 0!==this.options.autoProcessQueue&&(this.wasQueueAutoProcess=this.options.autoProcessQueue),this.isS3OverridesServerPropagation&&(o.url=function(e){return e[0].s3Url})),o}},methods:{manuallyAddFile:function(e,o){e.manuallyAdded=!0,this.dropzone.emit("addedfile",e),o&&this.dropzone.emit("thumbnail",e,o);for(var n=e.previewElement.querySelectorAll("[data-dz-thumbnail]"),t=0;t<n.length;t++)n[t].style.width=this.dropzoneSettings.thumbnailWidth+"px",n[t].style.height=this.dropzoneSettings.thumbnailHeight+"px",n[t].style["object-fit"]="contain";this.dropzone.emit("complete",e),this.dropzone.options.maxFiles&&this.dropzone.options.maxFiles--,this.dropzone.files.push(e),this.$emit("vdropzone-file-added-manually",e)},setOption:function(e,o){this.dropzone.options[e]=o},removeAllFiles:function(e){this.dropzone.removeAllFiles(e)},processQueue:function(){var o=this,e=this.dropzone;this.isS3&&!this.wasQueueAutoProcess?this.getQueuedFiles().forEach(function(e){o.getSignedAndUploadToS3(e)}):this.dropzone.processQueue(),this.dropzone.on("success",function(){e.options.autoProcessQueue=!0}),this.dropzone.on("queuecomplete",function(){e.options.autoProcessQueue=!1})},init:function(){return this.dropzone.init()},destroy:function(){return this.dropzone.destroy()},updateTotalUploadProgress:function(){return this.dropzone.updateTotalUploadProgress()},getFallbackForm:function(){return this.dropzone.getFallbackForm()},getExistingFallback:function(){return this.dropzone.getExistingFallback()},setupEventListeners:function(){return this.dropzone.setupEventListeners()},removeEventListeners:function(){return this.dropzone.removeEventListeners()},disable:function(){return this.dropzone.disable()},enable:function(){return this.dropzone.enable()},filesize:function(e){return this.dropzone.filesize(e)},accept:function(e,o){return this.dropzone.accept(e,o)},addFile:function(e){return this.dropzone.addFile(e)},removeFile:function(e){this.dropzone.removeFile(e)},getAcceptedFiles:function(){return this.dropzone.getAcceptedFiles()},getRejectedFiles:function(){return this.dropzone.getRejectedFiles()},getFilesWithStatus:function(){return this.dropzone.getFilesWithStatus()},getQueuedFiles:function(){return this.dropzone.getQueuedFiles()},getUploadingFiles:function(){return this.dropzone.getUploadingFiles()},getAddedFiles:function(){return this.dropzone.getAddedFiles()},getActiveFiles:function(){return this.dropzone.getActiveFiles()},getSignedAndUploadToS3:function(o){var n=this,e=t.sendFile(o,this.awss3,this.isS3OverridesServerPropagation);this.isS3OverridesServerPropagation?e.then(function(){setTimeout(function(){return n.dropzone.processFile(o)})}):e.then(function(e){e.success?(o.s3ObjectLocation=e.message,setTimeout(function(){return n.dropzone.processFile(o)}),n.$emit("vdropzone-s3-upload-success",e.message)):void 0!==e.message?n.$emit("vdropzone-s3-upload-error",e.message):n.$emit("vdropzone-s3-upload-error","Network Error : Could not send request to AWS. (Maybe CORS error)")}),e.catch(function(e){alert(e)})},setAWSSigningURL:function(e){this.isS3&&(this.awss3.signingURL=e)}},mounted:function(){if(!this.$isServer||!this.hasBeenMounted){this.hasBeenMounted=!0;var e=require("dropzone");e.autoDiscover=!1,this.dropzone=new e(this.$refs.dropzoneElement,this.dropzoneSettings);var i=this;this.dropzone.on("thumbnail",function(e,o){i.$emit("vdropzone-thumbnail",e,o)}),this.dropzone.on("addedfile",function(o){i.duplicateCheck&&this.files.length&&this.files.forEach(function(e){e.name===o.name&&(this.removeFile(o),i.$emit("duplicate-file",o))},this),i.$emit("vdropzone-file-added",o),i.isS3&&i.wasQueueAutoProcess&&i.getSignedAndUploadToS3(o)}),this.dropzone.on("addedfiles",function(e){i.$emit("vdropzone-files-added",e)}),this.dropzone.on("removedfile",function(e){i.$emit("vdropzone-removed-file",e),e.manuallyAdded&&i.dropzone.options.maxFiles++}),this.dropzone.on("success",function(e,o){if(i.$emit("vdropzone-success",e,o),i.isS3){if(i.isS3OverridesServerPropagation){var n=(new window.DOMParser).parseFromString(o,"text/xml").firstChild.children[0].innerHTML;i.$emit("vdropzone-s3-upload-success",n)}i.wasQueueAutoProcess&&i.setOption("autoProcessQueue",!1)}}),this.dropzone.on("successmultiple",function(e,o){i.$emit("vdropzone-success-multiple",e,o)}),this.dropzone.on("error",function(e,o,n){i.$emit("vdropzone-error",e,o,n),this.isS3&&i.$emit("vdropzone-s3-upload-error")}),this.dropzone.on("errormultiple",function(e,o,n){i.$emit("vdropzone-error-multiple",e,o,n)}),this.dropzone.on("sending",function(e,o,n){if(i.isS3)if(i.isS3OverridesServerPropagation){var t=e.s3Signature;Object.keys(t).forEach(function(e){n.append(e,t[e])})}else n.append("s3ObjectLocation",e.s3ObjectLocation);i.$emit("vdropzone-sending",e,o,n)}),this.dropzone.on("sendingmultiple",function(e,o,n){i.$emit("vdropzone-sending-multiple",e,o,n)}),this.dropzone.on("complete",function(e){i.$emit("vdropzone-complete",e)}),this.dropzone.on("completemultiple",function(e){i.$emit("vdropzone-complete-multiple",e)}),this.dropzone.on("canceled",function(e){i.$emit("vdropzone-canceled",e)}),this.dropzone.on("canceledmultiple",function(e){i.$emit("vdropzone-canceled-multiple",e)}),this.dropzone.on("maxfilesreached",function(e){i.$emit("vdropzone-max-files-reached",e)}),this.dropzone.on("maxfilesexceeded",function(e){i.$emit("vdropzone-max-files-exceeded",e)}),this.dropzone.on("processing",function(e){i.$emit("vdropzone-processing",e)}),this.dropzone.on("processing",function(e){i.$emit("vdropzone-processing",e)}),this.dropzone.on("processingmultiple",function(e){i.$emit("vdropzone-processing-multiple",e)}),this.dropzone.on("uploadprogress",function(e,o,n){i.$emit("vdropzone-upload-progress",e,o,n)}),this.dropzone.on("totaluploadprogress",function(e,o,n){i.$emit("vdropzone-total-upload-progress",e,o,n)}),this.dropzone.on("reset",function(){i.$emit("vdropzone-reset")}),this.dropzone.on("queuecomplete",function(){i.$emit("vdropzone-queue-complete")}),this.dropzone.on("drop",function(e){i.$emit("vdropzone-drop",e)}),this.dropzone.on("dragstart",function(e){i.$emit("vdropzone-drag-start",e)}),this.dropzone.on("dragend",function(e){i.$emit("vdropzone-drag-end",e)}),this.dropzone.on("dragenter",function(e){i.$emit("vdropzone-drag-enter",e)}),this.dropzone.on("dragover",function(e){i.$emit("vdropzone-drag-over",e)}),this.dropzone.on("dragleave",function(e){i.$emit("vdropzone-drag-leave",e)}),i.$emit("vdropzone-mounted")}},beforeDestroy:function(){this.destroyDropzone&&this.dropzone.destroy()}}});
//# sourceMappingURL=vue2Dropzone.js.map

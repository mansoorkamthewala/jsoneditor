!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Editor=e():t.Editor=e()}(window,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){t.exports=r(1)},function(t,e,r){"use strict";var n=r(2);r(3);function o(t){if(!(this instanceof o))throw new Error('Editor constructor called without "new".');this.create(t)}o.prototype.create=function(t){this.targetElement=t,this.wrapperDiv=n.createDomWithClass("wrapper row"),this.editorDiv=n.createDomWithClass("editor col-50"),this.displayDiv=n.createDomWithClass("display col-50"),this.wrapperDiv.appendChild(this.editorDiv),this.wrapperDiv.appendChild(this.displayDiv),this.targetElement.appendChild(this.wrapperDiv)},o.default=o,t.exports=o},function(t,e){e.createDomWithClass=function(t){var e=document.createElement("div");return e.setAttribute("class",t),e}},function(t,e){}])});
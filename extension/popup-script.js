!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);const o={"params:isActive":!0,"options:main":!1,"options:trends":!1,"options:debug":!1,"options:coldTime":600,"options:fitstCheckInterval":1e3,"options:secondCheckInterval":2e3,"options:checkInterval":5e3};let r=null;const c=1,a=.2,i=e=>{const t=document.querySelector(".options");if(!t)return;const n=e?c:a;t.style.opacity=n},s=async e=>{const{name:t,checked:n}=e.target;let c;"params:isActive"===t&&i(n);try{c=await chrome.storage.local.get(["config/1.0"])}catch(e){console.warn("changeParams: Can not get config/1.0"),console.error(e)}const a=c&&c["config/1.0"]||{},s={...o,...a,[t]:n};try{await chrome.storage.local.set({"config/1.0":s})}catch(e){console.warn("changeParams: Can not set config/1.0"),console.error(e)}(()=>{r&&clearTimeout(r);const e=document.querySelector(".warning");e&&(e.style.display="block",r=setTimeout(()=>{e.style.display="none"},5e3))})()};(async()=>{let e;try{e=await chrome.storage.local.get(["config/1.0"])}catch(e){console.warn("init: Can not get config/1.0"),console.error(e)}const t=e&&e["config/1.0"]||o;(e=>{const t=document.getElementsByTagName("input");Array.prototype.slice.call(t).forEach(t=>{const{name:n}=t;t.checked=!!e[n],t.addEventListener("change",s)})})(t),i(t["params:isActive"]),(()=>{const e=document.querySelector(".loader");if(!e)return;const{parentNode:t}=e;t&&t.removeChild(e)})()})()}]);
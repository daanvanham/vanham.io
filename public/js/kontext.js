!function(n){"use strict";function e(){function n(){["_","public"].forEach(t)}function e(n,t){return Object.keys(t).forEach(function(r){"object"==typeof t[r]&&t[r]?n[r]=e("object"==typeof n[r]?n[r]:{},t[r]):n[r]=t[r]}),n}function t(n){var t={};r[n]=function(n,r){return"string"==typeof n?(arguments.length>1&&(t[n]=r),t[n]):("object"==typeof n&&e(t,n),t)}}var r=this;r.combine=function(n){return e(e({},r["public"]()),n||{})},n()}function t(){function n(e,t,r){setTimeout(function(){return e.length&&e.shift().apply(null,t)!==!1?n(e,t,r):void r()},0)}var e=this,t=[];e.add=function(n,e,r){return t.push({type:n,handle:e,invoke:r||1/0}),e},e.remove=function(n,e){var r=[];return t=t.filter(function(t){return n&&t.type!==n||e&&t.handle!==e?!0:(r.push(t.handle),!1)}),r},e.list=function(n){return t.filter(function(e){return!n||"*"===n||e.type===n})},e.trigger=function(t,r,o){var i=e.list(t).map(function(n){return--n.invoke<=0&&e.remove(t,n.handle),n.invoke>=0?n.handle:!1}).filter(function(n){return"function"==typeof n});arguments.length<3&&"function"==typeof arguments[arguments.length-1]&&(o=r,r=[]),n(i,r instanceof Array?r:[r],function(){o&&o()})}}function r(){function e(){var e=n.MutationObserver||n.webkitMutationObserver||!1;e&&(o={observer:e,config:{characterData:!0,characterDataOldValue:!0}})}function t(n,e){var t=typeof n;switch(t){case"boolean":return!!e;case"number":return+e}return e}function r(n,e){var r=n(),o=t(r,e);o!==r&&n(o)}var o,i=this;i.monitor=function(n,e){o?new o.observer(function(n){n.forEach(function(n){r(e,n.target.nodeValue)})}).observe(n,o.config):n.addEventListener&&n.addEventListener("DOMCharacterDataModified",function(n){r(e,n.newValue)})},e()}function o(){function n(n){var e,t,r=[];if(3===n.nodeType)r.push(n);else for(e=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,null,!1);t=e.nextNode();)r.push(t);return r}function e(n){var t=n.nodeValue.match(/(\{\$?[a-z0-9_-]+(?::[^\}]+)?\})/i),r=t?0===t.index?n:n.splitText(t.index):null,o=t?r.splitText(t[1].length):null,i=[];return r&&(i.push(r),r.original=r.nodeValue),o&&(i=i.concat(e(o))),i}function t(t){var r=[];return n(t).forEach(function(n){r=r.concat(e(n))}),r}var r=this;r.placeholders=function(n,e){t(n).forEach(e)}}function i(){function n(){function e(n){return s.indexOf(n)>=0}function t(n,t){var r=l;return t||!e(n)&&!d.noquote.test(n)||(r=""),r+n+r}function r(n){return d.trailer.test(n)?r(n.substr(0,n.length-1)):n}function o(n,e){for(var r,o=[];e.length;)if(r=e.shift(),"\\"!==r[r.length-1]){if(r===n)break;o.push(r)}else d.escape.test(e[0])||(r=r.substr(0,r.length-1)),o.push(r),o.push(e.shift());return t(o.join(""))}function i(n){for(var e="";n.length;)e=u(e,n);return e}function u(n,e){var i=e.shift();switch(i){case" ":break;case"}":case"]":n=r(n)+i;break;case'"':case"'":n+=o(i,e);break;default:n+=t(i,":"===e[0])}return n}function a(n){var t,r=[];for(t=0;t<n.length;++t)0===r.length||e(n[t])||e(r[r.length-1])?r.push(n[t]):r[r.length-1]+=n[t];return r}function c(n,e){var t=":"===e?"{}":"[]",o=n.indexOf(e),i=2===(n.match(/"/g)||[]).length&&n.indexOf('"')<o&&n.lastIndexOf('"')>o;return i||n[0]===t[0]?n:t[0]+r(n)+t[1]}if("undefined"!=typeof n.prototype.__instance||!(this instanceof n))return n.prototype.__instance||new n;n.prototype.__instance=this;var f=this,s="'\":,{}[] ",l='"',d={escape:/["\\\/\b\f\n\r\t]/,noquote:/^(?:true|false|null|-?[0-9]+(?:\.[0-9]+)?)$/i,trailer:/[,]+$/};f.prepare=function(n){return"string"!=typeof n?"":i(a(n)).replace(/^.*?([:,]).*$/,c)},f.parse=function(n){var e=f.prepare(n);return e?JSON.parse(e):null}}function e(){r=new n}function t(n,e){var t,r,o=[];switch(e.nodeType){case 1:e.hasAttribute(n)&&o.push(e);case 9:case 11:for(t=e.querySelectorAll("["+n+"]"),r=0;r<t.length;++r)o.push(t[r])}return o}var r,o=this;o.find=function(n,e,o){t(n,e).forEach(function(e){o(e,r.parse(e.getAttribute(n)))})},e()}function u(){function u(){return a()?(O._({rAF:n.requestAnimationFrame||function(n){setTimeout(n,1e3/60)}}),O["public"]({greedy:!0,attribute:"data-kontext"}),k.add("ready",function(n){O._("ready",n||!0)},1),void document.addEventListener("DOMContentLoaded",function(){k.trigger("ready",[void 0,w])},!1)):setTimeout(function(){k.trigger("ready",["Unsupported browser"])},0)}function a(){var n=!0;return n=n&&"addEventListener"in document,n=n&&"defineProperties"in Object,n=n&&"getOwnPropertyDescriptor"in Object}function c(n,e){Object.keys(n).forEach(function(t,r){e(t,n[t],r)})}function f(n){return Array.prototype.slice.call(n)}function s(n,e,t,r,o){var i={enumerable:t};"boolean"==typeof o?(i.writable=o,i.value=r):(i.get=r,i.set=o),Object.defineProperty(n,e,i)}function l(n,e){var t=O._("extension")||{};return e&&(t[n]=e,O._("extension",t)),n in t?t[n]:function(){console.error('Kontext: Unknown extension "'+n+'"')}}function d(n){var e=new t;return s(n,"on",!0,e.add,!1),s(n,"off",!0,e.remove,!1),"object"==typeof n&&n.on("update",function(){k.trigger("update",f(arguments))}),e}function p(n,e){var t=""+e();n.filter(function(n){return t!==n.nodeValue}).forEach(function(n){n.nodeValue=t})}function h(n){var e;return"on"in n&&"off"in n||(c(n,function(t,r){var o;y(n,t)||(o=v(r,n,t),s(n,t,!0,o,o),o.on("update",function(){e.trigger("update",[n,t,r,n[t]])})),!r||"object"!=typeof r||r instanceof Array||(h(r),r.on("update",function(r,o,i,u){e.trigger("update",[n,t+"."+o,i,u])}))}),e=d(n),s(n,"delegation",!0,function(e){return y(n,e)},!1)),n}function g(n,e){n.forEach(function(t,r){"object"==typeof n[r]&&(n[r]=h(t,e.model,e.key),n[r].on("update",function(){e.emission.trigger("update",[e.model,e.key,e.value])}))})}function v(n,e,t){var r=function(n){var e=arguments.length>0;return e&&(o.value=n),o.emission.trigger(e?"update":"access",[o.model,o.key,o.value,n]),o.value},o={emission:d(r),element:[],value:n,model:e,key:t};return n instanceof Array&&(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"].forEach(function(e){var t;"function"==typeof n[e]&&(t=n[e],n[e]=function(){var e=t.apply(n,arguments);return g(n,o),o.emission.trigger("update",[o.model,o.key,o.value]),e})}),g(n,o)),r.scope=function(){!e&&arguments.length>0&&(e=arguments[0]),!t&&arguments.length>1&&(t=arguments[1])},r.element=function(){var n=f(arguments);return n.forEach(function(n){x.monitor(n,r)}),p(n,r),o.element=o.element.concat(n),o.element},o.emission.add("update",function(){O._("rAF")(function(){p(o.element,r)})}),r}function m(n){return"function"==typeof n&&"function"==typeof n.element}function y(n,e){var t,r=!1,o=e.split(".");return o.forEach(function(t,r,o){e=t,r<o.length-1&&(n=n[e])}),e in n&&(m(n[e])?r=n[e]:(t=Object.getOwnPropertyDescriptor(n,e),r=t.get)),r}function b(n,e){var t,r=O._("bindings")||[];if(!e){for(t=[n];t[t.length-1].parentNode;)t.push(t[t.length-1].parentNode);return r.filter(function(n){return t.indexOf(n.target)>=0}).map(function(n){return n.model}).filter(function(n,e,t){return e===t.indexOf(n)})}r.push({model:e,target:n}),O._("bindings",r)}var w=this,O=new e,k=new t,x=new r;w.defaults=function(n,e){return n&&O["public"](n,e),O["public"]()},w.ready=function(n){var e=O._("ready");return k.add("ready",n,1),void 0!==e&&k.trigger("ready",e!==!0?e:void 0),w},w.on=function(n,e){return k.add(n,e)},w.off=function(n,e){return k.remove(n,e)},w.extension=l,w.delegate=function(n){return v(n)},w.bind=function(){var n=f(arguments),e=h(n.shift()),t=n.length?n.pop():{};return"nodeType"in t&&(n.push(t),t={}),t=O.combine(t),n.length<=0&&n.push(document.body),n.forEach(function(n){b(n,e),(new i).find(t.attribute,n,function(n,t){c(t,function(t,r){var o=l(t);o(n,e,r,w)})}),(new o).placeholders(n,function(n){var r=n.nodeValue.substr(1,n.nodeValue.length-2).split(/:/),o=r.shift(),i=r.length?r.join(":"):"",u=y(e,o);u?(u.scope(e,o),u()||u(i)):t.greedy&&(u=v(i,e,o),s(e,o,!0,u,u)),u&&u.element(n)})}),e},w.bindings=function(n){return b(n||document.body)},u()}n.kontext=n.kontext||new u}(window);
kontext.extension("attribute",function(t,e,n){"use strict";function i(n,i){e[i]?t.setAttribute(n,e[i]):t.hasAttribute(n)&&t.removeAttribute(n)}var o=Object.keys(n);e.on("update",function(t,e){o.forEach(function(t){n[t]===e&&i(t,e)})}),o.forEach(function(t){i(t,n[t])})});
kontext.extension("css",function(n,s,c){"use strict";function e(c,e){var t=!!s[e];"classList"in n?n.classList[t?"add":"remove"](c):n.className=n.className.replace(new RegExp("(?:^|\\s+)"+e+"(\\s+|$)"),function(n,s){return s||""})+(t?" "+c:"")}var t=Object.keys(c);s.on("update",function(n,s){t.forEach(function(n){c[n]===s&&e(n,s)})}),t.forEach(function(n){e(n,c[n])})});
kontext.extension("each",function(n,t,e){"use strict";function o(n){var o;return["map","filter"].forEach(function(i){i in e&&(o=e[i]instanceof Array?e[i]:[e[i]],o.forEach(function(e){if("function"==typeof t[e])n=n[i](t[e]);else{if("function"!=typeof window[e])throw new Error(e+" is not a "+i+" function");n=n[i](window[e])}}))}),n}function i(n){var t=d.filter(function(t){return t.item===n});return t.length?t[0]:null}function r(n){var o,r=i(n);return r||(o=a.map(function(n){return n.cloneNode(!0)}),r={item:n,model:kontext.bind.apply(kontext,["object"==typeof n?n:{}].concat(o)),nodes:o},r.model.$index=null,r.model.$item=n,r.model.$parent=t[e],d.push(r)),r}function f(n,t){return n.length!==t.length||0!==n.filter(function(n,e){return t[e]!==n}).length}function c(){var i,c=[],a=t[l],d=!1;if("object"==typeof e&&(a=o(a),i=!0),(!u||f(u,a))&&(u=a.slice(),d=!0),d||i){for(a.forEach(function(n,t){var e=r(n);e.model.$index=t,c=c.concat(e.nodes)});n.lastChild;)n.removeChild(n.lastChild);c.forEach(function(t){n.appendChild(t)})}}var l,u,a=[],d=[];if("object"==typeof e){if(l=e.target||!1,!l)throw new Error('Missing target for "each"')}else l=e;for(;n.firstChild;)a.push(n.removeChild(n.firstChild).cloneNode(!0));t.on("update",function(n,t){t===l&&c()}),c()});
kontext.extension("event",function(n,t,e){"use strict";function o(e,o,c){n.addEventListener(e,function(n){var e=t.delegation(o),i=e?e():!1;e&&("function"==typeof i?i.apply(null,[n,t,o,c]):e(c))},!1)}function c(n,t){"object"==typeof t?(t instanceof Array?t:Object.keys(t)).forEach(function(e){o(n,e,e in t?t[e]:void 0)}):o(n,t)}Object.keys(e).forEach(function(n){c(n,e[n])})});
kontext.extension("input",function(e,t,n){"use strict";function o(e){return e.hasAttribute("type")?e.getAttribute("type"):u.test(e.nodeName)?"select-"+(e.multiple?"multiple":"one"):"text"}function i(t){return t in c||(c[t]={model:function(){a(e[t])},element:function(n,o){e[t]=n[o]}}),c[t]}function l(){var o="default"in n?{value:null,label:n["default"]}:!1,i=function(){var i=0;"options"in n&&n.options in t&&(o&&(e.options[i]=new Option(o.label,o.value),++i),e.options.length=i,"object"==typeof t[n.options]&&(t[n.options]instanceof Array?t[n.options].forEach(function(t,n){"object"==typeof t?e.options[n+i]=new Option(t.label||t.value||"",t.value||""):e.options[n+i]=new Option(t)}):Object.keys(t[n.options]).forEach(function(o,l){e.options[l+i]=new Option(t[n.options][o],o)})))},l=function(t){var n;for(n=0;n<e.options.length;++n)t instanceof Array?e.options[n].selected=t.indexOf(e.options[n].value)>=0:e.options[n].selected=e.options[n].value===t},s="options"in n?t.delegation(n.options):!1,a="value"in n?t.delegation(n.value):!1,u=a?a():null;a&&(u instanceof Array?e.setAttribute("multiple",""):e.removeAttribute("multiple"),e.addEventListener("change",function(){var o,i;if(e.options.length)if(u instanceof Array)for(o=0;o<e.options.length;++o)e.options[o].selected&&t[n.value].indexOf(e.options[o].value)<0?t[n.value].push(e.options[o].value):!e.options[o].selected&&(i=t[n.value].indexOf(e[o].value))>=0&&t[n.value].splice(i,1);else a(e.options[e.selectedIndex].value)},!1),a.on("update",function(e,t){l(e[t])})),(s||a)&&(i(),l(u))}var s,a,u=/^select/i,c={};switch(o(e)){case"checkbox":case"radio":s="checked";break;case"select":case"select-one":case"select-multiple":l();break;default:s="value"}s&&(a=t.delegation(n[s]),a&&(e.addEventListener("input",i(s).model,!1),e.addEventListener("change",i(s).model,!1),a.on("update",i(s).element),e[s]=a()))});
kontext.extension("text",function(e,t,i){"use strict";var n=e.firstChild&&3===e.firstChild.nodeType?e.firstChild:document.createTextNode(t[i]),r=t.delegation(i);r&&(n.parentNode!==e&&n!==e.firstChild&&e.insertBefore(n,e.firstChild),r.element(n))});
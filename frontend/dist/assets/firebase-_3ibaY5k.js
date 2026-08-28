var ph={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const af=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},D_=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const i=r[t++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=r[t++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=r[t++],o=r[t++],c=r[t++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const s=r[t++],o=r[t++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},cf={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<r.length;i+=3){const s=r[i],o=i+1<r.length,c=o?r[i+1]:0,u=i+2<r.length,h=u?r[i+2]:0,f=s>>2,p=(s&3)<<4|c>>4;let _=(c&15)<<2|h>>6,A=h&63;u||(A=64,o||(_=64)),n.push(t[f],t[p],t[_],t[A])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(af(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):D_(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<r.length;){const s=t[r.charAt(i++)],c=i<r.length?t[r.charAt(i)]:0;++i;const h=i<r.length?t[r.charAt(i)]:64;++i;const p=i<r.length?t[r.charAt(i)]:64;if(++i,s==null||c==null||h==null||p==null)throw new V_;const _=s<<2|c>>4;if(n.push(_),h!==64){const A=c<<4&240|h>>2;if(n.push(A),p!==64){const C=h<<6&192|p;n.push(C)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class V_ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const N_=function(r){const e=af(r);return cf.encodeByteArray(e,!0)},po=function(r){return N_(r).replace(/\./g,"")},uf=function(r){try{return cf.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function mo(r,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:r===void 0&&(r={});break;case Array:r=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!O_(t)||(r[t]=mo(r[t],e[t]));return r}function O_(r){return r!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x_=()=>lf().__FIREBASE_DEFAULTS__,L_=()=>{if(typeof process>"u"||typeof ph>"u")return;const r=ph.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},M_=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&uf(r[1]);return e&&JSON.parse(e)},Mc=()=>{try{return x_()||L_()||M_()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},hf=()=>{var r;return(r=Mc())===null||r===void 0?void 0:r.config},F_=r=>{var e;return(e=Mc())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B_(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",i=r.iat||0,s=r.sub||r.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},r);return[po(JSON.stringify(t)),po(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function q_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(fe())}function Fc(){var r;const e=(r=Mc())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function j_(){return typeof window<"u"||df()}function df(){return typeof WorkerGlobalScope<"u"&&typeof self<"u"&&self instanceof WorkerGlobalScope}function $_(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ff(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Uc(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function pf(){const r=fe();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function mf(){return!Fc()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Fi(){try{return typeof indexedDB=="object"}catch{return!1}}function z_(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G_="FirebaseError";class Ge extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=G_,Object.setPrototypeOf(this,Ge.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Hn.prototype.create)}}class Hn{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?K_(s,n):"Error",c=`${this.serviceName}: ${o} (${i}).`;return new Ge(i,c,n)}}function K_(r,e){return r.replace(W_,(t,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const W_=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mh(r,e){return Object.prototype.hasOwnProperty.call(r,e)}function H_(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Ui(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const i of t){if(!n.includes(i))return!1;const s=r[i],o=e[i];if(gh(s)&&gh(o)){if(!Ui(s,o))return!1}else if(s!==o)return!1}for(const i of n)if(!t.includes(i))return!1;return!0}function gh(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function mr(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[i,s]=n.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Ti(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function gf(r,e){const t=new Q_(r,e);return t.subscribe.bind(t)}class Q_{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");J_(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=Ba),i.error===void 0&&(i.error=Ba),i.complete===void 0&&(i.complete=Ba);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function J_(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Ba(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(r){return r&&r._delegate?r._delegate:r}class It{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const En="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new U_;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&n.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Z_(e))try{this.getOrInitializeService({instanceIdentifier:En})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});n.resolve(s)}catch{}}}}clearInstance(e=En){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=En){return this.instances.has(e)}getOptions(e=En){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);n===c&&o.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),s=(n=this.onInitCallbacks.get(i))!==null&&n!==void 0?n:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:X_(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=En){return this.component?this.component.multipleInstances?e:En:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function X_(r){return r===En?void 0:r}function Z_(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Y_(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bc=[];var H;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(H||(H={}));const yf={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},ey=H.INFO,ty={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},ny=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),i=ty[e];if(i)console[i](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class xo{constructor(e){this.name=e,this._logLevel=ey,this._logHandler=ny,this._userLogHandler=null,Bc.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?yf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}function ry(r){Bc.forEach(e=>{e.setLogLevel(r)})}function iy(r,e){for(const t of Bc){let n=null;e&&e.level&&(n=yf[e.level]),r===null?t.userLogHandler=null:t.userLogHandler=(i,s,...o)=>{const c=o.map(u=>{if(u==null)return null;if(typeof u=="string")return u;if(typeof u=="number"||typeof u=="boolean")return u.toString();if(u instanceof Error)return u.message;try{return JSON.stringify(u)}catch{return null}}).filter(u=>u).join(" ");s>=(n??i.logLevel)&&r({level:H[s].toLowerCase(),message:c,args:o,type:i.name})}}}const sy=(r,e)=>e.some(t=>r instanceof t);let _h,yh;function oy(){return _h||(_h=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ay(){return yh||(yh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const If=new WeakMap,nc=new WeakMap,vf=new WeakMap,qa=new WeakMap,qc=new WeakMap;function cy(r){const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("success",s),r.removeEventListener("error",o)},s=()=>{t(Xt(r.result)),i()},o=()=>{n(r.error),i()};r.addEventListener("success",s),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&If.set(t,r)}).catch(()=>{}),qc.set(e,r),e}function uy(r){if(nc.has(r))return;const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("complete",s),r.removeEventListener("error",o),r.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",s),r.addEventListener("error",o),r.addEventListener("abort",o)});nc.set(r,e)}let rc={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return nc.get(r);if(e==="objectStoreNames")return r.objectStoreNames||vf.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Xt(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function ly(r){rc=r(rc)}function hy(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(ja(this),e,...t);return vf.set(n,e.sort?e.sort():[e]),Xt(n)}:ay().includes(r)?function(...e){return r.apply(ja(this),e),Xt(If.get(this))}:function(...e){return Xt(r.apply(ja(this),e))}}function dy(r){return typeof r=="function"?hy(r):(r instanceof IDBTransaction&&uy(r),sy(r,oy())?new Proxy(r,rc):r)}function Xt(r){if(r instanceof IDBRequest)return cy(r);if(qa.has(r))return qa.get(r);const e=dy(r);return e!==r&&(qa.set(r,e),qc.set(e,r)),e}const ja=r=>qc.get(r);function fy(r,e,{blocked:t,upgrade:n,blocking:i,terminated:s}={}){const o=indexedDB.open(r,e),c=Xt(o);return n&&o.addEventListener("upgradeneeded",u=>{n(Xt(o.result),u.oldVersion,u.newVersion,Xt(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const py=["get","getKey","getAll","getAllKeys","count"],my=["put","add","delete","clear"],$a=new Map;function Ih(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if($a.get(e))return $a.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,i=my.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(i||py.includes(t)))return;const s=async function(o,...c){const u=this.transaction(o,i?"readwrite":"readonly");let h=u.store;return n&&(h=h.index(c.shift())),(await Promise.all([h[t](...c),i&&u.done]))[0]};return $a.set(e,s),s}ly(r=>({...r,get:(e,t,n)=>Ih(e,t)||r.get(e,t,n),has:(e,t)=>!!Ih(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(_y(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function _y(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const go="@firebase/app",ic="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt=new xo("@firebase/app"),yy="@firebase/app-compat",Iy="@firebase/analytics-compat",vy="@firebase/analytics",wy="@firebase/app-check-compat",Ty="@firebase/app-check",Ey="@firebase/auth",Ay="@firebase/auth-compat",by="@firebase/database",Ry="@firebase/data-connect",Py="@firebase/database-compat",Sy="@firebase/functions",Cy="@firebase/functions-compat",ky="@firebase/installations",Dy="@firebase/installations-compat",Vy="@firebase/messaging",Ny="@firebase/messaging-compat",Oy="@firebase/performance",xy="@firebase/performance-compat",Ly="@firebase/remote-config",My="@firebase/remote-config-compat",Fy="@firebase/storage",Uy="@firebase/storage-compat",By="@firebase/firestore",qy="@firebase/vertexai-preview",jy="@firebase/firestore-compat",$y="firebase",zy="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en="[DEFAULT]",Gy={[go]:"fire-core",[yy]:"fire-core-compat",[vy]:"fire-analytics",[Iy]:"fire-analytics-compat",[Ty]:"fire-app-check",[wy]:"fire-app-check-compat",[Ey]:"fire-auth",[Ay]:"fire-auth-compat",[by]:"fire-rtdb",[Ry]:"fire-data-connect",[Py]:"fire-rtdb-compat",[Sy]:"fire-fn",[Cy]:"fire-fn-compat",[ky]:"fire-iid",[Dy]:"fire-iid-compat",[Vy]:"fire-fcm",[Ny]:"fire-fcm-compat",[Oy]:"fire-perf",[xy]:"fire-perf-compat",[Ly]:"fire-rc",[My]:"fire-rc-compat",[Fy]:"fire-gcs",[Uy]:"fire-gcs-compat",[By]:"fire-fst",[jy]:"fire-fst-compat",[qy]:"fire-vertex","fire-js":"fire-js",[$y]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tn=new Map,Tr=new Map,Er=new Map;function Bi(r,e){try{r.container.addComponent(e)}catch(t){Dt.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function wf(r,e){r.container.addOrOverwriteComponent(e)}function nn(r){const e=r.name;if(Er.has(e))return Dt.debug(`There were multiple attempts to register component ${e}.`),!1;Er.set(e,r);for(const t of tn.values())Bi(t,r);for(const t of Tr.values())Bi(t,r);return!0}function Tf(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Ky(r,e,t=en){Tf(r,e).clearInstance(t)}function Ef(r){return r.options!==void 0}function me(r){return r.settings!==void 0}function Wy(){Er.clear()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},st=new Hn("app","Firebase",Hy);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Af=class{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new It("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw st.create("app-deleted",{appName:this._name})}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy extends Af{constructor(e,t,n,i){const s=t.automaticDataCollectionEnabled!==void 0?t.automaticDataCollectionEnabled:!1,o={name:n,automaticDataCollectionEnabled:s};if(e.apiKey!==void 0)super(e,o,i);else{const c=e;super(c.options,o,i)}this._serverConfig=Object.assign({automaticDataCollectionEnabled:s},t),this._finalizationRegistry=null,typeof FinalizationRegistry<"u"&&(this._finalizationRegistry=new FinalizationRegistry(()=>{this.automaticCleanup()})),this._refCount=0,this.incRefCount(this._serverConfig.releaseOnDeref),this._serverConfig.releaseOnDeref=void 0,t.releaseOnDeref=void 0,ct(go,ic,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(e){this.isDeleted||(this._refCount++,e!==void 0&&this._finalizationRegistry!==null&&this._finalizationRegistry.register(e,this))}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){$c(this)}get settings(){return this.checkDestroyed(),this._serverConfig}checkDestroyed(){if(this.isDeleted)throw st.create("server-app-deleted")}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn=zy;function jc(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:en,automaticDataCollectionEnabled:!1},e),i=n.name;if(typeof i!="string"||!i)throw st.create("bad-app-name",{appName:String(i)});if(t||(t=hf()),!t)throw st.create("no-options");const s=tn.get(i);if(s){if(Ui(t,s.options)&&Ui(n,s.config))return s;throw st.create("duplicate-app",{appName:i})}const o=new _f(i);for(const u of Er.values())o.addComponent(u);const c=new Af(t,n,o);return tn.set(i,c),c}function Jy(r,e){if(j_()&&!df())throw st.create("invalid-server-app-environment");e.automaticDataCollectionEnabled===void 0&&(e.automaticDataCollectionEnabled=!1);let t;Ef(r)?t=r.options:t=r;const n=Object.assign(Object.assign({},e),t);n.releaseOnDeref!==void 0&&delete n.releaseOnDeref;const i=h=>[...h].reduce((f,p)=>Math.imul(31,f)+p.charCodeAt(0)|0,0);if(e.releaseOnDeref!==void 0&&typeof FinalizationRegistry>"u")throw st.create("finalization-registry-not-supported",{});const s=""+i(JSON.stringify(n)),o=Tr.get(s);if(o)return o.incRefCount(e.releaseOnDeref),o;const c=new _f(s);for(const h of Er.values())c.addComponent(h);const u=new Qy(t,e,s,c);return Tr.set(s,u),u}function Yy(r=en){const e=tn.get(r);if(!e&&r===en&&hf())return jc();if(!e)throw st.create("no-app",{appName:r});return e}function Xy(){return Array.from(tn.values())}async function $c(r){let e=!1;const t=r.name;tn.has(t)?(e=!0,tn.delete(t)):Tr.has(t)&&r.decRefCount()<=0&&(Tr.delete(t),e=!0),e&&(await Promise.all(r.container.getProviders().map(n=>n.delete())),r.isDeleted=!0)}function ct(r,e,t){var n;let i=(n=Gy[r])!==null&&n!==void 0?n:r;t&&(i+=`-${t}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&c.push("and"),o&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Dt.warn(c.join(" "));return}nn(new It(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}function bf(r,e){if(r!==null&&typeof r!="function")throw st.create("invalid-log-argument");iy(r,e)}function Rf(r){ry(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zy="firebase-heartbeat-database",eI=1,qi="firebase-heartbeat-store";let za=null;function Pf(){return za||(za=fy(Zy,eI,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(qi)}catch(t){console.warn(t)}}}}).catch(r=>{throw st.create("idb-open",{originalErrorMessage:r.message})})),za}async function tI(r){try{const t=(await Pf()).transaction(qi),n=await t.objectStore(qi).get(Sf(r));return await t.done,n}catch(e){if(e instanceof Ge)Dt.warn(e.message);else{const t=st.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Dt.warn(t.message)}}}async function vh(r,e){try{const n=(await Pf()).transaction(qi,"readwrite");await n.objectStore(qi).put(e,Sf(r)),await n.done}catch(t){if(t instanceof Ge)Dt.warn(t.message);else{const n=st.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Dt.warn(n.message)}}}function Sf(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nI=1024,rI=30*24*60*60*1e3;class iI{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new oI(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=wh();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const c=new Date(o.date).valueOf();return Date.now()-c<=rI}),this._storage.overwrite(this._heartbeatsCache))}catch(n){Dt.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=wh(),{heartbeatsToSend:n,unsentEntries:i}=sI(this._heartbeatsCache.heartbeats),s=po(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Dt.warn(t),""}}}function wh(){return new Date().toISOString().substring(0,10)}function sI(r,e=nI){const t=[];let n=r.slice();for(const i of r){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Th(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Th(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class oI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Fi()?z_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await tI(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return vh(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return vh(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Th(r){return po(JSON.stringify({version:2,heartbeats:r})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aI(r){nn(new It("platform-logger",e=>new gy(e),"PRIVATE")),nn(new It("heartbeat",e=>new iI(e),"PRIVATE")),ct(go,ic,r),ct(go,ic,"esm2017"),ct("fire-js","")}aI("");const cI=Object.freeze(Object.defineProperty({__proto__:null,FirebaseError:Ge,SDK_VERSION:dn,_DEFAULT_ENTRY_NAME:en,_addComponent:Bi,_addOrOverwriteComponent:wf,_apps:tn,_clearComponents:Wy,_components:Er,_getProvider:Tf,_isFirebaseApp:Ef,_isFirebaseServerApp:me,_registerComponent:nn,_removeServiceInstance:Ky,_serverApps:Tr,deleteApp:$c,getApp:Yy,getApps:Xy,initializeApp:jc,initializeServerApp:Jy,onLog:bf,registerVersion:ct,setLogLevel:Rf},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uI{constructor(e,t){this._delegate=e,this.firebase=t,Bi(e,new It("app-compat",()=>this,"PUBLIC")),this.container=e.container}get automaticDataCollectionEnabled(){return this._delegate.automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this._delegate.automaticDataCollectionEnabled=e}get name(){return this._delegate.name}get options(){return this._delegate.options}delete(){return new Promise(e=>{this._delegate.checkDestroyed(),e()}).then(()=>(this.firebase.INTERNAL.removeApp(this.name),$c(this._delegate)))}_getService(e,t=en){var n;this._delegate.checkDestroyed();const i=this._delegate.container.getProvider(e);return!i.isInitialized()&&((n=i.getComponent())===null||n===void 0?void 0:n.instantiationMode)==="EXPLICIT"&&i.initialize(),i.getImmediate({identifier:t})}_removeServiceInstance(e,t=en){this._delegate.container.getProvider(e).clearInstance(t)}_addComponent(e){Bi(this._delegate,e)}_addOrOverwriteComponent(e){wf(this._delegate,e)}toJSON(){return{name:this.name,automaticDataCollectionEnabled:this.automaticDataCollectionEnabled,options:this.options}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lI={"no-app":"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance."},Eh=new Hn("app-compat","Firebase",lI);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hI(r){const e={},t={__esModule:!0,initializeApp:s,app:i,registerVersion:ct,setLogLevel:Rf,onLog:bf,apps:null,SDK_VERSION:dn,INTERNAL:{registerComponent:c,removeApp:n,useAsService:u,modularAPIs:cI}};t.default=t,Object.defineProperty(t,"apps",{get:o});function n(h){delete e[h]}function i(h){if(h=h||en,!mh(e,h))throw Eh.create("no-app",{appName:h});return e[h]}i.App=r;function s(h,f={}){const p=jc(h,f);if(mh(e,p.name))return e[p.name];const _=new r(p,t);return e[p.name]=_,_}function o(){return Object.keys(e).map(h=>e[h])}function c(h){const f=h.name,p=f.replace("-compat","");if(nn(h)&&h.type==="PUBLIC"){const _=(A=i())=>{if(typeof A[p]!="function")throw Eh.create("invalid-app-argument",{appName:f});return A[p]()};h.serviceProps!==void 0&&mo(_,h.serviceProps),t[p]=_,r.prototype[p]=function(...A){return this._getService.bind(this,f).apply(this,h.multipleInstances?A:[])}}return h.type==="PUBLIC"?t[p]:null}function u(h,f){return f==="serverAuth"?null:f}return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cf(){const r=hI(uI);r.INTERNAL=Object.assign(Object.assign({},r.INTERNAL),{createFirebaseNamespace:Cf,extendNamespace:e,createSubscribe:gf,ErrorFactory:Hn,deepExtend:mo});function e(t){mo(r,t)}return r}const dI=Cf();/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ah=new xo("@firebase/app-compat"),fI="@firebase/app-compat",pI="0.2.43";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mI(r){ct(fI,pI,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */try{const r=lf();if(r.firebase!==void 0){Ah.warn(`
      Warning: Firebase is already defined in the global scope. Please make sure
      Firebase library is only loaded once.
    `);const e=r.firebase.SDK_VERSION;e&&e.indexOf("LITE")>=0&&Ah.warn(`
        Warning: You are trying to load Firebase while using Firebase Performance standalone script.
        You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.
        `)}}catch{}const cs=dI;mI();var gI="firebase",_I="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */cs.registerVersion(gI,_I,"app-compat");function zc(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(r);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(r,n[i])&&(t[n[i]]=r[n[i]]);return t}const pi={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",TWITTER:"twitter.com"},sr={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yI(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements."}}function kf(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const II=yI,vI=kf,Df=new Hn("auth","Firebase",kf());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _o=new xo("@firebase/auth");function wI(r,...e){_o.logLevel<=H.WARN&&_o.warn(`Auth (${dn}): ${r}`,...e)}function to(r,...e){_o.logLevel<=H.ERROR&&_o.error(`Auth (${dn}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(r,...e){throw Kc(r,...e)}function be(r,...e){return Kc(r,...e)}function Gc(r,e,t){const n=Object.assign(Object.assign({},vI()),{[e]:t});return new Hn("auth","Firebase",n).create(e,{appName:r.name})}function Ce(r){return Gc(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Br(r,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&Oe(r,"argument-error"),Gc(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Kc(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Df.create(r,...e)}function O(r,e,...t){if(!r)throw Kc(e,...t)}function pt(r){const e="INTERNAL ASSERTION FAILED: "+r;throw to(e),new Error(e)}function ut(r,e){r||pt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ji(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function Wc(){return bh()==="http:"||bh()==="https:"}function bh(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Wc()||ff()||"connection"in navigator)?navigator.onLine:!0}function EI(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us{constructor(e,t){this.shortDelay=e,this.longDelay=t,ut(t>e,"Short delay should be less than long delay!"),this.isMobile=q_()||Uc()}get(){return TI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hc(r,e){ut(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;pt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;pt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;pt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI=new us(3e4,6e4);function ye(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Ie(r,e,t,n,i={}){return Nf(r,i,async()=>{let s={},o={};n&&(e==="GET"?o=n:s={body:JSON.stringify(n)});const c=Ur(Object.assign({key:r.config.apiKey},o)).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const h=Object.assign({method:e,headers:u},s);return $_()||(h.referrerPolicy="no-referrer"),Vf.fetch()(Of(r,r.config.apiHost,t,c),h)})}async function Nf(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},AI),e);try{const i=new PI(r),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Ei(r,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const c=s.ok?o.errorMessage:o.error.message,[u,h]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ei(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Ei(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw Ei(r,"user-disabled",o);const f=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Gc(r,f,h);Oe(r,f)}}catch(i){if(i instanceof Ge)throw i;Oe(r,"network-request-failed",{message:String(i)})}}async function xt(r,e,t,n,i={}){const s=await Ie(r,e,t,n,i);return"mfaPendingCredential"in s&&Oe(r,"multi-factor-auth-required",{_serverResponse:s}),s}function Of(r,e,t,n){const i=`${e}${t}?${n}`;return r.config.emulator?Hc(r.config,i):`${r.config.apiScheme}://${i}`}function RI(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class PI{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(be(this.auth,"network-request-failed")),bI.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Ei(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const i=be(r,e,n);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rh(r){return r!==void 0&&r.getResponse!==void 0}function Ph(r){return r!==void 0&&r.enterprise!==void 0}class SI{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return RI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function CI(r){return(await Ie(r,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function kI(r,e){return Ie(r,"GET","/v2/recaptchaConfig",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DI(r,e){return Ie(r,"POST","/v1/accounts:delete",e)}async function VI(r,e){return Ie(r,"POST","/v1/accounts:update",e)}async function xf(r,e){return Ie(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ci(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function NI(r,e=!1){const t=j(r),n=await t.getIdToken(e),i=Lo(n);O(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:n,authTime:Ci(Ga(i.auth_time)),issuedAtTime:Ci(Ga(i.iat)),expirationTime:Ci(Ga(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Ga(r){return Number(r)*1e3}function Lo(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return to("JWT malformed, contained fewer than 3 sections"),null;try{const i=uf(t);return i?JSON.parse(i):(to("Failed to decode base64 JWT payload"),null)}catch(i){return to("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Sh(r){const e=Lo(r);return O(e,"internal-error"),O(typeof e.exp<"u","internal-error"),O(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vt(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof Ge&&OI(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function OI({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sc{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ci(this.lastLoginAt),this.creationTime=Ci(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $i(r){var e;const t=r.auth,n=await r.getIdToken(),i=await Vt(r,xf(t,{idToken:n}));O(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];r._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Lf(s.providerUserInfo):[],c=MI(r.providerData,o),u=r.isAnonymous,h=!(r.email&&s.passwordHash)&&!(c!=null&&c.length),f=u?h:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new sc(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(r,p)}async function LI(r){const e=j(r);await $i(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function MI(r,e){return[...r.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function Lf(r){return r.map(e=>{var{providerId:t}=e,n=zc(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function FI(r,e){const t=await Nf(r,{},async()=>{const n=Ur({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=r.config,o=Of(r,i,"/v1/token",`key=${s}`),c=await r._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",Vf.fetch()(o,{method:"POST",headers:c,body:n})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function UI(r,e){return Ie(r,"POST","/v2/accounts:revokeToken",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){O(e.idToken,"internal-error"),O(typeof e.idToken<"u","internal-error"),O(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Sh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){O(e.length!==0,"internal-error");const t=Sh(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(O(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:i,expiresIn:s}=await FI(e,t);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:i,expirationTime:s}=t,o=new gr;return n&&(O(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),i&&(O(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(O(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new gr,this.toJSON())}_performRefresh(){return pt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(r,e){O(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Pt{constructor(e){var{uid:t,auth:n,stsTokenManager:i}=e,s=zc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new xI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new sc(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Vt(this,this.stsTokenManager.getToken(this.auth,e));return O(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return NI(this,e)}reload(){return LI(this)}_assign(e){this!==e&&(O(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Pt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){O(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await $i(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(me(this.auth.app))return Promise.reject(Ce(this.auth));const e=await this.getIdToken();return await Vt(this,DI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,i,s,o,c,u,h,f;const p=(n=t.displayName)!==null&&n!==void 0?n:void 0,_=(i=t.email)!==null&&i!==void 0?i:void 0,A=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,C=(o=t.photoURL)!==null&&o!==void 0?o:void 0,N=(c=t.tenantId)!==null&&c!==void 0?c:void 0,V=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,$=(h=t.createdAt)!==null&&h!==void 0?h:void 0,z=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:q,emailVerified:Y,isAnonymous:te,providerData:W,stsTokenManager:v}=t;O(q&&v,e,"internal-error");const g=gr.fromJSON(this.name,v);O(typeof q=="string",e,"internal-error"),zt(p,e.name),zt(_,e.name),O(typeof Y=="boolean",e,"internal-error"),O(typeof te=="boolean",e,"internal-error"),zt(A,e.name),zt(C,e.name),zt(N,e.name),zt(V,e.name),zt($,e.name),zt(z,e.name);const I=new Pt({uid:q,auth:e,email:_,emailVerified:Y,displayName:p,isAnonymous:te,photoURL:C,phoneNumber:A,tenantId:N,stsTokenManager:g,createdAt:$,lastLoginAt:z});return W&&Array.isArray(W)&&(I.providerData=W.map(w=>Object.assign({},w))),V&&(I._redirectEventId=V),I}static async _fromIdTokenResponse(e,t,n=!1){const i=new gr;i.updateFromServerResponse(t);const s=new Pt({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await $i(s),s}static async _fromGetAccountInfoResponse(e,t,n){const i=t.users[0];O(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Lf(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),c=new gr;c.updateFromIdToken(n);const u=new Pt({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new sc(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch=new Map;function nt(r){ut(r instanceof Function,"Expected a class definition");let e=Ch.get(r);return e?(ut(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Ch.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Mf.type="NONE";const Ar=Mf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nn(r,e,t){return`firebase:${r}:${e}:${t}`}class _r{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=Nn(this.userKey,i.apiKey,s),this.fullPersistenceKey=Nn("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Pt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new _r(nt(Ar),e,n);const i=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||nt(Ar);const o=Nn(n,e.config.apiKey,e.name);let c=null;for(const h of t)try{const f=await h._get(o);if(f){const p=Pt._fromJSON(e,f);h!==s&&(c=p),s=h;break}}catch{}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new _r(s,e,n):(s=u[0],c&&await s._set(o,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==s)try{await h._remove(o)}catch{}})),new _r(s,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kh(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(qf(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ff(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(jf(e))return"Blackberry";if($f(e))return"Webos";if(Uf(e))return"Safari";if((e.includes("chrome/")||Bf(e))&&!e.includes("edge/"))return"Chrome";if(ls(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function Ff(r=fe()){return/firefox\//i.test(r)}function Uf(r=fe()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Bf(r=fe()){return/crios\//i.test(r)}function qf(r=fe()){return/iemobile/i.test(r)}function ls(r=fe()){return/android/i.test(r)}function jf(r=fe()){return/blackberry/i.test(r)}function $f(r=fe()){return/webos/i.test(r)}function hs(r=fe()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function BI(r=fe()){return/(iPad|iPhone|iPod).*OS 7_\d/i.test(r)||/(iPad|iPhone|iPod).*OS 8_\d/i.test(r)}function qI(r=fe()){var e;return hs(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function jI(){return pf()&&document.documentMode===10}function zf(r=fe()){return hs(r)||ls(r)||$f(r)||jf(r)||/windows phone/i.test(r)||qf(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gf(r,e=[]){let t;switch(r){case"Browser":t=kh(fe());break;case"Worker":t=`${kh(fe())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${dn}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $I{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=s=>new Promise((o,c)=>{try{const u=e(s);o(u)}catch(u){c(u)}});n.onAbort=t,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zI(r,e={}){return Ie(r,"GET","/v2/passwordPolicy",ye(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GI=6;class KI{constructor(e){var t,n,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:GI,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,i,s,o,c;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(n=u.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WI{constructor(e,t,n,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Dh(this),this.idTokenSubscription=new Dh(this),this.beforeStateQueue=new $I(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Df,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=nt(t)),this._initializationPromise=this.queue(async()=>{var n,i;if(!this._deleted&&(this.persistenceManager=await _r.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await xf(this,{idToken:e}),n=await Pt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(me(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return O(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await $i(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=EI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(me(this.app))return Promise.reject(Ce(this));const t=e?j(e):null;return t&&O(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&O(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return me(this.app)?Promise.reject(Ce(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return me(this.app)?Promise.reject(Ce(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(nt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await zI(this),t=new KI(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Hn("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await UI(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&nt(e)||this._popupRedirectResolver;O(t,this,"argument-error"),this.redirectPersistenceManager=await _r.create(this,[nt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(O(c,this,"internal-error"),c.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,n,i);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return O(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Gf(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&wI(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function ge(r){return j(r)}class Dh{constructor(e){this.auth=e,this.observer=null,this.addObserver=gf(t=>this.observer=t)}get next(){return O(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ds={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function HI(r){ds=r}function Qc(r){return ds.loadJS(r)}function QI(){return ds.recaptchaV2Script}function JI(){return ds.recaptchaEnterpriseScript}function YI(){return ds.gapiScript}function Kf(r){return`__${r}${Math.floor(Math.random()*1e6)}`}const XI="recaptcha-enterprise",ZI="NO_RECAPTCHA";class ev{constructor(e){this.type=XI,this.auth=ge(e)}async verify(e="verify",t=!1){async function n(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,c)=>{kI(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const h=new SI(u);return s.tenantId==null?s._agentRecaptchaConfig=h:s._tenantRecaptchaConfigs[s.tenantId]=h,o(h.siteKey)}}).catch(u=>{c(u)})})}function i(s,o,c){const u=window.grecaptcha;Ph(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(h=>{o(h)}).catch(()=>{o(ZI)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{n(this.auth).then(c=>{if(!t&&Ph(window.grecaptcha))i(c,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=JI();u.length!==0&&(u+=c),Qc(u).then(()=>{i(c,s,o)}).catch(h=>{o(h)})}}).catch(c=>{o(c)})})}}async function Vh(r,e,t,n=!1){const i=new ev(r);let s;try{s=await i.verify(t)}catch{s=await i.verify(t,!0)}const o=Object.assign({},e);return n?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function zi(r,e,t,n){var i;if(!((i=r._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Vh(r,e,t,t==="getOobCode");return n(r,s)}else return n(r,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Vh(r,e,t,t==="getOobCode");return n(r,o)}else return Promise.reject(s)})}function tv(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(nt);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function nv(r,e,t){const n=ge(r);O(n._canInitEmulator,n,"emulator-config-failed"),O(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const i=!!(t!=null&&t.disableWarnings),s=Wf(e),{host:o,port:c}=rv(e),u=c===null?"":`:${c}`;n.config.emulator={url:`${s}//${o}${u}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:o,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||iv()}function Wf(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function rv(r){const e=Wf(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(n);if(i){const s=i[1];return{host:s,port:Nh(n.substr(s.length+1))}}else{const[s,o]=n.split(":");return{host:s,port:Nh(o)}}}function Nh(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function iv(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return pt("not implemented")}_getIdTokenResponse(e){return pt("not implemented")}_linkToIdToken(e,t){return pt("not implemented")}_getReauthenticationResolver(e){return pt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hf(r,e){return Ie(r,"POST","/v1/accounts:resetPassword",ye(r,e))}async function sv(r,e){return Ie(r,"POST","/v1/accounts:update",e)}async function ov(r,e){return Ie(r,"POST","/v1/accounts:signUp",e)}async function av(r,e){return Ie(r,"POST","/v1/accounts:update",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cv(r,e){return xt(r,"POST","/v1/accounts:signInWithPassword",ye(r,e))}async function Mo(r,e){return Ie(r,"POST","/v1/accounts:sendOobCode",ye(r,e))}async function uv(r,e){return Mo(r,e)}async function lv(r,e){return Mo(r,e)}async function hv(r,e){return Mo(r,e)}async function dv(r,e){return Mo(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fv(r,e){return xt(r,"POST","/v1/accounts:signInWithEmailLink",ye(r,e))}async function pv(r,e){return xt(r,"POST","/v1/accounts:signInWithEmailLink",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi extends qr{constructor(e,t,n,i=null){super("password",n),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new Gi(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new Gi(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return zi(e,t,"signInWithPassword",cv);case"emailLink":return fv(e,{email:this._email,oobCode:this._password});default:Oe(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return zi(e,n,"signUpPassword",ov);case"emailLink":return pv(e,{idToken:t,email:this._email,oobCode:this._password});default:Oe(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kt(r,e){return xt(r,"POST","/v1/accounts:signInWithIdp",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mv="http://localhost";class vt extends qr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new vt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Oe("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i}=t,s=zc(t,["providerId","signInMethod"]);if(!n||!i)return null;const o=new vt(n,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return kt(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,kt(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,kt(e,t)}buildRequest(){const e={requestUri:mv,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ur(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gv(r,e){return Ie(r,"POST","/v1/accounts:sendVerificationCode",ye(r,e))}async function _v(r,e){return xt(r,"POST","/v1/accounts:signInWithPhoneNumber",ye(r,e))}async function yv(r,e){const t=await xt(r,"POST","/v1/accounts:signInWithPhoneNumber",ye(r,e));if(t.temporaryProof)throw Ei(r,"account-exists-with-different-credential",t);return t}const Iv={USER_NOT_FOUND:"user-not-found"};async function vv(r,e){const t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return xt(r,"POST","/v1/accounts:signInWithPhoneNumber",ye(r,t),Iv)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On extends qr{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new On({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new On({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return _v(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return yv(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return vv(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:i}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:i,temporaryProof:s}=e;return!n&&!t&&!i&&!s?null:new On({verificationId:t,verificationCode:n,phoneNumber:i,temporaryProof:s})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wv(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Tv(r){const e=mr(Ti(r)).link,t=e?mr(Ti(e)).deep_link_id:null,n=mr(Ti(r)).deep_link_id;return(n?mr(Ti(n)).link:null)||n||t||e||r}class Fo{constructor(e){var t,n,i,s,o,c;const u=mr(Ti(e)),h=(t=u.apiKey)!==null&&t!==void 0?t:null,f=(n=u.oobCode)!==null&&n!==void 0?n:null,p=wv((i=u.mode)!==null&&i!==void 0?i:null);O(h&&f&&p,"argument-error"),this.apiKey=h,this.operation=p,this.code=f,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=Tv(e);try{return new Fo(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(){this.providerId=fn.PROVIDER_ID}static credential(e,t){return Gi._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=Fo.parseLink(t);return O(n,"argument-error"),Gi._fromEmailAndCode(e,n.code,n.tenantId)}}fn.PROVIDER_ID="password";fn.EMAIL_PASSWORD_SIGN_IN_METHOD="password";fn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr extends Lt{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class yr extends jr{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return O("providerId"in t&&"signInMethod"in t,"argument-error"),vt._fromParams(t)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return O(e.idToken||e.accessToken,"argument-error"),vt._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return yr.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return yr.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:i,pendingToken:s,nonce:o,providerId:c}=e;if(!n&&!i&&!t&&!s||!c)return null;try{return new yr(c)._credential({idToken:t,accessToken:n,nonce:o,pendingToken:s})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt extends jr{constructor(){super("facebook.com")}static credential(e){return vt._fromParams({providerId:lt.PROVIDER_ID,signInMethod:lt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return lt.credentialFromTaggedObject(e)}static credentialFromError(e){return lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return lt.credential(e.oauthAccessToken)}catch{return null}}}lt.FACEBOOK_SIGN_IN_METHOD="facebook.com";lt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht extends jr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return vt._fromParams({providerId:ht.PROVIDER_ID,signInMethod:ht.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ht.credentialFromTaggedObject(e)}static credentialFromError(e){return ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return ht.credential(t,n)}catch{return null}}}ht.GOOGLE_SIGN_IN_METHOD="google.com";ht.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt extends jr{constructor(){super("github.com")}static credential(e){return vt._fromParams({providerId:dt.PROVIDER_ID,signInMethod:dt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dt.credentialFromTaggedObject(e)}static credentialFromError(e){return dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return dt.credential(e.oauthAccessToken)}catch{return null}}}dt.GITHUB_SIGN_IN_METHOD="github.com";dt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ev="http://localhost";class br extends qr{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){const t=this.buildRequest();return kt(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,kt(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,kt(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i,pendingToken:s}=t;return!n||!i||!s||n!==i?null:new br(n,s)}static _create(e,t){return new br(e,t)}buildRequest(){return{requestUri:Ev,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Av="saml.";class yo extends Lt{constructor(e){O(e.startsWith(Av),"argument-error"),super(e)}static credentialFromResult(e){return yo.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return yo.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=br.fromJSON(e);return O(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:n}=e;if(!t||!n)return null;try{return br._create(n,t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft extends jr{constructor(){super("twitter.com")}static credential(e,t){return vt._fromParams({providerId:ft.PROVIDER_ID,signInMethod:ft.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ft.credentialFromTaggedObject(e)}static credentialFromError(e){return ft.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return ft.credential(t,n)}catch{return null}}}ft.TWITTER_SIGN_IN_METHOD="twitter.com";ft.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qf(r,e){return xt(r,"POST","/v1/accounts:signUp",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,i=!1){const s=await Pt._fromIdTokenResponse(e,n,i),o=Oh(n);return new ot({user:s,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const i=Oh(n);return new ot({user:e,providerId:i,_tokenResponse:n,operationType:t})}}function Oh(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bv(r){var e;if(me(r.app))return Promise.reject(Ce(r));const t=ge(r);if(await t._initializationPromise,!((e=t.currentUser)===null||e===void 0)&&e.isAnonymous)return new ot({user:t.currentUser,providerId:null,operationType:"signIn"});const n=await Qf(t,{returnSecureToken:!0}),i=await ot._fromIdTokenResponse(t,"signIn",n,!0);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io extends Ge{constructor(e,t,n,i){var s;super(t.code,t.message),this.operationType=n,this.user=i,Object.setPrototypeOf(this,Io.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,i){return new Io(e,t,n,i)}}function Jf(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Io._fromErrorAndOperation(r,s,e,n):s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yf(r){return new Set(r.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rv(r,e){const t=j(r);await Uo(!0,t,e);const{providerUserInfo:n}=await VI(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),i=Yf(n||[]);return t.providerData=t.providerData.filter(s=>i.has(s.providerId)),i.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function Jc(r,e,t=!1){const n=await Vt(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return ot._forOperation(r,"link",n)}async function Uo(r,e,t){await $i(e);const n=Yf(e.providerData),i=r===!1?"provider-already-linked":"no-such-provider";O(n.has(t)===r,e.auth,i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xf(r,e,t=!1){const{auth:n}=r;if(me(n.app))return Promise.reject(Ce(n));const i="reauthenticate";try{const s=await Vt(r,Jf(n,i,e,r),t);O(s.idToken,n,"internal-error");const o=Lo(s.idToken);O(o,n,"internal-error");const{sub:c}=o;return O(r.uid===c,n,"user-mismatch"),ot._forOperation(r,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Oe(n,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zf(r,e,t=!1){if(me(r.app))return Promise.reject(Ce(r));const n="signIn",i=await Jf(r,n,e),s=await ot._fromIdTokenResponse(r,n,i);return t||await r._updateCurrentUser(s.user),s}async function Bo(r,e){return Zf(ge(r),e)}async function ep(r,e){const t=j(r);return await Uo(!1,t,e.providerId),Jc(t,e)}async function tp(r,e){return Xf(j(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pv(r,e){return xt(r,"POST","/v1/accounts:signInWithCustomToken",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sv(r,e){if(me(r.app))return Promise.reject(Ce(r));const t=ge(r),n=await Pv(t,{token:e,returnSecureToken:!0}),i=await ot._fromIdTokenResponse(t,"signIn",n);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fs{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?Yc._fromServerResponse(e,t):"totpInfo"in t?Xc._fromServerResponse(e,t):Oe(e,"internal-error")}}class Yc extends fs{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new Yc(t)}}class Xc extends fs{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Xc(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qo(r,e,t){var n;O(((n=t.url)===null||n===void 0?void 0:n.length)>0,r,"invalid-continue-uri"),O(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,r,"invalid-dynamic-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(O(t.iOS.bundleId.length>0,r,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(O(t.android.packageName.length>0,r,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zc(r){const e=ge(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Cv(r,e,t){const n=ge(r),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&qo(n,i,t),await zi(n,i,"getOobCode",lv)}async function kv(r,e,t){await Hf(j(r),{oobCode:e,newPassword:t}).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Zc(r),n})}async function Dv(r,e){await av(j(r),{oobCode:e})}async function np(r,e){const t=j(r),n=await Hf(t,{oobCode:e}),i=n.requestType;switch(O(i,t,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":O(n.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":O(n.mfaInfo,t,"internal-error");default:O(n.email,t,"internal-error")}let s=null;return n.mfaInfo&&(s=fs._fromServerResponse(ge(t),n.mfaInfo)),{data:{email:(n.requestType==="VERIFY_AND_CHANGE_EMAIL"?n.newEmail:n.email)||null,previousEmail:(n.requestType==="VERIFY_AND_CHANGE_EMAIL"?n.email:n.newEmail)||null,multiFactorInfo:s},operation:i}}async function Vv(r,e){const{data:t}=await np(j(r),e);return t.email}async function Nv(r,e,t){if(me(r.app))return Promise.reject(Ce(r));const n=ge(r),o=await zi(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Qf).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Zc(r),u}),c=await ot._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(c.user),c}function Ov(r,e,t){return me(r.app)?Promise.reject(Ce(r)):Bo(j(r),fn.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Zc(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xv(r,e,t){const n=ge(r),i={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function s(o,c){O(c.handleCodeInApp,n,"argument-error"),c&&qo(n,o,c)}s(i,t),await zi(n,i,"getOobCode",hv)}function Lv(r,e){const t=Fo.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function Mv(r,e,t){if(me(r.app))return Promise.reject(Ce(r));const n=j(r),i=fn.credentialWithLink(e,t||ji());return O(i._tenantId===(n.tenantId||null),n,"tenant-id-mismatch"),Bo(n,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fv(r,e){return Ie(r,"POST","/v1/accounts:createAuthUri",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uv(r,e){const t=Wc()?ji():"http://localhost",n={identifier:e,continueUri:t},{signinMethods:i}=await Fv(j(r),n);return i||[]}async function Bv(r,e){const t=j(r),i={requestType:"VERIFY_EMAIL",idToken:await r.getIdToken()};e&&qo(t.auth,i,e);const{email:s}=await uv(t.auth,i);s!==r.email&&await r.reload()}async function qv(r,e,t){const n=j(r),s={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await r.getIdToken(),newEmail:e};t&&qo(n.auth,s,t);const{email:o}=await dv(n.auth,s);o!==r.email&&await r.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jv(r,e){return Ie(r,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $v(r,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const n=j(r),s={idToken:await n.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await Vt(n,jv(n.auth,s));n.displayName=o.displayName||null,n.photoURL=o.photoUrl||null;const c=n.providerData.find(({providerId:u})=>u==="password");c&&(c.displayName=n.displayName,c.photoURL=n.photoURL),await n._updateTokensIfNecessary(o)}function zv(r,e){const t=j(r);return me(t.auth.app)?Promise.reject(Ce(t.auth)):rp(t,e,null)}function Gv(r,e){return rp(j(r),null,e)}async function rp(r,e,t){const{auth:n}=r,s={idToken:await r.getIdToken(),returnSecureToken:!0};e&&(s.email=e),t&&(s.password=t);const o=await Vt(r,sv(n,s));await r._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kv(r){var e,t;if(!r)return null;const{providerId:n}=r,i=r.rawUserInfo?JSON.parse(r.rawUserInfo):{},s=r.isNewUser||r.kind==="identitytoolkit#SignupNewUserResponse";if(!n&&(r!=null&&r.idToken)){const o=(t=(e=Lo(r.idToken))===null||e===void 0?void 0:e.firebase)===null||t===void 0?void 0:t.sign_in_provider;if(o){const c=o!=="anonymous"&&o!=="custom"?o:null;return new Ir(s,c)}}if(!n)return null;switch(n){case"facebook.com":return new Wv(s,i);case"github.com":return new Hv(s,i);case"google.com":return new Qv(s,i);case"twitter.com":return new Jv(s,i,r.screenName||null);case"custom":case"anonymous":return new Ir(s,null);default:return new Ir(s,n,i)}}class Ir{constructor(e,t,n={}){this.isNewUser=e,this.providerId=t,this.profile=n}}class ip extends Ir{constructor(e,t,n,i){super(e,t,n),this.username=i}}class Wv extends Ir{constructor(e,t){super(e,"facebook.com",t)}}class Hv extends ip{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class Qv extends Ir{constructor(e,t){super(e,"google.com",t)}}class Jv extends ip{constructor(e,t,n){super(e,"twitter.com",t,n)}}function Yv(r){const{user:e,_tokenResponse:t}=r;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:Kv(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e,t,n){this.type=e,this.credential=t,this.user=n}static _fromIdtoken(e,t){return new kn("enroll",e,t)}static _fromMfaPendingCredential(e){return new kn("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var t,n;if(e!=null&&e.multiFactorSession){if(!((t=e.multiFactorSession)===null||t===void 0)&&t.pendingCredential)return kn._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if(!((n=e.multiFactorSession)===null||n===void 0)&&n.idToken)return kn._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e,t,n){this.session=e,this.hints=t,this.signInResolver=n}static _fromError(e,t){const n=ge(e),i=t.customData._serverResponse,s=(i.mfaInfo||[]).map(c=>fs._fromServerResponse(n,c));O(i.mfaPendingCredential,n,"internal-error");const o=kn._fromMfaPendingCredential(i.mfaPendingCredential);return new eu(o,s,async c=>{const u=await c._process(n,o);delete i.mfaInfo,delete i.mfaPendingCredential;const h=Object.assign(Object.assign({},i),{idToken:u.idToken,refreshToken:u.refreshToken});switch(t.operationType){case"signIn":const f=await ot._fromIdTokenResponse(n,t.operationType,h);return await n._updateCurrentUser(f.user),f;case"reauthenticate":return O(t.user,n,"internal-error"),ot._forOperation(t.user,t.operationType,h);default:Oe(n,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}function Xv(r,e){var t;const n=j(r),i=e;return O(e.customData.operationType,n,"argument-error"),O((t=i.customData._serverResponse)===null||t===void 0?void 0:t.mfaPendingCredential,n,"argument-error"),eu._fromError(n,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zv(r,e){return Ie(r,"POST","/v2/accounts/mfaEnrollment:start",ye(r,e))}function ew(r,e){return Ie(r,"POST","/v2/accounts/mfaEnrollment:finalize",ye(r,e))}function tw(r,e){return Ie(r,"POST","/v2/accounts/mfaEnrollment:withdraw",ye(r,e))}class tu{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(n=>fs._fromServerResponse(e.auth,n)))})}static _fromUser(e){return new tu(e)}async getSession(){return kn._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const n=e,i=await this.getSession(),s=await Vt(this.user,n._process(this.user.auth,i,t));return await this.user._updateTokensIfNecessary(s),this.user.reload()}async unenroll(e){const t=typeof e=="string"?e:e.uid,n=await this.user.getIdToken();try{const i=await Vt(this.user,tw(this.user.auth,{idToken:n,mfaEnrollmentId:t}));this.enrolledFactors=this.enrolledFactors.filter(({uid:s})=>s!==t),await this.user._updateTokensIfNecessary(i),await this.user.reload()}catch(i){throw i}}}const Ka=new WeakMap;function nw(r){const e=j(r);return Ka.has(e)||Ka.set(e,tu._fromUser(e)),Ka.get(e)}const vo="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(vo,"1"),this.storage.removeItem(vo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rw=1e3,iw=10;class op extends sp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=zf(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),i=this.localCache[t];n!==i&&e(t,i,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},s=this.storage.getItem(n);jI()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,iw):i()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},rw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}op.type="LOCAL";const nu=op;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ap extends sp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ap.type="SESSION";const Ln=ap;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sw(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const n=new jo(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:i});const c=Array.from(o).map(async h=>h(t.origin,s)),u=await sw(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:i,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}jo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ps(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ow{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((c,u)=>{const h=ps("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:i,onMessage(p){const _=p;if(_.data.eventId===h)switch(_.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(_.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(){return window}function aw(r){Ae().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ru(){return typeof Ae().WorkerGlobalScope<"u"&&typeof Ae().importScripts=="function"}async function cw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function uw(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function lw(){return ru()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cp="firebaseLocalStorageDb",hw=1,wo="firebaseLocalStorage",up="fbase_key";class ms{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function $o(r,e){return r.transaction([wo],e?"readwrite":"readonly").objectStore(wo)}function dw(){const r=indexedDB.deleteDatabase(cp);return new ms(r).toPromise()}function oc(){const r=indexedDB.open(cp,hw);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(wo,{keyPath:up})}catch(i){t(i)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(wo)?e(n):(n.close(),await dw(),e(await oc()))})})}async function xh(r,e,t){const n=$o(r,!0).put({[up]:e,value:t});return new ms(n).toPromise()}async function fw(r,e){const t=$o(r,!1).get(e),n=await new ms(t).toPromise();return n===void 0?null:n.value}function Lh(r,e){const t=$o(r,!0).delete(e);return new ms(t).toPromise()}const pw=800,mw=3;class lp{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await oc(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>mw)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ru()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=jo._getInstance(lw()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await cw(),!this.activeServiceWorker)return;this.sender=new ow(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||uw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await oc();return await xh(e,vo,"1"),await Lh(e,vo),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>xh(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>fw(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Lh(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=$o(i,!1).getAll();return new ms(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)n.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!n.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),pw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}lp.type="LOCAL";const Ki=lp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gw(r,e){return Ie(r,"POST","/v2/accounts/mfaSignIn:start",ye(r,e))}function _w(r,e){return Ie(r,"POST","/v2/accounts/mfaSignIn:finalize",ye(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yw=500,Iw=6e4,Hs=1e12;class vw{constructor(e){this.auth=e,this.counter=Hs,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new ww(e,this.auth.name,t||{})),this.counter++,n}reset(e){var t;const n=e||Hs;(t=this._widgets.get(n))===null||t===void 0||t.delete(),this._widgets.delete(n)}getResponse(e){var t;const n=e||Hs;return((t=this._widgets.get(n))===null||t===void 0?void 0:t.getResponse())||""}async execute(e){var t;const n=e||Hs;return(t=this._widgets.get(n))===null||t===void 0||t.execute(),""}}class ww{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const i=typeof e=="string"?document.getElementById(e):e;O(i,"argument-error",{appName:t}),this.container=i,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=Tw(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},Iw)},yw))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function Tw(r){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let n=0;n<r;n++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wa=Kf("rcb"),Ew=new us(3e4,6e4);class Aw{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(!((e=Ae().grecaptcha)===null||e===void 0)&&e.render)}load(e,t=""){return O(bw(t),e,"argument-error"),this.shouldResolveImmediately(t)&&Rh(Ae().grecaptcha)?Promise.resolve(Ae().grecaptcha):new Promise((n,i)=>{const s=Ae().setTimeout(()=>{i(be(e,"network-request-failed"))},Ew.get());Ae()[Wa]=()=>{Ae().clearTimeout(s),delete Ae()[Wa];const c=Ae().grecaptcha;if(!c||!Rh(c)){i(be(e,"internal-error"));return}const u=c.render;c.render=(h,f)=>{const p=u(h,f);return this.counter++,p},this.hostLanguage=t,n(c)};const o=`${QI()}?${Ur({onload:Wa,render:"explicit",hl:t})}`;Qc(o).catch(()=>{clearTimeout(s),i(be(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(!((t=Ae().grecaptcha)===null||t===void 0)&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function bw(r){return r.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(r)}class Rw{async load(e){return new vw(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hp="recaptcha",Pw={theme:"light",type:"image"};let Sw=class{constructor(e,t,n=Object.assign({},Pw)){this.parameters=n,this.type=hp,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=ge(e),this.isInvisible=this.parameters.size==="invisible",O(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const i=typeof t=="string"?document.getElementById(t):t;O(i,this.auth,"argument-error"),this.container=i,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new Rw:new Aw,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),n=t.getResponse(e);return n||new Promise(i=>{const s=o=>{o&&(this.tokenChangeListeners.delete(s),i(o))};this.tokenChangeListeners.add(s),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){O(!this.parameters.sitekey,this.auth,"argument-error"),O(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),O(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(n=>n(t)),typeof e=="function")e(t);else if(typeof e=="string"){const n=Ae()[e];typeof n=="function"&&n(t)}}}assertNotDestroyed(){O(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){O(Wc()&&!ru(),this.auth,"internal-error"),await Cw(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await CI(this.auth);O(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return O(this.recaptcha,this.auth,"internal-error"),this.recaptcha}};function Cw(){let r=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}r=()=>e(),window.addEventListener("load",r)}).catch(e=>{throw r&&window.removeEventListener("load",r),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iu{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=On._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function kw(r,e,t){if(me(r.app))return Promise.reject(Ce(r));const n=ge(r),i=await zo(n,e,j(t));return new iu(i,s=>Bo(n,s))}async function Dw(r,e,t){const n=j(r);await Uo(!1,n,"phone");const i=await zo(n.auth,e,j(t));return new iu(i,s=>ep(n,s))}async function Vw(r,e,t){const n=j(r);if(me(n.auth.app))return Promise.reject(Ce(n.auth));const i=await zo(n.auth,e,j(t));return new iu(i,s=>tp(n,s))}async function zo(r,e,t){var n;const i=await t.verify();try{O(typeof i=="string",r,"argument-error"),O(t.type===hp,r,"argument-error");let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const o=s.session;if("phoneNumber"in s)return O(o.type==="enroll",r,"internal-error"),(await Zv(r,{idToken:o.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,recaptchaToken:i}})).phoneSessionInfo.sessionInfo;{O(o.type==="signin",r,"internal-error");const c=((n=s.multiFactorHint)===null||n===void 0?void 0:n.uid)||s.multiFactorUid;return O(c,r,"missing-multi-factor-info"),(await gw(r,{mfaPendingCredential:o.credential,mfaEnrollmentId:c,phoneSignInInfo:{recaptchaToken:i}})).phoneResponseInfo.sessionInfo}}else{const{sessionInfo:o}=await gv(r,{phoneNumber:s.phoneNumber,recaptchaToken:i});return o}}finally{t._reset()}}async function Nw(r,e){const t=j(r);if(me(t.auth.app))return Promise.reject(Ce(t.auth));await Jc(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Mn=class no{constructor(e){this.providerId=no.PROVIDER_ID,this.auth=ge(e)}verifyPhoneNumber(e,t){return zo(this.auth,e,j(t))}static credential(e,t){return On._fromVerification(e,t)}static credentialFromResult(e){const t=e;return no.credentialFromTaggedObject(t)}static credentialFromError(e){return no.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:n}=e;return t&&n?On._fromTokenResponse(t,n):null}};Mn.PROVIDER_ID="phone";Mn.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qn(r,e){return e?nt(e):(O(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su extends qr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return kt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return kt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return kt(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Ow(r){return Zf(r.auth,new su(r),r.bypassAuthState)}function xw(r){const{auth:e,user:t}=r;return O(t,e,"internal-error"),Xf(t,new su(r),r.bypassAuthState)}async function Lw(r){const{auth:e,user:t}=r;return O(t,e,"internal-error"),Jc(t,new su(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e,t,n,i,s=!1){this.auth=e,this.resolver=n,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:i,tenantId:s,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ow;case"linkViaPopup":case"linkViaRedirect":return Lw;case"reauthViaPopup":case"reauthViaRedirect":return xw;default:Oe(this.auth,"internal-error")}}resolve(e){ut(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ut(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mw=new us(2e3,1e4);async function Fw(r,e,t){if(me(r.app))return Promise.reject(be(r,"operation-not-supported-in-this-environment"));const n=ge(r);Br(r,e,Lt);const i=Qn(n,t);return new St(n,"signInViaPopup",e,i).executeNotNull()}async function Uw(r,e,t){const n=j(r);if(me(n.auth.app))return Promise.reject(be(n.auth,"operation-not-supported-in-this-environment"));Br(n.auth,e,Lt);const i=Qn(n.auth,t);return new St(n.auth,"reauthViaPopup",e,i,n).executeNotNull()}async function Bw(r,e,t){const n=j(r);Br(n.auth,e,Lt);const i=Qn(n.auth,t);return new St(n.auth,"linkViaPopup",e,i,n).executeNotNull()}class St extends dp{constructor(e,t,n,i,s){super(e,t,i,s),this.provider=n,this.authWindow=null,this.pollId=null,St.currentPopupAction&&St.currentPopupAction.cancel(),St.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return O(e,this.auth,"internal-error"),e}async onExecution(){ut(this.filter.length===1,"Popup operations only handle one event");const e=ps();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(be(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(be(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,St.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(be(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Mw.get())};e()}}St.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qw="pendingRedirect",ki=new Map;class jw extends dp{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=ki.get(this.auth._key());if(!e){try{const n=await $w(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}ki.set(this.auth._key(),e)}return this.bypassAuthState||ki.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function $w(r,e){const t=pp(e),n=fp(r);if(!await n._isAvailable())return!1;const i=await n._get(t)==="true";return await n._remove(t),i}async function ou(r,e){return fp(r)._set(pp(e),"true")}function zw(){ki.clear()}function au(r,e){ki.set(r._key(),e)}function fp(r){return nt(r._redirectPersistence)}function pp(r){return Nn(qw,r.config.apiKey,r.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gw(r,e,t){return Kw(r,e,t)}async function Kw(r,e,t){if(me(r.app))return Promise.reject(Ce(r));const n=ge(r);Br(r,e,Lt),await n._initializationPromise;const i=Qn(n,t);return await ou(i,n),i._openRedirect(n,e,"signInViaRedirect")}function Ww(r,e,t){return Hw(r,e,t)}async function Hw(r,e,t){const n=j(r);if(Br(n.auth,e,Lt),me(n.auth.app))return Promise.reject(Ce(n.auth));await n.auth._initializationPromise;const i=Qn(n.auth,t);await ou(i,n.auth);const s=await mp(n);return i._openRedirect(n.auth,e,"reauthViaRedirect",s)}function Qw(r,e,t){return Jw(r,e,t)}async function Jw(r,e,t){const n=j(r);Br(n.auth,e,Lt),await n.auth._initializationPromise;const i=Qn(n.auth,t);await Uo(!1,n,e.providerId),await ou(i,n.auth);const s=await mp(n);return i._openRedirect(n.auth,e,"linkViaRedirect",s)}async function Yw(r,e){return await ge(r)._initializationPromise,Go(r,e,!1)}async function Go(r,e,t=!1){if(me(r.app))return Promise.reject(Ce(r));const n=ge(r),i=Qn(n,e),o=await new jw(n,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}async function mp(r){const e=ps(`${r.uid}:::`);return r._redirectEventId=e,await r.auth._setRedirectUser(r),await r.auth._persistUserIfCurrent(r),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xw=10*60*1e3;class gp{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Zw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!_p(e)){const i=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError(be(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Xw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mh(e))}saveEventToCache(e){this.cachedEventUids.add(Mh(e)),this.lastProcessedEventTime=Date.now()}}function Mh(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function _p({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Zw(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return _p(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yp(r,e={}){return Ie(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eT=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,tT=/^https?/;async function nT(r){if(r.config.emulator)return;const{authorizedDomains:e}=await yp(r);for(const t of e)try{if(rT(t))return}catch{}Oe(r,"unauthorized-domain")}function rT(r){const e=ji(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!tT.test(t))return!1;if(eT.test(r))return n===r;const i=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iT=new us(3e4,6e4);function Fh(){const r=Ae().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function sT(r){return new Promise((e,t)=>{var n,i,s;function o(){Fh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Fh(),t(be(r,"network-request-failed"))},timeout:iT.get()})}if(!((i=(n=Ae().gapi)===null||n===void 0?void 0:n.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Ae().gapi)===null||s===void 0)&&s.load)o();else{const c=Kf("iframefcb");return Ae()[c]=()=>{gapi.load?o():t(be(r,"network-request-failed"))},Qc(`${YI()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw ro=null,e})}let ro=null;function oT(r){return ro=ro||sT(r),ro}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aT=new us(5e3,15e3),cT="__/auth/iframe",uT="emulator/auth/iframe",lT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},hT=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function dT(r){const e=r.config;O(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Hc(e,uT):`https://${r.config.authDomain}/${cT}`,n={apiKey:e.apiKey,appName:r.name,v:dn},i=hT.get(r.config.apiHost);i&&(n.eid=i);const s=r._getFrameworks();return s.length&&(n.fw=s.join(",")),`${t}?${Ur(n).slice(1)}`}async function fT(r){const e=await oT(r),t=Ae().gapi;return O(t,r,"internal-error"),e.open({where:document.body,url:dT(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:lT,dontclear:!0},n=>new Promise(async(i,s)=>{await n.restyle({setHideOnLeave:!1});const o=be(r,"network-request-failed"),c=Ae().setTimeout(()=>{s(o)},aT.get());function u(){Ae().clearTimeout(c),i(n)}n.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mT=500,gT=600,_T="_blank",yT="http://localhost";class Uh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function IT(r,e,t,n=mT,i=gT){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const u=Object.assign(Object.assign({},pT),{width:n.toString(),height:i.toString(),top:s,left:o}),h=fe().toLowerCase();t&&(c=Bf(h)?_T:t),Ff(h)&&(e=e||yT,u.scrollbars="yes");const f=Object.entries(u).reduce((_,[A,C])=>`${_}${A}=${C},`,"");if(qI(h)&&c!=="_self")return vT(e||"",c),new Uh(null);const p=window.open(e||"",c,f);O(p,r,"popup-blocked");try{p.focus()}catch{}return new Uh(p)}function vT(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wT="__/auth/handler",TT="emulator/auth/handler",ET=encodeURIComponent("fac");async function ac(r,e,t,n,i,s){O(r.config.authDomain,r,"auth-domain-config-required"),O(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:dn,eventId:i};if(e instanceof Lt){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",H_(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries(s||{}))o[f]=p}if(e instanceof jr){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}r.tenantId&&(o.tid=r.tenantId);const c=o;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await r._getAppCheckToken(),h=u?`#${ET}=${encodeURIComponent(u)}`:"";return`${AT(r)}?${Ur(c).slice(1)}${h}`}function AT({config:r}){return r.emulator?Hc(r,TT):`https://${r.authDomain}/${wT}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ha="webStorageSupport";class bT{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ln,this._completeRedirectFn=Go,this._overrideRedirectResult=au}async _openPopup(e,t,n,i){var s;ut((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await ac(e,t,n,ji(),i);return IT(e,o,ps())}async _openRedirect(e,t,n,i){await this._originValidation(e);const s=await ac(e,t,n,ji(),i);return aw(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(ut(s,"If manager is not set, promise should be"),s)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await fT(e),n=new gp(e);return t.register("authEvent",i=>(O(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:n.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ha,{type:Ha},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Ha];o!==void 0&&t(!!o),Oe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=nT(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return zf()||Uf()||hs()}}const RT=bT;class PT{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,n);case"signin":return this._finalizeSignIn(e,t.credential);default:return pt("unexpected MultiFactorSessionType")}}}class cu extends PT{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new cu(e)}_finalizeEnroll(e,t,n){return ew(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return _w(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class Ip{constructor(){}static assertion(e){return cu._fromCredential(e)}}Ip.FACTOR_ID="phone";var Bh="@firebase/auth",qh="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ST{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){O(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CT(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function kT(r){nn(new It("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=n.options;O(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Gf(r)},h=new WI(n,i,s,u);return tv(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),nn(new It("auth-internal",e=>{const t=ge(e.getProvider("auth").getImmediate());return(n=>new ST(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ct(Bh,qh,CT(r)),ct(Bh,qh,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DT=5*60;F_("authIdTokenMaxAge");function VT(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}HI({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=i=>{const s=be("internal-error");s.customData=i,t(s)},n.type="text/javascript",n.charset="UTF-8",VT().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});kT("Browser");/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fn(){return window}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NT=2e3;async function OT(r,e,t){var n;const{BuildInfo:i}=Fn();ut(e.sessionId,"AuthEvent did not contain a session ID");const s=await UT(e.sessionId),o={};return hs()?o.ibi=i.packageName:ls()?o.apn=i.packageName:Oe(r,"operation-not-supported-in-this-environment"),i.displayName&&(o.appDisplayName=i.displayName),o.sessionId=s,ac(r,t,e.type,void 0,(n=e.eventId)!==null&&n!==void 0?n:void 0,o)}async function xT(r){const{BuildInfo:e}=Fn(),t={};hs()?t.iosBundleId=e.packageName:ls()?t.androidPackageName=e.packageName:Oe(r,"operation-not-supported-in-this-environment"),await yp(r,t)}function LT(r){const{cordova:e}=Fn();return new Promise(t=>{e.plugins.browsertab.isAvailable(n=>{let i=null;n?e.plugins.browsertab.openUrl(r):i=e.InAppBrowser.open(r,BI()?"_blank":"_system","location=yes"),t(i)})})}async function MT(r,e,t){const{cordova:n}=Fn();let i=()=>{};try{await new Promise((s,o)=>{let c=null;function u(){var p;s();const _=(p=n.plugins.browsertab)===null||p===void 0?void 0:p.close;typeof _=="function"&&_(),typeof(t==null?void 0:t.close)=="function"&&t.close()}function h(){c||(c=window.setTimeout(()=>{o(be(r,"redirect-cancelled-by-user"))},NT))}function f(){(document==null?void 0:document.visibilityState)==="visible"&&h()}e.addPassiveListener(u),document.addEventListener("resume",h,!1),ls()&&document.addEventListener("visibilitychange",f,!1),i=()=>{e.removePassiveListener(u),document.removeEventListener("resume",h,!1),document.removeEventListener("visibilitychange",f,!1),c&&window.clearTimeout(c)}})}finally{i()}}function FT(r){var e,t,n,i,s,o,c,u,h,f;const p=Fn();O(typeof((e=p==null?void 0:p.universalLinks)===null||e===void 0?void 0:e.subscribe)=="function",r,"invalid-cordova-configuration",{missingPlugin:"cordova-universal-links-plugin-fix"}),O(typeof((t=p==null?void 0:p.BuildInfo)===null||t===void 0?void 0:t.packageName)<"u",r,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-buildInfo"}),O(typeof((s=(i=(n=p==null?void 0:p.cordova)===null||n===void 0?void 0:n.plugins)===null||i===void 0?void 0:i.browsertab)===null||s===void 0?void 0:s.openUrl)=="function",r,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-browsertab"}),O(typeof((u=(c=(o=p==null?void 0:p.cordova)===null||o===void 0?void 0:o.plugins)===null||c===void 0?void 0:c.browsertab)===null||u===void 0?void 0:u.isAvailable)=="function",r,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-browsertab"}),O(typeof((f=(h=p==null?void 0:p.cordova)===null||h===void 0?void 0:h.InAppBrowser)===null||f===void 0?void 0:f.open)=="function",r,"invalid-cordova-configuration",{missingPlugin:"cordova-plugin-inappbrowser"})}async function UT(r){const e=BT(r),t=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(t)).map(i=>i.toString(16).padStart(2,"0")).join("")}function BT(r){if(ut(/[0-9a-zA-Z]+/.test(r),"Can only convert alpha-numeric strings"),typeof TextEncoder<"u")return new TextEncoder().encode(r);const e=new ArrayBuffer(r.length),t=new Uint8Array(e);for(let n=0;n<r.length;n++)t[n]=r.charCodeAt(n);return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qT=20;class jT extends gp{constructor(){super(...arguments),this.passiveListeners=new Set,this.initPromise=new Promise(e=>{this.resolveInitialized=e})}addPassiveListener(e){this.passiveListeners.add(e)}removePassiveListener(e){this.passiveListeners.delete(e)}resetRedirect(){this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1}onEvent(e){return this.resolveInitialized(),this.passiveListeners.forEach(t=>t(e)),super.onEvent(e)}async initialized(){await this.initPromise}}function $T(r,e,t=null){return{type:e,eventId:t,urlResponse:null,sessionId:KT(),postBody:null,tenantId:r.tenantId,error:be(r,"no-auth-event")}}function zT(r,e){return cc()._set(uc(r),e)}async function jh(r){const e=await cc()._get(uc(r));return e&&await cc()._remove(uc(r)),e}function GT(r,e){var t,n;const i=HT(e);if(i.includes("/__/auth/callback")){const s=io(i),o=s.firebaseError?WT(decodeURIComponent(s.firebaseError)):null,c=(n=(t=o==null?void 0:o.code)===null||t===void 0?void 0:t.split("auth/"))===null||n===void 0?void 0:n[1],u=c?be(c):null;return u?{type:r.type,eventId:r.eventId,tenantId:r.tenantId,error:u,urlResponse:null,sessionId:null,postBody:null}:{type:r.type,eventId:r.eventId,tenantId:r.tenantId,sessionId:r.sessionId,urlResponse:i,postBody:null}}return null}function KT(){const r=[],e="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let t=0;t<qT;t++){const n=Math.floor(Math.random()*e.length);r.push(e.charAt(n))}return r.join("")}function cc(){return nt(nu)}function uc(r){return Nn("authEvent",r.config.apiKey,r.name)}function WT(r){try{return JSON.parse(r)}catch{return null}}function HT(r){const e=io(r),t=e.link?decodeURIComponent(e.link):void 0,n=io(t).link,i=e.deep_link_id?decodeURIComponent(e.deep_link_id):void 0;return io(i).link||i||n||t||r}function io(r){if(!(r!=null&&r.includes("?")))return{};const[e,...t]=r.split("?");return mr(t.join("?"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QT=500;class JT{constructor(){this._redirectPersistence=Ln,this._shouldInitProactively=!0,this.eventManagers=new Map,this.originValidationPromises={},this._completeRedirectFn=Go,this._overrideRedirectResult=au}async _initialize(e){const t=e._key();let n=this.eventManagers.get(t);return n||(n=new jT(e),this.eventManagers.set(t,n),this.attachCallbackListeners(e,n)),n}_openPopup(e){Oe(e,"operation-not-supported-in-this-environment")}async _openRedirect(e,t,n,i){FT(e);const s=await this._initialize(e);await s.initialized(),s.resetRedirect(),zw(),await this._originValidation(e);const o=$T(e,n,i);await zT(e,o);const c=await OT(e,o,t),u=await LT(c);return MT(e,s,u)}_isIframeWebStorageSupported(e,t){throw new Error("Method not implemented.")}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=xT(e)),this.originValidationPromises[t]}attachCallbackListeners(e,t){const{universalLinks:n,handleOpenURL:i,BuildInfo:s}=Fn(),o=setTimeout(async()=>{await jh(e),t.onEvent($h())},QT),c=async f=>{clearTimeout(o);const p=await jh(e);let _=null;p&&(f!=null&&f.url)&&(_=GT(p,f.url)),t.onEvent(_||$h())};typeof n<"u"&&typeof n.subscribe=="function"&&n.subscribe(null,c);const u=i,h=`${s.packageName.toLowerCase()}://`;Fn().handleOpenURL=async f=>{if(f.toLowerCase().startsWith(h)&&c({url:f}),typeof u=="function")try{u(f)}catch(p){console.error(p)}}}}const YT=JT;function $h(){return{type:"unknown",eventId:null,sessionId:null,urlResponse:null,postBody:null,tenantId:null,error:be("no-auth-event")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XT(r,e){ge(r)._logFramework(e)}var ZT="@firebase/auth-compat",eE="0.5.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tE=1e3;function Di(){var r;return((r=self==null?void 0:self.location)===null||r===void 0?void 0:r.protocol)||null}function nE(){return Di()==="http:"||Di()==="https:"}function vp(r=fe()){return!!((Di()==="file:"||Di()==="ionic:"||Di()==="capacitor:")&&r.toLowerCase().match(/iphone|ipad|ipod|android/))}function rE(){return Uc()||Fc()}function iE(){return pf()&&(document==null?void 0:document.documentMode)===11}function sE(r=fe()){return/Edge\/\d+/.test(r)}function oE(r=fe()){return iE()||sE(r)}function wp(){try{const r=self.localStorage,e=ps();if(r)return r.setItem(e,"1"),r.removeItem(e),oE()?Fi():!0}catch{return uu()&&Fi()}return!1}function uu(){return typeof global<"u"&&"WorkerGlobalScope"in global&&"importScripts"in global}function Qa(){return(nE()||ff()||vp())&&!rE()&&wp()&&!uu()}function Tp(){return vp()&&typeof document<"u"}async function aE(){return Tp()?new Promise(r=>{const e=setTimeout(()=>{r(!1)},tE);document.addEventListener("deviceready",()=>{clearTimeout(e),r(!0)})}):!1}function cE(){return typeof window<"u"?window:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt={LOCAL:"local",NONE:"none",SESSION:"session"},mi=O,Ep="persistence";function uE(r,e){if(mi(Object.values(tt).includes(e),r,"invalid-persistence-type"),Uc()){mi(e!==tt.SESSION,r,"unsupported-persistence-type");return}if(Fc()){mi(e===tt.NONE,r,"unsupported-persistence-type");return}if(uu()){mi(e===tt.NONE||e===tt.LOCAL&&Fi(),r,"unsupported-persistence-type");return}mi(e===tt.NONE||wp(),r,"unsupported-persistence-type")}async function lc(r){await r._initializationPromise;const e=Ap(),t=Nn(Ep,r.config.apiKey,r.name);e&&e.setItem(t,r._getPersistence())}function lE(r,e){const t=Ap();if(!t)return[];const n=Nn(Ep,r,e);switch(t.getItem(n)){case tt.NONE:return[Ar];case tt.LOCAL:return[Ki,Ln];case tt.SESSION:return[Ln];default:return[]}}function Ap(){var r;try{return((r=cE())===null||r===void 0?void 0:r.sessionStorage)||null}catch{return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hE=O;class Jt{constructor(){this.browserResolver=nt(RT),this.cordovaResolver=nt(YT),this.underlyingResolver=null,this._redirectPersistence=Ln,this._completeRedirectFn=Go,this._overrideRedirectResult=au}async _initialize(e){return await this.selectUnderlyingResolver(),this.assertedUnderlyingResolver._initialize(e)}async _openPopup(e,t,n,i){return await this.selectUnderlyingResolver(),this.assertedUnderlyingResolver._openPopup(e,t,n,i)}async _openRedirect(e,t,n,i){return await this.selectUnderlyingResolver(),this.assertedUnderlyingResolver._openRedirect(e,t,n,i)}_isIframeWebStorageSupported(e,t){this.assertedUnderlyingResolver._isIframeWebStorageSupported(e,t)}_originValidation(e){return this.assertedUnderlyingResolver._originValidation(e)}get _shouldInitProactively(){return Tp()||this.browserResolver._shouldInitProactively}get assertedUnderlyingResolver(){return hE(this.underlyingResolver,"internal-error"),this.underlyingResolver}async selectUnderlyingResolver(){if(this.underlyingResolver)return;const e=await aE();this.underlyingResolver=e?this.cordovaResolver:this.browserResolver}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bp(r){return r.unwrap()}function dE(r){return r.wrapped()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fE(r){return Rp(r)}function pE(r,e){var t;const n=(t=e.customData)===null||t===void 0?void 0:t._tokenResponse;if((e==null?void 0:e.code)==="auth/multi-factor-auth-required"){const i=e;i.resolver=new mE(r,Xv(r,e))}else if(n){const i=Rp(e),s=e;i&&(s.credential=i,s.tenantId=n.tenantId||void 0,s.email=n.email||void 0,s.phoneNumber=n.phoneNumber||void 0)}}function Rp(r){const{_tokenResponse:e}=r instanceof Ge?r.customData:r;if(!e)return null;if(!(r instanceof Ge)&&"temporaryProof"in e&&"phoneNumber"in e)return Mn.credentialFromResult(r);const t=e.providerId;if(!t||t===pi.PASSWORD)return null;let n;switch(t){case pi.GOOGLE:n=ht;break;case pi.FACEBOOK:n=lt;break;case pi.GITHUB:n=dt;break;case pi.TWITTER:n=ft;break;default:const{oauthIdToken:i,oauthAccessToken:s,oauthTokenSecret:o,pendingToken:c,nonce:u}=e;return!s&&!o&&!i&&!c?null:c?t.startsWith("saml.")?br._create(t,c):vt._fromParams({providerId:t,signInMethod:t,pendingToken:c,idToken:i,accessToken:s}):new yr(t).credential({idToken:i,accessToken:s,rawNonce:u})}return r instanceof Ge?n.credentialFromError(r):n.credentialFromResult(r)}function Qe(r,e){return e.catch(t=>{throw t instanceof Ge&&pE(r,t),t}).then(t=>{const n=t.operationType,i=t.user;return{operationType:n,credential:fE(t),additionalUserInfo:Yv(t),user:Ko.getOrCreate(i)}})}async function hc(r,e){const t=await e;return{verificationId:t.verificationId,confirm:n=>Qe(r,t.confirm(n))}}class mE{constructor(e,t){this.resolver=t,this.auth=dE(e)}get session(){return this.resolver.session}get hints(){return this.resolver.hints}resolveSignIn(e){return Qe(bp(this.auth),this.resolver.resolveSignIn(e))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ko=class Ai{constructor(e){this._delegate=e,this.multiFactor=nw(e)}static getOrCreate(e){return Ai.USER_MAP.has(e)||Ai.USER_MAP.set(e,new Ai(e)),Ai.USER_MAP.get(e)}delete(){return this._delegate.delete()}reload(){return this._delegate.reload()}toJSON(){return this._delegate.toJSON()}getIdTokenResult(e){return this._delegate.getIdTokenResult(e)}getIdToken(e){return this._delegate.getIdToken(e)}linkAndRetrieveDataWithCredential(e){return this.linkWithCredential(e)}async linkWithCredential(e){return Qe(this.auth,ep(this._delegate,e))}async linkWithPhoneNumber(e,t){return hc(this.auth,Dw(this._delegate,e,t))}async linkWithPopup(e){return Qe(this.auth,Bw(this._delegate,e,Jt))}async linkWithRedirect(e){return await lc(ge(this.auth)),Qw(this._delegate,e,Jt)}reauthenticateAndRetrieveDataWithCredential(e){return this.reauthenticateWithCredential(e)}async reauthenticateWithCredential(e){return Qe(this.auth,tp(this._delegate,e))}reauthenticateWithPhoneNumber(e,t){return hc(this.auth,Vw(this._delegate,e,t))}reauthenticateWithPopup(e){return Qe(this.auth,Uw(this._delegate,e,Jt))}async reauthenticateWithRedirect(e){return await lc(ge(this.auth)),Ww(this._delegate,e,Jt)}sendEmailVerification(e){return Bv(this._delegate,e)}async unlink(e){return await Rv(this._delegate,e),this}updateEmail(e){return zv(this._delegate,e)}updatePassword(e){return Gv(this._delegate,e)}updatePhoneNumber(e){return Nw(this._delegate,e)}updateProfile(e){return $v(this._delegate,e)}verifyBeforeUpdateEmail(e,t){return qv(this._delegate,e,t)}get emailVerified(){return this._delegate.emailVerified}get isAnonymous(){return this._delegate.isAnonymous}get metadata(){return this._delegate.metadata}get phoneNumber(){return this._delegate.phoneNumber}get providerData(){return this._delegate.providerData}get refreshToken(){return this._delegate.refreshToken}get tenantId(){return this._delegate.tenantId}get displayName(){return this._delegate.displayName}get email(){return this._delegate.email}get photoURL(){return this._delegate.photoURL}get providerId(){return this._delegate.providerId}get uid(){return this._delegate.uid}get auth(){return this._delegate.auth}};Ko.USER_MAP=new WeakMap;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi=O;class dc{constructor(e,t){if(this.app=e,t.isInitialized()){this._delegate=t.getImmediate(),this.linkUnderlyingAuth();return}const{apiKey:n}=e.options;gi(n,"invalid-api-key",{appName:e.name}),gi(n,"invalid-api-key",{appName:e.name});const i=typeof window<"u"?Jt:void 0;this._delegate=t.initialize({options:{persistence:gE(n,e.name),popupRedirectResolver:i}}),this._delegate._updateErrorMap(II),this.linkUnderlyingAuth()}get emulatorConfig(){return this._delegate.emulatorConfig}get currentUser(){return this._delegate.currentUser?Ko.getOrCreate(this._delegate.currentUser):null}get languageCode(){return this._delegate.languageCode}set languageCode(e){this._delegate.languageCode=e}get settings(){return this._delegate.settings}get tenantId(){return this._delegate.tenantId}set tenantId(e){this._delegate.tenantId=e}useDeviceLanguage(){this._delegate.useDeviceLanguage()}signOut(){return this._delegate.signOut()}useEmulator(e,t){nv(this._delegate,e,t)}applyActionCode(e){return Dv(this._delegate,e)}checkActionCode(e){return np(this._delegate,e)}confirmPasswordReset(e,t){return kv(this._delegate,e,t)}async createUserWithEmailAndPassword(e,t){return Qe(this._delegate,Nv(this._delegate,e,t))}fetchProvidersForEmail(e){return this.fetchSignInMethodsForEmail(e)}fetchSignInMethodsForEmail(e){return Uv(this._delegate,e)}isSignInWithEmailLink(e){return Lv(this._delegate,e)}async getRedirectResult(){gi(Qa(),this._delegate,"operation-not-supported-in-this-environment");const e=await Yw(this._delegate,Jt);return e?Qe(this._delegate,Promise.resolve(e)):{credential:null,user:null}}addFrameworkForLogging(e){XT(this._delegate,e)}onAuthStateChanged(e,t,n){const{next:i,error:s,complete:o}=zh(e,t,n);return this._delegate.onAuthStateChanged(i,s,o)}onIdTokenChanged(e,t,n){const{next:i,error:s,complete:o}=zh(e,t,n);return this._delegate.onIdTokenChanged(i,s,o)}sendSignInLinkToEmail(e,t){return xv(this._delegate,e,t)}sendPasswordResetEmail(e,t){return Cv(this._delegate,e,t||void 0)}async setPersistence(e){uE(this._delegate,e);let t;switch(e){case tt.SESSION:t=Ln;break;case tt.LOCAL:t=await nt(Ki)._isAvailable()?Ki:nu;break;case tt.NONE:t=Ar;break;default:return Oe("argument-error",{appName:this._delegate.name})}return this._delegate.setPersistence(t)}signInAndRetrieveDataWithCredential(e){return this.signInWithCredential(e)}signInAnonymously(){return Qe(this._delegate,bv(this._delegate))}signInWithCredential(e){return Qe(this._delegate,Bo(this._delegate,e))}signInWithCustomToken(e){return Qe(this._delegate,Sv(this._delegate,e))}signInWithEmailAndPassword(e,t){return Qe(this._delegate,Ov(this._delegate,e,t))}signInWithEmailLink(e,t){return Qe(this._delegate,Mv(this._delegate,e,t))}signInWithPhoneNumber(e,t){return hc(this._delegate,kw(this._delegate,e,t))}async signInWithPopup(e){return gi(Qa(),this._delegate,"operation-not-supported-in-this-environment"),Qe(this._delegate,Fw(this._delegate,e,Jt))}async signInWithRedirect(e){return gi(Qa(),this._delegate,"operation-not-supported-in-this-environment"),await lc(this._delegate),Gw(this._delegate,e,Jt)}updateCurrentUser(e){return this._delegate.updateCurrentUser(e)}verifyPasswordResetCode(e){return Vv(this._delegate,e)}unwrap(){return this._delegate}_delete(){return this._delegate._delete()}linkUnderlyingAuth(){this._delegate.wrapped=()=>this}}dc.Persistence=tt;function zh(r,e,t){let n=r;typeof r!="function"&&({next:n,error:e,complete:t}=r);const i=n;return{next:o=>i(o&&Ko.getOrCreate(o)),error:e,complete:t}}function gE(r,e){const t=lE(r,e);if(typeof self<"u"&&!t.includes(Ki)&&t.push(Ki),typeof window<"u")for(const n of[nu,Ln])t.includes(n)||t.push(n);return t.includes(Ar)||t.push(Ar),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(){this.providerId="phone",this._delegate=new Mn(bp(cs.auth()))}static credential(e,t){return Mn.credential(e,t)}verifyPhoneNumber(e,t){return this._delegate.verifyPhoneNumber(e,t)}unwrap(){return this._delegate}}lu.PHONE_SIGN_IN_METHOD=Mn.PHONE_SIGN_IN_METHOD;lu.PROVIDER_ID=Mn.PROVIDER_ID;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _E=O;class yE{constructor(e,t,n=cs.app()){var i;_E((i=n.options)===null||i===void 0?void 0:i.apiKey,"invalid-api-key",{appName:n.name}),this._delegate=new Sw(n.auth(),e,t),this.type=this._delegate.type}clear(){this._delegate.clear()}render(){return this._delegate.render()}verify(){return this._delegate.verify()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IE="auth-compat";function vE(r){r.INTERNAL.registerComponent(new It(IE,e=>{const t=e.getProvider("app-compat").getImmediate(),n=e.getProvider("auth");return new dc(t,n)},"PUBLIC").setServiceProps({ActionCodeInfo:{Operation:{EMAIL_SIGNIN:sr.EMAIL_SIGNIN,PASSWORD_RESET:sr.PASSWORD_RESET,RECOVER_EMAIL:sr.RECOVER_EMAIL,REVERT_SECOND_FACTOR_ADDITION:sr.REVERT_SECOND_FACTOR_ADDITION,VERIFY_AND_CHANGE_EMAIL:sr.VERIFY_AND_CHANGE_EMAIL,VERIFY_EMAIL:sr.VERIFY_EMAIL}},EmailAuthProvider:fn,FacebookAuthProvider:lt,GithubAuthProvider:dt,GoogleAuthProvider:ht,OAuthProvider:yr,SAMLAuthProvider:yo,PhoneAuthProvider:lu,PhoneMultiFactorGenerator:Ip,RecaptchaVerifier:yE,TwitterAuthProvider:ft,Auth:dc,AuthCredential:qr,Error:Ge}).setInstantiationMode("LAZY").setMultipleInstances(!1)),r.registerVersion(ZT,eE)}vE(cs);var Gh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var xn,Pp;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(v,g){function I(){}I.prototype=g.prototype,v.D=g.prototype,v.prototype=new I,v.prototype.constructor=v,v.C=function(w,T,R){for(var y=Array(arguments.length-2),At=2;At<arguments.length;At++)y[At-2]=arguments[At];return g.prototype[T].apply(w,y)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(v,g,I){I||(I=0);var w=Array(16);if(typeof g=="string")for(var T=0;16>T;++T)w[T]=g.charCodeAt(I++)|g.charCodeAt(I++)<<8|g.charCodeAt(I++)<<16|g.charCodeAt(I++)<<24;else for(T=0;16>T;++T)w[T]=g[I++]|g[I++]<<8|g[I++]<<16|g[I++]<<24;g=v.g[0],I=v.g[1],T=v.g[2];var R=v.g[3],y=g+(R^I&(T^R))+w[0]+3614090360&4294967295;g=I+(y<<7&4294967295|y>>>25),y=R+(T^g&(I^T))+w[1]+3905402710&4294967295,R=g+(y<<12&4294967295|y>>>20),y=T+(I^R&(g^I))+w[2]+606105819&4294967295,T=R+(y<<17&4294967295|y>>>15),y=I+(g^T&(R^g))+w[3]+3250441966&4294967295,I=T+(y<<22&4294967295|y>>>10),y=g+(R^I&(T^R))+w[4]+4118548399&4294967295,g=I+(y<<7&4294967295|y>>>25),y=R+(T^g&(I^T))+w[5]+1200080426&4294967295,R=g+(y<<12&4294967295|y>>>20),y=T+(I^R&(g^I))+w[6]+2821735955&4294967295,T=R+(y<<17&4294967295|y>>>15),y=I+(g^T&(R^g))+w[7]+4249261313&4294967295,I=T+(y<<22&4294967295|y>>>10),y=g+(R^I&(T^R))+w[8]+1770035416&4294967295,g=I+(y<<7&4294967295|y>>>25),y=R+(T^g&(I^T))+w[9]+2336552879&4294967295,R=g+(y<<12&4294967295|y>>>20),y=T+(I^R&(g^I))+w[10]+4294925233&4294967295,T=R+(y<<17&4294967295|y>>>15),y=I+(g^T&(R^g))+w[11]+2304563134&4294967295,I=T+(y<<22&4294967295|y>>>10),y=g+(R^I&(T^R))+w[12]+1804603682&4294967295,g=I+(y<<7&4294967295|y>>>25),y=R+(T^g&(I^T))+w[13]+4254626195&4294967295,R=g+(y<<12&4294967295|y>>>20),y=T+(I^R&(g^I))+w[14]+2792965006&4294967295,T=R+(y<<17&4294967295|y>>>15),y=I+(g^T&(R^g))+w[15]+1236535329&4294967295,I=T+(y<<22&4294967295|y>>>10),y=g+(T^R&(I^T))+w[1]+4129170786&4294967295,g=I+(y<<5&4294967295|y>>>27),y=R+(I^T&(g^I))+w[6]+3225465664&4294967295,R=g+(y<<9&4294967295|y>>>23),y=T+(g^I&(R^g))+w[11]+643717713&4294967295,T=R+(y<<14&4294967295|y>>>18),y=I+(R^g&(T^R))+w[0]+3921069994&4294967295,I=T+(y<<20&4294967295|y>>>12),y=g+(T^R&(I^T))+w[5]+3593408605&4294967295,g=I+(y<<5&4294967295|y>>>27),y=R+(I^T&(g^I))+w[10]+38016083&4294967295,R=g+(y<<9&4294967295|y>>>23),y=T+(g^I&(R^g))+w[15]+3634488961&4294967295,T=R+(y<<14&4294967295|y>>>18),y=I+(R^g&(T^R))+w[4]+3889429448&4294967295,I=T+(y<<20&4294967295|y>>>12),y=g+(T^R&(I^T))+w[9]+568446438&4294967295,g=I+(y<<5&4294967295|y>>>27),y=R+(I^T&(g^I))+w[14]+3275163606&4294967295,R=g+(y<<9&4294967295|y>>>23),y=T+(g^I&(R^g))+w[3]+4107603335&4294967295,T=R+(y<<14&4294967295|y>>>18),y=I+(R^g&(T^R))+w[8]+1163531501&4294967295,I=T+(y<<20&4294967295|y>>>12),y=g+(T^R&(I^T))+w[13]+2850285829&4294967295,g=I+(y<<5&4294967295|y>>>27),y=R+(I^T&(g^I))+w[2]+4243563512&4294967295,R=g+(y<<9&4294967295|y>>>23),y=T+(g^I&(R^g))+w[7]+1735328473&4294967295,T=R+(y<<14&4294967295|y>>>18),y=I+(R^g&(T^R))+w[12]+2368359562&4294967295,I=T+(y<<20&4294967295|y>>>12),y=g+(I^T^R)+w[5]+4294588738&4294967295,g=I+(y<<4&4294967295|y>>>28),y=R+(g^I^T)+w[8]+2272392833&4294967295,R=g+(y<<11&4294967295|y>>>21),y=T+(R^g^I)+w[11]+1839030562&4294967295,T=R+(y<<16&4294967295|y>>>16),y=I+(T^R^g)+w[14]+4259657740&4294967295,I=T+(y<<23&4294967295|y>>>9),y=g+(I^T^R)+w[1]+2763975236&4294967295,g=I+(y<<4&4294967295|y>>>28),y=R+(g^I^T)+w[4]+1272893353&4294967295,R=g+(y<<11&4294967295|y>>>21),y=T+(R^g^I)+w[7]+4139469664&4294967295,T=R+(y<<16&4294967295|y>>>16),y=I+(T^R^g)+w[10]+3200236656&4294967295,I=T+(y<<23&4294967295|y>>>9),y=g+(I^T^R)+w[13]+681279174&4294967295,g=I+(y<<4&4294967295|y>>>28),y=R+(g^I^T)+w[0]+3936430074&4294967295,R=g+(y<<11&4294967295|y>>>21),y=T+(R^g^I)+w[3]+3572445317&4294967295,T=R+(y<<16&4294967295|y>>>16),y=I+(T^R^g)+w[6]+76029189&4294967295,I=T+(y<<23&4294967295|y>>>9),y=g+(I^T^R)+w[9]+3654602809&4294967295,g=I+(y<<4&4294967295|y>>>28),y=R+(g^I^T)+w[12]+3873151461&4294967295,R=g+(y<<11&4294967295|y>>>21),y=T+(R^g^I)+w[15]+530742520&4294967295,T=R+(y<<16&4294967295|y>>>16),y=I+(T^R^g)+w[2]+3299628645&4294967295,I=T+(y<<23&4294967295|y>>>9),y=g+(T^(I|~R))+w[0]+4096336452&4294967295,g=I+(y<<6&4294967295|y>>>26),y=R+(I^(g|~T))+w[7]+1126891415&4294967295,R=g+(y<<10&4294967295|y>>>22),y=T+(g^(R|~I))+w[14]+2878612391&4294967295,T=R+(y<<15&4294967295|y>>>17),y=I+(R^(T|~g))+w[5]+4237533241&4294967295,I=T+(y<<21&4294967295|y>>>11),y=g+(T^(I|~R))+w[12]+1700485571&4294967295,g=I+(y<<6&4294967295|y>>>26),y=R+(I^(g|~T))+w[3]+2399980690&4294967295,R=g+(y<<10&4294967295|y>>>22),y=T+(g^(R|~I))+w[10]+4293915773&4294967295,T=R+(y<<15&4294967295|y>>>17),y=I+(R^(T|~g))+w[1]+2240044497&4294967295,I=T+(y<<21&4294967295|y>>>11),y=g+(T^(I|~R))+w[8]+1873313359&4294967295,g=I+(y<<6&4294967295|y>>>26),y=R+(I^(g|~T))+w[15]+4264355552&4294967295,R=g+(y<<10&4294967295|y>>>22),y=T+(g^(R|~I))+w[6]+2734768916&4294967295,T=R+(y<<15&4294967295|y>>>17),y=I+(R^(T|~g))+w[13]+1309151649&4294967295,I=T+(y<<21&4294967295|y>>>11),y=g+(T^(I|~R))+w[4]+4149444226&4294967295,g=I+(y<<6&4294967295|y>>>26),y=R+(I^(g|~T))+w[11]+3174756917&4294967295,R=g+(y<<10&4294967295|y>>>22),y=T+(g^(R|~I))+w[2]+718787259&4294967295,T=R+(y<<15&4294967295|y>>>17),y=I+(R^(T|~g))+w[9]+3951481745&4294967295,v.g[0]=v.g[0]+g&4294967295,v.g[1]=v.g[1]+(T+(y<<21&4294967295|y>>>11))&4294967295,v.g[2]=v.g[2]+T&4294967295,v.g[3]=v.g[3]+R&4294967295}n.prototype.u=function(v,g){g===void 0&&(g=v.length);for(var I=g-this.blockSize,w=this.B,T=this.h,R=0;R<g;){if(T==0)for(;R<=I;)i(this,v,R),R+=this.blockSize;if(typeof v=="string"){for(;R<g;)if(w[T++]=v.charCodeAt(R++),T==this.blockSize){i(this,w),T=0;break}}else for(;R<g;)if(w[T++]=v[R++],T==this.blockSize){i(this,w),T=0;break}}this.h=T,this.o+=g},n.prototype.v=function(){var v=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);v[0]=128;for(var g=1;g<v.length-8;++g)v[g]=0;var I=8*this.o;for(g=v.length-8;g<v.length;++g)v[g]=I&255,I/=256;for(this.u(v),v=Array(16),g=I=0;4>g;++g)for(var w=0;32>w;w+=8)v[I++]=this.g[g]>>>w&255;return v};function s(v,g){var I=c;return Object.prototype.hasOwnProperty.call(I,v)?I[v]:I[v]=g(v)}function o(v,g){this.h=g;for(var I=[],w=!0,T=v.length-1;0<=T;T--){var R=v[T]|0;w&&R==g||(I[T]=R,w=!1)}this.g=I}var c={};function u(v){return-128<=v&&128>v?s(v,function(g){return new o([g|0],0>g?-1:0)}):new o([v|0],0>v?-1:0)}function h(v){if(isNaN(v)||!isFinite(v))return p;if(0>v)return V(h(-v));for(var g=[],I=1,w=0;v>=I;w++)g[w]=v/I|0,I*=4294967296;return new o(g,0)}function f(v,g){if(v.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(v.charAt(0)=="-")return V(f(v.substring(1),g));if(0<=v.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=h(Math.pow(g,8)),w=p,T=0;T<v.length;T+=8){var R=Math.min(8,v.length-T),y=parseInt(v.substring(T,T+R),g);8>R?(R=h(Math.pow(g,R)),w=w.j(R).add(h(y))):(w=w.j(I),w=w.add(h(y)))}return w}var p=u(0),_=u(1),A=u(16777216);r=o.prototype,r.m=function(){if(N(this))return-V(this).m();for(var v=0,g=1,I=0;I<this.g.length;I++){var w=this.i(I);v+=(0<=w?w:4294967296+w)*g,g*=4294967296}return v},r.toString=function(v){if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(C(this))return"0";if(N(this))return"-"+V(this).toString(v);for(var g=h(Math.pow(v,6)),I=this,w="";;){var T=Y(I,g).g;I=$(I,T.j(g));var R=((0<I.g.length?I.g[0]:I.h)>>>0).toString(v);if(I=T,C(I))return R+w;for(;6>R.length;)R="0"+R;w=R+w}},r.i=function(v){return 0>v?0:v<this.g.length?this.g[v]:this.h};function C(v){if(v.h!=0)return!1;for(var g=0;g<v.g.length;g++)if(v.g[g]!=0)return!1;return!0}function N(v){return v.h==-1}r.l=function(v){return v=$(this,v),N(v)?-1:C(v)?0:1};function V(v){for(var g=v.g.length,I=[],w=0;w<g;w++)I[w]=~v.g[w];return new o(I,~v.h).add(_)}r.abs=function(){return N(this)?V(this):this},r.add=function(v){for(var g=Math.max(this.g.length,v.g.length),I=[],w=0,T=0;T<=g;T++){var R=w+(this.i(T)&65535)+(v.i(T)&65535),y=(R>>>16)+(this.i(T)>>>16)+(v.i(T)>>>16);w=y>>>16,R&=65535,y&=65535,I[T]=y<<16|R}return new o(I,I[I.length-1]&-2147483648?-1:0)};function $(v,g){return v.add(V(g))}r.j=function(v){if(C(this)||C(v))return p;if(N(this))return N(v)?V(this).j(V(v)):V(V(this).j(v));if(N(v))return V(this.j(V(v)));if(0>this.l(A)&&0>v.l(A))return h(this.m()*v.m());for(var g=this.g.length+v.g.length,I=[],w=0;w<2*g;w++)I[w]=0;for(w=0;w<this.g.length;w++)for(var T=0;T<v.g.length;T++){var R=this.i(w)>>>16,y=this.i(w)&65535,At=v.i(T)>>>16,Yr=v.i(T)&65535;I[2*w+2*T]+=y*Yr,z(I,2*w+2*T),I[2*w+2*T+1]+=R*Yr,z(I,2*w+2*T+1),I[2*w+2*T+1]+=y*At,z(I,2*w+2*T+1),I[2*w+2*T+2]+=R*At,z(I,2*w+2*T+2)}for(w=0;w<g;w++)I[w]=I[2*w+1]<<16|I[2*w];for(w=g;w<2*g;w++)I[w]=0;return new o(I,0)};function z(v,g){for(;(v[g]&65535)!=v[g];)v[g+1]+=v[g]>>>16,v[g]&=65535,g++}function q(v,g){this.g=v,this.h=g}function Y(v,g){if(C(g))throw Error("division by zero");if(C(v))return new q(p,p);if(N(v))return g=Y(V(v),g),new q(V(g.g),V(g.h));if(N(g))return g=Y(v,V(g)),new q(V(g.g),g.h);if(30<v.g.length){if(N(v)||N(g))throw Error("slowDivide_ only works with positive integers.");for(var I=_,w=g;0>=w.l(v);)I=te(I),w=te(w);var T=W(I,1),R=W(w,1);for(w=W(w,2),I=W(I,2);!C(w);){var y=R.add(w);0>=y.l(v)&&(T=T.add(I),R=y),w=W(w,1),I=W(I,1)}return g=$(v,T.j(g)),new q(T,g)}for(T=p;0<=v.l(g);){for(I=Math.max(1,Math.floor(v.m()/g.m())),w=Math.ceil(Math.log(I)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),R=h(I),y=R.j(g);N(y)||0<y.l(v);)I-=w,R=h(I),y=R.j(g);C(R)&&(R=_),T=T.add(R),v=$(v,y)}return new q(T,v)}r.A=function(v){return Y(this,v).h},r.and=function(v){for(var g=Math.max(this.g.length,v.g.length),I=[],w=0;w<g;w++)I[w]=this.i(w)&v.i(w);return new o(I,this.h&v.h)},r.or=function(v){for(var g=Math.max(this.g.length,v.g.length),I=[],w=0;w<g;w++)I[w]=this.i(w)|v.i(w);return new o(I,this.h|v.h)},r.xor=function(v){for(var g=Math.max(this.g.length,v.g.length),I=[],w=0;w<g;w++)I[w]=this.i(w)^v.i(w);return new o(I,this.h^v.h)};function te(v){for(var g=v.g.length+1,I=[],w=0;w<g;w++)I[w]=v.i(w)<<1|v.i(w-1)>>>31;return new o(I,v.h)}function W(v,g){var I=g>>5;g%=32;for(var w=v.g.length-I,T=[],R=0;R<w;R++)T[R]=0<g?v.i(R+I)>>>g|v.i(R+I+1)<<32-g:v.i(R+I);return new o(T,v.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,Pp=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,xn=o}).apply(typeof Gh<"u"?Gh:typeof self<"u"?self:typeof window<"u"?window:{});var Qs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Sp,bi,Cp,so,fc,kp,Dp,Vp;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,l,d){return a==Array.prototype||a==Object.prototype||(a[l]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Qs=="object"&&Qs];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function i(a,l){if(l)e:{var d=n;a=a.split(".");for(var m=0;m<a.length-1;m++){var E=a[m];if(!(E in d))break e;d=d[E]}a=a[a.length-1],m=d[a],l=l(m),l!=m&&l!=null&&e(d,a,{configurable:!0,writable:!0,value:l})}}function s(a,l){a instanceof String&&(a+="");var d=0,m=!1,E={next:function(){if(!m&&d<a.length){var S=d++;return{value:l(S,a[S]),done:!1}}return m=!0,{done:!0,value:void 0}}};return E[Symbol.iterator]=function(){return E},E}i("Array.prototype.values",function(a){return a||function(){return s(this,function(l,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},c=this||self;function u(a){var l=typeof a;return l=l!="object"?l:a?Array.isArray(a)?"array":l:"null",l=="array"||l=="object"&&typeof a.length=="number"}function h(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function f(a,l,d){return a.call.apply(a.bind,arguments)}function p(a,l,d){if(!a)throw Error();if(2<arguments.length){var m=Array.prototype.slice.call(arguments,2);return function(){var E=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(E,m),a.apply(l,E)}}return function(){return a.apply(l,arguments)}}function _(a,l,d){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,_.apply(null,arguments)}function A(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var m=d.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function C(a,l){function d(){}d.prototype=l.prototype,a.aa=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(m,E,S){for(var x=Array(arguments.length-2),ie=2;ie<arguments.length;ie++)x[ie-2]=arguments[ie];return l.prototype[E].apply(m,x)}}function N(a){const l=a.length;if(0<l){const d=Array(l);for(let m=0;m<l;m++)d[m]=a[m];return d}return[]}function V(a,l){for(let d=1;d<arguments.length;d++){const m=arguments[d];if(u(m)){const E=a.length||0,S=m.length||0;a.length=E+S;for(let x=0;x<S;x++)a[E+x]=m[x]}else a.push(m)}}class ${constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function z(a){return/^[\s\xa0]*$/.test(a)}function q(){var a=c.navigator;return a&&(a=a.userAgent)?a:""}function Y(a){return Y[" "](a),a}Y[" "]=function(){};var te=q().indexOf("Gecko")!=-1&&!(q().toLowerCase().indexOf("webkit")!=-1&&q().indexOf("Edge")==-1)&&!(q().indexOf("Trident")!=-1||q().indexOf("MSIE")!=-1)&&q().indexOf("Edge")==-1;function W(a,l,d){for(const m in a)l.call(d,a[m],m,a)}function v(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function g(a){const l={};for(const d in a)l[d]=a[d];return l}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,l){let d,m;for(let E=1;E<arguments.length;E++){m=arguments[E];for(d in m)a[d]=m[d];for(let S=0;S<I.length;S++)d=I[S],Object.prototype.hasOwnProperty.call(m,d)&&(a[d]=m[d])}}function T(a){var l=1;a=a.split(":");const d=[];for(;0<l&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function R(a){c.setTimeout(()=>{throw a},0)}function y(){var a=ga;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class At{constructor(){this.h=this.g=null}add(l,d){const m=Yr.get();m.set(l,d),this.h?this.h.next=m:this.g=m,this.h=m}}var Yr=new $(()=>new Jg,a=>a.reset());class Jg{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Xr,Zr=!1,ga=new At,pl=()=>{const a=c.Promise.resolve(void 0);Xr=()=>{a.then(Yg)}};var Yg=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){R(d)}var l=Yr;l.j(a),100>l.h&&(l.h++,a.next=l.g,l.g=a)}Zr=!1};function Bt(){this.s=this.s,this.C=this.C}Bt.prototype.s=!1,Bt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Bt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function xe(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}xe.prototype.h=function(){this.defaultPrevented=!0};var Xg=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};c.addEventListener("test",d,l),c.removeEventListener("test",d,l)}catch{}return a}();function ei(a,l){if(xe.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget){if(te){e:{try{Y(l.nodeName);var E=!0;break e}catch{}E=!1}E||(l=null)}}else d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement);this.relatedTarget=l,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Zg[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&ei.aa.h.call(this)}}C(ei,xe);var Zg={2:"touch",3:"pen",4:"mouse"};ei.prototype.h=function(){ei.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Cs="closure_listenable_"+(1e6*Math.random()|0),e_=0;function t_(a,l,d,m,E){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!m,this.ha=E,this.key=++e_,this.da=this.fa=!1}function ks(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Ds(a){this.src=a,this.g={},this.h=0}Ds.prototype.add=function(a,l,d,m,E){var S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);var x=ya(a,l,m,E);return-1<x?(l=a[x],d||(l.fa=!1)):(l=new t_(l,this.src,S,!!m,E),l.fa=d,a.push(l)),l};function _a(a,l){var d=l.type;if(d in a.g){var m=a.g[d],E=Array.prototype.indexOf.call(m,l,void 0),S;(S=0<=E)&&Array.prototype.splice.call(m,E,1),S&&(ks(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function ya(a,l,d,m){for(var E=0;E<a.length;++E){var S=a[E];if(!S.da&&S.listener==l&&S.capture==!!d&&S.ha==m)return E}return-1}var Ia="closure_lm_"+(1e6*Math.random()|0),va={};function ml(a,l,d,m,E){if(Array.isArray(l)){for(var S=0;S<l.length;S++)ml(a,l[S],d,m,E);return null}return d=yl(d),a&&a[Cs]?a.K(l,d,h(m)?!!m.capture:!1,E):n_(a,l,d,!1,m,E)}function n_(a,l,d,m,E,S){if(!l)throw Error("Invalid event type");var x=h(E)?!!E.capture:!!E,ie=Ta(a);if(ie||(a[Ia]=ie=new Ds(a)),d=ie.add(l,d,m,x,S),d.proxy)return d;if(m=r_(),d.proxy=m,m.src=a,m.listener=d,a.addEventListener)Xg||(E=x),E===void 0&&(E=!1),a.addEventListener(l.toString(),m,E);else if(a.attachEvent)a.attachEvent(_l(l.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return d}function r_(){function a(d){return l.call(a.src,a.listener,d)}const l=i_;return a}function gl(a,l,d,m,E){if(Array.isArray(l))for(var S=0;S<l.length;S++)gl(a,l[S],d,m,E);else m=h(m)?!!m.capture:!!m,d=yl(d),a&&a[Cs]?(a=a.i,l=String(l).toString(),l in a.g&&(S=a.g[l],d=ya(S,d,m,E),-1<d&&(ks(S[d]),Array.prototype.splice.call(S,d,1),S.length==0&&(delete a.g[l],a.h--)))):a&&(a=Ta(a))&&(l=a.g[l.toString()],a=-1,l&&(a=ya(l,d,m,E)),(d=-1<a?l[a]:null)&&wa(d))}function wa(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[Cs])_a(l.i,a);else{var d=a.type,m=a.proxy;l.removeEventListener?l.removeEventListener(d,m,a.capture):l.detachEvent?l.detachEvent(_l(d),m):l.addListener&&l.removeListener&&l.removeListener(m),(d=Ta(l))?(_a(d,a),d.h==0&&(d.src=null,l[Ia]=null)):ks(a)}}}function _l(a){return a in va?va[a]:va[a]="on"+a}function i_(a,l){if(a.da)a=!0;else{l=new ei(l,this);var d=a.listener,m=a.ha||a.src;a.fa&&wa(a),a=d.call(m,l)}return a}function Ta(a){return a=a[Ia],a instanceof Ds?a:null}var Ea="__closure_events_fn_"+(1e9*Math.random()>>>0);function yl(a){return typeof a=="function"?a:(a[Ea]||(a[Ea]=function(l){return a.handleEvent(l)}),a[Ea])}function Le(){Bt.call(this),this.i=new Ds(this),this.M=this,this.F=null}C(Le,Bt),Le.prototype[Cs]=!0,Le.prototype.removeEventListener=function(a,l,d,m){gl(this,a,l,d,m)};function qe(a,l){var d,m=a.F;if(m)for(d=[];m;m=m.F)d.push(m);if(a=a.M,m=l.type||l,typeof l=="string")l=new xe(l,a);else if(l instanceof xe)l.target=l.target||a;else{var E=l;l=new xe(m,a),w(l,E)}if(E=!0,d)for(var S=d.length-1;0<=S;S--){var x=l.g=d[S];E=Vs(x,m,!0,l)&&E}if(x=l.g=a,E=Vs(x,m,!0,l)&&E,E=Vs(x,m,!1,l)&&E,d)for(S=0;S<d.length;S++)x=l.g=d[S],E=Vs(x,m,!1,l)&&E}Le.prototype.N=function(){if(Le.aa.N.call(this),this.i){var a=this.i,l;for(l in a.g){for(var d=a.g[l],m=0;m<d.length;m++)ks(d[m]);delete a.g[l],a.h--}}this.F=null},Le.prototype.K=function(a,l,d,m){return this.i.add(String(a),l,!1,d,m)},Le.prototype.L=function(a,l,d,m){return this.i.add(String(a),l,!0,d,m)};function Vs(a,l,d,m){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();for(var E=!0,S=0;S<l.length;++S){var x=l[S];if(x&&!x.da&&x.capture==d){var ie=x.listener,ke=x.ha||x.src;x.fa&&_a(a.i,x),E=ie.call(ke,m)!==!1&&E}}return E&&!m.defaultPrevented}function Il(a,l,d){if(typeof a=="function")d&&(a=_(a,d));else if(a&&typeof a.handleEvent=="function")a=_(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(a,l||0)}function vl(a){a.g=Il(()=>{a.g=null,a.i&&(a.i=!1,vl(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class s_ extends Bt{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:vl(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ti(a){Bt.call(this),this.h=a,this.g={}}C(ti,Bt);var wl=[];function Tl(a){W(a.g,function(l,d){this.g.hasOwnProperty(d)&&wa(l)},a),a.g={}}ti.prototype.N=function(){ti.aa.N.call(this),Tl(this)},ti.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Aa=c.JSON.stringify,o_=c.JSON.parse,a_=class{stringify(a){return c.JSON.stringify(a,void 0)}parse(a){return c.JSON.parse(a,void 0)}};function ba(){}ba.prototype.h=null;function El(a){return a.h||(a.h=a.i())}function Al(){}var ni={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ra(){xe.call(this,"d")}C(Ra,xe);function Pa(){xe.call(this,"c")}C(Pa,xe);var yn={},bl=null;function Ns(){return bl=bl||new Le}yn.La="serverreachability";function Rl(a){xe.call(this,yn.La,a)}C(Rl,xe);function ri(a){const l=Ns();qe(l,new Rl(l))}yn.STAT_EVENT="statevent";function Pl(a,l){xe.call(this,yn.STAT_EVENT,a),this.stat=l}C(Pl,xe);function je(a){const l=Ns();qe(l,new Pl(l,a))}yn.Ma="timingevent";function Sl(a,l){xe.call(this,yn.Ma,a),this.size=l}C(Sl,xe);function ii(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){a()},l)}function si(){this.g=!0}si.prototype.xa=function(){this.g=!1};function c_(a,l,d,m,E,S){a.info(function(){if(a.g)if(S)for(var x="",ie=S.split("&"),ke=0;ke<ie.length;ke++){var Z=ie[ke].split("=");if(1<Z.length){var Me=Z[0];Z=Z[1];var Fe=Me.split("_");x=2<=Fe.length&&Fe[1]=="type"?x+(Me+"="+Z+"&"):x+(Me+"=redacted&")}}else x=null;else x=S;return"XMLHTTP REQ ("+m+") [attempt "+E+"]: "+l+`
`+d+`
`+x})}function u_(a,l,d,m,E,S,x){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+E+"]: "+l+`
`+d+`
`+S+" "+x})}function tr(a,l,d,m){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+h_(a,d)+(m?" "+m:"")})}function l_(a,l){a.info(function(){return"TIMEOUT: "+l})}si.prototype.info=function(){};function h_(a,l){if(!a.g)return l;if(!l)return null;try{var d=JSON.parse(l);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var m=d[a];if(!(2>m.length)){var E=m[1];if(Array.isArray(E)&&!(1>E.length)){var S=E[0];if(S!="noop"&&S!="stop"&&S!="close")for(var x=1;x<E.length;x++)E[x]=""}}}}return Aa(d)}catch{return l}}var Os={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Cl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Sa;function xs(){}C(xs,ba),xs.prototype.g=function(){return new XMLHttpRequest},xs.prototype.i=function(){return{}},Sa=new xs;function qt(a,l,d,m){this.j=a,this.i=l,this.l=d,this.R=m||1,this.U=new ti(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new kl}function kl(){this.i=null,this.g="",this.h=!1}var Dl={},Ca={};function ka(a,l,d){a.L=1,a.v=Us(bt(l)),a.m=d,a.P=!0,Vl(a,null)}function Vl(a,l){a.F=Date.now(),Ls(a),a.A=bt(a.v);var d=a.A,m=a.R;Array.isArray(m)||(m=[String(m)]),Kl(d.i,"t",m),a.C=0,d=a.j.J,a.h=new kl,a.g=lh(a.j,d?l:null,!a.m),0<a.O&&(a.M=new s_(_(a.Y,a,a.g),a.O)),l=a.U,d=a.g,m=a.ca;var E="readystatechange";Array.isArray(E)||(E&&(wl[0]=E.toString()),E=wl);for(var S=0;S<E.length;S++){var x=ml(d,E[S],m||l.handleEvent,!1,l.h||l);if(!x)break;l.g[x.key]=x}l=a.H?g(a.H):{},a.m?(a.u||(a.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,l)):(a.u="GET",a.g.ea(a.A,a.u,null,l)),ri(),c_(a.i,a.u,a.A,a.l,a.R,a.m)}qt.prototype.ca=function(a){a=a.target;const l=this.M;l&&Rt(a)==3?l.j():this.Y(a)},qt.prototype.Y=function(a){try{if(a==this.g)e:{const Fe=Rt(this.g);var l=this.g.Ba();const ir=this.g.Z();if(!(3>Fe)&&(Fe!=3||this.g&&(this.h.h||this.g.oa()||Zl(this.g)))){this.J||Fe!=4||l==7||(l==8||0>=ir?ri(3):ri(2)),Da(this);var d=this.g.Z();this.X=d;t:if(Nl(this)){var m=Zl(this.g);a="";var E=m.length,S=Rt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){In(this),oi(this);var x="";break t}this.h.i=new c.TextDecoder}for(l=0;l<E;l++)this.h.h=!0,a+=this.h.i.decode(m[l],{stream:!(S&&l==E-1)});m.length=0,this.h.g+=a,this.C=0,x=this.h.g}else x=this.g.oa();if(this.o=d==200,u_(this.i,this.u,this.A,this.l,this.R,Fe,d),this.o){if(this.T&&!this.K){t:{if(this.g){var ie,ke=this.g;if((ie=ke.g?ke.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!z(ie)){var Z=ie;break t}}Z=null}if(d=Z)tr(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Va(this,d);else{this.o=!1,this.s=3,je(12),In(this),oi(this);break e}}if(this.P){d=!0;let at;for(;!this.J&&this.C<x.length;)if(at=d_(this,x),at==Ca){Fe==4&&(this.s=4,je(14),d=!1),tr(this.i,this.l,null,"[Incomplete Response]");break}else if(at==Dl){this.s=4,je(15),tr(this.i,this.l,x,"[Invalid Chunk]"),d=!1;break}else tr(this.i,this.l,at,null),Va(this,at);if(Nl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Fe!=4||x.length!=0||this.h.h||(this.s=1,je(16),d=!1),this.o=this.o&&d,!d)tr(this.i,this.l,x,"[Invalid Chunked Response]"),In(this),oi(this);else if(0<x.length&&!this.W){this.W=!0;var Me=this.j;Me.g==this&&Me.ba&&!Me.M&&(Me.j.info("Great, no buffering proxy detected. Bytes received: "+x.length),Fa(Me),Me.M=!0,je(11))}}else tr(this.i,this.l,x,null),Va(this,x);Fe==4&&In(this),this.o&&!this.J&&(Fe==4?oh(this.j,this):(this.o=!1,Ls(this)))}else C_(this.g),d==400&&0<x.indexOf("Unknown SID")?(this.s=3,je(12)):(this.s=0,je(13)),In(this),oi(this)}}}catch{}finally{}};function Nl(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function d_(a,l){var d=a.C,m=l.indexOf(`
`,d);return m==-1?Ca:(d=Number(l.substring(d,m)),isNaN(d)?Dl:(m+=1,m+d>l.length?Ca:(l=l.slice(m,m+d),a.C=m+d,l)))}qt.prototype.cancel=function(){this.J=!0,In(this)};function Ls(a){a.S=Date.now()+a.I,Ol(a,a.I)}function Ol(a,l){if(a.B!=null)throw Error("WatchDog timer not null");a.B=ii(_(a.ba,a),l)}function Da(a){a.B&&(c.clearTimeout(a.B),a.B=null)}qt.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(l_(this.i,this.A),this.L!=2&&(ri(),je(17)),In(this),this.s=2,oi(this)):Ol(this,this.S-a)};function oi(a){a.j.G==0||a.J||oh(a.j,a)}function In(a){Da(a);var l=a.M;l&&typeof l.ma=="function"&&l.ma(),a.M=null,Tl(a.U),a.g&&(l=a.g,a.g=null,l.abort(),l.ma())}function Va(a,l){try{var d=a.j;if(d.G!=0&&(d.g==a||Na(d.h,a))){if(!a.K&&Na(d.h,a)&&d.G==3){try{var m=d.Da.g.parse(l)}catch{m=null}if(Array.isArray(m)&&m.length==3){var E=m;if(E[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)Gs(d),$s(d);else break e;Ma(d),je(18)}}else d.za=E[1],0<d.za-d.T&&37500>E[2]&&d.F&&d.v==0&&!d.C&&(d.C=ii(_(d.Za,d),6e3));if(1>=Ml(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else wn(d,11)}else if((a.K||d.g==a)&&Gs(d),!z(l))for(E=d.Da.g.parse(l),l=0;l<E.length;l++){let Z=E[l];if(d.T=Z[0],Z=Z[1],d.G==2)if(Z[0]=="c"){d.K=Z[1],d.ia=Z[2];const Me=Z[3];Me!=null&&(d.la=Me,d.j.info("VER="+d.la));const Fe=Z[4];Fe!=null&&(d.Aa=Fe,d.j.info("SVER="+d.Aa));const ir=Z[5];ir!=null&&typeof ir=="number"&&0<ir&&(m=1.5*ir,d.L=m,d.j.info("backChannelRequestTimeoutMs_="+m)),m=d;const at=a.g;if(at){const Ws=at.g?at.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ws){var S=m.h;S.g||Ws.indexOf("spdy")==-1&&Ws.indexOf("quic")==-1&&Ws.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(Oa(S,S.h),S.h=null))}if(m.D){const Ua=at.g?at.g.getResponseHeader("X-HTTP-Session-Id"):null;Ua&&(m.ya=Ua,oe(m.I,m.D,Ua))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),m=d;var x=a;if(m.qa=uh(m,m.J?m.ia:null,m.W),x.K){Fl(m.h,x);var ie=x,ke=m.L;ke&&(ie.I=ke),ie.B&&(Da(ie),Ls(ie)),m.g=x}else ih(m);0<d.i.length&&zs(d)}else Z[0]!="stop"&&Z[0]!="close"||wn(d,7);else d.G==3&&(Z[0]=="stop"||Z[0]=="close"?Z[0]=="stop"?wn(d,7):La(d):Z[0]!="noop"&&d.l&&d.l.ta(Z),d.v=0)}}ri(4)}catch{}}var f_=class{constructor(a,l){this.g=a,this.map=l}};function xl(a){this.l=a||10,c.PerformanceNavigationTiming?(a=c.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ll(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Ml(a){return a.h?1:a.g?a.g.size:0}function Na(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function Oa(a,l){a.g?a.g.add(l):a.h=l}function Fl(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}xl.prototype.cancel=function(){if(this.i=Ul(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Ul(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.D);return l}return N(a.i)}function p_(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var l=[],d=a.length,m=0;m<d;m++)l.push(a[m]);return l}l=[],d=0;for(m in a)l[d++]=a[m];return l}function m_(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var l=[];a=a.length;for(var d=0;d<a;d++)l.push(d);return l}l=[],d=0;for(const m in a)l[d++]=m;return l}}}function Bl(a,l){if(a.forEach&&typeof a.forEach=="function")a.forEach(l,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,l,void 0);else for(var d=m_(a),m=p_(a),E=m.length,S=0;S<E;S++)l.call(void 0,m[S],d&&d[S],a)}var ql=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function g_(a,l){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var m=a[d].indexOf("="),E=null;if(0<=m){var S=a[d].substring(0,m);E=a[d].substring(m+1)}else S=a[d];l(S,E?decodeURIComponent(E.replace(/\+/g," ")):"")}}}function vn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof vn){this.h=a.h,Ms(this,a.j),this.o=a.o,this.g=a.g,Fs(this,a.s),this.l=a.l;var l=a.i,d=new ui;d.i=l.i,l.g&&(d.g=new Map(l.g),d.h=l.h),jl(this,d),this.m=a.m}else a&&(l=String(a).match(ql))?(this.h=!1,Ms(this,l[1]||"",!0),this.o=ai(l[2]||""),this.g=ai(l[3]||"",!0),Fs(this,l[4]),this.l=ai(l[5]||"",!0),jl(this,l[6]||"",!0),this.m=ai(l[7]||"")):(this.h=!1,this.i=new ui(null,this.h))}vn.prototype.toString=function(){var a=[],l=this.j;l&&a.push(ci(l,$l,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(ci(l,$l,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(ci(d,d.charAt(0)=="/"?I_:y_,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",ci(d,w_)),a.join("")};function bt(a){return new vn(a)}function Ms(a,l,d){a.j=d?ai(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function Fs(a,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);a.s=l}else a.s=null}function jl(a,l,d){l instanceof ui?(a.i=l,T_(a.i,a.h)):(d||(l=ci(l,v_)),a.i=new ui(l,a.h))}function oe(a,l,d){a.i.set(l,d)}function Us(a){return oe(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function ai(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function ci(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,__),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function __(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var $l=/[#\/\?@]/g,y_=/[#\?:]/g,I_=/[#\?]/g,v_=/[#\?@]/g,w_=/#/g;function ui(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function jt(a){a.g||(a.g=new Map,a.h=0,a.i&&g_(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=ui.prototype,r.add=function(a,l){jt(this),this.i=null,a=nr(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function zl(a,l){jt(a),l=nr(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function Gl(a,l){return jt(a),l=nr(a,l),a.g.has(l)}r.forEach=function(a,l){jt(this),this.g.forEach(function(d,m){d.forEach(function(E){a.call(l,E,m,this)},this)},this)},r.na=function(){jt(this);const a=Array.from(this.g.values()),l=Array.from(this.g.keys()),d=[];for(let m=0;m<l.length;m++){const E=a[m];for(let S=0;S<E.length;S++)d.push(l[m])}return d},r.V=function(a){jt(this);let l=[];if(typeof a=="string")Gl(this,a)&&(l=l.concat(this.g.get(nr(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)l=l.concat(a[d])}return l},r.set=function(a,l){return jt(this),this.i=null,a=nr(this,a),Gl(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=this.V(a),0<a.length?String(a[0]):l):l};function Kl(a,l,d){zl(a,l),0<d.length&&(a.i=null,a.g.set(nr(a,l),N(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(var d=0;d<l.length;d++){var m=l[d];const S=encodeURIComponent(String(m)),x=this.V(m);for(m=0;m<x.length;m++){var E=S;x[m]!==""&&(E+="="+encodeURIComponent(String(x[m]))),a.push(E)}}return this.i=a.join("&")};function nr(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function T_(a,l){l&&!a.j&&(jt(a),a.i=null,a.g.forEach(function(d,m){var E=m.toLowerCase();m!=E&&(zl(this,m),Kl(this,E,d))},a)),a.j=l}function E_(a,l){const d=new si;if(c.Image){const m=new Image;m.onload=A($t,d,"TestLoadImage: loaded",!0,l,m),m.onerror=A($t,d,"TestLoadImage: error",!1,l,m),m.onabort=A($t,d,"TestLoadImage: abort",!1,l,m),m.ontimeout=A($t,d,"TestLoadImage: timeout",!1,l,m),c.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else l(!1)}function A_(a,l){const d=new si,m=new AbortController,E=setTimeout(()=>{m.abort(),$t(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:m.signal}).then(S=>{clearTimeout(E),S.ok?$t(d,"TestPingServer: ok",!0,l):$t(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(E),$t(d,"TestPingServer: error",!1,l)})}function $t(a,l,d,m,E){try{E&&(E.onload=null,E.onerror=null,E.onabort=null,E.ontimeout=null),m(d)}catch{}}function b_(){this.g=new a_}function R_(a,l,d){const m=d||"";try{Bl(a,function(E,S){let x=E;h(E)&&(x=Aa(E)),l.push(m+S+"="+encodeURIComponent(x))})}catch(E){throw l.push(m+"type="+encodeURIComponent("_badmap")),E}}function Bs(a){this.l=a.Ub||null,this.j=a.eb||!1}C(Bs,ba),Bs.prototype.g=function(){return new qs(this.l,this.j)},Bs.prototype.i=function(a){return function(){return a}}({});function qs(a,l){Le.call(this),this.D=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(qs,Le),r=qs.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=l,this.readyState=1,hi(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(l.body=a),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,li(this)),this.readyState=0},r.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,hi(this)),this.g&&(this.readyState=3,hi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Wl(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Wl(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}r.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?li(this):hi(this),this.readyState==3&&Wl(this)}},r.Ra=function(a){this.g&&(this.response=this.responseText=a,li(this))},r.Qa=function(a){this.g&&(this.response=a,li(this))},r.ga=function(){this.g&&li(this)};function li(a){a.readyState=4,a.l=null,a.j=null,a.v=null,hi(a)}r.setRequestHeader=function(a,l){this.u.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function hi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(qs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Hl(a){let l="";return W(a,function(d,m){l+=m,l+=":",l+=d,l+=`\r
`}),l}function xa(a,l,d){e:{for(m in d){var m=!1;break e}m=!0}m||(d=Hl(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):oe(a,l,d))}function pe(a){Le.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(pe,Le);var P_=/^https?$/i,S_=["POST","PUT"];r=pe.prototype,r.Ha=function(a){this.J=a},r.ea=function(a,l,d,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Sa.g(),this.v=this.o?El(this.o):El(Sa),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(S){Ql(this,S);return}if(a=d||"",d=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var E in m)d.set(E,m[E]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const S of m.keys())d.set(S,m.get(S));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),E=c.FormData&&a instanceof c.FormData,!(0<=Array.prototype.indexOf.call(S_,l,void 0))||m||E||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,x]of d)this.g.setRequestHeader(S,x);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Xl(this),this.u=!0,this.g.send(a),this.u=!1}catch(S){Ql(this,S)}};function Ql(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.m=5,Jl(a),js(a)}function Jl(a){a.A||(a.A=!0,qe(a,"complete"),qe(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,qe(this,"complete"),qe(this,"abort"),js(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),js(this,!0)),pe.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?Yl(this):this.bb())},r.bb=function(){Yl(this)};function Yl(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Rt(a)!=4||a.Z()!=2)){if(a.u&&Rt(a)==4)Il(a.Ea,0,a);else if(qe(a,"readystatechange"),Rt(a)==4){a.h=!1;try{const x=a.Z();e:switch(x){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var m;if(m=x===0){var E=String(a.D).match(ql)[1]||null;!E&&c.self&&c.self.location&&(E=c.self.location.protocol.slice(0,-1)),m=!P_.test(E?E.toLowerCase():"")}d=m}if(d)qe(a,"complete"),qe(a,"success");else{a.m=6;try{var S=2<Rt(a)?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.Z()+"]",Jl(a)}}finally{js(a)}}}}function js(a,l){if(a.g){Xl(a);const d=a.g,m=a.v[0]?()=>{}:null;a.g=null,a.v=null,l||qe(a,"ready");try{d.onreadystatechange=m}catch{}}}function Xl(a){a.I&&(c.clearTimeout(a.I),a.I=null)}r.isActive=function(){return!!this.g};function Rt(a){return a.g?a.g.readyState:0}r.Z=function(){try{return 2<Rt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),o_(l)}};function Zl(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function C_(a){const l={};a=(a.g&&2<=Rt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(z(a[m]))continue;var d=T(a[m]);const E=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=l[E]||[];l[E]=S,S.push(d)}v(l,function(m){return m.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function di(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function eh(a){this.Aa=0,this.i=[],this.j=new si,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=di("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=di("baseRetryDelayMs",5e3,a),this.cb=di("retryDelaySeedMs",1e4,a),this.Wa=di("forwardChannelMaxRetries",2,a),this.wa=di("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new xl(a&&a.concurrentRequestLimit),this.Da=new b_,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=eh.prototype,r.la=8,r.G=1,r.connect=function(a,l,d,m){je(0),this.W=a,this.H=l||{},d&&m!==void 0&&(this.H.OSID=d,this.H.OAID=m),this.F=this.X,this.I=uh(this,null,this.W),zs(this)};function La(a){if(th(a),a.G==3){var l=a.U++,d=bt(a.I);if(oe(d,"SID",a.K),oe(d,"RID",l),oe(d,"TYPE","terminate"),fi(a,d),l=new qt(a,a.j,l),l.L=2,l.v=Us(bt(d)),d=!1,c.navigator&&c.navigator.sendBeacon)try{d=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!d&&c.Image&&(new Image().src=l.v,d=!0),d||(l.g=lh(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Ls(l)}ch(a)}function $s(a){a.g&&(Fa(a),a.g.cancel(),a.g=null)}function th(a){$s(a),a.u&&(c.clearTimeout(a.u),a.u=null),Gs(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&c.clearTimeout(a.s),a.s=null)}function zs(a){if(!Ll(a.h)&&!a.s){a.s=!0;var l=a.Ga;Xr||pl(),Zr||(Xr(),Zr=!0),ga.add(l,a),a.B=0}}function k_(a,l){return Ml(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=l.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=ii(_(a.Ga,a,l),ah(a,a.B)),a.B++,!0)}r.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const E=new qt(this,this.j,a);let S=this.o;if(this.S&&(S?(S=g(S),w(S,this.S)):S=this.S),this.m!==null||this.O||(E.H=S,S=null),this.P)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var m=this.i[d];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(l+=m,4096<l){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=rh(this,E,l),d=bt(this.I),oe(d,"RID",a),oe(d,"CVER",22),this.D&&oe(d,"X-HTTP-Session-Id",this.D),fi(this,d),S&&(this.O?l="headers="+encodeURIComponent(String(Hl(S)))+"&"+l:this.m&&xa(d,this.m,S)),Oa(this.h,E),this.Ua&&oe(d,"TYPE","init"),this.P?(oe(d,"$req",l),oe(d,"SID","null"),E.T=!0,ka(E,d,null)):ka(E,d,l),this.G=2}}else this.G==3&&(a?nh(this,a):this.i.length==0||Ll(this.h)||nh(this))};function nh(a,l){var d;l?d=l.l:d=a.U++;const m=bt(a.I);oe(m,"SID",a.K),oe(m,"RID",d),oe(m,"AID",a.T),fi(a,m),a.m&&a.o&&xa(m,a.m,a.o),d=new qt(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),l&&(a.i=l.D.concat(a.i)),l=rh(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Oa(a.h,d),ka(d,m,l)}function fi(a,l){a.H&&W(a.H,function(d,m){oe(l,m,d)}),a.l&&Bl({},function(d,m){oe(l,m,d)})}function rh(a,l,d){d=Math.min(a.i.length,d);var m=a.l?_(a.l.Na,a.l,a):null;e:{var E=a.i;let S=-1;for(;;){const x=["count="+d];S==-1?0<d?(S=E[0].g,x.push("ofs="+S)):S=0:x.push("ofs="+S);let ie=!0;for(let ke=0;ke<d;ke++){let Z=E[ke].g;const Me=E[ke].map;if(Z-=S,0>Z)S=Math.max(0,E[ke].g-100),ie=!1;else try{R_(Me,x,"req"+Z+"_")}catch{m&&m(Me)}}if(ie){m=x.join("&");break e}}}return a=a.i.splice(0,d),l.D=a,m}function ih(a){if(!a.g&&!a.u){a.Y=1;var l=a.Fa;Xr||pl(),Zr||(Xr(),Zr=!0),ga.add(l,a),a.v=0}}function Ma(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=ii(_(a.Fa,a),ah(a,a.v)),a.v++,!0)}r.Fa=function(){if(this.u=null,sh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=ii(_(this.ab,this),a)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,je(10),$s(this),sh(this))};function Fa(a){a.A!=null&&(c.clearTimeout(a.A),a.A=null)}function sh(a){a.g=new qt(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var l=bt(a.qa);oe(l,"RID","rpc"),oe(l,"SID",a.K),oe(l,"AID",a.T),oe(l,"CI",a.F?"0":"1"),!a.F&&a.ja&&oe(l,"TO",a.ja),oe(l,"TYPE","xmlhttp"),fi(a,l),a.m&&a.o&&xa(l,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=Us(bt(l)),d.m=null,d.P=!0,Vl(d,a)}r.Za=function(){this.C!=null&&(this.C=null,$s(this),Ma(this),je(19))};function Gs(a){a.C!=null&&(c.clearTimeout(a.C),a.C=null)}function oh(a,l){var d=null;if(a.g==l){Gs(a),Fa(a),a.g=null;var m=2}else if(Na(a.h,l))d=l.D,Fl(a.h,l),m=1;else return;if(a.G!=0){if(l.o)if(m==1){d=l.m?l.m.length:0,l=Date.now()-l.F;var E=a.B;m=Ns(),qe(m,new Sl(m,d)),zs(a)}else ih(a);else if(E=l.s,E==3||E==0&&0<l.X||!(m==1&&k_(a,l)||m==2&&Ma(a)))switch(d&&0<d.length&&(l=a.h,l.i=l.i.concat(d)),E){case 1:wn(a,5);break;case 4:wn(a,10);break;case 3:wn(a,6);break;default:wn(a,2)}}}function ah(a,l){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*l}function wn(a,l){if(a.j.info("Error code "+l),l==2){var d=_(a.fb,a),m=a.Xa;const E=!m;m=new vn(m||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Ms(m,"https"),Us(m),E?E_(m.toString(),d):A_(m.toString(),d)}else je(2);a.G=0,a.l&&a.l.sa(l),ch(a),th(a)}r.fb=function(a){a?(this.j.info("Successfully pinged google.com"),je(2)):(this.j.info("Failed to ping google.com"),je(1))};function ch(a){if(a.G=0,a.ka=[],a.l){const l=Ul(a.h);(l.length!=0||a.i.length!=0)&&(V(a.ka,l),V(a.ka,a.i),a.h.i.length=0,N(a.i),a.i.length=0),a.l.ra()}}function uh(a,l,d){var m=d instanceof vn?bt(d):new vn(d);if(m.g!="")l&&(m.g=l+"."+m.g),Fs(m,m.s);else{var E=c.location;m=E.protocol,l=l?l+"."+E.hostname:E.hostname,E=+E.port;var S=new vn(null);m&&Ms(S,m),l&&(S.g=l),E&&Fs(S,E),d&&(S.l=d),m=S}return d=a.D,l=a.ya,d&&l&&oe(m,d,l),oe(m,"VER",a.la),fi(a,m),m}function lh(a,l,d){if(l&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Ca&&!a.pa?new pe(new Bs({eb:d})):new pe(a.pa),l.Ha(a.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function hh(){}r=hh.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Ks(){}Ks.prototype.g=function(a,l){return new et(a,l)};function et(a,l){Le.call(this),this.g=new eh(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(a?a["X-WebChannel-Client-Profile"]=l.va:a={"X-WebChannel-Client-Profile":l.va}),this.g.S=a,(a=l&&l.Sb)&&!z(a)&&(this.g.m=a),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!z(l)&&(this.g.D=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new rr(this)}C(et,Le),et.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},et.prototype.close=function(){La(this.g)},et.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=Aa(a),a=d);l.i.push(new f_(l.Ya++,a)),l.G==3&&zs(l)},et.prototype.N=function(){this.g.l=null,delete this.j,La(this.g),delete this.g,et.aa.N.call(this)};function dh(a){Ra.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const d in l){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}C(dh,Ra);function fh(){Pa.call(this),this.status=1}C(fh,Pa);function rr(a){this.g=a}C(rr,hh),rr.prototype.ua=function(){qe(this.g,"a")},rr.prototype.ta=function(a){qe(this.g,new dh(a))},rr.prototype.sa=function(a){qe(this.g,new fh)},rr.prototype.ra=function(){qe(this.g,"b")},Ks.prototype.createWebChannel=Ks.prototype.g,et.prototype.send=et.prototype.o,et.prototype.open=et.prototype.m,et.prototype.close=et.prototype.close,Vp=function(){return new Ks},Dp=function(){return Ns()},kp=yn,fc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Os.NO_ERROR=0,Os.TIMEOUT=8,Os.HTTP_ERROR=6,so=Os,Cl.COMPLETE="complete",Cp=Cl,Al.EventType=ni,ni.OPEN="a",ni.CLOSE="b",ni.ERROR="c",ni.MESSAGE="d",Le.prototype.listen=Le.prototype.K,bi=Al,pe.prototype.listenOnce=pe.prototype.L,pe.prototype.getLastError=pe.prototype.Ka,pe.prototype.getLastErrorCode=pe.prototype.Ba,pe.prototype.getStatus=pe.prototype.Z,pe.prototype.getResponseJson=pe.prototype.Oa,pe.prototype.getResponseText=pe.prototype.oa,pe.prototype.send=pe.prototype.ea,pe.prototype.setWithCredentials=pe.prototype.Ha,Sp=pe}).apply(typeof Qs<"u"?Qs:typeof self<"u"?self:typeof window<"u"?window:{});const Kh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Se.UNAUTHENTICATED=new Se(null),Se.GOOGLE_CREDENTIALS=new Se("google-credentials-uid"),Se.FIRST_PARTY=new Se("first-party-uid"),Se.MOCK_USER=new Se("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $r="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rn=new xo("@firebase/firestore");function lr(){return rn.logLevel}function wE(r){rn.setLogLevel(r)}function D(r,...e){if(rn.logLevel<=H.DEBUG){const t=e.map(hu);rn.debug(`Firestore (${$r}): ${r}`,...t)}}function ve(r,...e){if(rn.logLevel<=H.ERROR){const t=e.map(hu);rn.error(`Firestore (${$r}): ${r}`,...t)}}function wt(r,...e){if(rn.logLevel<=H.WARN){const t=e.map(hu);rn.warn(`Firestore (${$r}): ${r}`,...t)}}function hu(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(r="Unexpected state"){const e=`FIRESTORE (${$r}) INTERNAL ASSERTION FAILED: `+r;throw ve(e),new Error(e)}function U(r,e){r||F()}function TE(r,e){r||F()}function M(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class k extends Ge{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class EE{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Se.UNAUTHENTICATED))}shutdown(){}}class AE{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class bE{constructor(e){this.t=e,this.currentUser=Se.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){U(this.o===void 0);let n=this.i;const i=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let s=new Ne;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Ne,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},c=u=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>c(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Ne)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(U(typeof n.accessToken=="string"),new Np(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return U(e===null||typeof e=="string"),new Se(e)}}class RE{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=Se.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class PE{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new RE(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Se.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class SE{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class CE{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){U(this.o===void 0);const n=s=>{s.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,D("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>n(s))};const i=s=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(U(typeof t.token=="string"),this.R=t.token,new SE(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kE(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Op{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const i=kE(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<t&&(n+=e.charAt(i[s]%e.length))}return n}}function G(r,e){return r<e?-1:r>e?1:0}function Rr(r,e,t){return r.length===e.length&&r.every((n,i)=>t(n,e[i]))}function xp(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new k(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new k(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new k(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new k(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return he.fromMillis(Date.now())}static fromDate(e){return he.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new he(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?G(this.nanoseconds,e.nanoseconds):G(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.timestamp=e}static fromTimestamp(e){return new B(e)}static min(){return new B(new he(0,0))}static max(){return new B(new he(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,t,n){t===void 0?t=0:t>e.length&&F(),n===void 0?n=e.length-t:n>e.length-t&&F(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Wi.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Wi?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let i=0;i<n;i++){const s=e.get(i),o=t.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Q extends Wi{construct(e,t,n){return new Q(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new k(P.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(i=>i.length>0))}return new Q(t)}static emptyPath(){return new Q([])}}const DE=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ue extends Wi{construct(e,t,n){return new ue(e,t,n)}static isValidIdentifier(e){return DE.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ue.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new ue(["__name__"])}static fromServerFormat(e){const t=[];let n="",i=0;const s=()=>{if(n.length===0)throw new k(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new k(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new k(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,i+=2}else c==="`"?(o=!o,i++):c!=="."||o?(n+=c,i++):(s(),i++)}if(s(),o)throw new k(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ue(t)}static emptyPath(){return new ue([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(Q.fromString(e))}static fromName(e){return new L(Q.fromString(e).popFirst(5))}static empty(){return new L(Q.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Q.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Q.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new Q(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To{constructor(e,t,n,i){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=i}}function pc(r){return r.fields.find(e=>e.kind===2)}function An(r){return r.fields.filter(e=>e.kind!==2)}To.UNKNOWN_ID=-1;class oo{constructor(e,t){this.fieldPath=e,this.kind=t}}class Hi{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Hi(0,rt.min())}}function Lp(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,i=B.fromTimestamp(n===1e9?new he(t+1,0):new he(t,n));return new rt(i,L.empty(),e)}function Mp(r){return new rt(r.readTime,r.key,-1)}class rt{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new rt(B.min(),L.empty(),-1)}static max(){return new rt(B.max(),L.empty(),-1)}}function du(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(r.documentKey,e.documentKey),t!==0?t:G(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fp="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Up{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pn(r){if(r.code!==P.FAILED_PRECONDITION||r.message!==Fp)throw r;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new b((n,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(n,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(n,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof b?t:b.resolve(t)}catch(t){return b.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):b.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):b.reject(t)}static resolve(e){return new b((t,n)=>{t(e)})}static reject(e){return new b((t,n)=>{n(e)})}static waitFor(e){return new b((t,n)=>{let i=0,s=0,o=!1;e.forEach(c=>{++i,c.next(()=>{++s,o&&s===i&&t()},u=>n(u))}),o=!0,s===i&&t()})}static or(e){let t=b.resolve(!1);for(const n of e)t=t.next(i=>i?b.resolve(i):n());return t}static forEach(e,t){const n=[];return e.forEach((i,s)=>{n.push(t.call(this,i,s))}),this.waitFor(n)}static mapArray(e,t){return new b((n,i)=>{const s=e.length,o=new Array(s);let c=0;for(let u=0;u<s;u++){const h=u;t(e[h]).next(f=>{o[h]=f,++c,c===s&&n(o)},f=>i(f))}})}static doWhile(e,t){return new b((n,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):n()};s()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.V=new Ne,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{t.error?this.V.reject(new Vi(e,t.error)):this.V.resolve()},this.transaction.onerror=n=>{const i=fu(n.target.error);this.V.reject(new Vi(e,i))}}static open(e,t,n,i){try{return new Wo(t,e.transaction(i,n))}catch(s){throw new Vi(t,s)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(D("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new NE(t)}}class _t{constructor(e,t,n){this.name=e,this.version=t,this.p=n,_t.S(fe())===12.2&&ve("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return D("SimpleDb","Removing database:",e),bn(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!Fi())return!1;if(_t.v())return!0;const e=fe(),t=_t.S(e),n=0<t&&t<10,i=Bp(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.C)==="YES"}static F(e,t){return e.store(t)}static S(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}async M(e){return this.db||(D("SimpleDb","Opening database:",this.name),this.db=await new Promise((t,n)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const o=s.target.result;t(o)},i.onblocked=()=>{n(new Vi(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const o=s.target.error;o.name==="VersionError"?n(new k(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new k(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Vi(e,o))},i.onupgradeneeded=s=>{D("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const o=s.target.result;this.p.O(o,i.transaction,s.oldVersion,this.version).next(()=>{D("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=t=>this.N(t)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,i){const s=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.M(e);const c=Wo.open(this.db,e,s?"readonly":"readwrite",n),u=i(c).next(h=>(c.g(),h)).catch(h=>(c.abort(h),b.reject(h))).toPromise();return u.catch(()=>{}),await c.m,u}catch(c){const u=c,h=u.name!=="FirebaseError"&&o<3;if(D("SimpleDb","Transaction failed with error:",u.message,"Retrying:",h),this.close(),!h)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Bp(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class VE{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return bn(this.B.delete())}}class Vi extends k{constructor(e,t){super(P.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function mn(r){return r.name==="IndexedDbTransactionError"}class NE{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(D("SimpleDb","PUT",this.store.name,e,t),n=this.store.put(t,e)):(D("SimpleDb","PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),bn(n)}add(e){return D("SimpleDb","ADD",this.store.name,e,e),bn(this.store.add(e))}get(e){return bn(this.store.get(e)).next(t=>(t===void 0&&(t=null),D("SimpleDb","GET",this.store.name,e,t),t))}delete(e){return D("SimpleDb","DELETE",this.store.name,e),bn(this.store.delete(e))}count(){return D("SimpleDb","COUNT",this.store.name),bn(this.store.count())}U(e,t){const n=this.options(e,t),i=n.index?this.store.index(n.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(n.range);return new b((o,c)=>{s.onerror=u=>{c(u.target.error)},s.onsuccess=u=>{o(u.target.result)}})}{const s=this.cursor(n),o=[];return this.W(s,(c,u)=>{o.push(u)}).next(()=>o)}}G(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new b((i,s)=>{n.onerror=o=>{s(o.target.error)},n.onsuccess=o=>{i(o.target.result)}})}j(e,t){D("SimpleDb","DELETE ALL",this.store.name);const n=this.options(e,t);n.H=!1;const i=this.cursor(n);return this.W(i,(s,o,c)=>c.delete())}J(e,t){let n;t?n=e:(n={},t=e);const i=this.cursor(n);return this.W(i,t)}Y(e){const t=this.cursor({});return new b((n,i)=>{t.onerror=s=>{const o=fu(s.target.error);i(o)},t.onsuccess=s=>{const o=s.target.result;o?e(o.primaryKey,o.value).next(c=>{c?o.continue():n()}):n()}})}W(e,t){const n=[];return new b((i,s)=>{e.onerror=o=>{s(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void i();const u=new VE(c),h=t(c.primaryKey,c.value,u);if(h instanceof b){const f=h.catch(p=>(u.done(),b.reject(p)));n.push(f)}u.isDone?i():u.K===null?c.continue():c.continue(u.K)}}).next(()=>b.waitFor(n))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.H?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function bn(r){return new b((e,t)=>{r.onsuccess=n=>{const i=n.target.result;e(i)},r.onerror=n=>{const i=fu(n.target.error);t(i)}})}let Wh=!1;function fu(r){const e=_t.S(fe());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new k("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Wh||(Wh=!0,setTimeout(()=>{throw n},0)),n}}return r}class OE{constructor(e,t){this.asyncQueue=e,this.Z=t,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}X(e){D("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{D("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(t){mn(t)?D("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",t):await pn(t)}await this.X(6e4)})}}class xE{constructor(e,t){this.localStore=e,this.persistence=t}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.te(t,e))}te(e,t){const n=new Set;let i=t,s=!0;return b.doWhile(()=>s===!0&&i>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!n.has(o))return D("IndexBackfiller",`Processing collection: ${o}`),this.ne(e,o,i).next(c=>{i-=c,n.add(o)});s=!1})).next(()=>t-i)}ne(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(i=>this.localStore.localDocuments.getNextDocuments(e,t,i,n).next(s=>{const o=s.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.re(i,s)).next(c=>(D("IndexBackfiller",`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c))).next(()=>o.size)}))}re(e,t){let n=e;return t.changes.forEach((i,s)=>{const o=Mp(s);du(o,n)>0&&(n=o)}),new rt(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ie(n),this.se=n=>t.writeSequenceNumber(n))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ye.oe=-1;function gs(r){return r==null}function Qi(r){return r===0&&1/r==-1/0}function qp(r){return typeof r=="number"&&Number.isInteger(r)&&!Qi(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Hh(e)),e=LE(r.get(t),e);return Hh(e)}function LE(r,e){let t=e;const n=r.length;for(let i=0;i<n;i++){const s=r.charAt(i);switch(s){case"\0":t+="";break;case"":t+="";break;default:t+=s}}return t}function Hh(r){return r+""}function mt(r){const e=r.length;if(U(e>=2),e===2)return U(r.charAt(0)===""&&r.charAt(1)===""),Q.emptyPath();const t=e-2,n=[];let i="";for(let s=0;s<e;){const o=r.indexOf("",s);switch((o<0||o>t)&&F(),r.charAt(o+1)){case"":const c=r.substring(s,o);let u;i.length===0?u=c:(i+=c,u=i,i=""),n.push(u);break;case"":i+=r.substring(s,o),i+="\0";break;case"":i+=r.substring(s,o+1);break;default:F()}s=o+2}return new Q(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qh=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ao(r,e){return[r,Ke(e)]}function jp(r,e,t){return[r,Ke(e),t]}const ME={},FE=["prefixPath","collectionGroup","readTime","documentId"],UE=["prefixPath","collectionGroup","documentId"],BE=["collectionGroup","readTime","prefixPath","documentId"],qE=["canonicalId","targetId"],jE=["targetId","path"],$E=["path","targetId"],zE=["collectionId","parent"],GE=["indexId","uid"],KE=["uid","sequenceNumber"],WE=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],HE=["indexId","uid","orderedDocumentKey"],QE=["userId","collectionPath","documentId"],JE=["userId","collectionPath","largestBatchId"],YE=["userId","collectionGroup","largestBatchId"],$p=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],XE=[...$p,"documentOverlays"],zp=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],Gp=zp,pu=[...Gp,"indexConfiguration","indexState","indexEntries"],ZE=pu,eA=[...pu,"globals"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc extends Up{constructor(e,t){super(),this._e=e,this.currentSequenceNumber=t}}function Re(r,e){const t=M(r);return _t.F(t._e,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jh(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Jn(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Kp(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e,t){this.comparator=e,this.root=t||De.EMPTY}insert(e,t){return new se(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,De.BLACK,null,null))}remove(e){return new se(this.comparator,this.root.remove(e,this.comparator).copy(null,null,De.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return t+n.left.size;i<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Js(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Js(this.root,e,this.comparator,!1)}getReverseIterator(){return new Js(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Js(this.root,e,this.comparator,!0)}}class Js{constructor(e,t,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class De{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??De.RED,this.left=i??De.EMPTY,this.right=s??De.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,i,s){return new De(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return De.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return De.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,De.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,De.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw F();const e=this.left.check();if(e!==this.right.check())throw F();return e+(this.isRed()?0:1)}}De.EMPTY=null,De.RED=!0,De.BLACK=!1;De.EMPTY=new class{constructor(){this.size=0}get key(){throw F()}get value(){throw F()}get color(){throw F()}get left(){throw F()}get right(){throw F()}copy(e,t,n,i,s){return this}insert(e,t,n){return new De(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e){this.comparator=e,this.data=new se(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Yh(this.data.getIterator())}getIteratorFrom(e){return new Yh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof re)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new re(this.comparator);return t.data=e,t}}class Yh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function or(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this.fields=e,e.sort(ue.comparator)}static empty(){return new Xe([])}unionWith(e){let t=new re(ue.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Xe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Rr(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tA(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Wp("Invalid base64 string: "+s):s}}(e);return new _e(t)}static fromUint8Array(e){const t=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new _e(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return G(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}_e.EMPTY_BYTE_STRING=new _e("");const nA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Nt(r){if(U(!!r),typeof r=="string"){let e=0;const t=nA.exec(r);if(U(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:ce(r.seconds),nanos:ce(r.nanos)}}function ce(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function sn(r){return typeof r=="string"?_e.fromBase64String(r):_e.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ho(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function mu(r){const e=r.mapValue.fields.__previous_value__;return Ho(e)?mu(e):e}function Ji(r){const e=Nt(r.mapValue.fields.__local_write_time__.timestampValue);return new he(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(e,t,n,i,s,o,c,u,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=h}}class on{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new on("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof on&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},co={nullValue:"NULL_VALUE"};function Un(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Ho(r)?4:Hp(r)?9007199254740991:Qo(r)?10:11:F()}function Tt(r,e){if(r===e)return!0;const t=Un(r);if(t!==Un(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Ji(r).isEqual(Ji(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Nt(i.timestampValue),c=Nt(s.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(i,s){return sn(i.bytesValue).isEqual(sn(s.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(i,s){return ce(i.geoPointValue.latitude)===ce(s.geoPointValue.latitude)&&ce(i.geoPointValue.longitude)===ce(s.geoPointValue.longitude)}(r,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return ce(i.integerValue)===ce(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=ce(i.doubleValue),c=ce(s.doubleValue);return o===c?Qi(o)===Qi(c):isNaN(o)&&isNaN(c)}return!1}(r,e);case 9:return Rr(r.arrayValue.values||[],e.arrayValue.values||[],Tt);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},c=s.mapValue.fields||{};if(Jh(o)!==Jh(c))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(c[u]===void 0||!Tt(o[u],c[u])))return!1;return!0}(r,e);default:return F()}}function Yi(r,e){return(r.values||[]).find(t=>Tt(t,e))!==void 0}function an(r,e){if(r===e)return 0;const t=Un(r),n=Un(e);if(t!==n)return G(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return G(r.booleanValue,e.booleanValue);case 2:return function(s,o){const c=ce(s.integerValue||s.doubleValue),u=ce(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1}(r,e);case 3:return Xh(r.timestampValue,e.timestampValue);case 4:return Xh(Ji(r),Ji(e));case 5:return G(r.stringValue,e.stringValue);case 6:return function(s,o){const c=sn(s),u=sn(o);return c.compareTo(u)}(r.bytesValue,e.bytesValue);case 7:return function(s,o){const c=s.split("/"),u=o.split("/");for(let h=0;h<c.length&&h<u.length;h++){const f=G(c[h],u[h]);if(f!==0)return f}return G(c.length,u.length)}(r.referenceValue,e.referenceValue);case 8:return function(s,o){const c=G(ce(s.latitude),ce(o.latitude));return c!==0?c:G(ce(s.longitude),ce(o.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return Zh(r.arrayValue,e.arrayValue);case 10:return function(s,o){var c,u,h,f;const p=s.fields||{},_=o.fields||{},A=(c=p.value)===null||c===void 0?void 0:c.arrayValue,C=(u=_.value)===null||u===void 0?void 0:u.arrayValue,N=G(((h=A==null?void 0:A.values)===null||h===void 0?void 0:h.length)||0,((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0);return N!==0?N:Zh(A,C)}(r.mapValue,e.mapValue);case 11:return function(s,o){if(s===Yt.mapValue&&o===Yt.mapValue)return 0;if(s===Yt.mapValue)return 1;if(o===Yt.mapValue)return-1;const c=s.fields||{},u=Object.keys(c),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const _=G(u[p],f[p]);if(_!==0)return _;const A=an(c[u[p]],h[f[p]]);if(A!==0)return A}return G(u.length,f.length)}(r.mapValue,e.mapValue);default:throw F()}}function Xh(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return G(r,e);const t=Nt(r),n=Nt(e),i=G(t.seconds,n.seconds);return i!==0?i:G(t.nanos,n.nanos)}function Zh(r,e){const t=r.values||[],n=e.values||[];for(let i=0;i<t.length&&i<n.length;++i){const s=an(t[i],n[i]);if(s)return s}return G(t.length,n.length)}function Pr(r){return gc(r)}function gc(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=Nt(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return sn(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return L.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",i=!0;for(const s of t.values||[])i?i=!1:n+=",",n+=gc(s);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of n)s?s=!1:i+=",",i+=`${o}:${gc(t.fields[o])}`;return i+"}"}(r.mapValue):F()}function Bn(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function _c(r){return!!r&&"integerValue"in r}function Xi(r){return!!r&&"arrayValue"in r}function ed(r){return!!r&&"nullValue"in r}function td(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function uo(r){return!!r&&"mapValue"in r}function Qo(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Ni(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Jn(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=Ni(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ni(r.arrayValue.values[t]);return e}return Object.assign({},r)}function Hp(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}const Qp={mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{}}}}};function iA(r){return"nullValue"in r?co:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?Bn(on.empty(),L.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Qo(r)?Qp:{mapValue:{}}:F()}function sA(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?Bn(on.empty(),L.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Qp:"mapValue"in r?Qo(r)?{mapValue:{}}:Yt:F()}function nd(r,e){const t=an(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function rd(r,e){const t=an(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.value=e}static empty(){return new Ve({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!uo(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ni(t)}setAll(e){let t=ue.emptyPath(),n={},i=[];e.forEach((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,n,i),n={},i=[],t=c.popLast()}o?n[c.lastSegment()]=Ni(o):i.push(c.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,n,i)}delete(e){const t=this.field(e.popLast());uo(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Tt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let i=t.mapValue.fields[e.get(n)];uo(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,n){Jn(t,(i,s)=>e[i]=s);for(const i of n)delete e[i]}clone(){return new Ve(Ni(this.value))}}function Jp(r){const e=[];return Jn(r.fields,(t,n)=>{const i=new ue([t]);if(uo(n)){const s=Jp(n.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new Xe(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e,t,n,i,s,o,c){this.key=e,this.documentType=t,this.version=n,this.readTime=i,this.createTime=s,this.data=o,this.documentState=c}static newInvalidDocument(e){return new ae(e,0,B.min(),B.min(),B.min(),Ve.empty(),0)}static newFoundDocument(e,t,n,i){return new ae(e,1,t,B.min(),n,i,0)}static newNoDocument(e,t){return new ae(e,2,t,B.min(),B.min(),Ve.empty(),0)}static newUnknownDocument(e,t){return new ae(e,3,t,B.min(),B.min(),Ve.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(B.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ve.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ve.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=B.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ae&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ae(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e,t){this.position=e,this.inclusive=t}}function id(r,e,t){let n=0;for(let i=0;i<r.position.length;i++){const s=e[i],o=r.position[i];if(s.field.isKeyField()?n=L.comparator(L.fromName(o.referenceValue),t.key):n=an(o,t.data.field(s.field)),s.dir==="desc"&&(n*=-1),n!==0)break}return n}function sd(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Tt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e,t="asc"){this.field=e,this.dir=t}}function oA(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yp{}class J extends Yp{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new aA(e,t,n):t==="array-contains"?new lA(e,n):t==="in"?new rm(e,n):t==="not-in"?new hA(e,n):t==="array-contains-any"?new dA(e,n):new J(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new cA(e,n):new uA(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(an(t,this.value)):t!==null&&Un(this.value)===Un(t)&&this.matchesComparison(an(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ne extends Yp{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new ne(e,t)}matches(e){return Sr(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Sr(r){return r.op==="and"}function yc(r){return r.op==="or"}function gu(r){return Xp(r)&&Sr(r)}function Xp(r){for(const e of r.filters)if(e instanceof ne)return!1;return!0}function Ic(r){if(r instanceof J)return r.field.canonicalString()+r.op.toString()+Pr(r.value);if(gu(r))return r.filters.map(e=>Ic(e)).join(",");{const e=r.filters.map(t=>Ic(t)).join(",");return`${r.op}(${e})`}}function Zp(r,e){return r instanceof J?function(n,i){return i instanceof J&&n.op===i.op&&n.field.isEqual(i.field)&&Tt(n.value,i.value)}(r,e):r instanceof ne?function(n,i){return i instanceof ne&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce((s,o,c)=>s&&Zp(o,i.filters[c]),!0):!1}(r,e):void F()}function em(r,e){const t=r.filters.concat(e);return ne.create(t,r.op)}function tm(r){return r instanceof J?function(t){return`${t.field.canonicalString()} ${t.op} ${Pr(t.value)}`}(r):r instanceof ne?function(t){return t.op.toString()+" {"+t.getFilters().map(tm).join(" ,")+"}"}(r):"Filter"}class aA extends J{constructor(e,t,n){super(e,t,n),this.key=L.fromName(n.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class cA extends J{constructor(e,t){super(e,"in",t),this.keys=nm("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class uA extends J{constructor(e,t){super(e,"not-in",t),this.keys=nm("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function nm(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>L.fromName(n.referenceValue))}class lA extends J{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Xi(t)&&Yi(t.arrayValue,this.value)}}class rm extends J{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Yi(this.value.arrayValue,t)}}class hA extends J{constructor(e,t){super(e,"not-in",t)}matches(e){if(Yi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Yi(this.value.arrayValue,t)}}class dA extends J{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Xi(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>Yi(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fA{constructor(e,t=null,n=[],i=[],s=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=o,this.endAt=c,this.ue=null}}function vc(r,e=null,t=[],n=[],i=null,s=null,o=null){return new fA(r,e,t,n,i,s,o)}function qn(r){const e=M(r);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>Ic(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(s){return s.field.canonicalString()+s.dir}(n)).join(","),gs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Pr(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Pr(n)).join(",")),e.ue=t}return e.ue}function _s(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!oA(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Zp(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!sd(r.startAt,e.startAt)&&sd(r.endAt,e.endAt)}function Eo(r){return L.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Ao(r,e){return r.filters.filter(t=>t instanceof J&&t.field.isEqual(e))}function od(r,e,t){let n=co,i=!0;for(const s of Ao(r,e)){let o=co,c=!0;switch(s.op){case"<":case"<=":o=iA(s.value);break;case"==":case"in":case">=":o=s.value;break;case">":o=s.value,c=!1;break;case"!=":case"not-in":o=co}nd({value:n,inclusive:i},{value:o,inclusive:c})<0&&(n=o,i=c)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const o=t.position[s];nd({value:n,inclusive:i},{value:o,inclusive:t.inclusive})<0&&(n=o,i=t.inclusive);break}}return{value:n,inclusive:i}}function ad(r,e,t){let n=Yt,i=!0;for(const s of Ao(r,e)){let o=Yt,c=!0;switch(s.op){case">=":case">":o=sA(s.value),c=!1;break;case"==":case"in":case"<=":o=s.value;break;case"<":o=s.value,c=!1;break;case"!=":case"not-in":o=Yt}rd({value:n,inclusive:i},{value:o,inclusive:c})>0&&(n=o,i=c)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const o=t.position[s];rd({value:n,inclusive:i},{value:o,inclusive:t.inclusive})>0&&(n=o,i=t.inclusive);break}}return{value:n,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e,t=null,n=[],i=[],s=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=o,this.startAt=c,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function im(r,e,t,n,i,s,o,c){return new Mt(r,e,t,n,i,s,o,c)}function zr(r){return new Mt(r)}function cd(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function _u(r){return r.collectionGroup!==null}function vr(r){const e=M(r);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new re(ue.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(c=c.add(h.field))})}),c})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new Zi(s,n))}),t.has(ue.keyField().canonicalString())||e.ce.push(new Zi(ue.keyField(),n))}return e.ce}function We(r){const e=M(r);return e.le||(e.le=pA(e,vr(r))),e.le}function pA(r,e){if(r.limitType==="F")return vc(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Zi(i.field,s)});const t=r.endAt?new cn(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new cn(r.startAt.position,r.startAt.inclusive):null;return vc(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function wc(r,e){const t=r.filters.concat([e]);return new Mt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function bo(r,e,t){return new Mt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function ys(r,e){return _s(We(r),We(e))&&r.limitType===e.limitType}function sm(r){return`${qn(We(r))}|lt:${r.limitType}`}function hr(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(i=>tm(i)).join(", ")}]`),gs(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(i=>Pr(i)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(i=>Pr(i)).join(",")),`Target(${n})`}(We(r))}; limitType=${r.limitType})`}function Is(r,e){return e.isFoundDocument()&&function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):L.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)}(r,e)&&function(n,i){for(const s of vr(n))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(r,e)&&function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0}(r,e)&&function(n,i){return!(n.startAt&&!function(o,c,u){const h=id(o,c,u);return o.inclusive?h<=0:h<0}(n.startAt,vr(n),i)||n.endAt&&!function(o,c,u){const h=id(o,c,u);return o.inclusive?h>=0:h>0}(n.endAt,vr(n),i))}(r,e)}function om(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function am(r){return(e,t)=>{let n=!1;for(const i of vr(r)){const s=mA(i,e,t);if(s!==0)return s;n=n||i.field.isKeyField()}return 0}}function mA(r,e,t){const n=r.field.isKeyField()?L.comparator(e.key,t.key):function(s,o,c){const u=o.data.field(s),h=c.data.field(s);return u!==null&&h!==null?an(u,h):F()}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return F()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[i,s]of n)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let i=0;i<n.length;i++)if(this.equalsFn(n[i][0],e))return n.length===1?delete this.inner[t]:n.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Jn(this.inner,(t,n)=>{for(const[i,s]of n)e(i,s)})}isEmpty(){return Kp(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gA=new se(L.comparator);function Ze(){return gA}const cm=new se(L.comparator);function Ri(...r){let e=cm;for(const t of r)e=e.insert(t.key,t);return e}function um(r){let e=cm;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function gt(){return Oi()}function lm(){return Oi()}function Oi(){return new gn(r=>r.toString(),(r,e)=>r.isEqual(e))}const _A=new se(L.comparator),yA=new re(L.comparator);function K(...r){let e=yA;for(const t of r)e=e.add(t);return e}const IA=new re(G);function yu(){return IA}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Qi(e)?"-0":e}}function hm(r){return{integerValue:""+r}}function dm(r,e){return qp(e)?hm(e):Iu(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(){this._=void 0}}function vA(r,e,t){return r instanceof Cr?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Ho(s)&&(s=mu(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(t,e):r instanceof jn?pm(r,e):r instanceof $n?mm(r,e):function(i,s){const o=fm(i,s),c=ud(o)+ud(i.Pe);return _c(o)&&_c(i.Pe)?hm(c):Iu(i.serializer,c)}(r,e)}function wA(r,e,t){return r instanceof jn?pm(r,e):r instanceof $n?mm(r,e):t}function fm(r,e){return r instanceof kr?function(n){return _c(n)||function(s){return!!s&&"doubleValue"in s}(n)}(e)?e:{integerValue:0}:null}class Cr extends Jo{}class jn extends Jo{constructor(e){super(),this.elements=e}}function pm(r,e){const t=gm(e);for(const n of r.elements)t.some(i=>Tt(i,n))||t.push(n);return{arrayValue:{values:t}}}class $n extends Jo{constructor(e){super(),this.elements=e}}function mm(r,e){let t=gm(e);for(const n of r.elements)t=t.filter(i=>!Tt(i,n));return{arrayValue:{values:t}}}class kr extends Jo{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function ud(r){return ce(r.integerValue||r.doubleValue)}function gm(r){return Xi(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs{constructor(e,t){this.field=e,this.transform=t}}function TA(r,e){return r.field.isEqual(e.field)&&function(n,i){return n instanceof jn&&i instanceof jn||n instanceof $n&&i instanceof $n?Rr(n.elements,i.elements,Tt):n instanceof kr&&i instanceof kr?Tt(n.Pe,i.Pe):n instanceof Cr&&i instanceof Cr}(r.transform,e.transform)}class EA{constructor(e,t){this.version=e,this.transformResults=t}}class le{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new le}static exists(e){return new le(void 0,e)}static updateTime(e){return new le(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function lo(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Yo{}function _m(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Kr(r.key,le.none()):new Gr(r.key,r.data,le.none());{const t=r.data,n=Ve.empty();let i=new re(ue.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?n.delete(s):n.set(s,o),i=i.add(s)}return new Ft(r.key,n,new Xe(i.toArray()),le.none())}}function AA(r,e,t){r instanceof Gr?function(i,s,o){const c=i.value.clone(),u=hd(i.fieldTransforms,s,o.transformResults);c.setAll(u),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(r,e,t):r instanceof Ft?function(i,s,o){if(!lo(i.precondition,s))return void s.convertToUnknownDocument(o.version);const c=hd(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(ym(i)),u.setAll(c),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(r,e,t):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function xi(r,e,t,n){return r instanceof Gr?function(s,o,c,u){if(!lo(s.precondition,o))return c;const h=s.value.clone(),f=dd(s.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(r,e,t,n):r instanceof Ft?function(s,o,c,u){if(!lo(s.precondition,o))return c;const h=dd(s.fieldTransforms,u,o),f=o.data;return f.setAll(ym(s)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(p=>p.field))}(r,e,t,n):function(s,o,c){return lo(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c}(r,e,t)}function bA(r,e){let t=null;for(const n of r.fieldTransforms){const i=e.data.field(n.field),s=fm(n.transform,i||null);s!=null&&(t===null&&(t=Ve.empty()),t.set(n.field,s))}return t||null}function ld(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&Rr(n,i,(s,o)=>TA(s,o))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Gr extends Yo{constructor(e,t,n,i=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Ft extends Yo{constructor(e,t,n,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function ym(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function hd(r,e,t){const n=new Map;U(r.length===t.length);for(let i=0;i<t.length;i++){const s=r[i],o=s.transform,c=e.data.field(s.field);n.set(s.field,wA(o,c,t[i]))}return n}function dd(r,e,t){const n=new Map;for(const i of r){const s=i.transform,o=t.data.field(i.field);n.set(i.field,vA(s,o,e))}return n}class Kr extends Yo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class vu extends Yo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{constructor(e,t,n,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=i}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&AA(s,e,n[i])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=xi(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=xi(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=lm();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let c=this.applyToLocalView(o,s.mutatedFields);c=t.has(i.key)?null:c;const u=_m(o,c);u!==null&&n.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(B.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),K())}isEqual(e){return this.batchId===e.batchId&&Rr(this.mutations,e.mutations,(t,n)=>ld(t,n))&&Rr(this.baseMutations,e.baseMutations,(t,n)=>ld(t,n))}}class Tu{constructor(e,t,n,i){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=i}static from(e,t,n){U(e.mutations.length===n.length);let i=function(){return _A}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,n[o].version);return new Tu(e,t,n,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eu{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RA{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ee,X;function Im(r){switch(r){default:return F();case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0}}function vm(r){if(r===void 0)return ve("GRPC error has no .code"),P.UNKNOWN;switch(r){case Ee.OK:return P.OK;case Ee.CANCELLED:return P.CANCELLED;case Ee.UNKNOWN:return P.UNKNOWN;case Ee.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case Ee.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case Ee.INTERNAL:return P.INTERNAL;case Ee.UNAVAILABLE:return P.UNAVAILABLE;case Ee.UNAUTHENTICATED:return P.UNAUTHENTICATED;case Ee.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case Ee.NOT_FOUND:return P.NOT_FOUND;case Ee.ALREADY_EXISTS:return P.ALREADY_EXISTS;case Ee.PERMISSION_DENIED:return P.PERMISSION_DENIED;case Ee.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case Ee.ABORTED:return P.ABORTED;case Ee.OUT_OF_RANGE:return P.OUT_OF_RANGE;case Ee.UNIMPLEMENTED:return P.UNIMPLEMENTED;case Ee.DATA_LOSS:return P.DATA_LOSS;default:return F()}}(X=Ee||(Ee={}))[X.OK=0]="OK",X[X.CANCELLED=1]="CANCELLED",X[X.UNKNOWN=2]="UNKNOWN",X[X.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",X[X.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",X[X.NOT_FOUND=5]="NOT_FOUND",X[X.ALREADY_EXISTS=6]="ALREADY_EXISTS",X[X.PERMISSION_DENIED=7]="PERMISSION_DENIED",X[X.UNAUTHENTICATED=16]="UNAUTHENTICATED",X[X.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",X[X.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",X[X.ABORTED=10]="ABORTED",X[X.OUT_OF_RANGE=11]="OUT_OF_RANGE",X[X.UNIMPLEMENTED=12]="UNIMPLEMENTED",X[X.INTERNAL=13]="INTERNAL",X[X.UNAVAILABLE=14]="UNAVAILABLE",X[X.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wm(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PA=new xn([4294967295,4294967295],0);function fd(r){const e=wm().encode(r),t=new Pp;return t.update(e),new Uint8Array(t.digest())}function pd(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new xn([t,n],0),new xn([i,s],0)]}class Au{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Pi(`Invalid padding: ${t}`);if(n<0)throw new Pi(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Pi(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Pi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=xn.fromNumber(this.Ie)}Ee(e,t,n){let i=e.add(t.multiply(xn.fromNumber(n)));return i.compare(PA)===1&&(i=new xn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=fd(e),[n,i]=pd(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(n,i,s);if(!this.de(o))return!1}return!0}static create(e,t,n){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Au(s,i,t);return n.forEach(c=>o.insert(c)),o}insert(e){if(this.Ie===0)return;const t=fd(e),[n,i]=pd(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(n,i,s);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Pi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e,t,n,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const i=new Map;return i.set(e,Ts.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new ws(B.min(),i,new se(G),Ze(),K())}}class Ts{constructor(e,t,n,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Ts(n,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(e,t,n,i){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=i}}class Tm{constructor(e,t){this.targetId=e,this.me=t}}class Em{constructor(e,t,n=_e.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=i}}class md{constructor(){this.fe=0,this.ge=_d(),this.pe=_e.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=K(),t=K(),n=K();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:n=n.add(i);break;default:F()}}),new Ts(this.pe,this.ye,e,t,n)}Ce(){this.we=!1,this.ge=_d()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,U(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class SA{constructor(e){this.Le=e,this.Be=new Map,this.ke=Ze(),this.qe=gd(),this.Qe=new se(G)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:F()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((n,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,n=e.me.count,i=this.Je(t);if(i){const s=i.target;if(Eo(s))if(n===0){const o=new L(s.path);this.Ue(t,o,ae.newNoDocument(o,B.min()))}else U(n===1);else{const o=this.Ye(t);if(o!==n){const c=this.Ze(e),u=c?this.Xe(c,e,o):1;if(u!==0){this.je(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:i=0},hashCount:s=0}=t;let o,c;try{o=sn(n).toUint8Array()}catch(u){if(u instanceof Wp)return wt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new Au(o,i,s)}catch(u){return wt(u instanceof Pi?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.Ie===0?null:c}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let i=0;return n.forEach(s=>{const o=this.Le.tt(),c=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,s,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((s,o)=>{const c=this.Je(o);if(c){if(s.current&&Eo(c.target)){const u=new L(c.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,ae.newNoDocument(u,e))}s.be&&(t.set(o,s.ve()),s.Ce())}});let n=K();this.qe.forEach((s,o)=>{let c=!0;o.forEachWhile(u=>{const h=this.Je(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(n=n.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new ws(e,t,this.Qe,this.ke,n);return this.ke=Ze(),this.qe=gd(),this.Qe=new se(G),i}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new md,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new re(G),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||D("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new md),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function gd(){return new se(L.comparator)}function _d(){return new se(L.comparator)}const CA={asc:"ASCENDING",desc:"DESCENDING"},kA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},DA={and:"AND",or:"OR"};class VA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Tc(r,e){return r.useProto3Json||gs(e)?e:{value:e}}function Dr(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Am(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function NA(r,e){return Dr(r,e.toTimestamp())}function we(r){return U(!!r),B.fromTimestamp(function(t){const n=Nt(t);return new he(n.seconds,n.nanos)}(r))}function bu(r,e){return Ec(r,e).canonicalString()}function Ec(r,e){const t=function(i){return new Q(["projects",i.projectId,"databases",i.database])}(r).child("documents");return e===void 0?t:t.child(e)}function bm(r){const e=Q.fromString(r);return U(xm(e)),e}function es(r,e){return bu(r.databaseId,e.path)}function yt(r,e){const t=bm(e);if(t.get(1)!==r.databaseId.projectId)throw new k(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new k(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new L(Sm(t))}function Rm(r,e){return bu(r.databaseId,e)}function Pm(r){const e=bm(r);return e.length===4?Q.emptyPath():Sm(e)}function Ac(r){return new Q(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Sm(r){return U(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function yd(r,e,t){return{name:es(r,e),fields:t.value.mapValue.fields}}function Cm(r,e,t){const n=yt(r,e.name),i=we(e.updateTime),s=e.createTime?we(e.createTime):B.min(),o=new Ve({mapValue:{fields:e.fields}}),c=ae.newFoundDocument(n,i,s,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function OA(r,e){return"found"in e?function(n,i){U(!!i.found),i.found.name,i.found.updateTime;const s=yt(n,i.found.name),o=we(i.found.updateTime),c=i.found.createTime?we(i.found.createTime):B.min(),u=new Ve({mapValue:{fields:i.found.fields}});return ae.newFoundDocument(s,o,c,u)}(r,e):"missing"in e?function(n,i){U(!!i.missing),U(!!i.readTime);const s=yt(n,i.missing),o=we(i.readTime);return ae.newNoDocument(s,o)}(r,e):F()}function xA(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:F()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(h,f){return h.useProto3Json?(U(f===void 0||typeof f=="string"),_e.fromBase64String(f||"")):(U(f===void 0||f instanceof Buffer||f instanceof Uint8Array),_e.fromUint8Array(f||new Uint8Array))}(r,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&function(h){const f=h.code===void 0?P.UNKNOWN:vm(h.code);return new k(f,h.message||"")}(o);t=new Em(n,i,s,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const i=yt(r,n.document.name),s=we(n.document.updateTime),o=n.document.createTime?we(n.document.createTime):B.min(),c=new Ve({mapValue:{fields:n.document.fields}}),u=ae.newFoundDocument(i,s,o,c),h=n.targetIds||[],f=n.removedTargetIds||[];t=new ho(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const i=yt(r,n.document),s=n.readTime?we(n.readTime):B.min(),o=ae.newNoDocument(i,s),c=n.removedTargetIds||[];t=new ho([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const i=yt(r,n.document),s=n.removedTargetIds||[];t=new ho([],s,i,null)}else{if(!("filter"in e))return F();{e.filter;const n=e.filter;n.targetId;const{count:i=0,unchangedNames:s}=n,o=new RA(i,s),c=n.targetId;t=new Tm(c,o)}}return t}function ts(r,e){let t;if(e instanceof Gr)t={update:yd(r,e.key,e.value)};else if(e instanceof Kr)t={delete:es(r,e.key)};else if(e instanceof Ft)t={update:yd(r,e.key,e.data),updateMask:qA(e.fieldMask)};else{if(!(e instanceof vu))return F();t={verify:es(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(s,o){const c=o.transform;if(c instanceof Cr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof jn)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof $n)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof kr)return{fieldPath:o.field.canonicalString(),increment:c.Pe};throw F()}(0,n))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:NA(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:F()}(r,e.precondition)),t}function bc(r,e){const t=e.currentDocument?function(s){return s.updateTime!==void 0?le.updateTime(we(s.updateTime)):s.exists!==void 0?le.exists(s.exists):le.none()}(e.currentDocument):le.none(),n=e.updateTransforms?e.updateTransforms.map(i=>function(o,c){let u=null;if("setToServerValue"in c)U(c.setToServerValue==="REQUEST_TIME"),u=new Cr;else if("appendMissingElements"in c){const f=c.appendMissingElements.values||[];u=new jn(f)}else if("removeAllFromArray"in c){const f=c.removeAllFromArray.values||[];u=new $n(f)}else"increment"in c?u=new kr(o,c.increment):F();const h=ue.fromServerFormat(c.fieldPath);return new vs(h,u)}(r,i)):[];if(e.update){e.update.name;const i=yt(r,e.update.name),s=new Ve({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(u){const h=u.fieldPaths||[];return new Xe(h.map(f=>ue.fromServerFormat(f)))}(e.updateMask);return new Ft(i,s,o,t,n)}return new Gr(i,s,t,n)}if(e.delete){const i=yt(r,e.delete);return new Kr(i,t)}if(e.verify){const i=yt(r,e.verify);return new vu(i,t)}return F()}function LA(r,e){return r&&r.length>0?(U(e!==void 0),r.map(t=>function(i,s){let o=i.updateTime?we(i.updateTime):we(s);return o.isEqual(B.min())&&(o=we(s)),new EA(o,i.transformResults||[])}(t,e))):[]}function km(r,e){return{documents:[Rm(r,e.path)]}}function Dm(r,e){const t={structuredQuery:{}},n=e.path;let i;e.collectionGroup!==null?(i=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Rm(r,i);const s=function(h){if(h.length!==0)return Om(ne.create(h,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const o=function(h){if(h.length!==0)return h.map(f=>function(_){return{field:dr(_.field),direction:FA(_.dir)}}(f))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Tc(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:i}}function Vm(r){let e=Pm(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let i=null;if(n>0){U(n===1);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=function(p){const _=Nm(p);return _ instanceof ne&&gu(_)?_.getFilters():[_]}(t.where));let o=[];t.orderBy&&(o=function(p){return p.map(_=>function(C){return new Zi(fr(C.field),function(V){switch(V){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(_))}(t.orderBy));let c=null;t.limit&&(c=function(p){let _;return _=typeof p=="object"?p.value:p,gs(_)?null:_}(t.limit));let u=null;t.startAt&&(u=function(p){const _=!!p.before,A=p.values||[];return new cn(A,_)}(t.startAt));let h=null;return t.endAt&&(h=function(p){const _=!p.before,A=p.values||[];return new cn(A,_)}(t.endAt)),im(e,i,o,s,c,"F",u,h)}function MA(r,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Nm(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=fr(t.unaryFilter.field);return J.create(n,"==",{doubleValue:NaN});case"IS_NULL":const i=fr(t.unaryFilter.field);return J.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=fr(t.unaryFilter.field);return J.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=fr(t.unaryFilter.field);return J.create(o,"!=",{nullValue:"NULL_VALUE"});default:return F()}}(r):r.fieldFilter!==void 0?function(t){return J.create(fr(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return F()}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return ne.create(t.compositeFilter.filters.map(n=>Nm(n)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return F()}}(t.compositeFilter.op))}(r):F()}function FA(r){return CA[r]}function UA(r){return kA[r]}function BA(r){return DA[r]}function dr(r){return{fieldPath:r.canonicalString()}}function fr(r){return ue.fromServerFormat(r.fieldPath)}function Om(r){return r instanceof J?function(t){if(t.op==="=="){if(td(t.value))return{unaryFilter:{field:dr(t.field),op:"IS_NAN"}};if(ed(t.value))return{unaryFilter:{field:dr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(td(t.value))return{unaryFilter:{field:dr(t.field),op:"IS_NOT_NAN"}};if(ed(t.value))return{unaryFilter:{field:dr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:dr(t.field),op:UA(t.op),value:t.value}}}(r):r instanceof ne?function(t){const n=t.getFilters().map(i=>Om(i));return n.length===1?n[0]:{compositeFilter:{op:BA(t.op),filters:n}}}(r):F()}function qA(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function xm(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e,t,n,i,s=B.min(),o=B.min(),c=_e.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Ct(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(e){this.ct=e}}function jA(r,e){let t;if(e.document)t=Cm(r.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=L.fromSegments(e.noDocument.path),i=Gn(e.noDocument.readTime);t=ae.newNoDocument(n,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return F();{const n=L.fromSegments(e.unknownDocument.path),i=Gn(e.unknownDocument.version);t=ae.newUnknownDocument(n,i)}}return e.readTime&&t.setReadTime(function(i){const s=new he(i[0],i[1]);return B.fromTimestamp(s)}(e.readTime)),t}function Id(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Ro(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=function(s,o){return{name:es(s,o.key),fields:o.data.value.mapValue.fields,updateTime:Dr(s,o.version.toTimestamp()),createTime:Dr(s,o.createTime.toTimestamp())}}(r.ct,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:zn(e.version)};else{if(!e.isUnknownDocument())return F();n.unknownDocument={path:t.path.toArray(),version:zn(e.version)}}return n}function Ro(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function zn(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Gn(r){const e=new he(r.seconds,r.nanoseconds);return B.fromTimestamp(e)}function Rn(r,e){const t=(e.baseMutations||[]).map(s=>bc(r.ct,s));for(let s=0;s<e.mutations.length-1;++s){const o=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const c=e.mutations[s+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const n=e.mutations.map(s=>bc(r.ct,s)),i=he.fromMillis(e.localWriteTimeMs);return new wu(e.batchId,i,t,n)}function Si(r){const e=Gn(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?Gn(r.lastLimboFreeSnapshotVersion):B.min();let n;return n=function(s){return s.documents!==void 0}(r.query)?function(s){return U(s.documents.length===1),We(zr(Pm(s.documents[0])))}(r.query):function(s){return We(Vm(s))}(r.query),new Ct(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,_e.fromBase64String(r.resumeToken))}function Mm(r,e){const t=zn(e.snapshotVersion),n=zn(e.lastLimboFreeSnapshotVersion);let i;i=Eo(e.target)?km(r.ct,e.target):Dm(r.ct,e.target)._t;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:qn(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:i}}function Ru(r){const e=Vm({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?bo(e,e.limit,"L"):e}function Ja(r,e){return new Eu(e.largestBatchId,bc(r.ct,e.overlayMutation))}function vd(r,e){const t=e.path.lastSegment();return[r,Ke(e.path.popLast()),t]}function wd(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:zn(n.readTime),documentKey:Ke(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A{getBundleMetadata(e,t){return Td(e).get(t).next(n=>{if(n)return function(s){return{id:s.bundleId,createTime:Gn(s.createTime),version:s.version}}(n)})}saveBundleMetadata(e,t){return Td(e).put(function(i){return{bundleId:i.id,createTime:zn(we(i.createTime)),version:i.version}}(t))}getNamedQuery(e,t){return Ed(e).get(t).next(n=>{if(n)return function(s){return{name:s.name,query:Ru(s.bundledQuery),readTime:Gn(s.readTime)}}(n)})}saveNamedQuery(e,t){return Ed(e).put(function(i){return{name:i.name,readTime:zn(we(i.readTime)),bundledQuery:i.bundledQuery}}(t))}}function Td(r){return Re(r,"bundles")}function Ed(r){return Re(r,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(e,t){this.serializer=e,this.userId=t}static lt(e,t){const n=t.uid||"";return new Xo(e,n)}getOverlay(e,t){return _i(e).get(vd(this.userId,t)).next(n=>n?Ja(this.serializer,n):null)}getOverlays(e,t){const n=gt();return b.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&n.set(i,s)})).next(()=>n)}saveOverlays(e,t,n){const i=[];return n.forEach((s,o)=>{const c=new Eu(t,o);i.push(this.ht(e,c))}),b.waitFor(i)}removeOverlaysForBatchId(e,t,n){const i=new Set;t.forEach(o=>i.add(Ke(o.getCollectionPath())));const s=[];return i.forEach(o=>{const c=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);s.push(_i(e).j("collectionPathOverlayIndex",c))}),b.waitFor(s)}getOverlaysForCollection(e,t,n){const i=gt(),s=Ke(t),o=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return _i(e).U("collectionPathOverlayIndex",o).next(c=>{for(const u of c){const h=Ja(this.serializer,u);i.set(h.getKey(),h)}return i})}getOverlaysForCollectionGroup(e,t,n,i){const s=gt();let o;const c=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return _i(e).J({index:"collectionGroupOverlayIndex",range:c},(u,h,f)=>{const p=Ja(this.serializer,h);s.size()<i||p.largestBatchId===o?(s.set(p.getKey(),p),o=p.largestBatchId):f.done()}).next(()=>s)}ht(e,t){return _i(e).put(function(i,s,o){const[c,u,h]=vd(s,o.mutation.key);return{userId:s,collectionPath:u,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:ts(i.ct,o.mutation)}}(this.serializer,this.userId,t))}}function _i(r){return Re(r,"documentOverlays")}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zA{Pt(e){return Re(e,"globals")}getSessionToken(e){return this.Pt(e).get("sessionToken").next(t=>{const n=t==null?void 0:t.value;return n?_e.fromUint8Array(n):_e.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.Pt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(){}It(e,t){this.Tt(e,t),t.Et()}Tt(e,t){if("nullValue"in e)this.dt(t,5);else if("booleanValue"in e)this.dt(t,10),t.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(t,15),t.At(ce(e.integerValue));else if("doubleValue"in e){const n=ce(e.doubleValue);isNaN(n)?this.dt(t,13):(this.dt(t,15),Qi(n)?t.At(0):t.At(n))}else if("timestampValue"in e){let n=e.timestampValue;this.dt(t,20),typeof n=="string"&&(n=Nt(n)),t.Rt(`${n.seconds||""}`),t.At(n.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,t),this.ft(t);else if("bytesValue"in e)this.dt(t,30),t.gt(sn(e.bytesValue)),this.ft(t);else if("referenceValue"in e)this.yt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.dt(t,45),t.At(n.latitude||0),t.At(n.longitude||0)}else"mapValue"in e?Hp(e)?this.dt(t,Number.MAX_SAFE_INTEGER):Qo(e)?this.wt(e.mapValue,t):(this.St(e.mapValue,t),this.ft(t)):"arrayValue"in e?(this.bt(e.arrayValue,t),this.ft(t)):F()}Vt(e,t){this.dt(t,25),this.Dt(e,t)}Dt(e,t){t.Rt(e)}St(e,t){const n=e.fields||{};this.dt(t,55);for(const i of Object.keys(n))this.Vt(i,t),this.Tt(n[i],t)}wt(e,t){var n,i;const s=e.fields||{};this.dt(t,53);const o="value",c=((i=(n=s[o].arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.length)||0;this.dt(t,15),t.At(ce(c)),this.Vt(o,t),this.Tt(s[o],t)}bt(e,t){const n=e.values||[];this.dt(t,50);for(const i of n)this.Tt(i,t)}yt(e,t){this.dt(t,37),L.fromName(e).path.forEach(n=>{this.dt(t,60),this.Dt(n,t)})}dt(e,t){e.At(t)}ft(e){e.At(2)}}Pn.vt=new Pn;function GA(r){if(r===0)return 8;let e=0;return!(r>>4)&&(e+=4,r<<=4),!(r>>6)&&(e+=2,r<<=2),!(r>>7)&&(e+=1),e}function Ad(r){const e=64-function(n){let i=0;for(let s=0;s<8;++s){const o=GA(255&n[s]);if(i+=o,o!==8)break}return i}(r);return Math.ceil(e/8)}class KA{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ft(n.value),n=t.next();this.Mt()}xt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ot(n.value),n=t.next();this.Nt()}Lt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ft(n);else if(n<2048)this.Ft(960|n>>>6),this.Ft(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ft(480|n>>>12),this.Ft(128|63&n>>>6),this.Ft(128|63&n);else{const i=t.codePointAt(0);this.Ft(240|i>>>18),this.Ft(128|63&i>>>12),this.Ft(128|63&i>>>6),this.Ft(128|63&i)}}this.Mt()}Bt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ot(n);else if(n<2048)this.Ot(960|n>>>6),this.Ot(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ot(480|n>>>12),this.Ot(128|63&n>>>6),this.Ot(128|63&n);else{const i=t.codePointAt(0);this.Ot(240|i>>>18),this.Ot(128|63&i>>>12),this.Ot(128|63&i>>>6),this.Ot(128|63&i)}}this.Nt()}kt(e){const t=this.qt(e),n=Ad(t);this.Qt(1+n),this.buffer[this.position++]=255&n;for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=255&t[i]}Kt(e){const t=this.qt(e),n=Ad(t);this.Qt(1+n),this.buffer[this.position++]=~(255&n);for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}$t(){this.Ut(255),this.Ut(255)}Wt(){this.Gt(255),this.Gt(255)}reset(){this.position=0}seed(e){this.Qt(e.length),this.buffer.set(e,this.position),this.position+=e.length}zt(){return this.buffer.slice(0,this.position)}qt(e){const t=function(s){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,s,!1),new Uint8Array(o.buffer)}(e),n=(128&t[0])!=0;t[0]^=n?255:128;for(let i=1;i<t.length;++i)t[i]^=n?255:0;return t}Ft(e){const t=255&e;t===0?(this.Ut(0),this.Ut(255)):t===255?(this.Ut(255),this.Ut(0)):this.Ut(t)}Ot(e){const t=255&e;t===0?(this.Gt(0),this.Gt(255)):t===255?(this.Gt(255),this.Gt(0)):this.Gt(e)}Mt(){this.Ut(0),this.Ut(1)}Nt(){this.Gt(0),this.Gt(1)}Ut(e){this.Qt(1),this.buffer[this.position++]=e}Gt(e){this.Qt(1),this.buffer[this.position++]=~e}Qt(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const i=new Uint8Array(n);i.set(this.buffer),this.buffer=i}}class WA{constructor(e){this.jt=e}gt(e){this.jt.Ct(e)}Rt(e){this.jt.Lt(e)}At(e){this.jt.kt(e)}Et(){this.jt.$t()}}class HA{constructor(e){this.jt=e}gt(e){this.jt.xt(e)}Rt(e){this.jt.Bt(e)}At(e){this.jt.Kt(e)}Et(){this.jt.Wt()}}class yi{constructor(){this.jt=new KA,this.Ht=new WA(this.jt),this.Jt=new HA(this.jt)}seed(e){this.jt.seed(e)}Yt(e){return e===0?this.Ht:this.Jt}zt(){return this.jt.zt()}reset(){this.jt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(e,t,n,i){this.indexId=e,this.documentKey=t,this.arrayValue=n,this.directionalValue=i}Zt(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.directionalValue,0),t!==e?n.set([0],this.directionalValue.length):++n[n.length-1],new Sn(this.indexId,this.documentKey,this.arrayValue,n)}}function Gt(r,e){let t=r.indexId-e.indexId;return t!==0?t:(t=bd(r.arrayValue,e.arrayValue),t!==0?t:(t=bd(r.directionalValue,e.directionalValue),t!==0?t:L.comparator(r.documentKey,e.documentKey)))}function bd(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rd{constructor(e){this.Xt=new re((t,n)=>ue.comparator(t.field,n.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.en=e.orderBy,this.tn=[];for(const t of e.filters){const n=t;n.isInequality()?this.Xt=this.Xt.add(n):this.tn.push(n)}}get nn(){return this.Xt.size>1}rn(e){if(U(e.collectionGroup===this.collectionId),this.nn)return!1;const t=pc(e);if(t!==void 0&&!this.sn(t))return!1;const n=An(e);let i=new Set,s=0,o=0;for(;s<n.length&&this.sn(n[s]);++s)i=i.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.Xt.size>0){const c=this.Xt.getIterator().getNext();if(!i.has(c.field.canonicalString())){const u=n[s];if(!this.on(c,u)||!this._n(this.en[o++],u))return!1}++s}for(;s<n.length;++s){const c=n[s];if(o>=this.en.length||!this._n(this.en[o++],c))return!1}return!0}an(){if(this.nn)return null;let e=new re(ue.comparator);const t=[];for(const n of this.tn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new oo(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new oo(n.field,0))}for(const n of this.en)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new oo(n.field,n.dir==="asc"?0:1)));return new To(To.UNKNOWN_ID,this.collectionId,t,Hi.empty())}sn(e){for(const t of this.tn)if(this.on(t,e))return!0;return!1}on(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}_n(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fm(r){var e,t;if(U(r instanceof J||r instanceof ne),r instanceof J){if(r instanceof rm){const i=((t=(e=r.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(s=>J.create(r.field,"==",s)))||[];return ne.create(i,"or")}return r}const n=r.filters.map(i=>Fm(i));return ne.create(n,r.op)}function QA(r){if(r.getFilters().length===0)return[];const e=Sc(Fm(r));return U(Um(e)),Rc(e)||Pc(e)?[e]:e.getFilters()}function Rc(r){return r instanceof J}function Pc(r){return r instanceof ne&&gu(r)}function Um(r){return Rc(r)||Pc(r)||function(t){if(t instanceof ne&&yc(t)){for(const n of t.getFilters())if(!Rc(n)&&!Pc(n))return!1;return!0}return!1}(r)}function Sc(r){if(U(r instanceof J||r instanceof ne),r instanceof J)return r;if(r.filters.length===1)return Sc(r.filters[0]);const e=r.filters.map(n=>Sc(n));let t=ne.create(e,r.op);return t=Po(t),Um(t)?t:(U(t instanceof ne),U(Sr(t)),U(t.filters.length>1),t.filters.reduce((n,i)=>Pu(n,i)))}function Pu(r,e){let t;return U(r instanceof J||r instanceof ne),U(e instanceof J||e instanceof ne),t=r instanceof J?e instanceof J?function(i,s){return ne.create([i,s],"and")}(r,e):Pd(r,e):e instanceof J?Pd(e,r):function(i,s){if(U(i.filters.length>0&&s.filters.length>0),Sr(i)&&Sr(s))return em(i,s.getFilters());const o=yc(i)?i:s,c=yc(i)?s:i,u=o.filters.map(h=>Pu(h,c));return ne.create(u,"or")}(r,e),Po(t)}function Pd(r,e){if(Sr(e))return em(e,r.getFilters());{const t=e.filters.map(n=>Pu(r,n));return ne.create(t,"or")}}function Po(r){if(U(r instanceof J||r instanceof ne),r instanceof J)return r;const e=r.getFilters();if(e.length===1)return Po(e[0]);if(Xp(r))return r;const t=e.map(i=>Po(i)),n=[];return t.forEach(i=>{i instanceof J?n.push(i):i instanceof ne&&(i.op===r.op?n.push(...i.filters):n.push(i))}),n.length===1?n[0]:ne.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JA{constructor(){this.un=new Su}addToCollectionParentIndex(e,t){return this.un.add(t),b.resolve()}getCollectionParents(e,t){return b.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return b.resolve()}deleteFieldIndex(e,t){return b.resolve()}deleteAllFieldIndexes(e){return b.resolve()}createTargetIndexes(e,t){return b.resolve()}getDocumentsMatchingTarget(e,t){return b.resolve(null)}getIndexType(e,t){return b.resolve(0)}getFieldIndexes(e,t){return b.resolve([])}getNextCollectionGroupToUpdate(e){return b.resolve(null)}getMinOffset(e,t){return b.resolve(rt.min())}getMinOffsetFromCollectionGroup(e,t){return b.resolve(rt.min())}updateCollectionGroup(e,t,n){return b.resolve()}updateIndexEntries(e,t){return b.resolve()}}class Su{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t]||new re(Q.comparator),s=!i.has(n);return this.index[t]=i.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t];return i&&i.has(n)}getEntries(e){return(this.index[e]||new re(Q.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ys=new Uint8Array(0);class YA{constructor(e,t){this.databaseId=t,this.cn=new Su,this.ln=new gn(n=>qn(n),(n,i)=>_s(n,i)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.cn.has(t)){const n=t.lastSegment(),i=t.popLast();e.addOnCommittedListener(()=>{this.cn.add(t)});const s={collectionId:n,parent:Ke(i)};return Sd(e).put(s)}return b.resolve()}getCollectionParents(e,t){const n=[],i=IDBKeyRange.bound([t,""],[xp(t),""],!1,!0);return Sd(e).U(i).next(s=>{for(const o of s){if(o.collectionId!==t)break;n.push(mt(o.parent))}return n})}addFieldIndex(e,t){const n=Ii(e),i=function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(t);delete i.indexId;const s=n.add(i);if(t.indexState){const o=cr(e);return s.next(c=>{o.put(wd(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const n=Ii(e),i=cr(e),s=ar(e);return n.delete(t.indexId).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Ii(e),n=ar(e),i=cr(e);return t.j().next(()=>n.j()).next(()=>i.j())}createTargetIndexes(e,t){return b.forEach(this.hn(t),n=>this.getIndexType(e,n).next(i=>{if(i===0||i===1){const s=new Rd(n).an();if(s!=null)return this.addFieldIndex(e,s)}}))}getDocumentsMatchingTarget(e,t){const n=ar(e);let i=!0;const s=new Map;return b.forEach(this.hn(t),o=>this.Pn(e,o).next(c=>{i&&(i=!!c),s.set(o,c)})).next(()=>{if(i){let o=K();const c=[];return b.forEach(s,(u,h)=>{D("IndexedDbIndexManager",`Using index ${function(q){return`id=${q.indexId}|cg=${q.collectionGroup}|f=${q.fields.map(Y=>`${Y.fieldPath}:${Y.kind}`).join(",")}`}(u)} to execute ${qn(t)}`);const f=function(q,Y){const te=pc(Y);if(te===void 0)return null;for(const W of Ao(q,te.fieldPath))switch(W.op){case"array-contains-any":return W.value.arrayValue.values||[];case"array-contains":return[W.value]}return null}(h,u),p=function(q,Y){const te=new Map;for(const W of An(Y))for(const v of Ao(q,W.fieldPath))switch(v.op){case"==":case"in":te.set(W.fieldPath.canonicalString(),v.value);break;case"not-in":case"!=":return te.set(W.fieldPath.canonicalString(),v.value),Array.from(te.values())}return null}(h,u),_=function(q,Y){const te=[];let W=!0;for(const v of An(Y)){const g=v.kind===0?od(q,v.fieldPath,q.startAt):ad(q,v.fieldPath,q.startAt);te.push(g.value),W&&(W=g.inclusive)}return new cn(te,W)}(h,u),A=function(q,Y){const te=[];let W=!0;for(const v of An(Y)){const g=v.kind===0?ad(q,v.fieldPath,q.endAt):od(q,v.fieldPath,q.endAt);te.push(g.value),W&&(W=g.inclusive)}return new cn(te,W)}(h,u),C=this.In(u,h,_),N=this.In(u,h,A),V=this.Tn(u,h,p),$=this.En(u.indexId,f,C,_.inclusive,N,A.inclusive,V);return b.forEach($,z=>n.G(z,t.limit).next(q=>{q.forEach(Y=>{const te=L.fromSegments(Y.documentKey);o.has(te)||(o=o.add(te),c.push(te))})}))}).next(()=>c)}return b.resolve(null)})}hn(e){let t=this.ln.get(e);return t||(e.filters.length===0?t=[e]:t=QA(ne.create(e.filters,"and")).map(n=>vc(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt)),this.ln.set(e,t),t)}En(e,t,n,i,s,o,c){const u=(t!=null?t.length:1)*Math.max(n.length,s.length),h=u/(t!=null?t.length:1),f=[];for(let p=0;p<u;++p){const _=t?this.dn(t[p/h]):Ys,A=this.An(e,_,n[p%h],i),C=this.Rn(e,_,s[p%h],o),N=c.map(V=>this.An(e,_,V,!0));f.push(...this.createRange(A,C,N))}return f}An(e,t,n,i){const s=new Sn(e,L.empty(),t,n);return i?s:s.Zt()}Rn(e,t,n,i){const s=new Sn(e,L.empty(),t,n);return i?s.Zt():s}Pn(e,t){const n=new Rd(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next(s=>{let o=null;for(const c of s)n.rn(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o})}getIndexType(e,t){let n=2;const i=this.hn(t);return b.forEach(i,s=>this.Pn(e,s).next(o=>{o?n!==0&&o.fields.length<function(u){let h=new re(ue.comparator),f=!1;for(const p of u.filters)for(const _ of p.getFlattenedFilters())_.field.isKeyField()||(_.op==="array-contains"||_.op==="array-contains-any"?f=!0:h=h.add(_.field));for(const p of u.orderBy)p.field.isKeyField()||(h=h.add(p.field));return h.size+(f?1:0)}(s)&&(n=1):n=0})).next(()=>function(o){return o.limit!==null}(t)&&i.length>1&&n===2?1:n)}Vn(e,t){const n=new yi;for(const i of An(e)){const s=t.data.field(i.fieldPath);if(s==null)return null;const o=n.Yt(i.kind);Pn.vt.It(s,o)}return n.zt()}dn(e){const t=new yi;return Pn.vt.It(e,t.Yt(0)),t.zt()}mn(e,t){const n=new yi;return Pn.vt.It(Bn(this.databaseId,t),n.Yt(function(s){const o=An(s);return o.length===0?0:o[o.length-1].kind}(e))),n.zt()}Tn(e,t,n){if(n===null)return[];let i=[];i.push(new yi);let s=0;for(const o of An(e)){const c=n[s++];for(const u of i)if(this.fn(t,o.fieldPath)&&Xi(c))i=this.gn(i,o,c);else{const h=u.Yt(o.kind);Pn.vt.It(c,h)}}return this.pn(i)}In(e,t,n){return this.Tn(e,t,n.position)}pn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].zt();return t}gn(e,t,n){const i=[...e],s=[];for(const o of n.arrayValue.values||[])for(const c of i){const u=new yi;u.seed(c.zt()),Pn.vt.It(o,u.Yt(t.kind)),s.push(u)}return s}fn(e,t){return!!e.filters.find(n=>n instanceof J&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(e,t){const n=Ii(e),i=cr(e);return(t?n.U("collectionGroupIndex",IDBKeyRange.bound(t,t)):n.U()).next(s=>{const o=[];return b.forEach(s,c=>i.get([c.indexId,this.uid]).next(u=>{o.push(function(f,p){const _=p?new Hi(p.sequenceNumber,new rt(Gn(p.readTime),new L(mt(p.documentKey)),p.largestBatchId)):Hi.empty(),A=f.fields.map(([C,N])=>new oo(ue.fromServerFormat(C),N));return new To(f.indexId,f.collectionGroup,A,_)}(c,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((n,i)=>{const s=n.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:G(n.collectionGroup,i.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,n){const i=Ii(e),s=cr(e);return this.yn(e).next(o=>i.U("collectionGroupIndex",IDBKeyRange.bound(t,t)).next(c=>b.forEach(c,u=>s.put(wd(u.indexId,this.uid,o,n)))))}updateIndexEntries(e,t){const n=new Map;return b.forEach(t,(i,s)=>{const o=n.get(i.collectionGroup);return(o?b.resolve(o):this.getFieldIndexes(e,i.collectionGroup)).next(c=>(n.set(i.collectionGroup,c),b.forEach(c,u=>this.wn(e,i,u).next(h=>{const f=this.Sn(s,u);return h.isEqual(f)?b.resolve():this.bn(e,s,u,h,f)}))))})}Dn(e,t,n,i){return ar(e).put({indexId:i.indexId,uid:this.uid,arrayValue:i.arrayValue,directionalValue:i.directionalValue,orderedDocumentKey:this.mn(n,t.key),documentKey:t.key.path.toArray()})}vn(e,t,n,i){return ar(e).delete([i.indexId,this.uid,i.arrayValue,i.directionalValue,this.mn(n,t.key),t.key.path.toArray()])}wn(e,t,n){const i=ar(e);let s=new re(Gt);return i.J({index:"documentKeyIndex",range:IDBKeyRange.only([n.indexId,this.uid,this.mn(n,t)])},(o,c)=>{s=s.add(new Sn(n.indexId,t,c.arrayValue,c.directionalValue))}).next(()=>s)}Sn(e,t){let n=new re(Gt);const i=this.Vn(t,e);if(i==null)return n;const s=pc(t);if(s!=null){const o=e.data.field(s.fieldPath);if(Xi(o))for(const c of o.arrayValue.values||[])n=n.add(new Sn(t.indexId,e.key,this.dn(c),i))}else n=n.add(new Sn(t.indexId,e.key,Ys,i));return n}bn(e,t,n,i,s){D("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);const o=[];return function(u,h,f,p,_){const A=u.getIterator(),C=h.getIterator();let N=or(A),V=or(C);for(;N||V;){let $=!1,z=!1;if(N&&V){const q=f(N,V);q<0?z=!0:q>0&&($=!0)}else N!=null?z=!0:$=!0;$?(p(V),V=or(C)):z?(_(N),N=or(A)):(N=or(A),V=or(C))}}(i,s,Gt,c=>{o.push(this.Dn(e,t,n,c))},c=>{o.push(this.vn(e,t,n,c))}),b.waitFor(o)}yn(e){let t=1;return cr(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,i,s)=>{s.done(),t=i.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((o,c)=>Gt(o,c)).filter((o,c,u)=>!c||Gt(o,u[c-1])!==0);const i=[];i.push(e);for(const o of n){const c=Gt(o,e),u=Gt(o,t);if(c===0)i[0]=e.Zt();else if(c>0&&u<0)i.push(o),i.push(o.Zt());else if(u>0)break}i.push(t);const s=[];for(let o=0;o<i.length;o+=2){if(this.Cn(i[o],i[o+1]))return[];const c=[i[o].indexId,this.uid,i[o].arrayValue,i[o].directionalValue,Ys,[]],u=[i[o+1].indexId,this.uid,i[o+1].arrayValue,i[o+1].directionalValue,Ys,[]];s.push(IDBKeyRange.bound(c,u))}return s}Cn(e,t){return Gt(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Cd)}getMinOffset(e,t){return b.mapArray(this.hn(t),n=>this.Pn(e,n).next(i=>i||F())).next(Cd)}}function Sd(r){return Re(r,"collectionParents")}function ar(r){return Re(r,"indexEntries")}function Ii(r){return Re(r,"indexConfiguration")}function cr(r){return Re(r,"indexState")}function Cd(r){U(r.length!==0);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const i=r[n].indexState.offset;du(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new rt(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kd={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class Je{constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}static withCacheSize(e){return new Je(e,Je.DEFAULT_COLLECTION_PERCENTILE,Je.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bm(r,e,t){const n=r.store("mutations"),i=r.store("documentMutations"),s=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=n.J({range:o},(f,p,_)=>(c++,_.delete()));s.push(u.next(()=>{U(c===1)}));const h=[];for(const f of t.mutations){const p=jp(e,f.key.path,t.batchId);s.push(i.delete(p)),h.push(f.key)}return b.waitFor(s).next(()=>h)}function So(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw F();e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Je.DEFAULT_COLLECTION_PERCENTILE=10,Je.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Je.DEFAULT=new Je(41943040,Je.DEFAULT_COLLECTION_PERCENTILE,Je.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Je.DISABLED=new Je(-1,0,0);class Zo{constructor(e,t,n,i){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=i,this.Fn={}}static lt(e,t,n,i){U(e.uid!=="");const s=e.isAuthenticated()?e.uid:"";return new Zo(s,t,n,i)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Kt(e).J({index:"userMutationsIndex",range:n},(i,s,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,n,i){const s=pr(e),o=Kt(e);return o.add({}).next(c=>{U(typeof c=="number");const u=new wu(c,t,n,i),h=function(A,C,N){const V=N.baseMutations.map(z=>ts(A.ct,z)),$=N.mutations.map(z=>ts(A.ct,z));return{userId:C,batchId:N.batchId,localWriteTimeMs:N.localWriteTime.toMillis(),baseMutations:V,mutations:$}}(this.serializer,this.userId,u),f=[];let p=new re((_,A)=>G(_.canonicalString(),A.canonicalString()));for(const _ of i){const A=jp(this.userId,_.key.path,c);p=p.add(_.key.path.popLast()),f.push(o.put(h)),f.push(s.put(A,ME))}return p.forEach(_=>{f.push(this.indexManager.addToCollectionParentIndex(e,_))}),e.addOnCommittedListener(()=>{this.Fn[c]=u.keys()}),b.waitFor(f).next(()=>u)})}lookupMutationBatch(e,t){return Kt(e).get(t).next(n=>n?(U(n.userId===this.userId),Rn(this.serializer,n)):null)}Mn(e,t){return this.Fn[t]?b.resolve(this.Fn[t]):this.lookupMutationBatch(e,t).next(n=>{if(n){const i=n.keys();return this.Fn[t]=i,i}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return Kt(e).J({index:"userMutationsIndex",range:i},(o,c,u)=>{c.userId===this.userId&&(U(c.batchId>=n),s=Rn(this.serializer,c)),u.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=-1;return Kt(e).J({index:"userMutationsIndex",range:t,reverse:!0},(i,s,o)=>{n=s.batchId,o.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return Kt(e).U("userMutationsIndex",t).next(n=>n.map(i=>Rn(this.serializer,i)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=ao(this.userId,t.path),i=IDBKeyRange.lowerBound(n),s=[];return pr(e).J({range:i},(o,c,u)=>{const[h,f,p]=o,_=mt(f);if(h===this.userId&&t.path.isEqual(_))return Kt(e).get(p).next(A=>{if(!A)throw F();U(A.userId===this.userId),s.push(Rn(this.serializer,A))});u.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new re(G);const i=[];return t.forEach(s=>{const o=ao(this.userId,s.path),c=IDBKeyRange.lowerBound(o),u=pr(e).J({range:c},(h,f,p)=>{const[_,A,C]=h,N=mt(A);_===this.userId&&s.path.isEqual(N)?n=n.add(C):p.done()});i.push(u)}),b.waitFor(i).next(()=>this.xn(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1,s=ao(this.userId,n),o=IDBKeyRange.lowerBound(s);let c=new re(G);return pr(e).J({range:o},(u,h,f)=>{const[p,_,A]=u,C=mt(_);p===this.userId&&n.isPrefixOf(C)?C.length===i&&(c=c.add(A)):f.done()}).next(()=>this.xn(e,c))}xn(e,t){const n=[],i=[];return t.forEach(s=>{i.push(Kt(e).get(s).next(o=>{if(o===null)throw F();U(o.userId===this.userId),n.push(Rn(this.serializer,o))}))}),b.waitFor(i).next(()=>n)}removeMutationBatch(e,t){return Bm(e._e,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.On(t.batchId)}),b.forEach(n,i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))}On(e){delete this.Fn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return b.resolve();const n=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),i=[];return pr(e).J({range:n},(s,o,c)=>{if(s[0]===this.userId){const u=mt(s[1]);i.push(u)}else c.done()}).next(()=>{U(i.length===0)})})}containsKey(e,t){return qm(e,this.userId,t)}Nn(e){return jm(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function qm(r,e,t){const n=ao(e,t.path),i=n[1],s=IDBKeyRange.lowerBound(n);let o=!1;return pr(r).J({range:s,H:!0},(c,u,h)=>{const[f,p,_]=c;f===e&&p===i&&(o=!0),h.done()}).next(()=>o)}function Kt(r){return Re(r,"mutations")}function pr(r){return Re(r,"documentMutations")}function jm(r){return Re(r,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Kn(0)}static kn(){return new Kn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XA{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.qn(e).next(t=>{const n=new Kn(t.highestTargetId);return t.highestTargetId=n.next(),this.Qn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.qn(e).next(t=>B.fromTimestamp(new he(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.qn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.qn(e).next(i=>(i.highestListenSequenceNumber=t,n&&(i.lastRemoteSnapshotVersion=n.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.Qn(e,i)))}addTargetData(e,t){return this.Kn(e,t).next(()=>this.qn(e).next(n=>(n.targetCount+=1,this.$n(t,n),this.Qn(e,n))))}updateTargetData(e,t){return this.Kn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>ur(e).delete(t.targetId)).next(()=>this.qn(e)).next(n=>(U(n.targetCount>0),n.targetCount-=1,this.Qn(e,n)))}removeTargets(e,t,n){let i=0;const s=[];return ur(e).J((o,c)=>{const u=Si(c);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(i++,s.push(this.removeTargetData(e,u)))}).next(()=>b.waitFor(s)).next(()=>i)}forEachTarget(e,t){return ur(e).J((n,i)=>{const s=Si(i);t(s)})}qn(e){return Dd(e).get("targetGlobalKey").next(t=>(U(t!==null),t))}Qn(e,t){return Dd(e).put("targetGlobalKey",t)}Kn(e,t){return ur(e).put(Mm(this.serializer,t))}$n(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.qn(e).next(t=>t.targetCount)}getTargetData(e,t){const n=qn(t),i=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return ur(e).J({range:i,index:"queryTargetsIndex"},(o,c,u)=>{const h=Si(c);_s(t,h.target)&&(s=h,u.done())}).next(()=>s)}addMatchingKeys(e,t,n){const i=[],s=Ht(e);return t.forEach(o=>{const c=Ke(o.path);i.push(s.put({targetId:n,path:c})),i.push(this.referenceDelegate.addReference(e,n,o))}),b.waitFor(i)}removeMatchingKeys(e,t,n){const i=Ht(e);return b.forEach(t,s=>{const o=Ke(s.path);return b.waitFor([i.delete([n,o]),this.referenceDelegate.removeReference(e,n,s)])})}removeMatchingKeysForTargetId(e,t){const n=Ht(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(i)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),i=Ht(e);let s=K();return i.J({range:n,H:!0},(o,c,u)=>{const h=mt(o[1]),f=new L(h);s=s.add(f)}).next(()=>s)}containsKey(e,t){const n=Ke(t.path),i=IDBKeyRange.bound([n],[xp(n)],!1,!0);let s=0;return Ht(e).J({index:"documentTargetsIndex",H:!0,range:i},([o,c],u,h)=>{o!==0&&(s++,h.done())}).next(()=>s>0)}ot(e,t){return ur(e).get(t).next(n=>n?Si(n):null)}}function ur(r){return Re(r,"targets")}function Dd(r){return Re(r,"targetGlobal")}function Ht(r){return Re(r,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vd([r,e],[t,n]){const i=G(r,t);return i===0?G(e,n):i}class ZA{constructor(e){this.Un=e,this.buffer=new re(Vd),this.Wn=0}Gn(){return++this.Wn}zn(e){const t=[e,this.Gn()];if(this.buffer.size<this.Un)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();Vd(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class eb{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.jn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Hn(6e4)}stop(){this.jn&&(this.jn.cancel(),this.jn=null)}get started(){return this.jn!==null}Hn(e){D("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){mn(t)?D("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await pn(t)}await this.Hn(3e5)})}}class tb{constructor(e,t){this.Jn=e,this.params=t}calculateTargetCount(e,t){return this.Jn.Yn(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return b.resolve(Ye.oe);const n=new ZA(t);return this.Jn.forEachTarget(e,i=>n.zn(i.sequenceNumber)).next(()=>this.Jn.Zn(e,i=>n.zn(i))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Jn.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Jn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),b.resolve(kd)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),kd):this.Xn(e,t))}getCacheSize(e){return this.Jn.getCacheSize(e)}Xn(e,t){let n,i,s,o,c,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(p=>(p>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),i=this.params.maximumSequenceNumbersToCollect):i=p,o=Date.now(),this.nthSequenceNumber(e,i))).next(p=>(n=p,c=Date.now(),this.removeTargets(e,n,t))).next(p=>(s=p,u=Date.now(),this.removeOrphanedDocuments(e,n))).next(p=>(h=Date.now(),lr()<=H.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${i} in `+(c-o)+`ms
	Removed ${s} targets in `+(u-c)+`ms
	Removed ${p} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),b.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:p})))}}function nb(r,e){return new tb(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rb{constructor(e,t){this.db=e,this.garbageCollector=nb(this,t)}Yn(e){const t=this.er(e);return this.db.getTargetCache().getTargetCount(e).next(n=>t.next(i=>n+i))}er(e){let t=0;return this.Zn(e,n=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Zn(e,t){return this.tr(e,(n,i)=>t(i))}addReference(e,t,n){return Xs(e,n)}removeReference(e,t,n){return Xs(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Xs(e,t)}nr(e,t){return function(i,s){let o=!1;return jm(i).Y(c=>qm(i,c,s).next(u=>(u&&(o=!0),b.resolve(!u)))).next(()=>o)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.tr(e,(o,c)=>{if(c<=t){const u=this.nr(e,o).next(h=>{if(!h)return s++,n.getEntry(e,o).next(()=>(n.removeEntry(o,B.min()),Ht(e).delete(function(p){return[0,Ke(p.path)]}(o))))});i.push(u)}}).next(()=>b.waitFor(i)).next(()=>n.apply(e)).next(()=>s)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Xs(e,t)}tr(e,t){const n=Ht(e);let i,s=Ye.oe;return n.J({index:"documentTargetsIndex"},([o,c],{path:u,sequenceNumber:h})=>{o===0?(s!==Ye.oe&&t(new L(mt(i)),s),s=h,i=u):s=Ye.oe}).next(()=>{s!==Ye.oe&&t(new L(mt(i)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Xs(r,e){return Ht(r).put(function(n,i){return{targetId:0,path:Ke(n.path),sequenceNumber:i}}(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{constructor(){this.changes=new gn(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ae.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?b.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ib{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Tn(e).put(n)}removeEntry(e,t,n){return Tn(e).delete(function(s,o){const c=s.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],Ro(o),c[c.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.rr(e,n)))}getEntry(e,t){let n=ae.newInvalidDocument(t);return Tn(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(vi(t))},(i,s)=>{n=this.ir(t,s)}).next(()=>n)}sr(e,t){let n={size:0,document:ae.newInvalidDocument(t)};return Tn(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(vi(t))},(i,s)=>{n={document:this.ir(t,s),size:So(s)}}).next(()=>n)}getEntries(e,t){let n=Ze();return this._r(e,t,(i,s)=>{const o=this.ir(i,s);n=n.insert(i,o)}).next(()=>n)}ar(e,t){let n=Ze(),i=new se(L.comparator);return this._r(e,t,(s,o)=>{const c=this.ir(s,o);n=n.insert(s,c),i=i.insert(s,So(o))}).next(()=>({documents:n,ur:i}))}_r(e,t,n){if(t.isEmpty())return b.resolve();let i=new re(xd);t.forEach(u=>i=i.add(u));const s=IDBKeyRange.bound(vi(i.first()),vi(i.last())),o=i.getIterator();let c=o.getNext();return Tn(e).J({index:"documentKeyIndex",range:s},(u,h,f)=>{const p=L.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;c&&xd(c,p)<0;)n(c,null),c=o.getNext();c&&c.isEqual(p)&&(n(c,h),c=o.hasNext()?o.getNext():null),c?f.$(vi(c)):f.done()}).next(()=>{for(;c;)n(c,null),c=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,t,n,i,s){const o=t.path,c=[o.popLast().toArray(),o.lastSegment(),Ro(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Tn(e).U(IDBKeyRange.bound(c,u,!0)).next(h=>{s==null||s.incrementDocumentReadCount(h.length);let f=Ze();for(const p of h){const _=this.ir(L.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);_.isFoundDocument()&&(Is(t,_)||i.has(_.key))&&(f=f.insert(_.key,_))}return f})}getAllFromCollectionGroup(e,t,n,i){let s=Ze();const o=Od(t,n),c=Od(t,rt.max());return Tn(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(o,c,!0)},(u,h,f)=>{const p=this.ir(L.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);s=s.insert(p.key,p),s.size===i&&f.done()}).next(()=>s)}newChangeBuffer(e){return new sb(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return Nd(e).get("remoteDocumentGlobalKey").next(t=>(U(!!t),t))}rr(e,t){return Nd(e).put("remoteDocumentGlobalKey",t)}ir(e,t){if(t){const n=jA(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(B.min())))return n}return ae.newInvalidDocument(e)}}function zm(r){return new ib(r)}class sb extends $m{constructor(e,t){super(),this.cr=e,this.trackRemovals=t,this.lr=new gn(n=>n.toString(),(n,i)=>n.isEqual(i))}applyChanges(e){const t=[];let n=0,i=new re((s,o)=>G(s.canonicalString(),o.canonicalString()));return this.changes.forEach((s,o)=>{const c=this.lr.get(s);if(t.push(this.cr.removeEntry(e,s,c.readTime)),o.isValidDocument()){const u=Id(this.cr.serializer,o);i=i.add(s.path.popLast());const h=So(u);n+=h-c.size,t.push(this.cr.addEntry(e,s,u))}else if(n-=c.size,this.trackRemovals){const u=Id(this.cr.serializer,o.convertToNoDocument(B.min()));t.push(this.cr.addEntry(e,s,u))}}),i.forEach(s=>{t.push(this.cr.indexManager.addToCollectionParentIndex(e,s))}),t.push(this.cr.updateMetadata(e,n)),b.waitFor(t)}getFromCache(e,t){return this.cr.sr(e,t).next(n=>(this.lr.set(t,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(e,t){return this.cr.ar(e,t).next(({documents:n,ur:i})=>(i.forEach((s,o)=>{this.lr.set(s,{size:o,readTime:n.get(s).readTime})}),n))}}function Nd(r){return Re(r,"remoteDocumentGlobal")}function Tn(r){return Re(r,"remoteDocumentsV14")}function vi(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Od(r,e){const t=e.documentKey.path.toArray();return[r,Ro(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function xd(r,e){const t=r.path.toArray(),n=e.path.toArray();let i=0;for(let s=0;s<t.length-2&&s<n.length-2;++s)if(i=G(t[s],n[s]),i)return i;return i=G(t.length,n.length),i||(i=G(t[t.length-2],n[n.length-2]),i||G(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(e,t,n,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=i}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(n=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(n!==null&&xi(n.mutation,i,Xe.empty(),he.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,K()).next(()=>n))}getLocalViewOfDocuments(e,t,n=K()){const i=gt();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,n).next(s=>{let o=Ri();return s.forEach((c,u)=>{o=o.insert(c,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const n=gt();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,K()))}populateOverlays(e,t,n){const i=[];return n.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,c)=>{t.set(o,c)})})}computeViews(e,t,n,i){let s=Ze();const o=Oi(),c=function(){return Oi()}();return t.forEach((u,h)=>{const f=n.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof Ft)?s=s.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),xi(f.mutation,h,f.mutation.getFieldMask(),he.now())):o.set(h.key,Xe.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((h,f)=>o.set(h,f)),t.forEach((h,f)=>{var p;return c.set(h,new ob(f,(p=o.get(h))!==null&&p!==void 0?p:null))}),c))}recalculateAndSaveOverlays(e,t){const n=Oi();let i=new se((o,c)=>o-c),s=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const c of o)c.keys().forEach(u=>{const h=t.get(u);if(h===null)return;let f=n.get(u)||Xe.empty();f=c.applyToLocalView(h,f),n.set(u,f);const p=(i.get(c.batchId)||K()).add(u);i=i.insert(c.batchId,p)})}).next(()=>{const o=[],c=i.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),h=u.key,f=u.value,p=lm();f.forEach(_=>{if(!s.has(_)){const A=_m(t.get(_),n.get(_));A!==null&&p.set(_,A),s=s.add(_)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,p))}return b.waitFor(o)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,i){return function(o){return L.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):_u(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,i):this.getDocumentsMatchingCollectionQuery(e,t,n,i)}getNextDocuments(e,t,n,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,i-s.size):b.resolve(gt());let c=-1,u=s;return o.next(h=>b.forEach(h,(f,p)=>(c<p.largestBatchId&&(c=p.largestBatchId),s.get(f)?b.resolve():this.remoteDocumentCache.getEntry(e,f).next(_=>{u=u.insert(f,_)}))).next(()=>this.populateOverlays(e,h,s)).next(()=>this.computeViews(e,u,h,K())).next(f=>({batchId:c,changes:um(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(n=>{let i=Ri();return n.isFoundDocument()&&(i=i.insert(n.key,n)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,n,i){const s=t.collectionGroup;let o=Ri();return this.indexManager.getCollectionParents(e,s).next(c=>b.forEach(c,u=>{const h=function(p,_){return new Mt(_,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(t,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,n,i).next(f=>{f.forEach((p,_)=>{o=o.insert(p,_)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,n,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,i))).next(o=>{s.forEach((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,ae.newInvalidDocument(f)))});let c=Ri();return o.forEach((u,h)=>{const f=s.get(u);f!==void 0&&xi(f.mutation,h,Xe.empty(),he.now()),Is(t,h)&&(c=c.insert(u,h))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ab{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return b.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:we(i.createTime)}}(t)),b.resolve()}getNamedQuery(e,t){return b.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:Ru(i.bundledQuery),readTime:we(i.readTime)}}(t)),b.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cb{constructor(){this.overlays=new se(L.comparator),this.Ir=new Map}getOverlay(e,t){return b.resolve(this.overlays.get(t))}getOverlays(e,t){const n=gt();return b.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&n.set(i,s)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((i,s)=>{this.ht(e,t,s)}),b.resolve()}removeOverlaysForBatchId(e,t,n){const i=this.Ir.get(n);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(n)),b.resolve()}getOverlaysForCollection(e,t,n){const i=gt(),s=t.length+1,o=new L(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>n&&i.set(u.getKey(),u)}return b.resolve(i)}getOverlaysForCollectionGroup(e,t,n,i){let s=new se((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let f=s.get(h.largestBatchId);f===null&&(f=gt(),s=s.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=gt(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,f)=>c.set(h,f)),!(c.size()>=i)););return b.resolve(c)}ht(e,t,n){const i=this.overlays.get(n.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(n.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Eu(t,n));let s=this.Ir.get(t);s===void 0&&(s=K(),this.Ir.set(t,s)),this.Ir.set(t,s.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ub{constructor(){this.sessionToken=_e.EMPTY_BYTE_STRING}getSessionToken(e){return b.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,b.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(){this.Tr=new re(Pe.Er),this.dr=new re(Pe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const n=new Pe(e,t);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Vr(new Pe(e,t))}mr(e,t){e.forEach(n=>this.removeReference(n,t))}gr(e){const t=new L(new Q([])),n=new Pe(t,e),i=new Pe(t,e+1),s=[];return this.dr.forEachInRange([n,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new L(new Q([])),n=new Pe(t,e),i=new Pe(t,e+1);let s=K();return this.dr.forEachInRange([n,i],o=>{s=s.add(o.key)}),s}containsKey(e){const t=new Pe(e,0),n=this.Tr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Pe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return L.comparator(e.key,t.key)||G(e.wr,t.wr)}static Ar(e,t){return G(e.wr,t.wr)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lb{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new re(Pe.Er)}checkEmpty(e){return b.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new wu(s,t,n,i);this.mutationQueue.push(o);for(const c of i)this.br=this.br.add(new Pe(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return b.resolve(o)}lookupMutationBatch(e,t){return b.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=this.vr(n),s=i<0?0:i;return b.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return b.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return b.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Pe(t,0),i=new Pe(t,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([n,i],o=>{const c=this.Dr(o.wr);s.push(c)}),b.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new re(G);return t.forEach(i=>{const s=new Pe(i,0),o=new Pe(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],c=>{n=n.add(c.wr)})}),b.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1;let s=n;L.isDocumentKey(s)||(s=s.child(""));const o=new Pe(new L(s),0);let c=new re(G);return this.br.forEachWhile(u=>{const h=u.key.path;return!!n.isPrefixOf(h)&&(h.length===i&&(c=c.add(u.wr)),!0)},o),b.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(n=>{const i=this.Dr(n);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){U(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.br;return b.forEach(t.mutations,i=>{const s=new Pe(i.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=n})}On(e){}containsKey(e,t){const n=new Pe(t,0),i=this.br.firstAfterOrEqual(n);return b.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,b.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hb{constructor(e){this.Mr=e,this.docs=function(){return new se(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,i=this.docs.get(n),s=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return b.resolve(n?n.document.mutableCopy():ae.newInvalidDocument(t))}getEntries(e,t){let n=Ze();return t.forEach(i=>{const s=this.docs.get(i);n=n.insert(i,s?s.document.mutableCopy():ae.newInvalidDocument(i))}),b.resolve(n)}getDocumentsMatchingQuery(e,t,n,i){let s=Ze();const o=t.path,c=new L(o.child("")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||du(Mp(f),n)<=0||(i.has(f.key)||Is(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return b.resolve(s)}getAllFromCollectionGroup(e,t,n,i){F()}Or(e,t){return b.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new db(this)}getSize(e){return b.resolve(this.size)}}class db extends $m{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((n,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(n)}),b.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fb{constructor(e){this.persistence=e,this.Nr=new gn(t=>qn(t),_s),this.lastRemoteSnapshotVersion=B.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Cu,this.targetCount=0,this.kr=Kn.Bn()}forEachTarget(e,t){return this.Nr.forEach((n,i)=>t(i)),b.resolve()}getLastRemoteSnapshotVersion(e){return b.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return b.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),b.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Lr&&(this.Lr=t),b.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Kn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,b.resolve()}updateTargetData(e,t){return this.Kn(t),b.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,b.resolve()}removeTargets(e,t,n){let i=0;const s=[];return this.Nr.forEach((o,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)}),b.waitFor(s).next(()=>i)}getTargetCount(e){return b.resolve(this.targetCount)}getTargetData(e,t){const n=this.Nr.get(t)||null;return b.resolve(n)}addMatchingKeys(e,t,n){return this.Br.Rr(t,n),b.resolve()}removeMatchingKeys(e,t,n){this.Br.mr(t,n);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),b.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),b.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Br.yr(t);return b.resolve(n)}containsKey(e,t){return b.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Ye(0),this.Kr=!1,this.Kr=!0,this.$r=new ub,this.referenceDelegate=e(this),this.Ur=new fb(this),this.indexManager=new JA,this.remoteDocumentCache=function(i){return new hb(i)}(n=>this.referenceDelegate.Wr(n)),this.serializer=new Lm(t),this.Gr=new ab(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new cb,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.qr[e.toKey()];return n||(n=new lb(t,this.referenceDelegate),this.qr[e.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,n){D("MemoryPersistence","Starting transaction:",e);const i=new pb(this.Qr.next());return this.referenceDelegate.zr(),n(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,t){return b.or(Object.values(this.qr).map(n=>()=>n.containsKey(e,t)))}}class pb extends Up{constructor(e){super(),this.currentSequenceNumber=e}}class ea{constructor(e){this.persistence=e,this.Jr=new Cu,this.Yr=null}static Zr(e){return new ea(e)}get Xr(){if(this.Yr)return this.Yr;throw F()}addReference(e,t,n){return this.Jr.addReference(n,t),this.Xr.delete(n.toString()),b.resolve()}removeReference(e,t,n){return this.Jr.removeReference(n,t),this.Xr.add(n.toString()),b.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),b.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>n.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return b.forEach(this.Xr,n=>{const i=L.fromPath(n);return this.ei(e,i).next(s=>{s||t.removeEntry(i,B.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(n=>{n?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return b.or([()=>b.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mb{constructor(e){this.serializer=e}O(e,t,n,i){const s=new Wo("createOrUpgrade",t);n<1&&i>=1&&(function(u){u.createObjectStore("owner")}(e),function(u){u.createObjectStore("mutationQueues",{keyPath:"userId"}),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",Qh,{unique:!0}),u.createObjectStore("documentMutations")}(e),Ld(e),function(u){u.createObjectStore("remoteDocuments")}(e));let o=b.resolve();return n<3&&i>=3&&(n!==0&&(function(u){u.deleteObjectStore("targetDocuments"),u.deleteObjectStore("targets"),u.deleteObjectStore("targetGlobal")}(e),Ld(e)),o=o.next(()=>function(u){const h=u.store("targetGlobal"),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:B.min().toTimestamp(),targetCount:0};return h.put("targetGlobalKey",f)}(s))),n<4&&i>=4&&(n!==0&&(o=o.next(()=>function(u,h){return h.store("mutations").U().next(f=>{u.deleteObjectStore("mutations"),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",Qh,{unique:!0});const p=h.store("mutations"),_=f.map(A=>p.put(A));return b.waitFor(_)})}(e,s))),o=o.next(()=>{(function(u){u.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)})),n<5&&i>=5&&(o=o.next(()=>this.ni(s))),n<6&&i>=6&&(o=o.next(()=>(function(u){u.createObjectStore("remoteDocumentGlobal")}(e),this.ri(s)))),n<7&&i>=7&&(o=o.next(()=>this.ii(s))),n<8&&i>=8&&(o=o.next(()=>this.si(e,s))),n<9&&i>=9&&(o=o.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),n<10&&i>=10&&(o=o.next(()=>this.oi(s))),n<11&&i>=11&&(o=o.next(()=>{(function(u){u.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(u){u.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),n<12&&i>=12&&(o=o.next(()=>{(function(u){const h=u.createObjectStore("documentOverlays",{keyPath:QE});h.createIndex("collectionPathOverlayIndex",JE,{unique:!1}),h.createIndex("collectionGroupOverlayIndex",YE,{unique:!1})})(e)})),n<13&&i>=13&&(o=o.next(()=>function(u){const h=u.createObjectStore("remoteDocumentsV14",{keyPath:FE});h.createIndex("documentKeyIndex",UE),h.createIndex("collectionGroupIndex",BE)}(e)).next(()=>this._i(e,s)).next(()=>e.deleteObjectStore("remoteDocuments"))),n<14&&i>=14&&(o=o.next(()=>this.ai(e,s))),n<15&&i>=15&&(o=o.next(()=>function(u){u.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),u.createObjectStore("indexState",{keyPath:GE}).createIndex("sequenceNumberIndex",KE,{unique:!1}),u.createObjectStore("indexEntries",{keyPath:WE}).createIndex("documentKeyIndex",HE,{unique:!1})}(e))),n<16&&i>=16&&(o=o.next(()=>{t.objectStore("indexState").clear()}).next(()=>{t.objectStore("indexEntries").clear()})),n<17&&i>=17&&(o=o.next(()=>{(function(u){u.createObjectStore("globals",{keyPath:"name"})})(e)})),o}ri(e){let t=0;return e.store("remoteDocuments").J((n,i)=>{t+=So(i)}).next(()=>{const n={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",n)})}ni(e){const t=e.store("mutationQueues"),n=e.store("mutations");return t.U().next(i=>b.forEach(i,s=>{const o=IDBKeyRange.bound([s.userId,-1],[s.userId,s.lastAcknowledgedBatchId]);return n.U("userMutationsIndex",o).next(c=>b.forEach(c,u=>{U(u.userId===s.userId);const h=Rn(this.serializer,u);return Bm(e,s.userId,h).next(()=>{})}))}))}ii(e){const t=e.store("targetDocuments"),n=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(i=>{const s=[];return n.J((o,c)=>{const u=new Q(o),h=function(p){return[0,Ke(p)]}(u);s.push(t.get(h).next(f=>f?b.resolve():(p=>t.put({targetId:0,path:Ke(p),sequenceNumber:i.highestListenSequenceNumber}))(u)))}).next(()=>b.waitFor(s))})}si(e,t){e.createObjectStore("collectionParents",{keyPath:zE});const n=t.store("collectionParents"),i=new Su,s=o=>{if(i.add(o)){const c=o.lastSegment(),u=o.popLast();return n.put({collectionId:c,parent:Ke(u)})}};return t.store("remoteDocuments").J({H:!0},(o,c)=>{const u=new Q(o);return s(u.popLast())}).next(()=>t.store("documentMutations").J({H:!0},([o,c,u],h)=>{const f=mt(c);return s(f.popLast())}))}oi(e){const t=e.store("targets");return t.J((n,i)=>{const s=Si(i),o=Mm(this.serializer,s);return t.put(o)})}_i(e,t){const n=t.store("remoteDocuments"),i=[];return n.J((s,o)=>{const c=t.store("remoteDocumentsV14"),u=function(p){return p.document?new L(Q.fromString(p.document.name).popFirst(5)):p.noDocument?L.fromSegments(p.noDocument.path):p.unknownDocument?L.fromSegments(p.unknownDocument.path):F()}(o).path.toArray(),h={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};i.push(c.put(h))}).next(()=>b.waitFor(i))}ai(e,t){const n=t.store("mutations"),i=zm(this.serializer),s=new Km(ea.Zr,this.serializer.ct);return n.U().next(o=>{const c=new Map;return o.forEach(u=>{var h;let f=(h=c.get(u.userId))!==null&&h!==void 0?h:K();Rn(this.serializer,u).keys().forEach(p=>f=f.add(p)),c.set(u.userId,f)}),b.forEach(c,(u,h)=>{const f=new Se(h),p=Xo.lt(this.serializer,f),_=s.getIndexManager(f),A=Zo.lt(f,this.serializer,_,s.referenceDelegate);return new Gm(i,A,p,_).recalculateAndSaveOverlaysForDocumentKeys(new mc(t,Ye.oe),u).next()})})}}function Ld(r){r.createObjectStore("targetDocuments",{keyPath:jE}).createIndex("documentTargetsIndex",$E,{unique:!0}),r.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",qE,{unique:!0}),r.createObjectStore("targetGlobal")}const Ya="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class ku{constructor(e,t,n,i,s,o,c,u,h,f,p=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.ui=s,this.window=o,this.document=c,this.ci=h,this.li=f,this.hi=p,this.Qr=null,this.Kr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Pi=null,this.inForeground=!1,this.Ii=null,this.Ti=null,this.Ei=Number.NEGATIVE_INFINITY,this.di=_=>Promise.resolve(),!ku.D())throw new k(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new rb(this,i),this.Ai=t+"main",this.serializer=new Lm(u),this.Ri=new _t(this.Ai,this.hi,new mb(this.serializer)),this.$r=new zA,this.Ur=new XA(this.referenceDelegate,this.serializer),this.remoteDocumentCache=zm(this.serializer),this.Gr=new $A,this.window&&this.window.localStorage?this.Vi=this.window.localStorage:(this.Vi=null,f===!1&&ve("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.mi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new k(P.FAILED_PRECONDITION,Ya);return this.fi(),this.gi(),this.pi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Ur.getHighestSequenceNumber(e))}).then(e=>{this.Qr=new Ye(e,this.ci)}).then(()=>{this.Kr=!0}).catch(e=>(this.Ri&&this.Ri.close(),Promise.reject(e)))}yi(e){return this.di=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ri.L(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.ui.enqueueAndForget(async()=>{this.started&&await this.mi()}))}mi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>Zs(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.wi(e).next(t=>{t||(this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)))})}).next(()=>this.Si(e)).next(t=>this.isPrimary&&!t?this.bi(e).next(()=>!1):!!t&&this.Di(e).next(()=>!0))).catch(e=>{if(mn(e))return D("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return D("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.ui.enqueueRetryable(()=>this.di(e)),this.isPrimary=e})}wi(e){return wi(e).get("owner").next(t=>b.resolve(this.vi(t)))}Ci(e){return Zs(e).delete(this.clientId)}async Fi(){if(this.isPrimary&&!this.Mi(this.Ei,18e5)){this.Ei=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const n=Re(t,"clientMetadata");return n.U().next(i=>{const s=this.xi(i,18e5),o=i.filter(c=>s.indexOf(c)===-1);return b.forEach(o,c=>n.delete(c.clientId)).next(()=>o)})}).catch(()=>[]);if(this.Vi)for(const t of e)this.Vi.removeItem(this.Oi(t.clientId))}}pi(){this.Ti=this.ui.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.mi().then(()=>this.Fi()).then(()=>this.pi()))}vi(e){return!!e&&e.ownerId===this.clientId}Si(e){return this.li?b.resolve(!0):wi(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)){if(this.vi(t)&&this.networkEnabled)return!0;if(!this.vi(t)){if(!t.allowTabSynchronization)throw new k(P.FAILED_PRECONDITION,Ya);return!1}}return!(!this.networkEnabled||!this.inForeground)||Zs(e).U().next(n=>this.xi(n,5e3).find(i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,o=!this.inForeground&&i.inForeground,c=this.networkEnabled===i.networkEnabled;if(s||o&&c)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&D("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.Kr=!1,this.Li(),this.Ti&&(this.Ti.cancel(),this.Ti=null),this.Bi(),this.ki(),await this.Ri.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{const t=new mc(e,Ye.oe);return this.bi(t).next(()=>this.Ci(t))}),this.Ri.close(),this.qi()}xi(e,t){return e.filter(n=>this.Mi(n.updateTimeMs,t)&&!this.Ni(n.clientId))}Qi(){return this.runTransaction("getActiveClients","readonly",e=>Zs(e).U().next(t=>this.xi(t,18e5).map(n=>n.clientId)))}get started(){return this.Kr}getGlobalsCache(){return this.$r}getMutationQueue(e,t){return Zo.lt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new YA(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return Xo.lt(this.serializer,e)}getBundleCache(){return this.Gr}runTransaction(e,t,n){D("IndexedDbPersistence","Starting transaction:",e);const i=t==="readonly"?"readonly":"readwrite",s=function(u){return u===17?eA:u===16?ZE:u===15?pu:u===14?Gp:u===13?zp:u===12?XE:u===11?$p:void F()}(this.hi);let o;return this.Ri.runTransaction(e,i,s,c=>(o=new mc(c,this.Qr?this.Qr.next():Ye.oe),t==="readwrite-primary"?this.wi(o).next(u=>!!u||this.Si(o)).next(u=>{if(!u)throw ve(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)),new k(P.FAILED_PRECONDITION,Fp);return n(o)}).next(u=>this.Di(o).next(()=>u)):this.Ki(o).next(()=>n(o)))).then(c=>(o.raiseOnCommittedEvent(),c))}Ki(e){return wi(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)&&!this.vi(t)&&!(this.li||this.allowTabSynchronization&&t.allowTabSynchronization))throw new k(P.FAILED_PRECONDITION,Ya)})}Di(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return wi(e).put("owner",t)}static D(){return _t.D()}bi(e){const t=wi(e);return t.get("owner").next(n=>this.vi(n)?(D("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):b.resolve())}Mi(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(ve(`Detected an update time that is in the future: ${e} > ${n}`),!1))}fi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ii=()=>{this.ui.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.mi()))},this.document.addEventListener("visibilitychange",this.Ii),this.inForeground=this.document.visibilityState==="visible")}Bi(){this.Ii&&(this.document.removeEventListener("visibilitychange",this.Ii),this.Ii=null)}gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Pi=()=>{this.Li();const t=/(?:Version|Mobile)\/1[456]/;mf()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.ui.enterRestrictedMode(!0),this.ui.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Pi))}ki(){this.Pi&&(this.window.removeEventListener("pagehide",this.Pi),this.Pi=null)}Ni(e){var t;try{const n=((t=this.Vi)===null||t===void 0?void 0:t.getItem(this.Oi(e)))!==null;return D("IndexedDbPersistence",`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return ve("IndexedDbPersistence","Failed to get zombied client id.",n),!1}}Li(){if(this.Vi)try{this.Vi.setItem(this.Oi(this.clientId),String(Date.now()))}catch(e){ve("Failed to set zombie client id.",e)}}qi(){if(this.Vi)try{this.Vi.removeItem(this.Oi(this.clientId))}catch{}}Oi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function wi(r){return Re(r,"owner")}function Zs(r){return Re(r,"clientMetadata")}function Du(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vu{constructor(e,t,n,i){this.targetId=e,this.fromCache=t,this.$i=n,this.Ui=i}static Wi(e,t){let n=K(),i=K();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Vu(e,t.fromCache,n,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gb{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wm{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return mf()?8:Bp(fe())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,n,i){const s={result:null};return this.Yi(e,t).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,t,i,n).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new gb;return this.Xi(e,t,o).next(c=>{if(s.result=c,this.zi)return this.es(e,t,o,c.size)})}).next(()=>s.result)}es(e,t,n,i){return n.documentReadCount<this.ji?(lr()<=H.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",hr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),b.resolve()):(lr()<=H.DEBUG&&D("QueryEngine","Query:",hr(t),"scans",n.documentReadCount,"local documents and returns",i,"documents as results."),n.documentReadCount>this.Hi*i?(lr()<=H.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",hr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,We(t))):b.resolve())}Yi(e,t){if(cd(t))return b.resolve(null);let n=We(t);return this.indexManager.getIndexType(e,n).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=bo(t,null,"F"),n=We(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(s=>{const o=K(...s);return this.Ji.getDocuments(e,o).next(c=>this.indexManager.getMinOffset(e,n).next(u=>{const h=this.ts(t,c);return this.ns(t,h,o,u.readTime)?this.Yi(e,bo(t,null,"F")):this.rs(e,h,t,u)}))})))}Zi(e,t,n,i){return cd(t)||i.isEqual(B.min())?b.resolve(null):this.Ji.getDocuments(e,n).next(s=>{const o=this.ts(t,s);return this.ns(t,o,n,i)?b.resolve(null):(lr()<=H.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),hr(t)),this.rs(e,o,t,Lp(i,-1)).next(c=>c))})}ts(e,t){let n=new re(am(e));return t.forEach((i,s)=>{Is(e,s)&&(n=n.add(s))}),n}ns(e,t,n,i){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,t,n){return lr()<=H.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",hr(t)),this.Ji.getDocumentsMatchingQuery(e,t,rt.min(),n)}rs(e,t,n,i){return this.Ji.getDocumentsMatchingQuery(e,n,i).next(s=>(t.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _b{constructor(e,t,n,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new se(G),this._s=new gn(s=>qn(s),_s),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(n)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Gm(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function Hm(r,e,t,n){return new _b(r,e,t,n)}async function Qm(r,e){const t=M(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let i;return t.mutationQueue.getAllMutationBatches(n).next(s=>(i=s,t.ls(e),t.mutationQueue.getAllMutationBatches(n))).next(s=>{const o=[],c=[];let u=K();for(const h of i){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of s){c.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(n,u).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:c}))})})}function yb(r,e){const t=M(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const i=e.batch.keys(),s=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,u,h,f){const p=h.batch,_=p.keys();let A=b.resolve();return _.forEach(C=>{A=A.next(()=>f.getEntry(u,C)).next(N=>{const V=h.docVersions.get(C);U(V!==null),N.version.compareTo(V)<0&&(p.applyToRemoteDocument(N,h),N.isValidDocument()&&(N.setReadTime(h.commitVersion),f.addEntry(N)))})}),A.next(()=>c.mutationQueue.removeMutationBatch(u,p))}(t,n,e,s).next(()=>s.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(c){let u=K();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(u=u.add(c.batch.mutations[h].key));return u}(e))).next(()=>t.localDocuments.getDocuments(n,i))})}function Jm(r){const e=M(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function Ib(r,e){const t=M(r),n=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const c=[];e.targetChanges.forEach((f,p)=>{const _=i.get(p);if(!_)return;c.push(t.Ur.removeMatchingKeys(s,f.removedDocuments,p).next(()=>t.Ur.addMatchingKeys(s,f.addedDocuments,p)));let A=_.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?A=A.withResumeToken(_e.EMPTY_BYTE_STRING,B.min()).withLastLimboFreeSnapshotVersion(B.min()):f.resumeToken.approximateByteSize()>0&&(A=A.withResumeToken(f.resumeToken,n)),i=i.insert(p,A),function(N,V,$){return N.resumeToken.approximateByteSize()===0||V.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=3e8?!0:$.addedDocuments.size+$.modifiedDocuments.size+$.removedDocuments.size>0}(_,A,f)&&c.push(t.Ur.updateTargetData(s,A))});let u=Ze(),h=K();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))}),c.push(Ym(s,o,e.documentUpdates).next(f=>{u=f.Ps,h=f.Is})),!n.isEqual(B.min())){const f=t.Ur.getLastRemoteSnapshotVersion(s).next(p=>t.Ur.setTargetsMetadata(s,s.currentSequenceNumber,n));c.push(f)}return b.waitFor(c).next(()=>o.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,u,h)).next(()=>u)}).then(s=>(t.os=i,s))}function Ym(r,e,t){let n=K(),i=K();return t.forEach(s=>n=n.add(s)),e.getEntries(r,n).next(s=>{let o=Ze();return t.forEach((c,u)=>{const h=s.get(c);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(c)),u.isNoDocument()&&u.version.isEqual(B.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):D("LocalStore","Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",u.version)}),{Ps:o,Is:i}})}function vb(r,e){const t=M(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function Vr(r,e){const t=M(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let i;return t.Ur.getTargetData(n,e).next(s=>s?(i=s,b.resolve(i)):t.Ur.allocateTargetId(n).next(o=>(i=new Ct(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.Ur.addTargetData(n,i).next(()=>i))))}).then(n=>{const i=t.os.get(n.targetId);return(i===null||n.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(n.targetId,n),t._s.set(e,n.targetId)),n})}async function Nr(r,e,t){const n=M(r),i=n.os.get(e),s=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",s,o=>n.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!mn(o))throw o;D("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}n.os=n.os.remove(e),n._s.delete(i.target)}function Co(r,e,t){const n=M(r);let i=B.min(),s=K();return n.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,f){const p=M(u),_=p._s.get(f);return _!==void 0?b.resolve(p.os.get(_)):p.Ur.getTargetData(h,f)}(n,o,We(e)).next(c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,n.Ur.getMatchingKeysForTargetId(o,c.targetId).next(u=>{s=u})}).next(()=>n.ss.getDocumentsMatchingQuery(o,e,t?i:B.min(),t?s:K())).next(c=>(eg(n,om(e),c),{documents:c,Ts:s})))}function Xm(r,e){const t=M(r),n=M(t.Ur),i=t.os.get(e);return i?Promise.resolve(i.target):t.persistence.runTransaction("Get target data","readonly",s=>n.ot(s,e).next(o=>o?o.target:null))}function Zm(r,e){const t=M(r),n=t.us.get(e)||B.min();return t.persistence.runTransaction("Get new document changes","readonly",i=>t.cs.getAllFromCollectionGroup(i,e,Lp(n,-1),Number.MAX_SAFE_INTEGER)).then(i=>(eg(t,e,i),i))}function eg(r,e,t){let n=r.us.get(e)||B.min();t.forEach((i,s)=>{s.readTime.compareTo(n)>0&&(n=s.readTime)}),r.us.set(e,n)}async function wb(r,e,t,n){const i=M(r);let s=K(),o=Ze();for(const h of t){const f=e.Es(h.metadata.name);h.document&&(s=s.add(f));const p=e.ds(h);p.setReadTime(e.As(h.metadata.readTime)),o=o.insert(f,p)}const c=i.cs.newChangeBuffer({trackRemovals:!0}),u=await Vr(i,function(f){return We(zr(Q.fromString(`__bundle__/docs/${f}`)))}(n));return i.persistence.runTransaction("Apply bundle documents","readwrite",h=>Ym(h,c,o).next(f=>(c.apply(h),f)).next(f=>i.Ur.removeMatchingKeysForTargetId(h,u.targetId).next(()=>i.Ur.addMatchingKeys(h,s,u.targetId)).next(()=>i.localDocuments.getLocalViewOfDocuments(h,f.Ps,f.Is)).next(()=>f.Ps)))}async function Tb(r,e,t=K()){const n=await Vr(r,We(Ru(e.bundledQuery))),i=M(r);return i.persistence.runTransaction("Save named query","readwrite",s=>{const o=we(e.readTime);if(n.snapshotVersion.compareTo(o)>=0)return i.Gr.saveNamedQuery(s,e);const c=n.withResumeToken(_e.EMPTY_BYTE_STRING,o);return i.os=i.os.insert(c.targetId,c),i.Ur.updateTargetData(s,c).next(()=>i.Ur.removeMatchingKeysForTargetId(s,n.targetId)).next(()=>i.Ur.addMatchingKeys(s,t,n.targetId)).next(()=>i.Gr.saveNamedQuery(s,e))})}function Md(r,e){return`firestore_clients_${r}_${e}`}function Fd(r,e,t){let n=`firestore_mutations_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}function Xa(r,e){return`firestore_targets_${r}_${e}`}class ko{constructor(e,t,n,i){this.user=e,this.batchId=t,this.state=n,this.error=i}static Rs(e,t,n){const i=JSON.parse(n);let s,o=typeof i=="object"&&["pending","acknowledged","rejected"].indexOf(i.state)!==-1&&(i.error===void 0||typeof i.error=="object");return o&&i.error&&(o=typeof i.error.message=="string"&&typeof i.error.code=="string",o&&(s=new k(i.error.code,i.error.message))),o?new ko(e,t,i.state,s):(ve("SharedClientState",`Failed to parse mutation state for ID '${t}': ${n}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Li{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Rs(e,t){const n=JSON.parse(t);let i,s=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return s&&n.error&&(s=typeof n.error.message=="string"&&typeof n.error.code=="string",s&&(i=new k(n.error.code,n.error.message))),s?new Li(e,n.state,i):(ve("SharedClientState",`Failed to parse target state for ID '${e}': ${t}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Do{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Rs(e,t){const n=JSON.parse(t);let i=typeof n=="object"&&n.activeTargetIds instanceof Array,s=yu();for(let o=0;i&&o<n.activeTargetIds.length;++o)i=qp(n.activeTargetIds[o]),s=s.add(n.activeTargetIds[o]);return i?new Do(e,s):(ve("SharedClientState",`Failed to parse client data for instance '${e}': ${t}`),null)}}class Nu{constructor(e,t){this.clientId=e,this.onlineState=t}static Rs(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Nu(t.clientId,t.onlineState):(ve("SharedClientState",`Failed to parse online state: ${e}`),null)}}class Cc{constructor(){this.activeTargetIds=yu()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Za{constructor(e,t,n,i,s){this.window=e,this.ui=t,this.persistenceKey=n,this.ps=i,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ys=this.ws.bind(this),this.Ss=new se(G),this.started=!1,this.bs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.Ds=Md(this.persistenceKey,this.ps),this.vs=function(u){return`firestore_sequence_number_${u}`}(this.persistenceKey),this.Ss=this.Ss.insert(this.ps,new Cc),this.Cs=new RegExp(`^firestore_clients_${o}_([^_]*)$`),this.Fs=new RegExp(`^firestore_mutations_${o}_(\\d+)(?:_(.*))?$`),this.Ms=new RegExp(`^firestore_targets_${o}_(\\d+)$`),this.xs=function(u){return`firestore_online_state_${u}`}(this.persistenceKey),this.Os=function(u){return`firestore_bundle_loaded_v2_${u}`}(this.persistenceKey),this.window.addEventListener("storage",this.ys)}static D(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Qi();for(const n of e){if(n===this.ps)continue;const i=this.getItem(Md(this.persistenceKey,n));if(i){const s=Do.Rs(n,i);s&&(this.Ss=this.Ss.insert(s.clientId,s))}}this.Ns();const t=this.storage.getItem(this.xs);if(t){const n=this.Ls(t);n&&this.Bs(n)}for(const n of this.bs)this.ws(n);this.bs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.vs,JSON.stringify(e))}getAllActiveQueryTargets(){return this.ks(this.Ss)}isActiveQueryTarget(e){let t=!1;return this.Ss.forEach((n,i)=>{i.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.qs(e,"pending")}updateMutationState(e,t,n){this.qs(e,t,n),this.Qs(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const i=this.storage.getItem(Xa(this.persistenceKey,e));if(i){const s=Li.Rs(e,i);s&&(n=s.state)}}return t&&this.Ks.fs(e),this.Ns(),n}removeLocalQueryTarget(e){this.Ks.gs(e),this.Ns()}isLocalQueryTarget(e){return this.Ks.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Xa(this.persistenceKey,e))}updateQueryState(e,t,n){this.$s(e,t,n)}handleUserChange(e,t,n){t.forEach(i=>{this.Qs(i)}),this.currentUser=e,n.forEach(i=>{this.addPendingMutation(i)})}setOnlineState(e){this.Us(e)}notifyBundleLoaded(e){this.Ws(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ys),this.removeItem(this.Ds),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return D("SharedClientState","READ",e,t),t}setItem(e,t){D("SharedClientState","SET",e,t),this.storage.setItem(e,t)}removeItem(e){D("SharedClientState","REMOVE",e),this.storage.removeItem(e)}ws(e){const t=e;if(t.storageArea===this.storage){if(D("SharedClientState","EVENT",t.key,t.newValue),t.key===this.Ds)return void ve("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.ui.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.Cs.test(t.key)){if(t.newValue==null){const n=this.Gs(t.key);return this.zs(n,null)}{const n=this.js(t.key,t.newValue);if(n)return this.zs(n.clientId,n)}}else if(this.Fs.test(t.key)){if(t.newValue!==null){const n=this.Hs(t.key,t.newValue);if(n)return this.Js(n)}}else if(this.Ms.test(t.key)){if(t.newValue!==null){const n=this.Ys(t.key,t.newValue);if(n)return this.Zs(n)}}else if(t.key===this.xs){if(t.newValue!==null){const n=this.Ls(t.newValue);if(n)return this.Bs(n)}}else if(t.key===this.vs){const n=function(s){let o=Ye.oe;if(s!=null)try{const c=JSON.parse(s);U(typeof c=="number"),o=c}catch(c){ve("SharedClientState","Failed to read sequence number from WebStorage",c)}return o}(t.newValue);n!==Ye.oe&&this.sequenceNumberHandler(n)}else if(t.key===this.Os){const n=this.Xs(t.newValue);await Promise.all(n.map(i=>this.syncEngine.eo(i)))}}}else this.bs.push(t)})}}get Ks(){return this.Ss.get(this.ps)}Ns(){this.setItem(this.Ds,this.Ks.Vs())}qs(e,t,n){const i=new ko(this.currentUser,e,t,n),s=Fd(this.persistenceKey,this.currentUser,e);this.setItem(s,i.Vs())}Qs(e){const t=Fd(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Us(e){const t={clientId:this.ps,onlineState:e};this.storage.setItem(this.xs,JSON.stringify(t))}$s(e,t,n){const i=Xa(this.persistenceKey,e),s=new Li(e,t,n);this.setItem(i,s.Vs())}Ws(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Os,t)}Gs(e){const t=this.Cs.exec(e);return t?t[1]:null}js(e,t){const n=this.Gs(e);return Do.Rs(n,t)}Hs(e,t){const n=this.Fs.exec(e),i=Number(n[1]),s=n[2]!==void 0?n[2]:null;return ko.Rs(new Se(s),i,t)}Ys(e,t){const n=this.Ms.exec(e),i=Number(n[1]);return Li.Rs(i,t)}Ls(e){return Nu.Rs(e)}Xs(e){return JSON.parse(e)}async Js(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.no(e.batchId,e.state,e.error);D("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Zs(e){return this.syncEngine.ro(e.targetId,e.state,e.error)}zs(e,t){const n=t?this.Ss.insert(e,t):this.Ss.remove(e),i=this.ks(this.Ss),s=this.ks(n),o=[],c=[];return s.forEach(u=>{i.has(u)||o.push(u)}),i.forEach(u=>{s.has(u)||c.push(u)}),this.syncEngine.io(o,c).then(()=>{this.Ss=n})}Bs(e){this.Ss.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}ks(e){let t=yu();return e.forEach((n,i)=>{t=t.unionWith(i.activeTargetIds)}),t}}class tg{constructor(){this.so=new Cc,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,n){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Cc,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eb{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){D("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){D("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eo=null;function ec(){return eo===null?eo=function(){return 268435456+Math.round(2147483648*Math.random())}():eo++,"0x"+eo.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ab={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bb{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ue="WebChannelConnection";class Rb extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=n+"://"+t.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(t,n,i,s,o){const c=ec(),u=this.xo(t,n.toUriEncodedString());D("RestConnection",`Sending RPC '${t}' ${c}:`,u,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,s,o),this.No(t,u,h,i).then(f=>(D("RestConnection",`Received RPC '${t}' ${c}: `,f),f),f=>{throw wt("RestConnection",`RPC '${t}' ${c} failed with error: `,f,"url: ",u,"request:",i),f})}Lo(t,n,i,s,o,c){return this.Mo(t,n,i,s,o)}Oo(t,n,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+$r}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((s,o)=>t[o]=s),i&&i.headers.forEach((s,o)=>t[o]=s)}xo(t,n){const i=Ab[t];return`${this.Do}/v1/${n}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,n,i){const s=ec();return new Promise((o,c)=>{const u=new Sp;u.setWithCredentials(!0),u.listenOnce(Cp.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case so.NO_ERROR:const f=u.getResponseJson();D(Ue,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),o(f);break;case so.TIMEOUT:D(Ue,`RPC '${e}' ${s} timed out`),c(new k(P.DEADLINE_EXCEEDED,"Request time out"));break;case so.HTTP_ERROR:const p=u.getStatus();if(D(Ue,`RPC '${e}' ${s} failed with status:`,p,"response text:",u.getResponseText()),p>0){let _=u.getResponseJson();Array.isArray(_)&&(_=_[0]);const A=_==null?void 0:_.error;if(A&&A.status&&A.message){const C=function(V){const $=V.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf($)>=0?$:P.UNKNOWN}(A.status);c(new k(C,A.message))}else c(new k(P.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new k(P.UNAVAILABLE,"Connection failed."));break;default:F()}}finally{D(Ue,`RPC '${e}' ${s} completed.`)}});const h=JSON.stringify(i);D(Ue,`RPC '${e}' ${s} sending request:`,i),u.send(t,"POST",h,n,15)})}Bo(e,t,n){const i=ec(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Vp(),c=Dp(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,t,n),u.encodeInitMessageHeaders=!0;const f=s.join("");D(Ue,`Creating RPC '${e}' stream ${i}: ${f}`,u);const p=o.createWebChannel(f,u);let _=!1,A=!1;const C=new bb({Io:V=>{A?D(Ue,`Not sending because RPC '${e}' stream ${i} is closed:`,V):(_||(D(Ue,`Opening RPC '${e}' stream ${i} transport.`),p.open(),_=!0),D(Ue,`RPC '${e}' stream ${i} sending:`,V),p.send(V))},To:()=>p.close()}),N=(V,$,z)=>{V.listen($,q=>{try{z(q)}catch(Y){setTimeout(()=>{throw Y},0)}})};return N(p,bi.EventType.OPEN,()=>{A||(D(Ue,`RPC '${e}' stream ${i} transport opened.`),C.yo())}),N(p,bi.EventType.CLOSE,()=>{A||(A=!0,D(Ue,`RPC '${e}' stream ${i} transport closed`),C.So())}),N(p,bi.EventType.ERROR,V=>{A||(A=!0,wt(Ue,`RPC '${e}' stream ${i} transport errored:`,V),C.So(new k(P.UNAVAILABLE,"The operation could not be completed")))}),N(p,bi.EventType.MESSAGE,V=>{var $;if(!A){const z=V.data[0];U(!!z);const q=z,Y=q.error||(($=q[0])===null||$===void 0?void 0:$.error);if(Y){D(Ue,`RPC '${e}' stream ${i} received error:`,Y);const te=Y.status;let W=function(I){const w=Ee[I];if(w!==void 0)return vm(w)}(te),v=Y.message;W===void 0&&(W=P.INTERNAL,v="Unknown error status: "+te+" with message "+Y.message),A=!0,C.So(new k(W,v)),p.close()}else D(Ue,`RPC '${e}' stream ${i} received:`,z),C.bo(z)}}),N(c,kp.STAT_EVENT,V=>{V.stat===fc.PROXY?D(Ue,`RPC '${e}' stream ${i} detected buffering proxy`):V.stat===fc.NOPROXY&&D(Ue,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{C.wo()},0),C}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ng(){return typeof window<"u"?window:null}function fo(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(r){return new VA(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ou{constructor(e,t,n=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=t,this.ko=n,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-n);i>0&&D("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{constructor(e,t,n,i,s,o,c,u){this.ui=e,this.Ho=n,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Ou(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(ve(t.toString()),ve("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,i])=>{this.Yo===t&&this.P_(n,i)},n=>{e(()=>{const i=new k(P.UNKNOWN,"Fetching auth token failed: "+n.message);return this.I_(i)})})}P_(e,t){const n=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{n(()=>this.I_(i))}),this.stream.onMessage(i=>{n(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return D("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(D("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Pb extends rg{constructor(e,t,n,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=xA(this.serializer,e),n=function(s){if(!("targetChange"in s))return B.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?B.min():o.readTime?we(o.readTime):B.min()}(e);return this.listener.d_(t,n)}A_(e){const t={};t.database=Ac(this.serializer),t.addTarget=function(s,o){let c;const u=o.target;if(c=Eo(u)?{documents:km(s,u)}:{query:Dm(s,u)._t},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Am(s,o.resumeToken);const h=Tc(s,o.expectedCount);h!==null&&(c.expectedCount=h)}else if(o.snapshotVersion.compareTo(B.min())>0){c.readTime=Dr(s,o.snapshotVersion.toTimestamp());const h=Tc(s,o.expectedCount);h!==null&&(c.expectedCount=h)}return c}(this.serializer,e);const n=MA(this.serializer,e);n&&(t.labels=n),this.a_(t)}R_(e){const t={};t.database=Ac(this.serializer),t.removeTarget=e,this.a_(t)}}class Sb extends rg{constructor(e,t,n,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return U(!!e.streamToken),this.lastStreamToken=e.streamToken,U(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){U(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=LA(e.writeResults,e.commitTime),n=we(e.commitTime);return this.listener.g_(n,t)}p_(){const e={};e.database=Ac(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>ts(this.serializer,n))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cb extends class{}{constructor(e,t,n,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new k(P.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,n,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,Ec(t,n),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new k(P.UNKNOWN,s.toString())})}Lo(e,t,n,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,c])=>this.connection.Lo(e,Ec(t,n),i,o,c,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new k(P.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class kb{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(ve(t),this.D_=!1):D("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Db{constructor(e,t,n,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{n.enqueueAndForget(async()=>{_n(this)&&(D("RemoteStore","Restarting streams for network reachability change."),await async function(u){const h=M(u);h.L_.add(4),await Wr(h),h.q_.set("Unknown"),h.L_.delete(4),await As(h)}(this))})}),this.q_=new kb(n,i)}}async function As(r){if(_n(r))for(const e of r.B_)await e(!0)}async function Wr(r){for(const e of r.B_)await e(!1)}function ta(r,e){const t=M(r);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Mu(t)?Lu(t):Qr(t).r_()&&xu(t,e))}function Or(r,e){const t=M(r),n=Qr(t);t.N_.delete(e),n.r_()&&ig(t,e),t.N_.size===0&&(n.r_()?n.o_():_n(t)&&t.q_.set("Unknown"))}function xu(r,e){if(r.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(B.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Qr(r).A_(e)}function ig(r,e){r.Q_.xe(e),Qr(r).R_(e)}function Lu(r){r.Q_=new SA({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>r.N_.get(e)||null,tt:()=>r.datastore.serializer.databaseId}),Qr(r).start(),r.q_.v_()}function Mu(r){return _n(r)&&!Qr(r).n_()&&r.N_.size>0}function _n(r){return M(r).L_.size===0}function sg(r){r.Q_=void 0}async function Vb(r){r.q_.set("Online")}async function Nb(r){r.N_.forEach((e,t)=>{xu(r,e)})}async function Ob(r,e){sg(r),Mu(r)?(r.q_.M_(e),Lu(r)):r.q_.set("Unknown")}async function xb(r,e,t){if(r.q_.set("Online"),e instanceof Em&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const c of s.targetIds)i.N_.has(c)&&(await i.remoteSyncer.rejectListen(c,o),i.N_.delete(c),i.Q_.removeTarget(c))}(r,e)}catch(n){D("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Vo(r,n)}else if(e instanceof ho?r.Q_.Ke(e):e instanceof Tm?r.Q_.He(e):r.Q_.We(e),!t.isEqual(B.min()))try{const n=await Jm(r.localStore);t.compareTo(n)>=0&&await function(s,o){const c=s.Q_.rt(o);return c.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=s.N_.get(h);f&&s.N_.set(h,f.withResumeToken(u.resumeToken,o))}}),c.targetMismatches.forEach((u,h)=>{const f=s.N_.get(u);if(!f)return;s.N_.set(u,f.withResumeToken(_e.EMPTY_BYTE_STRING,f.snapshotVersion)),ig(s,u);const p=new Ct(f.target,u,h,f.sequenceNumber);xu(s,p)}),s.remoteSyncer.applyRemoteEvent(c)}(r,t)}catch(n){D("RemoteStore","Failed to raise snapshot:",n),await Vo(r,n)}}async function Vo(r,e,t){if(!mn(e))throw e;r.L_.add(1),await Wr(r),r.q_.set("Offline"),t||(t=()=>Jm(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{D("RemoteStore","Retrying IndexedDB access"),await t(),r.L_.delete(1),await As(r)})}function og(r,e){return e().catch(t=>Vo(r,t,e))}async function Hr(r){const e=M(r),t=un(e);let n=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;Lb(e);)try{const i=await vb(e.localStore,n);if(i===null){e.O_.length===0&&t.o_();break}n=i.batchId,Mb(e,i)}catch(i){await Vo(e,i)}ag(e)&&cg(e)}function Lb(r){return _n(r)&&r.O_.length<10}function Mb(r,e){r.O_.push(e);const t=un(r);t.r_()&&t.V_&&t.m_(e.mutations)}function ag(r){return _n(r)&&!un(r).n_()&&r.O_.length>0}function cg(r){un(r).start()}async function Fb(r){un(r).p_()}async function Ub(r){const e=un(r);for(const t of r.O_)e.m_(t.mutations)}async function Bb(r,e,t){const n=r.O_.shift(),i=Tu.from(n,e,t);await og(r,()=>r.remoteSyncer.applySuccessfulWrite(i)),await Hr(r)}async function qb(r,e){e&&un(r).V_&&await async function(n,i){if(function(o){return Im(o)&&o!==P.ABORTED}(i.code)){const s=n.O_.shift();un(n).s_(),await og(n,()=>n.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Hr(n)}}(r,e),ag(r)&&cg(r)}async function Bd(r,e){const t=M(r);t.asyncQueue.verifyOperationInProgress(),D("RemoteStore","RemoteStore received new credentials");const n=_n(t);t.L_.add(3),await Wr(t),n&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await As(t)}async function kc(r,e){const t=M(r);e?(t.L_.delete(2),await As(t)):e||(t.L_.add(2),await Wr(t),t.q_.set("Unknown"))}function Qr(r){return r.K_||(r.K_=function(t,n,i){const s=M(t);return s.w_(),new Pb(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(r.datastore,r.asyncQueue,{Eo:Vb.bind(null,r),Ro:Nb.bind(null,r),mo:Ob.bind(null,r),d_:xb.bind(null,r)}),r.B_.push(async e=>{e?(r.K_.s_(),Mu(r)?Lu(r):r.q_.set("Unknown")):(await r.K_.stop(),sg(r))})),r.K_}function un(r){return r.U_||(r.U_=function(t,n,i){const s=M(t);return s.w_(),new Sb(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(r.datastore,r.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Fb.bind(null,r),mo:qb.bind(null,r),f_:Ub.bind(null,r),g_:Bb.bind(null,r)}),r.B_.push(async e=>{e?(r.U_.s_(),await Hr(r)):(await r.U_.stop(),r.O_.length>0&&(D("RemoteStore",`Stopping write stream with ${r.O_.length} pending writes`),r.O_=[]))})),r.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu{constructor(e,t,n,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new Ne,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,i,s){const o=Date.now()+n,c=new Fu(e,t,o,i,s);return c.start(n),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new k(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Jr(r,e){if(ve("AsyncQueue",`${e}: ${r}`),mn(r))return new k(P.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr{constructor(e){this.comparator=e?(t,n)=>e(t,n)||L.comparator(t.key,n.key):(t,n)=>L.comparator(t.key,n.key),this.keyedMap=Ri(),this.sortedSet=new se(this.comparator)}static emptySet(e){return new wr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof wr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new wr;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(){this.W_=new se(L.comparator)}track(e){const t=e.doc.key,n=this.W_.get(t);n?e.type!==0&&n.type===3?this.W_=this.W_.insert(t,e):e.type===3&&n.type!==1?this.W_=this.W_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.W_=this.W_.remove(t):e.type===1&&n.type===2?this.W_=this.W_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):F():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,n)=>{e.push(n)}),e}}class xr{constructor(e,t,n,i,s,o,c,u,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,i,s){const o=[];return t.forEach(c=>{o.push({type:0,doc:c})}),new xr(e,t,wr.emptySet(t),o,n,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ys(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==n[i].type||!t[i].doc.isEqual(n[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jb{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class $b{constructor(){this.queries=jd(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,n){const i=M(t),s=i.queries;i.queries=jd(),s.forEach((o,c)=>{for(const u of c.j_)u.onError(n)})})(this,new k(P.ABORTED,"Firestore shutting down"))}}function jd(){return new gn(r=>sm(r),ys)}async function Uu(r,e){const t=M(r);let n=3;const i=e.query;let s=t.queries.get(i);s?!s.H_()&&e.J_()&&(n=2):(s=new jb,n=e.J_()?0:1);try{switch(n){case 0:s.z_=await t.onListen(i,!0);break;case 1:s.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const c=Jr(o,`Initialization of query '${hr(e.query)}' failed`);return void e.onError(c)}t.queries.set(i,s),s.j_.push(e),e.Z_(t.onlineState),s.z_&&e.X_(s.z_)&&qu(t)}async function Bu(r,e){const t=M(r),n=e.query;let i=3;const s=t.queries.get(n);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function zb(r,e){const t=M(r);let n=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const c of o.j_)c.X_(i)&&(n=!0);o.z_=i}}n&&qu(t)}function Gb(r,e,t){const n=M(r),i=n.queries.get(e);if(i)for(const s of i.j_)s.onError(t);n.queries.delete(e)}function qu(r){r.Y_.forEach(e=>{e.next()})}var Dc,$d;($d=Dc||(Dc={})).ea="default",$d.Cache="cache";class ju{constructor(e,t,n){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(e){if(!this.options.includeMetadataChanges){const n=[];for(const i of e.docChanges)i.type!==3&&n.push(i);e=new xr(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const n=t!=="Offline";return(!this.options._a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=xr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Dc.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kb{constructor(e,t){this.aa=e,this.byteLength=t}ua(){return"metadata"in this.aa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zd{constructor(e){this.serializer=e}Es(e){return yt(this.serializer,e)}ds(e){return e.metadata.exists?Cm(this.serializer,e.document,!1):ae.newNoDocument(this.Es(e.metadata.name),this.As(e.metadata.readTime))}As(e){return we(e)}}class Wb{constructor(e,t,n){this.ca=e,this.localStore=t,this.serializer=n,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=ug(e)}la(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.aa.namedQuery)this.queries.push(e.aa.namedQuery);else if(e.aa.documentMetadata){this.documents.push({metadata:e.aa.documentMetadata}),e.aa.documentMetadata.exists||++t;const n=Q.fromString(e.aa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.aa.document&&(this.documents[this.documents.length-1].document=e.aa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}ha(e){const t=new Map,n=new zd(this.serializer);for(const i of e)if(i.metadata.queries){const s=n.Es(i.metadata.name);for(const o of i.metadata.queries){const c=(t.get(o)||K()).add(s);t.set(o,c)}}return t}async complete(){const e=await wb(this.localStore,new zd(this.serializer),this.documents,this.ca.id),t=this.ha(this.documents);for(const n of this.queries)await Tb(this.localStore,n,t.get(n.name));return this.progress.taskState="Success",{progress:this.progress,Pa:this.collectionGroups,Ia:e}}}function ug(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lg{constructor(e){this.key=e}}class hg{constructor(e){this.key=e}}class dg{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=K(),this.mutatedKeys=K(),this.Aa=am(e),this.Ra=new wr(this.Aa)}get Va(){return this.Ta}ma(e,t){const n=t?t.fa:new qd,i=t?t.Ra:this.Ra;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,c=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,p)=>{const _=i.get(f),A=Is(this.query,p)?p:null,C=!!_&&this.mutatedKeys.has(_.key),N=!!A&&(A.hasLocalMutations||this.mutatedKeys.has(A.key)&&A.hasCommittedMutations);let V=!1;_&&A?_.data.isEqual(A.data)?C!==N&&(n.track({type:3,doc:A}),V=!0):this.ga(_,A)||(n.track({type:2,doc:A}),V=!0,(u&&this.Aa(A,u)>0||h&&this.Aa(A,h)<0)&&(c=!0)):!_&&A?(n.track({type:0,doc:A}),V=!0):_&&!A&&(n.track({type:1,doc:_}),V=!0,(u||h)&&(c=!0)),V&&(A?(o=o.add(A),s=N?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),n.track({type:1,doc:f})}return{Ra:o,fa:n,ns:c,mutatedKeys:s}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((f,p)=>function(A,C){const N=V=>{switch(V){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F()}};return N(A)-N(C)}(f.type,p.type)||this.Aa(f.doc,p.doc)),this.pa(n),i=i!=null&&i;const c=t&&!i?this.ya():[],u=this.da.size===0&&this.current&&!i?1:0,h=u!==this.Ea;return this.Ea=u,o.length!==0||h?{snapshot:new xr(this.query,e.Ra,s,o,e.mutatedKeys,u===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new qd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=K(),this.Ra.forEach(n=>{this.Sa(n.key)&&(this.da=this.da.add(n.key))});const t=[];return e.forEach(n=>{this.da.has(n)||t.push(new hg(n))}),this.da.forEach(n=>{e.has(n)||t.push(new lg(n))}),t}ba(e){this.Ta=e.Ts,this.da=K();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return xr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Hb{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Qb{constructor(e){this.key=e,this.va=!1}}class Jb{constructor(e,t,n,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new gn(c=>sm(c),ys),this.Ma=new Map,this.xa=new Set,this.Oa=new se(L.comparator),this.Na=new Map,this.La=new Cu,this.Ba={},this.ka=new Map,this.qa=Kn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Yb(r,e,t=!0){const n=na(r);let i;const s=n.Fa.get(e);return s?(n.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await fg(n,e,t,!0),i}async function Xb(r,e){const t=na(r);await fg(t,e,!0,!1)}async function fg(r,e,t,n){const i=await Vr(r.localStore,We(e)),s=i.targetId,o=r.sharedClientState.addLocalQueryTarget(s,t);let c;return n&&(c=await $u(r,e,s,o==="current",i.resumeToken)),r.isPrimaryClient&&t&&ta(r.remoteStore,i),c}async function $u(r,e,t,n,i){r.Ka=(p,_,A)=>async function(N,V,$,z){let q=V.view.ma($);q.ns&&(q=await Co(N.localStore,V.query,!1).then(({documents:v})=>V.view.ma(v,q)));const Y=z&&z.targetChanges.get(V.targetId),te=z&&z.targetMismatches.get(V.targetId)!=null,W=V.view.applyChanges(q,N.isPrimaryClient,Y,te);return Vc(N,V.targetId,W.wa),W.snapshot}(r,p,_,A);const s=await Co(r.localStore,e,!0),o=new dg(e,s.Ts),c=o.ma(s.documents),u=Ts.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",i),h=o.applyChanges(c,r.isPrimaryClient,u);Vc(r,t,h.wa);const f=new Hb(e,t,o);return r.Fa.set(e,f),r.Ma.has(t)?r.Ma.get(t).push(e):r.Ma.set(t,[e]),h.snapshot}async function Zb(r,e,t){const n=M(r),i=n.Fa.get(e),s=n.Ma.get(i.targetId);if(s.length>1)return n.Ma.set(i.targetId,s.filter(o=>!ys(o,e))),void n.Fa.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await Nr(n.localStore,i.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(i.targetId),t&&Or(n.remoteStore,i.targetId),Lr(n,i.targetId)}).catch(pn)):(Lr(n,i.targetId),await Nr(n.localStore,i.targetId,!0))}async function eR(r,e){const t=M(r),n=t.Fa.get(e),i=t.Ma.get(n.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Or(t.remoteStore,n.targetId))}async function tR(r,e,t){const n=Wu(r);try{const i=await function(o,c){const u=M(o),h=he.now(),f=c.reduce((A,C)=>A.add(C.key),K());let p,_;return u.persistence.runTransaction("Locally write mutations","readwrite",A=>{let C=Ze(),N=K();return u.cs.getEntries(A,f).next(V=>{C=V,C.forEach(($,z)=>{z.isValidDocument()||(N=N.add($))})}).next(()=>u.localDocuments.getOverlayedDocuments(A,C)).next(V=>{p=V;const $=[];for(const z of c){const q=bA(z,p.get(z.key).overlayedDocument);q!=null&&$.push(new Ft(z.key,q,Jp(q.value.mapValue),le.exists(!0)))}return u.mutationQueue.addMutationBatch(A,h,$,c)}).next(V=>{_=V;const $=V.applyToLocalDocumentSet(p,N);return u.documentOverlayCache.saveOverlays(A,V.batchId,$)})}).then(()=>({batchId:_.batchId,changes:um(p)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(i.batchId),function(o,c,u){let h=o.Ba[o.currentUser.toKey()];h||(h=new se(G)),h=h.insert(c,u),o.Ba[o.currentUser.toKey()]=h}(n,i.batchId,t),await Ut(n,i.changes),await Hr(n.remoteStore)}catch(i){const s=Jr(i,"Failed to persist write");t.reject(s)}}async function pg(r,e){const t=M(r);try{const n=await Ib(t.localStore,e);e.targetChanges.forEach((i,s)=>{const o=t.Na.get(s);o&&(U(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?U(o.va):i.removedDocuments.size>0&&(U(o.va),o.va=!1))}),await Ut(t,n,e)}catch(n){await pn(n)}}function Gd(r,e,t){const n=M(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const i=[];n.Fa.forEach((s,o)=>{const c=o.view.Z_(e);c.snapshot&&i.push(c.snapshot)}),function(o,c){const u=M(o);u.onlineState=c;let h=!1;u.queries.forEach((f,p)=>{for(const _ of p.j_)_.Z_(c)&&(h=!0)}),h&&qu(u)}(n.eventManager,e),i.length&&n.Ca.d_(i),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function nR(r,e,t){const n=M(r);n.sharedClientState.updateQueryState(e,"rejected",t);const i=n.Na.get(e),s=i&&i.key;if(s){let o=new se(L.comparator);o=o.insert(s,ae.newNoDocument(s,B.min()));const c=K().add(s),u=new ws(B.min(),new Map,new se(G),o,c);await pg(n,u),n.Oa=n.Oa.remove(s),n.Na.delete(e),Ku(n)}else await Nr(n.localStore,e,!1).then(()=>Lr(n,e,t)).catch(pn)}async function rR(r,e){const t=M(r),n=e.batch.batchId;try{const i=await yb(t.localStore,e);Gu(t,n,null),zu(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Ut(t,i)}catch(i){await pn(i)}}async function iR(r,e,t){const n=M(r);try{const i=await function(o,c){const u=M(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return u.mutationQueue.lookupMutationBatch(h,c).next(p=>(U(p!==null),f=p.keys(),u.mutationQueue.removeMutationBatch(h,p))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,c)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>u.localDocuments.getDocuments(h,f))})}(n.localStore,e);Gu(n,e,t),zu(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Ut(n,i)}catch(i){await pn(i)}}async function sR(r,e){const t=M(r);_n(t.remoteStore)||D("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await function(o){const c=M(o);return c.persistence.runTransaction("Get highest unacknowledged batch id","readonly",u=>c.mutationQueue.getHighestUnacknowledgedBatchId(u))}(t.localStore);if(n===-1)return void e.resolve();const i=t.ka.get(n)||[];i.push(e),t.ka.set(n,i)}catch(n){const i=Jr(n,"Initialization of waitForPendingWrites() operation failed");e.reject(i)}}function zu(r,e){(r.ka.get(e)||[]).forEach(t=>{t.resolve()}),r.ka.delete(e)}function Gu(r,e,t){const n=M(r);let i=n.Ba[n.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),n.Ba[n.currentUser.toKey()]=i}}function Lr(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Ma.get(e))r.Fa.delete(n),t&&r.Ca.$a(n,t);r.Ma.delete(e),r.isPrimaryClient&&r.La.gr(e).forEach(n=>{r.La.containsKey(n)||mg(r,n)})}function mg(r,e){r.xa.delete(e.path.canonicalString());const t=r.Oa.get(e);t!==null&&(Or(r.remoteStore,t),r.Oa=r.Oa.remove(e),r.Na.delete(t),Ku(r))}function Vc(r,e,t){for(const n of t)n instanceof lg?(r.La.addReference(n.key,e),oR(r,n)):n instanceof hg?(D("SyncEngine","Document no longer in limbo: "+n.key),r.La.removeReference(n.key,e),r.La.containsKey(n.key)||mg(r,n.key)):F()}function oR(r,e){const t=e.key,n=t.path.canonicalString();r.Oa.get(t)||r.xa.has(n)||(D("SyncEngine","New document in limbo: "+t),r.xa.add(n),Ku(r))}function Ku(r){for(;r.xa.size>0&&r.Oa.size<r.maxConcurrentLimboResolutions;){const e=r.xa.values().next().value;r.xa.delete(e);const t=new L(Q.fromString(e)),n=r.qa.next();r.Na.set(n,new Qb(t)),r.Oa=r.Oa.insert(t,n),ta(r.remoteStore,new Ct(We(zr(t.path)),n,"TargetPurposeLimboResolution",Ye.oe))}}async function Ut(r,e,t){const n=M(r),i=[],s=[],o=[];n.Fa.isEmpty()||(n.Fa.forEach((c,u)=>{o.push(n.Ka(u,e,t).then(h=>{var f;if((h||t)&&n.isPrimaryClient){const p=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;n.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){i.push(h);const p=Vu.Wi(u.targetId,h);s.push(p)}}))}),await Promise.all(o),n.Ca.d_(i),await async function(u,h){const f=M(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>b.forEach(h,_=>b.forEach(_.$i,A=>f.persistence.referenceDelegate.addReference(p,_.targetId,A)).next(()=>b.forEach(_.Ui,A=>f.persistence.referenceDelegate.removeReference(p,_.targetId,A)))))}catch(p){if(!mn(p))throw p;D("LocalStore","Failed to update sequence numbers: "+p)}for(const p of h){const _=p.targetId;if(!p.fromCache){const A=f.os.get(_),C=A.snapshotVersion,N=A.withLastLimboFreeSnapshotVersion(C);f.os=f.os.insert(_,N)}}}(n.localStore,s))}async function aR(r,e){const t=M(r);if(!t.currentUser.isEqual(e)){D("SyncEngine","User change. New user:",e.toKey());const n=await Qm(t.localStore,e);t.currentUser=e,function(s,o){s.ka.forEach(c=>{c.forEach(u=>{u.reject(new k(P.CANCELLED,o))})}),s.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Ut(t,n.hs)}}function cR(r,e){const t=M(r),n=t.Na.get(e);if(n&&n.va)return K().add(n.key);{let i=K();const s=t.Ma.get(e);if(!s)return i;for(const o of s){const c=t.Fa.get(o);i=i.unionWith(c.view.Va)}return i}}async function uR(r,e){const t=M(r),n=await Co(t.localStore,e.query,!0),i=e.view.ba(n);return t.isPrimaryClient&&Vc(t,e.targetId,i.wa),i}async function lR(r,e){const t=M(r);return Zm(t.localStore,e).then(n=>Ut(t,n))}async function hR(r,e,t,n){const i=M(r),s=await function(c,u){const h=M(c),f=M(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",p=>f.Mn(p,u).next(_=>_?h.localDocuments.getDocuments(p,_):b.resolve(null)))}(i.localStore,e);s!==null?(t==="pending"?await Hr(i.remoteStore):t==="acknowledged"||t==="rejected"?(Gu(i,e,n||null),zu(i,e),function(c,u){M(M(c).mutationQueue).On(u)}(i.localStore,e)):F(),await Ut(i,s)):D("SyncEngine","Cannot apply mutation batch with id: "+e)}async function dR(r,e){const t=M(r);if(na(t),Wu(t),e===!0&&t.Qa!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),i=await Kd(t,n.toArray());t.Qa=!0,await kc(t.remoteStore,!0);for(const s of i)ta(t.remoteStore,s)}else if(e===!1&&t.Qa!==!1){const n=[];let i=Promise.resolve();t.Ma.forEach((s,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):i=i.then(()=>(Lr(t,o),Nr(t.localStore,o,!0))),Or(t.remoteStore,o)}),await i,await Kd(t,n),function(o){const c=M(o);c.Na.forEach((u,h)=>{Or(c.remoteStore,h)}),c.La.pr(),c.Na=new Map,c.Oa=new se(L.comparator)}(t),t.Qa=!1,await kc(t.remoteStore,!1)}}async function Kd(r,e,t){const n=M(r),i=[],s=[];for(const o of e){let c;const u=n.Ma.get(o);if(u&&u.length!==0){c=await Vr(n.localStore,We(u[0]));for(const h of u){const f=n.Fa.get(h),p=await uR(n,f);p.snapshot&&s.push(p.snapshot)}}else{const h=await Xm(n.localStore,o);c=await Vr(n.localStore,h),await $u(n,gg(h),o,!1,c.resumeToken)}i.push(c)}return n.Ca.d_(s),i}function gg(r){return im(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function fR(r){return function(t){return M(M(t).persistence).Qi()}(M(r).localStore)}async function pR(r,e,t,n){const i=M(r);if(i.Qa)return void D("SyncEngine","Ignoring unexpected query state notification.");const s=i.Ma.get(e);if(s&&s.length>0)switch(t){case"current":case"not-current":{const o=await Zm(i.localStore,om(s[0])),c=ws.createSynthesizedRemoteEventForCurrentChange(e,t==="current",_e.EMPTY_BYTE_STRING);await Ut(i,o,c);break}case"rejected":await Nr(i.localStore,e,!0),Lr(i,e,n);break;default:F()}}async function mR(r,e,t){const n=na(r);if(n.Qa){for(const i of e){if(n.Ma.has(i)&&n.sharedClientState.isActiveQueryTarget(i)){D("SyncEngine","Adding an already active target "+i);continue}const s=await Xm(n.localStore,i),o=await Vr(n.localStore,s);await $u(n,gg(s),o.targetId,!1,o.resumeToken),ta(n.remoteStore,o)}for(const i of t)n.Ma.has(i)&&await Nr(n.localStore,i,!1).then(()=>{Or(n.remoteStore,i),Lr(n,i)}).catch(pn)}}function na(r){const e=M(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=pg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=cR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=nR.bind(null,e),e.Ca.d_=zb.bind(null,e.eventManager),e.Ca.$a=Gb.bind(null,e.eventManager),e}function Wu(r){const e=M(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=rR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=iR.bind(null,e),e}function gR(r,e,t){const n=M(r);(async function(s,o,c){try{const u=await o.getMetadata();if(await function(A,C){const N=M(A),V=we(C.createTime);return N.persistence.runTransaction("hasNewerBundle","readonly",$=>N.Gr.getBundleMetadata($,C.id)).then($=>!!$&&$.createTime.compareTo(V)>=0)}(s.localStore,u))return await o.close(),c._completeWith(function(A){return{taskState:"Success",documentsLoaded:A.totalDocuments,bytesLoaded:A.totalBytes,totalDocuments:A.totalDocuments,totalBytes:A.totalBytes}}(u)),Promise.resolve(new Set);c._updateProgress(ug(u));const h=new Wb(u,s.localStore,o.serializer);let f=await o.Ua();for(;f;){const _=await h.la(f);_&&c._updateProgress(_),f=await o.Ua()}const p=await h.complete();return await Ut(s,p.Ia,void 0),await function(A,C){const N=M(A);return N.persistence.runTransaction("Save bundle","readwrite",V=>N.Gr.saveBundleMetadata(V,C))}(s.localStore,u),c._completeWith(p.progress),Promise.resolve(p.Pa)}catch(u){return wt("SyncEngine",`Loading bundle failed with ${u}`),c._failWith(u),Promise.resolve(new Set)}})(n,e,t).then(i=>{n.sharedClientState.notifyBundleLoaded(i)})}class ns{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Es(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return Hm(this.persistence,new Wm,e.initialUser,this.serializer)}Ga(e){return new Km(ea.Zr,this.serializer)}Wa(e){return new tg}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ns.provider={build:()=>new ns};class _g extends ns{constructor(e,t,n){super(),this.Ja=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Ja.initialize(this,e),await Wu(this.Ja.syncEngine),await Hr(this.Ja.remoteStore),await this.persistence.yi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}za(e){return Hm(this.persistence,new Wm,e.initialUser,this.serializer)}ja(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new eb(n,e.asyncQueue,t)}Ha(e,t){const n=new xE(t,this.persistence);return new OE(e.asyncQueue,n)}Ga(e){const t=Du(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Je.withCacheSize(this.cacheSizeBytes):Je.DEFAULT;return new ku(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,ng(),fo(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Wa(e){return new tg}}class _R extends _g{constructor(e,t){super(e,t,!1),this.Ja=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Ja.syncEngine;this.sharedClientState instanceof Za&&(this.sharedClientState.syncEngine={no:hR.bind(null,t),ro:pR.bind(null,t),io:mR.bind(null,t),Qi:fR.bind(null,t),eo:lR.bind(null,t)},await this.sharedClientState.start()),await this.persistence.yi(async n=>{await dR(this.Ja.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())})}Wa(e){const t=ng();if(!Za.D(t))throw new k(P.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Du(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Za(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class rs{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>Gd(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=aR.bind(null,this.syncEngine),await kc(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new $b}()}createDatastore(e){const t=Es(e.databaseInfo.databaseId),n=function(s){return new Rb(s)}(e.databaseInfo);return function(s,o,c,u){return new Cb(s,o,c,u)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,i,s,o,c){return new Db(n,i,s,o,c)}(this.localStore,this.datastore,e.asyncQueue,t=>Gd(this.syncEngine,t,0),function(){return Ud.D()?new Ud:new Eb}())}createSyncEngine(e,t){return function(i,s,o,c,u,h,f){const p=new Jb(i,s,o,c,u,h);return f&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=M(i);D("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Wr(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}rs.provider={build:()=>new rs};function Wd(r,e=10240){let t=0;return{async read(){if(t<r.byteLength){const n={value:r.slice(t,t+e),done:!1};return t+=e,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):ve("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yR{constructor(e,t){this.Xa=e,this.serializer=t,this.metadata=new Ne,this.buffer=new Uint8Array,this.eu=function(){return new TextDecoder("utf-8")}(),this.tu().then(n=>{n&&n.ua()?this.metadata.resolve(n.aa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n==null?void 0:n.aa)}`))},n=>this.metadata.reject(n))}close(){return this.Xa.cancel()}async getMetadata(){return this.metadata.promise}async Ua(){return await this.getMetadata(),this.tu()}async tu(){const e=await this.nu();if(e===null)return null;const t=this.eu.decode(e),n=Number(t);isNaN(n)&&this.ru(`length string (${t}) is not valid number`);const i=await this.iu(n);return new Kb(JSON.parse(i),e.length+n)}su(){return this.buffer.findIndex(e=>e===123)}async nu(){for(;this.su()<0&&!await this.ou(););if(this.buffer.length===0)return null;const e=this.su();e<0&&this.ru("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async iu(e){for(;this.buffer.length<e;)await this.ou()&&this.ru("Reached the end of bundle when more is expected.");const t=this.eu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}ru(e){throw this.Xa.cancel(),new Error(`Invalid bundle format: ${e}`)}async ou(){const e=await this.Xa.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IR{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new k(P.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(i,s){const o=M(i),c={documents:s.map(p=>es(o.serializer,p))},u=await o.Lo("BatchGetDocuments",o.serializer.databaseId,Q.emptyPath(),c,s.length),h=new Map;u.forEach(p=>{const _=OA(o.serializer,p);h.set(_.key.toString(),_)});const f=[];return s.forEach(p=>{const _=h.get(p.toString());U(!!_),f.push(_)}),f}(this.datastore,e);return t.forEach(n=>this.recordVersion(n)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new Kr(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,n)=>{const i=L.fromPath(n);this.mutations.push(new vu(i,this.precondition(i)))}),await async function(n,i){const s=M(n),o={writes:i.map(c=>ts(s.serializer,c))};await s.Mo("Commit",s.serializer.databaseId,Q.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw F();t=B.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new k(P.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(B.min())?le.exists(!1):le.updateTime(t):le.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(B.min()))throw new k(P.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return le.updateTime(t)}return le.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vR{constructor(e,t,n,i,s){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=i,this.deferred=s,this._u=n.maxAttempts,this.t_=new Ou(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new IR(this.datastore),t=this.cu(e);t&&t.then(n=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(n)}).catch(i=>{this.lu(i)}))}).catch(n=>{this.lu(n)})})}cu(e){try{const t=this.updateFunction(e);return!gs(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Im(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wR{constructor(e,t,n,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=i,this.user=Se.UNAUTHENTICATED,this.clientId=Op.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,async o=>{D("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(n,o=>(D("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ne;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Jr(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function tc(r,e){r.asyncQueue.verifyOperationInProgress(),D("FirestoreClient","Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async i=>{n.isEqual(i)||(await Qm(e.localStore,i),n=i)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function Hd(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Hu(r);D("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>Bd(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,i)=>Bd(e.remoteStore,i)),r._onlineComponents=e}async function Hu(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){D("FirestoreClient","Using user provided OfflineComponentProvider");try{await tc(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===P.FAILED_PRECONDITION||i.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;wt("Error using user provided cache. Falling back to memory cache: "+t),await tc(r,new ns)}}else D("FirestoreClient","Using default OfflineComponentProvider"),await tc(r,new ns);return r._offlineComponents}async function ia(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(D("FirestoreClient","Using user provided OnlineComponentProvider"),await Hd(r,r._uninitializedComponentsProvider._online)):(D("FirestoreClient","Using default OnlineComponentProvider"),await Hd(r,new rs))),r._onlineComponents}function yg(r){return Hu(r).then(e=>e.persistence)}function Qu(r){return Hu(r).then(e=>e.localStore)}function Ig(r){return ia(r).then(e=>e.remoteStore)}function Ju(r){return ia(r).then(e=>e.syncEngine)}function TR(r){return ia(r).then(e=>e.datastore)}async function Mr(r){const e=await ia(r),t=e.eventManager;return t.onListen=Yb.bind(null,e.syncEngine),t.onUnlisten=Zb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Xb.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=eR.bind(null,e.syncEngine),t}function ER(r){return r.asyncQueue.enqueue(async()=>{const e=await yg(r),t=await Ig(r);return e.setNetworkEnabled(!0),function(i){const s=M(i);return s.L_.delete(0),As(s)}(t)})}function AR(r){return r.asyncQueue.enqueue(async()=>{const e=await yg(r),t=await Ig(r);return e.setNetworkEnabled(!1),async function(i){const s=M(i);s.L_.add(0),await Wr(s),s.q_.set("Offline")}(t)})}function bR(r,e){const t=new Ne;return r.asyncQueue.enqueueAndForget(async()=>async function(i,s,o){try{const c=await function(h,f){const p=M(h);return p.persistence.runTransaction("read document","readonly",_=>p.localDocuments.getDocument(_,f))}(i,s);c.isFoundDocument()?o.resolve(c):c.isNoDocument()?o.resolve(null):o.reject(new k(P.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(c){const u=Jr(c,`Failed to get document '${s} from cache`);o.reject(u)}}(await Qu(r),e,t)),t.promise}function vg(r,e,t={}){const n=new Ne;return r.asyncQueue.enqueueAndForget(async()=>function(s,o,c,u,h){const f=new ra({next:_=>{f.Za(),o.enqueueAndForget(()=>Bu(s,p));const A=_.docs.has(c);!A&&_.fromCache?h.reject(new k(P.UNAVAILABLE,"Failed to get document because the client is offline.")):A&&_.fromCache&&u&&u.source==="server"?h.reject(new k(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(_)},error:_=>h.reject(_)}),p=new ju(zr(c.path),f,{includeMetadataChanges:!0,_a:!0});return Uu(s,p)}(await Mr(r),r.asyncQueue,e,t,n)),n.promise}function RR(r,e){const t=new Ne;return r.asyncQueue.enqueueAndForget(async()=>async function(i,s,o){try{const c=await Co(i,s,!0),u=new dg(s,c.Ts),h=u.ma(c.documents),f=u.applyChanges(h,!1);o.resolve(f.snapshot)}catch(c){const u=Jr(c,`Failed to execute query '${s} against cache`);o.reject(u)}}(await Qu(r),e,t)),t.promise}function wg(r,e,t={}){const n=new Ne;return r.asyncQueue.enqueueAndForget(async()=>function(s,o,c,u,h){const f=new ra({next:_=>{f.Za(),o.enqueueAndForget(()=>Bu(s,p)),_.fromCache&&u.source==="server"?h.reject(new k(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(_)},error:_=>h.reject(_)}),p=new ju(c,f,{includeMetadataChanges:!0,_a:!0});return Uu(s,p)}(await Mr(r),r.asyncQueue,e,t,n)),n.promise}function PR(r,e){const t=new ra(e);return r.asyncQueue.enqueueAndForget(async()=>function(i,s){M(i).Y_.add(s),s.next()}(await Mr(r),t)),()=>{t.Za(),r.asyncQueue.enqueueAndForget(async()=>function(i,s){M(i).Y_.delete(s)}(await Mr(r),t))}}function SR(r,e,t,n){const i=function(o,c){let u;return u=typeof o=="string"?wm().encode(o):o,function(f,p){return new yR(f,p)}(function(f,p){if(f instanceof Uint8Array)return Wd(f,p);if(f instanceof ArrayBuffer)return Wd(new Uint8Array(f),p);if(f instanceof ReadableStream)return f.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(u),c)}(t,Es(e));r.asyncQueue.enqueueAndForget(async()=>{gR(await Ju(r),i,n)})}function CR(r,e){return r.asyncQueue.enqueue(async()=>function(n,i){const s=M(n);return s.persistence.runTransaction("Get named query","readonly",o=>s.Gr.getNamedQuery(o,i))}(await Qu(r),e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tg(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qd=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yu(r,e,t){if(!t)throw new k(P.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function Eg(r,e,t,n){if(e===!0&&n===!0)throw new k(P.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Jd(r){if(!L.isDocumentKey(r))throw new k(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Yd(r){if(L.isDocumentKey(r))throw new k(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function sa(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":F()}function ee(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new k(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=sa(r);throw new k(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function Ag(r,e){if(e<=0)throw new k(P.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new k(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new k(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Eg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Tg((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new k(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new k(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new k(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,i){return n.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class bs{constructor(e,t,n,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Xd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new k(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new k(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Xd(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new EE;switch(n.type){case"firstParty":return new PE(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new k(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=Qd.get(t);n&&(D("ComponentProvider","Removing Datastore"),Qd.delete(t),n.terminate())}(this),Promise.resolve()}}function kR(r,e,t,n={}){var i;const s=(r=ee(r,bs))._getSettings(),o=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&wt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),n.mockUserToken){let c,u;if(typeof n.mockUserToken=="string")c=n.mockUserToken,u=Se.MOCK_USER;else{c=B_(n.mockUserToken,(i=r._app)===null||i===void 0?void 0:i.options.projectId);const h=n.mockUserToken.sub||n.mockUserToken.user_id;if(!h)throw new k(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Se(h)}r._authCredentials=new AE(new Np(c,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let He=class bg{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new bg(this.firestore,e,this._query)}},de=class Rg{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Zt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Rg(this.firestore,e,this._key)}},Zt=class Pg extends He{constructor(e,t,n){super(e,t,zr(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new de(this.firestore,null,new L(e))}withConverter(e){return new Pg(this.firestore,e,this._path)}};function Sg(r,e,...t){if(r=j(r),Yu("collection","path",e),r instanceof bs){const n=Q.fromString(e,...t);return Yd(n),new Zt(r,null,n)}{if(!(r instanceof de||r instanceof Zt))throw new k(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Q.fromString(e,...t));return Yd(n),new Zt(r.firestore,null,n)}}function DR(r,e){if(r=ee(r,bs),Yu("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new k(P.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new He(r,null,function(n){return new Mt(Q.emptyPath(),n)}(e))}function No(r,e,...t){if(r=j(r),arguments.length===1&&(e=Op.newId()),Yu("doc","path",e),r instanceof bs){const n=Q.fromString(e,...t);return Jd(n),new de(r,null,new L(n))}{if(!(r instanceof de||r instanceof Zt))throw new k(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Q.fromString(e,...t));return Jd(n),new de(r.firestore,r instanceof Zt?r.converter:null,new L(n))}}function Cg(r,e){return r=j(r),e=j(e),(r instanceof de||r instanceof Zt)&&(e instanceof de||e instanceof Zt)&&r.firestore===e.firestore&&r.path===e.path&&r.converter===e.converter}function kg(r,e){return r=j(r),e=j(e),r instanceof He&&e instanceof He&&r.firestore===e.firestore&&ys(r._query,e._query)&&r.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Ou(this,"async_queue_retry"),this.Vu=()=>{const n=fo();n&&D("AsyncQueue","Visibility state changed to "+n.visibilityState),this.t_.jo()},this.mu=e;const t=fo();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=fo();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Ne;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!mn(e))throw e;D("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(n=>{this.Eu=n,this.du=!1;const i=function(o){let c=o.message||"";return o.stack&&(c=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),c}(n);throw ve("INTERNAL UNHANDLED ERROR: ",i),n}).then(n=>(this.du=!1,n))));return this.mu=t,t}enqueueAfterDelay(e,t,n){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=Fu.createAndSchedule(this,e,t,n,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&F()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function Nc(r){return function(t,n){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of n)if(s in i&&typeof i[s]=="function")return!0;return!1}(r,["next","error","complete"])}class VR{constructor(){this._progressObserver={},this._taskCompletionResolver=new Ne,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NR=-1;let Te=class extends bs{constructor(e,t,n,i){super(e,t,n,i),this.type="firestore",this._queue=new Zd,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Zd(e),this._firestoreClient=void 0,await e}}};function Be(r){if(r._terminated)throw new k(P.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Dg(r),r._firestoreClient}function Dg(r){var e,t,n;const i=r._freezeSettings(),s=function(c,u,h,f){return new rA(c,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Tg(f.experimentalLongPollingOptions),f.useFetchStreams)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,i);r._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=i.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),r._firestoreClient=new wR(r._authCredentials,r._appCheckCredentials,r._queue,s,r._componentsProvider&&function(c){const u=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(u),_online:u}}(r._componentsProvider))}function OR(r,e){wt("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();return Vg(r,rs.provider,{build:n=>new _g(n,t.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function xR(r){wt("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();Vg(r,rs.provider,{build:t=>new _R(t,e.cacheSizeBytes)})}function Vg(r,e,t){if((r=ee(r,Te))._firestoreClient||r._terminated)throw new k(P.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new k(P.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},Dg(r)}function LR(r){if(r._initialized&&!r._terminated)throw new k(P.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new Ne;return r._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(n){if(!_t.D())return Promise.resolve();const i=n+"main";await _t.delete(i)}(Du(r._databaseId,r._persistenceKey)),e.resolve()}catch(t){e.reject(t)}}),e.promise}function MR(r){return function(t){const n=new Ne;return t.asyncQueue.enqueueAndForget(async()=>sR(await Ju(t),n)),n.promise}(Be(r=ee(r,Te)))}function FR(r){return ER(Be(r=ee(r,Te)))}function UR(r){return AR(Be(r=ee(r,Te)))}function BR(r,e){const t=Be(r=ee(r,Te)),n=new VR;return SR(t,r._databaseId,e,n),n}function qR(r,e){return CR(Be(r=ee(r,Te)),e).then(t=>t?new He(r,null,t.query):null)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Et(_e.fromBase64String(e))}catch(t){throw new k(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Et(_e.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ln=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new k(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ue(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yn=class{constructor(e){this._methodName=e}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new k(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new k(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return G(this._lat,e._lat)||G(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,i){if(n.length!==i.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jR=/^__.*__$/;class $R{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Ft(e,this.data,this.fieldMask,t,this.fieldTransforms):new Gr(e,this.data,t,this.fieldTransforms)}}class Ng{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Ft(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Og(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F()}}class aa{constructor(e,t,n,i,s,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new aa(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:n,xu:!1});return i.Ou(e),i}Nu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:n,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Oo(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Og(this.Cu)&&jR.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class zR{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Es(e)}Qu(e,t,n,i=!1){return new aa({Cu:e,methodName:t,qu:n,path:ue.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Xn(r){const e=r._freezeSettings(),t=Es(r._databaseId);return new zR(r._databaseId,!!e.ignoreUndefinedProperties,t)}function ca(r,e,t,n,i,s={}){const o=r.Qu(s.merge||s.mergeFields?2:0,e,t,i);sl("Data must be an object, but it was:",o,n);const c=Mg(n,o);let u,h;if(s.merge)u=new Xe(o.fieldMask),h=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const p of s.mergeFields){const _=Oc(e,p,t);if(!o.contains(_))throw new k(P.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);Ug(f,_)||f.push(_)}u=new Xe(f),h=o.fieldTransforms.filter(p=>u.covers(p.field))}else u=null,h=o.fieldTransforms;return new $R(new Ve(c),u,h)}class Rs extends Yn{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Rs}}function xg(r,e,t){return new aa({Cu:3,qu:e.settings.qu,methodName:r._methodName,xu:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Zu extends Yn{_toFieldTransform(e){return new vs(e.path,new Cr)}isEqual(e){return e instanceof Zu}}class el extends Yn{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=xg(this,e,!0),n=this.Ku.map(s=>Zn(s,t)),i=new jn(n);return new vs(e.path,i)}isEqual(e){return e instanceof el&&Ui(this.Ku,e.Ku)}}class tl extends Yn{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=xg(this,e,!0),n=this.Ku.map(s=>Zn(s,t)),i=new $n(n);return new vs(e.path,i)}isEqual(e){return e instanceof tl&&Ui(this.Ku,e.Ku)}}class nl extends Yn{constructor(e,t){super(e),this.$u=t}_toFieldTransform(e){const t=new kr(e.serializer,dm(e.serializer,this.$u));return new vs(e.path,t)}isEqual(e){return e instanceof nl&&this.$u===e.$u}}function rl(r,e,t,n){const i=r.Qu(1,e,t);sl("Data must be an object, but it was:",i,n);const s=[],o=Ve.empty();Jn(n,(u,h)=>{const f=ol(e,u,t);h=j(h);const p=i.Nu(f);if(h instanceof Rs)s.push(f);else{const _=Zn(h,p);_!=null&&(s.push(f),o.set(f,_))}});const c=new Xe(s);return new Ng(o,c,i.fieldTransforms)}function il(r,e,t,n,i,s){const o=r.Qu(1,e,t),c=[Oc(e,n,t)],u=[i];if(s.length%2!=0)throw new k(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let _=0;_<s.length;_+=2)c.push(Oc(e,s[_])),u.push(s[_+1]);const h=[],f=Ve.empty();for(let _=c.length-1;_>=0;--_)if(!Ug(h,c[_])){const A=c[_];let C=u[_];C=j(C);const N=o.Nu(A);if(C instanceof Rs)h.push(A);else{const V=Zn(C,N);V!=null&&(h.push(A),f.set(A,V))}}const p=new Xe(h);return new Ng(f,p,o.fieldTransforms)}function Lg(r,e,t,n=!1){return Zn(t,r.Qu(n?4:3,e))}function Zn(r,e){if(Fg(r=j(r)))return sl("Unsupported field value:",e,r),Mg(r,e);if(r instanceof Yn)return function(n,i){if(!Og(i.Cu))throw i.Bu(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(n,i){const s=[];let o=0;for(const c of n){let u=Zn(c,i.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(r,e)}return function(n,i){if((n=j(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return dm(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=he.fromDate(n);return{timestampValue:Dr(i.serializer,s)}}if(n instanceof he){const s=new he(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Dr(i.serializer,s)}}if(n instanceof oa)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Et)return{bytesValue:Am(i.serializer,n._byteString)};if(n instanceof de){const s=i.databaseId,o=n.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:bu(n.firestore._databaseId||i.databaseId,n._key.path)}}if(n instanceof Xu)return function(o,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw c.Bu("VectorValues must only contain numeric values.");return Iu(c.serializer,u)})}}}}}}(n,i);throw i.Bu(`Unsupported field value: ${sa(n)}`)}(r,e)}function Mg(r,e){const t={};return Kp(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Jn(r,(n,i)=>{const s=Zn(i,e.Mu(n));s!=null&&(t[n]=s)}),{mapValue:{fields:t}}}function Fg(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof he||r instanceof oa||r instanceof Et||r instanceof de||r instanceof Yn||r instanceof Xu)}function sl(r,e,t){if(!Fg(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const n=sa(t);throw n==="an object"?e.Bu(r+" a custom object"):e.Bu(r+" "+n)}}function Oc(r,e,t){if((e=j(e))instanceof ln)return e._internalPath;if(typeof e=="string")return ol(r,e);throw Oo("Field path arguments must be of type string or ",r,!1,void 0,t)}const GR=new RegExp("[~\\*/\\[\\]]");function ol(r,e,t){if(e.search(GR)>=0)throw Oo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new ln(...e.split("."))._internalPath}catch{throw Oo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Oo(r,e,t,n,i){const s=n&&!n.isEmpty(),o=i!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${n}`),o&&(u+=` in document ${i}`),u+=")"),new k(P.INVALID_ARGUMENT,c+r+u)}function Ug(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e,t,n,i,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new de(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new KR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ua("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class KR extends is{data(){return super.data()}}function ua(r,e){return typeof e=="string"?ol(r,e):e instanceof ln?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bg(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new k(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class al{}class Ps extends al{}function Wt(r,e,...t){let n=[];e instanceof al&&n.push(e),n=n.concat(t),function(s){const o=s.filter(u=>u instanceof cl).length,c=s.filter(u=>u instanceof la).length;if(o>1||o>0&&c>0)throw new k(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const i of n)r=i._apply(r);return r}class la extends Ps{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new la(e,t,n)}_apply(e){const t=this._parse(e);return jg(e._query,t),new He(e.firestore,e.converter,wc(e._query,t))}_parse(e){const t=Xn(e.firestore);return function(s,o,c,u,h,f,p){let _;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new k(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){tf(p,f);const A=[];for(const C of p)A.push(ef(u,s,C));_={arrayValue:{values:A}}}else _=ef(u,s,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||tf(p,f),_=Lg(c,o,p,f==="in"||f==="not-in");return J.create(h,f,_)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function WR(r,e,t){const n=e,i=ua("where",r);return la._create(i,n,t)}class cl extends al{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new cl(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:ne.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let o=i;const c=s.getFlattenedFilters();for(const u of c)jg(o,u),o=wc(o,u)}(e._query,t),new He(e.firestore,e.converter,wc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ul extends Ps{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ul(e,t)}_apply(e){const t=function(i,s,o){if(i.startAt!==null)throw new k(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new k(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Zi(s,o)}(e._query,this._field,this._direction);return new He(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new Mt(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function HR(r,e="asc"){const t=e,n=ua("orderBy",r);return ul._create(n,t)}class ha extends Ps{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new ha(e,t,n)}_apply(e){return new He(e.firestore,e.converter,bo(e._query,this._limit,this._limitType))}}function QR(r){return Ag("limit",r),ha._create("limit",r,"F")}function JR(r){return Ag("limitToLast",r),ha._create("limitToLast",r,"L")}class da extends Ps{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new da(e,t,n)}_apply(e){const t=qg(e,this.type,this._docOrFields,this._inclusive);return new He(e.firestore,e.converter,function(i,s){return new Mt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,s,i.endAt)}(e._query,t))}}function YR(...r){return da._create("startAt",r,!0)}function XR(...r){return da._create("startAfter",r,!1)}class fa extends Ps{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new fa(e,t,n)}_apply(e){const t=qg(e,this.type,this._docOrFields,this._inclusive);return new He(e.firestore,e.converter,function(i,s){return new Mt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,i.startAt,s)}(e._query,t))}}function ZR(...r){return fa._create("endBefore",r,!1)}function eP(...r){return fa._create("endAt",r,!0)}function qg(r,e,t,n){if(t[0]=j(t[0]),t[0]instanceof is)return function(s,o,c,u,h){if(!u)throw new k(P.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);const f=[];for(const p of vr(s))if(p.field.isKeyField())f.push(Bn(o,u.key));else{const _=u.data.field(p.field);if(Ho(_))throw new k(P.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+p.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(_===null){const A=p.field.canonicalString();throw new k(P.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${A}' (used as the orderBy) does not exist.`)}f.push(_)}return new cn(f,h)}(r._query,r.firestore._databaseId,e,t[0]._document,n);{const i=Xn(r.firestore);return function(o,c,u,h,f,p){const _=o.explicitOrderBy;if(f.length>_.length)throw new k(P.INVALID_ARGUMENT,`Too many arguments provided to ${h}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const A=[];for(let C=0;C<f.length;C++){const N=f[C];if(_[C].field.isKeyField()){if(typeof N!="string")throw new k(P.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${h}(), but got a ${typeof N}`);if(!_u(o)&&N.indexOf("/")!==-1)throw new k(P.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${h}() must be a plain document ID, but '${N}' contains a slash.`);const V=o.path.child(Q.fromString(N));if(!L.isDocumentKey(V))throw new k(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${h}() must result in a valid document path, but '${V}' is not because it contains an odd number of segments.`);const $=new L(V);A.push(Bn(c,$))}else{const V=Lg(u,h,N);A.push(V)}}return new cn(A,p)}(r._query,r.firestore._databaseId,i,e,t,n)}}function ef(r,e,t){if(typeof(t=j(t))=="string"){if(t==="")throw new k(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!_u(e)&&t.indexOf("/")!==-1)throw new k(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Q.fromString(t));if(!L.isDocumentKey(n))throw new k(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Bn(r,new L(n))}if(t instanceof de)return Bn(r,t._key);throw new k(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${sa(t)}.`)}function tf(r,e){if(!Array.isArray(r)||r.length===0)throw new k(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function jg(r,e){const t=function(i,s){for(const o of i)for(const c of o.getFlattenedFilters())if(s.indexOf(c.op)>=0)return c.op;return null}(r.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new k(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new k(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class ll{convertValue(e,t="none"){switch(Un(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ce(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(sn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw F()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Jn(e,(i,s)=>{n[i]=this.convertValue(s,t)}),n}convertVectorValue(e){var t,n,i;const s=(i=(n=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.map(o=>ce(o.doubleValue));return new Xu(s)}convertGeoPoint(e){return new oa(ce(e.latitude),ce(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=mu(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Ji(e));default:return null}}convertTimestamp(e){const t=Nt(e);return new he(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Q.fromString(e);U(xm(n));const i=new on(n.get(1),n.get(3)),s=new L(n.popFirst(5));return i.isEqual(t)||ve(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pa(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class tP extends ll{constructor(e){super(),this.firestore=e}convertBytes(e){return new Et(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new de(this.firestore,null,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}let Ot=class extends is{constructor(e,t,n,i,s,o){super(e,t,n,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Mi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ua("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}},Mi=class extends Ot{data(e={}){return super.data(e)}},hn=class{constructor(e,t,n,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Dn(i.hasPendingWrites,i.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Mi(this._firestore,this._userDataWriter,n.key,n,new Dn(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new k(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(c=>{const u=new Mi(i._firestore,i._userDataWriter,c.doc.key,c.doc,new Dn(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(c=>s||c.type!==3).map(c=>{const u=new Mi(i._firestore,i._userDataWriter,c.doc.key,c.doc,new Dn(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return c.type!==0&&(h=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:nP(c.type),doc:u,oldIndex:h,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}};function nP(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F()}}function $g(r,e){return r instanceof Ot&&e instanceof Ot?r._firestore===e._firestore&&r._key.isEqual(e._key)&&(r._document===null?e._document===null:r._document.isEqual(e._document))&&r._converter===e._converter:r instanceof hn&&e instanceof hn&&r._firestore===e._firestore&&kg(r.query,e.query)&&r.metadata.isEqual(e.metadata)&&r._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rP(r){r=ee(r,de);const e=ee(r.firestore,Te);return vg(Be(e),r._key).then(t=>hl(e,r,t))}class er extends ll{constructor(e){super(),this.firestore=e}convertBytes(e){return new Et(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new de(this.firestore,null,t)}}function iP(r){r=ee(r,de);const e=ee(r.firestore,Te),t=Be(e),n=new er(e);return bR(t,r._key).then(i=>new Ot(e,n,r._key,i,new Dn(i!==null&&i.hasLocalMutations,!0),r.converter))}function sP(r){r=ee(r,de);const e=ee(r.firestore,Te);return vg(Be(e),r._key,{source:"server"}).then(t=>hl(e,r,t))}function oP(r){r=ee(r,He);const e=ee(r.firestore,Te),t=Be(e),n=new er(e);return Bg(r._query),wg(t,r._query).then(i=>new hn(e,n,r,i))}function aP(r){r=ee(r,He);const e=ee(r.firestore,Te),t=Be(e),n=new er(e);return RR(t,r._query).then(i=>new hn(e,n,r,i))}function cP(r){r=ee(r,He);const e=ee(r.firestore,Te),t=Be(e),n=new er(e);return wg(t,r._query,{source:"server"}).then(i=>new hn(e,n,r,i))}function nf(r,e,t){r=ee(r,de);const n=ee(r.firestore,Te),i=pa(r.converter,e,t);return Ss(n,[ca(Xn(n),"setDoc",r._key,i,r.converter!==null,t).toMutation(r._key,le.none())])}function rf(r,e,t,...n){r=ee(r,de);const i=ee(r.firestore,Te),s=Xn(i);let o;return o=typeof(e=j(e))=="string"||e instanceof ln?il(s,"updateDoc",r._key,e,t,n):rl(s,"updateDoc",r._key,e),Ss(i,[o.toMutation(r._key,le.exists(!0))])}function uP(r){return Ss(ee(r.firestore,Te),[new Kr(r._key,le.none())])}function lP(r,e){const t=ee(r.firestore,Te),n=No(r),i=pa(r.converter,e);return Ss(t,[ca(Xn(r.firestore),"addDoc",n._key,i,r.converter!==null,{}).toMutation(n._key,le.exists(!1))]).then(()=>n)}function zg(r,...e){var t,n,i;r=j(r);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||Nc(e[o])||(s=e[o],o++);const c={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Nc(e[o])){const p=e[o];e[o]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[o+1]=(n=p.error)===null||n===void 0?void 0:n.bind(p),e[o+2]=(i=p.complete)===null||i===void 0?void 0:i.bind(p)}let u,h,f;if(r instanceof de)h=ee(r.firestore,Te),f=zr(r._key.path),u={next:p=>{e[o]&&e[o](hl(h,r,p))},error:e[o+1],complete:e[o+2]};else{const p=ee(r,He);h=ee(p.firestore,Te),f=p._query;const _=new er(h);u={next:A=>{e[o]&&e[o](new hn(h,_,p,A))},error:e[o+1],complete:e[o+2]},Bg(r._query)}return function(_,A,C,N){const V=new ra(N),$=new ju(A,V,C);return _.asyncQueue.enqueueAndForget(async()=>Uu(await Mr(_),$)),()=>{V.Za(),_.asyncQueue.enqueueAndForget(async()=>Bu(await Mr(_),$))}}(Be(h),f,c,u)}function hP(r,e){return PR(Be(r=ee(r,Te)),Nc(e)?e:{next:e})}function Ss(r,e){return function(n,i){const s=new Ne;return n.asyncQueue.enqueueAndForget(async()=>tR(await Ju(n),i,s)),s.promise}(Be(r),e)}function hl(r,e,t){const n=t.docs.get(e._key),i=new er(r);return new Ot(r,i,e._key,n,new Dn(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dP={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fP=class{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Xn(e)}set(e,t,n){this._verifyNotCommitted();const i=Qt(e,this._firestore),s=pa(i.converter,t,n),o=ca(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,n);return this._mutations.push(o.toMutation(i._key,le.none())),this}update(e,t,n,...i){this._verifyNotCommitted();const s=Qt(e,this._firestore);let o;return o=typeof(t=j(t))=="string"||t instanceof ln?il(this._dataReader,"WriteBatch.update",s._key,t,n,i):rl(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,le.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Qt(e,this._firestore);return this._mutations=this._mutations.concat(new Kr(t._key,le.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new k(P.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}};function Qt(r,e){if((r=j(r)).firestore!==e)throw new k(P.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pP=class extends class{constructor(t,n){this._firestore=t,this._transaction=n,this._dataReader=Xn(t)}get(t){const n=Qt(t,this._firestore),i=new tP(this._firestore);return this._transaction.lookup([n._key]).then(s=>{if(!s||s.length!==1)return F();const o=s[0];if(o.isFoundDocument())return new is(this._firestore,i,o.key,o,n.converter);if(o.isNoDocument())return new is(this._firestore,i,n._key,null,n.converter);throw F()})}set(t,n,i){const s=Qt(t,this._firestore),o=pa(s.converter,n,i),c=ca(this._dataReader,"Transaction.set",s._key,o,s.converter!==null,i);return this._transaction.set(s._key,c),this}update(t,n,i,...s){const o=Qt(t,this._firestore);let c;return c=typeof(n=j(n))=="string"||n instanceof ln?il(this._dataReader,"Transaction.update",o._key,n,i,s):rl(this._dataReader,"Transaction.update",o._key,n),this._transaction.update(o._key,c),this}delete(t){const n=Qt(t,this._firestore);return this._transaction.delete(n._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Qt(e,this._firestore),n=new er(this._firestore);return super.get(e).then(i=>new Ot(this._firestore,n,t._key,i._document,new Dn(!1,!1),t.converter))}};function mP(r,e,t){r=ee(r,Te);const n=Object.assign(Object.assign({},dP),t);return function(s){if(s.maxAttempts<1)throw new k(P.INVALID_ARGUMENT,"Max attempts must be at least 1")}(n),function(s,o,c){const u=new Ne;return s.asyncQueue.enqueueAndForget(async()=>{const h=await TR(s);new vR(s.asyncQueue,h,c,o,u).au()}),u.promise}(Be(r),i=>e(new pP(r,i)),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gP(){return new Rs("deleteField")}function _P(){return new Zu("serverTimestamp")}function yP(...r){return new el("arrayUnion",r)}function IP(...r){return new tl("arrayRemove",r)}function vP(r){return new nl("increment",r)}(function(e,t=!0){(function(i){$r=i})(dn),nn(new It("firestore",(n,{instanceIdentifier:i,options:s})=>{const o=n.getProvider("app").getImmediate(),c=new Te(new bE(n.getProvider("auth-internal")),new CE(n.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new k(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new on(h.options.projectId,f)}(o,i),o);return s=Object.assign({useFetchStreams:t},s),c._setSettings(s),c},"PUBLIC").setMultipleInstances(!0)),ct(Kh,"4.7.3",e),ct(Kh,"4.7.3","esm2017")})();const wP="@firebase/firestore-compat",TP="0.3.38";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(r,e){if(e===void 0)return{merge:!1};if(e.mergeFields!==void 0&&e.merge!==void 0)throw new k("invalid-argument",`Invalid options passed to function ${r}(): You cannot specify both "merge" and "mergeFields".`);return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sf(){if(typeof Uint8Array>"u")throw new k("unimplemented","Uint8Arrays are not available in this environment.")}function of(){if(!tA())throw new k("unimplemented","Blobs are unavailable in Firestore in this environment.")}class ss{constructor(e){this._delegate=e}static fromBase64String(e){return of(),new ss(Et.fromBase64String(e))}static fromUint8Array(e){return sf(),new ss(Et.fromUint8Array(e))}toBase64(){return of(),this._delegate.toBase64()}toUint8Array(){return sf(),this._delegate.toUint8Array()}isEqual(e){return this._delegate.isEqual(e._delegate)}toString(){return"Blob(base64: "+this.toBase64()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xc(r){return EP(r,["next","error","complete"])}function EP(r,e){if(typeof r!="object"||r===null)return!1;const t=r;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AP{enableIndexedDbPersistence(e,t){return OR(e._delegate,{forceOwnership:t})}enableMultiTabIndexedDbPersistence(e){return xR(e._delegate)}clearIndexedDbPersistence(e){return LR(e._delegate)}}class Gg{constructor(e,t,n){this._delegate=t,this._persistenceProvider=n,this.INTERNAL={delete:()=>this.terminate()},e instanceof on||(this._appCompat=e)}get _databaseId(){return this._delegate._databaseId}settings(e){const t=this._delegate._getSettings();!e.merge&&t.host!==e.host&&wt("You are overriding the original host. If you did not intend to override your settings, use {merge: true}."),e.merge&&(e=Object.assign(Object.assign({},t),e),delete e.merge),this._delegate._setSettings(e)}useEmulator(e,t,n={}){kR(this._delegate,e,t,n)}enableNetwork(){return FR(this._delegate)}disableNetwork(){return UR(this._delegate)}enablePersistence(e){let t=!1,n=!1;return e&&(t=!!e.synchronizeTabs,n=!!e.experimentalForceOwningTab,Eg("synchronizeTabs",t,"experimentalForceOwningTab",n)),t?this._persistenceProvider.enableMultiTabIndexedDbPersistence(this):this._persistenceProvider.enableIndexedDbPersistence(this,n)}clearPersistence(){return this._persistenceProvider.clearIndexedDbPersistence(this)}terminate(){return this._appCompat&&(this._appCompat._removeServiceInstance("firestore-compat"),this._appCompat._removeServiceInstance("firestore")),this._delegate._delete()}waitForPendingWrites(){return MR(this._delegate)}onSnapshotsInSync(e){return hP(this._delegate,e)}get app(){if(!this._appCompat)throw new k("failed-precondition","Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._appCompat}collection(e){try{return new Fr(this,Sg(this._delegate,e))}catch(t){throw ze(t,"collection()","Firestore.collection()")}}doc(e){try{return new it(this,No(this._delegate,e))}catch(t){throw ze(t,"doc()","Firestore.doc()")}}collectionGroup(e){try{return new $e(this,DR(this._delegate,e))}catch(t){throw ze(t,"collectionGroup()","Firestore.collectionGroup()")}}runTransaction(e){return mP(this._delegate,t=>e(new Kg(this,t)))}batch(){return Be(this._delegate),new Wg(new fP(this._delegate,e=>Ss(this._delegate,e)))}loadBundle(e){return BR(this._delegate,e)}namedQuery(e){return qR(this._delegate,e).then(t=>t?new $e(this,t):null)}}class ma extends ll{constructor(e){super(),this.firestore=e}convertBytes(e){return new ss(new Et(e))}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return it.forKey(t,this.firestore,null)}}function bP(r){wE(r)}class Kg{constructor(e,t){this._firestore=e,this._delegate=t,this._userDataWriter=new ma(e)}get(e){const t=Vn(e);return this._delegate.get(t).then(n=>new os(this._firestore,new Ot(this._firestore._delegate,this._userDataWriter,n._key,n._document,n.metadata,t.converter)))}set(e,t,n){const i=Vn(e);return n?(dl("Transaction.set",n),this._delegate.set(i,t,n)):this._delegate.set(i,t),this}update(e,t,n,...i){const s=Vn(e);return arguments.length===2?this._delegate.update(s,t):this._delegate.update(s,t,n,...i),this}delete(e){const t=Vn(e);return this._delegate.delete(t),this}}class Wg{constructor(e){this._delegate=e}set(e,t,n){const i=Vn(e);return n?(dl("WriteBatch.set",n),this._delegate.set(i,t,n)):this._delegate.set(i,t),this}update(e,t,n,...i){const s=Vn(e);return arguments.length===2?this._delegate.update(s,t):this._delegate.update(s,t,n,...i),this}delete(e){const t=Vn(e);return this._delegate.delete(t),this}commit(){return this._delegate.commit()}}class Wn{constructor(e,t,n){this._firestore=e,this._userDataWriter=t,this._delegate=n}fromFirestore(e,t){const n=new Mi(this._firestore._delegate,this._userDataWriter,e._key,e._document,e.metadata,null);return this._delegate.fromFirestore(new as(this._firestore,n),t??{})}toFirestore(e,t){return t?this._delegate.toFirestore(e,t):this._delegate.toFirestore(e)}static getInstance(e,t){const n=Wn.INSTANCES;let i=n.get(e);i||(i=new WeakMap,n.set(e,i));let s=i.get(t);return s||(s=new Wn(e,new ma(e),t),i.set(t,s)),s}}Wn.INSTANCES=new WeakMap;class it{constructor(e,t){this.firestore=e,this._delegate=t,this._userDataWriter=new ma(e)}static forPath(e,t,n){if(e.length%2!==0)throw new k("invalid-argument",`Invalid document reference. Document references must have an even number of segments, but ${e.canonicalString()} has ${e.length}`);return new it(t,new de(t._delegate,n,new L(e)))}static forKey(e,t,n){return new it(t,new de(t._delegate,n,e))}get id(){return this._delegate.id}get parent(){return new Fr(this.firestore,this._delegate.parent)}get path(){return this._delegate.path}collection(e){try{return new Fr(this.firestore,Sg(this._delegate,e))}catch(t){throw ze(t,"collection()","DocumentReference.collection()")}}isEqual(e){return e=j(e),e instanceof de?Cg(this._delegate,e):!1}set(e,t){t=dl("DocumentReference.set",t);try{return t?nf(this._delegate,e,t):nf(this._delegate,e)}catch(n){throw ze(n,"setDoc()","DocumentReference.set()")}}update(e,t,...n){try{return arguments.length===1?rf(this._delegate,e):rf(this._delegate,e,t,...n)}catch(i){throw ze(i,"updateDoc()","DocumentReference.update()")}}delete(){return uP(this._delegate)}onSnapshot(...e){const t=Hg(e),n=Qg(e,i=>new os(this.firestore,new Ot(this.firestore._delegate,this._userDataWriter,i._key,i._document,i.metadata,this._delegate.converter)));return zg(this._delegate,t,n)}get(e){let t;return(e==null?void 0:e.source)==="cache"?t=iP(this._delegate):(e==null?void 0:e.source)==="server"?t=sP(this._delegate):t=rP(this._delegate),t.then(n=>new os(this.firestore,new Ot(this.firestore._delegate,this._userDataWriter,n._key,n._document,n.metadata,this._delegate.converter)))}withConverter(e){return new it(this.firestore,e?this._delegate.withConverter(Wn.getInstance(this.firestore,e)):this._delegate.withConverter(null))}}function ze(r,e,t){return r.message=r.message.replace(e,t),r}function Hg(r){for(const e of r)if(typeof e=="object"&&!xc(e))return e;return{}}function Qg(r,e){var t,n;let i;return xc(r[0])?i=r[0]:xc(r[1])?i=r[1]:typeof r[0]=="function"?i={next:r[0],error:r[1],complete:r[2]}:i={next:r[1],error:r[2],complete:r[3]},{next:s=>{i.next&&i.next(e(s))},error:(t=i.error)===null||t===void 0?void 0:t.bind(i),complete:(n=i.complete)===null||n===void 0?void 0:n.bind(i)}}class os{constructor(e,t){this._firestore=e,this._delegate=t}get ref(){return new it(this._firestore,this._delegate.ref)}get id(){return this._delegate.id}get metadata(){return this._delegate.metadata}get exists(){return this._delegate.exists()}data(e){return this._delegate.data(e)}get(e,t){return this._delegate.get(e,t)}isEqual(e){return $g(this._delegate,e._delegate)}}class as extends os{data(e){const t=this._delegate.data(e);return this._delegate._converter||TE(t!==void 0),t}}class $e{constructor(e,t){this.firestore=e,this._delegate=t,this._userDataWriter=new ma(e)}where(e,t,n){try{return new $e(this.firestore,Wt(this._delegate,WR(e,t,n)))}catch(i){throw ze(i,/(orderBy|where)\(\)/,"Query.$1()")}}orderBy(e,t){try{return new $e(this.firestore,Wt(this._delegate,HR(e,t)))}catch(n){throw ze(n,/(orderBy|where)\(\)/,"Query.$1()")}}limit(e){try{return new $e(this.firestore,Wt(this._delegate,QR(e)))}catch(t){throw ze(t,"limit()","Query.limit()")}}limitToLast(e){try{return new $e(this.firestore,Wt(this._delegate,JR(e)))}catch(t){throw ze(t,"limitToLast()","Query.limitToLast()")}}startAt(...e){try{return new $e(this.firestore,Wt(this._delegate,YR(...e)))}catch(t){throw ze(t,"startAt()","Query.startAt()")}}startAfter(...e){try{return new $e(this.firestore,Wt(this._delegate,XR(...e)))}catch(t){throw ze(t,"startAfter()","Query.startAfter()")}}endBefore(...e){try{return new $e(this.firestore,Wt(this._delegate,ZR(...e)))}catch(t){throw ze(t,"endBefore()","Query.endBefore()")}}endAt(...e){try{return new $e(this.firestore,Wt(this._delegate,eP(...e)))}catch(t){throw ze(t,"endAt()","Query.endAt()")}}isEqual(e){return kg(this._delegate,e._delegate)}get(e){let t;return(e==null?void 0:e.source)==="cache"?t=aP(this._delegate):(e==null?void 0:e.source)==="server"?t=cP(this._delegate):t=oP(this._delegate),t.then(n=>new Lc(this.firestore,new hn(this.firestore._delegate,this._userDataWriter,this._delegate,n._snapshot)))}onSnapshot(...e){const t=Hg(e),n=Qg(e,i=>new Lc(this.firestore,new hn(this.firestore._delegate,this._userDataWriter,this._delegate,i._snapshot)));return zg(this._delegate,t,n)}withConverter(e){return new $e(this.firestore,e?this._delegate.withConverter(Wn.getInstance(this.firestore,e)):this._delegate.withConverter(null))}}class RP{constructor(e,t){this._firestore=e,this._delegate=t}get type(){return this._delegate.type}get doc(){return new as(this._firestore,this._delegate.doc)}get oldIndex(){return this._delegate.oldIndex}get newIndex(){return this._delegate.newIndex}}class Lc{constructor(e,t){this._firestore=e,this._delegate=t}get query(){return new $e(this._firestore,this._delegate.query)}get metadata(){return this._delegate.metadata}get size(){return this._delegate.size}get empty(){return this._delegate.empty}get docs(){return this._delegate.docs.map(e=>new as(this._firestore,e))}docChanges(e){return this._delegate.docChanges(e).map(t=>new RP(this._firestore,t))}forEach(e,t){this._delegate.forEach(n=>{e.call(t,new as(this._firestore,n))})}isEqual(e){return $g(this._delegate,e._delegate)}}class Fr extends $e{constructor(e,t){super(e,t),this.firestore=e,this._delegate=t}get id(){return this._delegate.id}get path(){return this._delegate.path}get parent(){const e=this._delegate.parent;return e?new it(this.firestore,e):null}doc(e){try{return e===void 0?new it(this.firestore,No(this._delegate)):new it(this.firestore,No(this._delegate,e))}catch(t){throw ze(t,"doc()","CollectionReference.doc()")}}add(e){return lP(this._delegate,e).then(t=>new it(this.firestore,t))}isEqual(e){return Cg(this._delegate,e._delegate)}withConverter(e){return new Fr(this.firestore,e?this._delegate.withConverter(Wn.getInstance(this.firestore,e)):this._delegate.withConverter(null))}}function Vn(r){return ee(r,de)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(...e){this._delegate=new ln(...e)}static documentId(){return new fl(ue.keyField().canonicalString())}isEqual(e){return e=j(e),e instanceof ln?this._delegate._internalPath.isEqual(e._internalPath):!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(e){this._delegate=e}static serverTimestamp(){const e=_P();return e._methodName="FieldValue.serverTimestamp",new Cn(e)}static delete(){const e=gP();return e._methodName="FieldValue.delete",new Cn(e)}static arrayUnion(...e){const t=yP(...e);return t._methodName="FieldValue.arrayUnion",new Cn(t)}static arrayRemove(...e){const t=IP(...e);return t._methodName="FieldValue.arrayRemove",new Cn(t)}static increment(e){const t=vP(e);return t._methodName="FieldValue.increment",new Cn(t)}isEqual(e){return this._delegate.isEqual(e._delegate)}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PP={Firestore:Gg,GeoPoint:oa,Timestamp:he,Blob:ss,Transaction:Kg,WriteBatch:Wg,DocumentReference:it,DocumentSnapshot:os,Query:$e,QueryDocumentSnapshot:as,QuerySnapshot:Lc,CollectionReference:Fr,FieldPath:fl,FieldValue:Cn,setLogLevel:bP,CACHE_SIZE_UNLIMITED:NR};function SP(r,e){r.INTERNAL.registerComponent(new It("firestore-compat",t=>{const n=t.getProvider("app-compat").getImmediate(),i=t.getProvider("firestore").getImmediate();return e(n,i)},"PUBLIC").setServiceProps(Object.assign({},PP)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CP(r){SP(r,(e,t)=>new Gg(e,t,new AP)),r.registerVersion(wP,TP)}CP(cs);export{cs as f};

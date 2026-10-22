import{r as l}from"./index.t7h89SRg.js";var _={exports:{}},x={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var P=l,$=Symbol.for("react.element"),B=Symbol.for("react.fragment"),O=Object.prototype.hasOwnProperty,D=P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,F={key:!0,ref:!0,__self:!0,__source:!0};function p(t,e,r){var o,s={},i=null,c=null;r!==void 0&&(i=""+r),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(c=e.ref);for(o in e)O.call(e,o)&&!F.hasOwnProperty(o)&&(s[o]=e[o]);if(t&&t.defaultProps)for(o in e=t.defaultProps,e)s[o]===void 0&&(s[o]=e[o]);return{$$typeof:$,type:t,key:i,ref:c,props:s,_owner:D.current}}x.Fragment=B;x.jsx=p;x.jsxs=p;_.exports=x;var V=_.exports;/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=t=>t?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function q(t,e,r=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:U(t),size:24,node:e,...r.length>0?{aliases:r}:{}}}/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=t=>{let e="",r=!1;for(const o of t){if(o==="-"||o==="_"||o<=" "){r=e.length>0;continue}e.length===0?e+=o.toLowerCase():e+=r?o.toUpperCase():o,r=!1}return e};/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=t=>{const e=T(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(...t)=>t.filter((e,r,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===r).join(" ").trim();/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function C(t){return t!=null}function H(t,e={}){const r=e.attributeNames??{},o=n=>r[n]??n,s=t.size??t.width??d.width,i=t.size??t.height??d.height,c=t.aliases?.filter(n=>typeof n=="string"&&n.trim()!=="").map(n=>`lucide-${n}`)??[],f=[...t.name?[`lucide-${t.name}`]:[],...c],a=e.className?.split(" ").filter(Boolean)??[],w=e.includeDefaultClasses===!1?y(...a):y("lucide",...f,...a),b=e.absoluteStrokeWidth?Number(e.strokeWidth??d["stroke-width"])*Number(t.size??t.width??d.width)/Number(e.size??e.width??d.width):e.strokeWidth??d["stroke-width"];return["svg",{...Object.entries(d).reduce((n,[u,h])=>(n[o(u)]=h,n),{}),..."color"in e&&e.color&&{[o("stroke")]:e.color},..."size"in e&&C(e.size)&&{[o("width")]:e.size,[o("height")]:e.size},..."width"in e&&C(e.width)&&{[o("width")]:e.width},..."height"in e&&C(e.height)&&{[o("height")]:e.height},[o("stroke-width")]:b,...w&&{[o("class")]:w},[o("viewBox")]:`0 0 ${s} ${i}`,...e.hasA11yProp===!1?{[o("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(n=>{const[u,h,k]=n,g=e.nonScalingStroke?{[o("vector-effect")]:"non-scaling-stroke",...h}:h;return k?[u,g,k]:[u,g]})]}/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function J(t,e={}){return H(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},Y=l.createContext({}),Z=()=>l.useContext(Y),G=l.forwardRef(({color:t,size:e,width:r,height:o,strokeWidth:s,absoluteStrokeWidth:i,nonScalingStroke:c,className:f="",children:a,iconNode:w=[],icon:b={node:w,aliases:[],size:24},...m},n)=>{const{size:u=24,strokeWidth:h=2,absoluteStrokeWidth:k=!1,nonScalingStroke:g=!1,color:z="currentColor",className:A=""}=Z()??{},L=!!a||K(m),[W,E,R=[]]=J(b,{color:t??z,width:r??e??u,height:o??e??u,strokeWidth:s??h,absoluteStrokeWidth:i??k,nonScalingStroke:c??g,className:y(A,f),hasA11yProp:L,attributes:m});return l.createElement(W,{ref:n,...E},[...R.map(([j,I])=>l.createElement(j,I)),...Array.isArray(a)?a:[a]])});/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function S(t,e=[],r=[]){const o=typeof t=="string"?q(t,e,r):t,s=l.forwardRef(({className:i,...c},f)=>l.createElement(G,{ref:f,icon:o,className:i,...c}));return o.name&&(s.displayName=M(o.name)),s}/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N={name:"arrow-right",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]};N.node;const X=S(N);/**
 * @license lucide-react v1.48.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v={name:"star",size:24,node:[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]};v.node;const ee=S(v);export{X as A,ee as S,S as c,V as j};

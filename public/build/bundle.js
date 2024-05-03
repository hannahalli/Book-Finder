var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode&&t.parentNode.removeChild(t)}function u(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function a(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function d(){return f(" ")}function p(){return f("")}function m(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e){e=""+e,t.data!==e&&(t.data=e)}function $(t,e){return new t(e)}let k;function b(t){k=t}function v(t){(function(){if(!k)throw new Error("Function called outside component initialization");return k})().$$.on_mount.push(t)}const w=[],y=[];let x=[];const T=[],C=Promise.resolve();let _=!1;function E(t){x.push(t)}const N=new Set;let j=0;function A(){if(0!==j)return;const t=k;do{try{for(;j<w.length;){const t=w[j];j++,b(t),D(t.$$)}}catch(t){throw w.length=0,j=0,t}for(b(null),w.length=0,j=0;y.length;)y.pop()();for(let t=0;t<x.length;t+=1){const e=x[t];N.has(e)||(N.add(e),e())}x.length=0}while(w.length);for(;T.length;)T.pop()();_=!1,N.clear(),b(t)}function D(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const L=new Set;let q;function F(){q={r:0,c:[],p:q}}function P(){q.r||o(q.c),q=q.p}function M(t,e){t&&t.i&&(L.delete(t),t.i(e))}function B(t,e,n,o){if(t&&t.o){if(L.has(t))return;L.add(t),q.c.push((()=>{L.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function z(t){t&&t.c()}function H(t,n,c,l){const{fragment:s,after_update:i}=t.$$;s&&s.m(n,c),l||E((()=>{const n=t.$$.on_mount.map(e).filter(r);t.$$.on_destroy?t.$$.on_destroy.push(...n):o(n),t.$$.on_mount=[]})),i.forEach(E)}function O(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];x.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),x=e}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function R(t,e){-1===t.$$.dirty[0]&&(w.push(t),_||(_=!0,C.then(A)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(e,r,c,l,s,u,a,f=[-1]){const d=k;b(e);const p=e.$$={fragment:null,ctx:[],props:u,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(d?d.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:r.target||d.$$.root};a&&a(p.root);let m=!1;if(p.ctx=c?c(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return p.ctx&&s(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),m&&R(e,t)),n})):[],p.update(),m=!0,o(p.before_update),p.fragment=!!l&&l(p.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);p.fragment&&p.fragment.l(t),t.forEach(i)}else p.fragment&&p.fragment.c();r.intro&&M(e.$$.fragment),H(e,r.target,r.anchor,r.customElement),A()}b(d)}class I{$destroy(){O(this,1),this.$destroy=t}$on(e,n){if(!r(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function S(e){let n,o;return n=new yt({}),{c(){z(n.$$.fragment)},m(t,e){H(n,t,e),o=!0},p:t,i(t){o||(M(n.$$.fragment,t),o=!0)},o(t){B(n.$$.fragment,t),o=!1},d(t){O(n,t)}}}function U(e){let n,o,r,c,u,m,$,k,b=e[1]&&Y(e);return{c(){n=a("h2"),o=f(e[0]),r=d(),c=a("p"),u=f("Location: "),m=f(e[1]),$=d(),b&&b.c(),k=p(),h(n,"class","svelte-180s4k7"),h(c,"class","svelte-180s4k7")},m(t,e){s(t,n,e),l(n,o),s(t,r,e),s(t,c,e),l(c,u),l(c,m),s(t,$,e),b&&b.m(t,e),s(t,k,e)},p(t,e){1&e&&g(o,t[0]),2&e&&g(m,t[1]),t[1]?b?b.p(t,e):(b=Y(t),b.c(),b.m(k.parentNode,k)):b&&(b.d(1),b=null)},i:t,o:t,d(t){t&&i(n),t&&i(r),t&&i(c),t&&i($),b&&b.d(t),t&&i(k)}}}function Y(t){let e,n,o,r;function c(t,e){return"Clock Tower"===t[1]?Q:"Book Cart"===t[1]?K:"Wooden Crates"===t[1]?J:G}let l=c(t),u=l(t);return{c(){u.c(),e=d(),n=a("button"),n.textContent="Find Another Book!",h(n,"class","svelte-180s4k7")},m(c,l){u.m(c,l),s(c,e,l),s(c,n,l),o||(r=m(n,"click",t[3]),o=!0)},p(t,n){l!==(l=c(t))&&(u.d(1),u=l(t),u&&(u.c(),u.m(e.parentNode,e)))},d(t){u.d(t),t&&i(e),t&&i(n),o=!1,r()}}}function G(t){let e;return{c(){e=a("p"),e.textContent="No specific instruction available.",h(e,"class","svelte-180s4k7")},m(t,n){s(t,e,n)},d(t){t&&i(e)}}}function J(t){let e,n,o;return{c(){e=a("p"),e.textContent="Cast your gaze to the left and discover the book you seek!",n=d(),o=a("div"),o.innerHTML='<img src="./arrow.png" alt="Left Arrow" class="arrow-img svelte-180s4k7"/>',h(e,"class","svelte-180s4k7"),h(o,"class","arrow-left svelte-180s4k7")},m(t,r){s(t,e,r),s(t,n,r),s(t,o,r)},d(t){t&&i(e),t&&i(n),t&&i(o)}}}function K(t){let e,n,o;return{c(){e=a("p"),e.textContent="Look down and unearth the book you seek!",n=d(),o=a("div"),o.innerHTML='<img src="./arrow.png" alt="Down Arrow" class="arrow-img svelte-180s4k7"/>',h(e,"class","svelte-180s4k7"),h(o,"class","arrow-down svelte-180s4k7")},m(t,r){s(t,e,r),s(t,n,r),s(t,o,r)},d(t){t&&i(e),t&&i(n),t&&i(o)}}}function Q(t){let e,n,o;return{c(){e=a("p"),e.textContent="Look to the right to find the book you seek!",n=d(),o=a("div"),o.innerHTML='<img src="./arrow.png" alt="Right Arrow" class="arrow-img svelte-180s4k7"/>',h(e,"class","svelte-180s4k7"),h(o,"class","arrow-right svelte-180s4k7")},m(t,r){s(t,e,r),s(t,n,r),s(t,o,r)},d(t){t&&i(e),t&&i(n),t&&i(o)}}}function V(t){let e,n,o,r;const c=[U,S],l=[];function u(t,e){return t[2]?0:1}return e=u(t),n=l[e]=c[e](t),{c(){n.c(),o=p()},m(t,n){l[e].m(t,n),s(t,o,n),r=!0},p(t,[r]){let s=e;e=u(t),e===s?l[e].p(t,r):(F(),B(l[s],1,1,(()=>{l[s]=null})),P(),n=l[e],n?n.p(t,r):(n=l[e]=c[e](t),n.c()),M(n,1),n.m(o.parentNode,o))},i(t){r||(M(n),r=!0)},o(t){B(n),r=!1},d(t){l[e].d(t),t&&i(o)}}}function X(t,e,n){let{bookTitle:o}=e,{location:r}=e,c=!0;return t.$$set=t=>{"bookTitle"in t&&n(0,o=t.bookTitle),"location"in t&&n(1,r=t.location)},[o,r,c,function(){n(2,c=!1)}]}class Z extends I{constructor(t){super(),W(this,t,X,V,c,{bookTitle:0,location:1})}}function tt(e){let n,o,r,c,u,p,$,k,b,v,w=e[1].Title+"",y=e[1].Author&&nt(e),x=e[1]["Edition Date"]&&ot(e),T=e[1].Publisher&&rt(e),C=e[1].Description&&ct(e);return{c(){n=a("h2"),o=f(w),r=d(),y&&y.c(),c=d(),x&&x.c(),u=d(),T&&T.c(),p=d(),C&&C.c(),$=d(),k=a("button"),k.textContent="Find Me!",h(n,"class","svelte-tqmw13"),h(k,"class","svelte-tqmw13")},m(t,i){s(t,n,i),l(n,o),s(t,r,i),y&&y.m(t,i),s(t,c,i),x&&x.m(t,i),s(t,u,i),T&&T.m(t,i),s(t,p,i),C&&C.m(t,i),s(t,$,i),s(t,k,i),b||(v=m(k,"click",e[3]),b=!0)},p(t,e){2&e&&w!==(w=t[1].Title+"")&&g(o,w),t[1].Author?y?y.p(t,e):(y=nt(t),y.c(),y.m(c.parentNode,c)):y&&(y.d(1),y=null),t[1]["Edition Date"]?x?x.p(t,e):(x=ot(t),x.c(),x.m(u.parentNode,u)):x&&(x.d(1),x=null),t[1].Publisher?T?T.p(t,e):(T=rt(t),T.c(),T.m(p.parentNode,p)):T&&(T.d(1),T=null),t[1].Description?C?C.p(t,e):(C=ct(t),C.c(),C.m($.parentNode,$)):C&&(C.d(1),C=null)},i:t,o:t,d(t){t&&i(n),t&&i(r),y&&y.d(t),t&&i(c),x&&x.d(t),t&&i(u),T&&T.d(t),t&&i(p),C&&C.d(t),t&&i($),t&&i(k),b=!1,v()}}}function et(t){let e,n;return e=new Z({props:{bookTitle:t[0],location:t[2].location}}),{c(){z(e.$$.fragment)},m(t,o){H(e,t,o),n=!0},p(t,n){const o={};1&n&&(o.bookTitle=t[0]),4&n&&(o.location=t[2].location),e.$set(o)},i(t){n||(M(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){O(e,t)}}}function nt(t){let e,n,o,r=t[1].Author+"";return{c(){e=a("p"),n=f("Author: "),o=f(r),h(e,"class","svelte-tqmw13")},m(t,r){s(t,e,r),l(e,n),l(e,o)},p(t,e){2&e&&r!==(r=t[1].Author+"")&&g(o,r)},d(t){t&&i(e)}}}function ot(t){let e,n,o,r=t[1]["Edition Date"]+"";return{c(){e=a("p"),n=f("Publication Date: "),o=f(r),h(e,"class","svelte-tqmw13")},m(t,r){s(t,e,r),l(e,n),l(e,o)},p(t,e){2&e&&r!==(r=t[1]["Edition Date"]+"")&&g(o,r)},d(t){t&&i(e)}}}function rt(t){let e,n,o,r=t[1].Publisher+"";return{c(){e=a("p"),n=f("Publisher: "),o=f(r),h(e,"class","svelte-tqmw13")},m(t,r){s(t,e,r),l(e,n),l(e,o)},p(t,e){2&e&&r!==(r=t[1].Publisher+"")&&g(o,r)},d(t){t&&i(e)}}}function ct(t){let e,n,o,r=t[1].Description+"";return{c(){e=a("p"),n=f("Description: "),o=f(r),h(e,"class","description svelte-tqmw13")},m(t,r){s(t,e,r),l(e,n),l(e,o)},p(t,e){2&e&&r!==(r=t[1].Description+"")&&g(o,r)},d(t){t&&i(e)}}}function lt(t){let e,n,o,r;const c=[et,tt],l=[];function u(t,e){return t[2]?0:t[1]?1:-1}return~(e=u(t))&&(n=l[e]=c[e](t)),{c(){n&&n.c(),o=p()},m(t,n){~e&&l[e].m(t,n),s(t,o,n),r=!0},p(t,[r]){let s=e;e=u(t),e===s?~e&&l[e].p(t,r):(n&&(F(),B(l[s],1,1,(()=>{l[s]=null})),P()),~e?(n=l[e],n?n.p(t,r):(n=l[e]=c[e](t),n.c()),M(n,1),n.m(o.parentNode,o)):n=null)},i(t){r||(M(n),r=!0)},o(t){B(n),r=!1},d(t){~e&&l[e].d(t),t&&i(o)}}}function st(t,e,n){let{bookTitle:o}=e,r=null,c=null;return v((async()=>{await async function(t){try{const e=await fetch(`https://book-server-n6xk.onrender.com/search?title=${encodeURIComponent(t)}`);e.ok?n(1,r=await e.json()):console.error("Failed to fetch book details:",e.statusText)}catch(t){console.error("Error fetching book details:",t)}}(o)})),t.$$set=t=>{"bookTitle"in t&&n(0,o=t.bookTitle)},[o,r,c,async function(){await async function(t){try{const e=await fetch(`https://book-server-n6xk.onrender.com/book-location/${encodeURIComponent(t)}`);e.ok?n(2,c=await e.json()):console.error("Failed to fetch location:",e.statusText)}catch(t){console.error("Error fetching location:",t)}}(o)}]}class it extends I{constructor(t){super(),W(this,t,st,lt,c,{bookTitle:0})}}function ut(t,e,n){const o=t.slice();return o[7]=e[n],o}function at(t){let e,n;return e=new it({props:{bookTitle:t[2]}}),{c(){z(e.$$.fragment)},m(t,o){H(e,t,o),n=!0},p(t,n){const o={};4&n&&(o.bookTitle=t[2]),e.$set(o)},i(t){n||(M(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){O(e,t)}}}function ft(e){let n,o,r,c=e[0],f=[];for(let t=0;t<c.length;t+=1)f[t]=dt(ut(e,c,t));return{c(){n=a("div"),o=a("h2"),o.textContent="Pick a Book to Learn More!",r=d();for(let t=0;t<f.length;t+=1)f[t].c();h(o,"class","svelte-ib6y6m")},m(t,e){s(t,n,e),l(n,o),l(n,r);for(let t=0;t<f.length;t+=1)f[t]&&f[t].m(n,null)},p(t,e){if(9&e){let o;for(c=t[0],o=0;o<c.length;o+=1){const r=ut(t,c,o);f[o]?f[o].p(r,e):(f[o]=dt(r),f[o].c(),f[o].m(n,null))}for(;o<f.length;o+=1)f[o].d(1);f.length=c.length}},i:t,o:t,d(t){t&&i(n),u(f,t)}}}function dt(t){let e,n,o,r,c=t[7]+"";function u(){return t[5](t[7])}return{c(){e=a("button"),n=f(c),h(e,"class","book-button svelte-ib6y6m")},m(t,c){s(t,e,c),l(e,n),o||(r=m(e,"click",u),o=!0)},p(e,o){t=e,1&o&&c!==(c=t[7]+"")&&g(n,c)},d(t){t&&i(e),o=!1,r()}}}function pt(t){let e,n,o,r;const c=[ft,at],l=[];function u(t,e){return t[1]?1:0}return e=u(t),n=l[e]=c[e](t),{c(){n.c(),o=p()},m(t,n){l[e].m(t,n),s(t,o,n),r=!0},p(t,[r]){let s=e;e=u(t),e===s?l[e].p(t,r):(F(),B(l[s],1,1,(()=>{l[s]=null})),P(),n=l[e],n?n.p(t,r):(n=l[e]=c[e](t),n.c()),M(n,1),n.m(o.parentNode,o))},i(t){r||(M(n),r=!0)},o(t){B(n),r=!1},d(t){l[e].d(t),t&&i(o)}}}function mt(t,e,n){let{selectedCategory:o}=e,r=[],c=!1,l="";function s(t){n(1,c=!0),n(2,l=t)}v((async()=>{await async function(t){try{const e=await fetch(`https://book-server-n6xk.onrender.com/books/${t}`);if(e.ok){const t=await e.json();n(0,r=t.bookTitles)}else console.error("Failed to fetch books:",e.statusText)}catch(t){console.error("Error fetching books:",t)}}(o)}));return t.$$set=t=>{"selectedCategory"in t&&n(4,o=t.selectedCategory)},[r,c,l,s,o,t=>s(t)]}class ht extends I{constructor(t){super(),W(this,t,mt,pt,c,{selectedCategory:4})}}function gt(t,e,n){const o=t.slice();return o[7]=e[n],o}function $t(e){let n,o,r,c=e[0],f=[];for(let t=0;t<c.length;t+=1)f[t]=bt(gt(e,c,t));return{c(){n=a("div"),o=a("h2"),o.textContent="What Do You Want To Read?",r=d();for(let t=0;t<f.length;t+=1)f[t].c();h(o,"class","svelte-qj6zgf")},m(t,e){s(t,n,e),l(n,o),l(n,r);for(let t=0;t<f.length;t+=1)f[t]&&f[t].m(n,null)},p(t,e){if(9&e){let o;for(c=t[0],o=0;o<c.length;o+=1){const r=gt(t,c,o);f[o]?f[o].p(r,e):(f[o]=bt(r),f[o].c(),f[o].m(n,null))}for(;o<f.length;o+=1)f[o].d(1);f.length=c.length}},i:t,o:t,d(t){t&&i(n),u(f,t)}}}function kt(t){let e,n;return e=new ht({props:{selectedCategory:t[1]}}),e.$on("back",t[4]),{c(){z(e.$$.fragment)},m(t,o){H(e,t,o),n=!0},p(t,n){const o={};2&n&&(o.selectedCategory=t[1]),e.$set(o)},i(t){n||(M(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){O(e,t)}}}function bt(t){let e,n,o,r,c=t[7]+"";function u(){return t[5](t[7])}return{c(){e=a("button"),n=f(c),h(e,"class","category-button svelte-qj6zgf")},m(t,c){s(t,e,c),l(e,n),o||(r=m(e,"click",u),o=!0)},p(e,o){t=e,1&o&&c!==(c=t[7]+"")&&g(n,c)},d(t){t&&i(e),o=!1,r()}}}function vt(t){let e,n,o,r;const c=[kt,$t],l=[];function u(t,e){return t[2]?0:1}return e=u(t),n=l[e]=c[e](t),{c(){n.c(),o=p()},m(t,n){l[e].m(t,n),s(t,o,n),r=!0},p(t,[r]){let s=e;e=u(t),e===s?l[e].p(t,r):(F(),B(l[s],1,1,(()=>{l[s]=null})),P(),n=l[e],n?n.p(t,r):(n=l[e]=c[e](t),n.c()),M(n,1),n.m(o.parentNode,o))},i(t){r||(M(n),r=!0)},o(t){B(n),r=!1},d(t){l[e].d(t),t&&i(o)}}}function wt(t,e,n){let o=[],r=null,c=!1;function l(t){console.log("Clicked Category:",t),n(1,r=t),n(2,c=!0)}!async function(){try{const t=await fetch("https://book-server-n6xk.onrender.com/");t.ok?n(0,o=await t.json()):console.error("Failed to fetch categories:",t.statusText)}catch(t){console.error("Error fetching categories:",t)}}();return[o,r,c,l,function(){n(2,c=!1),n(1,r=null)},t=>l(t)]}class yt extends I{constructor(t){super(),W(this,t,wt,vt,c,{})}}function xt(e){let n,o,r,c,l,u,f;return{c(){n=a("h1"),n.textContent="Welcome to the Book Finder!",o=d(),r=a("div"),r.innerHTML='<p class="svelte-1j1u68e">There are so many wonderful stories to read! Look through the different categories to find a book.</p>',c=d(),l=a("button"),l.textContent="Find a Book!",h(n,"class","svelte-1j1u68e"),h(r,"class","paragraph-container svelte-1j1u68e"),h(l,"class","svelte-1j1u68e")},m(t,i){s(t,n,i),s(t,o,i),s(t,r,i),s(t,c,i),s(t,l,i),u||(f=m(l,"click",e[1]),u=!0)},p:t,d(t){t&&i(n),t&&i(o),t&&i(r),t&&i(c),t&&i(l),u=!1,f()}}}function Tt(t){let e,n,o;var r=t[0];return r&&(e=$(r,{})),{c(){e&&z(e.$$.fragment),n=p()},m(t,r){e&&H(e,t,r),s(t,n,r),o=!0},p(t,o){if(1&o&&r!==(r=t[0])){if(e){F();const t=e;B(t.$$.fragment,1,0,(()=>{O(t,1)})),P()}r?(e=$(r,{}),z(e.$$.fragment),M(e.$$.fragment,1),H(e,n.parentNode,n)):e=null}},i(t){o||(e&&M(e.$$.fragment,t),o=!0)},o(t){e&&B(e.$$.fragment,t),o=!1},d(t){t&&i(n),e&&O(e,t)}}}function Ct(t){let e,n,o,r=!t[0]&&xt(t),c=t[0]&&Tt(t);return{c(){e=a("div"),r&&r.c(),n=d(),c&&c.c(),h(e,"class","container svelte-1j1u68e")},m(t,i){s(t,e,i),r&&r.m(e,null),l(e,n),c&&c.m(e,null),o=!0},p(t,[o]){t[0]?r&&(r.d(1),r=null):r?r.p(t,o):(r=xt(t),r.c(),r.m(e,n)),t[0]?c?(c.p(t,o),1&o&&M(c,1)):(c=Tt(t),c.c(),M(c,1),c.m(e,null)):c&&(F(),B(c,1,1,(()=>{c=null})),P())},i(t){o||(M(c),o=!0)},o(t){B(c),o=!1},d(t){t&&i(e),r&&r.d(),c&&c.d()}}}function _t(t,e,n){let o=null;return[o,()=>{n(0,o=yt)}]}return new class extends I{constructor(t){super(),W(this,t,_t,Ct,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map

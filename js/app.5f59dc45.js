(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{0:function(e,t,n){e.exports=n("2f39")},"2f39":function(e,t,n){"use strict";n.r(t);var r=n("967e"),o=n.n(r),a=(n("a481"),n("96cf"),n("fa84")),s=n.n(a),c=(n("573e"),n("7d6e"),n("e54f"),n("62f2"),n("7e6d"),n("2b0e")),l=n("1f91"),u=n("42d2"),i=n("b05d"),d=n("18d6");c["a"].use(i["a"],{config:{dark:"auto"},lang:l["a"],iconSet:u["a"],plugins:{LocalStorage:d["a"]}});var f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"q-app"}},[n("router-view")],1)},p=[],b=n("60a3"),m=function(e,t,n,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)s=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(s=(a<3?o(s):a>3?o(t,n,s):o(t,n))||s);return a>3&&s&&Object.defineProperty(t,n,s),s};let h=class extends b["d"]{created(){const e=this.$q.localStorage.getItem("darkMode");null==e||"boolean"!=typeof e&&"auto"!=e||this.$q.dark.set(e)}};h=m([b["a"]],h);var w=h,v=w,g=n("2877"),x=Object(g["a"])(v,f,p,!1,null,null,null),y=x.exports,C=n("4bde"),k=n("2f62");const j={debugWindow:{visible:!1,maximized:!1}};var W=j;const P={};var z=P;const O={};var q=O;const T={toggleDebugWindow(e){e.debugWindow.visible=!e.debugWindow.visible},toggleDebugWindowMaximized(e){e.debugWindow.maximized=!e.debugWindow.maximized}};var M=T;const N={namespaced:!0,actions:z,getters:q,mutations:M,state:W};var R=N;const V={controllers:[],clouds:{},cloudCredentials:[]};var D=V,I=n("b2da");const Y={someAction(){}};var A=Y,B=n("cf2e");const S={namespaced:!0,actions:I["b"],getters:A,mutations:B["a"],state:D};var $=S,G=Object(C["store"])((function({Vue:e}){e.use(k["a"]);const t=new k["a"].Store({modules:{floatingWindows:R,juju:$},strict:!1});return t})),L=n("8c4f");const J=[{path:"/",component:()=>Promise.all([n.e(0),n.e(3)]).then(n.bind(null,"713b")),children:[{path:"",name:"home",redirect:"/controllers"},{path:"/controllers",name:"controllers",component:()=>Promise.all([n.e(0),n.e(7)]).then(n.bind(null,"a7d4"))},{path:"/models",name:"models",component:()=>n.e(8).then(n.bind(null,"56c6"))},{path:"/admin",name:"admin",component:()=>n.e(6).then(n.bind(null,"34ab"))},{path:"/welcome",name:"welcome",component:()=>Promise.all([n.e(0),n.e(4)]).then(n.bind(null,"35a8"))}]}];J.push({path:"*",component:()=>Promise.all([n.e(0),n.e(5)]).then(n.bind(null,"e51e"))});var K=J,E=n("fe09"),H=Object(C["route"])((function({Vue:e}){e.use(L["a"]);const t=new L["a"]({scrollBehavior:()=>({x:0,y:0}),routes:K,mode:"hash",base:""});return t.beforeEach((e,t,n)=>{const r="seen-juju-lens-before";if(E["a"].getItem(r)||"welcome"==e.name)n();else{n({name:"welcome",query:Object.assign({welcomePageTo:e.fullPath},e.query)});try{E["a"].set(r,"true")}catch(o){console.error(o)}}}),t})),Q=function(){return _.apply(this,arguments)};function _(){return _=s()(o.a.mark((function e(){var t,n,r;return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("function"!==typeof G){e.next=6;break}return e.next=3,G({Vue:c["a"]});case 3:e.t0=e.sent,e.next=7;break;case 6:e.t0=G;case 7:if(t=e.t0,"function"!==typeof H){e.next=14;break}return e.next=11,H({Vue:c["a"],store:t});case 11:e.t1=e.sent,e.next=15;break;case 14:e.t1=H;case 15:return n=e.t1,t.$router=n,r={router:n,store:t,render:function(e){return e(y)}},r.el="#q-app",e.abrupt("return",{app:r,store:t,router:n});case 20:case"end":return e.stop()}}),e)}))),_.apply(this,arguments)}var U=n("bc3a"),X=n.n(U),F=Object(C["boot"])(({Vue:e})=>{e.prototype.$axios=X.a});function Z(){return ee.apply(this,arguments)}function ee(){return ee=s()(o.a.mark((function e(){var t,n,r,a,s,l,u,i,d;return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Q();case 2:t=e.sent,n=t.app,r=t.store,a=t.router,s=!0,l=function(e){s=!1,window.location.href=e},u=window.location.href.replace(window.location.origin,""),i=[F],d=0;case 11:if(!(!0===s&&d<i.length)){e.next=29;break}if("function"===typeof i[d]){e.next=14;break}return e.abrupt("continue",26);case 14:return e.prev=14,e.next=17,i[d]({app:n,router:a,store:r,Vue:c["a"],ssrContext:null,redirect:l,urlPath:u});case 17:e.next=26;break;case 19:if(e.prev=19,e.t0=e["catch"](14),!e.t0||!e.t0.url){e.next=24;break}return window.location.href=e.t0.url,e.abrupt("return");case 24:return console.error("[Quasar] boot error:",e.t0),e.abrupt("return");case 26:d++,e.next=11;break;case 29:if(!1!==s){e.next=31;break}return e.abrupt("return");case 31:new c["a"](n);case 32:case"end":return e.stop()}}),e,null,[[14,19]])}))),ee.apply(this,arguments)}Z()},"7e6d":function(e,t,n){},b2da:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var r=n("cf2e"),o={controllers:[{name:"my-controller",cloud:"aws",region:"us-west",accessLevel:"admin"}],clouds:{aws:{availableRegions:["us-west","us-east","asia"]},azure:{availableRegions:["centralus","centralasion"]}},cloudCredentials:[{name:"my-aws-creds",accessKey:"y5dh1MGzHBv541YA8ONI3zGjTkLpnf46TCNbWDxi",secretKey:"iBMlj6jrl93i27NBYrwNvJYXq2UbhQ"},{name:"my-azure-creds",adAId:"y5dh1MGzHBv541YA8ONI3zGjTkLpnf46TCNbWDxi",sId:"VW29TSfKD",adAP:"mNfq7YWRwTgfW5vwfxYRp"}]};const a=o,s={loadControllers:"loadControllers"};function c(){const e=[100,200,500,1e3,1500,2e3];return e[Math.floor(Math.random()*e.length)]}function l(e){return new Promise(t=>{setTimeout(()=>t(e()),c())})}const u={[s.loadControllers](e){return l(()=>{e.commit(r["b"].setControllers,a.controllers)})}};t["b"]=u},cf2e:function(e,t,n){"use strict";n.d(t,"b",(function(){return r}));const r={setControllers:"setControllers",setClouds:"setClouds",setCloudCredentials:"setCloudCredentials"},o={[r.setControllers](e,t){e.controllers=t},[r.setClouds](e,t){e.clouds=t},[r.setCloudCredentials](e,t){e.cloudCredentials=t}};t["a"]=o}},[[0,2,0]]]);
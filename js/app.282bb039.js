(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{0:function(e,t,r){e.exports=r("2f39")},"2f39":function(e,t,r){"use strict";r.r(t);var n=r("967e"),o=r.n(n),l=(r("a481"),r("96cf"),r("fa84")),a=r.n(l),d=(r("573e"),r("7d6e"),r("e54f"),r("62f2"),r("7e6d"),r("2b0e")),i=r("1f91"),u=r("42d2"),s=r("b05d"),c=r("436b"),C=r("18d6"),p=r("2a19");d["a"].use(s["a"],{config:{dark:"auto",notify:{position:"top-right"}},lang:i["a"],iconSet:u["a"],plugins:{Dialog:c["a"],LocalStorage:C["a"],Notify:p["a"]}});var f=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"q-app"}},[r("router-view")],1)},m=[],b=r("60a3"),h=function(e,t,r,n){var o,l=arguments.length,a=l<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var d=e.length-1;d>=0;d--)(o=e[d])&&(a=(l<3?o(a):l>3?o(t,r,a):o(t,r))||a);return l>3&&a&&Object.defineProperty(t,r,a),a};let w=class extends b["d"]{created(){const e=this.$q.localStorage.getItem("darkMode");null==e||"boolean"!=typeof e&&"auto"!=e||this.$q.dark.set(e)}};w=h([b["a"]],w);var y=w,g=y,v=r("2877"),A=Object(v["a"])(g,f,m,!1,null,null,null),x=A.exports,k=r("4bde"),P=r("2f62");const W={debugWindow:{visible:!1,maximized:!1}};var z=W;const I={};var N=I;const j={};var D=j;const K={toggleDebugWindow(e){e.debugWindow.visible=!e.debugWindow.visible},toggleDebugWindowMaximized(e){e.debugWindow.maximized=!e.debugWindow.maximized}};var L=K;const S={namespaced:!0,actions:N,getters:D,mutations:L,state:z};var O=S;const B={currentController:null,controllers:[],clouds:[],cloudCredentials:[]};var R=B,q=r("b2da");const M={someAction(){}};var G=M,J=r("cf2e");const T={namespaced:!0,actions:q["b"],getters:G,mutations:J["a"],state:R};var V=T,U=Object(k["store"])((function({Vue:e}){e.use(P["a"]);const t=new P["a"].Store({modules:{app:O,juju:V},strict:!1});return t})),Y=r("8c4f");const E=[{path:"/",component:()=>Promise.all([r.e(0),r.e(3)]).then(r.bind(null,"713b")),children:[{path:"",name:"home",redirect:"/controllers"},{path:"/controllers",component:()=>Promise.all([r.e(0),r.e(4)]).then(r.bind(null,"a7d4")),children:[{path:"",name:"controllers"},{path:"cloud-credentials",name:"cloud-credentials"}]},{path:"/models",name:"models",component:()=>r.e(9).then(r.bind(null,"56c6"))},{path:"/my-account",name:"my-account",component:()=>Promise.all([r.e(0),r.e(7)]).then(r.bind(null,"8c2d"))},{path:"/admin",name:"admin",component:()=>Promise.all([r.e(0),r.e(8)]).then(r.bind(null,"34ab"))},{path:"/welcome",name:"welcome",component:()=>Promise.all([r.e(0),r.e(5)]).then(r.bind(null,"35a8"))}]}];E.push({path:"*",component:()=>Promise.all([r.e(0),r.e(6)]).then(r.bind(null,"e51e"))});var H=E,$=r("fe09"),F=Object(k["route"])((function({Vue:e}){e.use(Y["a"]);const t=new Y["a"]({scrollBehavior:()=>({x:0,y:0}),routes:H,mode:"hash",base:""});return t.beforeEach((e,t,r)=>{const n="seen-juju-lens-before";if($["a"].getItem(n)||"welcome"==e.name)r();else{r({name:"welcome",query:Object.assign({welcomePageTo:e.fullPath},e.query)});try{$["a"].set(n,"true")}catch(o){console.error(o)}}}),t})),Q=function(){return X.apply(this,arguments)};function X(){return X=a()(o.a.mark((function e(){var t,r,n;return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("function"!==typeof U){e.next=6;break}return e.next=3,U({Vue:d["a"]});case 3:e.t0=e.sent,e.next=7;break;case 6:e.t0=U;case 7:if(t=e.t0,"function"!==typeof F){e.next=14;break}return e.next=11,F({Vue:d["a"],store:t});case 11:e.t1=e.sent,e.next=15;break;case 14:e.t1=F;case 15:return r=e.t1,t.$router=r,n={router:r,store:t,render:function(e){return e(x)}},n.el="#q-app",e.abrupt("return",{app:n,store:t,router:r});case 20:case"end":return e.stop()}}),e)}))),X.apply(this,arguments)}var _=r("bc3a"),Z=r.n(_),ee=Object(k["boot"])(({Vue:e})=>{e.prototype.$axios=Z.a});function te(){return re.apply(this,arguments)}function re(){return re=a()(o.a.mark((function e(){var t,r,n,l,a,i,u,s,c;return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Q();case 2:t=e.sent,r=t.app,n=t.store,l=t.router,a=!0,i=function(e){a=!1,window.location.href=e},u=window.location.href.replace(window.location.origin,""),s=[ee],c=0;case 11:if(!(!0===a&&c<s.length)){e.next=29;break}if("function"===typeof s[c]){e.next=14;break}return e.abrupt("continue",26);case 14:return e.prev=14,e.next=17,s[c]({app:r,router:l,store:n,Vue:d["a"],ssrContext:null,redirect:i,urlPath:u});case 17:e.next=26;break;case 19:if(e.prev=19,e.t0=e["catch"](14),!e.t0||!e.t0.url){e.next=24;break}return window.location.href=e.t0.url,e.abrupt("return");case 24:return console.error("[Quasar] boot error:",e.t0),e.abrupt("return");case 26:c++,e.next=11;break;case 29:if(!1!==a){e.next=31;break}return e.abrupt("return");case 31:new d["a"](r);case 32:case"end":return e.stop()}}),e,null,[[14,19]])}))),re.apply(this,arguments)}te()},"7e6d":function(e,t,r){},b2da:function(e,t,r){"use strict";r.d(t,"a",(function(){return i}));var n=r("cf2e"),o={controllers:[{name:"AWS Prod Controller",id:"mN20lGzuMkVBi",cloudId:"BIfy0JfRercfFNiaLtmxtWaE",region:"us-west",accessLevel:"admin",cloudCredentialId:"X4DNgKiu4SJ"},{name:"Azure Dev Controller",id:"APRmlF23dYHPPcCc",cloudId:"AdzUGKLWNOyfA48Ug",region:"us-west",accessLevel:"user",cloudCredentialId:"85bCHNKPABAaPzQ"}],cloudCredentials:[{name:"Main AWS Creds",id:"X4DNgKiu4SJ",cloudId:"BIfy0JfRercfFNiaLtmxtWaE",credentialData:{accessKey:"y5dh1MGzHBv541YA8ONI3zGjTkLpnf46TCNbWDxi",secretKey:"iBMlj6jrl93i27NBYrwNvJYXq2UbhQ"}},{name:"My Azure Creds",id:"85bCHNKPABAaPzQ",cloudId:"AdzUGKLWNOyfA48Ug",credentialData:{adAId:"y5dh1MGzHBv541YA8ONI3zGjTkLpnf46TCNbWDxi",sId:"VW29TSfKD",adAP:"mNfq7YWRwTgfW5vwfxYRp"}}],clouds:[{name:"AWS",id:"BIfy0JfRercfFNiaLtmxtWaE",availableRegions:["us-west","us-east","asia"],requiredCredentials:[{key:"accessKey",label:"Access Key",description:"AWS access key"},{key:"secretKey",label:"Secret Key",description:"AWS secret key",isPassword:!0}]},{name:"Azure",id:"AdzUGKLWNOyfA48Ug",availableRegions:["centralus","centralasion"],requiredCredentials:[{key:"adAId",label:"Azure Active Directory Application ID"},{key:"sId",label:"Azure Subscription ID"},{key:"adAP",label:"Azure Active Directory Application Password",isPassword:!0}]}]};const l=o;function a(){const e=[100,500,1e3,1500,2e3];return e[Math.floor(Math.random()*e.length)]}function d(e){return new Promise(t=>{setTimeout(()=>t(e()),a())})}const i={loadControllers:"loadControllers",addController:"addController",updateController:"updateController",deleteController:"deleteController",loadCloudCredentials:"loadCloudCredentials",addCloudCredential:"addCloudCredential",updateCloudCredential:"updateCloudCredential",deleteCloudCredential:"deleteCloudCredential",loadCloudList:"loadCloudList"},u={[i.loadControllers](e){return d(()=>{e.commit(n["b"].setControllers,l.controllers)})},[i.addController](e,t){return d(()=>{e.commit(n["b"].addController,t)})},[i.updateController](e,t){return d(()=>{e.commit(n["b"].updateController,t)})},[i.deleteController](e,t){return d(()=>{e.commit(n["b"].deleteController,t)})},[i.loadCloudCredentials](e){return d(()=>{e.commit(n["b"].setCloudCredentials,l.cloudCredentials)})},[i.addCloudCredential](e,t){return d(()=>{e.commit(n["b"].addCloudCredential,t)})},[i.updateCloudCredential](e,t){return d(()=>{e.commit(n["b"].updateCloudCredential,t)})},[i.deleteCloudCredential](e,t){return d(()=>{e.commit(n["b"].deleteCloudCredential,t)})},[i.loadCloudList](e){return d(()=>{e.commit(n["b"].setClouds,l.clouds)})}};t["b"]=u},cf2e:function(e,t,r){"use strict";r.d(t,"b",(function(){return n}));const n={setCurrentController:"setCurrentController",setControllers:"setControllers",addController:"addController",updateController:"updateController",deleteController:"deleteController",setCloudCredentials:"setCloudCredentials",addCloudCredential:"addCloudCredential",updateCloudCredential:"updateCloudCredential",deleteCloudCredential:"deleteCloudCredential",setClouds:"setClouds"},o={[n.setCurrentController](e,t){e.currentController=t},[n.setControllers](e,t){e.controllers=t},[n.addController](e,t){e.controllers.push(t)},[n.updateController](e,t){e.controllers=e.controllers.map(e=>e.id==t.id?t:e),e.currentController&&e.currentController.id==t.id&&(e.currentController=t)},[n.deleteController](e,t){e.controllers=e.controllers.filter(e=>e.id!=t),e.currentController&&e.currentController.id==t&&(e.currentController=null)},[n.setCloudCredentials](e,t){e.cloudCredentials=t},[n.addCloudCredential](e,t){e.cloudCredentials.push(t)},[n.updateCloudCredential](e,t){e.cloudCredentials=e.cloudCredentials.map(e=>e.id==t.id?t:e)},[n.deleteCloudCredential](e,t){e.cloudCredentials=e.cloudCredentials.filter(e=>e.id!=t)},[n.setClouds](e,t){e.clouds=t}};t["a"]=o}},[[0,2,0]]]);
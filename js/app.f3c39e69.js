(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{0:function(e,o,t){e.exports=t("2f39")},"2f39":function(e,o,t){"use strict";t.r(o);t("573e"),t("7d6e"),t("e54f"),t("62f2"),t("7e6d");var n=t("2b0e"),r=t("1f91"),l=t("42d2"),a=t("b05d"),i=t("436b"),c=t("18d6"),s=t("2a19");n.a.use(a.a,{config:{dark:"auto",notify:{position:"top-right"}},lang:r.a,iconSet:l.a,plugins:{Dialog:i.a,LocalStorage:c.a,Notify:s.a}});var d=t("60a3"),u=t("b2da"),m=t("4bb5"),f=function(e,o,t,n){var r,l=arguments.length,a=l<3?o:null===n?n=Object.getOwnPropertyDescriptor(o,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,o,t,n);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(a=(l<3?r(a):l>3?r(o,t,a):r(o,t))||a);return l>3&&a&&Object.defineProperty(o,t,a),a},p=function(e,o,t,n){return new(t||(t=Promise))((function(r,l){function a(e){try{c(n.next(e))}catch(e){l(e)}}function i(e){try{c(n.throw(e))}catch(e){l(e)}}function c(e){var o;e.done?r(e.value):(o=e.value,o instanceof t?o:new t((function(e){e(o)}))).then(a,i)}c((n=n.apply(e,o||[])).next())}))};const g=Object(m.a)("juju");let b=class App extends d.c{created(){return p(this,void 0,void 0,(function*(){const e=this.$q.localStorage.getItem("darkMode");null==e||"boolean"!=typeof e&&"auto"!=e||this.$q.dark.set(e),yield this.loadControllers()}))}};f([g.Action(u.a.loadControllers)],b.prototype,"loadControllers",void 0),b=f([d.a],b);var h=b,w=t("2877"),v=Object(w.a)(h,(function(){var e=this.$createElement,o=this._self._c||e;return o("div",{attrs:{id:"q-app"}},[o("router-view")],1)}),[],!1,null,null,null).exports,C=t("4bde"),W=t("2f62"),j=t("b444"),y=t("6260");var O={},F=t("f319");var x={namespaced:!0,actions:y.b,getters:O,mutations:F.a,state:j.b},k=t("fb60"),S=t("aaf8");function D(e,o){const t={};for(const n in o){const r=o[n];for(const o in r[e]){const n=r[e][o];t[o]=n}}return t}function I(e){return"All"!=e.currentController?e.controllers[e.currentController]:{models:D("models",e.controllers),units:D("units",e.controllers),applications:D("applications",e.controllers),charms:D("charms",e.controllers),machines:D("machines",e.controllers)}}var z={["currentControllerData"]:e=>I(e),["currentControllerModelsFilled"](e){const o=I(e),t=[];for(const n in o.models){let r="";for(const o in e.controllers){const t=e.controllers[o];0!=Object.keys(t.models).filter(e=>e==n).length&&(r=o)}t.push(Object(S.a)(r,o,n))}return t}},q=t("cf2e");var P={namespaced:!0,actions:u.b,getters:z,mutations:q.a,state:k.b},V=Object(C.store)((function({Vue:e}){e.use(W.a);return new W.a.Store({modules:{app:x,juju:P},strict:!1})})),$=t("8c4f");const A=[{path:"/",component:()=>Promise.all([t.e(0),t.e(3)]).then(t.bind(null,"713b")),children:[{path:"",name:"home",redirect:"/models"},{path:"/controllers",component:()=>Promise.all([t.e(0),t.e(6)]).then(t.bind(null,"a7d4")),children:[{path:"",name:"controllers"},{path:"cloud-credentials",name:"cloud-credentials"}]},{path:"/models",component:()=>Promise.all([t.e(0),t.e(4)]).then(t.bind(null,"56c6")),children:[{path:"",name:"models"},{path:"machines",name:"machines"}]},{path:"/welcome",name:"welcome",component:()=>Promise.all([t.e(0),t.e(5)]).then(t.bind(null,"35a8"))}]}];A.push({path:"*",component:()=>Promise.all([t.e(0),t.e(7)]).then(t.bind(null,"e51e"))});var H=A;var M=Object(C.route)((function({Vue:e}){e.use($.a);const o=new $.a({scrollBehavior:()=>({x:0,y:0}),routes:H,mode:"hash",base:""});return o.beforeEach((e,o,t)=>{if(c.a.getItem("seen-juju-lens-before")||"welcome"==e.name)t();else{t({name:"welcome",query:Object.assign({welcomePageTo:e.fullPath},e.query)});try{c.a.set("seen-juju-lens-before","true")}catch(e){console.error(e)}}}),o})),T=t("bc3a"),L=t.n(T),N=Object(C.boot)(({Vue:e})=>{e.prototype.$axios=L.a});!async function(){const{app:e,store:o,router:t}=await async function(){const e="function"==typeof V?await V({Vue:n.a}):V,o="function"==typeof M?await M({Vue:n.a,store:e}):M;e.$router=o;const t={router:o,store:e,render:e=>e(v),el:"#q-app"};return{app:t,store:e,router:o}}();let r=!0;const l=e=>{r=!1,window.location.href=e},a=window.location.href.replace(window.location.origin,""),i=[N];for(let c=0;!0===r&&c<i.length;c++)if("function"==typeof i[c])try{await i[c]({app:e,router:t,store:o,Vue:n.a,ssrContext:null,redirect:l,urlPath:a})}catch(e){return e&&e.url?void(window.location.href=e.url):void console.error("[Quasar] boot error:",e)}!1!==r&&new n.a(e)}()},6260:function(e,o,t){"use strict";t.d(o,"a",(function(){return i}));var n=t("2b0e"),r=t("b444"),l=t("f319"),a=t("1732");const i={addFloatingWindow:"addFloatingWindow",removeFloatingWindow:"removeFloatingWindow"},c={[i.addFloatingWindow](e,{unit:o,app:t,kind:i}){const c=Object(a.a)(),s={id:c,unit:o,app:t,visible:!1,maximized:!1,zIndex:0,kind:r.a[i]};return e.commit(l.b.addFloatingWindow,s),n.a.nextTick(()=>{e.commit(l.b.toggleFloatingWindowVisible,s.id)}),c},[i.removeFloatingWindow](e,o){e.commit(l.b.hideFloatingWindow,o),n.a.nextTick(()=>{setTimeout(()=>{e.commit(l.b.removeFloatingWindow,o)},400)})}};o.b=c},"7e6d":function(e,o,t){},aaf8:function(e,o,t){"use strict";t.d(o,"b",(function(){return r})),t.d(o,"a",(function(){return p}));var n=t("fb60");function r(e,o,t){return e+"/"+o+(t?"/"+t:"")}const l={icon:"fas fa-check-circle",color:"var(--q-color-positive)"},a={icon:"fas fa-exclamation-triangle",color:"var(--q-color-warning)"},i={icon:"fas fa-exclamation-circle",color:"var(--q-color-negative)"},c={icon:"fas fa-circle",color:"var(--q-color-positive)"},s={icon:"fas fa-circle",color:"var(--q-color-warning)"},d={icon:"fas fa-circle",color:"var(--q-color-negative)"};function u(e,o){const t=n.a[e];return t>=n.a.blocked?o?d:i:t>=n.a.maintenance?o?s:a:o?c:l}function m(e){return Object.assign({statusIcon:u(e["workload-status"].current,!0)},e)}function f(e,o){const t=e.applications[o];let r=[];for(const o in e.units){const l=e.units[o];l.name.startsWith(t.name)&&l["model-uuid"]==t["model-uuid"]&&r.push(m(l)),r=r.sort((e,o)=>n.a[o["workload-status"].current]-n.a[e["workload-status"].current])}const l=r.map(e=>e["workload-status"].current)[0];let a=t["charm-url"].replace("cs:","https://jaas.ai/");return a=a.replace("~","u/"),a=a.replace("-","/"),Object.assign({charmIconUrl:(i=t["charm-url"],i.replace("cs:","https://api.jujucharms.com/charmstore/v5/")+"/icon.svg"),charmStoreUrl:a,units:r,statusIcon:u(l),statusSeverity:l||"active"},t);var i}function p(e,o,t){const r=o.models[t];let l=[];for(const e in o.applications){o.applications[e]["model-uuid"]==r["model-uuid"]&&l.push(f(o,e)),l=l.sort((e,o)=>n.a[o.statusSeverity]-n.a[e.statusSeverity])}const a=l.map(e=>e.statusSeverity)[0];return Object.assign({statusSeverity:a||"active",statusIcon:u(a),applications:l,controller:e},r)}},b2da:function(e,o,t){"use strict";t.d(o,"a",(function(){return b}));var n=t("436b"),r=t("2a19"),l=t("cf2e"),a=t("18d6"),i=t("3b3d"),c=t.n(i),s=t("9927"),d=t.n(s),u=t("24f0"),m=t.n(u),f=t("784d"),p=t.n(f),g=t("aaf8");const b={loadControllers:"loadControllers",setCurrentController:"setCurrentController",updateController:"updateController",deleteController:"deleteController",establishControllerConn:"establishControllerConn",commitControllerDelta:"commitControllerDelta",logout:"logout"};function h(e){const o={};for(const t in e.controllers)o[t]={applications:{},charms:{},machines:{},models:{},units:{},username:e.controllers[t].username,password:e.controllers[t].password,host:e.controllers[t].host,port:e.controllers[t].port};const t={currentController:e.currentController,controllers:o};a.a.set("jujuState",t)}const w={[b.setCurrentController](e,o){e.commit(l.b.setCurrentController,o),h(e.state)},[b.loadControllers](e){const o=a.a.getItem("jujuState");if(o){e.commit(l.b.setCurrentController,o.currentController);for(const t in o.controllers)e.dispatch(b.updateController,{name:t,controller:o.controllers[t]})}},[b.updateController](e,{name:o,controller:t}){const n=e.state.controllers[o];n&&n.controllerWatchHandle&&n.controllerWatchHandle.stop(e=>{e&&console.error(e)}),e.commit(l.b.updateController,{name:o,controller:t}),h(e.state),t.conn||t.controllerWatchHandle||e.dispatch(b.establishControllerConn,o)},[b.establishControllerConn](e,o){const t=e.state.controllers[o];if(!t)return;const n={debug:!1,facades:[d.a,m.a],wsclass:WebSocket};c.a.connectAndLogin(`wss://${t.host}:${t.port}/api`,{user:"user-"+t.username,password:t.password},n,(n,r)=>{if(n)return console.error(n),void setTimeout(()=>{e.dispatch(b.establishControllerConn,o)},1e3);const a=r.conn.facades.controller,i=a.watch((t,n)=>{if(t)console.error(t);else for(const t of n.deltas)e.dispatch(b.commitControllerDelta,{name:o,controllerName:o,data:t})});t.conn=a,t.controllerWatchHandle=i,e.commit(l.b.updateController,{name:o,controller:t})})},[b.commitControllerDelta](e,{name:o,controllerName:t,data:[n,r,a]}){if("model"==n){const i=a,s=Object(g.b)(t,i["model-uuid"]),d=e.state.controllers[t];if(!d.models[s]||d.models[s]&&!d.models[s].conn){const s={debug:!1,facades:[p.a],wsclass:WebSocket};c.a.connectAndLogin(`wss://${d.host}:${d.port}/model/${i["model-uuid"]}/api`,{user:"user-"+d.username,password:d.password},s,(c,s)=>{if(c)return console.error(c),void setTimeout(()=>{e.dispatch(b.commitControllerDelta,{name:o,controllerName:t,data:[n,r,a]})},1e3);i.conn=s,e.commit(l.b.commitControllerDelta,{name:o,data:[n,r,a]})})}}e.commit(l.b.commitControllerDelta,{name:o,data:[n,r,a]})},[b.deleteController](e,o){const t=e.state.controllers[o];t&&t.conn&&t.controllerWatchHandle&&t.controllerWatchHandle.stop(e=>{e&&console.error(e)}),e.commit(l.b.deleteController,o),h(e.state)},[b.logout](e){n.a.create({title:"Logout",message:"Are you sure you want to logout of all controllers? You will have to add them manually again to re-connect.",cancel:!0,ok:{color:"negative",label:"Logout"}}).onOk(()=>{e.commit(l.b.clearState),h(e.state),r.a.create({type:"positive",message:"Succesfully logged you out",icon:"logout",position:"bottom-right",timeout:2e3})})}};o.b=w},b444:function(e,o,t){"use strict";var n;t.d(o,"a",(function(){return n})),function(e){e[e.log=0]="log",e[e.terminal=1]="terminal"}(n||(n={}));o.b={debugWindow:{visible:!1,maximized:!1},floatingWindows:[]}},cf2e:function(e,o,t){"use strict";t.d(o,"b",(function(){return l}));var n=t("2b0e"),r=t("aaf8");const l={setCurrentController:"setCurrentController",setControllers:"setControllers",updateController:"updateController",deleteController:"deleteController",commitControllerDelta:"commitControllerDelta",clearState:"clearState"},a={[l.setCurrentController](e,o){e.currentController=o},[l.setControllers](e,o){e.controllers=o},[l.updateController](e,{name:o,controller:t}){n.a.set(e.controllers,o,t)},[l.deleteController](e,o){n.a.delete(e.controllers,o),e.currentController==o&&(e.currentController="All")},[l.commitControllerDelta](e,{name:o,data:[t,l,a]}){if("model"==t){const t=a,i=Object(r.b)(o,t["model-uuid"]);"change"==l?n.a.set(e.controllers[o].models,i,Object.assign(Object.assign({},t),{lensId:i})):"remove"==l&&n.a.delete(e.controllers[o].models,i)}else if("application"==t){const t=a,i=Object(r.b)(o,t["model-uuid"],t.name);"change"==l?n.a.set(e.controllers[o].applications,i,Object.assign(Object.assign({},t),{lensId:i})):"remove"==l&&n.a.delete(e.controllers[o].applications,i)}else if("unit"==t){const t=a,i=Object(r.b)(o,t["model-uuid"],t.name);"change"==l?n.a.set(e.controllers[o].units,i,Object.assign(Object.assign({},t),{lensId:i})):"remove"==l&&n.a.delete(e.controllers[o].units,i)}else if("machine"==t){const t=a,i=Object(r.b)(o,t["model-uuid"],t.id);"change"==l?n.a.set(e.controllers[o].machines,i,Object.assign(Object.assign({},t),{lensId:i})):"remove"==l&&n.a.delete(e.controllers[o].machines,i)}else if("charm"==t){const t=a,i=Object(r.b)(o,t["model-uuid"],t["charm-url"]);"change"==l?n.a.set(e.controllers[o].charms,i,Object.assign(Object.assign({},t),{lensId:i})):"remove"==l&&n.a.delete(e.controllers[o].charms,i)}else console.warn("Unidentified resource type from Juju controller changefeed: "+t)},[l.clearState](e){e.controllers={},e.currentController="All"}};o.a=a},f319:function(e,o,t){"use strict";t.d(o,"b",(function(){return n}));const n={addFloatingWindow:"addFloatingWindow",toggleFloatingWindowMaximized:"toggleFloatingWindowMaximized",toggleFloatingWindowVisible:"toggleFloatingWindowVisible",hideFloatingWindow:"hideFloatingWindow",focusFloatingWindow:"focusFloatingWindow",removeFloatingWindow:"removeFloatingWindow"};function r(e,o){e.floatingWindows.map(e=>{e.id==o?e.zIndex=1:e.zIndex=0})}const l={toggleDebugWindow(e){e.debugWindow.visible=!e.debugWindow.visible},toggleDebugWindowMaximized(e){e.debugWindow.maximized=!e.debugWindow.maximized},[n.addFloatingWindow](e,o){e.floatingWindows.push(o)},[n.toggleFloatingWindowMaximized](e,o){e.floatingWindows.map(e=>{e.id==o&&(e.maximized=!e.maximized)})},[n.toggleFloatingWindowVisible](e,o){let t=!1;e.floatingWindows.map(e=>{e.id==o&&(e.visible=!e.visible,t=e.visible)}),t&&r(e,o)},[n.hideFloatingWindow](e,o){e.floatingWindows.map(e=>{e.id==o&&(e.visible=!1)})},[n.focusFloatingWindow](e,o){r(e,o)},[n.removeFloatingWindow](e,o){e.floatingWindows=e.floatingWindows.filter(e=>e.id!=o)}};o.a=l},fb60:function(e,o,t){"use strict";var n;t.d(o,"a",(function(){return n})),function(e){e[e.active=0]="active",e[e.started=1]="started",e[e.maintenance=2]="maintenance",e[e.unknown=3]="unknown",e[e.waiting=4]="waiting",e[e.blocked=5]="blocked",e[e.error=6]="error",e[e.terminated=7]="terminated"}(n||(n={}));o.b={currentController:"All",controllers:{}}}},[[0,2,0]]]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"059a":function(t,e,i){},"239b":function(t,e,i){"use strict";var o=i("5d42");i.n(o).a},"452c":function(t,e,i){},"546f":function(t,e,i){"use strict";var o=i("6426");i.n(o).a},"55ab":function(t,e,i){"use strict";var o=i("059a");i.n(o).a},"5d42":function(t,e,i){},"5ea5":function(t,e,i){"use strict";var o=i("452c");i.n(o).a},6426:function(t,e,i){},"6d2c":function(t,e,i){"use strict";var o=i("c4f6");i.n(o).a},"713b":function(t,e,i){"use strict";i.r(e);var o=i("60a3"),n=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};let s=class DarkModeToggle extends o.c{setDarkMode(t){this.$q.dark.set(t);try{window.appLocalStorage.setItem("darkMode",t)}catch(t){console.error(t)}}updateDarkMode(){!0===this.$q.dark.isActive?this.setDarkMode(!1):this.setDarkMode(!0)}get btnIcon(){return!0===this.$q.dark.isActive?"fas fa-sun":"fas fa-moon"}get btnLabel(){return!0===this.$q.dark.isActive?"Light Mode":"Dark Mode"}};s=n([o.a],s);var a=s,r=i("2877"),l=i("66e5"),c=i("9c40"),d=i("05c0"),u=i("4074"),p=i("0016"),m=i("714f"),g=i("eebe"),h=i.n(g),f=Object(r.a)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:t.updateDarkMode}},[i("q-item-section",{attrs:{avatar:""}},[i("q-icon",{attrs:{name:t.btnIcon}})],1),i("q-item-section",[t._v("\n    "+t._s(t.btnLabel)+"\n  ")])],1)}),[],!1,null,null,null),w=f.exports;h()(f,"components",{QItem:l.a,QBtn:c.a,QTooltip:d.a,QItemSection:u.a,QIcon:p.a}),h()(f,"directives",{Ripple:m.a});var b=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};let v=class Badge extends o.c{};b([Object(o.b)(Boolean)],v.prototype,"left",void 0),v=b([o.a],v);var y=v,M=(i("5ea5"),Object(r.a)(y,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"badge q-px-xs",style:{left:t.left?"-0.25rem":void 0,right:t.left?void 0:"-0.25rem"}},[t._t("default")],2)}),[],!1,null,null,null).exports),z=i("f303"),x=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};const{height:j,width:T}=z.c;let W=class FloatingWindow extends o.c{constructor(){super(...arguments),this.overrideHidden=!0,this.transitionDuration=.3,this.transitioning=!0,this.top=15,this.left=15,this.right=15,this.bottom=15,this.showPositionButtons=!1,this.positionButtonGlobalClickListener=null}get actuallyVisible(){return this.visible&&!this.overrideHidden}get floatingWindowStyle(){const t=this.transitioning?`transition: all ${this.transitionDuration}s;`:"";return this.maximized?t+"margin: 0; transform: none; right: 0; bottom: 0; left: 0; top: 0;":t+`left: ${this.left}%; top: ${this.top}%; right: ${this.right}%; bottom: ${this.bottom}%;`}created(){setTimeout(()=>{this.overrideHidden=!1},1),setTimeout(()=>{this.transitioning=!1},1e3*this.transitionDuration)}handleTransitioning(){this.transitioning=!0,setTimeout(()=>this.transitioning=!1,1e3*this.transitionDuration)}onShowPositionButtonChange(t){t&&(this.positionButtonGlobalClickListener=this.globalClickListener.bind(this),document.addEventListener("mousedown",this.positionButtonGlobalClickListener))}globalClickListener(){this.showPositionButtons=!1,this.positionButtonGlobalClickListener&&(document.removeEventListener("mousedown",this.positionButtonGlobalClickListener),this.positionButtonGlobalClickListener=null)}get parentSize(){return[T(this.$refs.parentSizeDetector),j(this.$refs.parentSizeDetector)]}moveWindow(t){this.maximized||(this.left+=t.delta.x/this.parentSize[0]*100,this.top+=t.delta.y/this.parentSize[1]*100,this.right-=t.delta.x/this.parentSize[0]*100,this.bottom-=t.delta.y/this.parentSize[1]*100)}setWindowTilePosition([t,e]){if(this.showPositionButtons=!1,this.transitioning=!0,this.maximized&&this.$emit("restore"),0==t&&0==e)return this.left=15,this.top=15,this.right=15,void(this.bottom=15);0==t?(this.left=0,this.right=0):1==t?(this.left=50,this.right=0):-1==t&&(this.right=50,this.left=0),0==e?(this.top=0,this.bottom=0):1==e?(this.top=50,this.bottom=0):-1==e&&(this.top=0,this.bottom=50),setTimeout(()=>this.transitioning=!1,1e3*this.transitionDuration)}resizeWindowTop(t){if(!this.maximized){const e=this.top+t.delta.y/this.parentSize[1]*100;this.top=e>=0?e:0}}resizeWindowBottom(t){this.maximized||(this.bottom=this.bottom-t.delta.y/this.parentSize[1]*100)}resizeWindowRight(t){this.maximized||(this.right=this.right-t.delta.x/this.parentSize[0]*100)}resizeWindowLeft(t){if(!this.maximized){const e=this.left+t.delta.x/this.parentSize[0]*100;this.left=e>=0?e:0}}resizeWindowTopLeft(t){this.resizeWindowTop(t),this.resizeWindowLeft(t)}resizeWindowTopRight(t){this.resizeWindowRight(t),this.resizeWindowTop(t)}resizeWindowBottomLeft(t){this.resizeWindowBottom(t),this.resizeWindowLeft(t)}resizeWindowBottomRight(t){this.resizeWindowBottom(t),this.resizeWindowRight(t)}};x([Object(o.b)({type:String,default:""})],W.prototype,"title",void 0),x([Object(o.b)(Boolean)],W.prototype,"maximized",void 0),x([Object(o.b)({type:Boolean,default:!0})],W.prototype,"visible",void 0),x([Object(o.b)({type:Boolean,default:!0})],W.prototype,"showMinimize",void 0),x([Object(o.b)({type:Boolean,default:!0})],W.prototype,"showMaximize",void 0),x([Object(o.b)({type:Boolean,default:!0})],W.prototype,"showClose",void 0),x([Object(o.b)(String)],W.prototype,"icon",void 0),x([Object(o.d)("maximized"),Object(o.d)("visible")],W.prototype,"handleTransitioning",null),x([Object(o.d)("showPositionButtons")],W.prototype,"onShowPositionButtonChange",null),W=x([o.a],W);var k=W,C=(i("6d2c"),i("f09f")),D=i("d847"),O=i("2c91"),I=i("75c3"),L=Object(r.a)(k,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"parentSizeDetector",staticStyle:{position:"absolute",top:"0",bottom:"0",right:"0",left:"0",overflow:"hidden","pointer-events":"none"}},[i("div",{staticClass:"floating-window shadow-5",class:{"window-transition-transitioning":t.transitioning,"window-transition-hidden":!t.actuallyVisible},style:t.floatingWindowStyle},[i("q-card",{staticClass:"fit column"},[i("q-bar",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.prevent",value:t.moveWindow,expression:"moveWindow",modifiers:{mouse:!0,prevent:!0}}],staticClass:"col-auto floating-window--bar cursor-pointer"},[t.icon?i("q-icon",{attrs:{name:t.icon}}):t._e(),i("div",{staticClass:"text-weight-bold ellipsis"},[t._v(t._s(t.title))]),i("q-space"),i("div",{staticStyle:{position:"relative"}},[t.showMinimize?i("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{dense:"",flat:"",icon:"fas fa-th"},on:{click:function(e){t.showPositionButtons=!t.showPositionButtons}}},[i("q-tooltip",{attrs:{"transition-show":"jump-up","transition-hide":"jump-down",anchor:"top middle",self:"bottom middle",delay:500}},[t._v("\n              Position\n            ")])],1):t._e(),t._l([[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,0]],(function(e,o){var n=e[0],s=e[1];return i("transition",{key:o,attrs:{name:"pos-btn-trans"}},[t.showPositionButtons?i("q-btn",{staticClass:"position-button",style:"position: absolute; left: "+3*n+"em; top: "+3*s+"em;",attrs:{round:"",dense:"",color:"secondary"},on:{click:function(e){return t.setWindowTilePosition([n,s])}}},[i("q-icon",0!=n||0!=s?{style:"transform: rotate("+45*-o+"deg)",attrs:{name:"arrow_drop_down"}}:{attrs:{name:"pages"}})],1):t._e()],1)}))],2),t.showMinimize?i("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{dense:"",flat:"",icon:"fas fa-window-minimize"},on:{click:function(e){return t.$emit("minimize")}}},[i("q-tooltip",{attrs:{"transition-show":"jump-up","transition-hide":"jump-down",anchor:"top middle",self:"bottom middle",delay:500}},[t._v("\n            Minimize\n          ")])],1):t._e(),!t.maximized&&t.showMaximize?i("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{dense:"",flat:"",icon:"fas fa-expand"},on:{click:function(e){return t.$emit("maximize")}}},[i("q-tooltip",{attrs:{"transition-show":"jump-up","transition-hide":"jump-down",anchor:"top middle",self:"bottom middle",delay:500}},[t._v("\n            Maximize\n          ")])],1):t._e(),t.maximized&&t.showMaximize?i("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{dense:"",flat:"",icon:"fas fa-window-restore"},on:{click:function(e){return t.$emit("restore")}}},[i("q-tooltip",{attrs:{"transition-show":"jump-up","transition-hide":"jump-down",anchor:"top middle",self:"bottom middle",delay:500}},[t._v("\n            Restore\n          ")])],1):t._e(),t.showClose?i("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{dense:"",flat:"",icon:"fas fa-window-close"},on:{click:function(e){return t.$emit("close")}}},[i("q-tooltip",{attrs:{"transition-show":"jump-up","transition-hide":"jump-down",anchor:"top middle",self:"bottom middle",delay:500}},[t._v("\n            Close\n          ")])],1):t._e()],1),i("div",{staticClass:"col relative-position"},[i("div",{staticClass:"floating-window--content"},[t._t("default")],2)]),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.up.down.prevent",value:t.resizeWindowTop,expression:"resizeWindowTop",modifiers:{mouse:!0,up:!0,down:!0,prevent:!0}}],staticStyle:{position:"absolute",left:"0",right:"0",top:"0",cursor:"ns-resize",height:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.up.down.prevent",value:t.resizeWindowBottom,expression:"resizeWindowBottom",modifiers:{mouse:!0,up:!0,down:!0,prevent:!0}}],staticStyle:{position:"absolute",bottom:"0",right:"0",left:"0",cursor:"ns-resize",height:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.left.right.prevent",value:t.resizeWindowRight,expression:"resizeWindowRight",modifiers:{mouse:!0,left:!0,right:!0,prevent:!0}}],staticStyle:{position:"absolute",bottom:"0",right:"0",top:"0",cursor:"ew-resize",width:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.left.right.prevent",value:t.resizeWindowLeft,expression:"resizeWindowLeft",modifiers:{mouse:!0,left:!0,right:!0,prevent:!0}}],staticStyle:{position:"absolute",bottom:"0",right:"left",top:"0",cursor:"ew-resize",width:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.prevent",value:t.resizeWindowTopLeft,expression:"resizeWindowTopLeft",modifiers:{mouse:!0,prevent:!0}}],staticStyle:{position:"absolute",top:"0",left:"0",cursor:"nw-resize",width:"0.7em",height:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.prevent",value:t.resizeWindowTopRight,expression:"resizeWindowTopRight",modifiers:{mouse:!0,prevent:!0}}],staticStyle:{position:"absolute",top:"0",right:"0",cursor:"ne-resize",width:"0.7em",height:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.prevent",value:t.resizeWindowBottomLeft,expression:"resizeWindowBottomLeft",modifiers:{mouse:!0,prevent:!0}}],staticStyle:{position:"absolute",bottom:"0",left:"0",cursor:"sw-resize",width:"0.7em",height:"0.7em","z-index":"100"}}),i("div",{directives:[{name:"touch-pan",rawName:"v-touch-pan.mouse.prevent",value:t.resizeWindowBottomRight,expression:"resizeWindowBottomRight",modifiers:{mouse:!0,prevent:!0}}],staticStyle:{position:"absolute",bottom:"0",right:"0",cursor:"se-resize",width:"0.7em",height:"0.7em","z-index":"100"}})],1)],1)])}),[],!1,null,null,null),N=L.exports;h()(L,"components",{QCard:C.a,QBar:D.a,QIcon:p.a,QSpace:O.a,QBtn:c.a,QTooltip:d.a}),h()(L,"directives",{TouchPan:I.a,Ripple:m.a});var S=i("1732"),q=i("fcf3"),_=(i("abb2"),i("408b")),Q=i("47d0"),E=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function a(t){try{l(o.next(t))}catch(t){s(t)}}function r(t){try{l(o.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,r)}l((o=o.apply(t,e||[])).next())}))};const A="jujuLensSshKeyPair";function P(){return E(this,void 0,void 0,(function*(){if(window.__TAURI__){let t=window.appLocalStorage.getItem(A)||null;return t||(t=yield window.tauriSshKeyGen(),window.appLocalStorage.setItem(A,t)),t}throw"getSshKeypair() can only be called in a Tauri app"}))}var F=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a},R=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function a(t){try{l(o.next(t))}catch(t){s(t)}}function r(t){try{l(o.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,r)}l((o=o.apply(t,e||[])).next())}))};let B=class TestTerm extends o.c{constructor(){super(...arguments),this.id="",this.fitAddon=null,this.t=null,this.session=null,this.loading=!0}created(){this.id=Object(S.a)()}mounted(){return R(this,void 0,void 0,(function*(){yield this.loadTerm()}))}onResize(){if(this.fitAddon&&this.autoResize){this.fitAddon.fit();const{cols:t,rows:e}=this.fitAddon.proposeDimensions();this.session.resize(t,e)}}loadTerm(){return R(this,void 0,void 0,(function*(){if(!this.t){const t=yield P();this.$q.dialog({title:"Username",message:"Connection username",prompt:{label:"username",model:"vagrant",type:"text"},persistent:!0}).onOk(e=>{this.$q.dialog({title:"Host",message:"Connection host:port",prompt:{label:"host",model:"127.0.0.1",type:"text"},persistent:!0}).onOk(i=>{this.session=new window.TauriSshSession({user:e,host:i.includes(":")?i:i+":22",publicKey:t.public,privateKey:t.private}),this.session.onclose=()=>{this.$emit("close")},this.session.onerror=t=>{this.$emit("error",t)},setTimeout(()=>{this.t=new q.Terminal,this.fitAddon=new Q.FitAddon,this.t.loadAddon(this.fitAddon),this.t.loadAddon(new _.WebLinksAddon),this.t.open(document.getElementById("term-"+this.id)),this.t.focus(),this.fitAddon.fit(),this.t.onData(t=>{this.session.send(t)}),this.session.onmessage=t=>{var e;null===(e=this.t)||void 0===e||e.write(t)},this.session.connect().then(()=>{this.loading=!1,this.$emit("ready")}).catch(t=>{this.$emit("connect-failure",t)})},this.startupDelay)})})}}))}focus(){var t;null===(t=this.t)||void 0===t||t.focus()}write(t){this.t.write(t)}close(){this.session.close()}};F([Object(o.b)({type:Number,default:0})],B.prototype,"startupDelay",void 0),F([Object(o.b)({type:Boolean,default:!1})],B.prototype,"autoResize",void 0),B=F([o.a],B);var $=B,Y=(i("239b"),i("3980")),G=i("0d59"),H=Object(r.a)($,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"vue-xterm bg-black",staticStyle:{overflow:"hidden"},attrs:{id:"term-"+t.id}},[i("q-resize-observer",{attrs:{debounce:250},on:{resize:t.onResize}}),i("transition",{attrs:{name:"fade"}},[t.loading?i("div",{staticClass:"flex justify-center items-center",staticStyle:{position:"absolute",left:"0",right:"0",top:"0",bottom:"0","z-index":"1000000",opacity:"0.8"}},[i("q-spinner",{attrs:{size:"10em",color:"white"}})],1):t._e()])],1)}),[],!1,null,null,null),Z=H.exports;h()(H,"components",{QResizeObserver:Y.a,QSpinner:G.a});var V=i("4bb5"),U=i("f319"),J=i("6260"),K=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};const X=Object(V.a)("app");let tt=class FloatingTerminalWindow extends o.c{log(t){console.log(t)}get floatingWindow(){return this.floatingWindows.filter(t=>t.id==this.floatingWindowId)[0]}closeSshConn(){this.$refs.term.close()}visibilityChanged(t){t&&this.$refs.term.focus()}};K([Object(o.b)(String)],tt.prototype,"floatingWindowId",void 0),K([Object(o.b)(String)],tt.prototype,"termOptions",void 0),K([X.State],tt.prototype,"floatingWindows",void 0),K([X.Mutation(U.b.toggleFloatingWindowVisible)],tt.prototype,"toggleFloatingWindowVisible",void 0),K([X.Mutation(U.b.toggleFloatingWindowMaximized)],tt.prototype,"toggleFloatingWindowMaximized",void 0),K([X.Mutation(U.b.focusFloatingWindow)],tt.prototype,"focusFloatingWindow",void 0),K([X.Action(J.a.removeFloatingWindow)],tt.prototype,"removeFloatingWindow",void 0),K([Object(o.d)("floatingWindow.visible")],tt.prototype,"visibilityChanged",null),tt=K([Object(o.a)({components:{FloatingWindowComponent:N,XTerm:Z}})],tt);var et=tt,it=(i("55ab"),Object(r.a)(et,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("floating-window-component",{staticClass:"floating-terminal-window",style:{"z-index":t.floatingWindow.zIndex},attrs:{title:t.floatingWindow.unit.name,visible:t.floatingWindow.visible,maximized:t.floatingWindow.maximized,icon:"fas fa-terminal"},on:{maximize:function(e){return t.toggleFloatingWindowMaximized(t.floatingWindowId)},restore:function(e){return t.toggleFloatingWindowMaximized(t.floatingWindowId)},minimize:function(e){return t.toggleFloatingWindowVisible(t.floatingWindowId)},close:function(e){t.removeFloatingWindow(t.floatingWindowId),t.closeSshConn()}},nativeOn:{click:function(e){return t.focusFloatingWindow(t.floatingWindowId)}}},[i("div",{staticClass:"fit q-pa-xs bg-black"},[i("x-term",{ref:"term",staticClass:"full-height",attrs:{startupDelay:300,"auto-resize":t.floatingWindow.visible},on:{data:function(e){return t.log(e)},"connect-failure":function(e){t.$q.notify({color:"negative",message:e,position:"bottom-right",timeout:2e3}),t.removeFloatingWindow(t.floatingWindowId)},error:function(e){t.$q.notify({color:"negative",message:e,position:"bottom-right",timeout:2e3})},close:function(e){return t.removeFloatingWindow(t.floatingWindowId)}}})],1)])],1)}),[],!1,null,null,null).exports),ot=i("bd4c"),nt=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};const st=Object(V.a)("app"),at=["The app is doing something...","Oh, no! Something is not right here!","This is totally not important so don't mind me.","This is a really long log message that repeats itself multiple times.   This is a really long log message that repeats itself multiple times.   This is a really long log message that repeats itself multiple times.   This is a really long log message that repeats itself multiple times. "];let rt=class FloatingTerminalWindow extends o.c{constructor(){super(...arguments),this.logEntries=[],this.logColumns=[{name:"timestamp",label:"Timestamp",field:"timestamp",sortable:!0,align:"left",format:t=>ot.a.formatDate(t,"YY-MM-DD:HH-MM-ss:SS")},{name:"message",label:"Message",field:"message",sortable:!0,align:"left"}]}get floatingWindow(){return this.floatingWindows.filter(t=>t.id==this.floatingWindowId)[0]}created(){setTimeout(function t(){this.logEntries.push({timestamp:Date.now(),message:at[Math.floor(Math.random()*at.length)]}),setTimeout(t.bind(this),1500*Math.random())}.bind(this),200)}};nt([Object(o.b)(String)],rt.prototype,"floatingWindowId",void 0),nt([st.State],rt.prototype,"floatingWindows",void 0),nt([st.Mutation(U.b.toggleFloatingWindowVisible)],rt.prototype,"toggleFloatingWindowVisible",void 0),nt([st.Mutation(U.b.toggleFloatingWindowMaximized)],rt.prototype,"toggleFloatingWindowMaximized",void 0),nt([st.Mutation(U.b.focusFloatingWindow)],rt.prototype,"focusFloatingWindow",void 0),nt([st.Action(J.a.removeFloatingWindow)],rt.prototype,"removeFloatingWindow",void 0),rt=nt([Object(o.a)({components:{FloatingWindowComponent:N}})],rt);var lt=rt,ct=i("eaac"),dt=Object(r.a)(lt,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("floating-window-component",{staticClass:"floating-log-window",style:{"z-index":t.floatingWindow.zIndex},attrs:{title:t.floatingWindow.unit.name,visible:t.floatingWindow.visible,maximized:t.floatingWindow.maximized,icon:"fas fa-file-alt"},on:{maximize:function(e){return t.toggleFloatingWindowMaximized(t.floatingWindowId)},restore:function(e){return t.toggleFloatingWindowMaximized(t.floatingWindowId)},minimize:function(e){return t.toggleFloatingWindowVisible(t.floatingWindowId)},close:function(e){return t.removeFloatingWindow(t.floatingWindowId)}},nativeOn:{click:function(e){return t.focusFloatingWindow(t.floatingWindowId)}}},[i("q-table",{staticStyle:{"max-height":"100%"},attrs:{dense:"","virtual-scroll":"","hide-bottom":"",pagination:{rowsPerPage:0},data:t.logEntries,columns:t.logColumns,"table-style":"box-shadow: none;"}})],1)],1)}),[],!1,null,null,null),ut=dt.exports;h()(dt,"components",{QTable:ct.a});var pt=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};const mt=Object(V.a)("app");let gt=class DebugWindow extends o.c{};pt([mt.State],gt.prototype,"debugWindow",void 0),pt([mt.Mutation],gt.prototype,"toggleDebugWindow",void 0),pt([mt.Mutation],gt.prototype,"toggleDebugWindowMaximized",void 0),gt=pt([Object(o.a)({components:{FloatingWindow:N}})],gt);var ht=gt,ft=Object(r.a)(ht,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("floating-window",{attrs:{title:"Debug Window",visible:t.debugWindow.visible,maximized:t.debugWindow.maximized,showClose:!1,icon:"fas fa-bug"},on:{maximize:t.toggleDebugWindowMaximized,restore:t.toggleDebugWindowMaximized,minimize:t.toggleDebugWindow}},[i("p",[t._v("Hello World")])])],1)}),[],!1,null,null,null).exports,wt=i("b2da"),bt=i("fb60"),vt=i("b444"),yt=i("cdde"),Mt=function(t,e,i,o){var n,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(s<3?n(a):s>3?n(e,i,a):n(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};const zt=Object(V.a)("juju"),xt=Object(V.a)("app");let jt=class MainLayout extends o.c{constructor(){super(...arguments),this.taskbarBreakpoint=599,this.showTaskbar=!1,this.taskbarMini=!0,this.showMenuDrawer=!1,this.routerTransitionInProgress=!1,this.showTitle=!0,this.mainLinks=[{label:"Models",icon:"share",to:{name:"models"}},{label:"Controllers",icon:"gamepad",to:{name:"controllers"}}],this.taskbarExpandChangeTimeout=null}get isTauri(){return!!window.__TAURI__}get floatingTermWindows(){return this.floatingWindows.filter(t=>t.kind==vt.a[vt.a.terminal])}get floatingLogWindows(){return this.floatingWindows.filter(t=>t.kind==vt.a[vt.a.log])}get currentController(){return this.globalCurrentController}set currentController(t){this.setCurrentController(t)}get controllerOptions(){const t=[];for(const e in this.controllers)t.push(e);return["All",...t]}expandTaskbar(){this.taskbarExpandChangeTimeout&&clearTimeout(this.taskbarExpandChangeTimeout),this.taskbarMini=!1}collapseTaskbar(){this.taskbarExpandChangeTimeout&&clearTimeout(this.taskbarExpandChangeTimeout),this.taskbarExpandChangeTimeout=setTimeout(()=>{this.taskbarMini=!0},300)}get unitNotifications(){const t=[];for(const e of this.models)for(const i of e.applications)for(const e of i.units){const o=bt.a[e["workload-status"].current];o>bt.a.active&&t.push({app:i,unit:e,isError:o>=bt.a.blocked})}return t.sort((t,e)=>bt.a[e.unit["workload-status"].current]-bt.a[t.unit["workload-status"].current])}get unitErrorCount(){return this.unitNotifications.filter(t=>t.isError).length}get unitWarningCount(){return this.unitNotifications.filter(t=>!t.isError).length}windowWidth(){return window.innerWidth}showFeedbackDialog(){this.$q.dialog({title:"Leave Feedback",html:!0,message:'We\'re so glad you want to leave feedback! Right now the best way to do that is to           reply to the public <a target="_blank" href="https://discourse.juju.is/t/juju-lens-a-new-juju-gui-you-dont-have-to-deploy/3309?u=zicklag">           forum topic</a> so that everyone can see and collaborate on it!'})}copyPublicKey(){P().then(t=>{Object(yt.a)(t.public),this.$q.notify("Copied to clipboard")}).catch(t=>{this.$q.dialog({title:"failure",message:t})})}};Mt([xt.State],jt.prototype,"floatingWindows",void 0),Mt([xt.Mutation(U.b.removeFloatingWindow)],jt.prototype,"removeFloatingWindow",void 0),Mt([xt.Mutation(U.b.toggleFloatingWindowVisible)],jt.prototype,"toggleFloatingWindowVisible",void 0),Mt([xt.Mutation(U.b.focusFloatingWindow)],jt.prototype,"focusFloatingWindow",void 0),Mt([zt.State("currentController")],jt.prototype,"globalCurrentController",void 0),Mt([zt.State],jt.prototype,"controllers",void 0),Mt([zt.Action(wt.a.setCurrentController)],jt.prototype,"setCurrentController",void 0),Mt([zt.Action(wt.a.logout)],jt.prototype,"logout",void 0),Mt([zt.Getter("currentControllerModelsFilled")],jt.prototype,"models",void 0),jt=Mt([Object(o.a)({components:{DarkModeToggle:w,FloatingWindowComponent:N,FloatingTerminalWindow:it,FloatingLogWindow:ut,DebugWindow:ft,Badge:M}})],jt);var Tt=jt,Wt=(i("546f"),i("4d5a")),kt=i("e359"),Ct=i("65c6"),Dt=i("6ac5"),Ot=i("429b"),It=i("7867"),Lt=i("ddd8"),Nt=i("4e73"),St=i("1c1c"),qt=i("0170"),_t=i("58a81"),Qt=i("9404"),Et=i("4983"),At=i("eb85"),Pt=i("09e3"),Ft=i("9989"),Rt=i("8572"),Bt=i("7f67"),$t=Object(r.a)(Tt,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-layout",{staticClass:"main-layout",class:{"router-transitioning":t.routerTransitionInProgress},attrs:{view:"hHh lpr lFf"}},[o("q-header",{staticClass:"bg-primary text-white main-layout--header",attrs:{elevated:""}},[o("q-toolbar",[o("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"xs on-left",attrs:{flat:"",round:"",dense:"",icon:"menu"},on:{click:function(e){t.showTaskbar=!t.showTaskbar}}}),o("router-link",{staticClass:"wrapper-link flex items-center",attrs:{to:{name:"home"}}},[o("img",{attrs:{src:i("9b19"),width:"42px"}})]),o("q-toolbar-title",{style:t.showTitle?"":"padding: 0;"},[o("router-link",{staticClass:"wrapper-link",attrs:{to:{name:"home"}}},[t.showTitle?o("span",[t._v("Juju Lens")]):t._e()]),o("q-resize-observer",{on:{resize:function(e){var i=e.width;return t.showTitle=i>86}}})],1),t.isTauri?o("q-btn",{attrs:{color:"negative",icon:"fas fa-biohazard",label:"Get Public Key"},on:{click:function(e){return t.copyPublicKey()}}}):t._e(),o("q-tabs",{staticClass:"gt-mobile-menu",attrs:{"inline-label":"",shrink:""}},t._l(t.mainLinks,(function(t,e){return o("q-route-tab",{key:e,staticStyle:{"font-size":"0.3em"},attrs:{icon:t.icon,label:t.label,to:t.to}})})),1),o("q-select",{staticClass:"q-mx-sm controller-select",staticStyle:{flex:"0.1 1 12em"},attrs:{filled:"",dark:"",options:t.controllerOptions,"option-label":"name",label:"Controller","popup-content-class":"controller-select-popup"},model:{value:t.currentController,callback:function(e){t.currentController=e},expression:"currentController"}}),o("div",{staticClass:"on-right",staticStyle:{position:"relative"}},[o("q-btn",{class:{"ringing-bell":!!t.unitErrorCount},staticStyle:{padding:"0.2rem"},attrs:{flat:"",dense:"",icon:"fas fa-bell"}},[o("q-menu",[o("q-list",{staticClass:"alert-menu"},t._l(t.unitNotifications,(function(e){return o("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],key:e.unit.lensId,attrs:{clickable:"",to:{name:"models",query:{unitId:e.unit.lensId}}}},[o("q-item-section",[o("q-item-label",[o("div",{staticClass:"row items-center"},[o("div",{attrs:{clas:"col on-left"}},[o("span",{staticClass:"on-left"},[t._v("\n                          "+t._s(e.unit.name)+"\n                        ")])]),o("div",{staticClass:"col row reverse"},[o("q-badge",{staticClass:"col-auto",class:{"text-black":!e.isError},attrs:{color:e.isError?"negative":"warning"}},[t._v("\n                          "+t._s(e.unit["workload-status"].current)+"\n                        ")])],1)])]),e.unit["workload-status"].message?o("q-item-label",{attrs:{caption:""}},[t._v("\n                    "+t._s(e.unit["workload-status"].message)+"\n                  ")]):t._e()],1)],1)})),1)],1)],1),t.unitErrorCount>0?o("badge",{staticClass:"bg-negative text-white",attrs:{left:""}},[t._v("\n          "+t._s(t.unitErrorCount)+"\n        ")]):t._e(),t.unitWarningCount>0?o("badge",{staticClass:"bg-warning text-black"},[t._v("\n          "+t._s(t.unitWarningCount)+"\n        ")]):t._e()],1),o("q-btn",{staticClass:"lt-mobile-menu on-right",attrs:{flat:"",round:"",dense:"",icon:"menu"},on:{click:function(e){t.showMenuDrawer=!t.showMenuDrawer}}})],1)],1),o("q-drawer",{attrs:{mini:t.taskbarMini,"mini-to-overlay":"",bordered:"","show-if-above":"",breakpoint:t.taskbarBreakpoint,width:200,"content-class":"taskbar"},on:{mouseover:t.expandTaskbar,mouseout:t.collapseTaskbar},model:{value:t.showTaskbar,callback:function(e){t.showTaskbar=e},expression:"showTaskbar"}},[o("div",{staticClass:"column fit no-wrap"},[o("q-scroll-area",{staticClass:"col",attrs:{"thumb-style":{width:"3px"}}},[o("q-list",t._l(t.floatingWindows,(function(e){return o("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],key:e.id,attrs:{clickable:""},on:{click:function(i){e.visible||t.toggleFloatingWindowVisible(e.id),t.focusFloatingWindow(e.id)}}},[o("q-menu",{attrs:{"context-menu":"",anchor:"center right",self:"center left","content-style":"z-index: 10000","transition-show":"jump-right","transition-hide":"jump-left"}},[o("q-list",{attrs:{dense:""}},[o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(i){return t.removeFloatingWindow(e.id)}}},[o("q-item-section",{attrs:{side:""}},[o("q-icon",{attrs:{color:"negative",name:"fas fa-window-close"}})],1),o("q-item-section",[t._v("Close")])],1)],1)],1),o("q-item-section",{staticStyle:{"min-width":"2em"},attrs:{avatar:""}},[o("q-icon",{attrs:{name:"log"==e.kind?"fas fa-file-alt":"fas fa-terminal"}})],1),o("q-item-section",[t._v("\n              "+t._s(e.unit.name)+"\n            ")])],1)})),1)],1),o("q-separator",{staticStyle:{height:"1px"}}),o("q-list",[o("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:"",to:{name:"welcome"}}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"info"}})],1),o("q-item-section",[t._v("\n            Welcome Page\n          ")])],1),o("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:t.showFeedbackDialog}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"fas fa-bullhorn"}})],1),o("q-item-section",[t._v("\n            Leave Feedback\n          ")])],1),o("dark-mode-toggle"),o("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:t.logout}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"logout"}})],1),o("q-item-section",[t._v("\n            Logout\n          ")])],1)],1)],1)]),o("q-drawer",{attrs:{side:"right",width:200,"content-class":"menu-drawer"},model:{value:t.showMenuDrawer,callback:function(e){t.showMenuDrawer=e},expression:"showMenuDrawer"}},[o("q-scroll-area",{staticClass:"fit"},[o("q-list",{staticClass:"menu-list",attrs:{padding:""}},[o("q-item",[o("q-item-section",{staticClass:"text-weight-bold"},[t._v("\n            Menu\n          ")])],1),t._l(t.mainLinks,(function(e,i){return o("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],key:i,attrs:{clickable:"",to:e.to}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:e.icon}})],1),o("q-item-section",[t._v("\n            "+t._s(e.label)+"\n          ")])],1)}))],2)],1)],1),o("q-page-container",[o("q-page",[o("transition",{attrs:{name:"router-slide-down",mode:"out-in"},on:{"before-leave":function(e){t.routerTransitionInProgress=!0},"after-enter":function(e){t.routerTransitionInProgress=!1}}},[o("router-view")],1),t._l(t.floatingTermWindows,(function(t){return o("floating-terminal-window",{key:t.id,attrs:{floatingWindowId:t.id}})})),t._l(t.floatingLogWindows,(function(t){return o("floating-log-window",{key:t.id,attrs:{floatingWindowId:t.id}})}))],2)],1)],1)}),[],!1,null,null,null);e.default=$t.exports;h()($t,"components",{QLayout:Wt.a,QHeader:kt.a,QToolbar:Ct.a,QBtn:c.a,QToolbarTitle:Dt.a,QResizeObserver:Y.a,QTabs:Ot.a,QRouteTab:It.a,QSelect:Lt.a,QMenu:Nt.a,QList:St.a,QItem:l.a,QItemSection:u.a,QItemLabel:qt.a,QBadge:_t.a,QDrawer:Qt.a,QScrollArea:Et.a,QIcon:p.a,QSeparator:At.a,QPageContainer:Pt.a,QPage:Ft.a,QField:Rt.a}),h()($t,"directives",{Ripple:m.a,ClosePopup:Bt.a})},"9b19":function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE5OC40MjQiIHZpZXdCb3g9IjAgMCAxOTguNDI0IDE5OC40MjQiIHdpZHRoPSIxOTguNDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiPjxjaXJjbGUgY3g9Ijk5LjIxMTk5OCIgY3k9Ijk5LjIxMTk5OCIgZmlsbD0iI2U5NTQyMCIgcj0iOTkuMjExOTk4Ii8+PGcgZmlsbD0iI2ZmZiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDEuNjY5OTk4IDE2Ljk2NTk5NikiPjxjaXJjbGUgY3g9IjYzLjIxMjAwMiIgY3k9Ijc2LjU3NTk5NiIgcj0iNi4xNDIiLz48cGF0aCBkPSJtNjguODgxIDY1LjIzN2gtMTEuMzM4di00NS4zNTRjMC0xMC45NCA4LjkwMi0xOS44NDIgMTkuODQyLTE5Ljg0MiAxMC45NDEgMCAxOS44NDIgOC45MDIgMTkuODQyIDE5Ljg0MnYxMS4zMzlsLTExLjMzOC0uMDAxdi0xMS4zMzhjMC0yLjI3Mi0uODg1LTQuNDA4LTIuNDkxLTYuMDE0LTEuNjA2LTEuNjA0LTMuNzQxLTIuNDkxLTYuMDEzLTIuNDkxLTQuNjg5IDAtOC41MDQgMy44MTYtOC41MDQgOC41MDV6Ii8+PHBhdGggZD0ibTEwNS43MyA4NS4wNzljLTEwLjk0IDAtMTkuODQyLTguOS0xOS44NDItMTkuODQydi0yOC4zNDVoMTEuMzM4djI4LjM0NWMwIDQuNjkgMy44MTQgOC41MDUgOC41MDQgOC41MDVzOC41LTMuODE0IDguNS04LjUwNXYtMjguMzQ1aDExLjM0djI4LjM0NWMwIDUuMy0yLjA2IDEwLjI4My01LjgxIDE0LjAzMS0zLjc0IDMuNzQ5LTguNzMgNS44MTEtMTQuMDMgNS44MTF6Ii8+PGNpcmNsZSBjeD0iNi41MTkiIGN5PSIxNDQuNjAwMDEiIHI9IjYuMTQyIi8+PHBhdGggZD0ibTEyLjE4OCAxMzMuMjdoLTExLjMzOHYtNjIuMzYyYzAtMTAuOTQxIDguOTAxLTE5Ljg0MiAxOS44NDMtMTkuODQyIDEwLjk0MSAwIDE5Ljg0MiA4LjkwMSAxOS44NDIgMTkuODQydjExLjMzOWgtMTEuMzM5di0xMS4zMzljMC0yLjI3Mi0uODg0LTQuNDA4LTIuNDkxLTYuMDE0LTEuNjA2LTEuNjA0LTMuNzQyLTIuNDkxLTYuMDEzLTIuNDkxLTQuNjg5IDAtOC41MDQgMy44MTYtOC41MDQgOC41MDV6Ii8+PHBhdGggZD0ibTQ5LjAzOSAxMzYuMWMtMTAuOTQxIDAtMTkuODQzLTguOS0xOS44NDMtMTkuODR2LTI4LjM0NmgxMS4zMzl2MjguMzQ2YzAgNC42OSAzLjgxNSA4LjUgOC41MDQgOC41czguNTA0LTMuODEgOC41MDQtOC41di0yOC4zNDZoMTEuMzM4djI4LjM0NmMwIDUuMy0yLjA2NCAxMC4yOC01LjgxMiAxNC4wM3MtOC43MzEgNS44MS0xNC4wMyA1LjgxeiIvPjwvZz48L2c+PC9zdmc+"},c4f6:function(t,e,i){}}]);
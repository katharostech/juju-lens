(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{a7d4:function(t,e,o){"use strict";o.r(e);var n=o("b7b1"),r=o("60a3"),i=function(t,e,o,n){var r,i=arguments.length,l=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(l=(i<3?r(l):i>3?r(e,o,l):r(e,o))||l);return i>3&&l&&Object.defineProperty(e,o,l),l};let l=class ResourceCard extends r.c{};i([Object(r.b)({type:String,default:""})],l.prototype,"heading",void 0),i([Object(r.b)({default:null})],l.prototype,"headingLink",void 0),i([Object(r.b)({type:String,default:null})],l.prototype,"headingIcon",void 0),i([Object(r.b)({type:Array,default:[]})],l.prototype,"infoItems",void 0),i([Object(r.b)({type:Boolean,default:!1})],l.prototype,"loading",void 0),i([Object(r.b)({type:Boolean,default:!1})],l.prototype,"showContentSection",void 0),l=i([Object(r.a)({components:{JujuLoading:n.a}})],l);var a=l,s=o("2877"),c=o("f09f"),u=o("a370"),d=o("0016"),p=o("05c0"),h=o("9c40"),m=o("4e73"),f=o("66e5"),g=o("4074"),b=o("eb85"),v=o("7f67"),y=o("eebe"),C=o.n(y),q=Object(s.a)(a,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-card",[o("q-card-section",[o("div",{staticClass:"row items-center"},[o("div",{staticClass:"col-grow",staticStyle:{flex:"1 1 0%"}},[o("div",{staticClass:"text-h6"},[o("q-icon",{staticClass:"on-left",attrs:{name:t.headingIcon}}),t.headingLink?o("router-link",{staticStyle:{"text-decoration":"none"},attrs:{to:t.headingLink}},[t._v("\n            "+t._s(t.heading)+"\n          ")]):o("span",[t._v(t._s(t.heading))])],1),o("div",{staticClass:"text-subtitle2 row"},t._l(t.infoItems,(function(e,n){return o("div",{key:n,staticClass:"q-mr-sm"},[o("q-icon",{staticClass:"q-ma-xs",attrs:{name:e.icon,size:"1em"}}),e.tooltip?o("q-tooltip",[t._v(t._s(e.tooltip))]):t._e(),t._v("\n            "+t._s(e.label)+"\n          ")],1)})),0)]),o("div",{staticClass:"col-auto"},[o("q-btn",{attrs:{flat:"",round:"",icon:"more_vert"}},[o("q-menu",{staticStyle:{"font-size":"1em"},attrs:{anchor:"center right",self:"center left",offset:[10,0]}},[o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"bg-primary text-white",attrs:{clickable:""},on:{click:function(e){return t.$emit("edit")}}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"edit"}})],1),o("q-item-section",[t._v("Edit")])],1),o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"bg-negative text-white",attrs:{clickable:""},on:{click:function(e){return t.$emit("delete")}}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"delete"}})],1),o("q-item-section",[t._v("Delete")])],1)],1)],1)],1)])]),t.showContentSection?o("q-separator"):t._e(),t.showContentSection?o("q-card-section",[t._t("default")],2):t._e(),o("juju-loading",{attrs:{loading:t.loading}})],1)}),[],!1,null,null,null),w=q.exports;C()(q,"components",{QCard:c.a,QCardSection:u.a,QIcon:d.a,QTooltip:p.a,QBtn:h.a,QMenu:m.a,QItem:f.a,QItemSection:g.a,QSeparator:b.a}),C()(q,"directives",{ClosePopup:v.a});var j=o("b2da"),_=o("4bb5"),O=function(t,e,o,n){var r,i=arguments.length,l=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(l=(i<3?r(l):i>3?r(e,o,l):r(e,o))||l);return i>3&&l&&Object.defineProperty(e,o,l),l};const k=Object(_.a)("juju");let x=class ControllerEdit extends r.c{constructor(){super(...arguments),this.loading=!1,this.name=null,this.host=null,this.port=443,this.username=null,this.password=null,this.insecure=!1}get isTauriApp(){return!!window.__TAURI__}get inputColor(){return this.$q.dark.isActive?"secondary":"primary"}get editing(){return null!=this.controller}show(){this.controller&&(this.name=this.controllerName,this.host=this.controller.host,this.port=this.controller.port,this.username=this.controller.username,this.insecure=this.controller.insecure),this.$refs.dialog.show()}hide(){this.$refs.dialog.hide()}onDialogHide(){this.$emit("hide")}onSubmit(){const t={host:this.host,port:this.port,username:this.username,password:this.password,insecure:!!window.__TAURI__&&this.insecure,models:{},machines:{},applications:{},units:{},charms:{}};this.controllerName&&this.controllerName!=this.name&&(this.currentController==this.controllerName&&this.setCurrentController(this.name),this.deleteController(this.controllerName)),this.loading=!0,this.updateController({name:this.name,controller:t}).then(()=>{this.$emit("ok",t),this.hide(),this.loading=!1,this.$q.notify({type:"positive",message:this.editing?`successfully updated controller: ${this.name}.`:"Successfully added controller: "+this.name,position:"bottom-right",timeout:2e3})})}onCancelClick(){this.hide()}};O([Object(r.b)({type:Object,default:null})],x.prototype,"controller",void 0),O([Object(r.b)({type:String,default:null})],x.prototype,"controllerName",void 0),O([k.State],x.prototype,"currentController",void 0),O([k.Action(j.a.setCurrentController)],x.prototype,"setCurrentController",void 0),O([k.Action(j.a.deleteController)],x.prototype,"deleteController",void 0),O([k.Action(j.a.updateController)],x.prototype,"updateController",void 0),x=O([r.a],x);var Q=x,S=o("24e8"),L=o("0378"),I=o("27f9"),$=o("8f8e"),A=o("0170"),R=o("4b7e"),T=Object(s.a)(Q,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-dialog",{ref:"dialog",attrs:{persistent:""},on:{hide:t.onDialogHide}},[o("q-card",{staticClass:"q-dialog-plugin"},[o("q-card-section",[o("div",{staticClass:"text-h5 q-mb-sm flex items-center justify-center"},[t.editing?o("q-icon",{staticClass:"on-left",attrs:{name:"edit"}}):t._e(),t.editing?o("span",[t._v("Edit")]):t._e(),t.editing?t._e():o("q-icon",{staticClass:"on-left",attrs:{name:"fas fa-plus"}}),t.editing?t._e():o("span",[t._v("Add")]),o("span",[t._v(" Controller")])],1),t.editing?o("p",{staticClass:"text-center"},[t._v("Edit controller connection")]):o("p",{staticClass:"text-center"},[t._v("\n        Add an existing controller to Juju Lens\n      ")]),o("q-form",{staticClass:"q-gutter-md",on:{submit:t.onSubmit}},[o("q-input",{attrs:{label:"Controller name",color:t.inputColor,rules:[function(t){return!!t||"Field is required"}],"lazy-rules":""},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}}),o("div",{staticClass:"row"},[o("q-input",{staticClass:"col-8",attrs:{label:"Host",color:t.inputColor,rules:[function(t){return!!t||"Field is required"}],"lazy-rules":""},model:{value:t.host,callback:function(e){t.host=e},expression:"host"}}),o("q-input",{staticClass:"col-4",attrs:{label:"Port",type:"number",color:t.inputColor,rules:[function(t){return!!t||"Field is required"}],"lazy-rules":""},model:{value:t.port,callback:function(e){t.port=t._n(e)},expression:"port"}})],1),t.isTauriApp?o("q-item",[o("q-item-section",{attrs:{avatar:"",top:""}},[o("q-checkbox",{model:{value:t.insecure,callback:function(e){t.insecure=e},expression:"insecure"}})],1),o("q-item-section",[o("q-item-label",[t._v("Insecure")]),o("q-item-label",{attrs:{caption:""}},[t._v("Insecure mode allows you to connect to development controllers\n              with self-signed certificates. Do not use this for production\n              controllers!\n            ")])],1)],1):t._e(),o("q-input",{attrs:{label:"Username",color:t.inputColor,rules:[function(t){return!!t||"Field is required"}],"lazy-rules":""},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}}),o("q-input",{attrs:{label:"Password",color:t.inputColor,rules:[function(t){return!!t||"Field is required"}],"lazy-rules":"",type:"password"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}}),o("q-card-actions",{attrs:{align:"center"}},[o("q-btn",{attrs:{color:"positive",type:"submit",label:t.controller?"Update":"Add",icon:t.editing?"check":"fas fa-plus",loading:t.loading}}),o("q-btn",{attrs:{color:"primary",icon:"cancel",label:"Cancel"},on:{click:t.onCancelClick}})],1)],1)],1)],1)],1)}),[],!1,null,null,null),D=T.exports;C()(T,"components",{QDialog:S.a,QCard:c.a,QCardSection:u.a,QIcon:d.a,QForm:L.a,QInput:I.a,QItem:f.a,QItemSection:g.a,QCheckbox:$.a,QItemLabel:A.a,QCardActions:R.a,QBtn:h.a});var P=function(t,e,o,n){var r,i=arguments.length,l=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(l=(i<3?r(l):i>3?r(e,o,l):r(e,o))||l);return i>3&&l&&Object.defineProperty(e,o,l),l};const E=Object(_.a)("juju");let N=class Controllers extends r.c{get tab(){return"controllers"}startCreateController(){this.$q.dialog({component:D,parent:this})}startEditController(t,e){this.$q.dialog({component:D,parent:this,controllerName:t,controller:e})}deleteController(t){this.$q.dialog({title:"Are you sure?",message:`Are you sure you want to delete controller ${t}?`,persistent:!0,cancel:!0,ok:{label:"delete",color:"negative"}}).onOk(()=>{this.runDeleteController(t),this.$q.notify({type:"positive",message:`successfully deleted controller: ${t}.`,position:"bottom-right",timeout:2e3})})}};P([E.State],N.prototype,"currentController",void 0),P([E.State],N.prototype,"controllers",void 0),P([E.Action(j.a.deleteController)],N.prototype,"runDeleteController",void 0),N=P([Object(r.a)({components:{JujuLoading:n.a,ResourceCard:w}})],N);var z=N,H=o("65c6"),B=o("6ac5"),F=o("2c91"),J=Object(s.a)(z,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"controllers absolute fit flex items-stretch"},[o("div",{staticClass:"q-pa-xs fit column no-wrap"},[o("q-toolbar",{staticClass:"col-auto row q-mt-sm"},[o("q-toolbar-title",{staticStyle:{"font-size":"1.5rem"}},[t._v("Controllers")]),o("q-space"),o("q-btn",{attrs:{color:"positive",icon:"fas fa-plus"},on:{click:function(e){return t.startCreateController()}}})],1),o("div",{staticClass:"row content-start q-ma-sm q-col-gutter-sm"},t._l(t.controllers,(function(e,n){return o("div",{key:n,staticClass:"col-12 col-sm-6 col-md-4"},[o("resource-card",{attrs:{heading:n,"heading-link":{name:"models",query:{controller:n}},headingIcon:"gamepad",infoItems:[{icon:"fas fa-server",label:Object.keys(e.machines).length,tooltip:"Machines"},{icon:"fas fa-share-alt",label:Object.keys(e.models).length,tooltip:"Models"},{icon:"fas fa-play-circle",label:Object.keys(e.applications).length,tooltip:"Applications"},{icon:"fas fa-boxes",label:Object.keys(e.units).length,tooltip:"Units"}]},on:{delete:function(e){return t.deleteController(n)},edit:function(o){return t.startEditController(n,e)}}})],1)})),0)],1),o("juju-loading",{attrs:{loading:!1}})],1)}),[],!1,null,null,null);e.default=J.exports;C()(J,"components",{QToolbar:H.a,QToolbarTitle:B.a,QSpace:F.a,QBtn:h.a})},b7b1:function(t,e,o){"use strict";var n=o("74f7"),r=o("792f"),i=o("60a3"),l=function(t,e,o,n){var r,i=arguments.length,l=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(l=(i<3?r(l):i>3?r(e,o,l):r(e,o))||l);return i>3&&l&&Object.defineProperty(e,o,l),l};let a=class JujuLoading extends i.c{constructor(){super(...arguments),this.showLoading=!1,this.showLoadingTimeoutHandle=null}created(){this.onLoadingChange(this.loading)}onLoadingChange(t){t||(this.showLoading=!1),!t&&this.showLoadingTimeoutHandle?clearTimeout(this.showLoadingTimeoutHandle):t&&!this.showLoadingTimeoutHandle&&(this.showLoadingTimeoutHandle=setTimeout(()=>this.showLoading=!0,this.delay))}};l([Object(i.b)(Boolean)],a.prototype,"loading",void 0),l([Object(i.b)({type:Number,default:300})],a.prototype,"delay",void 0),l([Object(i.d)("loading")],a.prototype,"onLoadingChange",null),a=l([Object(i.a)({components:{QInnerLoading:n.a,QSpinnerRings:r.a}})],a);var s=a,c=o("2877"),u=o("eebe"),d=o.n(u),p=Object(c.a)(s,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-inner-loading",{attrs:{showing:t.showLoading}},[o("q-spinner-rings",{attrs:{size:"80%",color:t.$q.dark.isActive?"secondary":"primary"}})],1)}),[],!1,null,null,null);e.a=p.exports;d()(p,"components",{QInnerLoading:n.a,QSpinnerRings:r.a})}}]);
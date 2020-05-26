(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{1396:function(e,t,o){},a7d4:function(e,t,o){"use strict";o.r(t);var i=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"controllers absolute fit flex items-stretch"},[o("div",{staticClass:"q-pa-xs fit column"},[o("q-toolbar",{staticClass:"col-auto row"},[o("q-tabs",{staticClass:"q-pa-xs ctrlr-cred-tabs",attrs:{"inline-label":"",value:e.tab,shrink:""}},[o("q-route-tab",{attrs:{label:"Controllers",icon:"fas fa-server",name:"controllers",to:{name:"controllers"}}}),o("q-route-tab",{attrs:{label:"Cloud Credentials",icon:"fas fa-address-card",name:"credentials",to:{name:"cloud-credentials"}}})],1),o("q-space"),o("q-btn",{attrs:{color:"positive",icon:"fas fa-plus"},on:{click:function(t){return e.startCreate()}}})],1),o("q-tab-panels",{staticStyle:{flex:"1 1 0%","background-color":"hsla(0, 0%, 0%, 0)"},attrs:{animated:""},model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[o("q-tab-panel",{staticClass:"row content-start q-col-gutter-sm",attrs:{name:"controllers","transition-next":"tab-trans","transition-prev":"tab-trans"}},[o("div",{staticClass:"text-h5 ctrl-cred-tabs-alt-heading col-12 q-mb-sm q-ml-xs"},[e._v("\n          Controllers\n        ")]),e._l(e.controllers,(function(t){return o("div",{key:t.name,staticClass:"col-12 col-sm-6 col-md-4"},[o("resource-card",{attrs:{heading:t.name,headingIcon:"fas fa-server",infoItems:[{label:e.controllersCloud(t),icon:"cloud"},{label:e.controllersCredential(t),icon:"fas fa-address-card"},{label:t.accessLevel,icon:"person"}],loading:e.loadingControllers[t.id]},on:{delete:function(o){return e.deleteController(t)},edit:function(o){return e.startEditController(t)}}})],1)}))],2),o("q-tab-panel",{staticClass:"row content-start q-col-gutter-sm",attrs:{name:"credentials"}},[o("div",{staticClass:"text-h5 ctrl-cred-tabs-alt-heading col-12 q-mb-sm q-ml-xs"},[e._v("\n          Cloud Credentials\n        ")]),e._l(e.cloudCredentials,(function(t){return o("div",{key:t.name,staticClass:"col-12 col-sm-6 col-md-4"},[o("resource-card",{attrs:{heading:t.name,headingIcon:"fas fa-address-card",infoItems:[{label:e.credentialsCloud(t),icon:"cloud"}],loading:e.loadingCredentials[t.id]},on:{delete:function(o){return e.deleteCredential(t)},edit:function(o){return e.startEditCredential(t)}}})],1)}))],2)],1)],1),o("juju-loading",{attrs:{loading:e.loading}})],1)},n=[],l=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-card",[o("q-card-section",[o("div",{staticClass:"row items-center"},[o("div",{staticClass:"col-grow",staticStyle:{flex:"1 1 0%"}},[o("div",{staticClass:"text-h6"},[o("q-icon",{staticClass:"on-left",attrs:{name:e.headingIcon}}),e._v("\n          "+e._s(e.heading)+"\n        ")],1),o("div",{staticClass:"text-subtitle2 row"},e._l(e.infoItems,(function(t,i){return o("div",{key:i,staticClass:"q-mr-sm"},[o("q-icon",{staticClass:"q-ma-xs",attrs:{name:t.icon,size:"1em"}}),e._v("\n            "+e._s(t.label)+"\n          ")],1)})),0)]),o("div",{staticClass:"col-auto"},[o("q-btn",{attrs:{flat:"",round:"",icon:"more_vert"}},[o("q-menu",{staticStyle:{"font-size":"1em"},attrs:{anchor:"center right",self:"center left",offset:[10,0]}},[o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"bg-primary text-white",attrs:{clickable:""},on:{click:function(t){return e.$emit("edit")}}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"edit"}})],1),o("q-item-section",[e._v("Edit")])],1),o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"bg-negative text-white",attrs:{clickable:""},on:{click:function(t){return e.$emit("delete")}}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{name:"delete"}})],1),o("q-item-section",[e._v("Delete")])],1)],1)],1)],1)])]),e.showContentSection?o("q-separator"):e._e(),e.showContentSection?o("q-card-section",[e._t("default")],2):e._e(),o("juju-loading",{attrs:{loading:e.loading}})],1)},a=[],r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-inner-loading",{attrs:{showing:e.showLoading}},[o("q-spinner-rings",{attrs:{size:"80%",color:e.$q.dark.isActive?"secondary":"primary"}})],1)},s=[],d=o("fe09"),c=o("60a3"),u=function(e,t,o,i){var n,l=arguments.length,a=l<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(l<3?n(a):l>3?n(t,o,a):n(t,o))||a);return l>3&&a&&Object.defineProperty(t,o,a),a};let p=class extends c["d"]{constructor(){super(...arguments),this.showLoading=!1,this.showLoadingTimeoutHandle=null}created(){this.onLoadingChange(this.loading)}onLoadingChange(e){e||(this.showLoading=!1),!e&&this.showLoadingTimeoutHandle?clearTimeout(this.showLoadingTimeoutHandle):e&&!this.showLoadingTimeoutHandle&&(this.showLoadingTimeoutHandle=setTimeout(()=>this.showLoading=!0,this.delay))}};u([Object(c["c"])(Boolean)],p.prototype,"loading",void 0),u([Object(c["c"])({type:Number,default:300})],p.prototype,"delay",void 0),u([Object(c["e"])("loading")],p.prototype,"onLoadingChange",null),p=u([Object(c["a"])({components:{QInnerLoading:d["b"],QSpinnerRings:d["c"]}})],p);var h=p,f=h,m=o("2877"),g=o("eebe"),C=o.n(g),b=o("74f7"),v=o("792f"),y=Object(m["a"])(f,r,s,!1,null,null,null),q=y.exports;C()(y,"components",{QInnerLoading:b["a"],QSpinnerRings:v["a"]});var j=function(e,t,o,i){var n,l=arguments.length,a=l<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(l<3?n(a):l>3?n(t,o,a):n(t,o))||a);return l>3&&a&&Object.defineProperty(t,o,a),a};let w=class extends c["d"]{};j([Object(c["c"])({type:String,default:""})],w.prototype,"heading",void 0),j([Object(c["c"])({type:String,default:null})],w.prototype,"headingIcon",void 0),j([Object(c["c"])({type:Array,default:[]})],w.prototype,"infoItems",void 0),j([Object(c["c"])({type:Boolean,default:!1})],w.prototype,"loading",void 0),j([Object(c["c"])({type:Boolean,default:!1})],w.prototype,"showContentSection",void 0),w=j([Object(c["a"])({components:{JujuLoading:q}})],w);var k=w,$=k,_=o("f09f"),O=o("a370"),Q=o("0016"),x=o("9c40"),S=o("4e73"),I=o("66e5"),D=o("4074"),L=o("eb85"),R=o("7f67"),A=Object(m["a"])($,l,a,!1,null,null,null),P=A.exports;C()(A,"components",{QCard:_["a"],QCardSection:O["a"],QIcon:Q["a"],QBtn:x["a"],QMenu:S["a"],QItem:I["a"],QItemSection:D["a"],QSeparator:L["a"]}),C()(A,"directives",{ClosePopup:R["a"]});var T=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-dialog",{ref:"dialog",attrs:{persistent:""},on:{hide:e.onDialogHide}},[o("q-card",{staticClass:"q-dialog-plugin"},[o("q-card-section",[o("div",{staticClass:"text-h5 q-mb-sm flex items-center"},[e.editing?o("q-icon",{staticClass:"on-left",attrs:{name:"edit"}}):e._e(),e.editing?o("span",[e._v("Edit")]):e._e(),e.editing?e._e():o("q-icon",{staticClass:"on-left",attrs:{name:"fas fa-plus"}}),e.editing?e._e():o("span",[e._v("Create")]),o("span",[e._v(" Controller")])],1),e.editing?e._e():o("p",[e._v("Deploy a new controller to a supported cloud.")]),o("q-form",{staticClass:"q-gutter-md",on:{submit:e.onSubmit}},[o("q-input",{attrs:{label:"Controller name",color:e.inputColor,rules:[function(e){return!!e||"Field is required"}],"lazy-rules":""},model:{value:e.name,callback:function(t){e.name=t},expression:"name"}}),o("div",{staticClass:"row"},[o("q-select",{staticClass:"col q-pr-xs",attrs:{label:"Cloud","option-label":"name",options:e.clouds,color:e.inputColor,disable:e.editing,rules:[function(e){return!!e||"Field is required"}],"lazy-rules":""},model:{value:e.cloud,callback:function(t){e.cloud=t},expression:"cloud"}}),o("q-select",{staticClass:"col",attrs:{label:"Region","option-label":"name",disable:!e.cloud||e.editing,options:e.cloud?e.cloud.availableRegions:[],color:e.inputColor,rules:[function(e){return!!e||"Field is required"}],"lazy-rules":""},model:{value:e.region,callback:function(t){e.region=t},expression:"region"}})],1),o("div",{staticClass:"row items-center"},[o("q-select",{staticClass:"col-grow",attrs:{label:"Cloud Credential","option-label":"name",disable:!e.cloud||e.editing,options:e.cloud?e.cloudCredentials.filter((function(t){return t.cloudId==e.cloud.id})):[],color:e.inputColor,rules:[function(e){return!!e||"Field is required"}],"lazy-rules":""},model:{value:e.cloudCredential,callback:function(t){e.cloudCredential=t},expression:"cloudCredential"}}),o("q-btn",{staticClass:"col-auto q-ma-sm",attrs:{dense:"",color:"positive",icon:"fas fa-plus",disable:e.editing},on:{click:function(t){return e.startCreateCredential()}}},[o("q-tooltip",{attrs:{anchor:"top middle",self:"bottom middle"}},[e._v("Add Credential")])],1)],1),o("q-card-actions",{attrs:{align:"right"}},[o("q-btn",{attrs:{color:"positive",type:"submit",label:e.controller?"Update":"Create",icon:e.editing?"check":"fas fa-plus",loading:e.loading}}),o("q-btn",{attrs:{color:"primary",icon:"cancel",label:"Cancel"},on:{click:e.onCancelClick}})],1)],1)],1)],1)],1)},E=[],z=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-dialog",{ref:"dialog",attrs:{persistent:""},on:{hide:e.onDialogHide}},[o("q-card",{staticClass:"q-dialog-plugin"},[o("q-card-section",[o("div",{staticClass:"text-h5 q-mb-sm flex items-center"},[e.editing?o("q-icon",{staticClass:"on-left",attrs:{name:"edit"}}):e._e(),e.editing?o("span",[e._v("Edit")]):e._e(),e.editing?e._e():o("q-icon",{staticClass:"on-left",attrs:{name:"fas fa-plus"}}),e.editing?e._e():o("span",[e._v("Create")]),o("span",[e._v(" Cloud Credential")])],1),e.editing?e._e():o("p",[e._v("Add a new cloud credential.")]),o("q-form",{staticClass:"q-gutter-md",on:{submit:e.onSubmit}},[o("q-input",{attrs:{label:"Credential name",color:e.inputColor,rules:[function(e){return!!e||"Field is required"}]},model:{value:e.name,callback:function(t){e.name=t},expression:"name"}}),o("q-select",{attrs:{label:"Cloud","option-label":"name",options:e.clouds,color:e.inputColor,disable:e.editing,rules:[function(e){return!!e||"Field is required"}],"lazy-rules":""},model:{value:e.cloud,callback:function(t){e.cloud=t},expression:"cloud"}}),e.editing?o("p",{staticStyle:{"font-size":"0.8rem"}},[e._v("\n          Leave credentials blank if you only want to change the name. In that\n          case the credentials will not be changed.\n        ")]):e._e(),e._l(e.cloud?e.cloud.requiredCredentials:[],(function(t){return o("q-input",{key:t.key,ref:"credentialData",refInFor:!0,attrs:{value:e.credentialData[t.key]?e.credentialData[t.key]:"",label:t.label,color:e.inputColor,rules:[function(t){return!(e.credentialsRequired&&!t)||"Field is required"}],type:t.isPassword?"password":"text",hint:t.description,"lazy-rules":""},on:{input:function(o){return e.$set(e.credentialData,t.key,o)}}})})),o("q-card-actions",{attrs:{align:"right"}},[o("q-btn",{attrs:{color:"positive",type:"submit",label:e.editing?"Update":"Create",icon:e.editing?"check":"fas fa-plus",loading:e.loading}}),o("q-btn",{attrs:{color:"primary",icon:"cancel",label:"Cancel"},on:{click:e.onCancelClick}})],1)],2)],1)],1)],1)},F=[],H=o("b2da"),B=o("4bb5"),J=function(e,t,o,i){var n,l=arguments.length,a=l<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(l<3?n(a):l>3?n(t,o,a):n(t,o))||a);return l>3&&a&&Object.defineProperty(t,o,a),a};const N=Object(B["a"])("juju");let M=class extends c["d"]{constructor(){super(...arguments),this.loading=!1,this.name=null,this.cloud=null,this.credentialData={}}get inputColor(){return this.$q.dark.isActive?"secondary":"primary"}get editing(){return null!=this.credential}onCloudChange(){this.credentialData={}}get credentialsRequired(){return!(this.editing&&0==Object.keys(this.credentialData).filter(e=>!(this.credentialData[e]in["",null,void 0])).length)}show(){this.credential&&(this.name=this.credential.name,this.cloud=this.clouds.filter(e=>e.id==this.credential.cloudId)[0]),this.$refs.dialog.show()}hide(){this.$refs.dialog.hide()}onDialogHide(){this.$emit("hide")}onSubmit(){if(this.editing){const e={name:this.name,id:this.credential.id,cloudId:this.credential.cloudId,credentialData:this.credentialsRequired?this.credentialData:this.credential.credentialData};this.loading=!0,this.updateCloudCredential(e).then(()=>{this.$emit("ok",e),this.hide(),this.loading=!1,this.$q.notify({type:"positive",message:`Seccessfully updated credential: ${e.name}.`,position:"bottom-right",timeout:2e3})})}else{const e={name:this.name,id:Object(d["e"])(),cloudId:this.cloud.id,credentialData:this.credentialData};this.loading=!0,this.addCloudCredential(e).then(()=>{this.$emit("ok",e),this.hide(),this.loading=!1,this.$q.notify({type:"positive",message:`Seccessfully created credential: ${e.name}.`,position:"bottom-right",timeout:2e3})})}}onCancelClick(){this.hide()}};J([Object(c["c"])({type:Object,default:null})],M.prototype,"credential",void 0),J([N.State],M.prototype,"clouds",void 0),J([N.State],M.prototype,"cloudCredentials",void 0),J([N.Action(H["a"].addCloudCredential)],M.prototype,"addCloudCredential",void 0),J([N.Action(H["a"].updateCloudCredential)],M.prototype,"updateCloudCredential",void 0),J([Object(c["e"])("cloud")],M.prototype,"onCloudChange",null),M=J([c["a"]],M);var U=M,G=U,K=o("24e8"),V=o("0378"),W=o("27f9"),X=o("ddd8"),Y=o("4b7e"),Z=Object(m["a"])(G,z,F,!1,null,null,null),ee=Z.exports;C()(Z,"components",{QDialog:K["a"],QCard:_["a"],QCardSection:O["a"],QIcon:Q["a"],QForm:V["a"],QInput:W["a"],QSelect:X["a"],QCardActions:Y["a"],QBtn:x["a"]});var te=o("cf2e"),oe=function(e,t,o,i){var n,l=arguments.length,a=l<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(l<3?n(a):l>3?n(t,o,a):n(t,o))||a);return l>3&&a&&Object.defineProperty(t,o,a),a};const ie=Object(B["a"])("juju");let ne=class extends c["d"]{constructor(){super(...arguments),this.loading=!1,this.name=null,this.cloud=null,this.region=null,this.cloudCredential=null}get inputColor(){return this.$q.dark.isActive?"secondary":"primary"}get editing(){return null!=this.controller}startCreateCredential(){this.$q.dialog({component:ee,parent:this}).onOk(e=>{this.cloudCredential=e})}show(){this.controller&&(this.name=this.controller.name,this.cloud=this.clouds.filter(e=>e.id==this.controller.cloudId)[0],this.region=this.controller.region,this.cloudCredential=this.cloudCredentials.filter(e=>e.id==this.controller.cloudCredentialId)[0]),this.$refs.dialog.show()}hide(){this.$refs.dialog.hide()}onDialogHide(){this.$emit("hide")}onSubmit(){if(this.editing){const e={name:this.name,id:this.controller.id,cloudId:this.cloud.id,accessLevel:this.controller.accessLevel,region:this.region,cloudCredentialId:this.cloudCredential.id};this.loading=!0,this.updateController(e).then(()=>{this.$emit("ok",e),this.hide(),this.loading=!1,this.$q.notify({type:"positive",message:`Seccessfully created controller: ${e.name}.`,position:"bottom-right",timeout:2e3})})}else{const e={name:this.name,id:Object(d["e"])(),cloudId:this.cloud.id,accessLevel:"admin",region:this.region,cloudCredentialId:this.cloudCredential.id};this.loading=!0,this.addController(e).then(()=>{this.$emit("ok",e),this.hide(),this.loading=!1,this.setCurrentController(e),this.$q.notify({type:"positive",message:`Seccessfully created controller: ${e.name}.`,position:"bottom-right",timeout:2e3})})}}onCancelClick(){this.hide()}};oe([Object(c["c"])({type:Object,default:null})],ne.prototype,"controller",void 0),oe([ie.State],ne.prototype,"clouds",void 0),oe([ie.State],ne.prototype,"cloudCredentials",void 0),oe([ie.Mutation(te["b"].setCurrentController)],ne.prototype,"setCurrentController",void 0),oe([ie.Action(H["a"].addController)],ne.prototype,"addController",void 0),oe([ie.Action(H["a"].updateController)],ne.prototype,"updateController",void 0),ne=oe([c["a"]],ne);var le=ne,ae=le,re=o("05c0"),se=Object(m["a"])(ae,T,E,!1,null,null,null),de=se.exports;C()(se,"components",{QDialog:K["a"],QCard:_["a"],QCardSection:O["a"],QIcon:Q["a"],QForm:V["a"],QInput:W["a"],QSelect:X["a"],QBtn:x["a"],QTooltip:re["a"],QCardActions:Y["a"]});var ce=function(e,t,o,i){var n,l=arguments.length,a=l<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(l<3?n(a):l>3?n(t,o,a):n(t,o))||a);return l>3&&a&&Object.defineProperty(t,o,a),a};const ue=Object(B["a"])("juju");let pe=class extends c["d"]{constructor(){super(...arguments),this.loading=!1,this.loadingControllers={},this.loadingCredentials={}}get tab(){return"controllers"==this.$route.name?"controllers":"credentials"}created(){this.fetchData()}fetchData(){this.loading=!0,Promise.all([this.loadControllers(),this.loadCloudCredentials(),this.loadCloudList()]).then(()=>{this.loading=!1})}startCreate(){"controllers"==this.tab?this.$q.dialog({component:de,parent:this}):"credentials"==this.tab&&this.$q.dialog({component:ee,parent:this})}startEditController(e){this.$q.dialog({component:de,parent:this,controller:e})}startEditCredential(e){this.$q.dialog({component:ee,parent:this,credential:e})}deleteController(e){this.$q.dialog({title:"Are you sure?",message:`Are you sure you want to delete controller ${e.name}?`,persistent:!0,cancel:!0,ok:{label:"delete",color:"negative"}}).onOk(()=>{this.$set(this.loadingControllers,e.id,!0),this.runDeleteController(e.id).then(()=>{this.$set(this.loadingControllers,e.id,!1),this.$q.notify({type:"positive",message:`Seccessfully deleted controller: ${e.name}.`,position:"bottom-right",timeout:2e3})})})}deleteCredential(e){this.$q.dialog({title:"Are you sure?",message:`Are you sure you want to delete credential ${e.name}?`,persistent:!0,cancel:!0,ok:{label:"delete",color:"negative"}}).onOk(()=>{this.$set(this.loadingCredentials,e.id,!0),this.runDeleteCredential(e.id).then(()=>{this.$set(this.loadingCredentials,e.id,!1),this.$q.notify({type:"positive",message:`Seccessfully deleted credential: ${e.name}.`,position:"bottom-right",timeout:2e3})})})}credentialsCloud(e){const t=this.clouds.filter(t=>t.id==e.cloudId);return t[0]?t[0].name:""}controllersCredential(e){const t=this.cloudCredentials.filter(t=>t.id==e.cloudCredentialId);return t[0]?t[0].name:""}controllersCloud(e){const t=this.clouds.filter(t=>t.id==e.cloudId);return t[0]?t[0].name:""}};ce([ue.State],pe.prototype,"controllers",void 0),ce([ue.State],pe.prototype,"cloudCredentials",void 0),ce([ue.State],pe.prototype,"clouds",void 0),ce([ue.Action(H["a"].loadControllers)],pe.prototype,"loadControllers",void 0),ce([ue.Action(H["a"].loadCloudCredentials)],pe.prototype,"loadCloudCredentials",void 0),ce([ue.Action(H["a"].loadCloudList)],pe.prototype,"loadCloudList",void 0),ce([ue.Action(H["a"].deleteController)],pe.prototype,"runDeleteController",void 0),ce([ue.Action(H["a"].deleteCloudCredential)],pe.prototype,"runDeleteCredential",void 0),pe=ce([Object(c["a"])({components:{JujuLoading:q,ResourceCard:P}})],pe);var he=pe,fe=he,me=(o("fb71"),o("65c6")),ge=o("429b"),Ce=o("7867"),be=o("2c91"),ve=o("adad"),ye=o("823b"),qe=o("7460"),je=Object(m["a"])(fe,i,n,!1,null,null,null);t["default"]=je.exports;C()(je,"components",{QToolbar:me["a"],QTabs:ge["a"],QRouteTab:Ce["a"],QSpace:be["a"],QBtn:x["a"],QTabPanels:ve["a"],QTabPanel:ye["a"],QTab:qe["a"]})},fb71:function(e,t,o){"use strict";var i=o("1396"),n=o.n(i);n.a}}]);
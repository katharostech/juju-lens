(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"35a8":function(e,t,o){"use strict";o.r(t);var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-page",{staticClass:"row justify-center content-start"},[o("q-card",{staticClass:"col q-mx-md q-mt-lg q-pa-lg shadow-10",staticStyle:{"max-width":"60em"}},[o("div",{staticClass:"text-center text-h3 q-mb-md"},[e._v("Juju GUI Prototype")]),o("p",{staticClass:"q-ma-md text-body1"},[e._v("\n      This is a Juju GUI prototype developed by\n      "),o("a",{attrs:{href:"https://katharostech.com"}},[e._v("Katharos Technology")]),e._v(". All\n      interaction with the GUI is mocked without going to any real Juju\n      controller.\n    ")]),o("p",{staticClass:"q-ma-md text-body1"},[e._v("\n      The purpose of this GUI prototype is to demonstrate our ideas for a Juju\n      GUI interface and provide a practical area in which we can experiment\n      with the Juju GUI user experience.\n    ")]),o("p",{staticClass:"q-ma-md text-body1"},[e._v("\n      You are free to interact with anything in this GUI mock-up and the\n      results will be persisted inside of your browser window.\n    ")]),o("div",{staticClass:"flex justify-center"},[o("q-btn",{attrs:{color:"primary",label:"Get Started",to:e.getStartedLink}})],1)])],1)},a=[],n=o("850a"),s=o("60a3"),c=function(e,t,o,r){var a,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)s=Reflect.decorate(e,t,o,r);else for(var c=e.length-1;c>=0;c--)(a=e[c])&&(s=(n<3?a(s):n>3?a(t,o,s):a(t,o))||s);return n>3&&s&&Object.defineProperty(t,o,s),s};let i=class extends s["c"]{get getStartedLink(){const e=this.$route.query,t=e.welcomePageTo;return"string"==typeof t?(e.welcomePageTo=void 0,{path:t,query:e}):{name:"home"}}};i=c([Object(s["a"])({components:{DarkModeToggle:n["a"]}})],i);var l=i,d=l,u=o("2877"),p=o("eebe"),h=o.n(p),f=o("9989"),m=o("f09f"),b=o("9c40"),g=Object(u["a"])(d,r,a,!1,null,null,null);t["default"]=g.exports;h()(g,"components",{QPage:f["a"],QCard:m["a"],QBtn:b["a"]})},"850a":function(e,t,o){"use strict";var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-btn",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{round:"",dense:"",color:"secondary",icon:e.btnIcon},on:{click:e.updateDarkMode}},[o("q-tooltip",[e._v(e._s(e.btnTooltip))])],1)},a=[],n=o("60a3"),s=function(e,t,o,r){var a,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)s=Reflect.decorate(e,t,o,r);else for(var c=e.length-1;c>=0;c--)(a=e[c])&&(s=(n<3?a(s):n>3?a(t,o,s):a(t,o))||s);return n>3&&s&&Object.defineProperty(t,o,s),s};let c=class extends n["c"]{setDarkMode(e){this.$q.dark.set(e);try{this.$q.localStorage.set("darkMode",e)}catch(t){console.error(t)}}updateDarkMode(){const e=this.$q.dark.mode;"auto"===e?this.setDarkMode(!0):!1===e?this.setDarkMode("auto"):this.setDarkMode(!1)}get btnIcon(){const e=this.$q.dark.mode;return"auto"===e?"brightness_4":!1===e?"brightness_5":"brightness_3"}get btnTooltip(){const e=this.$q.dark.mode;return"auto"===e?"Auto Dark Mode":!1===e?"Light Mode":"Dark Mode"}};c=s([n["a"]],c);var i=c,l=i,d=o("2877"),u=o("eebe"),p=o.n(u),h=o("9c40"),f=o("05c0"),m=o("714f"),b=Object(d["a"])(l,r,a,!1,null,null,null);t["a"]=b.exports;p()(b,"components",{QBtn:h["a"],QTooltip:f["a"]}),p()(b,"directives",{Ripple:m["a"]})}}]);
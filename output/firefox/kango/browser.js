﻿kango.KangoBrowserCookie=function(){this.path=this.hostOnly=this.domain=this.value=this.name="";this.session=this.httpOnly=this.secure=!1;this.expires=0};kango.BrowserBase=function(){kango.oop.mixin(this,kango.EventTarget.prototype);kango.oop.mixin(this,new kango.EventTarget)};
kango.BrowserBase.prototype={event:{DOCUMENT_COMPLETE:"DocumentComplete",BEFORE_NAVIGATE:"BeforeNavigate",TAB_CHANGED:"TabChanged",TAB_CREATED:"TabCreated",TAB_REMOVED:"TabRemoved",WINDOW_CHANGED:"WindowChanged"},getName:function(){throw new kango.NotImplementedException;},cookies:{getCookies:function(a,b){throw new kango.NotImplementedException;},getCookie:function(a,b,c){throw new kango.NotImplementedException;},setCookie:function(a,b){throw new kango.NotImplementedException;}},tabs:{getAll:function(a){throw new kango.NotImplementedException;
},getCurrent:function(a){throw new kango.NotImplementedException;},create:function(a){throw new kango.NotImplementedException;}},windows:{getAll:function(a){throw new kango.NotImplementedException;},getCurrent:function(a){throw new kango.NotImplementedException;},create:function(a){throw new kango.NotImplementedException;}}};kango.IBrowserWindow=function(){};
kango.IBrowserWindow.prototype={getTabs:function(a){throw new kango.NotImplementedException;},getCurrentTab:function(a){throw new kango.NotImplementedException;},isActive:function(){throw new kango.NotImplementedException;}};kango.IBrowserTab=function(){};
kango.IBrowserTab.prototype={getId:function(){throw new kango.NotImplementedException;},getUrl:function(){throw new kango.NotImplementedException;},getTitle:function(){throw new kango.NotImplementedException;},getDOMWindow:function(){throw new kango.NotImplementedException;},isActive:function(){throw new kango.NotImplementedException;},navigate:function(a){throw new kango.NotImplementedException;},activate:function(){throw new kango.NotImplementedException;},dispatchMessage:function(a,b){throw new kango.NotImplementedException;
},close:function(){throw new kango.NotImplementedException;}};








kango.WebProgressListener=function(a){this._callback=a};
kango.WebProgressListener.prototype={_callback:null,QueryInterface:function(a){if(a.equals(Components.interfaces.nsIWebProgressListener)||a.equals(Components.interfaces.nsISupportsWeakReference)||a.equals(Components.interfaces.nsISupports))return this;throw Components.results.NS_NOINTERFACE;},onProgressChange:function(a,b,c,d,e,g){},onStatusChange:function(a,b,c,d){},onSecurityChange:function(a,b,c){},onLocationChange:function(a,b,c){},onStateChange:function(a,b,c,d){d=Components.interfaces.nsIWebProgressListener;
c&d.STATE_START&&c&d.STATE_IS_DOCUMENT&&(a={url:b.QueryInterface(Components.interfaces.nsIChannel).originalURI.spec,window:a.DOMWindow,document:a.DOMWindow.document},this._callback(a))}};kango.Browser=function(){this.superclass.apply(this,arguments);this._lastTabId=0;this._tabs={};this.init()};
kango.Browser.prototype=kango.oop.extend(kango.BrowserBase,{_tabs:null,init:function(){kango.array.forEach(kango.chromeWindows.getLoadedChromeWindows(),function(a){this._listenChromeWindowEvents(a)},this);kango.chromeWindows.addEventListener(kango.chromeWindows.event.WINDOW_LOAD,kango.func.bind(function(a){this._listenChromeWindowEvents(a.window)},this))},dispose:function(){this.removeAllEventListeners();this._tabs={}},_listenChromeWindowEvents:function(a){var b=new kango.WebProgressListener(kango.func.bind(this._onPageBeforeNavigate,
this));a.gBrowser.addProgressListener(b);kango.chromeWindows.registerContainerUnloader(function(){a.gBrowser.removeProgressListener(b)},a);var c=kango.func.bind(this._onPageLoad,this);a.gBrowser.addEventListener("DOMContentLoaded",c,!0);kango.chromeWindows.registerContainerUnloader(function(){a.gBrowser.removeEventListener("DOMContentLoaded",c,!0)},a);var d=kango.func.bind(this._onTabSelect,this);a.gBrowser.tabContainer.addEventListener("TabSelect",d,!0);kango.chromeWindows.registerContainerUnloader(function(){a.gBrowser.tabContainer.removeEventListener("TabSelect",
d,!0)},a);var e=kango.func.bind(this._onTabOpen,this);a.gBrowser.tabContainer.addEventListener("TabOpen",e,!0);kango.chromeWindows.registerContainerUnloader(function(){a.gBrowser.tabContainer.removeEventListener("TabOpen",e,!0)},a);var g=kango.func.bind(this._onTabClose,this);a.gBrowser.tabContainer.addEventListener("TabClose",g,!0);kango.chromeWindows.registerContainerUnloader(function(){a.gBrowser.tabContainer.removeEventListener("TabClose",g,!0)},a);var f=kango.func.bind(this._onWindowActivate,
this);a.addEventListener("activate",f,!0);kango.chromeWindows.registerContainerUnloader(function(){a.removeEventListener("activate",f,!0)},a)},_onPageBeforeNavigate:function(a){var b=a.document.defaultView;b.frameElement||this.fireEvent(this.event.BEFORE_NAVIGATE,{url:a.url,target:this.getTab(this.getTabFromWindow(b.top||b))})},_onPageLoad:function(a){a=a.originalTarget;var b=a.defaultView;if(a instanceof b.HTMLDocument){var c=this.getTab(this.getTabFromWindow(b));c.deleteTabProxy(b);c={url:c.getUrl(),
title:c.getTitle(),target:c};a.defaultView.frameElement||this.fireEvent(this.event.DOCUMENT_COMPLETE,c);c.window=b;this.fireEvent("DOMContentLoaded",c)}},_getTabId:function(a){return a.linkedPanel.toString().split("panel").pop()},_removeTab:function(a){return delete this._tabs[a]},_onTabSelect:function(a){a=this.getTab(a.target);this.fireEvent(this.event.TAB_CHANGED,{url:a.getUrl(),title:a.getTitle(),target:a,tabId:a.getId()})},_onTabOpen:function(a){a=this.getTab(a.target);this.fireEvent(this.event.TAB_CREATED,
{target:a,tabId:a.getId()})},_onTabClose:function(a){a=this._getTabId(a.target);this._removeTab(a);this.fireEvent(this.event.TAB_REMOVED,{tabId:a})},_onWindowActivate:function(a){this.fireEvent(this.event.WINDOW_CHANGED,{target:new kango.BrowserWindow(a.target.gBrowser)})},getTabFromWindow:function(a){a=a.top||a;for(var b=this.getBrowsers(),c=0;c<b.length;c++){var d=b[c],e=d.getBrowserIndexForDocument(a.document);if(-1!=e)return d.tabContainer.childNodes[e]}return null},getBrowsers:function(){return kango.array.map(kango.chromeWindows.getLoadedChromeWindows(),
function(a){return a.gBrowser})},getTabs:function(a){return kango.array.map(a.tabContainer.childNodes,function(a){return kango.browser.getTab(a)})},getTab:function(a){var b=this._getTabId(a);"undefined"==typeof this._tabs[b]&&(this._tabs[b]=new kango.BrowserTab(a,b),a=this._tabs[b].getChromeWindow(),kango.chromeWindows.registerContainerUnloader(kango.func.bind(function(){this._removeTab(b)},this),a));return this._tabs[b]},getTabProxyForWindow:function(a){return this.getTab(this.getTabFromWindow(a)).getProxyForWindow(a)},
getName:function(){return"firefox"},cookies:{getCookies:function(a,b){var c=[],d=Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager),e=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(a,null,null);if(null!=e)for(var g=e.host,e=e.path||"/",d=d.enumerator;d.hasMoreElements();){var f=d.getNext().QueryInterface(Components.interfaces.nsICookie2);g.indexOf(f.host)+f.host.length==g.length&&0==e.indexOf(f.path)&&
c.push({name:f.name,value:f.value,domain:f.host,hostOnly:f.isDomain,path:f.path,secure:f.isSecure,httpOnly:f.isHttpOnly,session:f.isSession,expires:f.expires})}b(c)},getCookie:function(a,b,c){this.getCookies(a,function(a){for(var e=0;e<a.length;e++)a[e].name==b&&c(a[e]);c(null)})},setCookie:function(a,b){var c=b.name,d=b.value,e=b.expires||null,g=b.secure||!1,f=b.httpOnly||!1,k=Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager2),h=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(a,
null,null);null!=h&&k.add(h.host,h.path,c,d,g,f,g,e)}},tabs:{getAll:function(a){for(var b=[],c=kango.browser.getBrowsers(),d=0;d<c.length;d++)b=b.concat(kango.browser.getTabs(c[d]));a(b)},getCurrent:function(a){kango.browser.windows.getCurrent(function(b){b.getCurrentTab(function(b){a(b)})})},create:function(a){var b="undefined"==typeof a.focused||a.focused,c="undefined"!=typeof a.reuse&&a.reuse,d=kango.chromeWindows.getMostRecentChromeWindow().gBrowser,e=null;if(c)for(c=0;c<d.browsers.length;c++)if(d.getBrowserAtIndex(c).currentURI.spec==
a.url){e=d.tabContainer.childNodes[c];break}null==e&&(e=d.addTab(a.url));b&&(d.selectedTab=e)}},windows:{getAll:function(a){a(kango.array.map(kango.browser.getBrowsers(),function(a){return new kango.BrowserWindow(a)}))},getCurrent:function(a){a(new kango.BrowserWindow(kango.chromeWindows.getMostRecentChromeWindow().gBrowser))},create:function(a){kango.chromeWindows.getMostRecentChromeWindow().open(a.url)}}});kango.BrowserWindow=function(a){this._gBrowser=a};
kango.BrowserWindow.prototype=kango.oop.extend(kango.IBrowserWindow,{_gBrowser:null,getTabs:function(a){a(kango.browser.getTabs(this._gBrowser))},getCurrentTab:function(a){for(var b=this._gBrowser.tabContainer,c=null,d=0;d<b.childNodes.length&&!(c=b.childNodes[d],c.selected);d++);a(kango.browser.getTab(c))},isActive:function(){return!0}});kango.BrowserTab=function(a,b){this._tabElem=a;this._id=b;this._proxies=[]};
kango.BrowserTab.prototype=kango.oop.extend(kango.IBrowserTab,{_tabElem:null,_id:null,_proxies:[],_getBrowserForTab:function(a){return a.linkedBrowser},_getBrowser:function(){return this._getBrowserForTab(this._tabElem)},getChromeWindow:function(){return this._getBrowser().ownerDocument.defaultView},deleteTabProxy:function(a){for(var b=0;b<this._proxies.length;b++)if(this._proxies[b].window==a)return this._proxies.splice(b,1),!0;return!1},getProxyForWindow:function(a){for(var b=0;b<this._proxies.length;b++)if(this._proxies[b].window==
a)return this._proxies[b].proxy;b=new kango.TabProxy(this);this._proxies.push({window:a,proxy:b});kango.chromeWindows.registerContainerUnloader(kango.func.bind(function(){this.deleteTabProxy(a)},this),a);return b},getId:function(){return this._id},getUrl:function(){return this.getDOMWindow().document.URL||""},getTitle:function(){return this.getDOMWindow().document.title||""},getDOMWindow:function(){return this._getBrowser().contentWindow},isActive:function(){return this._tabElem.selected},navigate:function(a){this._getBrowser().loadURI(a)},
activate:function(){var a=this.getChromeWindow();a.gBrowser.selectedTab=this._tabElem;a.focus()},dispatchMessage:function(a,b){if(0<this._proxies.length){var c={__exposedProps__:{name:"r",data:"r",origin:"r",source:"r",target:"r"},name:a,data:b,origin:"background",source:null,target:null};null!=c.data&&kango.object.isObject(c.data)&&kango.lang.makeDataExposed(c.data);kango.array.forEach(this._proxies,function(a){a.proxy.fireEvent("message",c)});return!0}return!1},close:function(){this.getChromeWindow().gBrowser.removeTab(this._tabElem)}});
kango.registerModule(kango.getDefaultModuleRegistrar("browser",kango.Browser));
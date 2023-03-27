
/*
 * version 1.5.1
 --------------------------------------------------------------------
	core.DataSet Update 0.2 Object 2Depth Update
	core.ui 재호출시 기존이벤트 off 추가
	core.is Update 0.3 check value 
	core.scroll.maxScroll Update
	core.animation
	core.event
	core.debug
	core.method
	core.support
	core.ui return public
	core.event jQuery 3.x 대응
	core.scroll IOS 관련 수정
	
 --------------------------------------------------------------------
 * author HYUN
 */
 
(function (context, $, undefined) {
	"use strict";

	var APP_NAME = context.APP_NAME = "dev";
	var core = context[ APP_NAME ] || (context[ APP_NAME ] = {});

	core.$win = $(context);
	core.$doc = $(document);
	core.$html = $(document.documentElement);
	core.$html.addClass("js");
    ("ontouchstart" in context) && core.$html.addClass("touch");
    ("orientation" in context) && core.$html.addClass("mobile");
	
	/*	@@ core.is
	 *	Array
	 *	Object
	 *	Number
	 *	Empty
	 */
	core.is = {
		Array: function(v){
			return Array.isArray(v);
		},
		Object: function(v){
			return v.constructor === Object;
			//return (typeof v === "object" || typeof v === 'function') && (v !== null);
		},
		Number: function(v){
			return v.constructor === Number;
		},
		Empty: function(v){
			return ( v == "" || v == null || v == undefined || ( v != null && typeof v == "object" && !Object.keys(v).length ) ) ? true : false;
		},
		Function: function(v){
			return v.constructor === Function;
		},
		True: function(v){
			return v === true;
		},
		False: function(v){
			return v === false;
		}
	}
	
	core.support = {
		multiple : 'multiple' in document.createElement('input'),
		fileReader : (window.File && window.FileReader && window.FileList && window.Blob) ? true : false,
		touch: 'ontouchstart' in document.documentElement
	}
	
	/*	@@ core.debug
	 *	function : init(), 
				 : log(@@Object);
				 
		core.debug.log({
			string : data
		});
	 */ 
	core.debug = (function(){
		var $el = $("<div id='debug' style='position:fixed;left:0;top:0;background-color:rgba(0,0,0,0.5);color:#fff;z-index:9999'></div>");
		
		return {
			init: function(){
				$("body").append($el);
				this.init = null
			},
			log: function( msg ){
				var Message = this._getStringMessage(msg);
				$el.html(Message);
			},
			stack: function( msg ){
				var Message = this._getStringMessage(msg);
				$el.prepend(Message);
			},
			_getStringMessage: function( msg ){
				var output = "",
					date = new Date(),
					dateMS = "["+date.getMinutes()+":"+date.getSeconds()+"]";

				if(core.is.Object(msg)){
					for(var i in msg){
						output += i +" : " + msg[i] +" / ";
					}
				}else if(core.is.Array(msg)){
					output = msg.join(", ");
				}else output = msg;
				
				return "<span><em>"+ dateMS +"</em> "+ output + "</span>";
			},
		}
	})();
	
	/*	@@ core.observer
	 *	core.observer.on(eventName@@string, handler@@function, context);
	 *	core.observer.off(eventName@@string, handler@@function, context);
	 *	core.observer.notify(eventName@@string, data);
	 */
	core.observer = {
		handlers: {},
		on: function(eventName, fn, context){
			var events = eventName.split(" ");
			for(var eIdx = 0; eIdx < events.length; eIdx++){
				var handlerArray = this.handlers[events[eIdx]];
				if(undefined === handlerArray){
					handlerArray = this.handlers[events[eIdx]] = [];
				}
				handlerArray.push({ fn: fn, context: context });
			}
		},
		off: function(eventName, fn, context){
			var handlerArray = this.handlers[eventName];
			if(undefined === handlerArray) return;
			
			for(var hIdx = 0; hIdx < handlerArray.length; hIdx++){
				var currentHandler = handlerArray[hIdx];
				if (fn === currentHandler["fn"] && context === currentHandler["context"]){
					handlerArray.splice(hIdx, 1);
				}
			}
		},
		notify: function(eventName, data){
			var handlerArray = this.handlers[eventName];
			if (undefined === handlerArray) return;

			for (var hIdx = 0; hIdx < handlerArray.length; hIdx++){
				var currentHandler = handlerArray[hIdx];
				currentHandler["fn"].call(currentHandler["context"], {type:eventName, data: data});
			}
		}
	};
	
	core.browser = (function(){
		var detect = {},
			win = context,
			na = win.navigator,
			ua = na.userAgent,
			lua = ua.toLowerCase(),
			match;
		
		detect.isMobile = typeof orientation !== "undefined";
		detect.isRetina = "devicePixelRatio" in window && window.devicePixelRatio > 1;
		detect.isAndroid = lua.indexOf("android") !== -1;
		detect.isOpera = win.opera && win.opera.buildNumber;
		detect.isWebKit = /WebKit/.test(ua);
		detect.isTouch = !!("ontouchstart" in window);

		match = /(msie) ([\w.]+)/.exec(lua) || /(trident)(?:.*rv.?([\w.]+))?/.exec(lua) || ["",null,-1];
		detect.isIE = !detect.isWebKit && !detect.isOpera && match[1] !== null;		//(/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
		detect.isIE6 = detect.isIE && /MSIE [56]/i.test(ua);
		detect.isIE7 = detect.isIE && /MSIE [567]/i.test(ua);
		detect.isOldIE = detect.isIE && /MSIE [5678]/i.test(ua);
		detect.ieVersion = parseInt(match[2], 10);		// 사용법: if (browser.isIE && browser.version > 8) { // 9이상인 ie브라우저

		detect.isWin = (na.appVersion.indexOf("Win")!=-1);
		detect.isMac = (ua.indexOf("Mac") !== -1);
		detect.isLinux = (na.appVersion.indexOf("Linux")!=-1);

		detect.isChrome = (ua.indexOf("Chrome") !== -1);
		detect.isGecko = (ua.indexOf("Firefox") !==-1);
		detect.isAir = ((/adobeair/i).test(ua));
		detect.isIOS = /(iPad|iPhone)/.test(ua);
		detect.isSafari = !detect.isChrome && (/Safari/).test(ua);
		detect.isIETri4 = (detect.isIE && ua.indexOf("Trident/4.0") !== -1);

		detect.msPointer = na.msPointerEnabled && na.msMaxTouchPoints && !win.PointerEvent;
		detect.pointer = (win.PointerEvent && na.pointerEnabled && na.maxTouchPoints) || detect.msPointer;

		detect.isNotSupporte3DTransform = /android 2/i.test(lua);
		detect.isGingerbread = /android 2.3/i.test(lua);
		detect.isIcecreamsandwith = /android 4.0/i.test(lua);
		detect.hash = window.location.hash;

		if(detect.isAndroid) {
			detect.androidVersion = (function(match){ if(match){ return match[1]|0; } else { return 0; } })(lua.match(/android ([\w.]+)/));
		} else if(detect.isIOS) {
			detect.iosVersion = (function(match){ if(match){ return match[1]|0; } else { return 0; } })(ua.match(/OS ([[0-9]+)/));
		}
		return detect;
	})();
	
	/*	@@ core.event
	 *	core.observer.notify("READY");
	 *	core.observer.notify("LOAD");
	 *	core.observer.notify("SCROLL);
	 *	core.observer.notify("RESIZE");
	 *	core.observer.notify("WHEEL_DOWN", "WHEEL_UP");
	 *	core.observer.notify("LOAD");
	 */
	 
	core.event = (function(){
		var evt = {
			init: function(){
				var Event = {
					screen: "scroll resize orientationchange",
					wheel: "wheel"
				}
				core.$doc.ready(this.ready); // jquery 3.x 대응
				core.$win.on('load', this.load);
				core.$win.on(Event.screen, this.screen);
				core.$win.on(Event.wheel, this.wheel);
			},
			ready: function(){
				core.$body = $("body");
				core.observer.notify("READY");
				core.observer.notify("SCROLL", false);
				core.observer.notify("RESIZE", false);
				
				evt.initUI();
			},
			load: function(){
				core.$body = $("body");
				core.observer.notify("LOAD");
			},
			screen: function(e){
				var e = (e.type).toUpperCase();
				core.observer.notify(e);
			},
			wheel: function(e){
				var delta = (e.originalEvent.deltaY < 0) ? 100 : -100;
				if(delta > 0){
					core.observer.notify("WHEEL_UP", {dir:-1});
				}else{
					core.observer.notify("WHEEL_DOWN", {dir:1});
				}

				if(core.browser.ieScrollBug){
					e.preventDefault();
					var left = context.pageXOffset;
					var top = context.pageYOffset - delta;
					
					context.scrollTo(left, top);
				}
			},
			initUI: function(){
				var ui = core.ui,
					ins = document.body._ui || {};
				
				for(var name in ui){
					if(ui[name].init && !ins[name]){
						ui[name].init();
						ins[name] = true;
					}
				}
				document.body._ui = ins;
			}
		}
		evt.init();
	})();
	
	/*	@@ core.screen
	 *	return { width, height, scrollTop}
	 *	callBack
	 *		$(window).ready(){}	core.observer.notify("READY");
	 *		$(window).load(){}		core.observer.notify("LOAD");
	 *		$(window).scroll(){}	core.observer.notify("SCROLL");
	 *		$(window).resize(){}	core.observer.notify("RESIZE");
	 */
	core.screen = (function(){
		var me = {
			data : {
				width : context.innerWidth,
				height : context.innerHeight,
				scrollTop : core.$win.scrollTop()
			},
			init: function(){
				if(context.orientation > 0){
					core.$html.addClass("landscape");
				}else{
					core.$html.removeClass("landscape");
				}
				core.observer.on("READY LOAD RESIZE", $.proxy(this.detect.all, this.detect));
				core.observer.on("SCROLL", this.detect.scroll);
				core.observer.on("ORIENTATIONCHANGE", this.detect.orientation);
			},
			detect: {
				all: function(){
					this.size();
					this.scroll();
				},
				size: function(){
					me.data.width = context.innerWidth;
					me.data.height = context.innerHeight;
				},
				scroll: function(){
					me.data.scrollTop = core.$win.scrollTop();
				},
				orientation: function(){
					if(context.orientation > 0){
						core.$html.addClass("landscape");
					}else{
						core.$html.removeClass("landscape");
					}
				}
			},
		}
		me.init();
		return me.data;
	})();
	
	/*	@@ core.scroll
	 *	event : SCROLL, SCROLL_DOWN, SCROLL_UP, SCROLL_FIRST, SCROLL_LAST
	 *	public : enable(), disable(), to(direction[string(first, last) || number], duration) 
	 */
	core.scroll = (function(){
		var me = {
			originTop : core.screen.scrollTop,
			init: function(){
				core.observer.on("SCROLL", this._scroll);
			},
			_scroll: function(){
				core.screen.scrollTop = core.$win.scrollTop();
				core.screen.scrollMax = me.calc.MaxScroll();
				core.screen.scrollPer = me.calc.Percent();
				
				if(core.screen.scrollTop < me.originTop) core.observer.notify("SCROLL_UP");
				if(core.screen.scrollTop > me.originTop) core.observer.notify("SCROLL_DOWN");
				
				if(core.screen.scrollTop < 1) core.observer.notify("SCROLL_FIRST");
				if(core.screen.scrollTop > core.screen.scrollMax-1) core.observer.notify("SCROLL_LAST");
				
				me.originTop = core.screen.scrollTop;
			},
			calc : {
				MaxScroll: function(){
					return document.documentElement.scrollHeight - core.screen.height;
				},
				Percent: function(){
					return parseInt(core.screen.scrollTop/core.screen.scrollMax * 100);
				},
				Direction: function(dir){
					switch(dir){
						case "first" : return 0;
						case "last" : return me.calc.MaxScroll();
						default : return dir;
					}
				},
				Duration: function(dur){
					return dur !== undefined ? dur : 700;
				}
			},
			public: {
				enable: function(){
					core.$body.css("overflow", "");
				},
				disable: function(){
					core.$body.css("overflow","hidden");
				},
				to: function(direction, duration, fn){
					if(me.isScroll) return;
					me.isScroll = true;
					
					var arg = arguments,
						argLast = arg[arg.length-1],
						dir = me.calc.Direction(direction),
						dur = me.calc.Duration(duration);
					
					if(core.screen.scrollTop == dir) return me.isScroll = false;
					
					$("html, body").stop().animate({
						"scrollTop" : dir
					}, dur, function(){ 
						me.isScroll = false;
						if(core.is.Function(argLast)) argLast();
					});
				},
				toElem: function(el, dur){
					var $el = $(el);
					var pos = $el.offset().top;
					var $scrollParent = core.methods.ScrollParent($el);
					this.to(pos, dur);
					
					$scrollParent.stop().animate({
						scrollTop: pos,
					}, dur)
				},
				ieScrollBug: function(e){
					core.browser.ieScrollBug = true;
				}
			}
		}
		me.init();
		return me.public;
	})();
	
	/*	core.ui
	 *	@param {String} name
	 *	@param {String} selector
	 *	@paran {Object} option
	 
	 *	ui(name, selector);
	 *	return ui.events.public
	 */
	core.ui = function(name, container, option){
		if(!core.ui[name]) throw new Error("not ui "+name);
		var $container = $(container).filter(function(){
				return this.parentElement.nodeName !== "PRE";
			}),
			length = 0,
			supr = [];

		$container.each(function(){
			this._ui = this._ui || {};

			var	hasUI = this._ui[name];
			if(hasUI){
				//이미 UI 구성됐을경우 새로 선언한 변수에 기존에 있는 public 담아줌
				console.dir('already created UI : '+name);
				supr.push(hasUI);
			}else{
				var UI = new core.ui[name](this, option);
				UI.events._init();
				this._ui[name] = UI.events.public || "undefined public";
				supr.push(this._ui[name]);
			}
			++length;
		});

		if(length == 1) supr = supr[0];
		return supr;

		/*
		var $container = $(container),
			$containerFilter = $container.filter(function(){
				this._ui = this._ui || {};
				var isSyntaxhighlighter = this.parentElement.nodeName !== "PRE";
				var isUI = this._ui[name] == undefined;

				return (isSyntaxhighlighter || isUI);
			});
		var len = $containerFilter.length;
		if(len < 1) return false;
		
		var supr = [];
		$container.each(function(){
			var UI = new core.ui[name](this, option);
			UI.events._init();
			this._ui[name] = UI.events.public;
			supr.push(this._ui[name]);
		});
		if(len == 1) supr = supr[0];
		return supr;*/
	}
	
	/*	@@core.Selector
	 *	var selector = core.Selector(".layuer",{
			body : ".body",
			close : ".btn_close"
		});
		selector.$container = $(".layuer");
		selector.$body = $(".layer").find(".body");
		selector.$close = $(".layer").find(".btn_close");
	 */
	core.Selector = function(container, selector){
		function modeling(){
			for(var i in selector){
				selectors[i] = selectors.container.find(selector[i]);
			}
		}
		var selectors = { container : $(container) };
		modeling();
		
		selectors._dataSet = selectors.container.data();
		selectors.reInit = function(){
			modeling();
		}
		return selectors;
	}
	
	core.DataSet = function(dataSet, opts){
		function modeling(){
			for(var key in dataSet){
				if(dataSet[key].constructor === Object) {
					opts[key] = opts[key] || {};
					for(var i in dataSet[key]){
						opts[key][i] = dataSet[key][i];
					}
				}else{
					opts[key] = dataSet[key];
				}
			}
		}
		modeling();
		opts.reInit = function(){
			modeling();
		}
		return opts;
	}
	
	core.Data = function(_data, _orgData){
		var options = _data || _orgData,
			data = {};
		
		Object.keys(_orgData).map(function(key, index){
			data[key] = options[key] || _orgData[key];
		});
		
		return data;
	}

	// 2010-10-23 EZP-1289
	core.methods = {
		object2Array: function( value ){
			var arr = [];
			for(var i in value){
				arr.push(value[i])
			}
			return arr;
		},
		MinNumber: function(arr){
			arr = this.object2Array(arr);
			arr = arr.sort(function(a, b){
				return a-b;
			});
			return arr[0];
		},
		MaxNumber: function(arr){
			arr = this.object2Array(arr);
			arr = arr.sort(function(a, b){
				return b-a;
			});
			return arr[0];
		},
		Random: function(max, min){
			return Math.floor(Math.random() * max) + min;
		},
		RandomExceptValue: function(array, value){
			var max = array.length;
			var ran = core.methods.Random(max, 0);
			return array[ran] !== value
			? ran
			: max > 1 
				? core.methods.RandomExceptValue(array, value) 
				: ran;
		},
		RandomExceptIndex: function(array, idx){
			var max = array.length;
			var ran = core.methods.Random(max, 0);
			return array[ran] !== array[idx]
			? ran
			: max > 1 
				? core.methods.RandomExceptIndex(array, idx) 
				: ran;
		},
		Shuffle: function(array){
			var limit = array.length;
			var arr = array.slice();
			
			while(limit > 0){
				arr.length = limit;
				var randomIndex = core.methods.RandomExceptIndex(arr, --limit);
				//var randomIndex = core.methods.RandomExceptValue(arr, array[--limit]);
					
				var tempValue = array[limit];
				array[limit] = array[randomIndex];
				array[randomIndex] = tempValue;
			}
			return array;
		},
		Clone: function(value){
			return JSON.parse(JSON.stringify(value));
		},
		ScrollParent: function($el){
			var $parents = $el.parents().not('html, body'),
				scrollParent = [];
				
			$parents.each(function(i){
				var hasScroll = this.scrollHeight > this.clientHeight
				|| $(this).css('overflow').indexOf('scroll') > -1;
				
				scrollParent[i] = hasScroll ? $(this) : $('html, body');
			});
			
			return scrollParent[0];
		}
	}
})(this, jQuery);
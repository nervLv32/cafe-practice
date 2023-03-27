
/*
 * version 0.5
 --------------------------------------------------------------------
    * v0.2
    core.DataSet Update 0.2 Object 2Depth Update

    * v0.21
    core.ui 재호출시 기존이벤트 off 추가

    * v0.3
    core.is Update 0.3 check value

    * v0.4
    core.scroll.maxScroll Update

    * v0.5
    core.event

 --------------------------------------------------------------------
 * author HYUN
 */

(function (context, $, undefined) {
    "use strict";

    var APP_NAME = context.APP_NAME = "dev";
    var core = context[APP_NAME] || (context[APP_NAME] = {});

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
        Array: function (v) {
            return Array.isArray(v);
            //return value.constructor === Array;
        },
        Object: function (v) {
            return v.constructor === Object;
        },
        Number: function (v) {
            return v.constructor === Number;
        },
        Empty: function (v) {
            return (v == "" || v == null || v == undefined || (v != null && typeof v == "object" && !Object.keys(v).length)) ? true : false;
        },
        Function: function (v) {
            return v.constructor === Function;
        },
        True: function (v) {
            return v === true;
        },
        False: function (v) {
            return v === false;
        }
    }

    /*	@@ core.debug
     *	function : init(),
                 : log(@@Object);

        core.debug.log({
            string : data
        });
     */
    core.debug = (function () {
        var $el = $("<div id='debug' style='position:fixed;left:0;top:0;background-color:rgba(0,0,0,0.5);color:#fff;z-index:9999'></div>");
        return {
            init: function () {
                $("body").append($el);
                this.init = null
            },
            log: function (msg) {
                var output = "";
                if (core.is.Object(msg)) {
                    for (var i in msg) {
                        output += i + " : " + msg[i] + " / ";
                    }
                } else if (core.is.Array(msg)) {
                    output = msg.join(", ");
                } else output = msg;

                $el.text(output);
            },
            clear: function () {
                $el.text("");
            }
        }
    })();

    /*	@@ core.observer
     *	core.observer.on(eventName@@string, handler@@function, context);
     *	core.observer.off(eventName@@string, handler@@function, context);
     *	core.observer.notify(eventName@@string, data);
     */
    core.observer = {
        handlers: {},
        on: function (eventName, fn, context) {
            var events = eventName.split(" ");
            for (var eIdx = 0; eIdx < events.length; eIdx++) {
                var handlerArray = this.handlers[events[eIdx]];
                if (undefined === handlerArray) {
                    handlerArray = this.handlers[events[eIdx]] = [];
                }
                handlerArray.push({ fn: fn, context: context });
            }
        },
        off: function (eventName, fn, context) {
            var handlerArray = this.handlers[eventName];
            if (undefined === handlerArray) return;

            for (var hIdx = 0; hIdx < handlerArray.length; hIdx++) {
                var currentHandler = handlerArray[hIdx];
                if (fn === currentHandler["fn"] && context === currentHandler["context"]) {
                    handlerArray.splice(hIdx, 1);
                }
            }
        },
        notify: function (eventName, data) {
            var handlerArray = this.handlers[eventName];
            if (undefined === handlerArray) return;

            for (var hIdx = 0; hIdx < handlerArray.length; hIdx++) {
                var currentHandler = handlerArray[hIdx];
                currentHandler["fn"].call(currentHandler["context"], { type: eventName, data: data });
            }
        }
    };

    core.browser = (function () {
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

        match = /(msie) ([\w.]+)/.exec(lua) || /(trident)(?:.*rv.?([\w.]+))?/.exec(lua) || ["", null, -1];
        detect.isIE = !detect.isWebKit && !detect.isOpera && match[1] !== null;		//(/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
        detect.isIE6 = detect.isIE && /MSIE [56]/i.test(ua);
        detect.isIE7 = detect.isIE && /MSIE [567]/i.test(ua);
        detect.isOldIE = detect.isIE && /MSIE [5678]/i.test(ua);
        detect.ieVersion = parseInt(match[2], 10);		// 사용법: if (browser.isIE && browser.version > 8) { // 9이상인 ie브라우저

        detect.isWin = (na.appVersion.indexOf("Win") != -1);
        detect.isMac = (ua.indexOf("Mac") !== -1);
        detect.isLinux = (na.appVersion.indexOf("Linux") != -1);

        detect.isChrome = (ua.indexOf("Chrome") !== -1);
        detect.isGecko = (ua.indexOf("Firefox") !== -1);
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

        if (detect.isAndroid) {
            detect.androidVersion = (function (match) { if (match) { return match[1] | 0; } else { return 0; } })(lua.match(/android ([\w.]+)/));
        } else if (detect.isIOS) {
            detect.iosVersion = (function (match) { if (match) { return match[1] | 0; } else { return 0; } })(ua.match(/OS ([[0-9]+)/));
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

    core.event = (function () {
        var _ = {
            init: function () {
                var Event = {
                    screen: "load scroll resize orientationchange",
                    wheel: "wheel"
                }
                core.$doc.ready(this.ready);
                core.$win.on(Event.screen, this.screen);
                core.$win.on(Event.wheel, this.wheel);
            },
            ready: function () {
                core.$body = $("body");
                core.observer.notify("READY");
                core.observer.notify("SCROLL", false);
                core.observer.notify("RESIZE", false);
            },
            screen: function (e) {
                var e = (e.type).toUpperCase();
                core.observer.notify(e);
            },
            wheel: function (e) {
                var delta = (e.originalEvent.deltaY < 0) ? 100 : -100;
                if (delta > 0) {
                    core.observer.notify("WHEEL_UP", { dir: -1 });
                } else {
                    core.observer.notify("WHEEL_DOWN", { dir: 1 });
                }
            }
        }
        _.init();
        return {
            IEscrollBug: function () {
                if (core.browser.isIE) {
                    e.preventDefault();
                    var top = context.pageYOffset - delta;
                    context.scrollTo(0, top);
                }
            }
        }
    })();

    /*	@@ core.screen
     *	return { width, height, scrollTop}
     *	callBack
     *		$(window).ready(){}	core.observer.notify("READY");
     *		$(window).load(){}		core.observer.notify("LOAD");
     *		$(window).scroll(){}	core.observer.notify("SCROLL");
     *		$(window).resize(){}	core.observer.notify("RESIZE");
     */
    core.screen = (function () {
        var me = {
            data: {
                width: context.innerWidth,
                height: context.innerHeight,
                scrollTop: core.$html[0].scrollTop
            },
            init: function () {
                if (context.orientation > 0) {
                    core.$html.addClass("landscape");
                } else {
                    core.$html.removeClass("landscape");
                }
                core.observer.on("READY LOAD RESIZE", $.proxy(this.detect.all, this.detect));
                core.observer.on("SCROLL", this.detect.scroll);
                core.observer.on("ORIENTATIONCHANGE", this.detect.orientation);
            },
            detect: {
                all: function () {
                    this.size();
                    this.scroll();
                },
                size: function () {
                    me.data.width = context.innerWidth;
                    me.data.height = context.innerHeight;
                },
                scroll: function () {
                    me.data.scrollTop = core.$html[0].scrollTop;
                },
                orientation: function () {
                    if (context.orientation > 0) {
                        core.$html.addClass("landscape");
                    } else {
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
    core.scroll = (function () {
        var me = {
            originTop: core.screen.scrollTop,
            init: function () {
                core.observer.on("SCROLL", this._scroll);
            },
            _scroll: function () {
                core.screen.scrollTop = core.$html[0].scrollTop;
                core.screen.scrollMax = me.calc.MaxScroll();
                core.screen.scrollPer = me.calc.Percent();

                if (core.screen.scrollTop > me.originTop) core.observer.notify("SCROLL_DOWN");
                else core.observer.notify("SCROLL_UP");

                if (core.screen.scrollTop < 1) core.observer.notify("SCROLL_FIRST");
                if (core.screen.scrollTop > core.screen.scrollMax - 1) core.observer.notify("SCROLL_LAST");

                me.originTop = core.screen.scrollTop;
            },
            calc: {
                MaxScroll: function () {
                    return document.documentElement.scrollHeight - core.screen.height;
                },
                Percent: function () {
                    return parseInt(core.screen.scrollTop / core.screen.scrollMax * 100);
                },
                Direction: function (dir) {
                    switch (dir) {
                        case "first": return 0;
                            break;
                        case "last": return me.calc.MaxScroll();
                            break;
                        default: return dir;
                            break;
                    }
                },
                Duration: function (dur) {
                    return dur !== undefined ? dur : 700;
                }
            },
            public: {
                enable: function () {
                    core.$body.css("overflow", "");
                },
                disable: function () {
                    core.$body.css("overflow", "hidden");
                },
                to: function (direction, duration, fn) {
                    if (me.isScroll) return;
                    me.isScroll = true;

                    var arg = arguments,
                        argLast = arg[arg.length - 1],
                        dir = me.calc.Direction(direction),
                        dur = me.calc.Duration(duration);

                    if (core.screen.scrollTop == dir) return me.isScroll = false;

                    core.$html.stop().animate({
                        "scrollTop": dir
                    }, dur, function () {
                        me.isScroll = false;
                        if (core.is.Function(argLast)) argLast();
                    });
                },
                toElem: function (el) {
                    var pos = $(el).offset().top;
                    this.to(pos);
                }
            }
        }
        me.init();
        return me.public;
    })();

    /*	core.ui
     *	@param {String} name
     *	@param {String} selector

     *	ui(name, selector);
     */
    core.ui = function (name, container, option) {
        if (!core.ui[name]) throw new Error("not ui " + name);

        var $container = $(container),
            len = $container.length;
        if (len < 1) return false;

        var supr = [];
        $container.each(function (idx) {
            var $me = $(this);
            this.ui = this.ui || {};
            if ($me.parent("pre").length > 0 || this.ui[name]) return;	//syntaxhighlighter exception
            this.ui[name] = true;

            supr[idx] = new core.ui[name](this, option);
            if (supr[idx].events) supr[idx].events._init();
            //supr[idx] = supr[idx].events.public;

            /* var nUI = new core.ui[name](this);
            supr.push(nUI);
            if(nUI.events) nUI.events._init(); */
        });
        if (len == 1) supr = supr[0];
        return supr;
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
    core.Selector = function (container, selector) {
        function modeling() {
            for (var i in selector) {
                selectors[i] = selectors.container.find(selector[i]);
            }
        }
        var selectors = { container: $(container) };
        modeling();

        selectors._dataSet = selectors.container.data();
        selectors.reInit = function () {
            modeling();
        }
        return selectors;
    }

    core.DataSet = function (dataSet, opts) {
        function modeling() {
            for (var key in dataSet) {
                if (core.is.Object(dataSet[key])) {
                    opts[key] = opts[key] || {};
                    for (var i in dataSet[key]) {
                        opts[key][i] = dataSet[key][i];
                    }
                } else {
                    opts[key] = dataSet[key];
                }
            }
        }
        modeling();
        opts.reInit = function () {
            modeling();
        }
        return opts;
    }

    core.animation = {
        eventPointer: function ($el) {
            var pos = $el.offset();
            pos.width = $el.width() / 2;
            pos.height = $el.height() / 2;

            var $pointer = $("<span class='btn_animation'></span>");
            $pointer.css({
                "left": pos.left + pos.width - 15,
                "top": pos.top + pos.height - 15,
            })

            core.$body.append($pointer);
            TweenMax.to($pointer, .5, {
                scale: 3, opacity: 0,
                onComplete: function () {
                    $pointer.remove();
                }
            });
        },
        click: function ($el) {
            this.eventPointer($el);
            $el.trigger("click");
        },
        mouseenter: function () {

        },
        mouseleave: function () {

        },
        flicking: function () {

        },
        Timeline: function (tl) {
            var timeline = new TimelineMax();
            var len = tl.length;
            for (var i = 0; i < len; i++) {
                timeline.add(tl[i].fn, tl[i].dur);
            }
            /*
            flow: [
                {
                    dur: 1,
                    fn: function(){
                        core.animation.click($$.prev);
                    }
                },
                {
                    dur: '+=1',
                    fn: function(){
                        core.animation.click($$.next);
                    }
                },
            ]
            */
        }
    }

    core.methods = {
        object2Array: function (value) {
            var arr = [];
            for (var i in value) {
                arr.push(value[i])
            }
            return arr;
        },
        getMinNumber: function (arr) {
            arr = this.object2Array(arr);
            arr = arr.sort(function (a, b) {
                return a - b;
            });
            return arr[0];
        },
        getMaxNumber: function (arr) {
            arr = this.object2Array(arr);
            arr = arr.sort(function (a, b) {
                return b - a;
            });
            return arr[0];
        },
    }
})(this, jQuery);


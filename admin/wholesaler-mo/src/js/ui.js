
/*
 * ui
 * create Rule

	ui.name|String| = function(){

	}
 */

(function($, core, ui, undefined){
	"use strict";

	/*
	@@ ui.LOAD_MANAGER

	$(".result").load(url, function(){
		$("body").trigger("AJAX_LOAD", this);
	})
	 */
	ui.LOAD_MANAGER = function(){
		var $$ = core.Selector(arguments[0], {

		});

		this.events = {
			_init: function(){
					this._createHTML();
					this._bind();
					if($$.container.hasClass("load")) $$.load.show();
			},
			_bind: function(){
					core.observer.on("LOAD", this._hideLoad);
					$$.container.on("BEFORE_LOAD", $.proxy(this._showLoad, this));
					$$.container.on("AJAX_LOAD", $.proxy(this._ajaxLoad, this));
					$$.container.on("AFTER_LOAD", $.proxy(this._hideLoad, this));
			},
			_createHTML : function(){
					$$.load = $("<div class='ui-load' style='display:none'><img src='/img/common/loading.svg'/></div>");
					$$.container.append($$.load);
			},
			_ajaxLoad: function(event, el){
					var $img = $(el).find("img[src!='']"),
							imgLoaded = 0,
							imgLength = $img.length;

					$img.on("load error", $.proxy(function(){
							imgLoaded++;
							if(imgLoaded == imgLength) this._hideLoad();
					}, this));
			},
			_showLoad: function(){
					$$.load.show();
			},
			_hideLoad: function(){
					$$.load.hide();
			}
		}
	}

	ui.PIE_CHART = function(){
		var $$ = core.Selector(arguments[0], {
			svg : "svg",
			sector : ".sector",
			per : ".per em",
			circle : "circle",
			slice: ".slice",
			valueItem: ".value li:not('.calc')"
		});
		var methods = {
			GetRadiusPI: function(r, slice){
				var pi = 2 * Math.PI * r,
					_pi = pi - (pi * slice/360);
				return _pi;
			},
			GetDashOffset: function( n, rPI ){
				return opts.dasharray - rPI*n/100;
			}
		}
		var opts = {
			play: $$._dataSet.play || false,
			rad: parseInt($$.circle.attr("r")),
			slice: $$._dataSet.slice || 0,
			num: $$.sector.toArray().map(function(el){
				return el.textContent;
			}),
			value: $$._dataSet.value || false,
			point: $$._dataSet.point || false,
			position: $$._dataSet.position || 0,
		};
		opts.dasharray = 2 * Math.PI * opts.rad;
		opts.pi = methods.GetRadiusPI(opts.rad, opts.slice);
		opts.deg = (opts.position - 3) * 30 + (opts.slice / 2);
		opts.rotateDeg = opts.pi / opts.dasharray * 3.6;
		opts.pointDeg = [0];
		opts.duration = opts.num.map(function(v, i){
			opts.pointDeg.push(opts.pointDeg[i] + opts.num[i] * opts.rotateDeg);
			return v * 20;
		});
		opts.delay = opts.duration.reduce(function(pV, cV, i, arr){
			var d = (i !== 0) ? pV[i-1] + arr[i-1] : 0;
			pV.push(d);
			return pV;
		}, []);



		this.events = {
			_init: function(){
				if(opts.point) this._createPoint();
				this._set();
				if(opts.play) this.animation._all();

				$$.container.on("PLAY", $.proxy(this.animation._all, this.animation));
				$$.container.on("RESET", $.proxy(this._reset, this));
			},
			_reset: function(){
				$$.sector.css("stroke-dashoffset", opts.pi+"%");
			},
			_createValue: function(){
				var $el = $("<div class='value'></div>");

				$$.sector.each(function( i ){
					$el.append("<div><strong>"+ opts.value[i].label +"</strong></div>");
				});

				$$.container.append($el);
			},
			_createPoint: function(){
				var $el = $("<div class='point'></div>");
				$el.css("transform", "rotate(" + opts.deg + "deg)");
				$$.sector.each(function( i ){
					$el.append("<span style='transform:rotate(" +opts.pointDeg[i]+ "deg)'>");
				});
				$$.point = $el.find("span");
				$$.container.append($el);
			},
			_set: function(){
				if(core.browser.isIE) $$.container.addClass("ie");
				$$.svg.css("transform", "rotate(" + opts.deg + "deg)");
				$$.circle.css("stroke-dasharray", opts.dasharray+"%");
				$$.sector.css("stroke-dashoffset", opts.dasharray+"%");
				$$.slice.css({
					"stroke-dasharray": opts.dasharray+"%",
					"stroke-dashoffset" : -opts.pi+"%"
				});

				$$.sector.each(function(i){
					this.setAttributeNS(null, "transform", "rotate("+opts.pointDeg[i]+" 50 50)");
				});
			},
			animation: {
				_all: function(){
					this._sector();
					if(opts.value) this._value();
					if(opts.point) this._point();
				},
				_sector: function(){
					$$.sector.each(function(i){
						var offset = methods.GetDashOffset(opts.num[i], opts.pi);
						$(this).delay(opts.delay[i]).animate({
							"stroke-dashoffset" : offset+"%"
						}, {
							easing: "linear",
							duration: opts.duration[i]
						});
					});
				},
				_value: function(){
					$$.valueItem.each(function(i){
						var $me = $(this),
							$em = $me.find("em"),
							num = $em.text();
						$em.text("0");

						var $calc = $$.valueItem.siblings(".calc").find("em");;
						var calcText = $calc.text();

						$me.delay(opts.delay[i]).animate({
							num :num
						},{
							easing: "linear",
							duration: opts.duration[i],
							step: function(n){
								var n = parseInt(n);
								$calc.text(calcText-n);
								$em.text(n);
							}
						});
					});
				},
				_point: function(i){
					$$.point.each(function(i){
						var $me = $(this);
						$me.delay(opts.delay[i]).animate({
							deg :opts.pointDeg[i+1]
						}, {
							easing: "linear",
							duration: opts.duration[i],
							start: function(){
								$me.show();
								arguments[0].tweens[0].start = opts.pointDeg[i]
							},
							step: function(now, fx){
								$me.css("transform", "rotate("+ now +"deg)");
							}
						});
					});
				}
			},
		}
	}

	ui.SELECT = function(){
		var $$ = core.Selector(arguments[0], {
			anchor : ">button",
			group : ">ul",
			item : ">ul >li",
			itemAll: ">ul >li.all"
		});

		var opts = core.DataSet($$._dataSet, {
			selectIdx : 0,
			length: $$.item.length,
			limit : 1,
			type : "default",
			selectItems : [],
			anchorMsg: $$.anchor.text(),
			disabled: false,
			scroll: $$.item.length,
		});

		this.events = {
			_init: function(){
				if(opts.disabled || $$.container.hasClass("disabled")) return;
				this._set();

				core.$doc.on("click", $.proxy(this._escapeSelect, this));
				$$.container.on("click", ">button", $.proxy(this._accessSelect, this));
				$$.container.on("click", ">ul >li:not('.all')", $.proxy(this._inputSelect, this));
				$$.container.on("click", ">ul >li.all", $.proxy(this._allSelect, this));

				$$.container.on("INIT", this._ajaxInit); //ajax data append시 이벤트 발생
				$$.container.on("SELECT", $.proxy(function(){
					var arr = [];
					for(var i=1; i<arguments.length;i++){
						arr.push(arguments[i]);
					}
					this._setSelectIndex(arr);
				}, this));
				$$.container.on("SET_SCROLL", this._setScroll);
			},
			_set: function(){
				if(opts.selectIdx !== 0) this._setSelectIndex();
				if(opts.type == "multi") this._multiSet();
				this._setScroll();
			},
			_setScroll: function(){
				if($$.item.length > opts.scroll){
					var $el = $$.item.filter(":lt("+opts.scroll+")"),
						scrollHeight = 0;

					$el.each(function(){
						scrollHeight += $(this).outerHeight();
					});
					$$.group.css({
						"height": scrollHeight,
						"overflow": "auto"
					});
				}
			},
			_setSelectIndex: function( idx ){
				var arrIdx = idx || opts.selectIdx;
				opts.selectItems = [];

				arrIdx.forEach(function(val, idx){
					opts.selectItems[idx] = {
						idx: val,
						text: $$.item.eq(val).text()
					};
				});

				this._outputSelect();
			},
			_multiSet: function(){
				opts.limit = $$._dataSet.limit || opts.length;
			},
			_ajaxInit: function(){
				$$.reInit();
				opts.reInit();
			},
			_inputSelect: function(e){
				var $target = $(e.currentTarget),
					sIdx = $target.index();

				switch(opts.type){
					case "default":
						opts.selectItems[0] = {idx: sIdx, text: $$.item.eq(sIdx).text()};
						this._hideGroup();
					break;
					case "multi":
						this._alreadyCheck(sIdx);
						if(opts.selectItems.length > opts.limit){
							opts.selectItems.pop();
							return alert(opts.limit+"개 까지 선택 가능합니다");
						}
					break;
				}
				this._outputSelect(e);
			},
			_allSelect: function(e){
				var is = $(e.currentTarget).hasClass("active");

				if(!is){
					var arr = [];
					for(var i=0; i < opts.length; i++){
						arr[i] = i;
					}
					this._setSelectIndex(arr);
					$$.item.filter(".all").addClass("active");
				}else{
					$$.item.removeClass("active");
					opts.selectItems = [];
					this._outputSelect();
					$$.item.filter(".all").removeClass("active");
				}
				this._hideGroup();
			},
			_alreadyCheck: function(idx){
				if($$.item.eq(idx).hasClass("active")){
					for(var i in opts.selectItems){
						if(idx == opts.selectItems[i].idx){
							opts.selectItems.splice(i, 1);
						}
					}
				}else{
					opts.selectItems.push({
						idx : idx,
						text: $$.item.eq(idx).text()
					});
				}
			},
			_outputSelect: function(evt){
				var val = [];
				$$.item.removeClass("active");
				for(var i in opts.selectItems){
					if($$.item.eq(opts.selectItems[i].idx).hasClass("all")) continue;
					$$.item.eq(opts.selectItems[i].idx).addClass("active");
					val.push(opts.selectItems[i].text);
				}
				if(!val.length) val.push(opts.anchorMsg);
				$$.anchor.text(val.join(", "));

				//SELECTED CALLBACK
				if(evt !== undefined){
					$$.container.trigger("SELECTED", [opts.selectItems]);
				}
			},
			_hideGroup: function(){
				$$.container.removeClass("active");
				$$.group.removeClass("above");
			},
			_detectPosition: function(){
				var pos_t = $$.container.offset().top,
					con_h = $$.container.outerHeight(),
					group_h = $$.group.outerHeight();

				if(pos_t + con_h + group_h >= core.screen.scrollTop + core.screen.height){
					$$.group.addClass("above");
				}else{
					$$.group.removeClass("above");
				}
			},
			_accessSelect: function(){
				this._detectPosition();
				$$.container.toggleClass("active");
			},
			_escapeSelect: function(e){
				if(!$(e.target).closest($$.container).length) this._hideGroup();
			},
		}
	}

	ui.FILEINPUT = function(){
		var $$ = core.Selector(arguments[0], {
			list: '.list',
			btn: '.btn'
		});

		var opts = core.DataSet($$._dataSet, {
			type: 'single',
			fileList : [],
			FileReader: window.FileReader
		});

		this.events = {
			_init: function(){
				$$.container.on("change", "input[type='file']", $.proxy(this._uploadFile, this));
				$$.list.on("click", "button", this._removeFile);
			},
			_uploadFile: function(e){
				var el = e.target,
					fileValue = el.value;
				if(fileValue == "") return this._cancleFile();
				var fileName = (opts.FileReader) ? el.files[0].name : fileValue.replace(/^.+\\/, "");

				if(opts.type !== "multifle"){
					$$.list.html("<div><span>"+ fileName +"</span><button type='button'>삭제</button></div>");
					opts.fileList[0] = fileValue;
				}else{
					if(String(opts.fileList).indexOf(fileValue) > -1){
						return this._cancleFile();
					}
					$$.list.append("<div><span>"+ fileName +"</span><button type='button'>삭제</button></div>");
					$$.btn.append("<label>찾아보기<input type='file'/></label>");

					opts.fileList.push(fileValue);
				}
			},
			_cancleFile: function(){
				var $lastFile = $$.btn.children().last();
				$lastFile.find("input[type='file']").val("");
				$lastFile.replaceWith( $lastFile.clone(true) );
			},
			_removeFile: function(){
				var $prt = $(this).parent(),
					idx = $prt.index();

				$prt.remove();
				if(opts.type !== 'single'){
					$$.btn.children().eq(idx).remove();
				}else{
					$$.container.find("input[type='file']").val("").empty();
				}
				opts.fileList.splice(idx, 1);
			}
		}
	}
	/* org single File
	ui.FILEINPUT = function(){
		var $$ = core.Selector(arguments[0], {
		});
		var opts = core.DataSet($$._dataSet, {
			btnTitle : "file",
		});
		var $obj;
		this.events = {
			_init: function(){
				var $file = $$.container;

				$obj = $("<div class='file-input'></div>")
				.append("<div class='file-name'><span></span></div>")
				.append("<span class='file-btn'><span></span></span>")
				.insertAfter($file);
				$obj.find(".file-btn").append($file);
				$obj.find(".file-btn").find("span").text(opts.btnTitle);

				$file.on("change", this._change);
			},
			_change:function(e){
				var file = e.target.files !== undefined ? e.target.files[0] : { name: e.target.value.replace(/^.+\\/, "") };

				if ( !file ) return;
				$obj.find( ".file-name > span" ).text(file.name);
			}
		}
	}*/

	ui.PLACEHOLDER = function(){
		var Browser = {chk : navigator.userAgent.toLowerCase()}
		var version = {ie : Browser.chk.indexOf("msie") != -1, ie6 : Browser.chk.indexOf("msie 6") != -1, ie7 : Browser.chk.indexOf("msie 7") != -1, ie8 : Browser.chk.indexOf("msie 8") != -1, ie9 : Browser.chk.indexOf("msie 9") != -1}  
		var $txtfield = $(arguments[0]);
		this.events = {
			_init: function(){
				if(version.ie9|| version.ie8 || version.ie7 || version.ie){
					  $txtfield.each(function(){
						  if( $(this).val() == ""){
							$(this).val($(this).attr("placeholder"));
						  }
					  });
					  $txtfield.on("focusin", this._focusIn);
					  $txtfield.on("focusout", this._focusOut);
				  }
			},
			_focusIn:function(){
				if( $(this).val() == $(this).attr("placeholder")){
					$(this).val("");
				}
			},
			_focusOut:function(){
				if( $(this).val() == ""){
				  $(this).val($(this).attr("placeholder"));
			    }
			}
		}
	}

	ui.TAB = function(){
		var $$ = core.Selector(arguments[0], {
			nav : "> .tab-nav li",
			btn : "> .tab-nav a",
			cont : "> .tab-content > div"
		});
		var opts = core.DataSet($$._dataSet, {
			activeIdx : null,
			duration : 400
		});

		this.events = {
			_init:function(){
				$$.btn.on("click", this._tabSelect);
				if(opts.activeIdx != null){
					$$.nav.eq(opts.activeIdx).find("a").trigger("click");
				}
			},
			_tabSelect:function(e){
				var $tar = $(e.target);
				var targetIdx = $tar.parent().index();
				$$.nav.removeClass("active");
				$tar.parent().addClass("active");
				if($$.container.hasClass("anchor")){
					core.scroll.to($$.cont.eq(targetIdx).offset().top, opts.duration);
				}else{
					$$.cont.filter(".active").hide().removeClass("active");
					$$.cont.eq(targetIdx).fadeIn().addClass("active");
				}
				if($tar.attr("href").substring(0,1) == "#"){
					e.preventDefault();
				}
			}
		}

	}

	ui.ACCORDION = function(){
		var $$ = core.Selector(arguments[0], {
			item : ">.acc-item",
			head : ".acc-head",
			cont : ".acc-cont"
		});
		var opts = core.DataSet($$._dataSet, {
			sync: false,
			activeIdx : $$.item.filter(".active").index(),
			duration : 400,
			scroll: false,
		});

		this.events = {
			_init:function(){
				$$.head.on("click", $.proxy(this._accSelect, this));
				this._set();
			},
			_set: function(){
				$$.cont.hide();
				$$.item.eq(opts.activeIdx).find(".acc-cont").show();
			},
			_accSelect:function(e){
				var $tar = $(e.target),
					$root = $tar.closest(".acc-item");

				if($root.hasClass("active")){
					$root.removeClass("active");
					$root.find(".acc-cont").slideUp(opts.duration);
				}else{
					if(opts.sync){
						$$.item.removeClass("active").find(".acc-cont").slideUp(opts.duration);
					}
					$root.addClass("active");
					$root.find(".acc-cont").slideDown(opts.duration);

					if(opts.scroll){
						var forScroll = $root.offset().top - opts.scroll;
						core.scroll.to(forScroll, 400);
					}
				}
			},
		}
	}

	ui.POPUP = function(){
		var $$ = core.Selector(arguments[0]);
		$$.popup = $($$._dataSet.target);
		$$.content = $$.popup.find(".content");
		var opts = core.DataSet($$._dataSet, {
			popup : {
				type : "layer"
			},
			overflow: true,
			resize: false,
			is: false,
		});

		this.events = {
			_init: function(){
				$$.container.on("click OPEN", $.proxy(this.open._check, this));
				$$.popup.on("click", ".btn_close", $.proxy(this._close, this));
				$$.popup.on("CLOSE", $.proxy(this._close, this));

				if(opts.resize){
					core.observer.on("RESIZE", $.proxy(function(e){
						if(e.data !== false && opts.is) this._setBodyScroll();
					}, this));
				}
			},
			open: {
				_check: function(){
					if(opts.overflow) this.scroll.disable();
					switch(opts.popup.type){
						case "layer": this.open._layer.call(this);
						break;
						case "link" : this.open._link.call(this);
						break;
						case "iframe" : this.open._iframe.call(this);
						break;
						case "window" : this.open._window();
						break;
					}
				},
				_layer: function(){
					$$.popup.addClass("on");
					this._detectSize();

					$$.focus = $$.content.find("a, button, textarea, :input, [tabindex]");
					opts.focusL = $$.focus.length;

					//$$.focus.first().off().on("keydown", {type:"first"}, this._detectFocus)
					//$$.focus.last().off().on("keydown", {type:"last"}, this._detectFocus)
					$$.content.focus();
				},
				_link: function(){
					$$.content.load(opts.popup.url, $.proxy(function(){
						this.open._layer.call(this);
					},this));
				},
				_window: function(){
					var name = (!opts.popup.name) ? "winPop" : opts.popup.name,
						left = (core.screen.width - opts.popup.w) / 2 + window.screenX,
						top = (core.screen.height - opts.popup.h) / 2 + window.screenY,
						option = "width=" + opts.popup.w + ", height=" + opts.popup.h + ", top=" + top + ", left=" + left + ", scrollbars=yes, toolbar=no, resizable=yes",
						newWin = window.open(opts.popup.url, name, option);
					if(window.focus) newWin.focus();
				}
			},
			_close: function(){
				if(opts.overflow) this.scroll.enable();
				$$.popup.removeClass("on");
				$$.popup.find(".body").css("height","auto");
				opts.is = false;
				$$.container.focus();
			},
			_detectFocus: function(e){
				var key = e.keyCode || e.which,
					type = e.data.type;

				switch(type){
					case "first" :
						if(key == 9 && e.shiftKey){
							e.preventDefault();
							$$.focus.last().focus();
						}
					break;
					case "last" :
						if(key == 9){
							e.preventDefault();
							if(e.shiftKey){
								$$.focus.eq(opts.focusL-2).focus();
								return;
							}
							$$.focus.first().focus();
						}
					break;
				}
			},
			_detectSize: function(){
				opts.is = true;
				var $img = $$.popup.find('.body').find("img"),
					length = $img.length,
					n = 0;

				if(length > 0){
					$img.load($.proxy(function(i){
						if(++n === length) this._setBodyScroll();
					}, this));
				}else{
					this._setBodyScroll();
				}
			},
			_setBodyScroll: function(){
				var $body = $$.popup.find('.body'),
					bodyH = $body[0].scrollHeight,
					headerH = $$.popup.find('.header').outerHeight(),
					footerH = $$.popup.find('.footer').outerHeight(),
					cH = headerH + bodyH + footerH,
					limitH = core.screen.height * 0.9,
					scrollH = limitH - headerH - footerH;

				if(cH >= limitH){
					$body.css('height', scrollH);
				}else{
					$body.css('height', 'auto');
				}
			},
			scroll: {
				prevent: function(e){
					var $target = $(e.target);
					if(!$target.closest(".content").length){
						return false;
					}
				},
				disable: function(){
					document.addEventListener("touchmove", this.prevent, { passive: false });
					core.scroll.disable();
				},
				enable: function(){
					document.removeEventListener("touchmove", this.prevent);
					core.scroll.enable();
				}
			},
		}
	}

	ui.SLIDE = function(){
		var $$ = core.Selector(arguments[0], {
			view: ">.view",
			navigation: ".navigation"
		});
		var opts = core.DataSet(arguments[1], {
			direction: "horizontal", // horizontal, vertical
			speed: 500,
			pager: false,
			navigation: false,
			loop: false,
			column: 1,
			columnGroup: 1,
			flicking: true,
			currentIndex: 0,
			slideMax: $$.view.children().length,
			slideMargin: 0,
			endDisabled: false,

		});

		this.events = {
			_init: function(){
				this.detect._opts.call(this);
				this._bindEvent();
			},
			detect: {
				_opts: function(){
					if(opts.direction == "vertical") this.set._vertical();
					if($$.navigation.length > 0) this.set._navigation();
					if(opts.pager == "list") this.create._pagerList();
					if(opts.pager == "number") this.create._pagerNumber();
					if(opts.loop) this.create._cloneItem.call(this);
				},
				_resize: function(){
					$$.view.scrollLeft(this.calc.CurrentIndex() * this.calc.SlideWidth());
				},
				_flicking: function(){

				}
			},
			flicking: {
				_init: function(){

				}
			},
			_bindEvent: function(){
				$$.prev.on("click", {dir: -1}, $.proxy(this.slide._detect, this));
				$$.next.on("click", {dir: +1}, $.proxy(this.slide._detect, this));
				core.observer.on("RESIZE", $.proxy(this.detect._resize, this));

				if(opts.flicking) this.flicking._init();

				this.detect._resize.call(this);
			},
			calc: {
				SlideWidth : function(){ return $$.view.width() / opts.columnGroup },
				CurrentIndex: function(){ return (!opts.loop) ? opts.currentIndex : opts.currentIndex + 1 },
				Indexing: function(){

				},
				NextIndex: function( dir ){
					var idx = opts.currentIndex + dir;
					if(!opts.loop){
						if(idx == opts.slideMax) idx = 0;
						if(idx < 0) idx = opts.slideMax-1;
						return idx;
					}else{
						if(idx > opts.slideMax+1) idx = 0;
						if(idx < 0) idx = -1;
						return idx + 1;
					}

				},
				MovePosition: function(toIndex){
					return this.SlideWidth() * toIndex;
				}
			},
			set: {
				_navigation: function(){
					$$.prev = $$.navigation.find(".prev");
					$$.next = $$.navigation.find(".next");
				},
				_vertical: function(){
					$$.container.addClass("direction-vertical");
				},
			},
			create: {
				_pagerList: function(){

				},
				_pagerNumber: function(){

				},
				_cloneItem: function(){
					$$.itemFirst = $$.view.children().first().clone().addClass("clone-last");
					$$.itemLast = $$.view.children().last().clone().addClass("clone-first");
					$$.view.prepend($$.itemLast).append($$.itemFirst);
					$$.item = $$.view.children();
					//$$.view.scrollLeft(opts.SlideWidth() * (opts.slideIndex + 1));
					//opts.currentIndex = 1;
				}
			},
			slide: {
				_detect: function(e){
					var nextIdx = this.calc.NextIndex(e.data.dir);
					/* if(opts.slideIndex !== nextIdx){
						this.slide._to(nextIdx);
					} */
					this.slide._to.call(this, nextIdx);
				},
				_to: function(idx, speed){
					if(opts.isAni) return;
					opts.isAni = true;
					var duration = (speed !== undefined) ? speed : opts.speed;

					var a = this.calc.MovePosition(idx)

					$$.view.animate({
						scrollLeft: this.calc.MovePosition(idx)
					}, duration, $.proxy(function(){
						this.callBack._slideEnd(idx);
					}, this));
				},
			},
			callBack: {
				_slideEnd: function(idx){
					opts.isAni = false;
					opts.slideIndex = idx;



					if(!opts.loop) return;
					/* if(idx > opts.slideMax){
						$$.view.scrollLeft(opts.SlideWidth() * 1);
						opts.slideIndex = 0;
					}else if(idx <= 0){
						$$.view.scrollLeft(opts.SlideWidth() * opts.slideMax);
						opts.slideIndex = opts.slideMax-1;
					} */
				}
			},
			public: {
				getIndex: function(){

				}
			}
		}
	}

	ui.PARALLAX_ANIMATION = function(){
		var $$ = core.Selector(arguments[0]);
		$$.target = (!$$._dataSet.target) ? $$.container : $$.container.find($$._dataSet.target);

		var data = [];
		$$.target.each(function(i){
			data[i] = core.DataSet($(this).data(), {
				option : {
					start : 0,
					duration: 1,
					length: $$.target.length
				},
			});
		});

		var events = this.events = {
			_init: function(){
				this._setStyle();
				core.observer.on("LOAD", this._bind);
			},
			_bind: function(){
				if(core.$body[0].mcs){
					core.observer.on("mscroll", events._detectPosition);
				}else{
					core.observer.on("LOAD SCROLL", events._detectPosition);
				}
			},
			_setStyle: function(){
				$$.target.each(function(i){
					TweenMax.set(this, data[i].animationStart);
				});
			},
			_detectPosition: function(e){
				var complete = 0;
				$$.target.each(function(i){
					var $me = $(this),
						elTop = $me.offset().top - core.screen.height + data[i].option.start;

					if(core.screen.scrollTop >= elTop){
						TweenMax.to($me, data[i].option.duration, data[i].animationEnd);
						++complete;
					}
					if(complete >= data.length) core.observer.off("SCROLL", events._detectPosition);
				});
			}
		}
	}

	ui.PARALLAX_SCROLL = function(){
		var $$ = core.Selector(arguments[0]);
		$$.prt = $$.container.closest(".ui-parallax-scroll");

		var data = core.DataSet($$._dataSet,{
			when: "enter",
		});

		var events = this.events = {
			_init: function(){
				core.observer.on("SCROLL", events._detectPosition);
			},
			_detectPosition: function(){
				var top = $$.prt.offset().top.toFixed(0) - core.screen.height,
					gap = core.screen.scrollTop - top,
					per = (gap/core.screen.height).toFixed(2);

				var calc = {};
				for(var value in data.css){
					calc[value] = data.css[value] * per;
				}
				if(per > 0 && per <= 1){
					TweenMax.set($$.container, {css: calc});
				}else if(per > 1){
					TweenMax.set($$.container, {css: data.css});
				}
			},

		}
	}

	/*
	 * AJAX + history.pushState()
	 */
	ui.PJAX = function(){
		var $wrap = $(arguments[0]),
			id = $wrap.attr("id");

		this.events = {
			_init: function(){
				core.$body.on("click", "a", $.proxy(this._click, this));
				core.$win.on("popstate", $.proxy(this._popState, this));
				this._pushState(location.href);
			},
			_click: function(e){
				this._getPage(e.currentTarget.href);
				return false;
			},
			_getPage: function(url, push){
				$.get(url, $.proxy(function(data){
					this._setPage(data);
					if(push !== false) this._pushState(url);
				}, this));
			},
			_setPage: function(data){
				var $data = $(data),
					html = $data.filter("#"+id).html(),
					title = $data.filter("title").text();

				$wrap.html(html);
				this._setTitle(title);
			},
			_setTitle: function(tit){
				document.title = tit;
			},
			_pushState: function(url){
				history.pushState({href: url}, null, url);
			},
			_popState: function(e){
				var state = e.originalEvent.state;
				this._getPage(state.href, false);
			}
		}
	}

	ui.GEOLOCATION_SORT = function(){
		var $$ = core.Selector(arguments[0], {
			select: "select",
			list: ".list",
		});

		var data = core.DataSet($$._dataSet, {
			place: "span"
		});

		this.events = {
			_init: function(){
				$$.select.on("change", $.proxy(this._select, this));
			},
			_select: function(e){
				var value = e.currentTarget.value;

				switch(value){
					case "abc" :
						this._sortABC();
					break;
					case "near" :
						this._getLocation();
					break;
				}
			},
			_getLocation: function(){
				if(navigator.geolocation){
					navigator.geolocation.getCurrentPosition(
						$.proxy(this._sortLocation, this),  //success
						$.proxy(this._errorLocation, this), //error
					{
						enableHighAccuracy: false,
						maximumAge: 0,
						timeout: Infinity
					});
				}else{
					alert("GPS를 지원하지 않습니다");
				}
			},
			_errorLocation: function(){
				alert("GPS ERROR 다시 시도해주세요");
			},
			CalcLocationDistance: function(lat1, lon1, lat2, lon2){
				var R = 6371; // Radius of the earth in km
				var dLat = this.Deg2rad(lat2-lat1);  // deg2rad below
				var dLon = this.Deg2rad(lon2-lon1);
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.Deg2rad(lat1)) * Math.cos(this.Deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var d = R * c; // Distance in km

				return d;
			},
			Deg2rad: function(deg){
				return deg * (Math.PI/180);
			},
			_sortLocation: function(position){
				var me = this,
					lat = position.coords.latitude,
					lon = position.coords.longitude,
					item = $$.list.children().get();

				item.sort(function(a, b){
					var aData = $(a).data(),
						bData = $(b).data();

					var val1 = me.CalcLocationDistance(lat, lon, aData.lat, aData.lon);
					var val2 = me.CalcLocationDistance(lat, lon, bData.lat, bData.lon);
					return (val1 > val2) ? 1 : -1;
				});
				this._appendItem(item);
			},
			_sortABC: function(){
				var item = $$.list.children().get();
				item.sort(function(a, b){
					var val1 = $(a).find(data.place).text();
					var val2 = $(b).find(data.place).text();

					return (val1 > val2) ? 1 : -1;
				});
				this._appendItem(item);
			},
			_appendItem: function( el ){
				$$.list.html(el);
			}
		}
	}

	core.observer.on("READY", function(){
		//문서상에서 실행 ui("PIE_CHART", ".ui-pieChart");
		ui("POPUP", ".ui-popup-open");
		ui("SELECT", ".ui-select");
		ui("FILEINPUT", ".input-file");
		ui("PLACEHOLDER", ":text, textarea");
		ui("TAB", ".ui-tab");
		ui("ACCORDION", ".ui-accordion");
		ui("PARALLAX_ANIMATION", ".ui-parallax-animation");
		ui("PARALLAX_SCROLL", ".ui-parallax-scroll .animate");
    	ui("LOAD_MANAGER", "body");
	});
	core.observer.on("LOAD", function(){
		ui("POPUP", ".ui-popup-open");
	});

})(jQuery, window[APP_NAME], window[APP_NAME].ui);



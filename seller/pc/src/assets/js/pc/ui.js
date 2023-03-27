
/*
 * ui
 * create Rule

	ui.name|String| = function(){

	}
 */

(function($, core, ui, undefined){
	"use strict";

	ui.PIE_CHART = function(){
		var $$ = core.Selector(arguments[0], {
			svg : "svg",
			sector : ".sector",
			shadow : ".shadow",
			per : ".per em",
			circle : "circle",
			//slice: ".slice",
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
				$$.container.on("SET_SECTOR", $.proxy(function(e, per, dur){
					opts.num = [per];
					opts.duration = [dur];

					this._sector();
				}, this.animation));
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
				$$.shadow.css("stroke-dashoffset", opts.dasharray-opts.pi+"%");

				/* CHECK: done => shadow set dashoffset
				$$.slice.css({
					"stroke-dasharray": opts.dasharray+"%",
					"stroke-dashoffset" : -opts.pi+"%"
				}); */

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
			anchorMsg: $$.anchor.html(),
			anchorType: "text",
			disabled: false,
			scroll: $$.item.length,
			variable: false
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
				if(opts.variable) this._setVariable();
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
						text: $$.item.eq(val).text(),
						html: $$.item.eq(val).html()
					};
				});

				this._outputSelect();
			},
			_setVariable: function(){
				var w = [
					$$.anchor.outerWidth(true),
					$$.group.outerWidth(true),
				];
				w.sort(function(a, b){
					return b-a;
				});

				$$.container.width(w[0]);
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
						opts.selectItems[0] = {
							idx: sIdx,
							text: $$.item.eq(sIdx).text(),
							html: $$.item.eq(sIdx).html()
						};
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
						text: $$.item.eq(idx).text(),
						html: $$.item.eq(idx).html()
					});
				}
			},
			_outputSelect: function(evt){
				var val = [];
				$$.item.removeClass("active");
				for(var i in opts.selectItems){
					var item = opts.selectItems[i];
					if($$.item.eq(item.idx).hasClass("all")) continue;
					$$.item.eq(item.idx).addClass("active");

					var output = (opts.anchorType === "text") ? item.text : item.html;
					val.push(output);
				}

				if(!val.length) val.push(opts.anchorMsg);
				$$.anchor.html(val.join(", "));

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
				if($$.container.hasClass("disabled")) return;

				this._detectPosition();
				$$.container.toggleClass("active");
			},
			_escapeSelect: function(e){
				if(!$(e.target).closest($$.container).length) this._hideGroup();
			},
		}
	}

	/*
	ui.FILEINPUT = function(){
		var $$ = core.Selector(arguments[0], {
			list: '.list',
			btn: '.btn'
		});

		var opts = core.DataSet($$._dataSet, {
			type: 'single',
			fileList : [],
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
	}*/

	ui.INPUTFILE = function(){
		var $$ = core.Selector(arguments[0], {
			list: '.list',
			btn: '.btn',
			input: '.btn input[type="file"]'
		});

		var data = core.DataSet($$._dataSet, {
			type: 'many', //'many, only'
			multiple: $$.input.prop('multiple'),
			preview: false,
			fileList : [],
			limit: null,
			files: [],
		});

		this.events = {
			_init: function(){
				$$.container.on("change", "input[type='file']", $.proxy(this._uploadFile, this));
				$$.list.on("click", ".btn-remove", this._removeFile);
			},
			_uploadFile: function(e){
				var el = e.target,
					files,
					newFileList = [],
					isRegisterFileName = [],
					startIndex = data.fileList.length;

				if(el.value.length < 1){
					return false;
				}

				if(core.support.multiple){
					files = el.files;
				}else{
					files = [
						{name: el.value.replace(/^.+\\/, "")}
					]
				}
				var	filesLength = files.length,
					totalFilesLength = filesLength + data.fileList.length;

				if(data.limit !== null && totalFilesLength > data.limit){
					return alert('사진을 더이상 등록할 수 없습니다. (최대 : '+data.limit+')');
				}

				if(data.type == "only"){
					data.fileList = [newFileList];
					$$.list.html("");
				}else{
					var inputHTML = (data.multiple) ? "<input type='file' multiple/>" : "<input type='file'/>";
					$$.btn.append("<label>찾아보기"+ inputHTML +"</label>");
					data.fileList.push(newFileList);
				}

				var $li = $("<li></li");
				$$.list.append($li);

				for(var i=0; i<filesLength; i++){
					(function(index, inst){
						var file = files[i],
							fileName = file.name,
							isRegister = String(data.fileList).indexOf(fileName) > -1;

						if(isRegister) return isRegisterFileName.push(fileName);

						var $item = $("<p></p>");
						$item.append("<strong>"+ fileName +"</strong><button type='button' class='btn-remove'>삭제</button>");
						$li.append($item);

						if(core.support.fileReader){
							var reader = new FileReader(),
								supportPreview = (data.preview && file.type.match('image')) ? true : false;

							reader.addEventListener('load', function(e){
								var result = e.target.result;

								if(supportPreview){
									var $imgContainer = $("<span class='preview-img'></span>");
									var img = document.createElement("img");
									//img.src = result;
									$imgContainer.append('<img src="'+ result +'"class="ui-popup-call img-view" data-target="#preview">');//2021-02-17 수정
									$item.prepend($imgContainer);

									// Image View Popup 2021-02-17 추가
									$(document).on("click",".img-view",function(){
										$("#preview .body img").attr("src", result);
									});
								}
							});
							reader.readAsDataURL(file);
						}

						newFileList.push(fileName);
					})(i, this);
				}

				this._detectRegisterFile(isRegisterFileName); //등록된 파일검사
			},
			_detectRegisterFile: function( fileName ){
				if(fileName.length > 0){
					var fileJoinName = fileName.join(", ");
					alert('이미 등록된 파일입니다. ('+fileJoinName+')');
				}

				$$.container.addClass('regist');
			},
			_cancleFile: function(){
				var $lastFile = $$.btn.children().last();
				$lastFile.find("input[type='file']").val("");
				$lastFile.replaceWith( $lastFile.clone(true) );
			},
			_removeFile: function(){
				var $prt = $(this).parent(),
					$group = $prt.parent(),
					groupIndex = $group.index(),
					itemIndex = $prt.index(),
					$label = $$.btn.children().eq(groupIndex),
					$input = $label.eq(groupIndex);

				$prt.remove();

				if(data.type == 'only'){
					$$.container.removeClass('regist')
					.find("input[type='file']").val("").empty();
				}else if($$.btn.children().length > 1){

					//1. groupIndex에 맞는 파일에 itemIndex삭제
					//2. date.fileList[groupIndex] 없으면 배열삭제

					//var $input = $label.eq(groupIndex).find("input");
					//$$.btn.children().eq(itemIndex).remove();

					data.fileList[groupIndex].splice(itemIndex, 1);

					if(data.fileList[groupIndex].length < 1){
						data.fileList.splice(groupIndex, 1);
						$label.remove();
						$group.remove();
					}
					if(data.fileList.length < 1){
						$$.container.removeClass('regist');
					}
				}
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



	var core = window[APP_NAME],
		ui = window[APP_NAME].ui;

	/*INPUTFILE*/
	var core = window[APP_NAME],
	ui = window[APP_NAME].ui;

ui.FILE = {
	el: '.ui-file-async',
	data: {
		stack: false,
		fileList : [],
		itemClass: '',
		backgroundImage: false,
		detail: false,
	},
	init: function(){
		$(ui.FILE.el).each(this.set);
		this.bindEvent();
	},
	set: function(){
		var i = $(ui.FILE.el).index(this),
			data = core.Data($(this).data('file'), ui.FILE.data);


		ui.FILE.data.fileList[i] = [];

		$(this).find('.list-item').each(function(){
			var imageSrc = data.backgroundImage ?
				$(this).find('.image')[0].style.backgroundImage.slice(4, -1).replace(/"/g, "") : $(this).find('.image img').attr('src');

			var srcSplit = imageSrc.split('/'),
				fileSrc = srcSplit[srcSplit.length - 1];

			ui.FILE.data.fileList[i].push(fileSrc);
		});

		ui.FILE.calcLimitNumber(i);
		$(this).trigger('update');
	},
	bindEvent: function(){
		core.$body.on('change.file', ui.FILE.el +' input[type="file"]', this.uploadFile);
		core.$body.on('click.file', ui.FILE.el +' .btn-remove', this.removeFile);
		core.$body.on('set', ui.FILE.el, this.set);
	},
	uploadFile: function(){
		var $prt = $(this).closest(ui.FILE.el),
			$listWrapper = $prt.find('.list-wrapper'),
			data = core.Data($prt.data('file'), ui.FILE.data),
			idx = $(ui.FILE.el).index($prt),
			files = core.support.multiple ?
			this.files :
			[
				{name: this.value.replace(/^.+\\/, "")}
			];

		ui.FILE.data.fileList[idx] = ui.FILE.data.fileList[idx] || [];

		if(!data.stack){
			ui.FILE.data.fileList[idx] = [];
			$listWrapper.empty();
		}
		if(data.limit < ui.FILE.data.fileList[idx].length + files.length){
			return alert('등록할 수 없습니다. (최대 : '+data.limit+')');
		}

		for(var i=0; i<files.length; i++){
			(function(index, inst){
				var $item = $("<div class='list-item " +data.itemClass+"'></div>"),
					file = files[i],
					fileName = file.name,
					isRegister = String(ui.FILE.data.fileList[idx]).indexOf(fileName) > -1;

				if(isRegister) return false;

				$item.append("<strong class='name'>"+ fileName +"</strong><button type='button' class='btn-remove'>삭제</button>");
				$listWrapper.append($item);

				if(core.support.fileReader){
					var reader = new FileReader(),
						supportPreview = file.type.match('image') ? true : false;

					reader.addEventListener('load', function(e){
						var result = e.target.result;

						if(supportPreview){
							var imgContainer = data.detail ?
								'<span class="image ui-popup-call img-view" data-target="#preview"></span>' :
								'<span class="image"></span>',
								$imgContainer = $(imgContainer);

							if(data.backgroundImage){
								$imgContainer.css('background-image', 'url('+result+')');
							}else{
								var img = document.createElement("img");
								img.src = result;

								$imgContainer.append(img);
							}

							$item.prepend($imgContainer);

							core.$body.off('click.fileDetail').on('click.fileDetail', function(){
								$("#preview .body img").attr("src", result);
							})
						}
					});
					reader.readAsDataURL(file);
				}

				ui.FILE.data.fileList[idx].push(fileName);
			})(i, this);
		}

		ui.FILE.calcLimitNumber(idx);
		$prt.addClass('regist');
	},
	removeFile: function(){
		var $item = $(this).closest('.list-item'),
			$prt = $item.closest(ui.FILE.el),
			$input = $prt.find('.btn input[type="file"]'),
			itemIndex = $item.index(),
			prtIndex = $(ui.FILE.el).index($prt);

		$item.remove();
		$input.val('');

		ui.FILE.data.fileList[prtIndex].splice(itemIndex, 1);
		ui.FILE.calcLimitNumber(prtIndex);

		if(ui.FILE.data.fileList[prtIndex].length < 1){
			$prt.removeClass('regist');
		}
	},
	calcLimitNumber: function(i){
		var $prt = $(ui.FILE.el).eq(i),
			$amountNum = $prt.find('.amount em'),
			registLength = ui.FILE.data.fileList[i].length;
		$amountNum.text(registLength);
		$prt.trigger('update');
	}
}


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
			nav : ".tab-nav:first",
			navItem : ".tab-nav:first li",
			target : ".tab-nav:first a",
			cont : "> .tab-content > div"
		});
		var data = core.DataSet($$._dataSet, {
			activeIdx: null,
			duration: 0,
			target: false,	//custom Target
			anchor: $$.container.hasClass('anchor'),	//mode : anchor
			sticky: false,	//mode : sticky
		});

		this.events = {
			_init:function(){
				if(data.target) this._setTarget();
				if(data.sticky) this.sticky.init();

				$$.target.on("click", this._tabSelect);
				if(data.activeIdx != null){
					$$.target.eq(data.activeIdx).trigger('click');
				}
			},
			_setTarget: function(){
				$$.target = $$.container.find(data.target);
			},
			sticky: {
				init: function(){
					this.bindEvent();
					this._setSticky();
				},
				bindEvent: function(){
					core.observer.on('RESIZE', this._setSticky);
					core.observer.on('SCROLL', this._detectSticky);
				},
				_setSticky: function(){
					$$.nav.css('width', $$.container.outerWidth());
				},
				_detectSticky: function(){
					var isSticky = $$.container[0].getBoundingClientRect().top < data.sticky;
					if(isSticky){
						$$.container.addClass('fixed');
						$$.nav.css('top', data.sticky);
					}else{
						$$.container.removeClass('fixed');
						$$.nav.css('top', 0);
					}
				},
			},
			_tabSelect:function(e){
				var $target = $(this),
					targetIdx = $$.target.index($target);

				$$.navItem.removeClass("active");

				$target.closest('li').addClass("active");
				if(data.anchor){
					var stickyContent = $$.nav.height() + data.sticky;
					core.scroll.to($$.cont.eq(targetIdx).offset().top - stickyContent, data.duration);


				}else{
					$$.cont.filter(".active").hide().removeClass("active");
					$$.cont.eq(targetIdx).fadeIn().addClass("active");
				}

				if($target.prop('tagName') == 'A'){
					if($target.attr("href").substring(0,1) == "#"){
						e.preventDefault();
					}
				}
			},
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
			activeIdx : null,
			head : null,
			duration : 400,
		});

		this.events = {
			_init:function(){
				//var $head = (opts.head) ? $$.head.find(opts.head) : $$.head;
				//$head.on("click", this._accSelect);
				var target = opts.head ? '.acc-head'+opts.head : '.acc-head';
				$$.container.on('click', target, this._accSelect);
				this._detect();
			},
			_detect: function(){
				var idx = opts.activeIdx;
				if(idx === "all"){
					$$.item.addClass("active");
					$$.cont.show();
				}else if(idx !== null){
					var arrIdx = String(idx).split(",");
					for(var i=0, x=arrIdx.length; i<x; i++){
						$$.item.eq(i).addClass("active");
						$$.cont.eq(i).show();
					}
				}
			},
			_accSelect:function(e){
				var $tar = $(e.target),
					$root = $tar.closest(".acc-item");

				if($root.hasClass("active")){
					$root.removeClass("active");
					$root.children(".acc-cont").slideUp(opts.duration);
				}else{
					if(opts.sync){
						$$.item.removeClass("active").children(".acc-cont").slideUp(opts.duration);
					}
					$root.addClass("active");
					$root.children(".acc-cont").slideDown(opts.duration);
				}
			}
		}
	}

	/*
	ui.POPUP_OLD = function(){
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

		var helper = this.events = {
			_init: function(){
				$$.container.on("click OPEN", $.proxy(this.open._check, this));
				$$.popup.on("click", ".btn_close", this._close);
				$$.popup.on("OPEN", $.proxy(this.open._check, this));
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
					var $closestPopup = $$.container.closest(".ui-popup");
					//$closestPopup.removeClass("on");
					this._detectSize();

					// focus 삭제
					//$$.focus = $$.content.find("a, button, textarea, :input, [tabindex]");
					//opts.focusL = $$.focus.length;

					//$$.focus.first().off().on("keydown", {type:"first"}, this._detectFocus)
					//$$.focus.last().off().on("keydown", {type:"last"}, this._detectFocus)
					//$$.content.focus();
				},
				_link: function(){
					$$.popup.load(opts.popup.url, $.proxy(function(){
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
				var $prtPopup = $(this).closest('.ui-popup'),
					notPrtsPopup = $prtPopup.parents('.ui-popup').length < 1;

				if(opts.overflow && notPrtsPopup) helper.scroll.enable();
				$prtPopup.removeClass("on");
				$prtPopup.find(".body").css("height","auto");
				opts.is = false;
				//$$.container.focus();
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

				if(opts.popup.type == 'link' && length > 0){
					$img.on('load', $.proxy(function(i){
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
					footerH = $$.popup.find('.footer').outerHeight() || 0,
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
	}*/

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
						cData = data[i],
						elTop = $me.offset().top - core.screen.height + cData.option.start;

					if(core.screen.scrollTop >= elTop){
						TweenMax.to($me, cData.option.duration, cData.animationEnd);
						++complete;
					}
					if(complete >= cData.length) core.observer.off("SCROLL", events._detectPosition);
				});
			}
		}
	}

	ui.PARALLAX_SCROLL = function(){
		/* as-is
		var $$ = core.Selector(arguments[0]);
		$$.prt = $$.container.closest(".ui-parallax-scroll");

		var data = core.DataSet($$._dataSet,{
			when: "enter",
			start: 0,
			startEdge: 0,
			endEdge: 0
		});

		this.events = {
			_init: function(){
				core.observer.on("SCROLL", this._detectPosition);
			},
			_detectPosition: function(){
				var screenHeight = core.screen.height - data.start,
					top = $$.prt.offset().top.toFixed(0) - screenHeight,
					gap = core.screen.scrollTop - top,
					per = (gap/screenHeight).toFixed(2);

				var calc = {};
				for(var value in data.css){
					calc[value] = data.css[value] * per;
				}
				if(per > 0 && per <= 1){
					TweenMax.set($$.container, {css: calc});
				}else{
					TweenMax.set($$.container, {css: data.css});
				}
			},
		}*/
		var $container = $(arguments[0]),
            $item = $container.find('.parallax-item');

        var options = {
			from : {},
            enter: 0,	//bottom start Element Position
            leave: 100,	//top end Element Position
        }

        var data = $.extend(options, $item.data('parallax'));

		this.events = {
			_init: function(){
				this._detectSetFromValue();
				core.observer.on("SCROLL", this._detectPosition);
            },
			_detectSetFromValue: function(){
				for(var value in data.to){
					if(!data.from[value]) data.from[value] = 0;
				}
			},
			_detectPosition: function(){
                var itemHeight = $container[0].clientHeight,
                    enterPos = itemHeight * Number(data.enter) / 100,
                    leavePos = itemHeight * Number(data.leave) / 100,
                    screenHeight = core.screen.height - enterPos + leavePos,
                    top = $container[0].getBoundingClientRect().top + enterPos,
                    gap = core.screen.height - top,
                    per = gap / screenHeight;

				var parallaxStyle = {};
				for(var value in data.to){
					var dist = data.from[value] - data.to[value],
						distCalc = dist * per;

					parallaxStyle[value] = (data.from[value] - distCalc);
				}

				/*
				per < 0 ?
					TweenMax.set($item, {css: data.from}) :
					per > 1 ?
						TweenMax.set($item, {css: data.to}) : TweenMax.set($item, {css: parallaxStyle})
				*/

                // if(per < 0){
                    // TweenMax.set($item, {css: data.from});
                // }else if(per > 1){
                    // TweenMax.set($item, {css: data.to});
                // }else{
                    // TweenMax.set($item, {css: parallaxStyle});
                // }

				TweenMax.set($item, {css: parallaxStyle});
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

	ui.ENTERLEAVE = function(){
		var $$ = core.Selector(arguments[0]);
		var data = {

		}

		this.events = {
			_init: function(){
				core.observer.on("LOAD RESIZE", this._detectSize);
				core.observer.on("LOAD SCROLL", this._detectPosition);
			},
			_detectSize: function(){
				data.height = $$.container.height();
			},
			_detectPosition: function(){
				var posTop = $$.container.offset().top - core.screen.height;
				var scrollTop = core.screen.scrollTop;
				var gap = scrollTop - posTop;

				if(gap >= 0 && gap <= core.screen.height + data.height){
					var percentage = parseInt(gap / (core.screen.height+data.height) * 100);

					$$.container.trigger("enter", {y:gap, per:percentage});
				}
			}
		}
	}

	ui.DIRECTION = function(){
		var $$ = core.Selector(arguments[0], {

		});

		var data = {
			min: 10,
		};

		this.events = {
			_init: function(){
				var Event = core.browser.isTouch ?
				["touchstart", "touchmove", "touchend"] :
				["mousedown", "mousemove", "mouseup"];

				$$.container.on(Event[0], this._start);
				$$.container.on(Event[1], this._move);
				$$.container.on(Event[2], this._end);
			},
			_start: function(e){
				data.is = true;
				data.startX = e.screenX || e.originalEvent.changedTouches[0].screenX;
				data.startY = e.screenY || e.originalEvent.changedTouches[0].screenY;
			},
			_move: function(e){
				if(!data.is) return;

				data.moveX = e.screenX || e.originalEvent.changedTouches[0].screenX;
				data.moveY = e.screenY || e.originalEvent.changedTouches[0].screenY;
				data.gapX = data.moveX - data.startX;
				data.gapY = data.moveY - data.startY;

				core.observer.notify("DIRECTION_MOVE", {x:data.gapX, y:data.gapY})
			},
			_end: function(e){
				data.endX = e.screenX || e.originalEvent.changedTouches[0].screenX;
				data.endY = e.screenY || e.originalEvent.changedTouches[0].screenY;

				var min = {
					x: core.screen.width / data.min,
					y: core.screen.height / data.min
				}

				if(data.endX < data.startX - min.x) core.observer.notify("DIRECTION_LEFT");
				if(data.endX > data.startX + min.x) core.observer.notify("DIRECTION_RIGHT");
				if(data.endY < data.startY - min.y) core.observer.notify("DIRECTION_UP");
				if(data.endY > data.startY + min.y) core.observer.notify("DIRECTION_DOWN");
				data.is = false;
			}
		}
	}

	ui.Tooltip = function(){
		var $$ = core.Selector(arguments[0], {
			checkBox: "input[type='checkbox']",
			tooltip: ".tooltip",
		});

		var data = core.DataSet($$._dataSet, {
			hideTimer: null,
			animation: null,
		});

		this.events = {
			_init: function(){
				$$.checkBox.on("change", $.proxy(this._detect, this));
				$$.container.on('click', '.btn-close', this._close);
			},
			_detect: function(e){
				var checked = $$.checkBox.prop("checked");

				if(checked){
					this._show();
				}else{
					this._hide();
				}
			},
			_show: function(e){
				$$.tooltip.show();
				$$.container.addClass("active");

				if(data.animation){
					TweenMax.set($$.tooltip, {clearProps:"opacity, transform"});
					TweenMax.from($$.tooltip, data.animation.duration/1000, data.animation.from);
				}
				if(data.hideTimer){
					data.timer = setTimeout(this._hide, data.hideTimer);
				}
			},
			_hide: function(){
				if(data.hideTimer){
					clearTimeout(data.timer);
				}

				if(data.animation){
					TweenMax.to($$.tooltip, data.animation.duration/1000, {css:data.animation.to,
						onComplete: function(){
							TweenMax.set($$.tooltip, {clearProps:"all", display:"none"});
						}
					})
				}else{
					$$.tooltip.hide();
				}
				$$.container.removeClass("active");
				$$.checkBox.prop("checked", false);
			},
			_close: function(){
				var $el = $(this).closest('.ui-tooltip').find('>label input');
				$el.prop('checked', false).trigger('change');
			}
		}
	}

	ui.AMOUNT = function(){
		var $$ = core.Selector(arguments[0], {
			btnMinus: ".minus",
			btnPlus: ".plus",
			input: "input",
		});

		var data = core.DataSet($$._dataSet, {
			min: 1,
			max: 9999,
			step: 1,
			disabledButton: false,
			disabledInput: $$.input.prop("disabled"),
		});

		this.events = {
			_init: function(){
				if(data.disabledButton) this._detectDisabeldButton();
				this._bind();
			},
			_bind: function(){
				$$.btnPlus.on("click", {value:data.step}, $.proxy(this._clickButton, this));
				$$.btnMinus.on("click", {value:-data.step}, $.proxy(this._clickButton, this));
				if(!data.disabledInput){
					$$.input.on("focusin", this._focusinInput);
					$$.input.on("focusout", $.proxy(this._focusoutInput, this));
				}
			},
			_syncValue: function( value ){
				$$.input.val(value);
				$$.container.trigger('CHANGE', value);
			},
			_clickButton: function(e){
				var inputValue = e.data.value,
					CalcValue = this.CalcValue(inputValue);

				this.CorrectCalc(CalcValue);
				this.changeValue();
			},
			_focusinInput: function(){
				data.tempValue = this.value;
			},
			_focusoutInput: function(e){
				var value = e.currentTarget.value,
					CorrectCalc = this.CorrectCalc(value);

				if(!CorrectCalc) this._originalValue();
				this.changeValue();
			},
			_originalValue: function(){
				this._syncValue(data.tempValue);
			},
			changeValue: function(){
				if(data.disabledButton) this._detectDisabeldButton();
			},
			CalcValue: function(value){
				return parseInt($$.input.val()) + value;
			},
			CorrectCalc: function(value){
				if(value < data.min){
					alert("최소 갯수는 1개 입니다.");
					return false;
				}else if(value > data.max){
					alert("최대 갯수는"+ data.max+"개 입니다.");
					return false;
				}else{
					this._syncValue(value);
					return true;
				}
			},
			_detectDisabeldButton: function(){
				var currentValue = parseInt($$.input.val()),
					disabledMinus = (currentValue-data.step < data.min) ? true : false,
					disabledPlus = (currentValue+data.step > data.max) ? true : false;

				if(disabledPlus) $$.btnPlus.prop("disabled", true);
				else $$.btnPlus.prop("disabled", false);

				if(disabledMinus) $$.btnMinus.prop("disabled", true);
				else $$.btnMinus.prop("disabled", false);
			}
		}
	}

	ui.TREE = function(){
		var $$ = core.Selector(arguments[0], {

		});

		var data = core.DataSet($$._dataSet, {
			duration: 300,
			target: '.btn-toggle',
			sync: false,
		});

		var helper = this.events = {
			_init: function(){
				this._bindEvent();
				this._activeSub();
				this._setPreview();
			},
			_bindEvent: function(){
				$$.container.on('click', data.target, this._toggleSub);
			},
			_activeSub: function(){
				$$.container.find('.group.active').children('.sub').show();
			},
			_setPreview: function(){
				$$.container.find('.sub.preview').each(function(){
					var $me = $(this),
						height = $me.data('height');

					$me.css({'height':height})
				});
			},
			_toggleSub: function(e, syncTrigger){
				var $btn = $(this),
					$group = $btn.closest('.top').parent(),
					$groupUl = $group.parent(),
					$sub = $group.children('.sub'),
					isActive = $group.hasClass('active'),
					isPreview = $sub.data('height'),
					duration = $btn.data('duration') || data.duration,
					sync = $groupUl.data('sync') == false ? false : data.sync;

				var subInfo = {
					$group: $group,
					$target: $sub,
					duration: duration,
					preview: isPreview,
					sync: sync
				}

				if(isActive || syncTrigger){
					helper._closeSub(subInfo);
				}else{
					helper._openSub(subInfo);
				}
			},
			_openSub: function(obj){
				obj.$group.addClass('active');

				if(obj.preview){
					var $clone = obj.$target.clone().css({'height':'auto','display':'none !important'});
					obj.$target.after($clone);
					var originHeight = $clone.outerHeight(true);
					$clone.remove();

					obj.$target.animate({
						height: originHeight
					}, obj.duration);
				}else{
					obj.$target.slideDown(obj.duration);
				}

				if(obj.sync){
					var $siblingsGroup = obj.$group.siblings();
					$siblingsGroup.children('.top').find(data.target).trigger('click', true);
				}
			},
			_closeSub: function(obj){
				obj.$group.removeClass('active');

				if(obj.preview){
					obj.$target.animate({
						height: obj.preview
					}, obj.duration);
				}else{
					obj.$target.slideUp(obj.duration);
				}
			}
		}
	}

	ui.IMAGE_360 = function(el, options){
		var $$ = core.Selector(el, {

		});

		var data = core.DataSet(options, {
			src: [],
			min: 1,
			//max: Number,
			extension: '.jpg',
			digit: false,
			complete: 0,
			isActive: false,
			coords: {},
			activeIndex: 0,
			extensionFile: '',
			sensitivity: 1,
		});

		var helper = this.events = {
			_init: function(){
				this._setDigit();
				this._loadImage();
			},
			_setDigit: function(){
				data.digitFormat = '';
				for(var i=0;i<data.digit;i++){
					data.digitFormat += '0';
				}
			},
			_bindEvent: function(){
				$$.container.on('mousedown touchstart', helper.handler.start);
				$$.container.on('mousemove touchmove', helper.handler.move);
				$$.container.on('mouseup touchend', helper.handler.end);
				$$.container.on('rotation', helper.handler.rotation);
			},
			handler: {
				rotation: function(){
					helper.handler.change(arguments[1]);
				},
				start: function(e){
					data.isActive = true;
					data.coords.startX = e.screenX || e.originalEvent.touches[0].screenX;
					return false;
				},
				move: function(e){
					if(data.isActive){
						data.coords.moveX = e.screenX || e.originalEvent.touches[0].screenX;
						data.coords.gapX = data.coords.moveX - data.coords.startX;

						var dir = helper.GetSensitivity();

						if(dir){
							helper.handler.change(dir);
							data.coords.startX = data.coords.moveX;
						}
					}
					return false;
				},
				end: function(){
					data.isActive = false;
				},
				change: function(dir){
					var nextIndex = data.activeIndex + dir;
					if(nextIndex < 0) nextIndex = data.max;
					if(nextIndex > data.max) nextIndex = 0;

					$$.image.attr('src', data.src[nextIndex]);
					data.activeIndex = nextIndex;
				}
			},
			_loadImage: function(){
				for(var i=data.min; i<data.max+1; i++){
					var imageName = helper.FormatImageName(i),
						image = new Image(),
						src = imageName;

					image.src = src;
					image.addEventListener('load', helper._detectLoadImage);
					image.addEventListener('error', helper._detectLoadImage);

					data.src.push(src);
				}
			},
			_createImage: function(){
				$$.image = $('<img src='+ data.src[0] +'>');
				$$.container.append($$.image);
			},
			GetSensitivity: function(){
				var sensitivityX = parseInt(data.coords.gapX / data.sensitivity);

				return sensitivityX >= 1 ? 1 : sensitivityX <= -1 ? -1 : false;
			},
			FormatImageName: function(n){
				var nLength = String(n).length;
				var fileName = data.digit ? (data.digitFormat+n).substr(nLength, data.digit) : n;

				return data.url+data.extensionFile+fileName+data.extension;
			},
			_detectLoadImage: function(){
				data.complete++;

				if(data.complete == data.max){
					helper._createImage();
					helper._bindEvent();
				}
			},
		}
	}

	ui.IMAGE_LOAD = function(){
		var $$ = core.Selector(arguments[0], {
			img: 'img',
		});

		var data = core.DataSet($$._dataset, {
			loaded: 0,
			limit: $$.img.length
		});

		var events = this.events = {
			_init: function(){
				this._bindEvent();
			},
			_bindEvent: function(){
				$$.img.each(this._detectCheck);
			},
			_detectCheck: function(){
				if(this.complete){
					events._detectLoaded();
				}else{
					var image = new Image();
					image.src = this.src;
					image.onload = events._detectLoaded;
					image.onerror = events._detectLoaded;
				}
			},
			_detectLoaded: function(){
				++data.loaded;

				if(data.loaded == data.limit){
					$$.container.trigger('complete');
					events.public.complete();
				}
			},
			public: {}
		}
	}

	ui.POPUP = {
		type: 'layer',
		maxHeight: '90%',
		activeClass: 'active',
		disabledClass: 'disabled',
		disabled: false,
		scrollTop: null,
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			var $body = $('body');
			$body.on('click', '.ui-popup-call, [data-popup-target]', this.detectTarget);
			$('.ui-popup-call').on('click', function(){
				$('#container').addClass('popup-open');
				$body.css("overflow-y", "hidden")
			});

			$body.on('click', '.ui-popup .btn-close, [data-popup-close]', this.closePopup);
			$('.ui-popup .btn-close').on('click', function(){
				var activePopupLen = $('.ui-popup.active').length;
				if (activePopupLen <= 1) {
					$('#container').removeClass('popup-open');
					$body.css("overflow-y", "unset")
				} else {
				}
			});


			$body.on('POPUP_OPEN', '.ui-popup', this.openTrigger);
			$body.on('POPUP_CLOSE', '.ui-popup', this.closeTrigger);
		},
		detectTarget: function(){
			var $me = $(this);
			if($me.hasClass(ui.POPUP.disabledClass)) return;

			var data = $me.data(),
				$target = (data.document) ? $(data.target, parent.document) : $(data.target),
				popupInfo = data.popup || {type: 'layer'};

			ui.POPUP.detectPopup($target, popupInfo);
		},
		openTrigger: function(e, fn){
			ui.POPUP.detectImage($(this));
		},
		closeTrigger: function(){
			$(this).find('.btn-close').trigger('click');
		},
		detectPopup: function($target, popup){
			switch(popup.type){
				case 'layer' :
					ui.POPUP.detectImage($target);
				break;
				case 'link' :
					$target.load(popup.url, $.proxy(function(){
						ui.POPUP.detectImage($target);
					},this));
				break;
				case 'iframe' :
					ui.POPUP.detectImage($target);
				break;
				case 'window' :
					var left = (core.screen.width - popup.width) / 2 + window.screenX,
						top = (core.screen.height - popup.height) / 2 + window.screenY,
						option = "width=" + popup.width + ", height=" + popup.height + ", top=" + top + ", left=" + left + ", scrollbars=yes, toolbar=no, resizable=yes",
						newWin = window.open(popup.url, '', option);
					if(window.focus) newWin.focus();
				break;
			}
		},
		detectImage: function($target){
			var $img = $target.find('img');

			if($img.length > 0){
				var complete = 0;

				$img.each(function(){
					var img = new Image();
					img.onload = function(){
						complete++;
						if($img.length == complete){
							ui.POPUP.openPopup($target);
						}
					}
					img.onerror = function(){
						complete++;
						if($img.length == complete){
							ui.POPUP.openPopup($target);
						}
					}
					img.src = this.src;
				});
			}else{
				ui.POPUP.openPopup($target);
			}
		},
		openPopup: function( $popup ){
			$popup.addClass('active')
			.trigger('COMPLETE_POPUP_OPEN');
			$('body').css("overflow-y", "hidden");

			//ui.POPUP.detectHeight($popup);
			// ui.POPUP.scrollDisable($popup);
		},
		closePopup: function(){
			var isIframe = self !== top,
					$popup = isIframe ? $('.ui-popup', parent.document) : $('.ui-popup'),
					$parentPopup = isIframe ? $(window.frameElement).closest($popup) : $(this).closest($popup);

			$parentPopup.removeClass('active')
			.trigger('COMPLETE_POPUP_CLOSE');

			$parentPopup.children('.content').css('height', 'auto');

			if($popup.filter('.active').length < 1){
							$('body').css("overflow-y", "unset");
							// ui.POPUP.scrollEnable(isIframe);
			}
		},
		scrollDisable: function($popup){
			//if(ui.POPUP.disabled) return;
			if($('.ui-popup.active').length > 1) return; // 2021-02-18 추가

			console.dir($popup)

			ui.POPUP.scrollTop = window.pageYOffset;
			core.$body.css({
				overflow: 'hidden',
				position: 'fixed',
				top: -ui.POPUP.scrollTop+'px',
				width: '100%'
			}).attr('data-scroll', ui.POPUP.scrollTop);
		},
		scrollEnable: function(iframe){
			var win = iframe ? parent : window,
				$body = iframe ? $('body', parent.document) : $('body'),
				scrollTop = iframe ? $body.attr('data-scroll') : ui.POPUP.scrollTop;

			$body.css({
				overflow: 'visible',
				position: 'static',
				top: 0,
				width: 'auto'
			});

			win.scrollTo(0, scrollTop);
		},
		detectHeight: function($target){
			if(!ui.POPUP.maxHeight) return;

			var $content = $target.children('.content'),
				$header = $content.children('.header'),
				$body = $content.children('.body'),
				isOverScreen = $content.outerHeight(true) > window.innerHeight;

			if(isOverScreen){
				$content.css('height', ui.POPUP.maxHeight);
			}else{
				$content.css('height', 'auto');
			}
		},
		open: function(obj){
			var type = obj.type,
				$target = $(obj.target);

			ui.POPUP.detectPopup($target, obj);
		}
	}

	ui.TREE = {
		duration: 400,
		sync: false,
		init: function(){
			this.bindEvent();
			this.set();
		},
		bindEvent: function(){
			core.$body.on('click', '.ui-tree .btn-toggle', this.toggleSub);
		},
		set: function(){
			this.activeSub();
			this.setPreview();
		},
		activeSub: function(){
			$('.ui-tree').find('.group.active').children('.sub').show();
		},
		setPreview: function(){
			$('.ui-tree').find('.sub.preview').each(function(){
				var $me = $(this),
					height = $me.data('height');

				$me.css({'height': height});
			});
		},
		toggleSub: function(e, syncTrigger){
			var $btn = $(this),
				$group = $btn.closest('.top').parent(),
				$groupUl = $group.parent(),
				$sub = $group.children('.sub'),
				isActive = $group.hasClass('active'),
				isPreview = $sub.data('height'),
				duration = $btn.data('duration') || ui.TREE.duration,
				sync = $groupUl.data('sync');

			var subInfo = {
				$group: $group,
				$target: $sub,
				duration: duration,
				preview: isPreview,
				sync: sync
			}

			if(isActive || syncTrigger){
				ui.TREE.closeSub(subInfo);
			}else{
				ui.TREE.openSub(subInfo);
			}
		},
		openSub: function(obj){
			obj.$group.addClass('active');

			if(obj.preview){
				var $clone = obj.$target.clone().css({'height':'auto','display':'none !important'});
				obj.$target.after($clone);
				var originHeight = $clone.outerHeight(true);
				$clone.remove();

				obj.$target.animate({
					height: originHeight
				}, obj.duration);
			}else{
				obj.$target.slideDown(obj.duration);
			}

			if(obj.sync){
				var $siblingsGroup = obj.$group.siblings();
				$siblingsGroup.children('.top').find('.btn-toggle').trigger('click', true);
			}
		},
		closeSub: function(obj){
			obj.$group.removeClass('active');

			if(obj.preview){
				obj.$target.animate({
					height: obj.preview
				}, obj.duration);
			}else{
				obj.$target.slideUp(obj.duration);
			}
		}
	}

	ui.SEARCH_HIGHLIGHT = {
		listItem: [],
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			var $el = $('.ui-search');
			$el.on('focusin', '.input-wrap input', this.setData);
			$el.on('keyup', '.input-wrap input', this.filterValue);
		},
		setData: function(e){
			var $input = $(this),
				$container = $input.closest('.ui-search'),
				index = $('.ui-search').index($container);

			var items = {
				html: [],
				text: [],
			}

			items.html = $container.children('.list').children().get().map(function(el){
				items.text.push(el.innerText);
				return el.outerHTML;
			});

			ui.SEARCH_HIGHLIGHT.listItem[index] = ui.SEARCH_HIGHLIGHT.listItem[index] || items;
		},
		filterValue: function(){
			var $input = $(this),
				$container = $input.closest('.ui-search'),
				$list = $container.children('.list'),
				index = $('.ui-search').index($container),
				search = this.value,
				searchItem = ui.SEARCH_HIGHLIGHT.listItem[index];

			if(search.trim().length < 1){
				return $list.html(searchItem.html);
			}

			var searchText = '';
			searchItem.text.forEach(function(v, i){
				var isInclude = v.indexOf(search) > -1;

				if(isInclude){
					var html = searchItem.html[i],
						/*
						ERROR
							*device - safari,ios
						tag = html.split(/(?<=>)([\w\s\ㄱ-힣]+)(?=<)/),
						*/
						tag = html.split(/(?!<=>)([\w\s\ㄱ-힣]+)(?=<)/),
						pattern = new RegExp(search, 'gi');

					var result = tag.map(function(v){
						var text = v.match('<') ? v : v.replace(pattern, '<mark>'+ search +'</mark>');
						return text;
					}).join('');

					searchText += result;
				}
			});

			var $include = searchText.length > 0 ? $(searchText) : '<li class="none-result">검색 결과가 없습니다.</li>';
			$list.scrollTop(0).html($include);
		}
	}

	ui.VIEWPORT = {
		Screen: function( $el ){
			var elRect = $el.get(0).getBoundingClientRect(),
				elHeight = $el.outerHeight(true),
				screenHeight = window.innerHeight;

			var screen = {
				in: elRect.top >= 0 && elRect.bottom <= screenHeight,
				enterTop: elRect.top < 0 && elRect.top > -elHeight,
				enterBottom: elRect.bottom > screenHeight && elRect.bottom - elHeight < screenHeight,
			}

			return (screen.in) ? 'in' : (screen.enterTop || screen.enterBottom) ? 'enter' : 'leave';
		},
	}

	ui.IFRAME_HEIGHT = {
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			$('.ui-iframe').each(this.setHeight);
		},
		setHeight: function(){
			var orgIframe = this,
				tmpIframe = document.createElement("iframe");
				tmpIframe.style.visibility = 'hidden';
				tmpIframe.style.position = 'fixed';
				tmpIframe.style.left = 0;
				tmpIframe.style.top = 0;
				tmpIframe.style.clip = 'rect(0px, 0px, 0px, 0px)';

				tmpIframe.onload = function(){
					var iframe_height = this.contentWindow.document.body.scrollHeight;
					orgIframe.height = iframe_height;
					document.body.removeChild(tmpIframe);
				};

			tmpIframe.src = this.src;
			document.body.appendChild(tmpIframe);
		}
	}

	ui.STICKY = {
		init: function(){
			this.set();
			this.bindEvent();
		},
		set: function(){
			$('.ui-sticky-wrapper').each(function(){
				this.style.height = this.offsetHeight+'px';
			});
		},
		bindEvent: function(){
			core.observer.on('SCROLL', this.detectScroll);
			$('.ui-sticky-wrapper')
		},
		getData: function( tar ){
			var $me = $(tar),
				$item = $me.children(),
				$container = $me.closest('.ui-sticky-container'),
				$wrapper = $me.closest('.ui-sticky-wrapper'),
				standardPos = Object.keys($item.data('pos'))[0],
				stickyValue = $item.data('pos')[standardPos],
				stickyTargetValue = typeof stickyValue !== 'string' ? stickyValue : $(stickyValue)[0].getBoundingClientRect().bottom,
				offset = tar.getBoundingClientRect()[standardPos],
				isSticky = (standardPos == 'top') ? offset <= stickyTargetValue : offset <= core.screen.height - stickyTargetValue;

			return {
				$container: $container,
				$wrapper: $wrapper,
				$item: $item,
				standardPos: standardPos,
				stickyValue: stickyTargetValue,
				isSticky: isSticky,
				height: $me.outerHeight(true),
			}
		},
		detectScroll: function(){
			$('.ui-sticky-wrapper').each(function(){
				var data = ui.STICKY.getData(this);
				ui.STICKY.detectSticky(data);
				ui.STICKY.detectContainer(data);
			});
		},
		detectSticky: function(data){
			if(data.isSticky){
				ui.STICKY.active(data);
			}else{
				ui.STICKY.deActive(data);
			}
		},
		detectContainer: function(data){
			if(data.$container.length > 0){
				var rectBottom = data.$container[0].getBoundingClientRect().bottom,
					gap = data.standardPos == 'top' ? rectBottom - data.height : rectBottom - core.screen.height,
					transY = data.stickyValue + gap;

				if(gap < 0){
					if(data.standardPos == 'bottom') transY *= -1;
					data.$item.css(data.standardPos, transY);
				}
			}
		},
		active: function(o){
			o.$item.css({
				position: 'fixed',
				width: o.$wrapper.outerWidth(),
				//[o.pos]: o.stickyPos ,,,,,,,,, IE error
			});

			o.$item.css(o.standardPos, o.stickyValue)
			.addClass('sticky');
		},
		deActive: function(o){
			o.$item.css({
				position: 'static',
				width: 'auto',
			})
			.removeClass('sticky');
		}
	}

	ui.SELECT = {
		el: '.ui-select',
		activeClass: 'active',
		disabledClass: 'disabled',
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			core.$body.on("click", this.el+' >button', this.enterSelect);
			core.$body.on("click", this.el+' >input', this.enterSelect);
			core.$body.on("click", this.el+':not(".multi") >ul >li', this.clickOption);
			core.$body.on("click", this.el+'.multi >ul >li.all', this.clickMultiAllOption);
			core.$body.on("click", this.el+'.multi >ul >li:not(".all")', this.clickMultiOption);
			core.$doc.on("click", this.leaveSelect);

			core.$body.on("SELECT", this.el, this.triggerSelect);
		},
		triggerSelect: function(){
			var selectIndex = [].slice.call(arguments, 1),
				$items = $(this).find('>ul >li');

			for(var i in selectIndex){
				var index = selectIndex[i]
				$items.eq(index).trigger('click');
			}
		},
		leaveSelect: function(e){
			var $select = $(ui.SELECT.el);

			if(!$(e.target).closest($select).length){
				$select.removeClass(ui.SELECT.activeClass);
			}
		},
		enterSelect: function(){
			var $select = $(this).closest(ui.SELECT.el),
				$selectSiblings = $(ui.SELECT.el).not($select);

			$selectSiblings.removeClass(ui.SELECT.activeClass);
			if($select.hasClass(ui.SELECT.disabledClass)) return;

			$select.toggleClass(ui.SELECT.activeClass);
			ui.SELECT.setPosition($select);
		},
		clickOption: function(){
			var $item = $(this),
				$select = $item.closest(ui.SELECT.el),
				$btn = $select.children('button'),
				value = this.innerHTML;

			if($item.hasClass(ui.SELECT.disabledClass)) return;

			ui.SELECT.setActiveItem($item);
			ui.SELECT.setValue($btn, value);
			ui.SELECT.hideSelect($select);
		},
		clickMultiAllOption: function(){
			var $item = $(this),
				$items = $item.siblings(),
				$select = $item.closest(ui.SELECT.el),
				$btn = $select.children('button'),
				isActive = $item.hasClass(ui.SELECT.activeClass),
				limit = $select.data('limit') || $items.length;

			$item.toggleClass(ui.SELECT.activeClass);

			if(isActive) $items.removeClass(ui.SELECT.activeClass);
			else $items.addClass(ui.SELECT.activeClass);

			ui.SELECT.detectActiveItem($items, $btn)
		},
		clickMultiOption: function(){
			var $item = $(this),
				$items = $item.add($item.siblings()),
				$select = $item.closest(ui.SELECT.el),
				$btn = $select.children('button'),
				limit = $select.data('limit') || $items.length,
				isLimit = $items.filter('.active').length >= limit,
				isSelected = $item.hasClass(ui.SELECT.activeClass);

			if($item.hasClass(ui.SELECT.disabledClass)) return;
			if(!isSelected && isLimit) return alert('최대'+ limit+ '개 선택 가능합니다.')

			ui.SELECT.setActiveMultiItem($item, $items);
			ui.SELECT.detectActiveItem($items, $btn);
		},
		setActiveItem: function($item){
			$item.addClass(ui.SELECT.activeClass);
			$item.siblings().removeClass(ui.SELECT.activeClass);
		},
		setActiveMultiItem: function($item, $items){
			var $itemFilterAll = $items.filter('.all'),
				$itemsNotAll = $items.not($itemFilterAll);

			$item.toggleClass(ui.SELECT.activeClass);

			var isActive = $item.hasClass(ui.SELECT.activeClass),
				isAllActive = $itemsNotAll.filter('.'+ui.SELECT.activeClass).length == $itemsNotAll.length;

			if(!isActive){ //선택해제될 경우
				$itemFilterAll.removeClass(ui.SELECT.activeClass)
			}
			if(isAllActive){ //모두선택됐을 경우
				$itemFilterAll.addClass(ui.SELECT.activeClass)
			}
		},
		setValue: function($btn, value){
			$btn.html(value);
		},
		detectActiveItem: function($items, $btn){
			var max = $items.length,
				value = [];

			$items.filter('.active').each(function(){
				value.push(this.innerHTML)
			});

			var allSelect = (max == value.length),
				noneSelect = value.length < 1;

			if(allSelect) value = ['모두선택'];
			if(noneSelect) value = [$btn.data('placeholder')];

			ui.SELECT.setValue($btn, value.join(', '));
		},
		setPosition: function($select){
			var $options = $select.children('ul'),
				selectHeight = $select.outerHeight(true),
				offTop = $select.get(0).getBoundingClientRect().top,
				totalHeight = selectHeight + $options.outerHeight(true),
				viewport = offTop + totalHeight >= innerHeight ? false : true;

			if(!viewport){
				$options.addClass("above");
			}else{
				$options.removeClass("above");
			}
		},
		showSelect: function($select){
			$select.addClass(ui.SELECT.activeClass);
		},
		hideSelect: function($select){
			$select.removeClass(ui.SELECT.activeClass);
		},
	}

	ui.AMOUNT = {
		data: {
			min: 1,
			max: 9999,
			step: 1,
			disabledButton: false,
			alert: false,
			pressed: false,
		},
		init: function(){
			this.set();
			this.bindEvent();
		},
		set: function(){
			$('.ui-amount').each(function(){
				ui.AMOUNT.setDisabledButton.call(this);
			});
		},
		setDisabledButton: function(){
			var $el = $(this),
				value = ui.AMOUNT.Number($el.find('input[type="tel"]').val()),
				data = core.Data($el.data('amount'), ui.AMOUNT.data);

			if(data.disabledButton) ui.AMOUNT.disabledButton($el, value, data);
		},
		bindEvent: function(){
			core.$body.on('click pressed', '.ui-amount button.minus', {value: -1}, this.clickButton);
			core.$body.on('click pressed', '.ui-amount button.plus', {value: 1}, this.clickButton);
			core.$body.on('mousedown', '.ui-amount button.minus, .ui-amount button.plus', this.downButton);
			core.$body.on('mouseup mouseleave', '.ui-amount button.minus, .ui-amount button.plus', this.upButton);

			core.$body.on('keyup', '.ui-amount input[type="tel"]', this.keyupInput);
			core.$body.on('focusout', '.ui-amount input[type="tel"]', this.focusOutInput);
		},
		keyupInput: function(e){
			var $input = $(this),
				$el = $input.closest('.ui-amount'),
				data = core.Data($el.data('amount'), ui.AMOUNT.data),
				value = ui.AMOUNT.Number($input.val());

			if(!value) return; // 입력값이 없을경우

			var isCorrect = ui.AMOUNT.CorrectCalc(value, data);

			if(isCorrect){
				ui.AMOUNT.changeValue($input, value);
				if(data.disabledButton) ui.AMOUNT.disabledButton($el, value, data);
			}else{
				if(value < data.min) ui.AMOUNT.changeValue($input, data.min);
				if(value > data.max) ui.AMOUNT.changeValue($input, data.max);

				if(data.disabledButton) ui.AMOUNT.disabledButton($el, value, data);
			}
		},
		focusOutInput: function(){
			var $input = $(this),
				$el = $input.closest('.ui-amount'),
				data = core.Data($el.data('amount'), ui.AMOUNT.data),
				value = ui.AMOUNT.Number($input.val());

			if(!value){
				ui.AMOUNT.changeValue($input, data.min);
				if(data.disabledButton) ui.AMOUNT.disabledButton($el, data.min, data);
			}
		},
		clickButton: function(e){
			var isClick = e.type !== 'pressed',
				$el = $(this).closest('.ui-amount'),
				$input = $el.find('input[type="tel"]'),
				nextValue = e.data.value,
				data = core.Data($el.data('amount'), ui.AMOUNT.data);

			ui.AMOUNT.calcValue($el, $input, nextValue, data);
			if(isClick) ui.AMOUNT.upButton();
		},
		downButton: function(){
			var $btn = $(this),
				$el = $btn.closest('.ui-amount'),
				data = core.Data($el.data('amount'), ui.AMOUNT.data);

			if(data.pressed){
				ui.AMOUNT.pressedReady = setTimeout(function(){
					ui.AMOUNT.pressedStart = setInterval(function(){
						$btn.trigger('pressed');
					}, data.pressed);
				}, 500);
			}
		},
		upButton: function(){
			clearTimeout(ui.AMOUNT.pressedReady);
			clearInterval(ui.AMOUNT.pressedStart);
		},
		calcValue: function($el, $input, nextValue, data){
			var value = ui.AMOUNT.Number($input.val()),
				nextStep = data.step * nextValue,
				changeValue =  value + nextStep,
				isCorrect = ui.AMOUNT.CorrectCalc(changeValue, data);

			if(isCorrect){
				ui.AMOUNT.changeValue($input, changeValue);
				if(data.disabledButton) ui.AMOUNT.disabledButton($el, changeValue, data);
			}
		},
		changeValue: function($input, value){
			var commaValue = ui.AMOUNT.Comma(value);
			$input.val(commaValue);
		},
		disabledButton: function($el, value, data){
			var $minus = $el.find('button.minus'),
				$plus = $el.find('button.plus');

			if(value - data.step < data.min){
				$minus.prop('disabled', true);
			}else{
				$minus.prop('disabled', false);
			}

			if(value + data.step > data.max){
				$plus.prop('disabled', true);
			}else{
				$plus.prop('disabled', false);
			}
		},
		Number: function(v){
			return parseInt(v.replace(/,/g, ''));
		},
		Comma: function(v){
			return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		CorrectCalc: function(value, data){
			if(value < data.min){
				if(data.alert) alert("최소 갯수는"+ data.min+"개 입니다.");
				return false;
			}else if(value > data.max){
				if(data.alert) alert("최대 갯수는"+ data.max+"개 입니다.");
				return false;
			}else{
				return true;
			}
		},
	}

ui.TAB = {
	data: {
		anchor: false,
	},
	init: function(){
		this.bindEvent();
	},
	bindEvent: function(){
		core.$body.on('click', '[data-tab-target]', this.handleClickTab);
		core.observer.on('RESIZE SCROLL', this.detectScroll);
	},
	handleClickTab: function(){
		var $tab = $(this).closest('li');
		//if($tab.hasClass('active')) return;

		var $container = $tab.closest('.ui-tab');
		var data = core.Data($container.data('tab'), ui.TAB.data);

		if(data.anchor) ui.TAB.anchorTab($tab, data.anchor);
		else ui.TAB.changeTab($tab);
	},
	changeTab: function($tab){
		var $tabs = $tab.closest('.tab-nav').find('[data-tab-target]'),
			$target = $($tab.data('tab-target'));

		$tabs.removeClass('active');
		$tab.addClass('active');

		$target.addClass('active')
		.siblings().removeClass('active');
	},
	anchorTab: function($tab, duration){
		var $target = $($tab.data('tab-target')),
			targetTop = Math.round(core.screen.scrollTop + $target[0].getBoundingClientRect().top),
			$navInner = $tab.closest('ul'),
			hasSticky = $navInner.hasClass('ui-sticky');

		if(hasSticky){
			var stickyValue = $navInner.data('pos').top;
			var stickyTop = typeof stickyValue !== 'string' ? stickyValue : $(stickyValue).data('pos').top + $(stickyValue).outerHeight();
			var navHeight = $navInner.outerHeight();
			var stickyHeight = navHeight + stickyTop;

			targetTop -= stickyHeight;
		}

		ui.TAB.changeTab($tab);
		core.scroll.to(targetTop, duration);
	},
	detectScroll: function(){
		$('.ui-tab[data-tab*="detectAnchor"]').each(ui.TAB.detectAnchorActive);
	},
	detectAnchorActive: function(){
		var $tab = $(this),
			$anchor = $tab.find(' >.tab-nav >ul >li '),
			$content = $tab.children('.tab-content').children(),
			near = [];

		$content.each(function(i){
			var startY = this.getBoundingClientRect().top,
				endY = startY + this.clientHeight -1,
				startPer = (startY / innerHeight * 100).toFixed(2),
				endPer = (endY / innerHeight * 100).toFixed(2);

			near.push(
				{
					pos: Math.abs(startPer - 50),
					index: i
				},
				{
					pos: Math.abs(endPer - 50),
					index: i
				}
			);
		});

		near.sort(function(a, b){ return a.pos - b.pos })

		$anchor.eq(near[0].index).addClass('active')
		.siblings().removeClass('active');

		$content.eq(near[0].index).addClass('active')
		.siblings().removeClass('active');
	},
	/* ui.STICKY 사용
	detectSticky: function(){
		var $container = $(this),
			$nav = $container.children('.tab-nav'),
			$navInner = $nav.children('ul'),
			containerWidth = $container.outerWidth(),
			navTop = $nav[0].getBoundingClientRect().top,
			data = core.Data($container.data('tab'), ui.TAB.data);

		if(navTop < data.sticky){
			$container.addClass('sticky');
			$navInner.css('width', containerWidth);
		}else{
			$container.removeClass('sticky');
			$navInner.css('width', 'auto');
		}
	}*/
}

	//
	core.observer.on("LOAD", function(){
		//문서상에서 실행 ui("PIE_CHART", ".ui-pieChart");
		ui("INPUTFILE", ".ui-file");
		ui("PLACEHOLDER", ":text, textarea");
		ui("ACCORDION", ".ui-accordion");
		ui("PARALLAX_ANIMATION", ".ui-parallax-animation");
		ui("PARALLAX_SCROLL", ".parallax-container");
		ui("Tooltip", ".ui-tooltip");

		//ui("POPUP_OLD", ".ui-popup-open");
		//ui("SELECT", ".ui-select");
		//ui("TAB", ".ui-tab");
		//ui("AMOUNT", ".ui-amount");
		//ui("TREE", ".ui-tree");

		/* core.event 로 이관
		for(var name in ui){
			var asyncUI = ui[name].init;
			if(asyncUI){
				var lowerName = name.toLowerCase(),
					initClass = lowerName+'_init';

				if(!core.$body.hasClass(initClass)){
					core.$body.addClass(initClass);
					ui[name].init();
				}
			}
		}*/
	});

	core.observer.on("LOAD", function(){
		ui("ENTERLEAVE", ".ui-enterleave");
	});

})(jQuery, window[APP_NAME], window[APP_NAME].ui);


/*
 * ui
 * create Rule

	ui.name|String| = function(){

	}
 */

(function($, core, ui, undefined){
	"use strict";
	ui.COMMON = {
		init: function(){
			core.$body.on('click', 'a', this.anchor);
			core.$body.on('change', '.select-email select', this.selectEmail);

			//core.$body.on('click', '.ui-popup.search', this.searchFormHide);
			core.$body.on('change', '.input-label input', this.limitCheck);
			core.$body.on('change', '[data-check-target]', this.checkedMore);
			core.$body.on('change', '[data-check-value] input', this.checkedValue);
			this.filterPopupCategory();
		},
		anchor: function(){
			if($(this).attr('href') == '#'){
				return false;
			}
		},
		selectEmail: function(){
			var isDirect = this.value == '직접입력',
				$input = $(this).closest('.select-email').find('.etc');

			if(isDirect){
				$input.removeClass('none');
			}else{
				$input.addClass('none');
			}
		},
		searchFormHide: function(e){
			var $target = $(e.target);
			var isOutForm = $target.closest('.content').length < 1;

			if(isOutForm){
				$target.closest('.ui-popup').removeClass('active');
			}
		},
		filterPopupCategory: function(){
			var $current = $('.popup_filter .ui-tree input:checked');

			core.$body.on('change', '.popup_filter .ui-tree input', function(){
				var $me = $(this),
					$group = $me.closest('.group');

				$current.closest('.group').removeClass('checked');
				$group.addClass('checked');
				$current = $me;
			})
		},
		limitCheck: function(){
			var $prt = $(this).closest('.input-label'),
				limit = $prt.find('label').length;
		},
		checkedMore: function(){
			var $target = $($(this).data('checkTarget'));

			if(this.checked){
				$target.removeClass('none');
			}else{
				$target.addClass('none');
			}
		},
		checkedValue: function(){
			var $input = $(this).closest('.input-label').find('input[type="text"]');
			$input.val(this.value);
		}
	}

	//트리 || 아코디언
	// 2021-02-01 EZP-1500
	ui.TREE = {
		duration: 500,
		sync: false,
		is: false,
		init: function(){
			this.bindEvent();
			this.activeSub();
			this.setPreview();
		},
		bindEvent: function(){
			core.$body.on('click', '.ui-tree .top, .ui-tree .btn-toggle', this.toggleSub);
		},
		activeSub: function(){
			var $activeGroup = core.$body.find('.ui-tree .group.active');

			$activeGroup.each(function(){
				var $group = $(this),
					$groupUl = $group.parent(),
					$sub = $group.children('.sub'),
					isPreview = $sub.data('height'),
					duration = 0,
					sync = $groupUl.data('sync');

				var subInfo = {
					$group: $group,
					$target: $sub,
					duration: duration,
					preview: isPreview,
					sync: sync
				}

				ui.TREE.openSub(subInfo);
			})

		},
		setPreview: function(){
			core.$body.find('.ui-tree .sub.preview').each(function(){
				var $me = $(this),
					isActive = $me.closest('.group').hasClass('active'),
					height = $me.data('height');

				if(!isActive){
					$me.css({'height': height});
				}
			});
		},
		toggleSub: function(e, syncTrigger){
			if($(this).parent().hasClass('top')){
				return;
			}
			var $btn = $(this),
				$group = $btn.closest('.top').parent(),
				$groupUl = $group.parent(),
				$sub = $group.children('.sub'),
				isActive = $group.hasClass('active'),
				isPreview = $sub.data('height'),
				duration = $btn.data('duration') !== undefined ? $btn.data('duration') : ui.TREE.duration,
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
			obj.$group.addClass('enable');

			if(obj.preview){
				var $clone = obj.$target.clone().css({'height':'auto','display':'none !important'});
				obj.$target.after($clone);
				var originHeight = $clone.outerHeight(true);
				$clone.remove();

				obj.$target.animate({
					height: originHeight
				}, obj.duration, function(){
					ui.TREE.is = false;
				});
			}else{
				obj.$target.stop().slideDown(obj.duration, function(){
					ui.TREE.is = false;
				});
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
				}, obj.duration, function(){
					obj.$group.removeClass('enable');
					ui.TREE.is = false;
				});
			}else{
				obj.$target.stop().slideUp(obj.duration, function(){
					obj.$group.removeClass('enable');
					ui.TREE.is = false;
				});
			}
		}
	}

	//팝업
	ui.POPUP = {
		type: 'layer',
		maxHeight: '90%',
		activeClass: 'active',
		disabledClass: 'disabled',
		disabled: false,
		scrollLock: true,
		scrollTop: null,
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			core.$body.on('click', '[data-popup-target]', this.detectTarget);
			core.$body.on('click', '.ui-popup .btn-close, [data-popup-close]', this.closePopup);

			core.$body.on('POPUP_OPEN', '.ui-popup', this.openTrigger);
			core.$body.on('POPUP_CLOSE', '.ui-popup', this.closeTrigger);

			core.$body.on('click', '.ui-popup.search', this.modalClose);
		},
		modalClose: function(e){
			var $target = $(e.target),
				isModal = $target.closest('.content').length < 1;

			if(isModal){
				$target.closest('.ui-popup').removeClass('active');
			}
		},
		detectTarget: function(){
			var $me = $(this);
			console.log($(this))
			if($me.hasClass(ui.POPUP.disabledClass)) return;

			var data = $me.data(),
				$target = (data.document) ? $(data.popupTarget, parent.document) : $(data.popupTarget),
				popupInfo = data.popup || {type: 'layer'};

			ui.POPUP.detectPopup($target, popupInfo, $me);
		},
		openTrigger: function(e, fn){
			ui.POPUP.openPopup($(this));
			/* 2022-09-08 EZP-5556 modal open시 focus 제거 */
			$('input:focus').blur();
		},
		closeTrigger: function(){
			$(this).find('.btn-close').trigger('click');
		},
		detectPopup: function($target, popup, $btn){
			switch(popup.type){
				case 'layer' :
					ui.POPUP.openPopup($target, $btn);
				break;
				case 'link' :
					$target.load(popup.url, $.proxy(function(){
						ui.POPUP.openPopup($target);
					},this));
				break;
				case 'iframe' :
					ui.POPUP.openPopup($target);
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
		openPopup: function(pop, $btn){
			var $popup = $(pop);
			var nonePopup = $popup.length > 0;
			var isActive = $popup.hasClass('active');
			var alreadyLock = $('.ui-popup.active').length < 1;
			var unlock = $popup.data('popupUnlock') || false;
			var hasClose = $btn == undefined ?
				false :
				$btn.hasClass('btn-close') || $btn.filter('[data-popup-close]') > 0 ? true : false;

			if(nonePopup < 1) return;
			if(isActive) return ui.POPUP.closePopup.call($popup);

			$popup.addClass('active')
			.trigger('COMPLETE_POPUP_OPEN');

			if(hasClose) return;
			if(alreadyLock && !unlock) ui.POPUP.disableScroll($popup);
		},
		closePopup: function(){
			var $closeBtn = $(this),
				isIframe = self !== top,
				$popup = isIframe ? $('.ui-popup', parent.document) : $('.ui-popup'),
				$parentPopup = isIframe ? $(window.frameElement).closest($popup) : $closeBtn.closest($popup),
				unlock = $parentPopup.data('popupUnlock') || false,
				ifClose = $closeBtn.data('popupIf');
				
			if(ifClose){
				var $target = $($closeBtn.data('popupTarget'));
				$target.off('click.ifClose').one('click.ifClose', '[data-popup-close="true"]', function(){
					$parentPopup.removeClass('active')
					.trigger('COMPLETE_POPUP_CLOSE');

					if($popup.not('[data-popup-unlock]').filter('.active').length < 1 && !unlock){
						ui.POPUP.enableScroll(isIframe);
					}
				})
			}else{
				$parentPopup.removeClass('active')
				.trigger('COMPLETE_POPUP_CLOSE');

				if($popup.not('[data-popup-unlock]').filter('.active').length < 1 && !unlock){
					ui.POPUP.enableScroll(isIframe);
				}
			}
		},
		disableScroll: function($popup){
			ui.POPUP.scrollTop = window.pageYOffset;
			core.$body.addClass('lock');
			core.$body.css({top: -ui.POPUP.scrollTop+'px'});
			core.$body.attr('data-scroll', ui.POPUP.scrollTop);
		},
		enableScroll: function(iframe){
			var win = iframe ? parent : window,
				$body = iframe ? $('body', parent.document) : $('body'),
				scrollTop = iframe ? $body.attr('data-scroll') : ui.POPUP.scrollTop;

			$body.removeClass('lock').css({
				top: 0
			});

			win.scrollTo(0, scrollTop);
		},
		detectHeight: function($target){
			if($target.hasClass('full')) return;

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
			var $target = $(obj.target);
			obj.type = obj.type || 'layer';

			ui.POPUP.detectPopup($target, obj);
		}
	}

	//모달
	ui.MODAL = {
		scrollTop: null,
		init: function(){
			ui.MODAL.$el = $('<div id="modal"></div>');
			core.$body.append(ui.MODAL.$el);
		},
		enable: function(){
			ui.MODAL.$el.addClass('active');
		},
		disable: function(){
			ui.MODAL.$el.removeClass('active');
		},
	}

	//달력
	ui.DATEPICKER = {
		init: function(){
			$(".datepicker").datepicker({
				showMonthAfterYear: true,
				dateFormat: "yy.mm.dd", // 텍스트 필드에 입력되는 날짜 형식.
				dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT'],
				monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
				monthNames: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],
				firstDay: 1,
				// 2020-12-21 EZP-1917
				// 2021-03-02
				// minDate: 0,
				maxDate: 0,
				beforeShow: function(){
					ui.MODAL.enable();
				},
				onClose: function(){
					ui.MODAL.disable();
				},
				onSelect: function(){
					var $input = $(this);
					var idx = $input.index();
					var isRange = $input.hasClass('range');
					var $input = $input.parent().children('.datepicker');
					// 2021-03-04
					$input.trigger('change');
					var dateValue = $.map($input, function(el){ return el.value });

					if(isRange && dateValue[0] > dateValue[1]){
						if(idx == 0){
							$input.eq(1).val(dateValue[0])
						}else{
							$input.eq(0).val(dateValue[1])
						}
					}
				}
			});
		},
	}

	//탭
	ui.TAB = {
		data: {
			anchor: false,
		},
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			core.$body.on('click', '[data-tab-target]', this.clickTab);
		},
		clickTab: function(){
			var $tab = $(this);
			if($tab.hasClass('active')) return;

			var $container = $tab.closest('.ui-tab');
			var data = core.Data($container.data('tab'), ui.TAB.data);

			if(data.anchor) ui.TAB.anchorTab($tab, data.anchor);
			else ui.TAB.changeTab($tab);
		},
		changeTab: function($tab){
			var $tabs = $tab.closest('.tab-nav').find('[data-tab-target]');
			var $target = $($tab.data('tab-target'));

			$tabs.removeClass('active');
			$tab.addClass('active');

			$target.addClass('active')
			.siblings().removeClass('active');
		},
		anchorTab: function($tab, duration){
			var $target = $($tab.data('tab-target'));

			core.scroll.toElem($target, duration);
		}
	}

	//수량증감
	ui.AMOUNT = {
		data: {
			min: 0,
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
			core.$body.on('click', '.ui-amount button.refresh', this.refresh);

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
		refresh: function(){
			var $el = $(this).closest('.ui-amount'),
				$input = $el.find('input[type="tel"]'),
				data = core.Data($el.data('amount'), ui.AMOUNT.data);

			ui.AMOUNT.changeValue($input, data.min);
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
			/* var commaValue = ui.AMOUNT.Comma(value);
			$input.val(commaValue); */

			$input.val(value);
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

	//풀팁
	ui.TOOLTIP = {
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			core.$body.on('click', '.ui-tooltip', this.toggleTooltip);
		},
		toggleTooltip: function(e){
			$(this).find('.tooltip').toggleClass('active');
			return false;
		}
	}

	//키보드
	ui.KEYBOARD = {
		focus: false,
		el: '#wrap input[type="text"]:not(".datepicker"), #wrap input[type="password"], #wrap input[type="tel"], #wrap textarea',
		init: function(){
			core.$body.on('focus', ui.KEYBOARD.el, this.enableKeyboard);
			core.$body.on('blur', ui.KEYBOARD.el, this.disableKeyboard);
		},
		ScrollContent: function($input){
			return $input.closest('.ui-popup').length > 0 ? $input.closest('.ui-popup').children() : core.$body;
		},
		enableKeyboard: function(){
			ui.KEYBOARD.focus = true;
			var $scroll = ui.KEYBOARD.ScrollContent($(this));
			//$scroll[0].originalScrollHeight = $scroll[0].originalScrollHeight || $scroll.prop('scrollHeight');

			$scroll.addClass('keyboard')
			.css('height', $scroll.prop('scrollHeight'))
		},
		disableKeyboard: function(){
			var $input = $(this);
			ui.KEYBOARD.focus = false;
			setTimeout(function(){
				if(!ui.KEYBOARD.focus){
					var $scroll = ui.KEYBOARD.ScrollContent($input);

					$scroll.removeClass('keyboard')
					.css('height', '100%')
				}
			}, 1);
		},
	}

	ui.HOME = function(){
		var $$ = core.Selector(arguments[0], {
			product: '.product',
			swiper: '.swiper-container',
		})

		this.events = {
			_init: function(){
				if($$.swiper.find('.no-content').length < 1) this.setSwiper();
			},
			setSwiper: function(){
				new Swiper($$.product[0], {
					spaceBetween: 20,
					resistance: true,
					resistanceRatio: 0,
					on: {
						init: function(){
							if(this.slides.length > 1){
								this.params.pagination.el = '.product .swiper-pagination';
							}
						}
					},
				})
			}
		}
	}

	ui.PRODUCT = function(){
		var $$ = core.Selector(arguments[0], {
			swiper: '.swiper-container'
		})

		this.events = {
			_init: function(){
				this.setSwiper();
			},
			setSwiper: function(){
				var isSoldout = $$.swiper.hasClass('soldout') ? false : true;

				new Swiper($$.swiper[0], {
					pagination: {
						el: '.swiper-pagination',
					},
					resistanceRatio: 0,
				});
			}
		}
	}

	ui.PRODUCT_REGIST = function(){
		var $$ = core.Selector(arguments[0], {

		});

		this.events = {
			_init: function(){
				this.colorSize();
				this.material();
				this.discolusre();
			},
			colorSize: function(){
				//아이템선택시
				$$.container.on('change', '.color-size .input-label label input', function(e){
					var $me = $(this).parent();
					var $input = $me.find('input');
					var isChecked = $input.prop('checked');
					var idx = $me.index();
					var $wrap = $me.closest('.item-wrap');
					var $selectItems = $wrap.find('.text-group .select-items');
					var name = $me.find('span').text();

					if(isChecked){
						$selectItems.append(
							'<span data-idx=' +idx+ '>'+ name +'<button type="button"></button></span>'
						)
					}else{
						$selectItems.children().filter('[data-idx='+idx+']').remove();
					}
				});

				//선택된 아이템 상단에 프리뷰 삭제
				$$.container.on('click', '.color-size .select-items button', function(){
					var $me = $(this);
					var $labels = $me.closest('.item-wrap').find('.input-label label');
					var idx = $me.parent().data('idx');

					$labels.eq(idx).trigger('click');
				});

				//편집눌러 삭제기능
				$$.container.on('change', '.color-size .btn-edit input', function(){
					var $me = $(this);
					var isChecked = $me.prop('checked');
					var $prtLabel = $me.closest('.head').next('.item-wrap').find('.input-label');

					if(isChecked){
						$prtLabel.addClass('is-delete');
					}else{
						$prtLabel.removeClass('is-delete');
						$prtLabel.find('.none').remove();
					}
					// 2021-04-29 EZP-2250
					$prtLabel.find('label').toggleClass('filtered');
				});

				$$.container.on('click', '.color-size .input-label.is-delete label', function(e){
					var $me = $(this);
					var $input = $me.find('input');

					if($input.prop('checked')){
						$input.prop('checked', false).trigger('change');
					}
					$me.addClass('none');
					return false;
				})
			},
			// 2021-06-11 EZP-2891
			material: function(){
				$$.container.on('change', '.material .input-label label input', function(){
					// 2021-07-14 EZP-3483
					var $me = $(this).parent();
					var $input = $me.find('input');
					var isChecked = $input.prop('checked');
					var idx = $me.index();
					var $wrap = $me.closest('.input-label');
					var name = $me.find('span').text();
					var $selectInput, key;
					var idxCategory = $(this).parents('.cont').index(); // 선택한 아이템 소재 index
					if( $(this).parents('.material').hasClass('tab') ){
						// 소재정보에 소재선택 기능이 있을 때
						$selectInput = $(this).parents('.material').find('.select-input').eq(idxCategory);
						key = $selectInput.data('name');
						if (isChecked) {
							// 2021-07-20 EZP-3531
							var rateValue = ($selectInput.find('li').length == 0) ? '100' : '';
							var item = '<li data-idx=' + idx + '>' +
							'<div class="name"><input type="text" name="' + key + '[' + idx + '][name]" value=' + name + ' placeholder="직접입력" readonly /></div>' +
							'<div class="per"><input type="tel" name="' + key + '[' + idx + '][rate]" value="' + rateValue + '" placeholder="예시: 100" class="chkNumber" maxlength="3"/> %</div>' +
							'<div class="delete"><button type="button"></button></div>' +
							'</li>';
							$selectInput.append(item);
						} else {
							$selectInput.children().filter('[data-idx=' + idx + ']').remove();
						}
					} else {
						$selectInput = $wrap.find('.select-input');
						key = $selectInput.data('name');
						if (isChecked) {
							var item = '<li data-idx=' + idx + '>' +
							'<div class="name"><input type="text" name="' + key + '[' + idx + '][name]" value=' + name + ' placeholder="직접입력" readonly /></div>' +
							'<div class="per"><input type="tel" name="' + key + '[' + idx + '][rate]" value="100" placeholder="예시: 100" class="chkNumber" maxlength="3"/> %</div>' +
							'<div class="delete"><button type="button"></button></div>' +
							'</li>';
							$selectInput.append(item);
						} else {
							$selectInput.children().filter('[data-idx=' + idx + ']').remove();
						}
					}
				});

				$$.container.on('click', '.material .input-label .select-input .delete button', function(){
					console.log('삭제 버튼');
					var $me = $(this);
					var $prt = $me.closest('li');
					var idx = $prt.data('idx');
					if( $(this).parents('.material').hasClass('tab') ){
						var idx2 = 0;
				    if($me.parents('.input-label').index() == 1){
				  		idx2 = 0;
				    }else if($me.parents('.input-label').index() == 3){
				  		idx2 = 1;
				    }
				    var $label = $(this).parents('.material').find('.cont').eq(idx2).find('.input-label .items label').eq(idx);
					}else{
						var $label = $me.closest('.input-label').find('.items label').eq(idx);
					}
					$label.find('input').prop('checked', false).trigger('change'); // 라벨 checked 값 변경되면서 위에 선언된 로직 호출
				});
			},
			discolusre: function(){
				$$.container.on('change', '.set-discolusre .radio-group input', function(){
					var $me = $(this);
					var $group = $me.closest('.radio-group');
					var limit = $group.children().length - 1;
					var $li = $me.closest('li');
					var idx = $li.index();
					var $datepicker = $group.find('.datepicker');

					if(idx == limit){
						$datepicker.prop('disabled', false);
					}else{
						$datepicker.prop('disabled', true);
					}
				});
			}
		}
	}

	ui.JOIN = function(){
		var $$ = core.Selector(arguments[0], {

		});

		this.events = {
			_init: function(){
				this.selectEmail();
				this.selectBusinessClass();
				this.selectTaxBill();
			},
			selectEmail: function(){
				$$.container.on('change', '.select-email select', function(){
					var isDirect = this.value == '직접입력',
						$input = $(this).closest('.select-email').find('.etc');

					if(isDirect){
						$input.removeClass('none');
					}else{
						$input.addClass('none');
					}
				})
			},
			selectBusinessClass: function(){
				$$.container.on('change', '.business-class input', function(){
					var $prt = $(this).closest('.business-class');
					var idx = $prt.find('input').index(this);
					var $private = $prt.nextAll('.private');
					var $corporation = $prt.nextAll('.corporation');

					if(idx == 0){
						$private.removeClass('none').find('input').val('');
						$corporation.addClass('none');
					}else{
						$private.addClass('none');
						$corporation.removeClass('none').find('input').val('');
					}
				})
			},
			selectTaxBill: function(){
				$$.container.on('change', '.tax-bill input', function(){
					var $prt = $(this).closest('.tax-bill');
					var idx = $prt.find('input').index(this);
					var $off = $prt.nextAll('.tax-bill-off');

					if(idx == 0){
						$off.removeClass('none');
					}else{
						$off.addClass('none');
					}
				})
			}
		}
	}

	ui.fileDelete = function(){
		var $$ = core.Selector(arguments[0], {

		});
		this.events = {
			_init: function(){
				this.fileDelete();
			},
			fileDelete: function(){
				$$.container.on('click', '.file .delete', function(){
					$(this).parent().remove();
				})
			}
		}
	}

	// 2020-10-15 EZP-1289
	ui.moveScroll = function(){
		var $$ = core.Selector(arguments[0], {

		});
		this.events = {
			_init: function(){
				this.moveScroll();
			},
			moveScroll: function(){
				$$.container.on('click', function(){
					$('html, body').animate({scrollTop: '0'}, 500);
				})
			}
		}
	}

	// 2020-10-29 EZP-1289
	ui.quickTop = function(){
		var $$ = core.Selector(arguments[0], {
		});
		this.events = {
			_init: function(){
				this.quickTop();
			},
			quickTop: function(){
				// 2021-04-23 EZP-2444
				var lastScrollTop = 0,
				delta = 1;
				$(window).on('scroll', function(){
					var document_height = $(document).height();
					var w_height = $(window).height();
					var scroll = $(window).scrollTop();
					var st = $(this).scrollTop() + 30;
					if (Math.abs(lastScrollTop - st) <= delta) return;
					if ((st > lastScrollTop) && (lastScrollTop > 0)) {
						$('.quick-top-btn').show();
						// if(w_height + scroll + 50 > document_height){
						// 	$('.quick-top-btn').hide();
						// }else{
						// 	$('.quick-top-btn').show();
						// }
					} else {
						$('.quick-top-btn').hide()
					}
					lastScrollTop = st;
				});
			}
		}
	}

	/* 2022-09-07 EZP-5592 top버튼 스크립트 새로 추가 */
	$('.re-quick-top-btn').hide();

	//scroll시 fade되는 효과
	$(function(){
		$(window).scroll(function(){
			if($(this).scrollTop() > 100){
				$('.re-quick-top-btn').fadeIn();
			} else {
				$('.re-quick-top-btn').fadeOut();
			}
		});

		//click시 상단으로 이동
		$('.re-quick-top-btn').click(function(){
			$('body,html').animate({
				scrollTop: 0
			}, 700);
			return false;
		})
	})

	/* 2021-11-22 EZP-4287 */
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

	core.observer.on("READY", function(){
		ui('HOME', '#wrap.home');
		ui('PRODUCT', '#wrap.proudct_detail');
		ui('PRODUCT_REGIST', '.popup_product_regist');
		ui('JOIN', '#wrap.join');
		ui('fileDelete', '.img-regist');
		ui('moveScroll', '.quick-top-btn');
		ui('quickTop', '.quick-top-btn');

	});

})(jQuery, window[APP_NAME], window[APP_NAME].ui);

//file upload image preview
function imgreadURL(input) {
	var $this = $(event.target);
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$this.parent().find('.changimg')
				.attr('src', e.target.result)
				.width(105)
				.height(105);
		};
		reader.readAsDataURL(input.files[0]);
	}
}


// 2022-07-29 탑버튼
$(window).scroll(function () {
if ($(this).scrollTop() > 100) {
	$('.btn-top').fadeIn();
} else {
	$('.btn-top').fadeOut();
}
});

$(".btn-top").click(function () {
$('html, body').animate({
	scrollTop: 0
}, 400);
return false;
});

//2022-09-26 header + banner
/* 2022-09-28 EZP-5694 기존 소스로 원복을 위한 소스 수정 start */
// $(window).scroll(function () {
// 	if ($(this).scrollTop() > 58) {
// 		$('header').addClass('on');
// 	} else {
// 		$('header').removeClass('on');
// 	}
// });
/* 2022-09-28 EZP-5694 기존 소스로 원복을 위한 소스 수정 end */

/* 2022-11-10 EZP-7404 추가 시작 */
$(document).ready(function(){
	popup();
  })

  function popup(){
	  //팝업 열기
	  $('button.search').on('click',function(e){
		  e.preventDefault();
		  $("body").toggleClass('none-scroll');
	  })

	  //팝업 닫기
	  $('.ui-popup.search .dim').on('click',function(e){
		  e.preventDefault();
		  $("body").removeClass('none-scroll');
	  })
  }
  /* 2022-11-10 EZP-7404 추가 끝 */
// window.onload 이벤트추가
function addSuioLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

var SUIO = function () {
    // tab(old)
    $.eTab = function (ul) {
        $(ul).find('a').click(function (e) {
            var _li = $(this).parent('li').addClass('selected').siblings().removeClass('selected'),
                _target = $(this).attr('href'),
                _siblings = '.' + $(_target).attr('class');
            $(_target).show().siblings(_siblings).hide();
            e.preventDefault();
        });
    }
    if (window.call_eTab) {
        call_eTab();
    }
    ;
    // tab(new)
    $('.mTab').each(function () {
        var selected = $(this).find('> ul > li.selected > a');
        if (selected.siblings('ul').length <= 0) {
            $(this).removeClass('gExtend');
        }
    });
    $('body').delegate('.eTab a', 'click', function (e) {
        var _li = $(this).parent('li').addClass('selected').siblings().removeClass('selected'),
            _target = $(this).attr('href'),
            _siblings = $(_target).attr('class');
        if (_siblings) {
            var _arr = _siblings.split(" "),
                _classSiblings = '.' + _arr[0];
            $(_target).show().siblings(_classSiblings).hide();
        }
        // gExtend ctrl
        var mtab = $(this).parents('.mTab:first');
        if ($(this).siblings('ul').length > 0) {
            if (!mtab.hasClass('gExtend')) {
                mtab.addClass('gExtend');
            }
        } else {
            if ($(this).parents('ul:first').siblings('a').length <= 0) {
                mtab.removeClass('gExtend');
            }
        }
        e.preventDefault();
    });

    // mLayer : close
    $.mLayer_close = function (target) {
        var findParent = target.parents('.mLayer:first');
        var findDimmed = $('#dimmed_' + findParent.attr('id'));
        findParent.hide();

        if (findDimmed) {
            if ($('.dimmed').length > 1) {
                $('.dimmed').removeClass('hide');
            }
            findDimmed.remove();
        }
        return false
    }
    $('body').delegate('.mLayer .footer .eClose', 'click', function () {
        $.mLayer_close($(this));
    });
    $('body').delegate('.mLayer > .eClose', 'click', function () {
        $.mLayer_close($(this));
    });

    // mLayer : typeView
    $('body').delegate('.mLayer.typeView', 'mouseleave', function () {
        $(this).hide();
    });

    // mLayer : eLayerClick
    $('body').delegate('.eLayerClick', 'click', function (e) {
        var findThis = $(this),
            propBtnWidth = findThis.outerWidth(),
            findTarget = $($(this).attr('href')),
            propTargetWidth = findTarget.outerWidth(),
            propTargetHeight = findTarget.outerHeight(),
            propDocWidth = $(document).width(),
            propDocHeight = $(document).height(),
            propTop = findThis.offset().top,
            propLeft = findThis.offset().left,
            figure = propLeft + propTargetWidth,
            propMarginLeft = 0;

        var propFooterHeight = $('body').find('#footer').outerHeight();
        if (propFooterHeight == null) {
            propFooterHeight = 0;
        }
        propTargetHeight = propTargetHeight + propFooterHeight + 20;

        if ($.browser.chrome !== true || $.browser.chrome == undefined) {
            // IE11에서 비고레이어 위치가 클릭위치보다 한참아래로 나오는 오류로 분기처리
            propTop = propTop - 100;
            propTargetHeight = propTargetHeight + 100;
        }

        if ((propDocHeight - propTop) < propTargetHeight) {
            if (propDocHeight < propTargetHeight) {
                propTop = -20;
            } else {
                propTop = propDocHeight - propTargetHeight - 10;
            }
        }

        if (propDocWidth <= figure) {
            if (propTargetWidth > propLeft) {
                propMarginLeft = '-' + (propTargetWidth / 2) + 'px';
                propLeft = '50%';
            } else {
                propLeft = propLeft - propTargetWidth + 20;
            }
        }
        findTarget.css({'top': propTop + 10, 'left': propLeft, 'marginLeft': propMarginLeft}).show();
        e.preventDefault();
    });

    // mLayerOver
    // case1) </body> 직전에 하나의 레이어팝업으로 존재하는 경우 (mLayerOver > mLayer)
    $('body').delegate('.eLayerOver', 'mouseenter', function () {
        var findTarget = $($(this).attr('href'));
        // 레이어팝업의 넓이 + offset좌표 의 값이 body태그의 width보다 클때 좌표값 왼쪽으로 이동
        var bodyWidth = $('body').width();
        var targetWidth = findTarget.outerWidth();
        var setTop = $(this).offset().top + $(this).height();
        var setLeft = $(this).offset().left;
        var posWidth = targetWidth + setLeft;
        if (bodyWidth < posWidth) {
            targetWidth = targetWidth - $(this).width();
            findTarget.css({"top": setTop, "left": setLeft, "margin-left": '-' + targetWidth + 'px'});
        } else {
            findTarget.css({"top": setTop, "left": setLeft, "margin-left": 0});
        }
        findTarget.mouseenter(function () {
            $(this).show();
        }).mouseleave(function () {
            $(this).hide();
        });
        findTarget.show();
    });
    // case1) mouseleave
    $('body').delegate('.eLayerOver', 'mouseleave', function () {
        var findTarget = $("body > .mLayerOver .mLayer");
        findTarget.hide();
    });

    /*    // case2) 각 링크의 레이어팝업이 따로 존재하는 경우 (mLayerWrap > eLayerOver2, mLayer) 검토필요
     $('body').delegate('.eLayerOver2', 'mouseenter', function(){
     $('.mLayerWrap').css("position","static");
     var findTarget = $(this).siblings('.mLayer');
     findTarget.css("left",$(this).offset().left);
     findTarget.show();
     });
     // case2) mouseleave
     $('body').delegate('.mLayerWrap', 'mouseleave', function(){
     $('.mLayerWrap').css("position","");
     var findTarget = $(this).find('.mLayer');
     findTarget.hide();
     });*/

    // eModal : dimmed layer position
    function dimmedLayerPosition(target) {
        if (!target.attr('fixed')) {
            var findLayer = target,
                propWinWidth = $(window).width(),
                propWinHeight = $(window).height(),
                propWidth = findLayer.outerWidth(),
                propHeight = findLayer.outerHeight(),
                propWinScroll = $(window).scrollTop();

            if (propWinWidth < propWidth) {
                findLayer.css({'left': 0, 'marginLeft': 0});
            } else {
                var propLeft = propWidth / 2;
                findLayer.css({'left': '50%', 'marginLeft': '-' + propLeft + 'px'});
            }
            if (propWinHeight < propHeight) {
                window.scrollTo(0, 0);
                findLayer.css({'top': 0});
            } else {
                var propTop = (propWinHeight / 2) - (propHeight / 2) + propWinScroll;
                findLayer.css({'top': propTop});
            }
            findLayer.show();
        }
    }

    // eModal : show
    $('body').delegate('.eModal', 'click', function (e) {
        var findTarget = $($(this).attr('href'));
        //call dimmed layer position function
        dimmedLayerPosition(findTarget);
        findTarget.parent().append('<div id="dimmed_' + findTarget.attr('id') + '" class="dimmed"></div>');
        $(findTarget).removeClass('disabled');
        if ($('.dimmed').length > 1) {
            $('.dimmed').addClass('hide');
            var propZIndex = 110 + $('.dimmed').length;
            $(findTarget).css({'zIndex': propZIndex + 5});
            $('#dimmed_' + findTarget.attr('id')).css({'zIndex': propZIndex}).removeClass('hide');
        }
        e.preventDefault();
    });
    // window resize : dimmed layer position
    $(window).resize(function () {
        if ($('.dimmed').length > 0) {
            $('.dimmed').each(function () {
                if ($(this).css('display') == 'block') {
                    if ($(this).attr('id')) {
                        var layerId = $(this).attr('id').replace('dimmed_', '');
                        dimmedLayerPosition($('#' + layerId));
                    }
                }
            });
        }
    });

    // notice
    $('.mNotice .eClose').click(function (e) {
        $(this).parents('.mNotice:first').hide();
        e.preventDefault();
    });

    // toolTip
    // 고정
    $('body').delegate('.mTooltip .eTip', 'click', function (e) {
        mTooltipMouseEvent(this, e);
    });

    // mouseover
    $('body').delegate('.mTooltip .eTipHover', 'mouseover', function (e) {
        mTooltipMouseEvent(this, e);
    });

    function mTooltipMouseEvent(_this, e) {
        var findSection = $(_this).parents('.section:first'),
            findTarget = $($(_this).siblings('.tooltip')),
            findTooltip = $('.tooltip'),
            findHover = $(_this).hasClass('eTipHover'),
            findShow = $(_this).parents('.mTooltip:first').hasClass('show');

        if (findShow && !findHover) {
            $('.mTooltip').removeClass('show');
            findTarget.hide();
            findSection.css({'zIndex': 0, 'position': 'static'});
        } else {
            $('.mTooltip').removeClass('show');
            $(_this).parents('.mTooltip:first').addClass('show');
            findSection.css({'zIndex': 0, 'position': 'static'});
            findSection.css({'zIndex': 100, 'position': 'relative'});

            // 툴팁의 넓이 + offset좌표 의 값이 body태그의 width보다 클때 좌표값 왼쪽으로 이동
            var bodyWidth = $('body').width(),
                targetWidth = findTarget.outerWidth(),
                offsetLeft = $(_this).offset().left,
                posWidth = targetWidth + offsetLeft;

            if (bodyWidth < posWidth) {
                var propMarginLeft = (targetWidth + $(_this).width() + 10);
                var propWidth = offsetLeft - targetWidth;
                if (propWidth > 0) {
                    findTarget.addClass('posRight').css({'marginLeft': '-' + targetWidth + 'px'});
                } else {
                    findTarget.removeClass('posRight').css({'marginLeft': 0});
                }
            } else {
                findTarget.removeClass('posRight').css({'marginLeft': 0});
            }
            // 툴팁의 top 값이 window height값보다 클때 좌표값 상단으로 이동
            var findFooter = $('#footer');
            var propFooterHeight = 0;
            if (findFooter.length >= 1) {
                propFooterHeight = findFooter.outerHeight();
            }
            var propwindowHeight = $(window).height() - propFooterHeight,
                targetHeight = findTarget.outerHeight(),
                propscrollTop = $(window).scrollTop(),
                offsetTop = $(_this).offset().top,
                posHeight = (offsetTop - propscrollTop) + targetHeight + $(_this).height(),
                headerHeight = $('#header').outerHeight();

            if (propwindowHeight < posHeight) {
                var propMarginTop = (targetHeight + $(_this).height() + 10);
                var propHeight = (offsetTop - propscrollTop) - targetHeight - headerHeight;
                if (propHeight > 0) {
                    findTarget.addClass('posTop').css({'marginTop': '-' + propMarginTop + 'px'});
                } else {
                    findTarget.removeClass('posTop').css({'marginTop': 0});
                }
                /*
                // SMARTWMS-19813 (임시로 사용한 예외처리 코드 주석처리)
            } else if ($(_this).hasClass('mLastHelpLayer') === true) {
                // [예외처리] 레이어 위치 조정 (기본정보관리 > 주문연동설정-카페24 > 배송후 교환 시 신규주문 연동 설정 : settings_order_mapping.tpl)
                var propMarginTop = (targetHeight + $(_this).height() + 10);
                var propHeight = (offsetTop - propscrollTop) - targetHeight - headerHeight;
                if (propHeight > 0) {
                    findTarget.addClass('posTop').css({'marginTop': '-' + propMarginTop + 'px'});
                }
                */
            } else {
                findTarget.removeClass('posTop').css({'marginTop': 0});
            }

            findTooltip.hide();
            findTarget.show();

            if ($('#tooltipSCrollView').length > 0) {
                $('#tooltipSCrollView').remove();
            }
        }
        e.preventDefault();
    }

    // 동적
    $('body').delegate('.mTooltip .eTipScroll', 'click', function (e) {
        if ($('#tooltipSCrollView').length == 0) {
            var tooltip = $(this).siblings('.tooltip').clone();
            var prevClass = $(this).parent('.mTooltip').attr('class');
            $('body').append('<div id="tooltipSCrollView" class="' + prevClass + '" virtual="true">');
            $('#tooltipSCrollView').append(tooltip);
            var findThis = $(this),
                propBtnWidth = findThis.outerWidth(),
                findTarget = $('#tooltipSCrollView').find('.tooltip'),
                propTargetWidth = findTarget.outerWidth(),
                propTargetHeight = findTarget.outerHeight(),
                propDocWidth = $(document).width(),
                propDocHeight = $(document).height(),
                propTop = findThis.offset().top,
                propLeft = findThis.offset().left,
                figure = propLeft + propTargetWidth,
                propMarginLeft = '-11px',
                propMarginTop = findThis.outerHeight();
            if ((propDocHeight - propTop) < propTargetHeight) {
                if (propDocHeight < propTargetHeight) {
                    propTop = 0;
                } else {
                    propTop = propDocHeight - propTargetHeight - 10;
                }
            }
            if (propDocWidth <= figure) {
                propLeft = propLeft - propTargetWidth + 20;
                findTarget.addClass('posRight');
            } else {
                findTarget.removeClass('posRight');
            }
            findTarget.css({
                'top'       : propTop,
                'left'      : propLeft,
                'marginLeft': propMarginLeft,
                'marginTop' : propMarginTop
            }).show();
        }
        e.preventDefault();
    });

    /* fe suio.js에서 제공하는 eTipScroll 처리와 동일 */
    $('body').delegate('.mTooltip .eTipScroll2', 'click', function (e) {
        $('#tooltipSCrollView').remove();
        $('.section').css({'zIndex': '', 'position': ''});

        var findShow = $(this).parents('.mTooltip:first').hasClass('show');
        if (findShow) {
            $('.mTooltip').removeClass('show');
        } else {
            var tooltip = $(this).siblings('.tooltip').clone();
            var prevClass = $(this).parent('.mTooltip').attr('class');
            $('body').append('<div id="tooltipSCrollView" class="' + prevClass + '" virtual="true">');
            $('#tooltipSCrollView').append(tooltip);
            $('#tooltipSCrollView').find('.tooltip').css("z-index", "");

            $('.mTooltip').removeClass('show');
            $(this).parents('.mTooltip:first').addClass('show');

            var findThis = $(this),
                findTarget = $('#tooltipSCrollView').find('.tooltip'),
                propTargetWidth = findTarget.outerWidth(),
                propDocWidth = $(document).width(),
                propTop = findThis.offset().top + 5,
                propLeft = findThis.offset().left,
                figure = propLeft + propTargetWidth,
                propMarginLeft = '-12px',
                propMarginTop = findThis.outerHeight();

            if (propDocWidth <= figure) {
                propLeft = propLeft - propTargetWidth + 20;
                findTarget.addClass('posRight');
            } else {
                findTarget.removeClass('posRight');
            }

            var findFooter = $('#footer');
            var propFooterHeight = 0;
            if (findFooter.length >= 1) {
                propFooterHeight = findFooter.outerHeight();
            }
            var propwindowHeight = $(window).height() - propFooterHeight,
                targetHeight = findTarget.outerHeight(),
                propscrollTop = $(window).scrollTop(),
                posHeight = (propTop - propscrollTop) + targetHeight + $(this).height();

            if (propwindowHeight < posHeight) {
                findTarget.addClass('posTop');
                propTop = propTop - (targetHeight + 30);
            } else {
                findTarget.removeClass('posTop');
            }

            findTarget.css({'top': propTop, 'left': propLeft, 'marginLeft': propMarginLeft, 'marginTop': propMarginTop}).show();

            var figureTop = Math.abs(propTop - $('#tooltipSCrollView').find('.tooltip').offset().top);
            if (figureTop > $('.mTooltip .icon').height()) {
                var figureChk = figureTop - $('.mTooltip .icon').height(),
                    figureCul = propTop - figureChk,
                    propHasClass = findTarget.hasClass('posTop');
                if (propHasClass) {
                    findTarget.css({"top": (figureCul + 5)});
                } else {
                    findTarget.css({"top": figureCul});
                }
            }

            //.mMemo.typeOrder 일때 툴팁 fixed
            var figurelLen = $(this).parents('.mMemo.typeOrder').length;
            if (figurelLen > 0) {
                propTop = propTop - $(document).scrollTop();
                findTarget.css({"position": "fixed", "top": propTop});
            }

            $('.mTooltip .icon').each(function (i) {
                var findScroll = $(this).hasClass('eTipScroll');
                if (!findScroll) {
                    $(this).parent().removeClass('show');
                    $(this).parent().find('.tooltip').hide();
                }
            });
        }
        e.preventDefault();
    });

    $('body').delegate('.mTooltip .eClose', 'click', function (e) {
        // 동적
        if ($(this).parents('.mTooltip:first').attr('virtual')) {
            $('#tooltipSCrollView').remove();
        } else {
            // 고정
            var findSection = $(this).parents('.section:first');
            var findTarget = $(this).parents('.tooltip:first');
            $('.mTooltip').removeClass('show');
            findTarget.hide();
            findSection.css({'zIndex': 0, 'position': 'static'});
            e.preventDefault();
        }
    });

    // mTip
    $('body').delegate('.mTip .eTip', 'click', function (e) {
        var findTarget = $(this).siblings('.tip');
        var findParent = $(this).parent('.mTip');

        if (findParent.hasClass('show')) {
            findTarget.hide();
            findParent.removeClass('show');

            e.preventDefault();
        } else {
            findTarget.slideDown("fast");
            findParent.addClass('show');

            e.preventDefault();
        }
    });
    $('body').delegate('.mTip .eClose', 'click', function (e) {
        var findTarget = $(this).parents('.mTip .tip');
        var findParent = $(this).parents('.mTip');

        findTarget.hide();
        findParent.removeClass('show');

        e.preventDefault();
    });

    // mOpen
    $('body').delegate('.mOpen .eOpenClick', 'click', function (e) {
        var findTarget = $($(this).attr('href'));
        findTarget.toggle();
        e.preventDefault();
    });
    $('body').delegate('.mOpen .eOpenOver', 'mouseenter', function () {
        var findTarget = $(this).siblings('.open');
        var flag = $(this).attr('find');
        findTarget.show();
        if (flag) {
            $(this).parents('.' + flag + ':first').css({'zIndex': 1});
        }
    });
    $('body').delegate('.mOpen', 'mouseleave', function () {
        var findClose = $(this).find('.eClose');
        if (findClose.length <= 0) {
            var findTarget = $(this).find('.open');
            var flag = $(this).find('.eOpenOver').attr('find');
            if (window.swm_mOpen_custom_execute !== true) {
                findTarget.hide();
            }
            if (flag) {
                $(this).parents('.' + flag + ':first').css({'zIndex': 0});
            }
        }
    });
    $('body').delegate('.mOpen .eClose', 'click', function (e) {
        $(this).parents('.open:first').hide();
        e.preventDefault();
    });

    // mToggle
    $('.mToggle .eToggle').click(function (e) {
        var findParent = $(this).parents('.mToggle:first');
        // typeTop
        if (findParent.hasClass('typeHeader')) {
            var findTarget = findParent.next('.toggleArea');
        }
        // typeBtm
        if (findParent.hasClass('typeFooter')) {
            var findTarget = findParent.prev('.toggleArea');
        }
        if (findTarget.css('display') == "none") {
            $(this).find('em').text('닫기');
            $(this).addClass('selected');
            findTarget.show();
        } else {
            $(this).find('em').text('열기');
            $(this).removeClass('selected');
            findTarget.hide();
        }
        e.preventDefault();
    });

    // mToggleBar
    $('.mToggleBar.eToggle').click(function (e) {
        var findThis = $(this);
        var findTarget = findThis.next('.toggleArea');
        var findText = $(this).find('em');
        if (findTarget.css('display') == "none") {
            findThis.addClass('selected');
            findTarget.show();
            findText.text('접기');
        } else {
            findThis.removeClass('selected');
            findTarget.hide();
            findText.text('펼치기');
        }
        e.preventDefault();
    });
    $('.mToggleBar.eToggle .gLabel').click(function (e) {
        e.stopPropagation();
    });

    // checkbox, radio
    var regexpSelectedClassName = /(^|\s)eSelected($|\s)/;

    function updateCheckedDesign(target) {
        var cur = target;
        for (var i = 0; i < 4; i++) {
            cur = cur.parentNode;
            if (!cur || !cur.ownerDocument) {
                break;
            }
            if (cur.tagName.toUpperCase() === 'LABEL') {
                var className = cur.className;
                var hasClass = regexpSelectedClassName.test(className);
                if (target.checked && hasClass === false) {
                    cur.className = className + ' eSelected';
                } else if (!target.checked && hasClass === true) {
                    cur.className = className.replace(regexpSelectedClassName, ' ');
                }
                break;
            }
        }
    }

    $('body')
    // checked 상태에 따라 해당 요소의 design을 자동으로 업데이트해줍니다.
    .delegate('input[type=checkbox],input[type=radio]', 'updateDesign', function () {
        var target = this;
        window.setTimeout(function () {
            updateCheckedDesign(target);
        });
    })
    // checked 상태에 따라 label에 eSelected class를 붙여줍니다.
    .delegate('input[type=checkbox],input[type=radio]', 'click', function () {
        var target = this;
        window.setTimeout(function () {
            updateCheckedDesign(target);
        });
        // radio를 클릭한 경우에 대한 처리
        if ($(this).is('input[type=radio]') === true) {
            $('input[type=radio][name="' + this.name + '"]').each(function () {
                var target = this;
                window.setTimeout(function () {
                    updateCheckedDesign(target);
                });
            });
        }
    });
    // 페이지 로드시 checked 상태에 따라 design 요소 업데이트
    $('input[type=checkbox],input[type=radio]').each(function () {
        updateCheckedDesign(this);
    });

    // placeholder
    $.fn.extend({
        placeholder: function () {
            if (hasPlaceholderSupport() === true) {
                return this;
            }
            return this.each(function () {
                var findThis = $(this);
                var sPlaceholder = findThis.attr('placeholder');
                if (!sPlaceholder) {
                    return;
                }
                findThis.wrap('<label class="ePlaceholder" />');
                var sDisplayPlaceHolder = $(this).val() ? ' style="display:none;"' : '';
                findThis.before('<span' + sDisplayPlaceHolder + '>' + sPlaceholder + '</span>');
                this.onpropertychange = function (e) {
                    e = event || e;
                    if (e.propertyName == 'value') {
                        $(this).trigger('focusout');
                    }
                };
            });
        }
    });
    $(':input[placeholder]').placeholder();
    $('body').delegate('.ePlaceholder span', 'click', function () {
        $(this).hide();
    });
    $('body').delegate('.ePlaceholder :input', 'focusin', function () {
        $(this).prev('span').hide();
    });
    $('body').delegate('.ePlaceholder :input', 'focusout', function () {
        if (this.value) {
            $(this).prev('span').hide();
        } else {
            $(this).prev('span').show();
        }
    });

    function hasPlaceholderSupport() {
        if ('placeholder' in document.createElement('input')) {
            return true;
        } else {
            return false;
        }
    }

    // eChkColor
    $('body').delegate('.eChkColor .rowChk:not(.none-selected)', 'click', function () {
        if ($(this).is(':checked')) {
            $(this).parents('tr:first').addClass('selected');
        } else {
            $(this).parents('tr:first').removeClass('selected');
        }
        chkTrHover($(this));
    });

    //chk rowspan color
    function chkTrHover(findTarget) {
        var findChkTarget = findTarget.parent('td').parent('tr');
        var findRowspan = findChkTarget.children().attr('rowspan');

        if (findRowspan > 1) {
            var findNext = findChkTarget.next().children().attr('colspan');
            if (findNext > 1) {
                var findSelect = findTarget.is(':checked');
                if (findSelect) {
                    findChkTarget.next().addClass('selected');
                } else {
                    findChkTarget.next().removeClass('selected');
                }
            }
        }
    }

    // table : allCheck
    $('body').delegate('.mBoard .allChk, .mGridTable .allChk', 'click', function () {
        var findThis = $(this),
            findTable = $(this).parents('table:first'),
            findMboard = $(this).parents('.mBoard:first');

        if (findTable.hasClass('eChkBody')) {
            var findRowChk = findTable.find('.rowChk').not(':disabled');
            console.log(findTable.find('.rowChk').length);
            console.log(findRowChk.length);
            if (findThis.is(':checked')) {
                findRowChk.attr('checked', true);
            } else {
                findRowChk.attr('checked', false);
            }
        } else {
            if (findMboard.hasClass('typeHead')) {
                var findNext = findMboard.next();
                var findRowChk = findNext.find('.rowChk').not(':disabled');
            } else {
                var findRowChk = findTable.find('.rowChk').not(':disabled');
            }
            if (findThis.is(':checked')) {
                findRowChk.each(function () {
                    $(this).attr('checked', true);
                    if ($(this).parents('table:first').hasClass('eChkColor')) {
                        $(this).parents('tr:first').addClass('selected');
                    }
                });
            } else {
                findRowChk.each(function () {
                    $(this).attr('checked', false);
                    if ($(this).parents('table:first').hasClass('eChkColor')) {
                        $(this).parents('tr:first').removeClass('selected');
                    }
                });
            }

            //allchk colspan selected
            if (findMboard.hasClass('typeHead')) {
                var findColspanNext = findMboard.next();
                var findColspan = findColspanNext.find('td');
            } else {
                var findColspan = findTable.find('td');
            }
            findColspan.each(function () {
                if ($(this).attr('colspan') > 1) {
                    if (findThis.is(':checked')) {
                        if ($(this).parents('table:first').hasClass('eChkColor')) {
                            $(this).parents('tr:first').addClass('selected');
                        }
                    } else {
                        if ($(this).parents('table:first').hasClass('eChkColor')) {
                            $(this).parents('tr:first').removeClass('selected');
                        }
                    }
                }
            });
        }
    });

    // Table : tr hover
    $('body').delegate('.eChkColor > tbody:not(.empty) > tr', 'mouseover', function () {
        $(this).addClass("hover");
        tableTrHover($(this), "over");
    });
    $('body').delegate('.eChkColor > tbody:not(.empty) > tr', 'mouseout', function () {
        $(this).removeClass("hover");
        tableTrHover($(this), "out");
    });

    function tableTrHover(findTarget, str) {
        var findRowspan = findTarget.children().attr('rowspan');
        var findColspan = findTarget.children().attr('colspan');

        if (findRowspan > 1) {
            var findNext = findTarget.next().children().attr('colspan');
            if (findNext > 1) {
                if (str == "over") {
                    findTarget.next().addClass('hover');
                } else {
                    findTarget.next().removeClass('hover');
                }
            }
        }
        if (findColspan > 1) {
            var findPrev = findTarget.prev().children().attr('rowspan');
            if (findPrev > 1) {
                if (str == "over") {
                    findTarget.prev().addClass('hover');
                } else {
                    findTarget.prev().removeClass('hover');
                }
            }
        }
    }

    // Search toggle : option
    $('.eOptionToggle').click(function (e) {
        var findThis = $(this),
            findParent = findThis.parents('.mSearchSelect:first'),
            findList = findParent.find('.list'),
            propFix = findThis.attr('fix');
        // scroll 고정 여부
        if (propFix == undefined) {
            var propScrollHeight = 'auto';
        } else {
            var propScrollHeight = propFix + 'px';
        }
        if (findThis.hasClass('selected')) {
            findThis.removeClass('selected');
            findThis.find('span').text('전체 펼치기');
            findList.removeAttr("style");
        } else {
            findThis.addClass('selected');
            findThis.find('span').text('전체 줄이기');
            findList.css({'height': propScrollHeight});
        }
        e.preventDefault();
    });

    // search toggle : order
    $('.eOrdToogle').click(function (e) {
        var findThis = $(this),
            findTarget = findThis.parents('.mOptionToogle:first').prev('.gDivision');

        if (findTarget.css('display') == 'block') {
            findTarget.hide();
            findThis.parent('span').removeClass('selected');
            findThis.text('상세검색 열기');
        } else {
            findTarget.show();
            findThis.parent('span').addClass('selected');
            findThis.text('상세검색 닫기');
        }
        e.preventDefault();
    });

    // inlay
    $('.eInlay a').click(function (e) {
        var flag = $(this).parents('.eInlay').hasClass('multi');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').parents('tr:first').next('.gInlay').removeClass('enabled');
        } else {
            if (flag) {
                $(this).addClass('active').parents('tr:first').next('.gInlay').addClass('enabled');
            } else {
                $(this).addClass('active').parents('tr:first').siblings('tr:not(.gInlay)').find('a').removeClass('active');
                $(this).parents('tr:first').next('.gInlay').addClass('enabled').siblings('.gInlay').removeClass('enabled');
            }
        }
        e.preventDefault();
    });

    // eSelect
    $('body').delegate('.eSelect li', 'mouseenter', function () {
        $(this).addClass('selected').siblings('li').removeClass('selected');
    });
    $('body').delegate('.eSelect', 'mouseleave', function () {
        $('li', this).removeClass('selected');
    });

    // 이미지 미리보기
    $.imgPreview = function (parm) {
        var speed = parm.speed;
        var wrap = parm.wrap;
        var index = parm.index;
        var detailView = parm.detailView;
        var thumbIndex = 0;
        var detail = $('.detail', wrap);
        var thumb = $('.thumbnail', wrap);
        var thumbWidth = parseInt(thumb.outerWidth());
        var thumbLiWidth = $('li:first', thumb).outerWidth();
        var length = thumb.find('li').length;
        var thumbList = $('> ul', thumb);
        var space = parseInt(thumb.find(' > ul > li:first-child').css('paddingRight'));
        var modeArea = wrap.find('.mode');
        var view = parm.view;
        var thumbViewItem = Math.floor(thumbWidth / (thumbLiWidth - space));
        var thumbLimit = Math.ceil(length / thumbViewItem) - 1;
        // 섬네일 리스트 넓이 설정
        var thumbListWidth = parseInt(thumbLiWidth) * length;
        thumbList.css({'width': +thumbListWidth + 'px'});
        // 섬네일 선택
        $('li span ', thumb).click(function (e) {
            e.preventDefault();
            $(this).parent().addClass('selected').siblings().removeClass('selected');
            index = $(this).parent().index() + 1;
            if (detail.hasClass('typeGrid')) {
                multiView(index);
            } else {
                singleView(index);
            }
            return index;
        });
        // 섬네일 이전
        wrap.find('.prev').unbind('click').click(function (e) {
            if (thumbIndex > 0) {
                thumbIndex--;
                thumbSlide(thumbIndex, space);
            }
            e.preventDefault();
        });
        // 섬네일 다음
        wrap.find('.next').unbind('click').click(function (e) {
            if (thumbIndex < thumbLimit) {
                thumbIndex++;
                thumbSlide(thumbIndex, space);
            }
            e.preventDefault();
        });

        // 섬네일 롤링
        function thumbSlide(rollingIndex, space, ani) {
            var left = rollingIndex * 100;
            var space = space * rollingIndex;
            var nowPage = rollingIndex + 1;
            var nextItemIndex = ((nowPage * thumbViewItem) - thumbViewItem);
            var maxPage = nowPage * thumbViewItem;
            if (ani == false) {
                thumbList.css({'left': '-' + left + '%', 'marginLeft': '-' + space + 'px'});
            } else {
                thumbList.stop().css({'marginLeft': '-' + space + 'px'}).animate({'left': '-' + left + '%'}, speed, function () {
                    var nextItem = thumb.find('li:eq(' + nextItemIndex + ') span');
                    nextItem.trigger('click');
                });
            }
            if (thumbIndex == 0) {
                $('.prev', wrap).addClass('disabled');
            } else {
                $('.prev', wrap).removeClass('disabled');
            }
            if (thumbIndex == thumbLimit) {
                $('.next', wrap).addClass('disabled');
            } else {
                $('.next', wrap).removeClass('disabled');
            }
        }

        // 상세이미지 한개 보기
        function singleView() {
            $('.single', wrap).addClass('selected').siblings().removeClass('selected');
            detail.removeClass('typeGrid');
            $('li:eq(' + (index - 1) + ')', detail).show().siblings().hide();
            $('li:eq(' + (index - 1) + ')', thumb).addClass('selected');
        }

        // 상세이미지 여러개 보기
        function multiView() {
            $('.multi', wrap).addClass('selected').siblings().removeClass('selected');
            detail.addClass('typeGrid');
            detail.find('li').hide();
            for (var i = 0; i < detailView; i++) {
                detail.find('li:eq(' + ((index - 1) + i) + ')').show();
            }
        }

        // 한개(single) or 여러개(multi)
        $('.mode a', wrap).click(function (e) {
            var flag = $(this).attr('class');
            switch (flag) {
                case "single":
                    detail.removeClass('typeGrid');
                    singleView()
                    break;
                case "multi":
                    detail.addClass('typeGrid');
                    multiView();
                    break;
            }
            e.preventDefault();
        });
        // 첨부이미지 개수
        $('.imgCount', wrap).text(length);
        // 기본설정
        if (!view) {
            view = 'single';
        }
        switch (view) {
            case "single":
                singleView();
                break;
            case "multi":
                multiView();
                break;
            default:
                detail.removeClass('typeGrid');
                singleView();
                break;
        }
        if (length > 0) {
            var nowSelect = $('li:eq(' + index + ') span', thumb);
            nowSelect.trigger('click');
            var nowLeft = nowSelect.position().left;
            thumbIndex = Math.floor(nowLeft / thumbWidth);
            thumbSlide(thumbIndex, space, false);
        }
    }

    //mDropDown
    $('.mDropDown .eDropDown').click(function (e) {
        if ($(this).hasClass('disabled') == false) {
            var DropList = $(this).next('.list');
            if (DropList.css('display') == "none") {
                $(this).parent().addClass('show');
            } else {
                $(this).parent().removeClass('show');
            }
        }
    });

    //mFixNav
    $(function () {
        var findBody = $("body").find('.eFixNav');
        var findClass = findBody.hasClass('eFixNav');

        //eFixNav 없을 경우 예외처리
        if (findClass) {
            var findFixNav = $('.eFixNav');
            var propFixNavHeight = $('.eFixNav').outerHeight();
            var propFixNavTop = findFixNav.position().top;
            var findFixNavLength = $('.eFixNav li').length;

            var fixIndex = 0;
            $(window).scroll(function () {
                if (findFixNavLength == 1) {

                } else {
                    if ($(document).scrollTop() >= propFixNavTop) {
                        findFixNav.addClass('fixed');
                        if ($('#cloneFix').length == 0) {
                            findFixNav.before('<div id="cloneFix" style="height:' + propFixNavHeight + 'px"></div>');
                        }
                    } else {
                        findFixNav.removeClass('fixed');
                        $('#cloneFix').remove();
                    }

                }
            });

            $('.eFixNav a').click(function (e) {
                $(this).parent().addClass('selected').siblings().removeClass('selected');
                if ($($(this).attr('href')).length == 0) {
                    return false
                }
                if (findFixNav.hasClass('fixed')) {
                    var propTargetTop = $($(this).attr('href')).offset().top - propFixNavHeight;
                } else {
                    var propTargetTop = $($(this).attr('href')).offset().top - propFixNavHeight * 2;
                }
                // 에니메이션 사용함
                $('html,body').stop().animate({scrollTop: propTargetTop}, 300);
                // 에니메이션 사용안함
                e.preventDefault();
            });
        }
    });

    //thumbSelectArea toggle
    $('.thumbSelectArea .eToggle').click(function () {
        var findTarget = $(this).next('.box');
        var findParent = findTarget.parent('.thumbSelectArea');
        if (findParent.hasClass('show')) {
            findTarget.hide();
            findParent.removeClass('show');
        } else {
            findTarget.slideDown('fast');
            findParent.addClass('show');
        }
    });
    //mThumbSelect
    $('.mThumbSelect li').children().click(function () {
        var findSibling = $(this).parent().siblings();
        $(this).addClass('eSelected');
        findSibling.children().removeClass('eSelected');
    });

}
// $(function () {
//     addSuioLoadEvent(SUIO);
// })
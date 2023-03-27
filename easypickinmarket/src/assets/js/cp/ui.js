$(document).ready(function () {

    //셀렉트
    commonEvent();
    selectBasic('.btn-sel');
    selectDate('.sel-date-type > button');
    smToolTip();
    toolTip();
    lnbLeft();
    aside();
    csMain();
    /*
    var $test = $('.test');
    var tag = '';

    for(var i=0; i<9000; i++){
        tag += '<li>테스트'+i+'</li>';
    }
    $test.append(tag);
    */

    // searchInput();   //상품옵션템플릿관련 - 박스안에 input 없을시 생성, 포커스 아웃시 제거
    lnbAccodion();
    sideBar();
    dropDown();
    scrollFix();
    expandAll();
    tabCom();
    toggleBtn();
    mSearchEngine();
    //상품옵션템플릿관련 - 별도로 뺴고있던 부분도 있음. 함수 확인할것
    //optionTem();
    radioChange();
    searchManagement('.serchsortbtn');
    openCs();
    messageTab();
    toggleBox();
    scrollAnim();
    //scrollAnim2(); EZADMIN-4147 툴팁 a태그 클릭 오류로 주석처리(재플 미사용)
    scrollbar();
    scrollbodyAni();
    // fnMove();
    mainTab('#tab', 0);
    mainTab('#tab1', 0);
    mainTab('#tab2', 0);
    logOpen();
    inputDblclick();
    amount();
    tabPlus();
    imgAddForm();
    footer();
    multiBarcode();
    defaultTable();
    inputSearchBox();
    // maintabCom2();
    removeAutoHeight();
    tableTopInfo('.table-top-info');
    numberWithCommas('.input-n1');
    messageTemplate();

    // // lnb/gnb 팝업메뉴 이벤트, 20191014, USWOO
    // WMS.openPopupEvent('.eMenuPopupLink');
    // // 도움말
    // WMS.openPopupEvent('.eHelpDoc');

    //작업중
    //clickFoldUrl();

    // gnb 2depth 메뉴 이벤트, 20200129, GTPARK
    $('.e2DepthMenuLink').click(function (e) {
        e.preventDefault();
        const $oFirstATag = $(this).closest('.two-depth').find('ul li').first().find('a');
        const sMenuType = $oFirstATag.attr('data-menu-type');

        let sHasBlank = $(this).attr('target');

        if (sMenuType === 'P') {
            $oFirstATag.click();
        } else {
            if (sHasBlank !== undefined && sHasBlank == '_blank') {
                window.open($oFirstATag.attr('href'), '_blank');
            } else {
                location.href = $oFirstATag.attr('href');
            }

        }
    });

    // 검색관리 수정
    $('.s-search-btns .btn-write').click(function (e) {
        var $listattr = $(this).parent().prev().find('input');
        if ($listattr.attr('readonly')) {
            $('.add-search-element input').attr('readonly', true).removeClass('on');
            $listattr.removeAttr('readonly', false).addClass('on');
            $listattr.focus();
        } else {
            $listattr.attr('readonly', true).removeClass('on');
        }
    });

    //인풋 박스 동적으로 크기 늘리기
    $('.in-txt-write1 > input[type="text"]').on('keydown', function (e) {
        $(this).attr('size', $(this).val().length);
    });

    //tblSearch();
    // 즐겨찾기, 주석 20191014, GTPARK
    /*    $('.com-btn-favorite').on('click', function() {
            $(this).toggleClass('on');
        });*/
    // 200217 gtpark 주석처리, (css class 변경)
    /*    $('.fav-btn').on('click', function () {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $(this).parent().parent().removeClass('active');
                // 191227 jwsuh 추가. 즐겨찾기 아이콘 클릭시 메뉴명은 그대로, 링크는 파란색 아이콘으로 대체
                $(this).siblings('a').removeClass('icon-not-blank');
            } else {
                $(this).addClass('on');
                $(this).parent().parent().addClass('active');
                // 191227 jwsuh 추가. 즐겨찾기 아이콘 클릭시 메뉴명은 그대로, 링크는 파란색 아이콘으로 대체
                $(this).siblings('a').addClass('icon-not-blank');
            }
        });*/

    /*gnb */
    var isGnb;
    $('.gnb >li').on('click', function () {
        isGnb = true;
        $(this).addClass('active');
        $(this).closest('.gnb-head-wrap').addClass('line');
    });
    $('.gnb>li').on('mouseenter', function () {
        if (isGnb) {
            $(this).addClass('active');
        }
    });
    $('.gnb>li').on('mouseleave', function () {
        $(this).removeClass('active');
    });
    $('.gnb').on('mouseleave', function () {
        $(this).closest('.gnb-head-wrap').removeClass('line');
        isGnb = false;
    });

    if ($('.gnb > li').hasClass('active')) {
        $('.gnb-head-wrap').addClass('line');
    } else {
        $('.gnb-head-wrap').removeClass('line');
    }

    /*알림*/
    $('.alert-del-btn').on('click', function () {
        $(this).closest('li').remove();
    });

    /*전체메뉴*/
    // $('.header-btn-allmenu').on('click', function() {
    //     $(this).toggleClass('active').siblings().toggleClass('active');
    // })

    $('.favorite-list').sortable({
        disabled: true
    });

    $('.lnb-setting-btns').on('click', function () {
        var $me = $(this);
        var settingbox = $me.parent().siblings().find('button');

        $me.toggleClass('active');

        if ($me.hasClass('active')) {
            $('.favorite-list').sortable("option", "disabled", false);
            settingbox.show();
        } else {
            $('.favorite-list').sortable("option", "disabled", true);
            settingbox.hide();
        }
    });

    // gnb util btn
    $('.header-btn-alert').on('click', function () {
        if ($(this).hasClass('active')) {
            $('.header-btn-alert').removeClass('active');
            $('.inform-box').removeClass('active');
        } else {
            $(this).toggleClass('active');
            $(this).closest('.header-cont-wrap').find('.inform-box').toggleClass('active');
        }
    });
    $('.header-btn-search').on('click', function (e) {
        e.stopPropagation();

        const $inputSearchWrap = $('.header-left-cont .input-search-wrap');

        $inputSearchWrap.toggleClass('active');

        if ($inputSearchWrap.hasClass('active')) {
            $('#eSearchMenu').focus();
            $inputSearchWrap.find('.btn-sarchpanel-close').hide();
        }
    });
    $('.dropdown-toggle').on('click', function () {
        if ($('.user-panel-box').hasClass('active')) {
            $('.user-panel-box').removeClass('active');
        } else {
            $('.user-panel-box').addClass('active');
        }
    });
    $('.header-btn-allmenu').on('click', function () {
        if ($(this).hasClass('active')) {
            $('.header-btn-allmenu').removeClass('active');
            $('.allmenu-box').removeClass('active');
        } else {
            $(this).toggleClass('active');
            $('.allmenu-box').toggleClass('active');
        }
    });
    $('body').on('click, mouseup', function (e) {
        if (!$(e.target).is('.header-btn-alert, .inform-box *')) {
            $('.header-btn-alert').removeClass('active');
            $('.inform-box').removeClass('active');
        }
        if (!$(e.target).is('.header-btn-search, .input-search-wrap *')) {
            $('.header-btn-search').removeClass('active');
            $('.input-search-wrap').removeClass('active');
        }
        if (!$(e.target).is('.dropdown-toggle, .user-panel-box *')) {
            $('.user-panel-box').removeClass('active');
        }
        if (!$(e.target).is('.header-btn-allmenu, .allmenu-box *')) {
            $('.header-btn-allmenu').removeClass('active');
            $('.allmenu-box').removeClass('active');
        }
        if (!$(e.target).is('.btn-excel-log, .excel-log-box, .excel-log-box *') && !window.getSelection().toString()) {
            $('.excel-log-box').removeClass('active');
        }
        if ($('#exceldownload').hasClass('active') === true && $(e.target).is('div.dim')) {
            $('#exceldownload .page-close').click();
        }
    }).delegate("a,button", "keydown", function (e) {
        if (e.which == 13 || e.which == 32) {
            $(this).blur();
        }
    }).delegate("a,button", "click", function () {
        $(this).blur();
    }).delegate("input[value-checker-reg]", "keyup", function (e) {
        var val = $(this).val();
        var reg = $(this).attr("value-checker-reg");
        var chk = val.match(new RegExp(reg));
        $(this).val(chk ? chk[0] : "");
    });

    $('body').on('click', '.page-close', function () {
        var $modalPop = $('.modal-pop');
        $(this).closest($modalPop).removeClass('active');

        if (!$modalPop.hasClass('active')) {
            $('body').removeClass('scroll-none');
            // mk-header 스크롤 영역만큼 간격 유지 스타일 삭제
            $('.mk-header, .content, .gnb-head-wrap, .content-footer-btns').removeAttr('style'); //스크롤 사라지는 영역 만큼 간격 유지 스타일 삭제
        }

        //200207 jwsuh 추가. 하루동안 보지않기
        if ($(".close-one-day").is(":checked")) {
            var id = this.closest(".modal-pop").getAttribute("id");
            setCookie(id, "Y", 1);
        }
    });

    // 191226 jwsuh 추가
    // 2022 08 22 checked background-color 주석
    // 사용자 권한관리 > 접근권한 체크시 디자인 변경
    //$('.form-control.check-one.access_authority span').click(function () {
    //    $(this).parents('ul').find('li').find('.form-control.check-one.checking_gray').toggleClass('checking_blue');
    //});

    //gnb ellipsis
    var gnbLength = 9;
    var $userBtn = $('.user.dropdown-toggle');
    var userName = $userBtn.text().length; // 표시할 글자수 기준
    if (userName > gnbLength) {
        $userBtn.addClass('ellipsis');
    } else {
        $userBtn.removeClass('ellipsis');
    }

    /*파일첨부 삭제*/
    $('.btn-close-round').on('click', function () {
        $(this).parent().hide();
    });

    $('.modal-pop.window .page-close').off('click').click(function () {
        self.close();
        return false;
    });

    /*  테마 변경 -      ///common/theme.js 로 이동 */
    /*
    $('.theme-color-change > button').on('click', function () {
        var $class = $(this).attr('class');
        if ($('body').hasClass('autoHeight')) {
            $('body').removeClass();
            $('body').addClass($class + ' autoHeight');

        } else {
            $('body').removeClass();
            $('body').addClass($class);
        }
    });
    */

    /*통합상품 선택*/
    $('.round-border').click(function () {
        // var check = $(this).find('input[type="radio]').prop('checked');
        $('.round-border').removeClass('active');
        if ($(this).hasClass('acitve')) {
            $('.round-border').removeClass('active');
        } else {
            $(this).addClass('active');
        }
    });

    //mGridTable chk
    var mGrids = $('table').parents('div').hasClass('gridTableArea');
    if (mGrids) {
        $('body').addClass('autoHeight');
    }

    //상품목록 검색관리
    // $('.serchsortbtn').on('click', function() {
    //     $(this).toggleClass('active');
    // });

    /*로그인페이지 footer & 에러페이지 footer*/
    $(window).on('load', function () {
        loginResize();
        errorResize();
    });
    $(window).on('resize', function () {
        loginResize();
        errorResize();
    });

    function loginResize() {
        var Height = $(window).height();
        if (Height <= 940) {
            $('.login .login-footer').css({ 'position': 'static' });
        } else {
            $('.login .login-footer').css({ 'position': 'absolute' });
        }
    }

    function errorResize() {
        var Height = $(window).height();
        if (Height <= 900) {
            $('.error .error-footer').css({ 'position': 'static' });
        } else {
            $('.error .error-footer').css({ 'position': 'absolute' });
        }
    }

    /* 200306 jwsuh */

    /* 메세지 템플릿 테이블 높이 조정 */
    function messageTemplate() {

        $(window).on('load resize', function () {
            var winHeight = $(window).height(),
                mesTable = $(".tab-content:not('.hidden') .tbl-list-view.msg-temp .scrollbar-inner");

            if (mesTable.length > 0) {
                var mesTop = mesTable.offset().top,
                    mesHeight = winHeight - mesTop - 30;

                mesTable.height(mesHeight);
                mesTable.find("table").css("height", "100%");

            }

        });

        $("#content .tab>li").click(function () {
            var winHeight = $(window).height(),
                $target = $("#" + $(this).attr('data-tab')),
                tarTable = $target.find(".scrollbar-inner");

            if (tarTable.length > 0) {
                var tarTop = tarTable.offset().top,
                    tarHeight = winHeight - tarTop - 30;

                tarTable.height(tarHeight);
                tarTable.find("table").css("height", "100%");

            }
        });

    }

    /*cs 팝업*/
    function csMain() {
        var $btn_cs = $('.select-control.cstype .btn-cs');
        var $btn_more = $('.cs-more');
        var $table_tr = $('.step08 .mGridTable table tbody tr');
        //버튼 클릭시 열림
        $btn_cs.on('click', function () {
            $(this).parent().find('.sel-panel').toggle();
            if ($(this).parent().find('.sel-panel li').hasClass('hover')) {
                $(this).parent().find('.sel-panel li').removeClass('active');
            }
        });
        //펼쳐보기
        $btn_more.on('click', function () {
            if ($btn_more.is(":checked")) {
                $('.cs-txtbox').addClass('active');
            } else {
                $('.cs-txtbox').removeClass('active');
            }
        });
        //개별 클릭시 펼쳐보기
        $table_tr.on('click', function () {
            if ($(this).next().hasClass('cs-txtbox')) {
                $(this).next().toggleClass('active');
            }
        })
    }

    //캘린더
    // 10-07 calendar.js 에서 구현, 20191007, GTPARK
    //datepicker
    /*
    $('.cal-input').datepicker({
        showMonthAfterYear: true,
        changeYear: true,
        changeMonth: true,
        buttonText: "Select date",
        nextText: '다음 달',
        prevText: '이전 달',
        monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        dayNamesMin: [__('일'), __('월'), __('화'), __('수'), __('목'), __('금'), __('토'), ],
        dateFormat: "yy-mm-dd",
    });

    $('.cal-input').datepicker('option', 'onSelect', function() {
        var $me = $(this),
            range = $me.data('range');

        if (!range) return;

        var $input = $('.cal-input[data-range=' + range + ']'),
            idx = $input.index($me),
            value = $input.get().map(function(el) {
                return el.value
            });

        if (value[0] > value[1] && idx == 0) {
            $input.eq(1).datepicker('setDate', value[0]);
        }
        if (value[0] > value[1] && idx == 1) {
            $input.eq(0).datepicker('setDate', value[1]);
        }
    });*/

    //timepicker
    /*
    var $timeInput = $('.time-input');
    $timeInput.val('00:00');

    for(var i=0; i<$timeInput.length; i++){
        var $el = $timeInput.eq(i),
            $prtForm = $el.closest('.form-inline'),
            $rangeTime = $prtForm.find('.time-input');

        if($rangeTime.length == 2){
            $rangeTime.last().val('23:59');
            i += 1;
        }
    }

    $timeInput.timepicki({
        show_meridian: false,
        min_hour_value: 0,
        max_hour_value: 23,
        increase_direction: 'up'
    });
    */

    $(".mInputForm input").focusout(function () {
    });

    // 항목설정
    $('.supply-box .setting-box .ele-list li').on('click', function () {
        if ($(this).hasClass('li-disabled') != true) {
            $(this).parent().find('li').removeClass('active');
            $(this).addClass('active');
        }
    });

    //191118 jwsuh 추가. 배송일괄처리 엑셀(layer)에 사용
    $('.txt-link-lightblue').on('click', function () {
        $(this).removeClass('txt-link-lightblue').addClass('txt-link-blue');
    });

    //191223 jwsuh 추가.
    //송장양식 항목선택
    $('#invoice-detail-list').click(function () {
        $('.invoice-type').toggle();
    });

    for (var i = 1; i < $('.invoice-type-box').length + 1; i++) {

        (function (c) {
            var invoiceType = $('.invoice-type' + c);
            var invoiceTypeBox = $('.invoice-type-box' + c);

            invoiceType.click(function () {
                $('.invoice-type').hide();
                $('.invoice-type-box').hide();
                invoiceTypeBox.show();
            });
        })(i);
    }

    //CHECKBOX 전체 선택 동기화, 2019-09-20, KSPARK02
    $(".searchCheckbox label").click(function () {
        let $root = $(this).closest(".searchCheckbox");

        if ($root.find("input[type=checkbox]:first").prop("name")) {
            return;
        }

        let inputName = $(this).find("input[type=checkbox]").prop("name");

        if (inputName) {
            let isAllChecked = $root.find("input[type=checkbox][name='" + inputName + "']:checked").length == $root.find("input[type=checkbox][name='" + inputName + "']").length;

            $root.find("input[type=checkbox]:first").prop("checked", isAllChecked);

            if (isAllChecked) {
                $root.find("label:first").addClass("eSelected");
            } else {
                $root.find("label:first").removeClass("eSelected");
            }
        } else {
            let isChecked = $(this).find("input[type=checkbox]").prop("checked");
            $root.find("input[type=checkbox]").prop("checked", isChecked);

            if (isChecked) {
                $root.find("label").addClass("eSelected");
            } else {
                $root.find("label").removeClass("eSelected");
            }
        }
    });
});

// 200207 jwsuh 추가
// 하루동안 보지않기 쿠기 설정
function setCookie(name, value, expiredays, path) {
    var date = new Date();
    var sPath = '';

    date.setDate(date.getDate() + expiredays);

    if (path != undefined) {
        sPath = "; path=" + path;
    }
    document.cookie = name + "=" + escape(value) + "; expires=" + date.toUTCString() + sPath;
}

function getCookieRemove() {
    var cookies = document.cookie.split(";");

    for (var i in cookies) {
        var name = $.trim(cookies[i]).split("=");
        $("#" + name[0]).remove();
    }
}

//SELECT UI 초기값 자동 세팅, 2019-09-03, KSPARK02
function initSelectValue() {
    $(".select-control:not(.cstype)").each(function () {
        var $button = $(this).find("> button");
        var $input = $(this).find("> .selectHidden");
        var selectItem = $(this).find("ul > li.selected,ul > li.active").get(0);
        var firstItem = $(this).find("ul > li:first").get(0);

        if (selectItem) {
            $button.text($(selectItem).text());
            $input.val($(selectItem).attr("data-value"));
            $input.data("init-value", $(selectItem).attr("data-value"));
        } else {
            $button.text($(firstItem).text());
            $input.val($(firstItem).attr("data-value"));
            $(firstItem).addClass("active");
        }
    });
}

// selector 내부 값 초기화
function initFormSelectValue($oForm) {
    $(".select-control", $oForm).each(function () {
        var $button = $(this).find("> button");
        var $input = $(this).find("> .selectHidden");
        var selectItem = $(this).find("ul > li.selected,ul > li.active").get(0);
        var firstItem = $(this).find("ul > li:first").get(0);

        if (selectItem) {
            $button.text($(selectItem).text());
            $input.val($(selectItem).attr("data-value"));
            $input.data("init-value", $(selectItem).attr("data-value"));
        } else {
            $button.text($(firstItem).text());
            $input.val($(firstItem).attr("data-value"));
            $(firstItem).addClass("active");
        }
    });
}

//SELECT 선택 값 변경, 2019-10-29, KSPARK02
function setSelectValue(selector, value, dontUseClick) {
    $(selector).each(function () {
        var $root = $(this).closest(".select-control");

        if ($root.length == 0) {
            return;
        }

        if (value == undefined) {
            value = $root.find(".selectHidden").data("init-value");
        }

        var selIndex = $root.find("ul > li").map(function () {
            return $(this).attr("data-value");
        }).toArray().indexOf(value);

        if (selIndex == -1) {
            selIndex = 0;
        }

        if (dontUseClick) {
            $root.find(".selectHidden").val($root.find("ul > li").eq(selIndex).attr("data-value"));
            $root.find("button").text($root.find("ul > li").eq(selIndex).text());
            $root.find("ul > li").eq(selIndex).addClass("active").siblings().removeClass("active");
        } else {
            $root.find("ul > li").eq(selIndex).click();
        }
    });
}

//aside height
function aside() {
    var $content = $('.content'),
        $container = $('.container'),
        $aside = $('.aside-wrap'),
        isMain = $aside.filter('.main');

    $(window).load(function () {
        //aside height
        var asideh = $('.content').outerHeight();
        $aside.height(asideh);

        $(window).on('resize', function () {
            var asideh = $('.content').outerHeight();
            $aside.height(asideh);
        });
    });
    var asideh = $('.content').outerHeight();
    $aside.height(asideh);

    function noFixed() {
        if (innerHeight < 930) {
            $aside.addClass('noFixed');
        } else {
            $aside.removeClass('noFixed');
        }
    }

    if (isMain) {
        noFixed();
    }

    $(window).on('resize', function () {
        var asideh = $('.content').outerHeight();
        $aside.height(asideh);

        if (window.innerHeight > $content.outerHeight()) {
            $container.css('height', '100%');
        } else {
            $container.css('height', '');
        }

        if (isMain) {
            noFixed();
        }

    });
}

/*tooltip*/
function toolTip() {
    $('body').on('click', '.tool-tip-wrap .tool-tip', function () {
        var $toolTipWrap = $(this).closest('.tool-tip-wrap');
        $toolTipWrap.toggleClass('active');
        
    });
    $('body').on('click', '.tool-tip-wrap .tool-tip-close', function () {
        $(this).closest('.tool-tip-wrap').removeClass('active');
    });

    $(document).on('CLICK', function (e, target) {
        var $target = $(target),
            $toolTip = $('.tool-tip-wrap'),
            $closest = $target.closest($toolTip),
            notSelect = $closest.length < 1;

        if (notSelect) {
            $toolTip.removeClass('active');
        } else {
            $toolTip.not($closest).removeClass('active');
        }
    });
}

// function toolTip() {
//     var _tooltip = $('.tool-tip');
//     _tooltipclose = $('.tool-tip-close');
//     _tooltip.on('click', function() {
//         console.log('click');
//         if ($(this).parent().hasClass('active')) {
//             $('.tool-tip-wrap').removeClass('active');
//         } else {
//             $('.tool-tip-wrap').removeClass('active');
//             $(this).parent().addClass('active');
//         }
//     });
//     _tooltipclose.on('click', function() {
//         $(this).parent().parent().removeClass('active');
//     });

// }

// 파일추가
function imgAddForm() {
    $('.img-drop-box').each(function () {
        var $me = $(this),
            $plus = $me.find('.btn-plus'),
            $minus = $me.find('.btn-minus'),
            $form = $me.find('.form-inline'),
            $files = $me.find('.file-input-hidden');

        $plus.on('click', function () {
            $form.filter('.active').next('.form-inline').addClass('active');
        });

        $minus.on('click', function () {
            var $formSelect = $(this).closest('.form-inline'),
                $text = $formSelect.find('.file-input-txtbox'),
                $file = $formSelect.find('.file-input-hidden');

            $formSelect.removeClass('active').appendTo($me);
            $text.val('').empty();
            $file.val('').empty();
        })
    })
}

//2019 작업
function commonEvent() {
    var $doc = $(document),
        $warp = $('body');

    var evt = {
        _init: function () {
            this._bind();
        },
        _bind: function () {
            $warp.on('click', this._click);
        },
        _click: function (e) {
            $doc.trigger('CLICK', e.target);
        }
    };
    evt._init();
}

//셀렉트 박스 기본
// 08.21
function selectBasic(target) {
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // 10-15 추가 동적추가된 요소 이벤트 처리
    $('body').delegate('.sel-panel li', 'click', function (e) {
        let $this = $(this);
        let $group = $this.parent();
        let $btn = $group.siblings('.btn-sel');

        // disabled @click
        if ($this.hasClass('disabled')) {
            return;
        }

        $btn.html($this.text());
        $this.siblings('li').removeClass('active');
        $this.addClass('active');
        $group.parent().removeClass('active');
        $group.hide();

        //SELECT ITEM 선택 시 .selectHidden의 value 동기화, 2019-09-03, KSPARK02
        $btn.parent().find('.selectHidden').val($this.attr('data-value')).trigger('change');
    }).delegate('.sel-panel li', 'mouseenter', function () {
        $(this).addClass('hover').siblings().removeClass('hover');
    }).delegate('.sel-panel', 'mouseenter', function () {
        $(this).addClass('is-select');
    }).delegate('.btn-sel', 'click', function () {
        var $btn = $(this),
            $btnSelAll = $('.btn-sel').not($btn).parent('.select-control'),
            $prtModalBody = $btn.closest('.modal-body'),
            hasModalBody = $prtModalBody.length > 0 ? true : false,
            $scrollContent = hasModalBody ? $prtModalBody : $(window),
            $selectControl = $btn.parent(),
            $group = $btn.next(),
            $item = $group.children();

        var $prt = $(this).parent(),
            scr = $scrollContent.scrollTop() + $scrollContent.outerHeight(), // + 65,
            pos_t = $btn.offset().top,
            con_h = $btn.outerHeight(),
            group_h = $group.outerHeight(),
            $prtModalBody = $prt.closest('.modal-body'),
            hasModalBody = $prtModalBody.length > 0 ? true : false;

        if (hasModalBody) {
            pos_t = pos_t - $scrollContent.offset().top + $scrollContent.scrollTop()
        }

        var viewport = OFFSET.Viewport({
            $wrap: $prt,
            $plus: $group,
            $minus: hasModalBody ? $prtModalBody.find('.modal-footer') : $('.content-footer'),
            //hidden: true,
        });

        if (viewport.show) {
            $group.removeClass("above");
        } else {
            if (viewport.spaceTop) {
                $group.addClass("above");
            } else {
                $group.removeClass("above");
            }
        }

        $btnSelAll.removeClass('active');
        $prt.toggleClass('active');
        $group.toggle().removeClass('is-select');

        var activePosTop = $group.children("li.active").prop('offsetTop') || 0;
        $group.scrollTop(activePosTop);
    }).delegate("select.selectHidden", "change", function (e) {
        //UI SELECT가 아닌 일반 SELECT인 경우 SELECT의 ONCHANGE 시 BUTTON과 UL>LI 선택 상태 동기화 처리, 2020-10-26, KSPARK02
        $(this).siblings("ul").find("li[data-value='" + $(this).val() + "']").addClass("active").siblings().removeClass("active");
        $(this).siblings("button").text($(this).find("option:selected").text());
    });

    $(document).delegate('body', 'click', function (e) {
        var $target = $(e.target),
            $all = $('.select-control'),
            $closest = $target.closest($all),
            notSelect = $closest.length < 1;

        if (notSelect) {
            $all.removeClass('active').find('.sel-panel').hide();
        } else {
            $all.not($closest).removeClass('active').find('.sel-panel').hide();
        }
    });

    //SELECT UI 초기값 자동 세팅, 2019-09-03, KSPARK02
    initSelectValue();
}

//검색어 셀렉트
function searchInput() {
    var $scrollContent = $('.content');

    $('.search-items-wrap').on('click', '.item-del', function () {
        var $me = $(this),
            $item = $me.parent(),
            $items = $item.parent(),
            $select = $items.prev('.select-form-control'),
            $selectItem = $select.find('.select-list').children(),
            $previewItem = $select.find('.select-list-preview').children();

        var txt = $item.text().replace(__('삭제'), '');

        $item.remove();
        $selectItem.each(function () {
            var innerText = this.innerText;
            if (innerText.indexOf(txt) > -1) {
                $(this).removeClass('active');
            }
        });
        $previewItem.each(function () {
            var innerText = this.innerText;
            if (innerText.indexOf(txt) > -1) {
                $(this).remove();
            }
        });
    });

    $('.select-list-preview').on('click', '.item-del', function () {
        var $me = $(this),
            $item = $me.parent(),
            $selectForm = $item.closest('.select-form-control'),
            $searchItems = $selectForm.next('.search-items-wrap').children(),
            $selectItem = $selectForm.find('.select-list').children();

        var txt = $item.text().replace(__('삭제'), '');

        $item.remove();
        $selectItem.each(function () {
            var innerText = this.innerText;
            if (innerText.indexOf(txt) > -1) {
                $(this).removeClass('active');
            }
        });
        $searchItems.each(function () {
            var innerText = this.innerText;
            if (innerText.indexOf(txt) > -1) {
                $(this).remove();
            }
        })
    });

    return $('.select-form-control').each(function (i) {
        var $me = $(this),
            $searchItems = $me.next('.search-items-wrap'),
            $input = $me.children('input[type="text"]'),
            $btnsearch = $me.find('.btn-search'),
            $panel = $me.find('.sel-panel'),
            $selItem = $panel.find('.select-list').children(),
            $selMultiItem = $panel.find('.select-multi-list').children(),
            $selModifyItem = $panel.find('.select-modify-list').children(),
            $preview = $panel.find('.select-list-preview'),
            hasBubble = $me.hasClass('bubble'),
            hasInput = $me.hasClass('input'),
            hasMulti = $me.hasClass('multi'),
            hasModify = $me.find('.select-modify-list').length > 0 ? true : false,
            hasResultText = $me.find('.search-result-txt').length > 0 ? true : false,
            $selCheckbox = $me.find('input[type="checkbox"]'),
            $resultLength = $me.find('.search-result-txt > strong:first span'),
            $resultText = $me.find('.search-result-txt > strong:last'),
            placeHolder = $input.attr('placeholder'),
            notTrigger = false;

        var data = {
            orgObj: {},
            searchObj: {},
        };

        $input.on('focusin', function () {
            var scr = $scrollContent.scrollTop() + $scrollContent.height() + 65,
                pos_t = $me.offset().top,
                con_h = $me.outerHeight(),
                group_h = $panel.outerHeight();

            if (pos_t + con_h + group_h >= scr) {
                $panel.addClass("above");
            } else {
                $panel.removeClass("above");
            }
            $panel.show();

            /* TODO: focusin
            var value = $(this).val();
            $(this).attr('placeholder', value).val('');
            */
        });

        $input.on('focusout', function () {
            //TODO: focusout
            return;
            var nullValue = $(this).val().trim() == 0;
            if (nullValue) {
                $(this).attr('placeholder', placeHolder);
            }
        });

        $input.on('keyup', function () {
            var value = this.value;

            $selItem.each(function () { //selItem 치환 input
                var txt = this.innerText;
                if (txt.indexOf(value) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
            $selMultiItem.each(function () {
                var txt = this.innerText;
                if (txt.indexOf(value) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            $selModifyItem.each(function () {
                var txt = this.innerText;
                if (txt.indexOf(value) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

        $me.on('OUT', function () {
            $panel.hide();
            $input.blur();
        });

        $selModifyItem.on('click', function () {
            var $sel = $(this);
            $sel.toggleClass('active');
        });

        $selModifyItem.on('click', '.btn-del', function () {
            var con = confirm(__('삭제하시겠습니까?'));
            if (con) {
                notTrigger = true;
                $(this).closest('li').remove();
                setTimeout(function () {
                    notTrigger = false;
                }, 100);
            }
        });

        $selItem.on('click', function () {
            var $sel = $(this),
                txt = $sel.text();

            if (hasBubble) {
                var selected = $sel.hasClass('active');
                if (!selected) {
                    $sel.addClass('active');
                    var selHTML = '<span class="search-item">' + txt + '<button type="button" class="item-del">' + __('삭제') + '</button></span>';
                    $searchItems.append(selHTML);
                    $preview.append(selHTML);
                } else {
                    $sel.removeClass('active');
                    $searchItems.children().each(function () {
                        var innerText = this.innerText;
                        if (innerText.indexOf(txt) > -1) {
                            $(this).remove();
                        }
                    });
                    $preview.children().each(function () {
                        var innerText = this.innerText;
                        if (innerText.indexOf(txt) > -1) {
                            $(this).remove();
                        }
                    })
                }
            } else {
                //ftpointcolor1
                $sel.toggleClass('active');

                var $activeItems = $selItem.filter('.active');
                var selLength = $activeItems.length;
                var selText = [];
                $activeItems.each(function () {
                    selText.unshift(this.innerText)
                });
                $resultLength.text(selLength);
                $input.val(selText.join(','));
                //$input.val(txt);
                //$me.trigger('OUT');
            }
        });

        $(document).on('CLICK', function (e, target) {
            if (notTrigger) {
                return;
            }
            var $target = $(target),
                notSelect = $target.closest($me).length < 1;

            if (notSelect) {
                $me.trigger('OUT');
            }
        });

        var checkData = {
            length: $selCheckbox.length - 1,
            items: [],
            placeHolder: $input.attr('placeholder')
        };

        $selCheckbox.on('change', function () {
            var $me = $(this),
                idx = $selCheckbox.index(this),
                isCheck = $me.prop('checked') ? true : false,
                $firstItem = $selCheckbox.first(),
                $items = $selCheckbox.not(':first'),
                isAll = $me.attr('name') == 'all';

            if (isAll) { //전체 선택시
                $selCheckbox.prop('checked', isCheck);
            }

            var $checkItems = $items.filter(':checked');
            var checkedLength = $checkItems.length;

            switch (checkedLength) {
                case checkData.length:
                    $firstItem.prop('checked', true);
                    checkData.items = [__('전체')];
                    break;
                case 0:
                    checkData.items = [];
                    break;
                default:
                    $firstItem.prop('checked', false);
                    checkData.items = [];

                    $checkItems.each(function (i) {
                        var $prt = $(this).parent();
                        var $clonePrt = $prt.clone();
                        var hasLabel = $clonePrt.find('.label').length > 0;
                        var labelText = $clonePrt.find('.label').text();
                        $clonePrt.find('.label').remove();
                        var text = $clonePrt.text().trim();

                        if (hasLabel) {
                            text = '[' + labelText + ']' + text;
                        }
                        checkData.items.unshift(text);
                    });
            }

            var joinText = checkData.items.join(', ');

            $resultLength.text(checkedLength);
            $resultText.text(joinText);
            $input.val(joinText)
        })
    });

}

//기간 선택
function selectDate(el) {
    var _self = this,
        $el = $(el),
        $win = $(window);

    $el.each(function () {
        var $content = $('.content'),
            $target = $(this),
            $closest = $target.closest('.sel-date-type'),
            $date = $target.next(),
            $dateItem = $date.children(),
            middleIndex = parseInt($dateItem.length / 2),
            $dateItemMiddle = $dateItem.eq(middleIndex),
            hasContent = $content.length > 0 ? true : false,
            isActive = false;

        $target.on('click refresh', function (e) {
            $date.show().addClass('active');
            $target.parent().addClass('active');
            var $activeItem = $dateItem.filter('.active'),
                offsetTop = $target.offset().top - $win.scrollTop(),
                offsetLeft = $target.offset().left - $win.scrollLeft(),
                posTop = $activeItem.position().top,
                calcTop = offsetTop - posTop,
                limitTop = $content.hasClass('active') ? 0 : 65,
                posTopArr = $dateItem.get().map(function (v) {
                    return offsetTop - v.offsetTop - limitTop;
                });

            if (hasContent) {
                // offsetTop -= $content.offset().top;
                // offsetLeft -= $content.offset().left;
            }

            if (calcTop < limitTop) {
                calcTop = offsetTop // - $dateItemMiddle.position().top;
            }

            $date.css({
                'top': calcTop,
                'left': offsetLeft,
                //'margin-top': transTop
            });

            isActive = true;
        });

        $dateItem.on('click', function (e) {
            var $me = $(this),
                $calenderInput = $('.calendar-box input'),
                hasActive = $me.hasClass('active');

            // 이미 선택된 날짜여도 선택할 수 있도록 변경. cwkim 20200324
            if (hasActive) {
                //return;
            }

            
            // 전체 선택했을시 2022 08 22
            if(e.currentTarget.classList.contains('all')) {
                for(i = 0; i < $calenderInput.length; i++) {
                    $calenderInput.eq(i).attr('disabled', true)
                }
            } else {
                for(i = 0; i < $calenderInput.length; i++) {
                    $calenderInput.eq(i).attr('disabled', false)
                }
            }

            var innerText = $(this).text();
            $target.text(innerText);
            $me.addClass('active').siblings().removeClass('active');
            $date.hide().removeClass('active');
            $me.parent().parent().removeClass('active');
        });

        $(document).on('CLICK', function (e, target) {
            var $prt = $(target).closest($closest);

            if ($prt.length < 1) {
                $date.hide().removeClass('active');
                $closest.removeClass('active');
            }
        });
    });

    $win.on('scroll resize', function () {
        $('.sel-date-list.active').prev('button').trigger('refresh');
    })
}

/* 191118 jwsuh 추가 */

/* 목록 리스트 검색결과 선택 */
function tableTopInfo(target) {
    var target = $(target + ' a');

    target.click(function () {
        target.removeClass('txt-link-blue txt-link-lightblue');
        if ($(target).is('.btn-guide') === false) {
            $(this).addClass('txt-link-blue');
        }

        target.not(this).addClass('txt-link-lightblue');
    });
}

/* 191122 jwsuh 추가 */

/* 숫자 입력시 3자리 단위로 콤마 - 입력폼 숫자(회계) */
function numberWithCommas(target) {

    var target = $(target);

    target.on('keyup', function () {
        this.value = comma(uncomma(this.value));
    });

    //콤마찍기
    function comma(str) {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }

    //콤마풀기
    function uncomma(str) {
        str = String(str);
        return str.replace(/[^\d]+/g, '');
    }
}

// 191217 jwsuh 추가
// timepicki 사용시 시간 초기화
function setTime(no1, no2) {
    $('#timepicker' + no1).next().find('.time .timepicki-input').val('00');
    $('#timepicker' + no1).next().find('.mins .timepicki-input').val('00');
    $('#timepicker' + no2).next().find('.time .timepicki-input').val('23');
    $('#timepicker' + no2).next().find('.mins .timepicki-input').val('59');
}

// 191217 jwsuh 추가
// // timepicki 두 개 사용시 같은 날짜라면 시작시간이 종료시간을 초과하지 못하도록 설정
function checkTime(no1, no2) { // no1 : 시작시간 timepickr 숫자, no2 : 종료시간 timepicker 숫자

    var timepicker1Tim = Number($('#timepicker' + no1).next().find('.time .timepicki-input').val());
    var timepicker1Mini = Number($('#timepicker' + no1).next().find('.mins .timepicki-input').val());
    var timepicker2Tim = Number($('#timepicker' + no2).next().find('.time .timepicki-input').val());
    var timepicker2Mini = Number($('#timepicker' + no2).next().find('.mins .timepicki-input').val());

    if ((timepicker1Tim > timepicker2Tim)
        || (timepicker1Tim == timepicker2Tim && timepicker1Mini > timepicker2Mini)) {
        alert("시작시간이 종료시간을 초과할 수 없습니다.");
        $('#timepicker' + no2).val('23:59');
        $('#timepicker' + no2).attr({
            'data-timepicki-tim': '23',
            'data-timepicki-mini': '59'
        });
        $('#timepicker' + no2).next().find('.time .timepicki-input').val('23');
        $('#timepicker' + no2).next().find('.mins .timepicki-input').val('59');
    }

}

/*
    target 레이어 팝업
    modalName 추가 : 레이어 팝업의 타이틀명 변경, 2020-01-02, KSPARK02
    modalCode 추가 : 레이어 팝업의 라벨아이디 변경, 2020-01-02, KSPARK02
    target을 레이어ID에서 메뉴ID로 변경, 2020-01-10, KSPARK02
*/
function targetModalPopup(target, modalName, modalCode) {
    var targetPopup = $("#modalHead" + target).closest(".modal-pop");
    if (targetPopup.length == 0) {
        targetPopup = $('#' + target);
    }

    if (targetPopup.length == 0) {
        return false;
    }

    if (targetPopup.is(".noPermission")) {
        alert(__("권한이 없습니다."));
        return false;
    }

    $('body').addClass('scroll-none');
    targetPopup.addClass('active');

    if ($(document).height() > $(window).height()) {
        $('.mk-header').css('padding-right', '10px');// 2022-07-26 mk-header 팝업 노출시 튕기는 현상 제거
        $('.content').css('padding-right', '10px');
        $('.content-footer-btns').css('padding-right', '10px');
        $('.gnb-head-wrap').css('width', 'calc(100% - 300px)');
    }

    //레이어 팝업 내 목록 수 초기값을 input에 세팅, 2019-10-30, KSPARK02
    targetPopup.find("input[name=limit]").val(targetPopup.find("#list_limit").val() || 20);
    targetPopup.find("input[name=page]").val(1);

    if (modalName) {
        targetPopup.find("h1:eq(0),.modalName").text(modalName);
    }

    if (modalCode) {
        targetPopup.find(".label-id:eq(0)").text(modalCode);
    }
    return true;
}

/**
 * 현재 활성화된 레이어 안에서 객체 검색하여 반환, 2020-01-16, KSPARK02
 */
$.content = function () {
    let contentObject = { object: $("#content > *, .mk-content > *").not(".content-head").not(".modal-pop") };
    contentObject.length = contentObject.object.length;
    contentObject.$ = contentObject.find = function (selector) {
        return contentObject.object.find(selector);
    };
    contentObject.active = function (selector) {
        if (selector == undefined) {
            return contentObject.object;
        } else {
            return contentObject.object.find(selector);
        }
    };

    return contentObject;
};

/**
 * 현재 활성화된 레이어 안에서 객체 검색하여 반환, 2020-01-16, KSPARK02
 */
$.layer = function () {
    let layerObject = { object: $([]) };

    for (let i = 0; i < arguments.length; ++i) {
        layerObject.object = layerObject.object.add(getLayer(arguments[i]));
    }

    layerObject.length = layerObject.object.length;
    layerObject.$ = layerObject.find = function (selector) {
        return layerObject.object.find(selector);
    };
    layerObject.active = function (selector) {
        if (selector == undefined) {
            return layerObject.object.filter(".active");
        } else {
            return layerObject.object.filter(".active").find(selector);
        }
    };

    return layerObject;
};

/**
 * 활성화 레이어 반환, 2020-01-16, KSPARK02
 * @returns {*|jQuery}
 */
function getLayerActive() {
    return $("[id^=modalHead]").closest(".modal-pop.active:last");
}

/**
 * 해당 메뉴 레이어 반환, 2020-01-16, KSPARK02
 * @param target
 * @returns {*|jQuery}
 */
function getLayer(target) {
    var isShow = arguments.length > 1 ? arguments[1] : undefined;
    return $("#modalHead" + target + (isShow ? ".active" : "")).closest(".modal-pop");
}

/*lnb-left-tabmenu*/
function lnbLeft() {
    var lnbtabs = $('.lnb-nav-tab > li');
    lnbtabs.on('click', function () {
        var activeTab = $(this).attr('data-tab');
        $('.lnb-nav-tab > li').removeClass('active');
        $('.lnb-tab-content').removeClass('active');
        $('#' + activeTab).addClass('active');
        $(this).addClass('active');
    });

}

/*lnb*/
function lnbAccodion() {
    var lnbmenu = $('.lnb-depth-area > li > a');

    //return;
    lnbmenu.off('click').on('click', function () {
        $('');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').next().slideUp('fast');
        } else {
            $(this).addClass('active').next().slideDown('fast');
        }
        return false;
    });
}

function sideBar() {
    $('.aside-close').off('click').on('click', function () {
        var $conbox = $('.container').outerWidth(),
            $asidebox = $('.aside-wrap').width();
        $allbox = ($conbox + $asidebox);
        if ($(this).hasClass('active')) {
            $('.aside-wrap').removeClass('active');
            $('.container').removeClass('active');
            $('.content').removeClass('active');
            $('.aside-close').removeClass('active');
            $('.gnb-head-wrap').removeClass('active');
            $('.content-footer').removeClass('active');
            $('body').addClass('bgline');
        } else {
            $('.aside-wrap').addClass('active');
            $('.content').addClass('active');
            $('.container').addClass('active');
            $('.aside-close').addClass('active');
            $('.gnb-head-wrap').addClass('active');
            $('.content-footer').addClass('active');
            $('body').removeClass('bgline');
        }

        $(window).trigger('tableResize');
    });
}

function dropDown() {
    // $('.dropdown-toggle').on('click', function() {
    //     $(this).next().toggleClass('active')
    // });
}

/*확장*/
function expandAll() {
    var expandBtn = $('.expand-all-btn');
    expandBtn.on('click', function () {
        if (expandBtn.hasClass('active')) {
            $('.aside-wrap').removeClass('active');
            $('.container').removeClass('active');
            $('.gnb-head-wrap').removeClass('active');
            $('.content-footer').removeClass('active');
        } else {
            $('.aside-wrap').addClass('active');
            $('.container').addClass('active');
            $('.gnb-head-wrap').addClass('expand');
            $('.content-footer').addClass('active');
        }
    });

}

/*헤더 픽스*/
function scrollFix() {
    var $win = $(window);
    var $gnbHeadWrap = $('.gnb-head-wrap');
    $win.on('load scroll', function () {
        var win = $win.scrollTop(),
            left = $win.scrollLeft(),
            headerH = $gnbHeadWrap.height();

        $gnbHeadWrap.css('left', -left);
        if (win > headerH) {
            $gnbHeadWrap.addClass('fixed');
        } else {
            $gnbHeadWrap.removeClass('fixed').css('left', 0);
        }
    });
}

/*탭 공통*/

/* 08.21 disnone => hidden */
function tabCom() {
    $('.tab').off().on('click', '>li', function () {
        var $me = $(this),
            idx = $me.index(),
            $siblingsLi = $me.siblings("li"),
            $ul = $me.parent(),
            $tab = $ul.parent(),
            $tabContent = $tab.nextAll(".tab-content"),
            $tabContentActive = $tabContent.eq(idx);

        if (!$me.data('tab')) {
            return;
        }

        $me.addClass('active');
        $siblingsLi.removeClass('active');
        $tabContent.addClass('hidden');
        $tabContentActive.removeClass('hidden');
        // $tabContentActive.removeClass('hidden').find('.mGridTable > table').fixResize({
        //     colResize: true,
        //     resizeVer: 'flex'
        // });

        $(window).trigger('resize');
    });
}

function mainTab(e, num) {
    var num = num || 0;
    var menu = $(e).children();
    var con = $(e + '_con').children();
    var select = $(menu).eq(num);
    var i = num;

    select.addClass('active');
    con.eq(num).show();

    menu.click(function () {
        if (select !== null) {
            select.removeClass("active");
            con.eq(i).hide();
        }

        select = $(this);
        i = $(this).index();

        select.addClass('active');
        con.eq(i).show();
    });
}

/*토클버튼*/
function toggleBtn($selector) {
    $($selector || "body").find(".toggle-btn .btn").on("click", function (e) {
        //토글이 Lock 걸려야하는 상황에서 제어되지 않도록 처리, 2020-03-17, KSPARK02
        if ($(this).is(".toggleLocked")) {
            e.preventDefault();
            toggleOnIgnore(this);
            return false;
        }

        if ($(this).parent().hasClass("eTab")) {
            $(this).parent().find(".was-on").removeClass("was-on");
            $(this).parent().find(".on").addClass("was-on").removeClass("on");
            $(this).addClass("on");
        } else {
            $(this).parent().find(".was-active").removeClass("was-active");
            $(this).parent().find(".active").addClass("was-active-Was").removeClass("active");
            $(this).addClass("active");
        }
    });
}

function toggleOnIgnore(obj) {
    $(obj).parent().find(".on").removeClass("on");
    $(obj).parent().find(".was-on").addClass("on");
}

/*검색 테이블*/
function tblSearch() {

    var rows = $('.tbl-top tr');
    rowsfirst = $('.tbl-top > tr').eq(0);

    $('.btn-open').off('click').on('click', function () {
        rows.not(rowsfirst).css('border', '1px solid red')
    });

}

// mSearchEngine
function mSearchEngine() {
    //검색 닫기
    $('.mSearchEngine .eExpand').on('click', function () {
        let sFoldType = '';
        if ($('.mSearchEngine tbody').children().hasClass('rowFix') == true) {
            $('.mSearchEngine').toggleClass('expand');
            $('.btn-open').toggleClass('active');

            if ($('.mSearchEngine').hasClass('expand') === true) {
                //위로접기
                sFoldType = 'top';
            } else {
                //아래로 펼치기
                sFoldType = 'extend';
            }
        } else {
            $('.mSearchEngine').toggleClass('expandAll');
        }

        if ($(this).parents('.mSearchEngine').find('#fold_type').length < 1) {
            $(this).parents('.mSearchEngine form').append('<input type="hidden" name="fold_type" id="fold_type" value="' + sFoldType + '">');
        } else {
            $(this).parents('.mSearchEngine').find('#fold_type').val(sFoldType);
        }

    });
    //$('.mSearchEngine .eExpand').on('keydown', function(event) {

    if ($('.mSearchEngine .eFold').length > 0) {
        var $eExpand = $('.mSearchEngine .eExpand');
        $(document).on('keydown', function (event) {
            var $eActiveLayer = $(document).find('div.modal-pop');
            let bIsExistActiveLayer = false;
            $.each($eActiveLayer, function (idx, item) {
                if ($(item).hasClass('active')) {
                    bIsExistActiveLayer = true;
                    return false;
                }
            });
            if (event.which == 113 && !$eExpand.hasClass('active') && !bIsExistActiveLayer) {
                $('.mSearchEngine .eFold').trigger('click');
                // if ($('.mSearchEngine tbody').children().hasClass('rowFix') == true) {
                //     $('.mSearchEngine').toggleClass('expand');
                //     $('.btn-open').toggleClass('active');
                // } else {
                //     $('.mSearchEngine').toggleClass('expandAll');
                // }
            }
        });
    }

    //상세 검색 닫기
    $('.mSearchEngine .eFold').click(function () {
        let sFoldType = 'default';
        $('.mSearchEngine').toggleClass('folder');
        $('.mSearchEngine').removeClass('expand');
        if ($(this).parents('.mSearchEngine').hasClass('folder')) {
            //접기
            $(this).text(__('상세보기') + '(F2)');
            $(this).removeClass('active');
            sFoldType = 'default';
        } else {
            //펼치기
            $(this).text(__('상세닫기') + '(F2)');
            $(this).addClass('active');
            sFoldType = 'extend';
        }
        // btnViewEvnet("folder");

        if ($(this).parents('.mSearchEngine').find('#fold_type').length < 1) {
            $(this).parents('.mSearchEngine form').append('<input type="hidden" name="fold_type" id="fold_type" value="' + sFoldType + '">');
        } else {
            $(this).parents('.mSearchEngine').find('#fold_type').val(sFoldType);
        }

        //setFoldUrl(sFoldType);
        return false;
    });
}

// get파라미터 반환
function getNameParams(sName) {
    var results = new RegExp('[\?&]' + sName + '=([^&#]*)').exec(document.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}

function clickFoldUrl() {
    let sFoldType = getNameParams('fold_type');
    if (sFoldType == 'extend') {
        $('.mSearchEngine .eFold').trigger('click');
    }
}

function setFoldUrl(sFoldType) {
    let temp = '&fold_type=' + sFoldType;
    let sUrl = WMS.parseUrl(document.location.href).path + '?' + temp;
    //let sUrl = window.location.href + '?' + temp;
    if (typeof (history.pushState) != 'undefined') { //브라우저가 지원하는 경우
        let state = '';
        let title = '';
        history.pushState(state, title, sUrl);
    }
}

//C0101-PC0101.html
//limit 제한 minus plus

function optionTem() {
    var limit = 5,
        $btnPlus = $('.btn-row-plus'),
        clone = [],
        isFocus,
        inBox = [];

    $btnPlus.each(function (i) {
        var $tr = $(this).closest('tr').clone(),
            $rowTd = $tr.children('td[rowspan]'),
            hasRowTd = ($rowTd.length < 1) ? false : true;

        $rowTd.remove();

        var html = $tr.prop("outerHTML");
        clone[i] = html.replace('btn-row-plus', 'btn-row-minus').replace('추가', '빼기');

        (function (x) {
            $btnPlus.eq(x).on('click', function () {
                var $tr = $(this).closest('tr'),
                    $tbody = $tr.parent(),
                    $trAll = $tbody.children('tr'),
                    length = $trAll.length;

                if (length >= limit) {
                    return alert(__('최대 5개까지만 추가 가능합니다.'));
                }
                if (hasRowTd) {
                    $tr.children('td[rowspan]').attr('rowspan', length + 1)
                }
                $tbody.append(clone[x]);
            })
        })(i);
    });

    $('body').on('click', '.btn-row-minus', function () {
        var $prtTr = $(this).closest('tr');
        $prtTr.remove();
    });

    $('body').on('focusin', '.in-txt-write1 input', function () {
        var $prt = $(this).parent();
        $(this).off().on('keydown', function (e) {
            var unEmpty = this.value.trim().length > 0 ? true : false;
            if ((e.keyCode == 13 || e.keyCode == 9) && unEmpty) {
                var tmp = '<button type="button" class="search-item">' +
                    '   <i class="bg-label color3"></i>' + this.value +
                    '   <span class="item-del"></span>' +
                    '</button>';

                $prt.before(tmp);
                this.value = '';

                return false;
            }
        })
    });

    $('body').on('mouseenter mouseleave click', '.border-box', function (e) {
        var $me = $(this),
            idx = $('.border-box').index(this);

        switch (e.type) {
            case 'mouseenter':
                inBox[idx] = true;
                break;
            case 'mouseleave':
                inBox[idx] = false;
                break;
            case 'click':
                var $input = $me.find('.in-txt-write1 input');
                $me.addClass('focus');
                $input.focus();
                break;
        }
    });

    $('body').on('focusout', '.in-txt-write1 input', function () {
        var $box = $(this).closest('.border-box'),
            idx = $('.border-box').index($box);

        if (inBox[idx]) {
            return;
        }
        $box.removeClass('focus');
    });
}


function radioChange() {
    var $el = $('.tab-radio');

    $el.each(function () {
        var $me = $(this),
            $tabContent = $me.find('.optiondivs').children('div'),
            $radio = $me.find('.option-use input[type="radio"]');

        $radio.on('change', function () {
            var idx = $radio.index(this),
                $checkTab = $tabContent.eq(idx);

            $checkTab.removeClass('hidden').siblings().addClass('hidden');

            var $inTxtWrite = $checkTab.find('.in-txt-write1 input');
            if ($inTxtWrite.length > 0) {
                $inTxtWrite.first().focus();
            }
            $(window).trigger('resize');
        });
    });
}

function smToolTip() {
    $(document).on('mouseover', 'a:has(.tooltip-inner)', function () {
        var $this = $(this),
            $top = $this.offset().top + 11,
            $left = $this.offset().left;
        $('body').append('<div id="toolpanel">' + $(this).children('.tooltip-inner').html() + '<span class="tail"></span>' + '</div>');

        var w = $('#toolpanel').outerWidth() / 2 - 7;

        $('#toolpanel').css({
            'top': $top + 7 + 'px',
            'left': $left + 'px',
            'margin-left': -w + 'px',
        }).fadeIn('fast');

        return false;
    });

    $(document).on('mouseout', 'a:has(.tooltip-inner)', function () {
        $('#toolpanel').remove();
    });
}

function fn_vType(v) {
    $('.vh_all').hide();
    $('.' + v).show();
}

function fn_vType2(t, v) {
    $('.btn-toggle').removeClass('on');
    $(t).addClass('on');
    $('.vh_all').addClass('hidden');
    $('.' + v).removeClass('hidden');
}

function fn_vType3(v) {
    $('.fn_vh.vh_all').addClass('hidden');
    $('.' + v).removeClass('hidden');
}

function fn_vType4(t, v) {
    $('.' + t).addClass('hidden');
    $('.' + v).removeClass('hidden');
}

// 200204 jwsuh 추가. 라디오 박스 사용안함 선택시, input박스 비활성화
function fn_rType(radio_name, input_name) {
    var radio_selected = $("input:radio[name=" + radio_name + "]:checked").val() * 1;
    var input = $("input:text[name=" + input_name + "]");

    if (!radio_selected) {
        input.attr("disabled", true);
    } else {
        input.attr("disabled", false);
    }
}

// 200204 jwsuh 추가. 라디오 박스 사용안함 선택시, input박스 여러개 비활성화
function fn_rType2(radio_name, input_class_name) {
    var radio_selected = $("input:radio[name=" + radio_name + "]:checked").val() * 1;
    var input_text = $("." + input_class_name).find("input:text");
    var input_password = $("." + input_class_name).find("input:password");

    if (radio_selected) {
        input_text.attr("disabled", false);
        input_password.attr("disabled", false);
    } else {
        input_text.attr("disabled", true);
        input_password.attr("disabled", true);
    }
}

// 200204 jwsuh 추가. 라디오 박스가 옵션일 경우(1일때 input박스 사용)
function fn_rType3(radio_name, input_name) {
    var radio_selected = $("input:radio[name=" + radio_name + "]:checked").val() * 1;
    var input = $("input:text[name=" + input_name + "]");

    if (radio_selected == 1) {
        input.attr("disabled", false);
    } else {
        input.attr("disabled", true);
    }
}

function removeClass(el, className) {
    $(el).removeClass(className);
}

function searchManagement(el) {
    $(el).each(function () {
        var $me = $(this),
            $btn = $me.children('button');

        $btn.on('click', function () {
            $me.toggleClass('active');
        });

        $(document).on('CLICK', function (e, target) {
            var $target = $(target),
                notSelect = $target.closest($me).length < 1;

            if (notSelect) {
                $me.removeClass('active');
            }
        });
    });
}

function optionProduct() {
    var $el = $('.option-product');

    $el.each(function () {
        var $me = $(this);

        $me.on('click', '.btn-del', function () {
            var $tbody = $me.find('.grid-tbody tbody ')
        });
    })
}

function openCs(target) {
    var $btn = $('.btn-cs-detail');
    var $btnAll = $('.btn-detail-all');

    $btn.on('click', function () {
        var $me = $(this),
            $prtTr = $me.closest('tr'),
            $nextTr = $prtTr.next('tr.cs-detailview-line');

        var isOpen = $me.hasClass('open');
        if (isOpen) {
            $me.removeClass('open');
            $nextTr.hide();
            $me.parent().parent().children('td').css('border-bottom', '');
            $me.text(__('상세열기'));
        } else {
            $me.addClass('open');
            $nextTr.css('display', 'table-row');
            $me.parent().parent().children('td').css('border-bottom', '1px solid #BBB');
            $me.text(__('상세닫기'));
        }
    });

    $btnAll.on('click', function () {
        $btn.removeClass('open').trigger('click');
    })

}

function messageTab() {
    var lnbtabs = $('.linetab > li');
    var bgimg = lnbtabs.closest('.message-phone-box');
    lnbtabs.on('click', function () {
        var activeTab = $(this).attr('data-tab');
        $('.linetab > li').removeClass('active');
        $('.linetab-content').hide();
        $('#' + activeTab).show();
        $(this).addClass('active');
        if (bgimg.length) {
            if (bgimg.hasClass('active')) {
                bgimg.removeClass('active');
                $('.message-phone-box').css('background-image', 'url(/img/common/bg_phone_' + $(this).attr('data-tab-color') + '.jpg)');
            } else {
                $('.message-phone-box').addClass('active');
                $('.message-phone-box').css('background-image', 'url(/img/common/bg_phone_' + $(this).attr('data-tab-color') + '.jpg)');
            }
        }
    })
}

function toggleBox() {
    var postable = $('.pop-box-toggle table');
    var firsttr = $(postable).find('tr:first-child'),
        trs = postable.find('tr').not(firsttr);
    trs.hide();
    $('.pop-box-toggle > .btn-open').on('click', function () {
        if ((trs).css('display') == 'none') {
            trs.show();
            $(this).addClass('active');
        } else {
            trs.hide();
            $('.pop-box-toggle > .btn-open').removeClass('active')
        }
    });
}

function scrollAnim() {
    var target,
        targetP,
        scrollP,
        position;
    $('.tab-border > li > a').on('click', function (e) {
        var achor = $(this).parent();
        $(this).parent().addClass('active');
        e.preventDefault();
        target = $(this).attr('href');
        targetP = $(target).position();
        scrollH = $('.scroll-box').scrollTop();
        position = (targetP.top + scrollH) - 530 + 'px';

        $('.scroll-box').animate({
            scrollTop: position
        }, 400);
        $('.tab-border > li').not(achor).removeClass('active');
    });
}

function scrollAnim2() {
    var target,
        targetP,
        scrollP,
        powerBlue,
        position;

    // 200227 jwsuh 수정. 앵커 위치 유동적으로 변경
    $('.tool-tip-inner a').on('click', function (e) {
        e.preventDefault();
        target = $(this).attr('href');
        //		scrollH = $('.scroll-wrap').scrollTop();
        //		targetP = $(target).offset().top;
        powerBlue = $(".power-row.blue-bg");

        position = $(target).prop('offsetTop') - (powerBlue.offset().top + powerBlue.height());
        //		position = (targetP + scrollH) - 550 + 'px';

        $('.scroll-wrap').animate({
            scrollTop: position
        }, 500);
    });

}

function scrollbar() {
    var scroll = $('.scrollbar-inner.notice-type2'),
        maxHeight = $('.scrollbar-inner > table').height();

    if (maxHeight >= 665) {
        scroll.css('padding-bottom', '20px');
    } else {
        scroll.css('padding-bottom', '0');
    }
}

function scrollbodyAni() {
    var $modalBody = $('.modal-body'),
        $scrollWrap = $modalBody,
        $scrollWrap = $modalBody.find('.scroll-wrap'),
        $scrollItem = $scrollWrap.children(),
        $tabFullItem = $('.tab-full > li'),
        isClick = false,
        isScroll;

    $tabFullItem.on('click', '>a', function (e) {
        var $me = $(this);
        var $prt = $me.parent();
        var $siblings = $prt.siblings();
        var href = $me.attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.prop('offsetTop') - 145;
        var powerBlue = $(".power-row.blue-bg");

        isScroll = true;
        // 200206 jwsuh 수정. 앵커 위치 유동적으로 변경
        // 기본 > 권한등록
        if ($prt.parent().hasClass('tab-border')) {
            position = target.prop('offsetTop') - (powerBlue.offset().top + powerBlue.height());
            //            position = target.prop('offsetTop') - 505;
        }
        $scrollWrap.animate({
            scrollTop: position
        }, 500, function () {
            isScroll = false;
        });

        $siblings.removeClass('active');
        $prt.addClass('active');

        // 200305 jwsuh. 클릭 플래그
        isClick = true;
    });

    $scrollWrap.on('scroll', function () {
        if (isScroll) {
            return;
        }
        var top = this.scrollTop;
        var height = this.clientHeight;
        var positionTop = $(this).position().top;
        var cIndex;

        $scrollItem.each(function (i) {
            var posTop = $(this).position().top;
            if (posTop < (height + positionTop)) {
                cIndex = i;
            }
        });

        if (!isClick) {
            $tabFullItem.removeClass('active').eq(cIndex).addClass('active');
        }

        if (top == 0) {
            $tabFullItem.removeClass('active').eq(0).addClass('active');
        }

        // 200305 jwsuh. 클릭 플래그
        isClick = false;
    });
}

function logOpen() {
    var $logbtn = $('.log-detail-btn');
    $('.change-date-list').find('li:first-child').show();
    $logbtn.on('click', function () {
        var $openlist = $(this).closest('tr').find('.change-date-list');
        var $openlistli = $openlist.find('li:first');
        if ($openlist.find('li').not($openlistli).css('display') === 'none') {
            $openlist.children().slideDown();
            $(this).text(__('상세닫기')).addClass('open');
        } else {
            $('.change-date-list').find('li').not($openlistli).slideUp();
            $(this).text(__('상세열기')).removeClass('open');
        }
    });
}

function inputDblclick() {
    $('body').on('dblclick', '.setting .form-input-data input', function () {
        $(this).attr('readonly', false).addClass('on');
    });

    $('body').on('focusout', '.setting .form-input-data input:not(.keepOn)', function () {
        $(this).attr('readonly', true).removeClass('on');
    })

    // $('.form-input-data').on('dblclick', function() {
    //     $(this).find('input').attr('readonly', false).addClass('on');
    // });
    // $('.form-input-data input').focusout(function() {
    //     $(this).attr('readonly', true).removeClass('on');
    // });
}

function amount() {
    var $el = $('.def-number-input'),
        $btnMinus = $el.find('.minus'),
        $btnPlus = $el.find('.plus');
    $input = $el.find('.quantity');

    var event = {
        init: function () {
            this.setAlert();
            this.bind();
        },
        setAlert: function () {
            $input.each(function () {
                var $me = $(this);
                var alertMessage = $me.data('alert');
                var min = $me.data('min');
                var max = $me.data('max');

                if (min == undefined) {
                    $me.data('min', 1);
                    min = 1;
                }

                if (alertMessage) {
                    var msg = alertMessage.split(',');

                    $me.data({
                        'alertMin': __('최소') + msg[0] + ' ' + min + msg[1],
                        'alertMax': __('최대') + msg[0] + ' ' + max + msg[1]
                    });
                }
            });
        },
        bind: function () {
            $btnPlus.on('click', {
                amount: 1
            }, this.calcAmount);
            $btnMinus.on('click', {
                amount: -1
            }, this.calcAmount);
            $input.on('keyup', this.checkInput);
            $input.on('blur', this.replacePrice);
        },
        calcAmount: function (e) {
            var $me = $(this);
            var $oInput = $me.parent().find('.quantity');
            var value = parseInt($oInput.val().replace(/[^0-9]/g, ""));
            var amount = e.data.amount;
            var nextAmount = amount + value;
            var min = $oInput.data('min');
            var max = $oInput.data('max');
            var alertMessage = $oInput.data('alert');

            if (nextAmount < min) {
                if (alertMessage) {
                    alert($oInput.data('alertMin'));
                }
                return;
            }
            if (nextAmount > max) {
                if (alertMessage) {
                    alert($oInput.data('alertMax'));
                }
                return;
            }

            $oInput.val(FILTER.replaceToPrice(nextAmount));
        },
        checkInput: function () {
            this.value = this.value.replace(/[^0-9]/g, "");
            var $oInput = $(this);
            var value = parseInt(this.value);
            var min = $oInput.data('min');
            var max = $oInput.data('max');
            var alertMessage = $oInput.data('alert');

            if (value < min) {
                if (alertMessage) {
                    alert($oInput.data('alertMin'));
                }
                return $oInput.val(min);
            }
            if (value > max) {
                if (alertMessage) {
                    alert($oInput.data('alertMax'));
                }
                return $oInput.val(max);
            }
        },
        replacePrice: function () {
            var $oInput = $(this);
            var value = parseInt($oInput.val());
            var min = $oInput.data('min');
            if (isNaN(value)) {
                return $oInput.val(min);
            }
            $oInput.val(FILTER.replaceToPrice(value));
        }
    };
    event.init();
}

function tabPlus() {
    var tabForm = [];
    $(".plus-tab").each(function (i) {
        tabForm[i] = $(this).nextAll('.tab-content').first().clone();
    });

    $('body').on('click', '.btn-close-sm', function () {
        var maxLimit = 5,
            $tabItem = $(this).parent(),
            $tabGroup = $tabItem.parent(),
            $tabWrap = $tabGroup.parent(),
            tab = $tabItem.data('tab'),
            $tabContent = $tabWrap.nextAll('.tab-content[id=' + tab + ']'),
            $tabPlusWrap = $tabGroup.find('.plus-tab-wrap'),
            $tabItems = $tabGroup.children().not($tabPlusWrap),
            isLast = $tabItems.length == 1 ? true : false;

        if (isLast) {
            return;
        }
        if ($tabItems.length - 1 < maxLimit) {
            $tabPlusWrap.show();
        }

        $tabItem.remove();
        $tabContent.remove();
        $tabGroup.children(':not(".plus-tab-wrap")').first().addClass('active');
        $tabWrap.nextAll('.tab-content').first().removeClass('hidden');
    });

    /*
    $('body').on('click', '.btn-plus-tab', function () {
        alert('교체해야함.');
        return false;

        var maxLimit = 5;
        var $tabGroup = $(this).closest('.tab');
        var $tabPlusWrap = $tabGroup.find('.plus-tab-wrap');
        var $tabItemLast = $tabGroup.children().not($tabPlusWrap).last();
        var $tabWrap = $tabGroup.parent();
        var idx = $('.plus-tab').index($tabWrap);
        var $tabContents = $tabWrap.nextAll('.tab-content');

        if ($tabContents.length >= maxLimit) {
            return alert(__('최대 [N]개 생성 가능합니다.').replace("[N]", maxLimit));
        }

        var $cloneTab = tabForm[idx].clone();
        var tabData = $tabItemLast.data('tab');
        var tabName = tabData.replace(/[0-9]/g, "");
        var tabNumber = Number(tabData.replace(/[^0-9]/g, '')) + 1;
        var tabDataNew = tabName + tabNumber;

        var tabHTML = '<li data-tab=' + tabDataNew + '>' +
            '   <a href="javascript:void(0)">' +
            '       <span class="ellipsis" title="게시판">게시판</span>' +
            '   </a>' +
            '   <button type="button" class="btn btn-close-sm">닫기</button>' +
            '</li>';
        var $tabHTML = $(tabHTML);
        $tabPlusWrap.before($tabHTML);

        $cloneTab.removeClass('hidden').attr('id', tabName + tabNumber);
        $cloneTab.find('input[type="text"]').attr({
            'name': tabDataNew + '_text',
            'id'  : tabDataNew + '_text'
        });
        $cloneTab.find('input[type="checkbox"]').attr({
            'name': tabDataNew + '_chk',
            'id'  : tabDataNew + '_chk'
        });

        $cloneTab.find('.select-control').attr({
            'id': tabDataNew + '_select'
        })

        $cloneTab.find('input[type="radio"]').each(function (i) {
            var idx = parseInt(i / 2) + 1;
            var bool = i % 2 == 0 ? '_true' : '_false';
            var _name = tabDataNew + '_radio' + idx;

            $(this).attr({
                name: _name,
                id  : _name + bool,
            });
        });

        $cloneTab.addClass('hidden');
        $tabContents.last().after($cloneTab);

        if ($tabWrap.nextAll('.tab-content').length >= maxLimit) {
            $tabPlusWrap.hide();
        }
    });
    */

}

function footer() {
    var $el = $('.content-footer');
    var $pageWrap = $('.pageination-wrap');
    var $content = $('.content');
    var scrollLeft = $(window).scrollLeft();
    var $lnbPosBox = $('.lnb-pos-box');
    var $asideWrap = $('.aside-wrap');
    var $asideMain = $('.aside-wrap.main');

    var $lnbEl = $asideMain.length > 0 ? $asideMain.add($lnbPosBox) : $lnbPosBox;
    $el.css({ 'left': -scrollLeft, 'opacity': 1 });

    function positionSet() {
        scrollLeft = $(this).scrollLeft();
        $el.css('left', -scrollLeft);
        $asideWrap.css('left', -scrollLeft);
    }

    positionSet();
    $(window).on('scroll', positionSet);

    if ($el.length < 1) {
        $content.addClass('not-footer');
    } else if ($pageWrap.length > 0) {
        $content.css('padding-bottom', 60)
    }
}

function multiBarcode() {
    var data = {
        input: '',
        code: [],
        $template: null
    };

    var events = {
        init: function () {
            events.bind();
        },
        bind: function () {
            $('body').on('focusin', '#regMultiBarcode .regist-input-upper', this.focusin);
            $('body').on('keyup', '#regMultiBarcode .regist-input-upper', this.keyup);
            $('body').on('click', '#regMultiBarcode .btn-point', this.registMultiBacode);
            $('body').on('click', '#regMultiBarcode .btn-del', this.removeMultiBacode);
        },
        focusin: function () {
            var $icon = $('#regMultiBarcode .reload'),
                $message = $('#regMultiBarcode .desc-point-txt');

            $icon.hide();
            $message.hide();
        },
        keyup: function (e) {
            var engNumber = this.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
            this.value = engNumber;
            data.input = engNumber;
        },
        isEmpty: function () {
            return data.input.length < 1 ? true : false;
        },
        hasCode: function () {
            return data.code.filter(function (value) {
                return value == data.input;
            }).length > 0;
        },
        hasCodeMessage: function () {
            var $icon = $('#regMultiBarcode .reload'),
                $message = $('#regMultiBarcode .desc-point-txt');

            $icon.show();
            $message.show();
        },
        registMultiBacode: function () {
            var emptyCode = events.isEmpty();
            var hasCode = events.hasCode();

            if (emptyCode) {
                return;
            }
            if (hasCode) {
                return events.hasCodeMessage();
            }

            $template = $('<li>' +
                '	<div class="form-input-data">' +
                '		<input type="text" class="" value="' + data.input + '" readonly>' +
                '	</div>' +
                '	<button type="button" name="button" class="btn btn-del">' + __('삭제') + '</button>' +
                '</li>');

            events.registComplete();
        },
        registComplete: function () {
            data.code.push(data.input);
            $('#regMultiBarcode .setting-ele-list').append($template);
            data.input = '';
            $('#regMultiBarcode .regist-input-upper').val(data.input);
        },
        removeMultiBacode: function () {
            var $item = $(this).closest('li'),
                removeValue = $item.find('input').val();

            data.code.forEach(function (v, i, array) {
                if (v === removeValue) {
                    array.splice(i, 1);
                }
            });
            $item.remove();
        }
    };

    events.init();
}

function defaultTable() {
    var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    $('table').each(function () {
        var $tbl = $(this);
        var $scrollInner = $tbl.find('.scrollbar-inner, .scroll-bar-h254');
        var $fixedHeader = $tbl.hasClass('fixed-header');

        var customTable = $scrollInner.length > 0;

        if (customTable) {
            var $tdLast = $scrollInner.find('tbody td').last();
            var $thLast = $tbl.find('thead th').last();
            var scrollWidth = is_chrome ? 10 : 17;

            $(window).on('resize', function () {
                var hasScrollY = $scrollInner.prop('scrollHeight') > $scrollInner.prop('clientHeight');
                var tdLastWidth = $tdLast.prop('clientWidth');
                if (hasScrollY) {
                    $thLast.css('width', tdLastWidth + scrollWidth)
                }
            }).trigger('resize');
        }

        if ($fixedHeader) {
            var $tdLast = $tbl.find('tbody td').last();
            var $thLast = $tbl.find('thead th').last();
            var $tbody = $tbl.find('tbody');
            var scrollWidth = is_chrome ? 10 : 17;

            $(window).on('resize', function () {
                var hasScrollY = $tbody.prop('scrollHeight') > $tbody.prop('clientHeight');
                var tdLastWidth = $tdLast.prop('clientWidth');
                if (hasScrollY) {
                    $thLast.css('width', tdLastWidth + scrollWidth)
                }
            }).trigger('resize');
        }
    })
}

function inputSearchBox() {
    $('body').on('focusin', '.input-search-box input', function () {
        var $deleteButton = $(this).next('.btn-sarchpanel-close');
        $deleteButton.show();
    });

    $('body').on('click', '.btn-sarchpanel-close', function () {
        var $input = $(this).prev('input');
        $input.val('').focus();
    });

    $(document).on('CLICK', function (e, target) {
        var $target = $(target),
            $all = $('.input-search-box'),
            $closest = $target.closest($all),
            notSelect = $closest.length < 1;

        if (notSelect) {
            $all.find('.btn-sarchpanel-close').hide();
        } else {
            $all.not($closest).find('.btn-sarchpanel-close').hide();
        }
    });
}

var OFFSET = OFFSET || {
    scrollParent: function ($el, includeHidden) {
        var position = $el.css("position"),
            includeHidden = true,
            excludeStaticParent = position === "absolute",
            overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            scrollParent = $el.parents().filter(function () {
                var parent = $(this);
                if (excludeStaticParent && parent.css("position") === "static") {
                    //return false;
                }

                return overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") +
                    parent.css("overflow-x"));
            }).eq(0);

        var $modalBody = $el.closest('.modal-body');
        if (scrollParent) {
            if ($modalBody.length > 0) {
                scrollParent = $modalBody;
            }
        }
        return position === "fixed" || !scrollParent.length ? $('body') : scrollParent;
    },
    DOMRect: function ($el) {
        return $el.get(0).getBoundingClientRect();
    },
    Viewport: function (obj) {
        var $parent = OFFSET.scrollParent(obj.$wrap, obj.hidden),
            isParentContent = $parent.hasClass('content'),
            isParentBody = $parent.prop('nodeName') === 'BODY',
            parentTop = (isParentBody || isParentContent) ? 0 : OFFSET.DOMRect($parent).top,
            totalHeight = obj.$wrap.outerHeight(),
            offTop = OFFSET.DOMRect(obj.$wrap).top,
            limitHeight = isParentContent ? window.innerHeight : $parent.outerHeight();

        //if($parent.hasClass('content')) parentTop = 0;
        if (obj.$plus) {
            obj.$plus.each(function () {
                totalHeight += $(this).outerHeight(true);
            });
        }
        if (obj.$minus && (isParentContent || isParentBody)) {
            obj.$minus.each(function () {
                limitHeight -= $(this).outerHeight(true);
            });
        }

        // console.dir(offTop+','+parentTop)
        // console.dir((offTop - parentTop + totalHeight) +','+ limitHeight);
        //console.dir('spaceTop : ' +totalHeight +','+ (offTop - parentTop));

        return {
            show: offTop - parentTop + totalHeight > limitHeight ? false : true,
            spaceTop: totalHeight < offTop - parentTop,
        }
    }
};

// .mGridTable 없을경우, body에 autoHeight 제거
function removeAutoHeight() {
    if ($('.mGridTable').length === 0) {
        $('body').removeClass('autoHeight');
    }
}


// CS창에서 사용
function autoPageInputSizeCS(cName) {
    var pageSize = $("#cs-wrap ." + cName + " .pagination a.active input").val();
    pageSize = pageSize.toString();
    pageSize = pageSize.length;

    var ps = $("#cs-wrap ." + cName + " a.active").next().next().text();
    ps = ps.toString();
    ps = ps.length;

    var maxPageSize = $("#cs-wrap ." + cName + " a:nth-child(5)").width() + (ps * 0.42);
    maxPageSize = Math.ceil((maxPageSize) / ps);

    var inputWidth = (pageSize * maxPageSize) + 25;

    if (pageSize < 3)
        inputWidth = 36;

    $("#cs-wrap ." + cName + " .pagination a.active input").css("width", inputWidth + "px");

    // 검색결과**건 right 위치 변경.
    if ($("#cs-wrap ." + cName + " .pagination-wrap div").hasClass("top-txt-inline")) {
        var paginationWidth = $("#cs-wrap ." + cName + " .pagination:eq(1)").width();
        var rightWidth = paginationWidth + 20;
        $("#cs-wrap ." + cName + " .pagination-wrap .top-txt-inline").css("right", rightWidth);
    }
}

// 페이징의 글자 width에 맞춰 input 사이즈 조절, 최소값 36px
function autoPageInputSize($pagination) {

    if ($pagination.find("a.active input").length === 0) {
        return;
    }

    var pageSize = $pagination.find("a.active input").val();
    pageSize = pageSize.toString();
    pageSize = pageSize.length;

    var ps = $pagination.find(".total-page").text();
    ps = ps.toString();
    ps = ps.length;

    var maxPageSize = $pagination.find(".total-page").outerWidth() + (ps * 0.42);
    maxPageSize = Math.ceil((maxPageSize) / ps);

    var inputWidth = (pageSize * maxPageSize) + 25;

    if (pageSize < 3)
        inputWidth = 36;

    $pagination.find("a.active input").css("width", inputWidth + "px");
}


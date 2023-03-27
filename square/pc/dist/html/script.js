/**
 * 기본 base js
 *
 * @author hmkim04
 * @since 2019. 05. 23.
 */
var SC = SC || {};

/**
 * AJAX 표준 함수
 *
 * @param options
 */
SC.ajax = function (options) {
    $options = $.extend({
        type: 'post',
        async: true,
        dataType: 'json',
        headers: {
            //            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            'X-CSRF-TOKEN': LocalStorage.get('csrf-token', 'uncle')
        },
        beforeSend: function (res) {
            if (options.loading === true) {
                $('.ui-load').show();
            }

            delete options.loading;
        },
        success: function () {

        },
        error: function (res) {
            if (res.responseJSON.message != undefined) {
                SC.showLayerAlert({
                    sTitle: '오류',
                    sContents: res.responseJSON.message
                });
            }

            if (options.loading === true) {
                $(".ui-load").hide();
            }
        },
        complete: function (res) {
            if (options.loading === true) {
                $(".ui-load").hide();
            }
        }
    }, options);

    return $.ajax($options);
};

/**
 * 팝업창 오픈
 * @param  string 링크
 * @param   string 팝업인스턴스명
 * @width   int 팝업의 폭 (px)
 * @height  int 팝업의 높이 (px)
 * @return  instance
 */
SC.popup = function (src, name, width, height) {
    var left = (screen.width - width) / 2; //왼쪽 좌표
    var top = (screen.height - height) / 2; //상단 좌표
    var child = window.open(src, name, "width=" + width + ",height=" + height + ",left=" + left + ", top=" + top + ",resizable=yes,menubar=no,status=no,scrollbars=yes");
    child.focus();
    return child;
};

/**
 * .allChk 는 suio.js 에 포함되어 있음
 * .rowChk 일 경우 checked value 조회
 *
 * @returns {Array}
 */
SC.getCheckBoxValue = function () {
    var aChk = [];
    $('.rowChk:checked').each(function () {
        if ($(this).val() != '') {
            aChk.push($(this).val());
        }
    });

    return aChk;
};

// Alert 레이어
SC.showLayerAlert = function (oOptions) {
    // 파라미터가 오브젝트면 변수 선언 및 기본값 설정
    var sTitle = oOptions['sTitle'] || '';
    var sContents = oOptions['sContents'] || '';
    var sContentsAlign = oOptions['sContentsAlign'] || 'center';
    var oCallback = oOptions['oCallback'] || null;

    // 타이틀 설정
    $('#layerAlert #commLayerTitle').text(sTitle);

    // 내용 설정
    $('#layerAlert #commLayerContents').html(sContents).css('text-align', sContentsAlign);

    // 콜백 설정
    var oBtnConfirm = $('#layerAlert .commLayerConfirm');
    oBtnConfirm.unbind('click');
    if (oCallback !== null) {
        oBtnConfirm.bind('click', oCallback);
    }

    // 팝업 오픈
    $('#layerAlertOpen').trigger('OPEN');
};

// Confirm 레이어
SC.showLayerConfirm = function (oOptions) {
    // 파라미터가 오브젝트면 변수 선언 및 기본값 설정
    var sTitle = oOptions['sTitle'] || '';
    var sContents = oOptions['sContents'] || '';
    var sContentsAlign = oOptions['sContentsAlign'] || 'center';
    var oCallback = oOptions['oCallback'] || null;
    var oCancelCallback = oOptions['oCancelCallback'] || null;

    // 타이틀 설정
    $('#layerConfirm #commLayerTitle').text(sTitle);

    // 내용 설정
    $('#layerConfirm #commLayerContents').html(sContents).css('text-align', sContentsAlign);

    // 콜백 설정
    var oBtnConfirm = $('#layerConfirm #commLayerConfirm');
    oBtnConfirm.unbind('click');
    if (oCallback !== null) {
        oBtnConfirm.bind('click', oCallback);
    }

    // 취소 콜백 설정
    var oBtnCancel = $('#layerConfirm .commLayerCancel');
    oBtnCancel.unbind('click');
    if (oCancelCallback !== null) {
        oBtnCancel.bind('click', oCancelCallback);
    }

    // 팝업 오픈
    $('#layerConfirmOpen').trigger('OPEN');
};

/**
 * 스퀘어 디폴트 페이지 이벤트
 */
SC.setPageEvent = function () {

    // input number 형식일 때, max length 설정
    $('body').on('input', 'input[type="number"]', function (e) {
        e.preventDefault();

        if (this.value.length > this.maxLength) {
            this.value = this.value.slice(0, this.maxLength);
        }
    });

    // 도매처, 소매처, 사입삼촌 리스트 변경 시, Form의 Input에 Value 설정
    $('.select_ul li').click(function () {
        $(this).closest('ul').siblings('input[type=hidden]').val($(this).data('value'));
    });

    // 상품 이미지 url
    $('a.eProductImgUrl').click(function (e) {
        e.preventDefault;

        if (confirm('현재 페이지에서 해당 사이트를 연결하려고 하지만\n신뢰할 수 있는 사이트인지 확인 할 수 없습니다.\n연결하시겠습니까?')) {
            window.open($(this).data('url'), '_blank');
        }
    });

    // 픽업 순서설정 버튼 클릭시
    $('#btnMenuPickup').click(function () {
        SC.ajax({
            url: '/sign/action/tokenRegistered',
            success: function (res) {
                if (res['result'] === true) {
                    SC.popup(res.data.url + '/ses/basis/seller/front/pickupListPopup?access_token=' + res.data.access_token, 'pickup_list', 1100, 1000);
                }
            }
        });
    })
};

// 마우스 오버 툴팁
tooltip = function (obj, sOverView) {
    if ($(obj).length <= 0) return;

    if (sOverView) {
        var sLayerName = 'layerSelect2';
        $(document).on('mouseover showTooltip', 'li.eSelectTooltip', function (e) {
            // 마우스 오버와 키보드 컨트롤에 따라 좌표 설정을 따로 계산
            var iTopPosition = e.type === 'showTooltip' ? $(this).offset().top : e.pageY;
            var iLeftPosition = e.type === 'showTooltip' ? $(this).offset().left + $(this).outerWidth(true) : e.pageX + 15;
            var sMessage = $(this).data(sOverView);
            // 메세지가 없으면 기존에 떠있는 팝업을 제거하고 종료
            if (!sMessage) {
                $('#' + sLayerName).remove();
                return false;
            }

            if ($('body #' + sLayerName).length === 0) {
                $('body').append('<div id="' + sLayerName + '" style="display:none; border-radius: 3px;padding:5px;position: absolute;z-index: 9999;background-color: #fffdff;border: 1px solid #686868;line-height: 1.5;"><span style="opacity: 1;">' + sMessage + '</span></div>');
            } else {
                $('#' + sLayerName).text(sMessage);
            }
            $('#' + sLayerName).css({
                'top': iTopPosition,
                'left': iLeftPosition
            }).show();
        }).on('mouseout', 'li.eSelectTooltip', function () {
            $('#' + sLayerName).remove();
        }).on('click hideTooltip', document, function () {
            $('#' + sLayerName).remove();
        });

        $(obj).click('.eSelectTooltip', function (e) {
            $('#' + sLayerName).remove();
            $('.eSelect2Print').remove();
            $(obj).parent().append('<span class="eSelect2Print" style="display:none;"> ' + $(e.target).data(sOverView) + '</span>');
        });

        var sSelectedOverview = $(this).data('over_msg');
        if (sSelectedOverview) {
            $(obj).parent().append('<span class="eSelect2Print"> ' + sSelectedOverview + '</span>');
        }
    }
};

/**
 * document
 */
$(document).ready(function () {
    // 디폴트 페이지 이벤트
    SC.setPageEvent();
});

/**
 * 이지픽 스퀘어 필터
 *
 * @author ymlee03
 * @since 2019. 08. 09.
 */

var FILTER = FILTER || {};

/**
 * 숫자만 입력하능 + 복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberCtrlCV = function (chkName) {
    $('body').delegate(chkName, 'keydown', function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 37 // Left Arrow
            || keyCode == 39 // Right Arrow
            || keyCode == 65 // A
            || keyCode == 67 // C
            || keyCode == 86 // V
            || keyCode == 90); // Z
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).delegate(chkName, 'keyup', function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    }).delegate(chkName, 'blur', function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
};

/**
 * 숫자, -,  복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberHyphenCtrlCV = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 189
            || keyCode == 109
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 37 // Left Arrow
            || keyCode == 39 // Right Arrow
            || keyCode == 65 // A
            || keyCode == 67 // C
            || keyCode == 86 // V
            || keyCode == 90); // Z
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9\-]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9\-]/g, ''));
    });
};
/**
 * MES REP 제네레이터로 만들어진 파일
 * @author sjkim
 * @since 2019-04-19
 **/

var EXCEL = {
    setExcelDownload: function (obj, menu_id) {
        var sSearchQuery = $('#container form').serialize();

        $('.ui-load').show();

        EXCEL.iCheckNo = Math.floor(Math.random() * 10000);
        sSearchQuery += '&menu_id=' + menu_id + '&check_no=' + EXCEL.iCheckNo;
        var sUrl = $(obj).attr('href') + '?' + sSearchQuery;
        var iFrm = $('<iframe id="eExcelDownFrame" style="display:none;" width="100%" height="500px;" src="' + sUrl + '"></iframe>');
        iFrm.appendTo('body');

        EXCEL.bChecked = true;
        EXCEL.downloadCheck();
    },

    iCheckNo     : null,
    bChecked     : false,
    downloadCheck: function () {
        $.ajax({
            type    : 'post',
            headers : {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url     : '/util/excel/action/downloadchecked',
            data    : {
                check_no: EXCEL.iCheckNo
            },
            dataType: 'json',
            async   : false,
            error   : function (res) {
                if (res.status === 500) {
                    alert('엑셀다운로드가 실패하였습니다.');
                    return false;
                }
                $('.ui-load').hide();
            },
            success : function (res) {
                if (res.result === true) EXCEL.bChecked = true;
                if (res.result == true && EXCEL.bChecked === true) {
                    setTimeout('EXCEL.downloadCheck()', 500);
                } else if (res.result == false && EXCEL.bChecked === true) {
                    EXCEL.bChecked = false;
                    setTimeout('EXCEL.downloadCheck()', 500);
                } else if (res.result == false && EXCEL.bChecked === false) {
                    EXCEL.bChecked = false;
                    EXCEL.iCheckNo = null;
                    $('.ui-load').hide();
                }
            }
        });
    }
};
/**
 * 검색 기능 추가된 셀렉트 컴포넌트
 *
 * @author ymlee03
 * @since 2019. 07. 22.
 */
$(document).ready(function () {
    /**
     * active 클래스 적용
     */
    var style = document.createElement('style');
    style.innerHTML = '.select_ul .active { background: #f9f9f9; }';
    document.body.appendChild(style);

    /**
     * 셀렉트 UL창 선택 시, 선택되어있는 리스트로 스크롤 이동 + 검색창으로 포커스 이동
     */
    $('.ui-select').click(function () {
        var oActiveLi = $(this).find('.select_ul > li.active');
        var iIndex = oActiveLi.siblings(":visible").addBack().index(oActiveLi);
        $(this).find('.select_ul').scrollTop(iIndex * oActiveLi.height());
        $(this).find('.select_search > input').focus();
    });

    var KEYS = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };

    /**
     * 셀렉트 UL 특수 키 입력 이벤트 동작
     */
    $('.select_search > input').keydown(function (e) {
        var sKeyType = e.which;
        var oContainer = $(this).closest('.ui-select.active');

        if (sKeyType === KEYS.UP) {
            $(this).trigger('selected:previous', {});
            return false;
        } else if (sKeyType === KEYS.DOWN) {
            $(this).trigger('selected:next', {});
            return false;
        } else if (sKeyType === KEYS.ESC) {
            oContainer.removeClass('active');
            $(this).trigger('hideTooltip');
            return false;
        } else if (oContainer.attr('id') === 'divBuyerNo' && sKeyType === KEYS.ENTER) {
            // 쇼핑몰 검색은 다중 선택 이벤트 트리거 발생
            oContainer.find('.select_ul li.active').trigger('click');
            return false;
        } else if (sKeyType === KEYS.ENTER) {
            var oActiveLi = oContainer.find('.select_ul li.active');
            oContainer.find('input[type=hidden]').val(oActiveLi.data('value'));
            oContainer.find('button[type=button]').text(oActiveLi.text());
            oContainer.removeClass('active');
            $(this).trigger('hideTooltip');
            $(this).trigger('afterChange', {target: oActiveLi});
            return false;
        }
    });

    /**
     * 셀렉트 UL 검색
     */
    $('.select_search > input').on('input', '', function () {
        var oUl = $(this).parent().siblings('.select_ul');
        var oAllList = oUl.find('li');
        var sValue = $(this).val().toLowerCase();
        var sPattern = new RegExp('.*' + sValue + '.*');

        // 검색 창에 입력된 값이 있는 리스트만 Show
        oAllList.each(function (iIndex, oItem) {
            if (sPattern.test($(oItem).text().toLowerCase()) === true) {
                $(oItem).show();
            } else {
                $(oItem).hide();
            }
            $(oItem).removeClass('active');
        });

        // 검색 결과가 바뀌면 포커스는 첫번째 리스트로 이동
        var oList = oUl.find('li:visible').first();
        oList.addClass('active');
    });

    /**
     * 목록에서 위, 아래 방향키를 누를때 포커스 이동 이벤트
     */
    $('.ui-select').on('selected:previous selected:next', '', function (e) {
        var sEventType = e.type === 'selected:next' ? 'next' : 'prev';
        var oCurrentTarget = $(this).find('.select_ul li.active');
        var oNextTarget = sEventType === 'next' ? oCurrentTarget.nextAll(':visible').first() : oCurrentTarget.prevAll(':visible').first();

        // 아무것도 선택이 안되어있을때 방향키를 움직일 시, 가장 맨 위의 리스트 선택
        if (oCurrentTarget.length === 0) {
            $(this).find('.select_ul').find('li:visible').first().addClass('active');
            return false;
        }

        // 이동할 타겟이 없으면 리턴
        if (oNextTarget.length === 0) {
            return false;
        }

        // 방향이 이동 시, 현재 타겟은 클래스를 지운 후 다음 타겟에 클래스 적용
        if (oNextTarget.length > 0) {
            oCurrentTarget.removeClass('active');
            oNextTarget.addClass('active');
        }

        // 스크롤 위치 조정
        var oUl = $(this).find('.select_ul');
        var iNextTargetIndex = oUl.find('li:visible').index(oNextTarget);
        var iNextTargetPosition = iNextTargetIndex <= 0 ? 0 : oNextTarget.height() * iNextTargetIndex;

        if (sEventType === 'next' && iNextTargetPosition >= oUl.scrollTop() + oUl.height()) {
            // 방향키가 아래이면서 스크롤의 위치보다 리스트의 위치가 더 아래일 때 : 리스트가 스크롤의 맨 아래로 위치
            oUl.scrollTop(iNextTargetPosition + oNextTarget.height() - oUl.height());
        } else if (sEventType === 'next' && oUl.scrollTop() > iNextTargetPosition) {
            // 방향키가 아래이면서 스크롤의 위치보다 리스트의 위치가 더 위일 때 : 리스트가 스크롤의 맨 위로 위치
            oUl.scrollTop(iNextTargetPosition);
        } else if (sEventType === 'prev' && oUl.scrollTop() > iNextTargetPosition) {
            // 방향키가 위이면서 스크롤의 위치보다 리스트의 위치가 더 위일 때 : 리스트가 스크롤의 맨 위로 위치
            oUl.scrollTop(iNextTargetPosition);
        } else if (sEventType === 'prev' && iNextTargetPosition >= oUl.scrollTop() + oUl.height()) {
            // 방향키가 위이면서 스크롤의 위치보다 리스트의 위치가 더 아래일 때 : 리스트가 스크롤의 맨 아래로 위치
            oUl.scrollTop(iNextTargetPosition + oNextTarget.height() - oUl.height());
        }

        // 방향키 이동 시 툴팁 생성 이벤트 호출
        oNextTarget.trigger('showTooltip');
    });

    /**
     * 멀티 셀렉트 선택
     */
    $('.divSearchStore > div.ui-select li').click(function () {
        if ($(this).data('key') === '') {
            $('#divSelectArea > span').remove();
        } else {
            // 기존 데이터 삭제
            $('#divSelectArea').find('input[value="' + $(this).data('key') + '"]').closest('span').remove();

            var oStoreSpan = document.createElement('span');

            var oStoreSpanEm = document.createElement('em');
            oStoreSpanEm.innerHTML = $(this).text();

            var oStoreSpanButton = document.createElement('button');
            oStoreSpanButton.innerHTML = '삭제';
            oStoreSpanButton.setAttribute('type', 'button');
            oStoreSpanButton.setAttribute('class', 'btnStoreRemove');
            oStoreSpanButton.addEventListener('click', function () { $(this).closest('span').remove(); });

            var oStoreSpanInput = document.createElement('input');
            oStoreSpanInput.setAttribute('type', 'hidden');
            oStoreSpanInput.setAttribute('name', 'buyer_no[]');
            oStoreSpanInput.setAttribute('value', $(this).data('key'));

            oStoreSpan.appendChild(oStoreSpanEm);
            oStoreSpan.appendChild(oStoreSpanButton);
            oStoreSpan.appendChild(oStoreSpanInput);

            $('#divSelectArea').append(oStoreSpan);
        }
    });

    /**
     * 멀티 셀렉트 삭제
     */
    $('.btnStoreRemove').click(function () {
        $(this).closest('span').remove();
    });
});

/**
 * 주문 조회 화면의 공통 JS
 *
 * @author ymlee03
 * @since 2019. 05. 27.
 */
$(document).ready(function () {
    tooltip('.eSelectTooltip', 'over_msg');

    /**
     * 스타일 스크립트
     */
    $('.opener').prev().find('td').css('border-bottom', 'none');

    /**
     * 날짜 기간 3일로 제한
     */
    $('#frmOrderListSearch .datepicker').change(function (e) {
        var oStartDate = $('input[name=start_date]');
        var oEndDate = $('input[name=end_date]');
        var sStartDate = oStartDate.val();
        var sEndDate = oEndDate.val();

        // 선택 날짜 차이 계산
        var diffTime = Math.abs(new Date(sStartDate).getTime() - new Date(sEndDate).getTime());
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 7일 이상 차이 나면 사용자가 조작한 날짜를 기준으로 상대 날짜 조정
        if (diffDays > 2) {
            if ($(e.target).attr('name') === 'start_date') {
                var date = new Date(sStartDate);
                date.setDate(date.getDate() + 2);
                oEndDate.val(date.toISOString().slice(0, 10));
            } else {
                var date = new Date(sEndDate);
                date.setDate(date.getDate() - 2);
                oStartDate.val(date.toISOString().slice(0, 10));
            }
        }
    });

    /**
     * 폼의 검색 날짜 기간(발주일) 선택 시 동작
     */
    $('input[name=date_range]').change(function () {
        var range = $(this).val();
        var oStartDate = $('input[name=start_date]');
        var oEndDate = $('input[name=end_date]');

        if (range === '1') {
            oStartDate.datepicker('setDate', 'today');
            oEndDate.datepicker('setDate', 'today');
        } else {
            oStartDate.datepicker('setDate', 'today -' + range);
            oEndDate.datepicker('setDate', 'today');
        }
    });

    /**
     * 폼의 발주일 항목 날짜 이동 버튼 클릭 시, 폼 서밋 X
     */
    $('.btnDateMove').click(function (e) {
        e.preventDefault();
    });

    /**
     * 검색 버튼 클릭 시, search_type 갱신 후 폼 서밋
     */
    $('#form-submit').click(function () {
        $('input[name=selected_date]').val('');
        $('input[name=spec_method]').val('');
        $('#frmOrderListSearch').submit();
    });

    /**
     * 날짜 리스트 버튼 클릭 시, 폼 서밋
     */
    $('.date-tab > a').click(function () {
        $('input[name=selected_date]').val($(this).data('spec_date'));
        $('input[name=spec_method]').val($(this).data('spec_method'));
        $('#frmOrderListSearch').submit();
    });

    /**
     * 검색 인풋창에서 엔터를 누를 시, 폼 서밋
     */
    $('#search_value').keypress(function (e) {
        if (e.key === 'Enter') {
            $('input[name=selected_date]').val('');
            $('#frmOrderListSearch').submit();
        }
    });

    /**
     * 리셋 버튼 클릭 시, 검색 데이터 초기화 후 폼 서밋 X
     */
    $('#btnReset').click(function () {
        window.location = window.location.pathname;
    });

    /**
     * 삼촌 전달 메모 (확인메모) 보기
     */
    $('#btnOrderUncleMemo').click(function (e) {
        e.preventDefault();
        $('#layerOrderUncleMemo').trigger('OPEN');
    });

    /**
     * 테이블 아코디언
     */
    /* 2020-08-12 EZP-798 */
    $('.opener .btn-opener').click(function () {
        var sType = $(this).data('type') === 'seller' ? '.seller' : '';
        var oPrtTr = $(this).closest('tr');
        var oNextItems = oPrtTr.nextUntil('tr.trOpener' + sType, 'tr');
        if($(this).data('type') == 'detail'){
            oNextItems = oPrtTr.nextUntil('tr.trOpener, tr.trdetailOpener', 'tr.indetail');
        }

        if ($(this).data('type') === 'seller') {
            oNextItems.toggleClass('seller-hidden');
        } else if ($(this).data('type') === 'buyer') {
            oNextItems.toggleClass('buyer-hidden');
        } else{
            oNextItems.toggleClass('detail-hidden');
        }

        $(this).toggleClass('active');
    });
    /* // 2020-08-12 EZP-798 */

    /**
     * 전체 선택 버튼 클릭 시, 테이블 안의 체크박스 모두 체크
     */
    $('.check-all').click(function () {
        $('.result-table .checkbox input:enabled').prop('checked', this.checked);
    });

    /**
     * '담당자 이력' 버튼 클릭시, 팝업 오픈과 히스토리 요청
     */
    $('.btnChargeHistory').click(function () {
        var iSsNo = {'ss_no': $(this).data('ss_no')};

        SC.ajax({
            url: '/order/action/getChargeHistory',
            data: iSsNo,
            success: function (res) {
                // 히스토리 레코드 생성
                var sTableRowHtml = '';
                res.forEach(function (oHistoryData) {
                    sTableRowHtml += '<tr><td>' + oHistoryData['created_ts'] + '</td><td>' + oHistoryData['uncle_name'] + '</td></tr>';
                });

                // 테이블 바디에 append
                $('#tblHistory').find('tbody').html(sTableRowHtml);

                // 팝업 오픈
                $('#layerChargeHistory').trigger('OPEN');
            }
        });
    });

    /**
     * 낮/밤 셀렉트 선택시, 마켓, 도매처 리스트 초기화
     */
    $('#divIsOpened ul').on('click', 'li', function () {
        var sIsOpened = $(this).data('value');
        _setSelectList(sIsOpened, true);
        _setSelectList(sIsOpened, false);
        _setBuyerList();
    });

    /**
     * 마켓 셀렉트 선택시, 도매처 리스트 초기화
     */
    $('#divMarketNo ul').on('click', 'li', function () {
        var iMarketNo = $(this).data('value');
        _setSelectList(iMarketNo, false);
        _setBuyerList();
    });

    /**
     * 마켓 셀렉트 엔터로 선택시, 도매처 리스트 초기화
     */
    $('#divMarketNo .select_search > input').on('afterChange', '', function (e, oData) {
        var iMarketNo = oData['target'].data('value');
        _setSelectList(iMarketNo, false);
        _setBuyerList();
    });

    /**
     * 도매처 셀렉트 선택시, 쇼핑몰 리스트 초기화
     */
    $('#divSellerNo ul').on('click', 'li', function () {
        var iSellerNo = $(this).data('value');
        _setBuyerList(iSellerNo);
    });

    /**
     * 도매처 셀렉트 엔터로 선택시, 쇼핑몰 리스트 초기화
     */
    $('#divSellerNo .select_search > input').on('afterChange', '', function (e, oData) {
        var iSellerNo = oData['target'].data('value');
        _setBuyerList(iSellerNo);
    });

    /**
     * 마켓, 도매처 셀렉트 리스트 셋팅
     */
    function _setSelectList(mData, isMarketList) {
        var oContainer = isMarketList === true ? $('#divMarketNo') : $('#divSellerNo');

        // 데이터 타입에 따라 마켓 리스트 Show or Hide
        if (mData == '' || mData == null) {
            // 값이 없으면 모든 데이터 Show
            oContainer.find('ul li').removeClass('hidden');
        } else if (mData == 'D' || mData == 'N') {
            // 값이 D나 N이면 마켓 타입을 기준으로 Show
            oContainer.find('ul li').not(':first').addClass('hidden');
            oContainer.find('ul li[data-is_opened=' + mData + ']').removeClass('hidden');
        } else {
            // 나머지(값이 숫자)는 마켓 번호를 기준으로 Show
            oContainer.find('ul li').not(':first').addClass('hidden');
            oContainer.find('ul li[data-market_no=' + mData + ']').removeClass('hidden');
        }

        // 셀렉트의 텍스트 및 value 초기화
        oContainer.find('button[type=button]').text('전체');
        oContainer.find('input[type=hidden]').val('');
        oContainer.find('ul li').removeClass('active');
    }

    /**
     * 쇼핑몰 리스트 셋팅
     */
    function _setBuyerList(iSellerNo) {
        var aBuyerNo = [];
        var oDivBuyer = $('#divBuyerNo');
        var oDivSeller = $('#divSellerNo');

        // 쇼핑몰 리스트 초기화
        $('#divSelectArea > span').remove();
        oDivBuyer.find('ul li').addClass('hidden');

        // 도매처 번호가 있으면 해당 도매처 의 buyer_no_list를 배열로, 없으면 현재 보여지고 있는 도매처 리스트들의 buyer_no_list를 배열로 생성
        if (iSellerNo != undefined && iSellerNo != '') {
            aBuyerNo = oDivSeller.find('ul li[data-value=' + iSellerNo + ']').data('buyer_no_list').toString().split(',');
        } else {
            oDivSeller.find('ul li').not('.hidden').not(':first').each(function () {
                aBuyerNo = aBuyerNo.concat($(this).data('buyer_no_list').toString().split(','));
            });

            // buyer_no 중복 키 제거
            aBuyerNo = aBuyerNo.filter(function (iBuyerNo, iIndex) {
                return aBuyerNo.indexOf(iBuyerNo) === iIndex;
            });
        }

        // buyer_no가 일치하는 쇼핑몰 리스트 Display
        aBuyerNo.forEach(function (iBuyerNo) {
            oDivBuyer.find('ul li[data-key=' + iBuyerNo + ']').removeClass('hidden');
        });
    }

    /**
     * 엑셀 다운로드
     */
    $('.btnExcelDown').click(function (e) {
        e.preventDefault();

        if ($('#eListArea tr').length === 0) {
            SC.showLayerAlert({
                sTitle: '알림',
                sContents: '다운로드 받을 내용이 없습니다.'
            });
            return false;
        }
        EXCEL.setExcelDownload(this);
    });

    /**
     * 인쇄하기
     */
    $('#btnPrint').click(function (e) {
        e.preventDefault();

        if ($('#eListArea tr').length == 0) {
            SC.showLayerAlert({
                sTitle: '알림',
                sContents: '항목이 존재하지 않습니다.'
            });
            return false;
        }

        var sUrl = $(this).attr('href');
        var sParams = $('form').serialize();

        SC.popup(sUrl + '?' + sParams, 'order_print', 1500, 800);
    });

    /**
     * 카카오 발주서 팝업
     */
    $('.ePopupSellerSpec').click(function (e) {
        e.preventDefault();

        var sUrl = $(this).attr('href');
        SC.popup(sUrl, 'spec_seller_spec_uncle', 1100, 800);
    });

    /**
     * 폼의 전체 체크 버튼
     */
    $('.divCustomCheckBox .btnAllChk').click(function () {
        var aInput = $(this).closest('div').find('input');
        $(aInput).prop('checked', $(this).prop('checked'));
    });

    /**
     * 상단 폼의 데이터 피커
     */
    $('.datepicker-wrap.small .datepicker').datepicker('destroy');
    $('.datepicker-wrap.small .datepicker').datepicker({
        buttonImage: '/img/square/calendar2.png',
        buttonImageOnly: true,
        buttonText: 'Select date',
        showButtonPanel: true,
        showMonthAfterYear: true,
        dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        showOn: 'both',
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'yy-mm-dd',
        closeText: '선택',
        autoClose: true
    });

    clacFromToDate('.date-wrap');
});

/**
 * 체크된 도매처 리스트의 개수가 0인지 확인
 */
function checkCheckedList() {
    if ($('.sellerList:checked').size() === 0) {
        SC.showLayerAlert({
            sTitle: '알림',
            sContents: '선택된 주문이 없습니다.'
        });
        return false;
    }
    return true;
}

/**
 * 캘린더 라이브러리
 */
var clacFromToDate = function (selector) {
    var $el = $(selector),
        $from = $el.find('.from'),
        $to = $el.find('.to'),
        $prev = $el.find('.prev'),
        $next = $el.find('.next'),
        $btnToday = $el.find('.btn_today'),
        $btnRange = $el.find('.btn_range');

    var data = {
        today: new Date(),
        week: ['일', '월', '화', '수', '목', '금', '토'],
    };

    var events = {
        _init: function () {
            //            this._setDatePicker();
            this._bind();
        },
        _setDatePicker: function () {
            var today = this.GetToday(),
                nextWeekDay = this.GetFewDay(data.today, 7);

            $from.datepicker('setDate', today);
            $to.datepicker('setDate', nextWeekDay);
        },
        _bind: function () {
            $prev.on('click', {
                dir: -1
            }, $.proxy(this._calcNearDay, this));
            $next.on('click', {
                dir: 1
            }, $.proxy(this._calcNearDay, this));
            $btnToday.on('click', $.proxy(this._selectToday, this));
            $btnRange.on('click', $.proxy(this._selectRangeDay, this));
            $to.on('beforeShow', function () {
                var minDate = $from.datepicker('getDate');
                var maxDate = $to.datepicker('getDate');

                $to.datepicker('option', 'minDate', minDate);
                $from.datepicker('option', 'maxDate', maxDate);
            })
        },
        _selectToday: function (e) {
            var $target = $(e.currentTarget),
                today = this.GetToday();

            $target.addClass('active').siblings('button').removeClass('active');
            $from.datepicker('setDate', today);
            $to.datepicker('setDate', today);
        },
        _selectRangeDay: function (e) {
            var $target = $(e.currentTarget),
                range = $target.data('range');

            //            var rangeDay = this.GetFewDay($from.datepicker('getDate'), range);
            $target.addClass('active').siblings('button').removeClass('active');
            //            $to.datepicker('setDate', rangeDay);

            $to.datepicker('setDate', this.GetToday());
            var rangeDay = this.GetFewDay($to.datepicker('getDate'), -1 * range);
            $from.datepicker('setDate', rangeDay);
        },
        _calcNearDay: function (e) {
            $to.datepicker('option', 'minDate', null);
            var dir = e.data.dir;
            var fromDay = this.GetFewDay($from.datepicker('getDate'), dir);
            var toDay = this.GetFewDay($to.datepicker('getDate'), dir);

            $from.datepicker('setDate', fromDay);
            $to.datepicker('setDate', toDay);
        },
        GetToday: function () {
            var formatToday = this.GetFormatDay(data.today);
            return formatToday;
        },
        GetFewDay: function (standardDay, day) {
            var date = new Date(standardDay);
            var dayMilliSeconds = day * 24 * 60 * 60 * 1000;
            var fewDay = date.getTime() + dayMilliSeconds;
            date.setTime(fewDay);
            var formatFewDay = this.GetFormatDay(date);

            return formatFewDay;
        },
        GetFormatDay: function (date) {
            var year = date.getFullYear();
            var month = new String(date.getMonth() + 1);
            var day = new String(date.getDate());
            //            var week = data.week[date.getDay()];
            //            return year + '.' + month + '.' + day + '.' + week;
            return year + '-' + month + '-' + day;
        }
    };

    events._init();
};

/**
 * 테이블의 입고 처리 관련 JS
 *
 * @author ymlee03
 * @since 2019. 05. 23.
 */
$(document).ready(function () {
    FILTER.chkNumberCtrlCV('.txtInQty');

    /**
     * 입고수량이 변경되었을 경우, DB에 업데이트
     */
    $('.txtInQty').on('change', function () {
        var oThis = $(this);
        var oData = {};
        oData['ss_no'] = $(this).data('ss_no');
        oData['ss_item_no'] = $(this).data('ss_item_no');
        oData['in_qty'] = $(this).val() === '' ? 0 : $(this).val();

        SC.ajax({
            url: '/order/action/inQtyModified',
            data: oData,
            success: function () {
                // 입고 수량 수정시 소매처 합계 금액 다시 계산 (샘플 제외)
                _calcBuyerSummary(oThis.data('seller_buyer_key'));
            }
        });
    });

    /**
     * 도매처별 소매처의 입고금액/발주금액 계산
     */
    function _calcBuyerSummary(sSellerBuyerKey) {
        var aArr = $('.txtInQty[data-seller_buyer_key=' + sSellerBuyerKey + ']');

        var iSum = 0;
        var iSumNew = 0;
        var iSumBadRefunded = 0;
        var iSumOverQty = 0;
        aArr.each(function () {
            var iSpecItemType = $(this).data('spec_item_type');
            var iOrderPrice = parseInt($(this).data('order_price'));
            var iOrderQty = parseInt($(this).data('order_qty'));
            var iInQty = $(this).val() != '' ? parseInt($(this).val()) : 0;
            var sIsRefunded = $(this).data('is_refunded');
            var isOverQty = iOrderQty < iInQty ? true : false;

            // 신규 입고 계산
            if (iSpecItemType == 10) {
                iSumNew += iOrderPrice * iInQty;
            }

            // 불량 and (환불 or 매입 ) and 과입고 X 계산
            if (iSpecItemType == 30 && (sIsRefunded == 'T' || sIsRefunded == 'H') && isOverQty === false) {
                iSumBadRefunded += iOrderPrice * (iOrderQty - iInQty);
            }

            // 미송이나 불량이면서 과입고 수량 계산
            if ((iSpecItemType == 20 || iSpecItemType == 30) && isOverQty === true) {
                iSumOverQty += iOrderPrice * (iInQty - iOrderQty);
            }
        });

        // 합계 계산
        iSum = iSumNew - iSumBadRefunded + iSumOverQty;

        // 소매처 합계 금액 텍스트 설정 및 이전 입고 수량 설정
        var oSpnBuyerAmt = $('tr[data-seller_buyer_key=' + sSellerBuyerKey + ']').find('.in_amt');
        var sBuyerAmgText = new Intl.NumberFormat().format(iSum);
        oSpnBuyerAmt.text(sBuyerAmgText);
    }

    /**
     * 입고수량, 메모, 입고 예정일에서 키보드 상하좌우 키로 이동
     */
    $('input[tabindex]').keydown(function (e) {
        if (e.key.indexOf('Arrow') !== -1) {
            var iTextLength = String($(this).val()).length;
            var iCursorPosition = e.target.selectionStart;

            // 상하 / 좌우 두가지 조건에 따라 인덱스 계산 후 포커스 이동
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                var iTabIndex = Number($(this).attr('tabindex'));
                iTabIndex = e.key === 'ArrowDown' ? iTabIndex + 1 : iTabIndex - 1;
                $('input[tabindex=' + iTabIndex + ']').focus();
                // 포커스 좌우 이동 조건 : 텍스트가 없음 OR 텍스트의 커서가 맨 마지막 이면서 오른쪽 OR 텍스트의 커서가 처음이면서 왼쪽
            } else if (iTextLength == 0 || (iTextLength > 0 && iCursorPosition === iTextLength && e.key === 'ArrowRight') || (iTextLength > 0 && iCursorPosition === 0 && e.key === 'ArrowLeft')) {
                var iTabIndex = Number($(this).data('index'));
                iTabIndex = e.key === 'ArrowRight' ? iTabIndex + 1 : iTabIndex - 1;
                $(this).closest('tr').find('input[data-index="' + iTabIndex + '"]').focus();
            }
        }
    });

    /**
     * '입고 예정일' 버튼 클릭시, 팝업 오픈과 입고 예정일 요청
     */
    $('.btnExpectedDate').click(function () {
        var oExpectedDateContainer = $(this).parent();
        var oExpectedDateLayer = $('#divExpectedDate');
        var iSsItemNo = $(this).data('ss_item_no');

        // 입고 예정일 창이 열려있으면서 같은 입고 예정일창을 클릭 시, 입고 예정일 창 닫음
        if (oExpectedDateLayer.is(':visible') === true && iSsItemNo === oExpectedDateLayer.data('ss_item_no')) {
            oExpectedDateLayer.hide();
            return false;
        }

        SC.ajax({
            url: '/order/action/getExpectedDate',
            data: {'ss_item_no': iSsItemNo},
            success: function (res) {
                var sExpectedDate = res['aData']['expected_date'];

                $('.btnDate.active').removeClass('active');

                // 해당 날짜의 버튼 엑티브
                if (sExpectedDate == null) {
                    $('.btnDate.none').addClass('active');
                } else {
                    $('.btnDate[data-value=' + sExpectedDate + ']').addClass('active');
                }

                oExpectedDateContainer.append(oExpectedDateLayer);
                oExpectedDateLayer.data('ss_item_no', iSsItemNo);
                oExpectedDateLayer.show();
            }
        });
    });

    /**
     * '입고 예정일 버튼 리스트' 클릭시, 입고 예정일 변경
     */
    $('.divExpectedDateContainer .btnDate').click(function () {
        var sExpectedDate = $(this).data('value');

        // 날짜 형식 밸리데이션
        var sPattern = new RegExp(/^[12][0-9]{3}-(([0]?[1-9])|([1][012]))-([0]?[1-9]|[12][0-9]|[3][0-1])$/);
        if (sExpectedDate !== '' && sExpectedDate !== '0000-00-00' && sPattern.test(sExpectedDate) === false) {
            SC.showLayerAlert({
                sTitle: '오류',
                sContents: '정상적인 날짜 형식이 아닙니다.'
            });
            return false;
        }

        var oData = {};
        oData['ss_item_no'] = $('#divExpectedDate').data('ss_item_no');
        oData['expected_date'] = sExpectedDate;
        _requestExpectedDateAjax(oData);
    });

    /**
     * 입고 예정일 변경 에이잭스
     */
    function _requestExpectedDateAjax(oData) {
        SC.ajax({
            url: '/order/action/expectedDateModified',
            data: oData,
            success: function () {
                // 팝업 히든
                $('#divExpectedDate').hide();

                // '선택 안함' 버튼 클래스 추가 / 제거
                var oBtnExpectedDate = $('.btnExpectedDate[data-ss_item_no=' + oData['ss_item_no'] + ']');
                if (oData['expected_date'] == '') {
                    oBtnExpectedDate.addClass('tdNoneSelected');
                } else {
                    oBtnExpectedDate.removeClass('tdNoneSelected');
                }

                // 버튼 텍스트 설정
                var sBtnText = oData['expected_date'] == '' ? '선택안함' : $('.btnDate[data-value=' + oData['expected_date'] + ']').text();
                oBtnExpectedDate.text(sBtnText);
            },
        });
    }

    /**
     * '입고 예정일 닫힘 버튼'
     */
    $('.divExpectedDateContainer .btn_close').click(function () {
        $('#divExpectedDate').hide();
    });

    /**
     * 입고수량 클릭 시, 0일 때는 숫자 제거
     */
    $('.txtInQty').on('focus blur', function (e) {
        if (e.type === 'focus' && $(this).val() == 0) {
            $(this).val('');
        } else if (e.type === 'blur' && $(this).val() === '') {
            $(this).val(0);
        }
    });

    /**
     * '주문 메모' 자동 저장 조건
     *  1. 입력 후, 0.4초 동안 입력이 없을 시
     *  2. 입력 도중 저장되지 않은 채로 포커스 아웃 될 시
     */
    var oDebouncing;
    var isEdit;  // 포커스 아웃 시, 수정 되었을때만 저장 하는 플래그
    $('.edit_memo').on('input blur', function (e) {
        if (oDebouncing) {
            clearTimeout(oDebouncing);
        }

        var oData = {};
        oData['ss_item_no'] = $(this).data('ss_item_no');
        oData['in_memo'] = $(this).val();

        // 메모가 수정 되었을 때, 포커스가 나가면 바로 저장
        if (e.type === 'blur' && isEdit === true) {
            sendAjax();
            isEdit = false;
        } else if (e.type === 'input') {
            oDebouncing = setTimeout(sendAjax, 400);
            isEdit = true;
        }

        function sendAjax() {
            SC.ajax({
                url: '/order/action/orderMemoModified',
                data: oData,
                success: function () {
                    isEdit = false;
                },
            })
        }
    });

    /**
     * 메모 마우스 오버 툴팁
     */
    $('[data-memo_tooltip]').on('mouseover mouseout', function (e) {
        var sMessage = $(this).data('memo_tooltip');

        // 메세지가 없으거나 마우스가 아웃될 시 기존에 떠있는 팝업을 제거하고 종료
        if (!sMessage || e.type === 'mouseout') {
            $('#memoTooltip').remove();
            return false;
        }

        if ($('body #memoTooltip').length === 0) {
            $('body').append('<div id="memoTooltip" style="display:none; border-radius: 3px;padding:5px;position: absolute;z-index: 9999;background-color: #fffdff;border: 1px solid #686868;line-height: 1.5;"><span style="opacity: 1;">' + sMessage + '</span></div>');
        } else {
            $('#memoTooltip').text(sMessage);
        }
        // 2020-12-15 EZP-1894
        var memo_width = $(document).width() - e.pageX - 15;
        $('#memoTooltip').css({
            'top': e.pageY,
            'left': e.pageX + 15,
            'max-width': memo_width+'px'
        }).show();
    });

    /**
     * '품절 처리' 라디오 버튼 클릭시, 품절 처리 데이터 변경
     */
    $('.rdoToggle').change(function () {
        var oData = {};
        oData['ss_item_no'] = $(this).data('ss_item_no');
        oData['is_refunded'] = $(this).val();

        _requestIsRefundedAjax(oData);
    });

    /**
     * '품절 처리' 변경 요청 에이잭스
     */
    function _requestIsRefundedAjax(oData) {
        SC.ajax({
            url: '/order/action/soldOutModified',
            data: oData,
            success: function () {
                // 1. 품절 처리에 따라 상품 상태 버튼 초기화
                var oSoldoutStatus = $('.btnItemSoldoutStatus[data-ss_item_no=' + oData['ss_item_no'] + ']');
                if (oData['is_refunded'] === 'F') {
                    oSoldoutStatus.addClass('tdNoneStatus');
                    oSoldoutStatus.text('상태');
                }

                // 2. 취소 버튼 시, 타겟 롤백을 위한 히든 값 수정
                $('#txtSoldOutType' + oData['ss_item_no']).val(oData['is_refunded']);

                // 3. 소매처 금액 갱신
                var oInQty = $('.txtInQty[data-ss_item_no=' + oData['ss_item_no'] + ']');
                oInQty.data('is_refunded', oData['is_refunded']);

                _calcBuyerSummary(oInQty.data('seller_buyer_key'));
            }
        });
    }

    /**
     * '상품 상태 버튼 클릭시' 상품 상태 리스트 팝업 오픈
     */
    $('.btnItemSoldoutStatus').click(function () {
        var iSsItemNo = $(this).data('ss_item_no');

        SC.ajax({
            url: '/order/action/getItemSoldOutStatus',
            data: {'ss_item_no': iSsItemNo},
            success: function (res) {
                var sItemSoldoutStatus = res['aData']['item_soldout_status'];
                $('.btnItemSoldoutStatusList.active').removeClass('active');

                // 값이 있으면 해당 버튼 활성화
                if (sItemSoldoutStatus != '' && sItemSoldoutStatus != null) {
                    var aItemSoldoutStatus = sItemSoldoutStatus.split(',');
                    aItemSoldoutStatus.forEach(function (iVal) {
                        $('.btnItemSoldoutStatusList[data-value=' + iVal + ']').addClass('active');
                    })
                }

                // 팝업의 ss_item_no 설정 후 팝업 오픈
                $('#eItemSoldoutStatusSsItemNo').val(iSsItemNo);
                $('#layerItemSoldoutStatus').trigger('OPEN');
            }
        });
    });

    /**
     * 상품 품절 상태 팝업의 버튼 이벤트
     */
    $('div.divCustomCheckToggle > button').click(function () {
        $(this).toggleClass('active');
    });

    /**
     * 상품 품절 상태 팝업의 저장 버튼 클릭
     */
    $('#btnItemSoldoutStatusSubmit').click(function () {
        var aItemSoldoutStatus = [];
        $('div.divCustomCheckToggle > button.btnItemSoldoutStatusList.active').each(function () {
            if ($(this).data('value') != '') {
                aItemSoldoutStatus.push($(this).data('value'));
            }
        });

        var iSsItemNo = $('#eItemSoldoutStatusSsItemNo').val();

        //  품절처리가 매입이면 환불로 자동 변경된다는 메세지 출력 X
        var sAddText = '';
        if ($('#toggleHold' + iSsItemNo).attr('checked') !== 'checked') {
            sAddText = '<br><br>(*상품상태 선택 시,<br>품절처리방식은 환불로 자동 변경됩니다.)';
        }

        SC.showLayerAlert({
            sTitle: '알림',
            sContents: '상품상태 선택이 완료되었습니다.' + sAddText,
            oCallback: function () {
                _setItemSoldStatusSsItemNo(aItemSoldoutStatus);
            }
        });

    });

    /**
     * 상품 품절 상태 수정 요청
     */
    function _setItemSoldStatusSsItemNo(aItemSoldoutStatus) {
        var iSsItemNo = $('#eItemSoldoutStatusSsItemNo').val();
        var bIsReserved = $('#toggleReserve' + iSsItemNo).attr('checked') === 'checked';

        // 현재 품절처리 상태가 미송이면서 아무것도 선택 안되어있으면 리턴
        if (bIsReserved === true && aItemSoldoutStatus.length == 0) {
            return false;
        }

        SC.ajax({
            url: '/order/action/itemSoldoutStatusModified',
            data: {
                'ss_item_no': iSsItemNo,
                'item_soldout_status': aItemSoldoutStatus.join(',')
            },
            success: function (res) {
                var oBtnItemSoldoutStatus = $('.btnItemSoldoutStatus[data-ss_item_no=' + iSsItemNo + ']');
                if (res['data'] == '' || res['data'] == null) {
                    oBtnItemSoldoutStatus.text('상태');
                    oBtnItemSoldoutStatus.addClass('tdNoneStatus');
                } else {
                    oBtnItemSoldoutStatus.text(res['data']);
                    oBtnItemSoldoutStatus.removeClass('tdNoneStatus');
                }

                // 환불 상태로 변경
                if ($('#toggleReserve' + iSsItemNo).attr('checked') === 'checked') {
                    $('#toggleRefund' + iSsItemNo).click();
                    $('#txtSoldOutType' + iSsItemNo).val('T');
                }
            }
        });
    }

    /**
     * 소매처 픽업 상태 변경
     */
    $('td.tdBuyerHeader ul li').click(function (e) {
        e.preventDefault();
        var oData = {};
        var iSellerKey = $(this).closest('tr').data('seller_key');
        var sSellerBuyerKey = $(this).closest('tr').data('seller_buyer_key');

        oData['pickup_status'] = $(this).data('value');
        oData['ss_buyer_no'] = [];

        // 발주서 헤드의 데이터 가공
        $('tr[data-seller_buyer_key=' + sSellerBuyerKey + ']').each(function () {
            if ($(this).data('ss_buyer_no') != undefined) {
                oData['ss_buyer_no'].push($(this).data('ss_buyer_no'));
            }
        });

        $(this).closest('.ui-select').removeClass('active');
        SC.ajax({
            url: '/order/action/setBuyerPickupStatus',
            data: oData,
            success: function () {
                // 상태 변경된 소매처의 아코디언 보이기 설정
                var oTrBuyer = $('tr.buyer[data-seller_buyer_key=' + sSellerBuyerKey + ']');
                var oNextItems = oTrBuyer.nextUntil('tr.trOpener', 'tr');
                var oBtnAccordion = oTrBuyer.find('.btn-opener');

                if (oData['pickup_status'] == '50') {
                    oNextItems.addClass('buyer-hidden');
                    oBtnAccordion.addClass('active');
                } else {
                    oNextItems.removeClass('buyer-hidden');
                    oBtnAccordion.removeClass('active');
                }

                // 상태별 도매처 헤더 설정
                var aTrBuyerHeader = $('tr.buyer[data-seller_key=' + iSellerKey + ']');
                var aBuyerStatus = [];
                var iWatingCnt = 0;
                var iCompletedCnt = 0;

                // 상태 데이터 셋팅
                aTrBuyerHeader.each(function () {
                    var sSellerBuyerKey = $(this).data('seller_buyer_key');
                    var iSellerBuyerStatus = $('#eBuyerStatus' + sSellerBuyerKey).val();
                    aBuyerStatus.push(iSellerBuyerStatus);

                    // 대기와 완료 상태 카운팅
                    if (iSellerBuyerStatus == '10') {
                        iWatingCnt++;
                    }
                    if (iSellerBuyerStatus == '50') {
                        iCompletedCnt++;
                    }
                });

                // 변경된 상태에 따라 도매처 헤더의 카운트 숫자과 버튼 상태 변경
                var eTrSeller = $('tr.seller[data-seller_key=' + iSellerKey + ']');
                var eBtnStatus = eTrSeller.find('.btnStatus');
                var eSpnStatusCount = eTrSeller.find('.spnStatusCount');
                if (aBuyerStatus.length == iWatingCnt) {
                    eBtnStatus.text('대기');
                    eBtnStatus.removeClass('completed working');
                    eBtnStatus.addClass('wait');
                } else if (aBuyerStatus.length == iCompletedCnt) {
                    eBtnStatus.text('완료');
                    eBtnStatus.removeClass('wait working');
                    eBtnStatus.addClass('completed');
                } else {
                    eBtnStatus.text('진행중');
                    eBtnStatus.removeClass('wait completed');
                    eBtnStatus.addClass('working');
                }

                var sCountText = iCompletedCnt + ' / ' + aBuyerStatus.length;
                eSpnStatusCount.text(sCountText);
            }
        });
    });
});

/**
 * 전체 주문 조회
 *
 * @author ymlee03
 * @since 2019. 05. 23.
 */
$(document).ready(function () {
    /**
     * '담당자 지정' 버튼 클릭시, 확인 팝업
     */
    $('#btnOrderAssign').click(function () {
        // 체크된 리스트가 있는지 확인
        if (checkCheckedList() === false) {
            return false;
        }

        // 체크된 주문 리스트들을 추가하여 팝업 오픈
        var aSellerList = $('.sellerList:checked');
        var oTblSellerList = $('#tblSellerList tbody');
        oTblSellerList.find('tr').remove();

        aSellerList.each(function (index, oSeller) {
            var sSeller = $(oSeller).data('seller_name');
            var sUncle = $(oSeller).data('uncle_name');
            var oOption = $('<tr><td>' + sSeller + '</td><td>' + sUncle + '</td></tr>');

            oTblSellerList.append(oOption);
        });

        $('#layerOrderAssign').trigger('OPEN');
    });

    /**
     * '담당자 지정 확인' 버튼 클릭시, 도매처들의 담당자를 선택된 삼촌으로 지정
     */
    $('#btnOrderChargeModify').click(function () {
        var oData = {};
        var iStaffNo = $('#layerUncleNo').val();

        if (iStaffNo === '' || iStaffNo === 0) {
            SC.showLayerAlert({
                sTitle: '알림',
                sContents: '사입 삼촌을 선택해주세요.'
            });
            return false;
        }

        oData['uncle_no'] = iStaffNo;
        oData['ss_no'] = [];
        $('.sellerList:checked').each(function () {
            $('tr[data-seller_key=' + $(this).data('seller_key') + ']').each(function () {
                if ($(this).data('ss_no') != undefined) {
                    oData['ss_no'].push($(this).data('ss_no'));
                }
            })
        });

        SC.ajax({
            url: '/order/action/orderToss',
            data: oData,
            success: function (res) {
                if (res.result === true) {
                    SC.showLayerAlert({
                        sTitle: '알림',
                        sContents: '담당자 지정이 완료되었습니다.',
                        oCallback: function () {
                            window.location.reload();
                        }
                    });
                }
            }
        });
    });

    // 2020-05-04 낱장불가 클릭시
    $('#targetItemSoldoutStatus .manager button:last').click(function(){
      if ($(this).hasClass('active')){
        $('.min-count').show();
      }else{
        $('.min-count').hide();
      }
    });
    // 2020-05-04 최소수량 선택시
    $('#targetItemSoldoutStatus .min-count button').click(function(){
      var idx = $(this).index();
      switch(idx) {
        case 1:
          $('#targetItemSoldoutStatus .min-count input').val('10');
        break;
        case 2:
          $('#targetItemSoldoutStatus .min-count input').val('20');
        break;
        case 3:
          $('#targetItemSoldoutStatus .min-count input').val('30');
        break;
      }
    });
    // 2020-07-15 EZP-811
    $('.date-uipopup .btn_close').click(function(){
      $(this).parents('.date-uipopup').hide();
    });
    $('.date-uipopup .btn-item').click(function(){
      $('.date-uipopup .btn-item').removeClass('on');
      $(this).addClass('on');
    });
    $('td.pop-wrap > button').click(function(){
      $('.date-uipopup').hide();
      $(this).parent().find('.date-uipopup').show();
    });
});

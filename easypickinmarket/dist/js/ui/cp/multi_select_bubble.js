let MULTI_SELECT_BUBBLE = {

    aMenuId: {},
    oPlaceHolder: {},
    oBasicObj: {},
    oSearchObj: null,
    offset: 0,
    limit: 20,

    /**
     * 초기화
     */
    init: function() {
        /*
        const $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv');
        const oMultiSelectBubbleDivName = $oMultiSelectBubbleDiv.attr('name');

        if ((oMultiSelectBubbleDivName in MULTI_SELECT_BUBBLE.oBasicObj) === false) {
            MULTI_SELECT_BUBBLE.oBasicObj[oMultiSelectBubbleDivName] = $oMultiSelectBubbleDiv.find('.result').clone();
        }
        if ((oMultiSelectBubbleDivName in MULTI_SELECT_BUBBLE.oPlaceHolder) === false) {
            MULTI_SELECT_BUBBLE.oPlaceHolder[oMultiSelectBubbleDivName] = $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('data-placeholder');
        }*/

        $.each($('.multiSelectBubbleDiv'), function(i, obj) {
            const $obj = $(obj);
            const oMultiSelectBubbleDivName = $obj.attr('name');

            if ((oMultiSelectBubbleDivName in MULTI_SELECT_BUBBLE.oBasicObj) === false) {
                MULTI_SELECT_BUBBLE.oBasicObj[oMultiSelectBubbleDivName] = $obj.find('.result').clone();
            }
            if ((oMultiSelectBubbleDivName in MULTI_SELECT_BUBBLE.oPlaceHolder) === false) {
                MULTI_SELECT_BUBBLE.oPlaceHolder[oMultiSelectBubbleDivName] = $obj.find('.eSearchTextArea').attr('data-placeholder');
            }
        });

        MULTI_SELECT_BUBBLE.bindEvent();
    },

    /**
     * 검색형 멀티 셀렉트에 필요한 이벤트 바인딩
     */
    bindEvent: function() {
        const aEventList = [{
                selector: '.multiSelectBubbleDiv .eSearchTextArea',
                event: 'click',
                function: MULTI_SELECT_BUBBLE.setSelectForm
            },
            { //수정
                selector: '>div',
                event: 'click',
                function: MULTI_SELECT_BUBBLE.setHiddenForm
            },
            {
                selector: '.multiSelectBubbleDiv .result >li >label',
                event: 'click',
                function: MULTI_SELECT_BUBBLE.selectOption
            },
            {
                selector: '.mBubble .eDeleteBubble',
                event: 'click',
                function: MULTI_SELECT_BUBBLE.deleteOption
            },
            {
                selector: '.multiSelectBubbleDiv',
                event: 'keyup',
                function: MULTI_SELECT_BUBBLE.debounce(MULTI_SELECT_BUBBLE.bindKeyboardEvent, 250)
            },
            {
                // selector: '.btn-write',
                // event: 'click',
                // function: MULTI_SELECT_BUBBLE.modifyOption
            },
            {
                selector: '.multiSelectBubbleDiv .btn-del',
                event: 'click',
                function: MULTI_SELECT_BUBBLE.deleteConfirmOption
            },
        ];

        $.each(aEventList, function(key, val) {
            $('body').on(val.event, val.selector, val.function);
        });

        $('.multiSelectBubbleDiv .result').scroll(this.debounce(function(e) {

            if (MULTI_SELECT_BUBBLE.oSearchObj.length <= MULTI_SELECT_BUBBLE.offset) {
                return false;
            }

            if (($(this).scrollTop() + $(this).innerHeight() + 50) >= this.scrollHeight) {
                MULTI_SELECT_BUBBLE.offset += MULTI_SELECT.limit;
                MULTI_SELECT_BUBBLE.showNextSearch();
            }

        }, 140));

        $('body').on('keydown', '.result', function(e) {
            if (e.keyCode == 40 || e.keyCode == 38) {
                e.preventDefault();
            }
        });

        /*     if ($.inArray($('meta[name="menu-id"]')[0]['content'], MULTI_SELECT_BUBBLE.aMenuId) > -1) {
                 window.MULTI_SELECT_BUBBLE = MULTI_SELECT_BUBBLE;
             }*/
    },

    /**
     * 키보드 이벤트
     * 위, 아래키  => focus 세팅
     * 엔터키      => 체크박스 체크, 셀렉트 화면 활성화
     * 기타        => 검색 자동 완성
     * @param e    [이벤트 객체]
     */
    bindKeyboardEvent: function(e) {
        e.preventDefault();


        //FIXME: input modify
        const $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv.selected');
        const $oResultInput = $oMultiSelectBubbleDiv.find('.result input');
        const isModify = $oResultInput.is(':focus');

        if (isModify) return;

        const oEvent = {
            //키보드 위
            38: function() {
                MULTI_SELECT_BUBBLE.focusPrevLi();
                MULTI_SELECT_BUBBLE.moveScroll('up');
            },

            //키보드 아래
            40: function() {
                MULTI_SELECT_BUBBLE.focusNextLi();
                MULTI_SELECT_BUBBLE.moveScroll('down');
            },

            //키보드 엔터
            13: function() {

                const $oMultiSelectBubbleDiv = $(e.target).closest('.multiSelectBubbleDiv.selected');
                const $oSelected = $oMultiSelectBubbleDiv.find('.focus');
                if ($oSelected.length === 1) {
                    $oSelected.find('label').click();
                }
            },

            //탭
            9: function() {
                const $oMultiSelectBubbleDiv = $(e.target).closest('.multiSelectBubbleDiv');
                if ($oMultiSelectBubbleDiv.hasClass('selected') === true) {
                    const oNextForm = $oMultiSelectBubbleDiv.parents('tr').next().find('input, select');
                    oNextForm.click();
                    oNextForm.focus();
                }
            },

            'default': function() {
                MULTI_SELECT_BUBBLE.autoSearch(e);
            }
        };

        const iKeyCode = oEvent[e.keyCode] === undefined ? 'default' : e.keyCode;
        oEvent[iKeyCode]();
    },

    setSelectForm: function(e) {
        e.stopPropagation();

        const $oMultiSelectBubbleDiv = $(e.target).closest('.multiSelectBubbleDiv');
        const bIsSelected = $oMultiSelectBubbleDiv.hasClass('selected');

        if (bIsSelected === false) {
            // 셀렉트 리스트를 출력전 열려있는 박스 숨김처리
            $('div').first().click();
            $('.mInputForm').removeClass('selected');

            $oMultiSelectBubbleDiv.addClass('selected');

            MULTI_SELECT_BUBBLE.oSearchObj = MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectBubbleDiv.attr('name')].clone().find('.selectionList');
            $oMultiSelectBubbleDiv.find('.selectionList').remove();
            $oMultiSelectBubbleDiv.find('.result').scrollTop(0);
            MULTI_SELECT_BUBBLE.offset = 0;
            MULTI_SELECT_BUBBLE.showNextSearch();
        } else {
            $oMultiSelectBubbleDiv.find('.eSearchTextArea').val('');
            return;
        }

        $oMultiSelectBubbleDiv.find('.eSearchTextArea').val('');
        $oMultiSelectBubbleDiv.find('.result >li.noData').remove();

        MULTI_SELECT_BUBBLE.setBubblePosition();

        return true;
    },

    showNextSearch: function() {
        const $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv.selected');
        $oMultiSelectBubbleDiv.find('.result').append(this.oSearchObj.slice(this.offset, (this.offset + this.limit)));
    },

    debounce: function(func, delay) {
        let inDebounce = undefined;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            return inDebounce = setTimeout(function() {
                return func.apply(context, args);
            }, delay);
        }
    },

    addOption: function(sTargetDivName, sOptionKey, sOptionValue, sOptionTag) {
        // form 선택
        //const $oMultiSelectDivBubble = $('div[name="' + sTargetDivName + '"]');
        const $oMultiSelectDivBubble = $('.multiSelectBubbleDiv[name=' + sTargetDivName + ']');
        const sSubmitName = $oMultiSelectDivBubble.find('.eValue').attr('name');

        const sId = sTargetDivName + '_' + sSubmitName + '_' + sOptionKey;
        let sOption = '';
        sOption += '<li class="selectionList" data-value=' + sOptionKey + '>';
        sOption += '<label id="' + sTargetDivName + '_' + sSubmitName + '_label_' + sOptionKey + '" class="eSearchChk ' + sTargetDivName + '_' + sSubmitName + '_label_' + sOptionKey + '">';
        sOption += '<span class="">' + sOptionValue + '</span>';
        sOption += '</label>';
        sOption += sOptionTag;
        sOption += '</li>';

        const $option = $(sOption);
        MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectDivBubble.attr('name')].find('li:last').after($option.clone());
        $option.appendTo($oMultiSelectDivBubble.find('.result'));
    },

    /**
     * 검색영역 닫힘
     * @param e  [이벤트 객체]
     */
    setHiddenForm: function(e) {
        //e.stopPropagation();

        // 닫히면 0,  펼쳐지면 1
        if ($(e.target).closest('.multiSelectBubbleDiv').length === 0) {

            if ($('.multiSelectBubbleDiv.selected').length === 0) {
                return;
            }
            MULTI_SELECT_BUBBLE.setPlaceHolderToValue();
            $('.multiSelectBubbleDiv').removeClass('selected');
        }
    },

    selectOption: function(e) {
        e.stopPropagation();

        // label 아닐경우
        let $oSelectedLabel = $(e.target);
        if ($oSelectedLabel.is('label') === false) {
            $oSelectedLabel = $(e.target).closest('label');
        }

        // disabled @click
        if ($oSelectedLabel.parent().hasClass('disabled')) return;

        // noData @click
        if ($oSelectedLabel.parent().hasClass('noData')) return;

        const sLabelId = $oSelectedLabel.attr('id');
        const sOptionText = $oSelectedLabel.text();
        const $oMultiSelectBubbleDiv = $oSelectedLabel.closest('.multiSelectBubbleDiv.selected');
        const isSingle = $oMultiSelectBubbleDiv.hasClass('single');

        // 중복선택
        // FIXME: TOGGLE 추가
        if (!isSingle && $oSelectedLabel.closest('.selectionList').hasClass('bubbleSelected')) {
            $oMultiSelectBubbleDiv.find('.eOptionValue[data-label-id="' + sLabelId + '"]').find('.btnDelete').trigger('click');
            return false;
        }

        // 체크
        if (MULTI_SELECT_BUBBLE.checkCount($oMultiSelectBubbleDiv) === false) {
            return false;
        }

        // 단독선택
        if (isSingle) {
            $oMultiSelectBubbleDiv.find('.result >li').removeClass('bubbleSelected').removeAttr('style');
            $oMultiSelectBubbleDiv.find('.eOptionValue .btnDelete').trigger('click');
            $oMultiSelectBubbleDiv.removeClass('selected');
        }

        // 선택 처리
        const $oUlResult = MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectBubbleDiv.attr('name')];
        $oUlResult.find('#' + sLabelId).closest('.selectionList').css('background', '#198cff').addClass('bubbleSelected');
        $oSelectedLabel.closest('.selectionList').css('background', '#198cff').addClass('bubbleSelected');

        // 버블 추가
        const sTag = MULTI_SELECT_BUBBLE.getBubbleLiTag(sLabelId, sOptionText);
        $oMultiSelectBubbleDiv.find('.eOptionValueGroup').append(sTag);

        const $oOuterBubbleDIv = $oMultiSelectBubbleDiv.next();
        if ($oOuterBubbleDIv.attr('name') === $oMultiSelectBubbleDiv.attr('name')) {
            $oOuterBubbleDIv.find('.eOptionValueGroup').append(sTag);
        }

        // 개수 갱신
        MULTI_SELECT_BUBBLE.setTotalInfo($oMultiSelectBubbleDiv, $oUlResult.find('.bubbleSelected').length);
        // 전송 값 갱신
        MULTI_SELECT_BUBBLE.setSubmitValue($oMultiSelectBubbleDiv);
    },

    deleteOption: function(e) {
        e.stopPropagation();

        const sLabelId = $(e.target).closest('.eOptionValue').attr('data-label-id');

        let $oMultiSelectBubbleDiv = null;
        let $oUlResult = null;

        const bIsOuter = ($(e.target).closest('.multiSelectBubbleDiv').length === 0);
        if (bIsOuter) {
            // outer

            const sMultiSelectBubbleDivName = $(e.target).closest('.mBubble').attr('name');
            $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv[name="' + sMultiSelectBubbleDivName + '"]');
            // selected 제거
            $oUlResult = MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectBubbleDiv.attr('name')];
            $oUlResult.find('#' + sLabelId).closest('.selectionList').css('background', 'none').removeClass('bubbleSelected');
            if ($oMultiSelectBubbleDiv.hasClass('selected')) {
                // 열린 상태일 경우
                $oMultiSelectBubbleDiv.find('.result #' + sLabelId).closest('.selectionList').css('background', 'none').removeClass('bubbleSelected');
            }

            // bubble 제거
            $(e.target).closest('.eOptionValue').remove();
            $oMultiSelectBubbleDiv.find('.eOptionValue[data-label-id="' + sLabelId + '"]').remove();

        } else {
            // inner

            $oMultiSelectBubbleDiv = $(e.target).closest('.multiSelectBubbleDiv.selected');
            $oUlResult = MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectBubbleDiv.attr('name')];
            // selected 제거
            $oUlResult.find('#' + sLabelId).closest('.selectionList').css('background', 'none').removeClass('bubbleSelected');
            $oMultiSelectBubbleDiv.find('#' + sLabelId).closest('.selectionList').css('background', 'none').removeClass('bubbleSelected');
            MULTI_SELECT_BUBBLE.oSearchObj.find('#' + sLabelId).closest('.selectionList').css('background', 'none').removeClass('bubbleSelected');

            // bubble 제거
            $(e.target).closest('.eOptionValue').remove();
            const sMultiSelectBubbleDivName = $oMultiSelectBubbleDiv.attr('name');
            const $oOuterBubbleDIv = $oMultiSelectBubbleDiv.next();

            if ($oOuterBubbleDIv.attr('name') === sMultiSelectBubbleDivName) {
                $oOuterBubbleDIv.find('.eOptionValue[data-label-id="' + sLabelId + '"]').remove();
            }
        }

        // 개수 갱신
        MULTI_SELECT_BUBBLE.setTotalInfo($oMultiSelectBubbleDiv, $oUlResult.find('.bubbleSelected').length);
        // 전송 값 갱신
        MULTI_SELECT_BUBBLE.setSubmitValue($oMultiSelectBubbleDiv);
    },

    /**
     * 선택 갯수 세팅
     * @param aCheckedObj    [선택된 객체]
     * @param bIsAll         [전체 선택 여부]
     * @param $obj            [inputForm element]
     */
    //FIXME: single, multi hasClass value
    setTotalInfo: function($oMultiSelectBubbleDiv, iSelectedCount) {

        const $bubbleSelected = $oMultiSelectBubbleDiv.find('.result >li.bubbleSelected');
        const $selectCnt = $oMultiSelectBubbleDiv.find('.selectCnt').text(iSelectedCount);
        const $sTotalClone = $selectCnt.closest('p.total').clone();
        $sTotalClone.find('.selectTexts').remove();
        const sTotal = $sTotalClone.text();
        const $selectTexts = $oMultiSelectBubbleDiv.find('.selectTexts');

        const aSelectedLabels = $.map($bubbleSelected.get().reverse(), function(el) {
            return $(el).children('label').children('span:first').text();
        });
        const sSelectedLabel = aSelectedLabels.join(',');
        const emptyLength = iSelectedCount == 0;
        const sPlaceHolder = $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('data-placeholder');

        if ($oMultiSelectBubbleDiv.hasClass('single') || $oMultiSelectBubbleDiv.hasClass('multi')) {
            if (emptyLength) {
                $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('placeholder', sPlaceHolder).val(sPlaceHolder);
            } else {
                if ($oMultiSelectBubbleDiv.hasClass('multi')) {
                    $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('placeholder', sTotal + sSelectedLabel).val(sTotal + sSelectedLabel);
                    $selectTexts.text(sSelectedLabel);
                } else {
                    $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('placeholder', sSelectedLabel).val(sSelectedLabel);
                }
            }

        } else {
            if (emptyLength) {
                $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('placeholder', sPlaceHolder).val(sPlaceHolder);
            } else {
                $oMultiSelectBubbleDiv.find('.eSearchTextArea').attr('placeholder', sTotal).val(sTotal);
            }
            
        }

    },

    /**
     * 실제 전송 데이터 세팅
     * @param sSubmitValue   [전송할 테이터]
     * @param $obj              [inputForm Element]
     */
    setSubmitValue: function($oMultiSelectBubbleDiv) {

        const $oUlResult = MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectBubbleDiv.attr('name')];

        // 선택 조회
        const oSelected = $oUlResult.find('.bubbleSelected');
        const aSelected = [];
        $.each(oSelected, function(i, selectedObj) {
            aSelected.push($(selectedObj).attr('data-value'));
        });
        // 세팅
        const sSubmitName = $oMultiSelectBubbleDiv.find('.eValue').val(aSelected).attr('name');
        $oMultiSelectBubbleDiv.find('input[name="' + sSubmitName + '_redis_key"]').val('');
    },

    getBubbleLiTag: function(sLabelId, sOptionText) {
        // input.eManualOptionValue => em.eManualOptionValue

        let sTag = '';
        sTag += '<li class="eOptionValue" rel="0" style="float: left;" data-label-id="' + sLabelId + '">';
        sTag += '<span class="eBox boxWrap"><span class="eTextBox textBox"><span class="eTextUpdater">';
        //sTag += '<input type="text" class="eManualOptionValue fText txtLight" disabled="disabled" style="width:65px; background-image: none; cursor: default;" value="' + sOptionText + '">';
        sTag += '<em class="eManualOptionValue fText txtLight" style="background-image: none; width: auto">' + sOptionText + '</em>';
        sTag += '</span></span><span class="eDel btnDelete eDeleteBubble">' + __('삭제') + '</span></span>';
        sTag += '</li>';

        return sTag;
    },

    /**
     * 검색 자동완성
     * @returns {boolean}
     */
    autoSearch: function(e) {
        //검색 폼 셀렉터
        const $oMultiSelectBubbleDiv = $(e.target).parents('.multiSelectBubbleDiv');
        const sSearchTxt = $oMultiSelectBubbleDiv.find('.eSearchTextArea').val();

        $oMultiSelectBubbleDiv.find('.result li').remove();
        // 갱신 값에서 검색
        const $oClone = MULTI_SELECT_BUBBLE.oBasicObj[$oMultiSelectBubbleDiv.attr('name')].clone();
        const $oSearchObj = $oClone.find('.selectionList:contains("' + sSearchTxt + '")');

        //검색 내역이 없을 경우
        if ($oSearchObj.length === 0) {
            $oMultiSelectBubbleDiv.find('ul').append('<li class="noData center" style="text-align: center;"><label><span>' + __('검색 내역이 없습니다.') + '</span></label></li>');

            //FIXME: 버블링 태그가 append 되는이슈
            $oMultiSelectBubbleDiv.find('.eOptionValueGroup').find('li.noData').remove();
            return;
        }

        if (sSearchTxt !== '') {
            // 검색어 하이라이팅
            $oSearchObj.each(function(iKey, oObj) {
                const oLabel = $(oObj).find('label');
                /*
                 // ECQAUNIT-23484
                 g : 완전일치(발생할 모든 pattern에 대한 전역 검색)
                 i : 대/소문자 무시
                 gi : 대/소문자 무시하고 완전 일치
                 */
                const sReplacedSearchTxt = sSearchTxt.replace(/([.?*+^$[\](){}|-])/g, "\\$1"); //ECQAUNIT-23497 이슈로 추가함
                const regex = new RegExp(sReplacedSearchTxt, 'g'); //ECQAUNIT-23484 이슈로 수정
                const sHighlightedText = oLabel.text().replace(regex, '<span class="txtEm">' + sSearchTxt + '</span>');
                oLabel.html(sHighlightedText);
            });
        }

        // show
        this.oSearchObj = $oSearchObj;
        this.offset = 0;
        $oMultiSelectBubbleDiv.find('.result').scrollTop(0);
        this.showNextSearch()

        //FIXME: autoSearch @set => markUp 변경으로 불필요
        //MULTI_SELECT_BUBBLE.setBubblePosition();
    },


    /**
     * 다음 li 엘리먼트로 포커스 이동
     */
    focusPrevLi: function() {

        const $oObj = $('.multiSelectBubbleDiv.selected .focus');
        const $oVisibleObj = $('.multiSelectBubbleDiv.selected li.selectionList:visible');
        const iObjIdx = $oVisibleObj.index($('.multiSelectBubbleDiv.selected li.selectionList.focus:visible'));

        if (iObjIdx > 0) {
            $oObj.removeClass('focus');
            $oVisibleObj.eq(iObjIdx - 1).addClass('focus');
        }
    },

    /**
     * 이전 li 엘리먼트로 포커스 이동
     */
    focusNextLi: function() {
        let $oObj = $('.multiSelectBubbleDiv.selected .focus');
        const $oVisibleObj = $('.multiSelectBubbleDiv.selected li.selectionList:visible');

        if ($oObj.length === 0) {
            $oObj = $oVisibleObj.first();
            $oObj.addClass('focus');
        } else {
            const iIdx = $oVisibleObj.index($('.multiSelectBubbleDiv.selected li.selectionList.focus:visible'));
            const iVisibleLen = $oVisibleObj.length;

            if ((iIdx + 1) < iVisibleLen) {
                $oObj.removeClass('focus');
                $oVisibleObj.eq(iIdx + 1).addClass('focus');
            }
        }
    },

    /**
     * 포커스에 따른 스크롤 이동
     * @param sDirection    [스크롤 이동 방향  'up'/'down']
     */
    moveScroll: function(sDirection) {
        const iLiHeight = $('.multiSelectBubbleDiv.selected li').height();
        const iCurLiTop = $('.multiSelectBubbleDiv.selected li.selectionList.focus:visible').position().top;
        const iContentHeight = $('.multiSelectBubbleDiv.selected').find('.result').height();
        //스크롤 위로 이동
        if (sDirection === 'up') {
            if (iCurLiTop <= 0) {
                $('.multiSelectBubbleDiv.selected ul').animate({
                    "scrollTop": "-=" + (iLiHeight + 4) + "px"
                });
            }

            //스크롤 아래로 이동
        } else {
            if ((iCurLiTop + iLiHeight) >= iContentHeight) {
                $('.multiSelectBubbleDiv.selected ul').animate({
                    "scrollTop": "+=" + (iLiHeight + 4) + "px"
                });
            }
        }
    },

    setPlaceHolderToValue: function(){
        const $oMultiSelectDiv = $('.multiSelectBubbleDiv.selected');
        const $oSearchTextArea = $oMultiSelectDiv.find('.eSearchTextArea');
        const sPlaceHolder = $oSearchTextArea.attr('placeholder');
        
        $oSearchTextArea.val(sPlaceHolder);
    },

    checkCount: function($oMultiSelectBubbleDiv) {
        const $oSearchTextArea = $oMultiSelectBubbleDiv.find('.eSearchTextArea');
        const $oResultUl = this.oBasicObj[$oMultiSelectBubbleDiv.attr('name')];

        // 개수 확인
        const iLimit = $oSearchTextArea.attr('data-select-limit');
        const sMessage = $oSearchTextArea.attr('data-select-limit-message');
        if (iLimit === undefined || sMessage === undefined) {
            return true;
        }

        if ($oResultUl.find('li.bubbleSelected').length >= Number(iLimit)) {
            alert(__(sMessage));
            return false;
        }

        return true;
    },

    setBubblePosition: function() {
        const $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv.selected'),
            $oGroup = $oMultiSelectBubbleDiv.children('.group'),
            $oResult = $oGroup.find('.result'),
            $oBubble = $oGroup.find('.mBubble'),
            heightSelect = $oMultiSelectBubbleDiv.outerHeight(),
            heightGroup = $oGroup.outerHeight(),
            $prtModalBody = $oMultiSelectBubbleDiv.closest('.modal-body'),
            hasModalBody = $prtModalBody.length > 0 ? true : false,
            $scrollContent = hasModalBody ? $prtModalBody : $(window);

        // let offTopSelect = $oMultiSelectBubbleDiv.offset().top,
        //     scrollPosition = $scrollContent.scrollTop() + $scrollContent.outerHeight();

        // if (hasModalBody) {
        //     scrollPosition = $scrollContent.outerHeight() - $prtModalBody.offset().top - $(".modal-footer").outerHeight();
        // } else {
        //     scrollPosition -= $('.content-footer').outerHeight();
        // }

        // if (offTopSelect + heightSelect + heightGroup >= scrollPosition) {
        //     $oGroup.addClass("above");
        // } else {
        //     $oGroup.removeClass("above");
        // }

        var viewport = OFFSET.Viewport({
            $wrap: $oMultiSelectBubbleDiv,
            $plus: $oGroup,
            $minus: hasModalBody ? $prtModalBody.find('.modal-footer') : $('.content-footer')
        });

        if(viewport.show){
            $oGroup.removeClass("above")
        }else{
            if(viewport.spaceTop){
                $oGroup.addClass("above");
            }
            else{
                $oGroup.removeClass("above");
            }
        }

        // var $minusElement = hasModalBody || $('.content-footer');
        // var viewport = OFFSET.inScreen({
        //     wrap: $oMultiSelectBubbleDiv,
        //     plus: $oGroup,
        //     minus: $minusElement
        // });
        // if(viewport){
        //     $oGroup.removeClass("above");
        // }else{
        //     $oGroup.addClass("above");
        // }

        if ($oMultiSelectBubbleDiv.hasClass('single')) {
            var offTop = $oMultiSelectBubbleDiv.find('.result li.bubbleSelected').prop('offsetTop') || 0;
            $oResult.scrollTop(offTop);
        }
    },

    modifyOption: function() {
        const $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv.selected');
        const oMultiSelectBubbleDivName = $oMultiSelectBubbleDiv.attr('name');
        const $oUlResult = $oMultiSelectBubbleDiv.find('.result');
        const $oSelected = $(this).closest('.selectionList');
        const $oSelectedLabel = $oSelected.children('label');
        const sOptionText = $oSelectedLabel.text();
        const $input = $('<input type="text">');

        if ($oSelected.hasClass('isModify')) return;
        $oSelected.addClass('isModify');

        $oSelectedLabel.html($input)
        $input.focus().val(sOptionText);
        $input.off();

        $input.on('keyup focusout', function(e) {
            let value = this.value.trim();

            if (e.keyCode == 13 || e.type == 'focusout') {
                if (value.trim().length < 1) {
                    value = sOptionText;
                }
                $oSelectedLabel.html('<span>' + value + '</span>')
                $oSelected.removeClass('isModify');

                MULTI_SELECT_BUBBLE.oBasicObj[oMultiSelectBubbleDivName] = $oUlResult.clone();
            }

        })
    },

    deleteConfirmOption: function(e) {
        const $oMultiSelectBubbleDiv = $('.multiSelectBubbleDiv.selected');
        const $oUlResult = $oMultiSelectBubbleDiv.find('.result');
        const delItem = confirm('삭제 하시겠습니까?');

        if (delItem) {
            e.stopPropagation();

            const oMultiSelectBubbleDivName = $oMultiSelectBubbleDiv.attr('name');
            const $oSelected = $(this).closest('.selectionList');
            const $oSelectedLabel = $oSelected.children('label');
            const sLabelId = $oSelectedLabel.attr('id');

            $oMultiSelectBubbleDiv.find('.eOptionValue[data-label-id="' + sLabelId + '"]').find('.btnDelete').trigger('click');
            $oSelected.remove();

            const $oResult = MULTI_SELECT_BUBBLE.oBasicObj[oMultiSelectBubbleDivName].clone();
            const $deleteItem = $oResult.find('label[id='+ sLabelId +']').parent().remove();
            

            //MULTI_SELECT_BUBBLE.oBasicObj[oMultiSelectBubbleDivName] = $oUlResult.clone();
            MULTI_SELECT_BUBBLE.oBasicObj[oMultiSelectBubbleDivName] = $oResult;

            // 개수 갱신
            MULTI_SELECT_BUBBLE.setTotalInfo($oMultiSelectBubbleDiv, $oResult.find('.bubbleSelected').length);
            // 전송 값 갱신
            MULTI_SELECT_BUBBLE.setSubmitValue($oMultiSelectBubbleDiv);


            if($oUlResult.children().length < 1){
                $oMultiSelectBubbleDiv.removeClass('selected').addClass('noData')
            }
        }


    }
};


$(document).ready(function() {
    MULTI_SELECT_BUBBLE.init();
});

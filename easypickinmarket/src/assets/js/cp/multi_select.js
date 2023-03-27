/**
 * 검색형 멀티 셀렉트 js
 * 디자인: http://fe.cafe24.com/suio/include/layout.php?MODULE=searchForm
 * 라이브러리 (템플릿에서 호출): ../wms/lib/libSelect.php
 *
 * Created by 이소진 on 2017-02-16.
 */

 (function() {
    var $i18n = {

        /**
         * Messages
         * @var array
         * {
         *     'DOMAIN NAME' : {
         *         'KEY NAME' : 'value',
         *         'KEY NAME(Plurals) : ['value', 'value', ...]
         *         ...
         *     },
         *     ...
         * }
         */
        _lang : {},

        /**
         * Plurals Expressions
         * @var array
         * {
         *     'DOMAIN NAME' : function(n) {
         *         expressions
         *     },
         *     ...
         * }
         */
        _pluralsExp : {},

        /**
         * Current Domain
         * @var string
         */
        _currDomain : false,

        /**
         * override the current domain for a single message lookup
         *
         * @param string domain
         * @param string key
         * @return string
         */
        __d : function(domain, key, __idx__) {

            var t = $i18n._lang;

            if ($i18n._isEmpty(t) === true) {
                return key;
            }

            if (typeof t[domain] == 'undefined') {
                return key;
            }

            if (typeof t[domain][key] == 'undefined') {
                return key;
            }

            if (typeof t[domain][key] == 'object') {
                __idx__ = __idx__ ? __idx__ : 0;
                return t[domain][key][__idx__];
            }

            return t[domain][key];

        },

        /**
         * Plural version of __d
         *
         * @param string domain
         * @param string key1
         * @param string key2
         * @param int cnt
         * @return string
         */
        __dn : function(domain, key1, key2, cnt) {

            var n = parseInt(cnt);
            var idx = $i18n._getPluralsIndex(domain, n);

            if (idx == 0) {
                return $i18n.__d(domain, key1, 0);
            } else {
                return $i18n.__d(domain, key2, idx);
            }
        },

        _init : function() {
            $i18n._pluralsExp.__reserved_default_exp__ = function(n) {
                return n == 1 ? 0 : 1;
            };

            window['__d'] = function(domain, key) {
                return $i18n.__d(domain, key, 0);
            };

            window['__dn'] = function(domain, key1, key2, cnt) {
                return $i18n.__dn(domain, key1, key2, cnt);
            };

            window['__'] = function(key) {
                return $i18n.__d($i18n._currDomain, key, 0);
            };

            window['__n'] = function(key1, key2, cnt) {
                return $i18n.__dn($i18n._currDomain, key1, key2, cnt);
            };

            window['__i18n_regist__']           = this._regist;
            window['__i18n_bind__']             = this._bind;
            window['__i18n_plurals_exp_bind__'] = this._pluralsExpBind;
        },

        _isEmpty : function(val) {

            if (!val) return true;
            if (val == null) return true;
            if (val == undefined) return true;
            if (val == '') return true;
            if (typeof val == 'object') {
                for (var i in val) {
                    return false;
                }

                return true;
            }

            return false;

        },

        _trim : function(str) {
            if(typeof str != 'string') return '';

            return str.replace(/(^\s*)|(\s*$)/g, '');
        },

        _apply : function(method, func) {

            this[method] = func;

        },

        _regist : function(lang) {

            if (typeof lang != 'object') return false;

            $i18n._lang = lang;

            return true;

        },

        _bind : function(domain) {

            if ($i18n._isEmpty(domain) === true) return false;

            $i18n._currDomain = domain;

            return true;

        },

        _pluralsExpBind : function(domain, exp) {
            if (typeof exp != 'function') {
                return;
            }

            $i18n._pluralsExp[domain] = exp;
        },

        _getPluralsIndex : function(domain, n) {
            if (typeof $i18n._pluralsExp[domain] == 'undefined') {
                return $i18n._pluralsExp.__reserved_default_exp__(n);
            }

            return $i18n._pluralsExp[domain](n);
        }
    };

    $i18n._init();
})();

 let MULTI_SELECT = {

    aMenuId: ['S0107'],
    oPlaceHolder: {},
    // scroll
    limit: 20,
    offset: 0,
    oSearchObj: null,
    oBasicObj: {},
    /**
     * 셀렉트영역 세팅
     */
    setSelectForm: function(e) {
        e.stopPropagation();

        const $oMultiSelectDiv = $(e.target).closest('.multiSelectDiv');
        const bIsSelected = $(e.target).parent().hasClass('selected');
        const $oMultiSelectGroup = $oMultiSelectDiv.children(".group");

        if (bIsSelected === false) {

            // 셀렉트 리스트를 출력전 열려있는 박스를 숨김처리
            $('div').first().click();
            $oMultiSelectDiv.addClass('selected');

            // clone
            MULTI_SELECT.oSearchObj = MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')].clone().find('li');

            // li remove all
            const oUlResult = $oMultiSelectDiv[0].querySelector('.result');
            oUlResult.parentNode.removeChild(oUlResult);

            //FIXME: result appendTo group
            //$oMultiSelectDiv.find('.group').append('<ul class="result"></ul>');
            $oMultiSelectGroup.append('<ul class="result"></ul>');

            MULTI_SELECT.listenScrollagain();

            $oMultiSelectDiv.find('.result').scrollTop(0);
            MULTI_SELECT.offset = 0;
            MULTI_SELECT.showNextSearch();

        }

        $oMultiSelectDiv.find('.eSearchTextArea').val('');

        MULTI_SELECT.setBubblePosition();

        return true;
    },

    /**
     * 검색영역 닫힘
     * @param e  [이벤트 객체]
     */
    setHiddenForm: function(e) {
        //e.stopPropagation();

        // 닫히면 0,  펼쳐지면 1
        if ($(e.target).closest('.multiSelectDiv').length === 0) {

            if ($('.multiSelectDiv.selected').length === 0) {
                return;
            }
            //MULTI_SELECT.setInputTextValue();
            MULTI_SELECT.setPlaceHolderToValue();
            $('.multiSelectDiv').removeClass('selected');
        }
    },

    /**
     * 전체 체크/체크해제
     */
    checkAllChk: function(e) {
        e.stopPropagation();

        const $eTarget = $(e.target);
        const $oMultiSelectDiv = $eTarget.closest('.multiSelectDiv.selected');

        const bIsAllCheck = $eTarget.is(':checked');
        const $oResultUl = MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')].clone();

        // 전체 체크 & 언체크
        $oResultUl.find('.fChk').not('[disabled]').attr('checked', bIsAllCheck);
        $oMultiSelectDiv.find('.fChk').not('[disabled]').attr('checked', bIsAllCheck);

        //전체 선택일 경우 선택내역보기영역 텍스트 전체, 체크박스 모두 선택
        if (bIsAllCheck === true) {
            $oResultUl.children(':not(".disabled")').find('label').addClass('eSelected');
            $oMultiSelectDiv.find('result').children(':not(".disabled")').find('label').addClass('eSelected');
            $eTarget.closest('.selectTexts').text(__('전체'));
        } else {
            //전체 체크 제거일 경우 검색제외 활성화, 체크 제거
            $oResultUl.find('label').removeClass('eSelected');
            $oMultiSelectDiv.find('label').removeClass('eSelected');
        }

        const $aCheckedObj = $($oResultUl[0].querySelectorAll('.fChk:checked:not(.chk_all)'));

        MULTI_SELECT.setTotalInfo($aCheckedObj, bIsAllCheck, $oMultiSelectDiv);
        MULTI_SELECT.setSubmitValue($aCheckedObj, $oMultiSelectDiv);
        MULTI_SELECT.setPlaceHolder($aCheckedObj, bIsAllCheck, $oMultiSelectDiv);

        MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')] = $oResultUl;
        MULTI_SELECT.oSearchObj = $oResultUl.find('li');
    },

    /**
     * 개별 체크/체크해제
     * @param e   [이벤트 객체]
     */
    checkChk: function(e) {
        e.stopPropagation();

        const $eTarget = $(e.target);
        const sTargetId = $eTarget.attr('id');
        const $oMultiSelectDiv = $eTarget.closest('.multiSelectDiv');
        const bChked = $eTarget.is(':checked');
        // 체크 시, 개수 제한 확인
        if (bChked === true) {
            if (MULTI_SELECT.checkCount($oMultiSelectDiv) === false) {
                return false;
            }
        }

        // 현재 상태 복사
        const $oResultUl = MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')].clone();

        $oMultiSelectDiv.find('li.focus').removeClass('focus');

        const $oCloneChkAll = $oResultUl.find('.chk_all');
        const $oVisibleChkAll = $oMultiSelectDiv.find('.chk_all');

        const $oCloneTarget = $oResultUl.find('#' + sTargetId);
        let bIsAll = true;

        // 체크
        $oCloneTarget.attr('checked', bChked);
        (bChked) ? $oCloneTarget.closest('label').addClass('eSelected'): $oCloneTarget.closest('label').removeClass('eSelected');
        // (bChked) ? $oCloneTarget.parent().addClass('on') : $oCloneTarget.parent().closest('li').removeClass('on');
        //console.log($oCloneTarget.closest('li'));
        $eTarget.attr('checked', bChked);

        const $aCheckedObj = $($oResultUl[0].querySelectorAll('.fChk:checked:not(.chk_all)'));

        //전체체크 체크박스 체크/해제 (전체체크박스 제외한 체크된 갯수, 개별 체크박스 갯수랑 같을 경우)
        if ($aCheckedObj.length === $oResultUl.find('.fChk').not('.chk_all').not('[disabled]').length) {
            //전체체크이면 전체체크 체크박스 체크
            $oCloneChkAll.attr('checked', true).closest('label').addClass('eSelected');
            $oVisibleChkAll.attr('checked', true).closest('label').addClass('eSelected');
        } else {
            $oCloneChkAll.attr('checked', false).closest('label').removeClass('eSelected')
            $oVisibleChkAll.attr('checked', false).closest('label').removeClass('eSelected');
            bIsAll = false;
        }

        MULTI_SELECT.setTotalInfo($aCheckedObj, bIsAll, $oMultiSelectDiv);
        MULTI_SELECT.setSubmitValue($aCheckedObj, $oMultiSelectDiv);
        MULTI_SELECT.setPlaceHolder($aCheckedObj, bIsAll, $oMultiSelectDiv);

        // 변경 값 갱신
        MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')] = $oResultUl;
        $eTarget.closest('li').addClass('focus');
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

        const oEvent = {
            //키보드 위
            38: function() {
                MULTI_SELECT.focusPrevLi();
                MULTI_SELECT.moveScroll('up');
            },

            //키보드 아래
            40: function() {
                MULTI_SELECT.focusNextLi();
                MULTI_SELECT.moveScroll('down');
            },

            //키보드 엔터
            13: function() {

                if ($('.multiSelectDiv.selected').find('.focus').length === 0) {
                    MULTI_SELECT.setSelectForm(e);
                }

                MULTI_SELECT.checkSelectedCheckBox(e);
            },

            //탭
            9: function() {
                const $oMultiSelectDiv = $(e.target).closest('.multiSelectDiv');
                if ($oMultiSelectDiv.hasClass('selected') === true) {
                    const $oNextForm = $oMultiSelectDiv.parents('tr').next().find('input, select');
                    $oNextForm.click();
                    $oNextForm.focus();
                }
            },

            'default': function() {
                MULTI_SELECT.autoSearch(e);
            }
        };

        const iKeyCode = oEvent[e.keyCode] === undefined ? 'default' : e.keyCode;
        oEvent[iKeyCode]();
    },

    /**
     * 검색 자동완성
     * @returns {boolean}
     */
    autoSearch: function(e) {
        //검색 폼 셀렉터
        const $oMultiSelectDiv = $(e.target).parents('.multiSelectDiv');
        const sSearchTxt = $oMultiSelectDiv.find('.eSearchTextArea').val();

        $oMultiSelectDiv.find('li').remove();

        // 갱신 값에서 검색
        const $oClone = MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')].clone();

        const $oSearchObj = $oClone.find('li:contains("' + sSearchTxt + '")');

        //검색 내역이 없을 경우
        if ($oSearchObj.length === 0) {
            $oMultiSelectDiv.find('ul').append('<li class="noData center" style="text-align: center;"><label><span>' + __('검색 내역이 없습니다.') + '</span></label></li>');
            return true;
        }

        if (sSearchTxt !== '') {
            // 검색어 하이라이팅, 체크박스 체크
            $oSearchObj.each(function(iKey, oObj) {
                const oLabel = $(oObj).find('label');
                const sChkHtml = $(oObj).find('.fChk')[0] === undefined ? '' : $(oObj).find('.fChk')[0].outerHTML;
                /*
                 // ECQAUNIT-23484
                 g : 완전일치(발생할 모든 pattern에 대한 전역 검색)
                 i : 대/소문자 무시
                 gi : 대/소문자 무시하고 완전 일치
                 */
                const sReplacedSearchTxt = sSearchTxt.replace(/([.?*+^$[\](){}|-])/g, "\\$1"); //ECQAUNIT-23497 이슈로 추가함
                const regex = new RegExp(sReplacedSearchTxt, 'g'); //ECQAUNIT-23484 이슈로 수정
                let sHighlightedText = oLabel.text().replace(regex, '<span class="txtEm">' + sSearchTxt + '</span>');

                //FIXME: 그룹 filter
                
                sHighlightedText = sHighlightedText.replace('<span class="txtEm">그룹</span>', '<span class="label label-bg1"><span class="txtEm">그룹</span></span>');
                sHighlightedText = sHighlightedText.replace('<span class="txtEm">그</span>룹', '<span class="label label-bg1"><span class="txtEm">그</span>룹</span>');
                sHighlightedText = sHighlightedText.replace('그<span class="txtEm">룹</span>', '<span class="label label-bg1">그<span class="txtEm">룹</span></span>');
                sHighlightedText = sHighlightedText.replace('그룹', '<span class="label label-bg1">그룹</span>');

                oLabel.html(sChkHtml + sHighlightedText);
            });
        }

        // show
        this.oSearchObj = $oSearchObj;
        this.offset = 0;
        $oMultiSelectDiv.find('.result').scrollTop(0);
        this.showNextSearch();
    },

    /**
     * 포커스가 위치한 li의 체크박스 체크
     */
    checkSelectedCheckBox: function(e) {

        let oObj = $('.multiSelectDiv.selected .focus .fChk')[0];
        //재고목록의 케이스 - 멀티셀렉트 두번 사용 하는경우 - 이벤트 두번등록하는 이슈 있었음
        if ($('.multiSelectDiv').eq(0).attr('name') === 'eShelfNoDiv' && $('.multiSelectDiv').eq(1).attr('name') === 'searchSuppliersDiv') {
            if (e.target.id === 'eShelfNo') {
                oObj = $('.multiSelectDiv.selected').eq(0).find('.focus').find('.fChk')[0];
            } else if (e.target.id === 'searchSuppliers') {
                oObj = $('.multiSelectDiv.selected').eq(1).find('.focus').find('.fChk')[0];
            }
        }
        $(oObj).click();
    },

    /**
     * 다음 li 엘리먼트로 포커스 이동
     */
    focusPrevLi: function() {

        const $oObj = $('.multiSelectDiv.selected .focus');
        const $oVisibleObj = $('.multiSelectDiv.selected li.selectionList:visible');
        const iObjIdx = $oVisibleObj.index($('.multiSelectDiv.selected li.selectionList.focus:visible'));

        if (iObjIdx > 0) {
            $oObj.removeClass('focus');
            $oVisibleObj.eq(iObjIdx - 1).addClass('focus');
        }
    },

    /**
     * 이전 li 엘리먼트로 포커스 이동
     */
    focusNextLi: function() {
        let $oObj = $('.multiSelectDiv.selected .focus');
        const $oVisibleObj = $('.multiSelectDiv.selected li.selectionList:visible');

        if ($oObj.length === 0) {
            $oObj = $oVisibleObj.first();
            $oObj.addClass('focus');
        } else {
            const iIdx = $oVisibleObj.index($('.multiSelectDiv.selected li.selectionList.focus:visible'));
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
        const iLiHeight = $('.multiSelectDiv.selected li').height();
        const iCurLiTop = $('.multiSelectDiv.selected li.selectionList.focus:visible').position().top;
        const iContentHeight = $('.multiSelectDiv.selected').find('.result').height();
        //스크롤 위로 이동
        if (sDirection === 'up') {
            if (iCurLiTop <= 0) {
                $('.multiSelectDiv.selected ul').animate({
                    "scrollTop": "-=" + (iLiHeight + 4) + "px"
                });
            }

            //스크롤 아래로 이동
        } else {
            if ((iCurLiTop + iLiHeight) >= iContentHeight) {
                $('.multiSelectDiv.selected ul').animate({
                    "scrollTop": "+=" + (iLiHeight + 4) + "px"
                });
            }
        }
    },

    /**
     * 선택 갯수, 이름 세팅
     * @param aCheckedObj    [선택된 객체]
     * @param bIsAll         [전체 선택 여부]
     * @param $obj            [inputForm element]
     */
    setTotalInfo: function(aCheckedObj, bIsAll, $obj) {
        const aSelectedLabels = $.map(aCheckedObj.slice(0, 20).parents('label'), $.text);
        const sSelectedLabel = bIsAll === false ? aSelectedLabels.join(',') : __('전체');
        //선택 건수, 선택 공급사명 출력

        $obj.find('.selectCnt').text(aSelectedLabels.length);
        $obj.find('.selectTexts').text(sSelectedLabel);
    },

    /**
     * 실제 전송 데이터 세팅
     * @param sSubmitValue   [전송할 테이터]
     * @param $obj              [inputForm Element]
     */
    setSubmitValue: function($aCheckedObj, $oMultiSelectDiv) {

        const oData = {};
        $.each($aCheckedObj, function(i, o) {
            const sTempValue = o.value;
            const sTempKey = $(o).attr('data-key');
            if ((sTempKey in oData) === false) {
                oData[sTempKey] = [];
            }
            oData[sTempKey].push(sTempValue);
        });

        const oSubmitName = $oMultiSelectDiv.find('.eValue').map(function() {
            return this.id;
        }).get();

        // 데이터 셋팅
        $.each(oSubmitName, function(i, sName) {
            $oMultiSelectDiv.find('input[name="' + sName + '_redis_key"]').val('');

            if (sName in oData) {
                // 값 셋팅
                $oMultiSelectDiv.find('#' + sName).val(oData[sName]);

                return true;
            }

            $oMultiSelectDiv.find('#' + sName).val('');
        });
    },

    /**
     * 검색창 placeHolder 설정
     * @param aCheckedObj   [체크된 객체]
     * @param bIsAll        [전체 체크여부]
     * @param $obj             [inputForm Element]
     */
    setPlaceHolder: function($aCheckedObj, bIsAll, $obj) {
        //FIXME:
        //const aSelectedLabels = $.map($aCheckedObj.slice(0, 20).parents('label'), $.text);
        const aSelectedLabels = $.map($aCheckedObj.closest('label'), function(el) {
            var text = el.innerText.replace(/\s/gi, "");;
            text = text.replace('그룹', '[그룹]')
            return text;
        });
        let sPlaceHolder = '[' + __('총 ') + $aCheckedObj.length + __('건') + '] ' + aSelectedLabels.join(',');

        const aMultiSelectIds = Object.keys(MULTI_SELECT.oPlaceHolder);

        if ($aCheckedObj.length === 0) {
            $obj.find('.eSearchTextArea').val('');

            if (jQuery.inArray($obj.attr('name'), aMultiSelectIds) > -1) {
                sPlaceHolder = MULTI_SELECT.oPlaceHolder[$obj.attr('name')];
            } else {
                sPlaceHolder = MULTI_SELECT.oPlaceHolder['default'];
            }
        }

        if (bIsAll === true) {
            sPlaceHolder = __('전체');
        }

        $obj.find('.eSearchTextArea').val(sPlaceHolder);
        $obj.find('.eSearchTextArea').attr('placeholder', sPlaceHolder);
    },

    /**
     * 검색형 멀티 셀렉트에 필요한 이벤트 바인딩
     */
    bindEvent: function() {
        const aEventList = [{
                selector: '.multiSelectDiv .eSearchTextArea',
                event: 'click',
                function: MULTI_SELECT.setSelectForm //자동완성 표시
            },
            { //수정
                selector: '>div',
                event: 'click',
                function: MULTI_SELECT.setHiddenForm // select 닫힘 처리
            },
            {
                selector: '.multiSelectDiv .chk_all',
                event: 'click',
                function: MULTI_SELECT.checkAllChk
            },
            {
                selector: '.multiSelectDiv .fChk:not(".chk_all")',
                event: 'click',
                function: MULTI_SELECT.checkChk
            },
            {
                selector: '.multiSelectDiv',
                event: 'keyup',
                function: MULTI_SELECT.debounce(MULTI_SELECT.bindKeyboardEvent, 250)
            },
        ];

        $.each(aEventList, function(key, val) {
            $('body').on(val.event, val.selector, val.function);
        });

        // ul 키보드 스크롤 방지
        $('body').on('keydown', '.result', function(e) {
            if (e.keyCode == 40 || e.keyCode == 38) {
                e.preventDefault();
            }
        });

        $('.eSearchTextArea').focusout(function() {
            $(this).val('');
        });

        /*     if ($.inArray($('meta[name="menu-id"]')[0]['content'], MULTI_SELECT.aMenuId) > -1) {
                 window.MULTI_SELECT = MULTI_SELECT;
             }*/
    },

    listenScrollagain: function() {
        const all = document.querySelectorAll(".multiSelectDiv .result");
        for (let i = 0; i < all.length; i++) {
            all[i].onscroll = this.debounce(function(e) {

                if (MULTI_SELECT.oSearchObj.length <= MULTI_SELECT.offset) {
                    return false;
                }

                if (($(this).scrollTop() + $(this).innerHeight() + 50) >= this.scrollHeight) {
                    MULTI_SELECT.offset += MULTI_SELECT.limit;
                    MULTI_SELECT.showNextSearch();
                }

            }, 140);
        }
    },

    showNextSearch: function() {
        const oSlice = this.oSearchObj.slice(this.offset, (this.offset + this.limit));
        oSlice.find('label.eSelected .fChk').attr('checked', 'checked');
        $('.multiSelectDiv.selected').find('.result').append(oSlice);
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

    addOption: function(sTargetDivName, sOptionKey, sOptionValue) {
        // form 선택
        const $oMultiSelectDiv = $('div[name="' + sTargetDivName + '"]');

        // .eVaule 단일 일 경우만
        if ($oMultiSelectDiv.find('.eValue').length !== 1) {
            return false;
        }

        const sSubmitName = $oMultiSelectDiv.find('.eValue').attr('name');

        const sId = sTargetDivName + '_' + sSubmitName + '_' + sOptionKey;
        let sOption = '';
        sOption += '<li class="selectionList">';
        sOption += '<label id="' + sTargetDivName + '_' + sSubmitName + '_label_' + sOptionKey + '" class="eSearchChk ' + sTargetDivName + '_' + sSubmitName + '_label_' + sOptionKey + '">';
        sOption += '<input type="checkbox" data-key="' + sSubmitName + '" id="' + sId + '" class="fChk fChkValue ' + sTargetDivName + '_' + sSubmitName + '_' + sOptionKey + '" value="' + sOptionKey + '">';
        sOption += '<span class="">' + sOptionValue + '</span>';
        sOption += '</label>';
        sOption += '</li>';

        const $option = $(sOption);
        MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')].find('li:first').after($option.clone());
        $option.appendTo($oMultiSelectDiv.find('.result'));
        $oMultiSelectDiv.find('#' + sId).click();
    },

    /**
     * 검색 데이터 실 Value 형식으로 세팅
     * @param sSearchInputText
     */

    //FIXME: 
    setInputTextValue: function() {
        const $oMultiSelectDiv = $('.multiSelectDiv.selected');
        const $oSearchTextArea = $oMultiSelectDiv.find('.eSearchTextArea');
        const sPlaceHolder = $oSearchTextArea.attr('placeholder');
        const aNotSelected = Object.keys(MULTI_SELECT.oPlaceHolder).map(function(e) {
            return MULTI_SELECT.oPlaceHolder[e];
        });

        if ($.inArray(sPlaceHolder, aNotSelected) > -1) {
            const $oResultUl = MULTI_SELECT.oBasicObj[$oMultiSelectDiv.attr('name')];

            if ($oResultUl.find('.chk_all').length > 0) {

                // 미선택, 전체체크 사용 시 전체선택
                $oResultUl.find('.fChk').attr('checked', true);
                $oResultUl.find('label').addClass('eSelected');

                const $aCheckedObj = $oResultUl.find('.fChk:checked').not('.chk_all');
                MULTI_SELECT.setTotalInfo($aCheckedObj, true, $oMultiSelectDiv);
                MULTI_SELECT.setSubmitValue($aCheckedObj, $oMultiSelectDiv);
                MULTI_SELECT.setPlaceHolder($aCheckedObj, true, $oMultiSelectDiv);
            }
        }
    },

    setPlaceHolderToValue: function(){
        const $oMultiSelectDiv = $('.multiSelectDiv.selected');
        const $oSearchTextArea = $oMultiSelectDiv.find('.eSearchTextArea');
        const sPlaceHolder = $oSearchTextArea.attr('placeholder');
        
        $oSearchTextArea.val(sPlaceHolder);
    },

    checkCount: function($oMultiSelectDiv) {
        const $oSearchTextArea = $oMultiSelectDiv.find('.eSearchTextArea');
        const $oResultUl = this.oBasicObj[$oMultiSelectDiv.attr('name')];

        if ($oResultUl.find('.chk_all').length < 1) {
            // 전체체크 미사용 시, 개수 체크
            const iLimit = $oSearchTextArea.attr('data-select-limit');
            const sMessage = $oSearchTextArea.attr('data-select-limit-message');
            if (iLimit === undefined || sMessage === undefined) {
                return true;
            }

            if ($oResultUl.find('label.eSelected').length >= Number(iLimit)) {
                alert(__(sMessage));
                //console.dir(sMessage)
                return false;
            }

            return true;
        }
    },

    setBubblePosition: function() {
        const $oMultiSelectDiv = $('.multiSelectDiv.selected'),
            $oGroup = $oMultiSelectDiv.children('.group'),
            heightSelect = $oMultiSelectDiv.outerHeight(),
            heightGroup = $oGroup.outerHeight(),
            $prtModalBody = $oMultiSelectDiv.closest('.modal-body'),
            hasModalBody = $prtModalBody.length > 0 ? true : false,
            $scrollContent = hasModalBody ? $prtModalBody : $(window);

        let offTopSelect = $oMultiSelectDiv.offset().top,
            scrollPosition = $scrollContent.scrollTop() + $scrollContent.outerHeight();

        if (hasModalBody) {
            scrollPosition = $scrollContent.outerHeight() - $prtModalBody.offset().top - $(".modal-footer").outerHeight();
        } else {
            scrollPosition -= $('.content-footer').outerHeight();
        }

        var viewport = OFFSET.Viewport({
            $wrap: $oMultiSelectDiv,
            $plus: $oGroup,
            $minus: hasModalBody ? $prtModalBody.find('.modal-footer') : $('.content-footer')
        });

        if(viewport.show){
            $oGroup.removeClass("above");
        }else{
            if(viewport.spaceTop){
                $oGroup.addClass("above");
            }
            else{
                $oGroup.removeClass("above");
            }
        }

        // var $minusElement = !hasModalBody || $('.content-footer');
        // var viewport = OFFSET.inScreen({
        //     wrap: $oMultiSelectDiv,
        //     plus: $oGroup,
        //     minus: $minusElement
        // });

        // if(viewport){
        //     $oGroup.removeClass("above");
        // }else{
        //     $oGroup.addClass("above");
        // }

        // if (offTopSelect + heightSelect + heightGroup >= scrollPosition) {
        //     $oGroup.addClass("above");
        // } else {
        //     $oGroup.removeClass("above");
        // }
    },

    /**
     * 초기화
     */
    init: function() {
        $.each($('.multiSelectDiv'), function(i, obj) {
            const $obj = $(obj);
            const sMultiSelectDivName = $obj.attr('name');

            if ((sMultiSelectDivName in MULTI_SELECT.oBasicObj) === false) {
                MULTI_SELECT.oBasicObj[sMultiSelectDivName] = $obj.find('.result').clone();
            }

            if ((sMultiSelectDivName in MULTI_SELECT.oPlaceHolder) === false) {
                MULTI_SELECT.oPlaceHolder[sMultiSelectDivName] = $obj.find('.eSearchTextArea').attr('data-placeholder');
            }
        });

        MULTI_SELECT.bindEvent();
    },
};

$(document).ready(function() {
    MULTI_SELECT.init();
});

/**
  * SUIO Markup Check v.20171012
*/

$.fn.eDebug = function(opts){
    // debug
    var propHost = $(location).attr('host'),
        flagHost = false;
    if(propHost == "fe.cafe24test.com"){
        flagHost = true;
    }
    var objDebug = {
        eInit : function(){
            // calling dynamic function
            for(i in opts){
                if(opts[i] == true && i != 'eReport'){
                    this[i].apply(this);
                }
            }
            // calling report ctrl
            objDebug.eReportCtrl();
        },
        eTableAlign : function(){
            var findTbody = $('.mBoard tbody:not(.empty)');
            findTbody.each(function(){
                var findThis = $(this),
                    propTbodyInfo = eTbodyAlign(findThis),         // findThis 정렬 확인
                    findTr = $(this).find('> tr:first-child'),
                    findTd = findTr.find('> td'),                 // td 정렬 갯수
                    propTdInfo = eTdAlign(findTr, propTbodyInfo);    // 가장많은 정렬 확인

                if(findTd.length > 0){
                    eAlignCalc(propTdInfo, propTbodyInfo, findThis);
                }
            });
            // tbody 정렬 확인
            function eTbodyAlign(findThis){
                var propClass = "";
                if(findThis.attr('class')){
                    propClass = findThis.attr('class').split(' ');
                }
                var figureCount = 0,
                    strTbodyClass;

                for(var i=0; i<propClass.length; i++){
                    var propAlign = propClass[i];
                    if(propAlign == 'left'){
                        figureCount ++;
                        strTbodyClass = 'left';
                    } else if(propAlign == 'center'){
                        figureCount ++;
                        strTbodyClass = 'center';
                    } else if(propAlign == 'right'){
                        figureCount ++;
                        strTbodyClass = 'right';
                    }
                }
                // tbody 정렬 2개 이상여부
                if(figureCount > 1){
                    findThis.parents('table:first').addClass('overlapTbodyAlign').before('<p class="overlapMsg">tbody 정렬이 2개 이상 사용되었습니다.</p>');
                }
                // tbody에 선언된 class 반환
                return strTbodyClass;
            }
            // td 정렬 갯수
            function eTdAlign(findTr, propTbodyInfo){
                var findTd = findTr.find('td'),
                    figureMax = findTd.length,
                    figureLeft = 0,
                    figureCenter = 0,
                    figureRight = 0,
                    figureLeftDefault = 0;

                findTd.each(function(){
                    var propClass = "";
                    if($(this).attr('class')){
                        propClass = $(this).attr('class').split(' ');
                    }
                    for(var i=0; i<propClass.length; i++){
                        var propAlign = propClass[i];
                        if(propAlign == 'left'){
                            figureLeft ++;
                        } else if(propAlign == 'center'){
                            figureCenter ++;
                        } else if (propAlign == 'right'){
                            figureRight ++;
                        }
                    }
                });

                figureLeftDefault = figureLeft;

                // tbody class와 비교, 각 정렬별 갯수 지정
                if(propTbodyInfo == 'left'){
                    figureLeft = figureMax - (figureCenter + figureRight);
                } else if(propTbodyInfo == 'center'){
                    figureCenter = figureMax - (figureLeft + figureRight);
                } else if(propTbodyInfo == 'right'){
                    figureRight = figureMax - (figureLeft + figureCenter);
                } else {
                    figureLeft = figureMax - (figureCenter + figureRight);
                }

                // td정렬갯수 반환(왼쪽, 가운데, 오른쪽, td총 갯수);
                var arrResult = [figureLeft, figureCenter, figureRight, figureMax, figureLeftDefault];
                return arrResult;
            }
            // 가장많은 정렬 확인
            function eAlignCalc(propTdInfo, propTbodyInfo, findThis){
                var figureIndex = 0,
                    figureIndexVal = 0,
                    figureOverlap = 0;
                // propTdInfo.length-2 : 배열중 정렬에 해당하는값 반복(0~2)
                for(var i=0; i<propTdInfo.length-2; i++){
                    var figureVal = propTdInfo[i];
                    if(figureIndexVal == figureVal){
                        figureOverlap++;
                    }
                    if(figureIndexVal < figureVal){
                        figureIndex = i;
                        figureIndexVal = figureVal;
                    }
                }
                var propAlign;
                if(figureIndex == 0){
                    propAlign = 'left';
                } else if(figureIndex == 1){
                    propAlign = 'center';
                } else if(figureIndex == 2){
                    propAlign = 'right';
                }
                // 가장많은 정렬 class추가
                if(propAlign != propTbodyInfo && figureOverlap == 0 && propTdInfo[3]> 2 && propTbodyInfo != undefined){
                        //@조건
                        //- 가장많은 정렬(propAlign)과 tbody에 지정된 정렬(propTbodyInfo)이 다른경우
                        //- 중첩횟수(figureOverlap)가 0 일때
                        //- td의 갯수(propTdInfo[3])가 3개 이상일때
                        //- tbody에 지정된 정렬(propTbodyInfo)이 left, right, center가 존재하면
                    findThis.parents('table:first').addClass('manyAlign').before('<p class="manyAlignMsg">tbody에 가장 많은 정렬을 class('+ propAlign +') 사용하세요.</p>');
                }
                // tbody에 class없이 td에만 정렬
                if(propTbodyInfo == undefined){
                        //@조건
                        //- 중첩횟수(figureOverlap)가 1이상
                        //- 가장 많은 정렬값(figureIndexVal)이 1이상
                        //- tbody에 지정된 정렬(propTbodyInfo)이 left, right, center가 존재하지 않으면
                    var findTd = findThis.find(' >tr > td'),
                        figureLength = findTd.size(),
                        figureCheckR = 0,
                        figureCheckL = 0,
                        figureCheckC = 0;
                    findTd.each(function(){
                        var propClass = "";
                        if($(this).attr('class')){
                            propClass = $(this).attr('class').split(' ');
                        }else{
                            figureCheckL++;
                        }
                        for(var i=0; i<propClass.length; i++){
                            var align = propClass[i];
                            if(align == 'center'){
                                figureCheckC++;
                            } else if(align == 'right'){
                                figureCheckR++;
                            }
                        }
                    });

                    if(figureLength > 1){
                        if(figureCheckL > 1 || figureCheckC > 1 || figureCheckR > 1){
                            if(figureCheckL >= figureCheckC && figureCheckL >= figureCheckR){
                            }else{
                                findThis.parents('table:first').addClass('onlyAlignMsg').before('<p class="tdOnlyAlignMsg">td에 사용된 class 중 가장 많은 정렬 중 하나를 tbody에 사용하세요.</p>');
                            }
                        }
                    }
                }
            }
        },
        eTableCheck : function(){
            if(flagHost){
                var figureCount=0;
                $('.allChk').each(function(i){
                    var porpBoardName = "";
                    if($(this).parents('table:first').parent().attr('class')){
                        porpBoardName = $(this).parents('table:first').parent().attr('class').split(" ");
                    }
                    var findBoard;
                    if(porpBoardName[0] == "mBoard"){
                        findBoard = $(this).parents('.mBoard:first');
                    }else{
                        findBoard = $(this).parents('.mGridTable:first');//.find('.grid-tbody');
                    }

                    var findTbody = findBoard.find('> table > tbody:not(.empty)'),
                        figureLength = findTbody.length;

                    if(!findBoard.hasClass('typeHead')){
                        if(figureLength > 1){
                            if(!$(this).parents('table:first').hasClass('eChkBody')){
                                findBoard.css({'position':'relative'}).append('<div class="dTableWrap"><span class="dTableMsg">&lt;table class="eChkBody"&gt;를 넣으세요</span></div>');
                                figureCount++;
                            }
                        } else {
                            var findTable = findBoard.find('> *');
                            if(findTable[0].tagName == 'FORM') {
                                findTable = findTable.find('>table');
                            } else {
                                findTable = findTable;
                            }

                            if(porpBoardName[0] != "mBoard"){
                                findTable = findTable.find('table');
                            }

                            if(!findTable.hasClass('eChkTr') && !findTable.hasClass('eChkColor')){
                                findBoard.css({'border':'1px solid #467bff'}).prepend('<span class="dTableMsg">전체 체크 기능: table 태그에 "eChkTr" 혹은 "eChkColor" 클래스를 넣어주세요.</span>');
                                figureCount++;
                            }
                        }
                    }else{
                        if(findBoard.find('table').hasClass('eChkTr') || findBoard.find('table').hasClass('eChkColor')){
                            findBoard.css({'position':'relative'}).append('<div class="dTableWrap"><span class="dTableMsg">전체 체크 기능: typeHead 의 table 태그에 "eChkTr" 혹은 "eChkColor" 클래스를 넣지않습니다.</span></div>');
                            figureCount++;
                        }
                    }

                    var figureLen = $(this).parents('.mBoardArea');
                    if(figureLen > 0){
                        var findParentBody = $(this).parents('.mBoardArea').find('.typeBody table');
                        if(!findParentBody.hasClass('eChkColor') && !findParentBody.hasClass('eChkTr')){
                            findBoard.css({'position':'relative'}).append('<div class="dTableWrap"><span class="dTableMsg">전체 체크 기능: typeBody 의 table 태그에 "eChkTr" 혹은 "eChkColor" 클래스를 넣어주세요.</span></div>');
                            figureCount++;
                        }
                    }
                });
                $('table[class*=eChk]').each(function(){
                    if($(this).closest('.mGridTable').length>0&&$(this).closest('.grid-fixed-column').length<=0){
                        var target = $(this).closest('.mGridTable');
                    }else{
                        var target = $(this).closest('.mBoard');
                    }
                    if(!target.hasClass('typeBody')){
                        if($(this).find('.allChk').length <= 0){
                            target.css({'position':'relative'}).prepend('<div class="dTableWrap"><span class="dTableMsg">표안에 checkbox가 없습니다. &lt;table class="eChkXX"&gt; 를 제거하세요</span></div>');
                            figureCount++;
                        }
                    }
                });

                // table th 태그에 scope 속성 자체가 누락되었거나, 속성값 이외의 값을 적용할 경우 배경색 지정
                $("table th").each(function(){
                    var propScope = $(this).attr("scope");
                    if(propScope == ""){
                        $(this).css({"border":"1px solid #467bff","position":"relative"});
                        $(this).addClass("scopenone");
                        $(this).parents('.mBoard').addClass("scopenoneP");
                        figureCount++;
                    }else if(propScope != "col" && propScope != "row" && propScope != "colgroup" && propScope != "rowgroup"){
                        $(this).css({"border":"1px solid #50a54c","position":"relative"});
                        $(this).addClass("scopeerror");
                        $(this).parents('.mBoard').addClass("scopeerrorP");
                        figureCount++;
                    }
                });

                // mGridTable에 rowspan 적용시 table 태그에 bgClear 클래스가 누락된 경우
                $(".mGridTable td").each(function(){
                    if($(this).attr('rowspan') > 1 && $(this).parents('table').hasClass('bgClear') == false){
                        $(this).parents('table').css("border","2px solid #467bff").prepend('<div class="eVirtual">mGridTable에 rowspan 적용시 table 태그에 bgClear 클래스 추가</div>');
                        figureCount++;
                        return false;
                    }
                });

                objDebug.eReport('체크박스 테이블', figureCount);
            }
        },
        eQaId : function(){
            var figureCount=0,
                findSection = $('.section'),
                arrQaId = [];

            if(findSection.length > 0){
                findSection.each(function(i){
                    // QA_로 시작되는지 여부
                    var propQaId = $(this).attr('id');

                    if(!propQaId){propQaId="";}
                    var reg = new RegExp('^QA_','gi'),
                        flag = reg.test(propQaId);

                    //EC 어드민일때만 QA ID 체크
                    var strDomUrl = document.location.pathname;
                    if(!strDomUrl.indexOf('/smartAdmin/') || !strDomUrl.indexOf('/ec/')|| !strDomUrl.indexOf('/ec_ja_JP/')){
                        if(flag == false && propQaId ){
                            $(this).addClass('qaId');
                            figureCount++;
                        }
                        // 아이디 할당여부
                        if(!propQaId){
                            $(this).addClass('qaAssign');
                            figureCount++;
                        }
                        // QA 아이디 리스트
                        if(propQaId != ''){
                            arrQaId.push(propQaId);
                        }
                    } else { //EC 어드민 외에 QA ID 적용시 경고
                        if(propQaId != ''){
                            alert("section의 QA ID는 EC 어드민에서만 사용합니다.");
                            $('#qaIdViewer').remove();
                            $('#qaIdViewToggle').parent().remove();
                        }
                    }
                });
                // QA 아이디 보이기
                if(arrQaId.length > 0){
                    for(var i=0; i<arrQaId.length; i++){
                        $('#qaIdViewer ul').append('<li><a href="#'+ arrQaId[i] +'">'+ arrQaId[i] +'</a></li>');
                    };
                }
                $('#qaIdViewer .eClose').click(function(){
                    $('#qaIdViewToggle').trigger('click');
                });
            }
            objDebug.eReport('section QA ID', figureCount);
        },
        eGLabel : function(){
            var figureCount=0;
            $('div.mForm').each(function(){
                var figureLabel = $(this).find('> .gLabel').length;
                var figureAddForm = $(this).find('.addForm').length;
                if(figureLabel > 0 && figureAddForm == 0) {
                    $(this).addClass('divMform');
                    figureCount++;
                }
            });
            objDebug.eReport('.mForm > .gLabel', figureCount);
        },
        eText : function(){
            var figureCount=0;
            var arrTxtCheck = ['txtWarn', 'txtEm', 'txtNormal'];
            for(var i=0; i<arrTxtCheck.length; i++){
                var findTarget = $('.' + arrTxtCheck[i]);
                findTarget.each(function(){
                    var figureStrong = $(this).find('strong').length;
                    var figureHasText = this.childNodes.length;
                    if(figureStrong > 0 && figureHasText == 1){
                        $(this).before('<span class="txtCheckMsg"><span> &lt;strong class="'+ arrTxtCheck[i] +'"&gt;</span></span>');
                        figureCount++;
                    }
                });
            }
            objDebug.eReport('txtWarn, txtEm, txtNormal', figureCount);
        },
        eLabel : function(){
            var figureCount=0;
            $('label').each(function(){
                var figureInput = $(this).find('input').length,
                    figureSelect = $(this).find('select').length,
                    figureArea = $(this).find('textarea').length,
                    figureTotal = figureInput + figureSelect + figureArea;
                if(figureTotal > 1){
                    $(this).addClass('txtOverflowForm');
                    figureCount++;
                }
            });
            objDebug.eReport('Label > 다수의 폼태그', figureCount);
        },
        ePopup : function(){
            var figureCount=0;
            var reg = new RegExp("새창 열림");
            $('a').each(function(){
                var propTarget = $(this).attr('target'),
                    propTitle = $(this).attr('title');

                if(!propTarget)propTarget="";
                if(!propTitle)propTitle="";

                // 타겟 없고, 타이틀만 있을때
                if(!propTarget && propTitle.match(reg)){
                    $(this).css({'position': 'relative'});
                    $(this).append('<em class="dBlankA">&lt;target="_blank"&gt; 누락</em>');
                    figureCount++;
                }
                // 타겟만 있을때
                if(propTarget && !propTitle){
                    $(this).css({'position': 'relative'});
                    $(this).append('<em class="dBlankA">&lt;title="새창 열림"&gt; 누락</em>');
                    figureCount++;
                }
                // title이 오타일때
                if(propTarget == '_blank' && propTitle && !propTitle.match(reg)){
                    $(this).css({'position': 'relative'});
                    $(this).append('<em class="dBlankA">&lt;title="새창 열림"&gt;의 띄어쓰기/포함여부 확인</em>');
                    figureCount++;
                }
            });
            objDebug.eReport('버튼 새창열기', figureCount);
        },
        ePopupSize : function(){
            if($('body').attr('id') == 'popup'){
                //팝업 size 영역
                var propSize = $("#popup").attr("size");
                if(!propSize){
                    $("#popup").append('<p id="popupSize">※ 팝업은 <strong>size(가로,세로) 값을 필수</strong>로 기재합니다. 해당영역은 더블클릭하면 사라집니다.<br />※ 가이드: <span class="txtWarn">&lt;body id="popup" size="720, 450"&gt;&lt;!-- 참고 : size 속성은 팝업 가로/세로 체크용입니다. 개발진행시에 팝업사이즈에 적용해주시고, size 는 삭제해주세요. --&gt;</span><br />※ size 최대값은 1100, 800 이며 사이즈 제한이 불필요한 경우는 <strong>free를 추가</strong>하세요. ex) &lt;body id="popup" size="1280, 800, free"&gt;</p>');
                    $('#popupSize').dblclick(function(){
                        $('#popupSize').hide();
                    });
                } else {
                    var strWidth = propSize.split(",")[0];
                        strHeight = propSize.split(",")[1],
                        strFreeSize = propSize.split(",")[2];

                    if( typeof(strFreeSize) == 'undefined' || strFreeSize.indexOf('free') == -1) { // free 표시 없을 때
                        if(strWidth>1100 || strHeight>800) { alert("팝업size 확인해주세요! (최대 1100, 800)"); } // size 초과하는 경우
                    } else {
                        if(strHeight>800) { alert("팝업 세로 사이즈는 800 까지 가능합니다."); } // 세로 사이즈가 800 이상인 경우
                    }
                }

                // 팝업내 mBoard와 mBoardArea 사이즈 체크
                $(".mBoard col").each(function() {
                    var findBoardArea = $(this).parents().is('.mBoardArea'),
                        findThead = $(this).closest('.mBoard').children().children().is('thead'),
                        propCol = $(this).attr('style');

                    if(findBoardArea){
                        var propWidth = $(this).parents('.mBoardArea').css('min-width');
                        if(propWidth == "0px"){
                            eDebugClass($(this).closest('.mBoardArea'), 'minwidth');
                        }
                    } else if (findThead) {
                        if(propCol != null ){
                            var figureStyle = propCol.indexOf('auto'),
                                parentLength = $(this).parents('.mBoard').length;
                            if(figureStyle > 0 && parentLength<=1) {
                                eDebugClass($(this).closest('.mBoard'), 'colauto');
                            }
                        }
                    }
                });

                // 디버깅 메시지 클래스추가 함수
                function eDebugClass(findTarget, str) {
                    findTarget.addClass('eDebug-'+str);
                }
            }
        },
        eBtnIcon : function(){
            var figureCount=0;

            function eBlankIcon(findTarget){
                var figureResult = findTarget.find('.icoLink').length;
                if(figureResult == 0){
                    findTarget.append('<em class="dBlankA">target="_blank" 가 사용된 버튼은 &lt;em class="icoLink"&gt;&lt;/em&gt; 아이콘 추가</em>');
                }
            }
            $('.btnNormal').each(function(){
                if($(this).attr('target') == '_blank'){
                    eBlankIcon($(this));
                }
            });
            $('.btnCtrl').each(function(){
                if($(this).attr('target') == '_blank'){
                    eBlankIcon($(this));
                }
            });
            $('.icoLink').each(function(){
                var propTarget = $(this).parents('a:first').attr('target'),
                    propTitle = $(this).parents('a:first').attr('title');
                if(!propTitle && !propTarget){
                    $(this).parents('a:first').append('<em class="dTcoLink">&lt;target="_blank"&gt; &lt;title="새창 열림"&gt; 누락</em>');
                    figureCount++;
                }
            });
            objDebug.eReport('.btnIcon', figureCount);
        },
        eBtnLink : function(){
            var figureCount=0;
            $('.btnLink > *').each(function(){
                var strText = $(this).text();
                if(this.tagName != 'SPAN' && this.tagName != 'STRONG'){
                    $(this).css({'position':'relative'}).append('<em class="dBtnWrap">&lt;span&gt; or &lt;strong&gt; 누락</em>');
                    figureCount++;
                } else {
                    if(strText.indexOf("[") == -1){
                        $(this).css({'position':'relative'}).append('<em class="dBtnWrap">[대괄호] 누락</em>');
                        figureCount++;
                    }
                }
            });
            objDebug.eReport('.btnLink', figureCount);
        },
        eCtrl : function(){
            var figureCount=0;
            $('.mCtrl .btnCtrl').each(function(){
                if($(this).find('.icoPlus').length > 0){
                    $(this).append('<em class="dCtrlPlus">SUIO 표준이 아니므로 아이콘 삭제 필요</em>');
                    figureCount++;
                }
            });
            objDebug.eReport('.mCtrl > .icoPlus', figureCount);

            // /solution/cmc/advanced/ 일때 mCtrl 디버깅
            var strDomUrl = document.location.pathname,
                figureAdvCount = 0,
                figureIndex = strDomUrl.indexOf("/solution/cmc/advanced/");

            if(figureIndex >= 0){
                $('.mCtrl').each(function(i){
                    var flagAdvancedClass = $(this).hasClass('advanced'),
                        flagTypeHeader = $(this).hasClass('typeHeader');
                    if(!flagAdvancedClass){
                        figureAdvCount++;
                        $(this).before('<p class="manyAlignMsg">mCtrl클래스에 항상 advanced클래스 필요.</p>');
                    }
                    if(flagTypeHeader){
                        var figureLength = $(this).find('#listSubject .length').length,
                             findTarget = $(this).prev().siblings('.mBoard '),
                             flagGlistClass = findTarget.hasClass('gList');
                        if(figureLength > 0){
                            if(!flagGlistClass){
                                figureAdvCount++;
                                $(this).before('<p class="manyAlignMsg">mCtrl에 gSetting (설정 버튼)안에 #listSubject .length가 있으면 형제노드 .mBoard에 gList 클래스 필요.</p>');
                            }
                        }else{
                            if(flagGlistClass){
                                figureAdvCount++;
                                $(this).before('<p class="manyAlignMsg">mCtrl에 gSetting (설정 버튼)안에 #listSubject .length가 없으면 형제노드 .mBoard에 gList 클래스 불필요.</p>');
                            }
                        }
                    }
                });
                objDebug.eReport('mCtrl의 advanced, mBoard의 gList 체크', figureAdvCount);
            }
        },
        eEditor : function(){
            var figureCount=0,
                arrEditor = ['@editor\.gif','@editor_mini\.gif'];
            $('img').each(function(){
                var propSrc = $(this).attr('src');
                for(var i=0; i<arrEditor.length; i++){
                    var reg = new RegExp(arrEditor[i],'gi');
                    var flag = reg.test(propSrc);
                    if(flag){
                        var findParent = $(this).parent();
                        if(!findParent.hasClass('gEditor')){
                            findParent.addClass('editorMsg');
                            figureCount++;
                        }
                    }
                }
            });
            objDebug.eReport('에디터 class', figureCount);
        },
        eReport : function(strTitle, figureCount){
            if(figureCount > 0){
                $('#dReport ul').append('<li>'+ strTitle +'<strong>('+ figureCount +')</strong></li>');
            }
        },
        eReportCtrl : function(){
            var figureCount = $('#dReport li').size();
            if($('#dReport li').size() > 0){
                $('#debugArea h1 a').text('('+ figureCount +')');
                $('#debugArea h1 a').attr('title', '총 '+figureCount+'개의 디버그가 발생');
            }
        },
        eFText : function(){
            var figureCount=0;
            $(".fText").each(function(){
                var propStyle = $(this).attr("style"),
                    propClass = $(this).attr("class"),
                    propParent = $(this).parent().attr("class");

                if( typeof(propParent) == 'undefined' || (propParent.indexOf('gNumber') == -1 && propParent.indexOf('fEdit') == -1)) { // 부모가 gNumber, fEdit(생산관리시스템)인 것 제외
                    if ( typeof(propClass) == 'undefined' || propClass.indexOf('gDate') == -1 ) { // gDate 제외
                        if ( typeof(propStyle) == 'undefined' || propStyle.indexOf('width') == -1 ) {
                            $(this).css("background-color","#ffd3d3");
                            $(this).val("width 누락");
                            figureCount++;
                        }
                    }
                }
            });
            objDebug.eReport('fText style width 지정', figureCount);
        },
        eTooltip : function (){
            var figureCount=0;
            $(".mTooltip .content > p, .mTooltip .content > ul, .mTooltip .content > ol").each(function(){
                var propClass = $(this).attr("class");
                if ( typeof(propClass) == 'undefined' || propClass == ''){
                    $(this).css("outline","2px solid #ca5ccb");
                    figureCount++;
                }
            });
        },
        eCss : function (){
            // css check
            var findHeadCss = $('head link');
            var figureSuioFind = 0;
            findHeadCss.each(function(){
                var propHref = $(this).attr('href').split('/');
                if(propHref[propHref.length-1] == 'suio.css'){
                    figureSuioFind++;
                }
            });
            if(figureSuioFind <= 0){
                alert('suio.css로 제작되지 않았습니다.');
                return false
            }
        },
        eMTip : function (){
            // mTip 영역에 show 클래스가 있을 경우
            $(".mTip").each(function(){
                var figureCount = 0;
                if( $('.mTip').hasClass('show') ){
                    $(this).append('<span class="eDebug">mTip 영역에 show삭제</span>');
                    $(this).css('outline', '1px solid #467bff');
                }
            });
        },
        eMSearchEngine : function (){
            $(".mSearchEngine .search table").each(function(){
                if($(this).children("caption").text() != "검색"){
                    $(this).parents('.search').css("border","2px solid #467bff").prepend('<div class="eVirtual">mSearchEngine 의 caption 값은 "검색"으로 통일</div>');
                }
            });
        },
        eIntroduceArea : function (){
            // introduceArea 서비스명으로 다중 클래스가 누락된 경우
            $(".introduceArea").each(function(){
                var propClass = $(this).attr("class"),
                    strCheckClass = propClass.replace('introduceArea', '');
                if(strCheckClass == ""){
                    $(this).css("border","2px solid #467bff").prepend('<div class="eVirtual">introduceArea에 각 서비스명으로 다중 클래스 추가</div>');
                }
            });
            // mIntroTab 의 아래 탭 내용영역에 gContent 클래스가 누락된 경우
            $(".mIntroTab").each(function(){
                if($(this).next().hasClass("gContent") == false){
                    $(this).next().css("border","2px solid #467bff").prepend('<div class="eVirtual">mIntroTab 의 아래 형제레벨인 탭 내용영역에 gContent 클래스 필수</div>');
                }
            });
            // mIntroProcess li 7개 이상일때, typeVer 클래스가 누락된 경우
            $(".mIntroProcess").each(function(){
                if( $(this).children("ol").children().length > 6 && $(this).hasClass("typeVer") == false){
                    $(this).css("border","2px solid #467bff").prepend('<div class="eVirtual">mIntroProcess의 li 7개 이상은 typeVer 사용할 것</div>');
                }
            });
            // 이메일관련 a태그에 mailto & txtLink 누락된 경우
            $("introduceArea a").each(function(){
                if($(this).text().indexOf("@") > 0 && $(this).attr("href").indexOf("mailto") < 0){
                    $(this).css("border","2px solid #467bff").prepend('<div class="eVirtual">이메일양식 @문자가 포함된 경우, a href 속성에 mailto 필수</div>');
                }
                if($(this).attr("href").indexOf("mailto") >= 0 && $(this).hasClass("txtLink") == false){
                    $(this).css("border","2px solid #467bff").prepend('<div class="eVirtual">a href 속성에 mailto를 포함한 경우, txtLink 클래스 필수</div>');
                }
            });
            // recommend 추천 부가서비스의 service 갯수와 paginate 갯수가 다를 경우 (단, service 1개에 paginate가 없는 경우는 제외)
            $(".mIntroQuick .recommend").each(function(){
                if($(this).children(".paginate").children().length != 0){
                    if( $(this).children(".service").children().length != $(this).children(".paginate").children().length) {
                        $(this).css("border","2px solid #467bff").append('<div class="eVirtual">service li갯수와 paginate li갯수는 동일할 것</div>');
                    }
                }
            });
            // mIntroFlow 서비스 흐름도의 대체텍스트 blind 없는 경우
            $(".mIntroFlow").each(function(){
                if($(this).children().hasClass("blind") == false){
                    $(this).css("border","2px solid #467bff").prepend('<div class="eVirtual">서비스 흐름도 mIntroFlow사용시, 설명을 위한 대체텍스트 blind 영역 필수</div>');
                }
            });
            // txtDiscount 앞의 형제레벨로 txtDel 없는 경우
            $(".introduceArea .txtDiscount").each(function(){
                if($(this).parent().children().hasClass("txtDel") == false){
                    $(this).css("border","2px solid #467bff").prepend('<div class="eVirtual">txtDiscount사용시, 앞의 형제레벨로 txtDel 필수</div>');
                }
            });
        },
        eClass : function (){
            //type class 첫번째 클래스 m으로 시작 하지 않는 경우
            $('[class*=type]').each(function(){
                var findThis = $(this),
                    propName = findThis.attr("class"),
                    strFirstchar = propName.charAt(0);

                if(strFirstchar != "m"){
                    findThis.css("border","2px solid #467bff").prepend('<div class="eVirtual">type 클래스는 모듈클래스의 타입으로만 추가 가능</div>');
                }
            });

            //theme class 첫번째 클래스 m으로 시작 하지 않는 경우
            $('[class*=theme]').each(function(){
                var findThis = $(this),
                    propName = findThis.attr("class"),
                    strFirstchar = propName.charAt(0);

                if(strFirstchar != "m"){
                    findThis.css("border","2px solid #467bff").prepend('<div class="eVirtual">theme 클래스는 모듈클래스의 테마로만 추가 가능</div>');
                }
            });
        },
        eImgPath : function (){
            if(flagHost){
                //페이지 css 경로 추출 및 예외 css 배제
                var arrException = ["/css/scm/dhub/select2.css","http://ad.cafe24.com/adManager/util/javascript/admngCSS.css?ver=1.0.0"], //예외 css 파일경로 추가가능
                    arrRemember = [],
                    strCssURL = "//img.echosting.cafe24.com",
                    arrFolderChk = ["/font/"],  // 예외 폴더명 추가 가능.
                    flag = false;

                $('link').each(function(i){
                    var propHref = $(this).attr('href');
                    if(propHref){
                        var figureIndex = propHref.indexOf("debug");
                        if(figureIndex < 1){
                            var figureChk = propHref.indexOf(strCssURL),
                                strUrlName = propHref;
                            if(figureChk >= 0){
                                var arrUrl = propHref.split(strCssURL);
                                strUrlName = arrUrl[1];
                            }
                            var figureAdd = 0;
                            for(var m = 0; m<arrFolderChk.length; m++){
                                var figureIndex = strUrlName.indexOf(arrFolderChk[m]);
                                if(figureIndex <= 0){
                                    figureAdd++;
                                }
                            }
                            if(arrFolderChk.length <= figureAdd){
                                arrRemember.push(strUrlName);
                            }
                        }
                    }
                });

                for(var j = 0; j<arrException.length; j++){
                    for(var m = 0; m<arrRemember.length; m++){
                        if(arrException[j] == arrRemember[m]){
                            arrRemember.splice(m ,1);
                        }
                    }
                }
                for(var n = 0; n<arrRemember.length; n++){
                    var strUrlPath = arrRemember[n];
                    eCssUrlPathChaeck(strUrlPath);
                }

                //css 경로 로드
                function eCssUrlPathChaeck(strUrlPath){
                    $.ajax({
                        url: strUrlPath,
                        dataType: 'text',
                        success: function(data) {
                            eUrlEdit(data, strUrlPath);
                        }
                    });
                }

                //로드한 css 텍스트 편집
                function eUrlEdit(data, strUrlPath){
                    var arrUrlExtract = data.split('url(');
                    for(var i = 0; i<arrUrlExtract.length; i++){
                        var str = arrUrlExtract[i],
                            figureStart = 1,
                            figureEnd = str.indexOf(")", figureStart),
                            strUrl = str.substring(figureStart, figureEnd-1);
                        if(i > 0){
                            eUrlRightChk(strUrlPath, strUrl, null);
                        }
                    }
                }

                //편집한 텍스트 디버깅
                function eUrlRightChk(strUrlPath, strUrl, findTarget){
                    // 디버깅 대상 이미지 서버
                    var figureImg1 = strUrl.indexOf("img.echosting.cafe24.com"),
                        figureImg2 = strUrl.indexOf("m-img.cafe24.com"),
                        figureImg3 = strUrl.indexOf("img.cafe24.com");

                    if(figureImg1 != 2 && figureImg2 != 2 && figureImg3 != 2){
                        if(!flag){
                            flag = true;
                            $('body').append('<div class="urlDebug eVirtual" style="position:fixed; top:0; left:0px; z-index:999;"><h4 style="padding:5px 0;">※ CSS 배포시 이미지 로컬경로 체크 필요! ( 더블클릭시 사라짐 )</h4><ul></ul></div>');
                            $('.urlDebug').dblclick(function(){
                                $('.urlDebug').hide();
                            });
                        }
                        $('.urlDebug ul').append('<li>- ['+strUrlPath+'] "'+strUrl+'"</li>');
                    }
                }
            }
        },
        eAttribute : function (){
            if(flagHost){
                var arrAttr = ["id", "class", "href", "target", "title", "name", "type", "value", "option", "style", "scope", "colspan", "rowspan"],
                    arrEx = ["chzn-container", "active-result"],
                    figureCount = 0;

                var figureGirdTableLen = $('.mGridTable').length,
                    flag = false;

                if(figureGirdTableLen > 0){ flag = true; }

                for(var i = 0; i<arrAttr.length; i++){
                    $('['+arrAttr[i]+'=], ['+arrAttr[i]+'=" "]').each(function(j){
                        var flagAttr = $(this).is('['+arrAttr[i]+']');
                        if(flagAttr){
                            var propEx = $(this).attr("class") ? $(this).attr("class") : '',
                                flagEX = false;
                            for(var j = 0; j<arrEx.length; j++){
                                var figureIndexOf = propEx.indexOf(arrEx[j]);
                                if(figureIndexOf > -1){
                                    flagEX = true;
                                }
                            }
                            if(flag && $(this).get(0).tagName == "BODY" && arrAttr[i] == "style"){
                            }else{
                                if(!flagEX){
                                    if(!$(this).hasClass('chosen-container')&&!$(this).parents('.chosen-container').length){
                                        objDebug._eAttrDebugMessage($(this), arrAttr[i]);
                                        figureCount++;
                                    }
                                }
                            }
                        }
                    });
                }
                objDebug.eReport('태그 속성', figureCount);
            }
        },
        eHelpTitle : function (){
            if(flagHost){
                var figureCount = 0;
                $('.mHelp').each(function(i){
                    var title = $(this).find('h3'),
                        titleLength = title.length;
                    if(titleLength==1){
                        title.css({"border":"1px solid #467bff"});
                        title.append('<span class="eDebug-helptitle">mHelp중 h3이 1개일때 h3을 삭제하고 mHelp > h2로 문구 이동</span>');
                        figureCount++;
                    }
                });
                objDebug.eReport('mHelp중 h3이 1개일때 mHelp > h2로 처리', figureCount);
            }
        },
        eIconSpace : function (){
            if(flagHost){
                var figureCount = 0;
                $('[class^="btn"]:not(.btnBubble):not(.btnQuick)').each(function(){ // btnBubble, btnQuick 제외
                    if($(this).find('span').length>0&&$(this).find('em').length>0){
                        var str = $.trim($(this).find('span').html());
                        if(str.indexOf("<em")==0){  // prefix
                            if(str.search(/\<\/em\>\s/) == -1){
                                $(this).css({"outline":"1px solid #467bff"});
                                $(this).append('<em class="eDebug-iconprefix">prefix 아이콘 뒤에 띄여쓰기 추가</em>');
                                figureCount++;
                            }
                        }
                        if(str.match(/\<\/em\>$/)){ // suffix
                            if(str.search(/\s\<em/) !== -1){
                                $(this).css({"outline":"1px solid #467bff"});
                                $(this).append('<em class="eDebug-iconsuffix">suffix 아이콘 앞의 띄여쓰기 삭제</em>');
                                figureCount++;
                            }
                        }
                    }
                });
                objDebug.eReport('prefix, suffix 아이콘 띄여쓰기 체크', figureCount);
            }
        },
        eTableAttrCheck : function (){
            if(flagHost){
                var figureCount = 0;
                if(document.doctype.systemId=="" || document.doctype.systemId==null){  // html5
                    $("table").each(function(){
                        if(!$(this).parent().hasClass("grid-thead")&&!$(this).parents().hasClass('grid-fixed-column')){ // wms중 JS로 생성된 테이블 제외
                            if((!$(this).is("[border]")||$(this).attr("border")!=='1')||$(this).is("[summary]")){
                                if($(this).closest('.mGridTable').length>0){
                                    var target = $(this).closest('.mGridTable');
                                }else{
                                    var target = $(this).closest('.mBoard');
                                }
                                target.prepend('<div class="manyAlignMsg">html5중 table은 &lt;table border="1"&gt;로 설정</div>');
                                figureCount++;
                            }
                        }
                    });
                }else{  // html4
                    $("table").each(function(){
                        if(!$(this).parent().hasClass("grid-thead")&&!$(this).parents().hasClass('grid-fixed-column')){ // wms중 JS로 생성된 테이블 제외
                            if((!$(this).is("[border]")||$(this).attr("border")!=='1')||(!$(this).is("[summary]")||$(this).attr("summary").trim()!=='')){
                                if($(this).closest('.mGridTable').length>0){
                                    var target = $(this).closest('.mGridTable');
                                }else{
                                    var target = $(this).closest('.mBoard');
                                }
                                target.prepend('<div class="manyAlignMsg">html4중 table은 &lt;table border="1" summary=""&gt;로 설정</div>');
                                figureCount++;
                            }
                        }
                    });
                }
                objDebug.eReport('table의 border, summary 체크', figureCount);
            }
        },
        eCaption : function (){
            if(flagHost){
                var figureCount = 0;
                $("table").each(function(){
                    if(!$(this).parent().hasClass("grid-thead")){  // grid-thead 제외
                        if(($(this).children("caption").length==0)||($(this).children("caption").index()!==0)||($(this).children("caption").html().trim()=="")){
                            if($(this).closest('.mGridTable').length>0){
                                var target = $(this).closest('.mGridTable');
                            }else{
                                var target = $(this).closest('.mBoard');
                            }
                            target.prepend('<div class="manyAlignMsg">table중 caption 필수</div>');
                            figureCount++;
                        }
                    }
                });
                objDebug.eReport('table중 caption 필수', figureCount);
            }
        },
        eTabletfoot : function (){
            if(flagHost){
                var figureCount = 0;
                if(document.doctype.systemId=="" || document.doctype.systemId==null){  // html5
                    $("tfoot").each(function(){
                        if(!$(this).prev().is("tbody")){
                            if($(this).closest('.mGridTable').length>0){
                                var target = $(this).closest('.mGridTable');
                            }else{
                                var target = $(this).closest('.mBoard');
                            }
                            target.prepend('<div class="manyAlignMsg">html5중 tfoot태그는 thead &gt; tbody &gt; tfoot 순으로 마크업 한다.</div>');
                            figureCount++;
                        }
                    });
                }else{  // html4
                    $("tfoot").each(function(){
                        if(!$(this).prev().is("thead")||!$(this).next().is("tbody")){
                            if($(this).closest('.mGridTable').length>0){
                                var target = $(this).closest('.mGridTable');
                            }else{
                                var target = $(this).closest('.mBoard');
                            }
                            target.prepend('<div class="manyAlignMsg">html4중 tfoot태그는 tfoot &gt; thead &gt; tbody 순으로 마크업 한다.</div>');
                            figureCount++;
                        }
                    });
                }
                objDebug.eReport('tfoot태그 html 순서', figureCount);
            }
        },
        eBoardScroll : function (){
            // /solution/cmc/advanced/ 일때 gScroll 디버깅
            var strDomUrl = document.location.pathname,
                figureCount = 0,
                figureIndex = strDomUrl.indexOf("/solution/cmc/advanced/");
            if(figureIndex<0) {
                // gScroll이 있을 시 auto 와 % 사용 금지
                $(".mBoard.gScroll").each(function(){
                    var flag = false;
                    var target = $(this);
                    target.children("table").children("colgroup").each(function(i){
                        if(($(this)[0].outerHTML.indexOf("auto")>=0)||($(this)[0].outerHTML.indexOf("%")>=0)){
                            figureCount++;
                            flag = true;
                            return false;
                        }
                    });
                    if(flag == true) {
                        target.prepend('<div class="manyAlignMsg">gScroll이 있을 시 auto 와 % 사용 금지</div>');
                    }
                });
                // gScroll이 없을 시 auto OR % 중 최소 하나 존재
                $(".mBoard:not(.gScroll):not('.typeFixed')").each(function(){
                    var flag = false;
                    var target = $(this);
                    if($(this).parents("body").attr("id")!=="popup"){ // 팝업 제외
                        target.children("table").children("colgroup").each(function(i){
                            if(($(this)[0].outerHTML.indexOf("auto")<0)&&($(this)[0].outerHTML.indexOf("%")<0)){
                                figureCount++;
                                flag = true;
                                return false;
                            }
                        });
                        if(flag == true) {
                            target.prepend('<div class="manyAlignMsg">gScroll이 없을 시 auto OR % 중 최소 하나 사용</div>');
                        }
                    }
                });
                objDebug.eReport('gScroll에 의한 col 처리', figureCount);
            }
        },
        _eAttrDebugMessage : function (target, str){
            if(target.get(0).tagName == "INPUT"){
                target.parent().css({"border":"2px solid #467bff"}).append('<div class="attrDebug">input 태그의 '+str+' 속성 빈값 체크</div>');
            }else{
                target.css({"border":"2px solid #467bff"}).append('<div class="attrDebug">'+str+' 속성 빈값 체크</div>');
            }
        }
    }
    objDebug.eInit();
}

;(function (global, $) {
    'use strict';

    var flagMode = false;

    $.fn.eDebugBot = function (opts) {
        flagMode = true;
        return this.each(function(){
            var ext = $.extend({}, $.fn.eDebugBot.arrDefaults, opts || {});
            eDebugBegin(ext);
        });
    };

    function eDebugCall(){
        if(!flagMode){
            $(this).eDebugBot();
        }
    };
    setTimeout(eDebugCall, 500);

    function eDebugBegin(opts){
        $.fn.eDebugBot.arrDefaults.eQaId = opts.eQaId;
        $.getScript("/suio/js/debugbot_ui.js", function() {    //디버깅 ui js
            $.fn.eDebug(opts);
        });
    }

    $.fn.eDebugBot.arrDefaults = {
        eTableAlign : true,   // table, tbody, td 정렬
        eTableCheck : true,   // 테이블 체크리스트
        eQaId : true,         // QA id
        eGLabel : true,       // .mForm > .gLabel
        eText : true,         // .txtEm, .txtWarn, .txtNormal
        eLabel : true,        // label에 2개이상의 폼태그 자식여부
        ePopup : true,        // 새창열림
        ePopupSize : true,    // 팝업 size 영역
        eBtnIcon : true,      // 버튼 > .icoLink
        eBtnLink : true,      // .btnLink > 대괄호([])
        eCtrl : true,         // .mCtrl > .icoPlus(플러스 아이콘 사용불가)
        eEditor : true,       // 에디터 이미지 부모 class
        eReport : true,       // debug 결과
        eFText : true,        // fText 클래스에 style="width" 누락한 경우 배경색 지정
        eTooltip : true,      // mTooltip content 내의 p, ul, ol 태그에 class 가 없는 경우(mList나 그 외) 라인 표시
        eCss : true,          // css check
        eMTip : true,         // mTip 버튼 클릭 후 show디버깅 삭제
        eMSearchEngine : true,// caption 값은 "검색"으로 통일
        eIntroduceArea : true,// 서비스소개 introduceArea class 누락
        eClass : true,        // 첫번째 클래스 m으로 시작 하지 않는 경우
        eImgPath : true,      // 이미지 경로 체크 (로컬 경로일 경우, 경고 메시지 노출)
        eAttribute : true,     // tag 속성 체크.
        eHelpTitle : true,     // mHelp중 h3이 1개일때 h2로 처리
        eIconSpace : true,    // prefix, suffix 아이콘 띄여쓰기 체크
        eTableAttrCheck : true,   // table의 border, summary 체크
        eCaption : true,        // table caption 필수 체크
        eTabletfoot : true,     // tfoot태그 html 순서
        eBoardScroll : true,    // gScroll있는 경우와 없는 경우의 col 값 체크
    };

    /* 참고: 페이지별로 일부 디버깅을 끄고 싶을때 해당 스크립트를 페이지 하단에 추가
    $(document).ready(function() {
        $(this).eDebugBot({
            eQaId:false,
            eCss:false
        });
    });
    */
})(window, window.jQuery);

$(function(){
    var flagWin = true;

    var rv = getInternetExplorerVersion();
    if(rv <= 8 && rv != -1){
        flagWin = false;
    }

    function getInternetExplorerVersion (){
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
            }
        return rv;
    }

    if(flagWin){
        // debug.css import
        $('body').append('<link rel="stylesheet" type="text/css" href="/suio/css/debug.css" media="all" />');
        if($(location).attr('host') == "fe.cafe24test.com") {
            $('body').append('<link rel="stylesheet" type="text/css" href="/suio/css/debug_test.css" media="all" />');
        }
    }
});
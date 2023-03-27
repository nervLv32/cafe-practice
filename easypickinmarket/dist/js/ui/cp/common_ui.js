/** 이미지서버 배포용이 아닌 ui확인용입니다. **/

$(document).ready(function() {
    //globalNav
    $.fn.globalNavFunc = function(option){
        var opt = {
            btn : '.eOpenMenu',
            wrap : '.title',
            txt : '.eOpenMenu'
        };
        opt = $.extend(opt, option);
        $(this).each(function(){
            var $btn = $(this).find(opt.btn);
            $btn.click(function(){
                $(this).parents(opt.wrap).toggleClass('selected');
                $(this).parents('li').siblings().children('.title').removeClass('selected');
                if ($(this).parents(opt.wrap).hasClass('selected')){
                    $(this).text('메뉴 접기');
                } else {
                    $(this).text('메뉴 펼치기');
                }
                /* Scroll Height_start */
                var $scroll = $(this).parents(opt.wrap).siblings('.gScroll');
                var $categoryHeight = $scroll.children('.mNavigation').outerHeight();
                var $windowHeight = $(window).height();
                if ( $categoryHeight > $windowHeight ) {
                    $scroll.css({ 'height': ($windowHeight - 103) + 'px'});
                } else {
                    $scroll.css({ 'height': $categoryHeight + 'px'});
                }
                /* Scroll Height_end */
            });
        });
    };
    $('.globalNav .navigation').globalNavFunc();

    //SubNavi
    $.fn.SnbFunc = function(option){
        var opt = {
            btn : '.link'
        };
        opt = $.extend(opt, option);
        $(this).each(function(){
            var $btn = $(this).find(opt.btn);
            $btn.click(function(){
                $(this).toggleClass('selected');
                    /* sidebar Height */
                    /* var $sidebar = $('#sidebar');
                    var $innerHeight = $('.mNavigation.typeLayer').outerHeight();
                    $sidebar.css({ 'height': ($innerHeight) + 'px'});*/
            });
        });
    };
    $('#sidebar .mNavigation').SnbFunc();

    //OpenSub
    $('.eOpenSub').click(function(){
        $('#wrap').toggleClass('openSnb');
        if ($(this).parents($('#wrap')).hasClass('openSnb')){
            $(this).children().text('메뉴바 영역 닫기');
        } else {
            $(this).children().text('메뉴바 영역 열기');
        }
    });

    //expandList
    $('.eExpandList').click(function(){
        $('#wrap').toggleClass('expandList');
        if ($(this).parents($('#wrap')).hasClass('expandList')){
            $(this).children($('span')).text(' 전체축소').prepend('<em class="icoSetLayout"></em>');
        } else {
            $(this).children($('span')).text(' 전체확장').prepend('<em class="icoSetLayout"></em>');
        }
    });

    //expandList
    $('.btnFavorite').click(function(){
        $(this).toggleClass('selected');
        if ($(this).hasClass('selected')){
            $(this).children().text('메뉴 즐겨찾기 삭제');
        } else {
            $(this).children().text('메뉴 즐겨찾기 추가');
        }
    });

    //mDropLayer
    $('.eDropdown').click(function(){
        $(this).parent().toggleClass('selected');
    });

    //button 영역 높이 계산
    function btnViewEvnet(str){
        console.log("str==="+str);
        var count = 0,
            searchName,
            className,
            searchTarget;

        if(str == "expand"){
            searchName = "expand";
            className = "rowFix"
        }else if(str == "folder"){
            searchName = "folder";
            className = "rowFold"
        }

        var tabContBol = $('.mSearchEngine').parents('.tabCont').length;
        if(tabContBol > 0){
            $('.mSearchEngine').each(function(i){
                var tabBol = $(this).parents('.tabCont').css('display');
                if(tabBol != "none"){
                    searchTarget = $(this);
                }
            });
        }else{
            searchTarget = $('.mSearchEngine');
        }

        if(str != "start"){
            var openChk = searchTarget.hasClass(searchName);
            if(openChk){
                searchTarget.find('table tr').each(function(i){
                    var bol = $(this).hasClass(className);
                    if(bol){
                        count++;
                    }
                });
            }else{
                /* SMARTWMS-18296 */
                /* AS-IS
                count = searchTarget.find('table tr').length; */
                /* TO-BE */
                if(!searchTarget.hasClass('folder')){
                    count = searchTarget.find('table tr').length;
                }else{
                    count = searchTarget.find('table tr.rowFold').length;
                }
                /* //SMARTWMS-18296 */
            }
        }else{
            if(searchTarget){
                count = searchTarget.find('table tr').length;
            }
        }

        if(count <= 3){
            if(count <= 1){
                $('.button').addClass('gSolid');
            }else{
                var hasClass = $('.button').hasClass('gSolid');
                if(hasClass){
                    $('.button').removeClass('gSolid');
                }
            }
            $('.button').addClass('mini');
        }else{
            $('.button').removeClass('mini');
            $('.button').removeClass('gSolid');
        }
        $('.button').css("opacity", "1");
    }
    if($('.mSearchEngine').length >= 1){
        btnViewEvnet("start");
    }

    // mSearchEngine
    function mSearchEngine(){
        //검색 닫기
        $('.mSearchEngine .eExpand').click(function(){
            if($('.mSearchEngine tbody').children().hasClass('rowFix') == true){
                $('.mSearchEngine').toggleClass('expand');
            } else {
                $('.mSearchEngine').toggleClass('expandAll');
            }
            //text 변경
            if ($(this).parents('.mSearchEngine').children('.search').hasClass('expandAll','expand')){
                $(this).text('검색 열기');
            } else {
                $(this).text('검색 닫기');
            }
            btnViewEvnet("expand");
        });
        //상세 검색 닫기
        $('.mSearchEngine .eFold').click(function(){
            $('.mSearchEngine').toggleClass('folder');
            $('.mSearchEngine').removeClass('expand');
            if ($(this).parents('.mSearchEngine').hasClass('folder')){
                $(this).text('상세 검색 열기');
            } else {
                $(this).text('상세 검색 닫기');
            }
            btnViewEvnet("folder");
        });
    }
    mSearchEngine();

    //mGridTable chk
    var mGrids = $('table').parents('div').hasClass('gridTableArea');
    if(mGrids){$('body').addClass('autoHeight');}

    //주문관리 > 공통팝업 > 관리자 메모 등록 - 즐겨찾기 설정
    $('.mMyFavorite .eDropDown').click(function(e){
        if($(this).hasClass('disabled') == false){
            var DropList = $(this).next('.list');
            if(DropList.css('display') == "none"){
                $(this).parent().addClass('show');
            } else {
                $(this).parent().removeClass('show');
            }
        }
    });

    // 정산/통계관리 > 공급사정산 > 거래등록
    $(function(){
        $(".chzn-select").chosen();
        $(".chzn-select-deselect").chosen({allow_single_deselect:true});
    });

    //상품관리 > 상품관리 > 상품목록 - 공급사
    $.ajax({
        url : "/js/scm/dhub/chosen.jquery.js",
        dataType:"script",
        success : function(){
            console.log("success");
            chosenCall();
        },
        error: function(){
            console.log("error");
        }
    });

    function chosenCall(){
        var config = {
          '.chosen-select'           : {width:"80%"},
          '.chosen-select-deselect'  : {allow_single_deselect:true},
          '.chosen-select-no-single' : {disable_search_threshold:10},
          '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
          '.chosen-select-width'     : {width:"95%"}
        }
        for (var selector in config) {
          $(selector).chosen(config[selector]);
        }
    }

    //CS관리 > 공통팝업 > sms바로보내기
    $(function(){
        $('.mMsgSmsArea .button .btnPreview').click(function(e){
            $('#shortPreview').show();
            $('#shortTextarea').hide();
            $(this).hide();
            $('.mMsgSmsArea .button .btnModify').css({'display':'inline-block'});
            e.preventDefault();
        });
        $('.mMsgSmsArea .button .btnModify').click(function(e){
            $('#shortPreview').hide();
            $('#shortTextarea').show();
            $(this).hide();
            $('.mMsgSmsArea .button .btnPreview').css({'display':'inline-block'});
            e.preventDefault();
        });
        $('.mMsgSmsArea .type a').click(function(e){
            $(this).parent().addClass('selected').siblings().removeClass('selected');
            $($(this).attr('href')).show().siblings('.smsBox').hide();
            e.preventDefault();
        });
    });

    //suio.table.fix.resize.js 사용 토글 버튼 클래스 추가
    $('#header .utility .btnFold').addClass('eFoldedSnb');
    $('.mSearchEngine .btnExpand').addClass('eFoldedTop');

    /* 공급사 다중검색 */
    /* 20171129 추가*/
    var flagFocus = true;
    $('.mInputForm.eFormScroll').each(function(i){
        var str = "tableSCrollView_"+i;
        $(this).attr('name', str);
    });
    $(".mInputForm input").focusin(function(e){
        var findThis = $(this),
            findTarget = findThis.parents('.mInputForm'),
            findId = findTarget.attr('name'),
            strId = "#"+findId;
            flag = findTarget.hasClass('eFormScroll');
        if(flag){

            if($(strId).length <= 0){
                findTarget.find('.result').hide();

                var tooltip = findTarget.find('.result').clone();
                $('body').append('<div id="'+findId+'" class="mInputForm eToggle" virtual="true" style="position:static;">');
                $(strId).append(tooltip);

                var findResult = $(strId).find('.result'),
                    propTop = findThis.offset().top+12,
                    propLeft = findThis.offset().left,
                    propWidth = findThis.width()+12;
                findResult.css({'top':propTop, 'left':propLeft, 'width':propWidth}).show();

                findResult.mouseover(function(e){
                    flagFocus = false;
                });

                findResult.mouseout(function(e){
                    flagFocus = true;
                });

                findResult.click(function(e){
                    findThis.focus();
                });

                findResult.find('label').mousedown(function() {
                    var flag = $(this).find('.fChk').is(":checked");
                    if(!flag){
                        $(this).parents('li').addClass('focus');
                    }else{
                        $(this).parents('li').removeClass('focus');
                    }
                });
            }else{
                $(strId).show();
            }
        }
        e.preventDefault();
    });

    $(".mInputForm input").focusout(function(e){
        var findTarget = $(this).parents('.mInputForm'),
        findId = findTarget.attr('name'),
        strId = "#"+findId;

        if($(strId).length > 0 && flagFocus){
            $(strId).hide();
        }
        e.preventDefault();
    });
    /* 20171129 추가*/

    $(".mInputForm .list").click(function(e){
        $(this).parents(".mInputForm").removeClass("selected");
    });

    $(".mInputForm input").keypress(function(e){
        if($(this).attr("checked") == true){
            $(this).parents("li").removeClass("focus");
        } else {
            $(this).parents("li").addClass("focus");
        }
    });

    //eTab gridTableArea
    $('.eTab a').click(function(e){
        var _target = $(this).attr('href'),
            _len = $(_target).find('.gridTableArea').length;
        if(_len >= 1){
            var _siblings = $(_target).attr('class'),
                _arr = _siblings.split(" "),
                _classSiblings = '.'+_arr[0];
            $(_target).css({
                "display":"flex",
                "flex-direction":"column",
                "flex":"1 1 0%"
            }).siblings(_classSiblings).css({
                "display":"none",
                "flex-direction":"",
                "flex":""
            })
        }
        setTimeout(btnViewEvnet, 100, 'start');

        e.preventDefault();
    });

    //mTooltip 이벤트 재선언
    addSuioLoadEvent(function() {
        $('body').undelegate('.mTooltip .eTip', 'click');
        $('body').delegate('.mTooltip .eTip', 'click', function(e){
            mTooltipMouseEvent(this, e);
        });

        function mTooltipMouseEvent(_this, e){
            var findSection = $(_this).parents('.section:first'),
                findTarget = $($(_this).siblings('.tooltip')),
                findTooltip = $('.tooltip'),
                findHover = $(_this).hasClass('eTipHover'),
                findShow = $(_this).parents('.mTooltip:first').hasClass('show');

            if(findShow && !findHover){
                $('.mTooltip').removeClass('show');
                findTarget.hide();
                findSection.css({'zIndex':'', 'position':''});
            }else{
                $('.mTooltip').removeClass('show');
                $(_this).parents('.mTooltip:first').addClass('show');

                $('.section').css({'zIndex':'', 'position':''});
                findSection.css({'zIndex':100, 'position':'relative'});//.siblings().css({'zIndex':'', 'position':''});

                // 툴팁의 넓이 + offset좌표 의 값이 body태그의 width보다 클때 좌표값 왼쪽으로 이동
                var bodyWidth = $('body').width(),
                    targetWidth = findTarget.outerWidth(),
                    offsetLeft = $(_this).offset().left,
                    posWidth = targetWidth + offsetLeft;

                if(bodyWidth < posWidth){
                    var propMarginLeft = (targetWidth+$(_this).width()+10);
                    var propWidth = offsetLeft - targetWidth;
                    if(propWidth > 0){
                        findTarget.addClass('posRight').css({'marginLeft': '-'+ targetWidth +'px' });
                    }else{
                        findTarget.removeClass('posRight').css({'marginLeft': 0 });
                    }
                } else {
                    findTarget.removeClass('posRight').css({'marginLeft': 0 });
                }
                // 툴팁의 top 값이 window height값보다 클때 좌표값 상단으로 이동
                var findFooter = $('#footer');
                var propFooterHeight = 0;
                if(findFooter.length >= 1){
                    var propMinHeight = parseInt($('#content').css('min-height'));
                    if(propMinHeight){
                        var figureMinHeight = $('#content').offset().top+$('#content').outerHeight(true),
                            figureBotton = $(window).height()-figureMinHeight,
                            figureBottonHeight = 0;
                        if(figureBotton > 0){
                            figureBottonHeight = figureBotton;
                        }
                    }
                    console.log("figureBottonHeight=="+figureBottonHeight);
                    propFooterHeight = (findFooter.outerHeight()+figureBottonHeight);
                }
                var propwindowHeight = $(window).height()-propFooterHeight,
                    targetHeight = findTarget.outerHeight(),
                    propscrollTop = $(window).scrollTop(),
                    offsetTop = $(_this).offset().top,
                    posHeight = (offsetTop-propscrollTop)+targetHeight+$(_this).height();

                if(propwindowHeight < posHeight){
                    var propMarginTop = (targetHeight+$(_this).height()+10);
                    var propHeight = (offsetTop-propscrollTop) - targetHeight;
                    var propHeadHeight = 0;
                    if($('#header').length >= 1){
                        propHeadHeight = $('#header').height();
                    }
                    if(propHeight > propHeadHeight){
                        findTarget.addClass('posTop').css({'marginTop': '-'+ propMarginTop +'px' });
                    }else{
                        findTarget.removeClass('posTop').css({'marginTop': 0 });
                    }
                }else{
                    findTarget.removeClass('posTop').css({'marginTop': 0 });
                }

                findTooltip.hide();
                findTarget.show();

                if($('#tooltipSCrollView').length > 0){
                    $('#tooltipSCrollView').remove();
                }
            }
            e.preventDefault();
        }
    });
});
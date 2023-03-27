//2022-10-05 서버에서 오류가 생겨 잠시 주석처리 해두겠습니다.
//const { active } = require("browser-sync");

window.addEventListener('DOMContentLoaded', function () {

    /*  ***********
        sidebar start
        이부분은 개발하실때 빼셔도 되는 부분입니다
        좌측부분 사이드바 영역입니다.
    *********** */
    const menuAllBtn = document.querySelector('[data-link="ALL"]');
    const menuBtn = document.getElementsByClassName('mkbtn-snbclose')[0];

    menuBtn.addEventListener('click', toggleLnb);
    menuAllBtn.addEventListener('click', toggleAnb);

    // 왼쪽 메뉴
    function toggleLnb() {
        document.getElementsByClassName('mk-wrap')[0].classList.toggle('mk-snb-hide');
    }

    // 전체 메뉴
    function toggleAnb() {
        document.getElementById('mk-header').classList.toggle('sitemap-open');
    }
    /*  ***********
    sidebar end
    *********** */



    // top search input alert
    function submitHandler() {
        alert('submit');

        return false;
    }


    // 쇼핑몰 상품 하트버튼 toggle
    const likeBtns = document.querySelectorAll('.like-btn');
    if (likeBtns.length == 0) {

    } else {
        for (i = 0; i < likeBtns.length; i++) {
            likeBtns[i].addEventListener('click', function () {
                this.classList.toggle('active');
            })
        }
    }

    // 쇼핑몰 필터 초기화 버튼 
    const filterElems = document.querySelectorAll('.filter-tag-ul li');
    const initBtn = document.querySelector('.init-btn');

    if (filterElems.length == 0) {

    } else {
        initBtn.addEventListener('click', function () {
            for (i = 0; i < filterElems.length; i++) {
                if (filterElems[i].classList.contains('init-btn') == false) {
                    filterElems[i].remove();
                }
            }
        })
    }


});

$(document).ready(function () {

    /* 
    2022-09-06 EZP-6949 기존 스크립트 새로운 스크립트 적용으로 삭제
    // 쇼핑몰 높은 가격순 등 정렬 버튼
    $(".sort-box").click(function () {
        $(this).toggleClass("on");
    })
    //2022 08 31 select박스 외 영역 클릭할시 class 삭제 EZP-6922
    $(document).mouseup(function (e) {
        const opctionArea = $('.top-ctrl-wrap .goods-sort-wrap>div.sort-box.on ul');
        const selectBox = $('.sort-box');
        if (opctionArea.has(e.target).length === 0) {
            selectBox.removeClass('on');
        }
    })
    */

    // 2022-09-06 EZP-6949 시작
    // 쇼핑몰 높은 가격순 등 정렬 버튼
    $('body').on('click', '.sort-box > p', function(){
        $('.sort-depth').toggle();
        $('.sort-box').toggleClass('on');
    })

    $("body").on("click", ".sort-depth li", function () {
        $(".sort-depth").toggle();
    })

    // option 이외 영역 클릭시 removeClass('on')
    $('body').on('click', function(e){
        if($('.sort-depth').css('display') == 'block'){
            if($('.sort-box').has(e.target).length == 0){
                $('.sort-depth').parents('.sort-box').removeClass('on');      
                $('.sort-depth').hide();
            }
        }
    })
    // 2022-09-06 EZP-6949 끝

    

    // 쇼핑몰 상단 카테고리
    $('.cate-con-wrap .depth1-wrap > li').click(function () {
        $('.cate-con-wrap .depth1-wrap > li').removeClass('active');
        $(this).addClass('active');
    });


    // 쇼핑몰 검색결과 필터 버튼들 x 버튼 클릭시 삭제
    $(".filter-tag-ul > li .close-btn").click(function (e) {
        $(this).parents("li").remove();
    })

    // mypick index 픽샵 버튼
    $(".info-btn-wrap .toggle-btn").click(function () {
        $(this).toggleClass("active");
    })

    // 왼쪽 메뉴 닫히거나 열릴시 슬라이드 너비값 재설정
    $(".mkbtn-snbclose").click(function (e) {
        $('.slick-slider').slick('refresh');
    })

    // easypickinfo-case2.html 1차분류명 > 2차분류명 x 버튼 클릭시 삭제
    $(".cate-name-wrap > ul li .close-btn").click(function () {
        $(this).parents("li")[0].remove();
    })

    // easypickinfo-case2.html 주력카테고리 클릭시 색 변화
    $('.add-cate-wrap .elem-list li').on('click', function () {
        if ($(this).hasClass('li-disabled') != true) {
            $(this).parent().find('li').removeClass('active');
            $(this).addClass('active');
        }
    });

    // mypick/index.html 픽템 범위선택 , 직접인력 탭 버튼
    $(".table-tab-area button").click(function (e) {
        $('.table-tab-area button').removeClass('active');
        $(this).addClass("active");
        const tabCon = $(this).attr('data-tab');
        $('.table-tab-con > div').removeClass('active');
        $('#' + tabCon).addClass('active');
    })

    // goods-detail.html 색상 및 사이즈 클릭 이벤트
    // 색상
    $('.option-check.option-color dd ul li').click(function () {
        if ($(this).hasClass('sold-out') == true) {

        } else {
            $('.option-check.option-color dd ul li').removeClass('on');
            $(this).addClass('on');
        }
    })
    // 사이즈
    $('.option-check.option-size dd ul li').click(function () {
        if ($(this).hasClass('sold-out') == true) {

        } else {
            $('.option-check.option-size dd ul li').removeClass('on');
            $(this).addClass('on');
        }
    })


    // 픽업정보 - 수령방식 체크박스 여부에 따라 나오는 결과물이 달라짐
    $('.direct-pickup-elem').hide();
    // 2022 08 16 디폴트 수정
    $('.del-pickup-elem.form-control').hide();
    $('.del-pickup-elem.info-find-wrap').hide();
    $('input[name="del-pickup"]').click(function () {
        $('input[name="direct-pickup"]').prop('checked', false);
        $('.del-pickup-elem').show();
        $('.direct-pickup-elem').hide();
        $('.border-none').removeClass('on');
        $('.direct-info').show()
    })
    $('input[name="direct-pickup"]').click(function () {
        $('input[name="del-pickup"]').prop('checked', false);
        $('.direct-pickup-elem').show();
        $('.del-pickup-elem').hide();
        $('.border-none').addClass('on');
        $('.direct-info').hide()
    })
});

// 가게별 금액확인 팝업창 안에 가게명 input 클릭시 노출되는 창.
$(document).ready(function () {
    $('.result1').focus(function () {
        $(this).addClass('on');
        $(this).parents('dd').find('.result-case1').show();
    })
    $('.result1').blur(function () {
        $(this).removeClass('on');
        $(this).parents('dd').find('.result-case1').hide();
    })



    // 바로주문 테이블 table 좌우측 이동
    $('.direct-order-table .arrow-next').click(function () {
        var item = $('.mGridTable table');
        var width = item.outerWidth();
        $('.mGridTable .grid-tbody').scrollLeft(width);
    })
    $('.direct-order-table .arrow-prev').click(function () {
        var item = $('.mGridTable table');
        var width = item.outerWidth();
        $('.mGridTable .grid-tbody').scrollLeft(-width);
    })


    // 2022-08-04 hover 시 박스 노출 위치 수정
    $('.hover-box .hover-btn').hover(function () {
        const target = $(this);
        const targetTop = target.offsetParent()[0].offsetTop;
        const tr1 = target.parents('tr').height();
        const tr2 = target.parents('tr').next('tr').height();
        const boxHeight = target.next('.info-box').innerHeight();
        const tbl = target.parents('.grid-tbody');
        console.log(boxHeight, tbl.scrollTop() + tbl.height(), tbl.scrollTop(), tr1, targetTop)
        if (targetTop + tr1 + boxHeight + 13 > tbl.scrollTop() + tbl.height() && boxHeight + 13 < targetTop || target.offset().top + boxHeight + tr1 > $(window).scrollTop() + $(window).height() && boxHeight + 13 < targetTop) {
            target.parent('.hover-box').addClass('bt100')
        } else {
            target.parent('.hover-box').removeClass('bt100')
        }
        $('.tbl-type07 .grid-tbody tr:first-child .hover-box').removeClass('bt100');
    })



    // 2022-08-04 click 시 박스 노출 위치 수정
    $('.tool-tip-wrap button').click(function () {
        const target = $(this);
        const targetTop = target.offsetParent()[0].offsetTop;
        const tr1 = target.parents('tr').height();
        const tr2 = target.parents('tr').next('tr').height();
        const boxHeight = target.next('.tool-tip-area').height();
        const tbl = target.parents('.grid-tbody');
        console.log(tbl.scrollTop(), tbl.height(), tr1, tr2);
        console.log(targetTop)
        if (targetTop + tr1 + boxHeight + 13 > tbl.scrollTop() + tbl.height()) {
            console.log(2)
            target.parent('.tool-tip-wrap').addClass('bt100')
        } else {
            target.parent('.tool-tip-wrap').removeClass('bt100')
        }
    })

    // 바로주문 테이블 input 창 focus 시 select 노출
    $('.result1').focus(function () {
        $(this).addClass('on');
        $(this).parents('tr').find('.result-case1').show();
    })
    $('.result1').blur(function () {
        $(this).removeClass('on');
        $(this).parents('tr').find('.result-case1').hide();
    })
    $('.result2').focus(function () {
        $(this).addClass('on');
        $(this).parents('tr').find('.result-case2').show();
    })
    $('.result2').blur(function () {
        $(this).removeClass('on');
        $(this).parents('tr').find('.result-case2').hide();
    })

    // 미송수량확인 on / off 
    $('.hidden-count').hide();
    $('.misong-switch-btn .slider').click(function () {
        if ($('.misong-switch-btn input').is(':checked')) {
            $('.hidden-count').hide();
            $('.misong-btn').hide();
            $('.quantity-on').removeClass('active');
        } else {
            $('.hidden-count').show();
            $('.misong-btn').show();
            $('.quantity-on').addClass('active');
        }
    })

    //2022-12-15 EZP-6415 쇼핑몰 상품등록 토글버튼
    $('.re-shopping-goods .btn-switch').click(function () {
        if ($(this).children().find('input').is(':checked')) {
            $(this).parents('.toggle-area1').children('td').removeClass('off');
            $(this).parents('.toggle-area2').children().find('.product-detail').removeClass('off');
        } else {
            $(this).parents('.toggle-area1').children('td').addClass('off');
            $(this).parents('.toggle-area2').children().find('.product-detail').addClass('off');
        }
    })


    //캘린더
    // 10-07 calendar.js 에서 구현, 20191007, GTPARK
    //datepicker
    $('.cal-input').datepicker({
        showMonthAfterYear: true,
        changeYear: true,
        changeMonth: true,
        buttonText: "Select date",
        nextText: '다음 달',
        prevText: '이전 달',
        monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        dayNamesMin: [('일'), ('월'), ('화'), ('수'), ('목'), ('금'), ('토'),],
        dateFormat: "yy-mm-dd",
    });

    $('.cal-input').datepicker('option', 'onSelect', function () {
        var $me = $(this),
            range = $me.data('range');

        if (!range) return;

        var $input = $('.cal-input[data-range=' + range + ']'),
            idx = $input.index($me),
            value = $input.get().map(function (el) {
                return el.value
            });

        if (value[0] > value[1] && idx == 0) {
            $input.eq(1).datepicker('setDate', value[0]);
        }
        if (value[0] > value[1] && idx == 1) {
            $input.eq(0).datepicker('setDate', value[1]);
        }
    });

    //timepicker
    var $timeInput = $('.time-input');
    $timeInput.val('00:00');

    for (var i = 0; i < $timeInput.length; i++) {
        var $el = $timeInput.eq(i),
            $prtForm = $el.closest('.form-inline'),
            $rangeTime = $prtForm.find('.time-input');

        if ($rangeTime.length == 2) {
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

    // 2022-08-03 file 첨부 기능 수정
    $('.input-file-box').on('change', function () {
        const fileValue = $(this).val();
        const fileValueStr = fileValue.split(/[\\]/);
        console.log(fileValueStr[2])
        $('#input-file-text').val(fileValueStr[2]);
    })


})

// resize시 슬라이드 너비 초기화
$(window).resize(function () {
    $('.slick-slider').slick('refresh');
});


//2022-08-04 바로주문 엑셀 아이콘 중앙정렬
$(window).on('resize load', function () {
    const tb1 = $('.direct-order-table .grid-tbody').width();
    const tb2 = $('.direct-order-table .grid-tbody tbody').width();
    const tb3 = $('.direct-order-table .grid-tbody').height();
    const tb4 = $('.direct-order-table .grid-tbody tbody').height();
    $('.direct-order-table .empty dl').css('margin-left', -(tb2 - tb1) / 2 - 80);
    $('.direct-order-table .empty dl').css('margin-top', -(tb4 - tb3) / 2 - 93);
})


// 2022-08-19 바로주문 데이터 없을 시 수정
window.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('.table-no-data .grid-tbody');
    if (table) {
        const empty = document.querySelector('.empty-guide-txt');
        table.addEventListener("scroll", (event) => {
            let x = table.scrollLeft;
            let y = table.scrollTop;
            empty.style.left = `calc(50% + ${x}px)`;
            empty.style.top = `calc(50% + ${y}px)`
        });
    }
})




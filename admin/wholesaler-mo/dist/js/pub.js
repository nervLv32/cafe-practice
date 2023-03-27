$(function(){
	$(document).ready(function(){
        //main gnb
        $("#gnb .category button").click(function () {
            $(this).toggleClass("active");
            $(".sub-gnb").stop().slideToggle();
        });

        //주문관리
        //주문관리 좌측 메뉴
        $(".enter-menu dd").click(function () {
            $(".enter-menu dd").removeClass("active");
            $(this).addClass("active");
        });
        //주문관리 기간조회
        $(".period-filter li").click(function () {
            $(".period-filter li").removeClass("on");
            $(this).addClass("on");
        });

        // 검색창 콘트롤
        $(".header-search-opener").on("click", function () {
            $(".header-search").addClass("active");
        });
        $(document).on("click", function (e) {
            var $target = $(e.target);
            var hasParent = $target.closest(".header-search").length;
            if (hasParent < 1) {
                $(".header-search").removeClass("active");
            }
        });

        // 마이페이지 콘트롤
        // $('#gnb .mypage').on('mouseenter', function(){
        // 	$('#gnb .mypage').toggleClass('active');
        // });

        /*090521 수정
		// input
		$('input').on('keyup', function(e){
	        var value = this.value.split(""),
				length = value.length;
	        if (length > 0) {
	            $(this).parent().addClass('active');
	        } else {
	            $(this).parent().removeClass('active');
	        }
	    });
		*/
        var $inputs = $("input[type=text], input[type=number], input[type=password]").not(".not-addclear, [readonly]");

        //console.dir($inputs)
        //var $inputs = $('input[type=text], input[type=number], input[type=password]').not($(this).attr('readonly'));
        $inputs.addClear({
            right: 12,
            onClear: function () {
                var $prt = $(arguments[0]).closest(".add-clear-span");
                $prt.removeClass("active");
                console.dir(1);
            },
        });

        // 카테고리 토글 버튼
        $(".select-group .select > button").on("click", function () {
            if ($(this).parent().hasClass("active")) {
                $(this).parent().removeClass("active");
            } else {
                $(".select-group .select").removeClass("active");
                $(this).parent().toggleClass("active");
            }
            $(document).on("click", function (e) {
                var $target = $(e.target);
                var hasParent = $target.closest(".select-group .select").length;
                if (hasParent < 1) {
                    $(".select-group .select").removeClass("active");
                }
            });
        });

        // 상품 리스트 장바구니 버튼
        $(".product-btn-group .btn-cart").on("click", function () {
            var $me = $(this);
            var has = $me.hasClass("active");

            /*if(has){
				$me.text('장바구니');
			}else{
				$me.text('담기성공');
			}090522 삭제*/
            $me.toggleClass("active");
        });
        // 상품 리스트 픽템 버튼
        $(".btn-like").on("click", function () {
            var $me = $(this);
            var $pick = $me.closest(".product-item").find(".btn-picktem");

            $pick.toggleClass("active");
            $me.toggleClass("active");
        });
        $(".product-btn-group .btn-picktem").on("click", function () {
            var $me = $(this);
            var $like = $me.closest(".product-item").find(".btn-like");
            var has = $me.hasClass("active");

            /*if(has){
				$me.text('픽템추가');
			}else{
				$me.text('픽템해제');
			} 090522 삭제*/
            $like.toggleClass("active");
            $me.toggleClass("active");
        });

        $(".btn-pickshop").on("click", function () {
            var $me = $(this);
            var has = $me.hasClass("active");

            /*if(has){
				$me.text('픽샵추가');
			}else{
				$me.text('픽샵해제');
			} 190522 삭제*/
            $me.toggleClass("active");
        });

        // 정렬 버튼
        $(".btn-group-sort button").on("click", function () {
            $(".btn-group-sort button").removeClass("active");
            $(this).addClass("active");
        });

        // 리스트 보기 변경 버튼
        $(".btn-group-view button").on("click", function () {
            var $me = $(this);
            var type = $me.data("type");
            $me.addClass("active").siblings().removeClass("active");

            $(".product-item-wrap").attr("data-type", type);
        });

        //amount
        //+버튼 선택시
        $(".amount .plus").on("click", function (e) {
            e.preventDefault();
            var stat = $(this).parent().find("input").val();
            var num = stat;
            num++;
            /*if(num>10){
				alert('더이상 추가할수 없습니다.');
				num =1;
			}*/
            $(".amount button").attr("disabled", false);
            $(this).parent().find("input").val(num);
        });

        //-버튼 선택시
        $(".amount .minus").on("click", function (e) {
            e.preventDefault();
            var stat = $(this).parent().find("input").val();
            var num = stat;
            num--;
            if (num <= 0) {
                $(this).attr("disabled", true);
                num = 1;
            } else {
                $(".amount button").attr("disabled", false);
            }
            $(this).parent().find("input").val(num);
        });
        //퀵메뉴
        if (document.getElementById("quick") === null) {
        } else {
            $("#quick .scrollbar-inner").scrollbar();
            var footerTop = $("footer").offset().top - 100;
            var quickY = footerTop - $("#quick").outerHeight();
            $(window).on("scroll", function () {
                var top = $(window).scrollTop();
                if (top > quickY - 150) {
                    $("#quick")
                        .removeClass("fixed")
                        .css({
                            position: "absolute",
                            top: quickY + "px",
                        });
                } else {
                    $("#quick").addClass("fixed").removeAttr("style");
                }
            });
        }
        /**/
        // 2019-06-04 수정//
        // 미송 환불 버튼 토글
        $(".btn-noshipping, .btn-refund").on("click", function () {
            $(this).toggleClass("active");
        });
        // //2019-06-04 수정

        // 2020-05-04
        $(".toggle_event label").click(function (e) {
            var $this = e.target;
            setTimeout(function () {
                if ($(e.target).parent().find("input").is(":checked")) {
                    $(".sec3.type-chk.state").show();
                } else {
                    $(".sec3.type-chk.state").hide();
                }
            }, 1);
        });

        $(".sec3.type-chk .modal-box button").click(function (e) {
            var idx = $(this).parent().index();
            switch (idx) {
                case 1:
                    $(this).parents(".modal-box").find("input").val("10");
                    break;
                case 2:
                    $(this).parents(".modal-box").find("input").val("20");
                    break;
                case 3:
                    $(this).parents(".modal-box").find("input").val("30");
                    break;
            }
        });
    });

	// 2021-06-04 EZP-2903
	$('.apply-all-btn').click(function() {
		$(this).hide();
		$('.floating-menu').addClass('active');
		$('.floating-btn-wrap').addClass('active');
		$('.nav').addClass('disabled');
		$('.pickup-detail').addClass('apply-active');

		// 2021-07-21 EZP-3515
		$('.order-list').find('.list-item').find('.count').addClass('disabled');
		// 목록 선택
		$('.order-list').on('click.listSelect', '.list-item>li:not(.list-item-tit)', function () {
			var $this = $(this);
			var $item = $this.closest('.list-item');
			if ($this.hasClass('on')) {
				$this.removeClass('on');

				// 해당 영역 선택된 item 개수가 하나도 없을 때에만 타이틀 비활성화
				if (!$this.siblings('li').hasClass('on')) {
					$item.removeClass('on');
				}
			} else {
				$this.addClass('on');
				$item.addClass('on');
			}
			return false;
		});

		return false;
	});

	$('.floating-btn-wrap a').click(function(){
		if($(this).hasClass('btn-close')){
			$('.floating-menu').removeClass('active');
			$('.floating-btn-wrap').removeClass('active');
			$('.apply-all-btn').show();

			// 2021-07-21 EZP-3515
			$('.order-list').off('click.listSelect').find('.list-item, .list-item>li').removeClass('on').find('.count').removeClass('disabled'); // 목록 선택 이벤트 제거
		}
		return false;
	});

	$('.select-item.single button').click(function(){
		$(this).parent().find('button').removeClass('selected');
		$(this).addClass('selected')
	});
	$(".select-item.status button").click(function(e){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
			if ($(this).index() == 3){
				$('.select-item.min').hide();
				if(!$(this).parents().hasClass('prd-status-pop')){
					$('.select-item.min').prev().hide();
				}
			}
		}else{
			$(this).addClass('selected');
			if ($(this).index() == 3){
				$('.select-item.min').show();
				if(!$(this).parents().hasClass('prd-status-pop')){
					$('.select-item.min').prev().show();
				}
			}
		}
	});

	$(".select-item.min button").click(function(e){
		var idx = $(this).index();
		switch(idx) {
			case 1:
				$(this).parent().find('input').val('10');
			break;
			case 2:
				$(this).parent().find('input').val('20');
			break;
			case 3:
				$(this).parent().find('input').val('30');
			break;
		}
	});

});

// datepicker
$(function () {
    $(".datepicker").datepicker({
        // Fix by Dev : 이미지 경로 방식 변경
        buttonImage       : "/img/common/calendar.png",
        buttonImageOnly   : true,
        buttonText        : "Select date",
        showMonthAfterYear: true,
        dayNamesMin       : ['SUN', 'MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT'],
        dayNames          : ['일', '월', '화', '수', '목', '금', '토'],
        // Fix by Dev : 월 타이틀 변경 (두자리)
        monthNamesShort   : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        monthNames        : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        showOn            : "both",
        showOtherMonths   : true,
        selectOtherMonths : true,
        // Fix by Dev : 날짜형식 변경
        dateFormat        : 'yy-mm-dd',
        closeText         : "선택",
		isRTL: true
	});
});
$(document).ready(function(){
	// 검색 삭제
	$('input[type=search] + button').on('click', function(){
		$(this).prev('input[type=search]').val('');
	});
	// 인풋 삭제 21-02-08 추가
	// $('.search input + button').on('click', function(){
	// 	$(this).prev('input').val('');
	// });
	// vlaue 체크
	$('.post-code .delete').on('click', function(){
		$(this).parents('.post-code').find('input').val('');
		// 2021-03-24
		$(this).parents('.post-code').next('.input').find('input').val('').trigger('change');
	});

	// 선택버튼
	$('.btn-wrap.select button').on('click', function(){
		$(this).siblings('button').removeClass('active');
		$(this).addClass('active');
	});

	// pick
	//21-03-09 삭제
	$('.btn-pick').on('click', function(){
		$(this).toggleClass('active');
    console.log($(this))
	});
  console.log(111)

	// 이미지 개수
	$('.img-list .sort .util .thumb').on('click', function(){
		$(this).closest('.img-list').toggleClass('item3');

	});

	// 이미지 개수
	$('.img-list-wrap .sort .util .thumb').on('click', function(){
		$(this).closest('.img-list').removeClass('item3');
		$(this).closest('.img-list-wrap').toggleClass('item3');
	});

	// 21-03-02 수정//
	// fnb 숨김
	// $(window).scroll(function() {
	// 	// $('nav').addClass('scroll');
	// 	// clearTimeout($.data(this, 'scrollTimer'));
	// 	// $.data(this, 'scrollTimer', setTimeout(function() {
	// 	// 	$('nav').removeClass('scroll');
	// 	// }, 250));
	// 	if($(this).scrollTop() <= 10){
	// 		if($('.sub-content').hasClass('order')){
	// 			$('.sub-content.order .order-info .btn.total').removeClass('scroll');
	// 		}
	// 		// else if($('.sub-content').hasClass('deal-wrap')){
	// 		// 	$('.sub-content.deal-wrap').find('.ui-tab').removeClass('fixed');
	// 		// } 21-02-08 삭제
	// 		$('.sub-content').find('.sub-nav').removeClass('fixed'); // nav 상단 sub-nav 있을경우
	// 		$('nav').removeClass('scroll');
	// 		$('.btn-top').hide();
	// 	}else{
	// 		if($('.sub-content').hasClass('order')){
	// 			$('.sub-content.order .order-info .btn.total').addClass('scroll');
	// 		}
	// 		// else if($('.sub-content').hasClass('deal-wrap')){
	// 		// 	$('.sub-content.deal-wrap').find('.ui-tab').addClass('fixed');
	// 		// } 21-02-08 삭제
	// 		$('nav').addClass('scroll');
	// 		$('.sub-content').find('.sub-nav').addClass('fixed'); // nav 상단 sub-nav 있을경우
	// 		$('.btn-top').show();
	// 	}
	//
	//
	// });
	// //21-03-02 수정

	$('.btn-top').on('click', function(){
		$('html, body').animate({scrollTop: '0'}, 300);
	});

	// 필터 선택 공통
	// $(document).on('click', '.select-list li.all', function() {
	// 	var $this = $(this).siblings('li').find('input');

	// 	if($(this).find('input').is(':checked')){
	// 		$this.attr("disabled", true).prop("checked", false);
	// 	}else{
	// 		$this.attr("disabled", false)
	// 	}
	// })

	// 필터 선택 공통
	$(document).on('click', '.select-list li', function(){
		var $this = $(this).siblings('li').find('input');
		var $notall = $(this).parent().find('li').not('.all').find('input');
		var $all = $(this).parent().find('li.all').find('input');

		// 21-02-03 수정 / type1 추가
		// 21-02-09 수정
		if($(this).parent().hasClass('select-list-type1')){

			if($(this).hasClass('all')){
				if($(this).find('input').is(':checked')){
					$this.prop("checked", true);
				}else{
					$this.prop("checked", false);
				}
			}else{
				if($notall.filter(':checked').length == $notall.length){
					$this.prop("checked", true);
				}else{
					$all.prop("checked", false);
				}
			}
		}else{
			if($(this).hasClass('all')){
				$this.prop("checked", false);
			}else{
				$all.prop("checked", false);
			}
		}

		if($(this).parent().hasClass('select-only')){
			$this.prop("checked", false);
		}
	});

	// 2021-03-08 추가//
	$(document).on('click', '.breadcrumb .sub-list li', function(){
		var $this = $(this).siblings('li').find('input');
		var $notall = $(this).parent().find('li').not('.all').find('input');
		var $all = $(this).parent().find('li.all').find('input');

		if($(this).hasClass('all')){
			if($(this).find('input').is(':checked')){
				$this.prop("checked", true);
			}else{
				$this.prop("checked", false);
			}
		}else{
			if($notall.filter(':checked').length == $notall.length){
				$this.prop("checked", true);
			}else{
				$all.prop("checked", false);
			}
		}
	});


	$(document).on('click','.filter .tab-nav li', function(){
		$('.filter .tab-content').scrollTop(0);
	})

	// footer 공통
	$(document).on('click','footer .opener',function(){
		$(this).parent().toggleClass('on');
	})
	// 가게-pickshop
	// 21-03-09 삭제
	$('.btn-pickshop').on('click', function () {
		$(this).toggleClass('active');
	})
	//21-01-27 필터 가격 직접입력 체크 해제
	$('.filter-price .with-text input').on("change keyup paste", function(){
		var cnt = [];
		$(this).parents('.divide').find('.with-text input').each(function(i){
			if( $(this).val() == '' ){
				cnt[i] = true;
			}else{
				cnt[i] = false;
			}
		});
		if( !(cnt[0] && cnt[1]) ){
			$('.filter-price .select-list .checkbox input').prop("checked", false);
		}
	})

	// input 입력 삭제 2021-02-24
	/*
	$('.input input').each(function() {
		// 21-03-05 수정
		// if(this.value.length > 0) {$(this).next().show();}
		// else {$(this).next().hide();}
		// if(this.value.length > 0) {$(this).siblings('button').show();}
		// else {$(this).siblings('button').hide();}
	});
	*/
	$('.input input').bind('keyup change',function() {
		// 21-03-04 수정
		// if(this.value.length > 0) {$(this).next().show();}
		// else {$(this).next().hide();}
		if(this.value.length > 0) {$(this).siblings('button').show();}
		else {$(this).siblings('button').hide();}
	});
	$('.input input + button').on('click', function() {
		$(this).prev('input').val('');
		$(this).hide();
	});

	// popup 링크 막기
	$('a.ui-popup-call').on('click', function (e) {
		e.preventDefault();
	})

	// 21-02-04 주문관리 상단고정
	// var lastScroll = 0;
	// if($('.top-fix-wrap').length != 0){
	// 	var fix_height = $('.top-fix-wrap').height();
	// 	$(window).on('scroll', function() {
	// 		var scrtop = $(window).scrollTop();
	// 		if (scrtop > lastScroll){
	// 			 $('.top-fix-wrap').addClass('fixed');
	// 			 $('.top-fix-wrap').parent().css('paddingTop',fix_height);
	// 		}
	// 		else {
	// 			 $('.top-fix-wrap').removeClass('fixed');
	// 			 $('.top-fix-wrap').parent().css('paddingTop',0);
	// 		}
	// 		lastScroll = scrtop;
	// 		if (scrtop >= 1) {
	// 		} else {
	// 			$('.top-fix-wrap').removeClass('fixed');
	// 			$('.top-fix-wrap').parent().css('paddingTop',0);
	// 		}
	// 	});
	// }

	// 21-03-03 top 버튼 노출 관련 수정
	$(window).scroll(function() {
		if($(this).scrollTop() <= 10){
			$('.btn-top').hide();
		}else{
			$('.btn-top').show();
		}
	});
	
	// 2021-04-09 EZP-1902
	$('.last .btn-more').on('click', function (e) {
		$(this).parent().toggleClass('active');
		return false;
	});

	// 2022-09-16 EZP-6991 주석처리했다가 다시 풀어놨습니다
	// 2021-10-12 EZP-4321
	// 화면 높이 변수 설정
	function setAppHeight() {
		let vh = window.innerHeight * 1;
		document.documentElement.style.setProperty('--app-height', vh + 'px');
	}
	setAppHeight();
	function debounce(func) {
		let timer;
		return function (event) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(func, 100, event);
		};
	}
	window.addEventListener('resize', debounce(function () {
		setAppHeight();
	}));



	// 2022-09-15 EZP-5547
	// safafri에서 자동 scroll여백 생기는 현상 때문에 추가
	const isSafari = /Apple/.test(navigator.userAgent) && /Apple Computer/ .test(navigator.vendor);

	/* 2022-09-16 EZP-5547 */
    $(function(){
	  // 검색창 활성화시 body scroll 막기
	  $('.open-search').click(function(){
		if($('.dim-search-box').hasClass('on')){
		  $('body').addClass('none-scroll');
		} else {
		  $('body').removeClass('none-scroll');
		}
	  });

	});
	

	/* if(isSafari){
		alert('사파리입니다!!!!!');

	} */

	/* 2022-09-23 EZP-5397 tooltip */
	$(function(){
		$('.label-tooltip').click(function(e){
			$(this).next().toggleClass('active');
			if($('.tip').hasClass('active') === true){
				$(this).addClass('active');
			}
		  });

		$('html').click(function(e){
			if(!$(e.target).hasClass('active')){
				$('.tooltip-add .tip').removeClass('active');
			}
		})
	});

	//close 버튼이 있는 tooltip case
	/* 2022-10-27 EZP-6321 정산내역 툴팁 */
	$(function(){
		$('.tooltip-box').click(function(){
			$(this).find('.tip').toggleClass('active');

			$(this).find('.tip-close').click(function(){
				$(this).find('.tip').removeClass('active');
			})
		});
	})

	//정산내역상세 리뉴얼 페이지 btn
	/* 2022-10-21 EZP-4654 */
	$(function(){
		$('.info-top-area').click(function(){
			$(this).next().toggleClass('show');
			$(this).toggleClass('on'); //2022-11-28 EZP-4654 추가
		});
	});

	/* 2022-10-06 EZP-5609 */
	// main header 제외하고 상단 배너가 있을 시 position 변경
	$(window).scroll(function () {
		if($('.topBanner').css('display') == 'block'){
			if ($(this).scrollTop() > 59) {
				$('header:not(.main,.ex-search)').css('position','fixed');
				$('.sub-content.bannerOn:not(.order-auto) .ui-tab:not(.cart-nav) .tab-nav').css({'position':'fixed','top':'50px'});
				$('.cart-switch').css('top','14px');
				$('.sub-content.order-type1').addClass('up2');
				$('.sub-content.order-type2').addClass('up2');
			} else {
				$('header:not(.main,.ex-search)').css('position','relative');
				$('.sub-content.bannerOn:not(.order-auto) .ui-tab:not(.cart-nav) .tab-nav').css({'position':'relative','top':'0px'});
				$('.cart-switch').css('top','74px');
				$('.sub-content.order-type1').removeClass('up2');
				$('.sub-content.order-type2').removeClass('up2');
			}
		}
	 });

	 // 각페이지별 잡혀있는 css가 달라서 .bannerOn으로 조정
	 $(function(){
		if($('.topBanner').css('display') == 'block'){
			$('header.sub').addClass('pChange');
			$('.sub-content:not(.order-type1,.order-type2)').addClass('bannerOn');
			$('.inform').addClass('bannerOn');
			$('.banner-top').addClass('bannerOn');
			$('.sub-content.order-type1').addClass('up');
			$('.sub-contetn.order-type2').addClass('up');
		} else {
			$('header.sub').removeClass('pChange');
			$('.sub-content:not(.order-type1,.order-type2)').removeClass('bannerOn');
			$('.inform').removeClass('bannerOn');
			$('.banner-top').removeClass('bannerOn');
			$('.sub-content.order-type1').removeClass('up');
			$('.sub-content.order-type2').removeClass('up');
		}

		$('.topBanner .close').click(function(){
			$('header:not(.main,.ex-search)').css('position','fixed');
			$('.cart-switch').css('top','14px');
			$('.sub-content.bannerOn:not(.order-auto) .ui-tab:not(.cart-nav) .tab-nav').css({'position':'fixed','top':'50px'});
			$('header.sub').removeClass('pChange');
			$('.sub-content:not(.order-type1,.order-type2)').removeClass('bannerOn');
			$('.inform').removeClass('bannerOn');
			$('.banner-top').removeClass('bannerOn');
			$('.sub-content.order-type1').removeClass('up');
			$('.sub-content.order-type2').removeClass('up');
		})
	 });

});

$(function(){
	$('.btn-detail').click(function(){
		$(this).toggleClass('active');
		if( $(this).hasClass('active') ){
			$(this).parent().find('.detail-info').show();
		}else{
			$(this).parent().find('.detail-info').hide();
		}
	})
	$('.certificate-wrap').click(function(){
		$('.ui-popup').toggleClass('on');
		$('body').toggleClass('hidden');
	})
	$('.btn-close').click(function(){
		$('.ui-popup').toggleClass('on');
		$('body').toggleClass('hidden');
	});
	$('.ico-search').click(function(){
		$(this).toggleClass('active');
		$('#container').toggleClass('active');
	})
	$('.btn-top').click(function(){
		$('html, body').animate({
			scrollTop: '0'
		},500);
	})
	$('.search-wrap .btn.black').click(function(){
		$('.ico-search').toggleClass('active');
		$('#container').toggleClass('active');
	})

	/* 2022-09-28 EZP-5609 */
	// $(window).scroll(function () {
	// 	if ($(this).scrollTop() > 58) {
	// 	 	$('header').css('position','fixed');
	// 	} else {
	// 	 	$('header').css('position','relative');
	// 	}
	//  });

	// 상단 배너가 있을 시 position 변경
	$(window).scroll(function () {
		if($('.topBanner').css('display') == 'block'){
			if ($(this).scrollTop() > 59) {
				$('header').css('position','fixed');
			} else {
				$('header').css('position','relative');
			}
		}
	 });


})

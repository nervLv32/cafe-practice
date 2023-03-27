$.get("svg.html", function (data) {
	$("body:last-child").append(data);
});

$("header .logout a").click(function(){
	$(".alert-layer").addClass("on");
	$("body").addClass("fixed");
});
$(".nav-tabs li a").click(function(){
	$(this).parent().toggleClass("selected");
	$(this).parent().siblings("li").removeClass("selected");
});

/*! 2022-12-14 EZP-7627 prev, next event 추가 시작 */
$(".floating-menu .nav .next").click(function(){
	$('.nav-tabs li.selected').next().addClass('selected');
	$('.nav-tabs li.selected').prev().removeClass('selected');
});
$(".floating-menu .nav .prev").click(function(){
	$('.nav-tabs li.selected').prev().addClass('selected');
	$('.nav-tabs li.selected').next().removeClass('selected');
});
/*! 2022-12-14 EZP-7627 prev, next event 추가 끝 */

/* 2022-11-01 EZP-4071 :no('.search-mall-list .select-list') 제거 */
$(".select-list li button").click(function(){
	$(this).parent().toggleClass("selected");
	$(".fixed-btns .next").removeClass("disabled");
});
$(".search-form .btn-expand").click(function(){
	$(this).parents(".search-form").toggleClass("expand");
});
/* 2021-08-30 EZP-3427 */
$(".dropdown-list .btn button").click(function(){
	$(this).parents(".dropdown-list").addClass("current");
	$(".dropdown-list:not(.current)").removeClass("on");
	$(this).parents(".dropdown-list").toggleClass("on");
	$(this).parent().siblings(".dropdown-menu").find("input").focus();
	$(this).parents(".dropdown-list").removeClass("current");
});
$(".pickup-detail li .info .name").click(function(){
	$(this).parents("li").toggleClass("expand");
});
$(".fail-url button").click(function(e){
	$(this).parent().toggleClass("on");
});
/* 2020-09-03 EZP-956 */
$(".fail-url .mask").click(function(e){
	$(this).parent().toggleClass("on");
});
$(".all-in button").click(function(e){
	$(this).parent().toggleClass("on");
	e.stopPropagation();
});
$(".pickup-detail .info .price button").click(function(e){
	$(this).parent().toggleClass("on");
	e.stopPropagation();
});
$(".pickup-detail .info .status button").click(function(e){
	$(this).addClass("selected");
	$(this).siblings("button").removeClass("selected");
});
// 2020-06-16 EZP-734
$(".pickup-detail:not(.mall-pickup-detail) .detail-list .detail .list li").click(function(){
	if($(this).parents('.pickup-detail').hasClass('apply-active')){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
		return false;
	}
});

$(".pickup-detail:not(.mall-pickup-detail) .detail-list .detail .list li > .product, .pickup-detail:not(.mall-pickup-detail) .detail-list .detail .list li > .order").click(function(){
	$(this).parent().find(".detail_info").toggleClass('on');
});

$(".pickup-detail .detail-list .detail .list li a").click(function(e){
	e.stopPropagation();
});
$(".layer-fail-url li > button").click(function(){
	$(this).parents("div").removeClass("on");
});
$(".layer-all-in li > button").click(function(){
	$(this).parent().toggleClass("selected");
});
$(".layer-all-in .apply").click(function(){
	$(this).parents(".all-in").removeClass("on").addClass("check");
});

// 2020-06-01 EZP-739
$(".full-layer .btns button, .full-layer .close button").click(function(){
	if( $(this).hasClass('submit') ){
		var id = $(this).parents(".full-layer").attr('id');
		if(id == 'memo-popup'){
			var $target = $(this).attr('data-open');
			$($target).addClass('on');
		}
		return false;
	}
	$(this).parents(".full-layer").removeClass("on");

	// 2021-08-03 EZP-3706
	if ($('.full-layer.on').length === 0 && $('.alert-layer.on').length === 0) {
		$('body').removeClass('fixed');
	}
});
$(".layer-pickup-form h2").click(function(e){
	$(".layer-pickup-form .contents").toggleClass("finished");
	$(".layer-pickup-form .btns *").toggle();
});
$(".memo button").click(function(e){
	$(this).parent().toggleClass("on");
	e.stopPropagation();
});
$(".alert-layer .btns button").click(function(){
	$(this).parents(".alert-layer").removeClass("on");

	// 2021-08-03 EZP-3706
	if ($('.full-layer.on').length === 0 && $('.alert-layer.on').length === 0) {
		$('body').removeClass('fixed');
	}
});

$(".fixed-btns button.all").click(function(){
	$(this).toggleClass("selected");
	$(".select-list li").toggleClass("selected");
	$(".fixed-btns .next").toggleClass("disabled");
});

$(".loading").click(function(){
	$(this).removeClass("on");
});

/*2020-04-20시작*/
$('.apply-all-btn').click(function(){
	$(this).hide();
	$('.floating-menu').addClass('active');
	$('.floating-btn-wrap').addClass('active');
	/*! 2022-12-13 EZP-7627, EZP-7448 버튼 disabled 제거 */
	$('.nav').addClass('disabled');
	$('.pickup-detail').addClass('apply-active');
	return false;
});

$('.floating-btn-wrap a').click(function(){
	if($(this).hasClass('btn-close')){
		$('.floating-menu').removeClass('active');
		$('.floating-btn-wrap').removeClass('active');
		$('.apply-all-btn').show();
		$('.nav').removeClass('disabled');
		$('.pickup-detail').removeClass('apply-active');
	}else{
		var $target = $(this).attr('data-open');
		$($target).addClass('on');
	}
	return false;
});

/* 2022-09-29 EZP-6359 popup 시작 */
$('.ui-popup-open').click(function(){
	if($(this).hasClass('btn-close')){
		$('.floating-menu').removeClass('active');
		$('.floating-btn-wrap').removeClass('active');
		$('.apply-all-btn').show();
		$('.nav').removeClass('disabled');
		$('.pickup-detail').removeClass('apply-active');
	}else{
		var $target = $(this).attr('data-open');
		$($target).addClass('on');
	}
	return false;
});

$('.re-check').click(function(){
	$('.alert-layer').removeClass('on');
	$('.full-layer').removeClass('on');
});
/* 2022-09-29 EZP-6359 popup 끝 */

/* 2020-08-12 EZP-798 시작 */
$('.in-detail h5').click(function(){
	var $target = $(this).attr('data-open');
	$($target).addClass('on');
});
/* 2020-08-12 EZP-798 종료 */

/* 2020-08-19 EZP-992 시작 */
$('.pop-open').click(function(){
	var $target = $(this).attr('data-open');
	$($target).addClass('on');
	$('body').addClass('fixed');
});
$('body').on('click', '.full-layer .pop-close', function(){
	var $target = $(this).attr('data-open');
	$(this).parents('.full-layer.full-page').removeClass('on');

	// 2021-08-03 EZP-3706
	if ($('.full-layer.on').length === 0 && $('.alert-layer.on').length === 0) {
		$('body').removeClass('fixed');
	}
});
$('body').on('click', '.full-layer .btn-group button', function(){
	if( !$(this).hasClass('disable') ){
		$(this).toggleClass('active');
	}
});

/* 2020-08-19 EZP-992 종료 */

/*2020-04-20 종료*/
$(".new-type .select-item.date button").click(function(e){
	$(this).addClass("selected");
	$(this).siblings("button").removeClass("selected");
});
// 2020-05-04 낱장불가 수량

// 2020-06-16 EZP-734
$(".detail_info .btns .submit").click(function(e){
	$('.alert-layer').addClass('on');
});

$(".detail_info .btns .cancel").click(function(e){
	$(this).parents('.detail_info').toggleClass('on');
});

$(".detail_info .btns .close").click(function(e){
	$(this).parents('.detail_info').toggleClass('on');
});

// 2020-06-16 EZP-734
$(".detail_info .select-item.type button").click(function(e){
	$(this).parents('.select-item.type').find('button').removeClass('selected')
	$(this).addClass('selected');
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

// 2020-05-07 버튼 클릭 이벤트
// 2020-06-16 EZP-734
// 2021-01-08 EZP-2103 시작
$("dl .select-item.status button").click(function(e){
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
// 2021-01-08 EZP-2103 종료
$("dl .select-item.date button").click(function(e){
		$("dl .select-item.date button").removeClass('selected');
		$(this).addClass('selected');
});

// 2020-05-19
$('.order-deadline button').click(function(){
	var target = $(this).data('target')
	$(target).addClass('on');

})

/* EZP-601-200619 */
$('.full-layer.new-type .status button').click(function(e){
	$(this).parent().find('button').removeClass('selected');
	$(this).addClass('selected');
});

/* include HTML :: 퍼블 화면 확인용 */
window.addEventListener('load', function() {
	var allElements = document.getElementsByTagName('include-html');
	Array.prototype.forEach.call(allElements, function(el) {
		var includePath = el.attributes.page.nodeValue;
		if (includePath) {
			var http = new XMLHttpRequest();
			http.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {
					el.outerHTML = this.responseText;
				}
			};
			http.open('GET', includePath, true);
			http.send();
		}
	});
});


// 2022-07-05 EZP-5424
$(".exOption button").click(function(e){
	$(this).parent().toggleClass("on");
	e.stopPropagation();
});


// 2022-12-13 EZP-7627, EZP-7448 scroll 에 따른 top 버튼 노출
$('.floating-menu .top').hide();
$(window).bind('mousewheel', function(event) {
	if (event.originalEvent.wheelDelta >= 0) {
		$('.floating-menu .top').hide();
	}
	else {
		$('.floating-menu .top').show();
	}
});
/*! 2022-12-13 EZP-7627, EZP-7448 탑으로 이동 추가 */
$('.floating-menu .top').click(function(e){
	e.preventDefault();
	window.scrollTo({ top: 0, behavior: "smooth" });  
})
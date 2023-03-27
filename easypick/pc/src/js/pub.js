$(document).ready(function() {
      //2020-03-23
      // 2022-01-17 개발팀 요청으로 .size => .length로 변경처리
      if ($("#container-full").length != 0) {
          $("footer").addClass("full");
      }

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
      https: var $inputs = $("input[type=text], input[type=number], input[type=password]").not(".not-addclear, .addclear2"); // 21-03-04 수정, readonly 삭제
      var $inputs2 = $(".addclear2").not(".not-addclear"); // 21-03-04 수정, readonly 삭제

      //console.dir($inputs)
      //var $inputs = $('input[type=text], input[type=number], input[type=password]').not($(this).attr('readonly'));
      $inputs.addClear({
          showOnLoad: true,
          right: 12,
          display: "inline-block",
          onClear: function () {
              var $prt = $(arguments[0]).closest(".add-clear-span");
              $prt.removeClass("active");
              // console.dir(1);

              // 21-03-03 배송지 주소 관련 추가
              if ($(arguments[0]).hasClass("add-input")) {
                  // 2021-03-24
                  $(arguments[0]).parents(".join-row").find("input.add-input2").val("").trigger("change");
              }
          },
      });
      $inputs2.addClear({
          showOnLoad: true,
          right: 12,
          display: "block",
          onClear: function () {
              var $prt = $(arguments[0]).closest(".add-clear-span");
              $prt.removeClass("active");
              // console.dir(1);

              // 21-03-03 배송지 주소 관련 추가
              if ($(arguments[0]).hasClass("add-input")) {
                  // 2021-03-24
                  $(arguments[0]).parents(".join-row").find("input.add-input2").val("").trigger("change");
              }
              // 2021-05-04 EZP-2212
              $(arguments[0]).trigger("change");
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
      $(document).on("click", ".btn-group-view button", function () {
          //21-01-20 수정
          var $me = $(this);
          var type = $me.data("type");
          $me.addClass("active").siblings().removeClass("active");

          $(".product-item-wrap").attr("data-type", type);
          dev.observer.notify("SYNC_LEFT"); //21-01-18 추가
      });

      //21-01-18 추가  //21-01-20 수정
      $(window).on({
          resize: function () {
              if ($("#container").find(".left-menu").length > 0) {
                  dev.observer.notify("SYNC_LEFT");
              }
          },
          load: function () {
              if ($("#container").find(".left-menu").length > 0) {
                  dev.observer.notify("SYNC_LEFT");
              }
              // 21-01-21 수정 / header 관련
              if ($("#container-full, #container").hasClass("min-wid")) {
                  $("header").addClass("min-wid");
              }
          },
      });

      //amount
      //+버튼 선택시
      // $(".amount .plus").on('click', function(e) {
      //     e.preventDefault();
      //     var stat = $(this).parent().find('input').val();
      //     var num = stat;
      //     num++;
      //     /*if(num>10){
      //         alert('더이상 추가할수 없습니다.');
      //         num =1;
      //     }*/
      //     $(".amount button").attr('disabled',false);
      //     $(this).parent().find('input').val(num);
      // });
      //
      // //-버튼 선택시
      // $(".amount .minus").on('click', function(e) {
      //     e.preventDefault();
      //     var stat = $(this).parent().find('input').val();
      //     var num = stat;
      //     num--;
      //     if (num <= 0) {
      //         $(this).attr('disabled',true);
      //         num = 1;
      //     } else{
      //         $(".amount button").attr('disabled',false);
      //     }
      //     $(this).parent().find('input').val(num);
      // });

      // 2022-02-18 EZP-5022 라이브러리 관련 스크립트 삭제
      // 2020-03-24 퀵 수정
      // if (document.getElementById("quick") === null) {
      //
      // } else {
      //   $("#quick .scrollbar-inner").scrollbar();
      //   setTimeout(function() {
      //     var footerTop = $('footer').offset().top - 100;
      //     var quickY = footerTop - $('#quick').outerHeight();
      //     $(window).on('scroll', function() {
      //       var top = $(window).scrollTop();
      //       if (top > (quickY - 150)) {
      //         $('#quick').css({
      //           top: 'auto',
      //           bottom: '400px'
      //         });
      //       } else {
      //         $('#quick').removeAttr('style');
      //       }
      //     });
      //   }, 100);
      // }

      /**/
      // 2019-06-04 수정//
      // 미송 환불 버튼 토글

      /*
      $(".slider .off").on("click", function () {
              var oInput = $(this).parents(".switch").find("input");
              // oInput.prop("checked", !oInput.is("[checked]"));
              // oInput.attr("checked", !oInput.is("[checked]"));
              $(this).find("div.slider span.on").toggleClass("active");
      });
      */


      // //2019-06-04 수정

      $(".btn-noshipping, .btn-refund").on("click", function () {
          $(this).toggleClass("active");
      });

      // 2021-04-20 EZP-2266
      $("body").on("click", "span.switch", function () {
          if (!$(this).hasClass("no_change")) {
              var oInput = $(this).find("input");
              oInput.prop("checked", !oInput.is("[checked]"));
              oInput.attr("checked", !oInput.is("[checked]"));
              $(this).find("div.slider span").toggleClass("active");
          } 
          // 2021-04-27 EZP-2178 : 바로주문 미송수량확인 버튼
          if ($(this).parent().hasClass("switch-btn-wrap")) {
              if (!oInput.is("[checked]")) {
                  $("#btnReserveCalc").hide(); // 2021-10-13 EZP-4232 //2023-03-15 EZP-8591 개발팀 요청으로 기존 $("#btnDeduction")에서 변경
                  $(".col-width").attr("width", "95");
                  $(".col-qty").attr("width", "80"); //수량 너비
                  //$(".tab-scroll-wrap .scrollbar span").removeAttr("width");
                  $("#tab_01 .tab-scroll-wrap .scrollbar span").css("width", "2250px");
                  $(".amount-evt").removeClass("on");
                  $(".amount-evt span").each(function () {
                      if ($(this).text() === "-") {
                          $(this).parent().removeClass("empty");
                      }
                  });
                $("#tab_02 .tab-scroll-wrap .scrollbar span").css("width", "2250px !important"); //2023-03-18 EZP-8605 추가


              } else {
                  $("#btnReserveCalc").show(); // 2021-10-13 EZP-4232 //2023-03-15 EZP-8591 개발팀 요청으로 기존 $("#btnDeduction")에서 변경
                  $(".col-width").attr("width", "145");
                  $(".col-qty").attr("width", "150"); //수량 너비
                  $("#tab_01 .tab-scroll-wrap .scrollbar span").css("width", "2320px");
                  $(".amount-evt").addClass("on");
                  $(".amount-evt span").each(function () {
                      if ($(this).text() === "-") {
                          $(this).parent().addClass("empty");
                      }
                  });
                $("#tab_02 .tab-scroll-wrap .scrollbar span").css("width", "2150px !important"); //2023-03-18 EZP-8605 추가

              }
          }


           //2022-12-12 EZP-6415 쇼핑몰 상품으로 등록 off 되었을 때
           if ($(this).parents().hasClass("toggle-change1")) {
                if (!oInput.is("[checked]")) {
                    $('.toggle-change1 .on-off').addClass('off');
                } else {
                    $('.toggle-change1 .on-off').removeClass('off');
                }
            }

            //2022-12-12 EZP-6415 쇼핑몰 상품으로 등록 off 되었을 때
          if ($(this).parents().hasClass("toggle-change2")) {
            if (!oInput.is("[checked]")) {
                $('.toggle-change2 .product-detail').addClass('off');
            } else {
                $('.toggle-change2 .product-detail').removeClass('off');
            }
        }

          // 2022-05-27 EZP-5433 바로주문 스크롤테이블
          if ($(this).parent().hasClass("switch-cart-wrap")) {
            if (!oInput.is("[checked]")) {
                $(".toggle-switch").removeClass("on");
                $(".cart-toggle").removeClass("on");
                $(".tab-cont1 .cart-total").attr("colspan", "7");
                $(".tab-cont1 .no-cart").attr("colspan", "7"); // 2022-07-21 EZP-3157
                $(".tab-cont3 .cart-total").attr("colspan", "7"); // 2022-07-21 EZP-3157
                $(".col-soldOut").hide();
                $("#tab_01 .tab-scroll-wrap .scrollbar span").css("width", "2150px");
                $("#tab_02 .tab-scroll-wrap .scrollbar span").css("width", "2250px !important");
                $("#tab_03 .tab-scroll-wrap .scrollbar span").css("width", "2250px"); //2023-03-18 EZP-8605 2193px 에서 변경
                $("#tab_05 .tab-scroll-wrap .scrollbar span").css("width", "2150px"); //2023-03-18 EZP-8605 추가
                $("#tab_06 .tab-scroll-wrap .scrollbar span").css("width", "2150px"); //2023-03-18 EZP-8605 추가


            } else {
                $(".toggle-switch").addClass("on");
                $(".cart-toggle").addClass("on");
                $(".tab-cont1 .cart-total").attr("colspan", "8");
                $(".tab-cont1 .no-cart").attr("colspan", "8"); // 2022-07-21 EZP-3157
                //$(".tab-cont3 .cart-total").attr("colspan", "8"); //2022-07-21 EZP-3157
                $(".col-soldOut").show();
                $("#tab_01 .tab-scroll-wrap .scrollbar span").css("width", "2250px");
                $("#tab_02 .tab-scroll-wrap .scrollbar span").css("width", "2150px !important");
                $("#tab_03 .tab-scroll-wrap .scrollbar span").css("width", "2345px");
                $("#tab_05 .tab-scroll-wrap .scrollbar span").css("width", "2268px"); //2023-03-18 EZP-8605 추가
                $("#tab_06 .tab-scroll-wrap .scrollbar span").css("width", "2268px"); //2023-03-18 EZP-8605 추가

            }
        }

      });

      // 퍼블서버에서 옵션 리스트 확인용 (개발서버에서 이벤트 충돌로 인하여 개발에서는 사용안함)
      $(".autoframe-wrap .autoframe-input").on("focus blur", function () {
          //temp
          $(this).parent().siblings(".autoframe").toggleClass("on");
      });

    // 2023-03-08 EZP-8597 위치변경 (DOM ready 밖에서 안으로)
    // datepicker
    $(function() {
        $(".datepicker").datepicker({
        // Fix by Dev : 이미지 경로 방식 변경
        //buttonImage: "../../../../img/common/calendar.png",
        //buttonImageOnly: true,
        buttonText: "Select date",
        showMonthAfterYear: true,
        dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        // Fix by Dev : 월 타이틀 변경 (두자리)
        monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        showOn: "both",
        showOtherMonths: true,
        selectOtherMonths: true,
        // Fix by Dev : 날짜형식 변경
        dateFormat: 'yy-mm-dd',
        closeText: "선택",
        isRTL: true,
        autoClose: true,
        //maxDate: "0", // 2021-04-27 EZP-2859 //2023-03-10 EZP-8694 주문관리 모든 메뉴에서 오늘 이후 날짜도 선택 가능해야함. (개발측 제거요청)
        beforeShow: function () {
            $(this).trigger('beforeShow');
        },
    
        onSelect: function () {
            $(this).trigger('onSelect');
        }
        });
    });
});


// 2021-09-27 EZP-3700
$("#excel-check #merge-check").click(function(){
  var separate = $(this).parents("table").find("#seller_name,#seller_addr").parents("tr"),
  merge = $(this).parents("table").find("#seller_name_addr").parents("tr"); // 2023-03-09 EZP-8599 개발싱크 맞춤으로 변경

  if($(this).prop("checked") == true){
    separate.hide();
    merge.show();
  }
  else if($(this).prop("checked") == false){
    separate.show();
    merge.hide();
  }
});


/**********
2022 07-26 EZP-5909
***********/
//2022-07-12 EZP-3157 결제금액 스크롤
// var costTop = $('.total-cost').offset().top;
// var footerTop = $('footer').offset().top - 100;
// var maxY = footerTop - $('.total-cost').outerHeight();
// $(window).on('scroll', function () {
//     var headerHeight = $('header').height();
//     var top = $(window).scrollTop();
//     var orderTop = $('.order-list').offset().top;
//     var scroll = (orderTop - headerHeight);
//     if (top >= scroll) {
//         if (top > (maxY - 150)) {
//             $('.total-cost').removeClass('fixed').css({
//                 position: 'absolute',
//                 top: (maxY - costTop) + 'px'
//             });
//         } else {
//             $('.total-cost').addClass('fixed').removeAttr('style');
//         }

        /*if(top < maxY){

        } else{

        }*/
//     } else {
//         $('.total-cost').removeClass('fixed');
//     }
// });
/**********
//EZP-5909
***********/

//tip 영역
//2022-11-22 EZP-6415 css left 제거
//$('.tip').css('left', 0);
$('.btn-tip').on('mouseover', function () {
    $('.tip').hide();
    $(this).parent().parent().find('.tip').show();
});
//2022-12-06 EZP-6415 :not case 추가 
$('.btn-tip:not(.hover)').on('mouseleave', function () {
    $('.tip').hide();
});

//2022-12-06 EZP-6415 .hover + .tip case 추가 회원정보변경 / 회원가입시 팁에 hover해도 사라지지않도록
$('.btn-tip.hover + .tip').on('mouseleave', function () {
    $('.btn-tip.hover + .tip').hide();
});

//2022-08-11 EZP-6344 방향키
/**
 * input 값 입력 - e.preventDefault() 막지 않는다.
 */
$('#tbodyOrder').on('keyup', 'input[type="text"]', function (e) {
    var iLength = $(this).val().length;
    var iCursorPosition = e.target.selectionStart;
    var sName = $(this).attr('name');
    var oTargetTd = $(this).closest('.tdInput');
    var oTargetTr = $(this).closest('tr');
    var oKeyCode = {left: 37, up: 38, right: 39, down: 40};

    // 방향키로 커서 이동
    if (e.keyCode === oKeyCode.left && iCursorPosition === 0) {
        oTargetTd.prev().hasClass('tdInput') ? oTargetTd.prev().find('input').focus() : oTargetTd.prev().prev().find('input').focus();
        $('.account-list').remove();

        // 커서 이동시 스크롤 자동 이동
        moveScroll($('.tab-scroll-wrap').scrollLeft());
    } else if (e.keyCode === oKeyCode.right && iCursorPosition === iLength) {
        oTargetTd.next().hasClass('tdInput') ? oTargetTd.next().find('input').focus() : oTargetTd.next().next().find('input').focus();
        $('.account-list').remove();

        // 커서 이동시 스크롤 자동 이동
        moveScroll($('.scrollbar').width);
    } else if (e.keyCode === oKeyCode.up && $('.account-list').is(':visible') === false) {
        oTargetTr.prev().find('input[name="' + sName + '"]').focus();
    } else if (e.keyCode === oKeyCode.down && $('.account-list').is(':visible') === false) {
        oTargetTr.next().find('input[name="' + sName + '"]').focus();
    }
});

//pickshop - btn toggle
$('#btnPickSeller').click(function(){
    $(this).toggleClass('active');
});
//2022-11-22 EZP-6415 연동하기 버튼 클릭시 로그인 화면 나오도록
    //2023-01-17 EZP-6415 제거
    // const changeBtn = document.querySelector('button.cafe24.change');
    // const loginBox = document.querySelector('.cafe24_info .login-box');

    // changeBtn.addEventListener("click", function(){
    //     changeBtn.style.display = 'none';
    //     loginBox.style.display = 'block';
    // });
    // });


//floating menu
$('.floating-order-wrap .close').click(function(){
    $('.floating-order-wrap').css('display','none');
})



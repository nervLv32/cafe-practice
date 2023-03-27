$(document).ready(function () {
  $.protip();
});

// Tooltip-case1 클릭 이벤트
$(document).ready(function () {
  tooltipCase1();
})

function tooltipCase1() {
  $('body').on('click', '.tooltip-case1 .tooltip-btn', function () {
    var $toolTipWrap = $(this).closest('.tooltip-case1');
    $toolTipWrap.toggleClass('active');
  });
  $('body').on('click', '.tooltip-case1 .tooltip-close-btn', function () {
    $(this).closest('.tooltip-case1').removeClass('active');
  });

  $(document).on('CLICK', function (e, target) {
    var $target = $(target),
      $toolTip = $('.tooltip-case1'),
      $closest = $target.closest($toolTip),
      notSelect = $closest.length < 1;

    if (notSelect) {
      $toolTip.removeClass('active');
    } else {
      $toolTip.not($closest).removeClass('active');
    }
  });
}






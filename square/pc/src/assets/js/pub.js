$(function () {
    $(document).ready(function () {

        //amount
        //+버튼 선택시
        $(".amount .plus").on('click', function (e) {
            e.preventDefault();
            var stat = $(this).parent().find('input').val();
            var num = stat;
            num++;
            /*if(num>10){
                alert('더이상 추가할수 없습니다.');
                num =1;
            }*/
            $(".amount button").attr('disabled', false);
            $(this).parent().find('input').val(num).change();
        });

        //-버튼 선택시
        $(".amount .minus").on('click', function (e) {
            e.preventDefault();
            var stat = $(this).parent().find('input').val();
            var num = stat;
            num--;
            if (num <= 0) {
                $(this).attr('disabled', true);
                num = 0;
            } else {
                $(".amount button").attr('disabled', false);
            }
            $(this).parent().find('input').val(num).change();
        });
    });

    // 2021-08-06 EZP-3726
    $('.search-item.period-filter a').click(function () {
        $('.search-item.period-filter a').removeClass('on');
        $(this).addClass('on');
    });
});

// datepicker
$(function () {
    $(".datepicker").datepicker({
        buttonImage: "../img/square/calendar.png", //2022-10-13 EZP-5444 스퀘어 이미지 경로 재설정
        buttonImageOnly: true,
        buttonText: "Select date",
        showButtonPanel: true,
        showMonthAfterYear: true,
        dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        showOn: "both",
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'yy-mm-dd',
        closeText: "선택",
        beforeShow: function () {
            $(this).trigger("beforeShow");
        },
        onSelect: function () {
            $(this).trigger("onSelect");
        },
        autoClose: true,
        //! 2022-12-26 EZP-7627 제거
        // maxDate: "0" // 2021-04-27 EZP-2856
    });
});

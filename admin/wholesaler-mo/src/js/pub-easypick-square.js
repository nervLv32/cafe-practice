$(function(){
	$(document).ready(function(){

		//amount
		//+버튼 선택시
		$(".amount .plus").on('click', function(e) {
			e.preventDefault();
			var stat = $(this).parent().find('input').val();
			var num = stat;
			num++;
			/*if(num>10){
				alert('더이상 추가할수 없습니다.');
				num =1;
			}*/
			$(".amount button").attr('disabled',false);
			$(this).parent().find('input').val(num);
		});

		//-버튼 선택시
		$(".amount .minus").on('click', function(e) {
			e.preventDefault();
			var stat = $(this).parent().find('input').val();
			var num = stat;
			num--;
			if (num <= 0) {
				$(this).attr('disabled',true);
				num = 1;
			} else{
				$(".amount button").attr('disabled',false);
			}
			$(this).parent().find('input').val(num);
		});
	});
});

// datepicker
$( function() {
	$( ".datepicker" ).datepicker({
		buttonImage: "../../img/common/calendar.png",
		buttonImageOnly: true,
		buttonText: "Select date",
		showButtonPanel: true,
		showMonthAfterYear:true,
		dayNamesMin: ['SUN','MON','TUE','WED','THE','FRI','SAT'],
		dayNames: ['일','월','화','수','목','금','토'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		showOn: "both",
		showOtherMonths: true,
		selectOtherMonths: true,
		dateFormat: 'yy.MM.d.DD',
		closeText: "선택",
		beforeShow: function(){
			$(this).trigger("beforeShow");
		},
		autoClose: false,
	});
} );

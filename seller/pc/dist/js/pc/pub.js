var core = window[APP_NAME],
	ui = window[APP_NAME].ui;

ui.FILE = {
	el: '.ui-file-async',
	data: {
		stack: false,
		fileList : [],
		itemClass: '',
		backgroundImage: false,
	},
	init: function(){
		$(ui.FILE.el).each(this.set);
		this.bindEvent();
	},
	set: function(){
		var i = $(ui.FILE.el).index(this),
			data = $.extend(ui.FILE.data, $(this).data('file'));

		ui.FILE.data.fileList[i] = [];

		$(this).find('.list-item').each(function(){
			var imageSrc = data.backgroundImage ?
				$(this).find('.image')[0].style.backgroundImage.slice(4, -1).replace(/"/g, "") : $(this).find('.image img').attr('src');

			var srcSplit = imageSrc.split('/'),
				fileSrc = srcSplit[srcSplit.length - 1];

			ui.FILE.data.fileList[i].push(fileSrc);
		});

		ui.FILE.calcLimitNumber(i);
		$(this).trigger('update');
	},
	bindEvent: function(){
		core.$body.on('change.file', ui.FILE.el +' input[type="file"]', this.uploadFile);
		core.$body.on('click.file', ui.FILE.el +' .btn-remove', this.removeFile);
		core.$body.on('set', ui.FILE.el, this.set);
	},
	uploadFile: function(){
		var $prt = $(this).closest(ui.FILE.el),
			$listWrapper = $prt.find('.list-wrapper'),
			data = core.Data($prt.data('file'), ui.FILE.data),
			idx = $(ui.FILE.el).index($prt),
			files = core.support.multiple ?
			this.files :
			[
				{name: this.value.replace(/^.+\\/, "")}
			];

		ui.FILE.data.fileList[idx] = ui.FILE.data.fileList[idx] || [];

		if(!data.stack){
			ui.FILE.data.fileList[idx] = [];
			$listWrapper.empty();
		}
		if(data.limit < ui.FILE.data.fileList[idx].length + files.length){
			return alert('등록할 수 없습니다. (최대 : '+data.limit+')');
		}

		for(var i=0; i<files.length; i++){
			(function(index, inst){
				var $item = $("<div class='list-item " +data.itemClass+"'></div>"),
					file = files[i],
					fileName = file.name,
					isRegister = String(ui.FILE.data.fileList[idx]).indexOf(fileName) > -1;

				if(isRegister) return false;

				$item.append("<strong class='name'>"+ fileName +"</strong><button type='button' class='btn-remove'>삭제</button>");
				$listWrapper.append($item);

				if(core.support.fileReader){
					var reader = new FileReader(),
						supportPreview = file.type.match('image') ? true : false;

					reader.addEventListener('load', function(e){
						var result = e.target.result;

						if(supportPreview){
							var $imgContainer = $("<span class='image'></span>");
							var img = document.createElement("img");
							img.src = result;

							$imgContainer.append(img);
							$item.prepend($imgContainer);
						}
					});
					reader.readAsDataURL(file);
				}

				ui.FILE.data.fileList[idx].push(fileName);
			})(i, this);
		}

		ui.FILE.calcLimitNumber(idx);
		$prt.addClass('regist');
	},
	removeFile: function(){
		var $item = $(this).closest('.list-item'),
			$prt = $item.closest(ui.FILE.el),
			$input = $prt.find('.btn input[type="file"]'),
			itemIndex = $item.index(),
			prtIndex = $(ui.FILE.el).index($prt);

		$item.remove();
		$input.val('');

		ui.FILE.data.fileList[prtIndex].splice(itemIndex, 1);
		ui.FILE.calcLimitNumber(prtIndex);

		if(ui.FILE.data.fileList[prtIndex].length < 1){
			$prt.removeClass('regist');
		}
	},
	calcLimitNumber: function(i){
		var $prt = $(ui.FILE.el).eq(i),
			$amountNum = $prt.find('.amount em'),
			registLength = ui.FILE.data.fileList[i].length;
		$amountNum.text(registLength);
		$prt.trigger('update');
	}
}

// 2022-02-14 EZP-5038
$(document).ready(function(){
	// 컨테이너 영역 넓이 적용
	if ($('.product-wrap').find('.product-detail').length) {
		$('footer').css('min-width', '1860px');
	}
	if ($('.order-manage-wid').length) {
		$('footer').css('min-width', '1650px');
	}
});

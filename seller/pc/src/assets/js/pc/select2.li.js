/**
 * 검색 기능 추가된 셀렉트 컴포넌트
 *
 * @author ymlee03
 * @since 2019. 07. 22.
 */
$(document).ready(function () {
    /**
     * active 클래스 적용
     */
    var style = document.createElement('style');
    style.innerHTML = '.select_ul .active { background: #f9f9f9; }';
    document.body.appendChild(style);

    /**
     * 셀렉트 UL창 선택 시, 선택되어있는 리스트로 스크롤 이동 + 검색창으로 포커스 이동
     */
    $('.ui-select').click(function () {
        var oActiveLi = $(this).find('.select_ul > li.active');
        var iIndex = oActiveLi.siblings(":visible").addBack().index(oActiveLi);
        $(this).find('.select_ul').scrollTop(iIndex * oActiveLi.height());
        $(this).find('.select_search > input').focus();
    });

    var KEYS = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };

    /**
     * 셀렉트 UL 특수 키 입력 이벤트 동작
     */
    $('.select_search > input').keydown(function (e) {
        var sKeyType = e.which;
        var oContainer = $(this).closest('.ui-select.active');

        if (sKeyType === KEYS.UP) {
            $(this).trigger('selected:previous', {});
            return false;
        } else if (sKeyType === KEYS.DOWN) {
            $(this).trigger('selected:next', {});
            return false;
        } else if (sKeyType === KEYS.ESC) {
            oContainer.removeClass('active');
            $(this).trigger('hideTooltip');
            return false;
        } else if (oContainer.attr('id') === 'divBuyerNo' && sKeyType === KEYS.ENTER) {
            // 쇼핑몰 검색은 다중 선택 이벤트 트리거 발생
            oContainer.find('.select_ul li.active').trigger('click');
            return false;
        } else if (sKeyType === KEYS.ENTER) {
            var oActiveLi = oContainer.find('.select_ul li.active');
            oContainer.find('input[type=hidden]').val(oActiveLi.data('value'));
            // oContainer.find('button[type=button]').text(oActiveLi.text());
            // EZP-2069 처리
            oContainer.find('button[type=button]').html($.parseHTML(oActiveLi.html()));
            oContainer.removeClass('active');
            $(this).trigger('hideTooltip');
            $(this).trigger('afterChange', {target: oActiveLi});
            return false;
        }
    });

    /**
     * 셀렉트 UL 검색
     */
    $('.select_search > input').on('input', '', function () {
        var oUl = $(this).parent().siblings('.select_ul');
        var oAllList = oUl.find('li');
        var sValue = $(this).val().toLowerCase();
        var sPattern = new RegExp('.*' + sValue + '.*');

        // 검색 창에 입력된 값이 있는 리스트만 Show
        oAllList.each(function (iIndex, oItem) {
            if (sPattern.test($(oItem).text().toLowerCase()) === true) {
                $(oItem).show();
            } else {
                $(oItem).hide();
            }
            $(oItem).removeClass('active');
        });

        // 검색 결과가 바뀌면 포커스는 첫번째 리스트로 이동
        var oList = oUl.find('li:visible').first();
        oList.addClass('active');
    });

    /**
     * 목록에서 위, 아래 방향키를 누를때 포커스 이동 이벤트
     */
    $('.ui-select').on('selected:previous selected:next', '', function (e) {
        var sEventType = e.type === 'selected:next' ? 'next' : 'prev';
        var oCurrentTarget = $(this).find('.select_ul li.active');
        var oNextTarget = sEventType === 'next' ? oCurrentTarget.nextAll(':visible').first() : oCurrentTarget.prevAll(':visible').first();

        // 아무것도 선택이 안되어있을때 방향키를 움직일 시, 가장 맨 위의 리스트 선택
        if (oCurrentTarget.length === 0) {
            $(this).find('.select_ul').find('li:visible').first().addClass('active');
            return false;
        }

        // 이동할 타겟이 없으면 리턴
        if (oNextTarget.length === 0) {
            return false;
        }

        // 방향이 이동 시, 현재 타겟은 클래스를 지운 후 다음 타겟에 클래스 적용
        if (oNextTarget.length > 0) {
            oCurrentTarget.removeClass('active');
            oNextTarget.addClass('active');
        }

        // 스크롤 위치 조정
        var oUl = $(this).find('.select_ul');
        var iNextTargetIndex = oUl.find('li:visible').index(oNextTarget);
        var iNextTargetPosition = iNextTargetIndex <= 0 ? 0 : oNextTarget.height() * iNextTargetIndex;

        if (sEventType === 'next' && iNextTargetPosition >= oUl.scrollTop() + oUl.height()) {
            // 방향키가 아래이면서 스크롤의 위치보다 리스트의 위치가 더 아래일 때 : 리스트가 스크롤의 맨 아래로 위치
            oUl.scrollTop(iNextTargetPosition + oNextTarget.height() - oUl.height());
        } else if (sEventType === 'next' && oUl.scrollTop() > iNextTargetPosition) {
            // 방향키가 아래이면서 스크롤의 위치보다 리스트의 위치가 더 위일 때 : 리스트가 스크롤의 맨 위로 위치
            oUl.scrollTop(iNextTargetPosition);
        } else if (sEventType === 'prev' && oUl.scrollTop() > iNextTargetPosition) {
            // 방향키가 위이면서 스크롤의 위치보다 리스트의 위치가 더 위일 때 : 리스트가 스크롤의 맨 위로 위치
            oUl.scrollTop(iNextTargetPosition);
        } else if (sEventType === 'prev' && iNextTargetPosition >= oUl.scrollTop() + oUl.height()) {
            // 방향키가 위이면서 스크롤의 위치보다 리스트의 위치가 더 아래일 때 : 리스트가 스크롤의 맨 아래로 위치
            oUl.scrollTop(iNextTargetPosition + oNextTarget.height() - oUl.height());
        }

        // 방향키 이동 시 툴팁 생성 이벤트 호출
        oNextTarget.trigger('showTooltip');
    });

    /**
     * 멀티 셀렉트 선택
     */
    $('.divSearchStore > div.ui-select li').click(function () {
        if ($(this).data('key') === '') {
            $('#divSelectArea > span').remove();
        } else {
            // 기존 데이터 삭제
            $('#divSelectArea').find('input[value="' + $(this).data('key') + '"]').closest('span').remove();

            var oStoreSpan = document.createElement('span');

            var oStoreSpanEm = document.createElement('em');
            oStoreSpanEm.innerHTML = $(this).html();

            var oStoreSpanButton = document.createElement('button');
            oStoreSpanButton.innerHTML = '삭제';
            oStoreSpanButton.setAttribute('type', 'button');
            oStoreSpanButton.setAttribute('class', 'btnStoreRemove');
            oStoreSpanButton.addEventListener('click', function () { $(this).closest('span').remove(); });

            var oStoreSpanInput = document.createElement('input');
            oStoreSpanInput.setAttribute('type', 'hidden');
            oStoreSpanInput.setAttribute('name', 'buyer_no[]');
            oStoreSpanInput.setAttribute('value', $(this).data('key'));

            oStoreSpan.appendChild(oStoreSpanEm);
            oStoreSpan.appendChild(oStoreSpanButton);
            oStoreSpan.appendChild(oStoreSpanInput);

            $('#divSelectArea').append(oStoreSpan);
        }
    });

    /**
     * 멀티 셀렉트 삭제
     */
    $('.btnStoreRemove').click(function () {
        $(this).closest('span').remove();
    });
});

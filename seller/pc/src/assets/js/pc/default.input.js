/* 2022-10-04 input 이모지 입력 불가 추가 */
$(document).ready(function () {
    applyInputFilter();
});

/**
 * Input컴포넌트의 data-filter 속성의 값만 허용
 */
var applyInputFilter = function () {
    console.log('########################');
    // 특수문자는 정규표현식 안에서 \'이 되게해야 해서 \를 3개 붙여야함.
    var oRegexpMap = {
        kor: 'ᄀ-ᄒㄱ-ㅎㅏ-ㅣ가-힣\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55',  // 한글 + 천지인키보드(아래아 ·(middle dot)) // 아이폰 ᄀ-ᄒ는 특수문자로 되서 추가해야함
        eng: 'a-zA-Z',
        num: '0-9',
        special: '~!@#$%^&*()_+|<>?:{}\\\-\\\=\\\`\\\\\\\[\\\]\\\;\\\'\\\"\\\,\\\.\\\/',
        space: ' ',
        special_all: '~!@#$%^&*()_+|<>?:{}\\\-\\\=\\\`\\\\\\\[\\\]\\\;\\\'\\\"\\\,\\\.\\\/\\\r\\\n ', // 특문 + 공백 + 엔터
        special_option: '()_?\\\- ', // 일부 특문 + 공백 (마켓명 사양에 우선적용)
        email_special: '@_\\\-\\\.',
        decimal: '0-9\\\.',
        jp: 'ぁ-ゔァ-ヴー々〆〤',
        cn: '一-龥',
        class_name: 'a-zA-Z0-9_-',
        login_email: 'ᄀ-ᄒㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9_\\\-\\\.\\\@',
        email_direct: 'a-zA-Z0-9_\\\-\\\.',
        hyphen: '\\\-',
        under_bar: '_',
        slash: '\\\/',
        angle_bracket: '()',
        curly_bracket: '{}',
        square_bracket: '[]',
        comma: '\\\,',
        enter: '\n',
    };

    $('body').on('input blur', 'input[data-filter], textarea[data-filter]', function () {
        var oInput = $(this);
        var sFilterRegexp = oInput.data('filter_regexp') == undefined ? '' : oInput.data('filter_regexp');
        var sFilter = oInput.data('filter') == undefined ? '' : oInput.data('filter');

        // maxlength 체크
        if (oInput.is('[maxlength]') === true) {
            var iMaxLength = oInput.attr('maxlength');
            if (String(oInput.val()).length > iMaxLength) {
                oInput.val(oInput.val().slice(0, iMaxLength));
                return false;
            }
        }

        // 연속 공백 입력 제한 있는 경우 1개로 치환
        if (sFilter.indexOf('single_space') > -1) {
            oInput.val(oInput.val().replace(/ +/g, ' '));
        }

        // this의 data에 정규표현식 저장 (입력마다 체크때문)
        if (sFilterRegexp == '') {
            sFilter.split('|').forEach(function (sFilter) {
                if (oRegexpMap[sFilter] != undefined) {
                    sFilterRegexp += oRegexpMap[sFilter];
                }
            });

            oInput.data('filter_regexp', sFilterRegexp);
        }

        // 정규표현식에 맞지 않으면 문자 제거

        var sRegexp = new RegExp('[^' + sFilterRegexp + ']', 'g');
        oInput.val(oInput.val().replace(sRegexp, ''));
    });
};

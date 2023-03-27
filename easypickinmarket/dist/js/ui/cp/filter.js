/**
 * ui 체크 관련
 * Created by 임영주 on 2016-10-04.
 */
var FILTER = FILTER || {};

/**
 * 공백 제거
 * chkName : 체크 태그의 id 또는 class
 */
FILTER.removeWhitespace = function (chkName) {
    $(chkName).keyup(function () {
        $(this).val($(this).val().replace(/[ ]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[ ]/g, ''));
    });
};
/**
 * 특수부호 제거(현재 상품명 중복체크시 사용)
 */
FILTER.chkSpecialCharacter = function (obj) {
    var re = /[;\'\"\^`\\]/gi; //정규식 구문
    if (obj.val().match(re) !== null) {
        obj.val(jQuery.trim(obj.val().replace(re, "")));
    }
    return obj.val();
};
/**
 * 특수부호 제거(현재 상품명, 옵션명 포함)
 */
FILTER.chkSpecialCharacterForBarcode = function (obj) {
    var re = /[;\'\"\^`\\/]/gi; //정규식 구문
    if (obj.val().match(re) !== null) {
        obj.val(jQuery.trim(obj.val().replace(re, "")));
    }
    return obj.val();
};
/**
 * 한글, 영문, 숫자만 체크
 * @param sValue
 * @returns {*}
 */
FILTER.checkRegularExpression = function (sValue) {
    var regexp = /[~!@\#$%<>^&*\()\-_=+\,.?;:'"`|{}\/\[\]\\\u3400-\u9FBF\u3040-\u309F]/gi;
    return sValue.match(regexp);
};
/**
 * 따옴표 체크
 * @param sValue
 * @returns {*}
 */
FILTER.checkDoubleQuote = function (sValue) {
    var regexp = /["]/gi;
    return sValue.match(regexp);
};

/**
 * 마이너스재고 수량 검색 위함 (맨앞만 마이너스 1번만 허용, 중간은 허용X, 숫자만 허용) (2017-02-02)
 * (Tab, Enter, Delete키 입력 가능하도록수정 (2013.01.30 wms04))
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkMinusAndNumber = function (chkName) {
    $(chkName).keydown(function (e) {

        var keyCode = e.which;
        var iQtyLength = $(chkName).val().length;
        var keyVal = $(this).val();

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46
            || keyCode == 13);

        // -부호일 경우 true
        isNumberPress = (keyCode == 189 || keyCode == 109) ? true : isNumberPress;
        if (iQtyLength >= 1 && (keyCode == 189 || keyCode == 109)) {
            isNumberPress = false;
        }

        // Delete && enter
        if (isNumberPress === false) {
            e.preventDefault();
        }

    }).keyup(function () {

            if ($(this).val().indexOf('-') < 0) {  //- 부호가 존재하지 않을 경우
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else if ($(this).val().indexOf('-') != 0) { // -부호가 맨앞에 위치하지 않을 경우
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else if ($(this).val().indexOf('-') == 0 && $(this).val().length > 1) {  // -부호가 맨앞일 경우 뒤에 특수부호 제거
                FILTER.chkMinusAndNumber.keyVal = $(this).val().replace(/[^0-9]/g, '');
                FILTER.chkMinusAndNumber.keyVal = ('-' + FILTER.chkMinusAndNumber.keyVal == '-0') ? 0 : '-' + FILTER.chkMinusAndNumber.keyVal;
                $(this).val(FILTER.chkMinusAndNumber.keyVal);
            }
        }
    ).blur(function () {
            if ($(this).val().indexOf('-') < 0) {  //- 부호가 존재하지 않을 경우
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else if ($(this).val().indexOf('-') !== 0) { // -부호가 맨앞에 위치하지 않을 경우
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            } else if ($(this).val().indexOf('-') == 0 && $(this).val().length > 1) {  // -부호가 맨앞일 경우 뒤에 특수부호 제거
                FILTER.chkMinusAndNumber.keyVal = $(this).val().replace(/[^0-9]/g, '');
                FILTER.chkMinusAndNumber.keyVal = ('-' + FILTER.chkMinusAndNumber.keyVal == '-0') ? 0 : '-' + FILTER.chkMinusAndNumber.keyVal;
                $(this).val(FILTER.chkMinusAndNumber.keyVal);
            }
        }
    );
};

/**
 * 숫자만 입력가능
 * (Tab, Enter, Delete키 입력 가능하도록수정 (2013.01.30 wms04))
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumber = function (chkName) {
    $(chkName).keydown(function (e) {

        var keyCode = e.which;

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46
            || keyCode == 13);
        // Delete && enter
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        }
    ).blur(function () {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        }
    );
};

FILTER.chkNumber2 = function (chkName) {
    $('body').delegate(chkName, 'keydown', function (e) {
        var keyCode = e.which;

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46
            || keyCode == 13);
        // Delete && enter
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).delegate(chkName, 'keyup', function (e) {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    }).delegate(chkName, 'blur', function (e) {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
};

/**
 * 숫자만 입력가능
 * (Tab, Enter, Delete키 입력 가능하도록수정 (2013.01.30 wms04))
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumber3 = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 13 // Enter
            || keyCode == 46); // Delete
        if (!isNumberPress) {
            e.preventDefault();
        }
    });
};

/**
 * 숫자만 입력가능  (첫자리 0입력 불가능)
 * (Tab, Enter, Delete키 입력 가능하도록수정 (2013.01.30 wms04))
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumber4 = function (chkName) {
    $(chkName).keydown(function (e) {

        var keyCode = e.which;
        var iQtyLength = $(chkName).val().length;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46
            || keyCode == 13);

        if (iQtyLength == 0 && keyCode == 48) {
            //맨앞자리 0입력 불가
            isNumberPress = false;
        }

        // Delete && enter
        if (isNumberPress === false) {
            e.preventDefault();
        }
    }).keyup(function () {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        }
    ).blur(function () {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        }
    );
};

FILTER.chkNumberExceptMinus = function (chkName) {
    $('body').delegate(chkName, 'keydown', function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 109
            || keyCode == 189
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46
            || keyCode == 13);
        // Delete && enter
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).delegate(chkName, 'keyup', function (e) {
        var myRegxp = /^([0-9]){0,10}$/;
        var input = $(this).val().replace(/[^-0-9]/g, '');
        if (myRegxp.test(input) == false) {
            if (input.indexOf("-") != -1) {
                $(this).val(input.substring(0, 11));
            } else {
                $(this).val(input.substring(0, 10));
            }
            return false;
        }
        $(this).val($(this).val().replace(/[^-0-9]/g, ''));
    }).delegate(chkName, 'blur', function (e) {
        $(this).val($(this).val().replace(/[^-0-9]/g, ''));
    });
};

/**
 * 숫자만 입력하능 + 복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberCtrlCV = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86);// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
};

/**
 * 숫자만 입력하능 + 복사 붙여넣기 + 좌우 방향키 허용
 * chkName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberCtrlCV2 = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86 // V
            || keyCode == 37 // 왼쪽 방향키
            || keyCode == 39  // 오른쪽 방향키
        );
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
};

/**
 * 숫자, -,  복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberHyphenCtrlCV = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 189
            || keyCode == 109
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86
            || keyCode == 37 // 왼쪽 방향키
            || keyCode == 39  // 오른쪽 방향키
        );// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        var value = $.trim($(this).val());
        //if (value == '') {
        //    $(this).val(0);
        //} else {
        $(this).val($(this).val().replace(/[^0-9\-]/g, ''));
        //}
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9\-]/g, ''));
    });
};

/**
 * 숫자, -,  복사 붙여넣기 허용, 동적
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberHyphenCtrlCV2 = function (chkName) {
    $('body').on('keydown', chkName, function (e) {
        var keyCode = e.which;

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 189 // - 중간
            || keyCode == 109 // - 우측
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86 // V
            || keyCode == 37 // 왼쪽 방향키
            || keyCode == 39  // 오른쪽 방향키
        );// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).on('keyup', chkName, function () {
        $(this).val($(this).val().replace(/[^0-9\-]/g, ''));
    }).on('blur', chkName, function () {
        $(this).val($(this).val().replace(/[^0-9\-]/g, ''));
    });
};

/**
 * 숫자, -, 알파벳대문자, 복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberHyphenAlphaCtrlCV = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || (keyCode >= 65 && keyCode <= 90) // 영문자
            || keyCode == 32    // space
            || keyCode == 189
            || keyCode == 109
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86);// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9A-Z\-\s]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9A-Z\-\s]/g, ''));
    });
};

/**
 * 숫자, -, 알파벳대소문자, 복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberHyphenAlphaCtrlCV2 = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || (keyCode >= 65 && keyCode <= 90) // 영문자
            || keyCode == 32    // space
            || keyCode == 189
            || keyCode == 109
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86);// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9A-Za-z\-\s]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9A-Za-z\-\s]/g, ''));
    });
};

/**
 * 숫자, 알파벳대소문자, 복사 붙여넣기 허용 (하이픈불가)
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberAlphaCtrlCV3 = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || (keyCode >= 65 && keyCode <= 90) // 영문자
            || keyCode == 32    // space
            //|| keyCode == 189 //-
            || keyCode == 109
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86);// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9A-Za-z\-\s]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9A-Za-z\-\s]/g, ''));
    });
};

/**
 * 숫자, -, +, (, )복사 붙여넣기 허용
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkNumberHyphenPlusCtrlCV = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 189
            || keyCode == 109
            || keyCode == 187
            || keyCode == 107
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86);// V
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9\-+()]/g, ''));
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9\-+()]/g, ''));
    });
};

/**
 * 숫자 + . 소수점 = 최대 11자리 (숫자는 최대 10개로 구성)
 * 중량 길이 제한 (SMARTWMS-15636)
 * @param chkName
 */
FILTER.chkDigitCount = function (chkName) {
    FILTER.chkDynamicDigitCount(chkName); // 동적으로 생성된 DOM 요소도 처리
};

FILTER.chkDynamicDigitCount = function (chkName) {
    $(document).on('keydown', chkName, function (e) {
        // 소수점이 포함된 경우 maxlength 11로 변경.
        if ($(this).val().indexOf('.') !== -1) {
            $(this).attr('maxlength', 11);
        }

        var keyCode = e.which;
        // 입력 '전' 값이 10자리 && 현재 입력된 값이 '점' 이면 maxlength 11로 변경.
        if ($(this).val().length === 10 && (keyCode === 110 || keyCode === 190)) {
            $(this).attr('maxlength', 11);
        }
    }).on('keyup', chkName, function () {
        // 소수점이 미포함된 경우 maxlength 10(초기값)으로 변경.
        if ($(this).val().indexOf('.') === -1) {
            $(this).attr('maxlength', 10);
        }
    });
};

/**
 * 숫자 + . 소수점
 * clickName : 체크 태그의 id 또는 class
 * digit : 자릿수
 */
/*
FILTER.chkDecimalCtrlCV = function (chkName, digit, bPrice) {

    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        var isChar = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 37 // ←방향키
            || keyCode == 39 // →방향키
            || keyCode == 46 // Delete
            || keyCode == 190 // 키보드 마침표.
            || keyCode == 110 // 키패드 마침표(.)
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86); // V

        if (!isChar) {
            e.preventDefault();
        }

    }).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        var val = $(this).val().split('.');
        if (val.length > 1) {
            $(this).val($(this).val().substring(0, $(this).val().indexOf('.') + 1 + digit));
        }

        // 가격 포맷
        if (bPrice === true) {
            var val = $(this).val().split('.');
            var sPrice = FILTER.replaceToPrice(val[0]);

            if (val.length > 1) {
                sPrice += '.' + val[1];
            }
            $(this).val(sPrice);
        }
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        var val = $(this).val().split('.');
        if (val.length > 1) {
            $(this).val($(this).val().substring(0, $(this).val().indexOf('.') + 1 + digit));
        }

        // 가격 포맷
        if (bPrice === true) {
            var val = $(this).val().split('.');
            var sPrice = FILTER.replaceToPrice(val[0]);

            if (val.length > 1) {
                sPrice += '.' + val[1];
            }
            $(this).val(sPrice);
        }
    }).focus(function () {
        if (bPrice === true) {
            $(this).val($(this).val().replace(/\,/g, ''));
        }
    });

    return true;
};
*/

FILTER.chkDecimalCtrlCV = function (chkName, digit, bPrice) {
    FILTER.chkDynamicDecimalCtrlCV(chkName, digit, bPrice); // 동적으로 생성된 DOM 요소도 처리
};

/**
 * 숫자 + . 소수점 (동적으로 생성되는 DOM 요소는 chkDecimalCtrlCV로 처리할수 없어서 생성.)
 * 중량 길이 제한 (SMARTWMS-15636)
 * @param chkName
 * @param digit
 * @param bPrice
 */
FILTER.chkDynamicDecimalCtrlCV = function (chkName, digit, bPrice) {
    $(document).on('keydown', chkName, function (e) {
        var keyCode = e.which;
        var isChar = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 37 // ←방향키
            || keyCode == 39 // →방향키
            || keyCode == 46 // Delete
            || keyCode == 190 // 키보드 마침표.
            || keyCode == 110 // 키패드 마침표(.)
            || keyCode == 17 // CTRL
            || keyCode == 67 // C
            || keyCode == 86); // V

        if (!isChar) {
            e.preventDefault();
        }
    }).on('keyup', chkName, function () {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        var val = $(this).val().split('.');
        if (val.length > 1) {
            $(this).val($(this).val().substring(0, $(this).val().indexOf('.') + 1 + digit));
        }
    }).on('blur', chkName, function () {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        var val = $(this).val().split('.');
        if (val.length > 1) {
            $(this).val($(this).val().substring(0, $(this).val().indexOf('.') + 1 + digit));
        }

        // 가격 포맷
        if (bPrice === true) {
            var val = $(this).val().split('.');
            var sPrice = FILTER.replaceToPrice(val[0]);

            if (val.length > 1) {
                sPrice += '.' + val[1];
            }
            $(this).val(sPrice);
        }
    }).on('focus', chkName, function () {
        if (bPrice === true) {
            $(this).val($(this).val().replace(/\,/g, ''));
        }
    })
};

/**
 * 가격입력인풋
 * @param string chkName 체크 태그의 id 또는 class
 * @param boolean bIsTabKeyMove 탭키 이동지원 여부 (인풋이 한개 이상일경우 true)
 */
FILTER.chkPrice = function (chkName, bIsTabKeyMove) {
    if (bIsTabKeyMove) {
        $(chkName).each(function (index) {
            $(this).keydown(function (e) {
                // SHIFT + TAB
                if (e.which === 9 && e.shiftKey) {
                    if (index === 0) {
                        return false;
                    }
                    $(this).val(FILTER.replaceToPrice($(this).val()));
                    $(chkName).eq(index - 1).trigger('focus');
                    return false;
                    // TAB
                } else if (e.which === 9) {
                    $(this).val(FILTER.replaceToPrice($(this).val()));
                    $(chkName).eq(index + 1).trigger('focus');
                    return false;
                }
            }).focus(function () {
                $(this).val($(this).val().replace(/\,/g, ''));
            }).blur(function () {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
                $(this).val(FILTER.replaceToPrice($(this).val()));
            }).keyup(function () {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
            });
        });
    } else {
        $(chkName).focus(function () {
            $(this).val($(this).val().replace(/\,/g, ''));
        }).blur(function () {
            $(this).val(FILTER.replaceToPrice($(this).val()));
        });
    }
};

/**
 * 숫자를 가격형식에 맞게 변환
 */
FILTER.replaceToPrice = function (iNumber) {
    iNumber = iNumber + '';
    var pattern = /(-?[0-9]+)([0-9]{3})/;
    while (pattern.test(iNumber)) {
        iNumber = iNumber.replace(pattern, "$1,$2");
    }
    return iNumber;
};
/**
 * 영문, 숫자만 입력하도록 체크
 * chkName : 체크 태그의 id 또는 class
 */
FILTER.chkId = function (chkName) {

    $(chkName).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
    });

    $(chkName).blur(function () {
        $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
    });
};
/**
 * 이메일 아이디 체크
 * 차송이님 요청(메일에 -,. 이 들어가는 경우가 있음)
 */
FILTER.chkEmailId = function (chkName) {

    $(chkName).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9a-zA-Z\-\.\_]/g, ''));
    });

    $(chkName).blur(function () {
        $(this).val($(this).val().replace(/[^0-9a-zA-Z\-\.\_]/g, ''));
    });
};

FILTER.chkEMail = function (chkName) {

    $(chkName).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9a-zA-Z\.]/g, ''));
    });

    $(chkName).blur(function () {
        $(this).val($(this).val().replace(/[^0-9a-zA-Z\.]/g, ''));
    });
};

/**
 * 숫자 + . 만 입력가능 (ip)
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkIp = function (chkName) {

    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        var isIpChar = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 37 // ←방향키
            || keyCode == 39 // →방향키
            || keyCode == 46 // Delete
            || keyCode == 190 // 키보드 마침표.
            || keyCode == 110); // 키패드 마침표(.)
        if (!isIpChar) {
            e.preventDefault();
            return false;
        }
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    });
};

/**
 * 숫자 (+), (,), (*), (.) 만 입력가능 (ip_list)
 * (예:61.109.234.123,61.109.123.*)
 * clickName : 체크 태그의 id 또는 class
 */
FILTER.chkIp2 = function (chkName) {
    $(chkName).keydown(function (e) {
        var keyCode = e.which;
        var isIpChar = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 37 // ←방향키
            || keyCode == 39 // →방향키
            || keyCode == 46 // Delete
            || keyCode == 188 // 키보드 ,
            || (e.shiftKey === true && keyCode == 187) // +
            || keyCode == 190 // 키보드 마침표.
            || keyCode == 110
            || keyCode == 17 // CTRL
            || (e.ctrlKey === true && keyCode == 65) // ctrl + A
            || (e.ctrlKey === true && keyCode == 67) // ctrl + C
            || (e.ctrlKey === true && keyCode == 86) // ctrl + V
        ); // 키패드 마침표(.)

        if (!isIpChar) {
            e.preventDefault();
            return false;
        }
    }).blur(function () {
        $(this).val($(this).val().replace(/[^0-9\.\,\+\*]/g, ''));
    });
};

FILTER.setNumberFormat = function (num) {
    // int -> string
    var str = num + '';
    var Re = /[^0-9]/g;
    var ReN = /(-?[0-9]+)([0-9]{3})/;
    str = str.replace(Re, '');

    while (ReN.test(str)) {
        str = str.replace(ReN, '$1,$2');
    }

    return str;
};

FILTER.setDecimalNumberFormat = function (num, digit) {
    // decimal -> string
    var str = num + '';

    var val = str.split('.');
    if (val.length > 1) {
        str = str.substring(0, str.indexOf('.') + 1 + digit);
    }

    var Re = /[^0-9.]/g;
    var ReN = /(-?[0-9]+)([0-9]{3})/;
    str = str.replace(Re, '');

    while (ReN.test(str)) {
        str = str.replace(ReN, '$1,$2');
    }

    return str;
};

FILTER.removeComma = function (num) {
    return (num.replace(/\,/g, ""));
};

FILTER.chkTextareaByte = function (sTextareaId, sByteDisplyId, maxByte) {
    var str = $(sTextareaId).val();
    var str_len = str.length;

    var rbyte = 0;
    var rlen = 0;
    var one_char = "";
    var str2 = "";

    for (var i = 0; i < str_len; i++) {
        one_char = str.charAt(i);

        if (escape(one_char).length > 4) {
            rbyte += 2;
        } else {
            rbyte++;
        }

        if (rbyte <= maxByte) {
            rlen = i + 1;
        }
    }

    if (rbyte > maxByte) {
        str2 = str.substr(0, rlen);
        $(sTextareaId).val(str2);
        FILTER.chkTextareaByte(sTextareaId, sByteDisplyId, maxByte);
    } else {
        $(sByteDisplyId).html(rbyte);
    }
};
/**
 * 문자중 백슬래쉬 전각문자'￦'로 치환
 */
FILTER.chkReplaceWon = function (sId) {
    var reg = /[\\]/gi;
    $(sId).keyup(function () {
        var $this = $(this);
        if ($this.val().match(reg) !== null) {
            $this.val($this.val().replace(reg, '￦'));
        }
    });

    $(sId).blur(function () {
        var $this = $(this);
        if ($this.val().match(reg) !== null) {
            $this.val($this.val().replace(reg, '￦'));
        }
    });
}

/**
 *  폰넘버/핸드폰/  관련 처리
 * @param num
 * @param type
 * @returns {string}
 */
FILTER.phoneFomatter = function (num, type) {
    var formatNum = '';
    formatNum = num.replace(/(^02.{0}|^0130.{0}|^0303.{0}|^01.{1}|^070|^050.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
    //    /^(02|0[0-9]{2,3})[1-9]{1}[0-9]{2,3}[0-9]{4}$/

    return formatNum;
}

/**
 * submit 전 체크
 * @param sPhoneNum
 * @returns {boolean}
 */
FILTER.phoneFomattercheck = function (sPhoneNum) {
    var bTrue = false;
    var ahoneNum = sPhoneNum.split('-')

    if (ahoneNum.length === 3) {
        bTrue = true;
    }

    return bTrue;
}

/**
 *  폰넘버/핸드폰/  관련 처리 삭제 처리
 * @param num
 * @param type
 * @returns {string}
 */
FILTER.deletephoneFomatter = function (value, type) {
    var value = value.replace(/\-/g, '');
    return value;
}

/**
 *  앞자리
 * @param num
 * @param type
 * @returns {string}
 */
FILTER.checkPhoneFirstValue = function (value) {

    var aCheck = [
        '010',
        '011',
        '016',
        '017',
        '018',
        '019',
        '02',
        '031',
        '032',
        '033',
        '041',
        '042',
        '043',
        '044',
        '051',
        '052',
        '053',
        '054',
        '055',
        '061',
        '062',
        '063',
        '064',
        '050',
        '070',
        '080',
        '0130',
        '0303',
        '0501',
        '0502',
        '0503',
        '0504',
        '0505',
        '0506',
        '0507',
        '0508',
        '0509'
    ];

    if ($.inArray(value, aCheck) !== -1) {
        return true
    } else {
        return false;
    }
}

FILTER.checkCellPhoneFirstValue = function (value) {

    var aCheck = [
        '070',
        '010',
        '011',
        '016',
        '017',
        '018',
        '019',
        '0506'
    ];

    if ($.inArray(value, aCheck) !== -1) {
        return true
    } else {
        return false;
    }
}

FILTER.phoneFomattCheck = function (numVal) {
    var formatNum = '';
    numVal = numVal.replace(/\-/g, '');

    var reg = /^(02|0[0-9]{2,3})[1-9]{1}[0-9]{2,3}[0-9]{4}$/
    //    reg.test(numVal)
    if (reg.test(numVal)) {
        return true
    } else {
        return false;
    }
}

FILTER.mobileFomattCheck = function (numVal) {
    numVal = numVal.replace(/\-/g, '');
    var reg = /^(01[016789])|(070)[1-9]{1}[0-9]{2,3}[0-9]{4}$/;

    if (reg.test(numVal)) {
        return true
    } else {
        return false;
    }
}

FILTER.checkMaxLength = function (sSelector, iMaxLength) {
    var iValue = $(sSelector).val();
    var iLimit = 0;
    var iCount = 1;
    for (var i = 0; i < iMaxLength; i++) {
        iLimit += iCount * 9;
        iCount *= 10;
    }

    if (iValue >= iLimit) {
        return false;
    } else {
        return true;
    }
}

/**
 * 과세비율
 * 기존의 chkNumber 함수에서 .(소수점) 변환 하지 않도록 수정
 * @param chkName
 */
FILTER.chkAccountingRate = function (chkName) {
    $(chkName).keydown(function (e) {

        var keyCode = e.which;

        // Tab, Enter, Delete키 포함
        var isNumberPress = ((keyCode >= 48 && keyCode <= 57) // 숫자키
            || (keyCode >= 96 && keyCode <= 105) // 키패드
            || keyCode == 8 // BackSpace
            || keyCode == 9 // Tab
            || keyCode == 46 // Delete
            || keyCode == 13); // enter
        if (!isNumberPress) {
            e.preventDefault();
        }
    }).keyup(function () {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        }
    ).blur(function () {
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        }
    );
};

FILTER.checkDomesticNumberFormat = function (sNumber, chkName) {
    var aNumber = sNumber.split('-')
    if (FILTER.checkPhoneFirstValue(aNumber[0]) === false) {
        alert(chkName + ' 항목에 입력된 값은 유효한 국번이 아닙니다.');
        return false
    }

    var iNumberLength = sNumber.replace(/\-/g, '').length;

    if (iNumberLength < 9) {
        alert(chkName + ' 항목에 입력된 값의 자리수가 유효하지 않습니다.');
        return false
    }

    if (iNumberLength > 12) {
        alert(chkName + ' 항목에 입력된 값의 자리수가 유효하지 않습니다.');
        return false
    }

    if (iNumberLength == 9 && aNumber[0] != '02') {
        alert(chkName + ' 항목에 입력된 값의 자리수가 유효하지 않습니다.');
        return false
    }

    if (aNumber[1].length > 4 || aNumber[1].length < 3) {
        alert(chkName + ' 항목에 입력된 값의 자리수가 유효하지 않습니다.');
        return false
    }

    if (aNumber[2].length != 4) {
        alert(chkName + ' 항목에 입력된 값의 자리수가 유효하지 않습니다.');
        return false
    }

    return true;
}

FILTER.domesticNumberFormat = function (chkName) {
    var sFormatNumber = '';
    var sCheckVal = chkName.val();

    if (sCheckVal === '') {
        return;
    }

    if (sCheckVal.indexOf('-') === -1 && sCheckVal.length > 0) {
        var sNumber = sCheckVal;
    } else {
        var sNumber = sCheckVal.replace(/\-/g, '');
    }

    sFormatNumber = sNumber.replace(/(^02.{0}|^0130.{0}|^0303.{0}|^01.{1}|^070|^050.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');

    if (FILTER.checkDomesticNumberFormat(sFormatNumber, $(chkName).attr('title')) === false) {
        chkName.focus();
        return;
    } else {
        return sFormatNumber;
    }
}

/**
 * SMARTWMS-14780 : 텍스트 글자수 Max 체크
 *
 * @param chkName : Element Name
 * @param iMaxLength : 최대 글자수
 *
 * @returns {boolean}
 */
FILTER.checkTextMaxLength = function (chkName, iMaxLength) {
    var text = $(chkName).val();
    var textlength = text.length;

    if (textlength > iMaxLength) {
        return false;
    }

    return true;
}

/**
 * SMARTWMS-14780 : 정규표현식 매칭 체크
 *
 * @param chkName
 * @param regExp
 * @returns {boolean}
 */
FILTER.chkTextRegExp = function (chkName, regExp) {

    var text = $(chkName).val();
    var pattern = new RegExp(regExp);

    // 정규표현식과 일치할 경우 true 반환.
    if (text.match(pattern)) {
        return true;
    }

    return false;

};

/**
 * SMARTWMS-15926 : '(', ')', '[', ']'외의 특수문자는 입력 제한
 * chkName : 체크 태그의 id 또는 class
 */
FILTER.chkBankAccountOwner = function (chkName) {

    $(chkName).keyup(function () {
        $(this).val($(this).val().replace(/[^a-zA-Z가-힣ㄱ-ㅎ\d\s\(\)\[\]]/g, ''));
    });

    $(chkName).blur(function () {
        $(this).val($(this).val().replace(/[^a-zA-Z가-힣ㄱ-ㅎ\d\s\(\)\[\]]/g, ''));
    });
};

FILTER.chkTextByte = function (sText, maxByte) {
    var str = sText;
    var str_len = str.length;

    var rbyte = 0;
    var rlen = 0;
    var one_char = "";

    for (var i = 0; i < str_len; i++) {
        one_char = str.charAt(i);

        if (escape(one_char).length > 4) {
            rbyte += 3; // utf-8
        } else {
            rbyte++;
        }

        if (rbyte <= maxByte) {
            rlen = i + 1;
        }
    }

    if (rbyte > maxByte) {
        return false;
    }

    return true;
};

/**
 * 가격입력인풋
 * @param string chkName 체크 태그의 id 또는 class
 */
FILTER.chkPriceDelegate = function (parentName, chkName) {
    $(parentName).delegate(chkName, 'focus', function () {
        if (parseInt($(this).val(), 10) !== 0) {
            $(this).val($(this).val().replace(/,/gi, ''));
        }
        $(this).select();
    }).delegate(chkName, 'blur', function () {
        $(this).val(FILTER.setNumberSignFormat($(this).val()));
    })
};

/**
 * 배열 중복 제거 함수
 * @returns {*}
 */
FILTER.removeDuplicatedArrayElement = function (aDuplicatedArr) {
    return aDuplicatedArr.reduce(function (aTempArr, sValue) {
        if (aTempArr.indexOf(sValue) < 0) {
            aTempArr.push(sValue);
        }
        return aTempArr;
    }, []);
};

FILTER.setNumberSignFormat = function (num) {
    if (isNaN(num)) {
        num = '0';
    }

    var sSign = '';
    if (num == '' || num == 'NaN') {
        num = '0';
    }

    if (num < 0) {
        sSign = '-';
    }
    // int -> string
    var str = num + '';
    var Re = /[^0-9]/g;
    var ReN = /(-?[0-9]+)([0-9]{3})/;
    str = str.replace(Re, '');
    str = parseInt(str, 10) + '';
    while (ReN.test(str)) {
        str = str.replace(ReN, '$1,$2');
    }

    return sSign + str;
}

/**
 * 예외 특수기호) 쉼표( , ), 점( . )
 * @param selector
 */
FILTER.removeSpecialType = function (selector) {
    var reg = /[:\/~\\!@#$%^&*()_=+;'\{\}<>?"|\[\]]+/g;
    var sVal = selector.val();
    //유효성처리
    if (sVal.match(reg) !== null) {
        selector.val(sVal.replace(reg, ''));
    }

    // 유니코드로 계산된 \를 찾아서 치환
    var backSlash = String.fromCharCode(65510); // UNICODE 65510 = \
    var bsReg = new RegExp(backSlash, "gi");    // back slash 제거용
    if (sVal.indexOf(backSlash) !== -1) {
        selector.val(sVal.replace(bsReg, ''));
    }
};

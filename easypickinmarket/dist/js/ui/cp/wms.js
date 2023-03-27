var WMS = WMS || {};

/**
 * jQuery html method 오버라이드
 * @param target
 * @param data
 */
jQuery.fn.originHtml = jQuery.fn.html;
jQuery.fn.html = function (data) {
    var agent = navigator.userAgent.toLowerCase();

    if (agent.indexOf('edge') != -1) {
        try {
            if (opener && $(this, opener)[0] === this[0]) {
                return opener.WMS.edgeBrowserInnerHtml(this, data);
            }
        } catch (e) {
            return WMS.edgeBrowserInnerHtml(this, data);
        }
    }
    if (data != undefined) {
        return $(this).originHtml(data);
    } else {
        return $(this).originHtml();
    }
}

/**
 * [위 오버라이드 함수와 쌍]
 * 브라우저 edge에서 innerHtml n개의 DOM을 못하기때문에 부모에서 데이터를 innerHtml 한다.
 * @param target
 * @param data
 */
WMS.edgeBrowserInnerHtml = function (target, data) {
    if (data != undefined) {
        return $(target).originHtml(data);
    } else {
        return $(target).originHtml();
    }
}

/**
 * 팝업창 오픈
 * @param  string 링크
 * @param   string 팝업인스턴스명
 * @width   int 팝업의 폭 (px)
 * @height  int 팝업의 높이 (px)
 * @return  instance
 */
WMS.popup = function (src, name, width, height) {
    let left = Math.round((screen.width / 2) - (width / 2));
    let top = Math.round((screen.height / 2) - (height / 2));
    let child = window.open(src, name, "width=" + width + ",height=" + height + ",left=" + left + ", top=" + top + ",resizable=yes,menubar=no,status=no,scrollbars=yes");
    child.focus();
    return child;
};

/**
 * 팝업창 오픈 클릭 이벤트 리스너 등록
 * @param selector
 * @param src
 * @param name
 * @param width
 * @param height
 */
WMS.openPopupEvent = function (selector, src, name, width, height) {
    $(selector).click(function (e) {
        e.preventDefault();
        WMS.popup(src, name, width, height);
    });
}

/**
 * 카페24 쇼핑몰 팝업창 오픈
 * @param  ec_mall_id 카페24 쇼핑몰 ID
 * @param  string 링크
 * @param   string 팝업인스턴스명
 * @width   int 팝업의 폭 (px)
 * @height  int 팝업의 높이 (px)
 * @return  instance
 */
WMS.ecPopup = function (ec_mall_id, src, name, width, height) {
    var left = (screen.width - width) / 2; //왼쪽 좌표
    var top = (screen.height - height) / 2; //왼쪽 좌표

    var sPopupSrc = '/autologin/popup?ec_mall_id=' + ec_mall_id + '&url=' + encodeURIComponent(src);

    return window.open(sPopupSrc, name + '-' + WMS.HASH.hashCode(sPopupSrc), "width=" + width + ",height=" + height + ",left=" + left + ", top=" + top + ",resizable=yes,menubar=no,status=no,scrollbars=yes").focus();
};

/**
 * 카페24 쇼핑몰 - 상품 상세 팝업
 * @param ec_mall_id
 * @param product_no
 * @returns {instance}
 */
WMS.ecProductPopup = function (ec_mall_id, product_no) {
    product_no = product_no.split(',');
    var sUrl = '/disp/admin/shop1/product/ProductRegister?product_no=' + product_no[0];
    return WMS.ecPopup(ec_mall_id, sUrl, 'WinEcProduct', 1070, 600);
};

/**
 * 카페24 쇼핑몰 - 주문 상세 팝업
 * @param ec_mall_id
 * @param ord_id
 * @returns {instance}
 */
WMS.ecOrderDetailPopup = function (ec_mall_id, ord_id, shop_no) {
    var iShopNo = shop_no == null ? 1 : shop_no;    //기본 몰 정보
    var sUrl = '/admin/php/shop' + iShopNo + '/s_new/order_detail.php?order_id=' + ord_id;
    return WMS.ecPopup(ec_mall_id, sUrl, 'WinECOrderDetail', 1240, 860);
};

/**
 * 카페24 쇼핑몰 - 주문 취소 팝업
 * @param ec_mall_id
 * @param ord_id
 * @returns {instance}
 */
WMS.ecOrderCancelPopup = function (ec_mall_id, ord_id, shop_no) {
    var iShopNo = shop_no == null ? 1 : shop_no;    //기본 몰 정보
    var sUrl = '/admin/php/shop' + iShopNo + '/s_new/order_cancel_list.php?order_id=' + ord_id;
    return WMS.ecPopup(ec_mall_id, sUrl, 'WinECOrderCancel', 968, 700);
};

/**
 * 카페24 쇼핑몰 - 주문 반품 팝업
 * @param ec_mall_id
 * @param ord_id
 * @returns {instance}
 */
WMS.ecOrderBackPopup = function (ec_mall_id, ord_id, shop_no) {
    var iShopNo = shop_no == null ? 1 : shop_no;    //기본 몰 정보
    var sUrl = '/admin/php/shop' + iShopNo + '/s_new/order_back_list.php?order_id=' + ord_id;
    return WMS.ecPopup(ec_mall_id, sUrl, 'WinECOrderBack', 968, 700);
};

/**
 * 카페24 쇼핑몰 - 주문 교환 팝업
 * @param ec_mall_id
 * @param ord_id
 * @returns {instance}
 */
WMS.ecOrderExchangePopup = function (ec_mall_id, ord_id, shop_no) {
    var iShopNo = shop_no == null ? 1 : shop_no;    //기본 몰 정보
    var sUrl = '/admin/php/shop' + iShopNo + '/s_new/order_exchange_list.php?order_id=' + ord_id;
    return WMS.ecPopup(ec_mall_id, sUrl, 'WinECOrderExchange', 968, 700);
};

/**
 * 카페24 쇼핑몰 - 이메일 팝업
 * @param ec_mall_id
 * @param ord_id
 * @returns {instance}
 */
WMS.ecSendMailPopup = function (ec_mall_id, buyer_name, mail) {
    var sUrl = '/admin/php/c/form_mail.php?to_name=' + buyer_name + '&to_email=' + mail;
    return WMS.ecPopup(ec_mall_id, sUrl, 'WinECSendMail', 560, 420);
};

/**
 * submit을 보낼 경우
 * @node tag 클릭 이벤트 할 태그 id 또는 class
 * @form  tag form의 id 또는 class
 */
WMS.submit = function (node, form) {
    $(node).click(function () {
        $(form).submit();
        return false;
    });
};

/**
 * 주문상세 팝업등 복수의 창을 띄우기 위한 name 처리에 필요
 * @type {{hashCode: WMS.HASH.hashCode}}
 */
WMS.HASH = {
    hashCode: function (str) {
        var hash = 0;
        var sStr = String(str);
        if (sStr.length == 0) {
            return hash;
        }
        for (i = 0; i < sStr.length; i++) {
            char = sStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        if (hash < 0) {
            hash = hash * (-1);
        }
        return 'H' + hash;
    }
};

/**
 * WMS AJAX 표준 함수
 * @param options.url       // Login URL(login/action/logined)
 * @param options.data      // Ajax Option ({type:'GET', data:{login_id:'devsdkwms1001'}})
 * @param options.success   // success callback function (function (data, iStatusCode, sMessage) {})
 * @param options.error     // error callback function (function (data, iStatusCode, sMessage) {})
 * @return instance
 */
WMS.ajax = function (options) {

    $options = $.extend({
            type      : 'post',
            async     : true,
            dataType  : 'json',
            headers   : {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            beforeSend: function () {
                if (options.loading !== undefined) {
                    if (options.loading === true) {
                        WMS.showLoading();
                    } else if (typeof options.loading == 'string') {
                        WMS.showLoading(options.loading);
                    }
                    delete options.loading;
                }
            },
            /**
             * 성공시 메소드 override
             * @param responsef
             */
            success   : function (response) {
                console.log(response);
            },
            /**
             * 실패시 메소드 override
             * @param response
             */
            error     : function (response) {
                console.log('error ::', response);
                try {
                    if (response.status === 900) {
                        location.href = '/global/front/session';
                        return;
                    }
                    var result = jQuery.parseJSON(response['responseText']);
                    alert(result.meta.message);
                } catch (e) {
                    console.warn('Undefined variable : response.responseJSON.meta.message');
                }
            },
            /**
             * 완료시 메소드
             * @param response
             */
            complete  : function (response) {
                WMS.closeLoading();
            }
        }, options
    );
    return $.ajax($options);
};

/**
 * input name 기반으로 비동기처리용 파라미터 오브젝트 생성
 *
 * @param searchDataKey
 */
WMS.createSearchData = function (searchDataKey) {
    let searchData = {};
    if (WMS.isEmpty(searchDataKey) !== true) {
        for (var key = 0; key < searchDataKey.length; key++) {
            if ($('[name="' + searchDataKey[key] + '"]').prop('tagName') === 'SELECT') {

                if (searchDataKey[key].indexOf('[]') > -1) {
                    var sKey = searchDataKey[key].split('[]')[0];
                    searchData[sKey] = $('select[name="' + searchDataKey[key] + '"]').val();
                } else {
                    searchData[searchDataKey[key]] = $('select[name="' + searchDataKey[key] + '"]').val();
                }
            } else {
                switch ($('[name="' + searchDataKey[key] + '"]').attr("type")) {
                    case "text":
                    case "hidden":
                        searchData[searchDataKey[key]] = $('input[name="' + searchDataKey[key] + '"]').val();
                        break;
                    case "radio":
                    case "checkbox":
                        if (searchDataKey[key].indexOf('[]') > -1) {
                            var sKey = searchDataKey[key].split('[]')[0];

                            searchData[sKey] = [];
                            $('input[name="' + searchDataKey[key] + '"]:checked').each(function () {
                                searchData[sKey].push($(this).val());
                            });

                        } else {
                            searchData[searchDataKey[key]] = $('input[name="' + searchDataKey[key] + '"]:checked').val();
                        }
                        break;
                    default :
                        if (searchDataKey[key].indexOf('[]') > -1) {
                            var sKey = searchDataKey[key].split('[]')[0];
                            searchData[sKey] = [];
                            searchData[sKey].push($('select[name="' + searchDataKey[key] + '"]').val());
                        }
                        break;
                }
            }
        }
    }

    return searchData;
}

/**
 * 이미지 오픈
 */
WMS.imgOpen = function (className, titleText, errText) {
    $("body").delegate(className, "click", function () {

            var img = $(this).children("img").attr("src");
            var noneImg1 = img.indexOf("img_38x38.jpg");
            var noneImg2 = img.indexOf("img_38x38.gif");

            if (noneImg1 > 0 || noneImg2 > 0) {
                return alert(errText);
            }

            var width = 500;
            var height = 420;
            var left = (screen.width - width) / 2; //왼쪽 좌표
            var top = (screen.height - height) / 2; //왼쪽 좌표

            var printWindow = window.open('', 'IMG', 'height=' + height + ', width=' + width + ', left=' + left + ', top=' + top);
            printWindow.document.write('<html><head><title>' + titleText + '</title>');
            printWindow.document.write('</head><body ><img width="480," height="400" src=\'');
            printWindow.document.write(img);
            printWindow.document.write('\' /></body></html>');
            printWindow.document.close();

        }
    );
};

/**
 * WMS Upload 표준 함수
 * @param options
 * @returns {jQuery}
 */
WMS.upload = function (options, selector) {

    var options = $.extend({
            headers   : {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url       : '/util/file/action/uploaded',
            dragdrop  : {
                enterclass: "dragin",
                postname  : "file[]"
            }, success: function (json, targetObj) {
                console.log("json", json);
                FileUploaderLite.settingResult(json, targetObj);
            }, error  : function (response) {
                console.log('error ::', response);
                var oResponse = jQuery.parseJSON(response);
                alert(oResponse.meta.message);
            }
        }, options
    );

    if (typeof selector === "object") {
        return $(selector).each(function () {
            $(this).fileupload(options)
        });
    } else {
        return $('.file_upload_component').each(function () {
            $(this).fileupload(options)
        });
    }
};

/**
 * URL에 데이터를 파싱하여 줍니다.
 * @param url
 * @returns {{source: *, protocol, host: string, port: (*|Function|string), query: (ui.autocomplete.search|*|Document.search|null|string), params, hash, path: string}}
 */
WMS.parseUrl = function (url) {
    var aNode = document.createElement('a');
    aNode.href = url;

    function _parse(sUrl) {
        var oRet = {}, aSeg = sUrl.substr(1, sUrl.length).split('&'), iLen = aSeg.length, i = 0, aSplit;
        for (; i < iLen; i++) {
            if (!aSeg[i]) {
                continue;
            }
            aSplit = aSeg[i].split('=');
            var key = decodeURIComponent(aSplit[0]);
            var value = aSplit[1];
            if (!!value) {
                value = value.replace(/\+/g, '%20');
            }
            value = decodeURIComponent(value);
            if (oRet[key] == undefined) {
                oRet[key] = value;
            } else {
                if (typeof oRet[key] == 'object') {
                    oRet[key].push(value);
                } else {
                    oRet[key] = [oRet[key], value];
                }
            }
        }
        return oRet;
    }

    return {
        source  : url,  //전체 경로
        protocol: aNode.protocol.replace(':', ''), //프로토콜
        host    : aNode.hostname,                     //호스트
        port    : aNode.port,                         //포트
        query   : aNode.search,                      //서치쿼리
        params  : _parse(aNode.search),
        hash    : aNode.hash.replace('#', ''), //# hash,
        hashs   : _parse(aNode.hash),
        path    : aNode.pathname.replace(/^([^/])/, '/$1')  //path
    };
};

WMS.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

WMS.showLoading = function (message) {
    let $findTarget = $('#wmsLoadingDialog');

    if (!!message) {
        $findTarget.find('[name=loadingMessage]').html(message);
    } else {
        $findTarget.find('[name=loadingMessage]').html(__('처리중입니다. 잠시만 기다려 주세요.'));
    }
    //call dimmed layer position function
    dimmedLayerPosition($findTarget);
    $findTarget.parent().append('<div id="dimmed_' + $findTarget.attr('id') + '" class="dimmed"></div>');

    if ($('.dimmed').length > 1 || $('#popup').length > 0 || $('.mLayer').length > 0) {
        $('#footer').css({'zIndex': $findTarget.css('z-index') - 1})
        $('.dimmed').addClass('hide');
        var propZIndex = 110 + $('.dimmed').length;
        $($findTarget).css({'zIndex': propZIndex + 5});
        $('#dimmed_' + $findTarget.attr('id')).css({'zIndex': propZIndex}).removeClass('hide');
    }

    function dimmedLayerPosition(target) {
        if (!target.attr('fixed')) {
            var findLayer = target,
                propWinWidth = $(window).width(),
                propWinHeight = $(window).height(),
                propWidth = findLayer.outerWidth(),
                propHeight = findLayer.outerHeight(),
                propWinScroll = $(window).scrollTop();

            if (propWinWidth < propWidth) {
                findLayer.css({'left': 0, 'marginLeft': 0});
            } else {
                var propLeft = propWidth / 2;
                findLayer.css({'left': '50%', 'marginLeft': '-' + propLeft + 'px'});
            }
            if (propWinHeight < propHeight) {
                window.scrollTo(0, 0);
                findLayer.css({'top': 0});
            } else {
                var propTop = (propWinHeight / 2) - (propHeight / 2) + propWinScroll;
                findLayer.css({'top': propTop});
            }
            findLayer.show();
        }
    }
}

WMS.closeLoading = function () {
    $('#wmsLoadingDialog').hide().siblings('.dimmed').remove();
}

//IE Ctrl + A 하면 전체 BODY 영역이 블록 처리되는 것을 방지
WMS.setMultipleSelectAll = function () {
    //IE 브라우저 컨트롤 이슈 오버라이드
    $('body').keydown(function (e) {
        if (e.ctrlKey) {
            var UPPERCASE_A = 65;
            var LOWERCASE_A = 97
            if (e.keyCode == UPPERCASE_A || e.keyCode == LOWERCASE_A) {
                if (e.target.tagName == 'SELECT') {
                    e.preventDefault();
                    $('option', e.target).prop('selected', true);
                    return;
                } else {
                    return;
                }
            }
        }
    });
}

/**
 * 레이어
 *
 * @param sSelector
 * @param event
 * @param iRelativeX
 * @param iRelativeY
 * @param bDisplay
 */
WMS.initLayer = function (sSelector) {
    var $layer = $(sSelector);
    var $document = $(document);
    $layer.draggable({handle: 'h2', containment: 'div'});
    $layer.find('h2').css('cursor', 'move');
    var iLayerWidth = $layer.width();
    var iLayerHeight = $layer.height();
    var iDocumentWidth = $document.width()
    var iDocumentHeight = $document.height();

    if ($layer.css('display') != 'block') {
        $layer.css({
            'left'    : Math.floor((iDocumentWidth / 2) - (iLayerWidth / 2)),
            'top'     : Math.floor((iDocumentHeight / 2) - (iLayerHeight / 2)),
            'position': 'absolute'
        });

        $layer.show();
    }
}

/**
 * Query String을 array로 변경.
 * '?name=park&age=13&gender=man' -> ['name': 'park', 'age': 13, 'gender': 'man']
 */
WMS.queryStringConvertArray = function (sQuery) {
    var aParams = sQuery.replace('?', '').split('&');
    var aQueryParam = [];

    aParams.forEach(function (value) {
        var aTemp = value.split('=');
        aQueryParam[aTemp[0]] = aTemp[1];
    });

    return aQueryParam;
};

/**
 * array를 Query String으로 변경.
 * ['name': 'park', 'age': 13, 'gender': 'man'] -> '?name=park&age=13&gender=man'
 */
WMS.arrayConvertQueryString = function (aQueryParam) {
    var aTemp = [];

    for (var key in aQueryParam) {
        if (aQueryParam.hasOwnProperty(key)) {
            aTemp.push(key + '=' + aQueryParam[key]);
        }
    }

    return '?' + aTemp.join('&');
};

WMS.createElement = function (tagName, attributes) {
    var element = document.createElement(tagName);
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
};

WMS.isEmpty = function (obj) {
    if (!!obj && obj.length != 0) {
        return false;
    }

    return true;
};

WMS.getCenterPoint = function (selector) {
    var divEl = $(selector);
    var divX = divEl.offset().left;
    var divY = divEl.offset().top;
    var divHalfWidth = divEl.width() / 2;
    var divHalfHeight = divEl.height() / 2;
    var divCenterX = divX + divHalfWidth;
    var divCenterY = divY + divHalfHeight;
    return {
        X: divCenterX,
        Y: divCenterY
    };
}

WMS.getRequestParams = function () {
    var requestUrl = WMS.parseUrl(location.href);
    return requestUrl.params;
};

WMS.getLocalStorage = function (sKey) {
    var localStorageJson = JSON.parse(localStorage.getItem(sKey));
    var defaults = {
        colGroup: {},
        rowCount: 20
    };
    return $.extend(defaults, localStorageJson);
};

$(function () {
    (function () {

        // 글로벌 설정팝업
        WMS.openPopupEvent('#eCommonSettingsConfigPopup', '/settings/config/front/list', WMS.HASH.hashCode('settings_config_list'), 750, 700);

        // mGridTable 이 없으면 body에 css 삭제
        if ($('.mGridTable').length === 0) {
            $('body').removeClass('autoHeight');
        }

        // suio.table.fix.resize.js 사용 토글 버튼 클래스 추가
        // UI팀 요청으로 해당 두줄 삽입
        $('#header .utility .btnFold').addClass('eFoldedSnb');
        $('.mSearchEngine .btnExpand').addClass('eFoldedTop');

        /**
         * lnb 메뉴 클릭 이벤트
         */
        $('.mNavigation a').click(function (e) {
            var cHeight = $('#container').height();
            var nHeight = $('.mNavigation').height();

            if (cHeight < nHeight) {
                $('#container').height(nHeight);
            }

            let $this = $(this);
            if ($this.hasClass('eNonLink') === true) {
                e.preventDefault();
                if ($this.hasClass('selected') === true) {
                    $this.removeClass('selected');
                } else {
                    $this.addClass('selected');
                }
            }
        });

        // toggle button event
        $('body').delegate('button.eWmsButtonToggle', 'click', function (e) {
            let $target = $(e.target);
            let sName = $target.attr('name');
            $target.siblings('button[name="' + sName + '"]').removeClass('selected');
            $target.addClass('selected');
        });
    })();
});

/**
 * document내에 input,textarea 백슬래쉬 전각문자'￦'로 치환
 */
WMS.chkInputReplaceWon = function () {
    var reg = /[\\]/gi;

    var aEvent = [
        'keyup',
        'blur',
        'paste'
    ];

    $.each(aEvent, function (i, sEvent) {
        $(document).on(sEvent, 'input,textarea', function (e) {
            var $this = $(this);
            if (sEvent === 'paste') {
                setTimeout(function () {
                    if ($this.val().match(reg) !== null && $this.attr('type') !== 'file') {
                        $this.val($this.val().replace(reg, '￦'));
                    }
                }, 100);
            } else {
                if ($this.val().match(reg) !== null && $this.attr('type') !== 'file') {
                    $this.val($this.val().replace(reg, '￦'));
                }
            }
        });
    });
};

/**
 * yyyy-mm-dd h:i:s 날짜시간리턴
 *
 * @param oDate
 * @returns {string}
 */
WMS.getDatetime = function (oDate) {
    function leadingZeros(n, digits) {
        var sResult = '';
        n = n.toString();

        if (n.length < digits) {
            for (var i = 0; i < digits - n.length; i++) {
                sResult += '0';
            }
        }
        return sResult + n;
    }

    return leadingZeros(oDate.getFullYear(), 4) + '-' +
        leadingZeros(oDate.getMonth() + 1, 2) + '-' +
        leadingZeros(oDate.getDate(), 2) + ' ' +
        leadingZeros(oDate.getHours(), 2) + ':' +
        leadingZeros(oDate.getMinutes(), 2) + ':' +
        leadingZeros(oDate.getSeconds(), 2);
}

/**
 * input readonly 처리
 * @param {Object} readonly
 */
jQuery.fn.readonly = function (readonly) {
    if (readonly == undefined) {
        readonly = true;
    }

    return this.each(function () {
        var $this = $(this);
        if (readonly) {
            if (this.tagName == "SELECT") {
                if (!$this.data("readonly")) {
                    $this.data("readonly", true);
                    $this.hide().before('<span class="selectbox-text"></span>');
                    $this.bind("change.readonly", function () {
                        var $this = $(this);
                        var text = $this.find("option[value!='']:selected").text();
                        $this.prev("span.selectbox-text").text(text);
                    }).triggerHandler("change.readonly");
                }
            } else if (this.type == "radio") {
                if (!this.checked) {
                    this.disabled = true;
                }
            } else if (this.type == "checkbox") {
                this.disabled = true;
                $this.bind("click.readonly", function () {
                    return false;
                });
            } else {
                $(this).attr("readonly", true);
                //$(this).css("background-color", "#f5f5f6");
            }
        } else {
            if (this.tagName == "SELECT") {
                if ($this.data("readonly")) {
                    $this.data("readonly", false).unbind("change.readonly");
                    $this.show().prev("span.selectbox-text").remove();
                }
            } else if (this.type == "radio") {
                this.disabled = false;
            } else if (this.type == "checkbox") {
                this.disabled = false;
                $this.unbind("click.readonly");
            } else {
                $(this).attr("readonly", false);
            }
        }
    });
};

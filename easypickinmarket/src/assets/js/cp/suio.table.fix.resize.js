/*!
 * jquery.fixedHeaderTable. The jQuery fixedHeaderTable plugin
 *
 * Copyright (c) 2013 Mark Malek
 * http://fixedheadertable.com
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * http://docs.jquery.com/Plugins/Authoring
 * jQuery authoring guidelines
 *
 * Launch  : October 2009
 * Version : 1.3
 * Released: May 9th, 2011
 *
 *
 * all CSS sizing (width,height) is done in pixels (px)
 */
/*ver 0.1*/
(function ($) {

    $.fn.fixResize = function (method) {

        // plugin's default options
        var defaults = {
            width:          '100%',
            height:         '100%',
            borderCollapse:  true,
            fixColumn:       0,     // fixed first columns
            autoShow:        true,  // hide table after its created
            autoResize:      true,  // resize table if its parent wrapper changes size
            create:          null,  // callback after plugin completes
            colResize:       false, // column resize
            resizeVer:       'flex',// column resize verseion
            dragVer:         2,     // drag ver
            storageSave:     false,  // size save storage width
            bgSpace:         false,
            completeBol:     false,
            scrollWidth:     10
        };

        var settings = {};

        // public methods
        var methods = {
            init: function (options) {
                settings = $.extend({}, defaults, options);

                // iterate through all the DOM elements we are attaching the plugin to
                return this.each(function () {
                    var $self = $(this); // reference the jQuery version of the current DOM element
                    if (helpers._isTable($self)) {
                        methods.setup.apply(this, Array.prototype.slice.call(arguments, 1));
                        $.isFunction(settings.create) && settings.create.call(this);
                    } else {
                        $.error('Invalid table mark-up');
                    }
                });
            },

            /*
             * Setup table structure for fixed headers
             */
            setup: function () {
                var $self       = $(this),
                    $thead      = $self.find('thead:first'),
                    tfootHeight = 0,
                    $wrapper,
                    $divHead,
                    $divBody,
                    $fixedBody,
                    captionName,
                    tableWidth;

                var listView = $self.next().hasClass('empty');

                if(listView){
                    if(settings.storageSave){
                        helpers._localStorageCall($self);
                    }

                    $self.next().css('width' , $self.width());
                    $self.parent().css({"overflow-x":"auto"});
                }else{
                    settings.originalTable = $(this).clone();
                    if (settings.fixColumn > 0) {
                        settings.scrollbarOffset = helpers._getScrollbarWidth();
                    }

                    if(settings.storageSave){
                        helpers._localStorageCall($self);
                    }

                    captionName = $self.find('caption').text();

                    if (!$self.closest('.grid-wrapper').length) {
                        $self.addClass('grid-table');
                        $self.wrap('<div class="grid-wrapper"></div>');
                    }

                    $wrapper = $self.closest('.grid-wrapper');

                    if(settings.bgSpace){
                        var tableWidth = $wrapper.width();//-2;
                        $self.css({ 'width': tableWidth });
                    }else{
                        $self.css({ 'width': '100%' });
                    }

                    if (settings.fixColumn > 0 && $wrapper.find('.grid-fixed-column').length == 0) {
                        $self.wrap('<div class="grid-fixed-body"></div>');
                        $('<div class="grid-fixed-column"></div>').prependTo($wrapper);
                        $fixedBody = $wrapper.find('.grid-fixed-body');
                    }

                    $wrapper.css({
                        width: settings.width,
                        height: settings.height
                    });

                    if (!$self.hasClass('grid-init')) {
                        $self.wrap('<div class="grid-tbody"></div>');
                    }

                    $divBody = $self.closest('.grid-tbody');

                    if (!$self.hasClass('grid-init')) {
                        if (settings.fixColumn > 0) {
                            $divHead = $('<div class="grid-thead"><table class="grid-table"><caption>'+captionName+'</caption></table></div>').prependTo($fixedBody);
                        } else {
                            $divHead = $('<div class="grid-thead"><table class="grid-table"><caption>'+captionName+'</caption></table></div>').prependTo($wrapper);
                        }

                        $divHead.find('table.grid-table')
                            .addClass(settings.originalTable.attr('class'))
                            .attr('style', settings.originalTable.attr('style'));
                        $thead.clone().appendTo($divHead.find('table'));//fix head
                    } else {
                        $divHead = $wrapper.find('div.grid-thead');
                    }

                    $self.css({
                        'margin-top': -$divHead.outerHeight(true)
                    });

                    $self.addClass('grid-init');

                    if(settings.colResize){
                        $wrapper.parent().addClass('grid-resize');
                        if(settings.bgSpace){
                            $wrapper.find('.grid-thead .grid-table').css('width', $wrapper.width());
                            $wrapper.parent().addClass('grid-resize-space');
                        }
                    }

                    if (settings.fixColumn > 0){
                        var interval = setInterval(function(){ loading(); }, 10),
                            figureAdd = 0,
                            figureStart = $thead.find('th').outerHeight(true);
                    }else{
                        setTimeout(divcreateEvent, 100);
                    }

                    function loading(){
                        var figureEnd = $thead.find('th').outerHeight(true);
                        if(figureStart != figureEnd || figureAdd >= 10){
                            clearInterval(interval);
                            divcreateEvent();
                        }
                        figureAdd++;
                    }

                    function divcreateEvent(){
                        helpers._columnDivCreate($wrapper);  //culumn resize div create

                        if (!settings.autoShow) {
                            $wrapper.hide();
                        }

                        helpers._bindScroll($wrapper, $divBody);

                        if (settings.fixColumn > 0) {
                            helpers._setupFixedColumn($self, self, $wrapper, $divHead, captionName);//fix column
                        }else{
                            $wrapper.find('.text').each(function(i){
                                var t = $(this.cloneNode(true));
                                txtArr.push(t);
                            });
                            helpers._mouseEvent($wrapper);
                            helpers._resizeCallEvent($self, $wrapper, $divHead, "S");
                        }

                        helpers._setupClone($wrapper, $divHead, "S");
                        helpers._eventHandler($self, $wrapper, $divHead, $divBody);
                        settings.completeBol = true;

                        var settingsArr = [];
                        for(var n in settings) {
                            settingsArr.push(settings[n]);
                        }
                        settingsArr.splice((settingsArr.length-1), 1);

                        if(settings.bgSpace){
                            $wrapper.append('<div class="grid-background" option='+settingsArr+'></div>');
                        }else{
                            $wrapper.append('<div class="grid-background" option='+settingsArr+' style="display:none;"></div>');
                        }
                    }

                    return self;
                }
            },

            /*
             * Destory fixedHeaderTable and return table to original state
             */
            destroy: function() {
                var $self    = $(this),
                    self     = this,
                    $wrapper = $self.closest('.grid-wrapper');

                $self.insertBefore($wrapper)
                    .removeAttr('style')
                    .removeClass('grid-table grid-init')
                    .find('')
                    .remove();

                var reNumTxt = [];
                $wrapper.find('.text').each(function(i){
                    var tName = $(this).parent().attr("title");
                    reNumTxt.push(tName);
                });

                $('.resizer').remove();
                //$('.text').remove();

                $self.find('thead th').each(function(i){
                    $(this).append(reNumTxt[i]);
                });

                $wrapper.remove();
                return self;
            },

            /*
            * scrollViewCheck
            */
            scrollViewCheck: function(str, options) {
                var $self    = $(this),
                    $wrapper = $self.closest('.grid-wrapper');

                var option = $wrapper.find('.grid-background').attr("option");
                if(option){
                    var optionArr = option.split(',');
                    settings = $.extend({}, defaults, options);
                    var i = 0;
                    for(var n in settings) {
                        var settingsVar;
                        if(optionArr[i] == "true"){
                            settingsVar = true;
                        }else if(optionArr[i] == "false"){
                            settingsVar = false;
                        }else if(optionArr[i] == ""){
                            settingsVar = null;
                        }else if(optionArr[i] == "100%"){
                            settingsVar = "100%";
                        }else if(optionArr[i] == "flex"){
                            settingsVar = "flex";
                        }else if(optionArr[i] == "fix"){
                            settingsVar = "fix";
                        }else{
                            settingsVar = parseInt(optionArr[i]);
                        }
                        //console.log(n+" : "+settingsVar+" ,"+typeof(settingsVar));
                        settings[n] = settingsVar;
                        i++;
                    }
                }
                helpers._scrollChkEvent($self, $wrapper, str);

                return self;
            },

            createComplete: function(options) {
                var $self    = $(this),
                    $wrapper = $self.closest('.grid-wrapper'),
                    option = $wrapper.find('.grid-background').attr("option");

                if(option){
                    var optionArr = option.split(',');
                    settings = $.extend({}, defaults, options);
                    var i = 0;
                    for(var n in settings) {
                        var settingsVar;
                        if(n == "completeBol"){
                            if(optionArr[i] == "true"){
                                settingsVar = true;
                            }else if(optionArr[i] == "false"){
                                settingsVar = false;
                            }
                            settings[n] = settingsVar;
                            break;
                        }
                        i++;
                    }
                }
                return settings.completeBol;
            }
        };

        var bol = true,
            reNum = 0,
            maxTop,
            txtArr = [],
            rowspanArr = [],
            saveStorgeArr = [],
            orgWidthArr = [],
            wrapperHeight,
            fixcolumnHeight,
            fixbodyHeight,
            autoChkBol = false,
            tableProps = 1,
            rememberNum = 0,
            iepaddingNum = 17;

        // private methods
        var helpers = {
            /*
            scrollcheck control
            */
            _scrollChkEvent: function($self, $wrapper, str) {
                var is_chrome = navigator.userAgent.indexOf('Chrome') > -1,
                    paddingNum = iepaddingNum,
                    columnBol = $wrapper.children().hasClass('grid-fixed-column'),
                    colHeadTarget,
                    colBodyTarget;

                if(is_chrome){ paddingNum = settings.scrollWidth; }

                if(columnBol){
                    colHeadTarget = $wrapper.find('.grid-fixed-body .grid-thead');
                    colBodyTarget = $wrapper.find('.grid-fixed-body .grid-tbody');
                }else{
                    colHeadTarget = $wrapper.find('.grid-thead');
                    colBodyTarget = $wrapper.find('.grid-tbody');
                }
                var $divHead = colHeadTarget.find('.grid-table');

                if(str == "init"){
                    helpers._setupClone($wrapper, $divHead, "S", 0, "view");

                    var tableWidth = $self.width(),
                        orgNowNum = colBodyTarget.find('.grid-table').height(),
                        trnHeight = $wrapper.height();

                    if(orgNowNum > trnHeight && str == "init" && settings.bgSpace){
                        tableWidth += paddingNum;

                        var len = $divHead.find('thead th').length,
                        init = len-1,
                        reStyle = $divHead.find('thead th').eq(init).attr("style"),
                        reWidthNum = parseInt(reStyle.replace(/[^0-9]/g,''))+paddingNum;

                        $divHead.find('thead th').eq(init).css('width' , reWidthNum);
                    }
                    $divHead.css('width', tableWidth);
                }

                if(str == "chk"){
                    helpers._setupClone($wrapper, $divHead, "S", 0);
                }else if(str == "bodyChk" && settings.bgSpace){
                    var trnWidth = $wrapper.width(),
                        orgNowWidth = colBodyTarget.find('.grid-table').width(),
                        bgWidth = trnWidth-orgNowWidth,
                        orgNowHeight = colBodyTarget.find('.grid-table').height(),
                        trnHeight = $wrapper.height(),
                        pNum = 0;

                    if(orgNowHeight > trnHeight){
                        bgWidth -= paddingNum;
                        pNum = paddingNum;
                    }

                    if(trnWidth >= orgNowWidth){
                        colBodyTarget.css('width' , (orgNowWidth+pNum));
                    }else{
                        colBodyTarget.css('width' , trnWidth);

                        if(columnBol){
                            var fixedBodyHeight = colBodyTarget.height()-paddingNum;
                            if(orgNowWidth <= trnWidth){
                                fixedBodyHeight = colBodyTarget.height();
                            }
                            if(settings.height == "100%"){
                                fixedBodyHeight = "100%";
                            }
                            $wrapper.find('.grid-fixed-column .grid-tbody').css({ 'height': fixedBodyHeight });
                        }
                    }
                    $wrapper.find('.grid-background').css({'width':bgWidth, 'height':'100%'});
                }
            },
            /*
             * return boolean
             * True if a thead and tbody exist.
             */
            _isTable: function($obj) {
                var $self = $obj,
                    hasTable = $self.is('table'),
                    hasThead = $self.find('thead').length > 0,
                    hasTbody = $self.find('tbody').length > 0;

                if (hasTable && hasThead && hasTbody) {
                    return true;
                }
                return false;
            },

            /*
             * return void
             * bind scroll event
             */
            _bindScroll: function($wrapper, $obj) {
                var $self = $obj,
                    //$wrapper = $self.closest('.grid-wrapper'),
                    $thead = $self.siblings('.grid-thead');

                var $fixedColumns = $wrapper.find('.grid-fixed-column');
                //var $fixedBody    = $('.grid-fixed-body');

                $self.bind('scroll', function(e) {
                    if (settings.fixColumn > 0) {
                        $fixedColumns.find('.grid-tbody table').css({
                            'margin-top': -$self.scrollTop()
                        });
                    }

                    $thead.find('table').css({
                        'margin-left': -this.scrollLeft
                    });

                    /*eTipScroll 이 생성되어 있을경우*/
                    if($('#tooltipSCrollView').length > 0){
                        $('.mTooltip').removeClass('show');
                        $('#tooltipSCrollView').remove();
                    }
                });
            },

            /*
             * return void
             */
            _setupFixedColumn: function ($self, obj, $wrapper, $divHead, captionName) {
                var $fixedBody        = $wrapper.find('.grid-fixed-body'),
                    $fixedColumn      = $wrapper.find('.grid-fixed-column'),
                    $thead            = $('<div class="grid-thead"><table class="grid-table"><caption>'+captionName+'</caption><thead><tr></tr></thead></table></div>'),
                    $tbody            = $('<div class="grid-tbody"><table class="grid-table"><caption>'+captionName+'</caption><tbody></tbody></table></div>'),
                    fixedBodyWidth    = $wrapper.width(),
                    fixedBodyHeight   = $fixedBody.find('.grid-tbody').height() - settings.scrollbarOffset,
                    $firstThChildren,
                    $firstTdChildren,
                    fixedColumnWidth,
                    $newRow,
                    firstTdChildrenSelector,
                    rowChkBol         = false;

                $thead.find('table.grid-table').addClass(settings.originalTable.attr('class'));
                $tbody.find('table.grid-table').addClass(settings.originalTable.attr('class'));

                firstTdChildrenSelector = 'tbody:first > tr > *:not(:nth-child(n+' + (settings.fixColumn + 1) + '))';

                // clone header
                $firstThChildren = $fixedBody.find('.grid-thead thead tr > *:lt(' + settings.fixColumn + ')');

                $thead.appendTo($fixedColumn)
                    .find('tr')
                    .append($firstThChildren.clone());

                $tbody.appendTo($fixedColumn).css({ 'height': fixedBodyHeight + tableProps });

                //FIXME: $tbody col
                var $tbodyColgroup = $('<colgroup></colgroup>');
                $tbody.find('table').prepend($tbodyColgroup);

                for(var i=0, x=settings.fixColumn; i<x; i++){
                    $tbodyColgroup.append('<col></col>');
                }

                $firstTdChildren = $fixedBody.find(firstTdChildrenSelector);
                // $firstTdChildren.each(function(index) {
                //     if (index % settings.fixColumn == 0) {
                //         $newRow = $('<tr></tr>').appendTo($tbody.find('tbody:first'));
                //     }
                //     $(this).clone().appendTo($newRow);
                // });

                //FIXME:
                for(var i=0, x=$firstTdChildren.length; i<x; i++){
                    if (i % settings.fixColumn == 0) {
                        $newRow = $('<tr></tr>').appendTo($tbody.find('tbody'));
                    }
                    var $item = $firstTdChildren.eq(i).clone(),
                        hasColspan = $item.attr('colspan');

                    $item.appendTo($newRow);
                    if(hasColspan) i += hasColspan-1;
                }

                // rowspan 일경우 rowspan 갯수만큼 아래 td 삭제----------------
                var culArr = [];
                $fixedColumn.find('tbody:first > tr').each(function(index) {
                    var classChk = $(this).parents($fixedColumn).next().find('tbody:first > tr').eq(index).attr('class');
                    if(classChk){
                        $(this).addClass(classChk);
                    }
                    var _this = $(this);
                    $(this).children().each(function(i){
                        var rowChkNum = parseInt($(this).attr('rowspan'));
                        if(rowChkNum > 0){
                            /*var inum = (settings.fixColumn-1)-i;
                            if(settings.fixColumn == 2){ inum = 1; }*/
                            for(var n = (index+1); n <= (index+(rowChkNum-1)); n++){
                                //var target = $fixedColumn.find('tbody tr:eq('+n+') td:eq('+inum+')');
                                var target = $fixedColumn.find('tbody:first > tr:eq('+n+') td:last-child'),
                                    cul = (n*settings.fixColumn)+i;
                                culArr.push(cul);
                                culArr.sort(function(a, b){return a-b});

                                target.remove();
                            }
                        }
                        rowspanArr.push(0);
                    });
                });

                for(var j = 0; j<culArr.length; j++){
                    rowspanArr.splice(culArr[j], 0, 1);
                }
                //!--------------------------------------------------------

                $wrapper.find('.grid-fixed-body .text').each(function(i){
                    var t = $(this.cloneNode(true))
                    txtArr.push(t);
                });
                helpers._theadControl($self, $wrapper, "R", $divHead);
                helpers._mouseEvent($wrapper);
                if(settings.storageSave){
                    helpers._resizeCallEvent($self, $wrapper, $divHead, "S");                  //로컬 save width 실행
                }else{
                    $(document).ready(function(){
                        helpers._reSetFixedColumn($self, $wrapper, $divHead, 0, "S");              //로컬 save width 미실행
                    });
                    //helpers._reSetFixedColumn($self, $wrapper, $divHead, 0, "S");              //로컬 save width 미실행
                }
                var columnBol = $wrapper.children().hasClass('grid-fixed-column');
                if(columnBol){
                    fixcolumnHeight = parseInt($wrapper.find('.grid-fixed-column .grid-tbody').css("height"));
                    fixbodyHeight = parseInt($wrapper.find('.grid-fixed-body .grid-tbody').css("height"));
                }else{
                    fixbodyHeight = parseInt($wrapper.find('.grid-tbody').css("height"));
                }
                wrapperHeight = parseInt($wrapper.css("height"));

                var mt = tableProps-2;
                $tbody.appendTo($fixedColumn).css({ 'margin-top': mt });

                // bind mousewheel events
                var paddingNum = iepaddingNum,
                    is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
                if(is_chrome){ paddingNum = settings.scrollWidth; }

                maxTop = $fixedColumn.find('.grid-tbody .grid-table').height() - ($fixedBody.find('.grid-tbody').height()-paddingNum);
                $fixedColumn.find('.grid-tbody .grid-table').bind('mousewheel', function(event) {
                    var E = event.originalEvent;
                    if (E.wheelDelta == 0) {
                        return;
                    }
                    var top = parseInt($(this).css('marginTop'), 10) + (E.wheelDelta > 0 ? 60 : -60);

                    if (top > 0) {
                        top = 0;
                    }
                    if (top < -maxTop) {
                        top = -maxTop;
                    }
                    $(this).css('marginTop', top);
                    $fixedBody.find('.grid-tbody').scrollTop(-top).scroll();

                    return false;
                });

                // set width of body table wrapper
                $fixedBody.css({
                    'width': '100%'
                });
            },

            /*
             * return fixed width & height css
             */
            _reSetFixedColumn: function ($self, $wrapper, $divHead, index, str) {
                var $fixedBody        = $wrapper.find('.grid-fixed-body'),
                    $fixedColumn      = $wrapper.find('.grid-fixed-column'),
                    $firstHeadTdChildren,
                    $firstBodyTdChildren,
                    $headThChildren,
                    fixedColumnWidth = 1,
                    firstTdChildrenSelector = 'tbody:first > tr > *:not(:nth-child(n+' + (settings.fixColumn + 1) + '))';

                var is_chrome = navigator.userAgent.indexOf('Chrome') > -1,
                    chrome = false;
                if(is_chrome){ chrome = true; }

                //head column width change
                if(str == "M"){
                    /*if(index < settings.fixColumn){
                        fixcolumWidthEvent(index);
                    }*/
                }else{
                    for(var i = 0; i<settings.fixColumn; i++){
                        fixcolumWidthEvent(i);
                    }
                }

                function fixcolumWidthEvent(n){
                    var $item = $fixedBody.find(firstTdChildrenSelector).eq(n),
                        $prt = $item.parent(),
                        $items = $prt.children(':lt('+settings.fixColumn+')');

                    var hasColspan = $items.is('[colspan]');
                    if(hasColspan){
                        $item = $prt.next('tr').children().eq(n);
                    }

                    var fixBodyWidthNum = $item.outerWidth(true)-tableProps,
                        fixBodyHeightNum = $wrapper.find('.grid-fixed-body .grid-thead thead th').outerHeight(true);
                        $fixedColumn.find('thead th').eq(n).css({'width':fixBodyWidthNum, 'height':fixBodyHeightNum});
                        $fixedColumn.find('.grid-tbody colgroup').children().eq(n).css({ 'width': fixBodyWidthNum});

                    fixedColumnWidth += (fixBodyWidthNum+tableProps);


                    // if(chrome){
                    //     var fixBodyWidthNum = $fixedBody.find(firstTdChildrenSelector).eq(n).outerWidth(true)-tableProps,
                    //         fixBodyHeightNum = $wrapper.find('.grid-fixed-body .grid-thead thead th').outerHeight(true);
                    //     $fixedColumn.find('thead th').eq(n).css({'width':fixBodyWidthNum, 'height':fixBodyHeightNum});

                    //     fixedColumnWidth += (fixBodyWidthNum+tableProps);
                    // }else{
                    //     var fisBodyStyle = $fixedBody.find('.grid-thead th').eq(n).attr('style'),
                    //         heightNum = $wrapper.find('.grid-fixed-body .grid-thead thead th').outerHeight(true)-tableProps;

                    //     $fixedColumn.find('thead th').eq(n).attr('style', fisBodyStyle);
                    //     $fixedColumn.find('thead th').eq(n).css('height' ,heightNum);

                    //     var widthNum = parseInt(fisBodyStyle.replace(/[^0-9]/g,''));

                    //     fixedColumnWidth += widthNum;
                    // }
                }
                $fixedColumn.css({ 'width': fixedColumnWidth});

                //body column width & height change
                var tdBodyArr = [],
                    tdHeadArr = [];

                $fixedBody.find(firstTdChildrenSelector).each(function(i) {
                    tdBodyArr[i] = $(this).outerWidth(true);
                    if(rowspanArr[i] != 1){
                        tdHeadArr[i] = Math.floor($(this).outerHeight());
                    }else{
                        tdHeadArr[i] = 0;
                    }
                });

                $fixedColumn.find('tbody:first tr').each(function(i) {
                    for(var j = 0; j<settings.fixColumn; j++){
                        var num = (i*settings.fixColumn)+j,
                            target = $fixedColumn.find('tbody:first tr:eq('+i+') td:eq('+j+')'),
                            tdwidth = tdHeadArr[num],
                            len = $fixedColumn.find('tbody:first tr:eq('+i+') td').length;

                        if(settings.fixColumn <= 1){
                            len = 0;
                        }
                        if(len == 1){
                            if(j == 0){
                                tdwidth = tdHeadArr[num+1];
                            }
                        }
                        target.css({
                            'width': (tdBodyArr[num]-tableProps),
                            'height': tdwidth
                        });
                    }
                });

                if(str == "S"){
                    var colHTarget = $wrapper.find('.grid-fixed-body .grid-thead th'),
                        colen = colHTarget.length;
                    for(var i = 0; i<colen; i++){
                        if(settings.colResize){
                            target = $wrapper.find('.resizer');
                        }else{
                            target = colHTarget.eq(i);
                        }
                        if(txtArr.length > 0){
                            var display = colHTarget.eq(i).css("display");
                            if(display != "none"){
                                var strtxt = String(txtArr[i].text());
                                var plus = 0;
                                if(target.hasClass('array')){
                                    plus = 2;
                                }
                                var len = strtxt.replace(/ /g, '').length+plus;
                                var wn = len*6;
                                var width = colHTarget.eq(i).width();
                                if(width <= wn){
                                    helpers._multilineEllipsis($wrapper, i);
                                }
                            }
                        }
                    };
                    helpers._theadControl($self, $wrapper, str, $divHead);

                    var className = $fixedBody.find('.grid-tbody tbody').attr('class');
                    if(className){
                        $fixedColumn.find('.grid-tbody tbody').addClass(className);
                    }
                }
            },

            /*
             * return void
             * Fix widths of each cell in the first row of obj.
             */
            _setupClone: function($wrapper, $obj, str, index, tstr) {
                var $self = $obj,
                    colHeadTarget,
                    colBodyTarget,
                    columnBol = $wrapper.children().hasClass('grid-fixed-column');

                if(columnBol){
                    colHeadTarget = $wrapper.find('.grid-fixed-body .grid-thead');
                    colBodyTarget = $wrapper.find('.grid-fixed-body .grid-tbody');
                }else{
                    colHeadTarget = $wrapper.find('.grid-thead');
                    colBodyTarget = $wrapper.find('.grid-tbody');
                }

                var bol = true,
                    widthNum = 0,
                    paddingNum = iepaddingNum,
                    scrolllen = 0,
                    bgWidth = 0,
                    bgHeight = 0,
                    orgNowNum = colBodyTarget.find('.grid-table').width(),
                    trnWidth = $wrapper.width(),
                    orgHeight = colBodyTarget.find('.grid-table').height(),
                    trnHeight = $wrapper.height(),
                    scrollX = 0,
                    checkTh = colBodyTarget.find('thead th').height(),
                    is_chrome = navigator.userAgent.indexOf('Chrome') > -1;

                if(is_chrome){ paddingNum = settings.scrollWidth; }
                if(orgNowNum > trnWidth){ scrollX = paddingNum; }
                if((orgHeight+scrollX) >= trnHeight){ scrolllen = paddingNum; }
                if(rememberNum != 0 && checkTh != rememberNum || str == "S"){
                    if(settings.bgSpace && tstr != "view"){
                        lastWidthContrl();
                    }
                }
                if(orgNowNum > trnWidth){
                    widthNum = paddingNum;
                    if(settings.bgSpace && str == "S" && tstr != "view"){
                        lastWidthContrl();
                    }
                }else{
                    if(str == "S"){
                        var totlaWidth = 0;
                        var widthArr = [];
                        colHeadTarget.find('thead th').each(function(i){
                            var style = $(this).attr("style");
                            var widthStyleNum = parseInt(style.replace(/[^0-9]/g,''));
                            if(!widthStyleNum){
                                widthStyleNum = $(this).width();
                            }
                            widthArr.push(widthStyleNum);
                            totlaWidth += widthStyleNum;
                        });
                        var len = colHeadTarget.find('thead th').length;
                        var mNum = (orgNowNum - totlaWidth)/len;
                        if(totlaWidth <= orgNowNum){
                            var remainderNum = 0;
                            colHeadTarget.find('thead th').each(function(j){
                                var width = Math.floor(widthArr[j]+mNum);
                                remainderNum += width;

                                if(columnBol){
                                    var $target = $wrapper.find('.grid-fixed-column .grid-thead');
                                    $target.find('thead th').eq(j).css('width' , width);
                                }
                                $(this).css('width' , width);
                                colBodyTarget.find('thead th').eq(j).css('width' , width);
                            });

                            if(remainderNum <= orgNowNum){
                                var cul = (orgNowNum - remainderNum),
                                    init = len-1,
                                    reStyle = colHeadTarget.find('thead th').eq(init).attr("style"),
                                    reWidthNum = parseInt(reStyle.replace(/[^0-9]/g,'')),
                                    reWidth = cul + reWidthNum;

                                colHeadTarget.find('thead th').eq(init).css('width' , reWidth);
                                if(settings.bgSpace && tstr != "view"){
                                    colBodyTarget.find('thead th').eq(init).css('width' , (reWidth-scrolllen));
                                }else{
                                    colBodyTarget.find('thead th').eq(init).css('width' , reWidth);
                                }
                            }

                            if(columnBol){
                                helpers._reSetFixedColumn($self, $wrapper, $obj, 0, "R");        //grid-fixed-column 일경우 th width 값이랑 td 맞춰줘야 하므로 _reSetFixedColumn 함수 호출
                            }
                        }
                    }
                    bgWidth = trnWidth-orgNowNum;
                    bgHeight = colBodyTarget.find('.grid-table').height();
                }

                function lastWidthContrl(){
                    var len = colHeadTarget.find('thead th').length;
                        init = len-1,
                        reStyle = colHeadTarget.find('thead th').eq(init).attr("style"),
                        reWidthNum = parseInt(reStyle.replace(/[^0-9]/g,'')),
                        reWidth = reWidthNum;

                    colBodyTarget.find('thead th').eq(init).css('width' , (reWidth-scrolllen));

                    var headTarget = colHeadTarget.find('thead th').eq(init);
                    if(str == "S"){
                        if(headTarget.find('.prTxt').length < 1){
                            headTarget.find('.text').wrap('<div class="prTxt">');
                        }
                    }
                    headTarget.find('.prTxt').css("padding-right", scrolllen);

                    if(index == init){
                        helpers._multilineEllipsis($wrapper, init);
                    }
                }
                if(settings.bgSpace && tstr != "view"){
                    if(str == "R"){
                        $wrapper.find('.grid-background').css({'width':bgWidth, "height":"100%"});
                    }

                    if(str == "S"){
                        var headHeight = $obj.outerHeight(true);
                        colBodyTarget.find('.grid-table').css({ 'margin-top': -headHeight });
                    }

                    var tableWidth = colBodyTarget.find('.grid-table').width()-scrolllen;
                    colBodyTarget.find('.grid-table').css({ 'width': tableWidth });

                    rememberNum = colBodyTarget.find('thead th').height();
                }

                var moveNum = colBodyTarget.height(),
                    tableNum = colBodyTarget.find('.grid-table').height(),
                    tableHeadNum = colBodyTarget.find('.grid-table thead').height(),
                    totalNum = Math.floor((tableNum - tableHeadNum)+widthNum);


                //FIXME:
                //console.dir(moveNum +','+ totalNum)
                //console.dir(colBodyTarget.prop('offsetHeight') +','+ colBodyTarget.prop('scrollHeight'));

                moveNum = colBodyTarget.prop('offsetHeight');
                totalNum = colBodyTarget.prop('scrollHeight');

                // setTimeout(function(){
                //     if(colBodyTarget.prop('scrollHeight') < colBodyTarget.prop('offsetHeight')){ bol = false; }

                //     if(bol){
                //         colHeadTarget.css({ 'padding-right': paddingNum+'px' });
                //     }else{
                //         colHeadTarget.css({ 'padding-right': '' });
                //     }
                // }, 1);

                if(moveNum >= totalNum){ bol = false; }
                if(bol){
                    colHeadTarget.css({ 'padding-right': paddingNum+'px' });
                }else{
                    colHeadTarget.css({ 'padding-right': '' });
                }

                if(!settings.colResize || settings.resizeVer == "fix" ){
                    var self = colBodyTarget.find('.grid-table');
                    helpers._theadControl(self, $wrapper, "R", $obj);
                }

                if(columnBol){
                    var fixedBodyHeight = colBodyTarget.height()-paddingNum;
                    if(orgNowNum <= trnWidth){
                        fixedBodyHeight = colBodyTarget.height();
                    }

                    if(settings.height == "100%"){
                        fixedBodyHeight = "100%";
                    }
                    $wrapper.find('.grid-fixed-column .grid-tbody').css({ 'height': fixedBodyHeight });

                    if(str != "S"){
                        helpers._reSetFixedColumn($self, $wrapper, $obj, 0, str);
                    }
                }
            },

            /*
             * return int
             * get the width of the browsers scroll bar
             */
            _getScrollbarWidth: function() {
                var scrollbarWidth = 0;

                if (!scrollbarWidth) {
                    if (/msie/.test(navigator.userAgent.toLowerCase())) {
                        var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                                .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body'),
                            $textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
                                .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');

                        scrollbarWidth = $textarea1.width() - $textarea2.width() + 2;
                        $textarea1.add($textarea2).remove();
                    } else {
                        var $div = $('<div />')
                            .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
                            .prependTo('body').append('<div />').find('div')
                            .css({ width: '100%', height: 200 });

                        scrollbarWidth = 100 - $div.width();
                        $div.parent().remove();
                    }
                }
                return scrollbarWidth;
            },

            /*
             * columeResize block create
             */
            _columnDivCreate: function($wrapper) {
                var bolcolumn = $wrapper.children().hasClass('grid-fixed-column'),
                    $columnTarget,
                    $columnBodyTarget;
                if(bolcolumn){
                    $columnTarget = $wrapper.find('.grid-fixed-body .grid-thead .grid-table');
                    $columnBodyTarget = $wrapper.find('.grid-fixed-body .grid-tbody .grid-table');
                }else{
                    $columnTarget = $wrapper.find('.grid-thead .grid-table');
                    $columnBodyTarget = $wrapper.find('.grid-tbody .grid-table');
                }
                var len = $columnTarget.find('thead tr').length;
                for(var j = 0; j<len; j++){
                    var ths = $columnTarget.find('thead tr').eq(j).find('th');
                    theadNameEvent(ths, j);
                }
                var ths1 = $columnBodyTarget.find('thead th');
                theadNameEvent(ths1, 0);

                function theadNameEvent(ths, j){
                    var theadName,
                        thslen = ths.length;
                    for(var i = 0; i<thslen; i++){
                        var target = ths.eq(i);
                        theadName = String(target.html());
                        target.empty();
                        if(j == 0){
                            var arr = theadName.split("<");
                            if(arr.length > 1){
                                var chkNum = theadName.split("txtBreak");
                                if(chkNum.length > 1){
                                    var tagChkArr = theadName.split("</span>"),
                                        targetStr = tagChkArr[(tagChkArr.length-1)].trim(),
                                        len = targetStr.length;
                                    if(len > 0){
                                        var strTxtAdd = "",
                                            strTxtSide = "";
                                        for(var n=0; n<tagChkArr.length; n++){
                                            var strTag = tagChkArr[n].trim(),
                                                figure = strTag.indexOf("txtBreak");
                                            if(figure >= 0){
                                                strTxtAdd += strTag+"</span>";
                                            }else{
                                                if(n < (tagChkArr.length-1)){
                                                    strTxtSide += strTag+"</span>";
                                                }else{
                                                    strTxtSide += strTag;
                                                }
                                            }
                                        }
                                        if(settings.colResize){
                                            target.append( '<span class="resizer" title="마우스 드래그로 컬럼의 넓이를 변경 할 수 있습니다."></span><span class="text">'+strTxtAdd+'</span> '+strTxtSide);
                                        }else{
                                            target.append( '<span class="text">'+strTxtAdd+'</span> '+strTxtSide);
                                        }
                                    }else{
                                        if(settings.colResize){
                                            target.append( '<span class="resizer" title="마우스 드래그로 컬럼의 넓이를 변경 할 수 있습니다."></span><span class="text">'+theadName.trim()+'</span>' );
                                        }else{
                                            target.append( '<span class="text">'+theadName.trim()+'</span>' );
                                        }
                                    }
                                }else{
                                    var str = editTextEvent(arr);
                                    if(settings.colResize){
                                        target.append( '<span class="resizer" title="마우스 드래그로 컬럼의 넓이를 변경 할 수 있습니다."></span><span class="text">'+arr[0].trim()+'</span> '+str.trim() );
                                    }else{
                                        var indexStr = str.indexOf("br");
                                        if(indexStr >= 0){
                                            var indexTagArr = str.split("<"),
                                                joinStr = "",
                                                joinStr2 = "";
                                            for(var n = 1; n<indexTagArr.length; n++){
                                                var num = indexTagArr[n].indexOf("br");
                                                if(num >= 0){
                                                    joinStr += "<"+indexTagArr[n];
                                                }else{
                                                    joinStr2 += "<"+indexTagArr[n];
                                                }
                                            }
                                            target.append( '<span class="text">'+arr[0]+joinStr+'</span>'+joinStr2 );
                                        }else{
                                            target.append( '<span class="text">'+arr[0]+'</span>'+str );
                                        }
                                    }
                                }
                            }else{
                                if(settings.colResize){
                                    target.append( '<span class="resizer" title="마우스 드래그로 컬럼의 넓이를 변경 할 수 있습니다."></span><span class="text">'+theadName+'</span>' );
                                }else{
                                    target.append( '<span class="text">'+theadName+'</span>' );
                                }
                            }
                        }else{
                            target.append( '<span class="text">'+theadName+'</span>' );
                        }
                        if(i >= (ths.length-1) && settings.resizeVer == "fix"){
                            target.children().addClass('cursorNone');
                        }
                        var classFlag = target.hasClass('gCover');
                        if(classFlag){
                            target.children().wrapAll('<div class="cover"></div>');
                        }
                    }
                }

                function editTextEvent(arr){
                    var str = ""
                    for(var m = 1; m<arr.length; m++){
                        str += String("<"+arr[m]);
                    }
                    return str;
                }
            },

            /*
             * Eventhandler
             */
            _eventHandler: function($self, $wrapper, $divHead, $divBody) {
                //-----------------------------------------------------------------------------------------------//
                var startX,
                    startWidth,
                    secondWidth,
                    $handle,
                    pressed = false,
                    $fixedColumn = $wrapper.find('.grid-fixed-column'),
                    colBodyTarget,
                    colHeadTarget,
                    propToggle = 0;

                var columnBol = $wrapper.children().hasClass('grid-fixed-column'),
                    colBodyTarget,
                    colHeadTarget;
                if(columnBol){
                    colBodyTarget = $wrapper.find('.grid-fixed-body .grid-tbody .grid-table');
                    colHeadTarget = $wrapper.find('.grid-fixed-body .grid-thead .grid-table');
                }else{
                    colBodyTarget = $wrapper.find('.grid-tbody .grid-table');
                    colHeadTarget = $wrapper.find('.grid-thead .grid-table');
                }

                if(settings.colResize){
                    var len = colHeadTarget.find('thead th').length,
                        contentTarget = $('#content');
                    if(contentTarget.length == 0){
                        contentTarget = $('#wrap');
                    }

                    var divNum = 1;
                    if(settings.bgSpace){
                        divNum = 0;
                    }

                    $(document).mousemove(function( event ) {
                        if (pressed) {
                            var stVer = "M"
                            var eventPageX = (event.pageX+propToggle);
                            if(settings.dragVer == 2){
                                var initX = eventPageX-$wrapper.offset().left;
                                $('.moveLine').css({left: initX, opacity: 1});
                                stVer = "L"
                            }
                            var index = Number($handle.index());
                            if(index < (len-divNum)){
                                helpers._mouseMoveEvent($self, $wrapper, $divHead, $handle, startWidth, secondWidth, startX, eventPageX, stVer);
                            }
                        }
                    });

                    $(document).mouseup(function( event ) {
                        if (pressed) {
                            pressed = false;
                            if(settings.dragVer == 2){
                                var index = Number($handle.index());
                                if(index < (len-divNum)){
                                    var eventPageX = (event.pageX+propToggle);
                                    helpers._mouseMoveEvent($self, $wrapper, $divHead, $handle, startWidth, secondWidth, startX, eventPageX, "M");
                                    helpers._setupClone($wrapper, $divHead, "R", index);
                                }
                                $('.moveLine').remove();
                            }
                            $wrapper.removeClass('selectNone');
                        }
                    });

                    $wrapper.find('thead th').delegate('.resizer', 'mousedown', function(event) {
                        var $this = $(this);
                        thClickEvent($this);
                    });

                    function thClickEvent($this){
                        var propleft = contentTarget.offset().left;
                        if(propleft == 0){
                            propToggle = propleft;
                        }else{
                            if(propleft == 0){
                                propToggle = -propleft;
                            }else{
                                propToggle = 0;
                            }
                        }
                        $handle = helpers._returnTarget($this, "M");
                        var index = Number($this.parent().index());
                        if(index < (len-divNum)){
                            pressed = true;
                            startX = (event.pageX+propToggle);
                            startWidth = $handle.innerWidth()+tableProps;
                            secondWidth = $handle.next().innerWidth()+tableProps;
                            if(settings.dragVer == 2){
                                var initX = startX-$wrapper.offset().left;
                                $wrapper.append('<div class="moveLine"></div>');
                                $('.moveLine').css({left: initX, opacity: 0});
                            }
                        }
                        $wrapper.addClass('selectNone');
                    }

                    if(settings.resizeVer == "flex" && !settings.bgSpace){
                        colHeadTarget.find('thead th').delegate('.resizer', 'mouseover', function(event) {
                            if(!pressed){
                                var pr = parseInt($divHead.css('padding-right'));
                                var orgWidth = colBodyTarget.parent().innerWidth()-pr;//-17;
                                var trnWidth = colBodyTarget.width();
                                var bol = true;
                                if(orgWidth >= trnWidth){
                                    bol = false;
                                }
                                var target = $(this);
                                $handle = helpers._returnTarget(target, "M");
                                helpers._colCursor(bol, colHeadTarget, $fixedColumn, $handle);
                            }
                        });
                    }
                }else{
                    colHeadTarget.find('thead th').each(function(i){
                        var propStyleArr = $(this).attr("style").split("width:");
                        var propStyleArr2 = propStyleArr[1].split(";");
                        var propWidth = propStyleArr2[0].trim();
                        if(propWidth == "auto"){
                            autoChkBol = true;
                        }
                    });
                }

                /*-------------------------------------------------------------------------------------------------------*/
                //layout
                //FIXME: 
                // $('body').delegate('.snbToggle, .eFoldedSnb, .aside-close', 'click', function(event) {
                $('body').delegate('.snbToggle, .eFoldedSnb, .aside-close, .tab >li', 'click', function(event) {
                    if(settings.bgSpace){
                        helpers._scrollChkEvent($self, $wrapper, "bodyChk");
                    }else{
                        helpers._setupClone($wrapper, $divHead, "S");
                    }

                    $self.css({
                        'margin-top': -$divHead.outerHeight(true)
                    })
                });
                //search close
                $('body').delegate('.eFoldedTop', 'click', function(event) {
                    if(settings.bgSpace){
                        helpers._scrollChkEvent($self, $wrapper, "bodyChk");
                    }else{
                        helpers._setupClone($wrapper, $divHead, "S");
                    }
                });
                /*------------------------------------------------------------------------------------------------------*/

                $('body').delegate('.eSizeReset', 'click', function(event) {
                    var thisName = $(this).attr('name');
                    saveStorgeArr = [];
                    if(thisName == $self.attr("id")){
                        /*localStorage*/
                        var nameStorage = window.location.pathname+"_"+$self.attr("id");
                        $self.find('thead th').each(function(i){
                            var saveName = String(nameStorage+"_"+i);
                            localStorage.removeItem(saveName);
                            saveStorgeArr.push(orgWidthArr[i]);
                        });
                        helpers._resizeCallEvent($self, $wrapper, $divHead, "S");
                    }
                });

                $(window).on('tableResize', function(){
                    var $thead = $self.find('.grid-thead').find('thead');
                    var $theadOrg = $self.find('.grid-tbody')
                })

                var rememberHeight = 0;
                $('body').delegate('.ePlusHeight', 'click', function(event) {
                    var thisName = $(this).attr('name');
                    if(thisName == $self.attr("id")){
                        $(this).next().removeClass('disabled');
                        if((wrapperHeight+rememberHeight) < colBodyTarget.height()){
                            rememberHeight += 200;
                            if((wrapperHeight+rememberHeight) >= colBodyTarget.height()){
                                $(this).addClass('disabled');
                            }
                            heightControlEvent();
                        }
                    }
                });

                $('.eMinusHeight').addClass('disabled');
                $('body').delegate('.eMinusHeight', 'click', function(event) {
                    var thisName = $(this).attr('name');
                    if(thisName == $self.attr('id')){
                        rememberHeight -= 200;
                        if(rememberHeight <= 0){
                            rememberHeight = 0;
                            $(this).addClass('disabled');
                        }
                        heightControlEvent();
                        if((wrapperHeight+rememberHeight) < colBodyTarget.height()){
                            $(this).prev().removeClass('disabled');
                        }
                    }
                });

                function heightControlEvent(){
                    var w_hnum = wrapperHeight+rememberHeight;
                    var fc_hnum = fixcolumnHeight+rememberHeight;
                    var fd_hnum = fixbodyHeight+rememberHeight;

                    $wrapper.css({"height":w_hnum});
                    if(columnBol){
                        $wrapper.find('.grid-fixed-column .grid-tbody').css({"height":fc_hnum});
                        $wrapper.find('.grid-fixed-body .grid-tbody').css({"height":fd_hnum});
                    }else{
                        $wrapper.find('.grid-tbody').css({"height":fd_hnum});
                    }
                }

                if(settings.autoResize){
                    $(window).resize(function() {
                        if(settings.fixColumn > 0 && !settings.bgSpace){
                            helpers._setupClone($wrapper, $divHead, "R");
                        }

                        var orgNowNum = colHeadTarget.width(),
                            trnWidth = $wrapper.width(),
                            bgWidth = trnWidth-orgNowNum,
                            bgHeight = colBodyTarget.height(),
                            is_chrome = navigator.userAgent.indexOf('Chrome') > -1,
                            paddingNum = iepaddingNum;

                        if(is_chrome){ paddingNum = settings.scrollWidth; }
                        var tableWidth = colBodyTarget.width()+paddingNum;

                        if(trnWidth > orgNowNum && settings.bgSpace){
                            $wrapper.find('.grid-background').css({'width':bgWidth, "height":"100%"});
                            colBodyTarget.parent().css({ 'width': tableWidth });
                        }else{
                            $wrapper.find('.grid-background').css({'width':''});
                            colBodyTarget.parent().css({ 'width': "" });
                        }
                    });
                }
            },

            /*
             * size control
             */
            _resizeCallEvent: function($self, $wrapper, $divHead, str){
                var target;
                var columnBol = $wrapper.children().hasClass('grid-fixed-column'),
                    colBodyTarget,
                    colHeadTarget;
                if(columnBol){
                    colBodyTarget = $wrapper.find('.grid-fixed-body .grid-tbody .grid-table');
                    colHeadTarget = $wrapper.find('.grid-fixed-body .grid-thead .grid-table');
                }else{
                    colBodyTarget = $wrapper.find('.grid-tbody .grid-table');
                    colHeadTarget = $wrapper.find('.grid-thead .grid-table');
                }

                var colHTarget = colHeadTarget.find('thead th'),
                    colen = colHTarget.length;
                for(var i = 0; i<colen; i++){
                    if(settings.colResize){
                        target = $('.resizer');
                    }else{
                        target = colHTarget.eq(i);
                    }
                    if(str == "S"){
                        if(txtArr.length > 0){
                            var display = colHTarget.eq(i).css("display");
                            if(display != "none"){
                                var strtxt = String(txtArr[i].text());
                                var plus = 0;
                                if(target.hasClass('array')){
                                    plus = 2;
                                }
                                var len = strtxt.replace(/ /g, '').length+plus;
                                var wn = len*7;
                                var width = colHTarget.eq(i).width();
                                if(width <= wn){
                                    helpers._multilineEllipsis($wrapper, i);
                                }
                            }
                        }
                    }else{
                        var $handle = helpers._returnTarget(target, "R", i);
                        var eventPageX = 0
                        var startX = eventPageX;
                        var startWidth = $handle.innerWidth()+tableProps;
                        var secondWidth = $handle.next().innerWidth()+tableProps;
                        helpers._mouseMoveEvent($self, $wrapper, $divHead, $handle, startWidth, secondWidth, startX, eventPageX, str ,i);
                    }
                };

                if(str == "S"){
                    helpers._theadControl($self, $wrapper, str, $divHead);
                }

                if(str == "S" && settings.fixColumn > 0){
                    helpers._reSetFixedColumn($self, $wrapper, $divHead, 0, str);
                }
            },

            /*
             * target
             */
            _returnTarget: function(target, str, i){
                var $handle;
                if(str == "M"){
                    $handle = target.parents('th');
                }else{
                    $handle = target.parents('th').eq(i);
                }
                return $handle;
            },

            /*
             * mouseMove Event & browserResize
             */
            _mouseMoveEvent: function($self, $wrapper, $divHead, $handle, startWidth, secondWidth, startX, eventPageX, str, i){
                var columnBol = $wrapper.children().hasClass('grid-fixed-column'),
                    colBodyTarget,
                    colHeadTarget;
                if(columnBol){
                    colBodyTarget = $wrapper.find('.grid-fixed-body .grid-tbody .grid-table');
                    colHeadTarget = $wrapper.find('.grid-fixed-body .grid-thead .grid-table');
                }else{
                    colBodyTarget = $wrapper.find('.grid-tbody .grid-table');
                    colHeadTarget = $wrapper.find('.grid-thead .grid-table');
                }

                //전체 column width 값 변경시켜주는 부분
                var index;
                if(str == "R" || str == "S"){
                    index = i;
                }else{
                    index = Number($handle.index());
                }

                var minWidth = 50;

                //TODO: horizontal only scroll increase not decrease
                //str move: L, up:M
                if(str != "S"){
                    if(settings.resizeVer == "flex"){
                        var pr = parseInt($divHead.css('padding-right')),
                            orgWidth = colBodyTarget.parent().innerWidth()-pr,//-17,
                            //orgWidth = colBodyTarget.parent().innerWidth()-settings.scrollWidth,
                            es = (eventPageX - startX),
                            trnWidth = colBodyTarget.innerWidth()+es,
                            mode = colHeadTarget.find('thead th').eq(index).children('.resizer').hasClass('cursorHalf');

                        if(orgWidth < trnWidth){
                            //console.log("scroll show");
                            bol = true;
                        }else{
                            //console.log("scroll hidden");
                            if(str == "R"){
                                var widthChk = colBodyTarget.find('thead th').eq(index).innerWidth();
                                colHeadTarget.find('thead th').eq(index).css('width' , widthChk);
                                saveStorgeArr[index] = widthChk;
                            }
                            if((eventPageX - startX) > 0){
                                bol = true;
                            }else{
                                if(mode){
                                    bol = false;
                                }else{
                                    bol = true;
                                }
                            }
                        }
                    }

                    if(str == "M" && settings.resizeVer == "fix"){
                        var firstNum = parseInt(colBodyTarget.find('thead th').eq(index).css('width'));
                        var secondNum = parseInt(colBodyTarget.find('thead th').eq((index+1)).css('width'));
                        var fixTotalWidth = firstNum+secondNum;
                    }

                    if(str != "L" && bol){
                        var firstWidth = (startWidth + (eventPageX - startX))+tableProps;

                        var minusWidth = 0;
                        if(str == "M"){
                            if(orgWidth > trnWidth){
                                minusWidth = orgWidth - trnWidth;
                                if(settings.bgSpace){
                                    firstWidth = firstWidth;
                                }else{
                                    firstWidth = firstWidth+minusWidth;
                                }
                            }
                        }

                        var rememberNum = firstWidth;

                        if(firstWidth < minWidth){
                            firstWidth = minWidth;
                        }else{
                            if(settings.resizeVer == "fix"){
                                var nxWidth = (secondWidth - (eventPageX - startX))+tableProps;
                                if(nxWidth < minWidth){
                                    nxWidth = minWidth;
                                }
                                var plWidth = firstWidth+nxWidth;
                                var ovNum = 0;
                                if(fixTotalWidth < plWidth){
                                    ovNum = plWidth - fixTotalWidth;
                                }
                                firstWidth = firstWidth-ovNum;
                            }
                        }

                        if(firstWidth >= minWidth){
                             var paddingNum = iepaddingNum,
                                 scrolllen = 0,
                                 orgHeight = colBodyTarget.height(),
                                 trnHeight = $wrapper.height(),
                                 is_chrome = navigator.userAgent.indexOf('Chrome') > -1;

                            var ieNum = 1;
                            if(!settings.bgSpace){ ieNum = 0; }

                            if(is_chrome){
                                paddingNum = settings.scrollWidth;
                                if(settings.bgSpace){
                                    ieNum = 0;
                                }
                            }
                            firstWidth -= ieNum;
                            firstWidth = Math.round(firstWidth);

                            if(orgHeight > trnHeight){ scrolllen = paddingNum; }
                            if(settings.bgSpace && index >= (colHeadTarget.find('thead th').length-1) || index <= 0){
                                firstWidth -= tableProps;
                                minWidth -= tableProps;
                                rememberNum -= tableProps;
                                if(index <= 0){
                                    colBodyTarget.find('thead th').eq(index).css('width' , firstWidth);
                                }else{
                                    //th 마지막일때 스크롤 width 값 빼줌.
                                    colBodyTarget.find('thead th').eq(index).css('width' , (firstWidth-scrolllen));
                                }
                            }else{
                                colBodyTarget.find('thead th').eq(index).css('width' , firstWidth);
                            }
                            colHeadTarget.find('thead th').eq(index).css('width' , firstWidth);


                            if(settings.bgSpace){
                                var reStyle = colHeadTarget.attr("style"),
                                    editWidthArr = reStyle.split('width'),
                                    editTwoArr = editWidthArr[1].split(';'),
                                    lastNum = parseInt(editTwoArr[0].replace(/[^0-9]/g,'')),
                                    mWidth = (eventPageX - startX);

                                if((firstWidth+ieNum) == minWidth){
                                    var cul = minWidth-rememberNum;
                                    mWidth = mWidth+cul;
                                }
                                if(mWidth <= 1 && mWidth >= 0){
                                    mWidth = 0;
                                }
                                var lastTwidth = Math.floor(lastNum+mWidth);
                                colBodyTarget.css('width' , lastTwidth);

                                //if($wrapper.width() >= lastTwidth){
                                    //colBodyTarget.parent().css('width' , $wrapper.width());
                                //}else{
                                    //colBodyTarget.parent().css('width' , lastTwidth);
                                //}
                            }
                        }
                    }
                }

                if(str == "R" || str == "S"){
                    if(settings.colResize || !autoChkBol){
                        if(str == "S" && index < (colHeadTarget.find('thead th').length-1)){
                            var orgHeadWidth = colHeadTarget.find('thead th').eq(index).innerWidth();
                            orgWidthArr.push(orgHeadWidth);
                        }
                        var saveWidth = saveStorgeArr[index];
                        if(!saveWidth){
                            saveWidth = orgWidthArr[index];
                        }
                        //console.log("saveStorgeArr=="+saveStorgeArr);
                        //console.log("orgWidthArr=="+orgWidthArr);
                        colBodyTarget.find('thead th').eq(index).css('width' , saveWidth);
                        colHeadTarget.find('thead th').eq(index).css('width' , saveWidth);
                    }
                }

                if(str != "S"){
                    if(settings.resizeVer == "fix" && str == "M"){
                        var tn = index+1;
                        var nextWidth = (secondWidth - (eventPageX - startX))+tableProps;
                        if(nextWidth < minWidth){
                            nextWidth = minWidth;
                        }else{
                            var plusWidth = firstWidth+nextWidth;
                            var overNum = 0;
                            if(fixTotalWidth < plusWidth){
                                overNum = plusWidth - fixTotalWidth;
                            }
                            nextWidth = nextWidth-overNum;
                        }

                        colBodyTarget.find('thead th').eq(tn).css('width' , nextWidth);
                        colHeadTarget.find('thead th').eq(tn).css('width' , nextWidth);

                        helpers._multilineEllipsis($wrapper, tn);    //fix일 경우 뒷부분 텍스트 2줄 이상일때 줄임말표시 같이해줘야됨.
                    }
                    if(settings.resizeVer == "flex" && str == "L"){
                        if(bol){
                            $wrapper.find('.moveLine').removeClass('cursorHalf');
                        }else{
                            $wrapper.find('.moveLine').addClass('cursorHalf');
                        }
                    }
                    if (str != "L" && settings.fixColumn > 0) {
                        var $fixed = $wrapper.find('.grid-fixed-column');
                        maxTop = $fixed.find('.grid-tbody .grid-table').height() - $fixed.find('.grid-tbody').height();
                    }
                }
                //!---------------------------------------------------------
                if (str != "L"){
                    helpers._multilineEllipsis($wrapper, index);
                    helpers._theadControl($self, $wrapper, str, $divHead);

                    //픽스된 부분 col 리사이즈 될때 초기화시켜주면서 다시 생성하는 부분
                    if(columnBol && str != "S"){
                        if (settings.fixColumn > 0) {
                            if(str == "R"){
                                helpers._reSetFixedColumn($self, $wrapper, $divHead, 0, str);
                            }else{
                                if(bol){
                                    helpers._reSetFixedColumn($self, $wrapper, $divHead, index, str);
                                }
                            }
                        }
                    }

                    //!---------------------------------------------------------
                    if(str == "M" &&  settings.storageSave){
                        helpers._localStorageSave(colBodyTarget, colHeadTarget);
                    }
                }
            },

            //colResize시 resizer 요소 height값 구해주는 부분.
            _theadControl: function($self, $wrapper, str, $divHead){
                /*if (settings.fixColumn > 0) {
                    var heightNum = $wrapper.find('.grid-fixed-body .grid-thead thead th').outerHeight(true);
                    $wrapper.find('.grid-fixed-column .grid-thead thead th').css({"height":heightNum});
                }*/
                //head 높이값이 변경할때마다 뒤에 위치한 head 높이 조절해주는 부분
                var headHeight = $divHead.outerHeight(true);
                $self.css({ 'margin-top': -headHeight });

                var tbodyHeight = ($wrapper.height() - headHeight);
                if(settings.height == "100%"){
                    tbodyHeight = settings.height;
                }
                $wrapper.find('.grid-tbody').css({ 'height': tbodyHeight });
                $self.addClass('grid-init');
            },

            /*
             * colCursor
             */
            _colCursor: function(bol, colHeadTarget, $fixedColumn, $handle){
                var index = Number($handle.index());
                if(bol){
                    if(settings.fixColumn > 0){
                        $fixedColumn.find('thead th').eq(index).children('.resizer').removeClass('cursorHalf');
                    }
                    colHeadTarget.find('thead th').eq(index).children('.resizer').removeClass('cursorHalf');
                }else{
                    if(settings.fixColumn > 0){
                        $fixedColumn.find('thead th').eq(index).children('.resizer').addClass('cursorHalf');
                    }
                    colHeadTarget.find('thead th').eq(index).children('.resizer').addClass('cursorHalf');
                }
            },

            /*
             * Cookie save
             */
            _localStorageSave: function(colBodyTarget, colHeadTarget){
                /*localStorage*/
                var nameStorage = window.location.pathname+"_"+colBodyTarget.attr("id");
                colHeadTarget.find('thead th').each(function(i){
                    var headWidthStr = String($(this).innerWidth()+2);
                    var saveName = nameStorage+"_"+i;
                    localStorage.setItem(saveName, headWidthStr);
                });
            },

            /*
             * Cookie call & array save
             */
            _localStorageCall: function($self){
                /*localStorage*/
                var nameStorage = window.location.pathname+"_"+$self.attr("id");
                saveStorgeArr = [];
                $self.find('thead th').each(function(i){
                    var saveName = nameStorage+"_"+i;
                    var headWidth = parseInt(localStorage.getItem(saveName));
                    saveStorgeArr.push(headWidth);
                });
            },

            /*
             * txt cut ...
             */
            _multilineEllipsis: function($wrapper, i){
                if(i >= 0 && txtArr.length > 0 && settings.colResize){
                    var target = $wrapper.find('.grid-thead'),
                        target1 = $wrapper.find('.grid-tbody');
                    if(settings.fixColumn > 0){
                        target = $wrapper.find('.grid-fixed-body .grid-thead');
                        target1 = $wrapper.find('.grid-fixed-body .grid-tbody');
                    }
                    var classChk = target.find('thead th').eq(i).find('span').hasClass('txtBreak');
                    if(!classChk){
                        textEdit(target, i);
                        textEdit(target1, i);
                    }
                }
                function textEdit(target, i){
                    var el = target.find('.text').eq(i),
                        strHtml = String(el.html()),
                        text = strHtml.trim(),
                        plus = 0;
                    if(target.find('thead th').eq(i).hasClass('array')){
                        plus = 2;
                    }
                    var len = txtArr[i].text().replace(/ /g, '').length+plus;
                    var wn = len*11;    //11 텍스트 한글자 사이즈

                    if(len == 0){
                        var txtHtml = String(txtArr[i].html());
                        el.html(txtHtml.trim());
                    }else{
                        var targetWidth = el.parent().width();

                        if(targetWidth <= wn){
                            var nm = wn - targetWidth,
                                mn = len/wn,
                                cul = Math.ceil(len-(nm * mn));

                            text = txtArr[i].text().trim().substr(0, cul-1);
                            el.text(text.trim()+" ...");
                        }else{
                            el.text(txtArr[i].text().trim());
                        }
                    }

                    if(settings.fixColumn > 0){
                        if(len == 0){
                            var fixTargetText = target.find('thead th').eq(i).html();
                            $wrapper.find('.grid-fixed-column .grid-thead thead th').eq(i).html(fixTargetText);
                        }else{
                            var fixTargetText = target.find('thead th').eq(i).text();
                            var fixTarget = $wrapper.find('.grid-fixed-column .grid-thead thead th').eq(i);
                            fixTarget.find('.text').text(fixTargetText);
                        }
                    }
                }
            },

            /*
             * table mouse event
             */
            _mouseEvent: function($wrapper){
                var findFixedTarget = $wrapper;
                var findfixcolTarget;
                var findfixbodyTarget;
                if(settings.fixColumn > 0){
                    findfixcolTarget = findFixedTarget.find('.grid-fixed-column');
                    findfixbodyTarget = findFixedTarget.find('.grid-fixed-body');
                }else{
                    findfixcolTarget = findFixedTarget.find('.grid-tbody');
                    findfixbodyTarget = findFixedTarget.find('.grid-tbody');
                }

                // table : rowChk
                findFixedTarget.delegate('.eChkColor .rowChk', 'click', function(){
                    var figureNum = parseInt($(this).parents('tr').index()),
                        findTbodyTarget = findfixbodyTarget.find('tbody:first > tr').eq(figureNum),
                        findRowChkTarget = findTbodyTarget.find('.rowChk');

                    if($(this).is(':checked')){
                        findRowChkTarget.prop('checked', true);
                        findTbodyTarget.addClass('selected');
                    } else {
                        findRowChkTarget.prop('checked', false);
                        findTbodyTarget.removeClass('selected');
                    }

                    chkTrHover(findRowChkTarget, findFixedTarget, figureNum);
                });

                  //2022 08 30 checkbox
                  //다른 파일에서는 적용이 안되서 기존 스크립트 수정없이 추가로 붙여뒀습니다.
                  //checkbox - disabled시 class 추가(backgound 고정)
                  $('.eChkColor .rowChk, .eChkColor .allChk').click(function(){
                    if($(this).is(':checked')){
                        $(this).parents('tr').addClass('selected');
                    }else {
                        $(this).parents('tr').removeClass('selected');
                    }
                    $('.mGridTable .check-one input:disabled').parents('tr').addClass('disabled');
                });
                //


                // table : allCheck
                findFixedTarget.delegate('.allChk', 'click', function(){
                    var findThis = $(this),
                        findTable = findFixedTarget.find('table');
                    if(findTable.hasClass('eChkColor')){
                        var findRowChk = findTable.find('.rowChk').not(':disabled');

                        if(findThis.is(':checked')){
                            findRowChk.each(function(){
                                $(this).prop('checked', true);
                                if($(this).parents('table:first').hasClass('eChkColor')){
                                    $(this).parents('tr:first').addClass('selected');
                                }
                            });

                            findTable.find('.allChk').each(function(){
                                $(this).prop('checked', true);
                            });
                        } else {
                            findRowChk.each(function(){
                                $(this).prop('checked', false);
                               if($(this).parents('table:first').hasClass('eChkColor')){
                                    $(this).parents('tr:first').removeClass('selected');
                                } 
                            });

                            findTable.find('.allChk').each(function(){
                                $(this).prop('checked', false);
                            });
                        }
                        //allCheck rowspan color
                        var findNoRowChk = findfixbodyTarget.find('tbody:first > tr').each(function(i){
                            if(!$(this).children().children().hasClass('rowChk')){
                               if(findThis.is(':checked')){
                                    if(settings.fixColumn > 0){
                                        findfixcolTarget.find('tbody:first > tr').eq(i).addClass('selected');
                                    }
                                    findfixbodyTarget.find('tbody:first > tr').eq(i).addClass('selected');
                                }else{
                                    if(settings.fixColumn > 0){
                                        findfixcolTarget.find('tbody:first > tr').eq(i).removeClass('selected');
                                    }
                                    findfixbodyTarget.find('tbody:first > tr').eq(i).removeClass('selected');
                                } 
                            } 
                        });
                    }
                });

                // Table : tr hover
                findFixedTarget.delegate('.eChkColor > tbody:not(.empty) > tr', 'mouseover', function(){
                    tableTrHover($(this), findFixedTarget, "over");
                });
                findFixedTarget.delegate('.eChkColor > tbody:not(.empty) > tr', 'mouseout', function(){
                    tableTrHover($(this), findFixedTarget, "out");
                });

                //chk rowspan hover color
                function chkTrHover(findTarget, findFixedTarget, figureNum){
                    var findChkTarget = findTarget.parents('td').parent('tr'),
                        findRowspan = parseInt(findChkTarget.children().attr('rowspan'));

                    if(!findRowspan){
                        findRowspan = 0;
                    }
                    if(findRowspan > 0){
                        findTdSelected(findChkTarget, findRowspan);

                        var findPrevTarget = findTarget.parent('td').parent('tr').prev();
                        findTdSelected(findPrevTarget, 1);
                        /*var reNum = figureNum-1;
                         if(reNum <= 0){reNum = 0;}
                         var findPrevTarget = findfixbodyTarget.find('tbody:first > tr').eq(reNum);
                         findTdSelected(findPrevTarget, 1);*/
                    }

                    if(findRowspan > 1){
                        for(var i = (figureNum+1); i< (figureNum + findRowspan) ; i++){
                            if(findTarget.is(':checked')){
                                if(settings.fixColumn > 0){
                                    findfixcolTarget.find('tbody:first > tr').eq(i).addClass('selected');
                                }
                                findfixbodyTarget.find('tbody:first > tr').eq(i).addClass('selected');
                            }else{
                                if(settings.fixColumn > 0){
                                    findfixcolTarget.find('tbody:first > tr').eq(i).removeClass('selected');
                                }
                                findfixbodyTarget.find('tbody:first > tr').eq(i).removeClass('selected');
                            }
                        }
                    }
                }

                //chk rowspan td selected
                function findTdSelected(findTarget, findRowspan){
                    var len =  findTarget.children().length;
                    for(var i = 0; i<len; i++){
                        var num = parseInt(findTarget.children().eq(i).attr('rowspan'));
                        if(!num){ num = 0; }
                        if(findRowspan < num){
                            var bol = findTarget.children().eq(i).hasClass('selected');
                            if(bol){
                                findTarget.children().eq(i).removeClass('selected');
                            }else{
                                findTarget.children().eq(i).addClass('selected');
                            }
                        }
                    }
                }

                // Table : tr hover
                function tableTrHover(findTarget, findFixedTarget, str){
                    var figurei = 0;
                    var findRowspan = 0;
                    var figureindex = findTarget.index();

                    var findNoRowspan = findfixbodyTarget.find('tbody:first > tr').each(function(i){
                        var figureNum = parseInt($(this).children().attr('rowspan'));
                        if(!figureNum){
                            figureNum = 1;
                        }
                        if(figureNum >= 1){
                            figurei = i;
                            findRowspan = figureNum;

                            if(figureindex >= figurei && figureindex < (figurei + findRowspan)){
                                for(var j = figurei; j< (figurei + findRowspan) ; j++){
                                    if(str == "over"){
                                        if(settings.fixColumn > 0){
                                            findfixcolTarget.find('tbody:first > tr').eq(j).addClass('hover');
                                        }
                                        findfixbodyTarget.find('tbody:first > tr').eq(j).addClass('hover');
                                    }else{
                                        if(settings.fixColumn > 0){
                                            findfixcolTarget.find('tbody:first > tr').eq(j).removeClass('hover');
                                        }
                                        findfixbodyTarget.find('tbody:first > tr').eq(j).removeClass('hover');
                                    }
                                }
                            }else{
                                if(str == "over"){
                                    if(settings.fixColumn > 0){
                                        findfixcolTarget.find('tbody:first > tr').eq(figureindex).addClass('hover');
                                    }
                                    findfixbodyTarget.find('tbody:first > tr').eq(figureindex).addClass('hover');
                                }else{
                                    if(settings.fixColumn > 0){
                                        findfixcolTarget.find('tbody:first > tr').eq(figureindex).removeClass('hover');
                                    }
                                    findfixbodyTarget.find('tbody:first > tr').eq(figureindex).removeClass('hover');
                                }
                            }
                        }
                    });
                }
            }
        };

        // if a method as the given argument exists
        if (methods[method]) {
            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            // if an object is given as method OR nothing is given as argument
        } else if (typeof method === 'object' || !method) {
            // call the initialization method
            return methods.init.apply(this, arguments);
            // otherwise
        } else {
            // trigger an error
            $.error('Method "' +  method + '" does not exist in fixedHeaderTable plugin!');
        }

    };

})(jQuery);
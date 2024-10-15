/* global showHeaderCart, url, LANG */

$.fn.angularTemplate = function(execute) {

    var callback = this.attr('data-callback');
    var id = $(this).attr('id');
    execute = execute || false;

    if (execute === true) {
        var template = new Template({
            id: id,
            source: '#' + id,
            destination: '#' + id,
            assign: {},
            callback: callback
        }).display();
        return false;
    }

    var url = this.attr('data-url');
    if (typeof url === 'undefined') {
        return false;
    }

    //var linkParam = window.location.href.replace(/^.*\//g, '').replace('?', '&');
    var linkParam = window.location.href.replace(location.origin + '/', '').replace('?', '&');

    if (typeof id === 'undefined') {
        console.log("id is not defined for .angularTemplate element");
        return true;
    }
    $.ajax({
        url: url + '?link=' + linkParam,
        dataType: 'json',
        success: function(data) {
            for (var key in data) {
                if (key.length > 2) {
                    window[key.toUpperCase()] = data[key];
                }
            }
            var template = new Template({
                id: id,
                source: '#' + id,
                destination: '#' + id,
                assign: data,
                callback: callback
            }).display();
        }
    });
};


$.fn.urlFinder = function(attr, fn) {
    var myUrl = window.location.href.replace(/^.*?[^:\/]\//ig, '');
    this.each(function() {
        var v = $(this).attr(attr) || '';
        v = v.replace(/^\//g, '');
        //        console.log(v);
        if (v === myUrl) {
            fn($(this));
        }
    });
};

$.fn.slide = function(options) {
    return this.each(function() {
        var defaults = $.extend({
            slideType: 'fade',
            slideMove: { /* sadece dikey kullanım için */
                slideDirection: 'horizontal',
                visibleItem: 5
            },
            isFullWidth: {
                status: false,
                picRatio: 20 / 5
            },
            isAuto: true,
            stopOnMouse: true,
            changeOnMouse: false,
            slideCtrl: {
                showCtrl: false,
                wrapCtrl: '',
                nextBtn: '',
                prevBtn: ''
            },
            slidePaging: {
                showPaging: false,
                wrapPaging: ''
            },
            sliderWidth: 0,
            sliderHeight: 0,
            currentIndex: 0,
            totalSlide: 0,
            slideSpeed: 5000,
            isMobile: false,
            touchEnabled: true,
            changeFn: null
        }, options);

        var o = defaults;
        var slideParent;
        var slideWrapper = $(this);
        var slideItems = $('li', slideWrapper);
        var itemWidth = 0;
        var slidesWidth = 0;
        var slideWidth = 0;
        var slideLeft = 0;
        var parentWidth = 0;
        var slidesHeight = 0;
        var slideHeight = 0;
        var slideTop = 0;
        var parentHeight = 0;
        var findCurrent = true;
        var moveSize = 1;
        var pagingResult = false;
        var winWidth = $(window).width();

        slideParent = slideWrapper.parent().parent();
        slideParent.addClass('slide-wrapper');

        if (o.isFullWidth.status) {
            slideWrapper.parent().addClass('responsive');
            if (o.slideType === 'fade') {
                slideItems.each(function() {
                    $(this).attr('style', 'background:url("' + $(this).find('img').attr('src') + '") no-repeat');
                    $(this).find('img').remove();
                });
            }
        }

        if ($('body').find(slideWrapper)) {
            slideWrapper.addClass(o.slideType);
            o.totalSlide = $('li', slideWrapper).length;
            $('li:eq(' + o.currentIndex + ')', slideWrapper).addClass('current');
            $('.current', slideWrapper).fadeIn();
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                o.isMobile = true;
            }
            if (o.isFullWidth.status || o.slideType === 'carousel') {
                slideResizerCaller();
            }
            if (o.slideType === 'carousel') {
                $('li', slideWrapper).each(function() {
                    itemWidth += $(this).width();
                });
                if (itemWidth <= slideParent.width()) {
                    $(o.slideCtrl.wrapCtrl).remove();
                    return false;
                }
                slideWrapper.parent().addClass('carousel-wrapper');
                if (o.slideMove.slideDirection === 'vertical') {
                    if (o.slideMove.visibleItem > o.totalSlide) {
                        o.totalSlide = 1;
                        $(o.slideCtrl.wrapCtrl).remove();
                    } else {
                        $(o.slideCtrl.wrapCtrl).addClass('vertical');
                    }
                }
            }
            if (o.totalSlide > 1) {
                if (o.isAuto) {
                    var interval = setInterval(nextSlide, o.slideSpeed);
                    /*if(o.stopOnMouse){*/
                    slideParent.hover(function() {
                        clearInterval(interval);
                    }, function() {
                        interval = setInterval(nextSlide, o.slideSpeed);
                    });
                    /*}
                    else{
                        if (o.slideCtrl.showCtrl) {
                            slideParent.find(o.slideCtrl.nextBtn).hover(function () {
                                clearInterval(interval);
                            }, function () {
                                interval = setInterval(nextSlide, o.slideSpeed);
                            });
                            slideParent.find(o.slideCtrl.prevBtn).hover(function () {
                                clearInterval(interval);
                            }, function () {
                                interval = setInterval(nextSlide, o.slideSpeed);
                            });
                        }
                    }*/
                    document.addEventListener('visibilitychange', function() {
                        if (document.hidden) {
                            clearInterval(interval);
                        } else {
                            interval = setInterval(nextSlide, o.slideSpeed);
                        }
                    }, false);
                }
                if (o.slideCtrl.showCtrl) {
                    slideParent.find(o.slideCtrl.nextBtn).click(function() {
                        nextSlide();
                    });
                    slideParent.find(o.slideCtrl.prevBtn).click(function() {
                        prevSlide();
                    });
                } else {
                    $(o.slideCtrl.wrapCtrl).remove();
                }
                if (o.isMobile && o.touchEnabled) {
                    var myOptions = {
                        velocity: 0.1
                    }
                    slideWrapper.hammer(myOptions).on("swipeleft", function(ev) {
                        clearInterval(interval);
                        nextSlide();
                        interval = setInterval(nextSlide, o.slideSpeed);
                    });
                    slideWrapper.hammer(myOptions).on("swiperight", function(ev) {
                        clearInterval(interval);
                        prevSlide();
                        interval = setInterval(nextSlide, o.slideSpeed);
                    });
                }
                if (pagingDetector()) {
                    if ($('li', $(o.slidePaging.wrapPaging)).length === 0) {
                        $('li', slideWrapper).each(function() {
                            $(o.slidePaging.wrapPaging).append('<li>' + ($(this).index() + 1) + '</li>');
                        });
                    }
                    $('li:eq(0)', $(o.slidePaging.wrapPaging)).addClass('active');
                    if (o.isAuto) {
                        $('li', $(o.slidePaging.wrapPaging)).hover(function() {
                            /*clearInterval(interval);*/
                            if (o.changeOnMouse) {
                                if (o.currentIndex !== $(this).index()) {
                                    o.currentIndex = $(this).index();
                                    changeSlide(o.currentIndex);
                                }
                            }
                        }, function() {
                            /*interval = setInterval(nextSlide, o.slideSpeed);*/
                        });
                    } else {
                        $('li', $(o.slidePaging.wrapPaging)).mouseenter(function() {
                            if (o.changeOnMouse) {
                                if (o.currentIndex !== $(this).index()) {
                                    o.currentIndex = $(this).index();
                                    changeSlide(o.currentIndex);
                                }
                            }
                        });
                    }
                    $('li', $(o.slidePaging.wrapPaging)).click(function() {
                        if (o.slideType === 'carousel') {
                            if ($(this).index() !== o.currentIndex) {
                                if ($(this).index() < o.currentIndex) {
                                    moveSize = o.currentIndex - $(this).index();
                                    o.currentIndex = $(this).index();
                                    if ($(this).index() === 0) {
                                        firstSlide();
                                    } else {
                                        carouselSlide('back');
                                    }
                                } else {
                                    moveSize = $(this).index() - o.currentIndex;
                                    o.currentIndex = $(this).index();
                                    if ($(this).index() === $('li', $(o.slidePaging.wrapPaging)).length - 1) {
                                        lastSlide();
                                    } else {
                                        carouselSlide('forward');
                                    }
                                }
                                slideWrapper.css({
                                    'left': slideWidth
                                });
                                $('.active', $(o.slidePaging.wrapPaging)).removeClass('active');
                                $('li:eq(' + o.currentIndex + ')', $(o.slidePaging.wrapPaging)).addClass('active');
                            }
                        } else {
                            if (o.currentIndex !== $(this).index()) {
                                o.currentIndex = $(this).index();
                                changeSlide(o.currentIndex);
                            }
                        }
                    });
                } else {
                    $(o.slidePaging.wrapPaging).remove();
                }
            } else if (o.totalSlide === 1) {
                $(o.slideCtrl.wrapCtrl).remove();
                $(o.slidePaging.wrapPaging).remove();
            } else {
                /*$('#sliderWrap').remove();*/
                slideWrapper.closest('.slide-wrapper').remove();
            }
        }

        function nextSlide() {
            if (o.slideCtrl.showCtrl) {
                slideParent.find(o.slideCtrl.nextBtn).unbind('click');
                setTimeout(function() {
                    slideParent.find(o.slideCtrl.nextBtn).bind('click', function() {
                        nextSlide();
                    });
                }, 500);
            }
            if ($('li:last-child', slideWrapper).hasClass('current')) {
                o.currentIndex = 0;
            } else {
                o.currentIndex++;
            }
            if (o.slideType === 'carousel') {
                if (o.slideMove.slideDirection === 'horizontal') {
                    carouselSlide('forward');
                } else {
                    carouselSlide('down');
                }
            } else {
                changeSlide(o.currentIndex);
            }
        }

        function prevSlide() {
            if (o.slideCtrl.showCtrl) {
                slideParent.find(o.slideCtrl.prevBtn).unbind('click');
                setTimeout(function() {
                    slideParent.find(o.slideCtrl.prevBtn).bind('click', function() {
                        prevSlide();
                    });
                }, 500);
            }
            if ($('li:first-child', slideWrapper).hasClass('current')) {
                o.currentIndex = o.totalSlide - 1;
            } else {
                o.currentIndex--;
            }
            if (o.slideType === 'carousel') {
                if (o.slideMove.slideDirection === 'horizontal') {
                    carouselSlide('back');
                } else {
                    carouselSlide('up');
                }
            } else {
                changeSlide(o.currentIndex);
            }
        }

        function pagingDetector() {
            if (o.slidePaging.showPaging) {
                if (o.slideType === 'fade') {
                    pagingResult = true;
                } else {
                    if (o.isFullWidth.status) {
                        pagingResult = true;
                    }
                }
            }
            return pagingResult;
        }

        function changeSlide(slideIndex) {
            $('.current', slideWrapper).removeClass('current').fadeOut();
            slideWrapper.children('li:eq(' + slideIndex + ')').addClass('current').fadeIn();
            $('.active', $(o.slidePaging.wrapPaging)).removeClass('active');
            $('li:eq(' + slideIndex + ')', $(o.slidePaging.wrapPaging)).addClass('active');
            if (o.changeFn !== null && typeof o.changeFn === 'function') {
                o.changeFn.call(this, slideIndex);
            }
        }

        function carouselSlide(direction) {
            if (o.slideMove.slideDirection === 'horizontal') {
                if (direction === 'forward') {
                    if (Math.floor(slideLeft + $('.current', slideWrapper).width()) > Math.floor(slideWrapper.width() - parentWidth)) {
                        firstSlide();
                    } else {
                        $('.current', slideWrapper).removeClass('current').next().addClass('current');
                        /*slideWidth = '-=' + $('.current', slideWrapper)[0].getBoundingClientRect().width;*/
                        slideWidth = '-=' + $('.current', slideWrapper).width();
                        slideLeft += $('.current', slideWrapper).width();
                    }
                } else {
                    if (slideLeft - $('.current', slideWrapper).width() < 0) {
                        lastSlide();
                    } else {
                        $('.current', slideWrapper).removeClass('current').prev().addClass('current');
                        /*slideWidth = '+=' + $('.current', slideWrapper)[0].getBoundingClientRect().width;*/
                        slideWidth = '+=' + $('.current', slideWrapper).width();
                        slideLeft -= $('.current', slideWrapper).width();
                    }
                }
                slideWrapper.css({
                    'left': slideWidth
                });
            } else {
                if (direction === 'up') {
                    if ($('.current', slideWrapper).index() > 0) {
                        slideHeight += Math.ceil($('.current', slideWrapper).prev()[0].getBoundingClientRect().height);
                        $('.current', slideWrapper).removeClass('current').prev().addClass('current');
                        slidesHeight = 0;
                        for (var i = $('.current', slideWrapper).index(); i < ($('.current', slideWrapper).index() + o.slideMove.visibleItem); i++) {
                            slidesHeight += Math.ceil($('li:eq(' + i + ')', slideWrapper)[0].getBoundingClientRect().height);
                        }
                    } else {
                        $('.current', slideWrapper).removeClass('current');
                        $('li:eq(' + (o.totalSlide - o.slideMove.visibleItem) + ')', slideWrapper).addClass('current');
                        slideHeight = 0;
                        slidesHeight = 0;
                        for (var i = $('.current', slideWrapper).index(); i <= (o.totalSlide - 1); i++) {
                            slidesHeight += Math.ceil($('li:eq(' + i + ')', slideWrapper)[0].getBoundingClientRect().height);
                        }
                        for (var i = 0; i < $('.current', slideWrapper).index(); i++) {
                            slideHeight -= Math.ceil($('li:eq(' + i + ')', slideWrapper)[0].getBoundingClientRect().height);
                        }
                    }
                } else {
                    if (($('.current', slideWrapper).index() + o.slideMove.visibleItem) <= (o.totalSlide - 1)) {
                        slideHeight -= Math.ceil($('.current', slideWrapper)[0].getBoundingClientRect().height);
                        $('.current', slideWrapper).removeClass('current').next().addClass('current');
                        slidesHeight = 0;
                        for (var i = $('.current', slideWrapper).index(); i < ($('.current', slideWrapper).index() + o.slideMove.visibleItem); i++) {
                            slidesHeight += Math.ceil($('li:eq(' + i + ')', slideWrapper)[0].getBoundingClientRect().height);
                        }
                    } else {
                        $('.current', slideWrapper).removeClass('current');
                        $('li:first-child', slideWrapper).addClass('current');
                        slideHeight = 0;
                        slidesHeight = 0;
                        for (var i = $('.current', slideWrapper).index(); i < ($('.current', slideWrapper).index() + o.slideMove.visibleItem); i++) {
                            slidesHeight += Math.ceil($('li:eq(' + i + ')', slideWrapper)[0].getBoundingClientRect().height);
                        }
                    }
                }
                slideWrapper.css({
                    'top': slideHeight
                }).parent().css({
                    'height': slidesHeight
                });
            }
            $('.active', $(o.slidePaging.wrapPaging)).removeClass('active');
            $('li:eq(' + o.currentIndex + ')', $(o.slidePaging.wrapPaging)).addClass('active');
            if (o.changeFn !== null && typeof o.changeFn === 'function') {
                o.changeFn.call(this, o.currentIndex);
            }
        }

        function firstSlide() {
            $('.current', slideWrapper).removeClass('current');
            $('li:first-child', slideWrapper).addClass('current');
            slideWidth = 0;
            slideLeft = 0;
        }

        function lastSlide() {
            $('.current', slideWrapper).removeClass('current');
            $('li:last-child', slideWrapper).addClass('current');
            slideWidth = '-' + (slideWrapper.width() - parentWidth) + 'px';
            slideLeft = slideWrapper.width() - parentWidth;
        }

        function slideResizerCaller() {
            slideResizer('firstLoad');
            $(window).resize(function() {
                if (winWidth !== $(window).width()) {
                    slideResizer('winResize');
                    winWidth = $(window).width();
                }
            });
        }

        function slideResizer(clbkType) {
            if (o.isFullWidth.status) {
                if (o.slideType === 'fade') {
                    o.sliderWidth = $(window).width() + 'px';
                    o.sliderHeight = ($(window).width() / o.isFullWidth.picRatio) + 'px';
                    slideWrapper.css({
                        'width': o.sliderWidth,
                        'height': o.sliderHeight
                    });
                }
            }
            if (o.slideType === 'carousel') {
                if (clbkType === 'firstLoad') {
                    carouselResizer();
                } else {
                    /*if ($(window).width() <= 1200) {*/
                    carouselResizer();
                    /*}*/
                }
            }
        }

        function carouselResizer() {
            slideWrapper.removeClass('ease');
            /*if ($(window).width() <= 768) {
             parentWidth = 620;
             }
             else {*/
            parentWidth = slideWrapper.parent().width();
            /*}*/
            slideWrapper.removeAttr('style');
            slideItems.removeAttr('style');
            if (o.slideMove.slideDirection === 'horizontal') {
                slidesWidth = 0;
                slideLeft = 0;
                slideItems.each(function() {
                    if (isIE) {
                        $(this).width(Math.ceil($(this)[0].getBoundingClientRect().width));
                        slidesWidth += Math.ceil($(this)[0].getBoundingClientRect().width);
                    } else {
                        $(this).width($(this)[0].getBoundingClientRect().width);
                        slidesWidth += $(this)[0].getBoundingClientRect().width;
                    }
                    if (findCurrent) {
                        if ($(this).hasClass('current')) {
                            findCurrent = false;
                        } else {
                            slideLeft += $(this)[0].getBoundingClientRect().width;
                        }
                    }
                    if (slideWidth !== 0) {
                        slideWidth = '-' + slideLeft;
                    }
                });
                slideWrapper.css({
                    'width': slidesWidth,
                    'left': slideWidth
                });
            } else {
                if (o.totalSlide > o.slideMove.visibleItem) {
                    slidesHeight = 0;
                    slideHeight = 0;
                    for (var i = o.currentIndex; i < (o.currentIndex + o.slideMove.visibleItem); i++) {
                        slidesHeight += Math.ceil(slideItems[i].getBoundingClientRect().height);
                    }
                    slideWrapper.css({
                        'top': slideHeight
                    }).parent().css({
                        'height': slidesHeight
                    });
                }
            }
            slideWrapper.addClass('ease');
            findCurrent = true;
        }
    });
};

$.fn.equalizer = function(options) {
    return this.each(function() {
        var defaults = $.extend({
            equalItem: '.productDetails'
        }, options);

        var o = defaults;
        var equalWrapper = '#' + $(this).attr('id');
        var maxHeight = 0;

        if ($('body').find(equalWrapper)) {
            heightEqualizeCaller();
        }

        function heightEqualize(wrapper, item) {
            if ($(wrapper).find('.showcase').length > 0) {
                $(wrapper).find('.showcase').each(function() {
                    $(this).find(item).each(function() {
                        if ($(this).height() > maxHeight) {
                            maxHeight = $(this).height();
                        }
                    }).promise().done(function() {
                        $(this).parents('.showcase').find(item).each(function() {
                            $(this).height(maxHeight);
                        });
                    });
                    maxHeight = 0;
                });
            } else {
                $(wrapper).find(item).each(function() {
                    if ($(this).height() > maxHeight) {
                        maxHeight = $(this).height();
                    }
                }).promise().done(function() {
                    $(this).parents(wrapper).find(item).each(function() {
                        $(this).height(maxHeight);
                    });
                });
                maxHeight = 0;
            }
        }

        function heightEqualizeCaller() {
            heightEqualize(equalWrapper, o.equalItem);
            $(window).resize(function() {
                if ($(window).width() <= 1200) {
                    maxHeight = 0;
                    $(equalWrapper).find(o.equalItem).removeAttr('style');
                    heightEqualize(equalWrapper, o.equalItem);
                }
            });
        }
    });
};


$.fn.popup = function(options) {
    return this.each(function() {
        var defaults = $.extend({
            popupBtn: '.popupBtn',
            popupTitle: true,
            popupBtns: true
        }, options);

        var o = defaults;
        var popupWrapper = $(this);
        var popupTitleDiv = $('#popupTitle');
        var popupTextDiv = $('#popupInner');
        var popupBtnsDiv = $('#popupCustomBtns');
        var wWidth;
        var wHeight;
        var pTrueWidth;
        var pWidth;
        var pHeight;
        var mLeft;
        var mTop;

        $(o.popupBtn).on('click', function() {
            popupFill(popupWrapper);
        });
        $('#popupClose').on('click', function() {
            popupClose();
        });
        $('#closeBtn').on('click', function() {
            popupClose();
        });
        $('#popupShadow').on('click', function() {
            popupClose();
        });
        $('body').on('keyup', function(e) {
            if (e.keyCode === 27) {
                popupClose();
            }
        });

        function popupFill(popupWrapper) {
            if (o.popupTitle) {
                hideBlock(popupTitleDiv);
                popupTitleDiv.html(popupWrapper.find('.popupTitle').html());
            } else {
                showBlock(popupTitleDiv);
            }
            popupTextDiv.html(popupWrapper.find('.popupText').html());
            if (o.popupBtns) {
                hideBlock($('#popupBtns'));
                popupBtnsDiv.html(popupWrapper.find('.popupBtns').html());
            } else {
                showBlock($('#popupBtns'));
            }
            setTimeout(function() {
                popupOpen();
            }, 250);
        }

        function hideBlock(block) {
            if (block.hasClass('hideThis')) {
                block.removeClass('hideThis');
            }
        }

        function showBlock(block) {
            if (!block.hasClass('hideThis')) {
                block.addClass('hideThis');
            }
        }

        function popupOpen() {
            popupWrapper.find('.popupTitle').empty();
            popupWrapper.find('.popupText').empty();
            popupWrapper.find('.popupBtns').empty();
            $('#popup').fadeIn().addClass('active');
            resizePopupCaller();
        }

        function resizePopupCaller() {
            pTrueWidth = $('#popupWrap').width();
            resizePopup('firstOpen');
            popupTextDiv.bind('DOMSubtreeModified', function() {
                $('#popupWrap').stop();
                if ($('#popup').hasClass('active')) {
                    resizePopup('opened');
                }
            });
            $(window).resize(function() {
                if ($('#popup').hasClass('active')) {
                    resizePopup('opened');
                }
            });
        }

        function resizePopup(clbkType) {
            $('#popupWrap').css({
                'width': 'auto'
            });
            wWidth = $(window).width();
            wHeight = $(window).height();
            pWidth = $('#popupWrap').width();
            pHeight = $('#popupWrap').height();
            mLeft = (wWidth - pWidth) / 2;
            mTop = pHeight / 2;
            mBottom = 0;
            if ($(window).width() < 1200) {
                if (pWidth >= (wWidth - 100)) {
                    pWidth = wWidth - 100;
                    mLeft = 50;
                }
            }
            if ($(window).width() > 769) {
                if (pHeight > (wHeight - 100)) {
                    mTop = mBottom = 50;
                } else {
                    mTop = (wHeight - pHeight) / 2;
                    mBottom = 0;
                }
            } else {
                mTop = mBottom = 50;
            }
            $('#popupWrap').css({
                'width': pWidth + 'px',
                'marginLeft': mLeft + 'px'
            });
            if (clbkType === 'opened') {
                $('#popupWrap').css({
                    'marginTop': mTop + 'px',
                    'marginBottom': mBottom + 'px',
                    'top': 0
                });
            } else {
                setTimeout(function() {
                    $('#popupWrap').css({
                        'marginTop': mTop + 'px',
                        'marginBottom': mBottom + 'px',
                        'top': 0
                    });
                }, 250);
            }
        }

        function popupClose() {
            $('#popup').fadeOut().removeClass('active');
            setTimeout(function() {
                clearPopup();
                popupTitleDiv.empty();
                popupTextDiv.empty();
                popupBtnsDiv.empty();
            }, 250);
        }

        function clearPopup() {
            $('#popupWrap').removeAttr('style');
        }
    });
};



jQuery.cookie = function(name, value, options) {
    if (typeof value !== 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires === 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/*var easyPopup = {
 pagePopup: function (pageUrl) {
 var loadCallback = function () {
 loading.hide($('#popupInner'));
 subProListener();
 qtyControl();
 };
 $('#windowPopup .popupText').load(pageUrl + ' #pageContent', function () {
 $('#windowPopupBtn').trigger('click');
 loading.show($('#popupInner'));
 setTimeout(function () {
 loadScripts(pageUrl, '#pageScripts', '#popupInner', loadCallback);
 }, 250);
 });
 },
 blockPopup: function (blockName, parameters) {
 $.ajax({
 type: "POST",
 url: "ajax.php",
 dataType: "json",
 data: {
 m: 'Block',
 fn: 'initPopup',
 block: blockName,
 params: parameters
 },
 complete: function (jsonObj) {
 jsonObj = $.parseJSON(jsonObj.responseText);
 if (jsonObj.success === 'true') {
 if (blockName === 'UyeGiris') {
 $('#windowPopup .popupText').html('<div class="box p-bottom" id="memberPopupWrapper">' + jsonObj.data.content + '</div>');
 }
 else {
 $('#windowPopup .popupText').html('<div class="box p-bottom">' + jsonObj.data.content + '</div>');
 }
 $('#windowPopupBtn').trigger('click');
 }
 else {
 if (jsonObj.url == 'UyeGiris') {
 easyPopup.blockPopup('UyeGiris', '');
 }
 else {
 console.log(jsonObj);
 }
 }
 }
 });
 },
 ajaxPopup: function (ajaxUrl) {
 $('#windowPopup .popupText').load(ajaxUrl, function () {
 $('#windowPopupBtn').trigger('click');
 });
 },
 panelPopup: function (title, content, btn) {
 $('#panelPopup .popupTitle').html(title);
 $('#panelPopup .popupText').html(content);
 $('#panelPopup .popupBtns').html(btn);
 $('#panelPopupBtn').trigger('click');
 },
 windowPopup: function (content) {
 $('#windowPopup .popupText').html(content);
 $('#windowPopupBtn').trigger('click');
 }
 }*/

function ajaxPost(form) {
    $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: form.serialize(),
        success: function(msg) {
            location.reload();
        }
    });
}

function loadScripts(pageUrl, scriptWrapper, targetObj, callbackFn) {
    $.ajax({
        url: pageUrl,
        cache: false,
        success: function(response) {
            $(targetObj).append($(response).find(scriptWrapper));
            if (callbackFn !== 'undefined' && callbackFn !== '' && typeof callbackFn === 'function') {
                callbackFn();
            }
        }
    });
}

var tooltip = {
    show: function(item, message, duration, classes) {
        var tooltipWrapper = item.closest('.tooltipWrapper');
        if (tooltipWrapper.find('.tooltip').length == 0) {
            if (classes !== '' && classes !== 'undefined') {
                tooltipWrapper.append('<span class="tooltip ' + classes + '">' + message + '</span>');
            } else {
                tooltipWrapper.append('<span class="tooltip">' + message + '</span>');
            }
            tooltipWrapper.find('.tooltip').fadeIn();
            var offTop = (tooltipWrapper.find('.tooltip').offset().top + (tooltipWrapper.height() / 2)) - ($(window).height() / 2);
            if ($('body').hasClass('popupActive')) {
                var offTopPwin = tooltipWrapper.closest('.pWin')[0].offsetTop;
                offTop = tooltipWrapper[0].offsetTop;
                $('.pWrapper .pWin.overflow .pText').animate({
                    scrollTop: (offTopPwin - offTop)
                }, 800);
            } else {
                $('html, body').animate({
                    scrollTop: offTop
                }, 800);
            }
            if (duration !== false && duration === 'undefined') {
                duration = 3000;
            }
            if (duration !== false && duration !== 'undefined') {
                setTimeout(function() {
                    tooltip.hide(item);
                }, duration + 250);
            }
        }
    },
    hide: function(item) {
        item.closest('.tooltipWrapper').find('.tooltip').fadeOut();
        setTimeout(function() {
            item.closest('.tooltipWrapper').find('.tooltip').remove();
        }, 250);
    },
    hideAll: function() {
        $('.tooltip').remove();
    }
};

var notify = {
    position: 'top right',
    show: function(message, duration, classes) {
        if ($('body').find('#notify').length === 0) {
            var notifyWrap = $('<div>');
            notifyWrap.attr({
                'id': 'notify',
                'class': notify.position
            });
            $('body').append(notifyWrap);
        }
        var notifyId = $('.notify').length > 0 ? parseInt($('.notify').last().attr('data-order')) + 1 : 0;
        var currentNotify = $('<span>');
        currentNotify.attr({
            'class': 'notify',
            'data-order': notifyId
        });
        if (duration === false) {
            message = '<span class="notifyClose" data-order="' + notifyId + '"></span>' + message;
        }
        currentNotify.html(message);
        if (classes !== '' && classes !== 'undefined') {
            currentNotify.addClass(classes);
        }
        currentNotify.appendTo('#notify').fadeIn();
        if (duration !== false && duration === 'undefined') {
            duration = 3250;
        }
        if (duration !== false && duration !== 'undefined') {
            setTimeout(function() {
                notify.hide(notifyId);
            }, duration + 250);
        }
        $('.notifyClose').on('click', function() {
            notify.hide($(this).attr('data-order'));
        });
    },
    hide: function(notifyId) {
        $('#notify').find('.notify[data-order="' + notifyId + '"]').fadeOut();
        setTimeout(function() {
            $('#notify').find('.notify[data-order="' + notifyId + '"]').remove();
            if ($('.notify').length < 1) {
                notify.hideAll();
            }
        }, 250);
    },
    hideAll: function() {
        $('#notify').remove();
    }
};

var loading = {
    show: function(item) {
        item.closest('.loaderWrapper').append('<span class="loading"></span>');
        item.closest('.loaderWrapper').find('.loading').fadeIn();
    },
    hide: function(item) {
        item.closest('.loaderWrapper').find('.loading').finish().fadeOut();
        setTimeout(function() {
            item.closest('.loaderWrapper').find('.loading').remove();
        }, 250);
    }
};

$.fn.lightbox = function() {
    var slideWrapper = $(this);
    var imgList = [];
    var imgIndex = 0;
    var lightContent = '';

    slideWrapper.each(function() {
        imgList.push($(this).attr('href'));
    });

    slideWrapper.click(function(e) {
        e.preventDefault();
        imgIndex = $(this).attr('data-index');
        lightContent = '<img src="' + imgList[imgIndex] + '" id="lightBox" />';
        if (imgList.length > 1) {
            lightContent += '<div id="lightControl">' +
                '<div class="fl col-12">' +
                '<span id="prevLight" class="fl"></span>' +
                '<span id="nextLight" class="fr"></span>' +
                '</div>' +
                '</div>';
        }
        var lightPopup = new Message({
            id: 'light-box',
            html: '<div id="lightContent" class="loaderWrapper">' + lightContent + '</div>',
            openingCallback: function popupCallback() {
                lightCallback();
            }
        });
        lightPopup.show();
    });

    if (imgList.length > 1) {
        $(document).on('click', '#nextLight', function() {
            if (imgIndex < imgList.length - 1) {
                imgIndex++;
            } else {
                imgIndex = 0;
            }
            changeImg();
        });
        $(document).on('click', '#prevLight', function() {
            if (imgIndex > 0) {
                imgIndex--;
            } else {
                imgIndex = imgList.length - 1;
            }
            changeImg();
        });
    }

    function changeImg() {
        loading.show($('#lightContent'));
        $('#lightBox').attr('src', imgList[imgIndex]);
        loading.hide($('#lightContent'));
        var maxH = $('.pWin:last').height();
        var contentHeight = $('#lightContent').height();
        var contentWidth = $('#lightContent').width();
        if (contentHeight > maxH) {
            $('.pWin:last').addClass('overflow').width(contentWidth + 10);
        } else {
            $('.pWin:last').removeClass('overflow');
        }
    }
};

var basketStatus = {
    success: function(item, duration) {
        $('a[data-parent="' + item + '"]').addClass('success');
        if (duration !== false && duration !== 'undefined') {
            setTimeout(function() {
                basketStatus.clear(item);
            }, duration);
        }
    },
    error: function(item, duration) {
        $('a[data-parent="' + item + '"]').addClass('error');
        if (duration !== false && duration !== 'undefined') {
            setTimeout(function() {
                basketStatus.clear(item);
            }, duration);
        }
    },
    clear: function(item) {
        $('a[data-parent="' + item + '"]').removeClass('error success');
    }
};

function childFinder(wrapper) {
    var tagName = wrapper.prop('tagName') || 'A';
    console.log(tagName);
    return tagName.toLowerCase();
}

/*function subValue(item) {
 switch (childFinder(item)) {
 case 'a':
 $('#subPro' + item.attr('data-target')).val(item.attr('data-id'));
 break;
 case 'select':
 $('#subPro' + item.find('option:selected').attr('data-target')).val(item.find('option:selected').val());
 break;
 default:
 console.log('other');
 }
 }
 
 var subProType;
 function subProListener() {
 var subProWrap = $('.subProWrapper');
 subProWrap.each(function () {
 if (!$(this).hasClass('loaded')) {
 $(this).addClass('loaded');
 subProType = childFinder($(this).children());
 subProChanger($(this), subProType);
 }
 });
 }
 
 function subProChanger(subProWrap, subProType) {
 switch (subProType) {
 case 'a':
 subProWrap.attr('data-product', subProWrap.children().attr('data-target'));
 subProWrap.children('a').on('click', function () {
 if (!$(this).hasClass('selected')) {
 findSubProduct(subProWrap, $(this).attr('data-target'), $(this));
 $(this).parent('.subProWrapper').find('a').removeClass('selected');
 $(this).addClass('selected');
 }
 });
 break;
 case 'select':
 subProWrap.attr('data-product', subProWrap.find('option').attr('data-target'));
 subProWrap.children('select').on('change', function () {
 var option = $(this).find('option:selected');
 findSubProduct(subProWrap, option.attr('data-target'), $(this));
 });
 break;
 default:
 console.log('other');
 }
 }
 
 var subOrder;
 var subId;
 function findSubProduct(subProWrap, proId, item) {
 loading.show(item);
 subOrder = subProWrap.attr('data-order');
 subId = item.attr('data-id');
 if (subOrder == 1) {
 $.ajax({
 url: '/srv/service/product/get-sub-two/' + proId + '/' + item.attr('data-id'),
 dataType: 'json',
 success: function (items) {
 subProFiller(subProWrap, proId, items);
 if (items.length == 1) {
 //$('a[data-id='+items[0].id+']').trigger('click');
 //$('#subPro' + proId).val(items[0].id);
 $('#subPro' + proId).val(items[0].id);
 }
 loading.hide(item);
 basketStatus.clear(proId);
 closeVariant();
 }
 });
 if ($('li[data-type="' + subId + '"]').length > 0) {
 $('#productThumbs').css('left', 0);
 $('li[data-type="' + subId + '"]').fadeIn();
 $('li[data-type="' + subId + '"]:eq(0)').trigger('click');
 $('#productThumbs').addClass('filtered');
 $('#productThumbs li').not('[data-type="' + subId + '"]').fadeOut();
 $('#thumbControl').fadeOut();
 $('#imageControl').fadeOut();
 }
 else {
 if ($('#productThumbs').hasClass('filtered')) {
 $('#productThumbs').css('left', 0);
 $('#productThumbs li').fadeIn();
 $('#productThumbs li:eq(0)').trigger('click');
 $('#thumbControl').fadeIn();
 $('#imageControl').fadeIn();
 }
 }
 }
 else {
 subValue(item);
 loading.hide(item);
 basketStatus.clear(proId);
 }
 }
 
 function subProFiller(subProWrap, proId, items){
 var html = '';
 var loadedSubType = childFinder($('[data-order=2][data-product=' + proId + ']').children());
 switch (loadedSubType){
 case 'a':
 for (var i = 0; i < items.length; i++){
 if(items[i].stock == 0){
 html += '<a data-id="' + items[i].id + '" data-target="' + proId + '" class="passive"><p>' + items[i].name + '</p></a>';
 }
 else{
 html += '<a data-id="' + items[i].id + '" data-target="' + proId + '"><p>' + items[i].name + '</p></a>';
 }
 }
 break;
 case 'select':
 for (var i = 0; i < items.length; i++){
 if(items[i].stock == 0){
 html += '<option value="' + items[i].id + '" data-target="' + proId + '" disabled="disabled">' + items[i].name + '</option>';
 }
 else{
 html += '<option value="' + items[i].id + '" data-target="' + proId + '">' + items[i].name + '</option>';
 }
 }
 html = '<select name="subPro' + proId + '"><option value="" data-target="' + proId + '">Seçiniz...</option>' + html + '</select>';
 break;
 default:
 console.log('other');
 }
 $('[data-order=2][data-product=' + proId + ']').html(html);
 subProChanger($('[data-order=2][data-product=' + proId + ']'), loadedSubType);
 }*/

var windowTop;
var windowHeight;
var itemTop;
var currentItem;

function lazy(item) {
    $(window).on('load', function() {
        lazyControl(item);
    });
    $(window).scroll(function() {
        lazyControl(item);
    });
    $(window).resize(function() {
        lazyControl(item);
    });
}

function lazyControl(item) {
    windowTop = $(window).scrollTop();
    windowHeight = $(window).height();
    $('.' + item).each(function() {
        currentItem = $(this);
        /*itemTop = currentItem.offset().top + currentItem.height();*/
        itemTop = currentItem.parent().offset().top;
        if ((windowTop + windowHeight) >= itemTop) {
            loadImage(currentItem, item);
        }
    });
}

function loadImage(item, lazyClass) {
    $(item).fadeOut(250);
    setTimeout(function() {
        $(item).removeClass(lazyClass).attr('src', $(item).attr('data-src'));
        $(item).on('load', function() {
            $(item).fadeIn().removeAttr('data-src');
        });
        setTimeout(() => {
            $(item).removeAttr('style');
        }, 500);
    }, 250);
}

function inputControl() {
    $('.form-control').each(function() {
        var input = $(this).find('input');
        var inputType = input.attr('type');
        var inputWrap = $(this).find('.input-wrap');
        if (inputType === 'radio' || inputType === 'checkbox') {
            inputWrap.addClass(inputType);
        }
        if (input.is(':checked')) {
            inputWrap.addClass('active');
            if ($(this).hasClass('lightBg')) {
                $(this).removeClass('lightBg').addClass('darkBg');
            }
        } else {
            inputWrap.removeClass('active');
            if ($(this).hasClass('darkBg')) {
                $(this).removeClass('darkBg').addClass('lightBg');
            }
        }
    });
}

var discounts = [];

function qtyControl() {
    var qty;
    var qtyId;
    var qtyWrap;
    $(document).on('click', '.qtyBtns a', function() {
        qtyWrap = $(this).parent();
        var incStr = qtyWrap.attr('data-increment') || '1';
        var inc = parseFloat(incStr);
        var a = 0;
        if (incStr.indexOf('.') > -1) {
            a = incStr.replace(/^.*?\./g, '').trim().length;
        }
        qtyId = $(this).attr('data-id');
        var domBtn = $('#Adet' + qtyId + '[type="text"],#Adet' + qtyId + '[type="number"]');
        qty = parseFloat(domBtn.val() || '1');
        switch ($(this).attr('title')) {
            case '+':
                qty += inc;

                var qtyStock = qtyWrap.find('input').data('stock');
                if(qtyStock && qty > qtyStock) {
                    qty = qtyStock;
                }
                break;
            case '-':   
                qty -= inc;
                        
                var min = parseInt((domBtn.attr('min')) ? domBtn.attr('min') : 1);                
                if (qty < min) {
                    qty = min;
                }
                break;
            default:
        }
        domBtn.val(qty.toFixed(a)).trigger('input');
        if (!qtyWrap.hasClass('detected')) {
            qtyWrap.addClass('detected');
            $('.discounts').each(function() {
                discounts.push({
                    index: $(this).index(),
                    min: $(this).attr('data-min'),
                    max: $(this).attr('data-max'),
                    percent: $(this).attr('data-percent')
                });
            });
        }

        if (qtyWrap.attr('data-multiple-disc')) {
            multipleDiscount(qty.toFixed(a));
        }

        var cb = $(this).attr('data-callback');
        if (typeof cb !== 'undefined' && typeof window[cb] === 'function') {
            window[cb](qtyId, qty.toFixed(a));
        }
    });


    $(document).on('change', '.qtyBtns input', function() {
        var self = $(this);
        var min = (self.attr('min')) ? self.attr('min') : 1;
        var qtyWrap = self.parent();
        if (!qtyWrap.hasClass('detected') && discounts.length < 1) {
            qtyWrap.addClass('detected');
            $('.discounts').each(function() {
                discounts.push({
                    index: $(this).index(),
                    min: $(this).attr('data-min'),
                    max: $(this).attr('data-max'),
                    percent: $(this).attr('data-percent')
                });
            });
        }
        if (parseInt(self.val()) < parseInt(min)) {
            self.val(min);
        }
        if (qtyWrap.attr('data-multiple-disc')) {
            multipleDiscount(self.val());
        }
    });
}

function multipleDiscount(quantity) {
    $('.currentDiscount').removeClass('currentDiscount');
    $('.discountPrice').find('span').text($('.discountPrice').data('old'));
    var oldPrice = $('.discountPrice').data('old');
    $.each(discounts, function() {
        if (parseFloat(this.min) <= parseFloat(quantity) && parseFloat(this.max) >= parseFloat(quantity)) {
            $('.discounts').eq(this.index).addClass('currentDiscount');
            // var oldPrice = parseFloat($('.discountPrice').data('old').replace('.','').replace(',','.'));

            // if(SEP_DEC  == "," && SEP_THO  == "."){
            //     oldPrice.replace(/\./g, "").replace(",", ".");
            // }
            // oldPrice = parseFloat(oldPrice);

            var parsePrice = SEP_THO === ',' ? parseFloat(oldPrice.replace(',', '')) : SEP_DEC == "," ? parseFloat(oldPrice.replace('.', '').replace(',', '.')) : parseFloat(oldPrice);
            var groupPrice = (parsePrice * (100 - parseFloat(this.percent)) / 100);
            $('.discountPrice').find('span').text(format(groupPrice));
        }
    });
}

function placeholder() {
    $('input').each(function() {
        if ($(this).attr('placeholder') && !$(this).hasClass('phone') && !$(this).hasClass('withPlace') && !$(this).hasClass('loadedPlace')) {
            $(this).addClass('withHolder loadedPlace').parent().append('<span class="col placeholder hideThis">' + $(this).attr('placeholder') + '</span>');
            if ($(this).val() === '') {
                $(this).parent().find('.placeholder').removeClass('hideThis');
            }
        }
    }).promise().done(function() {
        $('textarea').each(function() {
            if ($(this).attr('placeholder') && !$(this).hasClass('withPlace') && !$(this).hasClass('loadedPlace')) {
                $(this).addClass('withHolder loadedPlace').parent().append('<span class="col placeholder hideThis">' + $(this).attr('placeholder') + '</span>');
                if ($(this).val() === '') {
                    $(this).parent().find('.placeholder').removeClass('hideThis');
                }
            }
        }).promise().done(function() {
            $('select').each(function() {
                console.log($(this));
                if ($(this).attr('data-holder') && !$(this).hasClass('loadedPlace')) {
                    $(this).addClass('withHolder loadedPlace').parent().append('<span class="col placeholder">' + $(this).attr('data-holder') + '</span>');
                }
            }).promise().done(function() {
                $('.placeholder').bind('click', function() {
                    $(this).addClass('hideThis').parent().find('.withHolder').focus();
                });
                $('.withHolder').bind('focus', function() {
                    $(this).parent().find('.placeholder').addClass('hideThis');
                });
                $('.withHolder').bind('blur', function() {
                    if ($(this).val() === '' && $(this)[0].nodeName.toLowerCase() != 'select') {
                        $(this).parent().find('.placeholder').removeClass('hideThis');
                    }
                });
            });
        });
    });
}

/* Dicle ve üzeri sürümler için*/
function flexPlace() {
    $('input').each(function() {
        var placeholderText = ($(this).attr('data-placeholder2') && $(this).attr('data-placeholder2') != '') ? $(this).attr('data-placeholder2') : $(this).attr('placeholder');
        if (typeof placeholderText != 'undefined' && !$(this).hasClass('withPlace') && !$(this).hasClass('loadedPlace')) {
            $(this).addClass('withHolder loadedPlace').parent().append('<span class="col ease placeholder focus">' + placeholderText + '</span>');
            if ($(this).val() === '') {
                $(this).parent().find('.placeholder').removeClass('focus');
            }
        }
    }).promise().done(function() {
        $('textarea').each(function() {
            var placeholderText = ($(this).attr('data-placeholder2') && $(this).attr('data-placeholder2') != '') ? $(this).attr('data-placeholder2') : $(this).attr('placeholder');
            if (typeof placeholderText != 'undefined' && !$(this).hasClass('withPlace') && !$(this).hasClass('loadedPlace')) {
                $(this).addClass('withHolder loadedPlace').parent().append('<span class="col ease placeholder focus">' + placeholderText + '</span>');
                if ($(this).val() === '') {
                    $(this).parent().find('.placeholder').removeClass('focus');
                }
            }
        }).promise().done(function() {
            $('select').each(function() {
                if ($(this).attr('data-holder') && !$(this).hasClass('loadedPlace')) {
                    $(this).addClass('withHolder loadedPlace').parent().append('<span class="col ease placeholder focus">' + $(this).attr('data-holder') + '</span>');
                }
            }).promise().done(function() {
                $('.placeholder').bind('click', function() {
                    $(this).addClass('focus').parent().find('.withHolder').focus();
                });
                $('.withHolder').bind('focus', function() {
                    $(this).parent().find('.placeholder').addClass('focus');
                });
                $('.withHolder').bind('blur', function() {
                    if ($(this).val() === '' && $(this)[0].nodeName.toLowerCase() != 'select') {
                        $(this).parent().find('.placeholder').removeClass('focus');
                    }
                });
            });
        });
    });
}
/* Dicle ve üzeri sürümler için*/

function colToggle(col) {
    if ($(window).width() < 769) {
        col.toggleClass('active');
        col.next('div').slideToggle();
    }
}

function productComparison(item) {
    item.toggleClass('active');
    item.prev('.karsilastirma').attr('checked', !item.prev('.karsilastirma').attr('checked'));
    sendCompareProductId(item.prev('.karsilastirma').val());
    return false;
}

function karsilastirmaKontrol() {
    return true;
}

function sendCompareProductId(proId) {
    /*console.log(proId);*/
    $.ajax({
        type: "POST",
        url: "./conn/product/compare/addId",
        data: {
            productId: proId
        },
        success: function(msg) {
            /*console.log(msg);*/
        }
    });
}

function urunKarsilastir() {
    var width = 0;
    $.each($('input.karsilastirma:checked'), function() {
        $(this).attr("checked", false);
        $(this).next('.comparisonBtn').removeClass('active');
        width += 300;
    }).promise().done(function() {
        var url = './conn/product/compare/product';
        $.get(url, function(msg) {
            var _instance = new Message({
                id: 'myPopupWin',
                title: 'Dialog',
                url: url,
                param: url.replace(/^.*\//g, ''),
                html: msg,
                width: width
            });
            _instance.show();
        });

        $.get("./conn/product/compare/product", function(data, status) {
            $('#productPopup .popupText').html(data);
        }).done(function() {
            $('#productPopup').popup({
                popupBtn: '#productPopupBtn'
            });
            $('#productPopupBtn').trigger('click');
        });
    });
}

function addAll() {
    if ($('input.karsilastirma:checked').length > 0) {
        var prIds = [];
        var subIds = [];
        var prQty = [];
        $('input.karsilastirma:checked').each(function() {
            //            $(this).attr("checked", false);
            //            $(this).next('.comparisonBtn').removeClass('active');
            productComparison($(this).parent().find('.comparisonBtn'));
            prIds.push($(this).val());
            subIds.push($('#subPro' + $(this).val()).val());
            prQty.push($('#Adet' + $(this).val()).val());
        });
        multiCart = true;
        Add2Cart(prIds, subIds, prQty);
    } else {
        var _instance = new Message({
            title: LANG.get('dikkat'),
            html: 'Seçili ürün bulunamadı',
            width: 300
        });
        _instance.show();
    }
}

function cLog(str) {
    if (typeof console === 'undefined' || typeof console.log === 'undefined') {
        return false;
    }
    console.log(str);
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
    if(location.protocol == 'https:'){
        c_value += "; secure";
    }
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x === c_name) {
            return unescape(y);
        }
    }
}

function getRootPath() {

    var scripts = document.getElementsByTagName("script");

    var root, src, idx;

    for (var i = 0; i < scripts.length; i++) {
        src = scripts[i].src;
        idx = src.indexOf('js/general');
        if (idx > 0) {
            root = src.substr(0, idx);
            break;
        }
    }
    return root;
}

function empty(mixed_var) {
    var key;
    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
        return true;
    }
    if (typeof mixed_var === 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }
    return false;
}

function selCopy(target) {
    var el = document.createElement('textarea');
    el.value = $(target).text().trim();
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

var isIE = false;
var isSafari = false;

$(document).ready(function() {
    lazy('lazy');
    qtyControl();
    inputControl();
    if (typeof showHeaderCart !== 'undefined' && showHeaderCart === true) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $.get('/srv/service/cart/show-header-cart', function(result) {
                $('#mobileBasketList').html(result);
            });
        } else {
            $('#cart-soft-count').mouseenter(function() {
                if ($('body').find('#basketList').length < 1) {
                    $.get('/srv/service/cart/show-header-cart', function(result) {
                        $('#cart-soft-count').parent().append(result);
                        setTimeout(function() {
                            $('#basketList').stop(true, true).delay(50).fadeIn();
                        }, 250);
                    });
                } else {
                    $('#basketList').angularTemplate();
                    $('#basketList').stop(true, true).delay(50).fadeIn();
                }
            });
            $('#cart-soft-count').parent().mouseleave(function() {
                $('#basketList').stop(true, true).delay(50).fadeOut(250);
            });
        }
    }
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
            $('body').addClass('safari');
            isSafari = true;
        }
        if (navigator.appVersion.indexOf('Trident') > -1 && navigator.appVersion.indexOf('Edge') == -1) {
            isIE = true;
        }
    }
    $(document).on('click', '.formBtn', function() {
        ajaxPost($(this).closest('form'));
    });
    $('[data-target="blank"]').click(function(e) {
        e.preventDefault();
        window.open($(this).attr('href'));
    });
    $(".karsilastirma").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        karsilastirmaKontrol();
        sendCompareProductId($(this).attr("value"));
        return false;
    });
    $(document).on('click', '.zoomBtn', function(e) {
        e.preventDefault();
        var proUrl = $(this).data('url');
        $.ajax({
            url: proUrl,
            cache: false,
            success: function(response) {
                var quickView = new Message({
                    id: 'quickview',
                    html: '',
                    width: 1100,
                    openingCallback: function() {
                        var quickWrapper = Message.instance.activePopup.get('selector');
                        $(quickWrapper).find('.row.oh').load(proUrl + ' #pageContent', function() {
                            $(quickWrapper).find('.row.oh').append($(response).find('#pageScripts'));
                            /*$('.qtyBtns').unbind('click');
                            qtyControl();*/
                            zoomCallback();
                            var maxH = $('.pWin:last').height();
                            var contentHeight = $('.pText:last').height();
                            var contentWidth = $('.pText:last').width();
                            if (contentHeight > maxH) {
                                $('.pWin:last').addClass('overflow').width(contentWidth);
                            }

                            if (typeof QuickViewObj != 'undefined') {
                                for (var i = 0; i < QuickViewObj.callback.open.length; i++) {
                                    if (typeof QuickViewObj.callback.open[i] == 'function') {
                                        QuickViewObj.callback.open[i]();
                                    }
                                }
                            }
                        });
                    }
                });
                quickView.show();
            }
        });
    });
    $('.col-title').click(function() {
        colToggle($(this));
    });
    $(document).on('click', '.accordeon', function() {
        $(this).toggleClass('active');
        $(this).next('div').slideToggle();
    });
    if (CSRF_TOKEN) {
        $(".csrf_token-control").val(CSRF_TOKEN);
    }
    if (PAGE_TYPE == 'product' && $('.qtyBtns[data-multiple-disc="true"]').length > 0) {
        $('.qtyBtns[data-multiple-disc="true"] input').trigger('change');
    }
});

$(document).on('click', '.compare', function() {

    $.ajax({
        type: "POST",
        url: "/conn/product/compare/getId",
        dataType: 'json',

        success: function(msg) {

            if (msg.status) {
                if (msg.data.length == 0) {
                    Message.showDialog(LANG.get("no_products_on_comparison", "Kaşılaştırılacak ürün yok"), 400);
                } else if (msg.data.length == 1) {
                    Message.showDialog(LANG.get("must_select_least_2_items_to_compare", "Karşılaştırmak için en az 2 ürün seçmelisiniz"), 400);
                } else if (msg.data.length > 4) {
                    Message.showDialog(LANG.get("must_select_least_2_items_to_compare", "Karşılaştırmak için en az 2 ürün seçmelisiniz"), 400);
                } else {
                    $.get('/srv/service/content/get/1003/compare/' + msg.data.join('-'), function(result) {
                        var ComparePopup = new Message({
                            width: msg.data.length * 300,
                            html: result
                        });
                        ComparePopup.show();
                    });
                }
            }
        }
    });

});
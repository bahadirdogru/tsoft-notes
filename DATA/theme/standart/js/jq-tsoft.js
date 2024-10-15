/* IE 11 - js console */
if (!window.console) {
    var console = {
        log: function() {}
    }
}
/* IE 11 - js console */

var LocalApi = {
    get: function(key, def = false) {
        try {
            var obj = JSON.parse(localStorage.getItem(key));
            let now = new Date().getTime();
            if (obj.timemout && obj.timemout > now) {
                return def;
            }
            return typeof obj.value !== 'undefined' ? obj.value : def;
        } catch (ex) {
            return def;
        }
    },
    set: function(key, val, timeout) {
        try {
            timeout = parseInt(timeout) > 0 ? timeout : 365 * 24 * 3600;
            let obj = { value: val, timeout: new Date().getTime() + (1000 * timeout) };
            localStorage.setItem(key, JSON.stringify(obj));
            return true;
        } catch (ex) {
            return false;
        }
    },
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (ex) {
            return false;
        }
    }
};

var FavouriteApi = {
    ids: null,
    add: function(subId, productId, $ref = null) { //1 adet ürün ekler
        productId = parseInt(productId) > 0 ? parseInt(productId) : 0;
        if (FavouriteApi.ids === null) {
            FavouriteApi.ids = LocalApi.get(IS_FAV == 1 ? 'fav-collection' : 'favourite', []);
        }
        if (FavouriteApi.isExist(productId)) {
            FavouriteApi.remove(productId, $ref);
            return;
        }

        if (IS_FAV == 1) {
            $.ajax({
                url: '/srv/service/collection/set-item',
                type: 'POST',
                data: {
                    'collection_id': 0,
                    'products[]': productId + '_' + subId
                },
                dataType: 'json',
                success: function(msg) {
                    if (msg.status) {
                        /*
                        if (typeof AddToWishListCallback === 'function') {
                            if (typeof msg.data !== 'undefined') {
                                AddToWishListCallback(productId, msg.data);
                            } else {
                                AddToWishListCallback(productId);
                            }
                        }
                        */
                        const product = Array.from(msg.data).find(e => e.product_id == productId);
                        FavouriteApi.ids.push({
                            id : product.item_id,
                            pid : parseInt(productId)
                        });
                        LocalApi.set('fav-collection', FavouriteApi.ids);
                        notify.show(LANG.get('add_to_favourite'), 3000, 'btn btn-success fav-added-notify');
                        if ($ref != null) $ref.classList.add('fav-added-btn');
                    } else {
                        notify.show('Hata oluştu.', 3000, 'btn btn-danger');
                    }
                }
            });
        } else {
            FavouriteApi.ids.push(productId);
            $.ajax({
                url: '/srv/service/profile/add-to-shopping-list',
                type: 'POST',
                data: {
                    ids: [productId],
                    fetch: true,
                    cat_id: LocalApi.get('favourite_category').id || 1,
                },
                dataType: 'json',
                success: function(msg) {
                    if (msg.status) {
                        if (typeof AddToWishListCallback === 'function') {
                            if (typeof msg.data !== 'undefined') {
                                AddToWishListCallback(productId, msg.data);
                            } else {
                                AddToWishListCallback(productId);
                            }
                        }
                        LocalApi.set('favourite', FavouriteApi.ids);
                        notify.show(LANG.get('add_to_favourite'), 3000, 'btn btn-success fav-added-notify');
                        if ($ref != null) $ref.classList.add('fav-added-btn');
                    } else if (msg.statusText == 'NO_MEMBER_SESSION') {
                        setTimeout(function() {
                            window.location.reload();
                        }, 2500);
                    } else {
                        notify.show('Hata oluştu.', 3000, 'btn btn-danger');
                    }
                }
            });
        }
    },
    remove: function(productId, $ref) { //1 adet ürün siler
        productId = parseInt(productId) > 0 ? parseInt(productId) : 0;
        if (FavouriteApi.ids === null) {
            FavouriteApi.ids = LocalApi.get(IS_FAV == 1 ? 'fav-collection' : 'favourite', []);
        }

        var index, collectionPid;
        if (IS_FAV == 1) {
            collectionPid = Array.from(FavouriteApi.ids).find(e => e.pid == productId);
            index = FavouriteApi.ids.map(e => e.pid).indexOf(productId);
        } else {
            index = FavouriteApi.ids.indexOf(productId);
        }
        
        if (index > -1) {
            if (IS_FAV == 1) {
                $.ajax({
                    url: '/srv/service/collection/remove-item/',
                    type: 'POST',
                    data: {
                        'collection_id' : 0,
                        'item_id[]' : collectionPid.id
                    },
                    dataType: 'json',
                    success: function(msg) {
                        if (msg.status) {
                            /*
                            if (typeof AddToWishListCallback === 'function') {
                                if (typeof msg.data !== 'undefined') {
                                    DeleteWishListCallback(productId, msg.data);
                                } else {
                                    DeleteWishListCallback(productId);
                                }
                            } */
                            FavouriteApi.ids.splice(index, 1);
                            LocalApi.set('fav-collection', FavouriteApi.ids);
                            notify.show(LANG.get('remove_to_favourite'), 3000, 'btn btn-danger fav-delete-notify');
                            if ($ref != null) $ref.classList.remove('fav-added-btn');
                        } else {
                            notify.show('Hata oluştu.', 3000, 'btn btn-danger');
                        }
                    }
                });
            } else {
                $.ajax({
                    url: '/srv/service/profile/delete-shopping-products-by-product-id',
                    type: 'POST',
                    data: {
                        products: [productId]
                    },
                    dataType: 'json',
                    success: function(r) {
                        if (typeof DeleteWishListCallback === 'function') {
                            if (typeof r.data !== 'undefined') {
                                DeleteWishListCallback(r.ids, r.data);
                            } else {
                                DeleteWishListCallback(r.ids);
                            }
                        }
                        FavouriteApi.ids.splice(index, 1);
                        LocalApi.set('favourite', FavouriteApi.ids);
                        notify.show(LANG.get('remove_to_favourite'), 3000, 'btn btn-danger fav-delete-notify');
                        if ($ref != null) $ref.classList.remove('fav-added-btn');
                    }
                });
            }
        }
    },
    isExist: function(productId) {
        productId = parseInt(productId) > 0 ? parseInt(productId) : 0;
        if (FavouriteApi.ids === null) {
            FavouriteApi.ids = LocalApi.get(IS_FAV == 1 ? 'fav-collection' : 'favourite', []);
        }
        if (IS_FAV == 1) {
            return FavouriteApi.ids.map(e => e.pid).indexOf(productId) > -1 ? true : false;
        } else {
            return FavouriteApi.ids.indexOf(productId) > -1 ? true : false;
        }
    },
    setButtons: function() {
        var btns = document.querySelectorAll('[onclick^="AddToShoppingList"]');

        if (FavouriteApi.ids === null) {
            FavouriteApi.ids = LocalApi.get(IS_FAV == 1 ? 'fav-collection' : 'favourite', []);
        }

        if (MEMBER_INFO.ID > 0 && FavouriteApi.ids.length == 0) {
            if (IS_FAV == 1) {
                $.ajax({
                    url: 'srv/service/collection/get/0',
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        if (response.status && response.data[0] && response.data[0].items.length > 0) {
                            const items = response.data[0].items;
                            items.map(function(item) {
                                const product = {
                                    id : item._id,
                                    pid : parseInt(item.ID)
                                };
                                FavouriteApi.ids.push(product);
                                LocalApi.set('fav-collection', FavouriteApi.ids);
                            });
                            FavouriteApi.setButtons();
                            return;
                        }
                    }
                });
            } else {

            }
        }

        if (Array.isArray(FavouriteApi.ids)) {
            Array.from(btns).forEach(function(item) {
                var attr = item.getAttribute('onclick');
                var splitAttr = attr.replace(' ', '').split(',');
                var pId = splitAttr[1] || 'none';

                var index = IS_FAV == 1 ? FavouriteApi.ids.map(e => e.pid).indexOf(parseInt(pId)) > -1 : FavouriteApi.ids.indexOf(parseInt(pId)) > -1;
                if (index) item.classList.add('fav-added-btn');
            });
        }

    }
};

/* global getCookie, PersonalizationForm */
if ($.fn.checkboxStyle === undefined) {
    $.fn.checkboxStyle = function(arr) {
        var aktif = 'AKTİF';
        var pasif = 'PASİF';
        if (arr !== undefined) {
            if (arr.yes !== undefined) {
                aktif = arr.yes;
            }
            if (arr.no !== undefined) {
                pasif = arr.no;
            }
        }
        var html = '<div class="iphoneStyle"><input type="hidden" name="" id="" value="1"/><div class="iphoneBoruHat" style="width:500px"><div class="iChecked"><span>AKTİF</span></div><div class="iUnChecked"><div class="sliderLeft"></div><div class="iphoneSlider"></div><span>PASİF</span></div><div class="sliderRight"></div></div></div>';

        this.each(function() {
            var name = $(this).attr('name');
            var id = $(this).attr('id');
            var val = $(this).is(':checked') ? 1 : 0;

            $(this).after(html);
            $(this).parent().find('.iphoneStyle:last input').attr('name', name);
            $(this).parent().find('.iphoneStyle:last input').attr('id', id);
            $(this).parent().find('.iphoneStyle:last input').val(val);
            $(this).remove();

            if (name !== undefined)
                $(this).parent().find('.iphoneStyle:last .iChecked span').text(aktif);
            if (id !== undefined)
                $(this).parent().find('.iphoneStyle:last .iUnChecked span').text(pasif);
        });

        $('.iphoneStyle').unbind('click').click(function() {
            var ml = parseInt($(this).find('.iphoneBoruHat').css('margin-left'));
            if (ml === 0) {
                ml = -40;
                $('.sliderLeft').css('visibility', 'hidden');
                $(this).find('input').val(0);
            } else {
                ml = 0;
                $('.sliderRight').css('visibility', 'visible');
                $(this).find('input').val(1);
            }
            $(this).parent().find('.iphoneStyle:last input').trigger('change');

            $(this).find('.iphoneBoruHat').animate({
                marginLeft: ml
            }, 300);
        });
    };
}

function getLink(param, value, link) {
    var re = new RegExp('[\?\&]' + param + '=', 'g');
    var url = link || window.location.href;

    if (re.test(url)) {
        re = new RegExp('([\?\&]' + param + '=)(.*?)&', 'g');
        if (re.test(url)) {
            url = url.replace(re, '$1' + value + '&');
        } else {
            re = new RegExp('([\?\&]' + param + '=)(.*?)$', 'g');
            url = url.replace(re, '$1' + value);
        }
    } else if (/\?/g.test(url)) {
        url += '&' + param + '=' + value;
    } else {
        url += '?' + param + '=' + value;
    }

    if (value === '') {
        re = new RegExp('([\?\&])' + param + '=[^?&]*&?', 'g');
        url = url.replace(re, '$1');
    }

    url = url.replace(/[?&]$/g, '');
    if (param !== 'pg') url = url.replace(/(\?|\&)pg=\d+/ig, "$1pg=1");
    if (param !== 'ps') url = url.replace(/(\?|\&)ps=\d+/ig, "$1ps=1");
    return url;
}

function setLanguage(language) {
    $.ajax({
        url: '/srv/service/language/change/' + language + '/' + $('#link_type').val() + '/' + $('#link_table_id').val(),
        dataType: 'json',
        success: function(msg) {
            if (msg.link.length > 1 || ('page' == $('#link_type').val() && "1" == $('#link_table_id').val())) {
                var add = window.location.search || '';
                window.location.href = '/' + msg.link + add;
            } else {
                window.location.reload();
            }
        }
    });
}

function setCurrency(currency) {
    $.post("/srv/shopping/shopping/set-currency/" + currency, {}, function(r) {
        if (r == 1) {
            window.location.reload();
        }
    });
}

function closeVariant() {
    autoCart = false;
    cartControl = false;
    tooltip.hide($('.variantWrapper'));
    $('.variantOverlay').fadeOut(250);
    setTimeout(function() {
        $('.variantOverlay').parent().removeClass('error');
    }, 300);
}

function stockShowHide(isStockAvailable) {
    //    if ($("#IS_STOCK_NOTIFICATION_SUBPRODUCT").val() != '1') {
    //        return false;
    //    }

    if (typeof cnf_negative_stock !== 'undefined' && cnf_negative_stock == 1) {
        isStockAvailable = true;
    }

    var outOfStockDom = $("#productDetail .out-of-stock");

    if (isStockAvailable) {
        $('.inStock').show();
        $('.outStock').hide();
        outOfStockDom.hide();
    } else {
        $('.inStock').hide();
        $('.outStock').show();
        if (outOfStockDom.length > 0) {
            outOfStockDom.show();
        }
    }
}

var autoCart = false;
var cartControl = false;

function subProChangeButtons(prId, variantId) {

    var link = $('[data-type="price"]').attr('data-url') || '';
    link = link.replace(/\/[\d-]*?$/g, '/' + prId + '-' + variantId);
    $('[data-type="price"]').attr('data-url', link);

    var link = $('[data-type="shoplist"]').attr('data-url') || '';
    link = link.replace(/\/[\d-]*?$/g, '/' + prId + '-' + variantId);
    $('[data-type="shoplist"]').attr('data-url', link);

    var link = $('[data-type="stock"]').attr('data-url') || '';
    link = link.replace(/\/[\d-]*?$/g, '/' + prId + '-' + variantId);
    $('[data-type="stock"]').attr('data-url', link);

}

function subProChange(element, parentClass) {
    if (!cartControl) {
        closeVariant();
    }
    var id = element.attr('data-id') || '';
    var prId = element.attr('data-target') || '';
    var otherClass = parentClass === '.subOne' ? '.subTwo' : '.subOne';
    var variantContainer = element.parents('.variantWrapper');
    var json = variantContainer.find('#json' + prId).val() || '{"variant_ids":[],"variant_prices":[],"variant_price_raws":[],"buying_prices":[],"active_ids":[],"vat":0,"m_o_p":0}';
    var arr = JSON.parse(json);
    var key = parentClass === '.subOne' ? 'one_' + id : 'two_' + id;
    var callBackFn = element.parents(parentClass).attr('data-callback') || '';

    arr.active_ids[key] = typeof arr.active_ids[key] === 'object' ? arr.active_ids[key] : [];
    //var active_str = arr.active_ids[key].join('-'); //.replace('0', '')

    element.parent().find('[data-id]').removeClass('selected');
    element.addClass('selected');

    var others = variantContainer.find(otherClass).find('[data-id]');
    var otherTag = variantContainer.find(otherClass).find('select[id*="subPro"]').length ? variantContainer.find(otherClass).find('select[id*="subPro"] option:selected').data('id') : others.parent().find('.selected').attr('data-id');
    var otherSelected = String(otherTag) == 'undefined' ? "0" : String(otherTag);

    var v1 = parentClass === '.subOne' ? element.attr('data-id') : otherSelected;
    var v2 = parentClass === '.subOne' ? otherSelected : element.attr('data-id');

    var searchItem = parentClass === '.subOne' ? v2 : v1;

    var variantKey = v1 + "_" + v2;
    var variantId = arr.variant_ids[variantKey] || "0";

    //çift variant ise
    if (others.length > 0) {

        if (key.indexOf('two') === -1) {
            others.addClass('passive');
            for (var i = 0; i < arr.active_ids[key].length; i++) {
                others.parent().find('[data-id="' + arr.active_ids[key][i] + '"]').removeClass('passive');
            }
        }

        if (otherSelected !== '0') {
            //console.log("variantId :" + variantId);
            if (variantId !== '0' && arr.active_ids[key].indexOf(searchItem) > -1) {
                stockShowHide(true);
            } else {
                stockShowHide(false);
            }
        }
    } else { //tek variant ise
        if (element.hasClass('passive')) {
            stockShowHide(false);
        } else {
            stockShowHide(true);
        }
    }

    //alt ürün fiyatlarını set et
    var selector = element.parents('.variantWrapper').parent();

    //Diğer variant seçili değilse bu variant kullanan ilk altürünü al
    var priceKey = variantKey;
    if (typeof arr.variant_prices[variantKey] === 'undefined' && ("0" === v1 || "0" === v2)) {
        var counter = 0;
        var re = ("0" === v1) ? new RegExp("_" + v2 + "$", "ig") : new RegExp("^" + v1 + "_", "ig");

        for (var pKey in arr.variant_prices) {
            if (re.test(pKey) && counter == 0) {
                counter = 1;
                priceKey = pKey;
            }
        }
    }

    if ($('#productRight').length && $('.productDiscount span').length) {
        if ($('.product-price-not-discounted-not-vat').length) {
            var productDiscountCalc = Math.round((parseFloat($('.product-price-not-discounted-not-vat').text().replace('.', '').replace(',', '.')) - parseFloat($('.product-price-not-vat').text().replace('.', '').replace(',', '.'))) / parseFloat($('.product-price-not-discounted-not-vat').text().replace('.', '').replace(',', '.')) * 100);
        } else {
            var productDiscountCalc = Math.round((parseFloat($('.product-price-not-discounted').text().replace('.', '').replace(',', '.')) - parseFloat($('.product-price').text().replace('.', '').replace(',', '.'))) / parseFloat($('.product-price-not-discounted').text().replace('.', '').replace(',', '.')) * 100);
        }
    }

    if (typeof arr.variant_prices[priceKey] !== 'undefined') {

        var p = parseFloat(arr.variant_prices[priceKey]); //.toFixed(2);
        var b = parseFloat(arr.buying_prices[priceKey]); //.toFixed(2);

        var mop = (1 + arr.m_o_p / 100) * p;
        var noDiscount = parseFloat(arr.not_discounted_prices[priceKey] || 0);
        selector.find('.money-order-price').text(vat(mop, arr.vat)).attr('data-price', vat(mop, arr.vat));
        selector.find('.money-order-price-not-vat').text(format(mop)).attr('data-price', format(mop));
        selector.find('.product-price').text(vat(p, arr.vat)).attr('data-price', vat(p, arr.vat));
        selector.find('.product-price').parents(".discountPrice").attr("data-old", vat(p, arr.vat)).data("old", vat(p, arr.vat));

        b = selector.find('.buying-price').attr('data-numeric') == "1" ? b : format(b);
        selector.find('.buying-price').text(b).attr('data-price', b);
        selector.find('.product-price-not-vat').text(format(p)).attr('data-price', format(p));
        selector.find('.product-price-not-vat').parents(".discountPrice").attr("data-old", format(p)).data("old", format(p));

        if ($("#katalog").length > 0 || $(".catalogWrapper").length > 0) {
            var dom = selector.closest('.productDetails').find(".productPrice .currentPrice");
            var current = dom.html();
            if (current != undefined) {
                var rightPane = current.substr(current.match(/[a-z]/i)['index']);
                dom.text((rightPane.indexOf('+') > -1 ? format(p) : vat(p, arr.vat).toString()) + ' ' + rightPane);
            }
        }
        // kombin varyant değişince fiyat değişmesi
        if ($("#link_type").val() === 'combination') {
            var dom = selector.find(".productPrice .currentPrice");
            var current = dom.html();
            // if (current != undefined) {
            //     var rightPane = current.substr(current.match(/[a-z]/i)['index']);
            //     dom.text((rightPane.indexOf('+') > -1 ? format(p) : vat(p, arr.vat).toString()) + ' ' + rightPane);
            // }
        }

        if (noDiscount > p) {
            selector.find('.product-price-not-discounted').parent().show();
            selector.find('.product-price-not-discounted').text(vat(noDiscount, arr.vat)).attr('data-price', vat(noDiscount, arr.vat));
            selector.find('.product-price-not-discounted-not-vat').text(format(noDiscount)).attr('data-price', format(noDiscount));
        } else {
            selector.find('.product-price-not-discounted').parent().hide();
        }

        if ($('#productRight').length && $('.productDiscount span').length) {
            if ($('.product-price-not-discounted-not-vat').length) {
                productDiscountCalc = Math.round((parseFloat(format(noDiscount).replace('.', '').replace(',', '.')) - parseFloat(format(p).replace('.', '').replace(',', '.'))) / parseFloat(format(noDiscount).replace('.', '').replace(',', '.')) * 100);
            } else {
                productDiscountCalc = Math.round((parseFloat(vat(noDiscount, arr.vat).replace('.', '').replace(',', '.')) - parseFloat(vat(p, arr.vat).replace('.', '').replace(',', '.'))) / parseFloat(vat(noDiscount, arr.vat).replace('.', '').replace(',', '.')) * 100);
            }
        }

    } else if (typeof PRODUCT_DATA !== 'undefined' && PRODUCT_DATA.length > 0) {
        selector.find('.product-price').text(format(PRODUCT_DATA[0].total_sale_price)).attr('data-price', format(PRODUCT_DATA[0].total_sale_price));
        selector.find('.product-price').parents(".discountPrice").attr("data-old", format(PRODUCT_DATA[0].total_sale_price)).data('old', format(PRODUCT_DATA[0].total_sale_price));
    }

    if ($('#productRight').length && $('.productDiscount span').length) {
        if (productDiscountCalc < 1) {
            $('#productRight .productDiscount').hide();
        } else {
            $('#productRight .productDiscount').show();
        }
        $('#productRight .productDiscount span').text('%' + (productDiscountCalc < 1 ? productDiscountCalc * -1 : productDiscountCalc));
    }

    if (typeof arr.variant_price_raws[priceKey] !== 'undefined') {

        var p = parseFloat(arr.variant_price_raws[priceKey]);
        var b = parseFloat(arr.buying_prices[priceKey]);

        var mop = (1 + arr.m_o_p / 100) * p;
        var noDiscount = parseFloat(arr.not_discounted_prices[priceKey] || 0);
        selector.find('.money-order-price-raw').text(vat(mop, arr.vat)).attr('data-price', vat(mop, arr.vat));
        selector.find('.money-order-price-not-vat-raw').text(format(mop)).attr('data-price', format(mop));
        selector.find('.product-price-raw').text(vat(p, arr.vat)).attr('data-price', vat(p, arr.vat));

        b = selector.find('.buying-price-raw').attr('data-numeric') == "1" ? b : format(b);
        selector.find('.buying-price-raw').text(b).attr('data-price', b);
        selector.find('.product-price-not-vat-raw').text(format(p)).attr('data-price', format(p));


        if (noDiscount > 0) {
            selector.find('.product-price-not-discounted-raw').text(vat(noDiscount, arr.vat)).attr('data-price', vat(noDiscount, arr.vat));
            selector.find('.product-price-not-discounted-not-vat-raw').text(format(noDiscount)).attr('data-price', format(noDiscount));
        }
    } else if (typeof PRODUCT_DATA !== 'undefined' && PRODUCT_DATA.length > 0) {
        selector.find('.product-price-raw').text(format(PRODUCT_DATA[0].total_sale_price)).attr('data-price', format(PRODUCT_DATA[0].total_sale_price));
    }

    var supplierProductCode = arr.variant_supplier_codes[variantKey] != '' ? arr.variant_supplier_codes[variantKey] : '';
    if (supplierProductCode != '') {
        selector.find('.supplier_product_code').text(supplierProductCode);
    }

    if (typeof window[callBackFn] === 'function') {
        window[callBackFn](element);
    }

    $('#subPro' + prId).val(variantId);

    if (autoCart && cartControl) {
        $('#addCartBtn').trigger('click');
    }

    subProChangeButtons(prId, variantId);

    if (parentClass === '.subOne' || parentClass === '.subTwo') {

        if ($("#katalog").length > 0) {
            if ($('.pWrapper').length > 0) {
                if ($('li[data-type="' + id + '"]').length > 0) {
                    $('#productThumbs').css('left', 0);
                    $('li[data-type="' + id + '"]').fadeIn();
                    $('li[data-type="' + id + '"]:eq(0)').trigger('click');
                    $('#productThumbs').addClass('filtered');
                    $('#productThumbs li').not('[data-type="' + id + '"]').fadeOut();
                    $('#thumbControl').fadeOut();
                    $('#imageControl').fadeOut();
                } else {
                    if ($('#productThumbs').hasClass('filtered')) {
                        $('#productThumbs').css('left', 0);
                        $('#productThumbs li').fadeIn();
                        $('#productThumbs li:eq(0)').trigger('click');
                        $('#thumbControl').fadeIn();
                        $('#imageControl').fadeIn();
                    }
                }
            } else {
                var productId = element.attr('data-product');
                if (id == '') {
                    $('.productItem' + productId + ' img').css('opacity', 0);
                    $('.productItem' + productId + ' img:first').css('opacity', 1);
                } else {
                    var dom = $('.productItem' + productId + ' img[data-type="' + id + '"]');
                    if (dom.length > 0) {
                        dom.parent().parent().find('img').css('opacity', 0);
                        dom.eq(0).css('opacity', 1);
                    }
                }
            }

        } else {
            var elDataId = id;
            if (parentClass === '.subTwo' && element.parents('.variantWrapper').find('.subOne .selected').length > 0 && $('li[data-type="' + id + '"]').length > 0) {
                elDataId = id;
            } else if (parentClass === '.subTwo' && element.parents('.variantWrapper').find('.subOne .selected').length > 0) {
                elDataId = element.parents('.variantWrapper').find('.subOne .selected').attr('data-id');
            }

            if (document.getElementById('productThumbs') != null) {
                if ($('li[data-type="' + elDataId + '"]').length > 0) {
                    $('#productThumbs').css('left', 0);
                    $('#productThumbs').addClass('filtered');
                    $('#productThumbs li[data-type="' + elDataId + '"]').fadeIn();
                    $('#productThumbs li[data-type="' + elDataId + '"]:eq(0)').trigger('click');
                    $('#productThumbs li').not('[data-type="' + elDataId + '"]').fadeOut();
                    $('#thumbControl').fadeOut();
                    $('#imageControl').fadeOut();
                } else {
                    if ($('#productThumbs').hasClass('filtered')) {
                        $('#productImage li').not($('#productImage li').first()).fadeOut();
                        $('#productThumbs').css('left', 0);
                        $('#productThumbs li').fadeIn();
                        $('#productThumbs li:eq(0)').trigger('click');
                        $('#thumbControl').fadeIn();
                        $('#imageControl').fadeIn();
                    }
                }
            } else {
                if ($('#productImage li[data-type="' + elDataId + '"]').length > 0) {
                    $('#productImage li[data-type="' + elDataId + '"]').first().fadeIn().siblings('li').fadeOut();
                    $('#productImage li[data-type="' + elDataId + '"]').first().addClass('current').siblings('li').removeClass('current');
                }
            }
        }
    }

    var sart1 = element.parents('.variantWrapper').find(otherClass).find('.selected[data-id]').length < 1;
    var findElement = element.parents('.variantWrapper').find(otherClass).find('[data-id]:not(.passive)');
    if (sart1 && findElement.length === 1) {
        if (findElement.is('option')) {
            findElement.parent().val(findElement.attr('data-id'));
            findElement.parent().trigger('change');
        } else {
            findElement.trigger('click');
        }
    }

    if (variantId > 0) {
        var href = $('#paymentTab').attr('data-href') || '';
        href = href.replace(/\/[\d\s]*?$/g, '/' + variantId);
        $('#paymentTab').attr('data-href', href);
        if ($('#paymentTab').hasClass('loaded') && parseFloat(arr.variant_prices[priceKey]) > 0) {
            $('#paymentTab').removeClass('loaded').trigger('click');
        }
    }
    if (typeof PersonalizationForm != 'undefined' && PersonalizationForm.instance) {
        var pistance = PersonalizationForm.instance['p' + prId] || PersonalizationForm.instance.productDetail;
        pistance.calculate();
    }
    
    if(typeof multipleDiscount == "function"){
        $(".qtyBtns input").change();
    }

}

$(document).ready(function() {

    if (window.location.href.indexOf('?activation=') > 0) {
        var activationType = window.location.href.replace(/^.*?activation=(\w+).*?$/ig, '$1');
        switch (activationType) {
            case 'newsletter':
                var token = window.location.href.replace(/^.*&token=(\w+).*?$/ig, '$1');

                $.ajax({
                    url: '/srv/service/guest/activateSubscription/' + token,
                    type: 'POST',
                    dataType: 'json',
                    success: function(result) {
                        if (result.status === 1) {
                            // Message.showDialog(result.statusText, 500);

                            var msgPopup = new Message({
                                id: 'msgPopup',
                                html: result.statusText,
                                width: 500,
                                openingCallback: function() {

                                },
                                closingCallback: function() {
                                    if (typeof TSOFT_APPS.other.subscribe !== 'undefined' && TSOFT_APPS.other.subscribe.length > 0) {
                                        for(let i=0; i < TSOFT_APPS.other.subscribe.length; i++){
                                            if(typeof TSOFT_APPS.other.subscribe[i] === 'function'){
                                                try {
                                                    TSOFT_APPS.other.subscribe[i](result);
                                                } catch (error) { console.log(`Err => ${error}`); }
                                            }
                                        }
                                    }else {
                                        console.log('subscribe function');
                                    }
                                }
                            });

                            msgPopup.flexbox();
                            msgPopup.show();

                        }
                    }
                });
                break;
            case 'membership':
                var memberId = window.location.href.replace(/^.*&id=(\w+).*?$/ig, '$1');
                var token = window.location.href.replace(/^.*&token=(\w+).*?$/ig, '$1');

                $.ajax({
                    url: '/srv/service/customer/activateMembership/' + memberId + '/' + token,
                    type: 'POST',
                    dataType: 'json',
                    success: function(result) {
                        if (result.status === 1) {
                            Message.showDialog(result.statusText, 350);
                            history.pushState('', '', '/');
                        }
                    }
                });
                break;
            case 'facebook':
                $.get('/srv/service/content/get/1008/facebook-email', function(content) {
                    Message.showDialog(content, 400);
                });
                break;

            case 'facebookphone':
                $.get('/srv/service/content/get/1008/facebook-phone', function(content) {
                    Message.showDialog(content, 400);
                });
                break;
            case 'twitter':
                $.get('/srv/service/content/get/1008/twitter-email', function(content) {
                    Message.showDialog(content, 400);
                });
                break;
            case 'googlephone':
                $.get('/srv/service/content/get/1008/google-phone', function(content) {
                    Message.showDialog(content, 400);
                });
                break;
            case 'social':

                let params = new URLSearchParams(window.location.search);
                let platform = params.get('platform');
                let fields = params.get('fields');

                $.get('/srv/service/content/get/1008/social?platform='+platform+'&fields='+fields, function(content) {
                    Message.showDialog(content, 400);
                });
                break;

        }
    }

    if ($('#mainMenu').length) {
        var offset = $('#mainMenu').offset();
        var windowScroll;
        $(window).scroll(function() {
            windowScroll = $(window).scrollTop();
            if (windowScroll > offset.top) {
                $('#backToTop').fadeIn();
                if (typeof scrollShowCallback === 'function') {
                    scrollShowCallback();
                }
            } else {
                $('#backToTop').fadeOut();
                if (typeof scrollHideCallback === 'function') {
                    scrollHideCallback();
                }
            }
        });
    }

    $('#backToTop').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
    $('.language').change(function() {
        var val = $(this).val();
        setLanguage(val);
    });
    $('.currency').change(function() {
        var val = $(this).val();
        setCurrency(val);
    });
    $('#menuBtn').click(function() {
        $('#mainWrapper').addClass('menuShow animate');
        $('#mobileMenu').addClass('animate');
    });
    $('#pageOverlay, #closeMobileMenu').click(function() {
        $('#mainWrapper').removeClass('menuShow');
        setTimeout(function() {
            $('#mainWrapper').removeClass('animate');
            $('#mobileMenu').removeClass('animate');
        }, 500);
    });
    $('#mobileMenu span').click(function() {
        $(this).toggleClass('active');
        $(this).next('ul').slideToggle();
    });

    $('.angularTemplate').each(function() {
        $(this).angularTemplate();
    });

    $('.newsletterMain').keydown(function(e, c, t) {
        if (e.keyCode == 13)
            saveMaillist(e);
    });

    $('.subscribe').on('click', saveMaillist);

    var saveMaillist;
    saveMaillist.callBack = undefined;

    function saveMaillist(btn) {

        btn = btn ? $(btn.target) : (btn != undefined ? $(btn) : $('.subscribe'));

        var ct = btn.parents('.newsletterMain');
        var data = {};

        if (ct.find('.sub-name').length > 0) {
            data['name'] = ct.find('.sub-name').val() ? ct.find('.sub-name').val() : $('.sub-name').val();
        }
        if (ct.find('.sub-surname').length > 0) {
            data['surname'] = ct.find('.sub-surname').val() ? ct.find('.sub-surname').val() : $('.sub-surname').val();
        }
        if (ct.find('.sub-phone').length > 0) {
            data['phone'] = ct.find('.sub-phone').val() ? ct.find('.sub-phone').val() : $('.sub-phone').val();
        }
        if (ct.find('.sub-email').length > 0) {
            data['email'] = ct.find('.sub-email').val() ? ct.find('.sub-email').val() : $('.sub-email').val();
        }
        if (ct.find('.sub-gender').length > 0) {
            data['gender'] = ct.find('.sub-gender').val() ? ct.find('.sub-gender').val() : $('.sub-gender').val();
        }
        if (ct.find('.sub-kvkk').length > 0) {
            data['kvkk'] = 0;
            if (ct.find('.sub-kvkk').is(':checked')) {
                data['kvkk'] = 1;
            } else if ($(".sub-kvkk").is(":checked")) {
                data['kvkk'] = 1;
            }
        }

        $(".newsletter .subscribe img").remove();

        $(".newsletter .subscribe").append('<img style="margin: 0px 10px;position: absolute;" src="theme/standart/images/zoomloader.gif" title="Lütfen bekleyiniz" />');


        if ($("#newsletter_captcha_active").val() != 1) {
            return saveMailAjax(data, ct);
        }

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(data['email']) === false) {
            tooltip.show(ct.find('.sub-email'), LANG.get('check_mail'), 2000, 'btn-danger');
            return false;
        }

        var _instance = new Message({

            id: 'nw_c',
            html: $("#newsletter_hidden_captcha").clone().prop('style', '').prop('id', 'newsletter_captcha')[0].outerHTML,
            width: 375,
            buttons: [{
                text: LANG.get('send'),
                click: function() {

                    if ($("#newsletter_captcha #security_code").val().trim() == '') {
                        return false;
                    }

                    data['security_code'] = $("#newsletter_captcha #security_code").val();
                    saveMailAjax(data, ct);
                    return false;
                }
            }]
        });

        _instance.show();

    }

    function saveMailAjax(data, form) {
        $.ajax({
            type: 'POST',
            url: '/srv/service/guest/subscribeNewsletter',
            data: data,
            dataType: 'json',
            success: function(result) {
                if (result.status === 0 && result.key != '') {
                    if (result.key == 'security_code') {
                        return alert(result.statusText);
                    }
                    var element = form.find('.' + result.key);
                    if (element.length > 0) {
                        tooltip.show(element, result.statusText, 2000, 'btn-danger');
                        var pos = element.offset().top - 100;
                        $('html, body').animate({
                            scrollTop: pos
                        }, 800);
                    } else {
                        Message.debug(result.statusText + '(' + result.key + ')');
                    }
                    return false;
                } else {
                    Message.instance.activePopup.close();
                    Message.showDialog(result.statusText, 360);
                }
            }
        });
    }

    $(document).on('click', '.popupWin', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var _self = $(this);
        var width = parseInt(_self.attr('data-width')) > 0 ? parseInt(_self.attr('data-width')) : 'auto';
        var id = typeof _self.attr('data-id') === 'undefined' ? 'myPopupWin' : _self.attr('data-id');
        var url = _self.attr('data-url') || '';
        var focus = _self.attr('data-focus') || '';
        var buttonText = _self.html();
        var waitingText = typeof _self.attr('data-waiting-text') === 'undefined' ? buttonText : _self.attr('data-waiting-text');
        var dataCallback = typeof _self.attr('data-callback') === 'undefined' ? false : _self.attr('data-callback');
    
        T_Button.dom = $(e.target);
        T_Button.loadingText = LANG.get('waiting', 'Bekleyiniz..');
        T_Button.lock();

        $.get(_self.attr('data-url'), function(msg) {
            var response = {};
            if (msg.length > 0 && msg[0] === '{') {
                try {
                    response = JSON.parse(msg);
                } catch (err) {
                    console.log(err);
                }
            }
            var _instance = new Message({
                id: id,
                focus: focus,
                title: 'Dialog',
                url: url,
                param: url.replace(/^.*\//g, ''),
                html: response.statusText || msg || '',
                width: width,
                openingCallback: function () {
                    if (dataCallback && typeof window[dataCallback] == 'function') {
                        window[dataCallback]();
                    }
                }
            });
            _instance.show();
            _self.html(buttonText);
            T_Button.unlock();
        });
        return false;
    });


    $(document).on('click', '.close', function(e) {
        e.preventDefault();
        var parent = $(this).parents('.pWin');
        var id = $(this).parents('.pWrapper').find('.pWin').attr('id') || 'activePopup';
        if (typeof Message.instance[id] === 'object') {
            Message.instance[id].close();
        } else {
            $('body').css({
                'overflow': 'visible',
                'position': 'static'
            }).removeClass('popupActive');
            $(this).parents('.pWrapper').remove();
        }
    });

    $(document).on('click', '.logout', function(e) {
        e.preventDefault();
        $.get('/srv/service/customer/logout', function() {
            window.location.href = '/';
        });
    });

    $(document).on('click', '.login', function(e) {
        e.preventDefault();
        var loginType = 'email';
        var prefix = $(this).attr('data-prefix') || '';
        var vendor = $(this).attr('data-vendor') || 0;
        var cb = $(this).attr('data-callback') || 'rastgelebirfonksionadi';
        var selectedLoginType = (prefix != '') ? ($('#' + prefix + 'login-type').length == 1 ? $('#' + prefix + 'login-type') : $('#login-type')) : $('#login-type');

        if (selectedLoginType.length == 1) {
            loginType = $(selectedLoginType).find('li.active').attr('data-type');
        }

        if ($(this).attr('data-vendorcode') == "1") {
            loginType = 'vendor-code';
        }

        var options = {
            type: loginType,
            prefix: prefix,
            vendor: vendor,
            callback: typeof window[cb] === 'function' ? window[cb] : function() {
                console.log('data-callback tanımlı değil');
            }
        };
        MemberLogin(options);
    });

    $(document).on('click', '.Add2Cart', function(e) {
        e.preventDefault();
        var attrs = {
            productId: 'data-product-id',
            variantId: 'data-variant-id',
            quantity: 'data-quantity',
            buyNow: 'data-buy-now',
            relatedProductId: 'data-related-product-id',
            callbackFn: 'data-callback'
        };
        var options = {};
        for (var key in attrs) {
            options[key] = $(this).attr(attrs[key]) || 0;
        }
        if (options.productId < 1) {
            return Message.debug('Add2Cart elementine data-product-id="{$P.ID}" vs.. şeklinde parametreler veriniz.');
        }
        Add2Cart(options);
    });

    $(document).on('click', '.form-control', function(e) {
        e.preventDefault();
        if (e.target.localName != 'a') {
            var inputWrap = $(this).find('.input-wrap');
            var input = $(this).find('input');
            if ($(input).prop("disabled")) {
                return;
            }
            if (inputWrap.hasClass('radio')) {
                var iname = input.attr('name');

                $('input[name="' + iname + '"]').prop('checked', false).closest('.input-wrap').removeClass('active');
                input.prop('checked', true);
                inputWrap.addClass('active');

                if ($(this).hasClass('lightBg')) {
                    $('input[name="' + iname + '"]').closest('.form-control').removeClass('darkBg').addClass('lightBg');
                    $(this).removeClass('lightBg').addClass('darkBg');
                }

                input.trigger('change');

            } else if (inputWrap.hasClass('checkbox')) {
                var newVal = inputWrap.hasClass('active') ? false : true;
                if (true === newVal) {
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
                input.prop('checked', newVal);
                input.trigger('change');
            }
        }
        if (e.target.type === 'submit') {
            $(this).submit();
        }
    });

});

$(document).on('click', '.subOne a[data-id],.subTwo a[data-id]', function(e) {
    e.preventDefault();
    var parentClass = $(this).parents('.subOne').length > 0 ? '.subOne' : '.subTwo';
    subProChange($(this), parentClass);
});

$(document).on('change', '.subOne select,.subTwo select', function(e) {
    e.preventDefault();
    var parentClass = $(this).parents('.subOne').length > 0 ? '.subOne' : '.subTwo';
    subProChange($(this).find('option:selected'), parentClass);
});

function HtmlRender(options) {
    var opt = {
        selector: '#angular',
        url: '',
        callback: function() {

        },
        data: {}
    };

    if (typeof options === 'object' && typeof options.productId !== 'undefined') {
        for (var i in options) {
            opt[i] = options[i];
        }
    } else if (arguments.length > 1) {
        var i = 0;
        for (var key in opt) {
            if (i >= arguments.length) {
                break;
            }
            opt[key] = arguments[i];
            i++;
        }
    }

    if (Object.keys(opt.data).length > 0) {
        var template = new Template({
            source: opt.selector,
            destination: opt.selector,
            assign: opt.data,
            callback: opt.callback
        }).display();
    } else {
        $.ajax({
            url: opt.url,
            dataType: 'json',
            success: function(data) {
                opt.data = data;
                var template = new Template({
                    source: opt.selector,
                    destination: opt.selector,
                    assign: opt.data,
                    callback: opt.callback
                }).display();
            }
        });
    }
}

var Cart = {
    callback: {
        update: null,
        updateAll: null,
        delete: null,
        deleteAll: null,
        load: [],
        add: [],
    },
    storageKey : 'Cart' ,
    'update': function(sessIndex, count, callback) {
        $.ajax({
            url: '/srv/service/cart/update-item/' + sessIndex + '/' + count,
            dataType: 'json',
            success: function(result) {

                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(result.totalQuantity);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(result.totalQuantity);
                    } catch (err) {}
                }
                Cart.setStorage('update',result,sessIndex);

                if (typeof callback === 'function') {
                    callback(result);
                    if (typeof Cart.callback.update === 'function') {
                        Cart.callback.update(result);
                    }
                } else {
                    Message.showDialog(result.statusText, 500, 300);
                    setTimeout(function() {
                        window.location.reload();
                    }, 2500);
                }
            }
        });
    },
    'updateAll': function(countList, callback) {
        var param = typeof countList === 'object' ? countList.join('-') : countList;
        $.ajax({
            url: '/srv/service/cart/update/' + param,
            dataType: 'json',
            success: function(result) {

                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(result.totalQuantity);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(result.totalQuantity);
                    } catch (err) {}
                }

                if (typeof callback === 'function') {
                    callback(result);
                    if (typeof Cart.callback.updateAll === 'function') {
                        Cart.callback.updateAll(result);
                    }
                } else {
                    window.location.reload();
                }
            }
        });
    },
    'delete': function(sessIndex, callback) {



        $.ajax({
            url: '/srv/service/cart/delete/' + sessIndex,
            dataType: 'json',
            success: function(result) {

                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(result.totalQuantity);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(result.totalQuantity);
                    } catch (err) {}
                }
                Cart.setStorage('delete',result,sessIndex);

                if (typeof callback === 'function') {
                    callback(result);
                    if (typeof Cart.callback.delete === 'function') {
                        Cart.callback.delete(result);
                    }
                } else if (typeof window[callback] === 'function') {
                    window[callback](result);
                    if (typeof Cart.callback.delete === 'function') {
                        Cart.callback.delete(result);
                    }
                } else {
                    window.location.reload();
                }
            }
        });
    },
    'deleteAll': function(callback) {
        $.ajax({
            url: '/srv/service/cart/delete-all/',
            dataType: 'json',
            success: function(result) {

                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(0);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(0);
                    } catch (err) {}
                }
                Cart.setStorage('deleteAll');
                if (typeof Cart.callback.deleteAll === 'function') {
                    Cart.callback.deleteAll(result);
                }
                if (typeof callback === 'function') {
                    callback(result);
                } else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 750);
                }
            }
        });
    },
    setStorage : function(action,response,index){
        // v4 de çalışmasın
        return false;
        if(typeof window.localStorage === 'undefined'){
            return false;
        }
        
        let storage = window.localStorage.getItem(Cart.storageKey);
        if(storage === null){
            storage = {  summary : {   },    items : []  };
        }else{
            storage = JSON.parse(storage);
        }
        
        switch(action) {
            
            case 'update':
            case 'add':
                if(response.cartProducts === null){
                    return false;
                }
                storage.items = response.cartProducts;
                storage.summary = { total : response.totalPrice};
                break;
                
            case 'delete':
                if(storage.items.length === 0){
                    return false;
                }
                storage.items.splice(index,1);
                storage.summary.total = response.priceCart;
                break;
                
            case 'deleteAll':
                storage.items  = [];
                storage.summary = { total : 0};
                break;
        }
        
        window.localStorage.setItem(Cart.storageKey,JSON.stringify(storage));
        return true;
    },
    
    getStorage : function(){
        
        let storage = window.localStorage.getItem(Cart.storageKey);
        if(storage === null){
            storage = [];
        }else{
            storage = JSON.parse(storage);
        }
        return storage;
    }
};

var QuickViewObj = {
    callback: {
        open: []
    }
};

var PaymentMethods = {
    callback: {
        change: []
    },
}

var customerOrder = {
    callback: {
        return: [],
        cancel: [],
    }
};

function MemberLogin(options) {
    $.cookie('nocache', 1, { expires: 15 });

    MemberLogin.instance = MemberLogin.instance || {};
    var opt = {
        type: 'email',
        prefix: '',
        vendor: 0,
        callback: function() {

        }
    };
    for (var i in options) {
        opt[i] = options[i];
    }
    if (opt.type == 'phone') {
        opt.phone = '#' + opt.prefix + 'phone';
    } else {
        opt.email = '#' + opt.prefix + 'email';
    }
    opt.password = '#' + opt.prefix + 'password';
    opt.remember = '#' + opt.prefix + 'remember';
    opt.security = '#' + opt.prefix + 'security';
    opt.code = '#' + opt.prefix + 'code';

    var _this = this;
    opt.prefix = opt.prefix === '' ? 'deneme' : opt.prefix;
    MemberLogin.instance[opt.prefix] = _this;
    MemberLogin.instance[opt.prefix].disabled = MemberLogin.instance[opt.prefix].disabled || 0;
    if (MemberLogin.instance[opt.prefix].disabled == 1) {
        return;
    }
    MemberLogin.instance[opt.prefix].disabled = 1;


    var data = { password: $(opt.password).val(), vendor: opt.vendor, security: $(opt.security).val() };

    if (typeof $("[name='g-recaptcha-response']").val() !== 'undefined') {
        data.security = $("[name='g-recaptcha-response']").val();
    }

    var httpsUri = $('.is_https_active:last').val() === 1 ? 'https://' + window.location.host : '';

    if (opt.type == 'phone') {
        var postUrl = httpsUri + '/srv/customer/signin/phone/' + encodeURI($(opt.phone).val().replace(/\ /g, '').replace(/\(/g, '').replace(/\)/g, ''));
    } else if (opt.type == "vendor-code") {
        var postUrl = httpsUri + '/srv/customer/signin/vendor-code/' + encodeURI($(opt.email).val());
    } else {
        var postUrl = httpsUri + '/srv/customer/signin/email/' + encodeURI($(opt.email).val());
    }

    $.ajax({
        url: postUrl,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(result) {
            if (result.status == 1) {

                if (result.favourite) {
                    LocalApi.set('favourite', result.favourite, 30 * 24 * 3600);
                    LocalApi.set('favourite_category', result.favourite_default_category, 30 * 24 * 3600);
                }

                if ($(opt.remember).is(':checked')) {
                    if (opt.type == 'phone') {
                        $.cookie('phone', $(opt.phone).val(), { expires: 15 });
                    } else {
                        $.cookie('email', $(opt.email).val(), { expires: 15 });
                    }
                    //  $.cookie('password', $(opt.password).val(), {expires: 15});
                } else {
                    $.cookie('email', "", { expires: 15 });
                    $.cookie('phone', "", { expires: 15 });
                    $.cookie('password', "", { expires: 15 });
                }
            } else if ($(opt.code).length > 0) {
                var s = $(opt.code).attr('src');
                s = s.replace(/\?.*?$/g, '?' + new Date().getTime());
                $(opt.code).attr('src', s);
                if (result.counter >= parseInt($(opt.code).attr('data-limit'))) {
                    $(opt.code).parents('.form-control:first').show();
                }
            }
            var options = opt;
            opt.callback(result, options);
            setTimeout(function() {
                MemberLogin.instance[opt.prefix].disabled = 0;
            }, 50);
        },
        error: function() {
            MemberLogin.instance[opt.prefix].disabled = 0;
        }
    });
}

function getLanguage() {
    var allowedLang = ['tr', 'en', 'az', 'ru', 'de', 'bs', 'ar', 'el', 'fa', 'fr'];
    var lang = 'tr';
    if (typeof window.LANGUAGE === 'string' && allowedLang.indexOf(window.LANGUAGE) > 0) {
        lang = window.LANGUAGE;
    } else {
        $.ajax({
            url: '/conn/user/language/getLanguage',
            async: false,
            success: function(msg) {
                msg = msg.replace(/\W/ig, '');
                if (msg.length > 1 || msg.length < 4) {
                    lang = msg;
                }
            }
        });
        if (allowedLang.indexOf(lang) < 0) {
            lang = 'tr';
        }
    }
    return lang;
}

function RegionLoader(options) {
    var selectedCountry = '';

    var opt = {
        country: { selector: '.country:last', value: 'TR' },
        city: { selector: '.city:last', value: '' },
        town: { selector: '.town:last', value: '' },
        district: { selector: '.district:last', value: '' },
        countryLimit: true
    };

    for (var i in options) {
        opt[i] = options[i];
    }
    opt.country.value = opt.country.value || '';
    opt.city.value = opt.city.value || '';
    opt.town.value = opt.town.value || '';
    opt.district.value = opt.district.value || '';

    this.get = function(key) {
        return opt[key];
    };

    this.set = function(key, val) {
        opt[key] = val;
        return true;
    };

    function loadCountries() {
        if ($(opt.country.selector).length < 1) {
            var v = opt.country.value;
            loadCities();
            return false;
        }
        $.ajax({
            url: getEndpoint('COUNTRY', opt.countryLimit ? '0' : '1'),
            dataType: 'json',
            success: function(result) {
                var options = '';
                for (var i = 0; i < result.countries.length; i++) {
                    var row = result.countries[i];
                    options += '<option value="' + row['code'] + '">' + row['title'] + '</option>';
                }
                $(opt.country.selector).find('option:not(:first)').remove();
                $(opt.country.selector).append(options);
                if (result.countries.length == 1) {
                    opt.country.value = result.countries[0].code;
                }

                if (opt.country.value === '') {
                    opt.country.value = result.selected || 'TR';
                }

                if ($(opt.country.selector).find('option[value="' + opt.country.value + '"]').length > 0) {
                    $(opt.country.selector).val(opt.country.value);
                }
                $(opt.country.selector).trigger('change');
            }
        });
    }

    function loadCities(parentCode) {
        parentCode = parentCode || 'TR';
        if ($(opt.city.selector).length < 1) {
            return false;
        }
        $.ajax({
            url: getEndpoint('REGION_V4', 'get-cities/' + parentCode),
            dataType: 'json',
            success: function(result) {
                if (result.cities.length > 0) {
                    $('[name=city]').parent().hide();
                    $(opt.city.selector).parent().show();
                } else {
                    $('[name=city]').parent().show();
                    $('[name=city]').val('');
                    $(opt.city.selector).parent().hide();
                    loadTowns("");
                }

                var smallCode = parentCode.toLowerCase();
                if (['us', 'cn', 'de', 'ru', 'gb', 'in', 'es'].indexOf(smallCode) < 0) {
                    $('[name=province]').parents('.form-control:first').hide();
                } else {
                    $('[name=province]').parents('.form-control:first').show();
                }

                var options = '';
                for (var i = 0; i < result.cities.length; i++) {
                    var row = result.cities[i];
                    options += '<option value="' + row['code'] + '">' + row['title'] + '</option>';
                }
                $(opt.city.selector).find('option:not(:first)').remove();
                $(opt.city.selector).append(options);

                if ($(opt.city.selector).find('option[value="' + opt.city.value + '"]').length > 0) {
                    $(opt.city.selector).val(opt.city.value);
                    $(opt.city.selector).trigger('change');
                    opt.city.value = '';
                }
            }
        });
    }

    function loadTowns(parentCode) {

        if ($(opt.town.selector).length < 1) {
            return false;
        }
        $.ajax({
            url: getEndpoint('REGION_V4', 'get-towns/' + parentCode),
            dataType: 'json',
            success: function(result) {
                var options = '';
                for (var i = 0; i < result.towns.length; i++) {
                    var row = result.towns[i];
                    options += '<option value="' + row['code'] + '">' + row['title'] + '</option>';
                }
                $(opt.town.selector).find('option:not(:first)').remove();
                $(opt.town.selector).append(options);

                if ($(opt.town.selector).find('option[value="' + opt.town.value + '"]').length > 0) {
                    $(opt.town.selector).val(opt.town.value);
                    opt.town.value = '';
                }

                if (result.towns.length > 0) {
                    $('[name=town]').parent().hide();
                    $(opt.town.selector).parent().show();
                    loadDistricts($(opt.town.selector).val());
                } else {
                    $('[name=town]').parent().show();
                    $('[name=town]').val('');
                    $(opt.town.selector).parent().hide();
                }
            }
        });
    }

    function loadDistricts(parentCode, cb) {

        if ($(opt.district.selector).length < 1) {
            return false;
        }

        $.ajax({
            url: getEndpoint('REGION_V4', 'get-districts/' + parentCode),
            dataType: 'json',
            success: function(result) {

                if (result.districts.length > 0) {
                    if (opt.district.selector.indexOf('_code') === -1) {
                        opt.district.selector += '_code';
                    }
                } else {
                    opt.district.selector = opt.district.selector.replace('_code', '');
                }

                if (result.districts.length > 0) {

                    var options = '';
                    for (var i = 0; i < result.districts.length; i++) {
                        var row = result.districts[i];
                        options += '<option data-postalcode="' + (row['postalcode'] !== null ? row['postalcode'] : '') + '" value="' + row['code'] + '">' + row['title'] + '</option>';
                    }
                    $(opt.district.selector).find('option:not(:first)').remove();
                    $(opt.district.selector).append(options);

                    if ($(opt.district.selector).find('option[value="' + opt.district.value + '"]').length > 0) {
                        $(opt.district.selector).val(opt.district.value);
                        opt.district.value = '';
                    }

                    $(opt.district.selector).change(function() {
                        $('#post_code').val($(this).find(':selected').data('postalcode'));
                    });

                    $('[name=district]').parent().hide();
                    $(opt.district.selector).parent().show();
                } else {
                    $('[name=district_code]').parent().hide();
                    $('[name=district]').val('');
                    $(opt.district.selector).parent().show();
                }
            }
        });
    }


    $(opt.country.selector).change(function() {
        var v = $(this).val();
        loadCities(v);
    });

    $(opt.city.selector).change(function() {
        var city = $(this).val();
        if (city !== '') {
            loadTowns($(this).val());
        } else {
            $(opt.town.selector).find('option').not(':first').remove();

            $('[name=town]').parent().hide();
            $(opt.town.selector).parent().show();
        }
    });

    $(opt.town.selector).change(function() {
        loadDistricts($(this).val());
    });

    loadCountries();
}

var tsRegion = function(options) {
    var opt = {
        container: '.regions',
        countryLimit: 1,
        storeLimit: 0,
        regionLimit: null,
        country: {
            container: '.country-container',
            select: '.country-select',
            value: '',
            caption: ''
        },
        state: {
            container: '.state-container',
            select: '.state-select',
            selectContainer: '.state-select-container',
            input: '.state-input',
            inputContainer: '.state-input-container',
            value: '',
            caption: ''
        },
        city: {
            container: '.city-container',
            select: '.city-select',
            selectContainer: '.city-select-container',
            input: '.city-input',
            inputContainer: '.city-input-container',
            value: '',
            caption: ''
        },
        town: {
            container: '.town-container',
            select: '.town-select',
            selectContainer: '.town-select-container',
            input: '.town-input',
            inputContainer: '.town-input-container',
            value: '',
            caption: ''
        },
        district: {
            container: '.district-container',
            select: '.district-select',
            selectContainer: '.district-select-container',
            input: '.district-input',
            inputContainer: '.district-input-container',
            value: '',
            caption: ''
        }
    };
    if (typeof options == "object") {
        for (var i in options) {
            if (typeof options[i] == "object") {
                for (var j in options[i]) {
                    opt[i][j] = options[i][j];
                }
            } else {
                opt[i] = options[i];
            }
        }
    }

    $('.district-select').on('change', function () {
        let postalCode = $(this).find(':selected').data('postalcode');
        $('#post_code').val(postalCode);
    });

    this.c = opt;
    this.l = {
        country: [],
        state: [],
        city: [],
        town: [],
        district: []
    };
    this.v = {
        country: opt.country.value || "",
        state: opt.state.value || "",
        city: opt.city.value || "",
        town: opt.town.value || "",
        district: opt.district.value || ""
    };
    this.vc = {
        country: opt.country.caption || "",
        state: opt.state.caption || "",
        city: opt.city.caption || "",
        town: opt.town.caption || "",
        district: opt.district.caption || ""
    };
    this.mapSTypes = {
        country: 'U',
        state: 'E',
        city: 'S',
        town: 'I',
        district: 'M'
    };

    var that = this;

    this.ajax = function(url, rf, data) {
        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            success: rf,
            dataType: "json",
            error: rf
        });
    };
    this.getCountry = function(code) {
        for (var i in that.l.country) {
            if (that.l.country[i].code == code) {
                var item = that.l.country[i];
                item.has_state = item.has_state == 1;
                return item;
            }
        }
    };

    this.loadCountries = function() {
        var rf = function(result) {
            if (result.countries) {
                if(opt.countryLimit){
                    result.countries = result.countries.filter(function(item){
                        return !MEMBER_INFO.E_COUNTRY || item.code == MEMBER_INFO.E_COUNTRY
                    });
                }
                that.l.country = result.countries;
                var ob = $(that.c.country.select, $(that.c.container)),
                    cExists = false;
                ob.html("");
                $.each(result.countries, function(i, item) {
                    ob.append("<option value='" + item.code + "'>" + item.title + "</option>");
                    if (item.code == that.v.country) {
                        cExists = true;
                    }
                });
                if (that.v.country == "" || !cExists) {
                    if (result.countries && result.countries.length && result.countries.length == 1) {
                        that.v.country = result.countries[0].code;
                    } else if (result.selected && that.getCountry(result.selected)) {
                        that.v.country = result.selected;
                    } else if (that.getCountry("TR")) {
                        that.v.country = "TR";
                    } else if (result.countries.length > 0) {
                        that.v.country = result.countries[0].code;
                    }
                }
                ob.val(that.v.country);
                that.loadStates();
            } else {
                //what can i do
            }
        };
        that.ajax(getEndpoint('COUNTRY', '1'), rf);
    };
    this._loadRegion = function(what, parent) {
        that._reset(what);
        var rf = function(result) {
            var items = result && result.data ? result.data : [];
            that.l[what] = items;
            that._render(what, items);
        };
        if (!parent) {
            rf();
        } else {
            var data = { storeLimit: opt.storeLimit };
            switch (what) {
                case 'country':
                    break;
                case 'state':
                    data.U = that.v.country;
                    break;
                case 'city':
                    data.U = that.v.country;
                    data.E = that.v.state;
                    break;
                case 'town':
                    data.U = that.v.country;
                    data.E = that.v.state;
                    data.S = that.v.city;
                    break;
                case 'district':
                    data.U = that.v.country;
                    data.E = that.v.state;
                    data.S = that.v.city;
                    data.I = that.v.town;
                    break;
            }
            var lmt = opt.regionLimit != null ? opt.regionLimit : (opt.countryLimit ? "1" : "0");
            that.ajax(getEndpoint('REGION', this.mapSTypes[what] + '/' + parent + '/' + lmt), rf, data);
        }
    };
    this.loadStates = function() {
        $(that.c.state.container, $(that.c.container)).hide();
        that._reset("state");
        var c = that.getCountry(that.v.country) || {};
        if (!c.has_state) {
            that.loadCities();
            return;
        }
        $(that.c.state.container, $(that.c.container)).show();
        that._loadRegion("state", that.v.country);
    };
    this.loadCities = function() {
        var c = that.getCountry(that.v.country) || {};
        var pc = c.has_state ? that.v.state : that.v.country;
        that._loadRegion("city", pc);
    };
    this.loadTowns = function() {
        that._loadRegion("town", that.v.city);
    };
    this.loadDistricts = function() {
        that._loadRegion("district", that.v.town);
    };

    this._render = function(what, data) {
        if (data.length == 0) {
            $(that.c[what].selectContainer, $(that.c.container)).hide();
            $(that.c[what].inputContainer, $(that.c.container)).show();
            $(that.c[what].input, $(that.c.container)).val(that.vc[what]);
        } else {
            $(that.c[what].selectContainer, $(that.c.container)).show();
            $(that.c[what].inputContainer, $(that.c.container)).hide();
            var ob = $(that.c[what].select, $(that.c.container));
            var rCodes = [];
            ob.html("<option value=''>" + ob.attr("placeholder") + "</option>");
            $.each(data, function(i, item) {
                ob.append('<option data-postalcode="'+item.postalcode+'" value="' + item.code + '">' + item.title + '</option>');
                rCodes.push(item.code);
            });
            if (rCodes.indexOf(that.v[what]) == -1) {
                that.v[what] = '';
                switch (what) {
                    case 'state':
                        that.v.city = '';
                        that.v.town = '';
                        that.v.district = '';
                        break;
                    case 'city':
                        that.v.town = '';
                        that.v.district = '';
                        break;
                    case 'town':
                        that.v.district = '';
                        break;
                }
                if (rCodes.length == 1) {
                    ob.val(rCodes[0]).change();
                    return;
                }
            } else {
                ob.val(that.v[what]);
            }
        }
        //after render//
        switch (what) {
            case 'state':
                that.loadCities();
                break;
            case 'city':
                that.loadTowns();
                break;
            case 'town':
                that.loadDistricts();
                break;
        }
    };
    this._reset = function(type) {
        var obs = {},
            $typeIdx = 0,
            $totalIdx = 4;
        obs[1] = that.c.state;
        obs[2] = that.c.city;
        obs[3] = that.c.town;
        obs[4] = that.c.district;

        switch (type) {
            case 'state':
                $typeIdx = 1;
                break;
            case 'city':
                $typeIdx = 2;
                break;
            case 'town':
                $typeIdx = 3;
                break;
            case 'district':
                $typeIdx = 4;
                break;
        }
        for (var i = $typeIdx; i <= $totalIdx; i++) {
            $(obs[i].select, $(that.c.container)).html("");
            $(obs[i].input, $(that.c.container)).val("");
            $(obs[i].selectContainer, $(that.c.container)).hide();
            $(obs[i].inputContainer, $(that.c.container)).show();
        }
    };
    this._listener = function() {
        var rs = ["state", "city", "town", "district"];
        $(that.c.country.select, $(that.c.container)).change(function() {
            that.v.country = $(this).val();
            for (i = 0; i < rs.length; i++) {
                that.vc[rs[i]] = '';
                that.v[rs[i]] = '';
            }
            that.loadStates();
        });
        $(that.c.state.select, $(that.c.container)).change(function() {
            that.v.state = $(this).val();
            for (i = 1; i < rs.length; i++) {
                that.vc[rs[i]] = '';
                that.v[rs[i]] = '';
            }
            that.loadCities();
        });
        $(that.c.city.select, $(that.c.container)).change(function() {
            that.v.city = $(this).val();
            for (i = 2; i < rs.length; i++) {
                that.vc[rs[i]] = '';
                that.v[rs[i]] = '';
            }
            that.loadTowns();
        });
        $(that.c.town.select, $(that.c.container)).change(function() {
            that.v.town = $(this).val();
            for (i = 3; i < rs.length; i++) {
                that.vc[rs[i]] = '';
                that.v[rs[i]] = '';
            }
            that.loadDistricts();
        });
        $(that.c.district.select, $(that.c.container)).change(function() {
            that.v.district = $(this).val();
        });

        $(that.c.state.input, $(that.c.container)).keyup(function() {
            that.vc.state = $(this).val();
        });
        $(that.c.city.input, $(that.c.container)).keyup(function() {
            that.vc.city = $(this).val();
        });
        $(that.c.town.input, $(that.c.container)).keyup(function() {
            that.vc.town = $(this).val();
        });
        $(that.c.district.input, $(that.c.container)).keyup(function() {
            that.vc.district = $(this).val();
        });
    };

    this._listener();
    this.loadCountries();
};

//sepeteEkle(uruid, altUrunId,quantity)
var multiCart = false;
var errorMessages = [];
var errorHtml = '';
var multiCartItem = null;

function showCartError(errorHtml) {
    setTimeout(function() {
        Message.showDialog(errorHtml);
    }, 1000);
}

function AddToShoppingList(subId = 0, key, e) {
    if (subId == 1) subId = 0;
    /*
     * 
        if (hasVariant && $("#subPro" + key).val() == 0) {
            var _instance = new Message({
                html: "Alt ürün seçiniz.",
                width: 500,
                openingCallback: function() {
                    $('body').addClass('flexPopup');
                },
                closingCallback: function() {
                    $('body').removeClass('flexPopup');
                }
            });
            _instance.show();
            return;
        }

        var url = e.dataset.url;

        $.get(url, function(msg) {
            var _instance = new Message({
                url: url,
                param: url.replace(/^.*\//g, ''),
                html: msg || '',
                width: e.dataset.width,
            });
            _instance.show();
        });
     * 
     */
    FavouriteApi.add(subId, key, e);
}

function AddToCollectionList(subId = 0, key, e) {
    if (subId == 1) subId = 0;
    if (IS_FAV == 1) {
        $.get('/srv/service/content/get/1014/collection/' + key + '-' + subId, function(content) {
            Message.showDialog(content, 580);
        });
    } else {
        $.get('/srv/service/content/get/1014/popup/' + key + '-' + subId, function(content) {
            Message.showDialog(content, 580);
        });
    }
};

function Add2Cart(options) {

    $.cookie('nocache', 1, { expires: 15 }); //varnish

    //console.log(arguments);
    Add2Cart.instance = this;
    Add2Cart.callBack = Add2Cart.callBack || function(row) {};
    var opt = {
        productId: 0,
        variantId: 0,
        quantity: 0,
        buyNow: 0,
        relatedProductId: '',
        multi: 0,
        beforeHtml: '',
        afterHtml: '',
        callbackFn: null
    };
    if (typeof options === 'object' && typeof options.productId !== 'undefined') {
        for (var i in options) {
            opt[i] = options[i];
        }
    } else if (arguments.length > 1) {
        var i = 0;
        for (var key in opt) {
            if (i >= arguments.length) {
                break;
            }
            opt[key] = arguments[i];
            i++;
        }
    }

    this.get = function(key) {
        return opt[key];
    };

    this.set = function(key, val) {
        opt[key] = val;
        return true;
    };

    var post = {
        productId: opt.productId,
        variantId: opt.variantId,
        quantity: opt.quantity,
        relatedProductId: opt.relatedProductId,
        orderNotes: $("#order-note" + opt.productId).length > 0 ? $("#order-note" + opt.productId).val() : '',
        subscribe: $("#product-subscribe-" + opt.productId + ":checked").length == 1 ? 1 : 0,
        subscribeFrequency: $("#product-subscribe-" + opt.productId + ":checked").length == 1 ? $("#product-subscribe-frequency-" + opt.productId).val() : "",
        csrfToken: window.CART_CSRF_TOKEN || ''
            //multi: opt.multi
    };

    if (typeof PersonalizationForm !== 'undefined' && PersonalizationForm.active === true) {
        var p = PersonalizationForm.instance['p' + opt.productId] || PersonalizationForm.instance.productDetail || PersonalizationForm.instance.activeForm;
        if (parseInt(p.get('product_id')) === parseInt(opt.productId)) {
            if (p.validate() === false) {
                return false;
            }
            post.formData = p.getFormData();
        }
    }

    // sepete ard arda sürekli tıklayınca popuplar bozuluyor
    var addToCartDom = $("#addCartBtn");
    if (addToCartDom.length > 0) {
        var addToCartEvent = addToCartDom.attr('onclick');
        addToCartDom.prop('onclick', null).off('click');
    }

    var releatedPopup = false;
    if (typeof getVar === 'function' && getVar('releated') !== '') {

        var refProduct = atob(getVar('releated')).split('-');
        try {
            var refProductId = parseInt(refProduct[0]);
            if (refProductId > 0) {
                var refSubProductId = refProduct[1] ? refProduct[1] : 0;
                post.relatedProductId = refProductId + "+':'+" + refSubProductId;
                releatedPopup = true;
            }
        } catch (e) {
            console.log(e);
        }

    }

    $.ajax({
        url: '/srv/service/cart/add-to-cart',
        type: 'POST',
        data: post,
        dataType: 'json',
        success: function(obj) {
            Add2Cart.callBack(obj);
            if (obj.status > 0 || (Array.isArray(obj) && obj[0].status > 0)) {
                if (Array.isArray(obj)) {
                    $('.cart-soft-count').text(obj[obj.length - 1].totalQuantity);
                    $('.cart-soft-price').text(obj[obj.length - 1].totalPrice);
                } else {
                    $('.cart-soft-count').text(obj.totalQuantity);
                    $('.cart-soft-price').text(obj.totalPrice);
                }
                Cart.setStorage('add',obj);
                $('#basketList').remove();
                //Callback var ise sadece bu çalışsın.
                if (typeof options.callbackFn === 'string' && typeof window[options.callbackFn] === 'function') {
                    return window[options.callbackFn]();
                }

            }
            if (multiCart) {
                $.each(obj, function() {
                    if (this.status < 1) {
                        errorMessages.push(this);
                    } else {
                        multiCartItem = this;

                        if (multiCartItem.status > 0) {
                            for (var i = 0; i < Cart.callback.add.length; i++) {
                                if (typeof Cart.callback.add[i] === 'function') {
                                    Cart.callback.add[i](multiCartItem);
                                }
                            }
                        }

                    }
                });
                if (multiCartItem != null) {
                    switch (multiCartItem.status) {
                        case 1:
                            closeVariant();
                            autoCart = false;
                            //hiçbirşey yapma
                            break;
                        case 2:
                            closeVariant();
                            autoCart = false;
                            window.location.href = multiCartItem.url;
                            break;
                        case 3:
                            closeVariant();
                            autoCart = false;
                            var cartPopup = new Message({
                                id: 'cartPopup',
                                html: multiCartItem.content,
                                width: 1000,
                                openingCallback: function() {
                                    if (typeof openingCartCallback === 'function') {
                                        openingCartCallback();
                                    }
                                },
                                closingCallback: function() {
                                    if (typeof openingCartCallback === 'function') {
                                        closingCartCallback();
                                    }
                                }
                            });
                            cartPopup.flexbox();
                            cartPopup.show();
                            break;
                    }
                    multiCartItem = null;
                }
                if (errorMessages.length > 0) {
                    $.each(errorMessages, function() {
                        errorHtml = errorHtml + this.statusText + ': <a href="/' + this.url + '" class="form-link a-danger text-danger text-under" target="_blank">' + this.title + '</a><br/>';
                    });
                    showCartError(errorHtml);
                }
                errorMessages = [];
                errorHtml = '';
            } else {

                if (obj.status > 0 || (Array.isArray(obj) && obj[0].status > 0)) {
                    for (var i = 0; i < Cart.callback.add.length; i++) {
                        if (typeof Cart.callback.add[i] === 'function') {
                            Cart.callback.add[i](obj);
                        }
                    }
                }

                switch (obj.status) {
                    case -1: //Hatalı alt ürün seçimi
                        autoCart = true;
                        var vOverlay = $('.variantOverlay[data-id="' + opt.productId + '"]');
                        var vBox = vOverlay.parent().find('.variantBox');
                        var oBox = vOverlay.parent().find('.optionBox');
                        if (vBox.length === 0 && oBox.length === 0 && obj.url != '') {
                            if (PAGE_TYPE !== 'product') {
                                window.location.href = "/" + obj.url;
                                return false;
                            } else if ($('#link_table_id').val() != opt.productId) {
                                window.location.href = "/" + obj.url;
                                return false;
                            }
                        }

                        $('.variantOverlay[data-id="' + opt.productId + '"]').parent().addClass('error');
                        $('.variantOverlay[data-id="' + opt.productId + '"]').eq(0).fadeIn(250);
                        tooltip.show($('.error .variantWrapper'), obj.statusText, false, 'btn-danger');
                        $('body').keydown(function(e) {
                            if (e.keyCode == 27) {
                                closeVariant();
                            }
                        });
                        $('.variantOverlay').click(function() {
                            closeVariant();
                        });
                        break;
                    case 0:
                        closeVariant();
                        autoCart = false;
                        Message.showDialog(obj.statusText, 600);
                        break;
                    case -2:
                        autoCart = false;
                        $.get('/srv/service/content/get/1110/set-location/' + opt.productId + '-' + opt.variantId + '-' + opt.quantity, function(content) {
                            Message.showDialog(content, 500);
                            $("#setLocationContainer .warning-message").text(obj.statusText).show();
                        });
                        break;
                    case 1:
                        closeVariant();
                        autoCart = false;
                        //hiçbirşey yapma
                        if (opt.buyNow === 0) {
                            $('[data-buy-id="' + options.productId + '"]').fadeOut(100);
                            setTimeout(function() {
                                $('[data-buy-id="' + options.productId + '"]').html(options.beforeHtml).fadeIn(100);
                                setTimeout(function() {
                                    $('[data-buy-id="' + options.productId + '"]').fadeOut(100);
                                    setTimeout(function() {
                                        $('[data-buy-id="' + options.productId + '"]').html(options.afterHtml).fadeIn(100);
                                    }, 100);
                                }, 3000);
                            }, 100);
                        } else {
                            location.href = '/' + PAGE_LINK.CART;
                        }
                        break;
                    case 2:
                        closeVariant();
                        autoCart = false;
                        window.location.href = obj.url;
                        break;
                    case 3:
                        closeVariant();
                        autoCart = false;
                        if (opt.buyNow === 0) {
                            if (parseInt(post.relatedProductId) > 0 && releatedPopup === false && $('#basketWin').length > 0) {
                                $('#basketWin').angularTemplate();
                            } else {
                                $('[data-buy-id="' + options.productId + '"]').fadeOut(100);
                                setTimeout(function() {
                                    $('[data-buy-id="' + options.productId + '"]').html(options.beforeHtml).fadeIn(100);
                                    var cartPopup = new Message({
                                        id: 'cartPopup',
                                        html: obj.content,
                                        width: 1000,
                                        openingCallback: function() {
                                            if (typeof openingCartCallback === 'function') {
                                                openingCartCallback();
                                            }
                                        },
                                        closingCallback: function() {
                                            if (typeof openingCartCallback === 'function') {
                                                closingCartCallback();
                                            }
                                        }
                                    });
                                    cartPopup.flexbox();
                                    cartPopup.show()

                                    setTimeout(function() {
                                        $('[data-buy-id="' + options.productId + '"]').fadeOut(100);
                                        setTimeout(function() {
                                            $('[data-buy-id="' + options.productId + '"]').html(options.afterHtml).fadeIn(100);
                                        }, 100);
                                    }, 3000);
                                }, 100);
                            }
                        } else {
                            location.href = '/' + PAGE_LINK.CART;
                        }
                        break;
                }
            }
        },
        complete: function() {
            // sepete ard arda sürekli tıklayınca popuplar bozuluyor
            if (addToCartDom.length > 0) {
                setTimeout(function() {
                    addToCartDom.on('click', function() {
                        if (typeof addToCartEvent !== 'undefined') {
                            eval(addToCartEvent);
                        }
                    });
                }, 1000);
            }
            $('#cartDetail.angularTemplate').angularTemplate();
        }
    });
}


function FormLoader(options) {
    var opt = {
        selector: 'form:last',
        url: '',
        callback: function() {

        }
    };
    for (var i in options) {
        opt[i] = options[i];
    }
    $.ajax({
        url: opt.url,
        dataType: 'json',
        success: function(result) {
            var myForm = $(opt.selector);
            for (var key in result) {
                var val = result[key];

                if (val === null) {
                    continue;
                }

                var input = myForm.find('[name="' + key + '"]');

                if (input.length > 0) {
                    if (input.attr('type') === 'checkbox' || input.attr('type') === 'radio') {

                        var propVal = (result[key] == input.val() || parseInt(result[key]) === 1) ? false : true;
                        if (!propVal) {
                            input.prop('checked', propVal);
                            input.parents('.form-control:first').trigger('click');
                        }
                    } else {
                        if (input.val() === '' || typeof input.val() === "undefined") {
                            if (typeof result[key] !== 'undefined' || result[key] !== '' || result[key] !== null) {
                                input.next('.placeholder').addClass('focus');
                            }
                            input.val(result[key]);
                        }
                    }

                }
            }
            opt.callback(result);
        }
    });
}

function Message(options) {
    Message.instance = Message.instance || {};
    Message.counter = Message.counter || 0;
    var opt = {
        id: 'popup' + Message.counter,
        param: '',
        url: '',
        html: '',
        timeout: 3500,
        width: 'auto',
        height: 'auto',
        handler: '',
        openingCallback: function() {

        },
        closingCallback: function() {

        },
        buttons: [],
        openingEffect: 'drop',
        openingEffectTime: 600,
        openingEasing: 'easeOutBack',
        closingEffect: 'tsoftBottom',
        closingEffectTime: 600,
        closingEasing: 'swing',
        selector: '#popup' + Message.counter,
        disableClose: false,
    };

    for (var i in options) {
        opt[i] = options[i];
    }
    opt.selector = '#' + opt.id;

    this.get = function(key) {
        return opt[key];
    };

    this.set = function(key, val) {
        opt[key] = val;
        return true;
    };

    var _this = this;

    if (typeof Message.instance[_this.get('id')] !== 'undefined') {
        $(_this.get('selector')).parents('.pWrapper').remove();
    }
    Message.instance[_this.get('id')] = _this;
    Message.instance.activePopup = _this;

    Message.showDialog = function(html, width, height, disableClose) {
        var count = Object.keys(Message.instance).length + 1;
        var _setting = {
            id: 'myPopup' + count,
            selector: '#myPopup' + count,
            html: html,
            width: width > 100 ? width : 'auto',
            height: height > 0 ? height : 'auto',
            openingCallback: function() {
                $('body').addClass('flexPopup');
            },
            closingCallback: function() {
                $('body').removeClass('flexPopup');
            },
            disableClose: disableClose,
        };
        var _instance = new Message(_setting);
        _instance.show();
    };

    Message.debug = function(html, width, timeout) {
        var count = Object.keys(Message.instance).length + 1;
        var t = timeout > 1000 ? timeout : 3500;
        var _setting = {
            id: 'myPopup' + count,
            selector: '#myPopup' + count,
            html: html,
            width: width > 100 ? width : 400
        };
        var _instance = new Message(_setting);
        _instance.show(true);
        setTimeout(function() {
            _instance.close();
            $('body').removeClass('flexPopup');
        }, t);
    };


    function getButtonsHtml() {
        if (opt.buttons.length < 1) {
            return '';
        }
        var returnHtml = '';
        for (var i = 0; i < opt.buttons.length; i++) {
            var b = opt.buttons[i];
            var cls = b['class'] || 'btn-success fr';
            var text = b['text'] || 'Kapat';
            var attr = b['attr'] || '';
            //            var fnName = opt['id']+'_click'+i;
            returnHtml += '<button ' + attr + ' data-id="' + i + '" class="btn btn-radius ' + cls + '">' + text + '</button>';
        }
        return returnHtml;
    }

    this.fixHeight = function() {
        var maxH = $('.pWin:last').innerHeight();
        var contentHeight = $('.pText:last').innerHeight();
        var contentWidth = $('.pText:last').width();
        if (contentHeight > maxH) {
            $('.pWin:last').addClass('overflow').width(contentWidth);
        }
    };

    this.close = function(selector) {
        if (opt.disableClose == true) return;
        var selector = $(_this.get('selector')).parents('.pWrapper');
        selector.fadeOut(400, function() {
            selector.remove();
            $('body').css({
                'overflow': 'visible',
                'position': 'static'
            }).removeClass('popupActive');
            opt.closingCallback();
        });
    };

    var overflowStatus = '';
    this.overflow = function() {
        overflowStatus = ' overflow ';
    };

    var flexboxCls = '';
    this.flexbox = function() {
        flexboxCls = ' flexbox ';
    };

    this.show = function(debugActive) {
        var debugClass = debugActive === true ? 'debugActive' : '';


        var id = _this.get('id');
        /*var h = _this.get('height') === 'auto' ? 'auto' : _this.get('height') + 'px';
         var w = _this.get('width') === 'auto' ? 'auto' : _this.get('width') + 'px';*/
        var h = _this.get('height') + 'px';
        var w = parseInt(_this.get('width')) > 0 ? _this.get('width') + 'px' : 'auto';
        var l = 'margin:0 auto;';

        var content = _this.get('html');
        var div = $('<div>').html(content);

        content = content.replace(/\{\{param\}\}/g, _this.get('param'));

        //        var z = Message.counter * 3 + 9980;
        //        var html = '<div class="pWrapper" style="visibility: hidden;">\n\
        //                        <div class="pBg close" style="z-index:' + z + ';"></div>\n\
        //                        <div style="width:' + w + ';z-index:' + (++z) + ';" class="pWin box whiteBg ' + debugClass + ' br5" id="' + id + '">\n\
        //                            <div class="pClose close"></div><div class="pText col col-12"><div class="row">' + content + '</div></div>\n\
        //                        </div>\n\
        //                    </div>';
        //        $('body').append(html); //height:' + h + '


        var z = Message.counter * 3 + 9980;
        var html = '<div class="pWrapper" style="visibility: hidden;" data-name="' + id + '"><div class="flex">\n\
                        <div class="pBg close" style="z-index:' + z + ';"></div>\n\
                        <div style="width:' + w + ';' + l + ';z-index:' + (++z) + ';" class="pWin box whiteBg ' + flexboxCls + ' ' + overflowStatus + ' ' + debugClass + ' br5" id="' + id + '">\n\
                            <div class="pClose close"></div><div class="pText col col-12"><div class="row oh">' + content + '</div></div>\n\
                        </div>\n\
                    </div></div>';
        $('body').append(html);


        var focus = _this.get('focus') || '';
        if (focus !== '') {
            setTimeout(function() {
                $('#' + focus).focus();
            }, 1000);

        }

        if (content.indexOf('angularTemplate') === -1) {
            var maxW = Math.max($(window).width(), $('body').width());
            var maxH = $('.pWin:last').height();
            var contentHeight = $('.pText:last').height();
            var contentWidth = $('.pText:last').width();
            if (contentHeight > maxH) {
                $('.pWin:last').addClass('overflow').width(contentWidth);
            }
        }

        var buttonsHtml = getButtonsHtml();

        buttonsHtml = buttonsHtml === '' ? '' : '<div class="pButtons">' + buttonsHtml + '</div>';


        if (buttonsHtml !== '') {
            //contentHeight += 61;

            $('.pWin:last').addClass('withBtn').append(buttonsHtml);
            $('.pWin:last .pButtons button').click(function() {
                var number = parseInt($(this).attr('data-id'));
                var buttons = _this.get('buttons');
                var b = buttons[number];
                var close = true;

                T_Button.dom = $(this);
                T_Button.loadingText = LANG.get('waiting');
                T_Button.lock();

                if (typeof b.click === 'function') {
                    close = b.click(_this);
                }

                setTimeout(function() {
                    T_Button.unlock();
                }, 400);

                if (close === false) {
                    return false;
                }
                _this.close();
            });
        }


        //        console.log("OUTER4 H : " + $('.pWin:last').outerHeight());
        //        console.log("CONTENT4 H : " + contentHeight);

        //        if (contentHeight < (maxH - 40)) {
        //            $('.pWin:last').height(contentHeight);
        //            console.log("ContentHeight" + contentHeight);
        //        }
        //
        //        w = $('.pWin:last').outerWidth();
        //        h = h > 20 ? h : $('.pWin:last').outerHeight();
        //
        //        
        //
        //        var left = 15;
        //        var top = 15;
        //        if (maxW > w && w > 0) {
        //            left = (maxW - w - 10) / 2;
        //        }
        //
        //        if (maxH > h && h > 2) {
        //            top = (maxH - h - 51) / 2;
        //            if (top < 15) {
        //                top = 15;
        //            }
        //        }


        $('.pWrapper:last').css({ visibility: 'visible', display: 'block' });
        //$('.pWin:last').css({top: top + 'px', 'bottom': top + 'px'}); //left: left + 'px', bottom: top + 'px'



        if (debugActive !== true) {
            $('body').css({
                'width': '100%',
                'overflow': 'hidden',
                //'position': 'fixed'
            }).addClass('popupActive');
        }
        $('.pWrapper:last').fadeIn();

        if (navigator.appVersion.indexOf('Trident') > -1 && navigator.appVersion.indexOf('Edge') == -1) {
            $('body').addClass('ie');
            if (typeof placeCaller === 'function') {
                placeCaller();
            }
        }

        opt.openingCallback();

        return false;
    };
};

var Message1 = new Message({});

var LANG = {
    prefix: 'LANG_',
    selected_lang: '',
    cookie_name: 'lang',
    last_lang_arr: new Array(),
    lang: {},
    run: function(selectedKey) {
        if (typeof selectedKey !== 'undefined') {
            //selectedKey = LANG.prefix + selectedKey.replace(/'LANG_'/g, '');
            //if (typeof LANG.last_lang_arr[selectedKey] !== 'undefined')
            LANG.insert([selectedKey]);
            //$('.' + LANG.prefix + selectedKey).text(LANG.last_lang_arr[selectedKey]);
            return true;
        }

        for (var key in LANG.last_lang_arr) {
            if ($('.' + LANG.prefix + key).length > 0) {
                $('span[class^=' + LANG.prefix + ']').css('color', 'inherit');
                //$('.LANG_' + key).css('color', '#D30F94');
                $('.' + LANG.prefix + key).addClass('reset');

                var replaceArr = LANG.last_lang_arr[key].match(/\|(.*?)\|/ig);
                if (replaceArr) { //%x% içinde değer varsa, data-x içindeki değeri oraya replace et
                    $('.' + LANG.prefix + key).each(function() {
                        var newText = LANG.last_lang_arr[key];
                        for (var i = 0; i < replaceArr.length; i++) {
                            var replaceKey = replaceArr[i].replace(/\|/g, '');
                            if ($('.' + LANG.prefix + key).attr('data-' + replaceKey)) {
                                newText = newText.replace(replaceArr[i], $(this).attr('data-' + replaceKey));
                            }

                        }
                        $(this).text(newText);
                    });
                } else {
                    $('.' + LANG.prefix + key).text(LANG.last_lang_arr[key]);
                }
            }
        }
        setTimeout(function() {
            $('span[class^=' + LANG.prefix + ']').css('color', 'inherit');
        }, 3000);
    },
    getLang: function(is_load, callback) {
        if (is_load === true && typeof getCookie(LANG.cookie_name) !== 'undefined' && getCookie(LANG.cookie_name).length === 2) {
            LANG.selected_lang = getCookie(LANG.cookie_name);
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            $.get('/srv/admin/settings/language/selected-lang', function(msg) {
                msg = msg.replace(/\W/ig, '');
                if (msg.length > 1 && msg.length < 4) {
                    LANG.selected_lang = msg;
                } else {
                    LANG.selected_lang = 'tr';
                }
                setCookie(LANG.cookie_name, LANG.selected_lang, 1);
                if (typeof callback === "function")
                    callback();
            });
        }
        return LANG.selected_lang;
    },
    load: function(lang_path, callback) {
        var path = lang_path.replace(/\.js.*$/g, '');
        path += lang_path.replace(/^.*(\.js)?(\?.*)?$/g, '.js$2');

        try {
            if (typeof getCookie('cacheTag') !== 'undefined')
                path += '?cacheTag=' + getCookie('cacheTag');
        } catch (ex) {

        }

        LANG.selected_lang = LANG.selected_lang.replace(/\W/i, '');
        if (LANG.selected_lang.length !== 2) {

            LANG.getLang(true, function() {
                var url = '/lang_content/' + LANG.selected_lang + '/' + path;
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                $("head").append(script);
                setTimeout(function() {
                    LANG.run();
                    if (typeof callback !== 'undefined')
                        callback();
                }, 1000);
            });
        } else {
            var url = '/lang_content/' + LANG.selected_lang + '/' + path;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            $("head").append(script);

            setTimeout(function() {
                LANG.run();
                if (typeof callback !== 'undefined')
                    callback();
            }, 1000);
        }
        return true;
    },
    get: function(key, _default) {
        var _defaultValue = _default || '<span class="LANG ' + LANG.prefix + key + '" style="color:red">' + key + '</span>';
        return typeof LANG.lang[key] !== 'undefined' ? LANG.lang[key] : _defaultValue;
    },
    set: function(arr) {
        LANG.last_lang_arr = arr;
        for (var key in arr) {
            LANG.lang[key] = arr[key];
        }
        LANG.run();
    },
    insert: function(arr, iframe) {
        for (var i = 0; i < arr.length; i++) {
            var val = typeof LANG.lang[arr[i]] !== 'undefined' ? LANG.lang[arr[i]] : '<span class="LANG ' + LANG.prefix + arr[i] + '" style="color:red">' + arr[i] + '</span>';

            var element;
            if (typeof iframe === 'undefined') {
                element = $('.' + arr[i] + ', .' + LANG.prefix + arr[i]);
            } else {
                element = $(iframe).contents().find('.' + arr[i] + ', .' + LANG.prefix + arr[i]);
            }
            $(element).html(val);

            element.each(function() {
                val = typeof LANG.lang[arr[i]] !== 'undefined' ? LANG.lang[arr[i]] : '<span class="LANG ' + LANG.prefix + arr[i] + '" style="color:red">' + arr[i] + '</span>';

                $.each(this.attributes, function() {
                    if (this.specified) {
                        var attrVal = decodeURIComponent(this.value);
                        attrVal = attrVal.replace(/\+/g, ' ');
                        val = val.replace('{' + this.name + '}', attrVal);
                    }
                });
                $(this).html(val);
            });

        }
    }
};


$('.subscribe').click(saveMaillist);

var saveMaillist;
saveMaillist.callBack = undefined;

function saveMaillist(btn) {

    btn = btn ? $(btn.target) : (btn !== undefined ? $(btn) : $('.subscribe'));

    var ct = btn.parents('.newsletterMain');
    var data = {};

    if (ct.find('.sub-name').length > 0) {
        data['name'] = ct.find('.sub-name').val() ? ct.find('.sub-name').val() : $('.sub-name').val();
    }
    if (ct.find('.sub-surname').length > 0) {
        data['surname'] = ct.find('.sub-surname').val() ? ct.find('.sub-surname').val() : $('.sub-surname').val();
    }
    if (ct.find('.sub-phone').length > 0) {
        data['phone'] = ct.find('.sub-phone').val() ? ct.find('.sub-phone').val() : $('.sub-phone').val();
    }
    if (ct.find('.sub-email').length > 0) {
        data['email'] = ct.find('.sub-email').val() ? ct.find('.sub-email').val() : $('.sub-email').val();
    }
    if (ct.find('.sub-gender').length > 0) {
        data['gender'] = ct.find('.sub-gender').val() ? ct.find('.sub-gender').val() : $('.sub-gender').val();
    }

    $(".newsletter .subscribe img").remove();

    $(".newsletter .subscribe").append('<img style="margin: 0px 10px;position: absolute;" src="theme/standart/images/zoomloader.gif" title="Lütfen bekleyiniz" />');

    $.ajax({
        type: 'POST',
        url: '/srv/service/guest/subscribeNewsletter',
        data: data,
        dataType: 'json',
        success: function(result) {
            if (result.status === 0) {
                var element = ct.find('.' + result.key);
                if (element.length > 0) {
                    tooltip.show(element, result.statusText, 2000, 'btn-danger');
                    var pos = element.offset().top - 100;
                    $('html, body').animate({
                        scrollTop: pos
                    }, 800);
                } else {
                    Message.debug(result.statusText + '(' + result.key + ')');
                }
                return false;
            } else if (result.status === 1) {
                Message.instance.activePopup.close();
                Message.showDialog(result.statusText, 500);
            }
        }
    });
    return false;
}



function siteAdvice(prId) {
    $.ajax({
        type: 'POST',
        url: '/srv/service/site/advice',
        data: {
            'email': $("#advice-email").val(),
            "GonderenAdi": $("#site-tasiye-isim").val(),
            "GonderenEposta": $("#site-tavsiye-eposta").val(),
            "AliciAdi": $("#site-alici-adi").val(),
            "AliciEposta": $("#site-alici-eposta").val(),
            "Mesaj": $("#site-tavsiye-mesaj").val()
        },
        dataType: 'json',
        success: function(r) {
            Message.debug(r.statusText);
        }
    });
    return false;
}

var ProductDynamicLoad = {
    pageNo: 2,
    pageNoParam: 'Baslan',
    baseUrl: '.BASE_URL:last',
    parentDiv: '.UrunKatalogDivIc',
    productDiv: '.UrunKatalog',
    loadMoreButton: '.LoadMoreButton',
    heightEqualDiv: '#katalog',
    loadMoreStatus: true,
    scrollLoadStatus: true,
    loadingStatus: false,
    loadMore: function() {
        var p = ProductDynamicLoad;
        if (p.loadMoreStatus === false) {
            cLog('Daha fazla ürün yok.";');
            $(p.loadMoreButton).hide('slow');
            return false;
        }
        var params = $(p.baseUrl).val().replace(/.*\?/ig, '');
        params = params.replace(/^\&/gi, '').replace(/\&$/gi, '');
        var requestLink = window.location.pathname.replace(/^\//ig, '');
        params = params + '&' + p.pageNoParam + '=' + p.pageNo + '&link=' + requestLink;
        p.pageNo++;

        $.ajax({
            url: '/Diger/product_dynamic_load.php?' + params,
            success: function(data) {
                var dom = $('<div/>').html(data).contents();
                var totalProduct = $(dom).find(p.productDiv).length;
                if (totalProduct === 0)
                    p.loadMoreStatus = false;
                $(dom).find(p.productDiv).hide().addClass('loadedProduct');
                $(p.parentDiv).append($(dom).find(p.productDiv));
                $(p.parentDiv).find('.loadedProduct').fadeIn(1000);

                if (typeof $.fn.lazyload === 'function')
                    $(p.parentDiv).find('.loadedProduct img.lazy').lazyload();

                $('.loadedProduct').removeClass('loadedProduct');

                $(p.heightEqualDiv).equalizer(); /* dinamik yükleme sonrası boyut eşitleme */

                subProListener(); /* dinamik yükleme sonrası altürün */
                p.loadingStatus = false;
            }
        });
    },
    check: function() {
        var p = ProductDynamicLoad;
        var baseUrl = $(p.baseUrl).val();
        if (typeof baseUrl === 'undefined') {
            cLog('Sayfada BASE_URL bulunamadı. Örnek Kullanım: <input type="hidden" id="BASE_URL" value="{$BASE_URL}"/>');
            return false;
        }
        if ($(p.parentDiv).length < 1) {
            if (typeof $(p.productDiv).parent().attr('class') === 'undefined')
                $(p.productDiv).parent().attr('class', 'productDivParent');
            p.parentDiv = '.' + $(p.productDiv).parent().attr('class').replace(/^\s*(\w+)\s.*/ig, '$1');
        }
        if ($(p.productDiv).length < 1) {
            cLog('Parametreler boş bırakılamaz. Örnek Kullanım: ');
            cLog('ProductDynamicLoad.parentDiv=".UrunKatalogDivIc";');
            cLog('ProductDynamicLoad.productDiv=".UrunKatalog";');
            cLog('ProductDynamicLoad.run();');
            return false;
        }

        $(p.heightEqualDiv).equalizer();
        if (typeof p.loadMoreButton === 'undefined')
            cLog('Sayfada "Daha Fazla Yükle" butonu bulunamadı.');

        return true;
    },
    scrollLoad: function() {
        var p = ProductDynamicLoad;
        var scrollFunc = function(pageY) {
            var lastProductTop = $(p.productDiv + ':last').offset().top;
            var scrollTop = $(document).scrollTop();
            var diff = 600 + pageY;
            //$('#filter-panel a').html(parseInt(scrollTop + diff) + " | " + parseInt(lastProductTop));
            if (scrollTop + diff > lastProductTop && p.loadingStatus === false) {
                p.loadingStatus = true;
                p.loadMore();
            }
        };
        $(window).scroll(function() {
            scrollFunc(0);
        });
        document.body.addEventListener('touchend', function(e) {
            scrollFunc(parseInt(e.changedTouches[0].pageY));
        }, false);
    },
    run: function() {
        $(document).ready(function() {
            var p = ProductDynamicLoad;
            if (p.check() === false)
                return false;
            if (p.scrollLoadStatus)
                p.scrollLoad();
            $(p.loadMoreButton).click(p.loadMore);

        });
    }
};

function GetCount(ddate, iid) {
    var _this = this;
    GetCount.counter = GetCount.counter || 0;

    if (GetCount.counter == 0) {
        $.getScript('/srv/service/conf/load/', function() {});
    }

    GetCount.counter++;

    var get = function() {
        dateNow = new Date(); //grab current date
        amount = ddate.getTime() - dateNow.getTime(); //calc milliseconds between dates
        delete dateNow;

        // if time is already past
        if (amount < 0) {
            document.getElementById(iid).innerHTML = "<b>" + LANG.get('deal_expired') + "</b>";
            if (document.getElementById('tsoft_counter_label'))
                document.getElementById('tsoft_counter_label').innerHTML = "";
        }
        // else date is still good
        else {
            days = 0;
            hours = 0;
            mins = 0;
            secs = 0;
            out = '<span class="campaign-text fl">' + LANG.get('remaining_time') + ' :</span><span class="capmaign-timer fl">';

            amount = Math.floor(amount / 1000); //kill the "milliseconds" so just secs

            days = Math.floor(amount / 86400); //days
            if ($('#' + iid).find('.days')) {
                $('#' + iid).find('.days').html(days);
            }
            amount = amount % 86400;

            hours = intToClockDigit(Math.floor(amount / 3600)); //hours
            if ($('#' + iid).find('.hours')) {
                $('#' + iid).find('.hours').html(hours);
            }
            amount = amount % 3600;

            mins = intToClockDigit(Math.floor(amount / 60)); //minutes
            if ($('#' + iid).find('.mins')) {
                $('#' + iid).find('.mins').html(mins);
            }
            amount = amount % 60;

            secs = intToClockDigit(Math.floor(amount)); //seconds
            if ($('#' + iid).find('.secs')) {
                $('#' + iid).find('.secs').html(secs);
            }

            if (!$('#' + iid).hasClass('splitted') && document.getElementById(iid) != null) {
                out += '<span class="timer-block fl"><span class="timer-value fl">' + days + '</span><span class="timer-type fl">' + LANG.get('days') + '</span></span>';
                out += '<span class="timer-block fl"><span class="timer-value fl">' + hours + '</span><span class="timer-type fl">' + LANG.get('hours') + '</span></span>';
                out += '<span class="timer-block fl"><span class="timer-value fl">' + mins + '</span><span class="timer-type fl">' + LANG.get('mins') + '</span></span>';
                /*out += '<li class="saniye">' + secs + "</li>";*/
                out += '</span>';
                document.getElementById(iid).innerHTML = out;
            }

            var x = setTimeout(function() {
                get();
            }, 1000);
        }
    };

    setTimeout(function() {
        get();
    }, 400);
}

function intToClockDigit(val) {

    return (val.toString().length === 1) ? ('0' + val) : val;
}

function RefreshImage(ImageId, NewImageSrc) {
    var img = document.getElementById(ImageId);
    img.src = NewImageSrc + '?' + Math.random();
}

function getVar(v) {
    var q = window.location.search.substring(1);
    var vs;

    if (q == "" && (v == "Kid" || v == "Uid" || v == "MarkaId" || v == "ModelId")) {
        q = window.location.toString();
        vs = q.split("/");
        q = vs[vs.length - 1];
        vs = q.split(",");
        var regs = new Array();
        regs["Kid"] = /\K\d+$/;
        regs["Uid"] = /\U\d+$/;
        regs["MarkaId"] = /\M\d+$/;
        regs["ModelId"] = /\Y\d+$/;
        for (var i = 0; i < vs.length; i++) {
            if (regs[v].test(vs[i])) {
                return vs[i].substr(1);
            }
        }
    } else {
        vs = q.split("&");
        for (var i = 0; i < vs.length; i++) {
            var p = vs[i].split("=");
            if (p[0] == v) {
                return p[1];
            }
        }
    }
    return '';
}

var baseUrl = getHostUrl();

function getHostUrl() {
    var scripts = document.getElementsByTagName('script'),
        path, i, scriptSrc, match;
    for (i = 0, ln = scripts.length; i < ln; i++) {
        scriptSrc = scripts[i].src;

        match = scriptSrc.match(/general\.js$/);
        if (match) {
            path = scriptSrc.substring(0, scriptSrc.length - 13);
            break;
        }
    }
    return path;
}

// Çerez Kullanım Uyarısı

var CookieBar = {
    isActive: false,
    cookie: 'CookieLaw',
    titleDom: '.cookieLawTitle',
    bodyDom: '.cookieLawBody',
    load: function(cb) {

        CookieBar.isActive = $("#cookie-law").val() === "1" || false;

        if (CookieBar.isActive === true && CookieBar.getCookie() !== "1") {
            CookieBar.getContent(function(r) {
                if (typeof cb === 'function') {
                    cb(r);
                }
            });
        }
    },
    setCookie: function(state) {
        setCookie(CookieBar.cookie, state, 15);
    },
    getCookie: function() {
        return getCookie(CookieBar.cookie);
    },
    getContent: function(cb) {

        var tmp;

        $.ajax({
            type: 'GET',
            url: '/srv/service/site/get-cookie-law',
            data: {},
            success: function(r) {
                try {
                    tmp = JSON.parse(r);
                    $(CookieBar.titleDom).html(tmp.Title);
                    $(CookieBar.bodyDom).html(tmp.Content);
                    CookieBar.setCookie(1);

                    if (typeof cb === 'function') {
                        cb(tmp);
                        return false;
                    }

                } catch (e) {
                    console.log(e);
                    return false;
                }
            },
        });
    }
};

$(function() {
    CookieBar.load(function(r) {
        // load yukarda cookiebar a dom class verilirse dolduruyor
        console.log(r);
    });
});

var ReturnFormMsgCallback = null;

var ApprovePageTracking = {
    callbackArray: []
};

var LoginPageTracking = {
    Callback: {},
    callbackArray: []
};

var SignPageTracking = {
    Callback: {}
};

var T_Button = {};
T_Button.dom = null;
setTimeout(() => {
    T_Button.loadingText = LANG.get('waiting', 'Bekleyiniz...');
}, 500);
T_Button.tmpText = '';
T_Button.lock = function() {
    if (T_Button.dom.is('input')) {
        T_Button.tmpText = T_Button.dom.val();
        T_Button.dom.attr('disabled', true);
        T_Button.dom.val(T_Button.loadingText);
    } else {
        T_Button.tmpText = T_Button.dom.html();
        T_Button.dom.attr('disabled', true);
        T_Button.dom.html(T_Button.loadingText);
    }
};
T_Button.unlock = function() {
    T_Button.dom.attr('disabled', false);
    if (T_Button.dom.is('input')) {
        T_Button.dom.val(T_Button.tmpText);
    } else {
        T_Button.dom.html(T_Button.tmpText);
    }

};

var referererStorage = {
    hasLocal: 'localStorage' in window && window['localStorage'] !== null,
    addItem: function() {
        if (this.hasLocal) {
            this.addItemStorage();
        } else {
            this.addItemCookie();
        }
    },
    hasQueryString: function() {
        var ref = document.referrer || "";
        if (ref == '') {
            return false;
        }
        var a = document.createElement("a");
        a.href = ref;
        var q = '';
        var queryString = a.search;
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair[0] == 'q') {
                q = pair[1];
            }
        }
        return q != '';
    },
    addItemStorage: function() {
        var cReferrer = localStorage.getItem("cReferrer");
        var items = [];
        if (cReferrer !== null) {
            try {
                var obj = JSON.parse(cReferrer);
            } catch (err) {
                var obj = {};
            }
            if (typeof obj.schedule != "undefined" && Date.now() < obj.schedule && !this.hasQueryString()) {
                return;
            }
            items = obj.items || [];
        }
        items.push({ time: parseInt(Date.now() / 1000), uri: document.referrer, page: window.location.href });
        this.setItems(items);
    },
    addItemCookie: function() {
        try {
            var cReferrer = $.cookie("cReferrer");
        } catch (err) {
            return;
        }

        var items = [];
        if (cReferrer !== null) {
            try {
                var obj = JSON.parse(cReferrer);
            } catch (err) {
                var obj = {};
            }
            if (typeof obj.schedule != "undefined" && Date.now() < obj.schedule && !this.hasQueryString()) {
                return;
            }
            items = obj.items || [];
        }
        items.push({ time: parseInt(Date.now() / 1000), uri: document.referrer });
        this.setItems(items);
    },
    getObj: function() {
        var cReferrer = null;
        var cReferrerObj = {};
        if (this.hasLocal) {
            cReferrer = localStorage.getItem("cReferrer");
        } else {
            try {
                cReferrer = $.cookie("cReferrer");
            } catch (err) {}
        }

        try {
            cReferrerObj = JSON.parse(cReferrer);
        } catch (err) {}
        return cReferrerObj;
    },
    getItems: function() {
        return this.getObj().items || [];
    },
    setItems: function(items) {
        var obj = {
            schedule: Date.now() + (24 * 60 * 60 * 1000),
            items: items || []
        };
        this.save(obj);
    },
    save: function(sObj) {
        if (this.hasLocal) {
            this.saveStorage(sObj);
        } else {
            this.saveCookie(sObj);
        }
    },
    saveStorage: function(sObj) {
        localStorage.setItem("cReferrer", JSON.stringify(sObj));
    },
    saveCookie: function(sObj) {
        try {
            $.cookie("cReferrer", JSON.stringify(sObj), { path: '/', expires: 30 });
        } catch (err) {}
    }
};

function passwordStrengthControl() {
    if(window.location.pathname.indexOf('/Y/') > -1 || window.location.pathname.indexOf('/srv/admin') > -1) return;
    if(typeof MEMBER_INFO.PASSWORD_STRENGTH == 'undefined') return;
    if(Number(MEMBER_INFO.ID) < 1) return;
    if(Number(MEMBER_INFO.PASSWORD_STRENGTH) > 6) return;

    var a = document.createElement('a');
    a.href = '#';
    a.dataset.url = '/srv/service/content/get-block/1058';
    a.dataset.width = '500';
    a.dataset.id = 'strength-password';
    a.dataset.callback = 'passwordStrengthCallback';
    a.className = 'popupWin';
    document.body.appendChild(a);
    a.click();
}

function passwordStrengthCallback() {
    $('#strength-password .pageTitle').next('div').html('<ul class="box col-12 strength-password-caption"><b>Lütfen şifrenizi değiştirin.</b><li class="fl col-12">Minimum 10 karakter,</li><li class="fl col-12">1 Küçük harf,</li><li class="fl col-12">1 Büyük harf,</li><li class="fl col-12">0-9 Arasında 1 sayı,</li><li class="fl col-12">.#?!@$%^&*- özel karakter, olmasına dikkat ediniz.</li></ul>');
    flexPlace();
}

$(document).ready(function() {
    referererStorage.addItem();
    FavouriteApi.setButtons();
    passwordStrengthControl();
});

$(document).on('click', '.variantList a', function() {
    if ($(".subProductAlert").length > 0) {
        $(".subProductAlert").attr('data-url', $(".subProductAlert").attr('data-url') + '-' + $(this).attr('data-subproduct-id'));
    }
});

/*
 *  GOOGLE LOGIN
 */

$(document).on('click', '#signinGoogle', function() {
    if (typeof auth2 !== 'undefined') {
        auth2.grantOfflineAccess().then(signInGoogleCallback);
    }
});

function signInGoogleCallback(authResult) {

    if (authResult['code']) {
        location.href = location.origin + '/srv/service/social/google/login?code=' + authResult['code'];
    } else {
        // There was an error.
    }
}


window.APP = window.APP || {};

window.APP.Instagram = {

    url: '/srv/service/social/instagram/feed/',
    count: 20,

    get: function(callback) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: this.url + this.count,
            success: function(result) {
                if (typeof callback === 'function') {
                    callback(result);
                }
            }
        });
    },

    toHtml: function(callback) {

        this.get(function(r) {
            var li = '';
            for (var i = 0; i < r.response.data.length; i++) {
                li += '<li><img src="' + r.response.data[i].images.standard_resolution.url + '"/></li>'
            }
            var str = '<ul>' + li + '</ul>'
            if (typeof callback === 'function') {
                callback(str);
            }
        });

    },

    toJson: function(callback) {
        this.get(function(r) {
            if (typeof callback === 'function') {
                callback(r);
            }
        });
    }


}
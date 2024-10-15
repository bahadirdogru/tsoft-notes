window.addEventListener('load', async function () {
    await TSOFT_APPS.get.basket();
    await TSOFT_APPS.get.cart.load();
    addressSingleReadyCallback = function () {
        //console.log('addressSingleReadyCallback: ', arguments);
    }
    paymentCallback = function () {
        // console.log('paymentCallback: ', arguments);
    }
    switch (PAGE_TYPE) {
        case 'other':
            TSOFT_APPS.page.other.callback.forEach(async call => {
                if (typeof call !== "function") {
                    return false;
                }
                await call(CATEGORY_DATA, PRODUCT_DATA);
            })
            break;
        case 'home':
            TSOFT_APPS.page.home.callback.forEach(async call => {
                if (typeof call !== "function") {
                    return false;
                }
                await call(PRODUCT_DATA);
            })
            break;
        case 'category':
            if (TSOFT_APPS.page.category.callback.length > 0) {
                startCategoryCallback();
            }

        async function startCategoryCallback() {
            await TSOFT_APPS.page.category.callback.forEach(async call => {
                if (typeof call !== "function") {
                    return false;
                }
                await call(CATEGORY_DATA, PRODUCT_DATA);
            })
        }

            break;
        case 'product':
            if (TSOFT_APPS.product.detail.callback.length > 0) {
                startProductCallback();
            }

        async function startProductCallback() {
            await TSOFT_APPS.product.detail.callback.forEach(async call => {
                if (typeof call !== "function") {
                    return false;
                }
                await call(PRODUCT_DATA);
            })
        }

            break;
        case 'search':
            if (TSOFT_APPS.page.search.callback.length > 0) {
                startSearchCallback();
            }

        async function startSearchCallback() {
            const searchWord = document.getElementById("search_word").value;
            await TSOFT_APPS.page.search.callback.forEach(async call => {
                if (typeof call !== "function") {
                    return false;
                }
                await call(searchWord, PRODUCT_DATA);
            })
        }

            break;
        case 'cart':
            if (TSOFT_APPS.page.cart.callback.length > 0) {
                startCartCallback();
            }

        async function startCartCallback() {
            TSOFT_APPS.page.cart.callback.forEach(async call => {
                if (typeof call !== "function") {
                    return false;
                }
                await call(TSOFT_APPS.get.result.basket, TSOFT_APPS.get.cart.load);
            })
        }

            break;
    }
    // V4 için mapping edilmiş callback ler.
    // Buradaki kodlar </body> hemen öncesine eklenmelidir.
    // window olay dinleyicileri ile DOM yükleme ve sayfa yüklendikten sonra dinlendi fakat bazı callback ler hataya düştü.
    // script etiketlerine "defer" özelliği eklendiğinde ise PAGE_TYPE gibi olaylarda tetiklenmediği gözlemlendi.
    // Var olan Array tipindeki callback ile TSOFT_APPS eşleştirilmesi
    // sepet
    Cart.callback.add.push(...TSOFT_APPS.cart.callback.add);
    Cart.callback.load.push(...TSOFT_APPS.cart.callback.load);
    // ödeme tipi değişikliği
    PaymentMethods.callback.change.push(...TSOFT_APPS.paymentMethods.callback.change);
    // ürün
    QuickViewObj.callback.open.push(...TSOFT_APPS.product.quickView.callback.open);
    // sayfa bazlı izleme kodu
    ApprovePageTracking.callbackArray.push(...TSOFT_APPS.page.tracking.approve.callback)
    LoginPageTracking.callbackArray.push(...TSOFT_APPS.page.tracking.login.callback);
    // typeof => 'function' kabul edilen callback fonksiyonlar.
    // Bu callbackler uygulamalarda birden fazla kullanılır. ->
    // -> Tipi Function olmasından kaynaklı en son yazılan callback, diğer bütün callbackleri etmektedir.
    SignPageTracking.Callback = function (data) {
        if (!(TSOFT_APPS.page.tracking.sign.callback.length > 0)) return false;
        TSOFT_APPS.page.tracking.sign.callback.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            call(data);
        })
    }
    DeleteWishListCallback = function (id, product) {
        if (!(TSOFT_APPS.product.wishList.callback.delete.length > 0)) return false;
        TSOFT_APPS.product.wishList.callback.delete.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            call(id, product);
        })
    }
    AddToWishListCallback = function (data, product) {
        if (!(TSOFT_APPS.product.wishList.callback.add.length > 0)) return false;
        TSOFT_APPS.product.wishList.callback.add.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            product = {
                "status": 1,
                "data": product
            };
            call(product, data);
        })
    }
    Cart.callback.delete = function (data) {
        if (!(TSOFT_APPS.cart.callback.delete.length > 0)) return false;
        TSOFT_APPS.cart.callback.delete.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            call(data);
        })
    }
    Cart.callback.deleteAll = function (data) {
        if (!(TSOFT_APPS.cart.callback.deleteAll.length > 0)) return false;
        TSOFT_APPS.cart.callback.deleteAll.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            call(data);
        })
    }
    Cart.callback.update = function (data) {
        if (!(TSOFT_APPS.cart.callback.update.length > 0)) return false;
        TSOFT_APPS.cart.callback.update.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            call(data);
        })
    }
    Cart.callback.updateAll = function (data) {
        if (!(TSOFT_APPS.cart.callback.updateAll.length > 0)) return false;
        TSOFT_APPS.cart.callback.updateAll.forEach(call => {
            if (typeof call !== "function") {
                return false;
            }
            call(data);
        })
    }
})

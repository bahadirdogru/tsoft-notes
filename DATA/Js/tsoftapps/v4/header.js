var TSOFT_APPS = {
    cart: {
        callback: {
            add: [],
            delete: [],
            deleteAll: [],
            update: [],
            updateAll: [],
            load: [],
        }
    },
    order: {
        address: {
            callback: []
        },
        payment: {
            callback: []
        },
        approve: {
            callback: []
        }
    },
    paymentMethods: {
        callback: {
            change: []
        }
    },
    product: {
        detail: {
            callback: []
        },
        quickView: {
            callback: {
                open: []
            }
        },
        wishList: {
            callback: {
                add: [],
                delete: []
            }
        },
        click: {
            callback: []
        },
        stockAlarm: {
            callback: {
                add: [],
                delete: [],
                deleteAll: []
            }
        },
        dynamicLoader: []
    },
    page: {
        cart: {
            callback: []
        },
        search: {
            callback: []
        },
        category: {
            callback: [],
            dynamicLoad: {
                callback: []
            }
        },
        tracking: {
            approve: {
                callback: []
            },
            login: {
                callback: []
            },
            sign: {
                callback: []
            }
        },
        home: {
            callback: []
        },
        other: {
            callback: []
        },
        member: {
            confirmation: {
                callback: []
            }
        }
    },
    get: {
        basket: undefined,
        cart: {
            count: window.CART_COUNT ?? window.SEPET_MIKTAR,
            total: window.CART_TOTAL ?? window.SEPET_TOPLAM,
            load: undefined
        },
        result: {
            basket: undefined,
            cart: {
                load: undefined
            }
        },
        member: {
            ...window.MEMBER_INFO,
            isLogin: window.MEMBER_INFO.ID > 0,
        },
        currencyIso: window.CURRENCY === 'TL' ? "TRY" : window.CURRENCY
    },
    other: {
        register: [],
        subscribe: []
    }
}
const TSOFT_APPS_LIBS = {
    fetch: {
        post: async function (url, body = {}, option) {
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(body)
            }
            const response = await fetch(url, options);
            return response.json();
        }
    },
    get: {
        script: {
            head: (uri, callback) => {
                const script = document.createElement('script');
                script.src = uri
                if (typeof callback === 'function' && callback !== undefined) {
                    script.onload = callback
                }
                document.head.appendChild(script);
            },
            body: (uri, callback) => {
                const script = document.createElement('script');
                script.src = uri
                if (typeof callback === 'function' && callback !== undefined) {
                    script.onload = callback
                }
                document.body.appendChild(script);
            }
        },
        cookie: (cname) => {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    },
    set: {
        cookie: (cname, cvalue, exdays) => {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
    }
}
const TSOFT_APPS_ENDPOINTS = {
    getBasket: "/srv/service/customer/get-basket",
    getCartLoad: "/srv/service/cart/load"
}
// Fonksiyonlar
TSOFT_APPS.get.basket = async function (call) {
    const response = await fetch(TSOFT_APPS_ENDPOINTS.getBasket)
    const data = response.json();
    TSOFT_APPS.get.result.basket = data;
    if (typeof call === 'function') {
        return await call(response.json());
    }
}
TSOFT_APPS.get.cart.load = async function (call) {
    const response = await fetch(TSOFT_APPS_ENDPOINTS.getCartLoad)
    const data = response.json();
    TSOFT_APPS.get.result.cart.load = data;
    if (typeof call === 'function') {
        return await call(data);
    }
}

function TsoftAppsOrderAddressCallback(func) {
    if (window.PAGE_TYPE === 'address' && typeof func === 'function') {
        TSOFT_APPS.order.address.callback.push(func)
    }
}

function TsoftAppsOrderPaymentCallback(func) {
    if (window.PAGE_TYPE === 'payment' && typeof func === 'function') {
        TSOFT_APPS.order.payment.callback.push(func)
    }
}

function TsoftAppsOrderApproveCallback(func) {
    if (window.PAGE_TYPE === 'approve' && typeof func === 'function') {
        TSOFT_APPS.order.approve.callback.push(func)
    }
}

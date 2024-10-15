function getEndpoint(key, params = []) {
    let paramStr = typeof params === 'object' ? params.join('/') : (params || '');

    paramStr = String(paramStr);
    paramStr += paramStr.indexOf('?')>-1 ? '&' : '?';
    paramStr += 'language=' + (typeof LANGUAGE == "undefined" ? "" : LANGUAGE);
    let allowCurrency = ['FILTER', 'VARIANT', 'PRODUCT_LOADER', 'SUB_FOLDER'];
    if (allowCurrency.indexOf(key)>-1) paramStr += allowCurrency.indexOf(key)>-1 ? '&currency=' + CURRENCY : '';
    paramStr = paramStr.replace('?&','?').replace('&?','&').replace('/?','?');

    if (key == 'STATIC_FLAGS') paramStr = '';
    
    var ENDPOINT = {
        REGION_V4: '/srv/service/region/',
        CATEGORY: '/srv/service/category/get/',
        REGION_COUNTRIES: '/srv/service/region/get-countries/',
        REGION_CITIES: '/srv/service/region/get-cities/',
        REGION_TOWN: '/srv/service/region/get-towns/',
        REGION_DISTRICTS: '/srv/service/region/get-districts/',
        COUNTRY: '/srv/service/region/get-countries/',
        FILTER: '/srv/service/filter/get/',
        PRODUCT_DETAIL_COMMENTS: '/srv/service/product-detail/comments/',
        PRODUCT_DETAIL_COMMENT_AVERAGE: '/srv/service/product-detail/comment-average/',
        REGION: '/srv/service/region/get-list/',
        VARIANT: '/srv/service/variant/',
        CUSTOMER_REGISTER: '/api/v1/block/customer-register/',
        SUB_FOLDER: '/srv/service/content-v5/sub-folder/',
        PRODUCT_LOADER: '/srv/service/content-v5/product-loader/',
        DEPARTMENT: '/srv/service/profile/get-message-department-list/',
        TAX_OFFICE_LIST: '/Diger/tax-office.txt',
        MAP_COUNTRIES: '/Diger/countries.txt',
        PRODUCT_RELATED: '/srv/service/product/get-related-products/',
        STATIC_FLAGS: '/static/theme-flags/',
        SEARCH_ALL: '/srv/service/product/searchAll/',
        SEARCH: '/srv/service/product/search/',
        STORE_LIST: '/srv/service/store/store-list/',
    };

    var ENDPOINT2 = {
        LOGIN: '/api/v1/authentication/login/',
        REGISTER: '/api/v1/authentication/register/',
        CUSTOMER_REGISTER_QUICK: '/api/v1/authentication/register/quick/',
        CUSTOMER_REGISTER_NOMEMBERSHIP: '/api/v1/authentication/login-nomembership/',
        CUSTOMER_REGISTER_UPDATE: '/api/v1/block/customer-register/',
        CUSTOMER_UPDATE: '/api/v1/customer/update/',
        CUSTOMER_UPDATE_PASSWORD: '/api/v1/customer/update/password/',
        CAPTCHA: '/api/v1/security/captcha/',
        ADDRESS: '/api/v1/public/address/',
        GET_PAGE_REQUIREMENTS : '/api/v1/block/get-page-requirement/',
        MESSAGE:  '/srv/service/profile/get-message-list/',
        SEND_MESSAGE: '/api/v1/public/send-message/department/',
        VERIFY_SMS: '/api/v1/public/services/verify-sms/',
        ERP_STORE: '/Diger/Erp/store.php',
    };

    var prefix = ENDPOINT_PREFIX ? atob(ENDPOINT_PREFIX) : '';
    
    if (MEMBER_INFO.GROUP > 0) {
        if (['FILTER', 'INSTALLMENT', 'PRODUCT_LOADER'].indexOf(key) > -1) prefix = '';
    } else if (typeof E_EXPORT_ACTIVE != 'undefined' && E_EXPORT_ACTIVE == 1) {
        if (['PRODUCT_LOADER'].indexOf(key) > -1) prefix = '';
    }

    let LINK = prefix + paramStr;
    if (ENDPOINT[key]) {
        LINK = prefix + ENDPOINT[key] + paramStr;
    } else if (ENDPOINT2[key]) {
        LINK = ENDPOINT2[key] + paramStr;
    }

    return LINK;
}
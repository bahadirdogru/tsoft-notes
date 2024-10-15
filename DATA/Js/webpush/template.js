//'use strict';

function vat(p, vat) {

    if (p > 0 && p <= 0.0000001) {
        return 0;
    }

    var priceParam = isNaN(p) ? 0.0 : parseFloat(p);
    var vatParam = isNaN(vat) > 0 ? 0 : parseInt(vat);
    //priceParam = priceParam.toFixed(2);
    priceParam = priceParam * (100 + vatParam) / 100;
    return format(priceParam);
}
function format(p, d) {
    var decimals = typeof d != "undefined" ? d : typeof DECIMAL_LENGTH !== 'undefined' ? DECIMAL_LENGTH : 2;
    var n = !isFinite(+p) ? 0 : +p,
            prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
            sep = (typeof SEP_THO === 'undefined') ? '.' : SEP_THO,
            dec = (typeof SEP_DEC === 'undefined') ? ',' : SEP_DEC,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
    /////////////////
//    var dec = d ? d : typeof DECIMAL_LENGTH !== 'undefined' ? DECIMAL_LENGTH : 2;
//    var negative = p < 0 ? '-' : '';
//    p = Math.abs(p);
//    //p = p > 0.0 ? p : 0;
//    var newP = '0' + p + '';
//
//    var SEP_DEC = SEP_DEC || ',';
//    var SEP_THO = SEP_THO || '.';
//
//    newP = newP.indexOf('.') > 0 ? newP + '000' : newP + '.000';
//    if (newP.indexOf('.') === 0) {
//        newP = '0' + newP;
//    }
//    newP = newP.replace(/(\.\d{8}).*?$/ig, '$1');
//    newP = newP.replace(/^0(\d+)/ig, '$1');
//
//    var intVal = parseInt(newP) + '';
//    var floatVal = newP.replace(/^.*?\./g, '') + "00"; //0.12345
//
//    var f1 = parseInt(floatVal.replace(/^(\d{2})(.*?)$/g, "$1")); //12
//    var f2 = parseInt(floatVal.replace(/^(\d{2})(.*?)$/g, "$2").replace(/^(\d{2})(.*?)$/g, "$1")); //34
//
//    if (f2 > 49) {
//        f1++;
//    }
//    if (f1 > 99) {
//        floatVal = "00";
//        intVal = (parseInt(newP) + 1) + '';
//    } else {
//        floatVal = f1 > 9 ? f1 : "0" + f1;
//    }
//
//    if (dec == 0) {
//        intVal = "" + Math.round(parseFloat(intVal.replace(/\D/g, '') + SEP_THO + floatVal))
//    }
//
//    intVal = intVal.replace(/^(\d{1,3})(\d{3})(\d{3})$/g, '$1' + SEP_THO + '$2' + SEP_THO + '$3');
//    intVal = intVal.replace(/^(\d{1,3})(\d{3})$/g, '$1' + SEP_THO + '$2');
//    intVal = negative + intVal;
//    return dec == 0 ? intVal : intVal + SEP_DEC + floatVal;
}

function moneyExchange(price, from, to) {
    var k = from + '_TO_' + to;
    if (typeof RATE === 'object' && typeof RATE[k] !== 'undefined') {
        return price * RATE[k];
    } else {
        return price;
    }
}


function Template(options) {
    //var content = '';
    var counter = 900;
    Template.ready = function (fn) {
        Template.instance.activeTemplate.set('ready', fn);
    };

    Template.htmlObject = Template.htmlObject || {};
    var opt = {
        'content': '',
        'source': '#page-html',
        'destination': '#page-content',
        'assign': {},
        'routes': {},
        'id': 'last',
        callback: 'callbackFn',
        ready: function () {

        }
    };
    var filters = {
        'default': function (p, defaultVal) {
            return (typeof p === 'undefined' || p === '') ? defaultVal : p;
        },
        limitTo: function (p, limit, begin) {
            p = p + "";
            limit = limit > 0 ? limit : 10;
            begin = begin > 0 ? begin : 0;
            return p.substring(begin, limit);
        },
        format: function (p, dec) {
            return window.format(p, dec);
        },
        exchange: function (p, from, to) {
            return format(window.moneyExchange(p, from, to));
        },
        vat: function (p, vat) {
            return window.vat(p, vat);
        },
        currency: function (n, c) {
            c = isNaN(c = Math.abs(c)) ? 2 : c,
                    s = n < 0 ? "-" : "",
                    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + ',' : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ',') + (c ? '.' + Math.abs(n - i).toFixed(c).slice(2) : "");
        },
        date: function (p, format) {
            //p = p.toString();
            p = parseInt(p);

            if (isNaN(p) || p < 1000000000) {
                p = 1000000000;
            } else if (p < 9000000000) {
                p = p * 1000;
            }

            format = format.replace(/["']/g, '');

            function pad(s) {
                return (s < 10) ? '0' + s : s;
            }
            var d = new Date(p);

            format = format.replace(/y+/ig, d.getFullYear());
            format = format.replace(/d+/ig, pad(d.getDate()));
            format = format.replace(/m+/ig, pad(d.getMonth() + 1));
            format = format.replace(/h+/ig, pad(d.getHours()));
            format = format.replace(/i+/ig, pad(d.getMinutes()));
            format = format.replace(/s+/ig, pad(d.getSeconds()));
            return format;
        },
        filter: function (p) {

        },
        lowercase: function (p) {
            return typeof p === 'string' ? p.toLowerCase() : p;
        },
        number: function (p) {

        },
        uppercase: function (p) {
            return typeof p === 'string' ? p.toUpperCase() : p;
        },
        indexOf: function (p, key) {
            return p.indexOf(key);
        },
        test: function (p, rgxStr) {
            var rgx = new RegExp(rgxStr, "ig");
            var r = rgx.test(p);
            return r ? 1 : 0;
        },
        replace: function (p, oldVal, newVal) {
            //console.log(p);
            //console.log(oldVal);
            oldVal = oldVal.toString().replace(/-OR-/ig, '|').replace(/-AND-/ig, '&').trim();
            var re = new RegExp(oldVal, "ig");
            if (p === null) {
                p = '';
            }
            return p.toString().replace(re, newVal);
        },
        reverse: function (p) {
            return p.reverse();
        }
    };

    for (var i in options) {
        opt[i] = options[i];
    }

    var _this = this;

    this.assign = function (key, val) {
        //opt.assign[key] = val;
        if (typeof key === 'object') {
            for (var i in key) {
                opt.assign[i] = key[i];
            }
        } else {
            opt.assign[key] = val;
        }
    };
    this.getVar = function (key) {
        return opt.assign[key];
    };
    this.get = function (key) {
        return opt[key];
    };
    this.set = function (key, val) {
        opt[key] = val;
    };

    this.display = function () {
//        console.log($('#filterPanel').html());
//        console.log($(opt.source).html());
//        console.log(opt);

        var navs = typeof navigation === 'undefined' ? [] : navigation;

        if ($("[ng-app]").length > 0) {
            opt.source = "[ng-app]";
            opt.destination = "[ng-app]";
        }

        if (typeof Template.htmlObject[opt.id] === 'undefined') {
            //console.log(opt.source);
            opt.content = $(opt.source).is('textarea') ? $(opt.source).val() : $(opt.source).html();
            opt.content = opt.content.replace(/\r?\n|\r/ig, ' ');
            opt.content = opt.content.replace(/\s+/g, ' ');
            Template.htmlObject[opt.id] = opt.content;
        } else {
            opt.content = Template.htmlObject[opt.id];
            $(opt.source).html(opt.content);
        }

        var insideHtml = [];
        $('<div>').html(opt.content).find('.angularTemplate,.angularNotRender').each(function () {
            insideHtml.push($(this).html());
        });

        $(opt.source).css('visibility', 'hidden');

        replaceForeach();
        replaceIf();

        opt.content = $(opt.source).is('textarea') ? $(opt.source).val() : $(opt.source).html();
        opt.content = opt.content || "";

        replaceShortIf();

        replaceObject();
        replaceVariable();

        opt.content = opt.content.replace(/\s+ng-(\w+?)\s*=/ig, " $1=");
        opt.content = opt.content.replace(/\{\{[\w.]+\}\}/ig, '');

//        console.log(opt);


        $(opt.destination).html(opt.content);

        if (typeof navs === 'object' && navs.length > 0) {
            var str = '<a href="/Y/">' + main_page + '</a>'; //anasayfa

            if ($(document).width() <= 640) {
                str = '';
                $(".Navigate").css('right', 10);
            }

            for (var i = 0; i < navs.length; i++) {
                str += '<a href="' + navs[i].link + '">' + navs[i].text + '</a>';
            }
            $('.Navigate:first').append(str);
        } else {
            $('.Navigate:first').remove();
        }

        for (var i = 0; i < insideHtml.length; i++) {
            $(opt.source).find('.angularTemplate,.angularNotRender').eq(i).html(insideHtml[i]);
        }
        $(opt.destination).show();
        $(opt.destination).css('visibility', 'visible');

        opt.ready(opt.assign);
        var fn = opt['callback'];

        if (typeof fn === 'string' && typeof window[fn] === 'function') {
            window[fn](opt.assign);
        } else {
            //console.log('data-callback tanımlı değil (' + fn + ')');
        }
    };

    Template.instance = Template.instance || {};
    Template.instance['activeTemplate'] = this;
    Template.instance[_this.get('id')] = this;

    function getVal(str) {
        str = str || '';
        str = str.trim();
        var val = '';
        if (str[0] === "'") {
            val = str.replace(/'/g, '');
            //val = str.replace(/``/g, '\'');
        } else if (str.match(/^WINDOW\./g)) {
            var exp = str.replace('WINDOW.', '').split('.');
            var obj = window[exp[0]];
            if (typeof obj === 'object' && obj !== null) {
                if (obj[exp[1]] != null && typeof obj[exp[1]] === 'object' && typeof exp[2] === 'string') {
                    val = obj[exp[1]][exp[2]] || '';
                } else {
                    val = typeof obj[exp[1]] === 'undefined' ? '' : obj[exp[1]];
                }
            } else {
                val = typeof obj === 'undefined' ? '' : obj;
            }
        } else if (str.match(/\./g)) {
            var exp = str.split('.');

            var obj = _this.getVar(exp[0]);
            if (typeof obj === 'object' && obj !== null) {
                if (obj[exp[1]] != null && typeof obj[exp[1]] === 'object' && typeof exp[2] === 'string') {
                    val = obj[exp[1]][exp[2]] || '';
                } else {
                    val = typeof obj[exp[1]] === 'undefined' ? '' : obj[exp[1]];
                }
            }
            //console.log(val);
        } else if (str.match(/^-?(\d+)$/g)) {
            val = parseInt(str);
        } else if (str.match(/^(\w+)$/g)) {
            val = _this.getVar(str);
        }
        return val;
    }


    function replaceAngularTags(content, find, newVal) {
        var r = /\{\{([^\{\}]+?)\}\}/g;
        var m;
        var str = '';
        while ((m = r.exec(content)) !== null) {
            str = m[0].replace(find, newVal);
            content = content.replace(m[0], str);
        }
        return content;
    }


    // regex içerisinde $1 alanından oldVal yerine newVal gelir.
    function childReplace(content, regex, oldStr, newStr) {
        var m, str;
        var r = new RegExp(oldStr, "g");
        while ((m = regex.exec(content)) !== null) {

            str = m[1].replace(r, newStr);
            content = content.replace(m[1], str);

//            console.log(m[1] + " - "+ oldStr+ " - "+ newStr);
        }
        return content;
    }

    function replaceForeach() {

        var exist = false;

        var indexCounter = 0;

        $(opt.source).find('[ng-repeat]').each(function () {

            exist = true;
            var str = $(this).attr('ng-repeat');
            $(this).removeAttr('ng-repeat');
            var re = /(\w+)\s+in\s+([\w.\|:']+)/i;

            var content = $('<div>').append($(this).clone()).html();
            var newVar = 'VARS' + counter++;

            //_this.assign(newVar, indexCounter);
            //content = content.replace('$index', newVar);

            var contentAll = '';
            if (str.match(re)) {
                var arr = re.exec(str);
                var obj = afterFnVal(arr[2]);

                if (typeof obj !== 'object') {
                    $(this).html(arr[2] + " Değişkeni Bulunamadı!");
                    $(this).remove();
                    return false;
                }

                //var except = '([^\r\n\{\}]+?)';
                var mArr = [];
                for (var obji of obj) {
                    var newVar = 'VARS' + counter++;
                    var fContent = content;

                    fContent = fContent.replace(/\{\{([^\r\n\{\}]*?)\$index([^\r\n\{\}]*?)\}\}/g, "{{$1" + i + "$2}}");

                    var fRe1 = new RegExp("(\\W)" + arr[1] + '(\\W)', "g");
                    var fRe2 = new RegExp('(ng-if=".*?)' + arr[1] + '(.*?")', "g");
                    var fRe3 = new RegExp('(ng-repeat=".*?)' + arr[1] + '(.*?")', "g");

//                    _this.assign(newVar, obj[i]);
                    _this.assign(newVar, obji);

                    fContent = replaceAngularTags(fContent, fRe1, '$1' + newVar + '$2');

                    var findStr = arr[1] + "\\.";

                    fContent = childReplace(fContent, /ng-if="(.*?)"/g, findStr, newVar + ".");
                    fContent = childReplace(fContent, /ng-repeat="(.*?)"/g, findStr, newVar + ".");
                    fContent = childReplace(fContent, /\{\{(.*?)\}\}/g, '\$index', indexCounter);

                    contentAll += fContent;

                }

                $(this).after(contentAll);
                $(this).remove();
            }
            indexCounter++;
        });

        if (exist) {
            replaceForeach();
        }
        return true;
    }

    function compareVars(val1, val2, operator) {
        var result = false;
        switch (operator) {
            case '==':
                result = val1 == val2;
                break;
            case '!=':
                result = val1 !== val2;
                break;
            case '<':
                result = val1 < val2;
                break;
            case '>':
                result = val1 > val2;
                break;
            case '>=':
                result = val1 >= val2;
                break;
            case '<=':
                result = val1 <= val2;
                break;
        }
        return result;
    }

    //4 işlem çalıştır.
    function operateVars(val1, val2, operator) {

        var result = 0;
        val1 = parseFloat(val1);
        val2 = parseFloat(val2);
        switch (operator) {
            case '-':
                result = val1 - val2;
                break;
            case '+':
                result = val1 + val2;
                break;
            case '*':
                result = val1 * val2;
                break;
            case '/':
                result = val1 / val2;
                break;
        }


//        console.log(val1 + " " + operator + " " + val2 + " = " + result);
        return result;
    }

    function replaceIf() {
        //var exist = false;



        $(opt.source).find("[ng-if]").each(function () {
            var str = $(this).attr('ng-if');
            $(this).removeAttr('ng-if');

            var ifCondition = 'and';
            var strArr = [];  // || str.indexOf('||')
            if (str.indexOf('&&') > 0) {
                strArr = str.split('&&');
            } else if (str.indexOf('||') > 0) {
                strArr = str.split('||');
                ifCondition = 'or';
            } else {
                strArr = [str];
            }

            var resultStr = 'if: ';
            for (var i = 0; i < strArr.length; i++) {
                str = strArr[i];
                var re = /\s*(.+?)\s*([<>=!]{1,2})\s*(.+)\s*/i;
                var content = $(this).html();
                var contentAll = '';
                if (str.match(re)) {
                    var arr = re.exec(str);

//                    console.log(str);

                    var val1 = afterFnVal(arr[1]);
                    var val2 = afterFnVal(arr[3]);

                    resultStr += compareVars(val1, val2, arr[2]) == true ? 'true' : 'false';
                }
            }

//            console.log(resultStr);
//            console.log(strArr);

            if (ifCondition === 'and' && resultStr.indexOf('false') > 0) {
                $(this).remove();
            }
            if (ifCondition === 'or' && resultStr.indexOf('true') < 0) {
                $(this).remove();
            }
        });
        return true;
    }

    //Eğer bir fonk. var ise onu çalıştırıp sonucunu döndürür.
    function afterFnVal(str) {

        if (str.indexOf('|') < 1) {
            return getVal(str);
        }

        var exp = str.split('|');
        var params = [exp[0]];
        var fn = exp[1];




        if (exp[1].indexOf(':') > 0) {
            fn = exp[1].replace(/^\s*(\w+):.*?$/ig, '$1');
            var arr = exp[1].replace(/^.*?:/ig, '').split(':');

            for (var i = 0; i < arr.length; i++) {
                params.push(arr[i]);
            }
        }
        for (var i = 0; i < params.length; i++) {
            params[i] = getVal(params[i]);
        }
        var result = params[0];
        if (fn.length > 2 && typeof filters[fn] === 'function') {
            result = filters[fn].apply(this, params);
        } else if (typeof window[fn] === 'function') {
            result = window[fn].apply(this, params);
        }
        return result;
    }

    function replaceShortIf() {
        var oldContent = opt.content;
//        console.log(oldContent);
        // x = a==b ? c : d;
        var r = /\{\{\s*([^\r\n\t\|\{\}]+?)\s*([><=\!]+)\s*([^\{\}]+?)\s+\?\s+(.*?)\s*:\s*(.*?)\s*\}\}/gi;
        var m;
        while ((m = r.exec(oldContent)) !== null) {
//            console.log(m);

            var val1 = getVal(m[1]);
            var val2 = getVal(m[3]);
            var result = compareVars(val1, val2, m[2]);
            var newVal = result ? getVal(m[4]) : getVal(m[5]);

//            console.log(m[1] + ' ' + m[2] + ' ' + m[3]);
//            console.log(val1 + " == " + val2);
//            console.log(getVal(m[4]) + " <=> " + getVal(m[5]) + " / " + newVal);
            opt.content = opt.content.replace(m[0], newVal);
        }
    }

    function replaceObject() {
        var oldContent = opt.content;

        var r = /\{\{\s*(\w+)\.(\w+)\s*\}\}/gi;
        var m;
        while ((m = r.exec(oldContent)) !== null) {
            var obj = _this.getVar(m[1]);
            if (typeof obj !== 'object' || obj === null) {
                continue;
            }
            var key = m[2];
            /*
             if (typeof obj[key] === 'undefined') {
             continue;
             }
             */

            if (typeof obj[key] === 'undefined' || obj[key] === null) {
                obj[key] = '';
            }
            opt.content = opt.content.replace(m[0], obj[key]);
        }
    }

    function replaceVariable() {
        var oldContent = opt.content;
        var arr = [];
        var newVal = '';
        var operator = '';

        var child = "";
        var fn = "";

        var r = /\{\{(\s*[^\r\n\t]+?\s*)\}\}/gi;
        var m;
        while ((m = r.exec(oldContent)) !== null) {
            if (/[\+\*\/\-]/g.test(m[1]) && m[1].indexOf("'") < 0) {
                fn = m[1].indexOf('(') > -1 && m[1].indexOf('|') > -1 ? m[1].replace(/^.*?\|/ig, '|') : '';
                m[1] = m[1].replace(fn, '').replace(/[\(\)]/g, '');

                arr = m[1].split(/[\+\*\/\-]/g);
                operator = m[1].replace(/^.*?([\+\*\/\-]).*?$/ig, "$1");
                newVal = operateVars(afterFnVal(arr[0]), afterFnVal(arr[1]), operator);

                newVal = fn == '' ? newVal : afterFnVal(newVal + fn);

            } else {
                newVal = afterFnVal(m[1]);
            }
            opt.content = opt.content.replace(m[0], newVal);
            continue;
        }
    }

}

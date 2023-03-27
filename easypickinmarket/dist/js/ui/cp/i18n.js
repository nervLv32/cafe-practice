/**
 * i18n - Javascript Internationalization System
 *
 * @author Platform Team
 */

(function() {
    var $i18n = {

        /**
         * Messages
         * @var array
         * {
         *     'DOMAIN NAME' : {
         *         'KEY NAME' : 'value',
         *         'KEY NAME(Plurals) : ['value', 'value', ...]
         *         ...
         *     },
         *     ...
         * }
         */
        _lang : {},

        /**
         * Plurals Expressions
         * @var array
         * {
         *     'DOMAIN NAME' : function(n) {
         *         expressions
         *     },
         *     ...
         * }
         */
        _pluralsExp : {},

        /**
         * Current Domain
         * @var string
         */
        _currDomain : false,

        /**
         * override the current domain for a single message lookup
         *
         * @param string domain
         * @param string key
         * @return string
         */
        __d : function(domain, key, __idx__) {

            var t = $i18n._lang;

            if ($i18n._isEmpty(t) === true) {
                return key;
            }

            if (typeof t[domain] == 'undefined') {
                return key;
            }

            if (typeof t[domain][key] == 'undefined') {
                return key;
            }

            if (typeof t[domain][key] == 'object') {
                __idx__ = __idx__ ? __idx__ : 0;
                return t[domain][key][__idx__];
            }

            return t[domain][key];

        },

        /**
         * Plural version of __d
         *
         * @param string domain
         * @param string key1
         * @param string key2
         * @param int cnt
         * @return string
         */
        __dn : function(domain, key1, key2, cnt) {

            var n = parseInt(cnt);
            var idx = $i18n._getPluralsIndex(domain, n);

            if (idx == 0) {
                return $i18n.__d(domain, key1, 0);
            } else {
                return $i18n.__d(domain, key2, idx);
            }
        },

        _init : function() {
            $i18n._pluralsExp.__reserved_default_exp__ = function(n) {
                return n == 1 ? 0 : 1;
            };

            window['__d'] = function(domain, key) {
                return $i18n.__d(domain, key, 0);
            };

            window['__dn'] = function(domain, key1, key2, cnt) {
                return $i18n.__dn(domain, key1, key2, cnt);
            };

            window['__'] = function(key) {
                return $i18n.__d($i18n._currDomain, key, 0);
            };

            window['__n'] = function(key1, key2, cnt) {
                return $i18n.__dn($i18n._currDomain, key1, key2, cnt);
            };

            window['__i18n_regist__']           = this._regist;
            window['__i18n_bind__']             = this._bind;
            window['__i18n_plurals_exp_bind__'] = this._pluralsExpBind;
        },

        _isEmpty : function(val) {

            if (!val) return true;
            if (val == null) return true;
            if (val == undefined) return true;
            if (val == '') return true;
            if (typeof val == 'object') {
                for (var i in val) {
                    return false;
                }

                return true;
            }

            return false;

        },

        _trim : function(str) {
            if(typeof str != 'string') return '';

            return str.replace(/(^\s*)|(\s*$)/g, '');
        },

        _apply : function(method, func) {

            this[method] = func;

        },

        _regist : function(lang) {

            if (typeof lang != 'object') return false;

            $i18n._lang = lang;

            return true;

        },

        _bind : function(domain) {

            if ($i18n._isEmpty(domain) === true) return false;

            $i18n._currDomain = domain;

            return true;

        },

        _pluralsExpBind : function(domain, exp) {
            if (typeof exp != 'function') {
                return;
            }

            $i18n._pluralsExp[domain] = exp;
        },

        _getPluralsIndex : function(domain, n) {
            if (typeof $i18n._pluralsExp[domain] == 'undefined') {
                return $i18n._pluralsExp.__reserved_default_exp__(n);
            }

            return $i18n._pluralsExp[domain](n);
        }
    };

    $i18n._init();
})();
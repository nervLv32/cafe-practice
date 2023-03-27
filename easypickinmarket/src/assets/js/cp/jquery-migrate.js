/**
 * for Javascript jQuery 1.9+
 * Migration Library
 *
 * @author Platform Team
 */

//
// [Restore] .uuid
//
(function($, jQuery) {

    if (typeof jQuery.uuid == 'undefined') {
        jQuery.uuid = 0;
    }

})($, jQuery);

//
// [Restore] .curCSS
//
(function($, jQuery) {
    if ( !jQuery.curCSS ) {
        jQuery.curCSS = jQuery.css;
    }
})($, jQuery);

//
// [Restore] .browser
//
(function($, jQuery) {
    if (jQuery.browser) return;

    var matched, browser;

    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    if ( !jQuery.browser ) {
        matched = jQuery.uaMatch( navigator.userAgent );
        browser = {};

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
        }

        if ( browser.chrome ) {
            browser.webkit = true;
        } else if ( browser.webkit ) {
            browser.safari = true;
        }

        jQuery.browser = browser;
    }
})($, jQuery);


//
// [Restore] .toggle(function, function)
//
(function($, jQuery) {
    var oldToggle = jQuery.fn.toggle;
    jQuery.fn.toggle = function( fn, fn2 ) {

        if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
            return oldToggle.apply( this, arguments );
        }

        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                event.preventDefault();

                return args[ lastToggle ].apply( this, arguments ) || false;
            };

        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }

        return this.click( toggler );
    };
})($, jQuery);


//
// [Restore] .addBack(selector) replaces .andSelf()
//
(function($, jQuery) {
    var oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

    jQuery.fn.andSelf = function() {
        return oldSelf.apply( this, arguments );
    };
})($, jQuery);

//
// [Restore] .attr() for boolean property/attribute synchronization
// for 1.9+
//
(function($, jQuery) {
    if (!jQuery.attrHooks) return;

    var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
    oldAttr = jQuery.attr,
    valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
    function() { return null; },
    valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
    function() { return undefined; },
    rnoType = /^(?:input|button)$/i,
    rnoAttrNodeType = /^[238]$/,
    rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    ruseDefault = /^(?:checked|selected)$/i;

    jQuery.attr = function( elem, name, value, pass ) {
        var lowerName = name.toLowerCase(),
            nType = elem && elem.nodeType;

        if ( pass ) {
            if ( elem && !rnoAttrNodeType.test( nType ) &&
                (attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
                return jQuery( elem )[ name ]( value );
            }
        }

        if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
            jQuery.attrHooks[ lowerName ] = {
                get: function( elem, name ) {
                    var attrNode,
                        property = jQuery.prop( elem, name );
                    return property === true || typeof property !== "boolean" &&
                        ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

                        name.toLowerCase() :
                        undefined;
                },
                set: function( elem, value, name ) {
                    var propName;
                    if ( value === false ) {
                        jQuery.removeAttr( elem, name );
                    } else {
                        propName = jQuery.propFix[ name ] || name;
                        if ( propName in elem ) {
                            elem[ propName ] = true;
                        }

                        elem.setAttribute( name, name.toLowerCase() );
                    }
                    return name;
                }
            };
        }

        return oldAttr.call( jQuery, elem, name, value );
    };

    jQuery.attrHooks.value = {
        get: function( elem, name ) {
            var nodeName = ( elem.nodeName || "" ).toLowerCase();
            if ( nodeName === "button" ) {
                return valueAttrGet.apply( this, arguments );
            }
            return name in elem ?
                elem.value :
                null;
        },
        set: function( elem, value ) {
            var nodeName = ( elem.nodeName || "" ).toLowerCase();
            if ( nodeName === "button" ) {
                return valueAttrSet.apply( this, arguments );
            }

            elem.value = value;
        }
    };
})($, jQuery);
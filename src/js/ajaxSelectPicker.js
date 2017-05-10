/**
 * @class $.fn.ajaxSelectPicker
 *
 * The jQuery plugin definition.
 *
 * This initializes a new AjaxBootstrapSelect class for each element in the jQuery chain.
 *
 * @param {Object} options
 *   The {@link $.fn.ajaxSelectPicker.defaults options} to pass to the plugin.
 *
 * @return {jQuery}
 *
 * @chainable
 */
$.fn.ajaxSelectPicker = function (options) {
    return this.each(function () {
        if (!$(this).data('AjaxBootstrapSelect')) {
            $(this).data('AjaxBootstrapSelect', new window.AjaxBootstrapSelect(this, options));
        }
    });
};

/**
 * The locale object containing string translations.
 *
 * @type {Object}
 *
 * @see {@link $.fn.ajaxSelectPicker.locale}
 */
$.fn.ajaxSelectPicker.locale = {};

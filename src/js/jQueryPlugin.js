/**
 * The jQuery plugin function definition.
 *
 * @param options
 *   The options to pass to the plugin.
 *
 * @returns {jQuery}
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
 * @type {Object}
 */
$.fn.ajaxSelectPicker.locale = {};

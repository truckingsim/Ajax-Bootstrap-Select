/**
 * @todo document this.
 * @param options
 * @returns {*}
 */
$.fn.ajaxSelectPicker = function (options) {
    return this.each(function () {
        if (!$(this).data('ajaxSelectPicker')) {
            $(this).data('ajaxSelectPicker', new AjaxBootstrapSelect(this, options));
        }
    });
};

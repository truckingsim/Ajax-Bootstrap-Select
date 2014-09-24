/*!
 * Ajax Bootstrap Select
 *
 * Extends the bootstrap-select plugin so it can use a remote source for searching. Originally for CROSCON.
 *
 * @version 1.2.0
 * @author Adam Heim - https://github.com/truckingsim
 * @link https://github.com/truckingsim/Ajax-Bootstrap-Select
 * @copyright 2014 Adam Heim
 * @license Released under the MIT license.
 *
 * Contributors:
 *   Mark Carver - https://github.com/markcarver
 *
 * Last build: 2014-09-24 1:00:25 PM CDT
 */
!(function ($) {
/**
 * Note: You do not have to load this translation file. English is the
 * default language of this plugin and is compiled into it automatically.
 *
 * This file is just to serve as the default string mappings and as a
 * template for future translations.
 * @see: ./src/js/locale/en-US.js
 *
 * Four character language codes are supported ("en-US") and will always
 * take precedence over two character language codes ("en") if present.
 *
 * This comment should be removed when creating a new translation file, along
 * with all the translation comments.
 */

/*!
 * English translation for the "en" language code.
 * Mark Carver <mark.carver@me.com>
 */
$.fn.ajaxSelectPicker.locale['en-US'] = {
    currentlySelected: 'Currently Selected',
    emptyTitle: 'Select and begin typing',
    noResults: 'No Results',
    searchPlaceholder: 'Search...',
    searching: 'Searching...'
};

// Provide a fallback, just in case.
$.fn.ajaxSelectPicker.locale['en'] = $.fn.ajaxSelectPicker.locale['en-US'];
})(jQuery);

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
    noResults: 'No Results',

    /**
     * @name searchPlaceholder
     * @description The placeholder text to use inside the search input.
     * @default `'Search...'`
     */
    searchPlaceholder: 'Search...',


    searching: 'Searching...'
};

// Provide a fallback, just in case.
$.fn.ajaxSelectPicker.locale['en'] = $.fn.ajaxSelectPicker.locale['en-US'];

/*!
 * Ajax Bootstrap Select
 *
 * Extends the bootstrap-select plugin so it can use a remote source for searching. Originally for CROSCON.
 *
 * @version 1.1.0
 * @author Adam Heim - https://github.com/truckingsim
 * @link https://github.com/truckingsim/Ajax-Bootstrap-Select
 * @copyright 2014 Adam Heim
 * @license Released under the MIT license.
 *
 * Contributors:
 *   Mark Carver - https://github.com/markcarver
 *
 * Last build: 2014-09-22 10:48:33 AM CDT
 */
!(function ($, window) {

/**
 * @todo document this.
 * @param element
 * @param {Object} [options]
 * @constructor
 */
var AjaxBootstrapSelect = function (element, options) {
    var defaultOptions;
    options = options || {};

    /**
     * The <select> element this plugin is being attached to.
     * @type {jQuery}
     */
    this.$element = $(element);

    /**
     * The "loading" DOM element placeholder.
     * @type {jQuery}
     */
    this.$loading = $();

    /**
     * Instantiate a relationship with the parent plugin: selectpicker.
     * @type {$.fn.selectpicker}
     */
    this.selectpicker = this.$element.data('selectpicker');
    if (!this.selectpicker) {
        this.log('ajaxSelectPicker: Cannot attach ajax without selectpicker being run first!', true);
        return;
    }

    /**
     * Container for cached results.
     * @type {Object}
     */
    this.cachedData = {};

    /**
     * @todo figure out if this is needed.
     * @type {string}
     */
    this.previousQuery = '';

    /**
     * The current query being requested.
     * @type {string}
     */
    this.query = '';

/* jshint ignore:start */
    defaultOptions = {
        /**
         * @name ajaxOptions
         * @description The options to pass to the jQuery AJAX request.
         *
         * @type Object
         * @default `{}`
         *
         * @example ```js
         * ajaxOptions: {
         *     url: "/path/to/server/request", // Required.
         *     type: "json",
         *     type: "POST"
         *     data: {
         *         q: "{{{q}}}"
         *     }
         * }
         * ```
         */
        ajaxOptions: {},

        /**
         * @name bindEvent
         * @description The event to bind on the search input element to fire a request.
         * @optional
         *
         * @type String
         * @default `'keyup'`
         */
        bindEvent: 'keyup',

        /**
         * @name cache
         * @description Cache previous requests. If enabled, the "enter" key (13) is enabled to allow users to force a refresh of the request.
         * @optional
         *
         * @type Boolean
         * @default `true`
         */
        cache: true,

        /**
         * @name debug
         * @description Display helpful console output when a warning or error occurs in the plugin.
         * @optional
         *
         * @type Boolean
         * @default `true`
         */
        debug: false,

        /**
         * @name emptyClear
         * @description Clear the select list when there is no search value.
         * @optional
         *
         * @type Boolean
         * @default `true`
         */
        emptyClear: true,

        /**
         * @name emptyRequest
         * @description Invoke a request for empty search values.
         * @optional
         *
         * @type Boolean
         * @default `false`
         */
        emptyRequest: false,

        /**
         * @name ignoredKeys
         * @description Key codes to ignore so a request is not invoked with bindEvent. The "enter" key (13) will always be dynamically added to any list provided unless the "cache" option above is set to "true".
         * @optional
         *
         * @type Object
         * @default
         * ```js
         * {
         *     9: "tab",
         *     16: "shift",
         *     17: "ctrl",
         *     18: "alt",
         *     27: "esc",
         *     37: "left",
         *     39: "right",
         *     38: "up",
         *     40: "down",
         *     91: "meta",
         *     229: "unknown"
         * }
         * ```
         */
        ignoredKeys: {
            9: "tab",
            16: "shift",
            17: "ctrl",
            18: "alt",
            27: "esc",
            37: "left",
            39: "right",
            38: "up",
            40: "down",
            91: "meta",
            229: "unknown"
        },

        /**
         * @name loadingTemplate
         * @description The template used when a request is being sent.
         * @optional
         *
         * @type String|jQuery
         * @default `'<div class="menu-loading">Loading...</div>'`
         */
        loadingTemplate: '<div class="menu-loading">Loading...</div>',

        /**
         * @name placeHolderOption
         * @description String with text to show.
         * @optional
         *
         * @type String
         * @default `null`
         */
        placeHolderOption: null,

        /**
         * @name preprocessData
         * @description Process the data returned before this plugin.
         * @optional
         *
         * @type Function|null
         * @default `null`
         */
        preprocessData: null,

        /**
         * @name preserveSelected
         * @description Preserve selected options. There are 3 possible values:
         * * __'auto':__ will automatically determine whether or not this option should be enabled based on if the select element can have "multiple" selections.
         * * __true:__ will always preserve the selected options.
         * * __false:__ will never preserve the selected options.
         * @optional
         *
         * @type String|Boolean
         * @default `'auto'`
         */
        preserveSelected: 'auto',

        /**
         * @name processData
         * @description Process the data returned after this plugin, but before the list is built.
         * @optional
         *
         * @type Function|null
         * @default `null`
         */
        processData: null,

        /**
         * @name searchPlaceholder
         * @description The placeholder text to use inside the search input.
         * @optional
         *
         * @type String|null
         * @default `null`
         */
        searchPlaceholder: null
    };

/* jshint ignore:end */

    /**
     * Maps deprecated options to new ones between releases.
     * @type {Array}
     */
    var depreciatedMap = [
        // @todo Remove these options in next minor release.
        {
            from: 'ajaxResultsPreHook',
            to: 'preprocessData'
        },
        {
            from: 'mixWithCurrents',
            to: 'preserveSelected'
        },
        {
            from: 'ajaxSearchUrl',
            to: {
                ajaxOptions: {
                    url: '{{{value}}}'
                }
            }
        }
    ];

    // Map depreciated options into their newer counterparts.
    if (depreciatedMap.length) {
        var plugin = this;
        $.map(depreciatedMap, function (map) {
            if ($.isPlainObject(map.to) && options[map.from]) {
                plugin.replaceValue(map.to, '{{{value}}}', options[map.from]);
                options = $.extend(true, {}, options, map.to);
                plugin.log(['[WARNING] ajaxSelectPicker: Depreciated option "' + map.from + '". Update code to use:', map.to]);
                delete options[map.from];
            }
            else if (options[map.from]) {
                options[map.to] = options[map.from];
                plugin.log(['[WARNING] ajaxSelectPicker: Depreciated option "' + map.from + '". Update code to use: "' + map.to + '"']);
                delete options[map.from];
            }
        });
    }

    // Determine if the plugin should preserve selections based on
    // whether or not the select element can multi-select.
    if (options.preserveSelected && options.preserveSelected === 'auto') {
        options.preserveSelected = this.selectpicker.multiple;
    }

    // Merge the options into the plugin.
    this.options = $.extend(true, {}, defaultOptions, options);

    // Override any provided option with the data attribute value.
    if (this.$element.data('searchUrl')) {
        this.options.ajaxOptions.url = this.$element.data('searchUrl');
    }

    // Ensure there is a URL.
    if (!this.options.ajaxOptions.url) {
        this.log('ajaxSelectPicker: ajaxOptions.url must be set!', true);
        return;
    }

    // We need for selectpicker to be attached first. Putting the init in a
    // setTimeout is the easiest way to ensure this.
    // @todo Figure out a better way to do this (hopefully listen for an event).
    setTimeout(function () {
        plugin.init();
    }, 500);
};

/**
 * @todo document this.
 */
AjaxBootstrapSelect.prototype.init = function () {
    var plugin = this;

    /**
     * The select list.
     * @type {AjaxBootstrapSelectList}
     */
    this.list = new AjaxBootstrapSelectList(this);

    // Instantiate the timer.
    var timeout;

    // Process the search input.
    this.selectpicker.$searchbox
        // Add placeholder text.
        .attr('placeholder', this.options.searchPlaceholder)

        // Remove selectpicker events.
        .off('input propertychange')

        // Bind this plugin event.
        .on(this.options.bindEvent, function (e) {
            plugin.query = plugin.selectpicker.$searchbox.val();

            // Dynamically ignore the "enter" key (13) so it doesn't
            // create an additional request if the "cache" option has
            // been disabled.
            if (!plugin.options.cache) {
                plugin.options.ignoredKeys[13] = 'enter';
            }

            // Don't process ignored keys.
            if (plugin.options.ignoredKeys[e.keyCode]) {
                return true;
            }

            // Process empty search value.
            if (!plugin.query.length) {
                // Clear the select list.
                if (!plugin.options.emptyClear) {
                    plugin.list.destroy();
                }

                // Don't invoke a request.
                if (!plugin.options.emptyRequest) {
                    return true;
                }
            }

            // Clear any existing timer.
            clearTimeout(timeout);

            // Return the cached results, if any.
            if (plugin.options.cache && plugin.cachedData[plugin.query] && e.keyCode !== 13) {
                var output = plugin.list.build(plugin.cachedData[plugin.query]);
                // Build the option output.
                if (output.length) {
                    plugin.$element.html(output);
                    plugin.$element.selectpicker('refresh');
                    return true;
                }
                plugin.log(['ajaxSelectPicker: Unable to build the options from cached data.', plugin.query, plugin.cachedData[plugin.query]], true);
                plugin.list.restore();
                return;
            }

            timeout = setTimeout(function () {
                // Save the current state of the plugin.
                plugin.list.save();

                // Destroy the list currently there.
                plugin.list.destroy();

                // Remove unnecessary "min-height" from selectpicker.
                plugin.selectpicker.$menu.css('minHeight', 0);
                plugin.selectpicker.$menu.find('> .inner').css('minHeight', 0);

                // Remove the existing loading template.
                plugin.$loading.remove();

                // Show the loading template.
                plugin.$loading = $(plugin.options.loadingTemplate);
                plugin.selectpicker.$menu.append(plugin.$loading);

                plugin.$element.selectpicker('refresh');

                var ajaxParams = {};
                ajaxParams.url = plugin.options.ajaxOptions.url;

                //Success function, this builds the options to put in the select
                ajaxParams.success = function (data) {
                    // Process the data.
                    var processedData = plugin.processData(data, plugin.query);
                    if (processedData) {
                        var output = plugin.list.build(processedData);
                        // Build the option output.
                        if (output.length) {
                            plugin.$element.html(output);
                            return;
                        }
                        plugin.log([
                            'ajaxSelectPicker: Unable to build the options from data.',
                            data,
                            output
                        ], true);
                    }
                    else {
                        plugin.log([
                            'ajaxSelectPicker: Unable to process data.',
                            data
                        ], true);
                    }
                    plugin.list.restore();
                };

                //If there is an error be sure to put in the previous options
                ajaxParams.error = function (xhr) {
                    plugin.log([
                        'ajaxSelectPicker:',
                        xhr
                    ], true);
                    plugin.list.restore();
                };

                //Always refresh the list and remove the loading menu
                ajaxParams.complete = function () {
                    plugin.$loading.remove();
                    plugin.$element.selectpicker('refresh');
                };

                var userParams = $.extend(true, {}, plugin.options.ajaxOptions);

                ajaxParams.dataType = userParams.hasOwnProperty('dataType') ? userParams.dataType : 'json';
                ajaxParams.type = userParams.hasOwnProperty('type') ? userParams.type : 'POST';

                if (userParams.hasOwnProperty('data')) {
                    userParams.processedData = userParams.data;
                    if (typeof userParams.data === 'function') {
                        userParams.processedData = userParams.data();
                    }
                    ajaxParams.data = userParams.processedData;
                }
                else {
                    userParams.data = {'q': plugin.query};
                }

                // Replace any data values containing "{{{q}}}" with
                // the value of the current query.
                plugin.replaceValue(ajaxParams.data, '{{{q}}}', plugin.query);

                // Invoke the AJAX request.
                $.ajax(ajaxParams);
            }, 300);
        });
};

/**
 * Wrapper function for console.log / console.error
 * @param  {mixed} message The contents to log.
 * @param  {boolean} error Whether to use console.error or not.
 * @return {void}
 */
AjaxBootstrapSelect.prototype.log = function (message, error) {
    if (window.console && this.options.debug) {
        message = message instanceof Array ? message : [message];
        window.console[error ? 'error' : 'log'].apply(window.console, message);
    }
};

/**
 * Process incoming data.
 *
 * This method ensures that the incoming data has unique values and
 * is in the proper format that is utilized by this plugin. It also
 * adds in the existing selects if the option is enabled. If the
 * preprocessData and processData functions were defined in the plugin
 * options, they are invoked here.
 *
 * @param {Array|Object} data
 *   The JSON data to process.
 * @param {String} [query]
 *   The current query string. Used to cache data after it has been
 *   processed.
 *
 * @return {Array|boolean}
 *   The processed data array or false if an error occurred.
 */
AjaxBootstrapSelect.prototype.processData = function (data, query) {
    var i, l, clone, item, lastState, preprocessedData, processedData;
    var filteredData = [], seenValues = [], selected = [];

    // Merge in the selected options from the previous state.
    if (this.options.preserveSelected && this.list && (lastState = this.list.last()) && lastState) {
        selected = selected.concat(lastState.selected);
    }

    // If the data argument is an object, convert it to an array.
    if ($.isPlainObject(data)) {
        clone = selected.concat($.map(data, function (value) {
            return [value];
        }));
    }
    else {
        if ($.isArray(data)) {
            clone = selected.concat(data);
        }
        else {
            this.log(['ajaxSelectPicker: The data type passed was not an Array or Object.', data], true);
            return false;
        }
    }

    // Invoke the preprocessData option function and pass it another
    // clone so it doesn't intentionally modify the array. Only use the
    // returned value.
    preprocessedData = [].concat(clone);
    if ($.isFunction(this.options.preprocessData)) {
        preprocessedData = this.options.preprocessData(preprocessedData);
        if (!$.isArray(preprocessedData) || !preprocessedData.length) {
            this.log(['ajaxSelectPicker: The preprocessData callback did not return an array or was empty.', data, preprocessedData], true);
            return false;
        }
    }

    // Filter preprocessedData.
    l = preprocessedData.length;
    for (i = 0; i < l; i++) {
        item = preprocessedData[i];
        if ($.isPlainObject(item)) {
            // Check if item is a divider. If so, ignore all other data.
            // @todo Remove depreciated item.data.divider check in next
            // minor release.
            if (item.hasOwnProperty('divider') || (item.hasOwnProperty('data') && $.isPlainObject(item.data) && item.data.divider)) {
                filteredData.push({divider: true});
            }
            // Ensure item has a "value" and is unique.
            else {
                if (item.hasOwnProperty('value')) {
                    if (seenValues.indexOf(item.value) === -1) {
                        seenValues.push(item.value);
                        // Provide default items to ensure expected structure.
                        item = $.extend({
                            title: item.value,
                            class: '',
                            data: {},
                            disabled: false,
                            selected: false
                        }, item);
                        filteredData.push(item);
                    }
                    else {
                        this.log([
                            'ajaxSelectPicker: Duplicate item found, ignoring.',
                            item
                        ]);
                    }
                }
                else {
                    this.log([
                        'ajaxSelectPicker: Data item must have a "value" property, skipping.',
                        item
                    ], true);
                }
            }
        }
    }

    // Invoke the processData option function and pass a clone of
    // processedData so it doesn't intentionally modify the array. Only
    // use the returned value.
    processedData = [].concat(filteredData);
    if ($.isFunction(this.options.processData)) {
        processedData = this.options.processData(processedData);
        if (!$.isArray(processedData) || !processedData.length) {
            this.log(['ajaxSelectPicker: The processedData callback did not return an array or was empty.', data, filteredData, processedData], true);
            return false;
        }
    }

    // Cache the data, if possible.
    if (this.options.cache && query) {
        this.cachedData[query] = processedData;
    }

    return processedData;
};

/**
 * Replaces an old value in an object or array with a new value.
 *
 * @param {Object|Array} obj
 *   The object (or array) to iterate over.
 * @param {*} needle
 *   The value to search for.
 * @param {*} value
 *   The value to replace with.
 * @param {Object} [options]
 *   Additional options for restricting replacement:
 *     - recursive: {boolean} Whether or not to iterate over the entire
 *       object or array, defaults to true.
 *     - depth: {int} The number of level this method is to search
 *       down into child elements, defaults to false (no limit).
 *     - limit: {int} The number of times a replacement should happen,
 *       defaults to false (no limit).
 *
 * @return {void}
 */
AjaxBootstrapSelect.prototype.replaceValue = function (obj, needle, value, options) {
    var plugin = this;
    options = $.extend({
        recursive: true,
        depth: false,
        limit: false
    }, options);
    // The use of $.each() opposed to native loops here is beneficial
    // since obj can be either an array or an object. This helps reduce
    // the amount of duplicate code needed.
    $.each(obj, function (k, v) {
        if (options.limit !== false && typeof options.limit === 'number' && options.limit <= 0) {
            return false;
        }
        if ($.isArray(obj[k]) || $.isPlainObject(obj[k])) {
            if ((options.recursive && options.depth === false) || (options.recursive && typeof options.depth === 'number' && options.depth > 0)) {
                plugin.replaceValue(obj[k], needle, value, options);
            }
        }
        else {
            if (v === needle) {
                if (options.limit !== false && typeof options.limit === 'number') {
                    options.limit--;
                }
                obj[k] = value;
            }
        }
    });
};

/**
 * @todo document this.
 * @param {AjaxBootstrapSelect} plugin
 * @constructor
 */
var AjaxBootstrapSelectList = function (plugin) {
    /**
     * Container for current and previous states of the select list.
     * @type {Array}
     */
    this.states = [];

    // Merge in the AjaxBootstrapSelect properties and methods.
    $.extend(this, plugin);
};

/**
 * Builds the options for placing into the element.
 *
 * @param {Array} data
 *   The data to use when building options for the select list. Each
 *   array item must be an Object structured as follows:
 *     - {int|string} value: Required, a unique value identifying the
 *       item. Optionally not required if divider is passed instead.
 *     - {boolean} [divider]: Optional, if passed all other values are
 *       ignored and this item becomes a divider.
 *     - {string} [text]: Optional, the text to display for the item.
 *       If none is provided, the value will be used.
 *     - {String} [class]: Optional, the classes to apply to the option.
 *     - {boolean} [disabled]: Optional, flag that determines if the
 *       option is disabled.
 *     - {boolean} [selected]: Optional, flag that determines if the
 *       option is selected. Useful only for select lists that have the
 *       "multiple" attribute. If it is a single select list, each item
 *       that passes this property as true will void the previous one.
 *     - {Object} [data]: Optional, the additional data attributes to
 *       attach to the option element. These are processed by the
 *       bootstrap-select plugin.
 *
 * @return {String}
 *   HTML containing the <option> elements to place in the element.
 */
AjaxBootstrapSelectList.prototype.build = function (data) {
    var a, i, l = data.length;
    var $wrapper = $('<select/>');

    // Sort the data so preserved items (from a previous state) are
    // always last (needs work).
    //data.sort(function (a, b) {
    //  if (a.preserved && !b.preserved) return 1;
    //  return 0;
    //});

    for (i = 0; i < l; i++) {
        var item = data[i];
        var $option = $('<option/>');

        // Detect dividers.
        if (item.hasOwnProperty('divider')) {
            $option.attr('data-divider', 'true');
            $wrapper.append($option);
            continue;
        }

        // Set various properties.
        $option
            .val(item.value)
            .text(item.text)
            .attr('class', item.class)
            .prop('disabled', item.disabled);

        // Remove previous selections, if necessary.
        if (item.selected && !this.selectpicker.multiple) {
            $wrapper.find(':selected').prop('selected', false);
        }

        // Set this option's selected state.
        $option.prop('selected', item.selected);

        // Add data attributes.
        for (a in item.data) {
            if (item.data.hasOwnProperty(a)) {
                $option.attr('data-' + a, item.data[a]);
            }
        }

        // Add option to the wrapper.
        $wrapper.append($option);
    }

    // Prepend the placeHolderOption.
    if ($wrapper.find('option').length && typeof this.options.placeHolderOption === 'string' && this.options.placeHolderOption.length) {
        $wrapper.prepend('<option data-hidden="true">' + this.options.placeHolderOption + '</option>');
    }

    return $wrapper.html();
};


/**
 * @todo document this, make method better.
 */
AjaxBootstrapSelectList.prototype.destroy = function () {
    // Destroy the select options currently there.
    this.$element.find('option').remove();
    // Remove the dropdown list elements currently there.
    this.selectpicker.$menu.find('li').remove();
};

/**
 * Retrieves the last saved state of the select list.
 *
 * @return {Object|false}
 *   Will return false if there are no saved states or an object of the
 *   last saved state containing:
 *     - selected: the JSON data of the selected options. Used to
 *       preserve the selected options between AJAX requests.
 *     - html: the raw HTML of the select list.
 */
AjaxBootstrapSelectList.prototype.last = function () {
    if (this.states.length) {
        return this.states[this.states.length - 1];
    }
    return false;
};

/**
 * Restores the select list to the last saved state.
 *
 * @return {boolean}
 *   Return true if successful or false if no states are present.
 */
AjaxBootstrapSelectList.prototype.restore = function () {
    if (this.states.length) {
        this.$element.html(this.states.pop().html);
        return true;
    }
    return false;
};

/**
 * Saves the current state of the select list.
 *
 * @param {boolean} [keepPreviousStates = false]
 *   If true, previous states will be preserved and not removed.
 *
 * @return {void}
 */
AjaxBootstrapSelectList.prototype.save = function (keepPreviousStates) {
    var selected = [];
    keepPreviousStates = keepPreviousStates || false;

    // Clear out previous history.
    if (!keepPreviousStates) {
        this.states = [];
    }

    // Preserve the selected options.
    if (this.options.preserveSelected) {
        var selectedOptions = this.$element.find(':selected');
        // If select does not have multiple selection, ensure that only the
        // last selected option is preserved.
        if (!this.selectpicker.multiple) {
            selectedOptions = selectedOptions.last();
        }
        selectedOptions.each(function () {
            var $option = $(this);
            var value = $option.val();
            selected.push({
                value: value,
                text: $option.text(),
                data: $option.data() || {},
                preserved: true,
                selected: true
            });
        });
    }

    // Save the current state of the list.
    this.states.push({
        selected: selected,
        html: this.$element.html()
    });
};

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

})(jQuery, window);

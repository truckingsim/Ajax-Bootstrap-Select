/**
 * @todo document this.
 * @param element
 * @param {Object} [options]
 * @constructor
 */
var AjaxBootstrapSelect = function (element, options) {
    var defaultOptions, plugin = this;
    this.options = {};
    options = options || {};

    /**
     * Define the log types for use with AjaxBootstrapSelect.log().
     */
    this.LOG_ERROR = 1;
    this.LOG_WARNING = 2;
    this.LOG_INFO = 3;
    this.LOG_DEBUG = 4;

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
     * The "noResults" DOM element placeholder.
     * @type {jQuery}
     */
    this.$noResults = $();

    /**
     * Instantiate a relationship with the parent plugin: selectpicker.
     * @type {$.fn.selectpicker}
     */
    this.selectpicker = this.$element.data('selectpicker');
    if (!this.selectpicker) {
        this.log(this.LOG_ERROR, 'Cannot attach ajax without selectpicker being run first!');
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
%DEFAULT_OPTIONS%//
/* jshint ignore:end */

    // Merge the options into the plugin.
    this.options = $.extend(true, {}, defaultOptions, options);

    /**
     * Maps deprecated options to new ones between releases.
     * @type {Array}
     */
    var deprecatedOptionsMap = [
        // @todo Remove these options in next minor release.
        {
            from: 'ajaxResultsPreHook',
            to: 'preprocessData'
        },
        {
            from: 'ajaxSearchUrl',
            to: {
                ajaxOptions: {
                    url: '{{{value}}}'
                }
            }
        },
        {
            from: 'debug',
            to: function (map) {
                var _options = {};
                _options.log = Boolean(plugin.options[map.from]) ? plugin.LOG_DEBUG : 0;
                $.extend(plugin.options, _options);
                delete plugin.options[map.from];
                plugin.log(plugin.LOG_WARNING, 'Deprecated option "' + map.from + '". Update code to use:', _options);
            }
        },
        {
            from: 'mixWithCurrents',
            to: 'preserveSelected'
        },
        {
            from: 'placeHolderOption',
            to: function (map) {
                var _options = {
                    templates: {
                        noResults: '<div class="no-results">' + options[map.from] + '</div>'
                    }
                };
                $.extend(plugin.options, _options);
                delete plugin.options[map.from];
                plugin.log(plugin.LOG_WARNING, 'Deprecated option "' + map.from + '". Update code to use:', _options);
            }
        }
    ];

    // Map depreciated options into their newer counterparts.
    if (deprecatedOptionsMap.length) {
        $.map(deprecatedOptionsMap, function (map) {
            // Depreciated option detected.
            if (plugin.options[map.from]) {
                // Map with an object. Use "{{{value}}}" anywhere in the object to
                // replace it with the passed value.
                if ($.isPlainObject(map.to)) {
                    plugin.replaceValue(map.to, '{{{value}}}', plugin.options[map.from]);
                    plugin.options = $.extend(true, {}, plugin.options, map.to);
                    plugin.log(plugin.LOG_WARNING, 'Deprecated option "' + map.from + '". Update code to use:', map.to);
                    delete plugin.options[map.from];
                }
                // Map with a function. Functions are silos. They are responsible
                // for deleting the original option and displaying debug info.
                else if ($.isFunction(map.to)) {
                    map.to.apply(plugin, [map]);
                }
                // Map normally.
                else {
                    var _options = {};
                    _options[map.to] = plugin.options[map.from];
                    $.extend(plugin.options, _options);
                    plugin.log(plugin.LOG_WARNING, 'Deprecated option "' + map.from + '". Update code to use:', _options);
                    delete plugin.options[map.from];
                }
            }
        });
    }

    // Determine if the plugin should preserve selections based on
    // whether or not the select element can multi-select.
    if (this.options.preserveSelected && this.options.preserveSelected === 'auto') {
        this.options.preserveSelected = this.selectpicker.multiple;
    }

    // Override any provided option with the data attribute value.
    if (this.$element.data('searchUrl')) {
        this.options.ajaxOptions.url = this.$element.data('searchUrl');
    }

    // Ensure the logging level is always an integer.
    if (typeof this.options.log !== 'number') {
        if (typeof this.options.log === 'string') {
            this.options.log = this.options.log.toLowerCase();
        }
        switch (this.options.log) {
            case true:
            case 'debug':
                this.options.log = this.LOG_DEBUG;
                break;

            case 'info':
                this.options.log = this.LOG_INFO;
                break;

            case 'warn':
            case 'warning':
                this.options.log = this.LOG_WARNING;
                break;

            default:
            case false:
            case 'error':
                this.options.log = this.LOG_ERROR;
                break;
        }
    }

    // Ensure there is a URL.
    if (!this.options.ajaxOptions.url) {
        this.log(this.LOG_ERROR, 'ajaxOptions.url must be set! Options:', this.options);
        return;
    }

    // We need for selectpicker to be attached first. Putting the init in a
    // setTimeout is the easiest way to ensure this.
    // @todo Figure out a better way to do this (hopefully listen for an event).
    setTimeout(function () {
        plugin.init();
    }, 500);
};
window.AjaxBootstrapSelect = window.AjaxBootstrapSelect || AjaxBootstrapSelect;

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
            plugin.log(plugin.LOG_DEBUG, 'Bind event fired: "' + plugin.options.bindEvent + '", keyCode:', e.keyCode, e);
            plugin.query = plugin.selectpicker.$searchbox.val();

            // Dynamically ignore the "enter" key (13) so it doesn't
            // create an additional request if the "cache" option has
            // been disabled.
            if (!plugin.options.cache) {
                plugin.options.ignoredKeys[13] = 'enter';
            }

            // Don't process ignored keys.
            if (plugin.options.ignoredKeys[e.keyCode]) {
                plugin.log(plugin.LOG_DEBUG, 'Key ignored.');
                return true;
            }

            // Process empty search value.
            if (!plugin.query.length) {
                // Clear the select list.
                if (plugin.options.clearOnEmpty) {
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
                    plugin.list.refresh();
                    return true;
                }
                plugin.log(plugin.LOG_WARNING, 'Unable to build the options from cached data.', plugin.query, plugin.cachedData[plugin.query]);
                plugin.list.restore();
                return;
            }

            timeout = setTimeout(function () {
                // Save the current state of the plugin.
                plugin.list.save();

                // Destroy the list currently there.
                plugin.list.destroy();

                // Remove any existing templates.
                plugin.$loading.remove();
                plugin.$noResults.remove();

                // Show the loading template.
                if (plugin.options.templates.loading) {
                    plugin.$loading = $(plugin.options.templates.loading).appendTo(plugin.selectpicker.$menu);
                    plugin.list.refresh();
                }

                var ajaxParams = {};
                ajaxParams.url = plugin.options.ajaxOptions.url;

                //Success function, this builds the options to put in the select
                ajaxParams.success = function (data, status, jqXHR) {
                    plugin.log(plugin.LOG_INFO, 'AJAX success event:', data, status, jqXHR);
                    // Only process data if an Array or Object.
                    if (!$.isArray(data) && !$.isObject(data)) {
                        plugin.log(plugin.LOG_ERROR, 'Request did not return a JSON Array or Object.', data);
                        plugin.list.destroy();
                        return;
                    }

                    // Only continue if actual results.
                    if (!Object.keys(data).length) {
                        plugin.list.destroy();
                        if (plugin.options.templates.noResults) {
                            // Show the "no results" template.
                            plugin.$noResults = $(plugin.options.templates.noResults).appendTo(plugin.selectpicker.$menu);
                        }
                        plugin.log(plugin.LOG_INFO, 'No results were returned.');
                        return;
                    }

                    // Process the data.
                    var processedData = plugin.processData(data, plugin.query);
                    if (processedData && processedData.length) {
                        // Build the option output.
                        var output = plugin.list.build(processedData);
                        if (!output.length) {
                            plugin.log(plugin.LOG_WARNING, 'Unable to build the options from data.', data, output);
                            return;
                        }
                        plugin.$element.html(output);
                    }
                };

                //If there is an error be sure to put in the previous options
                ajaxParams.error = function (jqXHR, status, error) {
                    plugin.log(plugin.LOG_ERROR, 'AJAX error event:', jqXHR, status, error);
                    plugin.list.restore();
                };

                //Always refresh the list and remove the loading menu
                ajaxParams.complete = function (jqXHR, status) {
                    plugin.log(plugin.LOG_INFO, 'AJAX complete event:', jqXHR, status);
                    plugin.$loading.remove();
                    plugin.list.refresh();
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
 * @param  {Number} type
 *   The type of message to log. Must be one of:
 *     - 1: AjaxBootstrapSelect.LOG_ERROR
 *     - 2: AjaxBootstrapSelect.LOG_WARNING
 *     - 3: AjaxBootstrapSelect.LOG_INFO
 *     - 4: AjaxBootstrapSelect.LOG_DEBUG
 * @param {...*} message
 *   The message(s) to log. Multiple arguments can be passed.
 *
 * @return {void}
 */
AjaxBootstrapSelect.prototype.log = function (type, message) {
    if (this.options.log && window.console && typeof type === 'number' && type <= this.options.log) {
        var args = [].slice.apply(arguments, [2]);

        // Determine the correct console method to use.
        switch (type) {
            case this.LOG_DEBUG: type = 'debug'; break;
            case this.LOG_INFO: type = 'info'; break;
            case this.LOG_WARNING: type = 'warn'; break;
            default: case this.LOG_ERROR: type = 'error'; break;
        }

        // Prefix the message.
        var prefix = '[' + type.toUpperCase() + '] AjaxBootstrapSelect:';
        if (typeof message === 'string') {
            args.unshift(prefix + ' ' + message);
        }
        else {
            args.unshift(message);
            args.unshift(prefix);
        }

        // Display the message(s).
        window.console[type].apply(window.console, args);
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

    this.log(this.LOG_INFO, 'Processing raw data for:', query, data);

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
            this.log(this.LOG_ERROR, 'The data type passed was not an Array or Object.', data);
            return false;
        }
    }

    // Invoke the preprocessData option function and pass it another
    // clone so it doesn't intentionally modify the array. Only use the
    // returned value.
    preprocessedData = [].concat(clone);
    if ($.isFunction(this.options.preprocessData)) {
        this.log(this.LOG_DEBUG, 'Invoking preprocessData callback:', this.options.processData);
        preprocessedData = this.options.preprocessData(preprocessedData);
        if (!$.isArray(preprocessedData) || !preprocessedData.length) {
            this.log(this.LOG_ERROR, 'The preprocessData callback did not return an array or was empty.', data, preprocessedData);
            return false;
        }
    }

    // Filter preprocessedData.
    l = preprocessedData.length;
    for (i = 0; i < l; i++) {
        item = preprocessedData[i];
        this.log(this.LOG_DEBUG, 'Processing item:', item);
        if ($.isPlainObject(item)) {
            // Check if item is a divider. If so, ignore all other data.
            // @todo Remove depreciated item.data.divider check in next
            // minor release.
            if (item.hasOwnProperty('divider') || (item.hasOwnProperty('data') && $.isPlainObject(item.data) && item.data.divider)) {
                this.log(this.LOG_DEBUG, 'Item is a divider, ignoring provided data.');
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
                        this.log(this.LOG_DEBUG, 'Duplicate item found, ignoring.');
                    }
                }
                else {
                    this.log(this.LOG_DEBUG, 'Data item must have a "value" property, skipping.');
                }
            }
        }
    }

    // Invoke the processData option function and pass a clone of
    // processedData so it doesn't intentionally modify the array. Only
    // use the returned value.
    processedData = [].concat(filteredData);
    if ($.isFunction(this.options.processData)) {
        this.log(this.LOG_DEBUG, 'Invoking processData callback:', this.options.processData);
        processedData = this.options.processData(processedData);
        if (!$.isArray(processedData) || !processedData.length) {
            this.log(this.LOG_ERROR, 'The processedData callback did not return an array or was empty.', data, filteredData, processedData);
            return false;
        }
    }

    // Cache the data, if possible.
    if (this.options.cache && query) {
        this.log(this.LOG_DEBUG, 'Caching processed data.');
        this.cachedData[query] = processedData;
    }

    this.log(this.LOG_INFO, 'Processed data:', processedData);
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

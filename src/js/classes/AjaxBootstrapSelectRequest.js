/**
 * @todo document this.
 * @param {AjaxBootstrapSelect} plugin
 * @constructor
 */
var AjaxBootstrapSelectRequest = function (plugin) {
    var that = this;
    var ajaxCallback = function (event) {
        return function () {
            that.plugin.log(that.plugin.LOG_INFO, 'Invoking AjaxBootstrapSelectRequest.' + event + ' callback:', arguments);
            that[event].apply(that, arguments);
            if (that.callbacks[event]) {
                that.plugin.log(that.plugin.LOG_INFO, 'Invoking ajaxOptions.' + event + ' callback:', arguments);
                that.callbacks[event].apply(that, arguments);
            }
        };
    };
    var events = ['beforeSend', 'success', 'error', 'complete'];
    var i, l = events.length;

    // Reference the existing plugin.
    this.plugin = plugin;

    // Clone the default ajaxOptions.
    this.options = $.extend(true, {}, plugin.options.ajaxOptions);

    // Save any existing callbacks provided in the options and replace it with
    // the relevant method callback. The provided callback will be invoked
    // after this plugin has executed.
    this.callbacks = {};
    for (i = 0; i < l; i++) {
        var event = events[i];
        if (this.options[event] && $.isFunction(this.options[event])) {
            this.callbacks[event] = this.options[event];
        }
        this.options[event] = ajaxCallback(event);
    }

    // Allow the data option to be dynamically generated.
    if (this.options.data && $.isFunction(this.options.data)) {
        this.options.data = this.options.data.apply(this) || {
            q: '{{{q}}}'
        };
    }

    // Replace all data values that contain "{{{q}}}" with the value of the
    // current search query.
    this.plugin.replaceValue(this.options.data, '{{{q}}}', this.plugin.query);

    // Invoke the AJAX request.
    this.jqXHR = $.ajax(this.options);
};
window.AjaxBootstrapSelectRequest = window.AjaxBootstrapSelectRequest || AjaxBootstrapSelectRequest;

/**
 * A callback that can be used to modify the jqXHR object before it is sent.
 *
 * Use this to set custom headers, etc. Returning false will cancel the request.
 * To modify the options being sent, use this.options.
 *
 * @param {jqXHR} jqXHR
 *   The jQuery wrapped XMLHttpRequest object.
 *
 * @return {void}
 */
AjaxBootstrapSelectRequest.prototype.beforeSend = function (jqXHR) {
    // Save the current state of the plugin.
    this.plugin.list.save();

    // Destroy the list currently there.
    this.plugin.list.destroy();

    // Remove any existing templates.
    this.plugin.$loading.remove();
    this.plugin.$noResults.remove();

    // Show the loading template.
    if (this.plugin.options.templates.loading) {
        this.plugin.$loading = $(this.plugin.options.templates.loading).appendTo(this.plugin.selectpicker.$menu);
        this.plugin.list.refresh();
    }
};

/**
 * The "complete" callback for the request.
 *
 * @param {jqXHR} jqXHR
 *   The jQuery wrapped XMLHttpRequest object.
 * @param {String} status
 *   A string categorizing the status of the request: "success", "notmodified",
 *   "error", "timeout", "abort", or "parsererror".
 *
 * @return {void}
 */
AjaxBootstrapSelectRequest.prototype.complete = function (jqXHR, status) {
    this.plugin.$loading.remove();
    this.plugin.list.refresh();
};

/**
 * The "error" callback for the request.
 *
 * @param {jqXHR} jqXHR
 *   The jQuery wrapped XMLHttpRequest object.
 * @param {String} status
 *   A string describing the type of error that occurred. Possible values for
 *   the second argument (besides null) are "timeout", "error", "abort", and
 *   "parsererror".
 * @param {String|Object} error
 *   An optional exception object, if one occurred. When an HTTP error occurs,
 *   error receives the textual portion of the HTTP status, such as "Not Found"
 *   or "Internal Server Error."
 *
 * @return {void}
 */
AjaxBootstrapSelectRequest.prototype.error = function (jqXHR, status, error) {
    this.plugin.list.restore();
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
 *
 * @return {Array|boolean}
 *   The processed data array or false if an error occurred.
 */
AjaxBootstrapSelectRequest.prototype.process = function (data) {
    var i, l, clone, item, lastState, preprocessedData, processedData;
    var filteredData = [], seenValues = [], selected = [];

    this.plugin.log(this.plugin.LOG_INFO, 'Processing raw data for:', this.plugin.query, data);

    // Merge in the selected options from the previous state.
    if (this.plugin.options.preserveSelected && this.plugin.list && (lastState = this.plugin.list.last()) && lastState) {
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
            this.plugin.log(this.plugin.LOG_ERROR, 'The data type passed was not an Array or Object.', data);
            return false;
        }
    }

    // Invoke the preprocessData option function and pass it another
    // clone so it doesn't intentionally modify the array. Only use the
    // returned value.
    preprocessedData = [].concat(clone);
    if ($.isFunction(this.plugin.options.preprocessData)) {
        this.plugin.log(this.plugin.LOG_DEBUG, 'Invoking preprocessData callback:', this.plugin.options.processData);
        preprocessedData = this.plugin.options.preprocessData(preprocessedData);
        if (!$.isArray(preprocessedData) || !preprocessedData.length) {
            this.plugin.log(this.plugin.LOG_ERROR, 'The preprocessData callback did not return an array or was empty.', data, preprocessedData);
            return false;
        }
    }

    // Filter preprocessedData.
    l = preprocessedData.length;
    for (i = 0; i < l; i++) {
        item = preprocessedData[i];
        this.plugin.log(this.plugin.LOG_DEBUG, 'Processing item:', item);
        if ($.isPlainObject(item)) {
            // Check if item is a divider. If so, ignore all other data.
            // @todo Remove depreciated item.data.divider check in next
            // minor release.
            if (item.hasOwnProperty('divider') || (item.hasOwnProperty('data') && $.isPlainObject(item.data) && item.data.divider)) {
                this.plugin.log(this.plugin.LOG_DEBUG, 'Item is a divider, ignoring provided data.');
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
                        this.plugin.log(this.plugin.LOG_DEBUG, 'Duplicate item found, ignoring.');
                    }
                }
                else {
                    this.plugin.log(this.plugin.LOG_DEBUG, 'Data item must have a "value" property, skipping.');
                }
            }
        }
    }

    // Invoke the processData option function and pass a clone of
    // processedData so it doesn't intentionally modify the array. Only
    // use the returned value.
    processedData = [].concat(filteredData);
    if ($.isFunction(this.plugin.options.processData)) {
        this.plugin.log(this.plugin.LOG_DEBUG, 'Invoking processData callback:', this.plugin.options.processData);
        processedData = this.plugin.options.processData(processedData);
        if (!$.isArray(processedData) || !processedData.length) {
            this.plugin.log(this.plugin.LOG_ERROR, 'The processedData callback did not return an array or was empty.', data, filteredData, processedData);
            return false;
        }
    }

    // Cache the data, if possible.
    if (this.plugin.options.cache && this.plugin.query) {
        this.plugin.log(this.plugin.LOG_DEBUG, 'Caching processed data.');
        this.plugin.cachedData[this.plugin.query] = processedData;
    }

    this.plugin.log(this.plugin.LOG_INFO, 'Processed data:', processedData);
    return processedData;
};

/**
 * The "success" callback for the request.
 *
 * @param {Object} data
 *   The data returned from the server, formatted according to the dataType
 *   option.
 * @param {String} status
 *   A string describing the status.
 * @param {jqXHR} jqXHR
 *   The jQuery wrapped XMLHttpRequest object.
 *
 * @return {void}
 */
AjaxBootstrapSelectRequest.prototype.success = function (data, status, jqXHR) {
    // Only process data if an Array or Object.
    if (!$.isArray(data) && !$.isObject(data)) {
        this.plugin.log(this.plugin.LOG_ERROR, 'Request did not return a JSON Array or Object.', data);
        this.plugin.list.destroy();
        return;
    }

    // Only continue if actual results.
    if (!Object.keys(data).length) {
        this.plugin.list.destroy();
        if (this.plugin.options.templates.noResults) {
            // Show the "no results" template.
            this.plugin.$noResults = $(this.plugin.options.templates.noResults).appendTo(this.plugin.selectpicker.$menu);
        }
        this.plugin.log(this.plugin.LOG_INFO, 'No results were returned.');
        return;
    }

    // Process the data.
    var processedData = this.process(data);
    if (processedData && processedData.length) {
        // Build the option output.
        var output = this.plugin.list.build(processedData);
        if (!output.length) {
            this.plugin.log(this.plugin.LOG_WARNING, 'Unable to build the options from data.', data, output);
            return;
        }
        this.plugin.$element.html(output);
    }
};

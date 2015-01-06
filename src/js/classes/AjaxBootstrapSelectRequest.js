/**
 * @class AjaxBootstrapSelectRequest
 *   Instantiates a new jQuery.ajax request for the current query.
 *
 * @param {AjaxBootstrapSelect} plugin
 *   The plugin instance.
 *
 * @return {AjaxBootstrapSelectRequest}
 *   A new instance of this class.
 */
var AjaxBootstrapSelectRequest = function (plugin) {
    var that = this;
    var ajaxCallback = function (event) {
        return function () {
            that.plugin.log(that.plugin.LOG_INFO, 'Invoking AjaxBootstrapSelectRequest.' + event + ' callback:', arguments);
            that[event].apply(that, arguments);
            if (that.callbacks[event]) {
                that.plugin.log(that.plugin.LOG_INFO, 'Invoking ajax.' + event + ' callback:', arguments);
                that.callbacks[event].apply(that, arguments);
            }
        };
    };
    var events = ['beforeSend', 'success', 'error', 'complete'];
    var i, l = events.length;

    // Reference the existing plugin.
    this.plugin = plugin;

    // Clone the default ajax options.
    this.options = $.extend(true, {}, plugin.options.ajax);

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

/**
 * @event
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
    // Destroy the list currently there.
    this.plugin.list.destroy();

    // Set the status accordingly.
    this.plugin.list.setStatus(this.plugin.t('statusSearching'));

    //this.plugin.list.refresh();
};

/**
 * @event
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
    // Only continue if actual results and not an aborted state.
    if (status !== 'abort') {
        var cache = this.plugin.list.cacheGet(this.plugin.query);
        if (cache) {
            if (cache.length) {
                this.plugin.list.setStatus();
            }
            else {
                this.plugin.list.destroy();
                this.plugin.list.setStatus(this.plugin.t('statusNoResults'));
                this.plugin.log(this.plugin.LOG_INFO, 'No results were returned.');
                return;
            }
        }
        this.plugin.list.refresh(true);
    }
};

/**
 * @event
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
    if (status !== 'abort') {
        // Cache the result data.
        this.plugin.list.cacheSet(this.plugin.query);

        // Clear the list.
        if (this.plugin.options.clearOnError) {
            this.plugin.list.destroy();
        }

        // Set the status after the list has cleared and before the restore.
        this.plugin.list.setStatus(this.plugin.t('errorText'));

        // Restore previous request.
        if (this.plugin.options.restoreOnError) {
            this.plugin.list.restore();
            this.plugin.list.setStatus();
        }
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
 *
 * @return {Array|Boolean}
 *   The processed data array or false if an error occurred.
 */
AjaxBootstrapSelectRequest.prototype.process = function (data) {
    var i, l, callbackResult, item, preprocessedData, processedData;
    var filteredData = [], seenValues = [];

    this.plugin.log(this.plugin.LOG_INFO, 'Processing raw data for:', this.plugin.query, data);

    // Invoke the preprocessData option callback.
    preprocessedData = data;
    if ($.isFunction(this.plugin.options.preprocessData)) {
        this.plugin.log(this.plugin.LOG_DEBUG, 'Invoking preprocessData callback:', this.plugin.options.processData);
        callbackResult = this.plugin.options.preprocessData.apply(this, [preprocessedData]);
        if (typeof callbackResult !== 'undefined' && callbackResult !== null && callbackResult !== false) {
            preprocessedData = callbackResult;
        }
    }

    // Ensure the data is an array.
    if (!$.isArray(preprocessedData)) {
        this.plugin.log(this.plugin.LOG_ERROR, 'The data returned is not an Array. Use the "preprocessData" callback option to parse the results and construct a proper array for this plugin.', preprocessedData);
        return false;
    }

    // Filter preprocessedData.
    l = preprocessedData.length;
    for (i = 0; i < l; i++) {
        item = preprocessedData[i];
        this.plugin.log(this.plugin.LOG_DEBUG, 'Processing item:', item);
        if ($.isPlainObject(item)) {
            // Check if item is a divider. If so, ignore all other data.
            if (item.hasOwnProperty('divider') || (item.hasOwnProperty('data') && $.isPlainObject(item.data) && item.data.divider)) {
                this.plugin.log(this.plugin.LOG_DEBUG, 'Item is a divider, ignoring provided data.');
                filteredData.push({divider: true});
            }
            // Ensure item has a "value" and is unique.
            else {
                if (item.hasOwnProperty('value')) {
                    // Typecast the value for the seenValues array. Array
                    // indexOf searches are type sensitive.
                    if (seenValues.indexOf(item.value + '') === -1) {
                        seenValues.push(item.value + '');
                        // Provide default items to ensure expected structure.
                        item = $.extend({
                            text: item.value,
                            'class': '',
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

    // Invoke the processData option callback.
    processedData = [].concat(filteredData);
    if ($.isFunction(this.plugin.options.processData)) {
        this.plugin.log(this.plugin.LOG_DEBUG, 'Invoking processData callback:', this.plugin.options.processData);
        callbackResult = this.plugin.options.processData.apply(this, [processedData]);
        if (typeof callbackResult !== 'undefined' && callbackResult !== null && callbackResult !== false) {
            if ($.isArray(callbackResult)) {
                processedData = callbackResult;
            }
            else {
                this.plugin.log(this.plugin.LOG_ERROR, 'The processData callback did not return an array.', callbackResult);
                return false;
            }
        }
    }

    // Cache the processed data.
    this.plugin.list.cacheSet(this.plugin.query, processedData);

    this.plugin.log(this.plugin.LOG_INFO, 'Processed data:', processedData);
    return processedData;
};

/**
 * @event
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
    if (!$.isArray(data) && !$.isPlainObject(data)) {
        this.plugin.log(this.plugin.LOG_ERROR, 'Request did not return a JSON Array or Object.', data);
        this.plugin.list.destroy();
        return;
    }

    // Process the data.
    var processedData = this.process(data);
    this.plugin.list.replaceOptions(processedData);
};

/**
 * Use an existing definition in the Window object or create a new one.
 *
 * Note: This must be the last statement of this file.
 *
 * @type {AjaxBootstrapSelectRequest}
 * @ignore
 */
window.AjaxBootstrapSelectRequest = window.AjaxBootstrapSelectRequest || AjaxBootstrapSelectRequest;

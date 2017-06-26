/**
 * @class AjaxBootstrapSelectList
 *   Maintains the select options and selectpicker menu.
 *
 * @param {AjaxBootstrapSelect} plugin
 *   The plugin instance.
 *
 * @return {AjaxBootstrapSelectList}
 *   A new instance of this class.
 */
var AjaxBootstrapSelectList = function (plugin) {
    var that = this;

    /**
     * DOM element used for updating the status of requests and list counts.
     * @type {jQuery}
     */
    this.$status = $(plugin.options.templates.status).hide().appendTo(plugin.selectpicker.$menu);
    var statusInitialized = plugin.t('statusInitialized');
    if (statusInitialized && statusInitialized.length) {
        this.setStatus(statusInitialized);
    }

    /**
     * Container for cached data.
     * @type {Object}
     */
    this.cache = {};

    /**
     * Reference the plugin for internal use.
     * @type {AjaxBootstrapSelect}
     */
    this.plugin = plugin;

    /**
     * Container for current selections.
     * @type {Array}
     */
    this.selected = [];

    /**
     * Containers for previous titles.
     */
    this.title = null;
    this.selectedTextFormat = plugin.selectpicker.options.selectedTextFormat;

    // Save initial options
    var initial_options = [];
    plugin.$element.find('option').each(function() {
        var $option = $(this);
        var value = $option.attr('value');
        initial_options.push({
            value: value,
            text: $option.text(),
            'class': $option.attr('class') || '',
            data: $option.data() || {},
            preserved: plugin.options.preserveSelected,
            selected: !!$option.attr('selected')
        });
    });
    this.cacheSet(/*query=*/'', initial_options);

    // Preserve selected options.
    if (plugin.options.preserveSelected) {
        that.selected = initial_options;
        plugin.$element.on('change.abs.preserveSelected', function (e) {
            var $selected = plugin.$element.find(':selected');
            that.selected = [];
            // If select does not have multiple selection, ensure that only the
            // last selected option is preserved.
            if (!plugin.selectpicker.multiple) {
                $selected = $selected.last();
            }
            $selected.each(function () {
                var $option = $(this);
                var value = $option.attr('value');
                that.selected.push({
                    value: value,
                    text: $option.text(),
                    'class': $option.attr('class') || '',
                    data: $option.data() || {},
                    preserved: true,
                    selected: true
                });
            });
            that.replaceOptions(that.cacheGet(that.plugin.query));
        });
    }
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
    var $select = $('<select/>');
    var $preserved = $('<optgroup/>').attr('label', this.plugin.t('currentlySelected'));

    this.plugin.log(this.plugin.LOG_DEBUG, 'Building the select list options from data:', data);

    for (i = 0; i < l; i++) {
        var item = data[i];
        var $option = $('<option/>').appendTo(item.preserved ? $preserved : $select);

        // Detect dividers.
        if (item.hasOwnProperty('divider')) {
            $option.attr('data-divider', 'true');
            continue;
        }

        // Set various properties.
        $option.val(item.value).text(item.text).attr('title', item.text);
        if (item['class'].length) {
            $option.attr('class', item['class']);
        }
        if (item.disabled) {
            $option.attr('disabled', true);
        }

        // Remove previous selections, if necessary.
        if (item.selected && !this.plugin.selectpicker.multiple) {
            $select.find(':selected').prop('selected', false);
        }

        // Set this option's selected state.
        if (item.selected) {
            $option.attr('selected', true);
        }

        // Add data attributes.
        for (a in item.data) {
            if (item.data.hasOwnProperty(a)) {
                $option.attr('data-' + a, item.data[a]);
            }
        }
    }

    // Append the preserved selections.
    if ($preserved.find('option').length) {
        $preserved[this.plugin.options.preserveSelectedPosition === 'before' ? 'prependTo' : 'appendTo']($select);
    }

    var options = $select.html();
    this.plugin.log(this.plugin.LOG_DEBUG, options);
    return options;
};

/**
 * Retrieve data from the cache.
 *
 * @param {string} key
 *   The identifier name of the data to retrieve.
 * @param {*} [defaultValue]
 *   The default value to return if no cache data is available.
 *
 * @return {*}
 *   The cached data or defaultValue.
 */
AjaxBootstrapSelectList.prototype.cacheGet = function (key, defaultValue) {
    var value = this.cache[key] || defaultValue;
    this.plugin.log(this.LOG_DEBUG, 'Retrieving cache:', key, value);
    return value;
};

/**
 * Save data to the cache.
 *
 * @param {string} key
 *   The identifier name of the data to store.
 * @param {*} value
 *   The value of the data to store.
 *
 * @return {void}
 */
AjaxBootstrapSelectList.prototype.cacheSet = function (key, value) {
    this.cache[key] = value;
    this.plugin.log(this.LOG_DEBUG, 'Saving to cache:', key, value);
};

/**
 * Destroys the select list.
 */
AjaxBootstrapSelectList.prototype.destroy = function () {
    this.replaceOptions();
    this.plugin.list.setStatus();
    this.plugin.log(this.plugin.LOG_DEBUG, 'Destroyed select list.');
};

/**
 * Refreshes the select list.
 */
AjaxBootstrapSelectList.prototype.refresh = function (triggerChange) {
    // Remove unnecessary "min-height" from selectpicker.
    this.plugin.selectpicker.$menu.css('minHeight', 0);
    this.plugin.selectpicker.$menu.find('> .inner').css('minHeight', 0);
    var emptyTitle = this.plugin.t('emptyTitle');
    if (!this.plugin.$element.find('option').length && emptyTitle && emptyTitle.length) {
        this.setTitle(emptyTitle);
    }
    else if (
        this.title ||
        (
            this.selectedTextFormat !== 'static' && 
            this.selectedTextFormat !== this.plugin.selectpicker.options.selectedTextFormat
        )
    ) {
        this.restoreTitle();
    }
    this.plugin.selectpicker.refresh();
    // The "refresh" method sets the $lis property to null, it must be rebuilt.
    this.plugin.selectpicker.findLis();

    // Only trigger change event when specified.
    if(triggerChange){
      this.plugin.log(this.plugin.LOG_DEBUG, 'Triggering Change');
      this.plugin.$element.trigger('change.$');
    }
    this.plugin.log(this.plugin.LOG_DEBUG, 'Refreshed select list.');
};

/**
 * Replaces the select list options with provided data.
 *
 * It will also inject any preserved selections if the preserveSelected
 * option is enabled.
 *
 * @param {Array} data
 *   The data array to process.
 *
 * @returns {void}
 */
AjaxBootstrapSelectList.prototype.replaceOptions = function (data) {
    var i, l, item, output = '', processedData = [], selected = [], seenValues = [];
    data = data || [];

    // Merge in selected options from the previous state (cannot be cached).
    if (this.selected && this.selected.length) {
        this.plugin.log(this.plugin.LOG_INFO, 'Processing preserved selections:', this.selected);
        selected = [].concat(this.selected, data);
        l = selected.length;
        for (i = 0; i < l; i++) {
            item = selected[i];
            // Typecast the value for the seenValues array. Array indexOf
            // searches are type sensitive.
            if (item.hasOwnProperty('value') && seenValues.indexOf(item.value + '') === -1) {
                seenValues.push(item.value + '');
                processedData.push(item);
            }
            else {
                this.plugin.log(this.plugin.LOG_DEBUG, 'Duplicate item found, ignoring.');
            }
        }
        data = processedData;
    }

    // Build the option output.
    if (data.length) {
        output = this.plugin.list.build(data);
    }

    // Replace the options.
    this.plugin.$element.html(output);
    this.refresh();
    this.plugin.log(this.plugin.LOG_DEBUG, 'Replaced options with data:', data);
};

/**
 * Restores the select list to the last saved state.
 *
 * @return {boolean}
 *   Return true if successful or false if no states are present.
 */
AjaxBootstrapSelectList.prototype.restore = function () {
    var cache = this.plugin.list.cacheGet(this.plugin.previousQuery);
    if (cache && this.plugin.list.replaceOptions(cache)) {
        this.plugin.log(this.plugin.LOG_DEBUG, 'Restored select list to the previous query: ', this.plugin.previousQuery);
    }
    this.plugin.log(this.plugin.LOG_DEBUG, 'Unable to restore select list to the previous query:', this.plugin.previousQuery);
    return false;
};

/**
 * Restores the previous title of the select element.
 *
 * @return {void}
 */
AjaxBootstrapSelectList.prototype.restoreTitle = function () {
    if (!this.plugin.request) {
        this.plugin.selectpicker.options.selectedTextFormat = this.selectedTextFormat;
        if (this.title) {
            this.plugin.$element.attr('title', this.title);
        }
        else {
            this.plugin.$element.removeAttr('title');
        }
        this.title = null;
    }
};

/**
 * Sets a new title on the select element.
 *
 * @param {String} title
 *
 * @return {void}
 */
AjaxBootstrapSelectList.prototype.setTitle = function (title) {
    if (!this.plugin.request) {
        this.title = this.plugin.$element.attr('title');
        this.plugin.selectpicker.options.selectedTextFormat = 'static';
        this.plugin.$element.attr('title', title);
    }
};

/**
 * Sets a new status on the AjaxBootstrapSelectList.$status DOM element.
 *
 * @param {String} [status]
 *   The new status to set, if empty it will hide it.
 *
 * @return {void}
 */
AjaxBootstrapSelectList.prototype.setStatus = function (status) {
    status = status || '';
    if (status.length) {
        this.$status.html(status).show();
    }
    else {
        this.$status.html('').hide();
    }
};

/**
 * Use an existing definition in the Window object or create a new one.
 *
 * Note: This must be the last statement of this file.
 *
 * @type {AjaxBootstrapSelectList}
 * @ignore
 */
window.AjaxBootstrapSelectList = window.AjaxBootstrapSelectList || AjaxBootstrapSelectList;

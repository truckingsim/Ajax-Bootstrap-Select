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
    var a, i, l = data.length, $wrapper = $('<select/>');

    this.log(this.LOG_DEBUG, 'Building the select list options from data:', data);

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

    var options = $wrapper.html();
    this.log(this.LOG_DEBUG, options);
    return options;
};


/**
 * @todo document this, make method better.
 */
AjaxBootstrapSelectList.prototype.destroy = function () {
    this.$element.find('option').remove();
    this.log(this.LOG_DEBUG, 'Destroyed select list.');
    this.refresh();
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
        var state = this.states[this.states.length - 1];
        this.log(this.LOG_DEBUG, 'Retrieved the last saved state of the select list:', state);
        return state;
    }
    this.log(this.LOG_DEBUG, 'Unable to retrieve the last saved state of the select list.');
    return false;
};

/**
 * Refreshes the select list.
 */
AjaxBootstrapSelectList.prototype.refresh = function () {
    // Remove unnecessary "min-height" from selectpicker.
    this.selectpicker.$menu.css('minHeight', 0);
    this.selectpicker.$menu.find('> .inner').css('minHeight', 0);
    this.selectpicker.refresh();
    // The "refresh" method will set the $lis property to null, we must rebuild
    // it. Bootstrap Select <= 1.6.2 does not have the "findLis" method, this
    // method will be in included in future releases, but until then we must
    // mimic its functionality.
    // @todo remove this if statement when Bootstrap Select 1.6.3 is released.
    if (this.selectpicker.findLis) {
        this.selectpicker.findLis();
    }
    else {
        this.selectpicker.$lis = this.selectpicker.$menu.find('li');
    }
    this.log(this.LOG_DEBUG, 'Refreshed select list.');
};

/**
 * Restores the select list to the last saved state.
 *
 * @return {boolean}
 *   Return true if successful or false if no states are present.
 */
AjaxBootstrapSelectList.prototype.restore = function () {
    if (this.states.length) {
        var state = this.states.pop();
        this.$element.html(state.html);
        this.log(this.LOG_DEBUG, 'Restored select list to a previous state:', state);
        return true;
    }
    this.log(this.LOG_DEBUG, 'Unable to restore select list to a previous state.');
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
    var state = {
        selected: selected,
        html: this.$element.html()
    };
    this.states.push(state);
    this.log(this.LOG_DEBUG, 'Saved the current state of the select list:', state);
};

## Options

Options can be passed via data attributes or through the JavaScript options object. For data attributes, append the option name to the `data-abs-` prefix. Options names (and any nested options) are always lower case and separated by `-`, such as in `data-abs-ajax-url="..."` or `data-abs-locale-search-placeholder="..."`.

### ~~options.ajaxResultsPreHook~~
> __Deprecated:__ Since version `1.2.0`, see: [options.preprocessData](#optionspreprocessdata).
>
> __Type:__ `Function`
>

***

### options.ajax
> __Required__
>
> __Type:__ `Object`
>
> __Data Attribute:__ `data-abs-ajax[-*]="..."`
>
> The options to pass to the jQuery AJAX request.
> ```js
> {
>     url: null, // Required.
>     type: 'POST',
>     dataType: 'json',
>     data: {
>         q: '{{{q}}}'
>     }
> }
> ```

***

### options.minLength
> __Type:__ `Number`
>
> __Default:__ `0`
>
> __Data Attribute:__ `data-abs-min-length="..."`
>
> Invoke a request for empty search values.

***

### ~~options.ajaxSearchUrl~~
> __Deprecated:__ Since version `1.2.0`, see: [options.ajax](#optionsajax).
>
> __Type:__ `String`
>

***

### options.bindEvent
> __Type:__ `String`
>
> __Default:__ `"keyup"`
>
> __Data Attribute:__ `data-abs-bind-event="..."`
>
> The event to bind on the search input element to fire a request.

***

### options.cache
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> __Data Attribute:__ `data-abs-cache="..."`
>
> Cache previous requests. If enabled, the "enter" key (13) is enabled to
> allow users to force a refresh of the request.

***

### options.clearOnEmpty
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> __Data Attribute:__ `data-abs-clear-on-empty="..."`
>
> Clears the previous results when the search input has no value.

***

### options.clearOnError
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> __Data Attribute:__ `data-abs-clear-on-error="..."`
>
> Clears the select list when the request returned with an error.

***

### ~~options.debug~~
> __Deprecated:__ Since version `1.2.0`, see: [options.log](#optionslog).
>
> __Type:__ `Boolean`
>

***

### options.emptyRequest
> __Type:__ `Boolean`
>
> __Default:__ `false`
>
> __Data Attribute:__ `data-abs-empty-request="..."`
>
> Invoke a request for empty search values.

***

### options.ignoredKeys
> __Type:__ `Object`
>
> __Data Attribute:__ `data-abs-ignored-keys[-*]="..."`
>
> Key codes to ignore so a request is not invoked with bindEvent. The
> "enter" key (13) will always be dynamically added to any list provided
> unless the "cache" option above is set to "true".
> ```js
> {
>     9: "tab",
>     16: "shift",
>     17: "ctrl",
>     18: "alt",
>     27: "esc",
>     37: "left",
>     39: "right",
>     38: "up",
>     40: "down",
>     91: "meta"
> }
> ```

***

### options.langCode
> __Type:__ `String`
>
> __Default:__ `null`
>
> __Data Attribute:__ `data-abs-lang-code="..."`
>
> The language code to use for string translation. By default this value
> is determined by the browser, however it is not entirely reliable. If
> you encounter inconsistencies, you may need to manually set this option.

***

### options.locale
> __Type:__ `Object`
>
> __Default:__ `null`
>
> __Data Attribute:__ `data-abs-locale[-*]="..."`
>
> Provide specific overrides for [locale string](#locale-strings) translations. Values
> set here will cause the plugin to completely ignore defined locale string
> translations provided by the set language code. This is useful when
> needing to change a single value or when being used in a system that
> provides its own translations, like a CMS.
> ```js
> locale: {
>     searchPlaceholder: Drupal.t('Find...')
> }
> ```

***

### options.log
> __Type:__ `String|Number|Number`
>
> __Default:__ `'error'`
>
> __Data Attribute:__ `data-abs-log="..."`
>
> Determines the amount of logging that is displayed:
> - __0, false:__ Display no information from the plugin.
> - __1, 'error':__ Fatal errors that prevent the plugin from working.
> - __2, 'warn':__ Warnings that may impact the display of request data, but does not prevent the plugin from functioning.
> - __3, 'info':__ Provides additional information, generally regarding the from request data and callbacks.
> - __4, true, 'debug':__ Display all possible information. This will likely be highly verbose and is only recommended for development purposes or tracing an error with a request.

***

### ~~options.mixWithCurrents~~
> __Deprecated:__ Since version `1.2.0`, see: [options.preserveSelected](#optionspreserveselected).
>
> __Type:__ `Boolean`
>

***

### ~~options.placeHolderOption~~
> __Deprecated:__ Since version `1.2.0`, see: [locale.emptyTitle](#localeemptytitle).
>

***

### options.preprocessData
> __Type:__ `Function|null`
>
> __Default:__ `function(){}`
>
> Process the raw data returned from a request.
> The following arguments are passed to this callback:
> - __data__ - `Array` The raw data returned from the request, passed by reference.
> This callback must return one of the following:
> - `Array` - A new array of items. This will replace the passed data.
> - `undefined|null|false` - Stops the callback and will use whatever modifications have been made to data.
> ```js
> function (data) {
>     var new = [], old = [], other = [];
>     for (var i = 0; i < data.length; i++) {
>         // Add items flagged as "new" to the correct array.
>         if (data[i].new) {
>             new.push(data[i]);
>         }
>         // Add items flagged as "old" to the correct array.
>         else if (data[i].old) {
>             old.push(data[i]);
>         }
>         // Something out of the ordinary happened, put these last.
>         else {
>             other.push(data[i]);
>         }
>     }
>     // Sort the data according to the order of these arrays.
>     return [].concat(new, old, other).
> }
> ```

***

### options.preserveSelected
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> __Data Attribute:__ `data-abs-preserve-selected="..."`
>
> Preserve selected items(s) between requests. When enabled, they will be
> placed in an `<optgroup>` with the label `Currently Selected`. Disable
> this option if you send your currently selected items along with your
> request and let the server handle this responsibility.

***

### options.preserveSelectedPosition
> __Type:__ `String`
>
> __Default:__ `'after'`
>
> __Data Attribute:__ `data-abs-preserve-selected-position="..."`
>
> Place the currently selected options `'before'` or `'after'` the options
> returned from the request.

***

### options.processData
> __Type:__ `Function|null`
>
> __Default:__ `function(){}`
>
> Process the data returned after this plugin, but before the list is built.

***

### options.requestDelay
> __Type:__ `Number`
>
> __Default:__ `300`
>
> __Data Attribute:__ `data-abs-request-delay="..."`
>
> The amount of time, in milliseconds, that must pass before a request
> is initiated. Each time the [options.bindEvent](#optionsbindevent) is fired, it will cancel the
> current delayed request and start a new one.

***

### options.restoreOnError
> __Type:__ `Boolean`
>
> __Default:__ `false`
>
> __Data Attribute:__ `data-abs-restore-on-error="..."`
>
> Restores the select list with the previous results when the request
> returns with an error.

***

### options.templates
> __Type:__ `Object`
>
> __Data Attribute:__ `data-abs-templates[-*]="..."`
>
> The DOM templates used in this plugin.
> ```js
> templates: {
>     // The placeholder for status updates pertaining to the list and request.
>     status: '<div class="status"></div>',
> }
> ```

***

## Locale Strings

See: [options.locale](#optionslocale)


### locale.currentlySelected
> __Type:__ `String`
>
> __Default:__ `'Currently Selected'`
>
> The text to use for the label of the option group when currently selected options are preserved.

***

### locale.emptyTitle
> __Type:__ `String`
>
> __Default:__ `'Select and begin typing'`
>
> The text to use as the title for the select element when there are no items to display.

***

### locale.errorText
> __Type:__ `String`
>
> __Default:__ `''Unable to retrieve results'`
>
> The text to use in the status container when a request returns with an error.

***

### locale.searchPlaceholder
> __Type:__ `String`
>
> __Default:__ `'Search...'`
>
> The text to use for the search input placeholder attribute.

***

### locale.statusInitialized
> __Type:__ `String`
>
> __Default:__ `'Start typing a search query'`
>
> The text used in the status container when it is initialized.

***

### locale.statusNoResults
> __Type:__ `String`
>
> __Default:__ `'No Results'`
>
> The text used in the status container when the request returns no results.

***

### locale.statusSearching
> __Type:__ `String`
>
> __Default:__ `'Searching...'`
>
> The text to use in the status container when a request is being initiated.

***

### locale.statusTooShort
> __Type:__ `String`
>
> __Default:__ `'Please enter more characters'`
>
> The text used in the status container when the request returns no results.

***



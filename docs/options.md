## Options

#### ~~ajaxResultsPreHook~~
> __Deprecated:__ Since version `1.2.0`, see: [preprocessData](#preprocessdata).
>
> __Type:__ `Function`
>

***

#### ajaxOptions
> __Required__
>
> __Type:__ `Object`
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

#### ~~ajaxSearchUrl~~
> __Deprecated:__ Since version `1.2.0`, see: [ajaxOptions](#ajaxoptions).
>
> __Type:__ `String`
>

***

#### bindEvent
> __Type:__ `String`
>
> __Default:__ `"keyup"`
>
> The event to bind on the search input element to fire a request.

***

#### cache
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> Cache previous requests. If enabled, the "enter" key (13) is enabled to
> allow users to force a refresh of the request.

***

#### clearOnEmpty
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> Clears the previous results when the search input has no value.

***

#### ~~debug~~
> __Deprecated:__ Since version `1.2.0`, see: [log](#log).
>
> __Type:__ `Boolean`
>

***

#### emptyRequest
> __Type:__ `Boolean`
>
> __Default:__ `false`
>
> Invoke a request for empty search values.

***

#### ignoredKeys
> __Type:__ `Object`
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
>     91: "meta",
>     229: "unknown"
> }
> ```

***

#### langCode
> __Type:__ `String`
>
> __Default:__ `null`
>
> The language code to use for string translation. By default this value
> is determined by the browser, however it is not entirely reliable. If
> you encounter inconsistencies, you may need to manually set this option.

***

#### locale
> __Type:__ `Object`
>
> __Default:__ `null`
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

#### log
> __Type:__ `String|Number|Number`
>
> __Default:__ `'error'`
>
> Determines the amount of logging that is displayed:
> - __0, false:__ Display no information from the plugin.
> - __1, 'error':__ Fatal errors that prevent the plugin from working.
> - __2, 'warn':__ Warnings that may impact the display of request data, but does not prevent the plugin from functioning.
> - __3, 'info':__ Provides additional information, generally regarding the from request data and callbacks.
> - __4, true, 'debug':__ Display all possible information. This will likely be highly verbose and is only recommended for development purposes or tracing an error with a request.

***

#### ~~mixWithCurrents~~
> __Deprecated:__ Since version `1.2.0`, see: [preserveSelected](#preserveselected).
>
> __Type:__ `Boolean`
>

***

#### ~~placeHolderOption~~
> __Deprecated:__ Since version `1.2.0`, see: [emptyTitle](#emptytitle).
>

***

#### preprocessData
> __Type:__ `Function|null`
>
> __Default:__ `null`
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

#### preserveSelected
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
> Preserve selected items(s) between requests. When enabled, they will be
> placed in an `<optgroup>` with the label `Currently Selected`. Disable
> this option if you send your currently selected items along with your
> request and let the server handle this responsibility.

***

#### preserveSelectedPosition
> __Type:__ `String`
>
> __Default:__ `'after'`
>
> Place the currently selected options `'before'` or `'after'` the options
> returned from the request.

***

#### processData
> __Type:__ `Function|null`
>
> __Default:__ `null`
>
> Process the data returned after this plugin, but before the list is built.

***

#### requestDelay
> __Type:__ `Number`
>
> __Default:__ `300`
>
> The amount of time, in milliseconds, that must pass before a request
> is initiated. Each time the [bindEvent](#bindevent) is fired, it will cancel the
> current delayed request and start a new one.

***

#### templates
> __Type:__ `Object`
>
> The DOM templates used in this plugin.
> ```js
> templates: {
>     // The template used when a request is being sent.
>     loading: '<div class="menu-loading">Loading...</div>',
>     // The template used when there are no results to display.
>     noResults: '<div class="no-results">No Results</div>'
> }
> ```

***

## Locale Strings


#### currentlySelected
> __Type:__ `String`
>
> __Default:__ `'Currently Selected'`
>
> The text to use for the label of the option group when currently selected options are preserved.

***

#### emptyTitle
> __Type:__ `String`
>
> __Default:__ `'Select and begin typing'`
>
> The text to use as the title for the select element when there are no items to display.

***

#### noResults
> __Type:__ `String`
>
> __Default:__ `'No Results'`
>
> The text used in the status container when the request returns no results.

***

#### searchPlaceholder
> __Type:__ `String`
>
> __Default:__ `'Search...'`
>
> The text to use for the search input placeholder attribute.

***

#### searching
> __Type:__ `String`
>
> __Default:__ `'Searching...'`
>
> The text to use in the status container when a request is being made.

***



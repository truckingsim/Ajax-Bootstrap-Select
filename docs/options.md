#### ~~ajaxResultsPreHook~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [preprocessData](#preprocessdata)
>

***
#### ajaxOptions
> __Required__
>
> The options to pass to the jQuery AJAX request.
>
> __Type:__ `Object`
>
> __Default:__ 
>  ```js
>  {
>      url: null, // Required.
>      type: 'POST',
>      dataType: 'json',
>      data: {
>          q: '{{{q}}}'
>      }
>  }
>  ```
>

***
#### ~~ajaxSearchUrl~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [ajaxOptions](#ajaxoptions)
>

***
#### bindEvent
> The event to bind on the search input element to fire a request.
>
> __Type:__ `String`
>
> __Default:__ `'keyup'`
>
>_Optional_
>

***
#### cache
> Cache previous requests. If enabled, the "enter" key (13) is enabled to allow users to force a refresh of the request.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
>_Optional_
>

***
#### clearOnEmpty
> Clears the previous results when the search input has no value.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
>_Optional_
>

***
#### ~~debug~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [log](#log)
>

***
#### emptyRequest
> Invoke a request for empty search values.
>
> __Type:__ `Boolean`
>
> __Default:__ `false`
>
>_Optional_
>

***
#### ignoredKeys
> Key codes to ignore so a request is not invoked with bindEvent. The "enter" key (13) will always be dynamically added to any list provided unless the "cache" option above is set to "true".
>
> __Type:__ `Object`
>
> __Default:__ 
>  ```js
>  {
>      9: "tab",
>      16: "shift",
>      17: "ctrl",
>      18: "alt",
>      27: "esc",
>      37: "left",
>      39: "right",
>      38: "up",
>      40: "down",
>      91: "meta",
>      229: "unknown"
>  }
>  ```
>
>_Optional_
>

***
#### langCode
> The language code to use for string translation. By default this value is determined by the browser, however it is not entirely reliable. If you encounter inconsistencies, you may need to manually set this option.
>
> __Type:__ `String`
>
> __Default:__ `null`
>
>_Optional_
>

***
#### locale
> Specific overrides for locale translation strings. Any values set here will completely override and ignore any set language code. This is useful for changing only a single value or if being used in a system that provides its own translations (CMS).
>
> __Type:__ `Object`
>
> __Default:__ `null`
>
>_Optional_
>
> __Example usage:__
> 
>  ```js
>  locale: {
>      searchPlaceholder: 'Find...'
>  }
>  ```

***
#### log
> The level at which certain logging is displayed:
>  * __0, false:__ Display no information from the plugin.
>  * __1, 'error':__ Fatal errors that prevent the plugin from working.
>  * __2, 'warn':__ Warnings that may impact the display of request data, but does not prevent the plugin from functioning.
>  * __3, 'info':__ Provides additional information, generally regarding the from request data and callbacks.
>  * __4, true, 'debug':__ Display all possible information. This will likely be highly verbose and is only recommended for development purposes or tracing an error with a request.
>
> __Type:__ `Number|Boolean|String`
>
> __Default:__ `'error'`,
>
>_Optional_
>

***
#### ~~mixWithCurrents~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [preserveSelected](#preserveselected)
>

***
#### ~~placeHolderOption~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [templates](#templates)
>

***
#### preprocessData
> Process the data returned before this plugin.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>
>_Optional_
>

***
#### preserveSelected
> Preserve selected options. There are 3 possible values:
>  * __'auto':__ will automatically determine whether or not this option should be enabled based on if the select element can have "multiple" selections.
>  * __true:__ will always preserve the selected options.
>  * __false:__ will never preserve the selected options.
>
> __Type:__ `String|Boolean`
>
> __Default:__ `'auto'`
>
>_Optional_
>

***
#### processData
> Process the data returned after this plugin, but before the list is built.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>
>_Optional_
>

***
#### requestDelay
> The time, in milliseconds, that must pass before a request is made. Each time the bindEvent is fired, it will reset the currently elapsed time and start a new delay.
>
> __Type:__ `Number`
>
> __Default:__ `300`
>
>_Optional_
>

***
#### templates
> The templates used in this plugin.
>
> __Type:__ `Object`
>
> __Default:__ 
>  ```js
>  templates: {
>      // The template used when a request is being sent.
>      loading: '<div class="menu-loading">Loading...</div>',
>      // The template used when there are no results to display.
>      noResults: '<div class="no-results">No Results</div>'
>  }
>  ```
>

***


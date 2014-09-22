#### ajaxOptions
> The options to pass to the jQuery AJAX request.
>
> __Type:__ `Object`
>
> __Default:__ `{}`
>
> __Example usage:__
> ```js
>  ajaxOptions: {
>      url: "/path/to/server/request", // Required.
>      type: "json",
>      type: "POST"
>      data: {
>          q: "{{{q}}}"
>      }
>  }
>  ```

***
#### bindEvent (optional)
> The event to bind on the search input element to fire a request.
>
> __Type:__ `String`
>
> __Default:__ `'keyup'`
>

***
#### cache (optional)
> Cache previous requests. If enabled, the "enter" key (13) is enabled to allow users to force a refresh of the request.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>

***
#### clearOnEmpty (optional)
> Clears the previous results when the search input has no value.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>

***
#### debug (optional)
> Display helpful console output when a warning or error occurs in the plugin.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>

***
#### emptyRequest (optional)
> Invoke a request for empty search values.
>
> __Type:__ `Boolean`
>
> __Default:__ `false`
>

***
#### ignoredKeys (optional)
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

***
#### preprocessData (optional)
> Process the data returned before this plugin.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>

***
#### preserveSelected (optional)
> Preserve selected options. There are 3 possible values:
>  * __'auto':__ will automatically determine whether or not this option should be enabled based on if the select element can have "multiple" selections.
>  * __true:__ will always preserve the selected options.
>  * __false:__ will never preserve the selected options.
>
> __Type:__ `String|Boolean`
>
> __Default:__ `'auto'`
>

***
#### processData (optional)
> Process the data returned after this plugin, but before the list is built.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>

***
#### searchPlaceholder (optional)
> The placeholder text to use inside the search input.
>
> __Type:__ `String|null`
>
> __Default:__ `'Search...'`
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


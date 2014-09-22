    defaultOptions = {
        /**
         * @name ajaxResultsPreHook
         * @deprecated Since version `1.2.0`.
         * @see {preprocessData}
         */
        ajaxResultsPreHook: null,

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
         * @name ajaxSearchUrl
         * @deprecated Since version `1.2.0`.
         * @see {ajaxOptions}
         */
        ajaxSearchUrl: null,

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
         * @name clearOnEmpty
         * @description Clears the previous results when the search input has no value.
         * @optional
         *
         * @type Boolean
         * @default `true`
         */
        clearOnEmpty: true,

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
         * @name mixWithCurrents
         * @deprecated Since version `1.2.0`.
         * @see {preserveSelected}
         */
        mixWithCurrents: null,

        /**
         * @name placeHolderOption
         * @deprecated Since version `1.2.0`.
         * @see {templates}
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
         * @default `'Search...'`
         */
        searchPlaceholder: 'Search...',

        /**
         * @name templates
         * @description The templates used in this plugin.
         * @type Object
         * @default
         * ```js
         * templates: {
         *     // The template used when a request is being sent.
         *     loading: '<div class="menu-loading">Loading...</div>',
         *
         *     // The template used when there are no results to display.
         *     noResults: '<div class="no-results">No Results</div>'
         * }
         * ```
         */
        templates: {
            loading: '<div class="menu-loading">Loading...</div>',
            noResults: '<div class="no-results">No Results</div>'
        }

    };

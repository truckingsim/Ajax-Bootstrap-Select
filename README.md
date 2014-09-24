# Ajax Bootstrap Select [![GitHub version](https://badge.fury.io/gh/truckingsim%2FAjax-Bootstrap-Select.svg)](http://badge.fury.io/gh/truckingsim%2FAjax-Bootstrap-Select)  [![Build Status](https://travis-ci.org/truckingsim/Ajax-Bootstrap-Select.svg)](https://travis-ci.org/truckingsim/Ajax-Bootstrap-Select) 


> Extends the bootstrap-select plugin so it can use a remote source for searching. Originally for CROSCON.

* [Getting Started](#getting-started)
  * [Requirements](#requirements)
  * [Options](#options)
  * [JSON Results](#json-results)
  * [Usage Example](#usage-example)
* [License](#license)


## Getting Started
This plugin extends existing [Bootstrap Select] implementations by adding the ability to search via AJAX requests as you type.


### Requirements
__Minimum requirements:__
* [Bootstrap Select 1.6.2+]
* A server that can process AJAX requests and send back appropriate JSON data.

[Bootstrap Select] must either be be initialized with `liveSearch` enabled in the passed options or the `select` element must have the `data-live-search="true"` attribute.

This plugin must be initialized __after__ [Bootstrap Select] has been initialized. For a more detailed explanation on implementation, see [usage example](#usage-example).

__Suggested requirements:__
* [Bootstrap 3.2.0+]
* [jQuery 1.9+] - [Bootstrap prerequisite]


### Options
##### ~~ajaxResultsPreHook~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [preprocessData](#preprocessdata)
>

***
##### ajaxOptions
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
##### ~~ajaxSearchUrl~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [ajaxOptions](#ajaxoptions)
>

***
##### bindEvent
> The event to bind on the search input element to fire a request.
>
> __Type:__ `String`
>
> __Default:__ `'keyup'`
>
>_Optional_
>

***
##### cache
> Cache previous requests. If enabled, the "enter" key (13) is enabled to allow users to force a refresh of the request.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
>_Optional_
>

***
##### clearOnEmpty
> Clears the previous results when the search input has no value.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
>_Optional_
>

***
##### ~~debug~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [log](#log)
>

***
##### emptyRequest
> Invoke a request for empty search values.
>
> __Type:__ `Boolean`
>
> __Default:__ `false`
>
>_Optional_
>

***
##### ignoredKeys
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
##### langCode
> The language code to use for string translation. By default this value is determined by the browser, however it is not entirely reliable. If you encounter inconsistencies, you may need to manually set this option.
>
> __Type:__ `String`
>
> __Default:__ `null`
>
>_Optional_
>

***
##### locale
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
##### log
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
##### ~~mixWithCurrents~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [preserveSelected](#preserveselected)
>

***
##### ~~placeHolderOption~~
> __Deprecated:__ Since version `1.2.0`.
>
> __See:__ [templates](#templates)
>

***
##### preprocessData
> Process the data returned before this plugin.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>
>_Optional_
>

***
##### preserveSelected
> Preserve selected items(s) between requests. When enabled, they will be placed in an `<optgroup>` with the label `Currently Selected`. Disable this option if you send your currently selected items along with your request and let the server handle this responsibility.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>
>_Optional_
>

***
##### preserveSelectedPosition
> Place the currently selected options `'before'` or `'after'` the options returned from the request.
>
> __Type:__ `String`
>
> __Default:__ `'after'`
>
>_Optional_
>

***
##### processData
> Process the data returned after this plugin, but before the list is built.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>
>_Optional_
>

***
##### requestDelay
> The time, in milliseconds, that must pass before a request is made. Each time the bindEvent is fired, it will reset the currently elapsed time and start a new delay.
>
> __Type:__ `Number`
>
> __Default:__ `300`
>
>_Optional_
>

***
##### templates
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



### JSON Results
The plugin expects a certain result structure, an array of objects with the objects following a certain structure, below is an example with every option set:

```js
[
	{
		value: 'string', //This is the only required option
		text: 'string', //If this is not set it will use the value for the text

		//data- properties that you would set on the option tag, these will be set on
        //  the newly created options tags when the items are loaded in
		data: {
			//If this is set to true everything else about this option will be ignored.
            //  If this is true, this item will be used as a divider.
			divider: false,  //Boolean true/false
			subtext: 'string',
			icon: 'class-name', //Icon class name ex: icon-glass
			content: 'custom-html'
		},
		disable: false, //Boolean true/false
		class: 'string' //CSS class to apply to the option
	}
	....
]
```


### Usage Example

```js
$('.select-picker')
    .selectpicker({
        liveSearch: true
    })
    .ajaxSelectPicker({
        ajaxSearchUrl: '/path/to/method/to/run',
        ajaxResultsPreHook: function(results){
            var contacts = [];
            if(results.hasOwnProperty('Contacts')){
                var len = results.Contacts.length;
                for(var i = 0; i < len; i++){
                    var curr = results.Contacts[i];
                    contacts.push(
                        {
                            'value': curr.ContactID,
                            'text': curr.FirstName + ' ' + curr.LastName,
                            'data': {
                                'icon': 'icon-person',
                                'subtext': 'Internal'
                            },
                            'disable': false
                        }
                    );
                }
                return contacts;
            } else {
                return [];
            }
        },
        ajaxOptions: {
            data: function(){
                var params = {
                    q: '{{{q}}}'
                };

                if(gModel.selectedGroup().hasOwnProperty('ContactGroupID')){
                    params.GroupID = gModel.selectedGroup().ContactGroupID;
                }

                return params;
            }
        },
        placeHolderOption: 'Click and start typing',
        mixWithCurrents: false
    });
```


***

## License
Copyright (c) 2014 Adam Heim, contributors.  
Released under the MIT license

[Bootstrap 3.2.0+]: http://getbootstrap.com/getting-started/#download
[Bootstrap prerequisite]: http://getbootstrap.com/getting-started/#whats-included
[Bootstrap]: http://getbootstrap.com

[Bootstrap Select 1.6.2+]: https://github.com/silviomoreto/bootstrap-select/releases/tag/v1.6.2
[Bootstrap Select]: https://github.com/silviomoreto/bootstrap-select

[jQuery 1.9+]: http://jquery.com/download/
[jQuery]: http://jquery.com


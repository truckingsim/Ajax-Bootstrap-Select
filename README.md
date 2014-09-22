# Ajax Bootstrap Select [![GitHub version](https://badge.fury.io/gh/truckingsim%2FAjax-Bootstrap-Select.svg)](http://badge.fury.io/gh/truckingsim%2FAjax-Bootstrap-Select)  [![Build Status](https://travis-ci.org/truckingsim/Ajax-Bootstrap-Select.svg)](https://travis-ci.org/truckingsim/Ajax-Bootstrap-Select) 


> Extends the bootstrap-select plugin so it can use a remote source for searching. Originally for CROSCON.

* [Getting Started](#getting-started)
  * [Options](#options)
  * [JSON Results](#json-results)
  * [Usage Examples](#usage-examples)
* [License](#license)


## Getting Started
This plugin extends existing [bootstrap-select](https://github.com/silviomoreto/bootstrap-select) implementations by adding the ability to search via AJAX requests as you type. To get this plugin running ensure the following:

The [bootstrap-select](https://github.com/silviomoreto/bootstrap-select) must be initialized first with the `liveSearch` option enabled before this plugin can be initialized.


### Options
##### ajaxOptions
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
##### bindEvent (optional)
> The event to bind on the search input element to fire a request.
>
> __Type:__ `String`
>
> __Default:__ `'keyup'`
>

***
##### cache (optional)
> Cache previous requests. If enabled, the "enter" key (13) is enabled to allow users to force a refresh of the request.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>

***
##### clearOnEmpty (optional)
> Clears the previous results when the search input has no value.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>

***
##### debug (optional)
> Display helpful console output when a warning or error occurs in the plugin.
>
> __Type:__ `Boolean`
>
> __Default:__ `true`
>

***
##### emptyRequest (optional)
> Invoke a request for empty search values.
>
> __Type:__ `Boolean`
>
> __Default:__ `false`
>

***
##### ignoredKeys (optional)
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
##### loadingTemplate (optional)
> The template used when a request is being sent.
>
> __Type:__ `String|jQuery`
>
> __Default:__ `'<div class="menu-loading">Loading...</div>'`
>

***
##### placeHolderOption (optional)
> String with text to show.
>
> __Type:__ `String`
>
> __Default:__ `null`
>

***
##### preprocessData (optional)
> Process the data returned before this plugin.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>

***
##### preserveSelected (optional)
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
##### processData (optional)
> Process the data returned after this plugin, but before the list is built.
>
> __Type:__ `Function|null`
>
> __Default:__ `null`
>

***
##### searchPlaceholder (optional)
> The placeholder text to use inside the search input.
>
> __Type:__ `String|null`
>
> __Default:__ `null`
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


### Usage Examples

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

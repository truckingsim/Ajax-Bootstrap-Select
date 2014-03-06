Ajax-Bootstrap-Select
=====================

This plugin adds ajax search as you type support to any select box that [bootstrap-select](https://github.com/silviomoreto/bootstrap-select) has instantiated.  Just make sure bootstrap-select runs first and then attach `.ajaxSelectPicker(options)` and it will add ajax support.

## JSON results from ajax request ##

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

##Options##

###ajaxResultPreHook###

A function that is run after the ajax request is made but before the options are built.  If you set this option it will pass a single parameter with the results of the ajax request.  You can do any processing you need to get the json results the plugin expects (example of this above).

* Type: `function`|`null`
* Example: 

```js
function(data){
    var newData = data;
    //do some stuff with the new data
    return newData;
}
```

###ajaxSearchUrl###

A string of the url to send the ajax request

* Type: `string`
* Example: `'/path/to/file/method'`


###ajaxOptions###
For changing the data, dataType, or type parameters in an ajax request:

1\. **dataType**

* Type: `string`
* Values: `xml|json|script|html`

***

2\. **type**

* Type: `string`
* Values: `GET|POST`

*** 

3\. **data**

The data property has 2 special abilities.  First off it can be a function, that returns an object, that will be run each time the ajax request is made.  The second is if any of the values of the object returned are equal to: `{{{q}}}` the plugin will auto replace that with input box value.  The processed object is passed as is to the `data` property in `$.ajax`.

* Type: *Object|Function*
* Object Example: `{q: $('#searchBox').val()}`
* Function Example: 

```js
function(){
    var params = {
        q: '{{{q}}}'
    };
    if(gModel.selectedGroup().hasOwnProperty('ContactGroupID')){
        params.GroupID = gModel.selectedGroup().ContactGroupID;
    }
    return params;
}
```
###placeHolderOption###
If this is set as a string the plugin will add a `data-hidden="true"` field with this value as the text before any other options are added from the ajax request

* Type: `string`
* Example: `'Some string to show instead of the first option'`


##Full example of plugin:

```js
$('.select-picker').ajaxSelectPicker({
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
    placeHolderOption: 'Click and start typing'
});
```

## Copyright and license

Copyright (C) 2014 ajax-bootstrap-select

Licensed under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

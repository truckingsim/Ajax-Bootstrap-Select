
###ajaxResultsPreHook###

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

 or add data-search-url attribute on dom element

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

###debug###
If you want to get error information, set this to true.

* Type: `boolean`
* Values: `true|false`
* Default: `false`

###mixWithCurrents###
If this is set to true the plugin will keep previously selected options in between ajax searches.  This changes the default behavior which resets the selected options with every sort.

* Type: `boolean`
* Values: `true|false`
* Default: `false`

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

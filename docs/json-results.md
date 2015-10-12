The plugin expects a certain result structure, an array of objects with the objects following a certain structure, below is an example with every option set:

```js
[
    {
        value: 'string',    // Required.
        text: 'string',     // If not set, it will use the value as the text.
        class: 'string',    // The CSS class(es) to apply to the option element.
        disabled: false,     // {Boolean} true|false

        // NOTE: If "divider" is present as a property, the entire item is
        // considered a divider and the rest of the item value/data is
        // ignored. Alternatively, this can be set in the data property as well.
        divider: true,

        // Data attributes that you would set on the option tag, these will be
        // set on the newly created options tags and the selectpicker plugin
        // will process them accordingly.
        data: {
            divider: true,
            subtext: 'string',
            icon: 'class-name', // Icon class name ex: icon-glass
            content: '<div class="custom-class">my value label</div>',
        }
    }
    ....
]
```

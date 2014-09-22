
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

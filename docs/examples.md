
```js
$('.select-picker')
    .selectpicker({
        liveSearch: true
    })
    .ajaxSelectPicker({
        ajax: {
            url: '/server/path/to/ajax/results',
            data: function () {
                var params = {
                    q: '{{{q}}}'
                };
                if(gModel.selectedGroup().hasOwnProperty('ContactGroupID')){
                    params.GroupID = gModel.selectedGroup().ContactGroupID;
                }
                return params;
            }
        },
        locale: {
            emptyTitle: 'Search for contact...'
        },
        preprocessData: function(data){
            var contacts = [];
            if(data.hasOwnProperty('Contacts')){
                var len = data.Contacts.length;
                for(var i = 0; i < len; i++){
                    var curr = data.Contacts[i];
                    contacts.push(
                        {
                            'value': curr.ContactID,
                            'text': curr.FirstName + ' ' + curr.LastName,
                            'data': {
                                'icon': 'icon-person',
                                'subtext': 'Internal'
                            },
                            'disabled': false
                        }
                    );
                }
            }
            return contacts;
        },
        preserveSelected: false
    });
```

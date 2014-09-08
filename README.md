Ajax-Bootstrap-Select
===========

A plugin that allows you to set custom local or remote sources for [bootstrap-select][1].
To use this plugin you must have bootstrap-select already loaded.
##Examples:
### Basic Examples:
```js
// This example assumes that the response from server is [{text:"TEXT",value:"VALUE"},{text:"TEXT",value:"VALUE"}]
$("#city").ajaxSelectPicker({
    url:"/ajax/city"
});
$("#city2").ajaxSelectPicker({
    url:"/ajax/city",
    placeholder:"Select a city"
});
```
### Basic Post Examples:
```js
// These example assumes the same as first one
$("#city").ajaxSelectPicker({
    url:"/ajax/city",
    ajaxOptions:{
        type:"POST"
    }
});
$("#city").ajaxSelectPicker({
    url:"/ajax/city",
    ajaxOptions:{
        type:"POST",
        data: function(term){
            return 'q='+term; // equals to `return {q:term}`
        }
    }
});
```
### Custom Result Processing Examples:
```js
// This example assumes that the respones from server is {status:0,results:[{text:"TEXT",value:"VALUE"},{text:"TEXT",value:"VALUE"]}
$("#city").ajaxSelectPicker({
    url:"/ajax/city",
    ajaxOptions:{
        type:"POST",
        dataType: "json"
    },
    preReults:function(data){
        return data.results;
    }
});

// This example assumes that the response from server is {status:0,emails:[{name:"User1",email:"user1@example.com"},{name:"User2",email:"user2@example.com"]}
$("#city").ajaxSelectPicker({
    url:"/ajax/city",
    preResult:function(data){
        var toReturn = [];
        $.each(data.emails,function(index,value){
            toReturn.push({
                text: value.name,
                value: value.email
            });
        });
        data = undefined; // Make stuff easy for garbage collector
        return toReturn;
    }
});
```
### Custom Source Examples:
```js
//Note: that preResult will not be fired on CustomSources, You'll have to call it yourself
//Note: If you use a custom source, you'll have to sort the results yourself, at the moment, there's no implimentation of it.
var names = [{text:"First Name",value:"fname"},{text:"Last Name",value:"lname"}];
$("#city").ajaxSelectPicker({
    source:function(data,success_callback,error_callback){
        success_callback(names);
    }
});
$("#city").ajaxSelectPicker({
    url: "/ajax",
    source:function(data,success_callback,error_callback){
        $.post(data.url,'q='+data.q,success_callback,'json').fail(error_callback);
    }
});
$("#city").ajaxSelectPicker({
    url:"/ajax",
    source:function(data,success_callback,error_callback){
        $.post('/ajax/autocomplete','term='+data.q,function(data){
            if(data.status == 1){
                success_callback(data.results);
            } else {
                error_callback();
            }
        },'json').fail(error_callback);
    }
});
```

[1]:https://github.com/silviomoreto/bootstrap-select
[2]:https://github.com/truckingsim/Ajax-Bootstrap-Select

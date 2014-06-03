/*!
 * ajax-bootstrap-select v1.0 
 * https://github.com/truckingsim/Ajax-Bootstrap-Select
 *
 * @author Adam Heim originally for CROSCON
 * @copyright 2014 ajax-bootstrap-select
 * @license Licensed under the MIT license
 * @version 1.0
 */

!(function($, window){
    $.ajaxSelectPicker = function(element, options){
        var defaults = {
            ajaxResultsPreHook: null,  //If you need to parse the data you receive from server so the selectpicker can handle it here is where it happens
            ajaxSearchUrl: null,
            ajaxOptions: {},  //if you want to change the dataType, data, or request type set it here. default  [json, {q: searchBoxVal}, POST],
            placeHolderOption: null // string with text to show
        };

        var plugin = this,
            $element = $(element);

        var selectPickerFunctions = {
            destroyLi: function(){
                this.$menu.find('li').remove();
            }
        };

        $.extend(plugin, selectPickerFunctions);

        plugin.ajaxOptions = $.extend(defaults, options, {});

        plugin.init = function(){
            if(!$element.data().hasOwnProperty('selectpicker')){
                console.error('ajaxSelectPicker: Cannot attach ajax without selectpicker being run first!');
            } else if(plugin.ajaxOptions.ajaxSearchUrl == null){
                console.error('ajaxSelectPicker: ajaxSearchUrl must be set!')
            } else {
                var timeout = 0;  // store timeout id
                $.extend(plugin, $element.data().selectpicker);  //Get the current selectpicker values
                plugin.$searchbox.off('input');  // remove default selectpicker keypresses
                plugin.$searchbox.on('keydown', function(){
                    clearTimeout(timeout);
                    timeout = setTimeout(function(){
                        //Old options
                        var oldOptions = $element.html();

                        //Remove options
                        $element.find('options').remove();

                        //Destroy options currently there
                        plugin.destroyLi();

                        //show loading message
                        plugin.$menu.append('<div class="menu-loading">loading...</div>');

                        var ajaxParams = {};
                        ajaxParams.url = plugin.ajaxOptions.ajaxSearchUrl;

                        //Success function, this builds the options to put in the select
                        ajaxParams.success = function(data){
                            if(typeof plugin.ajaxOptions.ajaxResultsPreHook === 'function'){
                                data = plugin.ajaxOptions.ajaxResultsPreHook(data);
                            }
                            //When we build the options we will be able to build any data properties that select picker takes.
                            if(Array.isArray(data)){
                                var options = '', dataLen = data.length;
                                if(data.length){
                                    if(typeof plugin.ajaxOptions.placeHolderOption === 'string'){
                                        options += '<option data-hidden="true">' + plugin.ajaxOptions.placeHolderOption + '</option>';
                                    }

                                    for(var i = 0; i < dataLen; i++){
                                        var currentData = data[i];
                                        var hasData = currentData.hasOwnProperty('data');
                                        if(!currentData.hasOwnProperty('value') && (currentData.hasOwnProperty('data') && currentData.data.hasOwnProperty('divider'))){
                                            console.error('currentData must have a property of value');
                                            break;
                                        }
                                        if(hasData && currentData.data.divider){
                                            options += ' data-divider="true"></option>';
                                            break;
                                        }
                                        options += '<option';
                                        if(currentData.hasOwnProperty('disable') && currentData.disable){
                                            options += ' disabled="disabled"';
                                        }
                                        if(currentData.hasOwnProperty('class')){
                                            options += ' class="' + currentData.class + '"';
                                        }
                                        if(hasData){
                                            if(currentData.data.hasOwnProperty('subtext')){
                                                options += ' data-subtext="' + currentData.data.subtext + '"';
                                            }
                                            if(currentData.data.hasOwnProperty('icon')){
                                                options += ' data-icon="' + currentData.data.icon + '"';
                                            }
                                            if(currentData.data.hasOwnProperty('content')){
                                                options += ' data-content="' + currentData.data.content + '"';
                                            }
                                        }
                                        options += ' value="' + currentData.value + '">';
                                        if(currentData.hasOwnProperty('text')){
                                            options += currentData.text + '</option>';
                                        } else {
                                            options += currentData.value + '</option>';
                                        }
                                    }
                                }
                                plugin.$element.html(options);
                            } else {
                                plugin.$element.html(oldOptions);
                            }
                        };

                        //If there is an error be sure to put in the previous options
                        ajaxParams.error = function(xhr){
                            console.error('ajaxSelectPicker:', xhr);
                            plugin.$element.html(oldOptions);
                        };

                        //Always refresh the list and remove the loading menu
                        ajaxParams.complete = function(){
                            $('.menu-loading').remove();
                            plugin.refresh();
                        };

                        var userParams = $.extend(true, {}, plugin.ajaxOptions.ajaxOptions);

                        ajaxParams.dataType = userParams.hasOwnProperty('dataType') ? userParams.dataType : 'json';
                        ajaxParams.type = userParams.hasOwnProperty('type') ? userParams.type : 'POST';

                        if(userParams.hasOwnProperty('data')){
                            userParams.processedData = userParams.data;
                            if(typeof userParams.data === 'function'){
                                userParams.processedData = userParams.data();
                            }
                            ajaxParams.data = userParams.processedData;
                        } else {
                            userParams.data = {'q': plugin.$searchbox.val()};
                        }


                        var inputVal = plugin.$searchbox.val();
                        if(Object.keys(ajaxParams.data).length){
                            for(var dataKey in ajaxParams.data){
                                if(ajaxParams.data.hasOwnProperty(dataKey)){
                                    //use {{{q}}} to mark you want the input val
                                    if(ajaxParams.data[dataKey] === '{{{q}}}'){
                                        //Replace {{{q}}} with the input val
                                        ajaxParams.data[dataKey] = inputVal;
                                    }
                                }
                            }
                        }

                        $.ajax(ajaxParams);
                    }, 300);
                });
            }
        };

        //We need for selectpicker to be attached first.  Putting the init in a setTimeout is the easiest way to ensure this.
        setTimeout(function(){
            plugin.init();
        }, 500);
    };

    $.fn.ajaxSelectPicker = function(options){
        return this.each(function() {
            if($(this).data('ajaxSelectPicker') == undefined){
                $(this).data('ajaxSelectPicker', new $.ajaxSelectPicker(this, options));
            }
        });
    }
})(jQuery, window);


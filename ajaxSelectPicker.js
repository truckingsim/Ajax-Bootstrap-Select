/*!
 * ajax-bootstrap-select v1.0.6
 * https://github.com/truckingsim/Ajax-Bootstrap-Select
 *
 * @author Adam Heim originally for CROSCON
 * @copyright 2014 ajax-bootstrap-select
 * @license Licensed under the MIT license
 * @version 1.1.0
 */

!(function($){
    $.ajaxSelectPicker = function(element,option){
        // These are the keys we want to do nothing about (the names in front are just to make them key:value style)
        var keyCodes = {
                9: "tab",
                13: "enter",
                16: "shift",
                17: "ctrl",
                18: "alt",
                27: "esc",
                37: "left",
                39: "right",
                38: "up",
                40: "down",
                229:"unknown"
            },
            defaults = {
                // Basic Stuff
                url: null,
                placeholder: null,
                inputWait:400, // Wait for more input in mili-seconds

                // Hooks
                source: function(data,callback_success,callback_error){
                    if(data.url == null)
                        return plugin.log("You must provide a valid url option",true);
                    $.ajax({
                        url:data.url,
                        type:data.ajaxOptions.type,
                        data:data.ajaxOptions.data(data.q),
                        dataType:data.ajaxOptions.dataType,
                        success:function(response){
                            if(typeof data.preResults == 'function'){
                                response = data.preResults(response);
                            }
                            callback_success(response);
                        }
                    }).fail(callback_error);
                }, // Custom Source Callback
                preResults:null,
                ajaxOptions:{
                    type:'GET',
                    data:function(term){
                        return {q:term};
                    },
                    dataType:'json'
                },

                // Extra
                debug: false
            },
            plugin = this,
            options = $.extend({},defaults,option),
            $element = $(element),
            timeout, // To be used in plugin.init to make sure that the user has typed the stuff completely
            cleanup = function(){
                plugin.$menu.find('li').remove();
                $element.children().remove();
            };

        if(typeof option.ajaxOptions != 'undefined')
            options.ajaxOptions = $.extend({},defaults.ajaxOptions,option.ajaxOptions);

        plugin.init = function(){
            if($element.attr('data-search-url'))
                options.url = $element.attr('data-search-url');
            if(!$element.data().hasOwnProperty('selectpicker'))
                $element.selectpicker();
            if(typeof options.source != 'function')
                return plugin.log("The callback provided is invalid");
            $.extend(plugin,$element.data().selectpicker); // Copy the select picker plugin into self
            // plugin.$searchbox comes from the main plugin
            plugin.$searchbox.off('input'); // Remove the existing binding
            plugin.$searchbox.on('keydown',function(e){
                if(typeof keyCodes[e.keyCode] == 'undefined')return true;
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    cleanup();
                    plugin.$menu.find('ul').append('<li class="disabled"><a style="cursor:default;"><span class="text">Loading</span></a></li>');
                    plugin.provide_suggestions();
                },defaults.inputWait);
            });
        };
        plugin.handle_triggers = function(option,$element){
            if(option == 'refresh') {
                console.log('refreshing');
                plugin.refresh();
                return $element;
            } else if(option === 'val'){
                return $element.val();
            } else {
                plugin.log("Invalid Option Provided",true);
            }
        };
        plugin.processing_error = function(){
            cleanup();
            plugin.$menu.find('ul').append('<li class="disabled"><a style="cursor:default;"><span class="text">Error Loading Data :-(</span></a></li>');
            plugin.refresh();
            return false;
        };
        plugin.provide_suggestions = function(){
            // Options([data],[success callback],[error callback]);
            options.source({
                url: options.url,
                ajaxOptions: options.ajaxOptions,
                q: plugin.$searchbox.val(),
                preResults:options.preResults
            },function(data){
                plugin.$menu.find('.menu-loading').remove();
                var toWrite = '';
                if(options.placeholder != null)
                    toWrite += '<option data-hidden="true">'+options.placeholder+'</option>';

                $.each(data,function(index,value){
                    toWrite += '<option';

                    if(typeof value.icon != 'undefined')
                        toWrite += ' data-icon="'+value.icon+'"';
                    if(typeof value.class != 'undefined')
                        toWrite += ' class="'+value.class+'"';
                    if(typeof value.subtext != 'undefined')
                        toWrite += ' data-subtext="'+value.subtext+'"';
                    if(typeof value.content != 'undefined')
                        toWrite += ' data-content="'+value.content+'"';
                    if(typeof value.disable != 'undefined')
                        toWrite += ' disabled="disabled"';

                    toWrite += ' value="'+value.value+'">';
                    toWrite += (typeof value.text == 'undefined' ? value.value : value.text);

                    toWrite += '</option>';
                });
                plugin.$element.html(toWrite);
                toWrite = undefined; // Allow garbage cleaner to free the memory
                plugin.refresh();
            },plugin.processing_error);
        };
        plugin.log = function(text,force){
            if(typeof force == 'undefined')force=false;
            if(options.debug || force)console.log(text);
            return false;
        };
        setTimeout(function(){
            plugin.init(); // To ensure the balance of earth
        },500);
    };
    $.fn.ajaxSelectPicker = function(options){
        if(typeof options != 'object'){
            var toReturn;
            if(this.length == 1){
                this.each(function(){
                    toReturn = $(this).data('ajaxSelectPicker').handle_triggers(options,$(this));
                });
                return toReturn;
            } else {
                toReturn = [];
                this.each(function(){
                    toReturn.push($(this).data('ajaxSelectPicker').handle_triggers(options,$(this)));
                });
                return toReturn;
            }
        } else {
            return this.each(function() {
                if($(this).data('ajaxSelectPicker') == undefined){
                    $(this).data('ajaxSelectPicker', new $.SteelSelect(this, options));
                }
            });
        }
    }
})(jQuery);

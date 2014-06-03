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
    	var specialKeyCodeMap = {
	        9: "tab",
	        16: "shift",
	        17: "ctrl",
	        18: "alt",
	        27: "esc",
	        37: "left",
	        39: "right",
	        13: "enter",
	        38: "up",
	        40: "down"
	    };
    
    	var defaults = {
            ajaxResultsPreHook: null,  //If you need to parse the data you receive from server so the selectpicker can handle it here is where it happens
            ajaxSearchUrl: null,
            ajaxOptions: {},  //if you want to change the dataType, data, or request type set it here. default  [json, {q: searchBoxVal}, POST],
            placeHolderOption: null, // string with text to show
            placeHolderNoResults: null,
            loadingString: 'Loading...'
        };

        var plugin = this,
            $element = $(element);

        var selectPickerFunctions = {
//            destroyLi: function(){
//                this.$menu.find('li').remove();
//            }
        };
        
        plugin.isMsie = function() {
            return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
        }
        
        var timeout = 0,  // store timeout id
        	activeAjaxQuery = 0;
        	activeAjaxQueryText = "";
        
        plugin.onInput = function(){
        	clearTimeout(timeout);
            timeout = setTimeout(function(){
            	if (activeAjaxQueryText == plugin.$searchbox.val())
            		return;
            	
            	activeAjaxQuery = timeout;
            	activeAjaxQueryText = plugin.$searchbox.val();
            	var actualTimeout = timeout;
            	
            	//Old options
                var oldOptions = $element.html();

                var $selected = $.extend(true, {}, $element.find('option:selected'));
                
                //Remove options
                $element.find('options').remove();
                
                //Destroy options currently there
                plugin.destroyLi();

                plugin.$menu.find('.menu-noResults').remove();
                //show loading message
                if (plugin.$menu.find('.menu-loading').size() == 0)
                	plugin.$menu.append('<div class="ajaxSelectPicker-menu-el menu-loading">'+plugin.ajaxOptions.loadingString+'</div>');

                var ajaxParams = {};
                ajaxParams.url = plugin.ajaxOptions.ajaxSearchUrl;

                //Success function, this builds the options to put in the select
                ajaxParams.success = function(data){
                	if (activeAjaxQuery != actualTimeout)
                		return;
                	
                	if(typeof plugin.ajaxOptions.ajaxResultsPreHook === 'function'){
                        data = plugin.ajaxOptions.ajaxResultsPreHook(data);
                    }
                    //When we build the options we will be able to build any data properties that select picker takes.
                    if($.isArray(data)){
                        var options = '', dataLen = data.length, elementFound = false;
                        if(data.length){
                        	if ($selected.size() == 0 && typeof plugin.ajaxOptions.placeHolderOption === 'string'){
                                options += '<option data-hidden="true">' + plugin.ajaxOptions.placeHolderOption + '</option>';
                            }
                        	
                        	$selected.each(function(){
                        		var found = false;
                        		for(var i = 0; i < dataLen; i++){
                                    var currentData = data[i];
                                    if (currentData.value == $(this).val()){
                                    	found = true;
                                    	break;
                                    }
                        		}
                        		options += '<option selected="selected"'+(found ? '' : ' data-hidden="true"')+' value="'+$(this).val()+'">'+$(this).html()+'</option>';
                        		$(this).elementFound = found;
                            });

                            for(var i = 0; i < dataLen; i++){
                            	var currentData = data[i];

                            	var found = false;
                            	$selected.each(function(){
                                	if (currentData.value == $(this).val()){
                                		found = true;
                                	}
                                });
                            	if (found)
                            		continue;
                            	
                                var hasData = currentData.hasOwnProperty(data);
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
                                    options += ' class="' + currentData['class'] + '"';
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
                        } else {
                        	if (typeof plugin.ajaxOptions.placeHolderNoResults === 'string'){
                        		plugin.$menu.append('<div class="ajaxSelectPicker-menu-el menu-noResults">'+plugin.ajaxOptions.placeHolderNoResults+'</div>');
                        	}
                        	
                        	$selected.each(function(){
                            	options += '<option selected="selected" data-hidden="true" value="'+$(this).val()+'">'+$(this).html()+'</option>';
                            });
                        }
                        
                        plugin.$element.html(options);
                    } else {
                        plugin.$element.html(oldOptions);
                    }
                    plugin.$menu.data('this').refresh();
                };

                //If there is an error be sure to put in the previous options
                ajaxParams.error = function(xhr){
                	if (activeAjaxQuery != actualTimeout)
                		return;
                	console.error('ajaxSelectPicker:', xhr);
                    plugin.$element.html(oldOptions);
                    plugin.$menu.data('this').refresh();
                };

                //Always refresh the list and remove the loading menu
                ajaxParams.complete = function(){
                	if (activeAjaxQuery == actualTimeout)
                		plugin.$menu.find('.menu-loading').remove();
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
                for(var dataKey in ajaxParams.data){
                    if(ajaxParams.data.hasOwnProperty(dataKey)){
                        //use {{{q}}} to mark you want the input val
                        if(ajaxParams.data[dataKey] === '{{{q}}}'){
                            //Replace {{{q}}} with the input val
                            ajaxParams.data[dataKey] = inputVal;
                        }
                    }
                }

                $.ajax(ajaxParams);
            }, 300);
        }

        $.extend(plugin, selectPickerFunctions);

        plugin.ajaxOptions = $.extend(defaults, options, {});

        plugin.init = function(){
        	if(!$element.data().hasOwnProperty('selectpicker')){
                console.error('ajaxSelectPicker: Cannot attach ajax without selectpicker being run first!');
            } else if(plugin.ajaxOptions.ajaxSearchUrl == null){
                console.error('ajaxSelectPicker: ajaxSearchUrl must be set!');
            } else {
                $.extend(plugin, $element.data().selectpicker);  //Get the current selectpicker values
                
                plugin.$searchbox.off('input');  // remove default selectpicker keypresses
                
                if (!plugin.isMsie()) {
                	plugin.$searchbox.on('input.ajaxSP', plugin.onInput);
                } else {
                	plugin.$searchbox.on("keydown.ajaxSP keypress.ajaxSP cut.ajaxSP paste.ajaxSP", function($e) {
                        if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                            return;
                        }
                        plugin.onInput();
                    });
                }
            }

        	plugin.$newElement.on('click.dropdown.data-api', function() {
            	var $selected = $element.find('option:selected');
       
            	var options = "";
            	if ($selected.size() > 0){
                	$selected.each(function(){
                		options += '<option data-hidden="true" selected="selected" value="'+$(this).val()+'">'+$(this).html()+'</option>';
                	});
                	
                } else if (typeof plugin.ajaxOptions.placeHolderOption === 'string'){
                	options = '<option data-hidden="true">' + plugin.ajaxOptions.placeHolderOption + '</option>';
                }
            	$element.html(options);
            	
            	plugin.$searchbox.val('');
                plugin.$menu.data('this').refresh();
            });
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
    };
})(jQuery, window);


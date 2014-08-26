/*!
 * ajax-bootstrap-select v1.0.6
 * https://github.com/truckingsim/Ajax-Bootstrap-Select
 *
 * @author Adam Heim originally for CROSCON
 * @copyright 2014 ajax-bootstrap-select
 * @license Licensed under the MIT license
 * @version 1.0.6
 */

!(function ($, window) {
    $.ajaxSelectPicker = function (element, options) {
        var specialKeyCodeMap = {
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down",
            229: "unknown"  //Returned if it can't get the virtual key number per w3 spec: http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
        };

        var defaults = {
            ajaxResultsPreHook: null,  //If you need to parse the data you receive from server so the selectpicker can handle it here is where it happens
            ajaxSearchUrl: null,
            ajaxOptions: {},  //if you want to change the dataType, data, or request type set it here. default  [json, {q: searchBoxVal}, POST],
            placeHolderOption: null, // string with text to show
            debug: false, //If you want console output, set this to true
            mixWithCurrents: false // If you want to mix results with currently selected results to avoid losing them
        };

        var plugin = this,
            $element = $(element);

        var selectPickerFunctions = {
            destroyLi: function () {
                this.$menu.find('li').remove();
            }
        };

        $.extend(plugin, selectPickerFunctions);

        plugin.ajaxOptions = $.extend(defaults, options, {});

        plugin.init = function () {
            if ($element.attr("data-search-url")) {
                plugin.ajaxOptions.ajaxSearchUrl = $element.attr("data-search-url");
            }

            if (!$element.data().hasOwnProperty('selectpicker')) {
                this.log('ajaxSelectPicker: Cannot attach ajax without selectpicker being run first!', true);
            } else if (plugin.ajaxOptions.ajaxSearchUrl == null) {
                this.log('ajaxSelectPicker: ajaxSearchUrl must be set!', true)
            } else {
                var timeout = 0;  // store timeout id
                $.extend(plugin, $element.data().selectpicker);  //Get the current selectpicker values
                plugin.$searchbox.off('input');  // remove default selectpicker keypresses
                plugin.$searchbox.on('keydown', function (e) {

                    if (specialKeyCodeMap[e.keyCode]) {
                        return true;
                    }

                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        //Old options
                        var oldOptions = $element.html(), currentOptions = [];

                        if (plugin.ajaxOptions.mixWithCurrents == true) {
                            $(element).find("option:selected").each(function(){
                                currentOptions.push({
                                    value: $(this).val(),
                                    text: $(this).text(),
                                    html: this
                                })
                            });
                        }

                        //Remove options
                        $element.find('options').remove();

                        //Destroy options currently there
                        plugin.destroyLi();

                        //show loading message
                        plugin.$menu.append('<div class="menu-loading">loading...</div>');

                        var ajaxParams = {};
                        ajaxParams.url = plugin.ajaxOptions.ajaxSearchUrl;

                        //Success function, this builds the options to put in the select
                        ajaxParams.success = function (data) {
                            if (typeof plugin.ajaxOptions.ajaxResultsPreHook === 'function') {
                                data = plugin.ajaxOptions.ajaxResultsPreHook(data);
                            }
                            //When we build the options we will be able to build any data properties that select picker takes.
                            if (Array.isArray(data)) {
                                var options = '', dataLen = data.length;
                                if (data.length) {
                                    if (typeof plugin.ajaxOptions.placeHolderOption === 'string') {
                                        options += '<option data-hidden="true">' + plugin.ajaxOptions.placeHolderOption + '</option>';
                                    }

                                    // Store a key (value), value (text) object of each option returned for easy
                                    //    comparison when adding back currently selected options
                                    var optionsObject = {};
                                    for (var i = 0; i < dataLen; i++) {
                                        var currentData = data[i];
                                        var hasData = currentData.hasOwnProperty('data');
                                        if (!currentData.hasOwnProperty('value') && (currentData.hasOwnProperty('data') && currentData.data.hasOwnProperty('divider'))) {
                                            this.log('currentData must have a property of value', true);
                                            break;
                                        }
                                        if (hasData && currentData.data.divider) {
                                            options += ' data-divider="true"></option>';
                                            break;
                                        }
                                        options += '<option';
                                        if (currentData.hasOwnProperty('disable') && currentData.disable) {
                                            options += ' disabled="disabled"';
                                        }
                                        if (currentData.hasOwnProperty('class')) {
                                            options += ' class="' + currentData.class + '"';
                                        }
                                        if (hasData) {
                                            if (currentData.data.hasOwnProperty('subtext')) {
                                                options += ' data-subtext="' + currentData.data.subtext + '"';
                                            }
                                            if (currentData.data.hasOwnProperty('icon')) {
                                                options += ' data-icon="' + currentData.data.icon + '"';
                                            }
                                            if (currentData.data.hasOwnProperty('content')) {
                                                options += ' data-content="' + currentData.data.content + '"';
                                            }
                                        }
                                        options += ' value="' + currentData.value + '">';
                                        if (currentData.hasOwnProperty('text')) {
                                            options += currentData.text + '</option>';

                                            // Add to optionsObject
                                            optionsObject[currentData.value] = currentData.text;
                                        } else {
                                            options += currentData.value + '</option>';

                                            // Add to optionsObject
                                            optionsObject[currentData.value] = currentData.value;
                                        }
                                    }
                                }

                                plugin.$element.html(options);

                                options = '';
                                // mixWithCurrents merge into options
                                if (plugin.ajaxOptions.mixWithCurrents == true && currentOptions.length) {
                                    $.each(currentOptions, function (i, e) {
                                        if(!optionsObject[e.value] || optionsObject[e.value] !== e.text){
                                            options += e.html.outerHTML.replace(/\>/, ' selected="selected">');
                                        } else {
                                            plugin.$element.find('option[value="' + e.value + '"]').attr('selected', 'selected');
                                        }
                                    });
                                }
                                plugin.$element.append(options);
                            } else {
                                plugin.$element.html(oldOptions);
                            }
                        };

                        //If there is an error be sure to put in the previous options
                        ajaxParams.error = function (xhr) {
                            plugin.log(['ajaxSelectPicker:', xhr], true);
                            plugin.$element.html(oldOptions);
                        };

                        //Always refresh the list and remove the loading menu
                        ajaxParams.complete = function () {
                            $('.menu-loading').remove();
                            plugin.$element.selectpicker('refresh');
                        };

                        var userParams = $.extend(true, {}, plugin.ajaxOptions.ajaxOptions);

                        ajaxParams.dataType = userParams.hasOwnProperty('dataType') ? userParams.dataType : 'json';
                        ajaxParams.type = userParams.hasOwnProperty('type') ? userParams.type : 'POST';

                        if (userParams.hasOwnProperty('data')) {
                            userParams.processedData = userParams.data;
                            if (typeof userParams.data === 'function') {
                                userParams.processedData = userParams.data();
                            }
                            ajaxParams.data = userParams.processedData;
                        } else {
                            userParams.data = {'q': plugin.$searchbox.val()};
                        }


                        var inputVal = plugin.$searchbox.val();
                        if (Object.keys(ajaxParams.data).length) {
                            for (var dataKey in ajaxParams.data) {
                                if (ajaxParams.data.hasOwnProperty(dataKey)) {
                                    //use {{{q}}} to mark you want the input val
                                    if (ajaxParams.data[dataKey] === '{{{q}}}') {
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

        /**
         * Wrapper function for console.log / console.error
         * @param  {mixed} message The contents to log.
         * @param  {boolean} error Whether to use console.error or not.
         * @return {void}
         */
        plugin.log = function (message, error) {
            message = message instanceof Array ? message : [message];
            window.console && this.ajaxOptions.debug && (error ? console.error : console.log).apply(console, message);
        };

        //We need for selectpicker to be attached first.  Putting the init in a setTimeout is the easiest way to ensure this.
        setTimeout(function () {
            plugin.init();
        }, 500);
    };

    $.fn.ajaxSelectPicker = function (options) {
        return this.each(function () {
            if ($(this).data('ajaxSelectPicker') == undefined) {
                $(this).data('ajaxSelectPicker', new $.ajaxSelectPicker(this, options));
            }
        });
    }
})(jQuery, window);

<?php
$file_contents = file_get_contents('../dataset.json');

if(!$file_contents){
	throw new Exception('Invalid file name');
}

$data = json_decode($file_contents, true);
?>

<!doctype html>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title></title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.css"/>
	<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.5.4/bootstrap-select.css"/>
    <style>h3 { text-align: center; } .bootstrap-select { width: 100% !important; }</style>
</head>
<body>
<div class="container">
	<div class="row">
		<div class="col-xs-4">
			<h3>Without<br>Ajax-Bootstrap-Select</h3>
			<select id="selectpicker" class="selectpicker" data-live-search="true">
				<?php
				foreach($data as $d){
					echo '<option value="' . $d['Email'] . '">' . $d['Name'] . '</option>';
				}

				?>
			</select>
		</div>

		<div class="col-xs-4">
			<h3>With<br>Ajax-Bootstrap-Select</h3>
			<select id="ajax-select" class="selectpicker" data-live-search="true">
				<option value="" data-hidden="true">Select and Begin Typing</option>
			</select>
		</div>

        <div class="col-xs-4">
            <h3>Multiple<br>Ajax-Bootstrap-Select</h3>
            <select id="ajax-select-multiple" class="selectpicker" multiple data-live-search="true">
                <option value="" data-hidden="true">Select and Begin Typing</option>
            </select>
        </div>
	</div>
</div>


<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.js"></script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.js"></script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.5.4/bootstrap-select.js"></script>
<script type="text/javascript" src="../../ajaxSelectPicker.js"></script>
<script>
    var commenSettings = {
        ajaxResultsPreHook: function(data){
            var arr = [];
            if(data.length){
                for(var i = 0; i < data.length; i++){
                    arr.push({
                        text: data[i].Name,
                        value: data[i].Email
                    });
                }
            }

            return arr;
        },
        ajaxSearchUrl: 'ajax.php',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json',
            data: {
                q: '{{{q}}}' //We use {{{q}}} as a placeholder to specific I want the value from the textbox used
            }
        },
        placeHolderOption: 'Select and Begin Typing'
    };

	$('.selectpicker').selectpicker();
	$('#ajax-select').ajaxSelectPicker(commenSettings);

    var multipleSettings = $.extend({}, commenSettings, {mixWithCurrents: true});
    $('#ajax-select-multiple').ajaxSelectPicker(multipleSettings)
</script>
</body>
</html>
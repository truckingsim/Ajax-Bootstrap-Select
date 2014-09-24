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
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/css/bootstrap.min.css"/>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.6.2/css/bootstrap-select.min.css"/>
    <link rel="stylesheet" href="../../dist/css/ajax-bootstrap-select.css"/>
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
			<select id="ajax-select" class="selectpicker with-ajax" data-live-search="true"></select>
		</div>

        <div class="col-xs-4">
            <h3>Multiple<br>Ajax-Bootstrap-Select</h3>
            <select id="ajax-select-multiple" class="selectpicker with-ajax" multiple data-live-search="true"></select>
        </div>
	</div>
</div>


<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.6.2/js/bootstrap-select.min.js"></script>
<script type="text/javascript" src="../../dist/js/ajax-bootstrap-select.js"></script>
<script>
    var options = {
        ajaxOptions: {
            url: 'ajax.php',
            type: 'POST',
            dataType: 'json',
            // Use "{{{q}}}" as a placeholder and Ajax Bootstrap Select will
            // automatically replace it with the value of the search query.
            data: {
                q: '{{{q}}}'
            }
        },
        log: 3,
        preprocessData: function (data) {
            var i, l = data.length, array = [];
            if (l) {
                for(i = 0; i < l; i++){
                    array.push($.extend(true, data[i], {
                        text: data[i].Name,
                        value: data[i].Email,
                        data: {
                            subtext: data[i].Email
                        }
                    }));
                }
            }
            // You must always return a valid array when processing data. The
            // data argument passed is a clone and cannot be modified directly.
            return array;
        },
        placeHolderOption: 'Select and Begin Typing'
    };

	$('.selectpicker').selectpicker().filter('.with-ajax').ajaxSelectPicker(options);
</script>
</body>
</html>

<?php

/**
 * You would replace this area with say a database call or your own information.
 *   This is only for getting information to work with.
 *
 * dataset.json data gotten from generatedata.com
 */
$file_contents = file_get_contents('../dataset.json');

if(!$file_contents){
	throw new Exception('Invalid file name');
}

$json = json_decode($file_contents, true);

/**
 * End information getting begin actual work code
 */

$q = $_POST['q']; //This is the textbox value


/**
 * This would be replaced with say a WHERE call in a SQL statement or your own array filtering.
 */
$filtered = $json;
if(strlen($q)) {
	$filtered = array_filter($json, function ($val) use ($q) {
		if (stripos($val['Name'], $q) !== false) {
			return true;
		} else {
			return false;
		}

		//Could be shortened to the line below, broken out above to show what it is doing:
		//return strpos($val['Name'], $q) !== false;
	});
}

//Return the data, as you can see it is not formatted, we will do that on the frontend in ajaxResultsPreHook
//  You can however if you want format the data returned here and leave out ajaxResultsPreHook.  It is an optional parameter
echo json_encode(array_slice(array_values($filtered), 0, 20));
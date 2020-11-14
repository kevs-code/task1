<?php

	$executionStartTime = microtime(true) / 1000;
	if ($_REQUEST['name'] == 'countryInfo') {
	$url='http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $_REQUEST['country'] . '&username=demo&style=full';
	}

	if ($_REQUEST['name'] == 'cities' || $_REQUEST['name'] == 'earthquakes') {
	$url='http://api.geonames.org/' . $_REQUEST['name'] . 'JSON?formatted=true&north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&username=demo&style=full';
	}

	if ($_REQUEST['name'] == 'findNearByWeather') {
	$url='http://api.geonames.org/findNearByWeatherJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=demo&style=full';
	}

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	
	if ($_REQUEST['name'] == 'earthquakes') {
	$output['data'] = $decode['earthquakes'];
	}
	
	if ($_REQUEST['name'] == 'cities' || $_REQUEST['name'] == 'countryInfo') {
	$output['data'] = $decode['geonames'];
	}
	
	if ($_REQUEST['name'] == 'findNearByWeather') {
	$output['data'] = $decode['weatherObservation'];
	}


	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>

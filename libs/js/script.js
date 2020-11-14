function presentResult(selector, results) {
	let table = $('<table/>');
	let header = $('<tr/>');
	let obj;
	// works for clean dataset
	obj = (results['data'].length > 1) ? results['data'][0] : results['data'];
	const heads = Object.keys(obj).forEach(
		(key) => {
			header.append($('<th/>').html(key));
		});	
	$(table).append(header);
	
	
	if (results['data'].length > 1) {
	const tails = results['data'].map(result => {
	  let row = $('<tr/>');
	  for (const value of Object.values(result)) {
		row.append($('<td/>').html(value));
	  }
	  $(table).append(row);
	});
	} else {
	  let row = $('<tr/>');
	  for (const value of Object.values(obj)) {
		row.append($('<td/>').html(value));
	  }
	$(table).append(row);
	}
	$(selector).html(table);
}

async function getAPI(api, option) {
	let result;
	let result2;
	let word;

	try {
		// 1st promise
		result = await $.ajax({
			url: "libs/php/getAPI.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $(option).val(),
				name: 'countryInfo'
			}
		});
					
		if (api == 'findNearByWeather') {
			word = 'cities';
		} else {
			word = api;
		}
		// 2nd promise nested in if (result.status.name == "ok") {} necessary now?
		result2 = await $.ajax({
			url: "libs/php/getAPI.php",
			type: 'POST',
			dataType: 'json',
			data: {
				north: result['data'][0]['north'],
				south: result['data'][0]['south'],
				east: result['data'][0]['east'],
				west: result['data'][0]['west'],
				name: word
				}
			});
		// 3rd promise to input highest population/ relevance capital city nearest weather station
		// bounding box for USA selects Canada Ottawa over Washington USA due to smaller washington population
		if (api == 'findNearByWeather') {
			console.log(result2);
			//could use countrycode to filter overlap
			result3 = await $.ajax({
				url: "libs/php/getAPI.php",
				type: 'POST',
				dataType: 'json',
				data: {
					lng: result2['data'][0]['lng'],
					lat: result2['data'][0]['lat'],
					name: api
				}
			});
			console.log(result3);
			return result3;
		} else {
			return result2;
		}
	} catch (error) {
		console.log(error);
	}
}


$('#btn1').click(function() {
	getAPI('earthquakes', '#selCountry1').then(result => presentResult('#test',  result));
});

$('#btn2').click(function() {
	getAPI('cities', '#selCountry2').then(result => presentResult('#test', result));
});

$('#btn3').click(function() {
	getAPI('findNearByWeather', '#selCountry3').then(result => presentResult('#test', result));
});

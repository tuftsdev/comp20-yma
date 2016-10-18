// a list of all stations including their lat/long coordinates, all hard coded
var stations = [{
	stop_name: "Alewife",
	stop_lat: 42.395428,
	stop_long: -71.142483
}, {
	stop_name: "Davis",
	stop_lat: 42.39674,
	stop_long: -71.121815
}, {
	stop_name: "Porter",
	stop_lat: 42.3884,
	stop_long: -71.11914899999999
}, {
	stop_name: "Harvard",
	stop_lat: 42.373362,
	stop_long: -71.118956
}, {
	stop_name: "Central",
	stop_lat: 42.365486,
	stop_long: -71.103802
}, {
	stop_name: "Kendall/MIT",
	stop_lat: 42.36249079,
	stop_long: -71.08617653
}, {
	stop_name: "Charles/MGH",
	stop_lat: 42.361166,
	stop_long: -71.070628
}, {
	stop_name: "Park Street",
	stop_lat: 42.35639457,
	stop_long: -71.0624242
}, {
	stop_name: "Downtown Crossing",
	stop_lat: 42.355518,
	stop_long: -71.060225
}, {
	stop_name: "South Station",
	stop_lat: 42.352271,
	stop_long: -71.05524200000001
}, {
	stop_name: "Broadway",
	stop_lat: 42.342622,
	stop_long: -71.056967
}, {
	stop_name: "Andrew",
	stop_lat: 42.330154,
	stop_long: -71.057655
}, {
	stop_name: "JFK/UMass",
	stop_lat: 42.320685,
	stop_long: -71.052391
}, {
	stop_name: "Savin Hill",
	stop_lat: 42.31129,
	stop_long: -71.053331
}, {
	stop_name: "Fields Corner",
	stop_lat: 42.300093,
	stop_long: -71.061667
}, {
	stop_name: "Shawmut",
	stop_lat: 42.29312583,
	stop_long: -71.06573796000001
}, {
	stop_name: "Ashmont",
	stop_lat: 42.284652,
	stop_long: -71.06448899999999
}, {
	stop_name: "North Quincy",
	stop_lat: 42.275275,
	stop_long: -71.029583
}, {
	stop_name: "Wollaston",
	stop_lat: 42.2665139,
	stop_long: -71.0203369
}, {
	stop_name: "Quincy Centre",
	stop_lat: 42.251809,
	stop_long: -71.005409
}, {
	stop_name: "Quincy Adams",
	stop_lat: 42.233391,
	stop_long: -71.007153
}, {
	stop_name: "Braintree",
	stop_lat: 42.2078543,
	stop_long: -71.0011385
}];

function init() {
	var myLat = 42.353; // Center the map over Boston initially
	var myLng = -71.081;
	var request = new XMLHttpRequest();
	var me = new google.maps.LatLng(myLat, myLng);
	var map = new google.maps.Map(document.getElementById("map_canvas"), {
		zoom: 14,
		center: me,
		mapTypeId: 'roadmap'
	});
	getMyLocation(map);
}

function getMyLocation(map) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap(map);
		});
	} else {
		alert("Boo hoo! Your browser doesn't support geolocation, " + 
			"unfortunately. You need a new browser!");
	}
}

function renderMap(map) {
	me = new google.maps.LatLng(myLat, myLng);
				
	// Center map to my location
	map.panTo(me);
    
	// Make and add marker for my current location
	var myMarker = new google.maps.Marker({
		position: me,
		title: ("I'm HERE at " + myLat + ", " + myLng)
	});
	myMarker.setMap(map);

	// Add info marker/click event for your location
	var infowindow = new google.maps.InfoWindow({
		content: myMarker.title
	});
	myMarker.addListener('click', function() {
		infowindow.open(map, myMarker);
	});

    // Process each station; that is, add station markers and find the nearest
    // station to you.
    var R = 6371; // kilometres
    var dists = []; // store all distances between you and stations
	for (var i = 0; i < stations.length; i++) {
		addStation(stations[i], map); // Add marker for each station
        // Calculate distance using Haversine formula.
        var x = myLng - stations[i].stop_long;
        var y = myLat - stations[i].stop_lat;
        var dx = toRad(x);
        var dy = toRad(y);
        var a = Math.pow(Math.sin(dy / 2), 2) + Math.cos(toRad(myLat)) *
            Math.cos(toRad(stations[i].stop_lat)) * Math.pow(Math.sin(dx / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        dists[i] = d;
	}
    console.log(dists);

    // Draw the Red line on the map, including the branch
    var stationCoords = [];
    for (var i = 0; i <= 16; i++) {
        var staCoord = {lat: stations[i].stop_lat, lng: stations[i].stop_long};
        stationCoords.push(staCoord);
    }
    var branchCoords = [ // coords for the branch line
        {lat: stations[12].stop_lat, lng: stations[12].stop_long}
    ];
    for (var i = 17; i < stations.length; i++) {
        var staCoord = {lat: stations[i].stop_lat, lng: stations[i].stop_long};
        branchCoords.push(staCoord);
    }
    var mainLine = makeLine(stationCoords, '#EE1111');
    mainLine.setMap(map);
    var BBranch = makeLine(branchCoords, '#EE1111');
    BBranch.setMap(map);
}

function addStation(station, map) {
	var pos = new google.maps.LatLng(station.stop_lat, station.stop_long);
	var stationMarker = new google.maps.Marker({
		position: pos,
        icon: "t.png",
		title: station.stop_name
	});
	stationMarker.setMap(map);
	// Add info marker/click event for each station
    var infowindow = new google.maps.InfoWindow({
        content: stationMarker.title
    });
	stationMarker.addListener('click', function() {
		infowindow.open(map, stationMarker);
	});
}

function makeLine(coords, colour) {
    return new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: colour,
        strokeWeight: 2
    });
}

function toRad(r) {
    return r * Math.PI / 180;
}
var map;
var markerList = {};

function initialize() {
	console.log('Initializing map');
	var myOptions = {
		zoom: 16,
		center: new google.maps.LatLng(42.367201, - 71.258851),
		disableDefaultUI: true,
		scaleControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: false,
		disableDoubleClickZoom: true,
		draggable: false,
		keyboardShortcuts: false,
		scrollwheel: false
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
}

function update_positions(data) {
	//if marker exists, update its location, else create it
	var detectives = data.detectives;
	var uid;
	for (var i = 0; i < detectives.length; i++) {
		d = detectives[i];
		uid=d.user_id == data.user_id ? 'me' : d.user_id;
		if (markerList.hasOwnProperty(uid)) {
			moveMarker(markerList[uid], d.latitude, d.longitude);
		} else {
			addMarker(d.latitude, d.longitude, uid, d.name, 'detective');
		}
	}
	var spy = data.spy;
	uid=spy.user_id == data.user_id ? 'me' : spy.user_id;
	if (markerList.hasOwnProperty(uid)) {
		moveMarker(markerList[uid], spy.latitude, spy.longitude);
	} else {
		addMarker(spy.latitude, spy.longitude, uid, spy.name, 'spy');
	}

	zoomToFit();
}

function zoomToFit() {
	var bounds=new google.maps.LatLngBounds();
	for (id in markerList) {
		bounds.extend(markerList[id].position);
	}

	map.fitBounds(bounds);
}

function moveMarker(marker, lat, lng) {
	marker.setPosition(new google.maps.LatLng(lat, lng));
}

function addMarker(lat, lng, id, name, role) {
	var pinImage;
	if (role == 'detective') {
		pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FFFF",
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34));
	} else {
		pinImage = new google.maps.MarkerImage(id == 'me' ? 'images/spy-me-small.png' : 'images/spy-small.png',
			new google.maps.Size(18, 28),
			new google.maps.Point(0, 0),
			new google.maps.Point(9, 25));
	}
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		map: map,
		title: name,
		icon: pinImage
	});
	markerList[id] = marker;
	//DROP MARKER INFOWINDOW
	var latlng = new google.maps.LatLng(lat, lng);
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, this);
		marker = this;
	});
	var infowindow = new google.maps.InfoWindow({
		content: name
	});
	//CLOSING MARKER INFOWINDOW
	google.maps.event.addListener(infowindow, 'closeclick', function () {
		infowindow.close(map, this); //removes the marker
		zoomToFit();
	});
}

// Store current location
document.last_loc={};
// Handle location data
function geolocationSuccess(position) {
	coords={
		latitude: position.coords.latitude,
		longitude: position.coords.longitude,
		accuracy: position.coords.accuracy
	}
	console.log('Got position');
	console.log(coords);
	if (coords.accuracy >= 100) {
		return;
	}
	document.last_loc=coords;
	if (markerList.me) {
		moveMarker(markerList.me, coords.latitude, coords.longitude);
		zoomToFit();
	}
//	map.panTo(new google.maps.LatLng(coords.latitude, coords.longitude));
}

function pushPosition(id) {
	console.log('Pushing position');
	$.get(document.sg.server+'/games/'+id+'/update_position', document.last_loc, handle_update, 'jsonp');
}

// Handle an error while trying to get location
function geolocationFailure(error) {
	console.log(error);
	alert('Unable to track your position');
}

// Handle game state data (after posting to /update_position in commands.geolocationSuccess)
function handle_update(data, textStatus, jXHR) {
	if (data.goto) {
		console.log('Sent to '+data.goto);
		page(data.goto, data);
	} else {
		console.log('Updating positions');
		console.log(data);
		update_positions(data);
	}
}

$(document).bind("mobileinit", function(){
	// Disable jQuery Mobile link handling - we do this separately
//	$.mobile.ajaxEnabled = false;
});

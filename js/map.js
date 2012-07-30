var map;
var markerList = {};
var infoWindow = null;

function initialize() {
	console.log('Initializing map');
	
	var styles = [
  		{
    		featureType: "landscape.man_made",
    		elementType: "geometry.fill",
    		stylers: [
	      		{ color: "#a6eaf2" },
    	  		{ lightness: 16 },
      			{ saturation: -32 }
    		]
  		},{
	    	featureType: "landscape.natural",
    		elementType: "geometry.fill",
    		stylers: [
      			{ color: "#04808c" },
      			{ saturation: -22 },
      			{ lightness: 12 }
    		]
  		},{
	    	featureType: "poi.school",
    		elementType: "geometry.fill",
    		stylers: [
      			{ color: "#095a8a" }
	    	]
	  	},{
    		featureType: "road.local",
    		elementType: "geometry.stroke",
    		stylers: [
      			{ weight: 0.1 }
    		]
  		},{
    		featureType: "water",
    		elementType: "geometry.fill",
    		stylers: [
      			{ saturation: 61 },
      			{ lightness: -26 }
    		]
  		}
	];

  	// Create a new StyledMapType object, passing it the array of styles,
  	// as well as the name to be displayed on the map type control.
  	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

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
		scrollwheel: false,
		maxZoom: 19
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

	//Associate the styled map with the MapTypeId and set it to display.
 	map.mapTypes.set('map_style', styledMap);
  	map.setMapTypeId('map_style');
}

function update_positions(data) {
	//if marker exists, update its location, else create it
	var detectives = data.detectives;
	var uid;
	for (var i = 0; i < detectives.length; i++) {
		d = detectives[i];
		uid=d.user_id == data.user_id ? 'me' : d.user_id;
		updateMarker(d.latitude, d.longitude, uid, d.name, 'detective');
	}
	var spy = data.spy;
	uid=spy.user_id == data.user_id ? 'me' : spy.user_id;
	updateMarker(spy.latitude, spy.longitude, uid, spy.name, 'spy');
	zoomToFit();
}

function zoomToFit() {
	if (infoWindow) {
		return;
	}
	var bounds=new google.maps.LatLngBounds();
	for (id in markerList) {
		bounds.extend(markerList[id].position);
	}

	map.fitBounds(bounds);
}

function createMarker(id, name, role) {
	var marker=new google.maps.Marker({
		map: map,
		title: name,
		icon: new google.maps.MarkerImage('images/'+role+(id == 'me' ? '-me' : '')+'.png',
			new google.maps.Size(24, 30),
			new google.maps.Point(0, 0),
			new google.maps.Point(12, 30)),
		shadow: new google.maps.MarkerImage('images/'+role+(id == 'me' ? '-me' : '')+'-shadow.png',
			new google.maps.Size(36, 30),
			new google.maps.Point(0, 0),
			new google.maps.Point(12, 30))
	});
	markerList[id]=marker;
	//DROP MARKER INFOWINDOW
	var myInfoWindow = new google.maps.InfoWindow({
		content: name,
	});
	google.maps.event.addListener(marker, 'click', function () {
		if (myInfoWindow == infoWindow) {
			google.maps.event.trigger(myInfoWindow, 'closeclick');
		} else {
			if (infoWindow) {
				infoWindow.close();
			}
			infoWindow=myInfoWindow;
			myInfoWindow.open(map, this);
		}
	});
	//CLOSING MARKER INFOWINDOW
	google.maps.event.addListener(myInfoWindow, 'closeclick', function () {
		myInfoWindow.close(); //removes the marker
		infoWindow=null;
		zoomToFit();
	});
}

function updateMarker(lat, lng, id, name, role) {
	if (lat && lng) {
		if (!markerList[id]) {
			createMarker(id, name, role);
		}
		var marker=markerList[id];
		marker.setPosition(new google.maps.LatLng(lat, lng));
	}
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
	updateMarker(coords.latitude, coords.longitude, 'me', 'You', document.sg.data.gameMap.role);
	zoomToFit();
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

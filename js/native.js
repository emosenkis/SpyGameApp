// Functions that call PhoneGap functionality
function exit() {
	if (navigator.app) {
		navigator.app.exitApp();
	} else {
		alert('Thanks for playing!');
		window.location='http://www.google.com';
	}
};
function getPosition() {
	navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure, {enableHighAccuracy: true});
};
function watchPosition() {
	clearWatch();
	document.watch_id=navigator.geolocation.watchPosition(geolocationSuccess, geolocationFailure, {enableHighAccuracy: true});
};
function clearWatch() {
	if (typeof document.watch_id !== 'undefined') {
		navigator.geolocation.clearWatch(document.watch_id);
	}
};

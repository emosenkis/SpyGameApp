function exit() {
    navigator.app.exitApp();
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
        alert('Cleared watch');
    } else {
        alert('No watch to clear');
    }
};

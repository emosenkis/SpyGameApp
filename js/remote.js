// Store current location
document.last_loc={};
// Handle location data
function geolocationSuccess(position) {
  if (position.accuracy < 100) {
    document.last_loc=position;
    map.panTo(new google.maps.LatLng(position.latitude, position.longitude));
  }
};

function pushPosition() {
  $.post('https://spy-game.herokuapp.com/games/'+document.game_id+'/update_position', document.last_loc, handle_update, 'json');
}

// Handle an error while trying to get location
function geolocationError(error) {
  alert(error);
};

// Handle game state data (after posting to /update_position in commands.geolocationSuccess)
function handle_update(data, textStatus, jXHR) {
  if (data.goto) {
    page(data.goto)
  } else {
    update_positions(data);
  }
}

$(document).bind("mobileinit", function(){
  setInterval(pushPosition, 10000);
});

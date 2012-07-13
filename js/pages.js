document.sg={};
document.sg.data={};
document.sg.pageinit={};
document.sg.dataloader={};
document.sg.server='https://spy-game.herokuapp.com';
document.sg.server='http://localhost:3000';

document.sg.dataloader.games=function() {
	loadData('games', {}, this);
}

document.sg.pageinit.signin=function(data) {
	if (data && data.error) {
		$('#signin_error').html(data.error);
	}
}

document.sg.pageinit.games=function(data) {
	$('#games-list').html('');
	for (var i=0; i<data.length; i++) {
		game=data[i];
		tag='<li><a href="#game" data-game-id="'+game.id+'">Game '+game.id+'</a>';
		for (var j=0; j<game.players.length; j++) {
			player=game.players[j];
			tag+=' '+player+',';
		}
		tag+=' status: '+game.state;
		tag+='</li>';
		$('#games-list').append(tag);
	}
}

function signin() {
	loadData('sessions', $(this).serialize(), 'signin');
}

$(function() {
	// Take over signin form
	$('#signin form').submit(signin);
});

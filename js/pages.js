document.sg={};
document.sg.data={};
document.sg.pageinit={};
document.sg.dataloader={};
document.sg.server='https://spy-game.herokuapp.com';
//document.sg.server='http://localhost:3000';

document.sg.pageinit.gameLobby=function(data) {
	$(this).find('h1').html('Game '+data.id);
	$(this).find('#game_status').html(data.state);
	pl='';
	for (var i=0; i<data.players.length; i++) {
		pl+='<li>'+data.players[i]+'</li>';
	}
	$(this).find('#playerlist').html(pl);
	if (data.in_game) {
		$(this).find('.leave_game').show();
		$(this).find('.join_game').hide();
	} else {
		$(this).find('.leave_game').hide();
		$(this).find('.join_game').show();
	}
}

document.sg.dataloader.gameLobby=function(data) {
	loadData('games/'+data.gameId, data, this);
}

document.sg.dataloader.games=function() {
	loadData('games', {}, this);
}

document.sg.pageinit.signin=function(data) {
	if (data && data.error) {
		alert(data.error);
	}
}

document.sg.pageinit.games=function(data) {
	$('#games-list').html('');
	for (var i=0; i<data.length; i++) {
		game=data[i];
		tag='<li><a href="#gameLobby" data-game-id="'+game.id+'">Game '+game.id+'</a>';
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

function signup() {
	loadData('users', $(this).serialize(), 'signup');
}

$(function() {
	// Take over signin form
	$('#signin form').submit(signin);
	$('#signup form').submit(signup);
});

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
	alert('im here');
	$('#games_list').html('');
	for (var i=0; i<data.length; i++) {
		game=data[i];
		tag='<div data-role="collapsible"><h3>Game '+game.id+'</h3><p><ul>';
		for (var j=0; j<game.players.length; j++) {
			tag+= '<li>'
			player=game.players[j];
			tag+=' '+player+'</li>';
		}
		tag+='</ul> status: '+game.state;
		tag+='<div><a href="#gameLobby" data-game-id="'+game.id+'">More Info</a></div>';
		tag+='</p>';
		$(tag).appendTo('#games_list');
	}
	$('#games_list').trigger("create");
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

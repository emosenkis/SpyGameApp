document.sg={};
document.sg.data={};
document.sg.pageinit={};
document.sg.dataloader={};
document.sg.server='https://spy-game.herokuapp.com';
//document.sg.server='http://localhost:3000';

document.sg.pageinit.gameLobby=function(data) {
	$(this).find('h1').html('Game '+data.id);
	$(this).find('[data-game-id]').data('gameId', data.id);
	$(this).find('#game_status').html(data.state);
	pl='';
	for (var i=0; i<data.players.length; i++) {
		pl+='<li>'+data.players[i]+'</li>';
	}
	$(this).find('#playerlist').html(pl);
	if (data.in_game) {
		$(this).find('.leave_game').show();
		$(this).find('.join_game').hide();
	} else if (data.state == 'pending') {
		$(this).find('.leave_game').hide();
		$(this).find('.join_game').show();
	} else {
		$(this).find('.leave_game').parent().hide();
	}
}

document.sg.dataloader.gameLobby=function(data) {
	loadData('games/'+data.gameId, data, this);
}

document.sg.dataloader.games=function() {
	loadData('games', {}, this);
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

document.sg.dataloader.signin=function() {
	loadData('is-signed-in', {}, this);
}

document.sg.pageinit.signin=function(data) {
	if (data && data.error) {
		alert(data.error);
	}
}

document.sg.pageinit.signup=document.sg.pageinit.signin;

function signin() {
	loadData('sessions', $(this).serialize(), 'signin');
	return false;
}

function signup() {
	loadData('users', $(this).serialize(), 'signup');
	return false;
}

document.sg.dataloader.signout=function(data) {
	loadData('signout', {}, 'signin');
}

document.sg.dataloader.newgame=function(data) {
	loadData('games/new', {}, 'gameLobby');
}

document.sg.dataloader.leave=function(data) {
	loadData('games/'+data.gameId+'/leave', {}, this);
}

document.sg.dataloader.join=function(data) {
	loadData('games/'+data.gameId+'/join', {}, 'gameLobby');
}

document.sg.dataloader.start=function(data) {
	loadData('games/'+data.gameId+'/start', {}, 'gameLobby');
}

document.sg.dataloader.briefing=function(data) {
	loadData('games/'+data.gameId+'/briefing', {}, this);
}

document.sg.pageinit.briefing=function(data) {
	$(this).find('[data-game-id]').data('gameId', data.id);
	$(this).find('.briefing').hide();
	$(this).find('.briefing.'+data.role).show();
}

document.sg.dataloader.gameMap=function(data) {
	loadData('games/'+data.gameId+'/main', {}, this);
}

document.sg.pageinit.gameMap=function(data) {
	$(this).find('[data-game-id]').data('gameId', data.id);
	$(this).find('#map_canvas').css({width: $(this).width()-50, height: $(this).height()-30});
	if (document.sg.interval) {
		clearTimeout(document.sg.interval);
	}
	document.sg.interval=setInterval(function() {
		pushPosition(data.id);
	}, 10000);
	watchPosition();
	setTimeout(function() {google.maps.event.trigger(map, 'resize');}, 300);
}

$(function() {
	// Take over signin form
	$('#signin form').submit(signin);
	$('#signup form').submit(signup);
	document.sg.dataloader.signin();
});

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
	stopStalking();
	loadData('games/'+data.gameId, data, this);
}

document.sg.dataloader.games=function() {
	loadData('games', {}, this);
}

document.sg.pageinit.games=function(data) {
	$('#games_list').html('');
	for (var i=0; i<data.length; i++) {
		game=data[i];
		tag='<div data-role="collapsible"><h3>Game '+game.id+' - '+game.state+'</h3><ul id="name-list" data-role="listview" data-type="horizontal" data-inset="true" >';
		for (var j=0; j<game.players.length; j++) {
			tag+= '<li>'
			player=game.players[j];
			tag+=' '+player+'</li>';
		}

		tag+='</ul><br>';
		tag+='<div><a href="#gameLobby" data-game-id="'+game.id+'">Enter Game</a></div>';

		$(tag).appendTo('#games_list');
	}
	$('#games_list').trigger("create");
}

document.sg.dataloader.signin=function() {
	loadData('is-signed-in', {}, 'signin');
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
	stopStalking();
	loadData('signout', {}, 'signin');
}

document.sg.dataloader.newgame=function(data) {
	loadData('games/new', {}, 'gameLobby');
}

document.sg.dataloader.leave=function(data) {
	stopStalking();
	loadData('games/'+data.gameId+'/leave', {}, this);
}

document.sg.dataloader.join=function(data) {
	stopStalking();
	loadData('games/'+data.gameId+'/join', {}, 'gameLobby');
}

document.sg.dataloader.start=function(data) {
	stopStalking();
	loadData('games/'+data.gameId+'/start', {}, 'gameLobby');
}

document.sg.dataloader.briefing=function(data) {
	stopStalking();
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
	$(this).find('#timer').countdown({
		startTime: data.countdown,
		doneCountdown: function() {pushPosition(data.id);},
	});
	stopStalking();
	document.sg.interval=setInterval(function() {
		pushPosition(data.id);
	}, 10000);
	watchPosition();
	setTimeout(function() {google.maps.event.trigger(map, 'resize');}, 300);
}

document.sg.dataloader.debriefing=function(data) {
	stopStalking();
	loadData('games/'+data.gameId+'/debriefing', {}, 'debriefing');
}

document.sg.pageinit.debriefing=function(data) {
	$(this).find('[data-outcome]').hide();
	$(this).find('[data-outcome='+data.role+'-'+data.outcome+']').show();
}

function stopStalking() {
	if (document.sg.interval) {
		clearTimeout(document.sg.interval);
	}
	clearWatch();
}

$(function() {
	// Take over signin form
	$('#signin form').submit(signin);
	$('#signup form').submit(signup);
	document.sg.dataloader.signin();
});

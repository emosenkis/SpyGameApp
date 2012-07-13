document.sg={};
document.sg.data={};
document.sg.pageinit={};
document.sg.dataloader={};
document.sg.server='https://spy-game.herokuapp.com';
document.sg.server='.';

document.sg.dataloader.baz=function() {
	loadData('info.json', 'get', {junk: true}, this);
}

document.sg.pageinit.bar=function(data) {
	alert('BAR'+this);
	$(this).find('p').first().html(data.name);
}

function page(id, data) {
	if (document.sg.dataloader[id]) {
		document.sg.dataloader[id].call(id, data);
	} else {
		if (document.sg.pageinit[id]) {
			document.sg.pageinit[id].call($('#'+id).first, data);
		}
		$.mobile.changePage('#'+id);
	}
}

function loadData(url, method, data, id) {
	url=document.sg.server+'/'+url;
	$.ajax(url, {
		dataType: 'json',
		data: data,
		success: function(data, textStatus, jqXHR) {
			if (data.goto) {
				alert('Goto '+data.goto);
				if (data.gotodata) {
					page(data.goto, data.gotodata);
				} else {
					page(data.goto);
				}
			} else {
				if (document.sg.pageinit[id]) {
					document.sg.pageinit[id].call($('#'+id).first, data);
				}
				$.mobile.changePage('#'+id);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('Error loading data from '+url);
		}
	});
}

$('a').live('click', function(event) {
	var href=$(this).attr('href');
	if (href && href.charAt(0) == '#') {
		event.preventDefault();
		event.stopPropagation();
		page(href.substring(1), $(this).data());
	}
});

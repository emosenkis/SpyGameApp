// Run page's dataloader if it exists, if not just load the page
function page(id, data) {
	console.log('Page('+id+')');
	if (document.sg.dataloader[id]) {
		$.mobile.showPageLoadingMsg();
		console.log('Dataload '+id);
		document.sg.dataloader[id].call(id, data);
	} else {
		changePage(id);
	}
}

function changePage(id) {
	console.log($.mobile.activePage[0].id +' -> '+id);
	if ($.mobile.activePage[0].id == id && document.sg.pageinit[id]) {
		console.log('Forcing pageinit '+id);
		$('#'+id).trigger('pagebeforeshow');
	}
	$.mobile.hidePageLoadingMsg();
	$.mobile.changePage('#'+id);
}

// Load data from server/url with data as params, if successful load page by id
function loadData(url, data, id) {
	url=document.sg.server+'/'+url;
	$.ajax(url, {
		dataType: 'jsonp',
		data: data,
		success: function(data, textStatus, jqXHR) {
			if (data.alert) {
				console.log('Got alert: '+data.alert);
				alert(data.alert);
			}
			if (data.goto) {
				console.log('Goto '+data.goto);
				page(data.goto, data);
			} else {
				console.log('Loading '+id);
				document.sg.data[id]=data;
				changePage(id);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$.mobile.hidePageLoadingMsg();
			console.log('Error loading data from '+url);
			alert('Error loading data');
		}
	});
}

// Catch any clicks on links and run page(page-id, link-data) instead
$('a').live('click', function(event) {
	var href=$(this).attr('href');
	if (href && href.charAt(0) == '#') {
		event.preventDefault();
		event.stopPropagation();
		page(href.substring(1), $(this).data());
	}
});


// Run pageinit functions when pages are loaded
$(function() {
	$(document).delegate('[data-role=page]', 'pagebeforeshow', function(event) {
		var page=this.id;
		console.log('Init '+page);
		if (document.sg.pageinit[page]) {
			document.sg.pageinit[page].call(this, document.sg.data[page]);
			$(this).trigger('updatelayout');
		}
	});
});

// Run page's dataloader if it exists, if not just load the page
function page(id, data) {
	if (document.sg.dataloader[id]) {
		document.sg.dataloader[id].call(id, data);
	} else {
		$.mobile.changePage('#'+id);
	}
}

// Load data from server/url with data as params, if successful load page by id
function loadData(url, data, id) {
	url=document.sg.server+'/'+url;
	$.ajax(url, {
		dataType: 'jsonp',
		data: data,
		success: function(data, textStatus, jqXHR) {
			if (data.goto) {
				//alert('Goto '+data.goto);
				if (data.gotodata) {
					page(data.goto, data.gotodata);
				} else {
					page(data.goto);
				}
			} else {
				document.sg.data[id]=data;
				$.mobile.changePage('#'+id);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert('Error loading data from '+url);
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
		if (document.sg.pageinit[page]) {
			document.sg.pageinit[page].call(this, document.sg.data[page]);
		}
	});
});

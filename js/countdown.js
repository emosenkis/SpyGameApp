(function($) {
	$.fn.countdown=function(userOpts) {
		var settings = $.extend({
			startTime: 600
		}, userOpts);
		return this.each(function() {
			$(this).data('countdown', Math.floor(settings.startTime));
			var update=function(el) {
				secs=el.data('countdown');
				mins=Math.floor(secs/60);
				mins = mins < 10 ? '0'+mins : ''+mins;
				secs=secs%60;
				secs = secs < 10 ? '0'+secs : ''+secs;
				el.html(mins+':'+secs);
				if (el.data('countdown') === 0) {
					clearTimeout(el.data('cd_timeout'));
					if (settings.doneCountdown) {
						settings.doneCountdown.call(el);
					}
				} else {
					el.data('countdown', el.data('countdown')-1);
				}
			}
			el=$(this);
			$(this).data('cd_timeout', setInterval(function() {
				update(el);
			}, 1000));
			update($(this));
		});
	}
})(jQuery);

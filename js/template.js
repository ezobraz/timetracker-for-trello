/* global TrelloPowerUp */
var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';
var Promise = TrelloPowerUp.Promise;

var boardButtonCallback = function(t){
  return t.popup({
    title: "Time Statistics",
    url: './totalStatistics.html',
    height: 66
  });
};

var cardButtonCallback = function(t){
  return t.popup({
    title: "Time Tracker",
    url: './timeTracker.html',
    height: 80
  });
};

var getBadge = function(t){
	var timerText = '';
	var color = null;
	var icon = GRAY_ICON;

	Promise.all([
		t.get('card', 'private', 'timer_started')
	])
	.spread(function(time) {
		if(time != null) {
			timerText = 'Timer is on';
			color = 'red';
			icon = WHITE_ICON;
		}
	});

	return {
	    dynamic: function(){
			return {
				text: timerText,
				icon: icon,
				color: color,
				refresh: 10
			}
	    }
	};
}

TrelloPowerUp.initialize({
	'board-buttons': function(t, options) {
		return [{
			icon: WHITE_ICON,
			text: "Time Statistics",
			callback: boardButtonCallback
		}];
	},
	'card-buttons': function(t, options) {
		return [{
			icon: GRAY_ICON,
			text: "Time Tracker",
			callback: cardButtonCallback
		}];
	},
	'card-badges': function(t, card) {
		return getBadge(t);
	},
	'show-settings': function(t, options){
		return t.popup({
			title: 'Settings',
			url: './settings.html',
			height: 184
		});
	}
});
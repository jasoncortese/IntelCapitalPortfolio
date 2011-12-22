var app = window.app || {};

$(function() {
	var project = app.project = {};
	
	project.init = function () {
	};
	
	Ti = window;
	Ti.App = document;
	Ti.include = function () {
		for (var i=0; i < arguments.length; ++i) {
			document.write('<script src="' + arguments[i] + '"><\/script>');
		}
	}
	
	if (navigator.splashscreen) navigator.splashscreen.hide();

	Modernizr.load = Modernizr.load || function (obj) {
		$.getScript(obj.load);
	}
	
})();

Ti.include(
	'file:///android_asset/utilities/utilities.js',
	'file:///android_asset/model/model.js',
	'file:///android_asset/view/view.js',
	'file:///android_asset/viewmodel/viewmodel.js'
);


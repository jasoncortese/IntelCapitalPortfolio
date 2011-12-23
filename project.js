var app = window.app || {};

try {this.errorOut()} catch (e) {};
		
(function() {
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
	'../utilities/utilities.js',
	'../model/model.js',
	'../view/view.js',
	'../viewmodel/viewmodel.js'
);

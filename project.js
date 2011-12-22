var app = window.app || {};

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
	
	Modernizr.load = Modernizr.load || function (obj) {
		$.getScript(obj.load);
	}
})();

alert(0);
Ti.include('../utilities/utilities.js');
alert(1);
Ti.include('../model/model.js');
alert(2);
Ti.include('../view/view.js');
alert(3);
Ti.include('../viewmodel/viewmodel.js');
alert(4);

(function() {
	var services = app.project.utilities.services;

	var model = app.project.model = {};
	alert(0.0);
	model.init = function () {
		switch (location.pathname.split('/').slice(-1)[0].split('.')[0]) {
			case ('portfolio') :
	alert(0.1);
				document.criteria = {indexStartValue: 0};
				window.criteria = document.criteria;
				services.clearSavedData('bio', 'criteria');
				services.clearSavedData('bio', 'list', []);
				app.project.model.portfolio.init();
				break;
			case ('team') :
				document.criteria = {indexStartValue: 0};
				window.criteria = document.criteria;
				services.clearSavedData('portfolio', 'criteria');
				services.clearSavedData('portfolio', 'list', []);
				app.project.model.bio.init();
				break;
			case ('community') :
				document.criteria = {q: 'from:intelcapital', rpp: '10', page: 1, result_type: 'mixed'};
				window.criteria = document.criteria;
				services.clearSavedData('bio', 'criteria');
				services.clearSavedData('bio', 'list', []);
				services.clearSavedData('portfolio', 'criteria');
				services.clearSavedData('portfolio', 'list', []);
				app.project.model.community.init();
				break;
			default :
				services.clearSavedData('bio', 'criteria');
				services.clearSavedData('bio', 'list', []);
				services.clearSavedData('portfolio', 'criteria');
				services.clearSavedData('portfolio', 'list', []);
				break;
		}
	};
	
	$(document).ready(model.init);

})();

Ti.include(
	'../model/portfolio.js',
	'../model/bio.js',
	'../model/community.js'
);
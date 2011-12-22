(function() {
	var viewmodel = app.project.viewmodel = {};
	
	alert(3.0);
	viewmodel.init = function () {
	alert(3.1);
		switch (location.pathname.split('/').slice(-1)[0].split('.')[0]) {
			case ('portfolio') :
				app.project.viewmodel.portfolio.init();
				break;
			case ('team') :
				app.project.viewmodel.bio.init();
				break;
			case ('community') :
				app.project.viewmodel.community.init();
				break;
		}
	}
	
})();

Ti.include(
	'../viewmodel/portfolio.js',
	'../viewmodel/bio.js',
	'../viewmodel/community.js'
);

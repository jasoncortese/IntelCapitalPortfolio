(function() {
	var viewmodel = app.project.viewmodel = {};
	
	viewmodel.init = function () {
		switch (location.pathname.split('/').slice(-1)[0].split('.')[0]) {
			case ('portfolio') :
				Ti.include('../viewmodel/portfolio.js');
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


(function () {
	var services = app.project.utilities.services;
	
	var commModel = app.project.model.community = {
		news: []
	};
		
	commModel.init = function () {
		var pathname = window.pathname || location.pathname;
		switch (pathname.split('/').slice(-1)[0]) {
			case ('community.01.html') :
				window.back = function () {location.replace('home.01.html')};
				var news = getNews(criteria);
				$.when(news).then(function () {
					app.project.viewmodel.init();
				});
				break;
			case ('community.02.html') :
				window.back = function () {location.replace('community.01.html')};
				break;
			case ('community.03.html') :
				window.back = function () {location.replace('community.02.html')};
				break;
		}
	}

	var getNews = app.project.model.community.getNews = services.getDataServiceFactory('CommTwitterUrl', function (json) {
		commModel.news = commModel.news.concat(json);
		for (var i=0; i < commModel.news.length; ++i) {
			commModel.news[i].created_at2 = commModel.news[i].created_at;
		}
		var commViewModel = app.project.viewmodel.community;
		if (app.project.viewmodel.community.init.news) {
			clearInterval(commViewModel.init.news);
			$('.tableview .template').getmpl(commModel.news);
			commViewModel.init.news = $('.tableview .template').getset(commModel.news, commViewModel['commNews']);
		}
		$('.loadmore')[0].style.visibility = json.length >= 10 ? 'visible': 'hidden';
	});
	
	var signUp = app.project.model.community.signUp = services.getDataServiceFactory('CommNewsletterUrl', function (json) {
		$('.modal:eq(0)').toggle();
	});
		
})();

(function () {
	var services = app.project.services;
	var commModel = app.project.model.community;
	var commViewModel = app.project.viewmodel.community = {};
	var id = 0;
	
	commViewModel.init = function () {
		switch (location.pathname.split('/').slice(-1)[0]) {
			case ('community.01.html') :
				$('.tableview .template').getmpl(commModel.news);
				commViewModel.init.news = $('.tableview .template').getset(commModel.news, commViewModel['commNews']);
				break;
			case ('community.02.html') :
				break;
		}
	}
	
	commViewModel['commNews'] = {
		from_user$innerHTML: {user$name: ''},
		//other$innerHTML: {name: ''},
		body$innerHTML: {text: function () {return this.replace(/(http:\/\/t.co\/(\w|[\:\/\.\;\?\#\!\@\%\&\=\+\-])*)/gi, '<a href="$1">$1</a>')}},
		date$innerHTML: {created_at: ''},
		"data-date": {created_at2: function () {return this.split(' ').slice(0, 4).join(' ')}}
	};

})();

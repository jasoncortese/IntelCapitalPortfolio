(function () {
	var services = app.project.utilities.services;
	
	var bioModel = app.project.model.bio = {
		sectors: [],
		locations: [],
		roles: [],
		list: [],
		details: []
	};
		
	bioModel.init = function () {

		var savedBio = services.getSavedData('bio');
		for (x in savedBio) bioModel[x] = savedBio[x];
		
		var savedDetails = services.getSavedData('bio_details');
		for (x in savedDetails) bioModel.details[x] = savedDetails[x];

		switch (location.pathname.split('/').slice(-1)[0]) {
			case ('team.01.html') :
				window.back = function () {history.back(), location.replace('home.01.html')};
				$(document).trigger('startActivity');
				$('.loadmore')[0].style.visibility = bioModel.list.length % 10 == 6 && bioModel.list.length > 6 ? 'visible': 'hidden';
				var data = bioModel;
				for (x in data.criteria) if (!/Index/.test(x) && data.criteria[x] != '0') criteria[x] = data.criteria[x];
				var list = data.list.length ? data.list : getList();
				var sectors = data.sectors.length ? data.sectors : getSectors();
				var locations = data.locations.length ? data.locations : getLocations();
				var roles = data.roles.length ? data.funds : getRoles();
				$.when(list, sectors, locations, roles).then(function () {
					app.project.viewmodel.init();
					$(document).trigger('stopActivity');
				});
				break;
			case ('team.02.html') :
				window.back = function () {history.back(), location.replace('team.01.html')};
				$(document).trigger('startActivity');
				id = location.hash.slice(1);
				var data = bioModel;
				var details = data.details[id] || getDetails({id: id});
				$.when(details).then(function () {
					app.project.viewmodel.init();
					$(document).trigger('stopActivity');
				});
				break;
			case ('team.03.html') :
				window.back = function () {history.back(), location.replace('team.02.html#' + $('.memberid')[0].value)};
				$(document).trigger('startActivity');
				id = location.hash.slice(1);
				var data = bioModel;
				var details = data.details[id] || getDetails({id: id});
				$.when(details).then(function () {
					app.project.viewmodel.init();
					$(document).trigger('stopActivity');
				});
				break;
		}
	}

	var getSectors = services.getDataServiceFactory('BioSectorsUrl', function (json) {
		for (var i=0; i < json[0].results.length; ++i) json[0].results[i].name0 = json[0].results[i].name;
		services.setSavedData('bio', 'sectors', json[0].results);
		bioModel.sectors = json[0].results;
	});
	
	var getLocations = services.getDataServiceFactory('BioLocationsUrl', function (json) {
		for (var i=0; i < json[0].results.length; ++i) json[0].results[i].name0 = json[0].results[i].name;
		services.setSavedData('bio', 'locations', json[0].results);
		bioModel.locations = json[0].results;
	});
	
	var getRoles = services.getDataServiceFactory('BioRolesUrl', function (json) {
		for (var i=0; i < json[0].results.length; ++i) json[0].results[i].name0 = json[0].results[i].name;
		services.setSavedData('bio', 'roles', json[0].results);
		bioModel.roles = json[0].results;
	});

	var getList = app.project.model.bio.getList = services.getDataServiceFactory('BioListUrl', function (json) {
		if (!json[0].results.length) {
			json[0].results.push({
				imageUrl: 'https://www.intelportfolio.com/companyLogos/spacer.gif',
				name: 'No results found.',
				title: '',
				id: ''
			});
		} else {
			services.setSavedData('bio', 'list', json[0].results, !json._data.replace);
			services.setSavedData('bio', 'criteria', {
				searchTerm: ($('#searchfield')[0]||{}).value, 
				sector: ($('.sectors option:selected')[0]||{}).value, 
				location: ($('.locations option:selected')[0]||{}).value, 
				role: ($('.roles option:selected')[0]||{}).value,
				sectorIndex: ($('.sectors')[0]||{}).selectedIndex, 
				locationIndex: ($('.locations')[0]||{}).selectedIndex, 
				roleIndex: ($('.roles')[0]||{}).selectedIndex
			});
		}
		if (json._data.replace) bioModel.list = json[0].results;
		else bioModel.list = bioModel.list.concat(json[0].results);

		var bioViewModel = app.project.viewmodel.bio;
		if (app.project.viewmodel.bio.init.list) {
			clearInterval(bioViewModel.init.list);
			$('.tableview .template').getmpl(bioModel.list);
			bioViewModel.init.list = $('.tableview .template').getset(bioModel.list, bioViewModel['bioList']);
		}
		$('.loadmore')[0].style.visibility = json[0].results.length >= 10 ? 'visible': 'hidden';
	});

	var getDetails = services.getDataServiceFactory('BioDetailsUrl', function (json) {
		var data = json[0].results[0];
		data.name0 = data.name;
		if (!data.portfolio.length) $('.portsection').toggle();
		services.setSavedData('bio_details', data.id, data);
		bioModel.details[data.id] = data;
	});
	
	var sendEmail = app.project.model.bio.sendEmail = services.getDataServiceFactory('BioEmailUrl', function (json) {
		$('.modal:eq(0)').toggle();
	});
	
	var getSavedData = function () {
		var data = /\{|\}/.test(window.name) ? $.parseJSON(window.name) : {};
		data.bio = bioModel;
		window.name = JSON.stringify(data);
		return data;
	}
	
})();

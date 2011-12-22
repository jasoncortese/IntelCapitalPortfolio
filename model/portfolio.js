(function () {
	var services = app.project.utilities.services;
	
	var portfolioModel = app.project.model.portfolio = {
		sectors: [],
		locations: [],
		funds: [],
		list: [],
		details: []
	};
	
	portfolioModel.init = function () {

		//var savedPortfolio = services.getSavedData('portfolio');
		//for (x in savedPortfolio) portfolioModel[x] = savedPortfolio[x];
		
		//var savedDetails = services.getSavedData('portfolio_details');
		//for (x in savedDetails) portfolioModel.details[x] = savedDetails[x];
		
		switch (location.pathname.split('/').slice(-1)[0]) {
			case ('portfolio.01.html') :
				window.back = function () {location.replace('home.01.html')};
				//$(document).trigger('startActivity');
				$('.loadmore')[0].style.visibility = portfolioModel.list.length % 10 == 6 && portfolioModel.list.length > 6 ? 'visible': 'hidden';
				var data = portfolioModel;
				for (x in data.criteria) if (!/Index/.test(x) && data.criteria[x] != '0') criteria[x] = data.criteria[x];
				var list = data.list.length ? data.list : getList();
				var sectors = data.sectors.length ? data.sectors : getSectors();
				var locations = data.locations.length ? data.locations : getLocations();
				var funds = data.funds.length ? data.funds : getFunds();
				alert('here');
				$.when(list, sectors, locations, funds).then(function () {
					alert('there');
					app.project.viewmodel.init();
					$(document).trigger('stopActivity');
				});
				break;
			case ('portfolio.02.html') :
				window.back = function () {location.replace('portfolio.01.html')};
				$(document).trigger('startActivity');
				id = location.hash.slice(1);
				var data = portfolioModel;
				var details = data.details[id] || getDetails({id: id});
				$.when(details).then(function () {
					app.project.viewmodel.init();
					$(document).trigger('stopActivity');
				});
				break;
		}
	}

	var getSectors = services.getDataServiceFactory('PortfolioSectorsUrl', function (json) {
		for (var i=0; i < json[0].results.length; ++i) json[0].results[i].name0 = json[0].results[i].name;
		services.setSavedData('portfolio', 'sectors', json[0].results);
		portfolioModel.sectors = json[0].results;
	});
	
	var getLocations = services.getDataServiceFactory('PortfolioLocationsUrl', function (json) {
		for (var i=0; i < json[0].results.length; ++i) json[0].results[i].name0 = json[0].results[i].name;
		services.setSavedData('portfolio', 'locations', json[0].results);
		portfolioModel.locations = json[0].results;
	});
	
	var getFunds = services.getDataServiceFactory('PortfolioFundsUrl', function (json) {
		for (var i=0; i < json[0].results.length; ++i) json[0].results[i].name0 = json[0].results[i].name;
		services.setSavedData('portfolio', 'funds', json[0].results);
		portfolioModel.funds = json[0].results;
	});

	var getList = app.project.model.portfolio.getList = services.getDataServiceFactory('PortfolioListUrl', function (json) {
		if (!json[0].results.length) {
			json[0].results.push({
				name: 'No results found.',
				id: ''
			});
		} else {
			services.setSavedData('portfolio', 'list', json[0].results, !json._data.replace);
			services.setSavedData('portfolio', 'criteria', {
				searchTerm: ($('#searchfield')[0]||{}).value, 
				sector: ($('.sectors option:selected')[0]||{}).value, 
				location: ($('.locations option:selected')[0]||{}).value, 
				fund: ($('.funds option:selected')[0]||{}).value,
				sectorIndex: ($('.sectors')[0]||{}).selectedIndex, 
				locationIndex: ($('.locations')[0]||{}).selectedIndex, 
				fundIndex: ($('.funds')[0]||{}).selectedIndex
			});
		}
		if (json._data.replace) portfolioModel.list = json[0].results;
		else portfolioModel.list = portfolioModel.list.concat(json[0].results);
		
		var portfolioViewModel = app.project.viewmodel.portfolio;
		if (app.project.viewmodel.portfolio.init.list) {
			clearInterval(portfolioViewModel.init.list);
			$('.tableview .template').getmpl(portfolioModel.list);
			portfolioViewModel.init.list = $('.tableview .template').getset(portfolioModel.list, portfolioViewModel['portfolioList']);
		}
		$('.loadmore')[0].style.visibility = json[0].results.length >= 10 ? 'visible': 'hidden';
	});
					
	var getDetails = services.getDataServiceFactory('PortfolioDetailsUrl', function (json) {
		var data = json[0].results[0];
		data.companyUrl3 = data.companyUrl2 = data.companyUrl;
		data.name2 = data.name1 = data.name0 = data.name;
		data.investorName1 = data.investorName;
		data.investorID2 = data.investorID;
		services.setSavedData('portfolio_details', data.id, data);
		portfolioModel.details[json[0].results[0].id] = json[0].results[0];
	});
	
})();

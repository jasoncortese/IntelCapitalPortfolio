(function () {
	var services = app.project.services;
	var portfolioModel = app.project.model.portfolio;
	var portfolioViewModel = app.project.viewmodel.portfolio = {};
	var id = 0;
	
	portfolioViewModel.init = function () {
		switch (location.pathname.split('/').slice(-1)[0]) {
			case ('portfolio.01.html') :
				$('.tableview .template').getmpl(portfolioModel.list);
				$('.sectors .sector').getmpl(portfolioModel.sectors);
				$('.locations .location').getmpl(portfolioModel.locations);
				$('.funds .fund').getmpl(portfolioModel.funds);
				portfolioViewModel.init.list = $('.tableview .template').getset(portfolioModel.list, portfolioViewModel['portfolioList']);
				portfolioViewModel.init.sectors = $('.sectors .sector').getset(portfolioModel.sectors, portfolioViewModel['portfolioSectors']);
				portfolioViewModel.init.locations = $('.locations .location').getset(portfolioModel.locations, portfolioViewModel['portfolioLocations']);
				portfolioViewModel.init.funds = $('.funds .fund').getset(portfolioModel.funds, portfolioViewModel['portfolioFunds']);
				if (portfolioModel.criteria) {
					if (portfolioModel.criteria.searchTerm) $('#searchfield')[0].value = portfolioModel.criteria.searchTerm;
					$('.sectors')[0].selectedIndex = portfolioModel.criteria.sectorIndex;
					$('.locations')[0].selectedIndex = portfolioModel.criteria.locationIndex;
					$('.funds')[0].selectedIndex = portfolioModel.criteria.fundIndex;
				}
				break;
			case ('portfolio.02.html') :
				id = location.hash.slice(1);
				portfolioViewModel.init.address = $('#main .profile').getset(portfolioModel.details[id], portfolioViewModel['portfolioAddress']);
				portfolioViewModel.init.description = $('#main .generic').getset(portfolioModel.details[id], portfolioViewModel['portfolioDescription']);
				break;
		}
	}
		
	portfolioViewModel['portfolioList'] = {
	//	biopic$src: {logoUrl: ''},
		company$innerHTML: {name: ''},
		portfolio$href: {id: function () {return this != '' ? 'portfolio.02.html#' + this : '#'}}
	};

	portfolioViewModel['portfolioSectors'] = {
		innerHTML: {name: ''},
		value: {name0: ''}
	};

	portfolioViewModel['portfolioLocations'] = {
		innerHTML: {name: ''},
		value: {name0: ''}
	};

	portfolioViewModel['portfolioFunds'] = {
		innerHTML: {name: ''},
		value: {name0: ''}
	};

	portfolioViewModel['portfolioAddress'] = {
		logo$alt: {name0: ''},
		logo$src: {logoUrl: '../images/sample.logo.jpg'},
		logo$style$display: {logoUrl: function () {return /spacer.gif/.test(this) ? 'none' : 'block'}},
		logolink$href: {companyUrl: function () {return /http/.test(this) ? this : 'http://' + this}},
		name$innerHTML: {name: ''},
		streetNumber$innerHTML: {streetNumber: ''},
		streetName$innerHTML: {streetName: ''},
		city$innerHTML: {city: function () {return this + ', '}},
		state$innerHTML: {state: ''},
		country$innerHTML: {country: ''},
		postalCode$innerHTML: {postalCode: ''},
		investorName$href: {investorID: function () {return this != '' ? 'team.02.html#' + this : '#'}},
		investorName$style$color: {investorID2: function () {return this != '' ? '#0065BD' + this : '#333333'}},
		investorName$innerHTML: {investorName: ''},
		profess$style$visibility: {investorName1: function () {return this.length ? 'visible' : 'hidden'}},
		sector$innerHTML: {sector: ''},
		fund$innerHTML: {fund: ''},
		location$innerHTML: {location: ''},
		url$innerHTML: {companyUrl2: ''},
		url$href: {companyUrl3: function () {return this != '' ? (/http/.test(this) ? this : 'http://' + this) : '#'}}
	};

	portfolioViewModel['portfolioDescription'] = {
		description$innerHTML: {companyDescription: ''},
		products$innerHTML: {productsAndServices: ''},
		disclaimer$style$display: {showDisclaimer: function () {return this == 1 ? 'block' : 'none'}},
		name$innerHTML: {name2: 'this company.'}
	};

})();

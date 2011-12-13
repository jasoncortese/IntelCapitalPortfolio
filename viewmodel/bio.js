(function () {
	var services = app.project.services;
	var bioModel = app.project.model.bio;
	var bioViewModel = app.project.viewmodel.bio = {};
	var id = 0;
	
	bioViewModel.init = function () {
		switch (location.pathname.split('/').slice(-1)[0]) {
			case ('team.01.html') :
				$('.tableview .template').getmpl(bioModel.list);
				$('.sectors .sector').getmpl(bioModel.sectors);
				$('.locations .location').getmpl(bioModel.locations);
				$('.roles .role').getmpl(bioModel.roles);
				bioViewModel.init.list = $('.tableview .template').getset(bioModel.list, bioViewModel['bioList']);
				bioViewModel.init.sectors = $('.sectors .sector').getset(bioModel.sectors, bioViewModel['bioSectors']);
				bioViewModel.init.locations = $('.locations .location').getset(bioModel.locations, bioViewModel['bioLocations']);
				bioViewModel.init.roles = $('.roles .role').getset(bioModel.roles, bioViewModel['bioRoles']);
				if (bioModel.criteria) {
					if (bioModel.criteria.searchTerm) $('#searchfield')[0].value = bioModel.criteria.searchTerm;
					$('.sectors')[0].selectedIndex = bioModel.criteria.sectorIndex;
					$('.locations')[0].selectedIndex = bioModel.criteria.locationIndex;
					$('.roles')[0].selectedIndex = bioModel.criteria.roleIndex;
				}
				break;
			case ('team.02.html') :
				id = location.hash.slice(1);
				$('#main .generic .tableview .template').getmpl(bioModel.details[id].portfolio);
				bioViewModel.init.stats = $('#main .person').getset(bioModel.details[id], bioViewModel['bioStats']);
				bioViewModel.init.description = $('#main .generic').getset(bioModel.details[id], bioViewModel['bioDescription']);
				bioViewModel.init.affiliates = $('#main .generic .tableview .template').getset(bioModel.details[id].portfolio, bioViewModel['bioAffiliations']);
				break;
			case ('team.03.html') :
				id = location.hash.slice(1);
				bioViewModel.init.form = $('#main .mailto').getset(bioModel.details[id], bioViewModel['bioEmailForm']);
				break;
		}
	}
	
	bioViewModel['bioList'] = {
		biopic$src: {imageUrl: 'https://www.intelportfolio.com/companyLogos/spacer.gif'},
		person$innerHTML: {name: ''},
		jobTitle$innerHTML: {title: ''},
		team$href: {id: function () {return this != '' ? 'team.02.html#' + this : '#'}}
	};

	bioViewModel['bioSectors'] = {
		innerHTML: {name: ''},
		value: {name: ''}
	};

	bioViewModel['bioLocations'] = {
		innerHTML: {name: ''},
		value: {name: ''}
	};

	bioViewModel['bioRoles'] = {
		innerHTML: {name: ''},
		value: {name: ''}
	};

	bioViewModel['bioStats'] = {
		logo$alt: '',
		logo$src: {imageUrl: ''},
		name$innerHTML: {name: ''},
		btitle$innerHTML: {title: ''},
		contact$innerHTML: {name0: function () {return 'Email ' + this}},
		contact$href: {id: function () {return this != '' ? 'team.03.html#' + this : '#'}},
		focusarea$innerHTML: {focus: ''}
	};

	bioViewModel['bioDescription'] = {
		bio$innerHTML: {bio: ''}
	};

	bioViewModel['bioAffiliations'] = {
		name$innerHTML: {name: ''},
		affiliate$href: {companyUrl: function () {return this != '' ? (/http/.test(this) ? this : 'http://' + this) : '#'}}
	};
	
	bioViewModel['bioEmailForm'] = {
		memberid$value: {id: ''},
		recipient$innerHTML: {name: ''}
	}

})();

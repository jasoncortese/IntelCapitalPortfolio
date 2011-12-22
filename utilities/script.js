$(document).ready(function() {
	
	window.onload = function () {
		window.scrollTo(0, 0);
	}
	
	window.onorientationchange = function () {
		window.scrollTo(0, 0);
	}
	
	$('.disclaimer').click(function () {
		$('.disclaimer .text').toggle();
	});

	$('.showfilters .left').click(function() {
		$('.showfilters').toggle();
		$('.resetfilters').toggle();
		$('#filters').slideDown('fast');
	});

	$('.resetfilters .left').click(function() {
		$('.resetfilters').toggle();
		$('.showfilters').toggle();
		$('#filters').slideUp('fast');
	});
	
	function reset () {
		var page = $('.port1').length ? 'portfolio' : 'bio';
		$(document).trigger('startActivity');
		var search0 = $('#searchfield')[0];
		var select = $('select');
		var selected = $('select option:selected');
		window.criteria = {indexStartValue: 0} || {};
		search0.value = '';
		select[0].selectedIndex = select[0].value = 0;
		select[1].selectedIndex = select[1].value = 0;
		select[2].selectedIndex = select[2].value = 0;
		app.project.utilities.services.clearSavedData(page);
		var loaded = app.project.model[page].getList(criteria, {replace: true});
		$.when(loaded).then(function () {$(document).trigger('stopActivity')});
		return false;
	}
	
	function search () {
		var page = $('.port1').length ? 'portfolio' : 'bio';
		$(document).trigger('startActivity');
		var search0 = $('#searchfield')[0];
		var select = $('select');
		var selected = $('select option:selected');
		window.criteria = document.criteria || {};
		criteria[search0.className] = search0.value;
		for (var i=0; i < select.length; ++i) {
			delete criteria[select[i].options[1].className];
			select[i].selectedIndex = 0;
		}
		criteria.indexStartValue = 0;
		var loaded = app.project.model[page].getList(criteria, {replace: true});
		$.when(loaded).then(function () {$(document).trigger('stopActivity')});
		return false;
	}
	
	function select () {
		var page = $('.port1').length ? 'portfolio' : 'bio';
		$(document).trigger('startActivity');
		var search0 = $('#searchfield')[0];
		var select = $('select');
		window.criteria = document.criteria || {};
		delete criteria[search0.className], search0.value = '';
		for (var i=0; i < select.length; ++i) {
			if (select[i].value == '0') {
				delete criteria[select[i].options[1].className];
				select[i].selectedIndex = 0;
			} else {
				var selected = $(select[i]).children('option:selected')[0];
				criteria[selected.className] = selected.text;
			}
		}
		criteria.indexStartValue = 0;
		var loaded = app.project.model[page].getList(criteria, {replace: true});
		$.when(loaded).then(function () {$(document).trigger('stopActivity')});
		return false;
	}
	
	$('.port1 .reset').click(reset);

	$('.team1 .reset').click(reset);
	
	$('.port1 #search').submit(search);
	
	$('.team1 #search').submit(search);
	
	$('.port1 #search').bind('reset', select);
	
	$('.team1 #search').bind('reset', select);
	
	$('.port1 select').bind('change', select);
	
	$('.team1 select').bind('change', select);
	
	$('#contact').submit(function () {
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email.value)) {
			$('.modal:eq(1)').toggle();
			return false;
		}
		$(document).trigger('startActivity');
		var sent = app.project.model.bio.sendEmail({
			id: this.memberid.value,
			name: this.sender.value,
			email: this.email.value,
			message: escape(this.message.value)
		});
		$.when(sent).then(function () {$(document).trigger('stopActivity')});
		return false;
	});
	
	if (/android/i.test(navigator.userAgent)) {
		window.history.back_back = window.history.back;
	}
	alert(window.name);
	
	var back = function () {
		if (/android/i.test(navigator.userAgent)) {
			window.back();
		} else {
			history.back();
		}
		return false;
	}
	
	$('.modal:eq(0) .secondary').click(function () {
		$('.modal:eq(0)').toggle();
		return back();
	});
	
	$('.modal:eq(1) .secondary').click(function () {
		$('.modal:eq(1)').toggle();
	});
	
	$(document).bind('backbutton', back);
	
	$('#contact').bind('reset', back);
	
	$('#signup').bind('reset', back);
	
	$('#signup').submit(function () {
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email.value)) {
			$('.modal:eq(1)').toggle();
			return false;
		}
		$(document).trigger('startActivity');
		var sent = app.project.model.community.signUp({
			email: this.email.value,
			salutation: this.salutation.value,
			firstName: this.fname.value,
			lastName: this.lname.value,
			company: this.coname.value,
			title: this.title.value
		});
		$.when(sent).then(function () {$(document).trigger('stopActivity')});
		return false;
	});
	
	$('.port1 .loadmore a').click(function () {
		var loadmore = this;
		loadmore.innerHTML = 'Loading...';
		$(document).trigger('startActivity');
		setTimeout(function () {loadmore.innerHTML = 'Load More'}, 3000);
	});
	
	$('.port1 .loadmore').click(function () {
		$(document).trigger('startActivity');
		criteria = window.criteria || {};
		criteria.indexStartValue = app.project.model.portfolio.list.length +1; 
		var loaded = app.project.model.portfolio.getList(criteria);
		$.when(loaded).then(function () {
			$(document).trigger('stopActivity');
		});
		return false;
	});
	
	$('.team1 .loadmore a').click(function () {
		var loadmore = this;
		loadmore.innerHTML = 'Loading...';
		$(document).trigger('startActivity');
		setTimeout(function () {loadmore.innerHTML = 'Load More'}, 3000);
	});
	
	$('.team1 .loadmore').click(function () {
		var loadmore = this;
		loadmore.innerHTML = 'Loading...';
		$(document).trigger('startActivity');
		criteria = window.criteria || {};
		criteria.indexStartValue = app.project.model.bio.list.length +1; 
		var loaded = app.project.model.bio.getList(criteria);
		$.when(loaded).then(function () {
			$(document).trigger('stopActivity');
			loadmore.innerHTML = 'Load More';
		});
		return false;
	});
	
	$('.comm1 .loadmore a').click(function () {
		var loadmore = this;
		loadmore.innerHTML = 'Loading...';
		$(document).trigger('startActivity');
		setTimeout(function () {loadmore.innerHTML = 'Load More'}, 3000);
	});
	
	$('.comm1 .loadmore').click(function () {
		var loadmore = this;
		loadmore.innerHTML = 'Loading...';
		$(document).trigger('startActivity');
		criteria = window.criteria || {};
		criteria.page = criteria.page || 1;
		criteria.page += 1; 
		var loaded = app.project.model.community.getNews(criteria);
		$.when(loaded).then(function () {
			$(document).trigger('stopActivity');
			loadmore.innerHTML = 'Load More';
		});
		return false;
	});
	
	$('.template').live('click', function () {
		location.href = $(this).find('a')[0].href || '#';
	});
	
	$('img[src=""]').css('visibility: hidden');
	
	$('.portsection:not(:has(a))').css('visibility: hidden');
	
	$(function resizeImages() {
		if(true || window.devicePixelRatio > 1) {
			var images = $('img[src$=png]');
			for(var i=0; i < images.length; ++i) {
				var image = images[i];
				if (/companyLogos/.test(image.src)) continue;
				image.lowsrc = image.src;
				image.src = image.src.replace('.png', '@2x.png');
				//image.width(image.width() / 2);
			}
		}
	});

	(function tracking () {
		_gaq = window._gaq || [];
	
		$('.port1 .reset').click(function () {
			_gaq.push(['_trackEvent', 'Portfolio', 'Reset', '']);
		});
		
		$('.port1 #search').bind('change', function () {
			_gaq.push(['_trackEvent', 'Portfolio', 'Search', $('#searchfield')[0].value]);
		});
		
		$('.port1 .sectors').bind('change', function () {
			_gaq.push(['_trackEvent', 'Portfolio', 'Filter: Sectors', $('select option:selected')[0].value]);
		});
		
		$('.port1 .locations').bind('change', function () {
			_gaq.push(['_trackEvent', 'Portfolio', 'Filter: Locations', $('select option:selected')[1].value]);
		});
		
		$('.port1 .funds').bind('change', function () {
			_gaq.push(['_trackEvent', 'Portfolio', 'Filter: Funds', $('select option:selected')[2].value]);
		});
		
		$('.port1 .loadmore').click(function () {
			_gaq.push(['_trackEvent', 'Portfolio', 'Load More', '']);
		});
	
		$('.team1 .reset').click(function () {
			_gaq.push(['_trackEvent', 'Team', 'Reset', '']);
		});
		
		$('.team1 #search').bind('change', function () {
			_gaq.push(['_trackEvent', 'Team', 'Search', $('#searchfield')[0].value]);
			window.location = '#';
		});
		
		$('.team1 .sectors').bind('change', function () {
			_gaq.push(['_trackEvent', 'Team', 'Filter: Sectors', $('select option:selected')[0].value]);
		});
		
		$('.team1 .locations').bind('change', function () {
			_gaq.push(['_trackEvent', 'Team', 'Filter: Locations', $('select option:selected')[1].value]);
		});
		
		$('.team1 .roles').bind('change', function () {
			_gaq.push(['_trackEvent', 'Team', 'Filter: Roles', $('select option:selected')[2].value]);
		});
		
		$('.team1 .loadmore').click(function () {
			_gaq.push(['_trackEvent', 'Team', 'Load More', '']);
		});
		
		$('.team3 #contact').submit(function () {
			_gaq.push(['_trackEvent', 'Team', 'Send Email', this.memberid.value]);
		})
		
		$('.comm3 #signup').submit(function () {
			_gaq.push(['_trackEvent', 'Community', 'Newsletter Subscription', '']);
		})
	
	})();

});


function onLoad() {
    var intervalID = window.setInterval(
      function() {
          if (PhoneGap.available) {
              window.clearInterval(intervalID);
              $(document).trigger('ready');
          }
      },
      500
    );
}

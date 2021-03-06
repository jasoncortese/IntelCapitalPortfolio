(function () {

    var utilities = app.project.utilities;

    // **************************************************************************************
    //  Services wrapper object for 
    // **************************************************************************************
    var services = app.project.utilities.services = new function () {

        var services = this.table = []; //collection of all data services
        services.paramsList = []; //library of passed service params

        var getPromise = this.getPromise = function (serv, params) {
            var pstring = JSON.stringify(params);
            var pindex = services.paramsList[pstring] = services.paramsList[pstring] || services.paramsList.push(pstring);
            var loaded = services[serv][pindex - 1];
            if (!loaded) {
                loaded = services[serv][pindex - 1] = new $.Deferred();
                loaded.promise.serv = serv, loaded.promise.pstring = pstring, loaded.promise.pindex = pindex;
                $(document).bind(serv + 'Success', function (e) { loaded.resolve(e) });
            }
            return loaded.promise();
        }

        var releaseData = this.releaseData = function (servs) {
            if (!servs) {//release all
                servs = [];
                for (var x in services) servs.push(x);
            }
            if (!(servs instanceof Array)) servs = [servs];
            var plist = services.paramsList;
            for (var i = 0; i < servs.length; ++i) {
                if (!services[servs[i]]) continue;
                for (var j = 0; j < plist.length; ++j) {
                    delete services[servs[i]][j];
                }
            }
        }

        /**
        *	getDataServiceFactory
        *	@param serviceUrl: key from utilities.constants url mapping
        *	@param doneCallback: optional onSuccess callback function
        *	@param failCallback: optional onFailure callback function
        *	@return dataService method:
        *		@param params: optional map of parameters to pass to serviceUrl
        *		@return data
        *	NOTE: $.Xhr fires custom events <serviceUrl>Called, <serviceUrl>Callback, <serviceUrl>Success, <serviceUrl>Failure
        */
        var getDataServiceFactory = this.getDataServiceFactory = function (serviceUrl, doneCallback, failCallback) {
            //if serviceUrl is a key (default) then look up static url by key
            //else if serviceUrl is a hardcoded url then parse a service name from the url
            var url = utilities.constants[serviceUrl] || serviceUrl;
            var serv = serviceUrl.split('?').slice(0).toString().split('/').slice(-1).toString();

            /*if (utilities.constants.showIndicator) {
            $(document).bind(serv + 'Called', utilities.startActivityIndicator);
            $(document).bind(serv + 'Callback', utilities.stopActivityIndicator);
            }*/

            services[serv] = function (params, data) {
                var promise = getPromise(serv, params);
                if (!promise.isResolved() || !utilities.constants.useStorage) {
                    var paramString = '?callback=?';
                    for (x in params) paramString += '&' + x + '=' + escape(params[x]);
                    var script = $.getJSON(url + paramString, function (json) {
                        //var json = $.parseJSON(json.responseText.split('<p>')[1].split('</p')[0])[0];
                        json._data = data || {};
                        doneCallback(json);
                        $(document).trigger(serv + 'Success');
                    });
                }
                return promise;
            }

            return services[serv];
        }

        /**
        *	getStaticDataServiceFactory
        *	@param serviceUrl: key from utilities.constants url mapping
        *	@param doneCallback: optional onSuccess callback function
        *	@param failCallback: optional and superfluous
        *	@return staticDataService method:
        *		@param data: static data to pass thru
        *		@return data
        */
        var getStaticDataServiceFactory = this.getStaticDataServiceFactory = function (serviceUrl, doneCallback, failCallback) {
            var serv = serviceUrl.split('?').slice(0).toString().split('/').slice(-1).toString();

            services[serv] = function (params, data) {
                //here params is passed thru as the data returned from the service
                //the doneCallback can alternatively reference any other data object
                var promise = getPromise(serv, params);
                if (!promise.isResolved() || !utilities.constants.useStorage) {
                    params = params || {};
                    params._data = data || {};
                    doneCallback(params);
                    $(document).trigger(serv + 'Success');
                }
                return promise;
            }
            return services[serv];
        }
    }

    namedStorage = new function () {
        this.getItem = function (name) {
            var saved = /\{|\}/.test(window.name) ? JSON.parse(window.name) : {};
            return saved[name] || '{}';
        }
        this.setItem = function (name, data) {
            var saved = /\{|\}/.test(window.name) ? JSON.parse(window.name) : {};
            saved[name] = data;
            window.name = JSON.stringify(saved);
            return saved[name];
        }
        this.removeItem = function (name) {
            var saved = /\{|\}/.test(window.name) ? JSON.parse(window.name) : {};
            delete saved[name];
            window.name = JSON.stringify(saved);
            return saved[name];
        }
        this.clear = function () {
            window.name = '';
        }
    }

    cookieStorage = new function () {
        var now = (new Date()).getTime();
        var later = (new Date(now + 86400000)).toUTCString();
        var loadCookie = function () {
            var str = '';
            for (var i = 0; i < 40; ++i) {
                var cookie = document.cookie.split('storage' + i + '=');
                if (cookie[1]) str += cookie[1].split(';')[0];
            }
            return unescape(str);
        }
        var saveCookie = function (str, exp) {
            var str = escape(str);
            for (var i = 0; i < 40; ++i) {
                var chunk = str.substr(i * 4000, 4000);
                document.cookie = 'storage' + i + '=' + chunk + ';expires=' + exp + ';path=/;';
            }
        }

        this.getItem = function (name) {
            var cookie = loadCookie();
            var saved = /\{|\}/.test(cookie) ? JSON.parse(cookie) : {};
            return saved[name] || '{}';
        }
        this.setItem = function (name, data) {
            var cookie = loadCookie();
            var saved = /\{|\}/.test(cookie) ? JSON.parse(cookie) : {};
            saved[name] = data;
            saveCookie(JSON.stringify(saved), later);
            return saved[name];
        }
        this.removeItem = function (name) {
            var cookie = loadCookie();
            var saved = /\{|\}/.test(cookie) ? JSON.parse(cookie) : {};
            delete saved[name];
            saveCookie(JSON.stringify(saved), later);
            return saved[name];
        }
        this.clear = function () {
            saveCookie('', now);
        }
    }

    savedData = {};

    window.storage = namedStorage; // android testing cookieStorage;

    services.getSavedData = function (name, param) {
        if (!savedData[name]) savedData[name] = {};
        //if (/"name"\:\{\}/.test(storage.getItem(name))) services.clearSavedData(name);
        var saved = JSON.parse(storage.getItem(name));
        if (param) {
            if (saved[param]) savedData[name][param] = saved[param];
        } else for (x in saved) {
            if (saved[x]) savedData[name][x] = saved[x];
        }
        return JSON.parse(JSON.stringify(param ? saved[param] : saved));
    }

    services.setSavedData = function (name, param, data, append) {
        if (!savedData[name]) services.getSavedData(name);
        var data = JSON.parse(JSON.stringify(data));
        if (param) {
            if (append && savedData[name][param]) savedData[name][param] = savedData[name][param].concat(data);
            else savedData[name][param] = data;
        } else {
            if (append && savedData[name]) for (x in data) savedData[name][x] = data[x];
            else savedData[name] = data;
        }
        var saved = JSON.stringify(savedData[name]);
        storage.setItem(name, saved);
    }

    services.clearSavedData = function (name, param, empty) {
        empty = empty || {};
        if (name) {
            if (param) {
                if (savedData[name]) savedData[name][param] = empty;
                services.setSavedData(name, param, empty);
                var saved = JSON.stringify(savedData[name]);
                storage.setItem(name, saved);
            } else {
                savedData[name] = empty;
                storage.removeItem(name);
            }
        } else {
            savedData = empty;
            storage.clear();
        }
    }

    services.init = function () {
    };

    $(function () {
        $('body').append('<div class="activity"><img src="../images/loading.gif"/></div>');

        $(window).bind('scroll', function () {
            $('.activity')[0].style.top = window.pageYOffset + 'px';
        })

        $(document).bind('startActivity', function () {
            $('.activity')[0].style.top = window.pageYOffset + 'px';
            $('.activity')[0].style.display = 'block';
            var lmb = $('#loadMoreButton');
            if (lmb) lmb.html('Loading...');
            setTimeout(function () { $(document).trigger('stopActivity') }, 15000);
        })

        $(document).bind('stopActivity', function () {

            var lmb = $('#loadMoreButton');
            if (lmb) setTimeout(function () { lmb.html('Load More'); });
            setTimeout(function () { $('form').toggle(), $('form').toggle() }, 1000);
            if (/android/i.test(navigator.userAgent)) {
                setTimeout(function () { $('.activity')[0].style.display = 'none' }, 1000);
                setTimeout(function () { $('form').toggle(), $('form').toggle() }, 1000);
            } else {
                setTimeout(function () { $('.activity')[0].style.display = 'none' }, 1000);
            }
        })
    });

})();
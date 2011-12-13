(function ($) {
	
	$.getmpl = $.fn.getmpl = function (m) {
		var tmpl = $(this.selector).slice(-1)[0];
		while (m.length > this.length) {
			this.push($(tmpl).after($(tmpl).clone()));
		}
		//while (m.length < this.length) {
		//	this.pop($(tmpl).remove());
		if (m.length < this.length) {
			var extra = $(this.selector).slice(m.length - this.length);
			$(extra).remove();
		}
	}
	
	/* 
	 * GetSet:
	 * 		dynamically binds model to view based on view_model declaration
	 * Usage: 
	 *		view_model = {style$height: {data$height: 50}};
	 *		model = [{data: {height: 100}}];
	 *		$('view.selector').getset(model, view_model);
	 * Notes:
	 * 		_ acts as . placeholder, use __ to escape underscores
	 * 		if _param not found then looks for descendant classname
	 * 		value acts as default
	 * 		if value is a function then it is applied as a transform
	 * 		view_model can also assign static values/functions
	 *		both model and view_model can be updated on the fly
	 * 		if model is array then loops over selected elements
	 */
	$.getset = $.fn.getset = function (m, vm) {
		var setters = [];
		
		this.each(function (i) {
			//TODO: fix issue with multiple views using same model on page
			var mi = m[i] || m[0] || m;
			
			for (var x in vm) for (var y in object(vm, x)) {
				var $m = subject(mi, y), $v = subject(this, x);
				$m.o[$m.p] = new getset($m.o, $m.p, $v.o, $v.p, x, y);
			}
			
			function getset (mo, mp, vo, vp, x, y) {
				var self = this;
				var value = mo[mp];
				
				var getter = this.valueOf = this.toString = function () {
					return value;
				}
				
				var setter = function () {
					if (typeof vm[x] != 'object' || !(y in vm[x])) {
						for (y in object(vm, x)) {
							var $m = subject(mi, y);
							mo[mp] = value, mo = $m.o, mp = $m.p;
						}
					}
					
					if (mo[mp].constructor.toString() == getset.toString()) return;
					
					vo[vp] = (typeof vm[x][mp] == 'function') ? vm[x][mp].call(mo[mp]) : (mo[mp] || vm[x][mp]);
					
					value = mo[mp];
					mo[mp] = self;
				}
				
				setter(), setters.push(setter);
				
				return this;
			}
			
			function object (o, p) {
				//returns coerced object[parameter]
				mi[''] = false;
				if (typeof o[p] != 'object') o[p] = {'': o[p]};
				return o[p];
			}
			
			function subject (o, p) {
				//returns descendant {object, parameter}
				for (var $o = o, $p = p.split('$'); $p.length > 1;) {
					if ($p[0] in $o) {
						$o = $o[$p.shift()];
					} else {
						$o = $($o).find('.' + $p.shift())[0];
					}
				}
				return {o: $o, p: $p.shift()};
			}
			
			return this;
		});

		var timer = setInterval(function () {
			for (var i=0; i < setters.length; ++i) {
				if (typeof setters[i] == 'function') setters[i]();
			}
		}, 10000)
		
		return timer;
	}
	
	//TODO: remove this once Intel updates their web services to support jsonp
	//@author James Padolsey (http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/)
	$._ajax = (function(_ajax){
	    
	    var protocol = location.protocol,
	        hostname = location.hostname,
	        exRegex = RegExp(protocol + '//' + hostname),
	        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
	        query = 'select * from html where url="{URL}" and xpath="*"';
	    
	    function isExternal(url) {
	        //return !exRegex.test(url) && /:\/\//.test(url);
	        return /intelportfolio/.test(url);
	    }
	    
	    return function(o) {
	        
	        var url = o.url;
	        
	        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
	            
	            // Manipulate options so that JSONP-x request is made to YQL
	            
	            o.url = YQL;
	            o.dataType = 'json';
	            
	            o.data = {
	                q: query.replace(
	                    '{URL}',
	                    url + (o.data ?
	                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
	                    : '')
	                ),
	                format: 'xml'
	            };
	            
	            // Since it's a JSONP request
	            // complete === success
	            if (!o.success && o.complete) {
	                o.success = o.complete;
	                delete o.complete;
	            }
	            
	            o.success = (function(_success){
	                return function(data) {
	                    
	                    if (_success) {
	                        // Fake XHR callback.
	                        _success.call(this, {
	                            responseText: data.results[0]
	                                // YQL screws with <script>s
	                                // Get rid of them
	                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
	                        }, 'success');
	                    }
	                    
	                };
	            })(o.success);
	            
	        }
	        
	        return _ajax.apply(this, arguments);
	        
	    };
	    
	})($.ajax);

	$.Xhr = $.fn.Xhr = function (method, type, url, serv, doneCallback, failCallback) {
		var Xhr = Ti.Network.createHTTPClient();
		Ti.App.fireEvent(serv + 'Called', this);

		Xhr.onerror = function(e) {
			//Ti.API.error(e); //uncommenting this causing crash when app loses connectivity in transit
			Ti.App.fireEvent(serv + 'Callback', this);
			if (failCallback) failCallback();
			Ti.App.fireEvent(serv + 'Failure', this);
		}
		
		Xhr.onload = function() {
			Ti.App.fireEvent(serv + 'Callback', this);			
			if (this.status == 404) return Xhr.abort();
			
			var data = this;
			try {
				if (typeof this.responseText != 'undefined' && !/AccessDenied/.test(this.responseText)) {
					if (/<html>/i.test(this.responseText)) this.dataType = 'HTML';
					else this.dataType = this.dataType || type;
					
					switch (this.dataType) {
						case 'XML':
							data = this.responseXML;
						break;
						case 'JSON':
							if (this.responseText.split('{').length == 1) this.responseText = $.csvToJson(this.responseText);
							this.responseText = this.responseText.replace(/[\n\r\t]/g, '  ').replace(/\�/g, '\'');
							if (this.responseText.charAt(1) == "'") this.responseText = this.responseText.replace(/\'([^\'\"\[\]\{\}]*)\'/g, '"$1"');
							data = JSON.parse(this.responseText);
						break;
						default:
							data = this.responseText;
						break;
					}
				}
			} catch (e) {
			}
			
			if (data.status == 'FAIL' || type != this.dataType) {
				if (failCallback) failCallback(data);
				Ti.App.fireEvent(serv + 'Failure', data);
			} else {
				if (doneCallback) doneCallback(data);
				Ti.App.fireEvent(serv + 'Success', data);
			}
		}

		if (typeof url == 'string' && !/http/.test(url)) {
			//local file
			url = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, url.split('?')[0]);
			url = url.exists() ? url.read().text || '' : '';
			method = 'STATIC';
		}
		
		if (method == 'STATIC') Xhr.onload.call({responseText: url});
		else if (Titanium.Network.online) Xhr.open(method, url), Xhr.send();
		else Ti.App.fireEvent('NoConnectivity');
		
	}
		
	$.csvToJson = $.fn.csvToJson = function (csvText) {
		// adapted from http://www.cparker15.com/utilities/csv-to-json/
		var message = "";
		var error = false;
		var jsonText = "";
		
		if (csvText == "") {return {}} 
	
		if (!error) {
			csvRows = csvText.split(/[\r\n]/g); // split into rows
			
			// get rid of empty rows
			for (var i = 0; i < csvRows.length; i++) {
				if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "") {
					csvRows.splice(i, 1);
					i--;
				}
			}
			
			if (csvRows.length < 2) {return {}}
			else {
				objArr = [];
				
				for (var i = 0; i < csvRows.length; i++) {
					csvRows[i] = parseCSVLine(csvRows[i]);
				}
				
				for (var i = 1; i < csvRows.length; i++) {
					if (csvRows[i].length > 0) objArr.push({});
				
					for (var j = 0; j < csvRows[i].length; j++) {
						objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
					}
				}
				
				jsonText = JSON.stringify(objArr, null, "\t");
				
				return jsonText;
			}
		}
	
		function parseCSVLine (line) {
			//TODO: this method can be cleaned up now that it's using a regex instead of split
			line = line.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\"\\,]*))/gi);
			for (var i=1; i < line.length; ++i) {
				if (line[i-1] != '') line.splice(i,1);
			}

			// check for splits performed inside quoted strings and correct if needed
			for (var i = 0; i < line.length; i++) {
				var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
				var quote = "";
				if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
				if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";
			
				if (quote != "") {
					var j = i + 1;
					
					if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
				
					while (j < line.length && chunk.charAt(chunk.length - 1) != quote) {
						line[i] += ',' + line[j];
						line.splice(j, 1);
						chunk = line[j].replace(/[\s]*$/g, "");
					}
					
					if (j < line.length) {
						line[i] += ',' + line[j];
						line.splice(j, 1);
					}
				}
			}
		
			for (var i = 0; i < line.length; i++) {
				// remove leading/trailing whitespace
				line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
				
				// remove leading/trailing quotes
				if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
				else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
			}
			
			return line;
		}
		
	}

})(jQuery);

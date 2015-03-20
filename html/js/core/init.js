
	var init = function () {
		this.construct();
	}

	init.prototype = {
		defaultModule: "main",
		includes: [
			"html/js/3rdparty/handelbars.js"
		],	
		loadedModules: {},
		lastExecuted: {},
		mainArea: null,
		handelbars: null,

		construct: function () {

			var self = this;

			self.loadIncludes(self.includes, function () {

				$("body").prepend('<div class="content"></div><div class="handelbars"></div>');
				self.mainArea = $(".content");
				self.handelbars = $(".handelbars").hide();

				self.executeModule("main");

			});

		}, 

		/*
		 *	This function loads an array of files and lets the user run a function after they are loaded
		 *	@param array - files - A array of files to load
		 *	@param function - callback - A function to be run after the files have been included
		 */
		loadIncludes: function (files, callback) {

			var self = this;

			if (typeof callback == "undefined") callback = false;

			$.ajax({
				url: files.shift(), 
				dataType: "script", 
				cache: true, 
				complete: function () {
					if (files.length == 0) {
						if (typeof callback == "function") callback();
					} else {
						self.loadIncludes(files, callback);
					}
				}
			});


		},

		/*
		 *	This function will load a module and its template file
		 *	@param string - moduleName - The name of the module you want to load
		 *	@param function - callback - A function to be run after the module has loaded
		 */

		LoadModule: function(moduleName, callback) {

			var self = this;

			if (typeof self.loadedModules[moduleName] != "undefined") {
				var module = self.loadedModules[moduleName];
				if (typeof callback == "function") callback(module);
			}

			var script = "modules/"+moduleName+"/module."+moduleName+".js";
			var template = "modules/"+moduleName+"/module."+moduleName+".html";

			$.ajax({
				url: template, 
				complete: function (data) {

					self.handelbars.append(data.responseText);

					$.ajax({
						url: script, 
						dataType: "script", 
						complete: function () {

							eval("var module = new "+moduleName+"();");
							
							if (typeof module.includes == "object") {
								self.loadIncludes(module.includes, function () {
									self.loadedModules[moduleName] = module;
									if (typeof callback == "function") callback(module);
								});
							} else {
								self.loadedModules[moduleName] = module;
								if (typeof callback == "function") callback(module);
							}

						}
					})

				}
			});

		}, 

		/*
		 * This function will load and execute a module
		 * @param string - moduleName - The name of the module to execurte
		 */
		executeModule: function (moduleName) {
			var self = this;

			if (typeof self.lastExecuted.destruct == "function") self.lastExecuted.destruct();

			self.LoadModule(moduleName, function (obj) {
				self.lastExecuted = obj;
				obj.construct();

			});

		}, 

				/**
		 * This will load a template file and parse and poplulate a element with the parsed template
		 * @param string template - The template file to use
		 * @param object element  - The JQuery object to load the themplate into, if this is set as true it will return the HTMl
		 * @param object opts     - The options to be parsed within the template
		 * @param boolean after  - If TRUE this will add the parsed HTML after the element if FALSE or unset it will add the html within the element
		 * @param boolean append  - If TRUE this will append the parsed HTML to the element if FALSE or unset it will add the html within the element
		 * @return string - If element is TRUE this will contain the parsed HTML template
		 */
		parseTemplate: function (template, element, opts, after, append) {
			
			var self = this;
			
			if (typeof after == 'undefined') {
				after = false;
			}
						
			var html = $("#"+template).html();
			var template = Handlebars.compile(html);
			
			if (typeof opts == 'undefined') {
				opts = {};
			}
			
			if (typeof element == 'object') {
				if (after) {
					element.after(template(opts));
				} else if (append) {
					element.append(template(opts));
				} else {
					element.html(template(opts));
				}
			} else if (typeof element == 'boolean') {
				return template(opts);
			}
			
		},


	};

	core = new init();
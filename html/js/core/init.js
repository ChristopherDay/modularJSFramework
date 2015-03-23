
	var init = function () {
		this.construct(); /* When the class is called run the construct function */
	}

	init.prototype = {
		defaultModule: "main", /* Change this to what ever you want the first module to be executed */
		includes: [
			"html/js/3rdparty/handelbars.js"
		],/* Set up files that need to be included */
		loadedModules: {}, /* An object to contain all of the modules that have been loaded */
		lastExecuted: {}, /* The object of the last executed module */
		mainArea: null, /* a JQuery pointer to the main area */
		handelbars: null, /* a JQuery pointer to the element that holds the handelbars templates */

		construct: function () {

			var self = this;

			/* Load the includes before starting */
			self.loadIncludes(self.includes, function () {

				/* Once the includes are loaded make the default html structure */
				$("body").prepend('<div class="content"></div><div class="handelbars"></div>');

				/* Set up the containers */
				self.mainArea = $(".content");
				self.handelbars = $(".handelbars").hide();

				/* Execute the default module */
				self.executeModule(self.defaultModule);

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

			/* Load the includes via ajax */
			$.ajax({
				url: files.shift(), 
				dataType: "script", 
				cache: true, 
				complete: function () {
					/* if the files array is empty run the callback otherwise continue loading files */
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

		loadModule: function(moduleName, callback) {

			var self = this;

			/* If the module has already been loaded call the module from memory and return the object */
			if (typeof self.loadedModules[moduleName] != "undefined") {
				var module = self.loadedModules[moduleName];
				if (typeof callback == "function") callback(module);
				return false;
			}

			/* make the default filepaths to the modules */
			var script = "modules/"+moduleName+"/module."+moduleName+".js";
			var template = "modules/"+moduleName+"/module."+moduleName+".html";

			/* Load the template file first */
			$.ajax({
				url: template, 
				complete: function (data) {
					/* append the template to the HTML document*/
					self.handelbars.append(data.responseText);

					/* Load the module */
					$.ajax({
						url: script, 
						dataType: "script", 
						complete: function () {
							/* run the module */
							eval("var module = new "+moduleName+"();");
							
							/* Check to see if the module has any includes if it has include them then run the module and if there is a callback run it */
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

			/* If the loaded module has a destruct function run it */
			if (typeof self.lastExecuted.destruct == "function") self.lastExecuted.destruct();

			/* Load the module and run the construct function */
			self.loadModule(moduleName, function (obj) {
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
						
			/* Load the template file from the HTML */
			var html = $("#"+template).html();
			/* Compile the template */
			var template = Handlebars.compile(html);
			
			if (typeof opts == 'undefined') {
				opts = {};
			}
			
			/* Draw the template */
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
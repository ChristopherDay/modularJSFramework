	
	var main = function () {}
	
	main.prototype = {

		/*
		 * 	@desc The function that is called when the module is executed
		 */
		construct: function () {
			
			var self = this;

			/* Load the main Template file */
			core.parseTemplate("Main-Template", core.mainArea, {
				header: "Hello World", /* Template variable */
				text: "This was drawn dynamicly", /* Template variable */
				menu: [ /* Template variable - will display the menu */
					{name:"Main Module", module: "main"}, /* Link description and module name */
					{name:"Test Module", module: "testModule"}
				]
			});

			/* Update the main area to be the .module-loader div this way we can use this to redraw modules into the page without redrawing the whole html document */
			core.mainArea = $(".module-loader")

			/* Bind the JQuery events to elements on the page */
			self.bindEvents();

		}, 

		/*
		 * @desc this fuinction will bind all of the events to the main template, i.e. making links executable
		 */
		bindEvents: function () {

			$("[data-execute-module]").unbind().bind("click", function () {
				var moduleName = $(this).attr("data-execute-module");
				core.executeModule(moduleName);
			});

		}, 

		/*
		 * @desc this is a test module that i call in the module "testModule"
		 * @param varchar - text - The message to be displayed
		 */
		alertMessage: function (text) {
			alert(text);
		}

	};
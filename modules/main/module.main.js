	
	var main = function () {}
	
	main.prototype = {

		construct: function () {
			var self = this;
			core.parseTemplate("Main-Template", core.mainArea, {
				header: "Hello World",
				text: "This was drawn dynamicly", 
				menu: [
					{name:"main"},
					{name:"page1"},
					{name:"page2"}
				]
			});

			self.bindEvents();
		}, 

		bindEvents: function () {

		}

	};
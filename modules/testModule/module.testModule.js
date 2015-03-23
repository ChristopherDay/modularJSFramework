	
	var testModule = function () {};

	testModule.prototype = {

		construct: function () {

			console.log(1);

			/* Load module into mainArea with no options */
			core.parseTemplate("Test-Module-Main", core.mainArea);

			/* Load a diffrent module without executing it and call a function to alert a message */
			core.loadModule("main", function (obj) {
				obj.alertMessage("This was called from the 'testModule' module");
			});

		}

	};
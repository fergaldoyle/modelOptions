angular.module("modelOptions", []).directive("ngModelOptions", function () {
	return {
		priority: 1,
		restrict: "A",
		//require: "ngModel",
		require: ['ngModel'/*, '^?select'*/],
		link: function (scope, elm, attr, ctrls) {

			function apply() {

				var value;

				switch (tagType) {
					case "inputradio":
						if (attr.ngValue) {
							value = scope.$eval(attr.ngValue);
						} else {
							value = elm.val();
						}
						break;
					case "inputcheckbox":
						value = elm.prop("checked");
						break;
					case "select":
						value = getSelectOption();
						break;
					default:
						value = elm.val();
				}

				if (!attr.ngTrim || attr.ngTrim.toLowerCase() !== "false") {
					value = value.replace(/^\s+|\s+$/g, "");
				}

				scope.$apply(function () {
					ctrls[0].$setViewValue(value);
					/*
					// remove the first option if it's a dummy
					if (ctrls[1]) {
						if (elm[0].options[0].value === "?") {
							elm[0].remove(0);
						}
					}
					*/
				});
			}

			function getSelectOption() {

				if (!attr.ngOptions) {
					throw "Must have ng-options";
				}

				var match = attr.ngOptions.match(NG_OPTIONS_REGEXP),
					track = match[8],
					valuesName = match[7],
					values = scope.$eval(valuesName),
					index,
					val = elm.val();

				// if track by is specified
				// use the track by value as
				// a key to find the index
				if (track) {
					angular.forEach(values, function (item, i) {
						if (item[track.replace(/^.*?\./, "")] == val) {
							index = i;
						}
					});
				} else {
					index = val;
				}

				// value is a property of an object
				if (/.*\..*/.test(match[1])) {
					console.log(match[1].replace(/^.*?\./, valuesName + "[" + index + "]."));
					return scope.$eval(match[1].replace(/^.*?\./, valuesName + "[" + index + "]."));
				} else { // value is an object
					return values[index];
				}

				/*
					var displayFn = $parse(match[2] || match[1]),
					valueName = match[4] || match[6],
					keyName = match[5],
					groupByFn = $parse(match[3] || ''),
					valueFn = $parse(match[2] ? match[1] : valueName),
					valuesFn = $parse(match[7]),
					track = match[8],
					trackFn = track ? $parse(match[8]) : null,
					optionGroupsCache = [[{element: selectElement, label:''}]];
				*/

			}

			var timer,
				NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
				//defaultEvents = ["keydown", "change", "blur", "input", "click"],
				tagType = elm[0].nodeName.toLowerCase() + (attr.type || ""),
				defaultEvents = [],
				debounces = {},
				defaults = {
					debounce: 0,
					updateOn: "default"
				},
				options = angular.extend(defaults, scope.$eval(attr.ngModelOptions)),
				multiDebounce = typeof options.debounce === "object",
				updateOnSplit = options.updateOn.split(" ");

			if (tagType === "inputtext" || tagType === "textarea") {
				defaultEvents = ["keydown", "input", "change"];
			} else if (tagType === "inputradio" || tagType === "inputcheckbox") {
				defaultEvents = ["click"];
			} else if (tagType === "select") {
				defaultEvents = ["change"];
			} else {
				defaultEvents = ["keydown", "input", "change"];
			}

			if (attr.ngOptions) {
				console.log(attr.ngOptions.match(NG_OPTIONS_REGEXP));
			}

			// unbind default events to prevent automatic model updates	
			angular.forEach(defaultEvents, function (event) {
				// ie8 does not support some events
				// use try catch to mask this
				try { elm.off(event); } catch (e) { }
			});

			// debounce option can be number or object
			// populate the debounces object with relevant 
			// debounce value per event
			angular.forEach(updateOnSplit, function (event) {
				if (multiDebounce) {
					debounces[event] = options.debounce[event];
				} else {
					debounces[event] = options.debounce;
				}
			});

			// default events
			if (options.updateOn.match(/default/i)) {
				elm.on(defaultEvents.join(" "), function (e) {
					var delay = options.debounce["default"] || options.debounce || 0;
					clearTimeout(timer);
					timer = setTimeout(function () {
						apply();
					}, delay);
				});
			}

			// the other events if specified
			//console.log(updateOnSplit);
			angular.forEach(updateOnSplit, function (event) {
				if (event === "default") {
					return;
				}

				var delay = debounces[event];
				if (typeof delay === "undefined") {
					delay = options.debounce["default"] || 0;
				}

				elm.on(event, function (e) {
					clearTimeout(timer);
					timer = setTimeout(function () {
						apply();
					}, delay);
				});
			});

		}
	};
});
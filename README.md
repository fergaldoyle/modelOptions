ngModelOptions for AngularJS 1.2
================================
Directive to bring functionality similar to the new Angular 1.3 ngModelOptions to Angular 1.2, for those stuck supporting IE8 and/or legacy code.

Works well with all input types (text, number, date, radio, checkbox, select) and doesn't break Angular validation.

###Example
Include the module
    
    angular.module("myApp", ["modelOptions"]);
    
Pass some options

	<input type="text"
	   ng-model="my.model"
	   ng-model-options="{ debounce: 1000 }" />

Supports the same syntax as official ngModelOptions

	<textarea ng-model="my.model"
			  ng-model-options="{ updateOn: 'default blur', debounce: {'default': 2000, 'blur': 500} }">
	</textarea>


###Limitations
####Select
 With `select` elements, the first blank dummy option is not removed when this directive is used. It won't be removed anyway due to an IE8 bug so it's best to add a blank, disabled option `<option ng-disabled="true" value=""></option>` to solve both problems.
 
####Events
Some event listeners are turned off for elements to prevent automattic model updates. e.g. angular uses the `click` event to update model for `radio` and `checkbox`. When using this directive, `ng-click` will no longer work on `radio` or `checkbox` inputs. Similarly `ng-change` will no longer work if using this directive on a `select` element.

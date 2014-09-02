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

Currently only supports the `debounce` and `updateOn` options.

####Select
 With `select` elements, the first blank dummy option is not removed when this directive is used. With IE8, the removal of this inital blank option when a valid option is selected never worked in Angular anyway, so it's best to add a disabled option `<option ng-disabled="true" value=""></option>` to the `select` element to solve both problems.
 
####Events
Some event listeners are turned off for elements to prevent automattic model updates. e.g. angular uses the `click` event to update model for `radio` and `checkbox`. When using this directive, `ng-click` will no longer work on `radio` or `checkbox` inputs. Similarly `ng-change` will no longer work if using this directive on a `select` element. To get around this use alternative events, e.g. on a `checkbox` use `ng-change` instead of `ng-click` or just `$watch` for changes on the model instead. 

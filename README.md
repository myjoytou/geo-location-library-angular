# Simple library for getting Current City, State, Country and Locality name
## [Demo](https://plnkr.co/edit/zjDqed?p=preview)
## Dependencies
	
* [Google map API](https://maps.googleapis.com/maps/api/js)
* AngularJs

## How to use it?

>It is really simple
>	* Include the **geo_library_service.js** in a script tag source and 
>	* In your angular module put a dependency for **geoAutoComplete**.
> ```javascript
>		angular.module('myApp', ['geoAutoComplete'])
>	```

This library provides you few directive for getting city, state, and current locality.
The directives are:
	* geoCity
	* geoState
	* geoNeighbourhood

They can be used like:
	
```html
	<geo_city css-class='city-box' country-city-map='countryCityMap'> </geo_city>
```

```html
	<geo_state css-class='city-box' country-state-map='countryStateMap'> </geo_state>
```
```html
	<geo_neighbourhood css-class='city-box'></geo_neighbourhood>
```

__Note:__

>	Here we have the option to define our __city__ and __state__ list.
>	In the above _html_, 'country-city-map' and 'country-state-map' expects 
>	an object containing __country__ with __cities__ and __country__ with 
>	__states__ respectively.

ex:
	
```javascript

	$scope.countryCityMap = {
	  'india': ['Chennai', 'Bangalore', 'Mumbai', 'New Delhi', 'Patna']
	};

	$scope.countryStateMap = {
	  'india': ['Karnataka', 'Bihar', 'Maharashtra', 'Punjab']
	};

```

According to this list, the select option will come. One more thing we have the option to stick our own __css__ too.

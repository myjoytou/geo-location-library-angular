(function(angular) {
  angular.module('geoAutoComplete', [])

  .service('LocationService', ["$q", function($q) {
    var getLocation = function() {
      var deferred = $q.defer();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
      } else {
        console.log("geo location not supported");
      }
      return deferred.promise;
    };
    return {
      getLongAndLat: function() {
        var deferred = $q.defer();
        getLocation().then(function(position) {
            deferred.resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      }
    };
  }])

  .service('GeoAddressDecoderService', ['$q', 'LocationService', function($q, LocationService) {
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    var geocoder = new google.maps.Geocoder();
    var geoInfo = {};
    var codeLatLng = function(lat, lng) {
      var deferred = $q.defer();
      var latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({
        'latLng': latlng
      }, function(results, status) {

        var neighborhood, area, city, state, country, postalCode, completeAddress;

        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            completeAddress = results[0].formatted_address;
            for (var i = 0; i < results[0].address_components.length; i++) {
              for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                switch (results[0].address_components[i].types[b]) {
                  case 'neighborhood':
                    neighborhood = results[0].address_components[i];
                    break;
                  case 'sublocality':
                    area = results[0].address_components[i];
                    break;
                  case 'locality':
                    city = results[0].address_components[i];
                    break;
                  case 'administrative_area_level_1':
                    state = results[0].address_components[i];
                    break;
                  case 'country':
                    country = results[0].address_components[i];
                    break;
                  case 'postal_code':
                    postalCode = results[0].address_components[i];
                }
              }
            }
            // area, city, state, country, postalCode, completeAddress
            var geoInfoHash = {
              neighborhood: neighborhood,
              area: area,
              city: city,
              state: state,
              country: country,
              postalCode: postalCode,
              completeAddress: completeAddress
            };

            deferred.resolve(geoInfoHash);

          } else {
            deferred.reject('no results found for your query');
          }
        } else {
          deferred.reject("Geocoder failed due to: " + status);
        }
      });
      return deferred.promise;
    };
    return {
      getCity: function() {
        return geoInfo.city;
      },
      getNeighborhood: function() {
        return geoInfo.neighborhood;
      },
      getArea: function() {
        return geoInfo.area;
      },
      getState: function() {
        return geoInfo.state;
      },
      getCountry: function() {
        return geoInfo.country;
      },
      getPostalCode: function() {
        return geoInfo.postalCode;
      },
      getCompleteAddress: function() {
        return geoInfo.completeAddress;
      },
      getDecodedLocation: function() {
        var deferred = $q.defer();
        LocationService.getLongAndLat().then(function(positions) {
          codeLatLng(positions.lat, positions.lng).then(function(response) {
              geoInfo = response;
              deferred.resolve(response);
            },
            function(response) {
              alert('could not locate!');
            }
          );
        });
        return deferred.promise;
      }
    };
  }])

  .directive('geoCity', [function() {
    return {
      restrict: 'E',
      scope: {
        cssClass: "@",
        countryCityMap: '='
      },
      templateUrl: 'templates/city_box.html',
      controller: ['$scope', 'GeoAddressDecoderService', function($scope, GeoAddressDecoderService) {
        $scope.geoCity = {};
        GeoAddressDecoderService.getDecodedLocation().then(function(response) {
          $scope.geoCity.availableCities = $scope.countryCityMap[GeoAddressDecoderService.getCountry().long_name.toLowerCase()].map(function(x) {
            return x.capitalize();
          });
          var city = GeoAddressDecoderService.getCity().long_name.capitalize();
          if ($scope.geoCity.availableCities.length > 0 && $scope.geoCity.availableCities.includes(city)) {
            $scope.geoCity.cityInfo = city;
          }
        });
      }]
    };
  }])

  .directive('geoState', [function() {
    return {
      restrict: 'E',
      scope: {
        cssClass: "@",
        countryStateMap: '='
      },
      templateUrl: 'templates/state_box.html',
      controller: ['$scope', 'GeoAddressDecoderService', function($scope, GeoAddressDecoderService) {
        $scope.geoState = {};
        GeoAddressDecoderService.getDecodedLocation().then(function(response) {
          $scope.geoState.availableStates = $scope.countryStateMap[GeoAddressDecoderService.getCountry().long_name.toLowerCase()].map(function(x) {
            return x.capitalize();
          });
          var state = GeoAddressDecoderService.getState().long_name.capitalize();
          if ($scope.geoState.availableStates.length > 0 && $scope.geoState.availableStates.includes(state)) {
            $scope.geoState.stateInfo = state;
          }
        });
      }]
    };
  }])

  .directive('geoNeighbourhood', [function() {
    return {
      restrict: 'E',
      scope: {
        cssClass: '@'
      },
      templateUrl: 'templates/area_box.html',
      controller: ['$scope', 'GeoAddressDecoderService', function($scope, GeoAddressDecoderService) {
        $scope.geoArea = {};
        GeoAddressDecoderService.getDecodedLocation().then(function(response) {
          $scope.geoArea.areaInfo = GeoAddressDecoderService.getArea().long_name.capitalize();
          $scope.geoArea.neighbourhood = GeoAddressDecoderService.getNeighborhood().long_name.capitalize();
          $scope.geoArea.neighbourhoodInfo = $scope.geoArea.neighbourhood + ", " + $scope.geoArea.areaInfo;
          console.log('the area is: ', $scope.geoArea.areaInfo);
        });
      }]
    };
  }]);
}(angular));

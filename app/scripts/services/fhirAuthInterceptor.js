'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirAuthInterceptor
 * @description
 * # fhirAuthInterceptor
 * Service in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirAuthInterceptor', ['fhirConfig', '$q', '$location', function (fhirConfig, $q, $location) {
  
  return {

   'responseError': function(rejection) {
      if (rejection.status == 401) {
        fhirConfig.clearAuthToken();
        $location.path('oauth');   
      }
      return $q.reject(rejection);
    }
  }

}]);


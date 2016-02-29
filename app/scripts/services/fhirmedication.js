'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirMedication
 * @description
 * # fhirMedication
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirMedication', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Medication';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all registered Medication
       * @returns {*}
       */
      getAllMedication: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return Utilities.getFhirResourceList(response.data.entry);
        });
      },
      /**
       * Empty Medication template
       * @returns { code: { text: {} }
       */
      instantiateEmptyMedication: function () {
        return {
          code: { text: {} }
        };
      }
    };
  }]);

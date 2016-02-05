'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirDeviceMetric
 * @description
 * # fhirDeviceMetric
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirDeviceMetric', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'DeviceMetric';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all registered Medication
       * @returns {*}
       */
      getAllDeviceMetrics: function () {
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
       * @returns { type: { text: {}, coding: [{}] }, color: {}, category: {}, 
            extension: [{ url: "http://sll-mdilab.net/fhir/Order#metricType", valueString: {} }] }
       */
      initiateEmptyDeviceMetric: function () {
        return {
          type: { 
            text: {}, 
            coding: [{}]
          },
          color: {},
          category: {},
          extension: [{
            url: "http://sll-mdilab.net/fhir/Order#metricType",
            valueString: {}
          }]
        };
      }
    };
  }]);
'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirPatient
 * @description
 * # fhirPatient
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirPatient', ['$http', 'fhirConfig', function ($http, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Patient';

    // Public API here
    return {
      /**
       * Get Patient by params
       * @param params A param object
       * {
       *  patientId: 'ID of a Patient',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getPatient: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourceType + '/';
        }
        url += params.patientId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Create a new Patient
       * @param patient A complete Patient to be created
       * @returns {*}
       */
      createPatient: function (patient) {
        var url = baseUrl + resourceType;
        patient.resourceType = resourceType;
        return $http({
          method: 'POST',
          url: url,
          data: patient,
          headers: fhirConfig.headers
        });
      },
      /**
       * Empty Patient template
       * @returns {{identifier: Array, address: Array, name: {given: Array, family: Array}[], telecom: {system: string}[], photo: {}}}
       */
      instantiateEmptyPatient: function () {
        return {
          identifier: [],
          address: [],
          name: [{
            given: [],
            family: []
          }],
          telecom: [{system: 'email'}, {system: 'phone'}],
          photo: [{}]
        };
      }
    };
  }]);

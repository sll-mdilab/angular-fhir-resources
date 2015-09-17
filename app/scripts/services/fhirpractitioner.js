'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirPractitioner
 * @description
 * # fhirPractitioner
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirPractitioner', ['$http', 'fhirConfig', function ($http, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Practitioner';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get a Practitioner by params
       * @param params A param object
       * {
       *  practitionerId: 'ID of a Practitioner',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getPractitioner: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourcePrefix;
        }
        url += params.practitionerId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Get all registered Practitioners
       * @returns {*}
       */
      getAllPractitioners: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          var resources = response.data.entry;
          var practitioners = [];
          for (var idx in resources) {
            practitioners.push(resources[idx].resource);
          }
          return practitioners;
        });
      },
      getResourcePrefix: function(){
        return resourcePrefix;
      },
      /**
       * Empty Practitioner template
       * @returns {{identifier: {}[], name: {}, practitionerRole: {role: {coding: {}[]}}[]}}
       */
      initiateEmptyPractitioner: function () {
        return {
          identifier: [
            {}
          ],
          name: {},
          practitionerRole: [
            {
              role: {
                coding: [
                  {}
                ]
              }
            }
          ]
        };
      }
    };
  }]);

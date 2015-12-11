'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirOrganization
 * @description
 * # fhirOrganization
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirOrganization', ['$http', '$filter', 'fhirConfig', function ($http, $filter, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Organization';

    // Public API here
    return {
      /**
       * Get Organization by params
       * @param params A param object
       * {
       *  organizationId: 'ID of an Organization',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getOrganization: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourceType + '/';
        }
        url += params.organizationId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Create a new Organization
       * @param organization A complete Organization to be created
       * @returns {*}
       */
      createOrganization: function (organization) {
        var url = baseUrl + resourceType;
        organization.resourceType = resourceType;
        return $http({
          method: 'POST',
          url: url,
          data: organization,
          headers: fhirConfig.headers
        });
      },
      /**
       * Empty Organization template
       * @returns {{ identifier: [{}], name: {} }}
       */
      instantiateEmptyOrganization: function () {
        return {
          identifier: [
            {}
          ],
          name: {}
        };
      }
    };
  }]);
'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirList
 * @description
 * # fhirList
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirList', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'List';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get a List by params
       * @param params A param object
       * {
       *  listId: 'ID of a List',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getList: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourcePrefix;
        }
        url += params.listId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Empty List template
       * @returns { code: { text: {} }
       */
      instantiateEmptyList: function () {
        return {
          status: "current",
          mode: "working",
          entry: []
        };
      }
    };
  }]);

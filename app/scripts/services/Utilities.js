'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.Utilities
 * @description
 * # Utilities
 * Service in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .service('Utilities', function () {
    return {
      formatFhirResponse: function (response) {
        var result = {};
        for (var i in response.data.entry) {
          var resource = response.data.entry[i].resource;
          var type = resource.resourceType;
          if (!result[type]) { result[type] = {}; }
          result[type][resource.id] = resource;
        }
        return result;
      },
      getFhirResourceList: function(resources) {
        var list = [];
        for (var idx in resources) {
          list.push(resources[idx].resource);
        }
        return list;
      } 
  	}
	});

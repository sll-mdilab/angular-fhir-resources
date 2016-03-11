'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirQuestionnaireResponse
 * @description
 * # fhirQuestionnaireResponse
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirQuestionnaireResponse', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'QuestionnaireResponse';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all patients
       * @returns {*} a list of Patient objects
       */
      getQuestionnaireResponsesForPatient: function (patient) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            patient: patient
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
        });
      }
    };
  }]);

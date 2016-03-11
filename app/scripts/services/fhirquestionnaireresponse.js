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
       * Get all questionnare responses for a patient
       * @returns {*} a list of QuestionnaireResponse objects
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
      },
      /**
       * Update existing QuestionnaireResponse object.
       * @param questionnaireResponse The complete updated QuestionnaireResponse object. questionnaireResponse.id determines what object will be replaced.
       * @returns {*}
       */
      updateQuestionnaireResponse: function (questionnaireResponse) {
        questionnaireResponse.resourceType = resourceType;
        var url = baseUrl + resourceType + '/' + questionnaireResponse.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: questionnaireResponse
        });
      }
    };
  }]);

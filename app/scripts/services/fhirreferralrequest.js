'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirReferralRequest
 * @description
 * # fhirReferralRequest
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirReferralRequest', ['$http', '$filter', 'fhirConfig', 'Utilities', function ($http, $filter, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'ReferralRequest';

    var defaultStatus = 'requested';

    // Public API here
    return {
      /**
       * Get ReferralRequests based on patient and status
       * @returns {*} a list of ReferralRequests
       */
      getReferralRequests: function (patient, status, includeList) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            patient: patient,
            status: status, 
            _include: includeList
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
        });
      },
      /**
       * Update existing ReferralRequest object.
       * @param encounter The complete updated ReferralRequest object. referralRequest.id determines what object will be replaced.
       * @returns {*}
       */
      updateReferralRequest: function (referralRequest) {
        var url = baseUrl + resourceType + '/' + referralRequest.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: referralRequest
        });
      },
      /**
       * Create new referralRequest.
       * @param referralRequest The complete ReferralRequest object.
       * @returns {*}
       */
      createReferralRequest: function (referralRequest) {
        referralRequest.resourceType = resourceType;
        if (!referralRequest.status) {
          referralRequest.status = defaultStatus;
        }
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: referralRequest
        });
      },
      /**
       * Empty ReferralRequest template
       * @returns {{identifier: [{}], patient: {}, type: {coding: [{}]}, requester: {}, recipient: {}, encounter: {}}
       */
      instantiateEmptyReferralRequest: function () {
        return {
          identifier: [
            {}
          ], 
          patient: {},
          requester: {},
          recipient: {},
          encounter: {}
        };
      },
      getActiveStatuses: function () {
        return ongoingStatuses;
      },
      getStatusOptions: function () {
        return statusOptions;
      }
    };
  }]);

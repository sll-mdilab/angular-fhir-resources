'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirReferralRequest
 * @description
 * # fhirReferralRequest
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirReferralRequest', ['$http', '$filter', 'fhirConfig', function ($http, $filter, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'ReferralRequest';

    var defaultStatus = 'requested';

    // Public API here
    return {
      /**
       * Get all ReferralRequests with status counted as 'Ongoing':
       *    'requested', 'active', 'accepted', 'rejected'
       * @returns {*} a list of ReferralRequests
       */
      getAllReferralRequests: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response;
        });
      },
      /**
       * Complete a referralRequest by setting the status to 'finished'
       * @param referralRequest ReferralRequest to complete.
       * @returns {*} a promise
       */
      completeReferralRequest: function (referralRequest) {
        var url = baseUrl + resourceType + '/' + referralRequest.id;
        referralRequest.status = 'completed';
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
          type: { 
            coding: [{}] 
          },
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

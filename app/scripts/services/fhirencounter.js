'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirEncounter
 * @description
 * # fhirEncounter
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirEncounter', ['$http', '$filter', 'fhirConfig', function ($http, $filter, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Encounter';
    var activeStatuses = ['planned', 'arrived', 'in-progress', 'onleave'];
    var statusOptions = {
      planned: 'Planerad',
      arrived: 'Anlänt',
      'in-progress': 'Pågående',
      onleave: 'Lämnande',
      finished: 'Klar',
      cancelled: 'Avbruten'
    };

    var defaultStatus = 'arrived';

    var statusActive = function (value) {
      return activeStatuses.indexOf(value.resource.status) >= 0;
    };
    // Public API here
    return {
      /**
       * Get all encounters with status counted as 'Active':
       *    'planned', 'arrived', 'in-progress', 'onleave'
       * @returns {*} a list of Encounters
       */
      getAllActiveEncounters: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          var activeResources = $filter('filter')(response.data.entry, statusActive);
          var activeEncounters = [];
          for (var idx in activeResources) {
            activeEncounters.push(activeResources[idx].resource);
          }
          return activeEncounters;
        });
      },
      /**
       * Discharge a patient by setting the status to 'finished' and period.end to current time.
       * @param encounter encounter to discharge.
       * @returns {*} a promise
       */
      dischargePatientByEncounter: function (encounter) {
        var url = baseUrl + resourceType + '/' + encounter.id;
        encounter.status = 'finished';
        if (!encounter.period) {
          encounter.period = {};
        }
        encounter.period.end = new Date().toISOString();
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: encounter
        });
      },
      /**
       * Create new encounter.
       * @param encounter The complete Encounter object.
       * @returns {*}
       */
      createEncounter: function (encounter) {
        encounter.resourceType = resourceType;
        if (!encounter.status) {
          encounter.status = defaultStatus;
        }
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: encounter
        });
      },
      /**
       * Update existing Encounter object.
       * @param encounter The complete updated Encounter object. encounter.id determines what object will be replaced.
       * @returns {*}
       */
      updateEncounter: function (encounter) {
        encounter.resourceType = resourceType;
        var url = baseUrl + resourceType + '/' + encounter.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: encounter
        });
      },
      /**
       * Empty Encounter template
       * @returns {{patient: {}, period: {}, location: {location: {}}[], priority: {coding: {}[]}, reason: {coding: {}[]}, participant: {individual: {}}[]}}
       */
      instantiateEmptyEncounter: function () {
        return {
          patient: {},
          period: {},
          location: [{location: {}}],
          priority: {
            coding: [{}]
          },
          reason: {
            coding: [
              {}
            ]
          },
          participant: [{
            individual: {}
          }]
        };
      },
      getActiveStatuses: function () {
        return activeStatuses;
      },
      getStatusOptions: function () {
        return statusOptions;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirEpisodeOfCare
 * @description
 * # fhirEpisodeOfCare
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirEpisodeOfCare', ['$http', '$filter', 'fhirConfig', 'Utilities', function ($http, $filter, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'EpisodeOfCare';
    var defaultStatus = 'active';

    // Public API here
    return {
      /**
       * Get all episodesOfCare for a specific practitioner with a specific status
       * @returns {*} a list of EpisodesOfCare and referenced objects specified in 'includeList'
       */
      getEpisodesOfCare: function (teamMember, status, includeList) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            'team-member': teamMember,
            status: status, 
            _include: includeList
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
        });
      },
      /**
       * Create new EpisodeOfCare.
       * @param episodeOfCare The complete EpisodeOfCare object.
       * @returns {*}
       */
      createEpisodeOfCare: function (episodeOfCare) {
        episodeOfCare.resourceType = resourceType;
        if (!episodeOfCare.status) {
          episodeOfCare.status = defaultStatus;
        }
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: episodeOfCare
        });
      },
      /**
       * Update existing EpisodeOfCare object.
       * @param episodeOfCare The complete updated EpisodeOfCare object. episodeOfCare.id determines what object will be replaced.
       * @returns {*}
       */
      updateEpisodeOfCare: function (episodeOfCare) {
        episodeOfCare.resourceType = resourceType;
        var url = baseUrl + resourceType + '/' + episodeOfCare.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: episodeOfCare
        });
      },
      /**
       * Empty EpisodeOfCare template
       * @returns {{identifier: [{}], patient: {}, managingOrganization: {}, careManager: {}, careTeam: [{member: {}}] }}
       */
      instantiateEmptyEpisodeOfCare: function () {
        return {
          identifier: [
            {}
          ],
          patient: {},
          managingOrganization: {},
          careManager: {},
          careTeam: [{
            member: {}
          }]
        };
      }
    };
  }]);
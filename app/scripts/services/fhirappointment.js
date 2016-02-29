'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirAppointment
 * @description
 * # fhirAppointment
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirAppointment', ['$http', '$filter', 'fhirConfig', 'Utilities', function ($http, $filter, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Appointment';
    var defaultStatus = 'booked';

    // Public API here
    return {
      /**
       * Get all appointments for a specific practitioner with a specific status
       * @returns {*} a list of Appointment objects and referenced objects specified in 'includeList'
       */
      getAppointments: function (status, includeList) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            status: status, 
            _include: includeList
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
        });
      },
      /**
       * Create new Appointment.
       * @param appointment The complete Appointment object.
       * @returns {*}
       */
      createAppointment: function (appointment) {
        appointment.resourceType = resourceType;
        if (!appointment.status) {
          appointment.status = defaultStatus;
        }
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: appointment
        });
      },
      /**
       * Update existing Appointment object.
       * @param appointment The complete updated Appointment object. appointment.id determines what object will be replaced.
       * @returns {*}
       */
      updateAppointment: function (appointment) {
        appointment.resourceType = resourceType;
        var url = baseUrl + resourceType + '/' + appointment.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: appointment
        });
      },
      /**
       * Empty Appointment template
       * @returns { description: {}, start: {}, end: {}, comment: {}, participant: [{}] }
       */
      instantiateEmptyAppointment: function () {
        return {
          description: {},
          start: {},
          end: {},
          comment: {},
          participant: [{}]
        };
      }
    };
  }]);

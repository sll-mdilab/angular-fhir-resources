'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirMedicationOrder
 * @description
 * # fhirMedicationOrder
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirMedicationOrder', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'MedicationOrder';
    var resourcePrefix = resourceType + '/';
    var defaultStatus = 'draft';

    // Public API here
    return {
      /**
       * Get all registered Medication 
       * @returns {*}
       */
      getMedicationOrdersForPatient: function (patient, includeList) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            patient: patient,
            _include: includeList
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
        });
      },
      /**
       * Create new MedicationOrder.
       * @param medicationOrder The complete MedicationOrder object.
       * @returns {*}
       */
      createMedicationOrder: function (medicationOrder) {
        if (!medicationOrder.status || medicationOrder.status === {}) {
          medicationOrder.status = defaultStatus;
        }
        medicationOrder.resourceType = resourceType;
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: medicationOrder
        });
      },
      /**
       * Update existing MedicationOrder object.
       * @param medicationOrder The complete updated MedicationOrder object. medicationOrder.id determines what object will be replaced.
       * @returns {*}
       */
      updateMedicationOrder: function (medicationOrder) {
        medicationOrder.resourceType = resourceType;
        var url = baseUrl + resourceType + '/' + medicationOrder.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: medicationOrder
        });
      },  
      /**
       * Empty MedicationOrder template
       * @returns { patient: {}, prescriber: {}, medicationReference: {}, dateWritten: {}, dosageInstruction: [{ text: {} }] }
       */
      initiateEmptyMedicationOrder: function () {
        return {
          patient: {},
          prescriber: {},
          medicationReference: {},
          dateWritten: {},
          dosageInstruction: [{ 
            text: {}
          }]
        };
      }
    };
  }]);

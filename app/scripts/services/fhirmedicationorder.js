'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirMedication
 * @description
 * # fhirMedication
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirMedication', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'MedicationOrder';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all registered Medication
       * @returns {*}
       */
      getMedicationOrdersForPatient: function (patient) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            patient: patient
          }
        }).then(function (response) {
          return Utilities.getFhirResourceList(response.data.entry);
        });
      },
      createMedicationOrder: function (medicationOrder) {
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

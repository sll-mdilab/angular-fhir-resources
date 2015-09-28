'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirObservation
 * @description
 * # fhirObservation
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirObservation', ['$http', 'fhirConfig', function ($http, fhirConfig) {
    // Service logic
    var resourceType = 'Observation';
    var url = fhirConfig.url + resourceType;
    // Public API here
    return {
      getObservationSummaryByPatientId: function (patientId, dateRange) {
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            subject: patientId,
            date: dateRange,
            _format: 'json',
            _summary: true
          }
        }).then(function (response) {
          return response.data;
        });
      },
      getObservationSummaryByDeviceId: function (deviceId, dateRange) {
        if(deviceId.indexOf('Device/') === 0){
          deviceId = deviceId.substr('Device/'.length);
        }
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            'device.identifier': deviceId,
            date: dateRange,
            _format: 'json',
            _summary: true
          }
        }).then(function (response) {
          return response.data;
        });
      },
      getActiveObservationCodesByDeviceId: function (deviceId, dateRange) {
        return this.getObservationSummaryByDeviceId(deviceId, dateRange).then(function (summary) {
            var activeCodes = [];
            angular.forEach(summary.entry, function (entry) {
              activeCodes.push(entry.resource.code.coding[0].code);
            });
            return activeCodes;
          }
        );
      },
      getObservationsByPatientId: function (patientId, dateRange, code) {
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            subject: patientId,
            date: dateRange,
            code: code,
            _format: 'json'
          }
        }).then(function (response) {
          return response.data;
        });
      },
      getObservationsByDeviceId: function (deviceId, dateRange, code) {
        if(deviceId.indexOf('Device/') === 0){
          deviceId = deviceId.substr('Device/'.length);
        }
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            'device.identifier': deviceId,
            date: dateRange,
            code: code,
            _format: 'json'
          }
        }).then(function (response) {
          return response.data;
        });
      },
      generateRandomObservation: function (code, offset, deviation) {
        var newObject = angular.copy(this.instantiateEmptyObservation());
        if (!angular.isDefined(offset)) {
          offset = 80;
        }
        if (!angular.isDefined(deviation)) {
          deviation = 20;
        }

        for (var eidx in newObject.entry) {
          var e = newObject.entry[eidx];
          if (code) {
            e.resource.code.coding.code = code;
          }
          e.resource.valueQuantity.value = 0.5 * deviation * Math.random() - 0.5 * deviation * Math.random() + offset;
        }
        return newObject;
      },
      instantiateEmptyObservation: function () {
        return {
          'resourceType': 'Bundle',
          'entry': [
            {
              'resource': {
                'resourceType': 'Observation',
                'code': {
                  'coding': [{}]
                },
                'valueQuantity': {},
                'appliesDateTime': '2015-03-26T16:32:40.000',
                'subject': {}
              }
            }
          ]
        };
      }
    };
  }]);

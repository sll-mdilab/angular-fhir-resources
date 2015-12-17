'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirObservation
 * @description
 * # fhirObservation
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirObservation', ['$http', 'fhirConfig', 'fhirWaveFormGenerator', function ($http, fhirConfig, fhirWaveFormGenerator) {
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
            "-summary": true
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
            "-summary": true
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
      getObservationsByPatientId: function (patientId, dateRange, code, sampleRate) {
				var requestParams = {
            subject: patientId,
            date: dateRange,
            code: code,
            _format: 'json'
          };
				if(sampleRate) {
					requestParams.sampleRate = sampleRate;
				}
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: requestParams
        }).then(function (response) {
          return response.data;
        });
      },
      getObservationsByDeviceId: function (deviceId, dateRange, code, sampleRate) {
        if(deviceId.indexOf('Device/') === 0){
          deviceId = deviceId.substr('Device/'.length);
        }
				var requestParams = {
            'device.identifier': deviceId,
            date: dateRange,
            code: code,
            _format: 'json'
          };
				if(sampleRate) {
					requestParams.sampleRate = sampleRate;
				}
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: requestParams
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
            e.resource.code.coding[0].code = code;
          }
          e.resource.valueQuantity.value = 0.5 * deviation * Math.random() - 0.5 * deviation * Math.random() + offset;
          e.resource.effectiveDateTime = (new Date()).toISOString();
        }
        return newObject;
      },
      generateRandomWaveFormObservation: function (code) {
        return fhirWaveFormGenerator.nextWaveSamples();
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
                'effectiveDateTime': '2015-03-26T16:32:40.000',
                'subject': {}
              }
            }
          ]
        };
      },
      instantiateEmptyWaveFormObservation: function () {
        var obs = this.instantiateEmptyObservation();
        obs.entry[0].resource.valueSampledData = {};
        delete obs.entry[0].resource.valueQuantity;
        return obs;
      }
    };
  }]);

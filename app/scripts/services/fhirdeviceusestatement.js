'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirDeviceUseStatement
 * @description
 * # fhirDeviceUseStatement
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirDeviceUseStatement', ['$http', 'fhirConfig', function ($http, fhirConfig) {
    // Service logic
    var resourceType = 'DeviceUseStatement';
    var baseUrl = fhirConfig.url + resourceType;
    var activeDeviceUrl = baseUrl + '?end:missing=true&patient.identifier=%(pid)s&_format=json';

    var addDeviceDataTmpl = {
      'resourceType': resourceType,
      'device': {
        'reference': 'Device/%(deviceId)s'
      },
      'subject': {
        'reference': 'Patient/%(patientId)s'
      },
      'whenUsed': {
        'start': '%(date)s'
      },
      'extension': []
    };

    var practitionerDataTmpl = {
      'url': 'http://sll-mdilab.net/fhir/' + resourceType + '#issuer',
      'valueResource': {
        'reference': 'Practitioner/%(practitionerId)s'
      }
    };

    function getCurrentDatetime() {
      return new Date().toISOString();
    }

    function populateTemplate(obj, key, replacements) {
      if (typeof key === 'string') {
        return populateTemplate(obj, key.split('.'), replacements);
      } else if (key.length === 1 && replacements !== undefined) {
        obj[key[0]] = sprintf(obj[key[0]], replacements);
      } else if (key.length === 0) {
        return obj;
      }
      else {
        return populateTemplate(obj[key[0]], key.slice(1), replacements);
      }
    }

    // Public API here
    return {
      /**
       * Get DeviceUseStatements by patient id
       *
       * Returned is a list of simplified device use statements also containing the original object
       * [
       *  {
       *    deviceId: Id of the device
       *    startDatetime: The date time the device was connected to the patient
       *    id: resource Id
       *    original: the original object
       *  }
       * ]
       * @param patientId
       * @returns {*}
       */
      getDeviceUseStatementsByPatientId: function (patientId) {
        var url = sprintf(activeDeviceUrl, {pid: patientId});
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(
          function (response) {
            var deviceUseStatements = [];
            var data = response.data;

            if (data.total > 0) {
              for (var idx in data.entry) {
                var entry = data.entry[idx];
                deviceUseStatements.push({
                  deviceId: entry.resource.device.reference,
                  startDatetime: entry.resource.whenUsed.start,
                  id: entry.resource.id,
                  original: entry
                });
              }
            }
            return deviceUseStatements;
          }
        );
      },
      /**
       * Connect a device to a patient. In other words, create a new DeviceUseStatement
       *
       * @param patientId Id of the patient the device should connect to
       * @param deviceId Id of the device
       * @param practitionerId Id of the practitioner who's connecting the device
       * @returns {*} a promise
       */
      addDeviceToPatient: function (patientId, deviceId, practitionerId, receiverRefList) {
        var url = baseUrl;
        var postData = angular.copy(addDeviceDataTmpl);
        var replacements = {
          deviceId: deviceId,
          patientId: patientId,
          practitionerId: practitionerId,
          date: getCurrentDatetime()
        };
        var practitionerExtension = angular.copy(practitionerDataTmpl);
        populateTemplate(postData, 'device.reference', replacements);
        populateTemplate(postData, 'subject.reference', replacements);
        populateTemplate(postData, 'whenUsed.start', replacements);
        populateTemplate(practitionerExtension, 'valueResource.reference', replacements);
        postData.extension.push(practitionerExtension);
        if (receiverRefList && receiverRefList.length > 0) {
          this.addReceiversToDeviceUseStatement(postData, receiverRefList);
        }
        return $http({
            method: 'POST',
            url: url,
            headers: fhirConfig.headers,
            data: postData
          }
        );
      },
      /**
       * Update an existing DeviceUseStatement, e.g. change the start time of the connection.
       * @param deviceUseStatement The a complete deviceUseStatement object with updated information.
       * deviceUseStatement.id determines what object to update.
       * @returns {*} a promise
       */
      updateDeviceUseStatement: function (deviceUseStatement) {
        var url = baseUrl + '/' + deviceUseStatement.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: deviceUseStatement
        });
      },
      addReceiversToDeviceUseStatement: function (deviceUseStatement, receiverRefList) {
        var extensionUrl = "http://sll-mdilab.net/fhir/DeviceUseStatement#brokeringReceiver";
        if (!deviceUseStatement.extension) {
          deviceUseStatement.extension = [];
        }
        // Remove existing Brokering Receivers
        deviceUseStatement.extension = deviceUseStatement.extension.filter(function(item){
          return item.url !== extensionUrl;
        });
        // Add new Brokering Receivers
        angular.forEach(receiverRefList, function (ref) {
          deviceUseStatement.extension.push({url: extensionUrl, valueResource: {reference: ref}});
        });
      }
    };
  }]);

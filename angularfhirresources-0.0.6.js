'use strict';

/**
 * @ngdoc overview
 * @name angularFhirResources
 * @description
 * # angularFhirResources
 *
 * Main module of the application.
 */
angular
  .module('angularFhirResources', [
    'ngRoute',
    'base64'
  ]);

/**
 * @ngdoc service
 * @name angularFhirResources.fhirBrokeringReceiver
 * @description
 * # fhirBrokeringReceiver
 * Factory in the angularFhirResources.
 */
(function () {
  'use strict';

  angular
    .module('angularFhirResources')
    .factory('fhirBrokeringReceiver', fhirBrokeringReceiver);

  fhirBrokeringReceiver.$inject = ['$http', 'fhirConfig'];

  function fhirBrokeringReceiver($http, fhirConfig) {
    var baseUrl = fhirConfig.url;
    var resourceType = 'BrokeringReceiver';
    var resourcePrefix = resourceType + '/';

    // Public API here
    var service = {
      getAllReceivers: getAllReceivers,
      createReceiver: createReceiver,
      deleteReceiver: deleteReceiver,
      instantiateEmptyReceiver: instantiateEmptyReceiver,
      toReferenceList: toReferenceList,
      getReceiverById: getReceiverById,
      editReceiver: editReceiver
    };

    return service;

    //////////////

    function getAllReceivers() {
      var url = baseUrl + resourceType + '/';
      return $http({
        method: 'GET',
        url: url,
        headers: fhirConfig.headers
      }).then(function (response) {
        var receivers = [];
        angular.forEach(response.data.entry, function(receiver){
          receivers.push(receiver.resource);
        });
        return receivers;
      });
    }

    function createReceiver(receiver) {
      var url = baseUrl + resourceType + '/';
      receiver.resourceType = resourceType;
      return $http({
        method: 'POST',
        url: url,
        data: receiver,
        headers: fhirConfig.headers
      });
    }

    function deleteReceiver(receiver) {
      var url = baseUrl + resourcePrefix + receiver.id;
      return $http({
        method: 'DELETE',
        url: url,
        headers: fhirConfig.headers
      });
    }

    function editReceiver(receiver) {
      var url = baseUrl + resourcePrefix + receiver.id;
      return $http({
        method: 'PUT',
        url: url,
        data: receiver,
        headers: fhirConfig.headers
      });
    }

    function getReceiverById(receiverId) {
      var url = baseUrl + resourcePrefix + receiverId;
      return $http({
        method: 'GET',
        url: url,
        headers: fhirConfig.headers
      });
    }

    function toReferenceList(receiverList) {
      return receiverList.map(function (r) {
        return resourcePrefix + r.id
      });
    }

    function instantiateEmptyReceiver() {
      return {
        systemName: undefined,
        address: undefined,
        port: undefined
      };
    }
  }
})();

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirConfig
 * @description
 * # fhirConfig
 * Provider in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .provider('fhirConfig', function () {
    this.apiUser = undefined;
    this.apiKey = undefined;
    this.url = undefined;
    this.headers = {'Content-Type': 'application/json+fhir; charset=utf-8'};

    this.setAPICredentials = function(apiUser, apiKey){
      this.apiUser = apiUser;
      this.apiKey = apiKey;
    };

    this.setBackendURL = function (url) {
      this.url = url;
    };

    this.$get = function($base64) {
      var self = this;
      var authData = $base64.encode(self.apiUser + ':' + self.apiKey);
      self.headers['Authorization'] = 'Basic ' + authData;
      return {
        url: self.url,
        headers: self.headers,
        setCustomHeader: function (header, value) {
          self.headers[header] = value;
        }
      };
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirDevice
 * @description
 * # fhirDevice
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirDevice', ['$timeout', function ($timeout) {
    // Service logic
    var resourceType = 'Device';
    var resourcePrefix = resourceType + '/';
    var MOCK_DEVICES = [
      {
        "id": "C1007-123",
        "name": "GE Solar 8000M",
        "type": "Monitor",
        "profileURL": "http://www.metropolitanmed.com/images/products/lg/ge_solar8000M.jpg",
        "manufacturer": "GE Healthcare"
      },
      {
        "id": "681922",
        "name": "Maquet SERVO-i",
        "type": "Ventilator",
        "profileURL": "http://www.ventilatorsplus.com/Servo_i.jpg",
        "manufacturer": "Maquet"
      },
      {
        "id": "871623",
        "name": "Alaris",
        "type": "Infusion Pump",
        "profileURL": "http://www.qmed.com/sites/default/files/imagecache/node-gallery-display/105913/alaris.jpg",
        "manufacturer": "CareFusion"
      },
      {
        "id": "60002C41",
        "name": "Perfusor Space",
        "type": "Infusion Pump",
        "profileURL": "http://cdn.dotmed.com/images/modelpics/15967.jpg",
        "manufacturer": "B. Braun"
      }
    ];

    var defaultDevice = {
      "id": undefined,
      "name": "Medical Device",
      "type": "Medical Device Type",
      "profileURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",
      "manufacturer": "Medical Device Manufacturer"
    };


    // Public API here
    return {
      get: function () {
        return $timeout(function(){
          return MOCK_DEVICES;
        }, 500);
      },
      getDeviceById: function (deviceId) {
        return $timeout(function(){
          var deviceIdInclPrefix = deviceId.indexOf(resourceType) === 0 ? deviceId : (resourcePrefix + deviceId);
          for (var idx in MOCK_DEVICES) {
            var entry = MOCK_DEVICES[idx];
            if ((resourcePrefix + entry.id).toUpperCase() === deviceIdInclPrefix.toUpperCase()) {
              return entry;
            }
          }
          var newDevice = angular.copy(defaultDevice);
          newDevice.id = deviceId;
          return newDevice;
        }, 500);
      },
      createDevice: function(newDevice){
        return $timeout(function(){
          MOCK_DEVICES.push(newDevice);
        }, 200);
      },
      getDefaultDevice: function(customDeviceId){
        var defDevice = angular.copy(defaultDevice);
        defDevice.id = customDeviceId;
        return defDevice;
      },
      getResourcePrefix: function(){
        return resourcePrefix;
      },
      getResourceType: function(){
        return resourceType;
      }
    };
  }]);

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
    var activeDeviceUrl = baseUrl + '?whenUsed.end:missing=true&patient.identifier=%(pid)s&_format=json';

    var addDeviceDataTmpl = {
      'resourceType': resourceType,
      'id': 'example',
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
          date: new Date().toISOString()
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

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirPatient
 * @description
 * # fhirPatient
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirPatient', ['$http', 'fhirConfig', function ($http, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Patient';

    // Public API here
    return {
      /**
       * Get Patient by params
       * @param params A param object
       * {
       *  patientId: 'ID of a Patient',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getPatient: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourceType + '/';
        }
        url += params.patientId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Create a new Patient
       * @param patient A complete Patient to be created
       * @returns {*}
       */
      createPatient: function (patient) {
        var url = baseUrl + resourceType;
        patient.resourceType = resourceType;
        return $http({
          method: 'POST',
          url: url,
          data: patient,
          headers: fhirConfig.headers
        });
      },
      /**
       * Empty Patient template
       * @returns {{identifier: Array, address: Array, name: {given: Array, family: Array}[], telecom: {system: string}[], photo: {}}}
       */
      instantiateEmptyPatient: function () {
        return {
          identifier: [],
          address: [],
          name: [{
            given: [],
            family: []
          }],
          telecom: [{system: 'email'}, {system: 'phone'}],
          photo: [{}]
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirPractitioner
 * @description
 * # fhirPractitioner
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirPractitioner', ['$http', 'fhirConfig', function ($http, fhirConfig) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Practitioner';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get a Practitioner by params
       * @param params A param object
       * {
       *  practitionerId: 'ID of a Practitioner',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getPractitioner: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourcePrefix;
        }
        url += params.practitionerId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Get all registered Practitioners
       * @returns {*}
       */
      getAllPractitioners: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          var resources = response.data.entry;
          var practitioners = [];
          for (var idx in resources) {
            practitioners.push(resources[idx].resource);
          }
          return practitioners;
        });
      },
      getResourcePrefix: function(){
        return resourcePrefix;
      },
      /**
       * Empty Practitioner template
       * @returns {{identifier: {}[], name: {}, practitionerRole: {role: {coding: {}[]}}[]}}
       */
      initiateEmptyPractitioner: function () {
        return {
          identifier: [
            {}
          ],
          name: {},
          practitionerRole: [
            {
              role: {
                coding: [
                  {}
                ]
              }
            }
          ]
        };
      }
    };
  }]);

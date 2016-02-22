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
    'base64',
    'uuid',
    'LocalStorageModule'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('angularFhirStorage');
  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.Utilities
 * @description
 * # Utilities
 * Service in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .service('Utilities', function () {
    return {
      formatFhirResponse: function (response) {
        var result = {};
        for (var i in response.data.entry) {
          var resource = response.data.entry[i].resource;
          var type = resource.resourceType;
          if (!result[type]) { result[type] = {}; }
          result[type][resource.id] = resource;
        }
        return result;
      },
      getFhirResourceList: function(resources) {
        var list = [];
        for (var idx in resources) {
          list.push(resources[idx].resource);
        }
        return list;
      } 
  	}
	});

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
    this.authToken = undefined;
    this.url = undefined;
    this.oauthClientId = undefined;
    this.oauthRedirectUri = undefined;
    this.headers = undefined;

    this.headers = {'Content-Type': 'application/json+fhir; charset=utf-8'};
    
    this.setAPICredentials = function(apiUser, apiKey){
      this.apiUser = apiUser;
      this.apiKey = apiKey;
    };

    this.setBackendURL = function (url) {
      this.url = url;
    };

    this.setOauthClientId = function (oauthClientId) {
      this.oauthClientId = oauthClientId;
    };

    this.setOauthRedirectUri = function (oauthRedirectUri) {
      this.oauthRedirectUri = oauthRedirectUri;
    };

    this.$get = function($base64, localStorageService) {
      var self = this;

      if(localStorageService.get('authToken')) {
        self.authToken = localStorageService.get('authToken');
      }

      if(self.authToken) {
        self.headers['Authorization'] = 'Bearer ' + self.authToken;
      } else {
        var authData = $base64.encode(self.apiUser + ':' + self.apiKey);
        self.headers['Authorization'] = 'Basic ' + authData;
      }

      return {
        url: self.url,
        headers: self.headers,

        setCustomHeader: function (header, value) {
          self.headers[header] = value;
        },
        setAuthToken: function(authToken) {
          self.authToken = authToken;
          self.headers['Authorization'] = 'Bearer ' + authToken;

          localStorageService.set('authToken', self.authToken);
        },
        clearAuthToken: function() {
          self.authToken = undefined;
          localStorageService.set('authToken', undefined);
          self.headers['Authorization'] = undefined;
        },
        getOauthClientId: function () {
          return self.oauthClientId;
        },
        getOauthRedirectUri: function () {
          return self.oauthRedirectUri;
        },
        getBackendURL: function () {
          return self.url;
        },
        isAuthenticated: function() {
          return !!self.authToken;
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
 * @name angularFhirResources.fhirDeviceMetric
 * @description
 * # fhirDeviceMetric
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirDeviceMetric', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'DeviceMetric';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all registered Medication
       * @returns {*}
       */
      getAllDeviceMetrics: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return Utilities.getFhirResourceList(response.data.entry);
        });
      },
      /**
       * Empty Medication template
       * @returns { type: { text: {}, coding: [{}] }, color: {}, category: {}, 
            extension: [{ url: "http://sll-mdilab.net/fhir/Order#metricType", valueString: {} }] }
       */
      initiateEmptyDeviceMetric: function () {
        return {
          type: { 
            text: {}, 
            coding: [{}]
          },
          color: {},
          category: {},
          extension: [{
            url: "http://sll-mdilab.net/fhir/Order#metricType",
            valueString: {}
          }]
        };
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

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirEncounter
 * @description
 * # fhirEncounter
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirEncounter', ['$http', '$filter', 'fhirConfig', 'Utilities', function ($http, $filter, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Encounter';
    var activeStatuses = ['in-progress'];
    var statusOptions = {
      planned: 'Planned',
      arrived: 'Arrived',
      'in-progress': 'In-progress',
      onleave: 'Onleave',
      finished: 'Finished',
      cancelled: 'Cancelled'
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
          return Utilities.getFhirResourceList(activeResources);
        });
      },
      /**
       * Get all encounters of a specific episode of care
       * @returns {*} a list of Encounters with included objects specified in 'includeList'
       */
      getEncounters: function (episodeOfCare, status, includeList) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            episodeofcare: episodeOfCare,
            status: status,
            _include: includeList
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
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
        if (!encounter.status || encounter.status === {}) {
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
       * @returns {{identifier: [{}], patient: {}, episodeOfCare: {}, serviceProvider: {}, careManager: {}, partOf: {}, period: {}, location: {location: {}}[], 
       * ... type: {coding: [{}]}, status: {}, class: {}, priority: {coding: [{}]}, reason: {coding: {}[]}, participant: {individual: {}, type: {}}}
       */
      instantiateEmptyEncounter: function () {
        return {
          identifier: [
            {}
          ],
          patient: {},
          episodeOfCare: {},
          serviceProvider: {},
          careManager: {},
          period: {},
          location: [{ 
            location: {} 
          }],
          type: { 
            coding: [{}] 
          },
          status: {},
          class: {},
          priority: {
            coding: [{}]
          },
          reason: {
            coding: [
              {}
            ]
          },
          participant: [{
            individual: {},
            type: {}
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
'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirList
 * @description
 * # fhirList
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirList', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'List';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get a List by params
       * @param params A param object
       * {
       *  listId: 'ID of a List',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getList: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourcePrefix;
        }
        url += params.listId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Empty List template
       * @returns { code: { text: {} }
       */
      initiateEmptyList: function () {
        return {
          status: "current",
          mode: "working",
          entry: []
        };
      }
    };
  }]);

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
    var resourceType = 'Medication';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all registered Medication
       * @returns {*}
       */
      getAllMedication: function () {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return Utilities.getFhirResourceList(response.data.entry);
        });
      },
      /**
       * Empty Medication template
       * @returns { code: { text: {} }
       */
      initiateEmptyMedication: function () {
        return {
          code: { text: {} }
        };
      }
    };
  }]);

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
       * Delete existing MedicationOrder object.
       * @param medicationOrder The MedicationOrder object.id. The id determines what object will be deleted.
       * @returns {*}
       */
      deleteMedicationOrder: function (medicationOrderId) {
        var url = baseUrl + resourceType + '/' + medicationOrderId;
        return $http({
          method: 'DELETE',
          url: url,
          headers: fhirConfig.headers
        });
      },  

      /**
       * Empty MedicationOrder template
       * @returns { patient: {}, prescriber: {}, medicationReference: {}, dateWritten: {}, dosageInstruction: [{ text: {}, additionalInstructions: {} }] }
       */
      initiateEmptyMedicationOrder: function () {
        return {
          patient: {},
          prescriber: {},
          medicationReference: {},
          dateWritten: {},
          dosageInstruction: [{ 
            text: {},
            additionalInstructions: {}
          }]
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhiroauth
 * @description
 * # fhiroauth
 * Service in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .service('fhirOauth', ['fhirConfig', '$timeout', function (fhirConfig, $timeout) {
  	function removeTrailingSlash(url)     
    {     
        return url.replace(/\/$/, "");
    } 

    this.authorize = function(errback) {
    	FHIR.oauth2.authorize({
  			server: removeTrailingSlash(fhirConfig.url),
	  		client: {
	  			client_id: fhirConfig.getOauthClientId(),
	  			scope: 'openid profile',
	  			redirect_uri: fhirConfig.getOauthRedirectUri()
	  		}
	  	}, errback);
    };

    function getDefaultPractitioner(userId) {
        return {
            resourceType: 'Practitioner',
            id: userId,
            identifier: [
              {
                value: userId
              }
            ],
            name: {
              text: 'Unregistered Practitioner'
            },
            practitionerRole: [
              {
                role: {
                  coding: [
                    {
                      system: 'http://snomed.info/sct',
                      code: '158965000',
                      display: 'Medical practitioner'
                    }
                  ]
                }
              }
            ]
        };
    }

  	function getIdPart(resourcePath) {
  		return resourcePath.split('/')[1];
  	}

    this.ready = function(callback, errback) {
    	FHIR.oauth2.settings.replaceBrowserHistory = false;

   		FHIR.oauth2.ready( function(smart) {
          function attempt() {
            console.log("Fetching patient...");
            smart.api.search({type: "Patient"}).done(function() {
                    console.log("Fetching practitioner.");
                    smart.user.read().done( function(currentPractitioner){
                      callback(currentPractitioner);
                    }).fail(function() {
                      callback(getDefaultPractitioner(getIdPart(smart.userId)));
                    });
                }).fail(attempt);
          }

  	    	console.log('Ready callback.');

  	    	fhirConfig.setAuthToken(smart.tokenResponse.access_token);
  	        console.log(smart.tokenResponse);
            console.log("Waiting...");
            console.log("Waiting done.");
  	        // The first request sometimes give 401, this is a temporary workaround
  	        attempt();
  	   }, errback);
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
      getObservationsByPatientId: function (patientId, dateRange, code, samplingPeriod) {
        var requestParams = {
            subject: patientId,
            date: dateRange,
            code: code,
            _format: 'json'
          };
        if(samplingPeriod) {
          requestParams['-samplingPeriod'] = samplingPeriod;
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
      getObservationsByDeviceId: function (deviceId, dateRange, code, samplingPeriod) {
        if(deviceId.indexOf('Device/') === 0){
          deviceId = deviceId.substr('Device/'.length);
        }
        var requestParams = {
            'device.identifier': deviceId,
            date: dateRange,
            code: code,
            _format: 'json'
          };
        if(samplingPeriod) {
          requestParams['-samplingPeriod'] = samplingPeriod;
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
      createAnnotationObservation: function (observation) {
        observation.resourceType = resourceType;
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: encounter
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
      instantiateEmptyAnnotationObservation: function () {
        return {
          'resource': {
            'resourceType': 'Observation',
            'code': {
              'coding': [{}]
            },
            'comment': {} ,
            'effectiveDateTime': {},
            'subject': {},
            'performer': {}
          }          
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

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirOrder
 * @description
 * # fhirOrder
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirOrder', ['$http', 'fhirConfig', 'Utilities', function ($http, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Order';
    var resourcePrefix = resourceType + '/';

    // Public API here
    return {
      /**
       * Get all registered Order 
       * @returns {*}
       */
      getOrdersForPatient: function (patient) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            patient: patient,
          }
        }).then(function (response) {
          return Utilities.getFhirResourceList(response.data.entry);
        });
      },
      /**
       * Create new Order.
       * @param order The complete Order object.
       * @returns {*}
       */
      createOrder: function (order) {
        order.resourceType = resourceType;
        var url = baseUrl + resourceType;
        return $http({
          method: 'POST',
          url: url,
          headers: fhirConfig.headers,
          data: order
        });
      },
      /**
       * Update existing Order object.
       * @param order The complete updated Order object. order.id determines what object will be replaced.
       * @returns {*}
       */
      updateOrder: function (order) {
        order.resourceType = resourceType;
        var url = baseUrl + resourceType + '/' + order.id;
        return $http({
          method: 'PUT',
          url: url,
          headers: fhirConfig.headers,
          data: order
        });
      },  
      /**
       * Delete existing Order object.
       * @param order The Order object.id. The id determines what object will be deleted.
       * @returns {*}
       */
      deleteOrder: function (orderId) {
        var url = baseUrl + resourceType + '/' + orderId;
        return $http({
          method: 'DELETE',
          url: url,
          headers: fhirConfig.headers
        });
      },
      /**
       * Empty Order template
       * @returns { date: {}, subject: { reference: {} }, source: { reference: {} }, detail : [{ reference: {} }], extension: [{ url: "http://sll-mdilab.net/fhir/Order#alarmlimits", 
            extension: [{ url: lowerAlarm, valueDecimal: {} }, { url: lowerWarning, valueDecimal: {} }, { url: upperWarning, valueDecimal: {} }, { url: upperAlarm, valueDecimal: {} }] }] }
       */
      initiateEmptyOrder: function () {
        return {
          date: {},
          subject: { reference: {} },
          source: { reference: {} },
          detail : [{ reference: {} }],
          extension: [{
            url: "http://sll-mdilab.net/fhir/Order#alarmlimits",
            extension: [{
              url: "lowerAlarm",
              valueDecimal: {}
            }, {
              url: "lowerWarning",
              valueDecimal: {}
            },{
              url: "upperWarning",
              valueDecimal: {}
            }, {
              url: "upperAlarm",
              valueDecimal: {}
            }]
          }]
        };
      }
    };
  }]);




'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirOrganization
 * @description
 * # fhirOrganization
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirOrganization', ['$http', '$filter', 'fhirConfig', 'Utilities', function ($http, $filter, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'Organization';

    // Public API here
    return {
      /**
       * Get all Organization
       * @returns {*}
       */
      getAllOrganizations: function (params) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return Utilities.getFhirResourceList(response.data.entry);
        });
      },
      /**
       * Get Organization by params
       * @param params A param object
       * {
       *  organizationId: 'ID of an Organization',
       *  includeResourceType: 'optional to include resource type as prefix in request'
       * }
       * @returns {*}
       */
      getOrganization: function (params) {
        var url = baseUrl;
        if (params.includeResourceType) {
          url += resourceType + '/';
        }
        url += params.organizationId;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers
        }).then(function (response) {
          return response.data;
        });
      },
      /**
       * Create a new Organization
       * @param organization A complete Organization to be created
       * @returns {*}
       */
      createOrganization: function (organization) {
        var url = baseUrl + resourceType;
        organization.resourceType = resourceType;
        return $http({
          method: 'POST',
          url: url,
          data: organization,
          headers: fhirConfig.headers
        });
      },
      /**
       * Empty Organization template
       * @returns {{ identifier: [{}], name: {} }}
       */
      instantiateEmptyOrganization: function () {
        return {
          identifier: [
            {}
          ],
          name: {}
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
       * @returns {{identifier: [{}], gender: {}, address: {}, name: {given: [], family: []}, telecom: [{system: string}], photo: {} }}
       */
      instantiateEmptyPatient: function () {
        return {
          identifier: [
            {}
          ],
          gender: {},
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

'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhirReferralRequest
 * @description
 * # fhirReferralRequest
 * Factory in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .factory('fhirReferralRequest', ['$http', '$filter', 'fhirConfig', 'Utilities', function ($http, $filter, fhirConfig, Utilities) {
    // Service logic
    var baseUrl = fhirConfig.url;
    var resourceType = 'ReferralRequest';

    var defaultStatus = 'requested';

    // Public API here
    return {
      /**
       * Get ReferralRequests based on patient and status
       * @returns {*} a list of ReferralRequests
       */
      getReferralRequests: function (patient, status, includeList) {
        var url = baseUrl + resourceType;
        return $http({
          method: 'GET',
          url: url,
          headers: fhirConfig.headers,
          params: {
            patient: patient,
            status: status, 
            _include: includeList
          }
        }).then(function (response) {
          return Utilities.formatFhirResponse(response);
        });
      },
      /**
       * Update existing ReferralRequest object.
       * @param encounter The complete updated ReferralRequest object. referralRequest.id determines what object will be replaced.
       * @returns {*}
       */
      updateReferralRequest: function (referralRequest) {
        var url = baseUrl + resourceType + '/' + referralRequest.id;
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

/**
 * @ngdoc service
 * @name angularFhirResources.fhirWaveFormGenerator
 * @description
 * # fhirWaveFormGenerator
 * Factory in the angularFhirResources.
 */
(function () {
  'use strict';
  angular.module('angularFhirResources')
    .factory('fhirWaveFormGenerator', _fhirWaveFormGenerator);

  _fhirWaveFormGenerator.$inject = ['rfc4122'];

  function _fhirWaveFormGenerator(rfc4122) {
    var gen = {};

    var emptyWaveFormObservationObject = {
      'resourceType': 'Bundle',
      'entry': [
        {
          'resource': {
            'resourceType': 'Observation',
            'code': {
              'coding': [{}]
            },
            'valueSampledData': {},
            'effectiveDateTime': '2015-03-26T16:32:40.000',
            'subject': {}
          }
        }
      ]
    };

    gen.sampleData = [0.32,0.305,0.3,0.295,0.28500000000000003,0.27,0.27,0.28,0.275,0.275,0.275,0.28,0.28,0.275,0.27,0.275,0.275,0.275,0.275,0.28,0.275,0.28,0.275,0.28,0.28,0.275,0.275,0.28,0.28500000000000003,0.28500000000000003,0.275,0.28,0.28,0.28,0.275,0.26,0.25,0.23,0.21,0.185,0.17,0.15,0.145,0.23,0.34500000000000003,0.465,0.585,0.665,0.79,0.91,1.03,1.1500000000000001,1.27,1.3900000000000001,1.475,1.445,1.3800000000000001,1.3,1.235,1.1500000000000001,1.07,0.995,0.91,0.8250000000000001,0.74,0.66,0.595,0.58,0.595,0.62,0.645,0.67,0.6900000000000001,0.72,0.74,0.745,0.74,0.75,0.75,0.75,0.74,0.745,0.745,0.745,0.735,0.74,0.745,0.745,0.735,0.73,0.735,0.735,0.725,0.725,0.73,0.725,0.72,0.715,0.715,0.715,0.71,0.71,0.71,0.705,0.71,0.7000000000000001,0.7000000000000001,0.7000000000000001,0.6900000000000001,0.685,0.685,0.685,0.685,0.68,0.67,0.67,0.67,0.66,0.655,0.655,0.65,0.645,0.635,0.635,0.635,0.63,0.625,0.615,0.62,0.615,0.61,0.61,0.61,0.595,0.59,0.59,0.585,0.58,0.5650000000000001,0.56,0.56,0.56,0.545,0.545,0.545,0.545,0.545,0.53,0.53,0.535,0.53,0.53,0.53,0.53,0.53,0.525,0.51,0.51,0.5,0.485,0.485,0.47500000000000003,0.47000000000000003,0.455,0.445,0.43,0.41500000000000004,0.395,0.375,0.365,0.35000000000000003,0.33,0.31,0.31,0.305,0.295,0.29,0.29,0.28500000000000003,0.275,0.27,0.27,0.275,0.27,0.27,0.265,0.28,0.275,0.275,0.27,0.275,0.27,0.265,0.27,0.275,0.275,0.275,0.27,0.28,0.275,0.27,0.27,0.27,0.275,0.28,0.275,0.275,0.28,0.28,0.275,0.275,0.28,0.28,0.275,0.275,0.28500000000000003,0.3,0.305,0.315,0.33,0.34,0.35000000000000003,0.355,0.37,0.375,0.38,0.38,0.39,0.405,0.41000000000000003,0.41000000000000003,0.41000000000000003,0.41500000000000004,0.41000000000000003,0.41000000000000003,0.41000000000000003,0.42,0.41000000000000003,0.41000000000000003,0.4,0.4,0.395,0.385,0.38,0.375,0.365,0.36,0.35000000000000003,0.34500000000000003,0.335,0.315,0.305,0.305,0.295,0.28500000000000003,0.275,0.28,0.28,0.275,0.275,0.28,0.28,0.28500000000000003,0.28,0.275,0.28,0.28,0.28,0.28,0.28500000000000003,0.28,0.28500000000000003,0.275,0.28,0.29,0.28500000000000003,0.28,0.28500000000000003,0.28500000000000003,0.28500000000000003,0.28500000000000003,0.28,0.29,0.28,0.275,0.265,0.25,0.23,0.21,0.185,0.165,0.15,0.16,0.25,0.37,0.49,0.605,0.6900000000000001,0.8150000000000001,0.935,1.05,1.17,1.295,1.415,1.49,1.445,1.375,1.295,1.23,1.145,1.065,0.99,0.9,0.81,0.735,0.645,0.59,0.585,0.605,0.63,0.65,0.675,0.6950000000000001,0.72,0.745,0.745,0.745,0.75,0.745,0.745,0.745,0.745,0.745,0.74,0.74,0.745,0.74,0.74,0.735,0.73,0.735,0.735,0.725,0.73,0.73,0.73,0.72,0.715,0.715,0.715,0.715,0.71,0.715,0.715,0.71,0.6950000000000001,0.7000000000000001,0.7000000000000001,0.6950000000000001,0.685,0.685,0.685,0.685,0.675,0.675,0.67,0.665,0.65,0.655,0.655,0.65,0.645,0.635,0.635,0.635,0.625,0.625,0.625,0.62,0.615,0.605,0.605,0.6,0.59,0.585,0.585,0.58,0.5750000000000001,0.5650000000000001,0.56,0.56,0.56,0.55,0.545,0.55,0.545,0.545,0.535,0.535,0.535,0.53,0.53,0.53,0.525,0.525,0.52,0.51,0.505,0.495,0.485,0.48,0.47500000000000003,0.465,0.45,0.435,0.425,0.41000000000000003,0.385,0.37,0.36,0.34500000000000003,0.33,0.31,0.31,0.305,0.3,0.29,0.29,0.28,0.275,0.27,0.27,0.27,0.265,0.265,0.27,0.27,0.27,0.27,0.265,0.275,0.27,0.27,0.265,0.275,0.275,0.27,0.265,0.265,0.275,0.27,0.265,0.27,0.27,0.27,0.265,0.265,0.275,0.27,0.27,0.27,0.28,0.28,0.27,0.275,0.295,0.3,0.31,0.32,0.33,0.34,0.34500000000000003,0.35000000000000003,0.36,0.37,0.37,0.38,0.39,0.395,0.405,0.41000000000000003,0.41500000000000004,0.41500000000000004,0.41000000000000003,0.41000000000000003,0.41000000000000003,0.41500000000000004,0.41500000000000004,0.405,0.4,0.4,0.395,0.385,0.38,0.375,0.37,0.36,0.34500000000000003,0.34,0.33,0.315,0.305,0.3,0.295,0.28500000000000003,0.275,0.275,0.28,0.275,0.275,0.28,0.28500000000000003];
    gen.rangeHigh = 1.5;
    gen.rangeLow = -0.5;
    gen.rate = 171;
    gen.dataType = 'MDC_ECG_LEAD_I';
    gen.unit = 'MDC_DIM_MILLI_VOLT';
    gen.currentIdx = 0;
    gen.previousIdx = 0;
    gen.timeFrame = 3000;

    // Public API here
    return {
      nextWaveSamples: nextWaveSamples
    };


    function nextWaveSamples() {
      advanceIndex();

      //var subSamples = getSubSamples();

      return createFhirObservation(gen.sampleData);
    }

    function advanceIndex() {
      gen.previousIdx = gen.currentIdx;
      gen.currentIdx = Date.now() % gen.timeFrame;
    }

    function getSubSamples() {
      var subSamples = [];
      if (gen.previousIdx < gen.currentIdx) {
        // General case
        subSamples = gen.sampleData.slice(gen.previousIdx, gen.currentIdx);
      } else {
        // When current point has started from the beginning again
        subSamples = gen.sampleData.slice(gen.previousIdx, gen.sampleData.length);
        Array.prototype.push.apply(subSamples, gen.sampleData.slice(0, gen.currentIdx));
      }
      return subSamples;
    }

    function createFhirObservation(subSamples){
      var obs = angular.copy(emptyWaveFormObservationObject);
      obs.entry[0].resource.code.coding[0] = {
        system: 'MDC',
        code: gen.dataType
      };
      obs.entry[0].resource.id = rfc4122.v4();
      obs.entry[0].resource.effectiveDateTime = (new Date()).toISOString();
      obs.entry[0].resource.valueSampledData.period = 1000 / gen.rate;
      obs.entry[0].resource.valueSampledData.lowerLimit = gen.rangeLow;
      obs.entry[0].resource.valueSampledData.upperLimit = gen.rangeHigh;
      obs.entry[0].resource.valueSampledData.origin =  {
          "value": 0,
          "units": gen.unit
      };
      obs.entry[0].resource.valueSampledData.data = subSamples.join(' ');
      return obs;
    }
  }
})();

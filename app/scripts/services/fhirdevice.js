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
        }, 500);
      },
      getResourcePrefix: function(){
        return resourcePrefix;
      },
      getResourceType: function(){
        return resourceType;
      }
    };
  }]);

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

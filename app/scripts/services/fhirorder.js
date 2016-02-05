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




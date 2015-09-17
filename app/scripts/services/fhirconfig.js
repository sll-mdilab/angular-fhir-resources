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

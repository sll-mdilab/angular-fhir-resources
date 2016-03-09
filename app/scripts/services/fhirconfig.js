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

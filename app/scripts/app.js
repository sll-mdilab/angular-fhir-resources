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
  .config(function($httpProvider, localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('angularFhirStorage');

    $httpProvider.interceptors.push('fhirAuthInterceptor');
  });





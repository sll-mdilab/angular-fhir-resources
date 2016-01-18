'use strict';

/**
 * @ngdoc service
 * @name angularFhirResources.fhiroauth
 * @description
 * # fhiroauth
 * Service in the angularFhirResources.
 */
angular.module('angularFhirResources')
  .service('fhirOauth', ['fhirConfig', function (fhirConfig) {
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
        var defaultPractitioner = 
        {
            "resourceType": "Practitioner",
            "id": userId,
            "identifier": [
              {
                "value": userId
              }
            ],
            "name": {
              "text": "Unregistered Practitioner"
            },
            "practitionerRole": [
              {
                "role": {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "158965000",
                      "display": "Medical practitioner"
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
	    	console.log('Ready callback.');

	    	fhirConfig.setAuthToken(smart.tokenResponse.access_token);
	        console.log(smart.tokenResponse);

	        // The first request sometimes give 401, this is a temporary workaround
	        smart.api.search({type: "Patient"}).always(function(){
	            smart.user.read().done( function(currentPractitioner){
	                callback(currentPractitioner);
	            }).fail(function() {
	            	callback(getDefaultPractitioner(getIdPart(smart.userId)));
	            });
	        });
	}, errback);
    };
  }]);

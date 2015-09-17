# angular-fhir-resources

This library is used to communicate with the FHIR backend service provided by the Medical Device Integration (MDI) Lab at the Innovation Centre at Karolinska, Solna.

You can install angular-fhir-resources through bower by running:

```javascript
bower install sll-mdilab/angular-fhir-resources --save
```
and include it in your app as a dependency

```javascript
angular.module('myApp', [
    // Other dependencies
    ...
    'angularFhirResources'
  ])
  .config(
    ...
  );
);
```

and configuring the library to use correct API credentials for the backend service.

```javascript
angular.module('myApp')
  .config(function(fhirConfigProvider){
    ...
    fhirConfigProvider.setAPICredentials('MY_API_USERNAME', 'MY_API_KEY');
    fhirConfigProvider.setBackendURL('BACKEND_SERVICE_URL');
  });
```

You can now access the following FHIR resources by injecting them in appropriate service or controller

- Observation (`fhirObservation`)
- Device (`fhirDevice`)
- DeviceUseStatement (`fhirDeviceUseStatement`)
- Encounter (`fhirEncounter`)
- Patient (`fhirPatient`)
- Practitioner (`fhirPractitioner`)

Custom resources:

- BrokeringReceiver (`fhirBrokeringReceiver`)


### Optional

Recommended is to put API configurations in a angular constant service such as

```javascript
angular.module('myApp')
  .constant('fhirAPI', {
    // Insert your API credentials here
    apiUser: 'MY_API_USERNAME',
    apiKey: 'MY_API_KEY',
    url: 'BACKEND_SERVICE_URL'
  });
```

and inject it in the config

```javascript
angular.module('myApp')
      .config(function(fhirConfigProvider, fhirAPI){
        ...
        fhirConfigProvider.setAPICredentials(fhirAPI.apiUser, fhirAPI.apiKey);
        fhirConfigProvider.setBackendURL(fhirAPI.url);
      });
```

## Build & development

The procedure when updating is the following:

1. Make changes and commit.

2. Update `bower.json` (`main` & `version`) and `package.json` (`version`) with new version number (X.Y.Z) according to [SemVer](http://semver.org/). 

3. Run `grunt build` to build the dist files.

4. Stage and commit the build files: `git add --all && git commit -m 'vX.Y.Z'`.

5. Run `git tag vX.Y.Z`.

6. Push to remote: `git push`

7. Switch to repo using `angular-fhir-resources`.

8. Run `bower update angular-fhir-resources`.

9. Restart grunt server.


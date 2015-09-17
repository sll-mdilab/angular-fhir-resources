# angular-fhir-resources

This library is used to communicate with the FHIR backend service provided by the Medical Device Integration (MDI) Lab at the Innovation Centre at Karolinska, Solna.

To use the library, import it using `bower`. Since this is a private repo you need to authenticate your Github account. 
Follow the instructions shown in this video, a summarized description is shown below: https://youtu.be/ExU_ZcONHxs

**In Github:**

1. Go to Settings --> Personal Access Token and generate a new Access Token. 
2. The Access Token needs the *repo* scope to be able to access private repos.
3. Copy the string generated.
   
**In the terminal:**

1. Create a new file in the user directory called `.netrc` if it doesn't exist: `touch .netrc`
2. Add the following to the `.netrc` file and replace what's inside brackets with your credentials:

    ```
    machine github.com
  	  login [GITHUB USERNAME]
  	  password [GENERATED ACCESS TOKEN STRING]
    ```

3. Execute: `git config --global url."https://github".insteadOf git://github`. This will enforce https instead of ssh.

You can now install angular-fhir-resources through bower by running:

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

4. Commit the build files: `git commit -m 'vX.Y.Z'`.

5. Run `git tag vX.Y.Z`.

6. Push to remote: `git push`

7. Switch to repo using `angular-fhir-resources`.

8. Run `bower update angular-fhir-resources`.

9. Restart grunt server.


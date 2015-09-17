'use strict';

describe('Service: fhirReceiver', function () {

  // load the service's module
  beforeEach(module('angularFhirResources'));

  // instantiate service
  var fhirReceiver;
  beforeEach(inject(function (_fhirReceiver_) {
    fhirReceiver = _fhirReceiver_;
  }));

  it('should do something', function () {
    expect(!!fhirReceiver).toBe(true);
  });

});

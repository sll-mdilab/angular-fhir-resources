'use strict';

describe('Service: fhiroauth', function () {

  // load the service's module
  beforeEach(module('angularFhirResources'));

  // instantiate service
  var fhiroauth;
  beforeEach(inject(function (_fhiroauth_) {
    fhiroauth = _fhiroauth_;
  }));

  it('should do something', function () {
    expect(!!fhiroauth).toBe(true);
  });

});

// Generated by LiveScript 1.2.0
var k, errors;
k = require('./../constants/constants').k;
errors = require('./../constants/constants').errors;
describe('How constants are used:', function(){
  var x$;
  x$ = it;
  x$('should successfully return specified strings', function(){
    expect(k.id).toBe('id');
    expect(k['in']).toBe('in');
    expect(errors.createNewJob).toBe('A new job must be created in the job settings first!');
  });
});
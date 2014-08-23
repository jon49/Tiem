var
   _ = require('./../../node_modules/lodash/lodash'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   o = require('./../utilities/utilities-objects'),
   listObjects = require('./../constants/object-keys').listObjects,
   L = require('./../constants/lenses'),
//   k = require('./../constants/constants').k,
//   Validation = require('./../../node_modules/fantasy-validations/validation')

   jobs = 'Jobs',

   getList = o.get(L.list),

   isSelf = t.isObjectNamed('Jobs'),

   getJobBy = _.curry(function(lens, jobs, value){
      return o.filterByLensNow(lens, getList(jobs), value)
   }),

   Jobs

module.exports = (
   Jobs =
   environment() 
    .method(
       'create',
       t.identifiers([t.isArrayOf(t.isObjectNamed('Job'))]),
       t.tagged('Jobs', listObjects, [[]])
    )
    .property(
       'isSelf',
       isSelf
    )
   .method(
      'with',
      t.identifiers([isSelf, t.isOptionOf(t.isObjectNamed('Job'))]),
      function(jobs, option){
         return Jobs.create(o.xAddToListNow(L.id, option, getList(jobs)))
      }
   )
    .method(
       'get',
       t.identifiers([isSelf, t.isWholeNumber]),
       getJobBy(L.id)
    )
)

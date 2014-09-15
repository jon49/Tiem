var
   _ = require('./../../node_modules/lodash/lodash'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   o = require('./../utilities/utilities-objects'),
   Job = require('./Job'),

   keys = ['list'],

   L = _.assign(t.makeLenses(keys), Job.L),

   jobs = 'Jobs',

   getList = o.get(L.list),

   isSelf = t.isObjectNamed('Jobs'),

   getJobBy = _.curry(function(lens, jobs, value){
      return o.filterByLensNow(lens, getList(jobs), value)
   })

module.exports = (
   Jobs =
   environment() 
    .method(
       'create',
       t.identifiers([t.isArrayOf(t.isObjectNamed('Job'))]),
       t.tagged('Jobs', keys, [[]])
    )
    .property(
       'isSelf',
       isSelf
    )
   .method(
      'with',
      t.identifiers([isSelf, t.isObjectNamed('Job')]),
      function(jobs, newJob){
         return Jobs.create(o.xAddToListNow(L.id, newJob, getList(jobs)))
      }
   )
    .method(
       'get',
       t.identifiers([isSelf, t.isWholeNumber]),
       getJobBy(L.id)
    )
)

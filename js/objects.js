/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

var k = constants([['id'],
                   ['singleDay'],
                   ['in'],
                   ['out'],
                   ['state', 'clockState'],
                   ['day'],
                   ['jobList'],
                   ['clockedState'],
                   ['name'],
                   ['clocked'],
                   ['comment'],
                   ['total'],
                   ['jobActive'],
                   ['jobs'],
                   ['jobPlaceHolder', 'Add Job'],
                   ['stampsIn', 'stamps-in'],
                   ['stampsOut', 'stamps-out']
])

t = t.property('k', k)

var jobSettingKeys = [k.id(), k.name(), k.jobActive()]
var clockInKeys = [k.in()]
var clockOutKeys = [k.out()]
var jobKeys = [k.id(), k.name(), k.comment(), k.singleDay(), k.total(), k.state()]

var L = makeLenses(_.union(jobSettingKeys, clockInKeys, clockOutKeys, jobKeys, ['target', 'list']))

t = t.property('L', L)

// **Validate objects**

function Jobs(){
   this.list = []
}
function JobSettings(){
   this.list = []
}

// #Object Definitions
// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = b.tagged('JobSetting', jobSettingKeys)
var JobSettingOption = b.tagged('JobSettingOption', ['target'])
//var jobSetting = _.curry(JobSetting)
// {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
var ClockedIn = b.tagged('ClockedIn', clockInKeys)
var ClockedOut = b.tagged('ClockedOut', clockOutKeys)
//var JobSkeleton = b.tagged('JobSkeleton', [k.id(), k.comment(), k.singleDay(), k.state()])
//var jobSkeleton = _.curry(JobSkeleton)
var Job = b.tagged('Job', jobKeys)
var JobOption = b.tagged('JobOption', ['target'])
//var job = _.curry(Job)

// use lens to get job from list
var getJobBy = _.curry(function(lens, value){
   return JobSettingOption(toOption(filterByLensNow(L.list, lens, value, this)))
})

// use id key to get exclusively add updated job
var xAddJob = _.compose(_.partial(xAddToList, L.id), get(L.target))

// replace the old list with updated list
var replaceList = function(fn, object, thisArg){
   var self = thisArg || this
   self.list = fn.call(get(L.list, self), object)
   return self
}

// determine if the job id is valid
var validJobId = function(list, id){
   var id_ = parseInt(id)
   return   isNaN(id_)                              ? b.failure(['ID is not a number'])
          : !_.any(list, b.singleton(k.id(), id_))  ? b.failure(['No ID number exists'])
          : b.success(id_)
}

// determine if the new job name is valid
var validJobName = function(list, name){
   var name_ = name.trim()
   return _.isEmpty(name_)          ? b.failure(['Job name must contain characters'])
          : _.any(list, function(j){
             return _.isEqual(name_.toLowerCase(), j.name.toLowerCase())
          })                        ? b.failure(['Job name already exists'])
          : b.success(name_)
}

// validate a single item
var validateSingle = function(type, validation, success, failure){
   var 
      type_ = b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type])),
      result = b.Do()(b.Do()(validation < type_))
   result.cata({
      success: success,
      failure: failure
   })
}

// validate the job name
var validJobName_ = function(name){
   var that = this, v
   validateSingle(k.name(),
                  validJobName(that.list, name), 
                  function(value){
                     that.target = b.none
                     v = b.success(value.name)
                  },
                  function(errors){
                     that.target = b.none
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

// validate the job selection (id or name)
var validJobSelection = function(object){
   var v
   validateSingle(k.id(),
                  validJobId(get(L.list, this), object), 
                  function(value){
                     v = b.success(getJobBy(L.id, value, get(L.list, this)))
                  },
                  function(errors){
                     that.target = b.none 
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

// set property of target to new value
var change = _.curry(function(lens, value){
   var target = get(L.target, this)
   return set(L.target, this, target.map(over(lens, b.constant(value))))
})
   
//Determine if the job is clocked in or out.
var isClockedIn = hasDeep('in') 

//Job is clocked in. Clock it out and update number of hours worked.
var clockOut = function (job, date) {
    var start = fractionalHours(get(l[k.in()].compose(l[k.state()]), job)),
        end = fractionalHours(date),
        newSingleDay = addRollingArray(get(l[k.singleDay()], job), start, end, 1)
    return _.reduce([[k.state(), ClockedOut(date)], [k.singleDay(), newSingleDay], [k.total(), sum(newSingleDay)]], 
                    function(acc, value){
                        return set(l[_.first(value)], acc, _.last(value))
                    }, job)
}

// Toggle the clock in object.
var updateDate = function(date){
   return this.map(function(job){
      return isClockedIn(job)
             ? clockOut(job, date)
             : set(l[k.state()], job, date) // clock in
      })
}

// validate inputs
var isCreateJobSetting = function(id, name, active){
   return isWholeNumber(id) && _.isString(name) && _.isBoolean(active)
}

// validate inputs
var isCreateJob = function(jobSettings, id, comment, singleDay, inOut, date){
   return isWholeNumber(id)
      && _.isString(comment)
      && (b.isOption(singleDay) && singleDay.fold(function(a){return _.isArray(a) && a.length === 24}, function(){return true}))
      && (_.isEqual(inOut, k.in()) || _.isEqual(inOut, k.out()))
      && _.isDate(date)
      && b.isInstanceOf(JobSettings, jobSettings)
}

// create a new job object
var createJob = function(jobSettings, id, comment, singleDay, inOut, date){
   var jobSetting = _.find(jobSettings.list, _.compose(isEqual(id), _.partial(getNow, L.id)))
   if (_.isEmpty(jobSetting))
      return b.error('A new job must be created in the job settings first!')
   var singleDay_ = singleDay.getOrElse(_.range(24).map(function(){return 0}))
   var inOut_ = _.isEqual(inOut, k.out()) ? ClockedOut(date) : ClockedIn(date)
   return Job(id, jobSetting[k.name()], comment, singleDay_, t.sum(singleDay_), inOut_)
}

t = 
   t.property(
   'JobSetting',
   b.environment()
      .method(
         'create',
         isCreateJobSetting,
         _.compose(JobSettingOption, toOption, JobSetting) 
      )
      .property(
         'newId',
         f('(new Date()).getTime()')
      )
      .method(
         'update',
         _.isString,
         change(L.name)
      )
      .method(
         'update',
         _.isBoolean,
         change(L.jobActive)
      )
      .method(
         'toObject',
         b.isInstanceOf(JobSettingOption),
         function(){return get(L.target, this).getOrElse({})}
      )
)

t = 
   t.property(
   'JobSettings',
   b.environment() 
      .property(
         'new',
         function(){return new JobSettings()}
      )
      .method(
         'validSelection',
         function(v){return _.isString(v) || _.isNumber(v)},
         validJobSelection
      ) 
      .method(
         'validName',
         _.isString,
         validJobName_
      )
      .method(
         'update',
         b.isInstanceOf(JobSettingOption),
         _.partial(replaceList, xAddJob)
      )
      .method(
         'id',
         isWholeNumber,
         getJobBy(L.id)
      )
      .method(
         'name',
         _.isString,
         getJobBy(L.name)
      )
      .property(
         'toArray',
         _.partial(getNow, L.list)
      )
)
   
// t = 
//    t.property(
//    'Jobs',
//    b.environment()
//       .property(
//          'new',
//          function(){return new Jobs()}
//       )
//       .method(
//          'update',
//          b.isInstanceOf(JobSetting),
//          xAddJob 
//       )
// )
// 
// t = t.property(
//    'Job',
//    b.environment()
//       .method(
//          'create',
//          isCreateJob,
//          createJob
//       )
//       .method(
//          'add',
//          b.isInstanceOf(Job),
//          addJob
//       )
//       .method(
//          'id',
//          isWholeNumber,
//          getJobBy(L.id)
//       )
//       .method(
//          'update',
//          _.isString,
//          change(L.comment)
//       )
//       .method(
//          'update',
//          _.isDate,
//          updateDate
//       )
//       .method(
//          'addNew',
//          isCreateJob,
//          _.compose(addJob, createJob)
//       )
// )

var extendObject = function(object, extensions){
      _(extensions).forIn(function(value, key){
         object.prototype[key] = value 
      })
}

extendObject(JobSettingOption, t.JobSetting)
extendObject(JobSettings, t.JobSettings)
// extendObject(Jobs, t.Jobs)
// extendObject(Job, t.Job)

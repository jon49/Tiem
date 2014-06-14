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
var targetOption = ['target']
var listObjects = ['list']

var L = makeLenses(_.union(jobSettingKeys, clockInKeys, clockOutKeys, jobKeys, targetOption, listObjects))

t = t.property('L', L)

// **Validate objects**

// #Object Definitions
// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = b.tagged('JobSetting', jobSettingKeys),
// {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
    ClockedIn = b.tagged('ClockedIn', clockInKeys),
    ClockedOut = b.tagged('ClockedOut', clockOutKeys),
    Job = b.tagged('Job', jobKeys),
    JobSettingOption = b.tagged('JobSettingOption', targetOption),
    JobOption = b.tagged('JobOption', targetOption),
    JobSettings = b.tagged('JobSettings', listObjects),
    Jobs = b.tagged('Jobs', listObjects)

// use lens to get job from list
var getJobByNow = function(lens, value, list){
   var list_ = list || this
   return JobSettingOption(toOption(filterByLensNow(L.list, lens, value, list_)))
}

var getJobBy = _.curry(getJobByNow, 2)

// use id key to get exclusively add updated job
var xAddJob = function(option, listWrapped){
   return xAddToList(L.id, getNow(L.target, option), getNow(L.list, listWrapped || this))
}

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
var validJobName = function(name, list){
   var name_ = name.trim(), isSameName = isEqual(name_.toLowerCase())
   return _.isEmpty(name_)          ? b.failure(['Job name must contain characters'])
          : _.any(_.pluck(list, 'name'), _.compose(isSameName, invoke('toLowerCase', void 0)))
                                    ? b.failure(['Job name already exists'])
          : b.success(name_)
}

// validate a single item
var validateSingle = function(type, validation){
   var type_ = b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type]))
   return b.Do()(b.Do()(validation < type_))
}

// validate the job name
var validJobName_ = function(name, thisArg){
   var list = get(L.list, (thisArg || this))
   return validateSingle(k.name(), validJobName(name, list))
}

// validate the job selection (id or name)
var validId = function(object, thisArg){
   var self = (thisArg || this), list = get(L.list, self)
   return validateSingle(k.id(), validJobId(list, object))
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
    var start = fractionalHours(get(L.in.compose(L.clockState), job)),
        end = fractionalHours(date),
        newSingleDay = addRollingArray(get(L.singleDay, job), start, end, 1)
    return _.reduce([[L.clockState, ClockedOut(date)], [L.singleDay, newSingleDay], [L.total, sum(newSingleDay)]], 
                    function(acc, value){
                       var temp = set(_.first(value), acc, _.last(value))
                       return set(_.first(value), acc, _.last(value))
                    }, job)
}

// Toggle the clock in object.
var updateDate = function(date, thisArg){
   var self = thisArg || this,
       job = get(L.target, self),
       result = job.map(function(j){
         return isClockedIn(j)
                ? clockOut(j, date)
                : set(L.clockState, j, ClockedIn(date)) // clock in
         })
   return set(L.target, self, result)
} //set(L.target, this, target.map(over(lens, b.constant(value))))

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

var toObject = function(){return get(L.target, this).getOrElse({})}

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
         toObject
      )
)

t = t.property(
    'Job',
    b.environment()
       .method(
          'create',
          isCreateJob,
           _.compose(JobOption, toOption, createJob)
       )
       .method(
          'update',
          _.isString,
          change(L.comment)
       )
       .method(
          'update',
          _.isDate,
          updateDate
       )
      .method(
         'toObject',
         b.isInstanceOf(JobOption),
         toObject
      )
)

t = 
   t.property(
   'JobSettings',
   b.environment() 
      .method(
         'create',
         isArrayOf(b.isInstanceOf(JobSetting)),
         JobSettings
      )
      .method(
         'valid',
         _.isNumber,
         validId
      ) 
      .method(
         'valid',
         _.isString,
         validJobName_
      )
      .method(
         'update',
         b.isInstanceOf(JobSettingOption),
         function(x){ return JobSettings(xAddJob(x, this) ) }
      )
      .method(
         'get',
         isWholeNumber,
         getJobBy(L.id)
      )
      .method(
         'get',
         _.isString,
         getJobBy(L.name)
      )
      .property(
         'toArray',
         _.partial(getNow, L.list)
      )
)

t = 
   t.property(
   'Jobs',
   b.environment()
      .method(
         'create',
         isArrayOf(b.isInstanceOf(Job)),
         Jobs
      )
      .method(
         'update',
         b.isInstanceOf(JobOption),
         function(x){ return Jobs(xAddJob(x, this) ) }
      )
      .method(
         'get',
         isWholeNumber,
         getJobBy(L.id)
      )
     .property(
        'toArray',
        _.partial(getNow, L.list)
     )
)

var extendObject = function(object, extensions){
      _(extensions).forIn(function(value, key){
         object.prototype[key] = value 
      })
}

extendObject(JobSettingOption, t.JobSetting)
extendObject(JobSettings, t.JobSettings)
extendObject(JobOption, t.Job)
extendObject(Jobs, t.Jobs)

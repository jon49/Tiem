/**
 * Created by jon on 2/11/14.
 */

/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */
/*global t, _, b */
 
/**
 **Objects**
 */

/**
 * Object constants
 */
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

// **Validate objects**

var Jobs = function(){
   this.list = []
   this.current = b.none
}
var JobSettings = function(){
   this.list = []
   this.current = b.none
}

// #Object Definitions
// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = _.curry(t.tagged('JobSetting', [k.id(), k.name(), k.jobActive()]))
// {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
var ClockedIn = _.curry(t.tagged('ClockedIn', [k.in()]))
var ClockedOut = _.curry(t.tagged('ClockedOut', [k.out()]))
//var JobSkeleton = b.tagged('JobSkeleton', [k.id(), k.comment(), k.singleDay(), k.state()])
//var jobSkeleton = _.curry(JobSkeleton)
var Job = _.curry(t.tagged('Job', [k.id(), k.name(), k.comment(), k.singleDay(), k.total(), k.state()]))

t = t
   .property(
      'JobSetting',
      JobSetting
   )
   .property(
      'ClockedIn',
      ClockedIn
   )
   .property(
      'ClockedOut',
      ClockedOut
   )
   .property(
      'Job',
      Job
   )

// #Controller

var getJobById = function(id){
   var id_ = _.zipObject([k.id()], [id])
   var current = _.find(this.list, id_)
   this.current = _.isEmpty(current) ? b.none : b.some(current)
   return this
}

   
var addJob = function(){ 
   var job = _.first(arguments),
      ow = _.last(arguments),
      overwrite = _.isBoolean(ow) ? ow : false
   if (_.contains(this.list, job[k.id()]) && !overwrite){
      this.current = b.none
      return this
   }
   this.current = b.some(job)
   return addCurrentJob(this)
}

var validJobId = function(list, id){
   var id_ = parseInt(id)
   return isNaN(id_)
      ? b.failure(['ID is not a number'])
      : !_.any(list, _.zipObject([k.id()], [id_]))
      ? b.failure(['No ID number exists'])
      : b.success(id_)
}

var validJobName = function(list, name){
   var name_ = name.trim()
   return _.isEmpty(name_)
      ? b.failure(['Job name must contain characters'])
      : _.any(list, _.zipObject([k.name()], [name_]))
      ? b.failure(['Job name already exists'])
      : b.success(name_)
}

var validateSingle = function(type, validation, success, failure){
   var 
      type_ = b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type])),
      result = b.Do()(b.Do()(validation < type_))
   result.cata({
      success: success,
      failure: failure
   })
}

var validJobName_ = function(name){
   var that = this, v
   validateSingle(k.name(),
                  validJobName(that.list, name), 
                  function(value){
                     that.current = b.none
                     v = b.success(value.name)
                  },
                  function(errors){
                     that.current = b.none
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

var validJobSelection = function(object){
   var that = this, v
   validateSingle(k.id(),
                  validJobId(that.list, object), 
                  function(value){
                     getJobById.apply(that, [value.id])
                     v = b.success(that.current.getOrElse(''))
                  },
                  function(errors){
                     that.current = b.none 
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

var change = _.curry(function(property, value){
   if (this.current.isSome){
      var job = this.current.getOrElse({})
      job[property] = value
      this.current = b.some(job)
      return addCurrentJob(this)
   }
})

   
//Determine if the job is clocked in or out.
var isClockedIn = function (job) {
    return _.has(job[k.state()], k.in())
}

//Change job state to clocked in.
var clockIn = function (job, date) {
   job[k.state()] = ClockedIn(date)
   return job
}

//Job is clocked in. Clock it out and update number of hours worked.
var clockOut = function (job, date) {
    var start = fractionalHours(job[k.state()][k.in()])
    var end = fractionalHours(date)
    var newSingleDay = addRollingArray(job[k.singleDay()], start, end, 1)
    job[k.state()] = ClockedOut(date)
    job[k.singleDay()] = newSingleDay
    job[k.total()] = sum(newSingleDay)
    return job
}

var updateDate = function(date){
   //Toggle clock
   var job = this.current.getOrElse({})
   this.current = b.some((isClockedIn(job)) ? clockOut(job, date) : clockIn(job, date))
   return addCurrentJob(this)
}

//id, comment, singleDay, inOut, date
//k.id(), k.name(), k.comment(), k.singleDay(), k.total(), ClockState
var createJob = function(jobSettings, id, comment, singleDay, inOut, date){
   var jobSetting = _.find(jobSettings.list, function(setting){
      return _.isEqual(setting[k.id()], id)
   })
   if (_.isEmpty(jobSetting))
      return b.error('A new job must be created in the job settings first!')
   var singleDay_ = singleDay.getOrElse(_.range(24).map(function(){return 0}))
   var inOut_ = _.isEqual(inOut, k.out()) ? ClockedOut(date) : ClockedIn(date)
   return Job(id, jobSetting[k.name()], comment, singleDay_, sum(singleDay_), inOut_)
}

var toArray = function(){return this.list}

var toObject = function(){return this.current}
   

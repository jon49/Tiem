/**
 * Created by jon on 2/13/14.
 */

/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */
/* global _ */

/**
 * Contains useful functions for general use.
 **Utilities**
 */

var b = bilby
var t = b.environment()

var f = function(func){
   var funcArray = func.split('->')
   return   (funcArray.length === 1)
            ? new Function('x', 'return (' + funcArray[0].trim() + ')')
            : new Function(funcArray[0].trim(), 'return (' + funcArray[1].trim() + ')')
}

/**
 * Takes an object and returns a string of specified length or less, trimmed.
 * @param {String} string String to clean and resize.
 * @param {Number} size Integer to resize string to.
 * @returns {String} New string which has been trimmed and resized.
 */
var stringSize = function (string, size) {
   "use strict";
   if (!_.isNumber(size)) {
      throw new Error("stringSize : Not a number!")
   }
   return String(string).trim().slice(0, size)
}

/**
 * Takes a number and determines if it is a whole number.
 * @param {Number} number Number to test.
 * @returns {Boolean} True if whole number otherwise false.
 */
var isWholeNumber = function (number) {
   "use strict";
   if (_.isNumber(number) && (number > -1) && (Math.floor(number) === number)) {
      return true
   }
   return false
}

/**
 * Takes a number and determines if it is equal to or inbetween two other numbers.
 * @param {Number} lower Lower bound to test.
 * @param {Number} upper Upper bound to test.
 * @param {Number} value Number to test.
 * @returns {Boolean} True if between upper & lower bounds, otherwise false.
 */
var isBetween = function (lower, upper, value) {
   "use strict";
   if ((lower <= value) && (value <= upper)) {
      return true
   }
   return false
}

/**
 * Determine if items in object are unique.
 * @param {Array<Object>} objects Objects to test if they are unique.
 * @param {String} property Property name of object to test against.
 * @returns {Boolean} True if unique, otherwise false.
 */
var areUnique = function (objects, property) {
   'use strict';
   if (_.isEmpty(objects)) {
      return false
   }
   var objectProperties = _.map(objects, property)
   return _.isEqual(_.uniq(objectProperties).length, objects.length)
}

/**
 * Determine if key has unique values for an array of objects
 * @example tiem.areUniqueValues('myKey')([{key1: 1}, {key1: 2}]) => true
 * @param {String} key Key value to test.
 * @returns {Function} Function which takes an array of objects.
 */
var areUniqueValues = function (key) {
   return _.partialRight(areUnique, key)
}

/**
 * Converts to array then flattens results.
 * @param {Object} object Object to put in flattened array.
 * @returns {Array<Object>} Flattened array of objects.
 */
var toFlatArray = _.compose(_.flatten, _.toArray)

/**
 * Takes complement of a function.
 * @param {function(*):Boolean} predicate Function which returns a boolean.
 * @returns {function(*):Boolean} Function which returns the opposite of the original value.
 * @author Michael Fogus see: https://github.com/funjs/book-source
 */
var complement = function (predicate) {
   return function () {
      return !predicate.apply(null, _.toArray(arguments))
   }
}

/**
 * Adds a fraction value to array between two values.
 * @example tiem.addRollingArray([0, 0, 0, 0], 1.5, 4, 1) -> [0, 0.5, 1, 1]
 * @param {Array<Number>} array Original array values.
 * @param {Number} start Start index to begin can be fraction.
 * @param {Number} end End index to begin, can be be fraction.
 * @param {Number} fraction Value to add to array index, if at end or beginning will take the fraction of the value.
 * @returns {Array<Number>} a new array with added values.
 */
var addRollingArray = function (array, start, end, fraction) {
   var floor = Math.floor
   return _.map(array, function (value, index) {
      var isIndexStart = (floor(start) === index),
          isSameStartEndAndCorrectIndex = (floor(start) === floor(end) && isIndexStart),
          isIndexBetween = (floor(start) <= index && index <= floor(end)),
          isIndexEnd = (floor(end) === index)
      return   isSameStartEndAndCorrectIndex ? fraction * (end - start) + value
               : isIndexBetween
                  ? 
                     isIndexStart ? fraction * (1 + index - start) + value
                     : isIndexEnd ? fraction * (end - index) + value
                     : fraction + value // Index is fully between start and end values
               : value // Index is out of bounds return original value
   })
}

/**
 * @param {Date} date Date/Time to convert to fractions of hours.
 * @returns {Number} Fractional representation of hours.
 */
var fractionalHours = function (date) {
   return date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60
}

var isLikeNumber = function (num) {
   return !isNaN(parseFloat(num)) && isFinite(num)
}

/**
 * Sums an array.
 * @example tiem.sum([1, 2, 3]) => 6
 * @param {Array<Number>} array Array to sum.
 * @returns {Number} Sum.
 */
var sum = function (array) {
   return _.reduce(array, function (sum, num) {
      return sum + (isLikeNumber(num) ? +num : 0)
   })
}

var createObject = _.curry(function(key, value){return _.zipObject([key], [value])})

/**
 * Zips array of objects with functions.
 * @example tiem.zipObjectT(['Hello'], _.identity, function(){return ', world!'}) => {Hello: ', world!'}
 * @param {Array<Object>} array Array of objects to map and zip.
 * @param {function(<Object>)} funcKey Function which acts on key value of object.
 * @param {function(<Object>)} funcValue Function which act on value of the object.
 * @returns {<Object>} Returns an object.
 */
var zipObjectT = _.curry(function (funcKey, funcValue, array) {
   return _.zipObject(_.map(array, funcKey), _.map(array, funcValue))
})

/**
 * Uses an array of array structure to create constants.
 * @example tiem.constants([['yep', 'yay!'], ['nope']]) => {yep: _.constant('yay!'), nope: _.constant('nope')}
 * @param {Array<Object>} array Array of arrays which map to object.
 * @param {<Object>}
 */
var constants = zipObjectT(_.first, _.compose(_.constant, _.last))


/**
 * Determine if pairs (object, string) has object key name.
 * @example have([[{item: ''}, 'item'], [{item2: ''}, 'item2']]) => true
 * @param {Array<Object, String>} objects Objects to test for key values.
 * @returns {Boolean} True if all have correct key values else false.
 */
var have =
    _.compose(
        _.all,
        _.partialRight(
            _.map, function (a) {
               return _.has(_.first(a), _.last(a))
            }))
//https://github.com/antris/js-polymorphism/blob/master/feed/feed.js
var hasAll = _.curry(function(attrs, o){
   var has = _.curry(_.has)
   return _.every(attrs, has(o))
})


var isEqual = _.curry(_.isEqual, 2)

var singleTagged = function(type){
   return b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type]))
}

// combine objects together into new object. any keys which are the same will have an array of values.
var zipOverObject = _.curry(function(object1, object2){
   var o1 = _.cloneDeep(object1)
      o2 = _.cloneDeep(object2),
      a1 = _.keys(o1), a2 = _.keys(o2),
      diff = _.difference(a2, a1),
      inter = _.intersection(a1, a2),
      c1 = _.cloneDeep(o1)
   _.forEach(diff, function(key){
      c1[key] = o2[key]
   })
   _.forEach(inter, function(key){
      c1[key] = (_.isArray(c1[key])) ? c1[key] : [c1[key]]
      c1[key] = c1[key].concat(o2[key])
   })
   return c1
})

var zipOverObjects = _.partialRight(_.reduce, function(acc, o){
   return zipOverObject(acc, o)
})

var isSomething = complement(_.isEmpty)

var isSomeString = function(s){
   return isSomething(s) && _.isString(s)
}

var map = function(func){
   return _.partialRight(_.map, func)
}

var not = complement(_.identity)

var hasDeep = b.flip(_.compose(not, _.isEmpty, _.curry(_.findKey, 2)))
//var hasDeep = _.compose(not, _.isEmpty, _.rcurry2(_.findKey))

// Append/prepend to new array
var concat = _.curry(function(a, b){
   return _.isArray(a) ? a.concat(b) : b.concat(a)
})

//Lodash function changed for single item
var invokeNow = function(methodName, value, args){
   var isFunc = typeof methodName == 'function'
       func = isFunc ? methodName : (value != null && value[methodName])
       args_ = _.isArray(args) ? args : []
   return func ? func.apply(value, args_) : void 0
}

var invoke = _.curry(invokeNow, 2)

// Determine if array contains a single object type
var isArrayOf = _.curry(function(fn, a){
   return _.isArray(a) && _.all(a, fn)
})

t = t
   .property('stringSize', stringSize)
   .property('isWholeNumber', isWholeNumber)
   .property('isBetween', isBetween)
   .property('areUnique', areUnique)
   .property('areUniqueValues', areUniqueValues)
   .property('toFlatArray', toFlatArray)
   .property('complement', complement)
   .property('addRollingArray', addRollingArray)
   .property('fractionalHours', fractionalHours)
   .property('isLikeNumber', isLikeNumber)
   .property('sum', sum)
   .property('zipObjectT', zipObjectT)
   .property('constants', constants)
   .property('have', have)
   .property('hasAll', hasAll)
   .property('isEqual', isEqual)
   .property('createObject', createObject)
   .method('singleTagged', isSomeString, singleTagged)
   .method('zipOverObject', function(a, b){return _.isPlainObject(a) && _.isPlainObject(b)}, zipOverObject)
   .method('zipOverObjects', _.isArray, zipOverObjects)
   .property('isSomething', isSomething)
   .property('isSomeString', isSomeString)
   .method('not', _.isBoolean, not)
   .property('hasDeep', hasDeep)
   .property('invoke', invoke)
   .property('isArrayOf', isArrayOf)

/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

// create an object of lens objects
var makeLenses = _.compose(zipObjectT(_.identity, b.objectLens), _.unique)

// get value by lens
var getNow = function(lens, thisArg){
   return lens.run(thisArg || this).getter
}

var get = _.curry(getNow)

// set key of object and return a 'new' object
var setNow = function(lens, object, value){
   var newObject = lens.run(object).setter(value)
   return _.isEqual(newObject.__proto__, object.__proto__) ? newObject : (newObject.__proto__ = object.__proto__, newObject)
}
var set = _.curry(setNow)

// wrap an object in an `option`
var toOption = function(thisArg){
   var self = thisArg || this
   return _.isEmpty(self) || _.isEqual(self.self, window) ? b.none : b.some(self)
}

// get an object from an array and wrap in `option`
// example: filterByLensNow(L.list, L.id, 0) => plucked object
var filterByLensNow = function(lens, value, list){
   var list_ = (list || this)
   return toOption(_.first(_.filter(list_, function(o){
      return _.isEqual(get(lens, o), value)
   })))
}

//var filterByLens = _.curry(filterByLensNow)

// Exclusively add object (unwrapped) to list based on comparator
// example: xAddToList(lensId, someNone, []) => [object] OR []
var xAddToList = function(lens, option, list){
   var list_ = list || this
   return option.fold(function(opt){
      var isSame = isEqual(get(lens, opt))
      return _.reject(list_, function(o){
         return isSame(get(lens, o))
      }).concat(opt)
      }
   , list_)
}

// set new value in option object
// http://thisisafiller.ghoster.io/notes-on-functional-programming-patterns-for-the-non-mathematician-with-brian-lonsdorf/
// example: over(numberLens, b.constant(2), b.some({number: 1})) => b.some({number: 2})
var overNow = function(lens, fn, thisArg){
   var self = (thisArg || this)
   return set(lens, self, fn.call(null, lens.run(self).getter))
}

var over = _.curry(overNow)


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
var listObjects = ['list']

var L = makeLenses(_.union(jobSettingKeys, clockInKeys, clockOutKeys, jobKeys, listObjects, [k.jobs(), 'jobSettings']))

t = t.property('L', L)

// **Validate objects**

// #Object Definitions
// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = b.tagged('JobSetting', jobSettingKeys),
// {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
    ClockedIn = b.tagged('ClockedIn', clockInKeys),
    ClockedOut = b.tagged('ClockedOut', clockOutKeys),
    Job = b.tagged('Job', jobKeys),
    JobSettings = b.tagged('JobSettings', listObjects),
    Jobs = b.tagged('Jobs', listObjects)

// use lens to get job from list, returns option
var getJobByNow = function(lens, value, listObject){
   var list = get(L.list, listObject || this)
   return filterByLensNow(lens, value, list)
}

var getJobBy = _.curry(getJobByNow, 2)

// use id key to get exclusively add updated job
var xAddJob = function(option, listWrapped){
   return xAddToList(L.id, option, getNow(L.list, listWrapped || this))
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
          : _.any(_.pluck(list, 'name'), _.compose(isSameName, invoke('toLowerCase')))
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
var change = _.curry(function(lens, value, option){
   return option.map(function(o){
      return set(lens, o, value)
   })
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
   var job = thisArg || this,
       result = job.map(function(j){
         return isClockedIn(j)
                ? clockOut(j, date)
                : set(L.clockState, j, ClockedIn(date)) // clock in
         })
   return result
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

var toObject = function(thisArg){
   return (thisArg || this).getOrElse({})
}

var isOptionOf = _.curry(function(objectType, option){
   var temp = b.isOption(option)
   var temp0 = option.fold(function(o){
      return b.isInstanceOf(objectType, o)
      } , false)
   var temp0_ = option.fold(b.isInstanceOf(objectType), false)   
   var temp1 = option.isNone
   var all = temp && (temp0 || temp1)
   return b.isOption(option) && (option.fold(b.isInstanceOf(objectType), false) || option.isNone)
})

t = 
   t.property(
   'JobSetting',
   b.environment()
      .method(
         'create',
         isCreateJobSetting,
         _.compose(toOption, JobSetting) 
      )
      .method(
         'create',
         b.isInstanceOf(JobSetting),
         toOption
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
         b.isOption,
         toObject
      )
)

t = t.property(
    'Job',
    b.environment()
       .method(
          'create',
          isCreateJob,
           _.compose(toOption, createJob)
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
         b.isOption,
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
         isOptionOf(JobSetting),
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
         isOptionOf(Job),
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

extendObject(JobSettings, t.JobSettings)
extendObject(Jobs, t.Jobs)

/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k */

var Controller = function() {
   this.date = new Date()
   this.jobSettings = t.JobSettings.create([toObject(t.JobSetting.create(0, 'My Job', true)), toObject(t.JobSetting.create(1, 'My cool job', true))])
   
   this.jobs = t.Jobs.create([])

   this.settings = {
      inColor: 'DarkSeaGreen',
      outColor: 'FireBrick',
      inTextColor: 'black',
      outTextColor: 'white'
   }
      
}

Controller.prototype.update = function(o){
   return _.extend(this, o)
}















/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

var fadeIn = function(e, isInit){
   if (!isInit) $(e).delay(250).fadeIn(1000)
}

var fadeOut = function(e, isInit){
   if (!isInit) $(e).delay(250).fadeOut(1000)
}

var $tm = void 0

var define$tm = function(e, isInit){if (!isInit) $tm = $(e)}

var moveE = function(e, isInit){
   if(!isInit){
      var $te = $(e)
      // position and widths of `Time` divs
      var pTi = 0, wTi = 29, pm = 29, pe = 57, wm = 28, we = 18
      $tm.delay(2000).animate({
         left: (pe - pm - (wm - we))
      }, 1000)
      $te.delay(2000).animate({
         left: (pm - pe)
      }, 1000)
   }
}

// ------ Job Input --------

var createNewJob = function(name){
   return confirm('Create a new job with name: "' + name + '"?')
          ? t.JobSetting.create(t.JobSetting.newId(), name, true)
          : b.none
}

// adds a new job to job & job settings list
var addJob = function(ctrl, value){
   //*****validate job here**********
   var jobSettings = get(L.jobSettings, ctrl)

   var jobSetting = jobSettings.valid(value).cata({
      success: function(v){
         return   _.has(v, k.id())
                  ? jobSettings.get(get(L.id, v))
                  : createNewJob(get(L.name, v))
      },
      failure: function(errors){
         // show errors
         // future work
         return b.none
      }
   })
   jobSetting.map(function(j){
      // jobSettings, id, comment, singleDay, inOut, date
      var settings = jobSettings.update(t.JobSetting.create(j)),
          jobs = get(L.jobs, ctrl).update(t.Job.create(settings, j.id, '', b.none, k.in(), new Date()))
      // update controller
      ctrl.update(_.zipObject(['jobs', 'jobSettings'], [jobs, settings]))    
   })
}

var toggleButton = _.curry(function(id, e){
   var ctrl = this 
       jobs = get(L.jobs, ctrl), //jobs list
       job = t.Job.update(new Date(), jobs.get(id)), // toggled job
   ctrl.update(b.singleton('jobs', jobs.update(job))) // get new list then update controller
})

var selectize_ = {}

selectize_.config = function(ctrl){
   return function(element, isInit){
      var $el = $(element)
      if (!isInit){
         var options$ = _.reject(ctrl.jobSettings.toArray(), function(job){
               return _.contains(ctrl.jobs.toArray(), job.name)
            })
         var options_ = {
            persist: false,
            selectOnTab: false, // Tab loses focus along with selecting. Will have to wait until this is fixed, or take care of it myself.
            maxItems: 1,
            create: true,
            hideSelected: true,
            options: options$,
            labelField: k.name(),
            valueField: k.id(),
            searchField: k.name(),
            sortField: k.name(),
            borderColor: ctrl.settings.inColor,
            onChange: function(value){
               m.startComputation()
               if (!_.isEmpty(value)){
                  addJob(ctrl, isLikeNumber(value) ? parseInt(value) : value)
                  selectize.removeOption(value)
                  selectize.refreshItems()
                  selectize.showInput()
               }
               m.endComputation()
            }
         } 
         var $select = $el.selectize(options_)
         var selectize = $select[0].selectize
      }
   }
}





/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

;(function(){
   'use strict';
   
   var cssDeclaration = function(property, value){
      return property + ': ' + value + ';'
   }

   var styles = function(settings){
      return m('style', 
               ['.stamps-in button, .inBackgroundColor {' ,
                  cssDeclaration('background-color', settings.inColor) ,
                  cssDeclaration('color', settings.inTextColor) ,
               '}' ,
               '.stamps-out button {' ,
                  cssDeclaration('background-color', settings.outColor) ,
                  cssDeclaration('color', settings.outTextColor) ,
               '}' ,
               '.inColor {color: ' , settings.inColor , ';}' ,
               '.selectize-input {border-color: ' , settings.inColor , ';}'].join('')
              )
   }

   var header = function(ctrl){
      return m('header.pure-g', [
         m('h1.title.pure-u-1-2.inColor', [
            m('#ti', 'Ti'),
            m('#t-m', {config: define$tm}, 'm'),
            m('#t-e', {config: moveE}, 'e'),
            m('div', {config: fadeOut}, 'card')
         ]),
         m('.stamp.date.pure-u-1-2', [
            m('button.pure-button.options.inBackgroundColor', [
               m('i.fa.fa-gear')
            ]),
            m('button.pure-button.inBackgroundColor', ctrl.date.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric" }))
         ])
      ])
   }

   var autoComplete = function(ctrl){
      //<select id="jobs" placeholder="Enter job name"></select>
      return m('#jobs', [
         m('select', {placeholder: 'Enter job name', config: selectize_.config(ctrl)})
      ])
   }

   var tiemStamp = _.curry(function(hideMe, job, ctrl){
      var displayNone = (hideMe) ? {display: 'none'} : {},
          fadeMeIn = hideMe ? fadeIn : {},
          clockState = job.clockState[(isClockedIn(job) ? k.in() : k.out())]
      return m('.stamp.pure-g', {id: job.id, style: displayNone, config: fadeMeIn}, [
               m('button.pure-button.pure-u-14-24.jobButton', {title: job.name, onclick: toggleButton.bind(ctrl, job.id)}, job.name),
               m('button.pure-button.pure-u-5-24.time', {title: clockState}, clockState.toLocaleTimeString()),
               m('button.pure-button.pure-u-3-24.hours', job.total.toFixed(2)),
               m('button.pure-button.pure-u-2-24.notes', {title: job.comment}, [
                  m('i.fa.fa-pencil')
               ]),
               m('button.pure-button.pure-u-1-1.text-left.wrap-word.hidden.comment', job.comment)
              ])
   })

   var hiddenTiemStamp = tiemStamp(true)
   var visibleTiemStamp = tiemStamp(false)

   var stamps = _.curry(function(stampClass, ctrl){
      var jobs = ctrl.jobs,
          jobList = jobs.toArray(),
          isRecentlyAdded = isEqual(_.last(jobList)),
          clockType = _.isEqual(stampClass, '.stamps-in') ? isClockedIn : _.compose(not, isClockedIn)
      return m(stampClass, 
               _(jobList)
               .filter(clockType)
               .sortBy(_.compose(invoke('toLowerCase'), get(L.name)))
               .map(function(j){
                  return (isRecentlyAdded(get(L.id, j)) ? hiddenTiemStamp : visibleTiemStamp)(j, ctrl)
               })
               .value()
              )
   })

   var clockedInStamps = stamps('.stamps-in')

   var clockedOutStamps = stamps('.stamps-out')

   var main = function(ctrl){
      return [styles(ctrl.settings), header(ctrl), autoComplete(ctrl), clockedInStamps(ctrl), clockedOutStamps(ctrl)]
   }

   m.module(document.body, {view: main, controller: Controller})
   
})()

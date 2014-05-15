/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k */

// textarea

//t.$ = {
//    addJob: $('#jobs'),
//    addJobTxt: undefined
//}

// t.Bacon = {
//     enterKey: function (element) {
//         var enterKey = _.constant(13)
//         return element.asEventStream('keyup').filter(function (e) {
//             return e.keyCode === Number(enterKey())
//         })
//     },
// }

// Eventually I'll need to get the data from a source, if that day has jobs already added.
var jobList =  (function(){
      var j = t.JobSettings.new()
      j.addNew(0, 'My new job', true).addNew(1, 'Next Job', true)
      return j
   })()
//    Eventually I'll need to get the data from a source, if that day has jobs already added.
var jobs = t.Jobs.new()

var Tuple2 = b.tagged('Tuple2', ['_1', '_2'])

var removeJobDOM = function(jobs){
   var option = jobs.toObject()
   option.flatMap(function(job){
      $('#' + job.id).fadeOut().remove()
   })
   return jobs
}

var jobToHTML = function(jobs){
   var html = jobs.toObject().map(function(job){
      return t.stamp(job)
   })
   return Tuple2(jobs, html)
}

var addJobToDOM = function(tuple){
   var html = tuple._2
   var job = tuple._1.toObject().getOrElse({})
   html.flatMap(function(h){
      var isIn = isClockedIn(job)
      var sameClockState = _.compose(isEqual(isIn), isClockedIn)
      var $state = isIn ? $('#' + k.stampsIn()) : $('#', k.stampsOut())
      // get location to output to DOM
      // filter all ins/outs (depending on which job type it is) then sort them by name, place after or before
      var position = _.sortBy(_.filter(tuple._1.toArray(), function(job){ 
         return sameClockState(job)
      }), k.name())
      if (isEqual(0, position)){
         $state.prepend(h).fadeIn()
      } else {
         $state.find('div:nth-child(' + String(position)  + ')').after(h).fadeIn()
      }
   })
}

t = t
   .method(
      'showStamp',
      b.isInstanceOf(Jobs),
      _.compose(addJobToDOM, jobToHTML, removeJobDOM)
   )

// var stampInput = function(id, job){
//    var input = tagged('StampInput', ['id', 'job', 'html'])
// 
// }
// 
// var showStampAfter = function (id, job) {
//    $('#' + String(id)).after(t.stamp(job)).show()
// }
// 
// var showStampAppend = function (id, job){
//    $(id).append(t.stamp(job))
//    $('#' + String(job[k.id()])).fadeIn()
// }

var ui = {

   header: function () {
      var headerObject = _.zipObject([k.day()], [new Date()])
      $('header').append(t.header(headerObject))

      var funWithHeader = function () {
         var $te = $('#t-e'), $tm = $('#t-m'), $card = $('#card'), positionE = $te.offset().left, positionM = $tm.offset().left
         $tm.delay(2000).animate({
            left: (positionE - positionM - ($tm.width() - $te.width()))
         }, 1000)
         $te.delay(2000).animate({
            left: (positionM - positionE)
         }, 1000)
         $card.delay(1000).fadeOut('slow')
      }
      funWithHeader()
   },

   jobInput: (function(){
      var $jobs = $('#' + k.jobs())
      var options$ = _.reject(jobList.toArray(), function(job){
            return _.contains(jobs.toArray(), job.name)
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
         onChange: function(value){
            if (!_.isEmpty(value)){
               ui.addJob(value)
               selectize.removeOption(value)
               selectize.clear()
            }
         }
      } 
      var $select = $jobs.selectize(options_)
      var selectize = $select[0].selectize

   })(),
   addJob: function(value){
      //*****validate job here**********
      var job 
      
      jobList.validSelection(value).cata({
         success: function(value){
            job = value
         },
         failure: function(errors){
            jobList.validName(value).cata({
               success: function(name){
                  if (name && confirm('Create a new job with name: "' + name + '"?')){
                     job = jobList.create(jobList.newId(), name, true)
                     jobList.add(job)
                  } else return undefined
               },
               failure: function(errors){
                  //show errors to user
                  return undefined
               }
            })
         }
      })
      
      // jobSettings, id, comment, singleDay, inOut, date
      jobs.addNew(jobList, job.id, '', b.none, k.in(), new Date())
      t.showStamp(jobs)
   }
}

// t.UI = {
// 
// 
//     addNewJob: function () {
// 
//         /*var jobs = t.Settings.jobs()
// 
//         /*var newJob = completely(document.getElementById(t.k.jobs()), {
//             backgroundColor: '#F2F8FF',
//             color: '#777'
//         })
// 
//         t.$.addJobTxt = $(newJob.input)
// 
//         /*var stampTemplate = _.template(templates.stamp())
//         var stampView = function (id, jobInfo) {
//             if (_.isNumber(id)) {
//                 $('#' + String(id)).after(stampTemplate(jobInfo)).show()
//             } else {
//                 $(id).append(stampTemplate(jobInfo))
//                 $('#' + String(jobInfo[t.k.id()])).fadeIn()
//             }
//         }*/
// 
//         /*newJob.options = _.pluck(_.filter(jobs, t.k.jobActive()), t.k.name())
// 
// 
//         /*return newJob*/
// 
//     },
// 
//     addJob: function (name) {
//         var oldJob = _.filter(t.Settings.jobs(), function (job) {
//             return _.isEqual(job[t.k.name()], name)
//         })
//         // Add job to form
//         if (!_.isEmpty(oldJob)) {
//             t.UI.jobView(oldJob)
//             return oldJob
//         }
//         // Add job to form and to model if new job accepted.
//         else {
//             t.UI.jobView(name)
//             return name
//         }
//     },
// 
//     events: function () {
//         t.Observe.addJob.focus.map(function () {
// 
//         })
//     }
// }
// 
// t.Observe = {
//     addJob: {
//         // -- enter -- //
//         enter: function (input) {
//             var $input = $(input)
//             /*var clean = function (text) {
//                 return String(text).trim()
//             }
//             var isntEmpty = t.complement(_.isEmpty)*/
//             return t.Bacon.enterKey($input)
//         }(),
//         // -- focus -- //
//         focus: function () {
//             var $job = t.$.addJob
//             return $job.focusoutE().merge($job.focusinE()).toProperty()
//         }()
//     }
// }
// 
// t.React = {
// 
//     addJob: {
//         focus: '',
//         /*function (addJob) {
//             var $input = t.$.addJobTxt
//             var placeHolder = t.k.jobPlaceHolder()
//             $input.val(placeHolder)
//             t.Observe.addJob.focus.onValue(function () {
//                 $input.val((_.isEqual($input.val(), placeHolder)) ? '' : placeHolder)
//                 addJob.repaint()
//             })
//         }*/
// 
//         enter: ''
//         /*function () {
//             var $input = t.$.addJobTxt
//             var uniqueID = function () {
//                 var id = -1
//                 return function () {
//                     return id++
//                 }
//             }()
//             var newJobInfo = Bacon.combineTemplate(_.assign(t.O.defaultJobInfo(), t.O.createJobName(Bacon.UI.textFieldValue($input).map('.trim')), t.O.createClockState(t.O.createIn(new Date())), t.O.createJobId(uniqueID()))).sampledBy(t.Observe.addJob.enter)
//             newJobInfo.onValue(function () {
//                 $input.blur()
//                 alert('it worked!')
//             })
// 
// 
//         }()*/
// 
//     }
// 
// }

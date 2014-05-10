/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global tiem, document, $, _, k */

// textarea

//tiem.$ = {
//    addJob: $('#jobs'),
//    addJobTxt: undefined
//}

// tiem.Bacon = {
//     enterKey: function (element) {
//         var enterKey = _.constant(13)
//         return element.asEventStream('keyup').filter(function (e) {
//             return e.keyCode === Number(enterKey())
//         })
//     },
// }

var state = {
//    Eventually I'll need to get the data from a source, if that day has jobs already added.
   jobList: function(){
      var j = tiem.JobSettings.new()
      j.add(j.create(0, 'My new job', true)).add(j.create(1, 'Next Job', true))
      return j
   }(),
//    Eventually I'll need to get the data from a source, if that day has jobs already added.
   jobs: function(){return tiem.Jobs.new()}()
}

var ui = {

   header: function () {
      var headerObject = _.zipObject([k.day()], [new Date()])
      $('header').append(tiem.header(headerObject))

      var funWithHeader = function () {
         var $te = $('#tiem-e'), $tm = $('#tiem-m'), $card = $('#card'), positionE = $te.offset().left, positionM = $tm.offset().left
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
      var options$ = _.reject(state.jobList.toArray(), function(job){
            return _.contains(state.jobs.toArray(), job.name)
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
      
      state.jobList.validSelection(value).cata({
         success: function(value){
            job = value
         },
         failure: function(errors){
            state.jobList.validName(value).cata({
               success: function(name){
                  if (name && confirm('Create a new job with name: "' + name + '"?')){
                     job = state.jobList.create(state.jobList.newId(), name, true)
                     state.jobList.add(job)
                  }
               },
               failure: function(errors){
                  //show errors to user
               }
            })
         }
      })
      if (_.isEmpty(job))
         return undefined
      // jobSettings, id, comment, singleDay, inOut, date
      var job_ = state.jobs.create(state.jobList, job.id, '', b.none, k.in(), new Date())
      state.jobs.add(job_)

      var stampView = function (id, job) {
          if (_.isNumber(id)) {
              $('#' + String(id)).after(tiem.stamp(job)).show()
          } else {
              $(id).append(tiem.stamp(job))
              $('#' + String(job[tiem.k.id()])).fadeIn()
          }
      }

      stampView('#stamps-in', job_)
   }
}

// tiem.UI = {
// 
// 
//     addNewJob: function () {
// 
//         /*var jobs = tiem.Settings.jobs()
// 
//         /*var newJob = completely(document.getElementById(tiem.k.jobs()), {
//             backgroundColor: '#F2F8FF',
//             color: '#777'
//         })
// 
//         tiem.$.addJobTxt = $(newJob.input)
// 
//         /*var stampTemplate = _.template(templates.stamp())
//         var stampView = function (id, jobInfo) {
//             if (_.isNumber(id)) {
//                 $('#' + String(id)).after(stampTemplate(jobInfo)).show()
//             } else {
//                 $(id).append(stampTemplate(jobInfo))
//                 $('#' + String(jobInfo[tiem.k.id()])).fadeIn()
//             }
//         }*/
// 
//         /*newJob.options = _.pluck(_.filter(jobs, tiem.k.jobActive()), tiem.k.name())
// 
// 
//         /*return newJob*/
// 
//     },
// 
//     addJob: function (name) {
//         var oldJob = _.filter(tiem.Settings.jobs(), function (job) {
//             return _.isEqual(job[tiem.k.name()], name)
//         })
//         // Add job to form
//         if (!_.isEmpty(oldJob)) {
//             tiem.UI.jobView(oldJob)
//             return oldJob
//         }
//         // Add job to form and to model if new job accepted.
//         else {
//             tiem.UI.jobView(name)
//             return name
//         }
//     },
// 
//     events: function () {
//         tiem.Observe.addJob.focus.map(function () {
// 
//         })
//     }
// }
// 
// tiem.Observe = {
//     addJob: {
//         // -- enter -- //
//         enter: function (input) {
//             var $input = $(input)
//             /*var clean = function (text) {
//                 return String(text).trim()
//             }
//             var isntEmpty = tiem.complement(_.isEmpty)*/
//             return tiem.Bacon.enterKey($input)
//         }(),
//         // -- focus -- //
//         focus: function () {
//             var $job = tiem.$.addJob
//             return $job.focusoutE().merge($job.focusinE()).toProperty()
//         }()
//     }
// }
// 
// tiem.React = {
// 
//     addJob: {
//         focus: '',
//         /*function (addJob) {
//             var $input = tiem.$.addJobTxt
//             var placeHolder = tiem.k.jobPlaceHolder()
//             $input.val(placeHolder)
//             tiem.Observe.addJob.focus.onValue(function () {
//                 $input.val((_.isEqual($input.val(), placeHolder)) ? '' : placeHolder)
//                 addJob.repaint()
//             })
//         }*/
// 
//         enter: ''
//         /*function () {
//             var $input = tiem.$.addJobTxt
//             var uniqueID = function () {
//                 var id = -1
//                 return function () {
//                     return id++
//                 }
//             }()
//             var newJobInfo = Bacon.combineTemplate(_.assign(tiem.O.defaultJobInfo(), tiem.O.createJobName(Bacon.UI.textFieldValue($input).map('.trim')), tiem.O.createClockState(tiem.O.createIn(new Date())), tiem.O.createJobId(uniqueID()))).sampledBy(tiem.Observe.addJob.enter)
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

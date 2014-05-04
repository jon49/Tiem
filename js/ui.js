/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/* global tiem, document, $, _ */

// textarea

tiem.$ = {
    addJob: $('#jobs'),
    addJobTxt: undefined
}

// tiem.Bacon = {
//     enterKey: function (element) {
//         var enterKey = _.constant(13)
//         return element.asEventStream('keyup').filter(function (e) {
//             return e.keyCode === Number(enterKey())
//         })
//     },
//     stampView: function (id, jobInfo) {
//         if (_.isNumber(id)) {
//             $('#' + String(id)).after(templates.stamp(jobInfo)).show()
//         } else {
//             $(id).append(templates.stamp(jobInfo))
//             $('#' + String(jobInfo[tiem.k.jobId()])).fadeIn()
//         }
//     }
// }

var ui = {

    header: function () {
        var headerObject = _.zipObject([k.day()], [new Date()])
        $('header').append(tiem.header(headerObject))

        var funWithHeader = function () {
            var $te = $('#tiem-e')
            var $tm = $('#tiem-m')
            var $card = $('#card')
            var positionE = $te.offset().left
            var positionM = $tm.offset().left
            $tm.delay(2000).animate({
                left: (positionE - positionM - ($tm.width() - $te.width()))
            }, 1000)
            $te.delay(2000).animate({
                left: (positionM - positionE)
            }, 1000)
            $card.delay(1000).fadeOut('slow')
        }
        funWithHeader()
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
//                 $('#' + String(jobInfo[tiem.k.jobId()])).fadeIn()
//             }
//         }*/
// 
//         /*newJob.options = _.pluck(_.filter(jobs, tiem.k.jobActive()), tiem.k.jobName())
// 
//         /*var i = -1
//         newJob.onEnter = function () {
//             var jobName = String(newJob.getText()).trim()
//             i++
//             stampView('#stamps-in', _.assign(tiem.O.defaultJobInfo(), tiem.O.createJobName(jobName), tiem.O.createClockState(tiem.O.createIn(new Date())), tiem.O.createJobId(i)))
//             if (_.contains(newJob.options, jobName)) {
//                 // Remove used job names
//                 newJob.options = _.difference(newJob.options, [jobName])
//             } else {
//                 // See if user would like to add a new job.
//             }
//             $(newJob.input).blur()
//         }*/
// 
//         /*return newJob*/
// 
//     },
// 
//     addJob: function (jobName) {
//         var oldJob = _.filter(tiem.Settings.jobs(), function (job) {
//             return _.isEqual(job[tiem.k.jobName()], jobName)
//         })
//         // Add job to form
//         if (!_.isEmpty(oldJob)) {
//             tiem.UI.jobView(oldJob)
//             return oldJob
//         }
//         // Add job to form and to model if new job accepted.
//         else {
//             tiem.UI.jobView(jobName)
//             return jobName
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

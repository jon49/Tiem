var
   m = require('./../../node_modules/mithril/mithril'),
   t = require('./../utilities/utilities'),
   jobSettingLens = require('./../models/JobSetting').L,
   JobSettings = require('./../models/JobSettings'),
   Job = require('./../models/Job'),
   jobLens = Job.L,
   clockLens = require('./../models/ClockState').L,
   _ = require('./../../node_modules/lodash/lodash'),
   view = require('./common'),

   sumHours = function(job){
      var hours = jobLens.clockState.run(job).get()
      return _.reduce(hours, function(total, h){
         var out = clockLens.out.run(h).get(),
             in_ = clockLens.in.run(h).get()
         return (
            out.fold(
               function(o){
                  var hrs = t.fractionalHours(o) - t.fractionalHours(in_)
                  return total + hrs
               },
               _.constant(total)
            )
         )
      }, 0)
   },

   tiemStamp = _.curry(function(hideMe, job, ctrl){
      var displayNone = (hideMe) ? {display: 'none'} : {},
          clockState = clockLens[(Job.isClockedIn(job) ? 'in' : 'out')].run(job).get(),
          id = jobLens.id.run(job).get(),
          name = view.getJobName(ctrl.tiem.jobSettings, job),
          comment = jobLens.comment.run(job).get()
      return m('.stamp.pure-g', {id: id, style: displayNone}, [
               m('button.pure-button.pure-u-14-24.jobButton', {title: name, onclick: toggleButton.bind(ctrl, id)}, name),
               m('button.pure-button.pure-u-5-24.time', {title: clockState}, clockState.toLocaleTimeString()),
               m('button.pure-button.pure-u-3-24.hours', sumHours(job).toFixed(2)),
               m('button.pure-button.pure-u-2-24.notes', {title: comment}, [
                  m('i.fa.fa-pencil')
               ]),
               m('button.pure-button.pure-u-1-1.text-left.wrap-word.hidden.comment', comment)
              ])
   })

module.exports = tiemStamp

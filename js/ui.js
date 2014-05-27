/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

(function(){
   'use strict';

   var styles = function(ctrl){
      return m('style', 
               '.inBackgroundColor {background-color: ' + ctrl.settings.inColor + ';}' +
               '.inColor {color: ' + ctrl.settings.inColor + ';}' +
               '.selectize-input {border-color: ' + ctrl.settings.inColor + ';}'
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
         m('select', {placeholder: 'Enter job name', config: selectize.config(ctrl)})
      ])
   }

   var tiemStamp = _.curry(function(hideMe, job){
      var displayNone = (hideMe) ? {display: 'none'} : {}
      var fadeMeIn = hideMe ? fadeIn : {}
      
      return m('.stamp.pure-g', {id: job.id, style: displayNone, config: fadeMeIn}, [
               m('button.pure-button.pure-u-14-24.jobButton.inBackgroundColor', {title: job.name}, job.name),
               m('button.pure-button.pure-u-5-24.time.inBackgroundColor', {title: job.clockState.in}, job.clockState.in.toLocaleTimeString()),
               m('button.pure-button.pure-u-3-24.hours.inBackgroundColor', job.total.toFixed(2)),
               m('button.pure-button.pure-u-2-24.notes.inBackgroundColor', {title: job.comment}, [
                  m('i.fa.fa-pencil')
               ]),
               m('button.pure-button.pure-u-1-1.text-left.wrap-word.hidden.comment.inBackgroundColor', job.comment)
              ])
   })

   var hiddenTiemStamp = tiemStamp(true)
   var visibleTiemStamp = tiemStamp(false)

   var clockedInStamps = function(ctrl){
      var jobs = ctrl.jobs.toArray()
      var recentlyAdded = _.last(jobs)
      return m('.stamps-in', 
               _(jobs)
               .filter(isClockedIn)
               .sortBy(function(j){
                  return j.name.toLowerCase()
               })
               .map(function(j){
                  return (_.isEqual(recentlyAdded.id, j.id) ? hiddenTiemStamp : visibleTiemStamp)(j)
               })
               .value()
              )
   }

   var main = function(ctrl){
      return [styles(ctrl), header(ctrl), autoComplete(ctrl), clockedInStamps(ctrl)]
   }

   m.module(document.body, {view: main, controller: controller})
   
})()

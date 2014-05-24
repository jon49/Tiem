/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

(function(){
   'use strict';

   var header = function(ctrl){
      return m('header', {class: 'pure-g'}, [
         m('h1', _.assign({class: 'title pure-u-1-2'}, ctrl.inColor), [
            m('#ti', 'Ti'),
            m('#t-m', {config: define$tm}, 'm'),
            m('#t-e', {config: moveE}, 'e'),
            m('div', {config: fadeOut}, 'card')
         ]),
         m('div', {class: 'stamp date pure-u-1-2'}, [
            m('button', {class: 'pure-button options in-background-color'}, [
               m('i.fa.fa-gear')
            ]),
            m('button', {class: 'pure-button in-background-color'}, ctrl.date.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric" }))
         ])
      ])
   }

   var autoComplete = function(ctrl){
      //<select id="jobs" placeholder="Enter job name"></select>
      return m('div', [
         m('select#jobs', {placeholder: 'Enter job name', config: selectize.config(ctrl)})
      ])
   }

   var tiemStamp = function(job, hideMe){
      var displayNone = (hideMe) ? {display: 'none'} : {}
      var fadeMeIn = hideMe ? fadeIn : {}
      
      return m('div', {class: 'stamp pure-g', id: job.id, style: displayNone, config: fadeMeIn}, [
               m('button', {class: 'pure-button pure-u-14-24 jobButton', title: job.name}, job.name),
               m('button', {class: 'pure-button pure-u-5-24 time', title: job.clockState.in}, job.clockState.in.toLocaleTimeString()),
               m('button', {class: 'pure-button pure-u-3-24 hours'}, job.total.toFixed(2)),
               m('button', {class: 'pure-button pure-u-2-24 notes', title: job.comment}, [
                  m('i.fa.fa-pencil')
               ]),
               m('button', {class: 'pure-button pure-u-1-1 text-left wrap-word hidden comment'}, job.comment)
              ])
   }

   var clockedInStamps = function(ctrl){
      var jobs = ctrl.jobs.toArray()
      var recentlyAdded = _.last(jobs)
      return m('.stamps-in', 
               _(jobs)
               .filter(function(job){ return isClockedIn(job) })
               .sortBy(function(job){
                  return job.name.toLowerCase()
               })
               .map(function(job){
                  return tiemStamp(job, _.isEqual(recentlyAdded.id, job.id))
               })
               .value()
              )
   }

   var main = function(ctrl){
      return [header(ctrl), autoComplete(ctrl), clockedInStamps(ctrl)]
   }

   m.module(document.body, {view: main, controller: controller})
   
})()

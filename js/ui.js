/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

(function(){
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
         m('select', {placeholder: 'Enter job name', config: selectize.config(ctrl)})
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

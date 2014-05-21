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
         m('h1', {class: 'title pure-u-1-2'}, [
            m('#ti', 'Ti'),
            m('#t-m', {config: define$tm}, 'm'),
            m('#t-e', {config: moveE}, 'e'),
            m('div', {config: fadeOut}, 'card')
         ]),
         m('div', {class: 'stamp date pure-u-1-2'}, [
            m('button', {class: 'pure-button options'}, [
               m('i', {class: 'fa fa-gear'})
            ]),
            m('button', {class: 'pure-button'}, formatDate(ctrl.date, {year: "numeric", month: "long", day: "numeric" }))
         ])
      ])
   }

   var autoComplete = function(ctrl){
      //<select id="jobs" placeholder="Enter job name"></select>
      return m('select#jobs', {placeholder: 'Enter job name', config: selectize.config(ctrl)})
   }

// '<div class="stamp pure-g" id="<%= ' + k.id() + ' %>" style="display: none;" >' +
// '  <button class="pure-button pure-u-14-24 jobButton" title="<%-' + k.name() + '%>"> <%- ' + k.name() + ' %> </button>' +
// '  <button class="pure-button time pure-u-5-24" title="<%-' + k.state() + '.' + k['in']() + '%>"> <%= ' + k.state() + '.' + k['in']() + '.toLocaleTimeString() %></button>' +
// '  <button class="pure-button hours pure-u-3-24"> <%= Number(' + k.total() + ').toFixed(2) %> </button>' +
// '  <button class="pure-button notes pure-u-2-24" title="<%- ' + k.comment() + ' %>"> <i class="fa fa-pencil"></i> </button>' +
// '  <p class="pure-button comment pure-u-1-1 text-left wrap-word hidden"> <%- ' + k.comment() + ' %> </p> ' +
// '</div>'

   var tiemStamp = function(ctrl){
      var job = ctrl.jobs.toObject().getOrElse({})
      return m('div', {class: 'stamp pure-g', id: job.id, style: {display: none}}, 
               m('button', {class: 'pure-button pure-u-14-24 jobButton', title: job.name}, job.name),
               m('button', {class: 'pure-button pure-u-5-24 time', title: job.clockState.in}, job.clockState.in),
               m('button', {class: 'pure-button pure-u-3-24 hours'}, job.total.toFixed(2)),
               m('button', {class: 'pure-button pure-u-2-24 notes', title: job.comment}, [
                  m('i.fa.fa-pencil')
               ]),
               m('button', {class: 'pure-button pure-u-1-1 text-left wrap-word hidden comment'}, job.comment)
              )
   }

   var main = function(ctrl){
      return [header(ctrl), autoComplete(ctrl)]
   }

   m.module(document.body, {view: main, controller: controller})
   
})()

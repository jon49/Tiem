/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

(function(){
   'use strict';
   
   var fadeOut = function(e, isInit){
      if (!isInit) $(e).delay(1000).fadeOut('slow')
   }
   
   var $tm = undefined
   
   var define$tm = function(e, isInit){if (!isInit) $tm = $(e)}
   
   var moveE = function(e, isInit){
      if(!isInit){
         var $te = $(e)
         $tm.delay(1050).fadeOut(500, function(){
            $te.insertAfter($('#ti')).fadeIn(1500)
         })
         $te.delay(1050).fadeOut(500, function(){
            $tm.insertAfter($te).fadeIn(1500)
         })
      }
   }
   
   var header = function(){
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
            m('button', {class: 'pure-button'}, 'time')
         ])
      ])
   }
   
   var main = function(){
      return header()
   }

   m.render(document.body, 
            main()
   )
   
   
   
})()

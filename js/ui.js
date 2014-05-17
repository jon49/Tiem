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
   
   var pm = 0, $tm = undefined
   
   var moveM = function(e, isInit){
      if (!isInit) {
         $tm = $(e)
         pm = $tm.offset().left
      }
   }
   
   var moveE = function(e, isInit){
      if(!isInit){
         var $te = $(e)
         $tm.delay(1200).fadeOut(400).delay(1000, function(){
            $tm.append($te).show('slow')
         }).fadeIn()
         $te.delay(1200).fadeOut(400).fadeIn()
      }
   }
   
   var header = function(){
      return m('header', {class: 'pure-g'}, [
         m('h1', {class: 'title pure-u-1-2'}, [
            m('div', 'Ti'),
            m('#t-m', {config: moveM}, 'm'),
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
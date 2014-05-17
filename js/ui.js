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
   
   function SwitchME(){
      this.$tm = undefined
      this.isInitM = false
      this.$te = undefined
      this.isInitE = false
   }
   
   
   
   SwitchME.prototype.add = function(e, isInit){
      if (_.isEqual(e.id, 't-m')){
         this.$tm = m.prop($(e))
         this.isInitM = m.prop(isInit)
      }
      if (_.isEqual(e.id, 't-e')){
         this.$te = m.prop($(e))
         this.isInitE = m.prop(isInit)
      }
      return this
   }
   SwitchME.prototype.switch = function(){
      var sm = !_.isEmpty(this.$tm)
      var se = !_.isEmpty(this.$te)
      var im = !this.isInitM
      var ie = !this.isInitE
      
      if (sm && se && im && ie) {
         var pe = this.$te.offset().left, pm = this.$tm.offset().left
         this.$tm.delay(2000).animate({
            left: (pe - pm - (this.$tm.width() - this.$te.width()))
         }, 1000)
         this.$te.delay(2000).animate({
            left: (pm - pe)
         }, 1000)
      }
   }
   
   var header = function(){
      var s = new SwitchME()
      return m('header', {class: 'pure-g'}, [
         m('h1', {class: 'title pure-u-1-2'}, [
            m('div', 'Ti'),
            m('#t-m', {config: m.withAttr(s.add)}, 'm'),
            m('#t-e', {config: m.withAttr(_.compose(s.switch, s.add))}, 'e'),
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
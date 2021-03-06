/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k */

var Controller = function() {
   this.date = new Date()
   this.jobSettings = t.JobSettings.create([toObject(t.JobSetting.create(0, 'My Job', true)), toObject(t.JobSetting.create(1, 'My cool job', true))])
   
   this.jobs = t.Jobs.create([])

   this.settings = {
      inColor: 'DarkSeaGreen',
      outColor: 'FireBrick',
      inTextColor: 'black',
      outTextColor: 'white'
   }
      
}

Controller.prototype.update = function(o){
   return _.extend(this, o)
}















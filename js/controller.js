/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k */

function controller() {
   this.date = new Date()
   this.jobSettings = t.JobSettings.new().addNew(0, 'My Job', true).addNew(1, 'My cool job', true)
   //addItems([[0, 'My new job', true],[1, 'Next Job', true]])
   
   this.jobs = t.Jobs.new()

   this.settings = {
      inColor: 'DarkSeaGreen',
      outColor: 'FireBrick',
      inTextColor: 'black',
      outTextColor: 'white'
   }
      
}


















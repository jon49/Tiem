/**
 * Contains functions for manipulating core time card objects.
 */

var Controller = function() {

   this.tiem = {
      date: new Date(),
      jobSettings: t.JobSettings.create([toObject(t.JobSetting.create(0, 'My Job', true)), toObject(t.JobSetting.create(1, 'My cool job', true))]),
      jobs: t.Jobs.create([])
   }   

   this.settings = {
      inColor: 'DarkSeaGreen',
      outColor: 'FireBrick',
      inTextColor: 'black',
      outTextColor: 'white'
   }
      
}

Controller.prototype.update = function(o){
   return _.merge(this, o)
}















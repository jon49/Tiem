var
   t = require('./../utilities/utilities'),

   Controller = function() {

      this.tiem = {
         date: new Date(),
         jobSettings: JobSettings.create([JobSetting.create(0, 'My Job', true), JobSetting.create(1, 'My cool job', true)]),
         jobs: Jobs.create([])
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















   
var k = (function(utils, _){

   /**
    * Uses an array of array structure to create constants.
    * @example tiem.constants([['yep', 'yay!'], ['nope']]) => {yep: _.constant('yay!'), nope: _.constant('nope')}
    * @param {Array<Object>} array Array of arrays which map to object.
    * @param {<Object>}
    */
   var constants = utils.zipObjectT(_.first, _.last)

   var k = constants([
      ['id'],
      ['hours'],
      ['in'],
      ['out'],
      ['state', 'clockState'],
      ['day'],
      ['jobList'],
      ['clockedState'],
      ['name'],
      ['clocked'],
      ['comment'],
      ['jobActive'],
      ['jobs'],
      ['jobPlaceHolder', 'Add Job'],
      ['stampsIn', 'stamps-in'],
      ['stampsOut', 'stamps-out'],
      ['tiem'],
      ['date']
   ])

}(utils, _))

k.errors = {
   createNewJob: 'A new job must be created in the job settings first!'
}

var jobSettingKeys = [k.id, k.name, k.jobActive],
    clockStateKeys = [k.in, k.out],
    jobKeys = [k.id, k.comment, k.state],
    listObjects = ['list']

var Lenses = (function(t, k, _, b){

   // create an object of lens objects
   var makeLenses = t.zipObjectT(_.identity, b.objectLens)
   
   return makeLenses(
      _.union(
         jobSettingKeys, 
         clockInKeys,
         clockOutKeys,
         jobKeys,
         listObjects,
         [
            k.jobs,
            'jobSettings',
            k.tiem,
            k.date
         ]
      )
   )

}(utils, k, _, bilby))

var Stores = (function(utils, L, _, b){
   
   // create an object of store objects
   var makeStores = utils.zipObjectT(_.identity, function(a){
      var initialLens = a.slice(-1)
      composedLenses = _.foldr(a.slice(0, -1), function(acc, lens){
         return acc.compose(lens)
      }, initialLens)
      return composedLenses.run
   })
   
   return makeStores(
      ['ctrlJobSettings', [L.tiem, L.jobSettings]],
      ['ctrlJobs', [L.tiem, L.jobs]]
   )

}(utils, Lenses, _, bilby))

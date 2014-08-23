var 
   _ = require('./../../node_modules/lodash/lodash'),
   utils = require('./../utilities/utilities')

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
   ['clockState'],
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
   ['date'],
   ['list']
])

errors = {
   createNewJob: 'A new job must be created in the job settings first!'
}

module.exports = {
   k: k,
   errors: errors
}

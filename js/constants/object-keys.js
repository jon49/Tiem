var k = require('./constants').k

//keys used in objects in model
module.exports = {
   jobSettingKeys: [k.id, k.name, k.jobActive],
   clockStateKeys: [k.in, k.out],
   jobKeys: [k.id, k.comment, k.clockState],
   listObjects: [k.list]
}

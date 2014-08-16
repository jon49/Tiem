var
   k = require('./constants'),

   //keys used in objects in model
   oKeys = {
      jobSettingKeys: [k.id, k.name, k.jobActive],
      clockStateKeys: [k.in, k.out],
      jobKeys: [k.id, k.comment, k.state],
      listObjects: ['list']
   }

module.exports = oKeys

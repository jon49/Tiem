keys = require './../constants/object-keys'

describe 'How constants are used:', !-> ``it``

      .. 'should successfully return specified string arrays', !->
         (expect keys.jobSettingKeys).toEqual ['id', 'name', 'jobActive']
         (expect keys.jobKeys).toEqual [ 'id', 'comment', 'clockState' ]
         (expect keys.listObjects).toEqual ['list']

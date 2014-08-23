k = (require './../constants/constants').k
errors = (require './../constants/constants').errors

describe 'How constants are used:', !-> ``it``

      .. 'should successfully return specified strings', !->
         (expect (k.id)).toBe 'id'
         (expect (k.in)).toBe 'in'
         (expect (errors.createNewJob)).toBe 'A new job must be created in the job settings first!'

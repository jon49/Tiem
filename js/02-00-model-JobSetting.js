//--- Object Models ---//

// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = b.environment() 
      .method(
         'create',
         identifiers([t.isWholeNumber, _.isString, _.isBoolean]),
         tagged('JobSetting', jobSettingKeys, [function(){return (new Date()).getTime()}, "Name Empty", true])
      )

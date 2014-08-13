//--- Object Models ---//

var JobSetting = (function(t, _){
   return (
      JS = b.environment() 
         .method(
            'create', // {jobID: 0, name: 'name', jobActive: true|false}
            t.identifiers([t.isWholeNumber, _.isString, _.isBoolean]),
            tagged('JobSetting', jobSettingKeys, [function(){return (new Date()).getTime()}, "Name Empty", true])
         )
         .property(
         'isSelf',
         t.isOptionOf(t.isObjectNamed('JobSetting'))
         )
         .method(
            'update',
            t.identifiers([_.isString, JS.isSelf]),
            setOption(L.name)
         )
         .method(
            'update',
            t.identifiers([_.isBoolean, JS.isSelf]),
            setOption(L.jobActive)
         )
         .method(
            'toObject',
            JS.isSelf,
            t.toObject
         )
   )
}(utils, _));

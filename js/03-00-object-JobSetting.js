JobSetting = 
   JobSetting
   .property(
      'isSelf',
      t.isOptionOf(t.isObjectNamed('JobSetting'))
   )
   .method(
      'update',
      identifiers([_.isString, JobSetting.isSelf]),
      setOption(L.name)
   )
   .method(
      'update',
      identifiers([_.isBoolean, JobSetting.isSelf]),
      setOption(L.jobActive)
   )
   .method(
      'toObject',
      JobSetting.isSelf,
      toObject
   )

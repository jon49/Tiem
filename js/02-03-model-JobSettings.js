// {list: Array JobSetting}
var JobSettings = b.environment() 
      .method(
         'create',
         identifiers([t.isArrayOf(t.isObjectNamed('JobSetting'))]),
         tagged('JobSettings', listObjects, [[]])
      )

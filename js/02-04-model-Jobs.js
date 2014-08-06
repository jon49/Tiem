// {list: Array Job}
var Jobs = b.environment() 
      .method(
         'create',
         identifiers([t.isArrayOf(t.isObjectNamed('Job'))]),
         tagged('Jobs', listObjects, [[]])
      )

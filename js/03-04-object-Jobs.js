Jobs = 
   Jobs
   .property(
      'isSelf',
      t.isObjectNamed('Jobs')
   )
   .method(
      'update',
      identifiers([Jobs.isSelf, isOptionOf(t.isObjectNamed('Job'))]),
      xAddJob
   )
   .method(
      'get',
      identifiers([Jobs.isSelf, isWholeNumber]),
      getJobBy(L.id)
   )
  .method(
     'toArray',
     identifiers([Jobs.isSelf]),
     get(L.list)
  )

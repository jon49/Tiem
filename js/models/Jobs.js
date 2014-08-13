// {list: Array Job}
var Jobs = (function(b, t, _){
   return (
      Js = b.environment() 
         .method(
            'create',
            identifiers([t.isArrayOf(t.isObjectNamed('Job'))]),
            tagged('Jobs', listObjects, [[]])
         )
         .property(
            'isSelf',
            t.isObjectNamed('Jobs')
         )
         .method(
            'update',
            identifiers([Js.isSelf, isOptionOf(t.isObjectNamed('Job'))]),
            xAddJob
         )
         .method(
            'get',
            identifiers([Js.isSelf, isWholeNumber]),
            getJobBy(L.id)
         )
        .method(
           'toArray',
           identifiers([Js.isSelf]),
           get(L.list)
        )
   )

}(bilby, utils, _))

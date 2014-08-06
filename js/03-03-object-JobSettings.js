// determine if the job id is valid
var validJobId = function(list, id){
   var id_ = parseInt(id)
   return isNaN(id_)                                ? b.failure(['ID is not a number'])
          : !_.any(list, b.singleton(k.id(), id_))  ? b.failure(['No ID number exists'])
          : b.success(id_)
}

// determine if the new job name is valid
var validJobName = function(name, list){
   var name_ = name.trim(), isSameName = isEqual(name_.toLowerCase())
   return _.isEmpty(name_)          ? b.failure(['Job name must contain characters'])
          : _.any(_.pluck(list, 'name'), _.compose(isSameName, invoke('toLowerCase')))
                                    ? b.failure(['Job name already exists'])
          : b.success(name_)
}

// validate a single item
var validateSingle = function(type, validation){
   var type_ = b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type]))
   return b.Do()(b.Do()(validation < type_))
}

// validate the job name
var validJobName_ = _.curry(function(listObject, name){
   var list = getNow(L.list, listObject)
   return validateSingle(k.name(), validJobName(name, list))
})

// validate the job selection (id or name)
var validId = _.curry(function(objectList, object){
   var list = get(L.list, objectList)
   return validateSingle(k.id(), validJobId(list, object))
})

JobSettings = 
   JobSettings
   .property(
      'isSelf',
      t.isObjectNamed('JobSettings')
   )
   .method(
      'valid',
      identifiers([JobSettigs.isSelf, _.isNumber]),
      validId
   ) 
   .method(
      'valid',
      identifiers([JobSettigs.isSelf, _.isString]),
      validJobName_
   )
   .method(
      'update',
      identifiers([JobSettigs.isSelf, isOptionOf(b.isInstanceOf(JobSetting))]),
      xAddJob
   )
   .method(
      'get',
      identifiers([JobSettigs.isSelf, isWholeNumber]),
      getJobBy(L.id)
   )
   .method(
      'get',
      identifiers([JobSettigs.isSelf, _.isString]),
      getJobBy(L.name)
   )
   .method(
      'toArray',
      identifiers([JobSettigs.isSelf]),
      get(L.list)
   )

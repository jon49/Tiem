var
   _ = require('./../../node_modules/lodash/lodash'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   o = require('./../utilities/utilities-objects'),
   Validation = require('./../../node_modules/fantasy-validations/validation'),
   JobSetting = require('./JobSetting'),

   jobSettings = 'JobSettings',

   keys = ['list'],

   L = _.assign(t.makeLenses(keys), JobSetting.L),

   getList = o.get(L.list),

   // determine if the job id is valid
   validId = function(objectList, id){
      var list = getList(objectList),
          id_ = parseInt(id)
      return (
         !_.any(list, t.singleton('id', id_)) ?
            Validation.Failure(['No such ID number exists'])
         : Validation.Success(id_)
      )
   },

   // determine if the new job name is valid
   validJobName = function(objectList, name){
      var list = getList(objectList),
          name_ = name.trim(),
          isSameName = t.isEqual(name_.toLowerCase())
      return (
         _.isEmpty(name_)          
            ? Validation.Failure(['Job name must contain characters'])

         : _.any(_.pluck(list, 'name'),
                 _.compose(isSameName, t.invoke('toLowerCase')))
            ? Validation.Failure(['Job name already exists'])

         : Validation.Success(name_)
      )
   },

   isSelf = t.isObjectNamed(jobSettings),

   getJobBy = _.curry(function(lens, jobSettings, value){
      return o.filterByLensNow(lens, getList(jobSettings), value)
   }),

   JobSettings

module.exports = ( JobSettings =
   environment() 
   .method(
      'create', // {list: Array JobSetting}
      t.identifiers([t.isArrayOf(t.isObjectNamed('JobSetting'))]),
      t.tagged('JobSettings', keys, [[]])
   )
   .property(
      'isSelf',
      isSelf
   )
   .method(
      'valid',
      t.identifiers([isSelf, _.isNumber]),
      validId
   ) 
   .method(
      'valid',
      t.identifiers([isSelf, _.isString]),
      validJobName
   )
   .method(
      'with',
      t.identifiers([isSelf, t.isObjectNamed('JobSetting')]),
      function(jobSettings, option){
         return JobSettings.create(o.xAddToListNow(L.id, option, L.list.run(jobSettings).get()))
      }
   )
   .method(
      'get',
      t.identifiers([isSelf, t.isWholeNumber]),
      getJobBy(L.id)
   )
   .method(
      'get',
      t.identifiers([isSelf, _.isString]),
      getJobBy(L.name)
   )
)

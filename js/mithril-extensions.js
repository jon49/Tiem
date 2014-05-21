//mithril extensions

var mm = b.environment()

var class_ = createObject('class')
var tag = createObject('tag')
var config = createObject('config')
var value = createObject('value')
//combine object into mithril m object
var parseM = function(object){
   var joined = {}
   //combine arrays into strings where applicable
   _.forIn(object, function(value, key){
      if (_.isArray(value)){
         if (_.isEqual(key, 'class'))
            joined[key] = value.join(' ')
         else if (_.isEqual(key, 'tag'))
            joined[key] = value.join('')
      } else
         joined[key] = value
   })
   //place into mithril m function
   if(hasAll(['tag', 'class', 'config', 'value'], joined))
      return m(joined.tag, _.pick(joined, 'class', 'config'), joined.value)
   else if (hasAll(['tag', 'class', 'value'], joined))
      return m(joined.tag, _.pick(joined, 'class'), joined.value)
   else if (hasAll(['tag', 'config', 'value'], joined))
      return m(joined.tag, joined.config, joined.value)
   else if (hasAll(['tag', 'value'], joined))
      return m(joined.tag, joined.value)
}

mm = mm
   .method('class', isSomeString, class_)
   .method('tag', isSomeString, tag)
   .method('config', isSomething, config)
   .method('value', isSomething, value)
   .method('parse', isSomething, parseM)
   .method('attr', createObject)

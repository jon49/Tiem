/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

var b = bilby

var concat = _.curry(function(a, b){
   return _.isArray(a) ? a.concat(b) : b.concat(a)
})

var xAddToList = function(comparator, option, list){
      var l = list || this
      return option.fold(concat(_.reject(l, comparator)), l)
}

var person = {id: 0, first: 'jon', last: 'n', location: {address: '12', city: 'texas'}}
var list = [
   {id: 0, first: 'jon', last: 'n', location: {address: '12', city: 'bay'}}, 
   {id: 1, first: 'laura', last: 'g', location: {address: '1', city: 'vegas'}}
]

var opt = b.some(person)

console.log(xAddToList({id: 0}, opt, list))

//var lens = b.objectLens
//var personL = lens('person')
//var cityL = lens('city')
//var locationL = lens('location')
//var addressL = lens('address')
//var _1L = lens(1)
//var listL = lens('list')
//
//var a = personL.run(o).setter(_1L.compose(listL).run(o).getter)
//
//var test = b.tagged('Test', ['first', 'second'])




          
   
  



   
   

   
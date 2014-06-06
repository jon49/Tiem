/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

var b = bilby

var o = {
   person: {first: 'jon', last: 'n', location: {address: '12', city: 'texas'}}, 
   list: [{first: 'jon', last: 'n', location: {address: '12', city: 'bay'}}, {first: 'laura', last: 'g', location: {address: '1', city: 'vegas'}}]
}

var lens = b.objectLens
var personL = lens('person')
var cityL = lens('city')
var locationL = lens('location')
var addressL = lens('address')
var _1L = lens(1)
var listL = lens('list')

var a = personL.run(o).setter(_1L.compose(listL).run(o).getter)

var test = b.tagged('Test', ['first', 'second'])

console.log(test)


          
   
  



   
   

   
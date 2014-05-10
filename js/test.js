$('#button').click(function(){
   var b = bilby
   var input = b.curry(b.tagged('Input', ['id']))
   var name =  b.curry(b.tagged('Name', ['name']))
   var validId = function(value){
      var value_ = parseInt(value)
      return isNaN(value_)
         ? b.failure(['Value is not a number'])
         : value_ < 0
         ? b.failure(['Value must be greater than or equal to 0'])
         : b.success(value_)
   }
   var test = ['0', 'b'].map(function(value){
      var validValue = validId(value)
      var result = b.Do()(validValue)
      result.cata({
         success: function(val){
            alert(val)
         },
         failure: function(){
            alert('Failure!')
         }
      })
   })
})

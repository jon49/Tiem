// {in: Date, out: Date Option}
var ClockState = b.environment() 
      .method(
         'create',
         identifiers([isOptionOf(_.isDate), isOptionOf(_.isDate)]),
         tagged('ClockState', clockStateKeys, [function(){return new Date()}, b.none])
      )

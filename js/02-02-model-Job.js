// {jobID: Whole Number, comment: String, clockState: Array ClockState}
var Job = b.environment()
      .method(
         'create',
         identifiers([t.isWholeNumber, _.isString, t.isArrayOf(t.isObjectNamed('ClockState'))]),
         tagged('Job', jobKeys, [-1, "", function(){return [ClockState(b.none, b.none)]}])
      )

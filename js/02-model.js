/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global document, $, _, m, b */


//--- Object Models ---//

var 
   // {jobID: 0, name: 'name', jobActive: true|false}
   JobSetting = b.environment() 
      .method(
         'create',
         ises([t.isWholeNumber, _.isString, _.isBoolean]),
         tagged('JobSetting', jobSettingKeys, [-1, "Name Empty", true])
      )

   // {in: Date, out: Date Option}
   ClockState = b.environment() 
      .method(
         'create',
         ises([isOptionOf(_.isDate), isOptionOf(_.isDate)]),
         tagged('ClockState', clockStateKeys, [function(){return new Date()}, b.none])
      )

   // {jobID: Whole Number, comment: String, clockState: Array ClockState}
   Job = b.environment()
      .method(
         'create',
         ises([t.isWholeNumber, _.isString, t.isArrayOf(t.isObjectNamed('ClockState'))]),
         tagged('Job', jobKeys, [-1, "", function(){return [ClockState(b.none, b.none)]}])
      )

   // {list: Array JobSetting}
   JobSettings = b.environment() 
      .method(
         'create',
         ises([t.isArrayOf(t.isObjectNamed('JobSetting'))]),
         tagged('JobSettings', listObjects, [[]])
      )

   // {list: Array Job}
   Jobs = b.environment() 
      .method(
         'create',
         ises([t.isArrayOf(t.isObjectNamed('Job'))]),
         tagged('Jobs', listObjects, [[]])
      )



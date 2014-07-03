/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k */

var app = {}

//$.get( '/jobs', function(response){ test = response })
var getJobs = function() {
//   var test
//   var test2 = $.get( '/jobs', function(response){ test = response })
   //return test
   var test = m.request({method: "GET", url: "/jobs"})();
	return m.request({method: "GET", url: "/jobs"});
};

var Controller = function() {

   var self = this
   getJobs().then( function(data){ 
      var data_ = _.last(data)
      var data$ = _.has(data_, 'jobs') ? data_.jobs : []
      var data__ = _(data$).map(function(j){
         var j_ = t.Job.create(j)
         return j_
      }).value()
      var result = t.Jobs.create(data__)
      self.jobs = result
   })
   this.date = new Date()
   this.jobSettings = t.JobSettings.create([toObject(t.JobSetting.create(0, 'My Job', true)), toObject(t.JobSetting.create(1, 'My cool job', true))])
   this.jobs = []
   
   this.settings = {
      inColor: 'DarkSeaGreen',
      outColor: 'FireBrick',
      inTextColor: 'black',
      outTextColor: 'white'
   }
      
}

Controller.prototype.update = function(o){
   if (_.has(o, 'jobs')){
      var result = {date: this.date, jobs: o.jobs.toArray()}
      $.ajax({type: 'POST', url:'/jobs', data: result, dataType: 'json', success: function(response){console.log(response)}});
//    $.ajax({type: 'POST', url:'/jobs', data:{name:'My lovely job', id: 0, hours: 2}, dataType: 'json', success: function(response){console.log(response)}})
   }
   return _.extend(this, o)
}















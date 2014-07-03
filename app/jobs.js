var dbName = function(date){
   var year = String(date.year),
       month = String(date.month);
   return './' + [year, month, 'jobs.db'].join('-');
};

var Datastore = require('nedb'),
    path = require('path'),
    db = new Datastore({ filename: path.join(__dirname, './jobs.db'), autoload: true });

var insertJob = function(jobs, callback){
 //  if (jobs.)
   db.insert(jobs, callback);
};

var findJobs = function(query, callback){
   db.find(query, callback);
};

module.exports = {
   find: findJobs,
   insert: insertJob
};

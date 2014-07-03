var Hapi = require('hapi')
var jobs = require('./app/jobs')
var server = new Hapi.Server('localhost', 8000)

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        reply('hello world');
    }
})

server.route({
   method: 'GET',
   path: '/{path*}',
   handler: {
      directory: { path: './dist/static/', listing: false, index: true}
   }
})


server.route({
   method: 'GET',
   path: '/jobs',
   handler: function(request, reply){
      jobs.find({}, function(error, records){
         if(error){
            throw error;
         }
         else{
            reply(records);
         }
      })
   }
})

server.route({
   method: 'POST',
   path: '/jobs',
   handler: function(request, reply){
      jobs.insert(request.payload, function(error, records){
         if(error){
            throw error;
         }
         else{
            reply(records);
         }
      })
   }
})

server.start()

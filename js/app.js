var
   m = require('./../node_modules/mithril/mithril'),
   main = require('./views/main'),
   Controller = require('./controller/controller')

m.module(document.body, {view: main, controller: Controller})

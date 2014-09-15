var
   styles = require('./styles'),
   header = require('./header'),
   autoComplete = require('./autoComplete'),
   clockedInStamps = require('./stamps-clock-in'),
   clockedOutStamps = require('./stamps-clock-out'),

   main = function(ctrl){
      var tiem = ctrl.tiem
      return [styles(ctrl.settings), header(tiem.date), autoComplete(tiem), clockedInStamps(tiem), clockedOutStamps(tiem)]
   }

module.exports = main

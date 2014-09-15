var
   m = require('./../../node_modules/mithril/mithril'),

   autoComplete = function(ctrl){
      //<select id="jobs" placeholder="Enter job name"></select>
      return m('#jobs', [
         m('select', {placeholder: 'Enter job name', config: selectize_.config(ctrl)})
      ])
   }

module.exports = autoComplete

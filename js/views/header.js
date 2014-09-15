var
   m = require('./../../node_modules/mithril/mithril'),

   header = function(date){
      return m('header.pure-g', [
         m('h1.title.pure-u-1-2.inColor', [
            m('#ti', 'Ti'),
            m('#t-m', 'm'),
            m('#t-e', 'e'),
            m('#t-card', 'card')
         ]),
         m('.stamp.date.pure-u-1-2', [
            m('button.pure-button.options.inBackgroundColor', [
               m('i.fa.fa-gear')
            ]),
            m('button.pure-button.inBackgroundColor', date.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric" }))
         ])
      ])
   }

module.exports = header

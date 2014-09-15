var 
   m = require('./../../node_modules/mithril/mithril'),

   cssDeclaration = function(property, value){
      return property + ': ' + value + ';'
   },

   styles = function(settings){
      return m('style', 
               ['.stamps-in button, .inBackgroundColor {',
                  cssDeclaration('background-color', settings.inColor),
                  cssDeclaration('color', settings.inTextColor),
               '}',
               '.stamps-out button {',
                  cssDeclaration('background-color', settings.outColor),
                  cssDeclaration('color', settings.outTextColor),
               '}',
               '.inColor {color: ', settings.inColor, ';}',
               '.selectize-input {border-color: ', settings.inColor, ';}'].join('')
              )
   }

module.exports = styles

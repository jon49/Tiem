require.config({
  shim: {
     
  },
  paths: {
    jquery: "../bower_components/jquery/dist/jquery",
    bacon: "../bower_components/bacon/dist/Bacon",
    "bacon.jquery": "../bower_components/bacon.jquery/dist/bacon.jquery",
    bilby: "../bower_components/bilby.js/bilby",
    "fantasy-lenses": "../bower_components/fantasy-lenses/lens",
    lodash: "../bower_components/lodash/dist/lodash.compat",
    mithril: "../bower_components/mithril/mithril.min",
    requirejs: "../bower_components/requirejs/require",
    selectize: "../bower_components/selectize/dist/js/selectize",
    "fantasy-options": "../bower_components/fantasy-options/option",
    "fantasy-stores": "../bower_components/fantasy-stores/store",
    daggy: "../bower_components/daggy/daggy",
    "fantasy-combinators": "../bower_components/fantasy-combinators/combinators"
  },
  packages: [

  ]
});

requirejs(['test']);

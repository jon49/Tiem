
var selectize_ = {}

selectize_.config = function(ctrl){
   return function(element, isInit){
      var $el = $(element)
      if (!isInit){
         var currentJobIds = _.pluck(ctrl.jobs.toArray(), k.id())
         var options$ = _.reject(ctrl.jobSettings.toArray(), function(j){
               return _.contains(currentJobIds, get(L.id, j))
            })
         var options_ = {
            persist: false,
            selectOnTab: false, // Tab loses focus along with selecting. Will have to wait until this is fixed, or take care of it myself.
            maxItems: 1,
            create: true,
            hideSelected: true,
            options: options$,
            labelField: k.name(),
            valueField: k.id(),
            searchField: k.name(),
            sortField: k.name(),
            borderColor: ctrl.settings.inColor,
            onChange: function(value){
               m.startComputation()
               if (!_.isEmpty(value)){
                  addJob(ctrl, isLikeNumber(value) ? parseInt(value) : value)
                  selectize.removeOption(value)
                  selectize.refreshItems()
                  selectize.showInput()
               }
               m.endComputation()
            }
         } 
         var $select = $el.selectize(options_)
         var selectize = $select[0].selectize
      }
   }
}

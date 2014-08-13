/**
 * Contains functions for view.
 */
   
var cssDeclaration = function(property, value){
   return property + ': ' + value + ';'
}

var styles = function(settings){
   return m('style', 
            ['.stamps-in button, .inBackgroundColor {' ,
               cssDeclaration('background-color', settings.inColor) ,
               cssDeclaration('color', settings.inTextColor) ,
            '}' ,
            '.stamps-out button {' ,
               cssDeclaration('background-color', settings.outColor) ,
               cssDeclaration('color', settings.outTextColor) ,
            '}' ,
            '.inColor {color: ' , settings.inColor , ';}' ,
            '.selectize-input {border-color: ' , settings.inColor , ';}'].join('')
           )
}

var header = function(date){
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

var autoComplete = function(ctrl){
   //<select id="jobs" placeholder="Enter job name"></select>
   return m('#jobs', [
      m('select', {placeholder: 'Enter job name', config: selectize_.config(ctrl)})
   ])
}

var tiemStamp = _.curry(function(hideMe, job, ctrl){
   var displayNone = (hideMe) ? {display: 'none'} : {},
       clockState = job.clockState[(isClockedIn(job) ? k.in() : k.out())]
       name = t.Job.name(ctrl.jobSettings, job)
   return m('.stamp.pure-g', {id: job.id, style: displayNone}, [
            m('button.pure-button.pure-u-14-24.jobButton', {title: name, onclick: toggleButton.bind(ctrl, job.id)}, name),
            m('button.pure-button.pure-u-5-24.time', {title: clockState}, clockState.toLocaleTimeString()),
            m('button.pure-button.pure-u-3-24.hours', t.sum(getNow(L.hours, job)).toFixed(2)),
            m('button.pure-button.pure-u-2-24.notes', {title: job.comment}, [
               m('i.fa.fa-pencil')
            ]),
            m('button.pure-button.pure-u-1-1.text-left.wrap-word.hidden.comment', job.comment)
           ])
})

var hiddenTiemStamp = tiemStamp(true)
var visibleTiemStamp = tiemStamp(false)

var stamps = _.curry(function(stampClass, ctrl){
   var jobs = ctrl.jobs,
       jobList = jobs.toArray(),
       isRecentlyAdded = isEqual(_.last(jobList)),
       clockType = _.isEqual(stampClass, '.stamps-in') ? isClockedIn : _.compose(not, isClockedIn)
   return m(stampClass, 
            _(jobList)
            .filter(clockType)
            .sortBy(_.compose(invoke('toLowerCase'), jobName(ctrl.jobSettings)))
            .map(function(j){
               return (isRecentlyAdded(get(L.id, j)) ? hiddenTiemStamp : visibleTiemStamp)(j, ctrl)
            })
            .value()
           )
})

var clockedInStamps = stamps('.stamps-in')

var clockedOutStamps = stamps('.stamps-out')

var main = function(ctrl){
   var tiem = ctrl.tiem
   return [styles(ctrl.settings), header(tiem.date), autoComplete(ctrl), clockedInStamps(ctrl), clockedOutStamps(ctrl)]
}

m.module(document.body, {view: main, controller: Controller})


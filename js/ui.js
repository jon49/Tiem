/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/* global Tiem, document, $, _ */

// textarea

Tiem.$ = {
    addJob: $('#jobs'),
    addJobTxt: undefined
}

Tiem.Bacon = {
    enterKey: function (element) {
        var enterKey = _.constant(13)
        return element.asEventStream('keyup').filter(function (e) {
            return e.keyCode === Number(enterKey())
        })
    },
    stampView: function (id, jobInfo) {
        if (_.isNumber(id)) {
            $('#' + String(id)).after(Tiem.Templates.stamp(jobInfo)).show()
        } else {
            $(id).append(Tiem.Templates.stamp(jobInfo))
            $('#' + String(jobInfo[Tiem.k.jobId()])).fadeIn()
        }
    }
}

Tiem.UI = {

    header: function () {
        var headerObject = _.zipObject([Tiem.k.day()], [new Date()])
        $('header').append(Tiem.Templates.header(headerObject))

        var funWithHeader = function () {
            var $te = $('#tiem-e')
            var $tm = $('#tiem-m')
            var $card = $('#card')
            var positionE = $te.offset().left
            var positionM = $tm.offset().left
            $tm.delay(2000).animate({
                left: (positionE - positionM - ($tm.width() - $te.width()))
            }, 1000)
            $te.delay(2000).animate({
                left: (positionM - positionE)
            }, 1000)
            $card.delay(1000).fadeOut('slow')
        }
        funWithHeader()
    },

    addNewJob: function () {

        /*var jobs = Tiem.Settings.jobs()

        /*var newJob = completely(document.getElementById(Tiem.k.jobs()), {
            backgroundColor: '#F2F8FF',
            color: '#777'
        })

        Tiem.$.addJobTxt = $(newJob.input)

        /*var stampTemplate = _.template(Tiem.Templates.stamp())
        var stampView = function (id, jobInfo) {
            if (_.isNumber(id)) {
                $('#' + String(id)).after(stampTemplate(jobInfo)).show()
            } else {
                $(id).append(stampTemplate(jobInfo))
                $('#' + String(jobInfo[Tiem.k.jobId()])).fadeIn()
            }
        }*/

        /*newJob.options = _.pluck(_.filter(jobs, Tiem.k.jobActive()), Tiem.k.jobName())

        /*var i = -1
        newJob.onEnter = function () {
            var jobName = String(newJob.getText()).trim()
            i++
            stampView('#stamps-in', _.assign(Tiem.O.defaultJobInfo(), Tiem.O.createJobName(jobName), Tiem.O.createClockState(Tiem.O.createIn(new Date())), Tiem.O.createJobId(i)))
            if (_.contains(newJob.options, jobName)) {
                // Remove used job names
                newJob.options = _.difference(newJob.options, [jobName])
            } else {
                // See if user would like to add a new job.
            }
            $(newJob.input).blur()
        }*/

        /*return newJob*/

    },

    addJob: function (jobName) {
        var oldJob = _.filter(Tiem.Settings.jobs(), function (job) {
            return _.isEqual(job[Tiem.k.jobName()], jobName)
        })
        // Add job to form
        if (!_.isEmpty(oldJob)) {
            Tiem.UI.jobView(oldJob)
            return oldJob
        }
        // Add job to form and to model if new job accepted.
        else {
            Tiem.UI.jobView(jobName)
            return jobName
        }
    },

    events: function () {
        Tiem.Observe.addJob.focus.map(function () {

        })
    }
}

Tiem.Observe = {
    addJob: {
        // -- enter -- //
        enter: function (input) {
            var $input = $(input)
            /*var clean = function (text) {
                return String(text).trim()
            }
            var isntEmpty = Tiem.complement(_.isEmpty)*/
            return Tiem.Bacon.enterKey($input)
        }(),
        // -- focus -- //
        focus: function () {
            var $job = Tiem.$.addJob
            return $job.focusoutE().merge($job.focusinE()).toProperty()
        }()
    }
}

Tiem.React = {

    addJob: {
        focus: '',
        /*function (addJob) {
            var $input = Tiem.$.addJobTxt
            var placeHolder = Tiem.k.jobPlaceHolder()
            $input.val(placeHolder)
            Tiem.Observe.addJob.focus.onValue(function () {
                $input.val((_.isEqual($input.val(), placeHolder)) ? '' : placeHolder)
                addJob.repaint()
            })
        }*/

        enter: ''
        /*function () {
            var $input = Tiem.$.addJobTxt
            var uniqueID = function () {
                var id = -1
                return function () {
                    return id++
                }
            }()
            var newJobInfo = Bacon.combineTemplate(_.assign(Tiem.O.defaultJobInfo(), Tiem.O.createJobName(Bacon.UI.textFieldValue($input).map('.trim')), Tiem.O.createClockState(Tiem.O.createIn(new Date())), Tiem.O.createJobId(uniqueID()))).sampledBy(Tiem.Observe.addJob.enter)
            newJobInfo.onValue(function () {
                $input.blur()
                alert('it worked!')
            })


        }()*/

    }

}
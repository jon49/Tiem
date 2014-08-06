var k = constants([['id'],
                   ['hours'],
                   ['in'],
                   ['out'],
                   ['state', 'clockState'],
                   ['day'],
                   ['jobList'],
                   ['clockedState'],
                   ['name'],
                   ['clocked'],
                   ['comment'],
                   ['jobActive'],
                   ['jobs'],
                   ['jobPlaceHolder', 'Add Job'],
                   ['stampsIn', 'stamps-in'],
                   ['stampsOut', 'stamps-out']
])

k.errors = {
   createNewJob: 'A new job must be created in the job settings first!'
}

var jobSettingKeys = [k.id(), k.name(), k.jobActive()],
    clockStateKeys = [k.in(), k.out()],
    jobKeys = [k.id(), k.comment(), k.state()],
    listObjects = ['list']

var L = makeLenses(_.union(jobSettingKeys, clockInKeys, clockOutKeys, jobKeys, listObjects, [k.jobs(), 'jobSettings']))

t = t.property('k', k)
t = t.property('L', L)

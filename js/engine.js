/**
 * Contains functions for manipulating core time card objects.
 */

/*jslint asi: true*/
/* global Tiem, _ */

Tiem.Clock = function () {}

/**
 * Determines if clock state is clocked in or out.
 * @example isClockIn(clockState) -> true|false
 * @param {Object<clockState>} clockState The current state of the clock.
 * @return {Boolean} True when clocked in otherwise false
 */
Tiem.Clock.isClockedIn = function (clockState) {
    return _.has(clockState[Tiem.k.state()], Tiem.k. in ())
}

/**
 * Clock in item.
 * @example Tiem.Clock.in(clockInfo, clockInTime) -> {singleDay: <Array>, clockState: {in:<Date>}}
 * @param {Object<clockInfo>} clockInfo Information on the clock status.
 * @param {Date} clockInTime Time at which the person clocks in.
 * @return {Object<clockInfo>} New information on the clock and hours status.
 */
Tiem.Clock.in = function (clockInfo, clockInTime) {
    return _.assign(
        (_.isEmpty(clockInfo)) ? _.assign(Tiem.O.defaultClockInfo(), Tiem.O.createClockState(Tiem.O.createIn(clockInTime))) : _.clone(clockInfo),
        Tiem.O.inState(clockInTime))
}

/**
 * Clock out item.
 * @example Tiem.Clock.out(clockInfo, clockOutTime) -> {singleDay: <Array>, clockState: {out: ''}}
 * @param {Object<clockInfo>} clockInfo Information on the clock status.
 * @param {Date} clockOutTime Time at which the person clocks out.
 * @return {Object<clockInfo>} New information on the clock and hours status.
 */
Tiem.Clock.out = function (clockInfo, clockOutTime) {
    var start = Tiem.fractionalHours(clockInfo.clockState. in )
    var end = Tiem.fractionalHours(clockOutTime)
    var newSingleDay = Tiem.O.createSingleDay(Tiem.addRollingArray(clockInfo.singleDay, start, end, 1))
    return _.assign(Tiem.O.defaultClockInfo(), newSingleDay, Tiem.O.createTotal(newSingleDay))
}

/**
 * Toggles the time by updating the hours during the day and reflecting the correct clock state.
 * @example Tiem.Clock.toggle(clockInfo) -> {singleDay:Array<Number>, clockState:<in|out>}
 * @param {Object<clockInfo>} clockInfo The clock information.
 * @param {Date} dateTime The time when the clock was toggled.
 * @return {Object<clockInfo>} The new clock information after added time and clock state change.
 */
Tiem.Clock.toggle = function (clockInfo, dateTime) {
    if (Tiem.Clock.isClockedIn(_.pick(clockInfo, Tiem.k.state()))) {
        return Tiem.Clock.out(clockInfo, dateTime)
    }
    return Tiem.Clock. in (clockInfo, dateTime)
}
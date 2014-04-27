/**
 * Created by jon on 2/11/14.
 */
/*jslint asi: true*/
/* global _, Tiem */

Tiem.Constraints = function () {}

/** 
 * Used to validate code.
 */
Tiem.Constraints.validator = function (message, fun) {
    "use strict";
    var f = function ( /* args */ ) {
        return fun.apply(fun, arguments)
    }

    f.message = message
    return f
}

/**
 * Used to get all validated code and return errors if there were errors.
 */
Tiem.Constraints.condition1 = function ( /* validators */ ) {
    "use strict";
    var validators = Tiem.toFlatArray(arguments)

    return function (fun, arg) {
            var errors =
                _(validators)
                .map(function (isValid) {
                    return isValid(arg) ? [] : [isValid.message]
                })
                .flatten()
                .value()

            if (!_.isEmpty(errors)) {
                throw new Error(errors.join(", "))
            }

            return fun(arg)

        }
}

/**
 * Applies arrays to validator and feeds to condition1
 * @example Tiem.Constraints.conditions(['This is the error thrown', myTestFunc], ['This is the second error thrown', myTestFunc2])<br>
 * Tiem.Constraints.conditions([['This is the error thrown', myTestFunc], ['This is the second error thrown', myTestFunc2]])
 *
 * @return _.partial(Tiem.Constraints.condition1(validators), _.identity)
 */
Tiem.Constraints.conditions = function ( /* Validator array arguments */ ) {
    var validatorArgs = _.toArray(arguments)
    var validators = _(validatorArgs)
        .map(function (validArgs) {
            return Tiem.Constraints.validator(_.first(validArgs), _.last(validArgs))
        })
        .value()
    return _.partial(Tiem.Constraints.condition1(validators), _.identity)
}
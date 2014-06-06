(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var daggy = require('daggy'),
    Option = require('fantasy-options'),
    Store = require('fantasy-stores'),
    Lens = daggy.tagged('run'),
    PartialLens = daggy.tagged('run');

function identity(a) {
    return a;
}
function compose(f, g) {
    return function(a) {
        return f(g(a));
    };
}

function thisAndThen(b) {
    return b.compose(this);
}

// Methods
Lens.id = function() {
    return Lens(function(target) {
        return Store(
            identity,
            function() {
                return target;
            }
        );
    });
};
Lens.prototype.compose = function(b) {
    var a = this;
    return Lens(function(target) {
        var c = b.run(target),
            d = a.run(c.get());
        return Store(
            compose(c.set, d.set),
            d.get
        );
    });
};
Lens.prototype.andThen = thisAndThen;
Lens.prototype.toPartial = function() {
    var self = this;
    return PartialLens(function(target) {
        return Option.Some(self.run(target));
    });
};
Lens.objectLens = function(property) {
    return Lens(function(o) {
        return Store(
            function(s) {
                var r = {},
                    k;
                for(k in o) {
                    r[k] = o[k];
                }
                r[property] = s;
                return r;
            },
            function() {
                return o[property];
            }
        );
    });
};
Lens.arrayLens = function(index) {
    return Lens(function(a) {
        return Store(
            function(s) {
                var r = a.concat();
                r[index] = s;
                return r;
            },
            function() {
                return a[index];
            }
        );
    });
};

PartialLens.id = function() {
    return PartialLens(function(target) {
        return Option.Some(Lens.id().run(target));
    });
};
PartialLens.prototype.compose = function(b) {
    var a = this;
    return PartialLens(function(target) {
        return b.run(target).chain(function(c) {
            return a.run(c.get()).map(function(d) {
                return Store(
                    compose(c.set, d.set),
                    d.get
                );
            });
        });
    });
};
PartialLens.prototype.andThen = thisAndThen;
PartialLens.objectLens = function(property) {
    var totalLens = Lens.objectLens(property);
    return PartialLens(function(target) {
        return property in target ? Option.Some(totalLens.run(target)) : Option.None;
    });
};
PartialLens.arrayLens = function(index) {
    var totalLens = Lens.arrayLens(index);
    return PartialLens(function(target) {
        return index >= 0 && index < target.length ? Option.Some(totalLens.run(target)) : Option.None;
    });
};

// Export
if(typeof module != 'undefined') {
    exports.Lens = Lens;
    exports.PartialLens = PartialLens;
}

},{"daggy":3,"fantasy-options":4,"fantasy-stores":5}],2:[function(require,module,exports){
var person = {
        name: "Brian McKenna",
        location: {
            number: 1006,
            street: "Pearl St",
            postcode: [80302, 12]
        }
    },
    objectLens = require('fantasy-lenses').Lens.objectLens,
    locationLens = objectLens('location'),
    numberLens = objectLens('number'),
    postcodeLens = objectLens('postcode'),
    _0Lens = objectLens(0)
    store = locationLens.andThen(numberLens).run(person);

console.log(store.get());
// 1006
var a = store.set(1007)
console.log(a)
var b = locationLens.andThen(postcodeLens).run(a).get()
console.log(b)
console.log(locationLens.andThen(postcodeLens).andThen(_0Lens).run(a).set(1))
console.log(person)
console.log(a)

},{"fantasy-lenses":1}],3:[function(require,module,exports){
/**
  # Daggy

  Library for creating tagged constructors.
**/
(function(global, factory) {
    'use strict';

    if(typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if(typeof exports !== 'undefined') {
        factory(exports);
    } else {
        global.daggy = {};
        factory(global.daggy);
    }
})(this, function(exports) {
    function create(proto) {
        function Ctor() {}
        Ctor.prototype = proto;
        return new Ctor();
    }
    exports.create = create;

    /**
      ## `daggy.getInstance(self, constructor)`

      Returns `self` if it's an `instanceof constructor`, otherwise
      creates a new object with `constructor`'s prototype.

      Allows creating constructors that can be used with or without
      the new keyword but always have the correct prototype.

      ```javascript
      function WrappedArray() {
          var self = daggy.getInstance(this, WrappedArray);
          self._array = [].slice.apply(arguments);
          return self;
      }
      new WrappedArray(1, 2, 3) instanceof WrappedArray; // true
      WrappedArray(1, 2, 3) instanceof WrappedArray; // true
      ```
    **/
    function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
    }
    exports.getInstance = getInstance;

    /**
      ## `daggy.tagged(arguments)`

      Creates a new constructor with the given field names as
      arguments and properties. Allows `instanceof` checks with
      returned constructor.

      ```javascript
      var Tuple3 = daggy.tagged('x', 'y', 'z');

      var _123 = Tuple3(1, 2, 3); // optional new keyword
      _123.x == 1 && _123.y == 2 && _123.z == 3; // true
      _123 instanceof Tuple3; // true
      ```
    **/
    function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
            var self = getInstance(this, wrapped),
                i;

            if(arguments.length != fields.length)
                throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);

            for(i = 0; i < fields.length; i++)
                self[fields[i]] = arguments[i];

            return self;
        }
        wrapped._length = fields.length;
        return wrapped;
    }
    exports.tagged = tagged;

    /**
      ## `daggy.taggedSum(constructors)`

      Creates a constructor for each key in `constructors`. Returns a
      function with each constructor as a property. Allows
      `instanceof` checks for each constructor and the returned
      function.

      ```javascript
      var Option = daggy.taggedSum({
          Some: ['x'],
          None: []
      });

      Option.Some(1) instanceof Option.Some; // true
      Option.Some(1) instanceof Option; // true
      Option.None instanceof Option; // true

      function incOrZero(o) {
          return o.cata({
              Some: function(x) {
                  return x + 1;
              },
              None: function() {
                  return 0;
              }
          });
      }
      incOrZero(Option.Some(1)); // 2
      incOrZero(Option.None); // 0
      ```
    **/
    function taggedSum(constructors) {
        var key;

        function definitions() {
            throw new TypeError('Tagged sum was called instead of one of its properties.');
        }

        function makeCata(key) {
            return function(dispatches) {
                var fields = constructors[key],
                    args = [],
                    i;

                if(!dispatches[key])
                    throw new TypeError("Constructors given to cata didn't include: " + key);

                for(i = 0; i < fields.length; i++)
                    args.push(this[fields[i]]);

                return dispatches[key].apply(this, args);
            };
        }

        function makeProto(key) {
            var proto = create(definitions.prototype);
            proto.cata = makeCata(key);
            return proto;
        }

        for(key in constructors) {
            if(!constructors[key].length) {
                definitions[key] = makeProto(key);
                continue;
            }
            definitions[key] = tagged.apply(null, constructors[key]);
            definitions[key].prototype = makeProto(key);
        }

        return definitions;
    }
    exports.taggedSum = taggedSum;
});

},{}],4:[function(require,module,exports){
var daggy = require('daggy'),
    Option = daggy.taggedSum({
        Some: ['x'],
        None: []
    });

// Methods
Option.prototype.fold = function(f, g) {
    return this.cata({
        Some: f,
        None: g
    });
};
Option.of = Option.Some;
Option.prototype.orElse = function(x) {
    return this.fold(
        function(x) {
            return Option.Some(x);
        },
        function() {
            return x;
        }
    );
};
Option.prototype.getOrElse = function(x) {
    return this.fold(
        function(a) {
            return a;
        },
        function() {
            return x;
        }
    );
};
Option.prototype.chain = function(f) {
    return this.fold(
        function(a) {
            return f(a);
        },
        function() {
            return Option.None;
        }
    );
};
Option.prototype.concat = function(x) {
    return this.fold(
        function(a) {
            return x.chain(function(b) {
                return Option.Some(a.concat(b));
            });
        },
        function() {
            return b;
        }
    );
};

// Derived
Option.prototype.map = function(f) {
    return this.chain(function(a) {
        return Option.of(f(a));
    });
};
Option.prototype.ap = function(a) {
    return this.chain(function(f) {
        return a.map(f);
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Option;

},{"daggy":3}],5:[function(require,module,exports){
var daggy = require('daggy'),
    Store = daggy.tagged('set', 'get');

// Methods
Store.prototype.extract = function() {
    return this.set(this.get());
};
Store.prototype.extend = function(f) {
    var self = this;
    return Store(
        function(k) {
            return f(Store(
                self.set,
                function() {
                    return k;
                }
            ));
        },
        this.get
    );
};

// Derived
Store.prototype.map = function(f) {
    var self = this;
    return this.extend(function(c) {
        return f(c.extract());
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Store;

},{"daggy":3}]},{},[2])
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isLength(value) {
    return value > -1 && value % 1 == 0 && value < 9007199254740991;
}

function isArray(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && isLength(value.length);
}

var baseObservedObject = {

    updateFrom: function updateFrom(template) {
        if (template) {
            for (var i in template) {
                this[i] = template[i];
            }
        }
        return this;
    },

    copyInto: function copyInto(recipient) {
        if (recipient == this) {
            return this;
        }
        if (!recipient || (typeof recipient === 'undefined' ? 'undefined' : _typeof(recipient)) !== 'object') {
            recipient = {};
        }
        for (var i in this) {
            recipient[i] = this[i];
        }
        return recipient;
    },

    cloneObject: function cloneObject(object) {
        var _this = this;

        if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === "object") {
            if (object) {
                if (isArray(object) && object.map) {
                    return object.map(function (item) {
                        return _this.cloneObject(item);
                    });
                }

                var result = {};
                for (var i in object) {
                    result[i] = this.cloneObject(object[i]);
                }
                return result;
            } else return null;
        }

        return object;
    },

    once: function once(eventType, observer) {
        this.on(eventType, observer, true);
    },

    on: function on(eventType, observer, once) {

        if (this.__notifyingNow > 0) {

            this.__toAdd = {
                eventType: eventType,
                observer: observer,
                once: once,
                next: this.__toAdd
            };
        } else {

            var newObserver = {
                observer: observer,
                once: once
            };

            var observers = this.__observers;

            if (observers) {
                var f = observers[eventType];

                if (f) {
                    f.push(newObserver);
                } else {
                    observers[eventType] = [newObserver];
                }
            } else {
                this.__observers = _defineProperty({}, eventType, [newObserver]);
            }
        }

        return this;
    },

    off: function off(eventType, observer) {

        if (this.__notifyingNow > 0) {
            this.__toRemove = {
                eventType: eventType,
                observer: observer,
                next: this.__toRemove
            };
            return this;
        }

        var removed = false;
        var observers = this.__observers;

        if (observers) {

            observers = observers[eventType];

            if (observers) {
                var i = observers.length - 1;
                while (i >= 0) {

                    if (observers[i].observer === observer) {

                        observers.splice(i, 1);
                        removed = true;
                    }

                    i--;
                }
            }
        }

        if (!removed) {
            console.warn("Warning: observer could not be found, filter - ", eventType);
        }

        return this;
    },

    execSetupChain: function execSetupChain(chainName, callback) {
        var chain = this[chainName];

        this[chainName] = null;

        while (chain) {
            callback(chain.eventType, chain.observer, chain.once);

            var next = chain.next;
            chain.next = null;

            chain = next;
        }
    },

    emit: function emit(eventType, data) {
        for (var _len = arguments.length, other = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            other[_key - 2] = arguments[_key];
        }

        var _this2 = this;

        this.__notifyingNow++;

        try {
            var observers = this.__observers;

            if (observers) {
                observers = observers[eventType];

                if (observers) {

                    observers.forEach(function (o) {
                        o.observer.apply(o, [eventType, data].concat(other, [_this2]));
                        if (o.once) {
                            _this2.off(eventType, o.observer);
                        }
                    });
                }
            }
        } finally {

            if (--this.__notifyingNow == 0) {
                this.execSetupChain('__toRemove', this.off);
                this.execSetupChain('__toAdd', this.on);
            }
        }
    }
};

function ObservedObject(template) {
    this.updateFrom = baseObservedObject.updateFrom;
    this.updateFrom(baseObservedObject);
    this.updateFrom(template);
}

module.exports = ObservedObject;
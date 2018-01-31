var baseObservedObject =  {

    updateFrom: function (template) {
        if (template) {
            for (var i in template) {
                this[i] = template[i];
            }
        }
        return this;
    },

    copyInto: function(recipient) {
        if (recipient == this) {
            return this;
        }
        if (!recipient || (typeof recipient !== 'object')) {
            recipient = {}
        }
        for (var i in this) {
            recipient[i] = this[i];
        }
        return recipient;
    },

    cloneObject: function (object) {

        if (typeof object === "object") {
                if (object) {
                    if (Array.isArray(object) && object.map) {
                        return object.map( item => this.cloneObject( item ) );
                    }
    
                    const result = { };
                    for (let i in object) {
                        result[i] = this.cloneObject(object[i])
                    }
                    return result;
    
                } else return null;
        }
    
        return object;
    
    },
    
    once: function(eventType, observer) {
        this.on(eventType, observer, true);
    }, 

    on: function (eventType, observer, once) {

        if (this.__notifyingNow > 0) {

            this.__toAdd = {  
                eventType: eventType,
                observer: observer,
                once: once,
                next: this.__toAdd
            }

        } else  {

            const newObserver = {
                observer: observer,
                once: once
            }

            let observers = this.__observers;

            if (observers) {
                let f = observers[eventType];
    
                if (f) {
                    f.push( newObserver );
                } else {
                    observers[eventType] = [ newObserver ];
                }
            } else {
                this.__observers = { 
                    [eventType]: [ newObserver ] 
                };
            }
        }

        return this;
    },

    off: function(eventType, observer) {

        if (this.__notifyingNow > 0) {
            this.__toRemove = {
                eventType: eventType,
                observer: observer,
                next: this.__toRemove
            }
            return this;
        }

        let removed = false;
        let observers = this.__observers;

        if (observers) {

            observers = observers[eventType];
            
            if (observers) {
                let i = observers.length - 1;
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

    execSetupChain: function( chainName, callback ) {
        let chain = this[chainName];
        
        this[chainName] = null;

        while (chain) {
            callback(chain.eventType, chain.observer, chain.once);
            
            let next = chain.next;  
            chain.next = null;      

            chain = next;
        }
    },

    emit: function(eventType, data, ...other) {

        this.__notifyingNow ++;

        try {
            let observers = this.__observers;

            if (observers) {
                observers = observers[eventType];

                if (observers) {
                
                    observers.forEach( o => {
                        o.observer(eventType, data, ...other);
                        if (o.once) {
                            this.off(eventType, o.observer);
                        }
                    } );
                }
            }
        
        } finally {

            if ( -- this.__notifyingNow == 0) {
                this.execSetupChain('__toRemove', this.off);
                this.execSetupChain('__toAdd', this.on);
            } 

        }
        
    } 
}

function ObservedObject(template) {
    this.updateFrom = baseObservedObject.updateFrom;
    this.updateFrom(baseObservedObject);
    this.updateFrom(template);
}

module.exports = ObservedObject;
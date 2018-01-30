class ObservedObject {

    constructor (template) {
        this.updateFrom(template);
    }

    updateFrom(template) {
        if (template) {
            for (var i in template) {
                this[i] = template[i];
            }
        }
        return this;
    }

    copyInto(recipient) {
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
    }

    once(eventType, observer) {
        this.on(eventType, observer, true);
    } 

    on(eventType, observer, once) {

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
    }

    off(eventType, observer) {

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
    }

    execSetupChain( chainName, callback ) {
        let chain = this[chainName];
        
        this[chainName] = null;

        while (chain) {
            callback(chain.eventType, chain.observer, chain.once);
            
            let next = chain.next;  
            chain.next = null;      

            chain = next;
        }
    }

    emit(eventType, data, ...other) {

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

module.exports = ObservedObject;
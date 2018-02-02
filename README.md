# observed-object


[![MIT][mit-image]][mit-url]

> Custom, simple, module for observing objects / event emitting


[mit-image]: https://github.com/stanurkov/observed-object/blob/master/mit.svg
[mit-url]: https://github.com/stanurkov/observed-object/blob/master/LICENSE


## Introduction

ObservedObject JavaScript (ES6) class is a base class for objects that may emit any kind of events with specified type and accompaniying data.

Here is a simple example of usage:

```
oo.on("myEvent", (type, data) => {
    console.log(`Event of type ${type} is logged with data ${data}`);
});

oo.emit("myEvent", "<<test data>>");   // output: Event of type myEvent is logged with data <<test data>>
```

#### Async safe

This class is designed to be safe for asynchronous usage, i.e. it is possible to safely register/unregister observers in asynchronous calls or within event handlers

#### Installation

From the root of your project.

```sh
npm install observed-object
```

#### Registering observers

```
  anObject.on(eventType, callback, once)
```

Callback is a function that receives at least one parameter (eventType) and at most all other parameters passed to the emit object's method. The last parameter is always the observed object itself. I.e., normally, callback can be defined as a function with three parameters:

```
let myEventCallback = (type, data, sender) => {
  ...
}
```

In a more general approach, callback is defined as

```
let myEventCallback = (type, data, ...params) => {
  ...
}
```

where the sender is the last element of the params array ( params[params.length-1] )


#### Unregistering observers

To remove a registered observer from the list of object's observers, use

```
  anObject.off(eventType, callback)
```

#### Emitting events 

```
  anObject.emit(eventType, data, ...other)
```

This will notify all registered observers passing all the parameters and the observable object to them


#### Usage example

```
var OO = require("observed-object");

let oo = new OO();
let oo2 = new OO();

const test1 = (type, data, ...params) => {
    console.log("Event type is ", type, ", data is ", data);

    if (params) {
        let l = params.length;

        if (l > 0) {
            // Let's list all extra parameters
            for (let i = 0; i < l-1; i++) {
                console.log("Parameter #", i, ' is ', params[i]);
            }

            // List the observed object's signature 
            console.log("Sender's signature is: ", params[l-1].signature, '\n');
        }
    }

};

oo.signature = "Test OO";
oo2.signature = "Secondary Test OO";

oo.on("event1", test1 );
oo2.on("event11", test1 );

oo.once("event2", (type, data) => {
    console.log("Event type 2 is logged with data ", data, '\n');
});

console.log(">>=== OK now, let's test the first object observers");

oo.emit("event1", "test", 1, 2);
oo.emit("event1", { text: "test", data: 0 } );

oo.emit("event2", "test");
oo.emit("event2", { text: "test for #2", data: 22 } );

oo.off("event2");

oo.off("event1", test1);

oo.emit("event1", "test");

console.log("==== Now, test the secondary object's observers");

oo2.emit("event11", "some data");

```
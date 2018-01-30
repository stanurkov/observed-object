# observed-object


[![MIT][mit-image]][mit-url]

> Custom, simple, module for observing objects / event emitting


[mit-image]: 
[mit-url]: https://github.com/stanurkov/ln3/blob/master/LICENSE


## Introduction

ObservedObject JavaScript (ES6) class is a base class for objects that may emit any kind of events with specified type and accompaniying data.

Here is a simple example of usage:

```
var ObservedObject = require("observed-object");

let oo = new ObservedObject();

const test1 = (type, data) => {
    console.log("Event type is ", type, " data is ", data);
};

oo.on("1", test1 );

oo.once("2", (type, data) => {
    console.log("Event type 2 is logged with data ", data);
});


oo.emit("1", "test");                      // output: Event type is  1  data is  test
oo.emit("1", { text: "test", data: 0 } );  // output: Event type is  1  data is  { text: 'test', data: 0 }

oo.emit("2", "test");                      // output: Event type 2 is logged with data  test
oo.emit("2", { text: "test", data: 0 } );  // no output

oo.off("2");                               // output: Warning: observer could not be found, filter -  2

oo.off("1", test1);                        // no output

oo.emit("1", "test");                      // no output


```

This class is designed to be safe for using in asynchronous 

#### Installation

From the root of your project.

```sh
npm install observed-object
```


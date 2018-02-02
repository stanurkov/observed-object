var OO = require("./index");

let oo = new OO();
let oo2 = new OO();

const test1 = (type, data, ...params) => {
    console.log("Event type is ", type, ", data is ", data);

    if (params) {
        let l = params.length;

        if (l > 0) {
            for (let i = 0; i < l-1; i++) {
                console.log("Parameter #", i, ' is ', params[i]);
            }

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
oo.emit("event2", { text: "test", data: 0 } );

oo.off("event2");

oo.off("event1", test1);

oo.emit("event1", "test");

console.log("==== Now, test the secondary object's observers");

oo2.emit("event11", "some data");


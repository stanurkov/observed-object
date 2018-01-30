var OO = require("./index");

let oo = new OO();

const test1 = (type, data, param1, param2) => {
    console.log("Event type is ", type, " data is ", data);
    if (param1) {
        console.log("Param1 is ", param1);
    }
    if (param2) {
        console.log("Param2 is ", param2);
    }
};

oo.on("1", test1 );

oo.once("2", (type, data) => {
    console.log("Event type 2 is logged with data ", data);
});

oo.emit("1", "test", 1, 2);
oo.emit("1", { text: "test", data: 0 } );

oo.emit("2", "test");
oo.emit("2", { text: "test", data: 0 } );

oo.off("2");

oo.off("1", test1);

oo.emit("1", "test");

var OO = require("./index");

let oo = new OO();

const test1 = (type, data) => {
    console.log("Event type is ", type, " data is ", data);
};

oo.on("1", test1 );

oo.once("2", (type, data) => {
    console.log("Event type 2 is logged with data ", data);
});

oo.emit("1", "test");
oo.emit("1", { text: "test", data: 0 } );

oo.emit("2", "test");
oo.emit("2", { text: "test", data: 0 } );

oo.off("2");

oo.off("1", test1);

oo.emit("1", "test");

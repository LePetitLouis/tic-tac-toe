"use strict";
exports.__esModule = true;
var socket_controllers_1 = require("socket-controllers");
var socket_io_1 = require("socket.io");
exports["default"] = (function (httpServer) {
    var io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*"
        }
    });
    // io.on("connection", (socket) => {
    // });
    (0, socket_controllers_1.useSocketServer)(io, { controllers: [__dirname + "/api/controllers/*.ts"] });
    return io;
});

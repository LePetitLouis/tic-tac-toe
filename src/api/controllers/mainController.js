"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.MainController = void 0;
var socket_controllers_1 = require("socket-controllers");
var socket_io_1 = require("socket.io");
var MainController = /** @class */ (function () {
    function MainController() {
    }
    MainController.prototype.onConnection = function (socket, io) {
        console.log("New Socket connected: ", socket.id);
        socket.on("custom_event", function (data) {
            console.log("Data: ", data);
        });
    };
    var _a, _b;
    __decorate([
        (0, socket_controllers_1.OnConnect)(),
        __param(0, (0, socket_controllers_1.ConnectedSocket)()),
        __param(1, (0, socket_controllers_1.SocketIO)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_a = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _a : Object, typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object]),
        __metadata("design:returntype", void 0)
    ], MainController.prototype, "onConnection");
    MainController = __decorate([
        (0, socket_controllers_1.SocketController)()
    ], MainController);
    return MainController;
}());
exports.MainController = MainController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const teroristController_1 = require("../controllers/teroristController");
const idfController_1 = require("../controllers/idfController");
const connectSocket = (socket) => {
    console.log(`New connection: ${socket.id}`);
    (0, teroristController_1.getMyMissiles)(socket);
    (0, teroristController_1.attack)(socket);
    (0, idfController_1.getMyDefenses)(socket);
    (0, idfController_1.defenseMissileLauncher)(socket);
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
};
exports.connectSocket = connectSocket;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const connectSocket = (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.on("disconnect", () => console.log("User disconnected"));
};
exports.connectSocket = connectSocket;

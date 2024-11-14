"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const teroristService_1 = require("../services/teroristService");
const idfService_1 = require("../services/idfService");
const setupSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: token missing"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            next(new Error("Authentication error: invalid token"));
        }
    });
    io.on("connection", (socket) => {
        if (!socket.data.user) {
            socket.disconnect();
            return;
        }
        socket.on("getDefenses", async (data, callback) => {
            try {
                const defenses = await (0, idfService_1.getMyDefensesService)(data.location);
                callback({ success: true, data: defenses });
            }
            catch (error) {
                callback({ success: false, message: error });
            }
        });
        socket.on("getMissiles", async (data, callback) => {
            try {
                const missiles = await (0, teroristService_1.getMyMissilesService)(data.organization);
                callback({ success: true, data: missiles });
            }
            catch (error) {
                callback({ success: false, message: error });
            }
        });
        socket.on("interceptMissile", async (data, callback) => {
            try {
                const { missileName } = data;
                console.log(`Intercepting missile: ${missileName}`);
                io.emit("missileIntercepted", { missileName });
                callback({
                    success: true,
                    message: `Missile ${missileName} intercepted successfully`,
                });
            }
            catch (error) {
                callback({ success: false, message: error });
            }
        });
        socket.on("launchMissile", async (data, callback) => {
            try {
                console.log(`Launching missile for organization: ${data.organization}`);
                const target = data.target || "Unknown Target";
                io.emit("missileLaunched", { missileName: "MissileName", target });
                callback({ success: true, message: "Missile launched successfully" });
            }
            catch (error) {
                callback({ success: false, message: error });
            }
        });
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.setupSocketServer = setupSocketServer;

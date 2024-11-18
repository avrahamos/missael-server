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
            console.error("Authentication error: token missing");
            return next(new Error("Authentication error: token missing"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            console.error("Authentication error: invalid token");
            next(new Error("Authentication error: invalid token"));
        }
    });
    io.on("connection", (socket) => {
        if (!socket.data.user) {
            console.error("User not authenticated. Disconnecting socket.");
            socket.disconnect();
            return;
        }
        const userOrganization = socket.data.user.organization;
        if (userOrganization === "IDF") {
            socket.join("idf-room");
        }
        else {
        }
        socket.on("getDefenses", async (data, callback) => {
            try {
                const defenses = await (0, idfService_1.getMyDefensesService)(data.location);
                callback({ success: true, data: defenses });
            }
            catch (error) {
                console.error(`Error fetching defenses for location: ${data.location}`, error);
                callback({ success: false, message: error });
            }
        });
        socket.on("getMissiles", async (data, callback) => {
            try {
                const missilesData = await (0, teroristService_1.getMyMissilesService)(data.organization);
                if (missilesData && missilesData.resources) {
                    callback({ success: true, data: missilesData.resources });
                }
                else {
                    console.warn("No missiles found for organization:", data.organization);
                    callback({
                        success: false,
                        message: "No missiles found for this organization.",
                    });
                }
            }
            catch (error) {
                console.error("Error fetching missiles:", error);
                callback({ success: false, message: error });
            }
        });
        socket.on("interceptMissile", async (data, callback) => {
            try {
                const { missileName } = data;
                io.emit("missileIntercepted", { missileName });
                callback({
                    success: true,
                    message: `Missile ${missileName} intercepted successfully`,
                });
            }
            catch (error) {
                console.error("Error intercepting missile:", error);
                callback({ success: false, message: error });
            }
        });
        socket.on("launchMissile", async (data, callback) => {
            try {
                const target = data.target || "Unknown Target";
                const launchResult = await (0, teroristService_1.launchMissileAndUpdateResources)(data);
                if (!launchResult) {
                    console.error("[launchMissile] Failed to launch missile");
                    callback({ success: false, message: "Failed to launch missile" });
                    return;
                }
                io.to("idf-room").emit("missileLaunched", {
                    missileName: launchResult.missileName,
                    target: target,
                    launchedBy: socket.data.user.organization,
                });
                callback({
                    success: true,
                    message: `Missile launched towards ${target}!`,
                });
            }
            catch (error) {
                console.error("[launchMissile] Error:", error);
                callback({ success: false, message: error });
            }
        });
        socket.on("disconnect", () => { });
    });
    return io;
};
exports.setupSocketServer = setupSocketServer;

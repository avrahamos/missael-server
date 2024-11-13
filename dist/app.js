"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const io_1 = require("./socket/io");
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const idfRouter_1 = __importDefault(require("./routers/idfRouter"));
const teroristRouter_1 = __importDefault(require("./routers/teroristRouter"));
const db_1 = require("./config/db");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["*"],
    },
});
(0, db_1.connectToMongo)();
exports.io.on("connection", io_1.connectSocket);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/user", userRouter_1.default);
app.use("/idf", idfRouter_1.default);
app.use("/terorists", teroristRouter_1.default);
httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import { connectSocket } from "./socket/io";


const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

io.on("connection", connectSocket);

app.use(express.json());
app.use(cors());

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

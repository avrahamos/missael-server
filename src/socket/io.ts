import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { CustomSocket, UserPayload } from "../types/types";
import {
  getMyMissilesService,
  launchMissileAndUpdateResources,
} from "../services/teroristService";
import { getMyDefensesService } from "../services/idfService";

export const setupSocketServer = (httpServer: any): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    if (!socket.data.user) {
      socket.disconnect();
      return;
    }

    socket.on("getDefenses", async (data, callback) => {
      try {
        const defenses = await getMyDefensesService(data.location);
        callback({ success: true, data: defenses });
      } catch (error) {
        callback({ success: false, message: error });
      }
    });

    socket.on("getMissiles", async (data, callback) => {
      try {
        const missiles = await getMyMissilesService(data.organization);
        callback({ success: true, data: missiles });
      } catch (error) {
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
      } catch (error) {
        callback({ success: false, message: error });
      }
    });

    socket.on("launchMissile", async (data, callback) => {
      try {
        console.log(`Launching missile for organization: ${data.organization}`);
        const target = data.target || "Unknown Target";
        io.emit("missileLaunched", { missileName: "MissileName", target });
        callback({ success: true, message: "Missile launched successfully" });
      } catch (error) {
        callback({ success: false, message: error });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

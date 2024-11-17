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
      console.error("Authentication error: token missing");
      return next(new Error("Authentication error: token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      socket.data.user = decoded;
      console.log(
        `User authenticated: ${decoded.organization}, Location: ${decoded.location}`
      );
      next();
    } catch (error) {
      console.error("Authentication error: invalid token");
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    if (!socket.data.user) {
      console.error("User not authenticated. Disconnecting socket.");
      socket.disconnect();
      return;
    }

    const userOrganization = socket.data.user.organization;
    console.log(`User connected with organization: ${userOrganization}`);

    if (userOrganization === "IDF") {
      socket.join("idf-room");
      console.log(`User with socket ID ${socket.id} added to idf-room`);
    } else {
      console.log(`User with socket ID ${socket.id} is not part of IDF`);
    }

    socket.on("getDefenses", async (data, callback) => {
      try {
        console.log(`Fetching defenses for location: ${data.location}`);
        const defenses = await getMyDefensesService(data.location);
        console.log(`Defenses fetched: ${JSON.stringify(defenses)}`);
        callback({ success: true, data: defenses });
      } catch (error) {
        console.error(
          `Error fetching defenses for location: ${data.location}`,
          error
        );
        callback({ success: false, message: error });
      }
    });

    socket.on("getMissiles", async (data, callback) => {
      try {
        console.log("Request for missiles:", data);
        const missilesData = await getMyMissilesService(data.organization);
        if (missilesData && missilesData.resources) {
          console.log("Missiles found:", missilesData.resources);
          callback({ success: true, data: missilesData.resources });
        } else {
          console.warn(
            "No missiles found for organization:",
            data.organization
          );
          callback({
            success: false,
            message: "No missiles found for this organization.",
          });
        }
      } catch (error) {
        console.error("Error fetching missiles:", error);
        callback({ success: false, message: error });
      }
    });

    socket.on("interceptMissile", async (data, callback) => {
      try {
        const { missileName } = data;
        console.log(`Intercepting missile: ${missileName}`);

        io.emit("missileIntercepted", { missileName });
        console.log(`Missile intercepted and event emitted to all users`);
        callback({
          success: true,
          message: `Missile ${missileName} intercepted successfully`,
        });
      } catch (error) {
        console.error("Error intercepting missile:", error);
        callback({ success: false, message: error });
      }
    });

    socket.on("launchMissile", async (data, callback) => {
      try {
        console.log(`[launchMissile] Organization: ${data.organization}`);
        console.log(`[launchMissile] Target: ${data.target}`);
        const target = data.target || "Unknown Target";

        const launchResult = await launchMissileAndUpdateResources(data);
        if (!launchResult) {
          console.error("[launchMissile] Failed to launch missile");
          callback({ success: false, message: "Failed to launch missile" });
          return;
        }

        console.log(
          `[launchMissile] Broadcasting missileLaunched event to IDF users`
        );

        const socketsInRoom = await io.in("idf-room").fetchSockets();
        console.log(`Sockets in idf-room: ${socketsInRoom.map((s) => s.id)}`);

        io.to("idf-room").emit("missileLaunched", {
          missileName: launchResult.missileName,
          target: target,
          launchedBy: socket.data.user.organization,
        });

        console.log(
          `[launchMissile] Missile launched event emitted to idf-room`
        );

        callback({
          success: true,
          message: `Missile launched towards ${target}!`,
        });
      } catch (error) {
        console.error("[launchMissile] Error:", error);
        callback({ success: false, message: error });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

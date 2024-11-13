import { Socket } from "socket.io";
import { defenseMissileLauncherService, getMyDefensesService } from "../services/idfService";

export const getMyDefenses = (socket: Socket) => {
  socket.on("getDefenses", async (data: { location: string }) => {
    try {
      const { location } = data;

      if (!location) {
        return socket.emit("error", { message: "Location is required" });
      }

      const defenses = await getMyDefensesService(location);
      if (!defenses) {
        return socket.emit("error", { message: "Defenses not found" });
      }

      socket.emit("defensesData", defenses.resources);
    } catch (error) {
      socket.emit("error", { message: "Failed to retrieve defenses", error });
    }
  });
};


export const defenseMissileLauncher = (socket: Socket) => {
  socket.on(
    "defenseMissileLaunch",
    async (data: {
      defenseName: string;
      missileSpeed: number;
      distance: number;
      interceptSpeed: number;
    }) => {
      try {
        const { defenseName, missileSpeed, distance, interceptSpeed } = data;

        if (!defenseName || !missileSpeed || !distance || !interceptSpeed) {
          return socket.emit("error", { message: "Missing required fields" });
        }

        const result = await defenseMissileLauncherService({
          defenseName,
          missileSpeed,
          distance,
          interceptSpeed,
        });

        socket.emit("missileIntercepted", result);
      } catch (error) {
        socket.emit("error", {
          message: "Failed to launch defense missile",
          error,
        });
      }
    }
  );
};

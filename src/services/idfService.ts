import { Server, Socket } from "socket.io";
import { calculateMissileTimes, loadInitialOrganizationData } from "../utils/utils";
import { IOrganization } from "../types/types";
export const getMyDefensesService = (io:Server, socket:Socket) => {
  socket.on("getDefenses", async (data) => {
    try {
      const { location } = data;

      if (!location) {
        return socket.emit("error", { message: "Location is required" });
      }

      const organizationsData = await loadInitialOrganizationData();

      const locationData = organizationsData.find(
        (org:IOrganization) => org.name === location
      );

      if (!locationData) {
        return socket.emit("error", { message: "Defense systems not found" });
      }

      socket.emit("defenseData", locationData.resources);
    } catch (error) {
      socket.emit("error", { message: "Failed to retrieve defense data" });
    }
  });
};

export const defenseMissileLauncherService = (io:Server, socket:Socket) => {
  socket.on("interceptMissile", (data) => {
    try {
      const { defenseName, missileSpeed, distance, interceptSpeed } = data;

      if (!defenseName || !missileSpeed || !distance || !interceptSpeed) {
        return socket.emit("error", { message: "Missing required fields" });
      }

      const { missileTime, interceptTime, canIntercept } =
        calculateMissileTimes(missileSpeed, distance, interceptSpeed);

      if (canIntercept) {
        io.emit("missileIntercepted", {
          defenseName,
          success: true,
          interceptTime,
        });
      } else {
        io.emit("missileIntercepted", {
          defenseName,
          success: false,
        });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to intercept missile" });
    }
  });
};

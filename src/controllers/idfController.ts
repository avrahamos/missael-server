import { Socket } from "socket.io";
import {
  getMyDefensesService,
  defenseMissileLauncherService,
} from "../services/idfService";
import { CustomSocket } from "../types/types";

export const getMyDefenses = async (
  socket: CustomSocket,
  data: { location: string }
): Promise<void> => {
  try {
    if (!socket.data.user) {
      console.error("User not authenticated");
      socket.emit("error", { message: "User not authenticated" });
      return;
    }

    if (!data.location) {
      console.error("Access denied: Location data is missing");
      socket.emit("error", { message: "Location data is missing" });
      return;
    }

    if (socket.data.user.location !== data.location) {
      console.error("Access denied: Location mismatch", {
        userLocation: socket.data.user.location,
        requestedLocation: data.location,
      });
      socket.emit("error", { message: "Location mismatch" });
      return;
    }

    const defenses = await getMyDefensesService(data.location);
    if (!defenses) {
      console.error("No defenses found for location:", data.location);
      socket.emit("error", { message: "No defenses found" });
      return;
    }

    socket.emit("defensesData", {
      success: true,
      resources: defenses.resources,
    });
  } catch (error) {
    console.error("Error retrieving defenses:", error);
    socket.emit("error", { message: "Failed to retrieve defenses", error });
  }
};

export const defenseMissileLauncher = async (
  socket: Socket,
  data: {
    defenseName: string;
    missileSpeed: number;
    distance: number;
    interceptSpeed: number;
    missileName: string; 
  }
): Promise<void> => {
  try {
    const user = socket.data.user;
    if (!user) {
      console.error("User not authenticated.");
      socket.emit("error", { message: "User not authenticated" });
      return;
    }

    const result = await defenseMissileLauncherService(data);
    if (!result || !result.success) {
      console.error("Interception failed.");
      socket.emit("error", { message: "Failed to intercept missile" });
      return;
    }

    const defenses = await getMyDefensesService(user.location);
    if (defenses) {
      const defense = defenses.resources.find(
        (d) => d.name === data.defenseName
      );
      if (defense && defense.amount > 0) {
        defense.amount -= 1;
        socket.emit("updateDefenses", {
          success: true,
          message: `Missile launched from ${data.defenseName}. Remaining missiles: ${defense.amount}`,
          defenses: defenses.resources,
        });
      } else {
        socket.emit("error", {
          message: `No missiles left in ${data.defenseName}`,
        });
        return;
      }
    }

    socket.emit("missileIntercepted", {
      success: true,
      interceptTime: result.interceptTime,
      matchingInterceptors: result.matchingInterceptors, 
    });
  } catch (error) {
    console.error("Error occurred during missile interception:", error);
    socket.emit("error", {
      message: "Failed to launch defense missile",
      error,
    });
  }
};

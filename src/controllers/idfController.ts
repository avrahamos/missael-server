import { Socket } from "socket.io";
import {
  getMyDefensesService,
  defenseMissileLauncherService,
} from "../services/idfService";
import { CustomSocket } from "../types/types";

export const getMyDefenses = async (
  socket: CustomSocket,
  data: { location: string }
): Promise<any> => {

  if (!socket.data.user) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  if (!data.location) {
    console.error("Access denied: Location data is missing");
    throw new Error("Access denied: Location data is missing");
  }

  if (socket.data.user.location !== data.location) {
    console.error("Access denied: Location mismatch", {
      userLocation: socket.data.user.location,
      requestedLocation: data.location,
    });
    throw new Error("Access denied: Location mismatch");
  }


  const defenses = await getMyDefensesService(data.location);
  if (!defenses) {
    console.error("No defenses found for location:", data.location);
    throw new Error("No defenses found");
  }

  return defenses.resources;
};

export const defenseMissileLauncher = (
  socket: Socket,
  data: {
    defenseName: string;
    missileSpeed: number;
    distance: number;
    interceptSpeed: number;
  }
): void => {

  const user = socket.data.user;
  if (!user) {
    console.error("0987 User not authenticated.");
    socket.emit("error", { message: "User not authenticated" });
    return;
  }

 
  try {
    defenseMissileLauncherService(data).then((result) => {
      if (!result) {
        console.error("1234 Interception failed.");
        socket.emit("error", { message: "Failed to intercept missile" });
        return;
      }

      socket.emit("missileIntercepted", result);
    });
  } catch (error) {
    console.error(
      `4325 Error occurred during missile interception:`,
      error
    );
    socket.emit("error", {
      message: "Failed to launch defense missile",
      error,
    });
  }
};

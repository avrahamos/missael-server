import { Socket } from "socket.io";
import {
  getMyMissilesService,
  launchMissileAndUpdateResources,
} from "../services/teroristService";
import { CustomSocket } from "../types/types";

export const getMyMissiles = (
  socket: CustomSocket,
  data: { organization: string }
): void => {
  if (!socket.data.user) {
    console.error("getMissiles User not authenticated");
    socket.emit("error", { message: "User not authenticated" });
    return;
  }

  if (!data.organization) {
    console.error("[getMissiles] Organization data missing from client");
    socket.emit("error", { message: "Organization data missing" });
    return;
  }

  if (socket.data.user.organization !== data.organization) {
    console.error(
      "[getMissiles] Access denied: User's organization does not match",
      {
        userOrg: socket.data.user.organization,
        requestedOrg: data.organization,
      }
    );
    socket.emit("error", {
      message: "Access denied: Unauthorized organization",
    });
    return;
  }
};

export const attack = (
  socket: Socket,
  data: { organization: string; missileName: string; distance: number }
): void => {
  const user = socket.data.user;
  if (!user) {
    console.error("[attack] User not authenticated");
    socket.emit("error", { message: "User not authenticated" });
    return;
  }

  if (!data.organization || user.organization !== data.organization) {
    console.error("[attack] Unauthorized access: Organization mismatch");
    socket.emit("error", {
      message: "Access denied: Unauthorized organization",
    });
    return;
  }

  try {
    launchMissileAndUpdateResources(data).then((result) => {
      if (!result) {
        console.error(
          "[attack] Launch failed: No missile available or invalid organization"
        );
        socket.emit("error", {
          message: "Attack failed: No missile available",
        });
        return;
      }

      getMyMissilesService(data.organization).then((missiles) => {
        const missile = missiles?.resources.find(
          (m: any) => m.name === data.missileName
        );
        if (missile && missile.amount > 0) {
          missile.amount -= 1;
          socket.emit("updateMissiles", {
            success: true,
            message: `Missile launched: ${data.missileName}. Remaining missiles: ${missile.amount}`,
            missiles: missiles?.resources,
          });
        } else {
          socket.emit("error", {
            message: `No missiles left for ${data.missileName}`,
          });
          return;
        }
      });

      socket.emit("attackSuccess", result);
    });
  } catch (error) {
    console.error(" Error during missile launch:", error);
    socket.emit("error", { message: "Failed to execute attack", error });
  }
};

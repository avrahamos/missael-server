import { Socket } from "socket.io";
import { getMyMissilesService, launchMissileAndUpdateResources } from "../services/teroristService";

export const getMyMissiles = (socket: Socket) => {
  socket.on("getMissiles", async (data: { organization: string }) => {
    try {
      const { organization } = data;

      if (!organization) {
        return socket.emit("error", { message: "Organization is required" });
      }

      const missiles = await getMyMissilesService(organization);
      if (!missiles) {
        return socket.emit("error", { message: "Organization not found" });
      }

      socket.emit("missilesData", missiles.resources);
    } catch (error) {
      socket.emit("error", { message: "Failed to retrieve missiles", error });
    }
  });
};


export const attack = (socket: Socket) => {
  socket.on(
    "attack",
    async (data: {
      organization: string;
      missileName: string;
      distance: number;
    }) => {
      try {
        const { organization, missileName, distance } = data;

        if (!organization || !missileName || !distance) {
          return socket.emit("error", { message: "Missing required fields" });
        }

        const result = await launchMissileAndUpdateResources({
          organization,
          missileName,
          distance,
        });
        if (!result) {
          return socket.emit("error", {
            message:
              "Attack failed: Missile not available or organization not found",
          });
        }

        socket.emit("attackSuccess", result);
      } catch (error) {
        socket.emit("error", { message: "Failed to execute attack", error });
      }
    }
  );
};

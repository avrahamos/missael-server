import { Socket } from "socket.io";
import { attack, getMyMissiles } from "../controllers/teroristController";
import { defenseMissileLauncher, getMyDefenses } from "../controllers/idfController";

export const connectSocket = (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  getMyMissiles(socket);
  attack(socket);
  getMyDefenses(socket);
  defenseMissileLauncher(socket);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};

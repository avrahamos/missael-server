import { Socket } from "socket.io";

export const connectSocket = (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("disconnect", () => console.log("User disconnected"));
};

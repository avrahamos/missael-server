import { CustomSocket, UserPayload } from "../types/types";
import jwt from 'jsonwebtoken'
export const verifySocketToken = (
  socket: CustomSocket,
  next: (err?: Error) => void
): void => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error(" Token must provided"));
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;


    socket.data.user = payload;

    next();
  } catch (error) {
    console.error("Authentication error :", error);
    next(new Error(" Invalid token"));
  }
};

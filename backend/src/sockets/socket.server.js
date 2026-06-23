import { Server } from "socket.io";

import { registerSocketHandlers } from "./socket.handlers.js";
import { socketAuthMiddleware } from "./socket.middleware.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });


  io.use(socketAuthMiddleware);

  
  registerSocketHandlers(io);

  return io;
};

export const getIO = () => io;

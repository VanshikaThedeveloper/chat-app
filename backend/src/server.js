import dotenv from "dotenv";
dotenv.config();

import http from "http";

import connectDB from "./database/db.js";
import app from "./app.js";

import { initializeSocket } from "./sockets/socket.server.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

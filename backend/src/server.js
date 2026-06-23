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
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "FOUND" : "MISSING");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "FOUND" : "MISSING");
console.log("CLIENT_URL:", process.env.CLIENT_URL);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

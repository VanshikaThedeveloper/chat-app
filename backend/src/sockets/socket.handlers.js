
import connectedUsers from "./connected-users.js";
import { setUserOnline, setUserOffline } from "./socket.presence.js";
import { handleTyping, handleStopTyping } from "./socket.typing.js";
import { markMessageAsRead } from "./socket.read-receipt.js";
import { SOCKET_EVENTS } from "./socket.event.js";


export const registerSocketHandlers = (io) => {
  io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    const { userId } = socket.user;

    // Join user-specific room
    socket.join(userId);

    // Track connections
    const isAlreadyOnline = connectedUsers.has(userId) && connectedUsers.get(userId).size > 0;
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);

    // Only set online and broadcast if this is the first session
    if (!isAlreadyOnline) {
      await setUserOnline(userId);
      socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });
    }

    console.log(`User Connected: ${userId} (Sockets active: ${connectedUsers.get(userId).size})`);


    socket.on(SOCKET_EVENTS.TYPING, async ({ chatId }) => {
      try {
        await handleTyping(userId, chatId);
      } catch (error) {
        console.error("Typing Error:", error.message);
      }
      
    });


    socket.on(SOCKET_EVENTS.STOP_TYPING, async ({ chatId }) => {
      try {   
         await handleStopTyping(userId, chatId);
      } catch (error) {
        console.error(error.message);
      }
  
    });

    socket.on(SOCKET_EVENTS.MESSAGE_READ, async ({ messageId }) => {
      const message = await markMessageAsRead(messageId);
      if (message) {
        const senderId = message.senderId.toString();
        // Emit read receipt to both sender and receiver rooms
        io.to(senderId).emit(SOCKET_EVENTS.MESSAGE_READ, {
          messageId,
          status: "read",
        });
        io.to(userId).emit(SOCKET_EVENTS.MESSAGE_READ, {
          messageId,
          status: "read",
        });
      }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      try {
        const userSockets = connectedUsers.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            connectedUsers.delete(userId);
            await setUserOffline(userId);
            socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
          }
        }
        console.log(`User Disconnected: ${userId}`);
      } catch (error) {
        console.error("Disconnect Error:", error.message);
      }
    });
  });
};

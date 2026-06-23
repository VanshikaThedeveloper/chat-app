
import connectedUsers from "./connected-users.js";
import { setUserOnline, setUserOffline } from "./socket.presence.js";
import { handleTyping, handleStopTyping } from "./socket.typing.js";
import { markMessageAsRead } from "./socket.read-receipt.js";
import { SOCKET_EVENTS } from "./socket.event.js";


export const registerSocketHandlers = (io) => {
  io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    const { userId } = socket.user;

    connectedUsers.set(userId, socket.id);
    await setUserOnline(userId);

    console.log(`User Connected: ${userId}`);


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
      await markMessageAsRead(messageId);
    });

   socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
     try {
       await setUserOffline(userId);

       connectedUsers.delete(userId);

       console.log(`User Disconnected: ${userId}`);
     } catch (error) {
       console.error("Disconnect Error:", error.message);
     }
   });
  });
};

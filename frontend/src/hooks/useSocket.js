import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from '../services/socket.service';
import { addMessage, updateMessageStatus } from '../features/messages/messageSlice';
import {
  updateLastMessage,
  setTypingUser,
  clearTypingUser,
  setUserOnline,
  setUserOffline,
} from '../features/chats/chatSlice';

const useSocket = () => {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const activeChatId = useSelector((state) => state.chats.activeChat?._id);
  const activeChatRef = useRef(activeChatId);

  // Keep ref in sync for use inside socket callbacks
  useEffect(() => {
    activeChatRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      socketService.disconnect();
      return;
    }

    // Connect
    socketService.connect(accessToken);

    socketService.onReceiveMessage((message) => {
      // Add message to current chat if it matches
      if (activeChatRef.current === message.chatId) {
        dispatch(addMessage(message));
        socketService.emitMessageRead(message._id);
      }

      // Update last message in chat list
      dispatch(
        updateLastMessage({
          chatId: message.chatId,
          message,
        })
      );
    });

    socketService.onTyping(({ chatId, userId }) => {
      dispatch(setTypingUser({ chatId, userId }));
    });

    socketService.onStopTyping(({ chatId }) => {
      dispatch(clearTypingUser({ chatId }));
    });

    socketService.onMessageRead(({ messageId }) => {
      dispatch(updateMessageStatus({ messageId, status: 'read' }));
    });

    socketService.onMessageDelivered(({ messageId }) => {
      dispatch(updateMessageStatus({ messageId, status: 'delivered' }));
    });

    socketService.onUserOnline(({ userId }) => {
      dispatch(setUserOnline({ userId }));
    });

    socketService.onUserOffline(({ userId }) => {
      dispatch(setUserOffline({ userId }));
    });

    // Cleanup on unmount or auth change
    return () => {
      socketService.removeAllCustomListeners();
    };
  }, [isAuthenticated, accessToken, dispatch]);

  return socketService;
};

export default useSocket;

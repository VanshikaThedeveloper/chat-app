import { useCallback, useRef } from 'react';
import socketService from '../services/socket.service';

const TYPING_TIMEOUT = 2000; // 2 seconds

const useTyping = (chatId) => {
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!chatId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.emitTyping(chatId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socketService.emitStopTyping(chatId);
    }, TYPING_TIMEOUT);
  }, [chatId]);

  const stopTyping = useCallback(() => {
    if (!chatId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketService.emitStopTyping(chatId);
    }
  }, [chatId]);

  return { startTyping, stopTyping };
};

export default useTyping;

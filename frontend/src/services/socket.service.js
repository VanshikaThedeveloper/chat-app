import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../constants/socket.events';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // --- Listeners ---
  onReceiveMessage(callback) {
    this.socket?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }

  onTyping(callback) {
    this.socket?.on(SOCKET_EVENTS.TYPING, callback);
  }

  onStopTyping(callback) {
    this.socket?.on(SOCKET_EVENTS.STOP_TYPING, callback);
  }

  onMessageRead(callback) {
    this.socket?.on(SOCKET_EVENTS.MESSAGE_READ, callback);
  }

  onMessageDelivered(callback) {
    this.socket?.on(SOCKET_EVENTS.MESSAGE_DELIVERED, callback);
  }

  onUserOnline(callback) {
    this.socket?.on(SOCKET_EVENTS.USER_ONLINE, callback);
  }

  onUserOffline(callback) {
    this.socket?.on(SOCKET_EVENTS.USER_OFFLINE, callback);
  }

  // --- Emitters ---
  emitTyping(chatId) {
    this.socket?.emit(SOCKET_EVENTS.TYPING, { chatId });
  }

  emitStopTyping(chatId) {
    this.socket?.emit(SOCKET_EVENTS.STOP_TYPING, { chatId });
  }

  emitMessageRead(messageId) {
    this.socket?.emit(SOCKET_EVENTS.MESSAGE_READ, { messageId });
  }

  // Remove all custom listeners (keeps connect/disconnect)
  removeAllCustomListeners() {
    const events = [
      SOCKET_EVENTS.RECEIVE_MESSAGE,
      SOCKET_EVENTS.TYPING,
      SOCKET_EVENTS.STOP_TYPING,
      SOCKET_EVENTS.MESSAGE_READ,
      SOCKET_EVENTS.MESSAGE_DELIVERED,
      SOCKET_EVENTS.USER_ONLINE,
      SOCKET_EVENTS.USER_OFFLINE,
    ];
    events.forEach((event) => this.socket?.removeAllListeners(event));
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;

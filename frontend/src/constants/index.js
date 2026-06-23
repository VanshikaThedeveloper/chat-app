// App-wide route paths
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  PROFILE: '/profile',
};

// Default avatar fallback
export const DEFAULT_AVATAR = '';

// Message status values (from backend message.model.js)
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
};

// Chat types (from backend chat.model.js)
export const CHAT_TYPE = {
  PRIVATE: 'private',
  GROUP: 'group',
};

// Message types (from backend message.model.js)
export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};

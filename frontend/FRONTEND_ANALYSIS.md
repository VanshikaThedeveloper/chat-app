# ChatterBox — Frontend Analysis Document

## Table of Contents

1. [Folder Structure Explanation](#1-folder-structure-explanation)
2. [State Management Explanation](#2-state-management-explanation)
3. [Socket Architecture Explanation](#3-socket-architecture-explanation)
4. [API Integration Explanation](#4-api-integration-explanation)
5. [Authentication Flow](#5-authentication-flow)
6. [Real-Time Messaging Flow](#6-real-time-messaging-flow)
7. [Typing Indicator Flow](#7-typing-indicator-flow)
8. [Online Presence Flow](#8-online-presence-flow)
9. [Read Receipt Flow](#9-read-receipt-flow)
10. [Backend Review Notes](#10-backend-review-notes)
11. [Future Scalability Recommendations](#11-future-scalability-recommendations)
12. [Run Commands](#12-run-commands)

---

## 1. Folder Structure Explanation

```
frontend/
├── public/                          # Static assets
├── .env                             # Environment variables
├── index.html                       # HTML entry with Inter font & SEO meta
├── vite.config.js                   # Vite + React + Tailwind v4 plugins
│
└── src/
    ├── api/                         # HTTP layer (Axios)
    │   ├── axios.js                 # Axios instance with interceptors
    │   ├── auth.api.js              # POST /auth/register, login, logout, refresh
    │   ├── users.api.js             # GET/PUT /users/profile, search, :id
    │   ├── chats.api.js             # POST/GET/DELETE /chats
    │   └── messages.api.js          # POST/GET/DELETE /messages
    │
    ├── app/
    │   └── store.js                 # Redux store configuration
    │
    ├── features/                    # Redux Toolkit slices
    │   ├── auth/authSlice.js        # Auth state + thunks
    │   ├── chats/chatSlice.js       # Chat list + active chat + typing + presence
    │   ├── messages/messageSlice.js # Messages for active chat + real-time adds
    │   └── users/userSlice.js       # Profile + search results
    │
    ├── services/
    │   └── socket.service.js        # Socket.IO singleton with all event wiring
    │
    ├── hooks/                       # Custom React hooks
    │   ├── useAuth.js               # Auth state + dispatch shortcuts
    │   ├── useSocket.js             # Socket lifecycle + event→Redux bridge
    │   ├── useTyping.js             # Debounced typing emission
    │   └── useOnlineStatus.js       # Per-user online status selector
    │
    ├── constants/
    │   ├── index.js                 # Routes, message status, chat type enums
    │   └── socket.events.js         # Mirror of backend socket event strings
    │
    ├── utils/
    │   └── helpers.js               # formatTime, formatLastSeen, getInitials, etc.
    │
    ├── layouts/
    │   ├── AuthLayout.jsx           # Centered glassmorphic card (login/register)
    │   └── ChatLayout.jsx           # Sidebar + main area with mobile responsive toggle
    │
    ├── components/
    │   ├── common/                  # Reusable UI primitives
    │   │   ├── Avatar.jsx           # Image/initials avatar with online dot
    │   │   ├── Loader.jsx           # Spinner + optional text
    │   │   ├── EmptyState.jsx       # Empty state with icon
    │   │   └── ErrorState.jsx       # Error with retry button
    │   │
    │   ├── auth/
    │   │   ├── LoginForm.jsx        # Email + password form
    │   │   └── RegisterForm.jsx     # Username + email + password + confirm form
    │   │
    │   ├── chat/
    │   │   ├── ChatSidebar.jsx      # Header + search bar + chat list + search overlay
    │   │   ├── ChatList.jsx         # Renders ChatItem for each conversation
    │   │   ├── ChatItem.jsx         # Avatar + name + last message + time + typing
    │   │   ├── ChatWindow.jsx       # Orchestrates header + messages + input
    │   │   ├── ChatHeader.jsx       # User info + online/typing + delete menu
    │   │   ├── MessageList.jsx      # Date-grouped messages with auto-scroll
    │   │   ├── MessageBubble.jsx    # Sent/received bubble + checkmarks + delete
    │   │   ├── MessageInput.jsx     # Textarea + send button + typing emission
    │   │   ├── SearchUsers.jsx      # Debounced user search + create chat
    │   │   ├── TypingIndicator.jsx  # Animated three-dot indicator
    │   │   └── WelcomeScreen.jsx    # Default view when no chat selected
    │   │
    │   └── profile/
    │       ├── ProfileCard.jsx      # Avatar + username + email + bio + status
    │       └── EditProfileForm.jsx  # Username + bio + picture URL form
    │
    ├── pages/
    │   ├── Login/LoginPage.jsx      # Login page (AuthLayout + LoginForm)
    │   ├── Register/RegisterPage.jsx # Register page (AuthLayout + RegisterForm)
    │   ├── Chat/ChatPage.jsx        # Main chat (ChatLayout + Sidebar + Window)
    │   └── Profile/ProfilePage.jsx  # Profile view/edit page
    │
    ├── routes/
    │   ├── AppRoutes.jsx            # All route definitions
    │   ├── ProtectedRoute.jsx       # Requires auth → else redirect /login
    │   └── PublicRoute.jsx          # Requires no auth → else redirect /chat
    │
    ├── App.jsx                      # Provider + BrowserRouter + Toaster
    ├── main.jsx                     # React DOM render
    └── index.css                    # Tailwind v4 theme + custom utilities
```

### Design Principles

- **Feature-based slices**: Each domain (auth, chats, messages, users) has its own Redux slice
- **Separation of concerns**: API calls → Slices (thunks) → Components → Hooks
- **Single responsibility**: Each component does one thing well
- **Co-location**: Pages contain their route-level logic, components contain their UI logic

---

## 2. State Management Explanation

### Redux Store Architecture

```
store
├── auth       →  User credentials, tokens, authentication status
├── chats      →  Chat list, active chat, typing users, online users
├── messages   →  Messages for the active chat
└── users      →  Profile data, search results
```

### Key State Shapes

**Auth State:**
```js
{
  user: { id, username, email },
  accessToken: "eyJ...",
  refreshToken: "eyJ...",
  isAuthenticated: true,
  loading: false,
  error: null
}
```

**Chat State:**
```js
{
  chats: [{ _id, participants, lastMessage, lastMessageAt }],
  activeChat: { _id, participants, lastMessage },
  typingUsers: { "chatId123": "userId456" },
  onlineUsers: { "userId456": true },
  loading: false
}
```

**Message State:**
```js
{
  messages: [{ _id, chatId, senderId, content, status, createdAt }],
  loading: false,
  sending: false
}
```

### State Persistence

- `accessToken`, `refreshToken`, and `user` are persisted to `localStorage`
- On page refresh, the auth slice rehydrates from `localStorage`
- No other state is persisted (chats/messages are re-fetched from API)

---

## 3. Socket Architecture Explanation

### Connection Lifecycle

```
User Logs In → accessToken stored
       ↓
useSocket() hook runs in ChatPage
       ↓
socketService.connect(accessToken) → connects to VITE_SOCKET_URL
       ↓
Backend socket.middleware.js verifies token via jwt.verify()
       ↓
Backend registers user in connectedUsers Map
       ↓
Socket is now live — events flow both directions
       ↓
User Logs Out → socketService.disconnect()
```

### Event Flow Diagram

```
  FRONTEND (Emitters)              BACKEND (Handlers)
  ─────────────────              ──────────────────
  typing({ chatId })      →     handleTyping() → emit to receiver
  stop_typing({ chatId }) →     handleStopTyping() → emit to receiver
  message_read({ msgId }) →     markMessageAsRead() → update DB

  BACKEND (Emitters)              FRONTEND (Listeners)
  ─────────────────              ──────────────────
  receive_message          →     addMessage() + updateLastMessage()
  typing                   →     setTypingUser()
  stop_typing              →     clearTypingUser()
  user_online              →     setUserOnline()
  user_offline             →     setUserOffline()
  message_delivered        →     updateMessageStatus()
  message_read             →     updateMessageStatus()
```

### Singleton Pattern

`socket.service.js` uses a singleton class — only one socket connection per browser tab. This prevents duplicate connections on re-renders.

### Reconnection

Socket.IO client is configured with:
- `reconnection: true`
- `reconnectionAttempts: 10`
- `reconnectionDelay: 1000` (starts at 1s)
- `reconnectionDelayMax: 5000` (caps at 5s)

---

## 4. API Integration Explanation

### Axios Interceptor Chain

```
Request Flow:
  Component → dispatch(thunk) → api function → Axios Instance
                                                    ↓
                                         Request Interceptor
                                         (attach Bearer token)
                                                    ↓
                                              Backend API
                                                    ↓
                                         Response Interceptor
                                                    ↓
                                    ┌─── 200-299: Return data
                                    │
                                    └─── 401: Attempt token refresh
                                              ↓
                                         POST /auth/refresh-token
                                              ↓
                                    ┌─── Success: Update token, retry original
                                    └─── Failure: Clear auth, redirect to /login
```

### Concurrent 401 Handling

The interceptor uses a **failed request queue** pattern:
- When a 401 occurs, it sets `isRefreshing = true`
- Any subsequent 401s while refreshing are queued
- Once the refresh completes, all queued requests are retried with the new token
- This prevents multiple simultaneous refresh token calls

### API to Backend Route Mapping

| Frontend API Function | HTTP Method | Backend Route |
|---|---|---|
| `registerAPI()` | POST | `/api/auth/register` |
| `loginAPI()` | POST | `/api/auth/login` |
| `logoutAPI()` | POST | `/api/auth/logout` |
| `refreshTokenAPI()` | POST | `/api/auth/refresh-token` |
| `getProfileAPI()` | GET | `/api/users/profile` |
| `updateProfileAPI()` | PUT | `/api/users/profile` |
| `searchUsersAPI()` | GET | `/api/users/search?query=` |
| `getUserByIdAPI()` | GET | `/api/users/:id` |
| `createChatAPI()` | POST | `/api/chats` |
| `getChatsAPI()` | GET | `/api/chats` |
| `getChatByIdAPI()` | GET | `/api/chats/:chatId` |
| `deleteChatAPI()` | DELETE | `/api/chats/:chatId` |
| `sendMessageAPI()` | POST | `/api/messages` |
| `getMessagesAPI()` | GET | `/api/messages/:chatId` |
| `deleteMessageAPI()` | DELETE | `/api/messages/:messageId` |

---

## 5. Authentication Flow

```
┌─────────────┐     POST /auth/register      ┌──────────┐
│  Register   │ ──────────────────────────→   │ Backend  │
│    Page     │ ←── { success, data: user }   │          │
└─────┬───────┘                               └──────────┘
      │ redirect
      ↓
┌─────────────┐     POST /auth/login          ┌──────────┐
│   Login     │ ──────────────────────────→   │ Backend  │
│    Page     │ ←── { accessToken,            │          │
└─────┬───────┘      refreshToken, user }     └──────────┘
      │
      │ store tokens in localStorage + Redux
      │ redirect to /chat
      ↓
┌─────────────┐     Every request includes    ┌──────────┐
│   Chat      │ ── Authorization: Bearer ──→  │ Backend  │
│    Page     │                               │          │
└─────────────┘                               └──────────┘

Token Expired (401):
  → Axios interceptor calls POST /auth/refresh-token
  → Backend verifies refresh token against Redis
  → Returns new access token
  → Interceptor retries the original request

Logout:
  → POST /auth/logout (deletes refresh token from Redis)
  → Clear localStorage + Redux
  → Disconnect socket
  → Redirect to /login
```

---

## 6. Real-Time Messaging Flow

```
User A types message and clicks Send
        ↓
1. POST /api/messages { chatId, content }
        ↓
2. Backend creates Message in MongoDB
        ↓
3. Backend finds receiver via connectedUsers Map
        ↓
4. Backend emits "receive_message" to receiver's socket
        ↓
5. User B's useSocket hook catches "receive_message"
        ↓
6. Dispatches addMessage() → message appears in chat
7. Dispatches updateLastMessage() → sidebar updates
        ↓
8. If User B is viewing this chat:
   → Emits "message_read" event to backend
   → Backend updates message status to "read"
```

---

## 7. Typing Indicator Flow

```
User A starts typing in MessageInput
        ↓
useTyping hook → emits "typing" event with { chatId }
        ↓
Backend handleTyping() → finds receiver → emits "typing" to receiver
        ↓
User B's useSocket → dispatches setTypingUser({ chatId, userId })
        ↓
ChatItem + ChatHeader show TypingIndicator (animated dots)
        ↓
After 2 seconds of inactivity:
  useTyping auto-emits "stop_typing"
        ↓
Backend → emits "stop_typing" to receiver
        ↓
User B → dispatches clearTypingUser({ chatId })
        ↓
Typing indicator disappears
```

---

## 8. Online Presence Flow

```
User connects via socket
        ↓
Backend socket.handlers.js → setUserOnline(userId)
  → Updates User.isOnline = true in MongoDB
  → (Optional) emits "user_online" event
        ↓
Frontend receives → dispatches setUserOnline({ userId })
  → Updates onlineUsers map
  → Updates participant.isOnline in all chats
        ↓
Avatar green dot + "Online" status text appears

User disconnects:
  → Backend setUserOffline(userId)
  → Updates User.isOnline = false, lastSeen = new Date()
  → (Optional) emits "user_offline"
  → Frontend dispatches setUserOffline
  → Avatar grey dot + "Last seen X ago" text
```

**Note:** The backend's `setUserOnline`/`setUserOffline` currently only update MongoDB. The frontend also refreshes online status when fetching chat lists via `GET /chats` (which populates `participants.isOnline`).

---

## 9. Read Receipt Flow

```
Message statuses: "sent" → "delivered" → "read"

SENT:
  Message created in DB with status "sent"

DELIVERED:
  Backend checks if receiver is in connectedUsers
  → If yes: updates status to "delivered"
  → Frontend shows double grey checkmarks (✓✓)

READ:
  User opens a chat → sees unread messages
  → Frontend emits "message_read" with { messageId }
  → Backend markMessageAsRead() updates status to "read"
  → Sender's frontend receives update
  → Shows double blue checkmarks (✓✓ in primary color)
```

### Visual Indicators

| Status | Icon |
|---|---|
| Sent | Single grey check ✓ |
| Delivered | Double grey checks ✓✓ |
| Read | Double blue checks ✓✓ |

---

## 10. Backend Review Notes

> These items are observed in the backend code but **NO backend changes were made**.

### Duplicate Export in `socket.read-receipt.js`

The file `backend/src/sockets/socket.read-receipt.js` contains the `import` and `export` of `markMessageAsRead` **twice** (lines 1-15 and lines 17-31). This will cause a runtime error due to duplicate import declarations. The frontend still emits `message_read` events, but the backend handler may crash.

### CORS Configuration

The backend uses `cors()` with no options (defaults to `origin: "*"`), and Socket.IO also uses `origin: "*"`. While this works for development, production should restrict origins to the frontend's deployed URL.

### No Broadcast for Online/Offline

The backend's `setUserOnline`/`setUserOffline` functions only update the MongoDB document. They don't emit `user_online`/`user_offline` socket events to other users. The frontend handles this by refreshing presence data through API calls when loading chat lists.

---

## 11. Future Scalability Recommendations

### Short-Term Improvements

1. **Image/File Uploads**: The message model supports `messageType: "image" | "file"` but the frontend currently only handles text. Add file upload with a cloud storage service.

2. **Message Pagination**: The backend limits messages to 50 per chat. Implement infinite scroll with cursor-based pagination.

3. **Group Chats**: The chat model supports `chatType: "group"` but the UI is built for private chats. Extend the sidebar and chat window for group conversations.

4. **Push Notifications**: Add browser push notifications for messages received while the tab is inactive.

5. **Message Search**: Add full-text search across message history.

### Medium-Term Architecture

6. **Optimistic Updates**: Send messages optimistically (show immediately) and reconcile with the server response.

7. **Virtual Scrolling**: For chats with thousands of messages, use a virtual list (e.g., `react-virtuoso`) to maintain performance.

8. **Offline Support**: Queue messages when offline and send when reconnected.

9. **E2E Encryption**: Implement client-side encryption for message content.

10. **Rate Limiting UI**: Show feedback when backend rate limits are hit.

### Production Readiness

11. **Error Boundary**: Wrap the app in a React Error Boundary for graceful crash recovery.

12. **Performance Monitoring**: Add Sentry or similar for error tracking.

13. **Bundle Optimization**: Code-split pages with `React.lazy()` and `Suspense`.

14. **PWA**: Add a service worker for installability and offline caching.

15. **Accessibility**: Add ARIA labels, keyboard navigation, and screen reader support.

---

## 12. Run Commands

### Install Dependencies

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Required Backend Setup

Ensure the backend is running on port 5000 with:
- MongoDB connected
- Redis running
- Environment variables configured

```bash
cd backend
npm run dev
```

### Environment Variables (frontend/.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, SquarePen, LogOut, User } from 'lucide-react';
import { fetchChats, setActiveChat } from '../../features/chats/chatSlice';
import { clearMessages } from '../../features/messages/messageSlice';
import ChatList from './ChatList';
import SearchUsers from './SearchUsers';
import Avatar from '../common/Avatar';
import useAuth from '../../hooks/useAuth';

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { chats, activeChat, loading } = useSelector((state) => state.chats);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    dispatch(clearMessages());
  };

  const handleChatCreated = (chat) => {
    dispatch(setActiveChat(chat));
    dispatch(clearMessages());
    dispatch(fetchChats());
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentUserId = user?.id || user?._id;

  return (
    <div className="flex flex-col h-full bg-dark-900 relative" id="chat-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-dark-800/50">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.profilePicture}
            name={user?.username}
            size="md"
            isOnline={true}
          />
          <div>
            <h1 className="text-base font-bold text-white">ChatterBox</h1>
            <p className="text-xs text-dark-400">{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors cursor-pointer"
            title="Profile"
            id="sidebar-profile-btn"
          >
            <User className="w-5 h-5 text-dark-300" />
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors cursor-pointer"
            title="New Chat"
            id="sidebar-new-chat-btn"
          >
            <SquarePen className="w-5 h-5 text-dark-300" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors cursor-pointer"
            title="Logout"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-5 h-5 text-dark-300" />
          </button>
        </div>
      </div>

      {/* Search bar (filter existing chats) */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800/50 border border-dark-800 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all"
            id="sidebar-search-input"
          />
        </div>
      </div>

      {/* Chat list */}
      <ChatList
        chats={chats}
        loading={loading}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        currentUserId={currentUserId}
      />

      {/* Search users panel (overlay) */}
      {showSearch && (
        <SearchUsers
          onClose={() => setShowSearch(false)}
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  );
};

export default ChatSidebar;

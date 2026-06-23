import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Trash2, MoreVertical } from 'lucide-react';
import { clearActiveChat, removeChat } from '../../features/chats/chatSlice';
import { getOtherParticipant, formatLastSeen } from '../../utils/helpers';
import Avatar from '../common/Avatar';
import TypingIndicator from './TypingIndicator';
import { useState } from 'react';

const ChatHeader = ({ chat, currentUserId }) => {
  const dispatch = useDispatch();
  const typingUsers = useSelector((state) => state.chats.typingUsers);
  const [showMenu, setShowMenu] = useState(false);

  const otherUser = getOtherParticipant(chat?.participants, currentUserId);
  const isTyping = typingUsers[chat?._id];

  if (!otherUser) return null;

  const handleBack = () => {
    dispatch(clearActiveChat());
  };

  const handleDeleteChat = async () => {
    if (window.confirm('Delete this conversation? All messages will be removed.')) {
      dispatch(removeChat(chat._id));
    }
    setShowMenu(false);
  };

  const getStatusText = () => {
    if (isTyping) return null;
    if (otherUser.isOnline) return 'Online';
    if (otherUser.lastSeen) return `Last seen ${formatLastSeen(otherUser.lastSeen)}`;
    return 'Offline';
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800/50 glass-light" id="chat-header">
      <div className="flex items-center gap-3">
        {/* Back button (mobile only) */}
        <button
          onClick={handleBack}
          className="md:hidden p-1.5 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
          id="chat-back-btn"
        >
          <ArrowLeft className="w-5 h-5 text-dark-300" />
        </button>

        <Avatar
          src={otherUser.profilePicture}
          name={otherUser.username}
          size="md"
          isOnline={otherUser.isOnline}
        />

        <div>
          <h2 className="text-sm font-semibold text-white">
            {otherUser.username}
          </h2>
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <p className={`text-xs ${otherUser.isOnline ? 'text-success' : 'text-dark-400'}`}>
              {getStatusText()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
          id="chat-menu-btn"
        >
          <MoreVertical className="w-5 h-5 text-dark-300" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 glass rounded-xl shadow-2xl shadow-black/30 py-1 z-50 animate-slide-up">
              <button
                onClick={handleDeleteChat}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-dark-800/50 transition-colors cursor-pointer"
                id="chat-delete-btn"
              >
                <Trash2 className="w-4 h-4" />
                Delete Chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

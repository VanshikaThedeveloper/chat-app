import Avatar from '../common/Avatar';
import { getOtherParticipant, truncateText, formatChatDate } from '../../utils/helpers';
import { useSelector } from 'react-redux';
import TypingIndicator from './TypingIndicator';

const ChatItem = ({ chat, isActive, onClick, currentUserId }) => {
  const typingUsers = useSelector((state) => state.chats.typingUsers);
  const otherUser = getOtherParticipant(chat.participants, currentUserId);
  const isTyping = typingUsers[chat._id];

  if (!otherUser) return null;

  const lastMessageText = chat.lastMessage?.content
    ? truncateText(chat.lastMessage.content, 35)
    : 'No messages yet';

  const lastMessageTime = chat.lastMessage?.createdAt || chat.updatedAt;

  return (
    <button
      id={`chat-item-${chat._id}`}
      onClick={() => onClick(chat)}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 cursor-pointer text-left ${
        isActive
          ? 'bg-primary-500/10 border-l-2 border-primary-500'
          : 'hover:bg-dark-800/50 border-l-2 border-transparent'
      }`}
    >
      <Avatar
        src={otherUser.profilePicture}
        name={otherUser.username}
        size="lg"
        isOnline={otherUser.isOnline}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white truncate">
            {otherUser.username}
          </h3>
          <span className="text-xs text-dark-400 flex-shrink-0 ml-2">
            {formatChatDate(lastMessageTime)}
          </span>
        </div>

        <div className="mt-0.5">
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <p className="text-xs text-dark-400 truncate">{lastMessageText}</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatItem;

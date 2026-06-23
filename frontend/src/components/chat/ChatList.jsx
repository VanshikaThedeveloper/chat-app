import ChatItem from './ChatItem';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import { MessageSquare } from 'lucide-react';

const ChatList = ({ chats, loading, activeChat, onSelectChat, currentUserId }) => {
  if (loading) {
    return <Loader text="Loading chats..." />;
  }

  if (!chats || chats.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No conversations"
        description="Search for users to start chatting"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" id="chat-list">
      {chats.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isActive={activeChat?._id === chat._id}
          onClick={onSelectChat}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default ChatList;

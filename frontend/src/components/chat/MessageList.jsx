import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { MessageSquare } from 'lucide-react';

const MessageList = ({ messages, loading, currentUserId, onDeleteMessage }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader text="Loading messages..." />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Send a message to start the conversation"
        />
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4"
      id="message-list"
    >
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <span className="px-3 py-1 rounded-full bg-dark-800/80 text-dark-400 text-xs font-medium">
              {date}
            </span>
          </div>

          {msgs.map((message) => {
            const senderId = message.senderId?._id || message.senderId;
            return (
              <MessageBubble
                key={message._id}
                message={message}
                isMine={senderId === currentUserId}
                onDelete={onDeleteMessage}
              />
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

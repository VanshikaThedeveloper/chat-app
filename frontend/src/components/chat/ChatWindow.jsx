import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendNewMessage, removeMessage } from '../../features/messages/messageSlice';
import { updateLastMessage, fetchChats } from '../../features/chats/chatSlice';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';
import toast from 'react-hot-toast';

const ChatWindow = ({ currentUserId }) => {
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chats.activeChat);
  const { messages, loading, sending } = useSelector((state) => state.messages);

  useEffect(() => {
    if (activeChat?._id) {
      dispatch(fetchMessages(activeChat._id));
    }
  }, [activeChat?._id, dispatch]);

  const handleSendMessage = async (content) => {
    if (!activeChat?._id) return;

    try {
      const result = await dispatch(
        sendNewMessage({ chatId: activeChat._id, content })
      ).unwrap();

      // Update last message in sidebar
      dispatch(
        updateLastMessage({
          chatId: activeChat._id,
          message: result,
        })
      );
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(removeMessage(messageId)).unwrap();
      toast.success('Message deleted');
      dispatch(fetchChats());
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (!activeChat) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex flex-col h-full" id="chat-window">
      <ChatHeader chat={activeChat} currentUserId={currentUserId} />

      <MessageList
        messages={messages}
        loading={loading}
        currentUserId={currentUserId}
        onDeleteMessage={handleDeleteMessage}
      />

      <MessageInput
        chatId={activeChat._id}
        onSendMessage={handleSendMessage}
        sending={sending}
      />
    </div>
  );
};

export default ChatWindow;

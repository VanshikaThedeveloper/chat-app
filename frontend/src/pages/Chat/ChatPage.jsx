import ChatLayout from '../../layouts/ChatLayout';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';

const ChatPage = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;

  // Initialize socket connection and wire up all events
  useSocket();

  return (
    <ChatLayout sidebar={<ChatSidebar />}>
      <ChatWindow currentUserId={currentUserId} />
    </ChatLayout>
  );
};

export default ChatPage;

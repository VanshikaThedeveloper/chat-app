import { useSelector } from 'react-redux';

const ChatLayout = ({ sidebar, children }) => {
  const activeChat = useSelector((state) => state.chats.activeChat);

  return (
    <div className="h-screen flex bg-dark-950 overflow-hidden">
      {/* Sidebar — always visible on desktop, hidden on mobile when a chat is open */}
      <div
        className={`
          w-full md:w-[380px] lg:w-[420px] flex-shrink-0
          border-r border-dark-800/50
          ${activeChat ? 'hidden md:flex' : 'flex'}
          flex-col
        `}
      >
        {sidebar}
      </div>

      {/* Main chat area — hidden on mobile when no chat selected */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${activeChat ? 'flex' : 'hidden md:flex'}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;

import { useSelector } from 'react-redux';

const useOnlineStatus = (userId) => {
  const onlineUsers = useSelector((state) => state.chats.onlineUsers);
  return onlineUsers[userId] || false;
};

export default useOnlineStatus;

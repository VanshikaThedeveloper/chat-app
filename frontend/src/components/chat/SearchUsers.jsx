import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Loader2 } from 'lucide-react';
import { searchForUsers, clearSearchResults } from '../../features/users/userSlice';
import { createNewChat } from '../../features/chats/chatSlice';
import Avatar from '../common/Avatar';

const SearchUsers = ({ onClose, onChatCreated }) => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { searchResults, searchLoading } = useSelector((state) => state.users);

  const handleSearch = useCallback(
    (value) => {
      if (value.trim().length >= 2) {
        dispatch(searchForUsers(value.trim()));
      } else {
        dispatch(clearSearchResults());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const handleSelectUser = async (userId) => {
    try {
      const result = await dispatch(createNewChat(userId)).unwrap();
      onChatCreated?.(result);
      onClose?.();
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-dark-900 flex flex-col animate-slide-left" id="search-users-panel">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-dark-800">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-dark-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-dark-300" />
        </button>
        <h2 className="text-lg font-semibold text-white">New Chat</h2>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            id="search-users-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username..."
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-2">
        {searchLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        )}

        {!searchLoading && query.length >= 2 && searchResults.length === 0 && (
          <p className="text-center text-dark-400 text-sm py-8">
            No users found for &quot;{query}&quot;
          </p>
        )}

        {!searchLoading &&
          searchResults.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user._id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark-800/50 transition-colors cursor-pointer text-left"
              id={`search-result-${user._id}`}
            >
              <Avatar
                src={user.profilePicture}
                name={user.username}
                size="md"
                isOnline={user.isOnline}
              />
              <div>
                <p className="text-sm font-medium text-white">{user.username}</p>
                <p className="text-xs text-dark-400">
                  {user.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </button>
          ))}

        {query.length < 2 && !searchLoading && (
          <p className="text-center text-dark-500 text-sm py-8">
            Type at least 2 characters to search
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;

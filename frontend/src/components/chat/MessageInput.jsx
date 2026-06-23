import { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import useTyping from '../../hooks/useTyping';

const MessageInput = ({ chatId, onSendMessage, sending }) => {
  const [content, setContent] = useState('');
  const { startTyping, stopTyping } = useTyping(chatId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    onSendMessage(trimmed);
    setContent('');
    stopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    startTyping();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 px-4 py-3 border-t border-dark-800/50 bg-dark-900/80"
      id="message-input-form"
    >
      <button
        type="button"
        className="p-2.5 rounded-xl hover:bg-dark-800 transition-colors cursor-pointer flex-shrink-0 mb-0.5"
      >
        <Smile className="w-5 h-5 text-dark-400" />
      </button>

      <div className="flex-1 relative">
        <textarea
          id="message-input"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all max-h-32 overflow-y-auto"
          style={{ minHeight: '42px' }}
        />
      </div>

      <button
        type="submit"
        disabled={!content.trim() || sending}
        className="p-2.5 rounded-xl gradient-primary text-white disabled:opacity-30 hover:opacity-90 transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0 mb-0.5 shadow-lg shadow-primary-500/20"
        id="send-message-btn"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MessageInput;

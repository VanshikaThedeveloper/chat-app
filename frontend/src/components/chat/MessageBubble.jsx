import { Check, CheckCheck, Trash2 } from 'lucide-react';
import { formatTime } from '../../utils/helpers';
import { useState } from 'react';
import { MESSAGE_STATUS } from '../../constants';

const MessageBubble = ({ message, isMine, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = () => {
    if (!isMine) return null;

    switch (message.status) {
      case MESSAGE_STATUS.READ:
        return <CheckCheck className="w-3.5 h-3.5 text-primary-400" />;
      case MESSAGE_STATUS.DELIVERED:
        return <CheckCheck className="w-3.5 h-3.5 text-dark-400" />;
      case MESSAGE_STATUS.SENT:
      default:
        return <Check className="w-3.5 h-3.5 text-dark-400" />;
    }
  };

  return (
    <div
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1 group animate-slide-up`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative max-w-[75%] md:max-w-[65%]">
        {/* Delete button */}
        {isMine && showActions && (
          <button
            onClick={() => onDelete(message._id)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-dark-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Delete message"
          >
            <Trash2 className="w-3.5 h-3.5 text-dark-400 hover:text-danger" />
          </button>
        )}

        <div
          className={`px-4 py-2.5 ${
            isMine ? 'message-sent text-white' : 'message-received text-dark-100'
          }`}
        >
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>

          <div
            className={`flex items-center gap-1 mt-1 ${
              isMine ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className={`text-[10px] ${isMine ? 'text-white/60' : 'text-dark-500'}`}>
              {formatTime(message.createdAt)}
            </span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

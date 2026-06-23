import { MessageCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon = MessageCircle, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-dark-400" />
      </div>
      <h3 className="text-lg font-semibold text-dark-200 mb-2">
        {title || 'Nothing here yet'}
      </h3>
      {description && (
        <p className="text-dark-400 text-sm max-w-xs">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;

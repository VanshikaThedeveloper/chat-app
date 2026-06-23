const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-dot"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-dot"
          style={{ animationDelay: '0.2s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-dot"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
      <span className="text-xs text-dark-400 ml-1">typing</span>
    </div>
  );
};

export default TypingIndicator;

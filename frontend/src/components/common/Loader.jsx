const Loader = ({ size = 'md', text = '' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeMap[size]} border-dark-600 border-t-primary-500 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-dark-400 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loader;

import { getInitials } from '../../utils/helpers';

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const Avatar = ({ src, name, size = 'md', isOnline, className = '' }) => {
  const initials = getInitials(name);

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-dark-700`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full gradient-primary flex items-center justify-center font-semibold text-white ring-2 ring-dark-700`}
        >
          {initials}
        </div>
      )}

      {/* Online indicator */}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-dark-900 ${
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'
          } ${isOnline ? 'bg-success' : 'bg-dark-500'}`}
        />
      )}
    </div>
  );
};

export default Avatar;

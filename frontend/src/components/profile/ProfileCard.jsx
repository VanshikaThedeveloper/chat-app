import Avatar from '../common/Avatar';
import { formatLastSeen } from '../../utils/helpers';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex flex-col items-center text-center py-6 animate-fade-in">
      <Avatar
        src={user.profilePicture}
        name={user.username}
        size="xl"
        isOnline={user.isOnline}
      />

      <h2 className="text-xl font-bold text-white mt-4">{user.username}</h2>
      <p className="text-dark-400 text-sm mt-1">{user.email}</p>

      {user.bio && (
        <p className="text-dark-300 text-sm mt-3 max-w-xs leading-relaxed italic">
          &ldquo;{user.bio}&rdquo;
        </p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <span
          className={`w-2 h-2 rounded-full ${
            user.isOnline ? 'bg-success' : 'bg-dark-500'
          }`}
        />
        <span className="text-xs text-dark-400">
          {user.isOnline
            ? 'Online now'
            : `Last seen ${formatLastSeen(user.lastSeen)}`}
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;

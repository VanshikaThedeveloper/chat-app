import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { fetchProfile, updateUserProfile } from '../../features/users/userSlice';
import { setUser } from '../../features/auth/authSlice';
import ProfileCard from '../../components/profile/ProfileCard';
import EditProfileForm from '../../components/profile/EditProfileForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.users);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdate = async (data) => {
    setUpdating(true);
    try {
      const result = await dispatch(updateUserProfile(data)).unwrap();
      // Sync updated profile data to auth state
      dispatch(setUser({
        ...result,
        id: result._id,
      }));
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors cursor-pointer"
            id="profile-back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-dark-300" />
          </button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>

        <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/20">
          {loading ? (
            <Loader text="Loading profile..." />
          ) : (
            <>
              <ProfileCard user={profile} />

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-medium text-sm transition-colors cursor-pointer"
                  id="edit-profile-btn"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <EditProfileForm
                    user={profile}
                    onSubmit={handleUpdate}
                    loading={updating}
                  />
                  <button
                    onClick={() => setEditing(false)}
                    className="w-full mt-3 py-2.5 rounded-xl bg-dark-800/50 hover:bg-dark-800 text-dark-300 font-medium text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

const EditProfileForm = ({ user, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6 animate-slide-up" id="edit-profile-form">
      <div>
        <label htmlFor="edit-username" className="block text-sm font-medium text-dark-300 mb-1.5">
          Username
        </label>
        <input
          id="edit-username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          minLength={3}
          maxLength={30}
          required
          className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
        />
      </div>

      <div>
        <label htmlFor="edit-bio" className="block text-sm font-medium text-dark-300 mb-1.5">
          Bio
        </label>
        <textarea
          id="edit-bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm resize-none"
        />
      </div>

      <div>
        <label htmlFor="edit-picture" className="block text-sm font-medium text-dark-300 mb-1.5">
          Profile Picture URL
        </label>
        <input
          id="edit-picture"
          name="profilePicture"
          type="url"
          value={formData.profilePicture}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
          className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
};

export default EditProfileForm;

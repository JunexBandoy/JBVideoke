import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth); // 🔑 This signs out the Firebase user
      console.log('User signed out');
      navigate('/'); // Redirect to login or home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold shadow hover:bg-red-700 transition"
    >
      🔓 Logout
    </button>
  );
};

export default LogoutButton;

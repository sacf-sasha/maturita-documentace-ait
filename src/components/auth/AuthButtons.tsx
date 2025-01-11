import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthButtons = () => {
  const { user, signOut, loading } = useAuth();

  console.log('AuthButtons render:', { user, loading });

  if (loading) {
    return (
      <div className="flex gap-4 items-center">
        <span className="text-gray-300">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex gap-4 items-center">
        <span className="text-gray-300">{user.email}</span>
        <button
          onClick={signOut}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <Link
        to="/login"
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButtons;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { Home, Calendar, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAdmin } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          EventEase
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <Home className="w-5 h-5 mr-1" /> Events
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Calendar className="w-5 h-5 mr-1" /> My Bookings
              </Link>
              {isAdmin && (
                <Link to="/admin" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Shield className="w-5 h-5 mr-1" /> Admin
                </Link>
              )}
              <button onClick={onLogout} className="flex items-center text-red-500 hover:text-red-700 transition-colors font-semibold">
                <LogOut className="w-5 h-5 mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <LogIn className="w-5 h-5 mr-1" /> Login
              </Link>
              <Link to="/register" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                <UserPlus className="w-5 h-5 mr-1" /> Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

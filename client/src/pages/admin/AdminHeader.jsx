import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from 'lucide-react';

const AdminHeader = ({ onToggleSidebar, isLargeScreen }) => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');

  const handlePasswordChange = () => {
    alert(`Password changed to: ${newPassword}`);
    setNewPassword('');
    setShowProfileModal(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center">
          {/* {!isLargeScreen && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          )} */}
          <div className="ml-4">
            <span className="text-lg font-semibold text-gray-900">Attendance Portal</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                id="user-menu-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                  <span className="text-sm">{currentUser?.name?.charAt(0) || 'A'}</span>
                </div>
              </button>
            </div>

            {showDropdown && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className="text-gray-500">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex={-1}
                >
                  Your Profile
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex={-1}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p className="mb-2"><strong>Name:</strong> {currentUser?.name}</p>
            <p className="mb-4"><strong>Email:</strong> {currentUser?.email}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;

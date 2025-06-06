import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TeacherSettings.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name?.name || '',
    email?.email || '',
    password: '',
    confirmPassword: '',
    notifications,
  });
  
  const handleChange = (e.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name] === 'checkbox' ? checked ,
    }));
  };
  
  const handleSubmit = (e.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    alert('Settings updated successfully (demo only)');
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="card bg-white shadow-sm rounded-lg overflow-hidden p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md-cols-2">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input bg-gray-100"
                  value={formData.email}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed (contact admin for email changes)
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <div className="grid grid-cols-1 gap-6 md-cols-2">
                <div>
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to keep your current password
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notifications"
                      name="notifications"
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                      checked={formData.notifications}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications for attendance updates and new class assignments
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherSettings;
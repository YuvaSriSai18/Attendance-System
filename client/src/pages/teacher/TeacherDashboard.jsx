import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as API from '../../api/index';
import QR_Generator from '../QrCodeGenerator';
import TeacherSidebar from './TeacherSidebar';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [activeClassId, setActiveClassId] = useState(null);
  const [activeClassName, setActiveClassName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await API.getUpcomingClasses();
        setClasses(data.classrooms || []);
      } catch (err) {
        console.error('Failed to fetch upcoming classes:', err);
      }
    };
    if (currentUser?.name) fetchClasses();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="flex">
      <TeacherSidebar />

      <div className="flex-1 lg:ml-64 min-h-screen bg-gray-100">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold px-4 py-2 rounded"
            style={{ backgroundColor: '#404020', color: 'white' }}
          >
            Logout
          </button>
        </header>

        <main className="p-6 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Classes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b">Venue</th>
                    <th className="px-4 py-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls._id}>
                      <td className="px-4 py-2 border-b">{cls.classroomName}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => {
                            setActiveClassId(cls._id);
                            setActiveClassName(cls.classroomName);
                            setShowQR(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Open QR Panel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showQR && activeClassId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-4xl relative flex flex-col md:flex-row items-center gap-6">
                <button
                  onClick={() => setShowQR(false)}
                  className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                >
                  &times;
                </button>

                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Classroom</h3>
                    <p className="text-lg text-gray-800">{activeClassName}</p>
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <div className="border border-gray-300 p-4 rounded">
                    <QR_Generator classroomId={activeClassId} size={256} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;

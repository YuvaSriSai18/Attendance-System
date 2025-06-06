import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as API from '../../api/index';
import QR_Generator from '../QrCodeGenerator';
import TeacherSidebar from './TeacherSidebar';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [uniqueStudentsCount, setUniqueStudentsCount] = useState(0);
  const [activeClassId, setActiveClassId] = useState(null);
  const [activeClassName, setActiveClassName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await API.getUpcomingClasses();
        const venueData = await API.getVenues();

        setClasses(classData.classrooms || []);
        setVenues(venueData.classrooms || []);

        const allRollNumbers = new Set();
        const uniqueStudentsList = [];

        (venueData.classrooms || []).forEach((venue) => {
          if (venue.studentRolls) {
            venue.studentRolls.forEach((roll) => {
              allRollNumbers.add(roll.rollNumber);
              uniqueStudentsList.push(roll);
            });
          }
        });

        setStudents(uniqueStudentsList);
        setUniqueStudentsCount(uniqueStudentsList.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    if (currentUser?.name) fetchData();
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
            className="relative overflow-hidden text-white text-sm font-semibold px-4 py-2 rounded bg-[#404020] group"
          >
            <span className="relative z-10">Logout</span>
            <span
              className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
              style={{ mixBlendMode: 'screen' }}
            ></span>
          </button>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-lg transition ">
              <h3 className="text-sm font-medium text-gray-500 ">Total Venues</h3>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>

            <div
              // onClick={() => setShowStudentModal(true)}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 hover:shadow-lg transition"
            >
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <p className="text-2xl font-bold">{uniqueStudentsCount}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {classes.map((cls) => (
                <div
                  key={cls._id}
                  className="relative group w-full h-48 rounded-xl shadow-lg flex items-center justify-center transition-transform transform hover:scale-105 overflow-hidden" style={{ background: 'linear-gradient(to bottom, white, #fafac0)' }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center transition duration-500 group-hover:opacity-0">
                    <p className="text-xl mt-2 font-semibold text-gray-800">{cls.classroomName}</p>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-white transition duration-500 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setActiveClassId(cls._id);
                        setActiveClassName(cls.classroomName);
                        setShowQR(true);
                      }}
                      className="bg-[#404020] hover:bg-[#33331a] text-white px-4 py-2 rounded font-medium"
                    >
                      Generate QR
                    </button>
                  </div>
                </div>
              ))}
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
                <div className="w-full md:w-1/2 text-center">
                  <h3 className="text-xl font-bold mb-2">Classroom</h3>
                  <p className="text-lg text-gray-800">{activeClassName}</p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <div className="border border-gray-300 p-4 rounded">
                    <QR_Generator classroomId={activeClassId} size={256} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showStudentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-5xl relative overflow-y-auto max-h-[80vh]">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                >
                  &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Student List</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border border-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 border-b">Roll Number</th>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 border-b">{student.rollNumber}</td>
                          <td className="px-4 py-2 border-b">{student.name}</td>
                          <td className="px-4 py-2 border-b">{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import VenueManagement from './VenueManagement';
import ClassManagement from './ClassManagement';
import StudentManagement from './StudentManagement';
import AttendanceReports from './AttendanceReports';
import { getVenues, getRecentAttendance, getAllAttendees } from '../../api';

const StatCard = ({ title, value, borderColor, onClick }) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    className={`bg-white rounded-lg p-4 border-l-4 ${borderColor} duration-400 hover:shadow-lg transition cursor-pointer`}
  >
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const RecentClassRow = ({ venue, date, attendance, color, onClick }) => (
  <tr
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    className="hover:bg-gray-100 transition duration-400 cursor-pointer"
  >
    <td className="py-2 px-4">{venue}</td>
    <td className="py-2 px-4">{date}</td>
    <td className="py-2 px-4">
      <span className={`${color} font-semibold`}>{attendance}</span>
    </td>
  </tr>
);

const AdminOverview = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [recentClasses, setRecentClasses] = useState([]);
  const [uniqueStudentsCount, setUniqueStudentsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const venueData = await getVenues();
        const recentData = await getRecentAttendance();

        setVenues(venueData.classrooms || []);
        setRecentClasses(recentData.classes?.slice(0, 5) || []);

        const allRollNumbers = new Set();

        (venueData.classrooms || []).forEach((venue) => {
          if (venue.studentRolls) {
            venue.studentRolls.forEach((roll) => allRollNumbers.add(roll));
          }
        });

        setUniqueStudentsCount(allRollNumbers.size);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <StatCard
          title="Total Venues"
          value={venues.length}
          borderColor="border-primary"
          onClick={() => navigate('/admin/venues')}
        />
        <StatCard
          title="Total Students"
          value={uniqueStudentsCount}
          borderColor="border-secondary"
          onClick={() => navigate('/admin/students')}
        />
      </div>

      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Classes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4">Venue</th>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {recentClasses.map((cls, i) => (
                <RecentClassRow
                  key={cls._id || i}
                  venue={cls.classroomName || 'N/A'}
                  date={cls.date || 'N/A'}
                  attendance={`${cls.attendanceCount || 0} Students`}
                  color="text-green-600"
                  onClick={() => navigate('/admin/reports')}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/venues" element={<VenueManagement />} />
              <Route path="/classes" element={<ClassManagement />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/reports" element={<AttendanceReports />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

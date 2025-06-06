import React, { useState } from 'react';
import { Filter, Calendar, Search, Download } from 'lucide-react';



const initialRecords = [
  {
    id: '1',
    className: 'Computer Science 101',
    date: '2025-05-19',
    time: '10',
    presentCount,
    totalCount,
    percentage,
  },
  {
    id: '2',
    className: 'Database Systems',
    date: '2025-05-19',
    time: '13',
    presentCount,
    totalCount,
    percentage,
  },
  {
    id: '3',
    className: 'Web Development',
    date: '2025-05-18',
    time: '15',
    presentCount,
    totalCount,
    percentage,
  },
  {
    id: '4',
    className: 'Computer Science 101',
    date: '2025-05-12',
    time: '10',
    presentCount,
    totalCount,
    percentage,
  },
  {
    id: '5',
    className: 'Database Systems',
    date: '2025-05-12',
    time: '13',
    presentCount,
    totalCount,
    percentage,
  },
];

const TeacherAttendance.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || record.date === dateFilter;
    return matchesSearch && matchesDate;
  });
  
  const handleViewDetails = (id) => {
    alert(`In a real application, this would show detailed attendance for session ${id}`);
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
      </div>
      
      <div className="flex flex-col md-row items-start md-center space-y-3 md-y-0 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus-none focus-primary focus-primary sm-sm"
            placeholder="Search by class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 ml-auto">
          <button
            className="btn flex items-center bg-white border border-gray-300 text-gray-700 hover-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1" />
            Filters
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 slide-in">
          <div className="grid grid-cols-1 md-cols-3 gap-4">
            <div>
              <label htmlFor="dateFilter" className="form-label">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dateFilter"
                  className="form-input pl-10"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button 
                className="btn btn-secondary"
                onClick={() => setDateFilter('')}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="card bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Date</th>
                <th>Time</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="font-medium">{record.className}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.time}</td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            record.percentage >= 90 ? 'bg-green-500' .percentage >= 75 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${record.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {record.presentCount}/{record.totalCount} ({record.percentage}%)
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(record.id)}
                      className="text-primary hover-primary-dark flex items-center text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No attendance records found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
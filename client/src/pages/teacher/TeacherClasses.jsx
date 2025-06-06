import React from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';



const classes = [
  {
    id: '1',
    name: 'Computer Science 101',
    venue: 'Room A101',
    date: '2025-05-20',
    time: '10',
    duration: '1.5',
    studentCount,
  },
  {
    id: '2',
    name: 'Database Systems',
    venue: 'Lab B205',
    date: '2025-05-20',
    time: '13',
    duration: '2',
    studentCount,
  },
  {
    id: '3',
    name: 'Web Development',
    venue: 'Room C302',
    date: '2025-05-21',
    time: '15',
    duration: '2',
    studentCount,
  },
];

const TeacherClasses.FC = () => {
  const handleGenerateQrCode = (classId) => {
    // In a real application, this would navigate to QR code generation page
    window.location.href = `/qr-code/${classId}`;
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
      </div>
      
      <div className="grid grid-cols-1 md-cols-2 lg-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="card bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{cls.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span>{cls.venue}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>{new Date(cls.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>{cls.time} ({cls.duration} hours)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2 text-gray-400" />
                  <span>{cls.studentCount} Students</span>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleGenerateQrCode(cls.id)}
                  className="btn btn-primary text-sm"
                >
                  Generate QR Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherClasses;
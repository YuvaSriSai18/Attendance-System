import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Calendar, Clock, Users, MapPin } from 'lucide-react';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    teacher: 'Teacher User',
    date: '',
    time: '',
    duration: '',
  });

  // Fetch all sessions from backend on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/api/sessions');
      setClasses(res.data);
    } catch (err) {
      console.error('Failed to fetch classes', err);
    }
  };

  const handleOpenModal = (classSession) => {
    if (classSession) {
      setCurrentClass(classSession);
      setFormData({
        name: classSession.name,
        venue: classSession.venue,
        teacher: classSession.teacher,
        date: classSession.date,
        time: classSession.time,
        duration: classSession.duration,
      });
    } else {
      setCurrentClass(null);
      setFormData({
        name: '',
        venue: '',
        teacher: 'Teacher User',
        date: '',
        time: '',
        duration: '',
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentClass) {
        // update existing session
        const res = await axios.put(`/api/sessions/${currentClass._id}`, formData);
        setClasses((prev) =>
          prev.map((cls) => (cls._id === currentClass._id ? res.data : cls))
        );
      } else {
        // create new session
        const res = await axios.post('/api/sessions', formData);
        setClasses((prev) => [...prev, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving class:', err);
      alert('Failed to save class.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/api/sessions/${id}`);
        setClasses((prev) => prev.filter((cls) => cls._id !== id));
      } catch (err) {
        console.error('Failed to delete class:', err);
        alert('Failed to delete class.');
      }
    }
  };

  const handleGenerateQrCode = (classId) => {
    window.location.href = `/qr-code/${classId}`;
  };

  return (
    <div className="fade-in p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {classes.map((cls) => (
          <div key={cls._id} className="card bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{cls.name}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span>{cls.venue}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>
                    {new Date(cls.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>
                    {cls.time} ({cls.duration} hours)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2 text-gray-400" />
                  <span>{cls.studentCount || 0} Students</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(cls)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleGenerateQrCode(cls._id)}
                  className="btn btn-secondary text-xs py-1"
                >
                  Generate QR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{currentClass ? 'Edit Class' : 'Add Class'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Class Name"
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <input
                type="text"
                name="teacher"
                placeholder="Teacher"
                value={formData.teacher}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <input
                type="number"
                name="duration"
                step="0.5"
                min="0"
                placeholder="Duration (in hours)"
                value={formData.duration}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentClass ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;

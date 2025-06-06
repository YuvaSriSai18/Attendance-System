import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as API from '../../api/index';

const VenueManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showRollsModal, setShowRollsModal] = useState(false);
  const [selectedRolls, setSelectedRolls] = useState([]);
  const [selectedClassroomName, setSelectedClassroomName] = useState('');
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [formData, setFormData] = useState({
    classroomName: '',
    studentRollsText: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await API.getVenues();
      const payload = response;
      if (payload && Array.isArray(payload.classrooms)) {
        setClassrooms(payload.classrooms);
      } else {
        console.warn("No classrooms array found in payload:", payload);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const handleOpenFormModal = (classroom = null) => {
    if (classroom) {
      setCurrentClassroom(classroom);
      setFormData({
        classroomName: classroom.classroomName || '',
        studentRollsText: Array.isArray(classroom.studentRolls)
          ? classroom.studentRolls.join('\n')
          : '',
      });
    } else {
      setCurrentClassroom(null);
      setFormData({
        classroomName: '',
        studentRollsText: '',
      });
    }
    setShowFormModal(true);
  };

  const handleShowRollsModal = (classroom) => {
    setSelectedRolls(classroom.studentRolls || []);
    setSelectedClassroomName(classroom.classroomName);
    setSearchTerm('');
    setShowRollsModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentRollsArray = formData.studentRollsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r !== '');
    const classroomData = {
      classroomName: formData.classroomName,
      studentRolls: studentRollsArray,
    };

    try {
      if (currentClassroom) {
        await API.updateVenue(currentClassroom._id, classroomData);
      } else {
        await API.createClassroom(classroomData);
      }
      setShowFormModal(false);
      fetchClassrooms();
    } catch (error) {
      console.error('Failed to save classroom', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this classroom?')) return;
    try {
      await API.deleteVenue(id);
      setClassrooms((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (error) {
      console.error('Failed to delete classroom', error);
    }
  };

  return (
    <div className="fade-in p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Classroom Management</h1>
        <button onClick={() => handleOpenFormModal()} className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          Add Classroom
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-600">Loading classrooms...</div>
        ) : classrooms.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-600">No classrooms available.</div>
        ) : (
          classrooms.map((cls) => (
            <div
              key={cls._id}
              className="relative group w-full h-48 rounded-xl shadow-lg flex items-center justify-center transition-transform transform hover:scale-105 overflow-hidden"
              style={{ background: 'linear-gradient(to bottom, white, #fafac0)' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center transition duration-500 group-hover:opacity-0">
                <p className="text-xl mt-2 font-semibold text-gray-800">{cls.classroomName}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white transition duration-500 opacity-0 group-hover:opacity-100 space-x-4">
                <button
                  onClick={() => handleShowRollsModal(cls)}
                  className="bg-[#404020] hover:bg-[#33331a] text-white px-3 py-1 rounded text-sm"
                >
                  View Rolls
                </button>
                <button
                  onClick={() => handleOpenFormModal(cls)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls._id || cls.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 slide-in">
            <h2 className="text-xl font-bold mb-4">
              {currentClassroom ? 'Edit Classroom' : 'Add Classroom'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="classroomName" className="form-label">
                    Classroom Name
                  </label>
                  <input
                    type="text"
                    id="classroomName"
                    name="classroomName"
                    className="form-input"
                    value={formData.classroomName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="studentRollsText" className="form-label">
                    Paste Student Roll Numbers (one per line)
                  </label>
                  <textarea
                    id="studentRollsText"
                    name="studentRollsText"
                    className="form-textarea resize-y pr-12"
                    rows={6}
                    value={formData.studentRollsText}
                    onChange={handleChange}
                    placeholder="Enter one roll number per line"
                  />
                  <div className="absolute bottom-2 right-3 text-sm text-gray-500 select-none">
                    {formData.studentRollsText
                      .split('\n')
                      .filter((r) => r.trim() !== '').length}{' '}
                    roll numbers
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentClassroom ? 'Update' : 'Add'} Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRollsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 slide-in">
            <h2 className="text-xl font-bold mb-4">Students in {selectedClassroomName}</h2>

            <input
              type="text"
              placeholder="Search"
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul className="max-h-60 overflow-y-auto text-sm text-gray-800 list-disc pl-5 space-y-1">
              {selectedRolls
                .filter((roll) => roll.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((roll, index) => (
                  <li key={index}>{roll}</li>
              ))}
            </ul>

            <div className="mt-6 text-right">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowRollsModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManagement;

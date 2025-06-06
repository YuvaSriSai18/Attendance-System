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
    <div className="fade-in p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Classroom Management</h1>
        <button onClick={() => handleOpenFormModal()} className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          Add Classroom
        </button>
      </div>

      <div className="card bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Classroom Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-600">Loading classrooms...</td>
                </tr>
              ) : classrooms.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-600">No classrooms available.</td>
                </tr>
              ) : (
                classrooms.map((classroom) => (
                  <tr key={classroom._id || classroom.id} className="hover:bg-gray-50">
                    <td>
                      <button
                        onClick={() => handleShowRollsModal(classroom)}
                        className="text-blue-600 hover:underline"
                      >
                        {classroom.classroomName}
                      </button>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenFormModal(classroom)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(classroom._id || classroom.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

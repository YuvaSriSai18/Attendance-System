import React, { useState, useEffect } from 'react';
import { Upload, Download, UserPlus, RefreshCw, Trash2, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttendance, setFilterAttendance] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    attendance: '',
    venue: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchVenues();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await axios.get('/api/classrooms');
      setVenues(res.data);
    } catch (err) {
      console.error('Failed to fetch venues', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('/api/students/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(true);
      setSelectedFile(null);
      fetchStudents();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed', error);
    }
    setIsUploading(false);
  };

  const handleDownloadTemplate = () => {
    const wsData = [['Roll Number', 'Venue Name']];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Student_Template.xlsx');
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get('/api/students/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      saveAs(blob, 'Students_Export.xlsx');
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterAttendance ? student.attendance >= Number(filterAttendance) : true)
  );

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <div className="flex space-x-2">
          <button className="btn btn-secondary flex items-center" onClick={handleDownloadTemplate}>
            <Download size={16} className="mr-1" />
            Template
          </button>
          <button className="btn btn-accent flex items-center" onClick={handleExportData}>
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="card bg-white p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Import Student Data</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="flex items-center justify-center w-full h-10 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400">
              <span className="flex items-center space-x-2">
                <Upload size={16} />
                <span className="font-medium text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Choose XLSX file'}
                </span>
              </span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </label>
            {uploadSuccess && (
              <p className="text-sm text-green-600 mt-1">File uploaded and processed successfully!</p>
            )}
          </div>
          <button
            className="btn btn-primary flex items-center"
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-1" />
                Upload & Import
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500"
            placeholder="Search roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Min Attendance %"
            value={filterAttendance}
            onChange={(e) => setFilterAttendance(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-40"
          />
          <button className="btn btn-primary flex items-center" onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus size={16} className="mr-1" />
            {showAddForm ? 'Cancel' : 'Add Student'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card bg-gray-50 p-4 mb-6 rounded shadow">
          <h3 className="font-semibold mb-2">New Student</h3>
          <input
            type="text"
            placeholder="Roll Number"
            value={newStudent.rollNumber}
            onChange={e => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Attendance %"
            value={newStudent.attendance}
            onChange={e => setNewStudent({ ...newStudent, attendance: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
          <select
            className="border p-2 rounded mb-2 w-full"
            value={newStudent.venue}
            onChange={e => setNewStudent({ ...newStudent, venue: e.target.value })}
          >
            <option value="">Select Classroom</option>
            {venues.map(venue => (
              <option key={venue._id} value={venue.name}>
                {venue.name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-success"
            onClick={async () => {
              try {
                await axios.post('/api/students', newStudent);
                setShowAddForm(false);
                fetchStudents();
                setNewStudent({ rollNumber: '', attendance: '', venue: '' });
              } catch (err) {
                console.error('Failed to add student', err);
              }
            }}
          >
            Save
          </button>
        </div>
      )}

      <div className="card bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Attendance</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td className="font-medium">{student.rollNumber}</td>
                  <td>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${student.attendance < 80
                          ? 'bg-red-500'
                          : student.attendance < 85
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                          }`}
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{student.attendance}%</p>
                  </td>
                  <td>{student.venue || '-'}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button onClick={fetchStudents} className="p-1 text-blue-600 hover:text-blue-800">
                        <RefreshCw size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No students found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;

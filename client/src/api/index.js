import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rbnfh5ks-5200.inc1.devtunnels.ms',
  // baseURL: 'http://localhost:5200',
  headers: {
    'Content-Type': 'application/json',
  },
});

// CLASSROOM APIs
export const getVenues = async () => {
  const res = await api.get('/classroom');
  return res.data;
};

export const createClassroom = async (classroomData) => {
  const res = await api.post('/classroom', classroomData);
  return res.data;
};

export const updateVenue = async (id, classroomData) => {
  const res = await api.put(`/classroom/${id}`, classroomData);
  return res.data;
};

export const deleteVenue = async (id) => {
  const res = await api.delete(`/classroom/${id}`);
  return res.data;
};

// RECENT ATTENDANCE API
export const getRecentAttendance = async () => {
  const res = await api.get('/attendance/recent');
  return res.data;
};

export const getUpcomingClasses = async () => {
  const res = await api.get('/classroom');
  return res.data;
};


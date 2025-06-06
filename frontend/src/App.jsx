import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QrCodeGenerator from './pages/QrCodeGenerator';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root-gradient">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Teacher Routes */}
            <Route 
              path="/teacher/*" 
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Shared Routes */}
            <Route 
              path="/qr-code/" 
              element={
                <ProtectedRoute allowedRole="any">
                  <QrCodeGenerator />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

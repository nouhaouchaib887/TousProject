import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectTablePage from './pages/projects/ProjectTablePage';
import MapModulePage from './pages/projects/MapModulePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from './components/ui/sonner';
import CalendarPage from './pages/projects/CalendarPage';
export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/login" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <ProjectTablePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/projects/map" 
            element={
              <ProtectedRoute>
                <MapModulePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/calendar" 
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
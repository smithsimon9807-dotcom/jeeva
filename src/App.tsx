import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { TaskManagement } from './pages/TaskManagement';
import { AdminResponses } from './pages/AdminResponses';
import { AdminFeedback } from './pages/AdminFeedback';
import { AdminAnalysis } from './pages/AdminAnalysis';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { EmployeeTasks } from './pages/EmployeeTasks';
import { EmployeeResponses } from './pages/EmployeeResponses';
import { EmployeeFeedback } from './pages/EmployeeFeedback';

const Layout = ({ role }: { role: 'Admin' | 'Employee' }) => {
  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <Sidebar role={role} />
      <main className="ml-[230px] p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'Admin' | 'Employee' }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute role="Admin">
            <Layout role="Admin" />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeeManagement />} />
          <Route path="/admin/tasks" element={<TaskManagement />} />
          <Route path="/admin/responses" element={<AdminResponses />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/analysis" element={<AdminAnalysis />} />
        </Route>

        {/* Employee Routes */}
        <Route element={
          <ProtectedRoute role="Employee">
            <Layout role="Employee" />
          </ProtectedRoute>
        }>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/tasks" element={<EmployeeTasks />} />
          <Route path="/employee/responses" element={<EmployeeResponses />} />
          <Route path="/employee/feedback" element={<EmployeeFeedback />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

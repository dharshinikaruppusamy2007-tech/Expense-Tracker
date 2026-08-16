import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Reminders from './pages/Reminders';
import Budgets from './pages/Budgets';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (isLoading) return null;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AppLayout = ({ children }) => (
    <div className="min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-10">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><AppLayout><Expenses /></AppLayout></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><AppLayout><Goals /></AppLayout></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><AppLayout><Reminders /></AppLayout></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><AppLayout><Budgets /></AppLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

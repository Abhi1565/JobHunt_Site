import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import JobDescription from './components/JobDescription'
import Profile from './components/Profile'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import Applicants from './components/admin/Applicants'
import AppliedJobTable from './components/AppliedJobTable'
import UpdateProfileDialog from './components/UpdateProfileDialog'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { Toaster } from 'sonner'
import { checkAuthStatus } from './utils/axios'

function App() {
  // Initialize authentication on app startup
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const isAuthenticated = await checkAuthStatus();
          if (!isAuthenticated) {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
    };
    
    initializeAuth();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/description/:id" element={<JobDescription />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute role="recruiter"><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/jobs/create" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute role="recruiter"><Companies /></ProtectedRoute>} />
          <Route path="/admin/companies/create" element={<ProtectedRoute role="recruiter"><CompanyCreate /></ProtectedRoute>} />
          <Route path="/admin/companies/:id" element={<ProtectedRoute role="recruiter"><CompanySetup /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>} />
          <Route path="/applied-jobs" element={<ProtectedRoute><AppliedJobTable /></ProtectedRoute>} />
          <Route path="/update-profile" element={<UpdateProfileDialog />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  )
}

export default App

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/Jobs'
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
import { Toaster } from 'sonner'
import { checkAuthStatus } from './utils/axios'
import { setUser } from './redux/authSlice'

function App() {
  // Initialize authentication on app startup
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const isAuthenticated = await checkAuthStatus();
          if (isAuthenticated) {
            // If token exists and is valid, we can restore the user state
            // You might want to fetch user details here if needed
            console.log('Token found and valid, restoring auth state');
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            console.log('Invalid token, cleared from storage');
          }
        } catch (error) {
          console.log('Auth initialization error:', error);
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
          <Route path="/job/:id" element={<JobDescription />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<PostJob />} />
          <Route path="/admin/companies" element={<Companies />} />
          <Route path="/admin/companies/create" element={<CompanyCreate />} />
          <Route path="/admin/companies/setup" element={<CompanySetup />} />
          <Route path="/admin/applicants" element={<Applicants />} />
          <Route path="/applied-jobs" element={<AppliedJobTable />} />
          <Route path="/update-profile" element={<UpdateProfileDialog />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  )
}

export default App

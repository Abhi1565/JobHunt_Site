import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import api, { checkAuthStatus, checkAuthAlternative } from '@/utils/axios'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const [authStatus, setAuthStatus] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        // First test if backend is accessible
        console.log('Testing backend connectivity...');
        const testResponse = await api.get('/');
        console.log('Backend test response:', testResponse.data);
        
        // Then check authentication with both methods
        const isAuth = await checkAuthStatus();
        const isAuthAlt = await checkAuthAlternative();
        console.log('Auth status check (primary):', isAuth);
        console.log('Auth status check (alternative):', isAuthAlt);
        setAuthStatus(isAuth || isAuthAlt);
      } catch (error) {
        console.log('Error during auth check:', error);
        setAuthStatus(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        {/* Debug info */}
        <div className='mb-4 p-4 bg-gray-100 rounded'>
          <h3 className='font-bold'>Debug Info:</h3>
          <p>User: {user ? `${user.fullname} (${user.role})` : 'Not logged in'}</p>
          <p>Auth Status: {authStatus === null ? 'Checking...' : authStatus ? 'Authenticated' : 'Not authenticated'}</p>
          <Button 
            onClick={async () => {
              console.log('Manual auth test...');
              const isAuth = await checkAuthStatus();
              const isAuthAlt = await checkAuthAlternative();
              console.log('Manual auth results:', { isAuth, isAuthAlt });
              setAuthStatus(isAuth || isAuthAlt);
            }}
            className="mt-2"
          >
            Test Auth Again
          </Button>
        </div>
        
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs
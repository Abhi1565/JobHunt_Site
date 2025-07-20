import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatus } from '@/utils/axios'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            if (!user || user.role !== 'recruiter') {
                console.log('User not found or not a recruiter:', user);
                return;
            }
            
            // First check if user is still authenticated
            const isAuthenticated = await checkAuthStatus();
            if (!isAuthenticated) {
                console.log('User not authenticated, redirecting to login');
                // You can add redirect logic here
                return;
            }
            
            try {
                console.log('Fetching admin jobs for user:', user._id);
                const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`);
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                    console.log('Admin jobs fetched successfully:', res.data.jobs.length);
                }
            } catch (error) {
                console.log('Error fetching admin jobs:', error.response?.data || error.message);
            }
        }
        fetchAllAdminJobs();
    },[user, dispatch])
}

export default useGetAllAdminJobs
import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const hasFetched = useRef(false);
    
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            // Prevent duplicate API calls
            if (hasFetched.current) return;
            
            // Check if user is authenticated and is a recruiter before making the API call
            if (!user || user.role !== 'recruiter') {
                console.log("User not authenticated or not a recruiter, skipping admin jobs fetch");
                return;
            }
            
            hasFetched.current = true;
            
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log("Error fetching admin jobs:", error);
                // Reset the flag on error so it can retry later
                hasFetched.current = false;
            }
        }
        
        // Only fetch if user is authenticated and is a recruiter
        if (user && user.role === 'recruiter') {
            fetchAllAdminJobs();
        }
        
        // Cleanup function to reset ref when component unmounts
        return () => {
            hasFetched.current = false;
        };
    },[user, dispatch]) // Add user and dispatch to dependency array
}

export default useGetAllAdminJobs
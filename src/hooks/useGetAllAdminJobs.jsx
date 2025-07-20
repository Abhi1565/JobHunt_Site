import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            if (!user || user.role !== 'recruiter') {
                return;
            }
            
            try {
                const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`);
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                // Handle error silently
            }
        }
        fetchAllAdminJobs();
    },[user, dispatch])
}

export default useGetAllAdminJobs
import { setSingleCompany } from '@/redux/companySlice'
import { setAllJobs } from '@/redux/jobSlice'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import api from "./../utils/axios";
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const lastCompanyId = useRef('');
    
    useEffect(()=>{
        const fetchSingleCompany = async () => {
            // Prevent duplicate API calls for the same company
            if (lastCompanyId.current === companyId) return;
            lastCompanyId.current = companyId;
            
            try {
                const res = await api.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleCompany();
        
        // Cleanup function to reset ref when component unmounts
        return () => {
            lastCompanyId.current = '';
        };
    },[companyId]) // Remove dispatch from dependency array
}

export default useGetCompanyById
import { setCompanies} from '@/redux/companySlice'
import { COMPANY_API_END_POINT} from '@/utils/constant'
import api from "./../utils/axios";
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    
    useEffect(()=>{
        const fetchCompanies = async () => {
            // Prevent duplicate API calls
            if (hasFetched.current) return;
            hasFetched.current = true;
            
            try {
                const res = await api.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
        
        // Cleanup function to reset ref when component unmounts
        return () => {
            hasFetched.current = false;
        };
    },[])
}

export default useGetAllCompanies
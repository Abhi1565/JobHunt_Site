import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import api from "./../utils/axios";
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const hasFetched = useRef(false);

    useEffect(()=>{
        // Don't do anything if user is not authenticated
        if (!user) {
            return;
        }

        const fetchAppliedJobs = async () => {
            // Prevent duplicate API calls
            if (hasFetched.current) return;
            
            hasFetched.current = true;
            
            try {
                const res = await api.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                // Reset the flag on error so it can retry later
                hasFetched.current = false;
            }
        }
        
        fetchAppliedJobs();
        
        // Cleanup function to reset ref when component unmounts
        return () => {
            hasFetched.current = false;
        };
    },[user, dispatch]) // Add user and dispatch to dependency array
};
export default useGetAppliedJobs;
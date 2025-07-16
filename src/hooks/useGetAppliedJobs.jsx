import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const hasFetched = useRef(false);

    useEffect(()=>{
        // Don't do anything if user is not authenticated
        if (!user) {
            console.log("User not authenticated, skipping applied jobs fetch");
            return;
        }

        const fetchAppliedJobs = async () => {
            // Prevent duplicate API calls
            if (hasFetched.current) return;
            
            hasFetched.current = true;
            
            try {
                console.log("Fetching applied jobs for user:", user._id);
                console.log("Making request to:", `${APPLICATION_API_END_POINT}/get`);
                console.log("Request config:", { withCredentials: true });
                
                // First test authentication
                try {
                    const authTest = await axios.get(`${APPLICATION_API_END_POINT}/test-auth`, {withCredentials:true});
                    console.log("Auth test successful:", authTest.data);
                } catch (authError) {
                    console.log("Auth test failed:", authError.response?.data);
                }
                
                // Test user endpoint
                try {
                    const userTest = await axios.get(`http://localhost:8000/api/v1/user/me`, {withCredentials:true});
                    console.log("User test successful:", userTest.data);
                } catch (userError) {
                    console.log("User test failed:", userError.response?.data);
                }
                
                // Test Cloudinary configuration
                try {
                    const cloudinaryTest = await axios.get(`http://localhost:8000/api/v1/user/test-cloudinary`);
                    console.log("Cloudinary test successful:", cloudinaryTest.data);
                } catch (cloudinaryError) {
                    console.log("Cloudinary test failed:", cloudinaryError.response?.data);
                }
                
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                console.log("Response received:", res.status, res.data);
                
                if(res.data.success){
                    console.log("Applied jobs fetched successfully:", res.data.application?.length || 0, "jobs");
                    dispatch(setAllAppliedJobs(res.data.application));
                } else {
                    console.log("API returned success: false for applied jobs");
                }
            } catch (error) {
                console.log("Error fetching applied jobs:", error);
                console.log("Error response:", error.response?.data);
                console.log("Error status:", error.response?.status);
                console.log("Error headers:", error.response?.headers);
                
                if (error.response?.status === 401) {
                    console.log("Authentication failed - user may need to log in again");
                }
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
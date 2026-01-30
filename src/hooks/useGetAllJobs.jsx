import { useEffect, useRef } from 'react'
import api from '@/utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs, setFilteredJobs, setOriginalJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '../utils/constant'

const useGetAllJobs = () => {
  const dispatch = useDispatch(); 
  const {searchedQuery, originalJobs, allJobs} = useSelector(store=>store.job);
  const lastSearchedQuery = useRef('');
  
  useEffect(()=>{
     const fetchAllJobs = async () => {
        try {
            // URL encode the search query to handle spaces and special characters
            const encodedQuery = encodeURIComponent(searchedQuery);
            const url = `${JOB_API_END_POINT}/get?keyword=${encodedQuery}`;
            const res = await api.get(url);
            if(res.data.success){
                // Set filtered jobs for search results, keep original jobs intact
                dispatch(setFilteredJobs(res.data.jobs));
            }
        } catch (error) {
            // Handle error silently
        }
     }
     
     const fetchOriginalJobs = async () => {
        try {
            const res = await api.get(`${JOB_API_END_POINT}/get`);
            if(res.data.success){
                dispatch(setAllJobs(res.data.jobs));
                dispatch(setOriginalJobs(res.data.jobs));
            }
        } catch (error) {
            // Handle error silently
        }
     }
     
     // If we have a search query, fetch filtered results
     if (searchedQuery && searchedQuery.trim() !== "" && searchedQuery !== lastSearchedQuery.current) {
         lastSearchedQuery.current = searchedQuery;
         fetchAllJobs();
     } else if (!searchedQuery || searchedQuery.trim() === "") {
         // Clear filtered jobs when search query is empty
         if (lastSearchedQuery.current !== '') {
             dispatch(setFilteredJobs([]));
             lastSearchedQuery.current = '';
         }
         
         // If we don't have original jobs loaded yet, fetch them
         if (originalJobs.length === 0 && allJobs.length === 0) {
             fetchOriginalJobs();
         } else if (originalJobs.length > 0) {
             // Restore original jobs to allJobs
             dispatch(setAllJobs(originalJobs));
         }
     }
     
     // Cleanup function to reset ref when component unmounts
     return () => {
         lastSearchedQuery.current = '';
     };
  },[searchedQuery, dispatch, originalJobs, allJobs])
}

export default useGetAllJobs
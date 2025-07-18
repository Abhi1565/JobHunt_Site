import { useEffect, useRef } from 'react'
import api from '@/utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '../utils/constant'

const useGetAllJobs = () => {
  const dispatch = useDispatch(); 
  const {searchedQuery} = useSelector(store=>store.job);
  const lastSearchedQuery = useRef('');
  
  useEffect(()=>{
     const fetchAllJobs = async () => {
        try {
            // URL encode the search query to handle spaces and special characters
            const encodedQuery = encodeURIComponent(searchedQuery);
            const url = `${JOB_API_END_POINT}/get?keyword=${encodedQuery}`;
            const res = await api.get(url);
            if(res.data.success){
                dispatch(setAllJobs(res.data.jobs));
            }
        } catch (error) {
            // Optionally log error in development
            // console.log(error); 
        }
     }
     // Only fetch if there's a search query and it's different from the last one
     if (searchedQuery && searchedQuery.trim() !== "" && searchedQuery !== lastSearchedQuery.current) {
         // Clear old jobs immediately when starting a new search
         dispatch(setAllJobs([]));
         lastSearchedQuery.current = searchedQuery;
         fetchAllJobs();
     } else if (!searchedQuery || searchedQuery.trim() === "") {
         // Clear jobs when search query is empty
         if (lastSearchedQuery.current !== '') {
             dispatch(setAllJobs([]));
             lastSearchedQuery.current = '';
         }
     }
     // Cleanup function to reset ref when component unmounts
     return () => {
         lastSearchedQuery.current = '';
     };
  },[searchedQuery, dispatch])
}

export default useGetAllJobs
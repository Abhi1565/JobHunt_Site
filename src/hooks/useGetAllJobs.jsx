import { useEffect, useRef } from 'react';
import api from '@/utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs, setFilteredJobs, setOriginalJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '../utils/constant';

const useGetAllJobs = () => {
  const dispatch = useDispatch(); 
  const { searchedQuery, originalJobs = [], allJobs = [] } = useSelector(store => store.job || {});
  const lastSearchedQuery = useRef('');
  const hasFetchedOriginal = useRef(false);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const encodedQuery = encodeURIComponent(searchedQuery);
        const url = `${JOB_API_END_POINT}/get?keyword=${encodedQuery}`;
        const res = await api.get(url);
        if (res.data.success) {
          dispatch(setFilteredJobs(res.data.jobs));
        }
      } catch (error) {}
    };

    const fetchOriginalJobs = async () => {
      try {
        const res = await api.get(`${JOB_API_END_POINT}/get`);
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
          dispatch(setOriginalJobs(res.data.jobs));
        }
      } catch (error) {}
    };

    // Fetch filtered jobs if query changed
    if (searchedQuery?.trim() && searchedQuery !== lastSearchedQuery.current) {
      lastSearchedQuery.current = searchedQuery;
      fetchAllJobs();
    } 
    // Handle empty search query
    else if (!searchedQuery?.trim()) {
      if (lastSearchedQuery.current !== '') {
        dispatch(setFilteredJobs([]));
        lastSearchedQuery.current = '';
      }

      // Always refresh original jobs once per mount to avoid stale state
      if (!hasFetchedOriginal.current) {
        hasFetchedOriginal.current = true;
        fetchOriginalJobs();
      } else if (Array.isArray(originalJobs) && originalJobs.length > 0) {
        dispatch(setAllJobs(originalJobs));
      }
    }

    // Cleanup
    return () => {
      lastSearchedQuery.current = '';
      hasFetchedOriginal.current = false;
    };
  }, [searchedQuery, dispatch, originalJobs]);
};

export default useGetAllJobs;

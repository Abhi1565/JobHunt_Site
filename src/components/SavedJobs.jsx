import React, { useMemo } from 'react'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import Job from './Job'

const SavedJobs = () => {
  const { user } = useSelector(store => store.auth);
  const { allJobs } = useSelector(store => store.job);
  useGetAllJobs();

  const savedJobs = useMemo(() => {
    const key = user?._id ? `savedJobs_${user._id}` : "savedJobs_guest";
    const savedIds = JSON.parse(localStorage.getItem(key) || "[]");
    return (allJobs || []).filter((job) => savedIds.includes(job?._id));
  }, [allJobs, user?._id]);

  return (
    <div>
      <Navbar />
      <div className='mx-auto my-10 max-w-7xl px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>Saved Jobs</h1>
        {savedJobs.length === 0 ? (
          <div className='text-center py-12 text-gray-500'>No saved jobs yet.</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {savedJobs.map((job) => (
              <Job key={job?._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedJobs

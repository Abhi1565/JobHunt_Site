import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
  const {allJobs} = useSelector(store=>store.job);

  return (
    <div className='mx-auto my-20 max-w-7xl px-4'>
        <h1 className='text-2xl md:text-4xl font-bold text-center mb-8'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
          {
           allJobs.length <= 0 ? 
             <div className="col-span-full text-center text-gray-500 py-8">No Jobs Available</div> : 
             allJobs?.slice(0,6).map((job)=> <LatestJobCards key={job._id} job={job}/>) 
        }
        </div>
    </div>
  )
}

export default LatestJobs
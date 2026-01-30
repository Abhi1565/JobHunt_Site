import React, { useEffect, useState } from 'react'
import Job from './Job';
import Navbar from './shared/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setFilteredJobs } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Browse = () => {
  const {filteredJobs, searchedQuery, allJobs} = useSelector(store=>store.job);
  const dispatch = useDispatch();

  // Call the hook to fetch jobs based on search query from home page
  useGetAllJobs();

  // Determine which jobs to show
  const jobsToShow = searchedQuery ? (filteredJobs || []) : (allJobs || []);

  return (
    <div>
        <Navbar/>
        <div className='mx-auto my-10 max-w-7xl px-4'>
           <div className='mb-6'>
             <h1 className='text-2xl font-bold text-gray-900 mb-2'>
               {searchedQuery ? `Search Results for "${searchedQuery}"` : 'Browse All Jobs'}
             </h1>
             <p className='text-gray-600'>
               {searchedQuery 
                 ? `Found ${filteredJobs?.length || 0} job${(filteredJobs?.length || 0) !== 1 ? 's' : ''}`
                 : `Showing ${allJobs?.length || 0} available job${(allJobs?.length || 0) !== 1 ? 's' : ''}`
               }
             </p>
           </div>
           
           {searchedQuery && (
             <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
               <div className='flex items-center justify-between'>
                 <div className='flex items-center gap-2'>
                   <Search className='w-4 h-4 text-blue-600' />
                   <span className='text-sm text-blue-800'>
                     Filtering by: <span className='font-semibold'>{searchedQuery}</span>
                   </span>
                 </div>
                 <Button 
                   onClick={() => dispatch(setSearchedQuery(""))}
                   variant="ghost" 
                   size="sm"
                   className="text-blue-600 hover:text-blue-800"
                 >
                   Clear Search
                 </Button>
               </div>
             </div>
           )}
           
           {jobsToShow.length <= 0 ? (
             <div className='text-center py-12'>
               <Search className='w-12 h-12 text-gray-400 mx-auto mb-4' />
               <h3 className='text-lg font-medium text-gray-900 mb-2'>
                 {searchedQuery ? 'No jobs found' : 'Search for jobs'}
               </h3>
               <p className='text-gray-500'>
                 {searchedQuery 
                   ? `No jobs match "${searchedQuery}". Try searching with different keywords or check the Jobs page for all available positions.`
                   : 'Use the search bar on the home page or click on a category to find jobs.'
                 }
               </p>
               {searchedQuery ? (
                 <div className='mt-4'>
                   <Link to="/" className='text-[#6A38C2] hover:underline'>
                     Go back to home page →
                   </Link>
                 </div>
               ) : (
                 <div className='mt-4'>
                   <Link to="/" className='text-[#6A38C2] hover:underline'>
                     Go back to home page →
                   </Link>
                 </div>
               )}
             </div>
           ) : (
             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
               {jobsToShow.map((job) => (
                 <motion.div 
                   initial={{opacity:0, y:20}}
                   animate={{opacity:1, y:0}}
                   exit={{opacity:0, y:-20}}
                   transition={{duration:0.3}}
                   key={job?._id}
                 >
                   <Job job={job}/>
                 </motion.div>
               ))}
             </div>
           )}
        </div>
    </div>
  )
}

export default Browse
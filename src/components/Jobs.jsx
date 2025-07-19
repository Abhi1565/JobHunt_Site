import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT } from '../utils/constant'
import { setAllJobs, setSearchedQuery } from '@/redux/jobSlice'
import { Button } from './ui/button'

const Jobs = () => {
    const {allJobs, searchedQuery} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs || []);
    const dispatch = useDispatch();

    // Fetch all jobs when component first loads
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                console.log("Jobs component - fetching all jobs initially");
                console.log("API endpoint:", `${JOB_API_END_POINT}/get`);
                const res = await axios.get(`${JOB_API_END_POINT}/get`, {withCredentials:true});
                if(res.data.success){
                    console.log("Jobs component - all jobs received:", res.data.jobs.length);
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log("Error fetching all jobs:", error);
            }
        };
        
        // Only fetch if we don't have jobs yet
        if (allJobs.length === 0) {
            fetchAllJobs();
        }
    }, [dispatch, allJobs.length]);

    // Function to check if salary falls within range
    const isSalaryInRange = (jobSalary, range) => {
        // jobSalary is already a number from the database (e.g., 60 for "60 LPA")
        const salary = jobSalary || 0;
        
        switch (range) {
            case "0-5 LPA":
                return salary >= 0 && salary <= 5;
            case "5-10 LPA":
                return salary >= 5 && salary <= 10;
            case "10-20 LPA":
                return salary >= 10 && salary <= 20;
            case "20+ LPA":
                return salary >= 20;
            default:
                return true;
        }
    };

    // Update filtered jobs when allJobs or searchedQuery changes
    useEffect(()=>{
        console.log("Jobs component - searchedQuery:", searchedQuery);
        console.log("Jobs component - allJobs count:", allJobs.length);
        
        // Jobs page only uses sidebar filters, not search query from Redux
        // If there's a searchedQuery from sidebar filter, filter the jobs
        if(searchedQuery && searchedQuery.trim() !== ""){
            // Check if it's a salary range filter
            if(searchedQuery.includes('LPA')){
                const filteredJobs = allJobs?.filter((job)=>{
                    return isSalaryInRange(job.salary, searchedQuery);
                }) || [];
                setFilterJobs(filteredJobs);
                console.log("Salary filtered jobs count:", filteredJobs.length);
            } else {
                // For text searches (location, industry), filter client-side
                const filteredJobs = allJobs?.filter((job) => {
                    const searchLower = searchedQuery.toLowerCase();
                    return (
                        job.title?.toLowerCase().includes(searchLower) ||
                        job.description?.toLowerCase().includes(searchLower) ||
                        job.location?.toLowerCase().includes(searchLower) ||
                        job.jobType?.toLowerCase().includes(searchLower)
                    );
                }) || [];
                setFilterJobs(filteredJobs);
                console.log("Text filtered jobs count:", filteredJobs.length);
            }
        } else {
            // No search query, show all jobs
            setFilterJobs(allJobs || []);
        }
    },[allJobs, searchedQuery]);

    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch])

    return (
        <div>
            <Navbar />
            <div className='mx-auto mt-5 max-w-7xl px-4'>
                <div className='flex flex-col lg:flex-row gap-6'>
                    <div className='lg:w-80 flex-shrink-0'>
                        <FilterCard />
                    </div>
                    <div className='flex-1'>
                        {searchedQuery && (
                            <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                                <div className='flex items-center gap-2'>
                                    <Search className='w-4 h-4 text-blue-600' />
                                    <span className='text-sm text-blue-800'>
                                        Showing results for: <span className='font-semibold'>{searchedQuery}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {filterJobs.length <= 0 ? (
                            <div className='text-center py-12'>
                                <Search className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>No jobs found</h3>
                                <p className='text-gray-500'>
                                    {searchedQuery ? `No jobs match "${searchedQuery}". Try selecting a different filter or clear the filter to see all jobs.` : 'No jobs available at the moment'}
                                </p>
                                {searchedQuery && (
                                    <div className='mt-4'>
                                        <Button 
                                            onClick={() => dispatch(setSearchedQuery(''))}
                                            variant="outline"
                                            className='text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white'
                                        >
                                            Clear Filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {filterJobs.map((job) => (
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
            </div>
        </div>
    )
}

export default Jobs
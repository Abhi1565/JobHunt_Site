import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { Button } from './ui/button'
import { INDUSTRY_KEYWORDS } from '@/utils/jobFilters'

const Jobs = () => {
    const {allJobs, searchedQuery, jobFilters = { locations: [], industries: [], jobTypes: [], locationTypes: [], salaryRanges: [] }} = useSelector(store=>store.job || {});
    const [filterJobs, setFilterJobs] = useState(allJobs || []);
    const dispatch = useDispatch();
    useGetAllJobs();

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

    const matchesIndustry = (job, selectedIndustries) => {
        if (!selectedIndustries || selectedIndustries.length === 0) return true;
        const haystack = [
            job?.title,
            job?.description,
            Array.isArray(job?.requirements) ? job.requirements.join(" ") : ""
        ]
            .join(" ")
            .toLowerCase();
        const FRONTEND_CORE = ["react", "vue", "angular", "next.js", "nextjs", "nuxt", "svelte"];
        const BACKEND_CORE = ["node", "express", "java", "spring", "django", "flask", "laravel", "dotnet", ".net"];

        const matchRatio = (skills) => {
            if (!skills || skills.length === 0) return 0;
            const matched = skills.filter((kw) => haystack.includes(kw.toLowerCase())).length;
            return matched / skills.length;
        };

        const hasAny = (skills) => skills.some((kw) => haystack.includes(kw.toLowerCase()));

        return selectedIndustries.some((industry) => {
            if (industry === "Fullstack") {
                const frontendMatch = hasAny(FRONTEND_CORE);
                const backendMatch = hasAny(BACKEND_CORE);
                return frontendMatch && backendMatch;
            }

            if (industry === "Frontend") {
                const coreMatch = matchRatio(FRONTEND_CORE);
                return coreMatch >= 0.8;
            }

            if (industry === "Backend") {
                const coreMatch = matchRatio(BACKEND_CORE);
                return coreMatch >= 0.8;
            }

            const keywords = INDUSTRY_KEYWORDS[industry] || [];
            return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
        });
    };

    const matchesJobType = (job, selectedJobTypes) => {
        if (!selectedJobTypes || selectedJobTypes.length === 0) return true;
        const jobType = (job?.jobType || "").toLowerCase();
        return selectedJobTypes.some((type) => jobType.includes(type.toLowerCase()));
    };

    const matchesLocation = (job, selectedLocations) => {
        if (!selectedLocations || selectedLocations.length === 0) return true;
        const location = (job?.location || "").toLowerCase();
        return selectedLocations.some((loc) => location.includes(loc.toLowerCase()));
    };

    const matchesLocationType = (job, selectedLocationTypes) => {
        if (!selectedLocationTypes || selectedLocationTypes.length === 0) return true;
        const locationType = (job?.locationType || "").toLowerCase();
        return selectedLocationTypes.some((type) => locationType.includes(type.toLowerCase()));
    };

    const matchesSalary = (job, selectedRanges) => {
        if (!selectedRanges || selectedRanges.length === 0) return true;
        return selectedRanges.some((range) => isSalaryInRange(job?.salary || 0, range));
    };

    // Update filtered jobs when allJobs or filters change
    useEffect(()=>{
        const filtered = (allJobs || []).filter((job) => {
            return (
                matchesLocation(job, jobFilters?.locations) &&
                matchesLocationType(job, jobFilters?.locationTypes) &&
                matchesJobType(job, jobFilters?.jobTypes) &&
                matchesIndustry(job, jobFilters?.industries) &&
                matchesSalary(job, jobFilters?.salaryRanges)
            );
        });
        setFilterJobs(filtered);
    },[allJobs, jobFilters]);

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
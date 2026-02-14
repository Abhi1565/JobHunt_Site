import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        // Only search if there's actually a query
        if (query && query.trim() !== "") {
            dispatch(setSearchedQuery(query.trim()));
            navigate("/browse");
        }
    }

    return (
        <div className='text-center px-4'>
            <div className='flex flex-col gap-5 my-10 max-w-4xl mx-auto'>
                {/* <span className='mx-auto px-4 py-2 bg-gray-100 rounded-full text-[#F83002] font-medium text-sm md:text-base'>No. 1 JobHunt Website</span> */}
                <h1 className='text-3xl md:text-5xl font-bold leading-tight'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
                <p className='text-gray-600 max-w-2xl mx-auto text-sm md:text-base'>Find the perfect job opportunity that matches your skills and career goals. Apply with confidence and take the next step in your professional journey.</p>
                <div className='flex w-full max-w-md md:max-w-lg shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                        className='w-full border-none outline-none py-3 text-sm md:text-base'
                    />
                    <Button onClick={searchJobHandler} className='rounded-r-full bg-[#6A38C2] hover:bg-[#5a2fa0]'>
                        <Search className='w-4 h-4 md:w-5 md:h-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection

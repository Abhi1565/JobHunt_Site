import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({job}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/description/${job._id}`);
  };

  return (
    <div 
      className='p-4 md:p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 hover:border-[#6A38C2]/20'
      onClick={handleCardClick}
    >
      <div className='mb-3'>
        <h1 className='text-base md:text-lg font-semibold text-gray-800'>{job?.company?.name}</h1>  
        <p className='text-xs md:text-sm text-gray-500'>{job?.location || 'India'}</p>
      </div>
      <div className='mb-4'>
        <h1 className='text-lg md:text-xl font-bold text-gray-900 mb-2'>{job?.title}</h1>
        <p className='text-xs md:text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Badge className='text-xs font-medium text-blue-700 bg-blue-50' variant='ghost'>
          {job?.position} positions
        </Badge>
        <Badge className='text-xs font-medium text-[#F83002] bg-red-50' variant='ghost'>
          {job?.jobType}
        </Badge>
        <Badge className='text-xs font-medium text-[#720967] bg-purple-50' variant='ghost'>
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  )
}

export default LatestJobCards
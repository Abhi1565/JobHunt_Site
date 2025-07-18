import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
  const navigate = useNavigate();
  // const jobId = 'bcwavbaicnaskbc';

  const daysAgoFunction = (mongodbTime) => {
     const createdAt = new Date(mongodbTime);
     const currentTime = new Date();
     const timeDifference = currentTime - createdAt;
     return Math.floor(timeDifference/ (1000*24*60*60));
  }

  return (
    <div className='p-5 bg-white border border-gray-100 rounded-md shadow-xl'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
        <Button variant='outline' className='rounded-full' size='icon'><Bookmark /></Button>
      </div>
      <div className='flex items-center gap-2 my-2'>
        <Button className='p-6' variant='outline' size='icon'>
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className='text-lg font-medium'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>
      <div>
        <h1 className='my-2 text-lg font-bold'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Badge className={'font-bold text-blue-700 font-bold'} variant='ghost'>{job?.position}</Badge>
        <Badge className={'font-bold text-[#F83002] font-bold'} variant='ghost'>{job?.jobType}</Badge>
        <Badge className={'font-bold text-[#720967] font-bold'} variant='ghost'>{job?.salary}LPA</Badge>
      </div>
      <div className='flex items-center gap-4 mt-4'>
        <Button onClick={()=> navigate(`/description/${job?._id}`)} variant='outline'>Details</Button>
        <Button className='bg-[#7209b7]'>Save For Later</Button>
      </div>
    </div>
  )
}

export default Job
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { toast } from 'sonner'

const Job = ({job}) => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const { allAppliedJobs } = useSelector(store => store.job);
  useGetAppliedJobs();
  const [isSaved, setIsSaved] = useState(false);
  const savedKey = user?._id ? `savedJobs_${user._id}` : "savedJobs_guest";
  // const jobId = 'bcwavbaicnaskbc';

  const daysAgoFunction = (mongodbTime) => {
     const createdAt = new Date(mongodbTime);
     const currentTime = new Date();
     const timeDifference = currentTime - createdAt;
     return Math.floor(timeDifference/ (1000*24*60*60));
  }

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
      setIsSaved(saved.includes(job?._id));
    } catch {
      setIsSaved(false);
    }
  }, [job?._id, savedKey]);

  const appliedJobIds = useMemo(() => {
    return new Set((allAppliedJobs || []).map((app) => app?.job?._id));
  }, [allAppliedJobs]);
  const isApplied = user?._id ? appliedJobIds.has(job?._id) : false;

  const toggleSave = () => {
    if (!user?._id) {
      toast.error('Please log in to save jobs.');
      navigate('/login');
      return;
    }
    if (isApplied) return;
    try {
      const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
      const set = new Set(saved);
      if (set.has(job?._id)) {
        set.delete(job?._id);
        setIsSaved(false);
      } else {
        set.add(job?._id);
        setIsSaved(true);
      }
      localStorage.setItem(savedKey, JSON.stringify(Array.from(set)));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className='p-5 bg-white border border-gray-100 rounded-md shadow-xl'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
        <Button variant='outline' className='rounded-full' size='icon' onClick={toggleSave} disabled={isApplied}>
          {isSaved ? <BookmarkCheck className='text-[#6A38C2]' /> : <Bookmark />}
        </Button>
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
        <Button
          className={isApplied ? 'bg-gray-400 cursor-not-allowed' : isSaved ? 'bg-[#6A38C2] hover:bg-[#5b30a6]' : 'bg-[#7209b7]'}
          onClick={toggleSave}
          disabled={isApplied}
        >
          {isApplied ? 'Applied' : isSaved ? 'Saved' : 'Save For Later'}
        </Button>
      </div>
    </div>
  )
}

export default Job
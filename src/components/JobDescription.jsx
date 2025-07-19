import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom'
import api from '../utils/axios'
import { setSingleJob } from '../redux/jobSlice'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../utils/constant'
import { useDispatch,  useSelector} from 'react-redux'
import { toast } from 'sonner'
import Navbar from './shared/Navbar'

const JobDescription = () => {
    const {singleJob} = useSelector(Store=>Store.job);
    const {user} = useSelector(store=>store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application=>application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
       try {
          const res = await api.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`);
          console.log(res.data);      
          if(res.data.success){
             setIsApplied(true); // update the local state
             const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
             dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
             toast.success(res.data.message);
          }
       } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
       }
    }

    useEffect(()=>{
     const fetchSingleJob = async () => {
        try {
            const res = await api.get(`${JOB_API_END_POINT}/get/${jobId}`);
            if(res.data.success){
                dispatch(setSingleJob(res.data.job));
                setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
            }
        } catch (error) {
            console.log(error); 
        }
     }
     fetchSingleJob();
  },[jobId, dispatch, user?._id]);

    return (
        <div>
            <Navbar />
            <div className='mx-auto my-10 max-w-4xl px-4'>
                <div className='bg-white rounded-lg shadow-md p-6 md:p-8'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
                        <div className='flex-1'>
                            <h1 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>{singleJob?.title}</h1>
                            <div className='flex flex-wrap items-center gap-2'>
                                <Badge className='text-xs font-medium text-blue-700 bg-blue-50' variant='ghost'>
                                    {singleJob?.position} positions
                                </Badge>
                                <Badge className='text-xs font-medium text-[#F83002] bg-red-50' variant='ghost'>
                                    {singleJob?.jobType}
                                </Badge>
                                <Badge className='text-xs font-medium text-[#720967] bg-purple-50' variant='ghost'>
                                    {singleJob?.salary} LPA
                                </Badge>
                            </div>
                        </div>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-lg px-6 py-2 ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div> 
                    
                    <div className='border-b-2 border-gray-200 pb-4 mb-6'>
                        <h2 className='text-lg md:text-xl font-semibold text-gray-900'>Job Description</h2>
                    </div>
                    
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Role</h3>
                                <p className='text-gray-700'>{singleJob?.title}</p>
                            </div>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Location</h3>
                                <p className='text-gray-700'>{singleJob?.location}</p>
                            </div>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Experience</h3>
                                <p className='text-gray-700'>{singleJob?.experienceLevel} years</p>
                            </div>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Salary</h3>
                                <p className='text-gray-700'>{singleJob?.salary} LPA</p>
                            </div>
                        </div>
                        
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <h3 className='font-semibold text-gray-900 mb-2'>Description</h3>
                            <p className='text-gray-700 leading-relaxed'>{singleJob?.description}</p>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Total Applicants</h3>
                                <p className='text-gray-700'>{singleJob?.applications?.length || 0}</p>
                            </div>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Posted Date</h3>
                                <p className='text-gray-700'>{singleJob?.createdAt ? singleJob.createdAt.split('T')[0] : 'N/A'}</p>
                            </div>
                        </div>
                        
                        {singleJob?.requirements && singleJob.requirements.length > 0 && (
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Requirements</h3>
                                <ul className='list-disc list-inside text-gray-700 space-y-1'>
                                    {singleJob.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription
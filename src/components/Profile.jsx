import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Pen, Mail, Contact, Camera, FileText, AlertCircle } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { toast } from 'sonner'

// const skills = ['Html', 'Css', 'Javascript', 'Reactjs']
const isResume = true; 
const Profile = () => {
  const {user} = useSelector(store=>store.auth);
  
  // Only call the hook if user is authenticated
  if (user) {
    useGetAppliedJobs();
  }
  
  const [open, setOpen] = useState(false);

  const handleResumeClick = (e) => {
    const link = e.target.href;
    if (!link || link === 'undefined' || link === 'null') {
      e.preventDefault();
      toast.error('Resume link is not available. Please re-upload your resume.');
      return;
    }
    
    // Check if the link is accessible
    fetch(link, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          e.preventDefault();
          toast.error('Resume file is not accessible. Please re-upload your resume.');
        }
      })
      .catch(error => {
        console.log('Error checking resume link:', error);
        e.preventDefault();
        toast.error('Unable to access resume. Please re-upload your resume.');
      });
  };

  // If user is not authenticated, show a message
  if (!user) {
    return (
      <div>
        <Navbar />
        <div className='max-w-4xl p-8 mx-auto my-5 bg-white border border-gray-200 rounded-2xl'>
          <h1 className='text-xl font-medium text-center'>Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='max-w-4xl p-8 mx-auto my-5 bg-white border border-gray-200 rounded-2xl'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <Avatar className='w-24 h-24'>
                <AvatarImage 
                  src={user?.profile?.profilePhoto || 'https://www.shutterstock.com/shutterstock/photos/2174926871/display_1500/stock-vector-circle-line-simple-design-logo-blue-format-jpg-png-eps-2174926871.jpg'} 
                  alt='profile' 
                />
              </Avatar>
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                onClick={() => setOpen(true)}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <h1 className='text-xl font-medium'>{user?.fullname}</h1>
              <p>{user?.profile?.bio || 'No bio added yet'}</p>
            </div>
          </div> 
          <Button onClick={() => setOpen(true)} className='text-right' variant='outline'><Pen /></Button>
        </div>
        <div className='my-5'>
          <div className='flex items-center gap-3 my-2'>
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className='flex items-center gap-3 my-2'>
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>
        <div className='my-5'>
          <h1>Skills</h1>
          <div className='flex items-center gap-1'>
            {
              user?.profile?.skills && user?.profile?.skills.length > 0 ? 
                user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : 
                <span>No skills added yet</span>
            }
          </div>
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label className='font-bold text-md'>Resume</Label>
          {
            user?.profile?.resume ? 
              <div className='flex items-center gap-2'>
                <a 
                  target='_blank' 
                  href={user?.profile?.resume} 
                  className='flex items-center gap-2 text-blue-500 cursor-pointer hover:underline'
                  onClick={handleResumeClick}
                >
                  <FileText className="w-4 h-4" />
                  {user?.profile?.resumeOriginalName || 'View Resume'}
                </a>
                <span className='text-xs text-gray-500'>
                  (Click to open in new tab)
                </span>
              </div> : 
              <div className='flex items-center gap-2 text-gray-500'>
                <AlertCircle className="w-4 h-4" />
                <span>No resume uploaded yet</span>
              </div>
          }
        </div>
      </div>
      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
          <h1 className='my-5 text-lg font-bold'>Applied Jobs</h1>
          {/* Applied Job Table */}
          <AppliedJobTable />
        </div>
        <UpdateProfileDialog open={open} setOpen={setOpen}/>
    </div> 
  )
}

export default Profile
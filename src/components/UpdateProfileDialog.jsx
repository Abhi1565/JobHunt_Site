import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { DialogFooter } from './ui/dialog'
import { useSelector, useDispatch } from 'react-redux'
import { USER_API_END_POINT } from '../utils/constant'
import api from '../utils/axios'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({open, setOpen}) => {
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);

    const [input, setInput] = useState({
        fullname:user?.fullname || '',
        email:user?.email || '',
        phoneNumber:user?.phoneNumber || '',
        bio:user?.profile?.bio || '',
        skills:user?.profile?.skills?.join(', ') || '',
        resumeFile: null,
        profilePhotoFile: null
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({...input,[e.target.name]:e.target.value});
    }

    const resumeFileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({...input, resumeFile: file})
    }

    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({...input, profilePhotoFile: file})
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio);
        formData.append('skills', input.skills);
        
        if(input.resumeFile){
            formData.append('resumeFile', input.resumeFile);
        }
        
        if(input.profilePhotoFile){
            formData.append('profilePhotoFile', input.profilePhotoFile);
        }
   
        try {
           setLoading(true); 
           const res = await api.post(`${USER_API_END_POINT}/profile/update`, formData);
           if(res.data.success){
              dispatch(setUser(res.data.user));
              toast.success(res.data.message);
              setOpen(false);
           }
        } catch (error) {
            console.log(error);       
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while updating profile");
            }
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[500px]' aria-describedby="profile-update-description">
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <div id="profile-update-description" className="sr-only">
                        Form to update your profile information including name, email, phone number, bio, skills, profile photo, and resume.
                    </div>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='name' className='text-right'>Name</Label>
                                <Input
                                    id='name'
                                    name='fullname'
                                    type='text'
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                    required
                                />
                            </div>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='email' className='text-right'>Email</Label>
                                <Input
                                    id='email'
                                    name='email'
                                    type='email'
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                    required
                                />
                            </div>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='phoneNumber' className='text-right'>Phone</Label>
                                <Input
                                    id='phoneNumber'
                                    name='phoneNumber'
                                    type='tel'
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                    required
                                />
                            </div>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='bio' className='text-right'>Bio</Label>
                                <Input
                                    id='bio'
                                    name='bio'
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                    placeholder='Tell us about yourself...'
                                />
                            </div>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='skills' className='text-right'>Skills</Label>
                                <Input
                                    id='skills'
                                    name='skills'
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className='col-span-3'
                                    placeholder='e.g., React, Node.js, MongoDB (comma separated)'
                                />
                            </div>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='profilePhoto' className='text-right'>Profile Photo</Label>
                                <Input
                                    id='profilePhoto'
                                    name='profilePhotoFile'
                                    type='file'
                                    accept='image/*'        
                                    onChange={profilePhotoChangeHandler}
                                    className='col-span-3'
                                />
                            </div>
                            <div className='grid items-center grid-cols-4 gap-4'>
                                <Label htmlFor='resume' className='text-right'>Resume</Label>
                                <Input
                                    id='resume'
                                    name='resumeFile'
                                    type='file'
                                    accept='application/pdf'        
                                    onChange={resumeFileChangeHandler}
                                    className='col-span-3'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? 
                                    <Button className="w-full my-4" disabled>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                                        Updating Profile...
                                    </Button> : 
                                    <Button type="submit" className="w-full my-4">Update Profile</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog
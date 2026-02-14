import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
       // console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    const activeJobs = filterJobs?.filter((job) => !job?.isArchived) || [];
    const archivedJobs = filterJobs?.filter((job) => job?.isArchived) || [];

    const renderRows = (jobs) => jobs?.map((job) => (
        <tr key={job?._id}>
            <TableCell>{job?.company?.name}</TableCell>
            <TableCell>
                {job?.title}
                {job?.isArchived && <span className='ml-2 text-xs text-gray-500'>(Archived)</span>}
            </TableCell>
            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
            <TableCell className="text-right cursor-pointer">
                <Popover>
                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                    <PopoverContent className="w-32">
                        {!job?.isArchived && (
                            <div onClick={()=> navigate(`/admin/jobs/${job._id}/edit`)} className='flex items-center gap-2 cursor-pointer w-fit'>
                                <Edit2 className='w-4' />
                                <span>Edit</span>
                            </div>
                        )}
                        <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className={`flex items-center gap-2 cursor-pointer w-fit ${job?.isArchived ? '' : 'mt-2'}`}>
                            <Eye className='w-4'/>
                            <span>{job?.isArchived ? 'History' : 'Applicants'}</span>
                        </div>
                    </PopoverContent>
                </Popover>
            </TableCell>
        </tr>
    ));

    return (
        <div>
            <Table>
                <TableCaption>Active jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderRows(activeJobs)}
                </TableBody>
            </Table>
            {archivedJobs.length > 0 && (
                <Table className="mt-8">
                    <TableCaption>Archived job history</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderRows(archivedJobs)}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default AdminJobsTable

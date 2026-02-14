import React from 'react'
import { Table, TableCaption, TableHead, TableHeader, TableRow, TableBody, TableCell } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const statusLabels = {
    pending: "Pending",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    interview_rescheduled: "Interview Rescheduled",
    interview_completed: "Interview Completed",
    rejected: "Rejected",
    hired: "Hired"
};

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className='text-right'>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
          {          
            allAppliedJobs.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">You haven't applied any job yet.</TableCell>
              </TableRow>
            ) : allAppliedJobs.filter((appliedJob) => appliedJob?.job).map((appliedJob) => (
                    <TableRow key={appliedJob?._id}>
                        <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                        <TableCell>{appliedJob?.job.title}</TableCell>
                        <TableCell>{appliedJob?.job?.company?.name}</TableCell>
                        <TableCell className='text-right'>
                          <Badge className={
                            appliedJob?.status === "rejected" ? "bg-red-400" :
                            appliedJob?.status === "hired" ? "bg-green-600" :
                            appliedJob?.status === "interview_completed" ? "bg-emerald-500" :
                            appliedJob?.status === "interview_rescheduled" ? "bg-sky-500" :
                            appliedJob?.status === "interview_scheduled" ? "bg-blue-500" :
                            appliedJob?.status === "shortlisted" ? "bg-amber-500" :
                            "bg-gray-400"
                          }>
                            {statusLabels[appliedJob?.status] || "Pending"}
                          </Badge>
                        </TableCell>
                    </TableRow>
                    ))
            }        
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
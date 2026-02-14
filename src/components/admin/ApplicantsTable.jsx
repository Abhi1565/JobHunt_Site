import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import api from '../../utils/axios';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';

const statusLabels = {
    pending: "Pending",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    interview_rescheduled: "Interview Rescheduled",
    interview_completed: "Interview Completed",
    rejected: "Rejected",
    hired: "Hired"
};

const ApplicantsTable = ({ refreshApplicants }) => {
    const { applicants } = useSelector(store => store.application);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [scheduleInput, setScheduleInput] = useState({
        interviewDate: "",
        interviewTime: "",
        mode: "online",
        location: "",
        meetingLink: "",
        notes: ""
    });
    const [scheduleStatus, setScheduleStatus] = useState("interview_scheduled");

    const statusHandler = async (status, id) => {
       // console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await api.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
                if (refreshApplicants) {
                    refreshApplicants();
                }
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const openScheduleDialog = (application, nextStatus = "interview_scheduled") => {
        const interview = application?.interview || {};
        const interviewDate = interview?.date ? new Date(interview.date).toISOString().split("T")[0] : "";
        setSelectedApplication(application);
        setScheduleStatus(nextStatus);
        setScheduleInput({
            interviewDate,
            interviewTime: interview?.time || "",
            mode: interview?.mode || "online",
            location: interview?.location || "",
            meetingLink: interview?.meetingLink || "",
            notes: interview?.notes || ""
        });
        setScheduleOpen(true);
    };

    const submitSchedule = async (e) => {
        e.preventDefault();
        if (!selectedApplication?._id) return;
        try {
            axios.defaults.withCredentials = true;
            const payload = {
                status: scheduleStatus,
                interviewDate: scheduleInput.interviewDate,
                interviewTime: scheduleInput.interviewTime,
                mode: scheduleInput.mode,
                location: scheduleInput.location,
                meetingLink: scheduleInput.meetingLink,
                notes: scheduleInput.notes
            };
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${selectedApplication._id}/update`, payload);
            if (res.data.success) {
                toast.success(res.data.message);
                setScheduleOpen(false);
                if (refreshApplicants) {
                    refreshApplicants();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to schedule interview.");
        }
    };

    const actionMap = useMemo(() => ({
        pending: [
            { label: "Shortlist", action: (item) => statusHandler("shortlisted", item._id) },
            { label: "Reject", action: (item) => statusHandler("rejected", item._id) }
        ],
        shortlisted: [
            { label: "Schedule Interview", action: (item) => openScheduleDialog(item, "interview_scheduled") },
            { label: "Reject", action: (item) => statusHandler("rejected", item._id) }
        ],
        interview_scheduled: [
            { label: "Mark Interview Completed", action: (item) => statusHandler("interview_completed", item._id) },
            { label: "Reschedule Interview", action: (item) => openScheduleDialog(item, "interview_rescheduled") },
            { label: "Reject", action: (item) => statusHandler("rejected", item._id) }
        ],
        interview_rescheduled: [
            { label: "Mark Interview Completed", action: (item) => statusHandler("interview_completed", item._id) },
            { label: "Reschedule Interview", action: (item) => openScheduleDialog(item, "interview_rescheduled") },
            { label: "Reject", action: (item) => statusHandler("rejected", item._id) }
        ],
        interview_completed: [
            { label: "Hire", action: (item) => statusHandler("hired", item._id) },
            { label: "Reject", action: (item) => statusHandler("rejected", item._id) }
        ],
        rejected: [],
        hired: []
    }), []);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <Badge className={
                                        item?.status === "rejected" ? "bg-red-400" :
                                        item?.status === "hired" ? "bg-green-600" :
                                        item?.status === "interview_completed" ? "bg-emerald-500" :
                                        item?.status === "interview_rescheduled" ? "bg-sky-500" :
                                        item?.status === "interview_scheduled" ? "bg-blue-500" :
                                        item?.status === "shortlisted" ? "bg-amber-500" :
                                        "bg-gray-400"
                                    }>
                                        {statusLabels[item?.status] || "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    {actionMap[item?.status]?.length > 0 ? (
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-48">
                                                {actionMap[item?.status]?.map((actionItem, index) => (
                                                    <div
                                                        onClick={() => actionItem.action(item)}
                                                        key={index}
                                                        className='flex items-center my-2 cursor-pointer w-fit'
                                                    >
                                                        <span>{actionItem.label}</span>
                                                    </div>
                                                ))}
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <span className="text-sm text-gray-500">No actions</span>
                                    )}
                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>

            <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                <DialogContent className='sm:max-w-[520px]' aria-describedby="schedule-interview-description">
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                    </DialogHeader>
                    <DialogDescription id="schedule-interview-description" className="sr-only">
                        Form to schedule an interview with date, time, mode, and location or meeting link.
                    </DialogDescription>
                    <form onSubmit={submitSchedule} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="interviewDate">Interview Date</Label>
                            <Input
                                id="interviewDate"
                                type="date"
                                value={scheduleInput.interviewDate}
                                onChange={(e) => setScheduleInput({ ...scheduleInput, interviewDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="interviewTime">Interview Time</Label>
                            <Input
                                id="interviewTime"
                                type="time"
                                value={scheduleInput.interviewTime}
                                onChange={(e) => setScheduleInput({ ...scheduleInput, interviewTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Mode</Label>
                            <Select
                                value={scheduleInput.mode}
                                onValueChange={(value) => setScheduleInput({ ...scheduleInput, mode: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="onsite">Onsite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {scheduleInput.mode === "online" ? (
                            <div className="grid gap-2">
                                <Label htmlFor="meetingLink">Meeting Link</Label>
                                <Input
                                    id="meetingLink"
                                    type="url"
                                    placeholder="https://..."
                                    value={scheduleInput.meetingLink}
                                    onChange={(e) => setScheduleInput({ ...scheduleInput, meetingLink: e.target.value })}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={scheduleInput.location}
                                    onChange={(e) => setScheduleInput({ ...scheduleInput, location: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (optional)</Label>
                            <Input
                                id="notes"
                                type="text"
                                value={scheduleInput.notes}
                                onChange={(e) => setScheduleInput({ ...scheduleInput, notes: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">
                                {scheduleStatus === "interview_rescheduled" ? "Send Reschedule Email" : "Send Interview Invite"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsTable

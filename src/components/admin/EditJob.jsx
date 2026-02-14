import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Loader2 } from 'lucide-react'
import { JOB_TYPE_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/utils/jobFilters'
import api from '../../utils/axios';
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const toDateTimeLocalValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return local.toISOString().slice(0, 16);
};

const parseSkills = (value) => String(value || "")
    .split(/[,;\n]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);

const titleSkillMap = {
    "mern stack developer": ["react", "node", "mongodb", "express"],
    "ml engineer": ["python", "tensorflow", "nlp", "pytorch"],
    "frontend developer": ["react", "javascript", "html", "css"],
    "backend developer": ["node", "express", "mongodb", "sql"],
    "full stack developer": ["react", "node", "mongodb", "express"],
    "data analyst": ["sql", "excel", "python", "power bi"],
    "devops engineer": ["docker", "kubernetes", "aws", "ci/cd"],
    "data engineer": ["python", "sql", "hadoop", "spark"]
};

const normalizeSkill = (value) => String(value || "").trim().toLowerCase();

const pickMappedSkills = (title) => {
    const normalizedTitle = normalizeSkill(title);
    if (!normalizedTitle) return [];
    const exact = titleSkillMap[normalizedTitle];
    if (exact) return exact;
    const partialKey = Object.keys(titleSkillMap).find((key) => normalizedTitle.includes(key));
    return partialKey ? titleSkillMap[partialKey] : [];
};

const calculateRelevanceScore = (skills, title, description) => {
    if (!Array.isArray(skills) || skills.length === 0) return 0;
    const normalizedSkills = skills.map(normalizeSkill).filter(Boolean);
    const mappedSkills = pickMappedSkills(title).map(normalizeSkill);

    if (mappedSkills.length === 0) {
        return null; // means skip validation (broad title)
    }


    if (mappedSkills.length > 0) {
        const matched = normalizedSkills.filter((skill) => mappedSkills.includes(skill)).length;
        return matched / normalizedSkills.length;
    }

    const haystack = `${title || ""} ${description || ""}`.toLowerCase();
    const matched = normalizedSkills.filter((skill) => haystack.includes(skill)).length;
    return matched / normalizedSkills.length;
};

const EditJob = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        deadline: "",
        location: "",
        locationType: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: ""
    });
    const [hasApplicants, setHasApplicants] = useState(false);
    const [lockedSalary, setLockedSalary] = useState(null);

    const { companies } = useSelector((store) => store.company);
    const navigate = useNavigate();
    const { id } = useParams();

    useGetAllCompanies();

    const salaryMin = useMemo(() => (lockedSalary ? (lockedSalary * 0.85).toFixed(2) : null), [lockedSalary]);
    const salaryMax = useMemo(() => (lockedSalary ? (lockedSalary * 1.15).toFixed(2) : null), [lockedSalary]);

    const fetchJobById = async () => {
        try {
            const res = await api.get(`${JOB_API_END_POINT}/getadmin/${id}`, { withCredentials: true });
            if (res.data.success) {
                const job = res.data.job;
                const applicantsExist = (job?.applications?.length || 0) > 0;
                setHasApplicants(applicantsExist);
                setLockedSalary(job?.lockedSalary || job?.salary || null);

                setInput({
                    title: job?.title || "",
                    description: job?.description || "",
                    requirements: Array.isArray(job?.requirements) ? job.requirements.join(", ") : "",
                    salary: job?.salary ?? "",
                    deadline: toDateTimeLocalValue(job?.deadline),
                    location: job?.location || "",
                    locationType: job?.locationType || "",
                    jobType: job?.jobType || "",
                    experience: job?.experienceLevel ?? "",
                    position: job?.position ?? "",
                    companyId: job?.company?._id || ""
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load job.");
            navigate("/admin/jobs");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchJobById();
    }, [id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const requiredTextFields = [
            input.title,
            input.description,
            input.requirements,
            input.location,
            input.locationType,
            input.jobType,
            input.deadline
        ];
        const hasMissingTextField = requiredTextFields.some((value) => String(value ?? "").trim() === "");
        if (hasMissingTextField || input.salary === "" || input.position === "" || input.experience === "") {
            toast.error("Please fill in all required fields.");
            return;
        }

        const salaryNumber = Number(input.salary);
        if (!Number.isFinite(salaryNumber) || salaryNumber <= 0) {
            toast.error("Salary must be a valid number in LPA.");
            return;
        }
        const positionNumber = Number(input.position);
        if (!Number.isFinite(positionNumber) || positionNumber <= 0) {
            toast.error("Number of positions must be greater than 0.");
            return;
        }
        const experienceNumber = Number(input.experience);
        if (!Number.isFinite(experienceNumber) || experienceNumber < 0) {
            toast.error("Experience level must be 0 or greater.");
            return;
        }
        const skillCount = parseSkills(input.requirements).length;
        if (skillCount <= 1 || skillCount > 10) {
            toast.error("Requirements must have at least 2 and at most 10 skills.");
            return;
        }

        const parsedSkills = parseSkills(input.requirements);
        const relevanceScore = calculateRelevanceScore(parsedSkills, input.title, input.description);
        let hasLowRelevance = false;
        if (relevanceScore !== null && relevanceScore < 0.6) {
            hasLowRelevance = true;
            const percent = Math.round(relevanceScore * 100);
            toast.warning(`Low relevance score (${percent}%). Consider aligning skills with the job title/description.`, {
                duration: 4000
            });
        }

        const payload = { ...input };
        if (String(payload.companyId || "").trim() === "") {
            delete payload.companyId;
        }
        payload.requirements = parsedSkills;

        try {
            setLoading(true);
            const res = await api.put(`${JOB_API_END_POINT}/update/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                const showSuccess = () => {
                    toast.success(res.data.message, { duration: 2500 });
                    navigate("/admin/jobs");
                };
                if (hasLowRelevance) {
                    setTimeout(showSuccess, 1200);
                } else {
                    showSuccess();
                }
            }
        } catch (error) {
            const serverMessage = error?.response?.data?.message || "Failed to update job.";
            const normalizedMessage = serverMessage.includes("Core requirement skills are locked")
                ? "Requirements must have at least 2 and at most 10 skills."
                : serverMessage;
            toast.error(normalizedMessage);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div>
                <Navbar />
                <div className='max-w-2xl mx-auto my-12 text-center text-gray-600'>Loading job...</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='max-w-4xl p-8 border border-gray-200 rounded-md shadow-lg'>
                    {input.deadline && new Date(input.deadline) < new Date() && (
                        <div className='mb-4 p-3 border border-gray-300 rounded bg-gray-100 text-sm text-gray-700'>
                            This job is archived because deadline is over. It is kept for history and existing applications, and is not publicly visible.
                        </div>
                    )}
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                disabled={hasApplicants}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>Requirements (comma separated)</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                            <p className="text-xs text-gray-500">Enter between 2 and 10 skills.</p>
                        </div>
                        <div>
                            <Label>Salary (LPA)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                min="0"
                                step="0.1"
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                            {hasApplicants && lockedSalary && (
                                <p className="text-xs text-gray-500">Allowed range: {salaryMin} - {salaryMax} LPA</p>
                            )}
                        </div>
                        <div>
                            <Label>Deadline</Label>
                            <Input
                                type="datetime-local"
                                name="deadline"
                                value={input.deadline}
                                onChange={changeEventHandler}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                disabled={hasApplicants}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Select
                                value={input.jobType}
                                onValueChange={(value) => setInput({ ...input, jobType: value })}
                                disabled={hasApplicants}
                            >
                                <SelectTrigger className="my-1">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {JOB_TYPE_OPTIONS.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Location Type</Label>
                            <Select
                                value={input.locationType}
                                onValueChange={(value) => setInput({ ...input, locationType: value })}
                                disabled={hasApplicants}
                            >
                                <SelectTrigger className="my-1">
                                    <SelectValue placeholder="Select location type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {LOCATION_TYPE_OPTIONS.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                disabled={hasApplicants}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>No of Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                disabled={hasApplicants}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        {companies.length > 0 && (
                            <div>
                                <Label>Company</Label>
                                <Select
                                    value={input.companyId}
                                    onValueChange={(value) => setInput({ ...input, companyId: value })}
                                    disabled={hasApplicants}
                                >
                                    <SelectTrigger className="my-1">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {loading
                        ? <Button className="w-full my-4"><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Please wait</Button>
                        : <Button type="submit" className="w-full my-4">Update Job</Button>}
                </form>
            </div>
        </div>
    )
}

export default EditJob
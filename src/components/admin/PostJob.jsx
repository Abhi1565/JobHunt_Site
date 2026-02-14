import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { JOB_TYPE_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/utils/jobFilters'

const companyArray = [];
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
    "devops engineer": ["docker", "kubernetes", "aws", "ci/cd"]
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

    if (mappedSkills.length > 0) {
        const matched = normalizedSkills.filter((skill) => mappedSkills.includes(skill)).length;
        return matched / mappedSkills.length;
    }

    const haystack = `${title || ""} ${description || ""}`.toLowerCase();
    const matched = normalizedSkills.filter((skill) => haystack.includes(skill)).length;
    return matched / normalizedSkills.length;
};

const PostJob = () => {
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
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredTextFields = [
            input.title,
            input.description,
            input.requirements,
            input.location,
            input.locationType,
            input.jobType,
            input.deadline,
            input.companyId
        ];
        const hasMissingTextField = requiredTextFields.some((value) => String(value ?? "").trim() === "");
        if (hasMissingTextField || input.salary === "" || input.position === "" || input.experience === "") {
            toast.error("Please fill in all required fields and select a company");
            return;
        }
        const salaryNumber = Number(input.salary);
        if (!Number.isFinite(salaryNumber) || salaryNumber <= 0) {
            toast.error("Salary must be a number in LPA (greater than 0).");
            return;
        }
        const experienceNumber = Number(input.experience);
        if (!Number.isFinite(experienceNumber) || experienceNumber < 0) {
            toast.error("Experience level must be 0 or greater.");
            return;
        }
        const positionNumber = Number(input.position);
        if (!Number.isFinite(positionNumber) || positionNumber <= 0) {
            toast.error("Number of positions must be greater than 0.");
            return;
        }
        const skillCount = parseSkills(input.requirements).length;
        if (skillCount <= 1 || skillCount > 10) {
            toast.error("Requirements must have at least 2 and at most 10 skills.");
            return;
        }

        const parsedSkills = parseSkills(input.requirements);
        const relevanceScore = calculateRelevanceScore(parsedSkills, input.title, input.description);
        const hasLowRelevance = relevanceScore < 0.6;
        if (hasLowRelevance) {
            const percent = Math.round(relevanceScore * 100);
            toast.warning(`Low relevance score (${percent}%). Consider aligning skills with the job title/description.`, {
                duration: 4000
            });
        }
        
        try {
            setLoading(true);
            const payload = { ...input, requirements: parsedSkills };
            console.log("Submitting job data:", payload);
            
            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
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
            console.log("Error posting job:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK') {
                toast.error("Network error: Please check if the backend server is running");
            } else {
                toast.error("An error occurred while posting the job");
            }
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit = {submitHandler} className='max-w-4xl p-8 border border-gray-200 rounded-md shadow-lg'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
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
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
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
                                placeholder="e.g., 8 or 8.5"
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                            <p className="text-xs text-gray-500">Enter salary in LPA only.</p>
                        </div>
                        <div>
                            <Label>Application Deadline</Label>
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
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Select onValueChange={(value) => setInput({ ...input, jobType: value })}>
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
                            <Select onValueChange={(value) => setInput({ ...input, locationType: value })}>
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
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Label>No of Postion</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="my-1 focus-visible:ring-offset-0 focus-visible:ring-0"
                            />
                        </div>
                        {
                            companies.length > 0 && (
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                companies.map((company) => {
                                                    return (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                    )
                                                })
                                            }

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div> 
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Post New Job</Button>
                    }
                    {
                        companies.length === 0 && <p className='my-3 text-xs font-bold text-center text-red-600'>*Please register a company first, before posting a jobs</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob

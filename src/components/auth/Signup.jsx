import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { Link, useNavigate } from "react-router-dom"
import { RadioGroup } from '../ui/radio-group'
import api from "../../utils/axios";
import { USER_API_END_POINT } from "../../utils/constant";
import store from '../../redux/store'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/authSlice'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [emailStatus, setEmailStatus] = useState({
        checking: false,
        exists: false,
        message: ""
    });
    const [showPassword, setShowPassword] = useState(false)
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    },[]);

    useEffect(() => {
        const email = input.email.trim();
        if (!email) {
            setEmailStatus({ checking: false, exists: false, message: "" });
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setEmailStatus({ checking: false, exists: false, message: "Invalid email format" });
            return;
        }

        const timer = setTimeout(async () => {
            setEmailStatus({ checking: true, exists: false, message: "Checking email..." });
            try {
                const res = await api.get(`${USER_API_END_POINT}/check-email`, {
                    params: { email }
                });
                if (res.data.exists) {
                    setEmailStatus({ checking: false, exists: true, message: "Email already exists" });
                } else {
                    setEmailStatus({ checking: false, exists: false, message: "Email available" });
                }
            } catch (error) {
                setEmailStatus({ checking: false, exists: false, message: "Unable to validate email" });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [input.email]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center mx-auto max-w-7xl'>
                <form onSubmit={submitHandler} className='w-1/2 p-4 m-10 border border-gray-200 rounded-md'>
                    <h1 className='mb-5 text-xl font-bold'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="palve"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="palve@gmail.com"
                        />
                        {emailStatus.message && (
                            <p
                                className={`text-xs mt-1 ${
                                    emailStatus.exists ||
                                    emailStatus.message === "Invalid email format" ||
                                    emailStatus.message === "Unable to validate email"
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                {emailStatus.message}
                            </p>
                        )}
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="9845321256"
                        />
                    </div><div className='my-2'>
                        <Label>Password</Label>
                        <div className='relative'>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="palve@gmail.com"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className='flex items-center gap-4 my-5'>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className='cursor-pointer'
                            />
                        </div>
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-4">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full my-4"
                                disabled={emailStatus.exists || emailStatus.checking}
                            >
                                Signup
                            </Button>
                        )
                    }
                    <span className='text-sm'>already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup
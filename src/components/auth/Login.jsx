import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner"
import { RadioGroup } from '../ui/radio-group'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/authSlice'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { setUser } from '../../redux/authSlice'
import store from '../../redux/store'

const Login = () => {

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center mx-auto max-w-7xl'>
                <form onSubmit={submitHandler} className='w-1/2 p-4 m-10 border border-gray-200 rounded-md'>
                    <h1 className='mb-5 text-xl font-bold'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="palve@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
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
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait </Button> : <Button type="submit" className="w-full my-4">Login</Button>
                    }
                    <div className='flex items-center justify-between text-sm'>
                        <Link to="/forgot-password" className='text-blue-600'>Forgot password?</Link>
                        <span>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

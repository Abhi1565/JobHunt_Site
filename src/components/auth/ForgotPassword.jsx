import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { USER_API_END_POINT } from "../../utils/constant"
import { toast } from "sonner"
import { Eye, EyeOff } from 'lucide-react'

const ForgotPassword = () => {
    const [step, setStep] = useState("request")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const requestOtp = async (e) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error("Email is required")
            return
        }
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email })
            if (res.data.success) {
                toast.success(res.data.message)
                setStep("reset")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        if (!email.trim() || !otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            toast.error("All fields are required")
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
                email,
                otp,
                newPassword
            })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center mx-auto max-w-7xl'>
                <form onSubmit={step === "request" ? requestOtp : resetPassword} className='w-1/2 p-4 m-10 border border-gray-200 rounded-md'>
                    <h1 className='mb-5 text-xl font-bold'>Forgot Password</h1>

                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="palve@gmail.com"
                        />
                    </div>

                    {step === "reset" && (
                        <>
                            <div className='my-2'>
                                <Label>OTP</Label>
                                <Input
                                    type="text"
                                    value={otp}
                                    name="otp"
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                />
                            </div>
                            <div className='my-2'>
                                <Label>New Password</Label>
                                <div className='relative'>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        name="newPassword"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New password"
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
                            <div className='my-2'>
                                <Label>Confirm Password</Label>
                                <div className='relative'>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        name="confirmPassword"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <Button type="submit" className="w-full my-4" disabled={loading}>
                        {step === "request" ? "Send OTP" : "Reset Password"}
                    </Button>

                    <div className='text-sm'>
                        <Link to="/login" className='text-blue-600'>Back to login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children, role = null}) => {
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    useEffect(()=>{
        // If no user is logged in, redirect to login
        if(user === null){
            navigate("/login");
            return;
        }
        
        // If a specific role is required and user doesn't have that role, redirect
        if(role && user.role !== role){
            navigate("/");
            return;
        }
    },[user, role, navigate]);

    return (
        <>
        {children}
        </>
    )
};

export default ProtectedRoute;
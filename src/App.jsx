import { createBrowserRouter } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import  Home from './components/Home'
import { RouterProvider } from 'react-router-dom'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/jobs',
    element:<Jobs/>
  },
  {
    path:'/description/:id',
    element:<JobDescription/> 
  },
  {
    path:'/browse',
    element:<Browse/>
  },
  {
    path:'/profile',
    element:<ProtectedRoute><Profile/></ProtectedRoute>
  },
  // admin ke liye yha se start hoga
  {
     path:"/admin/companies",
     element:<ProtectedRoute role="recruiter"><Companies/></ProtectedRoute>
  },
  {
     path:"/admin/companies/create",
     element:<ProtectedRoute role="recruiter"><CompanyCreate/></ProtectedRoute>
  },
  {
     path:"/admin/companies/:id",
     element:<ProtectedRoute role="recruiter"><CompanySetup/></ProtectedRoute>
  },
  {
     path:"/admin/jobs",
     element:<ProtectedRoute role="recruiter"><AdminJobs/></ProtectedRoute>
  },
  {
     path:"/admin/jobs/create",
     element:<ProtectedRoute role="recruiter"><PostJob/></ProtectedRoute>
  },
  {
     path:"/admin/jobs/:id/applicants",
     element:<ProtectedRoute role="recruiter"><Applicants/></ProtectedRoute>
  }
])

function App() {

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App

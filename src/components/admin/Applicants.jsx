<<<<<<< HEAD
import React, { useCallback, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
=======
import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import api from '@/utils/axios';
>>>>>>> 08e2601fbfa0cc52cb5faeea23769568645c26e4
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);

    const fetchAllApplicants = useCallback(async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            dispatch(setAllApplicants(res.data.job));
        } catch (error) {
            console.log(error);
        }
    }, [params.id, dispatch]);

    useEffect(() => {
        fetchAllApplicants();
    }, [fetchAllApplicants]);
    return (
        <div>
            <Navbar />
            <div className='mx-auto max-w-7xl'>
                <h1 className='my-5 text-xl font-bold'>Applicants {applicants?.applications?.length}</h1>
                <ApplicantsTable refreshApplicants={fetchAllApplicants} />
            </div>
        </div>
    )
}

export default Applicants

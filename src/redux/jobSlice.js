import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
    name:'job',
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null,
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        filteredJobs:[], // New state for filtered jobs
        originalJobs:[], // Keep original jobs separate
        jobFilters:{
            locations:[],
            industries:[],
            jobTypes:[],
            locationTypes:[],
            salaryRanges:[]
        }
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
           state.allJobs = action.payload; 
        },
        setSingleJob:(state,action) => {
           state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
           state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
           state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
           state.allAppliedJobs = action.payload;
        },
                setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        setFilteredJobs:(state,action) => {
            state.filteredJobs = action.payload;
        },
        setOriginalJobs:(state,action) => {
            state.originalJobs = action.payload;
        },
        setJobFilters:(state,action) => {
            state.jobFilters = action.payload;
        }
    }
});
export const {
   setAllJobs, 
   setSingleJob, 
   setAllAdminJobs, 
   setSearchJobByText, 
   setAllAppliedJobs,
   setSearchedQuery,
   setFilteredJobs,
   setOriginalJobs,
   setJobFilters
} = jobSlice.actions;
export default jobSlice.reducer;

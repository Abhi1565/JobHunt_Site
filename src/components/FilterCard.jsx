import React from 'react'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setJobFilters } from '@/redux/jobSlice'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { INDUSTRY_OPTIONS, JOB_TYPE_OPTIONS, LOCATION_OPTIONS, LOCATION_TYPE_OPTIONS, SALARY_RANGES } from '@/utils/jobFilters'

const filterData = [
  { filterType: "Location", key: "locations", array: LOCATION_OPTIONS },
  { filterType: "Location Type", key: "locationTypes", array: LOCATION_TYPE_OPTIONS },
  { filterType: "Job Type", key: "jobTypes", array: JOB_TYPE_OPTIONS },
  { filterType: "Industry", key: "industries", array: INDUSTRY_OPTIONS },
  { filterType: "Salary Range", key: "salaryRanges", array: SALARY_RANGES }
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const { jobFilters = { locations: [], industries: [], jobTypes: [], locationTypes: [], salaryRanges: [] } } = useSelector(store => store.job || {});
  
  const toggleFilter = (key, value) => {
      const current = jobFilters[key] || [];
      const nextValue = current[0] === value ? [] : [value];
      dispatch(setJobFilters({ ...jobFilters, [key]: nextValue }));
  };
  
  const clearFilter = () => {
      dispatch(setJobFilters({
          locations:[],
          industries:[],
          jobTypes:[],
          locationTypes:[],
          salaryRanges:[]
      }));
  };
  
  const hasActiveFilters =
      (jobFilters.locations?.length || 0) +
      (jobFilters.locationTypes?.length || 0) +
      (jobFilters.jobTypes?.length || 0) +
      (jobFilters.industries?.length || 0) +
      (jobFilters.salaryRanges?.length || 0) > 0;
  
  return (
    <div className='w-full p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-bold text-gray-900'>Filter Jobs</h1>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilter}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <hr className='mb-4'/>
      
      {filterData.map((data, index) => (
          <div key={index} className='mb-6 last:mb-0'>
            <h2 className='text-md font-semibold text-gray-800 mb-3'>{data.filterType}</h2>
            <div className='space-y-2'>
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`
                return (
                  <div key={itemId} className='flex items-center space-x-2'>
                    <input
                      type="checkbox"
                      id={itemId}
                      checked={(jobFilters[data.key] || []).includes(item)}
                      onChange={() => toggleFilter(data.key, item)}
                      className="h-4 w-4 accent-[#6A38C2] border-gray-300"
                    />
                    <Label 
                      htmlFor={itemId}
                      className='text-sm text-gray-700 cursor-pointer hover:text-[#6A38C2] transition-colors'
                    >
                      {item}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      
      {hasActiveFilters && (
        <div className='mt-4 p-3 bg-[#6A38C2]/10 rounded-lg border border-[#6A38C2]/20'>
          <p className='text-sm text-[#6A38C2] font-medium'>
            Active Filters:{" "}
            <span className='font-semibold'>
              {[...(jobFilters.locations || []), ...(jobFilters.locationTypes || []), ...(jobFilters.jobTypes || []), ...(jobFilters.industries || []), ...(jobFilters.salaryRanges || [])].join(", ")}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export default FilterCard
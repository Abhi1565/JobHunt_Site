import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Button } from './ui/button'
import { X } from 'lucide-react'

const filterData = [
  {
     filterType:"Location",
     array:["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
     filterType:"Industry",
     array:["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },{
     filterType:"Salary Range",
     array:["0-5 LPA", "5-10 LPA", "10-20 LPA", "20+ LPA"]
  }
]

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  
  const changeHandler = (value) => {
      // If clicking the same value, deselect it
      if (selectedValue === value) {
          setSelectedValue('');
          dispatch(setSearchedQuery(''));
      } else {
          setSelectedValue(value);
          dispatch(setSearchedQuery(value));
      }
  }
  
  const clearFilter = () => {
      setSelectedValue('');
      dispatch(setSearchedQuery(''));
  }
  
  return (
    <div className='w-full p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-bold text-gray-900'>Filter Jobs</h1>
        {selectedValue && (
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
      
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index} className='mb-6 last:mb-0'>
            <h2 className='text-md font-semibold text-gray-800 mb-3'>{data.filterType}</h2>
            <div className='space-y-2'>
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`
                return (
                  <div key={itemId} className='flex items-center space-x-2'>
                    <RadioGroupItem 
                      value={item} 
                      id={itemId}
                      className="text-[#6A38C2] border-gray-300"
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
      </RadioGroup>
      
      {selectedValue && (
        <div className='mt-4 p-3 bg-[#6A38C2]/10 rounded-lg border border-[#6A38C2]/20'>
          <p className='text-sm text-[#6A38C2] font-medium'>
            Active Filter: <span className='font-semibold'>{selectedValue}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default FilterCard
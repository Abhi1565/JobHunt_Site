import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer"
]

const CategoryCarousel = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const searchJobHandler = (query) => {
    // Set the exact category name as search query
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <div>
      <Carousel className='w-full max-w-xl mx-auto my-20'>
        <CarouselContent>
          {
            category.map((cat, index) => (
              <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                <Button 
                  onClick={() => searchJobHandler(cat)} 
                  variant='outline' 
                  className='rounded-full hover:bg-[#6A38C2] hover:text-white transition-colors'
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default CategoryCarousel
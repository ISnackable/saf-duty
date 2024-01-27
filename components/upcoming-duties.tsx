'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from '@/components/ui/carousel';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function UpcomingDuties() {
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 'auto',
        }}
      >
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='basis-5/6 md:basis-1/2 lg:basis-1/3'
            >
              <div className='p-1'>
                <Card>
                  <CardContent className='flex h-[280px] items-center justify-center p-6'>
                    <span className='text-7xl font-semibold'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots
          dotsClassName='bg-primary w-4 h-1'
          className='z-10 -mt-3'
          gap='lg'
        />
      </Carousel>

      <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
        Also on duty
      </h4>
      <Carousel
        className='!m-0'
        opts={{
          align: 'start',
          dragFree: true,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 12 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='flex basis-[21%] flex-col items-center justify-center border-none p-4 sm:basis-[11%]'
            >
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className='py-1 text-center text-sm font-medium leading-none'>
                Shadcn
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}

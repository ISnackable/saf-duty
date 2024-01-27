'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// import { UpcomingDuties } from './upcoming-duties';

export function DashboardOverview() {
  return (
    <>
      <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
        Upcoming duties
      </h4>
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

      <Separator />

      <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
        Duties completed
      </h4>
      <Progress value={13} className='w-full' />

      <Separator />

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
          {Array.from({ length: 24 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='flex basis-[21%] flex-col items-center justify-center border-none p-4 sm:basis-[11%]'
            >
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/lorelei-neutral/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${index}`}
                />
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

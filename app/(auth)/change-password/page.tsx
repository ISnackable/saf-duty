import { type Metadata } from 'next';
import Image from 'next/image';

import { UserChangeForm } from '@/components/user-change-form';
import svgImage from '@/public/undraw_arrived_re_t2bw.svg';

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Update Your Password',
};

export default function UpdatePasswordPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <div className='relative h-[25vh]'>
            <Image
              priority
              src={svgImage}
              fill={true}
              alt='Undraw personal information logo'
              className='object-contain'
            />
          </div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Update Your Password
          </h1>
          <p className='text-sm text-muted-foreground'>Set a new password</p>
        </div>
        <UserChangeForm />
      </div>
    </div>
  );
}

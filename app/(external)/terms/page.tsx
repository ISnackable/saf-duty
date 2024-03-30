import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import svgImage from '@/public/undraw_personal_information.svg';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for this website',
};

export default function TermsPage() {
  return (
    <section className='container mx-auto py-8'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Terms and Conditions
      </h1>
      <p className='mb-4 text-sm text-muted-foreground'>
        <em>Last updated: March 30, 2024</em>
      </p>

      <div style={{ position: 'relative', height: '30vh' }}>
        <Image
          src={svgImage}
          fill={true}
          alt='Undraw personal information logo'
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Accepting these Terms
      </h2>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        If you access or use the Service, it means you agree to be bound by all
        of the terms below. So, before you use the Service, please read all of
        the terms. If you don&apos;t agree to all of the terms below, please do
        not use the Service
      </p>

      <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
        <li>You are responsible for your own actions and any consequences</li>
        <li>
          You agree to maintain the security of your password and accept all
          risks of unauthorized access to any data or other information you
          provide to the Service.
        </li>
        <li>
          You agree not to impersonate or post on behalf of any person or entity
          or otherwise misrepresent your affiliation with a person or entity;
        </li>
        <li>
          You agree not to not upload any image that is obscene or inappropriate
          as the service allows you to upload an avatar image.
        </li>
        <li>
          You agree not to circumvent or attempt to circumvent any filtering,
          security measures, rate limits or other features designed to protect
          the Service, users of the Service, or third parties.
        </li>
      </ul>

      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Privacy Policy
      </h2>

      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        You may want to also read the{' '}
        <Link href='/privacy'>privacy policy</Link> page.
      </p>

      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Changes to these Terms
      </h2>

      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        I may update this Terms as needed to comply with relevant regulations
        and reflect any new practices at any time.
      </p>

      <div className='mt-4 flex flex-col items-center'>
        <Button asChild variant='outline'>
          <Link href='/'>Take me back to home page</Link>
        </Button>
      </div>
    </section>
  );
}

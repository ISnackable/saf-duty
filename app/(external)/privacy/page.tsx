import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import svgImage from '@/public/undraw_personal_information.svg';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for this website',
};

export default function PrivacyPage() {
  return (
    <section className='container mx-auto py-8'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Privacy policy
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
        In short
      </h2>
      <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
        <li> Personal information like name and email is collected</li>
        <li>
          Only neccessary cookies is stored in the browser, like authentication
          tokens
        </li>
        <li>No information is shared with, sent to or sold to third-parties</li>
        <li>No information is shared with advertising companies</li>
        <li>
          No information is mined and harvested for personal and behavioural
          trends
        </li>
        <li>No information is monetized</li>
      </ul>
      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        What I collect and why
      </h2>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Our guiding principle is to collect only what I need. Here&apos;s what
        that means in practice:
      </p>
      <h3 className='mt-4 scroll-m-20 text-2xl font-semibold tracking-tight'>
        Account information
      </h3>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        To use this application, users have to register an account, providing
        details such as their name and email address. This information is used
        to identify the user and to provide a personalized experience as well as
        to be used to generate a duty roster.
      </p>
      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Information I do not collect
      </h2>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        When you browse to my pages, your browser automatically shares certain
        information such as which operating system and browser version you are
        using. However, I <strong>do not</strong> track and collect that
        information.
      </p>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        I don&apos;t collect any characteristics of protected classifications
        including age, race, gender, religion, sexual orientation, gender
        identity, gender expression, or physical and mental abilities or
        disabilities.{' '}
        <strong>
          This website is not capable collecting such informations
        </strong>
        .
      </p>
      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        When I access or share your information
      </h2>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Our default practice is to not access your information. I am not able to
        tie this information to you as an individual. The only times I&apos;ll
        ever access or share your info is:
      </p>
      <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
        <li>
          <strong>For duty roster generation purposes.</strong> It is only used
          to view generate a duty roster, in such that the only information I
          would access is your name.
        </li>
      </ul>
      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        How I secure your data
      </h2>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        All data is encrypted via{' '}
        <Link href='https://en.wikipedia.org/wiki/Transport_Layer_Security'>
          SSL/TLS
        </Link>{' '}
        when transmitted from your browser to{' '}
        <Link href='https://supabase.com/'>supabase</Link> and{' '}
        <Link href='https://vercel.com/'>vercel</Link> server.
      </p>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Account information is stored in a database hosted by{' '}
        <Link href='https://supabase.com/'>supabase</Link> and is encrypted
        using <Link href='https://argon2.online/'>bcrypt2</Link> hashing
        algorithm.
      </p>

      <h2 className='mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Changes &amp; questions
      </h2>

      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        I may update this policy as needed to comply with relevant regulations
        and reflect any new practices.
      </p>

      <div className='mt-4 flex flex-col items-center'>
        <Button asChild variant='outline'>
          <Link href='/'>Take me back to home page</Link>
        </Button>
      </div>
    </section>
  );
}

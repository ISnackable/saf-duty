import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import svgImage from '@/public/undraw_questions_re_1fy7.svg';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions for this website',
};

export default function FAQPage() {
  return (
    <section className='container mx-auto py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-full flex-col items-center justify-center gap-x-16 gap-y-5 max-lg:max-w-2xl lg:flex-row lg:justify-between xl:gap-28'>
          <div className='w-full lg:w-1/2'>
            <Image
              src={svgImage}
              alt='FAQ tailwind section'
              className='w-full'
            />
          </div>
          <div className='w-full lg:w-1/2'>
            <div className='lg:max-w-xl'>
              <div className='mb-6 lg:mb-16'>
                <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                  Frequently Asked Questions
                </h1>
              </div>

              <Accordion
                type='single'
                collapsible
                className='border-t border-gray-200 dark:border-gray-800'
              >
                <AccordionItem value='item-1'>
                  <AccordionTrigger>
                    How can I reset my password?
                  </AccordionTrigger>
                  <AccordionContent>
                    To reset your password, visit the login page and click on
                    the &quot;
                    <Link
                      href='/reset-password'
                      className='text-brand text-sm underline underline-offset-4'
                      tabIndex={-1}
                    >
                      Forgot password
                    </Link>
                    &quot; link. You will receive an email with instructions on
                    how to reset your password. If you do not receive an email,
                    please check your spam folder or contact our support team. .
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-2'>
                  <AccordionTrigger>
                    Whom do I contact if I find a bug on the website?
                  </AccordionTrigger>
                  <AccordionContent>
                    If you find a bug regarding the website, or if you want to
                    suggest an improvement, do contact the developer{' '}
                    <Link
                      href='https://github.com/ISnackable/'
                      className='font-medium text-primary underline underline-offset-4'
                    >
                      @ISnackable
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 flex flex-col items-center'>
        <Button asChild variant='outline'>
          <Link href='/'>Take me back to home page</Link>
        </Button>
      </div>
    </section>
  );
}

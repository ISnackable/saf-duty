import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ClienTestPage } from './client-page';

export default async function Index() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex items-center space-y-2 w-full'>
        <Icons.edit className='inline-block w-8 h-8 mr-3 align-middle items-center' />
        <h1 className='scroll-m-20 border-b pb-2 text-2xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl grow'>
          Index Page
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>WORDS..</p>

      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <ClienTestPage />
    </div>
  );
}

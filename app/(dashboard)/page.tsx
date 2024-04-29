import type { Metadata } from 'next';

import { DashboardOverview } from '@/components/dashboard-overview';

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Dashboard overview for duty personnels',
};

export default async function Index() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <DashboardOverview />
    </div>
  );
}

import type { Metadata } from 'next';

import { Icons } from '@repo/design-system/components/icons';

// import { SWRProvider } from '@/providers/swr-provider';
// import { auth } from '@repo/auth/server';
// import { headers } from 'next/headers';
// import { redirect } from 'next/navigation';

// import { getRostersByOrgId } from '@/lib/data';
// import { getMonthYearParams } from '@/lib/helper';
import { DutyRoster } from '../components/duty-roster';

// interface DutyRosterPageProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

export const metadata: Metadata = {
  title: 'Duty Roster',
  description: 'View the duty roster and request for swap duty.',
};

// async function getRosters(orgId: string, month: string, year: string) {
//   const data = await getRostersByOrgId(orgId, month, year);

//   return {
//     data,
//     status: 'success',
//     message: 'Successfully retrieved roster from the server',
//   };
// }

export default function DutyRosterPage() {
  // const { month, year } = getMonthYearParams(await searchParams);
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!session) {
  //   redirect('/login');
  // }

  // const activeOrganizationId = session.session.activeOrganizationId;

  // if (!activeOrganizationId) {
  //   redirect('/login');
  // }

  return (
    // <SWRProvider
    //   value={{
    //     fallback: {
    //       [`/api/organizations/${activeOrganizationId}/rosters?month=${month}&year=${year}`]:
    //         getRosters(activeOrganizationId, month, year),
    //     },
    //   }}
    // >
    <div className="space-y-4 p-8 pt-4">
      <div data-tour="duty-roster-page">
        <div className="flex w-full items-center space-y-2">
          <Icons.calendar className="mr-3 inline-block h-8 w-8 items-center align-middle" />
          <h1 className="grow scroll-m-20 border-b pb-2 font-extrabold text-2xl tracking-tight sm:text-4xl lg:text-5xl">
            Duty Roster
          </h1>
        </div>
        <p className="text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6">
          View the duty roster, below the date indicate the duty personnel while
          the circle bracket indicates the duty stand in personnel. Click on the
          date to request for swap duty.
        </p>
      </div>
      <DutyRoster />
    </div>
    // </SWRProvider>
  );
}

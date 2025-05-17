'use client';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

// import { updateOnboarded } from '@/app/(dashboard)/actions';
import '@/app/driverjs.css';
// import { useSession } from '@repo/auth/client';
// import { isDemoUser } from '@repo/auth/lib/utils';
import { useMediaQuery } from '@repo/design-system/hooks/use-media-query';
import { site } from '@repo/site-config';

export function DriverTour() {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isXLDesktop = useMediaQuery('(max-width: 1280px)');
  const [isPending, startTransition] = useTransition();
  // const { data: session } = useSession();

  const [adjacent, setAdjacent] = useState<'next' | 'previous'>('next');

  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,
    showButtons: ['next', 'previous'],
    allowClose: false,
    steps: [
      {
        popover: {
          title: `Welcome to ${site.name} 🎉`,
          description: 'Let us walk you through a short tour of the app.',
        },
      },
      {
        element: '[data-tour="home-page"]',
        popover: {
          title: 'Overview of the Dashboard 📊',
          description:
            "This is the dashboard, it's where you can see an overview of your duties. Such as upcoming duties, duties completed, and also who are on duty.",
        },
      },
      {
        element:
          isDesktop && isXLDesktop
            ? '[data-tour="side-nav-button"]'
            : isDesktop
              ? '[data-tour="side-nav"]'
              : '[data-tour="bottom-nav"]',
        popover: {
          title: 'Navigation 🚀',
          description:
            'This is the navigation bar, you can use it to navigate to different parts of the app. Quite self-explanatory.',
        },
      },
      {
        element: '[data-tour="header"]',
        popover: {
          title: 'User Options 🧑',
          description:
            'Logout, switch themes, and view your profile here. You can also install the app on your device for notification.',
          onNextClick: () => navigateAndMove('/duty-roster', 'next'),
          side: 'top',
          align: 'end',
        },
      },
      // This tour might not work as loading.tsx is replaced
      {
        element: '[data-tour="duty-roster-page"]',
        popover: {
          title: 'Duty Roster 📅',
          description:
            'You can view the duty roster here. Click on the date to request to swap duty.',
          onPrevClick: () => navigateAndMove('/', 'previous'),
          onNextClick: () => navigateAndMove('/manage-blockouts', 'next'),
        },
      },
      {
        element: '[data-tour="manage-blockouts-page"]',
        popover: {
          title: 'Manage Blockouts 🚫',
          description:
            'Here you manage your blockouts. Blockouts are days where you are not available for duty. You can add, edit, and delete blockouts here.',
          onPrevClick: () => navigateAndMove('/duty-roster', 'previous'),
        },
      },
      {
        element: '[data-tour="manage-blockouts-save-btn-page"]',
        popover: {
          title: "Don't forget to save 📝",
          description:
            'After you have edited your blockouts, remember to click save. Otherwise, they will not be updated.',
        },
      },
      {
        popover: {
          title: "That's all 😎",
          description:
            'Pretty much all you roughly need to know to get started!',
        },
        // TODO: Uncomment this when we have a way to track if the user has completed the tour
        // onDeselected: () => {
        //   if (session && !isDemoUser(session.user.id)) updateOnboarded(true);
        // },
      },
    ],
  });

  // It is important to navigate to the next page before moving to the next step
  function navigateAndMove(path: string, adjacent: 'next' | 'previous') {
    startTransition(() => {
      // Navigate to another page
      setAdjacent(adjacent);
      router.push(path);
    });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isPending) {
      adjacent === 'next' ? driverObj.moveNext() : driverObj.movePrevious();
    }
  }, [isPending]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Start the tour
    window.scrollTo(0, 0);
    router.replace('/');
    driverObj.drive();

    return () => driverObj.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div data-tour-wrapper="" />;
}

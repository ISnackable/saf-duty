'use client';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { updateOnboarded } from '@/app/(dashboard)/actions';
import '@/app/driverjs.css';
import { useMediaQuery } from '@/hooks/use-media-query';
import { name } from '@/lib/config';

export function DriverTour() {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isXLDesktop = useMediaQuery('(max-width: 1280px)');
  const [isPending, startTransition] = useTransition();

  const [adjacent, setAdjacent] = useState<'next' | 'previous'>('next');

  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,
    showButtons: ['next', 'previous'],
    allowClose: false,
    steps: [
      {
        popover: {
          title: `Welcome to ${name} 🎉`,
          description: 'Let us walk you through a short tour of the app.',
        },
      },
      {
        element: '[data-tour="home-page"]',
        popover: {
          title: 'Overview of the Dashboard 📊',
          description:
            "This is the dashboard, it's where you can see an overview of your duties. Such as upcoming duties, duties completed, and also who are on duty.",
          side: 'left',
          align: 'start',
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
        },
      },
      // This tour might not work as loading.tsx is replaced
      {
        element: '[data-tour="duty-roster-page"]',
        popover: {
          title: 'Duty Roster 📅',
          description:
            'You can view the duty roster here. Click on the date to request to swap duty.',
          side: 'top',
          align: 'start',
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
          side: 'right',
          align: 'start',
          onPrevClick: () => navigateAndMove('/duty-roster', 'previous'),
        },
      },
      {
        popover: {
          title: 'Yeah 😎',
          description: 'That is all you roughly need to know to get started!',
        },
        onDeselected: () => {
          updateOnboarded(true);
        },
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

  useEffect(() => {
    if (!isPending) {
      adjacent === 'next' ? driverObj.moveNext() : driverObj.movePrevious();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  useEffect(() => {
    // Start the tour
    router.replace('/');
    driverObj.drive();

    return () => driverObj.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div data-tour-wrapper=''></div>;
}

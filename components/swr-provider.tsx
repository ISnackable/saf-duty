'use client';

import * as React from 'react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/lib/fetcher';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetcher(resource, init).then((data: any) => data.data),
      }}
    >
      {children}
    </SWRConfig>
  );
}

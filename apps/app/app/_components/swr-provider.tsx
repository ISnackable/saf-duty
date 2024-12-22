'use client';

import { betterFetch } from '@better-fetch/fetch';
import type * as React from 'react';
import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          betterFetch(resource, init).then((res) => res.json()),
      }}
    >
      {children}
    </SWRConfig>
  );
}

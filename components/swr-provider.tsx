'use client';

import * as React from 'react';
import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init)
            .then((res) => res.json())
            .then((data) => data.data),
      }}
    >
      {children}
    </SWRConfig>
  );
}

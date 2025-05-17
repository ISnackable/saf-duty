'use client';

import type * as React from 'react';
import { SWRConfig } from 'swr';
import type { SWRConfiguration } from 'swr';

interface SWRProviderProps {
  value?: SWRConfiguration;
  readonly children: React.ReactNode;
}

export function SWRProvider({ value, children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) =>
            res.json().then((data) => data.data)
          ),
        ...value,
      }}
    >
      {children}
    </SWRConfig>
  );
}

'use client';

import Script from 'next/script';
import * as React from 'react';
import { Z3Button } from './z3';

export function DutyRoster() {
  const [status, setStatus] = React.useState('loading');

  return (
    <>
      <Script src="/z3-built.js" />

      <div className="mx-auto max-w-xl items-center justify-center p-10">
        Status: {status}, Time taken: <Z3Button />
      </div>
    </>
  );
}

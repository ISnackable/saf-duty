'use client';
import { testZ3 } from '@/lib/z3';
import Script from 'next/script';
import * as React from 'react';
export function DutyRoster() {
  const [status, setStatus] = React.useState('loading');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    // @ts-ignore
    if (!global.initZ3) return;
    testZ3();
  }, [status]);

  return (
    <>
      <Script src="/z3-built.js" onLoad={() => setStatus('loaded')} />

      <div className="mx-auto min-h-[350px] max-w-xl items-center justify-center p-10">
        TEST
      </div>
    </>
  );
}

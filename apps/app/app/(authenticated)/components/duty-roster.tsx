'use client';
import { testZ3 } from '@/lib/z3';
import { Button } from '@repo/design-system/components/ui/button';
import Script from 'next/script';
import * as React from 'react';
export function DutyRoster() {
  const [status, setStatus] = React.useState('loading');
  const [timeTaken, setTimeTaken] = React.useState(0);
  const wasCalled = React.useRef(false);

  async function test() {
    // @ts-ignore
    if (!global.initZ3) return;
    const start = performance.now();

    const result = await testZ3();

    const end = performance.now();

    setTimeTaken(end - start);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;

    test();
  }, [status]);

  return (
    <>
      <Script src="/z3-built.js" onLoad={() => setStatus('loaded')} />

      <div className="mx-auto max-w-xl items-center justify-center p-10">
        Status: {status}, Time taken: {timeTaken}
      </div>

      <Button onClick={() => test()}>Reload</Button>
    </>
  );
}

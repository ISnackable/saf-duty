import { cleanUpZ3, testZ3 } from '@/lib/z3';
import * as React from 'react';

import { Button } from '@repo/design-system/components/ui/button';

export function Z3Button() {
  const wasCalled = React.useRef(false);
  const [isPending, startTransition] = React.useTransition();
  const [timeTaken, setTimeTaken] = React.useState(0);

  function test() {
    // @ts-ignore
    if (!global.initZ3 || isPending) {
      console.log('Z3 not loaded yet');
      return;
    }

    startTransition(async () => {
      const start = performance.now();

      const result = await testZ3();

      const end = performance.now();

      setTimeTaken(end - start);
    });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;

    return () => {
      console.log('cleaning up');
      cleanUpZ3();
    };
  }, []);

  return <Button onClick={() => test()}>{timeTaken}</Button>;
}

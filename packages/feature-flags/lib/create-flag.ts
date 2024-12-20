import { auth } from '@repo/auth/server';
import { unstable_flag as flag } from '@vercel/flags/next';
import { headers } from 'next/headers';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const session = await auth.api.getSession({
        headers: await headers(), // from next/headers
      });

      const userId = session?.user?.id;

      if (!userId) {
        return this.defaultValue as boolean;
      }

      // TODO: Implement feature flag logic here
      const isEnabled = false;

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });

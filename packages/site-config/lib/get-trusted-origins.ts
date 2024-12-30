import { getSiteConfig } from './get-config-value';

const domain: string = getSiteConfig('domain');

export function getTrustedOrigins(): string[] {
  const origins = ['http://localhost:3000', `https://${domain}`];
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    origins.push(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`);
  }
  if (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) {
    origins.push(`https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`);
  }
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    origins.push(
      `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    );
  }
  return origins;
}

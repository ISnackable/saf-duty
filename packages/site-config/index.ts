import { getSiteConfig } from './lib/get-config-value';

export const environment = process.env.NODE_ENV || 'development';
export const isDev = environment === 'development';

// general site config
const name: string = getSiteConfig('name');
const shortName: string = getSiteConfig('shortName');
const domain: string = getSiteConfig('domain');
const description: string = getSiteConfig('description', 'Default description');

export const host = isDev
  ? 'http://localhost:3000'
  : // biome-ignore lint/nursery/noNestedTernary: Elegant solution
    process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `https://${domain}`;

export const trustedOrigins = [
  host,
  `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
];

export const demo: { id: string; email: string; password: string } =
  getSiteConfig('demo', {
    id: '',
    email: '',
    password: '',
  });

export const site = {
  name,
  shortName,
  domain,
  description,
};

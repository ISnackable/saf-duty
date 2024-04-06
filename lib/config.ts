import { getEnv, getSiteConfig } from '@/lib/get-config-value';

export const environment = process.env.NODE_ENV || 'development';
export const isDev = environment === 'development';

// general site config
export const name: string = getSiteConfig('name');
export const shortName: string = getSiteConfig('shortName');
export const domain: string = getSiteConfig('domain');
export const description: string = getSiteConfig(
  'description',
  'Default description'
);

export const demo: { id: string; email: string } = getSiteConfig('demo', {
  id: '',
  email: '',
});

// ----------------------------------------------------------------------------

export const isServer = typeof window === 'undefined';

export const port = getEnv('PORT', '3000');
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`;
export const apiHost = isDev
  ? host
  : `https://${process.env.VERCEL_URL || domain}`;

export const apiBaseUrl = `/api`;

export const api = {
  rosters: `${apiBaseUrl}/rosters`,
  profiles: `${apiBaseUrl}/profiles`,
};

// ----------------------------------------------------------------------------

export const site = {
  name,
  shortName,
  domain,
  description,
};

export const enableVercelAnalytics: boolean = getSiteConfig(
  'enableVercelAnalytics',
  false
);
export const enableVercelSpeedInsights: boolean = getSiteConfig(
  'enableVercelSpeedInsights',
  false
);

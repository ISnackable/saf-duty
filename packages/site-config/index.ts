import { getSiteConfig } from '@/lib/get-config-value';

export interface SiteConfig {
  name: string;
  shortName: string;
  domain: string;
  description?: string;

  demo: {
    id: string;
    email: string;
    password: string;
  };
}

// general site config
const name: string = getSiteConfig('name');
const shortName: string = getSiteConfig('shortName');
const domain: string = getSiteConfig('domain');
const description: string = getSiteConfig('description', 'Default description');

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

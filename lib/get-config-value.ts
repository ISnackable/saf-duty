/* eslint-disable unused-imports/no-unused-vars */
import { SiteConfig } from '@/lib/site-config';
import rawSiteConfig from '@/site.config';

if (!rawSiteConfig) {
  throw new Error(`Config error: invalid site.config.ts`);
}

// allow environment variables to override site.config.ts
let siteConfigOverrides: SiteConfig = {} as any;

try {
  if (process.env.NEXT_PUBLIC_SITE_CONFIG) {
    siteConfigOverrides = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG);
  }
} catch (err) {
  console.error('Invalid config "NEXT_PUBLIC_SITE_CONFIG" failed to parse');
  throw err;
}

const siteConfig: SiteConfig = {
  ...rawSiteConfig,
  ...siteConfigOverrides,
};

export function getSiteConfig<T>(key: keyof SiteConfig, defaultValue?: T): T {
  const value = siteConfig[key];

  if (value !== undefined) {
    return value as T;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required site config value "${key}"`);
}

export function getEnv(
  key: string,
  defaultValue?: null,
  env?: NodeJS.ProcessEnv
): null;
export function getEnv(
  key: string,
  defaultValue?: string,
  env?: NodeJS.ProcessEnv
): string;
export function getEnv(
  key: string,
  defaultValue?: string | null,
  env = process.env
): string | null {
  const value = env[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required env variable "${key}"`);
}

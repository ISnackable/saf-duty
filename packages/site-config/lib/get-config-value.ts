import rawSiteConfig from '@/../../site.config';
import type { SiteConfig } from '..';

if (!rawSiteConfig) {
  throw new Error('Config error: invalid site.config.ts');
}

const siteConfig: SiteConfig = {
  ...rawSiteConfig,
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

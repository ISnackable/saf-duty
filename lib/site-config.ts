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

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config;
};

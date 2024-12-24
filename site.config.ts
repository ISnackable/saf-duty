import type { SiteConfig } from '@repo/site-config/types';

export default {
  // basic site info (required)
  name: 'AFPN CDO',
  shortName: 'AFPN',
  domain: 'localhost:3000',
  description: 'The official app of the AFPN CDO',

  demo: {
    id: 'AuHy9drLwy1vBDPtH4B5Nm8oundErr9j',
    email: 'demo@example.com',
    password: 'Password@1234',
  },
} satisfies SiteConfig;

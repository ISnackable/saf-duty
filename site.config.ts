import { siteConfig } from '@/lib/site-config';

// TODO: use environment variables
export default siteConfig({
  // basic site info (required)
  name: 'AFPN CDO',
  shortName: 'AFPN',
  domain: 'localhost:3000',
  description: 'The official app of the AFPN CDO',

  demo: {
    id: 'a8692dad-d019-4122-9f31-a1a350452461',
    email: 'demo@example.com',
    password: 'Password@1234',
  },
});

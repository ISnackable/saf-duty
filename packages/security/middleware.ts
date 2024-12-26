import {
  type NoseconeOptions,
  defaults as noseconeDefaults,
  withVercelToolbar,
} from '@nosecone/next';
import { env } from '@repo/env';
export { createMiddleware as noseconeMiddleware } from '@nosecone/next';

// Nosecone security headers configuration
// https://docs.arcjet.com/nosecone/quick-start
const noseconeOptions: NoseconeOptions = {
  ...noseconeDefaults,
  contentSecurityPolicy: {
    ...noseconeDefaults.contentSecurityPolicy,
    directives: {
      ...noseconeDefaults.contentSecurityPolicy.directives,
      scriptSrc: [
        // We have to use unsafe-inline because next-themes and Vercel Analytics
        // do not support nonce
        // https://github.com/pacocoursey/next-themes/issues/106
        // https://github.com/vercel/analytics/issues/122
        //...noseconeDefaults.contentSecurityPolicy.directives.scriptSrc,
        "'self'",
        "'unsafe-inline'",
        'https://va.vercel-scripts.com',
      ],
      workerSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.workerSrc,
        'blob:',
      ],
      imgSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.imgSrc,
        'https://api.dicebear.com',
      ],
      // We only set this in production because the server may be started
      // without HTTPS
      upgradeInsecureRequests: process.env.NODE_ENV === 'production',
    },
  },
  crossOriginEmbedderPolicy: {
    policy: 'credentialless',
  },
};

export const noseconeConfig: NoseconeOptions =
  env.NODE_ENV === 'development' && env.FLAGS_SECRET
    ? withVercelToolbar(noseconeOptions)
    : noseconeOptions;

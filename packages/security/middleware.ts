import {
  type NoseconeOptions,
  defaults as noseconeDefaults,
  withVercelToolbar,
} from '@nosecone/next';
export { createMiddleware as noseconeMiddleware } from '@nosecone/next';
import { host } from '@repo/site-config';

// Nosecone security headers configuration
// https://docs.arcjet.com/nosecone/quick-start
export const noseconeOptions: NoseconeOptions = {
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
        "'wasm-unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://va.vercel-scripts.com',
      ],
      connectSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.connectSrc,
        'https://*.google-analytics.com',
        host as 'https:',
      ],
      workerSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.workerSrc,
        'blob:',
      ],
      imgSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.imgSrc,
        'https://api.dicebear.com',
      ],
      frameSrc: ['https://ippt.yctay.com'],
      // We only set this in production because the server may be started
      // without HTTPS
      upgradeInsecureRequests: process.env.VERCEL_ENV === 'production',
    },
  },
  crossOriginEmbedderPolicy: {
    policy: 'require-corp',
  },
  crossOriginOpenerPolicy: {
    policy: 'same-origin',
  },
};

export const noseconeOptionsWithToolbar: NoseconeOptions = {
  ...withVercelToolbar(noseconeOptions),
  crossOriginEmbedderPolicy: {
    policy: 'require-corp',
  },
  crossOriginOpenerPolicy: {
    policy: 'same-origin',
  },
};

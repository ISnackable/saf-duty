import { MetadataRoute } from 'next';

import { site } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#1e2124',
    background_color: '#0A0A0A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/1.jpg',
        sizes: '1080x1920',
        type: 'image/jpeg',
      },
      {
        src: '/screenshots/2.jpg',
        sizes: '1080x1920',
        type: 'image/jpeg',
      },
    ],
    shortcuts: [
      {
        name: 'View Duty Roster',
        short_name: 'Duty Roster',
        description: 'View the duty roster for the current month',
        url: '/',
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            purpose: 'maskable',
          },
        ],
      },
      {
        name: 'Manage Blockouts',
        short_name: 'Blockouts',
        description: 'View and manage your blockouts',
        url: '/manage-blockouts',
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            purpose: 'maskable',
          },
        ],
      },
    ],
  };
}

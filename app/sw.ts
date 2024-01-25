import { defaultCache } from '@serwist/next/browser';
import type { PrecacheEntry } from '@serwist/precaching';
import { installSerwist } from '@serwist/sw';

import { APP_DEFAULT_TITLE } from '../site.config';

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your `injectionPoint`.
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event?.data.json();
    event?.waitUntil(
      self.registration.showNotification(APP_DEFAULT_TITLE || 'Default Title', {
        body: data.message,
        icon: '/icons/android-chrome-192x192.png',
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow('/');
      })
  );
});

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});

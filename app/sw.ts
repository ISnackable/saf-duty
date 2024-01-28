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
    const unreadCount = data.unreadCount;

    const notificationPromise = self.registration.showNotification(
      APP_DEFAULT_TITLE || 'Default Title',
      {
        body: data.message,
        icon: '/icons/android-chrome-192x192.png',
        badge: '/icons/android-chrome-192x192.png',
      }
    );
    const promiseChain = [notificationPromise];

    // Check for support of the App Badging API
    if (navigator.setAppBadge) {
      if (unreadCount && unreadCount > 0) {
        promiseChain.push(navigator.setAppBadge(unreadCount));
      } else {
        promiseChain.push(navigator.clearAppBadge());
      }
    }

    event.waitUntil(Promise.all(promiseChain));
  }
});

self.addEventListener('notificationclick', (event) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (windowClients) {
        if (windowClients.length > 0) {
          let client = windowClients[0];
          for (let i = 0; i < windowClients.length; i++) {
            if (windowClients[i].focused) {
              client = windowClients[i];
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

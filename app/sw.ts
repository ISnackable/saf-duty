import type { SerwistGlobalConfig } from '@serwist/core';
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry } from '@serwist/precaching';
import { Serwist } from '@serwist/sw';

import { name } from '@/lib/config';

declare global {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event?.data.json();
    const unreadCount = data?.unreadCount;

    const notificationPromise = self.registration.showNotification(
      data.title || name,
      {
        body: data.message || 'You have a new notification!',
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

const serwist = new Serwist();

serwist.install({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});

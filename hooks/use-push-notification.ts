'use client';

import { useEffect, useState } from 'react';

import {
  deleteSubscription,
  insertSubscription,
} from '@/app/(dashboard)/actions';
import { useMediaQuery } from '@/hooks/use-media-query';

const WEB_PUSH_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '';

/**
 * Converts a base64 string to a Uint8Array.
 *
 * @function
 * @param {string} base64String - The base64 encoded string to convert.
 * @returns {Uint8Array} - The converted Uint8Array.
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
  if (typeof window === 'undefined') return false;

  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
  return await Notification.requestPermission();
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
async function createNotificationSubscription() {
  //wait for service worker installation to be ready (SerivceWorker is only ready on https with a valid certificate)
  const serviceWorker = await navigator?.serviceWorker?.ready;
  if (!serviceWorker.pushManager) {
    throw new Error('Push manager unavailable.');
  }

  const convertedVapidKey = urlBase64ToUint8Array(WEB_PUSH_PUBLIC_KEY);

  // subscribe and return the subscription
  return await serviceWorker.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    })
    .catch((_e) => {
      console.error('Could not subscribe to push service');
      throw new Error('Could not subscribe to push service');
    });
}

/**
 *
 * unsubscribe the user from push notifications
 *
 */
async function removeNotificationSubscription() {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator?.serviceWorker?.ready;
  if (!serviceWorker.pushManager) {
    throw new Error('Push manager unavailable.');
  }

  const pushSubscription = await getUserSubscription();
  if (pushSubscription) {
    return pushSubscription.unsubscribe();
  }

  return false;
}

/**
 * returns the subscription if present or nothing
 */
async function getUserSubscription() {
  const pushNotificationSupported = isPushNotificationSupported();
  if (!pushNotificationSupported) {
    throw new Error('Push notifications are not supported.');
  }

  //* Note: Host must be HTTPS then serviceWorker.ready will be available. Otherwise, it will hang forever
  const serviceWorker = await navigator?.serviceWorker?.ready;
  if (!serviceWorker.pushManager) {
    throw new Error('Push manager unavailable.');
  }

  const existingSubscription =
    await serviceWorker.pushManager.getSubscription();
  return existingSubscription;
}

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications() {
  const [userConsent, setUserConsent] =
    useState<NotificationPermission>('default');
  const [userSubscription, setUserSubscription] =
    useState<PushSubscription | null>(null);
  const isPWAInstalled = useMediaQuery('(display-mode: standalone)');

  // if the push notifications are supported, registers the service worker
  // then retrieve if there is any push notification subscription for the registered service worker
  // this effect runs only the first render
  useEffect(() => {
    if (pushNotificationSupported) {
      setUserConsent(Notification.permission);

      const getExixtingSubscription = async () => {
        const existingSubscription = await getUserSubscription();
        setUserSubscription(existingSubscription);
      };
      getExixtingSubscription();
    }
  }, []);

  const onClickAskUserPermission = async () => {
    const consent = await askUserPermission();
    setUserConsent(consent);

    if (consent !== 'granted') {
      console.error('User denied push notification permission');
    }

    return consent;
  };

  const onClickSubscribeToPushNotification = async () => {
    if (!userConsent || Notification.permission !== 'granted') {
      console.error(
        `You have to grant push notifications permissions. Permission: ${Notification.permission}`
      );
      return null;
    }

    try {
      const subscription = await createNotificationSubscription();
      const { serverError, validationErrors } = await insertSubscription(
        subscription?.toJSON() as any
      );

      if (serverError || validationErrors) {
        console.error('Failed to save the subscription to the server');
        throw new Error('Failed to save the subscription to the server');
      }
      setUserSubscription(subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);

      return null;
    }
  };

  const onClickUnsubscribeToPushNotification = async () => {
    if (!userSubscription) return null;

    if (!userConsent || Notification.permission !== 'granted') {
      // Attempting to unsubscribe when the user hasn't granted permissions, or the user has denied permissions
      // However, the user can still unsubscribe even if they haven't granted permissions provided they have a subscription
      console.warn(
        `You have to grant push notifications permissions. Permission: ${Notification.permission}`
      );
    }

    try {
      await removeNotificationSubscription();
      await deleteSubscription(userSubscription?.toJSON() as any);

      setUserSubscription(null);
    } catch (error) {
      console.error('Failed to unsubscribe the user: ', error);
    }

    return null;
  };

  return {
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickUnsubscribeToPushNotification,
    userConsent,
    pushNotificationSupported,
    isPWAInstalled,
    userSubscription,
  };
}

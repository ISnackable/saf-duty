'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';

import usePushNotifications from '@/hooks/use-push-notification';

interface PushNotificationState {
  userSubscription: PushSubscription | null;
  userConsent: NotificationPermission | null;
  isPWAInstalled: boolean | null;
  pushNotificationSupported: boolean | null;
  onClickAskUserPermission: () => Promise<NotificationPermission>;
  onClickSubscribeToPushNotification: () => Promise<PushSubscription | null>;
  onClickUnsubscribeToPushNotification: () => Promise<null>;
}

export const PushNotificationContext = createContext<PushNotificationState>({
  userSubscription: null,
  userConsent: null,
  isPWAInstalled: null,
  pushNotificationSupported: null,
  onClickAskUserPermission: () => Promise.resolve('default'),
  onClickSubscribeToPushNotification: () => Promise.resolve(null),
  onClickUnsubscribeToPushNotification: () => Promise.resolve(null),
});

// TODO: Unsubscribe from push notifications when the user logs out
export const PushNotificationProvider = (props: PropsWithChildren) => {
  const {
    userSubscription,
    userConsent,
    isPWAInstalled,
    pushNotificationSupported,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickUnsubscribeToPushNotification,
  } = usePushNotifications();

  return (
    <PushNotificationContext.Provider
      value={{
        userSubscription,
        userConsent,
        isPWAInstalled,
        pushNotificationSupported,
        onClickAskUserPermission,
        onClickSubscribeToPushNotification,
        onClickUnsubscribeToPushNotification,
      }}
    >
      {props.children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);

  if (!context) {
    throw new Error(
      'usePushNotificationContext must be used inside the PushNotificationProvider'
    );
  }

  return context;
};

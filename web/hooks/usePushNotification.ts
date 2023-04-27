import { useState, useEffect } from 'react'

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
  return await Notification.requestPermission()
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator?.serviceWorker?.ready
  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '',
  })
}

/**
 *
 * unsubsribe the user from push notifications
 *
 */
async function removeNotificationSubscription() {
  const pushSubscription = await getUserSubscription()
  if (pushSubscription) {
    return pushSubscription.unsubscribe()
  }
}

/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator?.serviceWorker?.ready
    .then(function (serviceWorker) {
      return serviceWorker.pushManager.getSubscription()
    })
    .then(function (pushSubscription) {
      return pushSubscription
    })
}

export default function usePushNotifications() {
  const [userConsent, setUserConsent] = useState<NotificationPermission>('default')
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState<PushSubscription | null>(null)
  //   //to manage the use push notification subscription
  const [pushNotificationSupported, setPushNotificationSupported] = useState(false)

  useEffect(() => {
    if (isPushNotificationSupported()) {
      setPushNotificationSupported(true)
      setUserConsent(Notification.permission)
    }
  }, [])
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render

  useEffect(() => {
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription()
      setUserSubscription(existingSubscription)
    }
    getExixtingSubscription()
  }, [])
  //Retrieve if there is any push notification subscription for the registered service worker
  // this use effect runs only in the first render

  /**
   * define a click handler that asks the user permission,
   * it uses the setSuserConsent state, to set the consent of the user
   * If the user denies the consent, an error is created with the setError hook
   */
  const onClickAskUserPermission = () => {
    askUserPermission().then((consent) => {
      setUserConsent(consent)
      if (consent !== 'granted') {
        console.error('User denied push notification permission')
      }
    })
  }
  //

  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
   */
  const onClickSubscribeToPushNotification = async () => {
    return createNotificationSubscription()
      .then(function (subscription) {
        setUserSubscription(subscription)

        return subscription
      })
      .catch((err) => {
        console.error(
          "Couldn't create the notification subscription",
          err,
          'name:',
          err.name,
          'message:',
          err.message,
          'code:',
          err.code
        )

        return null
      })
  }

  /**
   * define a click handler that remove a push notification subscription.
   * Once the subscription is remove, it uses the setUserSubscription hook
   */
  const onClickUnsubscribeToPushNotification = () => {
    return removeNotificationSubscription()
      .then((unsubscribed) => {
        if (unsubscribed) {
          setUserSubscription(null)
        }
      })
      .catch((err) => {
        console.error(
          "Couldn't remove the notification subscription",
          err,
          'name:',
          err.name,
          'message:',
          err.message,
          'code:',
          err.code
        )
      })
  }

  /**
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickSendSubscriptionToServer = async (
    userId: string,
    userSubscription: PushSubscription
  ) => {
    try {
      await fetch(`/api/sanity/user/${userId}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSubscription), // body data type must match "Content-Type" header
      })
    } catch (error) {
      console.error("Couldn't send the subscription to the server")
    }
  }

  /**
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickDeleteSubscriptionFromServer = async (userId: string) => {
    try {
      await fetch(`/api/sanity/user/${userId}/subscription`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error("Couldn't delete the subscription to the server")
    }
  }

  /**
   * define a click handler that request the push server to send a notification, passing the id of the saved subscription
   */
  const onClickSendNotification = async () => {
    try {
      await fetch(`/api/notification`, {
        method: 'GET',
      })
    } catch (error) {
      console.error()
    }
  }

  /**
   * returns all the stuff needed by a Component
   */
  return {
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickUnsubscribeToPushNotification,
    onClickSendSubscriptionToServer,
    onClickDeleteSubscriptionFromServer,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
  }
}

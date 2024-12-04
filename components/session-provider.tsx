'use client';

import type {
  AuthChangeEvent,
  AuthError,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePushNotificationContext } from '@/components/push-notification-provider';
import { createClient } from '@/lib/supabase/clients/client';

export type SessionContext =
  | {
      isLoading: true;
      session: null;
      error: null;
      supabaseClient: SupabaseClient;
    }
  | {
      isLoading: false;
      session: Session;
      error: null;
      supabaseClient: SupabaseClient;
    }
  | {
      isLoading: false;
      session: null;
      error: AuthError;
      supabaseClient: SupabaseClient;
    }
  | {
      isLoading: false;
      session: null;
      error: null;
      supabaseClient: SupabaseClient;
    };

export const SessionContext = createContext?.<SessionContext | undefined>({
  isLoading: true,
  session: null,
  error: null,
  supabaseClient: {} as any,
});

export interface SessionContextProviderProps {
  initialSession?: Session | null;
}

export const storageKey = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0]}-auth-token`
  : 'supabase.auth.token';

type CustomAuthChangeEvent =
  | AuthChangeEvent
  | 'BEFORE_SIGNED_IN'
  | 'BEFORE_SIGNED_OUT';

export function customNotifyEvent(
  event: CustomAuthChangeEvent,
  session: Session | null
) {
  const channel = new BroadcastChannel(storageKey);
  channel.postMessage({ event: event, session: session });
}

export function SessionProvider({
  initialSession = null,
  children,
}: PropsWithChildren<SessionContextProviderProps>) {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components');
  }

  const supabaseClient = createClient();

  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSession);
  // const [error, setError] = useState<AuthError>();

  useEffect(() => {
    if (!session && initialSession) {
      setSession(initialSession);
    }
  }, [session, initialSession]);

  const {
    userSubscription,
    pushNotificationSupported,
    onClickSubscribeToPushNotification,
  } = usePushNotificationContext();

  useEffect(() => {
    setIsLoading(false);

    const subscription = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        // console.log('SessionProvider: onAuthStateChange', event, session);
        if (event === 'SIGNED_OUT') {
          // We will unsubscribe from push notifications in the signOut buttons in the app instead of here
          // Due to session race conditions
          setSession(null);
        } else if (session) {
          // Try to subscribe to push notifications if the user has already given consent and user is logging in
          if (
            pushNotificationSupported &&
            (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') &&
            Notification.permission === 'granted' &&
            !userSubscription
          ) {
            onClickSubscribeToPushNotification().catch(console.error);
          }

          setSession(session);
        }
      }
    );

    return () => {
      subscription.data.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: SessionContext = useMemo(() => {
    if (isLoading) {
      return {
        isLoading: true,
        session: null,
        error: null,
        supabaseClient,
      };
    }

    // if (error) {
    //   return {
    //     isLoading: false,
    //     session: null,
    //     error,
    //     supabaseClient,
    //   };
    // }

    return {
      isLoading: false,
      session,
      error: null,
      supabaseClient,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, session]);
  // }, [isLoading, session, error]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      `useSessionContext must be used within a SessionContextProvider.`
    );
  }

  return context;
};

export function useSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
>() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      `useSupabaseClient must be used within a SessionContextProvider.`
    );
  }

  return context.supabaseClient as SupabaseClient<Database, SchemaName>;
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(`useSession must be used within a SessionContextProvider.`);
  }

  return context.session;
};

export const useUser = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a SessionContextProvider.`);
  }

  return context.session?.user ?? null;
};

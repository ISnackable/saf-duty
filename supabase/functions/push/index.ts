import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  ApplicationServerKeys,
  generatePushHTTPRequest,
} from 'npm:webpush-webcrypto';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
}

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: Notification;
  schema: 'public';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  const { data } = await supabase
    .from('push_subscriptions')
    .select('push_subscription_details')
    .eq('user_id', payload.record.user_id)
    .single();

  const { count }: { count?: number } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', payload.record.user_id)
    .is('is_read', false);

  if (!data) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Subscription not found',
      }),
      { status: 404 }
    );
  }

  const token = data.push_subscription_details;

  const { status } = await sendPushNotification(
    token,
    {
      title: payload.record.title,
      message: payload.record.message,
      unreadCount: count,
    },
    payload.record.user_id
  );

  return new Response(
    JSON.stringify({
      status: status === 200 ? 'success' : 'error',
      message: status === 200 ? 'Push notification sent' : 'Error sending push',
    }),
    {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

export async function sendPushNotification(
  subscription: string,
  payload: { title: string; message: string; unreadCount?: number },
  userId: string
) {
  const applicationServerKeys = await ApplicationServerKeys.fromJSON({
    publicKey: Deno.env.get('WEB_PUSH_PUBLIC_KEY')!,
    privateKey: Deno.env.get('WEB_PUSH_PRIVATE_KEY')!,
  });

  const { headers, body, endpoint } = await generatePushHTTPRequest({
    applicationServerKeys: applicationServerKeys,
    payload: JSON.stringify(payload),
    target: subscription,
    adminContact: `mailto:${Deno.env.get('WEB_PUSH_EMAIL')}`,
    ttl: 60,
    urgency: 'low',
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body,
  });

  if (response.status === 404 || response.status === 410) {
    console.warn('Subscription has expired or is no longer valid: ');

    await deleteSubscriptionFromDatabase(userId);
  }

  if (!response.ok) {
    throw response;
  }

  return response;
}

export async function deleteSubscriptionFromDatabase(userId: string) {
  // delete subscription from database
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error(error);
  }
}

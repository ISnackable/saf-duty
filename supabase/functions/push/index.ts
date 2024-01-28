import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webPush from 'npm:web-push';

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

webPush.setVapidDetails(
  `mailto:${Deno.env.get('WEB_PUSH_EMAIL')}`,
  Deno.env.get('WEB_PUSH_PUBLIC_KEY')!,
  Deno.env.get('WEB_PUSH_PRIVATE_KEY')!
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  const { data } = await supabase
    .from('push_subscriptions')
    .select('push_subscription_details')
    .eq('id', payload.record.user_id)
    .single();

  const fcmToken = data!.push_subscription_details;

  const { statusCode, body } = await sendPushNotification(
    JSON.parse(fcmToken),
    { title: payload.record.title, message: payload.record.message },
    payload.record.user_id
  );

  if (statusCode < 200 || 299 < statusCode) {
    throw body;
  }

  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
});

export function sendPushNotification(
  subscription: webPush.PushSubscription,
  payload: { title: string; message: string },
  userId: string
) {
  return webPush
    .sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        message: payload.message,
      })
    )
    .catch(async (err: webPush.WebPushError) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.warn('Subscription has expired or is no longer valid: ', err);

        await deleteSubscriptionFromDatabase(userId);
      } else {
        console.error(err);
        throw err;
      }
      return err;
    });
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

import { z } from 'zod';

// Schema should match the JSON structure of a PushSubscription
export const pushSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().optional().nullable(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

import { z } from 'zod';
import { requirements } from '@repo/auth/lib/utils';

export const loginFormSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});


export const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .regex(
      /^[a-zA-Z\s]*$/,
      'Name must not include numbers or special characters'
    )
    .trim(),
  email: z
    .string()
    .email({
      message: 'Email must be a valid email',
    })
    .trim()
    .toLowerCase(),
  // Password must include a number, a lowercase letter, an uppercase letter, and a special character.
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(32, { message: 'Password must be less than 32 characters' })
    .refine(
      (value) => {
        return requirements.every((requirement) => requirement.re.test(value));
      },
      {
        message:
          'Password must include a number, a lowercase letter, an uppercase letter, and a special character',
      }
    ),
  unit: z.string().length(4, {
    message: 'Unit code must be 4 digits',
  }),
});

export const resetFormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Email must be a valid email',
    })
    .trim()
    .toLowerCase(),
});

export const changeFormSchema = z.object({
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(32, { message: 'Password must be less than 32 characters' })
    .refine(
      (value) => {
        return requirements.every((requirement) => requirement.re.test(value));
      },
      {
        message:
          'Password must include a number, a lowercase letter, an uppercase letter, and a special character',
      }
    ),
});

export const updateFormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Email must be a valid email',
    })
    .trim()
    .toLowerCase(),
  oldPassword: changeFormSchema.shape.password,
  newPassword: changeFormSchema.shape.password.optional(),
});

// Schema should match the JSON structure of a PushSubscription
export const pushSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().optional().nullable(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});
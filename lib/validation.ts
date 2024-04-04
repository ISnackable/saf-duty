import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

export function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  // for of loop
  for (const requirement of requirements) {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  }

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .trim()
    .refine(
      (value) => {
        return !/\d/.test(value);
      },
      {
        message: 'Name must not include numbers',
      }
    ),
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

export const ResetFormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Email must be a valid email',
    })
    .trim()
    .toLowerCase(),
});

export const ChangeFormSchema = z.object({
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

// Schema should match the JSON structure of a PushSubscription
export const PushSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().optional().nullable(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

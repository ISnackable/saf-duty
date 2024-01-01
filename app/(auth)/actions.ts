'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type LoginFormData } from '@/components/user-login-form';
import { type RegisterFormData } from '@/components/user-register-form';
import { ResetFormData } from '@/components/user-reset-form';
import { MyCustomError, authAction } from '@/lib/safe-action';
import { type State } from '@/types/api-route';
import {
  ChangeFormSchema,
  LoginFormSchema,
  RegisterFormSchema,
  ResetFormSchema,
} from '@/utils/auth-validation';
import { createClient } from '@/utils/supabase/server';

export async function signIn(formData: LoginFormData): Promise<State> {
  const { email, password } = formData;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const validatedFields = LoginFormSchema.safeParse(formData);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Form data is invalid',
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: 'error',
      message: 'Invalid login credentials',
    };
  }

  return {
    status: 'success',
    message: 'Successfully authenticated',
  };
}

export async function signUp(formData: RegisterFormData): Promise<State> {
  const origin = headers().get('origin');
  const { email, password, name, unit } = formData;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const validatedFields = RegisterFormSchema.safeParse(formData);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Form data is invalid',
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { name, unit },
    },
  });

  if (error) {
    // We do not want to display if the email is already taken / unit code is already taken
    // This is to prevent brute force attacks

    return {
      status: 'error',
      message: 'Could not authenticate user',
    };
  }

  return {
    status: 'success',
    message: 'Check email to continue sign in process',
  };
}

export async function signOut(): Promise<State> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  return redirect('/login');
}

export async function resetPassword(formData: ResetFormData): Promise<State> {
  const origin = headers().get('origin');
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { email } = formData;

  const validatedFields = ResetFormSchema.safeParse(formData);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Form data is invalid',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/change-password`,
  });

  if (error) {
    return {
      status: 'error',
      message: 'Could not reset password',
    };
  }

  return {
    status: 'success',
    message: 'Check email to continue reset password process',
  };
}

// Only authenticated users can change their password (see middleware.ts)
export const changePassword = authAction(
  ChangeFormSchema,
  async (formData, { userId }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { password } = formData;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new MyCustomError(error.message || 'Could not change password');
    }

    return { userId };
  }
);

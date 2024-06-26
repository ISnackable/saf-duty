'use server';

import { type SignOut } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type LoginFormData } from '@/components/user-login-form';
import { type RegisterFormData } from '@/components/user-register-form';
import { ResetFormData } from '@/components/user-reset-form';
import { ActionError, authAction } from '@/lib/auth-action';
import { createClient } from '@/lib/supabase/clients/server';
import {
  changeFormSchema,
  loginFormSchema,
  registerFormSchema,
  resetFormSchema,
  updateFormSchema,
} from '@/lib/validation';
import { type State } from '@/types/api-route';

export async function signIn(formData: LoginFormData): Promise<State> {
  const { email, password } = formData;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const validatedFields = loginFormSchema.safeParse(formData);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Form data is invalid',
    };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
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
    data: session,
    status: 'success',
    message: 'Successfully authenticated',
  };
}

export async function signUp(formData: RegisterFormData): Promise<State> {
  const origin = headers().get('origin');
  const { email, password, name, unit } = formData;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const validatedFields = registerFormSchema.safeParse(formData);

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

export async function signOut(options: SignOut = { scope: 'local' }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut(options);
  redirect('/login');
}

export async function resetPassword(formData: ResetFormData): Promise<State> {
  const origin = headers().get('origin');
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { email } = formData;

  const validatedFields = resetFormSchema.safeParse(formData);

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
  changeFormSchema,
  async (formData, { user }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { password } = formData;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new ActionError(error.message || 'Could not change password');
    }

    return { user };
  }
);

export const updateAccount = authAction(
  updateFormSchema,
  async (formData, { user }) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { email, oldPassword, newPassword } = formData;

    // early return if the email is the same and no new password
    if (email === user.email && !newPassword) {
      throw new ActionError('No changes detected');
    }

    if (oldPassword && email !== user.email) {
      const { error } = await supabase.rpc('change_user_email', {
        current_plain_password: oldPassword,
        new_email: email,
      });

      if (error) {
        throw new ActionError(error.message || 'Could not update account');
      }
    }

    if (oldPassword && newPassword) {
      const { error } = await supabase.rpc('change_user_password', {
        current_plain_password: oldPassword,
        new_plain_password: newPassword,
      });

      if (error) {
        throw new ActionError(error.message || 'Could not update account');
      }
    }

    const {
      data: { session },
    } = await supabase.auth.refreshSession();

    return { session };
  }
);

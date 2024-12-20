'use server';

import { type SignOut } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type LoginFormData } from '@/components/user-login-form';
import { type RegisterFormData } from '@/components/user-register-form';
import { ResetFormData } from '@/components/user-reset-form';
import { ActionError, authActionClient } from '@/lib/auth-action';
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
  const supabase = await createClient();

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
  const origin = (await headers()).get('origin');
  const { email, password, name, unit } = formData;
  const supabase = await createClient();

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
  const supabase = await createClient();
  await supabase.auth.signOut(options);
  redirect('/login');
}

export async function resetPassword(formData: ResetFormData): Promise<State> {
  const origin = (await headers()).get('origin');
  const supabase = await createClient();
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
export const changePassword = authActionClient
  .schema(changeFormSchema)
  .action(async ({ parsedInput: { password }, ctx: { user } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new ActionError(error.message || 'Could not change password');
    }

    return { user };
  });

export const updateAccount = authActionClient
  .schema(updateFormSchema)
  .action(
    async ({
      parsedInput: { email, oldPassword, newPassword },
      ctx: { user },
    }) => {
      const supabase = await createClient();

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

export const deleteAccount = authActionClient
  .schema(changeFormSchema)
  .action(async ({ parsedInput: { password }, ctx: { user } }) => {
    const supabase = await createClient();

    if (!password) throw new ActionError('Password is required');

    const { error } = await supabase.rpc('delete_user_profile', {
      current_plain_password: password,
    });

    if (error) {
      throw new ActionError(
        'Could not delete account, ensure your old password is correct'
      );
    }

    return {
      status: 'success',
      message: `${user.email} has been deleted`,
    };
  });

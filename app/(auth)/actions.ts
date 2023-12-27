'use server';

import { type LoginFormData } from '@/components/user-login-form';
import { type RegisterFormData } from '@/components/user-register-form';
import { LoginFormSchema, RegisterFormSchema } from '@/utils/auth-validation';
import { createClient } from '@/utils/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type State =
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
    };

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
    console.error(error);

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

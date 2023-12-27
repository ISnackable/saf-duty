import { cookies } from 'next/headers';
import Link from 'next/link';

import { signOut } from '@/app/(auth)/actions';
import { createClient } from '@/utils/supabase/server';

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className='flex items-center gap-4'>
      Hey, {user.email}!
      <form action={signOut}>
        <button
          type='submit'
          className='bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline'
        >
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href='/login'
      className='bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline'
    >
      Login
    </Link>
  );
}

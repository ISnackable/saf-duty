import { signOut } from "@/app/(auth)/actions";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AuthButton() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user ? (
		<div className="flex items-center gap-4">
			Hey, {user.email}!
			<form action={signOut}>
				<button
					type="submit"
					className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
				>
					Logout
				</button>
			</form>
		</div>
	) : (
		<Link
			href="/login"
			className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
		>
			Login
		</Link>
	);
}

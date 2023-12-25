"use server";
import { type LoginFormData } from "@/components/user-login-form";
import { type RegisterFormData } from "@/components/user-register-form";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(formData: LoginFormData) {
	const { email, password } = formData;
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			error: "Could not authenticate user",
		};
	}

	return {
		message: "Successfully authenticated",
	};
}

export async function signUp(formData: RegisterFormData) {
	const origin = headers().get("origin");
	const { email, password, name, unit } = formData;
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

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
			error: "Could not authenticate user",
		};
	}

	return {
		message: "Check email to continue sign in process",
	};
}

export async function signOut() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	await supabase.auth.signOut();
	return redirect("/login");
}

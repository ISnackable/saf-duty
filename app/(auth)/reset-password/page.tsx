import Link from "next/link";

import { type Metadata } from "next";

import { Icons } from "@/components/icons";
import { UserLoginForm } from "@/components/user-login-form";

export const metadata: Metadata = {
	title: "Forgot Password",
	description: "Reset Your Password",
};

export default function ResetPasswordPage() {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<Icons.logo className="mx-auto h-6 w-6" />
					<h1 className="text-2xl font-semibold tracking-tight">
						Reset Your Password
					</h1>
					<p className="text-sm text-muted-foreground">
						Type in your email and we'll send you a link to reset your passwordt
					</p>
				</div>
				<UserLoginForm />
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/register"
						className="hover:text-brand underline underline-offset-4"
					>
						Don&apos;t have an account? Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}

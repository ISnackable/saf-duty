"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { signIn } from "@/app/(auth)/actions";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

type UserLoginFormProps = React.HTMLAttributes<HTMLDivElement>;

const LoginFormSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

export function UserLoginForm({ className, ...props }: UserLoginFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(LoginFormSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const router = useRouter();

	async function handleLoginForm(data: LoginFormData) {
		setIsLoading(true);
		const { error, message } = await signIn(data);

		if (error) {
			toast("Something went wrong.", {
				description: "Your sign in request failed. Please try again.",
			});
		} else {
			toast(message || "Successfully logged in.", {
				description:
					"Your sign in request was successful. You will be redirected shortly.",
			});

			// redirect to dashboard
			router.replace("/");
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(handleLoginForm)}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
							{...register("email")}
						/>
						{errors?.email && (
							<p className="px-1 text-xs text-red-600">
								{errors.email.message}
							</p>
						)}
					</div>
					<div className="mb-2 grid gap-1">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							autoComplete="password"
							disabled={isLoading}
							{...register("password")}
						/>
						{errors?.password && (
							<p className="px-1 text-xs text-red-600">
								{errors.password.message}
							</p>
						)}
					</div>
					<button
						type="submit"
						className={cn(buttonVariants())}
						disabled={isLoading}
					>
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Sign In with Email
					</button>
				</div>
			</form>
		</div>
	);
}

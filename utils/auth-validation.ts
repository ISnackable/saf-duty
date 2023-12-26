import { z } from "zod";

export const LoginFormSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(1, { message: "Password is required" }),
});

export const requirements = [
	{ re: /[0-9]/, label: "Includes number" },
	{ re: /[a-z]/, label: "Includes lowercase letter" },
	{ re: /[A-Z]/, label: "Includes uppercase letter" },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

export const RegisterFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be at least 2 characters",
		})
		.trim()
		.refine(
			(value) => {
				return !/\d/.test(value);
			},
			{
				message: "Name must not include numbers",
			},
		),
	email: z
		.string()
		.email({
			message: "Email must be a valid email",
		})
		.trim()
		.toLowerCase(),
	// Password must include a number, a lowercase letter, an uppercase letter, and a special character.
	password: z
		.string()
		.min(6, {
			message: "Password must be at least 6 characters",
		})
		.max(32, { message: "Password must be less than 32 characters" })
		.refine(
			(value) => {
				return requirements.every((requirement) => requirement.re.test(value));
			},
			{
				message:
					"Password must include a number, a lowercase letter, an uppercase letter, and a special character",
			},
		),
	unit: z.string().length(4, {
		message: "Unit code must be 4 digits",
	}),
});

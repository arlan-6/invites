"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ErrorContext } from "@better-fetch/fetch";
import { FcGoogle } from "react-icons/fc";
import LoadingButton from "@/components/loading-button";

export default function SignIn() {
	const router = useRouter();
	const [pendingCredentials, setPendingCredentials] = useState(false);
	const [pendingGithub, setPendingGithub] = useState(false);

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleCredentialsSignIn = async (
		values: z.infer<typeof signInSchema>
	) => {
		await authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
			},
			{
				onRequest: () => {
					setPendingCredentials(true);
				},
				onSuccess: async () => {
					router.push("/");
					router.refresh();
				},
				onError: (ctx: ErrorContext) => {
					console.log(ctx);
					toast("Something went wrong",{
						description: ctx.error.message ?? "Something went wrong.",
					});
				},
			}
		);
		setPendingCredentials(false);
	};

	const handleSignInWithGithub = async () => {
		await authClient.signIn.social(
			{
				provider: "google",
			},
			{
				onRequest: () => {
					setPendingGithub(true);
				},
				onSuccess: async () => {
					router.push("/");
					router.refresh();
				},
				onError: (ctx: ErrorContext) => {
					toast( "Something went wrong",{
						description: ctx.error.message ?? "Something went wrong.",
					});
				},
			}
		);
		setPendingGithub(false);
	};

	return (
		<div className="grow flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center text-gray-800">
						Sign In
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleCredentialsSignIn)}
							className="space-y-6"
						>
							{["email", "password"].map((field) => (
								<FormField
									control={form.control}
									key={field}
									name={field as keyof z.infer<typeof signInSchema>}
									render={({ field: fieldProps }) => (
										<FormItem>
											<FormLabel>
												{field.charAt(0).toUpperCase() + field.slice(1)}
											</FormLabel>
											<FormControl>
												<Input
                                                variant={'default'}
													type={field === "password" ? "password" : "email"}
													placeholder={`Enter your ${field}`}
													{...fieldProps}
													autoComplete={
														field === "password" ? "current-password" : "email"
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
							<LoadingButton pending={pendingCredentials}>
								Sign in
							</LoadingButton>
						</form>
					</Form>
					<div className="mt-4">
						<LoadingButton
							pending={pendingGithub}
							onClick={handleSignInWithGithub}
						>
							<FcGoogle className="w-4 h-4 mr-2"/>
							Continue with Google
						</LoadingButton>
					</div>
					<div className="mt-4 text-center text-sm">
						<Link
							href="/forgot-password"
							className="text-primary hover:underline"
						>
							Forgot password?
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
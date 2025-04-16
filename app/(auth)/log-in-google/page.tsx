"use client";
import React, { FC, useState } from "react";
import Link from "next/link"; // Import Link for client-side navigation
import { cn } from "@/lib/utils";
import LoadingButton from "@/components/loading-button"; // Assuming LoadingButton wraps shadcn Button
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/auth-client";
import { ErrorContext } from "better-auth/react";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription, // Import CardDescription
	CardFooter, // Optional: for footer elements like links
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// If LoadingButton doesn't wrap shadcn/ui Button, you might need:
// import { Button } from "@/components/ui/button";

interface PageProps {
	// Renamed interface for clarity
	className?: string;
}

const SignUpPage: FC<PageProps> = ({ className }) => {
	// Renamed component for clarity
	const [pendingGoogle, setPendingGoogle] = useState(false);

	// Note: Corrected handler name from handleSignInWithGithub to handleSignInWithGoogle
	const handleSignInWithGoogle = async () => {
		setPendingGoogle(true); // Set pending immediately
		try {
			await authClient.signIn.social(
				{
					provider: "google",
					callbackURL: `${window.location.origin}/dashboard`, // Make sure '/dashboard' is correct
				},
				{
					// Removed onRequest as we set pending above
					onSuccess: async () => {
						// No need to setPending(false) here, redirection handles it.
						// If you weren't redirecting immediately, you'd set it false.
						toast.success("Signed in successfully! Redirecting...");
						// Redirect often happens automatically via the callback,
						// but manual push might be needed in some setups.
						// window.location.href = '/dashboard'; // Or use Next.js router if available
					},
					onError: (ctx: ErrorContext) => {
						setPendingGoogle(false); // Ensure loading stops on error
						console.error("Google Sign-In Error:", ctx.error); // Log error for debugging
						toast.error("Sign in failed", {
							description:
								ctx.error?.message ??
								"Could not sign in with Google. Please try again.",
						});
					},
				},
			);
			// If the promise resolves without error/success (e.g., popup closed by user),
			// ensure pending is reset. Handle this based on how authClient behaves.
			// Might need a finally block if using try/catch/finally
			// setPendingGoogle(false); // Potentially needed here if onSuccess/onError don't always fire
		} catch (error) {
			// Catch unexpected errors during the call setup itself
			console.error("Unexpected error initiating Google sign-in:", error);
			setPendingGoogle(false);
			toast.error("An unexpected error occurred.", {
				description: "Please try signing in again.",
			});
		}
		// Removed setPendingGoogle(false) from here as it should be handled
		// within onError/onSuccess or if the user closes the popup manually (which authClient might handle internally)
	};

	return (
		<div
			className={cn(
				"flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4",
				className,
			)}
		>
			<Card className="w-full max-w-md shadow-lg">
				{" "}
				{/* Added shadow */}
				<CardHeader className="text-center space-y-1">
					{" "}
					{/* Center header text, add space */}
					<CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
						Create your Account
					</CardTitle>
					<CardDescription className="text-sm text-gray-600 dark:text-gray-400">
						Sign up using your Google account to continue.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{" "}
					{/* Add spacing for content */}
					
                       {/* // Example structure if adding email/password later */}
                       <Separator />
                       {/* <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                                </span>
                            </div>
                        </div> */}
                        {/* // Email form components go here */}
                   
					<LoadingButton
						pending={pendingGoogle}
						onClick={handleSignInWithGoogle}
					>
						{" "}
						<div className="bg-white p-0.5 rounded-full">
							<FcGoogle className="w-8 h-8" />
						</div>
						Sign up with Google
					</LoadingButton>
				</CardContent>
				<CardFooter className="flex flex-col items-center text-sm space-y-2 pt-4 pb-6">
					{" "}
					{/* Added padding and centered footer content */}
					<p className="text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/sign-in"
							className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
						>
							Sign In
						</Link>
					</p>
					{/* Optional: Terms and Privacy links */}
					{/* <p className="px-8 text-center text-xs text-muted-foreground">
                        By clicking continue, you agree to our{' '}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                     </p> */}
				</CardFooter>
			</Card>
		</div>
	);
};

export default SignUpPage;

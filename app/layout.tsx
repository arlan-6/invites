import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Invites",
	description: "Invites",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					crossOrigin="anonymous"
					src="//unpkg.com/react-scan/dist/auto.global.js"
					async
				/>
			</head>
			<body>
				<Analytics />

				<ThemeProvider attribute="class" defaultTheme="system">
					{children}
					<Toaster className="z-[99999999] "/>
					
				</ThemeProvider>
			</body>
		</html>
	);
}

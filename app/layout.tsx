import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/language-provider";

export const metadata: Metadata = {
	title: "Shaqr | beta",
	description: "Invites",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="kk" suppressHydrationWarning>
			<head>
				{process.env.NODE_ENV && process.env.NODE_ENV == "development" && (
					<script
						crossOrigin="anonymous"
						src="//unpkg.com/react-scan/dist/auto.global.js"
						async
					/>
				)}
			</head>
			<body>
				<Analytics />
				<LanguageProvider>
					<ThemeProvider attribute="class" defaultTheme="system">
						{children}
						<Toaster className="z-[99999999] " />
					</ThemeProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}

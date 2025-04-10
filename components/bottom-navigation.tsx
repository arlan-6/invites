"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { LanguageToggle } from "./language-toggle";
import React from "react";
import { Logo } from "./logo";

export default function BottomNavigation() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
	console.log('navigation bottom');
	
	return (
		<footer className="bottom-0 left-0 w-full bg-background/50">
			<div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
				{/* Home Link */}
				<div className="flex justify-between items-center w-full md:w-auto gap-4">
				<div className="relative text-xl font-bold text-primary flex-shrink-0">
					<Link href="/"><Logo /></Link>
				</div>

				{/* Center Text */}
				<div className="text-center text-sm w-full md:w-auto">
					Invite was created with ❤️ in Shaqr App
				</div></div>

				{/* Right Section */}
				<div className="flex gap-4 flex-wrap justify-center">
					{/* Theme Toggle */}
					<Button
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className="flex items-center gap-2"
						variant={theme === "light" ? "outline" : "secondary"}
					>
						{theme === "light" ? (
							<>
								<Moon size={16} />
							</>
						) : (
							<>
								<Sun size={16} />
							</>
						)}
					</Button>

					{/* Language Toggle */}
					<LanguageToggle />
				</div>
			</div>
		</footer>
	);
}

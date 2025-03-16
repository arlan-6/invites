"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunMoon } from "lucide-react";
import { Button } from "./ui/button";

export default function Navigation() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Ensure the component is mounted before rendering (to avoid hydration mismatch)
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<nav className="bg-white dark:bg-background shadow-md dark:shadow-none">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				{/* Logo */}
				<div className="text-xl font-bold text-blue-500 dark:text-blue-300">
					<Link href="/">InviteApp</Link>
				</div>

				{/* Navigation Links */}
				<ul className="flex space-x-6 text-sm" >
					<li>
						<Link
							href="/"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
						>
							Home
						</Link>
					</li>
					<li>
						<Link
							href="/about"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
						>
							About
						</Link>
					</li>
					<li>
						<Link
							href="/templates"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
						>
							Templates
						</Link>
					</li>
					<li>
						<Link
							href="/contact"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
						>
							Contact
						</Link>
					</li>
				</ul>

				{/* Theme Toggle and Sign Up Button */}
				<div className="flex items-center space-x-4 textlg">
					{/* Theme Toggle */}
					<Button
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						aria-label="Toggle Theme"
                        
					>
						{theme === "dark" ? <SunMoon size={16} /> : <SunMoon size={16} />}
					</Button>

					{/* Sign Up Button */}
					<Link
						href="/signup"
						className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</nav>
	);
}

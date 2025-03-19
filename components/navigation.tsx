"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunMoon, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navigation() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isMenuOpen, setMenuOpen] = useState(true);

	// Ensure the component is mounted before rendering (to avoid hydration mismatch)
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	const handleLinkClick = () => {
		setMenuOpen(false);
	};

	const NavLink = ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => (
		<Link
			href={href}
			onClick={handleLinkClick}
			className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition"
		>
			{children}
		</Link>
	);

	return (
		<div className="">
			<nav className="bg-background dark:bg-background shadow-md dark:shadow-none z-10">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center ">
					{/* Logo and Beta Badge */}
					<div className="relative text-2xl font-bold text-primary ">
						<Link href="/">InviteApp</Link>
						<Badge
							variant="destructive"
							className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-muted text-destructive px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm"
						>
							βeta
						</Badge>
					</div>

					{/* Desktop Navigation Links */}
					<ul className="hidden md:flex space-x-6">
						<li>
							<NavLink href="/">Home</NavLink>
						</li>
						<li>
							<NavLink href="/about">About</NavLink>
						</li>
						<li>
							<NavLink href="/templates">Templates</NavLink>
						</li>
						<li>
							<NavLink href="/contact">Contact</NavLink>
						</li>
					</ul>

					{/* Desktop Theme Toggle and Sign Up Button */}
					<div className="hidden md:flex items-center space-x-4">
						<Button
							onClick={() => setTheme(theme === "light" ? "dark" : "light")}
							aria-label="Toggle Theme"
							variant={theme === "light" ? "outline" : "secondary"}
							className={cn("p-2 bg-accent")}
						>
							{theme === "light" ? (
								<Sun size={16} />
							) : theme === "dark" ? (
								<Moon size={16} />
							) : (
								<SunMoon size={16} />
							)}
						</Button>
						<Link href="/signup">
							<Button variant="outline" className="text-primary ">
								Sign Up
							</Button>
						</Link>
					</div>

					{/* Mobile Header: Hamburger Menu Toggle and Dark Mode Toggle */}
					<div className="md:hidden flex items-center space-x-2">
						<Button
							onClick={() => setTheme(theme === "light" ? "dark" : "light")}
							aria-label="Toggle Theme"
							variant={theme === "light" ? "outline" : "secondary"}
							className={cn("p-2 bg-accent")}
						>
							{theme === "light" ? (
								<Sun size={16} />
							) : theme === "dark" ? (
								<Moon size={16} />
							) : (
								<SunMoon size={16} />
							)}
						</Button>
						<button
							onClick={toggleMenu}
							aria-expanded={isMenuOpen}
							className="text-gray-700 dark:text-gray-300 focus:outline-none p-2"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
			</nav>
			<motion.div
				initial={{ y: "-200%", scaleY: 0, zIndex: -10 }}
				animate={{ y: isMenuOpen ? 0 : "-200%", scaleY: isMenuOpen ? 1 : 0 }}
				exit={{ y: "-200%", scaleY: 0 }}
				transition={{ duration: 0.3 }}
				className={cn(
					"md:hidden bg-background dark:bg-background border-t border-gray-200 dark:border-gray-700 -z-10",
				)}
			>
				<ul className="px-4 pt-2 pb-4 space-y-2">
					<li>
						<NavLink href="/">Home</NavLink>
					</li>
					<li>
						<NavLink href="/about">About</NavLink>
					</li>
					<li>
						<NavLink href="/templates">Templates</NavLink>
					</li>
					<li>
						<NavLink href="/contact">Contact</NavLink>
					</li>
					<li>
						<Link
							href="/signup"
							onClick={handleLinkClick}
							className="block bg-primary text-primary-foreground px-4 py-2 rounded-md text-center hover:bg-primary/90 transition"
						>
							Sign Up
						</Link>
					</li>
				</ul>
			</motion.div>
		</div>
	);
}

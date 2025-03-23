"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunMoon, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";

export default function Navigation() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isMenuOpen, setMenuOpen] = useState(true);
	const { t } = useLanguage();

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
						<Link href="/"><Logo/></Link>
						
					</div>

					{/* Desktop Navigation Links */}
					<ul className="hidden md:flex space-x-6">
						<li>
							<NavLink href="/">{t("navigation.home")}</NavLink>
						</li>
						<li>
							<NavLink href="/about">{t("navigation.about")}</NavLink>
						</li>
						<li>
							<NavLink href="/templates">{t("navigation.templates")}</NavLink>
						</li>
						<li>
							<NavLink href="/contact">{t("navigation.contact")}</NavLink>
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
						<LanguageToggle theme={theme === "light" ? "outline" : "secondary"}/>
						<Link href="/signup">
							<Button variant="outline" className="text-primary ">
								{t("navigation.signup")}
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
						<LanguageToggle theme={theme === "light" ? "outline" : "secondary"}/>

						<Button
							onClick={toggleMenu}
							aria-expanded={isMenuOpen}
							>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</Button>
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
						<NavLink href="/">{t("navigation.home")}</NavLink>
					</li>
					<li>
						<NavLink href="/about">{t("navigation.about")}</NavLink>
					</li>
					<li>
						<NavLink href="/templates">{t("navigation.templates")}</NavLink>
					</li>
					<li>
						<NavLink href="/contact">{t("navigation.contact")}</NavLink>
					</li>
					<li>
						<Link
							href="/signup"
							onClick={handleLinkClick}
							className="block bg-primary text-primary-foreground px-4 py-2 rounded-md text-center hover:bg-primary/90 transition"
						>
							{t("navigation.signup")}
						</Link>
					</li>
				</ul>
			</motion.div>
		</div>
	);
}

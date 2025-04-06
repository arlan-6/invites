"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X, UserRound, LogOut } from "lucide-react"; // Simplified imports
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";
import { authClient } from "@/auth-client";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname

// --- Navigation Link Component ---
// Enhanced with active state indication using aria-current
const NavLink = ({
	href,
	children,
	onClick,
	pathname,
}: {
	href: string;
	children: React.ReactNode;
	onClick: () => void; // Pass click handler down
	pathname: string; // Current pathname for active state
}) => {
	const isActive = pathname === href;
	return (
		<Link
			href={href}
			onClick={onClick} // Close menu on link click
			className={cn(
				"block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition rounded-md px-2 md:px-0 md:py-0", // Added padding for touch targets on mobile, removed on desktop
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background", // Focus styles
				isActive ? "font-semibold text-primary dark:text-primary-foreground" : "" // Active state styling
			)}
			aria-current={isActive ? "page" : undefined} // Accessibility for active link
		>
			{children}
		</Link>
	);
};

// --- Theme Toggle Button Component ---
// Extracted for clarity
const ThemeToggleButton = () => {
	const { theme, setTheme } = useTheme();
	// We still need mounted state to avoid hydration mismatch for theme
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) {
		// Render a placeholder or null during server render/hydration
		return <Button variant="outline" size="icon" className="w-9 h-9" disabled />;
	}

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button
			onClick={toggleTheme}
			variant="outline" // Consistent variant, adjust styling via className if needed
			size="icon" // Use size="icon" for square buttons
			className="w-9 h-9 bg-accent/50 hover:bg-accent/80" // Adjusted size and added subtle background
			aria-label={
				theme === "light" ? "Activate dark mode" : "Activate light mode"
			} // More descriptive aria-label
		>
			{theme === "dark" ? (
				<Moon size={16} aria-hidden="true" />
			) : (
				<Sun size={16} aria-hidden="true" />
			)}
		</Button>
	);
};

// --- Main Navigation Component ---
export default function Navigation() {
	const { data } = authClient.useSession(); // Removed isPending if not used
	const [isMenuOpen, setMenuOpen] = useState(false);
	const { t } = useLanguage();
	const router = useRouter();
	const pathname = usePathname(); // Get current path

	const toggleMenu = () => setMenuOpen((prev) => !prev);
	const closeMenu = () => setMenuOpen(false); // Explicit close function

	const logOutHandler = async () => {
		await authClient.signOut(); // Wait for sign out if needed
		closeMenu(); // Close menu after action
		// router.refresh(); // refresh might not be needed if layout automatically updates based on session
		router.push("/");
	};

	// Define navigation items for DRY principle
	const navItems = [
		{ href: "/", label: t("navigation.home") },
		{ href: "/about", label: t("navigation.about") },
		{ href: "/templates", label: t("navigation.templates") },
		{ href: "/contact", label: t("navigation.contact") },
	];

	// Animation variants for the mobile menu
	const mobileMenuVariants = {
		hidden: {
			opacity: 0,
			y: -20,
			// scaleY: 0.95, // Optional: slight scale
			transition: { duration: 0.2, ease: "easeOut" },
		},
		visible: {
			opacity: 1,
			y: 0,
			// scaleY: 1, // Optional: slight scale
			transition: { duration: 0.3, ease: "easeIn" },
		},
	};

	return (
		// Removed outer div with max-h toggle
		<nav className="sticky top-0 z-50 bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-border/40">
			{/* Added sticky, backdrop-blur, and subtle border */}
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				{/* Logo */}
				<div className="relative text-2xl font-bold text-primary shrink-0">
					<Link href="/" onClick={closeMenu} aria-label="Go to homepage">
						<Logo />
					</Link>
				</div>

				{/* Desktop Navigation */}
				<ul className="hidden md:flex items-center space-x-6 mx-auto absolute left-1/2 transform -translate-x-1/2">
					{/* Centered nav links */}
					{navItems.map((item) => (
						<li key={item.href}>
							<NavLink href={item.href} onClick={closeMenu} pathname={pathname}>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>

				{/* Right-side Controls (Desktop) */}
				<div className="hidden md:flex items-center space-x-3">
					<ThemeToggleButton />
					<LanguageToggle />
					{data?.session ? (
						<>
							<Button
								asChild // Use asChild to render the Link component with Button styles
								variant="outline"
								size="sm"
							>
								<Link href="/dashboard">
									<UserRound size={16} className="mr-1.5" />
									{t("navigation.dashboard")}
								</Link>
							</Button>
							<Button variant="secondary" size="sm" onClick={logOutHandler}>
								<LogOut size={16} className="mr-1.5" />
								{t("navigation.logout")}
							</Button>
						</>
					) : (
						<Button asChild variant="outline" size="sm">
							<Link href="/sign-up">{t("navigation.signup")}</Link>
						</Button>
					)}
				</div>

				{/* Mobile Controls Area */}
				<div className="md:hidden flex items-center space-x-2">
					<ThemeToggleButton />
					<LanguageToggle />
					<Button
						onClick={toggleMenu}
						variant="outline"
						size="icon"
						className="w-9 h-9"
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMenuOpen}
						aria-controls="mobile-menu" // Link button to the menu it controls
					>
						{isMenuOpen ? (
							<X size={20} aria-hidden="true" />
						) : (
							<Menu size={20} aria-hidden="true" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Navigation Menu with Framer Motion Animation */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						id="mobile-menu" // ID for aria-controls
						variants={mobileMenuVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						style={{ transformOrigin: "top" }} // Ensures scale animation originates from top
						// Removed absolute positioning, let it flow naturally below the nav bar
						className="md:hidden bg-background dark:bg-background border-t border-border/40 shadow-md" // Added shadow
					>
						<ul className="px-4 pt-2 pb-4 space-y-1">
							{/* Use space-y-1 for tighter spacing */}
							{navItems.map((item) => (
								<li key={item.href}>
									<NavLink
										href={item.href}
										onClick={closeMenu}
										pathname={pathname}
									>
										{item.label}
									</NavLink>
								</li>
							))}
							{/* Divider */}
							<li className="pt-2 pb-1">
								<hr className="border-border/40" />
							</li>
							{/* Auth Buttons */}
							{data?.session ? (
								<>
									<li>
										<Button
											asChild
											variant="ghost" // Use ghost for full-width feel
											className="w-full justify-start"
											onClick={closeMenu}
										>
											<Link href="/dashboard">
												<UserRound size={16} className="mr-2" />
												{t("navigation.dashboard")}
											</Link>
										</Button>
									</li>
									<li>
										<Button
											variant="ghost"
											className="w-full justify-start text-red-600 dark:text-red-500 hover:text-red-700 hover:bg-red-100/50 dark:hover:text-red-400 dark:hover:bg-red-900/20" // Destructive look
											onClick={logOutHandler}
										>
											<LogOut size={16} className="mr-2" />
											{t("navigation.logout")}
										</Button>
									</li>
								</>
							) : (
								<li>
									{/* Full-width Sign Up Button */}
									<Button
										asChild
										variant="default" // Primary action style
										className="w-full mt-2"
										onClick={closeMenu}
									>
										<Link href="/sign-up">{t("navigation.signup")}</Link>
									</Button>
								</li>
							)}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
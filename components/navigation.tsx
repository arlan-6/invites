"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X, UserRound, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";
import { authClient } from "@/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { ConfirmAlert } from "./confirm-alert";

const NavLink = ({
	href,
	children,
	onClick,
	pathname,
}: {
	href: string;
	children: React.ReactNode;
	onClick: () => void;
	pathname: string;
}) => {
	const isActive = pathname === href;
	return (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				"block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition rounded-md px-2 md:px-0 md:py-0",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
				isActive
					? "font-semibold text-primary dark:text-primary-foreground"
					: "",
			)}
			aria-current={isActive ? "page" : undefined}
		>
			{children}
		</Link>
	);
};

const ThemeToggleButton = () => {
	const { theme, setTheme } = useTheme();

	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return (
			<Button variant="outline" size="icon" className="w-9 h-9" disabled />
		);
	}

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button
			onClick={toggleTheme}
			variant="outline"
			size="icon"
			className="w-9 h-9 bg-accent/50 hover:bg-accent/80"
			aria-label={
				theme === "light" ? "Activate dark mode" : "Activate light mode"
			}
		>
			{theme === "dark" ? (
				<Moon size={16} aria-hidden="true" />
			) : (
				<Sun size={16} aria-hidden="true" />
			)}
		</Button>
	);
};

export default function Navigation() {
	const { data } = authClient.useSession();
	const [isMenuOpen, setMenuOpen] = useState(false);
	const { t } = useLanguage();
	const router = useRouter();
	const pathname = usePathname();

	if (
		pathname.includes("/invite") ||
		pathname.includes("/sign-up") ||
		pathname.includes("/sign-in") ||
		pathname.includes("/log-in-google")
	)
		return null; // Hide navigation on specific pages

	const toggleMenu = () => setMenuOpen((prev) => !prev);
	const closeMenu = () => setMenuOpen(false);

	const logOutHandler = async () => {
		await authClient.signOut();
		closeMenu();

		router.push("/");
	};

	const navItems = [
		{ href: "/", label: t("navigation.home") },
		{ href: "/about", label: t("navigation.about") },
		{ href: "/templates", label: t("navigation.templates") },
		{ href: "/contact", label: t("navigation.contact") },
	];

	const mobileMenuVariants = {
		hidden: {
			opacity: 0,
			y: -20,

			transition: { duration: 0.2, ease: "easeOut" },
		},
		visible: {
			opacity: 1,
			y: 0,

			transition: { duration: 0.3, ease: "easeIn" },
		},
	};

	return (
		<nav className="sticky top-0 z-50 bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-border/40">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<div className="relative text-2xl font-bold text-primary shrink-0">
					<Link href="/" onClick={closeMenu} aria-label="Go to homepage">
						<Logo />
					</Link>
				</div>

				<ul className="hidden lg:flex items-center space-x-6 mx-auto absolute left-1/2 transform -translate-x-1/2">
					{navItems.map((item) => (
						<li key={item.href}>
							<NavLink href={item.href} onClick={closeMenu} pathname={pathname}>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>

				<div className="hidden lg:flex items-center space-x-3">
					<ThemeToggleButton />
					<LanguageToggle />
					{data?.session ? (
						<>
							<Button asChild variant="outline" size="sm">
								<Link href="/dashboard">
									<UserRound size={16} className="mr-1.5" />
									{t("navigation.dashboard")}
								</Link>
							</Button>
							<ConfirmAlert
							title="Logout"
							description="Are you sure you want to log out?"
							cancelLabel="Cancel"
							confirmLabel="Logout"
							onConfirm={logOutHandler}
							>
								<Button variant="secondary" size="sm" 
								// onClick={logOutHandler}
								>
									<LogOut size={16} className="mr-1.5" />
									{t("navigation.logout")}
								</Button>
							</ConfirmAlert>
						</>
					) : (
						<Button asChild variant="outline" size="sm">
							<Link href="/log-in-google">{t("navigation.signup")}</Link>
						</Button>
					)}
				</div>

				<div className="lg:hidden flex items-center space-x-2">
					<ThemeToggleButton />
					<LanguageToggle />
					<Button
						onClick={toggleMenu}
						variant="outline"
						size="icon"
						className="w-9 h-9"
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMenuOpen}
						aria-controls="mobile-menu"
					>
						{isMenuOpen ? (
							<X size={20} aria-hidden="true" />
						) : (
							<Menu size={20} aria-hidden="true" />
						)}
					</Button>
				</div>
			</div>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						id="mobile-menu"
						variants={mobileMenuVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						style={{ transformOrigin: "top" }}
						className="lg:hidden bg-background dark:bg-background border-t border-border/40 shadow-md"
					>
						<ul className="px-4 pt-2 pb-4 space-y-1">
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

							<li className="pt-2 pb-1">
								<hr className="border-border/40" />
							</li>

							{data?.session ? (
								<>
									<li>
										<Button
											asChild
											variant="ghost"
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
										<ConfirmAlert
										title="Logout"
										description="Are you sure you want to log out?"
										cancelLabel="Cancel"
										confirmLabel="Logout"
										onConfirm={logOutHandler}
										>
										<Button
											variant="ghost"
											className="w-full justify-start text-red-600 dark:text-red-500 hover:text-red-700 hover:bg-red-100/50 dark:hover:text-red-400 dark:hover:bg-red-900/20"
											// onClick={logOutHandler}
										>
											<LogOut size={16} className="mr-2" />
											{t("navigation.logout")}
										</Button>
										</ConfirmAlert>
									</li>
								</>
							) : (
								<li>
									<Button
										asChild
										variant="default"
										className="w-full mt-2"
										onClick={closeMenu}
									>
										<Link href="/log-in-google">{t("navigation.signup")}</Link>
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

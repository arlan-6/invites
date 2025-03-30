"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunMoon, Menu, X, Sun, Moon, UserRound, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";
import { authClient } from "@/auth-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default function Navigation() {
	const { data, isPending } = authClient.useSession();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	// Start with the mobile menu closed
	const [isMenuOpen, setMenuOpen] = useState(false);
	const { t } = useLanguage();

	// Avoid hydration issues
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const toggleMenu = () => setMenuOpen((prev) => !prev);

	const handleLinkClick = () => setMenuOpen(false);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};
  const logOutHandler = () =>{
    authClient.signOut()
	redirect('/')
  }

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
		<div className={cn("max-h-16  md:h-auto", isMenuOpen ? "max-h-[300px]" : "")}>
			<nav className=" bg-background dark:bg-background shadow-md dark:shadow-none ">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					{/* Logo */}
					<div className="relative text-2xl font-bold text-primary">
						<Link href="/">
							<Logo />
						</Link>
					</div>

					{/* Desktop Navigation */}
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

					{/* Desktop Controls */}
					<div className="hidden md:flex items-center space-x-4">
						<Button
							onClick={toggleTheme}
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
						<LanguageToggle
							theme={theme === "light" ? "outline" : "secondary"}
						/>
						{!!data?.session ? (
							<div className="flex gap-2 items-center">
                <Link href={'/dashboard'}><Button variant={'outline'}><UserRound/> {t("navigation.dashboard")}</Button></Link>
                <Button variant={'outline'} onClick={logOutHandler}>{t("navigation.logout")} <LogOut/></Button>
              </div>
						) : (
							<Link href="/sign-up">
								<Button variant="outline" className="text-primary">
									{t("navigation.signup")}
								</Button>
							</Link>
						)}
					</div>

					{/* Mobile Controls */}
					<div className="md:hidden flex items-center space-x-2">
						<Button
							onClick={toggleTheme}
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
						<LanguageToggle
							theme={theme === "light" ? "outline" : "secondary"}
						/>
						<Button
							onClick={toggleMenu}
							aria-label="Toggle Menu"
							aria-expanded={isMenuOpen}
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</Button>
					</div>
				</div>
			</nav>

			{/* Mobile Navigation Menu with Framer Motion Animation */}
			<motion.div
				initial={{ opacity: 0, scaleY: 0.8, y: -20 }}
				animate={{
					opacity: isMenuOpen ? 1 : 0,
					scaleY: [!isMenuOpen ? 1 : 0.8,isMenuOpen ? 1 : 0.8,isMenuOpen ? 1 : 0.8,,isMenuOpen ? 1 : 0],
					y: isMenuOpen ? 0 : -20,
				}}
				
				exit={{ opacity: 0, scaleY: 0.8, y: -20 }}
				transition={{
					duration: 0.5,
					ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a smooth bounce effect
				}}
				
				style={{ transformOrigin: "top" }}
				className="z-50 md:hidden bg-background dark:bg-background border-t border-gray-200 dark:border-gray-700 overflow-hidden"
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
					{!!data?.session ? (
            <div className="flex flex-col space-y-2">
                <Link href="/dashboard" onClick={handleLinkClick}>
                    <Button variant="outline" className="w-full">
                        <UserRound className="mr-2" /> {t("navigation.dashboard")}
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={logOutHandler}
                >
                    <LogOut className="mr-2" /> {t("navigation.logout")}
                </Button>
            </div>
        ) : (
            <li>
                <Link
                    href="/sign-up"
                    onClick={handleLinkClick}
                    className="block bg-primary text-primary-foreground px-4 py-2 rounded-md text-center hover:bg-primary/90 transition"
                >
                    {t("navigation.signup")}
                </Link>
            </li>
        )}
				</ul>
			</motion.div>
		</div>
	);
}

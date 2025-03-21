"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { LanguageToggle } from "./language-toggle";
import { Badge } from "./ui/badge";
import React from "react";

export default function BottomNavigation() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<footer className="fixed bottom-0 left-0 w-full bg-background/50 ">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				{/* Home Link */}
				<div className="relative text-xl font-bold text-primary ">
					<Link href="/">InviteApp</Link>
					<Badge
						variant="destructive"
						className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-muted text-destructive dark:text-accent px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm"
					>
						βeta
					</Badge>
				</div>

				<div className="flex gap-4">
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
					<LanguageToggle theme={theme === "light" ? "outline" : "secondary"} />
				</div>
			</div>
		</footer>
	);
}

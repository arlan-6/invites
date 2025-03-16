"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunMoon, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TextScramble } from "./motion-primitives/text-scramble";

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTrigger, setIsTrigger] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Ensure the component is mounted before rendering (to avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close mobile menu on link click
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-background shadow-md dark:shadow-none">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Beta Badge */}
        <div className="relative text-2xl font-bold text-blue-500 dark:text-blue-300">
          <Link href="/">InviteApp </Link>
          <Badge
            variant={"destructive"}
            className="absolute cursor-default bg-gray-300 transition delay-300"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mx-1">
              <TextScramble
                as="span"
                speed={0.01}
                trigger={isTrigger}
                onHoverStart={() => setIsTrigger(true)}
                onScrambleComplete={() => setIsTrigger(false)}
                initial="β"
              >
                βeta test
              </TextScramble>
            </span>
          </Badge>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6">
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

        {/* Desktop Theme Toggle and Sign Up Button */}
        <div className="hidden md:flex items-center space-x-4 text-lg">
          <Button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle Theme"
          >
            <SunMoon size={16} />
          </Button>
          <Link
            href="/signup"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Header: Hamburger Menu Toggle and Dark Mode Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle Theme"
            className="p-2"
          >
            <SunMoon size={16} />
          </Button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300 focus:outline-none p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-background border-t border-gray-200 dark:border-gray-700">
          <ul className="px-4 pt-2 pb-4 space-y-2">
            <li>
              <Link
                href="/"
                onClick={handleLinkClick}
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={handleLinkClick}
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/templates"
                onClick={handleLinkClick}
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Templates
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={handleLinkClick}
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                onClick={handleLinkClick}
                className="block bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

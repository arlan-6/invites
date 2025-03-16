"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
	const [currentLanguage, setCurrentLanguage] = useState<"en" | "kk" | "ru">(
		"en",
	);

	const content = {
		en: {
			heading: "Create Beautiful Digital Invitations",
			subheading:
				"Design, share, and manage digital invitations for all your special occasions with our easy-to-use platform.",
			cta: "Get Started",
			secondary: "View Templates",
		},
		kk: {
			heading: "Әдемі Цифрлық Шақыруларды Жасаңыз",
			subheading:
				"Біздің қолдануға оңай платформамызбен барлық ерекше оқиғаларыңыз үшін цифрлық шақыруларды жасаңыз, бөлісіңіз және басқарыңыз.",
			cta: "Бастау",
			secondary: "Үлгілерді Қарау",
		},
		ru: {
			heading: "Создавайте Красивые Цифровые Приглашения",
			subheading:
				"Создавайте, делитесь и управляйте цифровыми приглашениями для всех ваших особых случаев с помощью нашей простой в использовании платформы.",
			cta: "Начать",
			secondary: "Просмотр Шаблонов",
		},
	};

	return (
		<section className="w-full py-8 md:py-8 lg:py-12 xl:py-16 relative overflow-hidden  flex flex-col justify-center">
			<div className="container px-4 md:px-6 md:ml-6 relative z-10">
				<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<motion.h1
								className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-black dark:text-white"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								{content[currentLanguage].heading}
							</motion.h1>
							<motion.p
								className="max-w-[600px] text-gray-700 dark:text-gray-300 md:text-xl"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 }}
							>
								{content[currentLanguage].subheading}
							</motion.p>
						</div>
						<motion.div
							className="flex flex-col gap-2 min-[400px]:flex-row"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<Link href="/signup">
								<button className="bg-blue-500 hover:bg-blue-700 text-white text-lg px-4 py-2 rounded flex items-center">
									{content[currentLanguage].cta}
									<ArrowRight className="ml-2 h-4 w-4" />
								</button>
							</Link>
							<Link href="/templates">
								<button className="border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-blue-300 dark:border-blue-700 text-lg px-4 py-2 rounded">
									{content[currentLanguage].secondary}
								</button>
							</Link>
						</motion.div>
						<motion.div
							className="flex gap-4 mt-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<button
								onClick={() => setCurrentLanguage("en")}
								className={`text-sm ${
									currentLanguage === "en"
										? "text-blue-500 font-bold dark:text-blue-300"
										: "text-gray-600 dark:text-gray-400"
								}`}
								aria-pressed={currentLanguage === "en"}
							>
								English
							</button>
							<button
								onClick={() => setCurrentLanguage("kk")}
								className={`text-sm ${
									currentLanguage === "kk"
										? "text-blue-500 font-bold dark:text-blue-300"
										: "text-gray-600 dark:text-gray-400"
								}`}
								aria-pressed={currentLanguage === "kk"}
							>
								Қазақша
							</button>
							<button
								onClick={() => setCurrentLanguage("ru")}
								className={`text-sm ${
									currentLanguage === "ru"
										? "text-blue-500 font-bold dark:text-blue-300"
										: "text-gray-600 dark:text-gray-400"
								}`}
								aria-pressed={currentLanguage === "ru"}
							>
								Русский
							</button>
						</motion.div>
					</div>
					<motion.div
						className="flex items-center justify-center"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<div className="relative h-[450px] w-full overflow-hidden rounded-xl border bg-background p-2">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900">
								<div className="absolute inset-0 bg-[url('/placeholder.svg?height=450&width=400')] bg-center bg-no-repeat opacity-30"></div>
							</div>
							<div className="relative z-10 h-full w-full overflow-hidden rounded-lg border bg-background shadow-xl">
								<div className="flex h-12 items-center border-b px-4">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 rounded-full bg-red-500"></div>
										<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
										<div className="h-3 w-3 rounded-full bg-green-500"></div>
									</div>
								</div>
								<div className="p-6">
									<div className="space-y-4">
										<div className="h-8 w-3/4 rounded-md bg-blue-500/70"></div>
										<div className="h-8 w-1/2 rounded-md bg-blue-500/70"></div>
										<div className="h-40 rounded-md bg-gradient-to-r from-blue-500 to-purple-500"></div>
										<div className="flex gap-2">
											<div className="h-10 w-1/2 rounded-md bg-blue-500"></div>
											<div className="h-10 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700"></div>
										</div>
										<div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
										<div className="h-4 w-4/5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
										<div className="h-4 w-2/3 rounded-md bg-gray-200 dark:bg-gray-700"></div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

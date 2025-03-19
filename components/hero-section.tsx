"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const currentLanguage = "en";
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
    <section className="w-full py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden bg-background dark:bg-background">
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] lg:gap-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <motion.h1
                className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-foreground dark:text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {content[currentLanguage].heading}
              </motion.h1>
              <motion.p
                className="max-w-2xl text-lg text-muted-foreground dark:text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {content[currentLanguage].subheading}
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/signup">
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-6 py-3 flex items-center"
                >
                  {content[currentLanguage].cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button
                  variant="outline"
                  className="border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 text-lg px-6 py-3"
                >
                  {content[currentLanguage].secondary}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Content */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-card shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900"></div>
              <div className="relative z-10 h-full w-full overflow-hidden rounded-lg  shadow-2xl">
                <div className="flex h-12 items-center px-4">
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
                    <div className="h-40 rounded-md bg-gradient-to-r from-blue-400 to-purple-400"></div>
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
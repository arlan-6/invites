'use client'
import React from "react";
import { useLanguage } from "../language-provider";

const NotLoggedIn: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-600">
                {t("dashboard.notLoggedIn")}
            </h1>
        </div>
    );
};

export default NotLoggedIn;
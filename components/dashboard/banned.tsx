'use client'

import React from "react";
import { useLanguage } from "../language-provider";


interface BannedProps {
    user: {
        banReason?: string | null;
        banExpires?: Date | null;
    };
}

const Banned: React.FC<BannedProps> = ({ user }) => {
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600">
                    {t("dashboard.accountBanned")}
                </h1>
                <p className="mt-4 text-gray-700">{t("dashboard.banReason")}</p>
                <p className="mt-2 text-gray-900 font-semibold">
                    {user.banReason || t("dashboard.noReasonProvided")}
                </p>
                {user.banExpires && (
                    <p className="mt-2 text-gray-700">
                        {t("dashboard.banExpires")}:{" "}
                        {user.banExpires.toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Banned;
import { auth } from '@/auth';
import { headers } from 'next/headers';
import React from 'react';

const DashboardPage: React.FC = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-600">
                    You are not logged in!
                </h1>
            </div>
        );
    }

    const user = session.user;

    if (user.banned) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600">Account Banned</h1>
                    <p className="mt-4 text-gray-700">
                        Your account has been banned for the following reason:
                    </p>
                    <p className="mt-2 text-gray-900 font-semibold">{user.banReason || "No reason provided"}</p>
                    {user.banExpires && (
                        <p className="mt-2 text-gray-700">
                            Ban expires on: {new Date(user.banExpires).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center space-x-4">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={`${user.name}'s profile`}
                            className="w-16 h-16 rounded-full"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">
                            Role: <span className="font-semibold">{user.role || "User"}</span>
                        </p>
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                    <p className="mt-2 text-gray-600">
                        Here you can manage your account, view your activity, and explore more features.
                    </p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-100 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-blue-800">Account Details</h3>
                        <ul className="mt-2 text-gray-700">
                            <li>
                                <strong>Account Created:</strong>{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </li>
                            <li>
                                <strong>Last Updated:</strong>{" "}
                                {new Date(user.updatedAt).toLocaleDateString()}
                            </li>
                            <li>
                                <strong>Email Verified:</strong>{" "}
                                {user.emailVerified ? "Yes" : "No"}
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-green-800">Quick Actions</h3>
                        <ul className="mt-2 text-gray-700">
                            <li>
                                <a
                                    href="/profile"
                                    className="text-green-600 hover:underline"
                                >
                                    Edit Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/settings"
                                    className="text-green-600 hover:underline"
                                >
                                    Account Settings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/logout"
                                    className="text-red-600 hover:underline"
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
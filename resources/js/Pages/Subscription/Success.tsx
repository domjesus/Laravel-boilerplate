import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Success() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Subscription Successful
                </h2>
            }
        >
            <Head title="Subscription Success" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-8 text-center text-gray-900 dark:text-gray-100">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <svg
                                    className="h-10 w-10 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                Welcome to Your Plan!
                            </h3>

                            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                                Your subscription has been successfully
                                activated. You now have access to all the
                                features of your selected plan.
                            </p>

                            <div className="space-y-4">
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
                                >
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                    Go to Dashboard
                                </Link>

                                <div className="text-center">
                                    <Link
                                        href={route('subscription.plans')}
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    >
                                        Manage your subscription
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-12 rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
                                <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                                    What's Next?
                                </h4>
                                <ul className="space-y-2 text-left text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start">
                                        <svg
                                            className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Explore your dashboard and start
                                        tracking your campaigns
                                    </li>
                                    <li className="flex items-start">
                                        <svg
                                            className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Set up your first ad campaign
                                    </li>
                                    <li className="flex items-start">
                                        <svg
                                            className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Connect your advertising platforms
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
